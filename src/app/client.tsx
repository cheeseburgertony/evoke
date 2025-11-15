"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

function Client() {
  const trpc = useTRPC();
  // 在客户端使用预取的数据，直接存缓存中取到，不用发起新的请求
  const { data } = useSuspenseQuery(
    trpc.createAI.queryOptions({ text: "Tony Prefetch" })
  );

  return <div>{JSON.stringify(data)}</div>;
}
export default Client;
