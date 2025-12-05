"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import type { Fragment } from "@/generated/prisma/client";
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

interface IProjectViewProps {
  projectId: string;
}

export const ProjectView = ({ projectId }: IProjectViewProps) => {
  const t = useTranslations("ProjectsViewsProjectView");

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

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
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
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
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
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
