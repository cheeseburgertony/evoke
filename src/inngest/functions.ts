import { inngest } from "./client";

// 创建一个 Inngest 函数，监听 "test/hello.world" 事件
// 定义函数
export const helloWorld = inngest.createFunction(
  { id: "hello-world" }, // 配置
  { event: "test/hello.world" }, // 监听的事件
  // 处理程序
  async ({ event, step }) => {
    // 模拟第一个异步操作10s
    await step.sleep("wait-a-moment", "10s");
    // 模拟第二个异步操作5s
    await step.sleep("almost-done", "5s");
    // 返回结果
    return { message: `Hello ${event.data.email}!` };
  }
);
