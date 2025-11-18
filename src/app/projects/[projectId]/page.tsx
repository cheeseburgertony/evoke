import { getQueryClient, trpc } from "@/trpc/server";

interface IPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const Page = async ({ params }: IPageProps) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({
      projectId,
    })
  );
  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return <div>ProjectId: {projectId}</div>;
};

export default Page;
