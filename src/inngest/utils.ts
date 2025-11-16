import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

// 获取AI回复的最新的文本内容
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
