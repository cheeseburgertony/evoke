"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS, zhCN } from "date-fns/locale";
import { useUser } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/i18n/config";

const localeMap = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

export const ProjectList = () => {
  const t = useTranslations("ProjectList");
  const locale = useLocale();
  const { user } = useUser();
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());

  const name = user?.firstName || t("me");

  if (!user) return null;

  return (
    <div className="w-full rounded-2xl p-8 flex flex-col gap-y-6 sm:gap-y-4 bg-white/30 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5">
      <h2 className="text-2xl font-semibold">{t("worksOf", { name })}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-sm text-muted-foreground">{t("noWorks")}</p>
          </div>
        )}
        {/* TODO: 太多则只展示部分，剩下的通过点击查看更多来展开 */}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant="outline"
            className="font-normal h-auto justify-start w-full text-start p-4 bg-white/30 dark:bg-slate-800/40 backdrop-blur-lg border-white/30 dark:border-white/10 hover:bg-white/90 dark:hover:bg-slate-700/50 hover:border-white/50 dark:hover:border-white/20 transition-all duration-200 shadow-sm"
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4">
                <Image
                  src="/logo.svg"
                  alt="Evoke"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col">
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
          </Button>
        ))}
      </div>
    </div>
  );
};
