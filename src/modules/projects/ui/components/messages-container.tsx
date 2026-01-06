"use client";

import { useRef, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { Fragment } from "@/generated/prisma/client";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { MessageLoading } from "./message-loading";
import type { ProcessingProgress } from "@/types/progress";

interface IMessagesContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
  progress: ProcessingProgress | null;
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
  progress,
}: IMessagesContainerProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAIMessageIdRef = useRef<string | null>(null);

  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  const lastMessage = messages[messages.length - 1];
  const isUserLastMessage = lastMessage?.role === "USER";

  useEffect(() => {
    const lastAIMessageWithFragment = messages.findLast(
      (message) => message.role === "ASSISTANT" && !!message.fragment
    );
    if (
      lastAIMessageWithFragment &&
      lastAIMessageWithFragment.id !== lastAIMessageIdRef.current
    ) {
      setActiveFragment(lastAIMessageWithFragment.fragment);
      lastAIMessageIdRef.current = lastAIMessageWithFragment.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, progress]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-1 pr-2">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              type={message.type}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={message.fragment?.id === activeFragment?.id}
              onFragmentClick={() => setActiveFragment(message.fragment)}
            />
          ))}
          {isUserLastMessage && <MessageLoading progress={progress} />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
