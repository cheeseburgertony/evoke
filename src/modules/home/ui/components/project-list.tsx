"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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
            <div className="col-span-full text-center">
              <p className="text-sm text-muted-foreground">{t("noWorks")}</p>
            </div>
          )}
          {projects?.map((project) => (
            <Button
              key={project.id}
              variant="outline"
              className="font-normal h-auto justify-start w-full text-start p-4 bg-white/30 dark:bg-slate-800/40 backdrop-blur-lg border-white/30 dark:border-white/10 hover:bg-white/90 dark:hover:bg-slate-700/50 hover:border-white/50 dark:hover:border-white/20 transition-all duration-200 shadow-sm"
              asChild
            >
              <Link href={`/projects/${project.id}`}>
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
            </Button>
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
