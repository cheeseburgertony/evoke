import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-typescript";

import "./code-theme.css";

interface ICodeViewProps {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: ICodeViewProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const lines = code.split("\n");

  return (
    <pre className="relative flex bg-transparent border-none rounded-none m-0 text-sm leading-relaxed overflow-x-auto">
      <div
        className="line-numbers-rows shrink-0 select-none box-border py-4 pl-4"
        aria-hidden="true"
      >
        {lines.map((_, i) => (
          <span
            key={i}
            className="block text-right pr-4 text-[#999] opacity-50 dark:text-[#6a737d]"
          >
            {i + 1}
          </span>
        ))}
      </div>
      <code className={`language-${lang} flex-1 py-4 pr-4 pl-4`}>{code}</code>
    </pre>
  );
};
