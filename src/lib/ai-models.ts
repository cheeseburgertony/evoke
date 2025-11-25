export type AIModelIdType =
  | "Qwen/Qwen3-Coder-480B-A35B-Instruct"
  | "x-ai/grok-4.1-fast:free"
  | "LongCat-Flash-Chat"
  | "deepseek-chat"
  | "gemini-2.5-pro"
  | "gpt-4.1"
  | "deepseek-ai/DeepSeek-V3.1"
  | "qwen3-max";

export interface ModelConfig {
  id: AIModelIdType;
  name: string;
  description: string;
  icon: string;
  pro?: boolean;
  provider:
    | "openai"
    | "deepseek"
    | "gemini"
    | "qwen"
    | "longcat"
    | "open-router"
    | "modelscope";
}

export const aiModels: ModelConfig[] = [
  {
    id: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
    name: "Qwen 3 Coder",
    description: "适合编程任务的强大模型",
    icon: "💻",
    provider: "modelscope",
  },
  {
    id: "x-ai/grok-4.1-fast:free",
    name: "Grok 4.1 Fast",
    description: "X.ai 最新模型，响应迅速",
    icon: "🚀",
    provider: "open-router",
  },

  {
    id: "LongCat-Flash-Chat",
    name: "LongCat Flash Chat",
    description: "美团大模型",
    icon: "🐱",
    provider: "longcat",
  },
  // {
  //   id: "gpt-4.1",
  //   name: "GPT-4.1",
  //   description: "OpenAI 最强模型",
  //   icon: "🤖",
  //   provider: "openai",
  //   pro: true,
  // },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    description: "性价比最高，速度快",
    icon: "🐋",
    provider: "deepseek",
    pro: true,
  },
  {
    id:"qwen3-max",
    name: "Qwen 3 Max",
    description: "Qwen 3 系列最大模型",
    icon: "🦾",
    provider: "qwen",
    pro: true,
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Google 最强推理模型",
    icon: "🧠",
    provider: "gemini",
    pro: true,
  },
];
