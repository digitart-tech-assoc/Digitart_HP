"use client";

import { Send } from "lucide-react";

type PublishSuccessProps = {
  /** 作成されたプルリクエストの URL */
  prUrl: string | null;
};

/** 記事の投稿リクエスト（プルリクエスト）を作成できたときの画面 */
export function PublishSuccess({ prUrl }: PublishSuccessProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md space-y-6 text-center">
        <div className="mx-auto mb-4 inline-flex h-20 w-20 rotate-3 items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-100 text-emerald-600 shadow-sm">
          <Send size={36} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          リクエストを送信しました！
        </h1>
        <p className="leading-relaxed font-medium text-slate-500">
          記事の投稿リクエストが作成されました。
          <br />
          管理者が承認次第、記事が公開されます。今しばらくお待ちください。
        </p>
        {prUrl && (
          <a
            href={prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block font-bold text-emerald-600 underline underline-offset-4 hover:text-emerald-700"
          >
            <span title="Organizationへのアクセス権が必要です">リクエストを確認する→</span>
          </a>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-2xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500"
        >
          続けて別の記事を書く
        </button>
      </div>
    </div>
  );
}
