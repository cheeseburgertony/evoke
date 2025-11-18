"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const { data: message } = useQuery(trpc.message.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.message.create.mutationOptions({
      onSuccess: () => {
        toast.success("消息已发送");
      },
    })
  );

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value })}
      >
        触发后台任务
      </Button>
      {JSON.stringify(message)}
    </div>
  );
};

export default Page;
