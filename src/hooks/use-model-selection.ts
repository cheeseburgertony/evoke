import { useState, useEffect } from "react";
import { aiModels, type AIModelIdType } from "@/lib/ai-models";

const STORAGE_KEY = "ai-model";

/**
 * 用于管理 AI 模型选择的 Hook
 * - 从 localStorage 读取上次选择的模型
 * - 自动保存用户的选择
 * - 提供模型切换功能
 * @returns 包含当前模型 ID 和切换函数的对象
 */
export const useModelSelection = () => {
  const [selectedModelId, setSelectedModelId] = useState<AIModelIdType>(() => {
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem(STORAGE_KEY) as AIModelIdType;
      if (savedModel && aiModels.some((model) => model.id === savedModel)) {
        return savedModel;
      }
    }
    return aiModels[0].id;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, selectedModelId);
    }
  }, [selectedModelId]);

  return {
    selectedModelId,
    setSelectedModelId,
  };
};
