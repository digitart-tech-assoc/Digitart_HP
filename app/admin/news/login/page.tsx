"use client";

import { KeyRound } from "lucide-react";
import { useActionState } from "react";

import { loginAction } from "@/app/admin/actions";

const initialState = {
  error: null as string | null,
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/50 bg-white/95 p-10 shadow-2xl shadow-emerald-200/10 backdrop-blur-md">
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-20 w-20 rotate-3 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm transition-transform duration-300 hover:rotate-0">
              <KeyRound size={40} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">メンバー確認</h1>
            <p className="mt-3 font-medium text-slate-500">
              Digitartのメンバーであることを確認するため、
              <br />
              「sys_message」チャンネルの最新のパスワードを入力してください。
            </p>
          </div>

          <form action={formAction} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="password" className="ml-1 block text-sm font-bold text-slate-700">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white/50 px-5 py-4 text-slate-900 transition-all outline-none placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>認証中...</span>
                </>
              ) : (
                <>
                  <span>次へ</span>
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
