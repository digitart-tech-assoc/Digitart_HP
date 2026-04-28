'use client';

import { useState, useRef, useActionState, FormEvent } from 'react';
import { publishArticleAction, ActionState } from '@/app/admin/actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ImagePlus, Send, Loader2 } from 'lucide-react';
import 'katex/dist/katex.min.css';

const initialState: ActionState = {
  error: null,
  success: false,
  prUrl: null,
};

export default function AdminNewsEditor() {
  const [state, formAction, isPending] = useActionState(publishArticleAction, initialState);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('column');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<{ path: string; content: string }[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle image upload via file input or drag & drop
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      const base64Content = base64Data.split(',')[1]; // Remove data URL prefix
      
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const imagePath = `public/images/articles/${date}/${fileName}`;
      const imageMarkdownUrl = `/images/articles/${date}/${fileName}`;

      setImages((prev) => [...prev, { path: imagePath, content: base64Content }]);

      // Insert markdown into textarea
      const imageMarkdown = `\n![${file.name}](${imageMarkdownUrl})\n`;
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
        setContent(newContent);
        
        // Reset cursor
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + imageMarkdown.length;
            textareaRef.current.selectionEnd = start + imageMarkdown.length;
            textareaRef.current.focus();
          }
        }, 0);
      } else {
        setContent((prev) => prev + imageMarkdown);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      handleImageUpload(e.clipboardData.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  if (state?.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl items-center justify-center mx-auto mb-4 rotate-3 shadow-sm border border-emerald-200">
            <Send size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">リクエストを送信しました！</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            記事の追加リクエスト（Pull Request）が作成されました。<br />
            管理者が確認・承認するとサイトに反映されます。
          </p>
          {state.prUrl && (
            <a
              href={state.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-4 block mt-4"
            >
              <span title="Organizationへのアクセス権が必要です">作成されたPull Requestを確認する</span>
            </a>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
          >
            続けて別の記事を書く
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10 flex-nowrap gap-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 whitespace-nowrap shrink-0">
          記事の新規作成
        </h1>
        <div className="flex items-center gap-4 min-w-0">
          {state?.error && (
            <span className="text-red-500 text-sm font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100 truncate max-w-md" title={state.error}>
              {state.error}
            </span>
          )}
          <button
            onClick={() => {
              const form = document.getElementById('publish-form') as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={isPending}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {isPending ? '送信中...' : '追加リクエストを送信'}
          </button>
        </div>
      </header>

      <form id="publish-form" action={formAction} className="hidden">
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="author" value={author} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="excerpt" value={excerpt} />
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="images" value={JSON.stringify(images)} />
      </form>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-73px)]">
        {/* Left Side: Editor */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-stone-50">
          <div className="p-6 overflow-y-auto space-y-5 border-b border-slate-200 bg-white/30">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">タイトル</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  placeholder="記事のタイトル"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">著者</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Discord名"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">公開日</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">カテゴリ</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none"
                >
                  <option value="notice">お知らせ</option>
                  <option value="column">コラム</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  ファイル名（URLの一部になります） <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-mono text-sm">
                    {date}-
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    pattern="^[a-z0-9-]+$"
                    title="半角英小文字、数字、ハイフンのみ使用できます"
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-r-xl bg-white text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono"
                    placeholder="snake-case-title"
                    required
                  />
                  <span className="ml-2 text-slate-500 font-mono text-sm">.md</span>
                </div>
                <p className="mt-1.5 ml-1 text-xs text-slate-400 font-medium">半角英小文字、数字、ハイフンのみ使用可能</p>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">概要</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                  rows={2}
                  placeholder="ニュース一覧に表示される概要文"
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative flex flex-col bg-amber-50/60">
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <label className="cursor-pointer bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 p-2.5 rounded-xl hover:bg-white hover:text-emerald-600 transition-all shadow-sm group" title="画像を挿入">
                <ImagePlus size={20} className="group-hover:scale-110 transition-transform" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                  }}
                />
              </label>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex-1 w-full p-8 bg-transparent text-slate-800 outline-none resize-none font-mono text-sm leading-relaxed"
              placeholder="ここにMarkdownで記事を書いてください... (画像はドラッグ＆ドロップや貼り付けで挿入できます)"
              required
            />
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="w-1/2 bg-white overflow-y-auto p-10 max-w-none shadow-inner border-l border-slate-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-6 mb-4 pb-3 border-b-2 border-slate-100" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-100" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-6 mb-3 flex items-center gap-2" {...props}><span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>{props.children}</h3>,
              p: ({node, ...props}) => <p className="leading-relaxed text-slate-700 font-medium mb-5 text-base" {...props} />,
              a: ({ node, href, children, ...props }) => {
                const linkClass = "text-emerald-600 hover:text-emerald-700 underline underline-offset-4 decoration-emerald-200 hover:decoration-emerald-500 transition-all font-bold";
                return <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
              },
              ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-5 space-y-1.5 text-slate-700 font-medium marker:text-emerald-500" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-5 space-y-1.5 text-slate-700 font-medium font-mono marker:text-emerald-600" {...props} />,
              li: ({node, ...props}) => <li className="pl-1 leading-relaxed text-slate-700" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-400 pl-4 py-1.5 my-4 bg-emerald-50/50 rounded-r-xl italic text-slate-600 font-medium" {...props} />,
              code: ({node, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-sm font-mono border border-slate-200 break-words" {...props}>
                    {children}
                  </code>
                )
              },
              img: ({node, alt, src, ...props}) => {
                // If it's a dropped image, src might be a local path that hasn't been uploaded. 
                // We show base64 content instead if we have it in our state.
                const imgState = images.find(img => img.path === 'public' + src);
                const actualSrc = imgState ? `data:image/png;base64,${imgState.content}` : src;
                
                return (
                  <span className="block w-fit max-w-full my-10 mx-auto rounded-2xl overflow-hidden shadow-md border border-slate-200">
                    <img 
                      className="max-w-full w-auto max-h-96 h-auto object-cover !m-0" 
                      src={actualSrc}
                      alt={alt || '記事内画像'} 
                      {...props} 
                    />
                  </span>
                );
              },
              hr: ({node, ...props}) => <hr className="my-10 border-t-2 border-slate-100 border-dashed" {...props} />
            }}
          >
            {content || '*ここにプレビューが表示されます...*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
