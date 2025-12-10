"use client";

import { useRef, useEffect } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { Fragment } from "@/generated/prisma/client";
import { useSSE } from "@/hooks/use-sse";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { MessageLoading } from "./message-loading";

interface IMessagesContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: IMessagesContainerProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAIMessageIdRef = useRef<string | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  // 使用SSE实时更新消息
  useSSE(projectId, {
    onMessage: (data) => {
      if (data.type === "message_created") {
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        );
      }
    },
  });

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
              isActiveFragment={message.fragment?.id === activeFragment?.id}
              onFragmentClick={() => setActiveFragment(message.fragment)}
            />
          ))}
          {isUserLastMessage && <MessageLoading />}
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
