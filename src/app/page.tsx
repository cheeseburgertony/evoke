import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Client from "./client";

const Page = async () => {
  // 在服务器端预取数据，直接调用api获取，不需要通过HTTP请求
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.createAI.queryOptions({ text: "Tony Prefetch" })
  );

  return (
    // 使用 HydrationBoundary 将预取的数据注入到客户端缓存
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
