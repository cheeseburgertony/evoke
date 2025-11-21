import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Fragment } from "@/generated/prisma/client";

interface IFragmentWebProps {
  data: Fragment | null;
}

export const FragmentWeb = ({ data }: IFragmentWebProps) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data?.sandboxUrl || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Button size="sm" variant="outline" onClick={handleRefresh}>
          <RefreshCcwIcon />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!data?.sandboxUrl || copied}
          onClick={handleCopy}
          className="flex-1 justify-start text-start font-normal"
        >
          <span className="truncate">{data?.sandboxUrl}</span>
        </Button>
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
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-script allow-same-origin"
        src={data?.sandboxUrl}
      />
    </div>
  );
};
