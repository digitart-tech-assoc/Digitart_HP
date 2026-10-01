"use client";

import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  language: string;
  children: React.ReactNode;
}

/** 言語指定付きのコードブロックをシンタックスハイライトして表示する */
export function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl font-mono leading-relaxed shadow-inner">
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1.2rem",
          background: "#0f172a",
        }}
        codeTagProps={{
          style: {
            fontSize: "1rem",
            lineHeight: "1.75",
          },
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}
