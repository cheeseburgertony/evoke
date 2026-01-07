type StepStatus = "pending" | "in-progress" | "completed" | "error";
type StepType = "default" | "thinking" | "command" | "file";

export const PROGRESS_CONTENT_DONE = "done" as const;

export interface ProgressStep {
  id: string;
  label: string;
  status: StepStatus;
  timestamp?: number;
  detail?: string;
  content?: string;
  type?: StepType;
}

export interface ProcessingProgress {
  currentStep: string;
  steps: ProgressStep[];
  estimatedTime?: number;
  progress?: number; // 0-100
}
