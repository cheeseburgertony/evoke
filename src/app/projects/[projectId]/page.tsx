interface IPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const Page = async ({ params }: IPageProps) => {
  const { projectId } = await params;

  return <div>ProjectId: {projectId}</div>;
};

export default Page;
