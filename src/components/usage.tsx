"use client";

import Link from "next/link";
import { useMemo } from "react";
import { zhCN } from "date-fns/locale";
import { useAuth } from "@clerk/nextjs";
import { CrownIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";
import { Button } from "./ui/button";

interface IUsageProps {
  points: number;
  msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: IUsageProps) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const resetTime = useMemo(() => {
    return formatDuration(
      intervalToDuration({
        start: new Date(),
        // eslint-disable-next-line react-hooks/purity
        end: new Date(Date.now() + msBeforeNext),
      }),
      { format: ["months", "days", "hours"], locale: zhCN }
    );
  }, [msBeforeNext]);

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            剩余 {points} 次{!hasProAccess && "免费"}额度
          </p>
          <p className="text-xs text-muted-foreground">重置时间 {resetTime}</p>
        </div>
        {!hasProAccess && (
          <Button asChild size="sm" variant="tertiary" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon />
              升级
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
