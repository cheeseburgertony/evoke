"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("后台任务触发成功");
      },
    })
  );

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ text: "test-email" })}
      >
        触发后台任务
      </Button>
    </div>
  );
};

export default Page;
