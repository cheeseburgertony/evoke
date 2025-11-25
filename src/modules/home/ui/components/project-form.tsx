"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useClerk } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutoSize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PROJECT_TEMPLATES } from "../../constants";
import { useModelSelection } from "@/hooks/use-model-selection";

const ModelSelector = dynamic(
  () => import("@/components/model-selector"),
  { ssr: false }
);

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(1000, { message: "Value is too long" }),
});

export const ProjectForm = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { selectedModelId, setSelectedModelId } = useModelSelection();
  const router = useRouter();
  const clerk = useClerk();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        // 标记数据为过期，触发重新获取
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
        if (error.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
        }
      },
    })
  );

  const isPending = createProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
      modelId: selectedModelId,
    });
  };

  const onSelectTemplate = (templateValue: string) => {
    form.setValue("value", templateValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <Form {...form}>
      <section className="space-y-6">
        <form
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            { "shadow-xs": isFocused }
          )}
          // 通过form.handleSubmit包装onSubmit返回一个新函数并自动在其中做校验
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <TextareaAutoSize
                {...field}
                disabled={isPending}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                placeholder="给 Evoke 发送消息，创建一个......的项目吧"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;/Ctrl&nbsp;</span>Enter
              </kbd>
              &nbsp;发送
            </div>
            <div className="flex justify-between items-center gap-x-4">
              <ModelSelector
                className="size-8 rounded-full"
                value={selectedModelId}
                onChange={setSelectedModelId}
              />
              <Button
                className={cn("size-8 rounded-full", {
                  "bg-muted-foreground border": isButtonDisabled,
                })}
                disabled={isButtonDisabled}
              >
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <ArrowUpIcon />
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* 快速创建项目区域 */}
        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              size="sm"
              className="bg-white dark:bg-sidebar"
              onClick={() => onSelectTemplate(template.prompt)}
            >
              {template.emoji} {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
};
