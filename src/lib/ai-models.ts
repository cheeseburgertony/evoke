export type AIModelIdType =
  | "deepseek-v4-pro"
  | "deepseek-v4-flash"
  | "deepseek-ai/DeepSeek-V3.2";

export interface ModelConfig {
  id: AIModelIdType;
  name: string;
  description: string;
  icon: string;
  pro?: boolean;
  hidden?: boolean;
  provider: "openai" | "deepseek" | "gemini" | "longcat" | "silicon";
}

export const aiModels: ModelConfig[] = [
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    description: "DeepSeek V4-Flash 轻量快速",
    icon: "/deepseek.svg",
    provider: "deepseek",
  },
  {
    id: "deepseek-ai/DeepSeek-V3.2",
    name: "DeepSeek V3.2",
    description: "适合标题生成",
    icon: "/deepseek.svg",
    provider: "silicon",
    hidden: true,
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    description: "DeepSeek V4-Pro 旗舰模型",
    icon: "/deepseek.svg",
    provider: "deepseek",
    pro: true,
  },
];
