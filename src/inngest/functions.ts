import { openai, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { getSandbox } from "./utils";

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
      model: openai({
        model: "deepseek-chat",
        baseUrl: process.env.DEEPSEEK_BASE_URL,
        apiKey: process.env.DEEPSEEK_API_KEY,
      }),
      name: "code-agent",
      system:
        "You are an expert next.js developer. You write readable, maintainable code. You write simple Next.js & React snippets.",
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
