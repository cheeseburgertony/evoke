import { sseManager } from "@/lib/sse-manager";
import { type ProgressStep } from "@/types/progress";

/**
 * 生成进度管理器
 */
export class ProgressManager {
  /** 当前步骤列表 */
  private steps: ProgressStep[] = [];
  /** 关联的项目ID */
  private projectId: string;

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  /**  添加新的进度步骤 */
  addStep(
    label: string,
    options?: {
      detail?: string;
      content?: string;
      type?: ProgressStep["type"];
    }
  ) {
    // 完成之前所有的进行中步骤，过滤掉空的“思考”步骤以防止闪烁
    this.steps = this.steps.filter((s) => {
      if (s.status === "in-progress") {
        if (s.type === "thinking" && !s.content) {
          // 移除空的“思考”步骤
          return false;
        }
        s.status = "completed";
      }
      return true;
    });

    // 创建新步骤
    const newStep: ProgressStep = {
      id: Math.random().toString(36).substring(7),
      label,
      status: "in-progress",
      timestamp: Date.now(),
      detail: options?.detail,
      content: options?.content,
      type: options?.type || "default",
    };

    // 加入步骤列表
    this.steps.push(newStep);
    this.emit();
    return newStep.id;
  }

  /** 更新步骤 */
  updateStep(
    id: string,
    updates: Partial<Omit<ProgressStep, "id" | "timestamp">>
  ) {
    const step = this.steps.find((s) => s.id === id);
    if (step) {
      Object.assign(step, updates);
      this.emit();
    }
  }

  /**  更新当前进行中的步骤 */
  updateCurrentStep(updates: Partial<Omit<ProgressStep, "id" | "timestamp">>) {
    const currentStep = this.steps.find((s) => s.status === "in-progress");
    if (currentStep) {
      Object.assign(currentStep, updates);
      this.emit();
    }
  }

  /** 追加内容到当前进行中的步骤 */
  appendContent(content: string) {
    const currentStep = this.steps.find((s) => s.status === "in-progress");
    if (currentStep) {
      currentStep.content = (currentStep.content || "") + content;
      this.emit();
    }
  }

  /** 完成步骤 */
  completeStep(id: string, result?: { detail?: string; content?: string }) {
    this.updateStep(id, {
      status: "completed",
      ...result,
    });
  }

  /** 标记步骤为失败 */
  failStep(id: string, error?: string) {
    this.updateStep(id, {
      status: "error",
      detail: error,
    });
  }

  /** 触发进度更新事件 */
  private emit() {
    sseManager.sendEvent(this.projectId, {
      type: "progress_update",
      progress: {
        currentStep:
          this.steps.find((s) => s.status === "in-progress")?.id || "",
        steps: this.steps,
      },
    });
  }
}
