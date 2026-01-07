"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  CircleIcon,
  Loader2Icon,
  XCircleIcon,
  TerminalSquareIcon,
  FileCodeIcon,
  BrainCircuitIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PROGRESS_CONTENT_DONE, type ProgressStep } from "@/types/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface IProcessingStatusProps {
  steps: ProgressStep[];
}

export const ProcessingStatus = ({ steps }: IProcessingStatusProps) => {
  // 展示最近的5个步骤
  const visibleSteps = steps.slice(-5);

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-2">
      {visibleSteps.map((step) => (
        <StatusItem key={step.id} step={step} />
      ))}
    </div>
  );
};

// 单个状态项
const StatusItem = ({ step }: { step: ProgressStep }) => {
  const t = useTranslations("ProcessingStatus");
  const [isOpen, setIsOpen] = useState(false);
  const isThinking = step.type === "thinking";
  const hasContent = !!step.content;

  const translateKey = (key?: string) => {
    if (!key) return null;
    return t.has(key) ? t(key) : key;
  };

  const getIcon = () => {
    switch (step.status) {
      case "in-progress":
        return (
          <Loader2Icon className="h-4.5 w-4.5 animate-spin text-blue-500" />
        );
      case "completed":
        return <CheckCircle2Icon className="h-4.5 w-4.5 text-green-500" />;
      case "error":
        return <XCircleIcon className="h-4.5 w-4.5 text-red-500" />;
      default:
        return <CircleIcon className="h-4.5 w-4.5 text-muted-foreground" />;
    }
  };

  const getStepIcon = () => {
    switch (step.type) {
      case "thinking":
        return <BrainCircuitIcon className="h-4 w-4 mr-1.5" />;
      case "command":
        return <TerminalSquareIcon className="h-4 w-4 mr-1.5" />;
      case "file":
        return <FileCodeIcon className="h-4 w-4 mr-1.5" />;
      default:
        return null;
    }
  };

  const previewText =
    isThinking && step.content
      ? step.content.slice(-30).replace(/\n/g, " ")
      : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-3 rounded-lg border bg-card/50 text-card-foreground transition-all",
        step.status === "in-progress" && "border-blue-500/30 bg-blue-50/10"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium flex items-center shrink-0">
              <span className="shrink-0">{getStepIcon()}</span>
              {translateKey(step.label)}
            </span>
            {step.detail && (
              <span className="text-xs text-muted-foreground truncate font-mono bg-muted/50 px-1.5 py-0.5 rounded max-w-[200px]">
                {translateKey(step.detail)}
              </span>
            )}
            {previewText && !isOpen && (
              <span className="text-xs text-muted-foreground truncate opacity-70 animate-pulse">
                ...{previewText}
              </span>
            )}
          </div>

          {hasContent && (
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="mt-2"
            >
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {isOpen ? (
                    <ChevronDownIcon className="h-3 w-3" />
                  ) : (
                    <ChevronRightIcon className="h-3 w-3" />
                  )}
                  {isThinking ? t("viewThoughtProcess") : t("viewOutput")}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 text-xs bg-muted/30 p-2 rounded-md font-mono overflow-x-auto whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                  {step.content === PROGRESS_CONTENT_DONE
                    ? translateKey("done")
                    : step.content}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  );
};
