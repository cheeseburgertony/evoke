import { openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

// 创建一个 Inngest 函数，监听 "test/hello.world" 事件
// 定义函数
export const helloWorld = inngest.createFunction(
  { id: "hello-world" }, // 配置
  { event: "test/hello.world" }, // 监听的事件
  // 处理程序
  async ({ event, step }) => {
    const summarizer = createAgent({
      model: openai({
        model: "deepseek-chat",
        baseUrl: process.env.DEEPSEEK_BASE_URL,
        apiKey: process.env.DEEPSEEK_API_KEY,
      }),
      name: "code-agent",
      system:
        "You are an expert next.js developer. You write readable, maintainable code. You write simple Next.js & React snippets.",
    });

    const { output } = await summarizer.run(
      `Write the following snippet: ${event.data.value}`
    );

    return { output };
  }
);
