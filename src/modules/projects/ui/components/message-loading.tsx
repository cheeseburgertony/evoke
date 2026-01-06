import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ProcessingStatus } from "./processing-status";
import type { ProcessingProgress } from "@/types/progress";

// 循环显示加载消息
const ShimmerMessages = () => {
  const t = useTranslations("MessageLoading");
  const messages = [
    t("thinking"),
    t("loading"),
    t("generating"),
    t("analyzing"),
    t("building"),
    t("making"),
    t("optimizing"),
    t("adding"),
    t("almostDone"),
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

export const MessageLoading = ({
  progress,
}: {
  progress?: ProcessingProgress | null;
}) => {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Evoke"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Evoke</span>
      </div>
      <div className="ml-8">
        {progress && progress.steps.length > 0 ? (
          <ProcessingStatus steps={progress.steps} />
        ) : (
          <ShimmerMessages />
        )}
      </div>
    </div>
  );
};
