"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  TriangleAlertIcon,
  RefreshCwIcon,
  HomeIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface IErrorFallbackPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorFallbackPage = ({
  error,
  resetErrorBoundary,
}: IErrorFallbackPageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!error) return;
    const text = `Error: ${error.message}\n\nStack:\n${error.stack}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timeRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (copyError) {
      console.error("复制错误: ", copyError);
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-muted/30 p-4">
      {/* 装饰背景 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 size-[800px] rounded-full bg-linear-to-br from-destructive/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 size-[600px] rounded-full bg-linear-to-tr from-muted/50 to-transparent blur-3xl" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 图标区域 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* 外圈动画 */}
            <div className="absolute -inset-3 animate-pulse rounded-full bg-linear-to-br from-destructive/10 to-orange-500/10 blur-xl" />
            {/* 主图标容器 */}
            <div className="relative flex size-20 items-center justify-center rounded-full border border-destructive/20 bg-linear-to-br from-destructive/10 to-orange-500/5 shadow-lg shadow-destructive/10">
              <TriangleAlertIcon className="size-9 text-destructive drop-shadow-sm" />
            </div>
          </div>
        </div>

        {/* 标题和描述 */}
        <div className="mb-8 space-y-3 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            哎呀，出了点问题
          </h1>
          <p className="mx-auto max-w-sm text-muted-foreground">
            页面遇到了一些意外情况。
          </p>
        </div>

        {/* 错误详情 */}
        {error && (
          <div className="mb-6">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <button className="group flex w-full items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <span>错误详情</span>
                  <ChevronDownIcon
                    className={cn(
                      "size-4 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
                    <p className="font-mono text-xs font-medium text-destructive">
                      {error.name}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="text-muted-foreground transition-colors p-1.5 rounded hover:bg-muted"
                      aria-label={copied ? "已复制" : "复制错误信息"}
                    >
                      {copied ? (
                        <CheckIcon size={14} />
                      ) : (
                        <CopyIcon size={14} />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="mb-2 text-sm text-foreground/80">
                      {error.message}
                    </p>
                    {error.stack && (
                      <pre className="max-h-32 overflow-auto rounded-lg bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {resetErrorBoundary && (
            <Button
              onClick={resetErrorBoundary}
              size="lg"
              className="w-full gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 sm:flex-1"
            >
              <RefreshCwIcon className="size-4" />
              重新加载
            </Button>
          )}
          <Button
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            className="w-full gap-2 bg-background/50 backdrop-blur-sm transition-all hover:bg-background sm:flex-1"
          >
            <HomeIcon className="size-4" />
            返回首页
          </Button>
        </div>

        {/* 底部提示 */}
        <p className="mt-8 text-center text-xs text-muted-foreground/60">
          如果问题持续存在，请联系技术支持
        </p>
      </div>
    </div>
  );
};
