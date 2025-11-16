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

  const messgae = result.output[lastAIMessageIndex] as TextMessage | undefined;

  if (messgae?.content) {
    return typeof messgae.content === "string"
      ? messgae.content
      : messgae.content.map((c) => c.text).join("");
  }
  return undefined;
};
