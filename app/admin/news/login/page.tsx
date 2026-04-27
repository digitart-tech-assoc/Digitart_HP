'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/admin/actions';
import { KeyRound } from 'lucide-react';

const initialState = {
  error: null as string | null,
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4 relative overflow-hidden">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-emerald-200/10 p-10 border border-white/50">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 mb-6 shadow-sm border border-emerald-100 rotate-3 hover:rotate-0 transition-transform duration-300">
              <KeyRound size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">メンバー確認</h1>
            <p className="text-slate-500 mt-3 font-medium">
              Digitartのメンバーであることを確認するため、<br />
              パスワードを入力してください。
            </p>
          </div>

          <form action={formAction} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white/50 text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>認証中...</span>
                </>
              ) : (
                <>
                  <span>次へ</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
