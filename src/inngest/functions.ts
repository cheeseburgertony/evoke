import { openai, createAgent, createTool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { getSandbox } from "./utils";
import z, { file } from "zod";
import { PROMPT } from "@/prompt";

// 创建一个 Inngest 函数，监听 "test/hello.world" 事件
// 定义函数
export const helloWorld = inngest.createFunction(
  { id: "hello-world" }, // 配置
  { event: "test/hello.world" }, // 监听的事件
  // 处理程序
  async ({ event, step }) => {
    // 获取沙盒id
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("evoke-nextjs-test-1");
      return sandbox.sandboxId;
    });

    // codeAgent生成代码
    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({
        model: "deepseek-chat",
        baseUrl: process.env.DEEPSEEK_BASE_URL,
        apiKey: process.env.DEEPSEEK_API_KEY,
        defaultParameters: {
          temperature: 0.1,
        },
      }),
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
          handler: async ({ files }, { step, network }) => {
            // 在沙盒中创建或更新文件
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  // 获取当前文件状态
                  const updatedFiles = (await network.state.data.files) || {};
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
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`
    );

    // 获取沙盒url
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    return { output, sandboxUrl };
  }
);
