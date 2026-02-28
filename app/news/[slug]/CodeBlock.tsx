"use client";

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  language: string;
  children: React.ReactNode;
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden shadow-inner font-mono leading-relaxed">
      <SyntaxHighlighter
        style={vscDarkPlus as any}
        language={language}
        PreTag="div"
        customStyle={{ 
          margin: 0, 
          padding: '1.2rem', 
          background: '#0f172a',
        }}
        codeTagProps={{
          style: {
            fontSize: '1rem',
            lineHeight: '1.75'
          }
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}
