import { Sandbox } from "@e2b/code-interpreter";
import {
  gemini,
  openai,
  type AgentResult,
  type Message,
  type TextMessage,
} from "@inngest/agent-kit";
import { SANDBOX_TIMEOUT } from "./constants";
import { aiModels, type AIModelIdType } from "@/lib/ai-models";

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  await sandbox.setTimeout(SANDBOX_TIMEOUT);
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
    return output.content.map((c) => c.text).join("");
  }

  return output.content;
};

/**
 * 创建模型实例
 * @param modelId 模型ID
 * @param temperature 温度参数
 * @returns 模型实例
 */
export const createModelInstance = (
  modelId: AIModelIdType,
  temperature = 0.1
) => {
  const model = aiModels.find((model) => model.id === modelId);

  switch (model?.provider) {
    case "open-router":
      return openai({
        model: model.id,
        baseUrl: process.env.OPEN_ROUTER_BASE_URL,
        apiKey: process.env.OPEN_ROUTER_API_KEY,
        defaultParameters: { temperature },
      });

    case "modelscope":
      return openai({
        model: model.id,
        baseUrl: process.env.MODELSCOPE_BASE_URL,
        apiKey: process.env.MODELSCOPE_API_KEY,
        defaultParameters: { temperature },
      });

    case "longcat":
      return openai({
        model: model.id,
        baseUrl: process.env.LONG_CAT_BASE_URL,
        apiKey: process.env.LONG_CAT_API_KEY,
        defaultParameters: { temperature },
      });

    case "deepseek":
      return openai({
        model: model.id,
        baseUrl: process.env.DEEPSEEK_BASE_URL,
        apiKey: process.env.DEEPSEEK_API_KEY,
        defaultParameters: { temperature },
      });

    case "qwen":
      return openai({
        model: model.id,
        baseUrl: process.env.QWEN_BASE_URL,
        apiKey: process.env.QWEN_API_KEY,
        defaultParameters: { temperature },
      });

    case "silicon":
      return openai({
        model: model.id,
        baseUrl: process.env.SILICON_BASE_URL,
        apiKey: process.env.SILICON_API_KEY,
        defaultParameters: { temperature },
      });

    case "gemini":
      return gemini({
        model: model.id,
        defaultParameters: {
          generationConfig: { temperature },
        },
      });

    default:
      return openai({
        model: "deepseek-chat",
        baseUrl: process.env.DEEPSEEK_BASE_URL,
        apiKey: process.env.DEEPSEEK_API_KEY,
        defaultParameters: { temperature },
      });
  }
};
