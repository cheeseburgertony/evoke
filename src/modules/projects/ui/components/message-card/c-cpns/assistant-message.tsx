import Image from "next/image";
import { format } from "date-fns";
import { Fragment, MessageType } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { FragmentCard } from "./fragment-card";

interface IAssistantMessageProps {
  content: string;
  type: MessageType;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

export const AssistantMessage = ({
  content,
  type,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
}: IAssistantMessageProps) => {
  return (
    <div
      className={cn("flex flex-col group px-2 pb-4", {
        "text-red-700 dark:text-red-500": type === "ERROR",
      })}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="evoke"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Evoke</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <span>{content}</span>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};
