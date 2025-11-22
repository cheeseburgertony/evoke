import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TreeItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TreeNode {
  [key: string]: TreeNode | null;
}

/**
 * 将文件记录转换为树形结构。
 * @param files - 文件路径到内容的记录
 * @returns 适用于 TreeView 组件的树形结构
 *
 * @example
 * 输入: { "src/Button.tsx": "...", "README.md": "..." }
 * 输出: [["src", "Button.tsx"], "README.md"]
 */
export function convertFilesToTreeItems(files: {
  [path: string]: string;
}): TreeItem[] {
  const tree: TreeNode = {};

  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part]!;
    }

    const fileName = parts[parts.length - 1];
    current[fileName] = null;
  }

  // 递归转换节点
  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node);

    // 叶子节点（文件）
    if (entries.length === 0) {
      return name || "";
    }

    const children: TreeItem[] = [];

    // 遍历子节点
    for (const [key, value] of entries) {
      // 文件
      if (value === null) {
        children.push(key);
      } else {
        // 文件夹
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }
    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}
