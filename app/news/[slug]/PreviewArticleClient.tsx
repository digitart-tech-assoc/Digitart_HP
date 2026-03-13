'use client';

import { useEffect, useRef, useState } from 'react';
import type { ArticleData } from '@/lib/news';
import ArticleHeader from '../_components/ArticleHeader';
import ArticleMarkdown from '../_components/ArticleMarkdown';

interface PreviewArticleClientProps {
  initialArticle: ArticleData | null;
  slug: string;
}

type PreviewState =
  | { status: 'loading'; article: ArticleData | null; message?: string }
  | { status: 'ready'; article: ArticleData }
  | { status: 'not-found'; article: null; message: string }
  | { status: 'error'; article: ArticleData | null; message: string };

function initialState(article: ArticleData | null): PreviewState {
  if (article) {
    return { status: 'ready', article };
  }
  return {
    status: 'loading',
    article: null,
    message: '記事ファイルの生成を待っています。',
  };
}

export default function PreviewArticleClient({ initialArticle, slug }: PreviewArticleClientProps) {
  const [state, setState] = useState<PreviewState>(() => initialState(initialArticle));
  const lastSerialized = useRef(initialArticle ? JSON.stringify(initialArticle) : null);

  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      try {
        const response = await fetch(`/api/news/preview?slug=${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        });

        if (cancelled) {
          return;
        }

        if (response.status === 404) {
          setState({
            status: 'not-found',
            article: null,
            message: '対象の記事がまだ見つかりません。Markdown を保存すると自動で反映されます。',
          });
          lastSerialized.current = null;
          return;
        }

        if (!response.ok) {
          throw new Error(`Preview API returned ${response.status}`);
        }

        const nextArticle = (await response.json()) as ArticleData;
        const serialized = JSON.stringify(nextArticle);

        if (lastSerialized.current === serialized) {
          setState((current) => {
            if (current.status === 'ready') {
              return current;
            }
            return { status: 'ready', article: nextArticle };
          });
          return;
        }

        lastSerialized.current = serialized;
        setState({ status: 'ready', article: nextArticle });
      } catch {
        setState((current) => ({
          status: 'error',
          article: current.article ?? initialArticle,
          message: 'プレビューの更新に失敗しました。次回ポーリングで再試行します。',
        }));
      }
    }

    loadArticle();
    const intervalId = window.setInterval(loadArticle, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [initialArticle, slug]);

  const article = state.article;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
        開発用ライブプレビューです。`app/news/articles/{slug}.md` を保存すると数秒以内に再読込されます。
      </div>

      {state.status === 'not-found' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {state.message}
        </div>
      )}

      {state.status === 'error' && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {state.message}
        </div>
      )}

      {state.status === 'loading' && !article && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-600">
          {state.message}
        </div>
      )}

      {article && (
        <>
          <ArticleHeader article={article} />
          <ArticleMarkdown content={article.content} />
        </>
      )}
    </div>
  );
}
