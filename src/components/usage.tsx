"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { enUS, zhCN } from "date-fns/locale";
import { useAuth } from "@clerk/nextjs";
import { CrownIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { type Locale } from "@/i18n/config";

interface IUsageProps {
  points: number;
  msBeforeNext: number;
}

const localeMap = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

export const Usage = ({ points, msBeforeNext }: IUsageProps) => {
  const t = useTranslations("Usage");
  const locale = useLocale();

  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const suffix = useMemo(() => {
    return !hasProAccess ? t("free") : "";
  }, [hasProAccess, t]);

  const formatResetTime = useCallback(() => {
    try {
      return formatDistanceToNow(Date.now() + msBeforeNext, {
        locale: localeMap[locale as Locale] ?? zhCN,
      });
    } catch {
      return t("unknownTime");
    }
  }, [msBeforeNext, locale, t]);

  const resetTime = useMemo(() => formatResetTime(), [formatResetTime]);

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">{t("remaining", { points, suffix })}</p>
          <p className="text-xs text-muted-foreground">
            {t("resetAfter", { resetTime })}
          </p>
        </div>
        {!hasProAccess && (
          <Button asChild size="sm" variant="tertiary" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon />
              {t("upgrade")}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
