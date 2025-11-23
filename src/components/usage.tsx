"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { zhCN } from "date-fns/locale";
import { useAuth } from "@clerk/nextjs";
import { CrownIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";

interface IUsageProps {
  points: number;
  msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: IUsageProps) => {
  const [now] = useState(() => Date.now());
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const resetTime = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(now + msBeforeNext), {
        locale: zhCN,
      });
    } catch (error) {
      console.error("Error formatting reset time:", error);
      return "未知时间";
    }
  }, [now, msBeforeNext]);

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            剩余 {points} 次{!hasProAccess && "免费"}额度
          </p>
          <p className="text-xs text-muted-foreground">{resetTime}后重置</p>
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
