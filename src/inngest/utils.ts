import { Sandbox } from "@e2b/code-interpreter";
import type { AgentResult, Message, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

/**
 * 获取AI回复的最新的文本内容
 * @param result 智能体的执行结果
 * @returns 最新的文本内容，若无则返回undefined
 */
export const lastAIMessageTextContent = (result: AgentResult) => {
  const lastAIMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastAIMessageIndex] as TextMessage | undefined;

  if (message?.content) {
    return typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("");
  }
  return undefined;
};

/**
 * 解析智能体输出，提取文本内容
 * @param outputMessages 智能体输出的消息数组
 * @returns 提取的文本内容
 */
export const parseAgentOutput = (outputMessages: Message[]) => {
  const output = outputMessages[0];

  if (output.type !== "text") {
    return "Fragment";
  }

  if (Array.isArray(output.content)) {
    return output.content.map((txt) => txt).join("");
  }

  return output.content;
};
