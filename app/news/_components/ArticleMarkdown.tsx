/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import CodeBlock from '../[slug]/CodeBlock';

interface ArticleMarkdownProps {
  content: string;
}

export default function ArticleMarkdown({ content }: ArticleMarkdownProps) {
  return (
    <article className="prose prose-slate prose-emerald md:prose-lg max-w-none bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => {
            void node;
            return <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-6 mb-4 pb-3 border-b-2 border-slate-100" {...props} />;
          },
          h2: ({ node, ...props }) => {
            void node;
            return <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-100" {...props} />;
          },
          h3: ({ node, ...props }) => {
            void node;
            return (
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-6 mb-3 flex items-center gap-2" {...props}>
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                {props.children}
              </h3>
            );
          },
          p: ({ node, ...props }) => {
            void node;
            return <p className="leading-relaxed text-slate-700 font-medium mb-5 text-base" {...props} />;
          },
          a: ({ node, href, children, ...props }) => {
            void node;
            const linkClass = 'text-emerald-600 hover:text-emerald-700 underline underline-offset-4 decoration-emerald-200 hover:decoration-emerald-500 transition-all font-bold';
            if (!href) {
              return (
                <span className={linkClass} {...props}>
                  {children}
                </span>
              );
            }
            const isExternal = /^https?:\/\//.test(href);
            if (isExternal) {
              return (
                <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              );
            }
            return (
              <Link href={href} className={linkClass} {...props}>
                {children}
              </Link>
            );
          },
          ul: ({ node, ...props }) => {
            void node;
            return <ul className="list-disc list-outside ml-6 mb-5 space-y-1.5 text-slate-700 font-medium marker:text-emerald-500" {...props} />;
          },
          ol: ({ node, ...props }) => {
            void node;
            return <ol className="list-decimal list-outside ml-6 mb-5 space-y-1.5 text-slate-700 font-medium font-mono marker:text-emerald-600" {...props} />;
          },
          li: ({ node, ...props }) => {
            void node;
            return <li className="pl-1 leading-relaxed" {...props} />;
          },
          blockquote: ({ node, ...props }) => {
            void node;
            return <blockquote className="border-l-4 border-emerald-400 pl-4 py-1.5 my-4 bg-emerald-50/50 rounded-r-xl italic text-slate-600 font-medium" {...props} />;
          },
          code: ({ node, className, children, ...props }) => {
            void node;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <CodeBlock language={match[1]}>{children}</CodeBlock>
            ) : (
              <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-sm font-mono border border-slate-200 break-words" {...props}>
                {children}
              </code>
            );
          },
          img: ({ node, alt, ...props }) => {
            void node;
            return (
              <span className="block w-fit max-w-full my-10 mx-auto rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <img className="max-w-full w-auto h-auto object-cover !m-0" alt={alt || 'Article image'} {...props} />
              </span>
            );
          },
          hr: ({ node, ...props }) => {
            void node;
            return <hr className="my-10 border-t-2 border-slate-100 border-dashed" {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
