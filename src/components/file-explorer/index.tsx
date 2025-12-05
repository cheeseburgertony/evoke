"use client";


import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Hint } from "../hint";
import { Button } from "../ui/button";
import { CodeView } from "../code-view";
import { TreeView } from "./c-cpns/tree-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import { FileBreadcrumb } from "./c-cpns/file-breadcrumb";

type FileCollection = { [path: string]: string };

/**
 * 获取文件对应的语言类型
 * @param filename 文件名
 * @returns 语言类型字符串
 */
function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface IFileExplorerProps {
  files: FileCollection;
}

export const FileExplorer = ({ files }: IFileExplorerProps) => {
  const t = useTranslations("FileExplorer");
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files]
  );

  const handleCopy = useCallback(async () => {
    if (selectedFile) {
      try {
        await navigator.clipboard.writeText(files[selectedFile]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("复制错误: ", err);
      }
    }
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text={t("copyToClipboard")} side="bottom">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto ">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full justify-center items-center text-muted-foreground">
            {t("select")}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
