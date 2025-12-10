import {
  createAgent,
  createTool,
  createNetwork,
  Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { inngest } from "./client";
import {
  createModelInstance,
  getSandbox,
  lastAIMessageTextContent,
  parseAgentOutput,
} from "./utils";
import prisma from "@/lib/prisma";
import { sseManager } from "@/lib/sse-manager";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

// 创建一个 Inngest 函数，监听 code-agent/run 事件
export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent-function" }, // 配置
  { event: "code-agent/run" }, // 监听的事件
  // 处理程序
  async ({ event, step }) => {
    const projectId = event.data.projectId;

    // 获取沙盒id
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("evoke-nextjs-test-1");
      return sandbox.sandboxId;
    });

    // 获取之前记录
    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];

        const messages = await prisma.message.findMany({
          where: { projectId },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      { messages: previousMessages }
    );

    // codeAgent生成代码
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: createModelInstance(event.data.modelId || "deepseek-chat"),
      tools: [
        // 终端工具，允许在沙盒中运行命令
        createTool({
          name: "terminal",
          description: "use terminal to run commands in the sandbox",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                );
                return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),

        // 文件工具，允许在沙盒中创建或更新文件
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            // 在沙盒中创建或更新文件
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  // 获取当前文件状态
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    // 遍历文件，写入/更新内容
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (e) {
                  return `Error: ${e}`;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        // 读取文件工具，允许从沙盒中读取文件
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            filePaths: z.array(z.string()),
          }),
          handler: async ({ filePaths }, { step }) => {
            // 读取文件内容并返回给ai进行处理
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];

                for (const path of filePaths) {
                  const content = await sandbox.files.read(path);
                  contents.push({ path, content });
                }

                return JSON.stringify(contents);
              } catch (e) {
                return `Error: ${e}`;
              }
            });
          },
        }),
      ],

      lifecycle: {
        // 每次工具调用后触发
        onResponse: async ({ result, network }) => {
          const lastAIMessageText = lastAIMessageTextContent(result);
          // 如果AI回复中包含<task_summary>，表示任务结束，则将其保存到network状态中
          if (lastAIMessageText && network) {
            if (lastAIMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAIMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      // 最大迭代次数，防止无限循环
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        // 如果任务已有summary，表示结束，停止调用agent
        if (summary) {
          return;
        }

        // 如果没有summary，继续调用agent
        return codeAgent;
      },
    });

    // 让网络自动调用agent完成任务
    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent<AgentState>({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: createModelInstance("LongCat-Flash-Chat"),
    });

    const responseGenerator = createAgent<AgentState>({
      name: "response-generator",
      description: "A response title generator",
      system: RESPONSE_PROMPT,
      model: createModelInstance("LongCat-Flash-Chat"),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary
    );

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    // 获取沙盒url
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    // 将数据保存到数据库中
    await step.run("save-result", async () => {
      if (isError) {
        const message = await prisma.message.create({
          data: {
            projectId,
            content: "出现了一些错误，请再试一次。",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });

        // 发送SSE事件通知前端
        sseManager.sendEvent(projectId, {
          type: "message_created",
          message,
        });

        return message;
      }

      const message = await prisma.message.create({
        data: {
          projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              files: result.state.data.files,
            },
          },
        },
      });

      // 发送SSE事件通知前端
      sseManager.sendEvent(projectId, {
        type: "message_created",
        message,
      });

      return message;
    });

    return {
      url: sandboxUrl,
      title: parseAgentOutput(fragmentTitleOutput),
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
