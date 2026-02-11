import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-typescript";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "./code-theme.css";

interface ICodeViewProps {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: ICodeViewProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="line-numbers p-4 bg-transparent border-none rounded-none m-0 text-sm leading-relaxed overflow-x-auto">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};
