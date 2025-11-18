"use client";

import { useRef, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";

interface IMessagesContainerProps {
  projectId: string;
}

export const MessagesContainer = ({ projectId }: IMessagesContainerProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  useEffect(() => {
    const lastAIMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );
    if (lastAIMessage) {
      // TODO 触发fragment
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

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
              isActiveFragment={false}
              onFragmentClick={() => {}}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
