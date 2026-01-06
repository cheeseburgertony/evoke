"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { useSSE } from "@/hooks/use-sse";
import { useTRPC } from "@/trpc/client";
import type { Fragment } from "@/generated/prisma/client";
import type { ProcessingProgress } from "@/types/progress";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MessagesContainerSkeleton,
  ProjectHeaderSkeleton,
} from "@/components/skeleton";
import { UserControl } from "@/components/user-control";
import { FileExplorer } from "@/components/file-explorer";
import { ErrorBoundary } from "@/components/error-boundary";
import { MessagesContainer } from "../components/messages-container";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { PreviewLoading } from "../components/preview-loading";

interface IProjectViewProps {
  projectId: string;
}

export const ProjectView = ({ projectId }: IProjectViewProps) => {
  const t = useTranslations("ProjectsViewsProjectView");

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);

  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // 监听进度更新
  useSSE(projectId, {
    onMessage: (data) => {
      if (data.type === "project_name_updated") {
        // 更新项目名字
        queryClient.invalidateQueries(
          trpc.projects.getOne.queryOptions({ id: projectId })
        );
      } else if (data.type === "message_created") {
        // 应用生成完毕
        setProgress(null);
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        );
      } else if (data.type === "progress_update" && data.progress) {
        // 进度更新
        setProgress(data.progress);
      }
    },
  });

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary>
            <Suspense fallback={<ProjectHeaderSkeleton />}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<MessagesContainerSkeleton />}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
                progress={progress}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full flex flex-col gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger className="rounded-md" value="preview">
                  <EyeIcon />
                  <span>{t("preview")}</span>
                </TabsTrigger>
                <TabsTrigger className="rounded-md" value="code">
                  <CodeIcon />
                  <span>{t("code")}</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button size="sm" variant="tertiary" asChild>
                    <Link href="/pricing">
                      <CrownIcon />
                      {t("upgrade")}
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview" className="flex-1 min-h-0 relative">
              {!!activeFragment ? (
                <FragmentWeb data={activeFragment} />
              ) : progress ? (
                <PreviewLoading />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground/40">
                  <EyeIcon className="h-16 w-16" />
                </div>
              )}
            </TabsContent>
            <TabsContent value="code" className="flex-1 min-h-0">
              {!!activeFragment && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
