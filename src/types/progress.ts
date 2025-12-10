export interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "in-progress" | "completed" | "error";
  timestamp?: number;
  detail?: string;
}

export interface ProcessingProgress {
  currentStep: string;
  steps: ProgressStep[];
  estimatedTime?: number;
  progress?: number; // 0-100
}
