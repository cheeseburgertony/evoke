import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Fragment } from "@/generated/prisma/client";
import { Hint } from "@/components/hint";
import { toast } from "sonner";

interface IFragmentWebProps {
  data: Fragment | null;
}

export const FragmentWeb = ({ data }: IFragmentWebProps) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data?.sandboxUrl || "");
      setCopied(true);
      toast.success("链接已复制到剪贴板");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("复制链接失败:", error);
      toast.error("复制链接失败，请重试");
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="刷新" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>
        <Hint text="复制链接" side="bottom">
          <Button
            size="sm"
            variant="outline"
            disabled={!data?.sandboxUrl || copied}
            onClick={handleCopy}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">{data?.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="在新的标签页打开" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            disabled={!data?.sandboxUrl}
            onClick={() => {
              if (!data?.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        src={data?.sandboxUrl}
      />
    </div>
  );
};
