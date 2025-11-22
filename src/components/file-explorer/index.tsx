"use client";

import { useCallback, useMemo, useState } from "react";
import { CopyIcon } from "lucide-react";
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
              {/* TODO: 面包屑导航 */}
              <Hint text="复制到剪贴板" side="bottom">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {}}
                  disabled={false}
                >
                  <CopyIcon />
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
            选择文件来查看内容
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
