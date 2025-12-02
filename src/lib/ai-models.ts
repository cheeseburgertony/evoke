export type AIModelIdType =
  | "Qwen/Qwen3-Coder-480B-A35B-Instruct"
  | "LongCat-Flash-Chat"
  | "deepseek-chat"
  | "gemini-2.5-pro"
  | "gpt-4.1"
  | "qwen3-max"
  | "qwen3-coder-plus"
  | "zai-org/GLM-4.6"
  | "glm-4.6";

export interface ModelConfig {
  id: AIModelIdType;
  name: string;
  description: string;
  icon: string;
  pro?: boolean;
  hidden?: boolean;
  provider:
    | "openai"
    | "deepseek"
    | "gemini"
    | "longcat"
    | "modelscope"
    | "silicon"
    | "iflow";
}

export const aiModels: ModelConfig[] = [
  {
    id: "glm-4.6",
    name: "GLM 4.6 Exp",
    description: "智谱 AI 大模型",
    icon: "/zhipu.svg",
    provider: "iflow",
  },
  {
    id: "qwen3-coder-plus",
    name: "Qwen 3 Coder Plus",
    description: "专为编程任务优化的强大模型",
    icon: "/tongyi.svg",
    provider: "iflow",
  },
  {
    id: "qwen3-max",
    name: "Qwen 3 Max",
    description: "Qwen 3 系列最大模型",
    icon: "/tongyi.svg",
    provider: "iflow",
  },
  {
    id: "zai-org/GLM-4.6",
    name: "GLM 4.6",
    description: "智谱 AI 大模型",
    icon: "/zhipu.svg",
    provider: "silicon",
    pro: true,
  },
  {
    id: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
    name: "Qwen 3 Coder",
    description: "适合编程任务的强大模型",
    icon: "/tongyi.svg",
    provider: "silicon",
    pro: true,
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    description: "性价比最高，速度快",
    icon: "/deepseek.svg",
    provider: "deepseek",
    pro: true,
  },
  // {
  //   id: "gemini-2.5-pro",
  //   name: "Gemini 2.5 Pro",
  //   description: "Google 最强推理模型",
  //   icon: "/gemini.svg",
  //   provider: "gemini",
  //   pro: true,
  // },
  // {
  //   id: "gpt-4.1",
  //   name: "GPT-4.1",
  //   description: "OpenAI 最强模型",
  //   icon: "/openai.svg",
  //   provider: "openai",
  //   pro: true,
  // },
  {
    id: "LongCat-Flash-Chat",
    name: "LongCat Flash Chat",
    description: "美团大模型",
    icon: "/longcat.svg",
    provider: "longcat",
    hidden: true,
  },
];
