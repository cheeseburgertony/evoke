export type AIModelIdType =
  | "LongCat-Flash-Chat"
  | "deepseek-chat"
  | "gemini-2.5-pro"
  | "gpt-4.1"
  | "zai-org/GLM-4.6"
  | "Pro/zai-org/GLM-5"
  | "Pro/zai-org/GLM-4.7"
  | "Qwen/Qwen3.5-397B-A17B"
  | "Qwen/Qwen3-235B-A22B-Instruct-2507";

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
    | "silicon";
}

export const aiModels: ModelConfig[] = [
  {
    id: "zai-org/GLM-4.6",
    name: "GLM 4.6",
    description: "智谱 GLM-4.6",
    icon: "/zhipu.svg",
    provider: "silicon",
  },
  {
    id: "Pro/zai-org/GLM-4.7",
    name: "GLM 4.7",
    description: "智谱 AI 大模型",
    icon: "/zhipu.svg",
    provider: "silicon",
  },
  {
    id: "Qwen/Qwen3-235B-A22B-Instruct-2507",
    name: "Qwen 3",
    description: "Qwen 3 系列最大模型",
    icon: "/tongyi.svg",
    provider: "silicon",
  },
  {
    id: "Pro/zai-org/GLM-5",
    name: "GLM 5",
    description: "智谱 AI 大模型",
    icon: "/zhipu.svg",
    provider: "silicon",
    pro: true,
  },
  {
    id: "Qwen/Qwen3.5-397B-A17B",
    name: "Qwen 3.5",
    description: "Qwen AI 大模型",
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
