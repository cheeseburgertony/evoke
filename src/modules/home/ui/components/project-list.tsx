"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Trash2Icon,
  MoreHorizontalIcon,
  PencilIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS, zhCN } from "date-fns/locale";
import { useUser } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/i18n/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const localeMap = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

const MAX_PROJECT_COUNT = 12;

export const ProjectList = () => {
  const t = useTranslations("ProjectList");
  const locale = useLocale();
  const { user } = useUser();
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());

  const [isExpanded, setIsExpanded] = useState(false);
  const name = user?.firstName || t("me");

  if (!user) return null;

  return (
    <div className="w-full rounded-2xl p-8 flex flex-col gap-y-6 sm:gap-y-4 bg-white/30 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5">
      <h2 className="text-2xl font-semibold">{t("worksOf", { name })}</h2>

      <div className="relative">
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${!isExpanded && projects && projects.length > MAX_PROJECT_COUNT ? "max-h-[340px] overflow-hidden" : ""}`}
        >
          {projects?.length === 0 && (
            <div className="col-span-full text -center">
              <p className="text-sm text-muted-foreground">{t("noWorks")}</p>
            </div>
          )}
          {projects?.map((project) => (
            <ProjectItem key={project.id} project={project} locale={locale} />
          ))}
        </div>
        {/* 遮罩层 */}
        {!isExpanded && projects && projects.length > MAX_PROJECT_COUNT && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-white/90 via-white/40 to-transparent dark:from-slate-900/90 dark:via-slate-900/40 pointer-events-none" />
        )}
      </div>
      {/* 展开按钮 */}
      {projects && projects.length > MAX_PROJECT_COUNT && (
        <div className="flex justify-center mt-2 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors font-medium"
          >
            {isExpanded ? (
              <>
                {t("showLess")} <ChevronUpIcon className="w-4 h-4" />
              </>
            ) : (
              <>
                {t("showMore")} <ChevronDownIcon className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectItem = ({
  project,
  locale,
}: {
  project: Project;
  locale: string;
}) => {
  const t = useTranslations("ProjectList");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(project.name);

  const removeMutation = useMutation(
    trpc.projects.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryFilter());
        setIsDeleteDialogOpen(false);
      },
    }),
  );

  const renameMutation = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryFilter());
        setIsRenameDialogOpen(false);
        toast.success(t("renameSuccess"));
      },
      onError: () => {
        toast.error(t("renameError"));
      },
    }),
  );

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !renameValue.trim() ||
      renameValue === project.name ||
      renameMutation.isPending
    )
      return;
    renameMutation.mutate({ id: project.id, name: renameValue });
  };

  return (
    <>
      <div className="group relative flex rounded-md border text-start bg-white/30 dark:bg-slate-800/40 backdrop-blur-lg border-white/30 dark:border-white/10 hover:bg-white/90 dark:hover:bg-slate-700/50 hover:border-white/50 dark:hover:border-white/20 transition-all duration-200 shadow-sm">
        <Link
          href={`/projects/${project.id}`}
          className="flex-1 p-4 w-full h-full pr-12"
        >
          <div className="flex items-center gap-x-4 w-full">
            <Image
              src="/logo.svg"
              alt="Evoke"
              width={32}
              height={32}
              className="object-contain"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="truncate font-medium">{project.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(project.updatedAt, {
                  addSuffix: true,
                  locale: localeMap[locale as Locale] ?? zhCN,
                })}
              </p>
            </div>
          </div>
        </Link>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">{t("moreOptions")}</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setIsRenameDialogOpen(true)}
                className="cursor-pointer"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                {t("rename")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2Icon className="text-red-600 focus:text-red-600 mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog
        open={isRenameDialogOpen}
        onOpenChange={(open) => {
          setIsRenameDialogOpen(open);
          if (!open) setRenameValue(project.name);
        }}
      >
        <DialogContent>
          <form onSubmit={handleRenameSubmit}>
            <DialogHeader>
              <DialogTitle>{t("renameTitle")}</DialogTitle>
              <DialogDescription>{t("renameDescription")}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder={t("renameTitle")}
                disabled={renameMutation.isPending}
                autoFocus
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
                disabled={renameMutation.isPending}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={
                  renameMutation.isPending ||
                  !renameValue.trim() ||
                  renameValue === project.name
                }
              >
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMutation.isPending}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                removeMutation.mutate({ id: project.id });
              }}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white"
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? t("deleting") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
