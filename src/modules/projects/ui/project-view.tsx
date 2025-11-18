"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface IProjectViewProps {
  projectId: string;
}

export const ProjectView = ({ projectId }: IProjectViewProps) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({
      projectId,
    })
  );
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return (
    <div>
      {JSON.stringify(project)}
      {JSON.stringify(messages)}
    </div>
  );
};
