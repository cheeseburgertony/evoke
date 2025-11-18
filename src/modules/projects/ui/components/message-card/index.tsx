"use client";

import { MessageRole, MessageType, Fragment } from "@/generated/prisma/client";
import { UserMessage } from "./c-cpns/user-message";
import { AssistantMessage } from "./c-cpns/assistant-message";

interface IMessageCardProps {
  content: string;
  role: MessageRole;
  type: MessageType;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

export const MessageCard = ({
  content,
  role,
  type,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
}: IMessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        type={type}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
      />
    );
  }

  return <UserMessage content={content} />;
};
