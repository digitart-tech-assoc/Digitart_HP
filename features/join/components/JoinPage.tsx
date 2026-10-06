import { ArrowRightIcon } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SOCIAL_LINKS } from "@/lib/constants";

export function JoinPage() {
  return (
    <div className="bg-transparent pt-20 font-sans text-slate-900">
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 md:py-32">
        {/* Decorative Background Elements */}
        <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 rounded-full bg-brand/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-400/5 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute top-0 left-1/2 -z-10 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center md:px-12">
          <div className="motion-safe:animate-rise">
            <Eyebrow className="mb-3">Welcome</Eyebrow>
            <h1 className="mb-8 text-5xl leading-tight font-black text-slate-900 md:text-7xl">
              Join Us
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed font-medium text-slate-600 md:text-lg">
              Digitartテクノロジー愛好会に興味を持っていただきありがとうございます。
              <br className="hidden md:block" />
              当サークルへの入会方法や、各種お問い合わせについてはこちらをご覧ください。
            </p>
          </div>
        </div>
      </section>

      {/* ── How to Join ────────────────────────────────────── */}
      <section className="relative overflow-clip border-t border-slate-100 bg-slate-50/50 py-16 md:py-32">
        {/* Subtle background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(var(--color-brand) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12">
          <div className="mb-16 text-center md:mb-24">
            <Eyebrow className="mb-3">Steps</Eyebrow>
            <h2 className="text-3xl leading-tight font-black text-slate-900 md:text-5xl">
              入会手続き
            </h2>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex reveal flex-col gap-6 md:flex-row md:gap-12">
              <div className="shrink-0">
                <span className="text-6xl font-black text-slate-200 md:text-7xl">01</span>
              </div>
              <div className="flex-1 pt-2 md:pt-4">
                <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
                  仮入会フォームよりDiscordに参加
                </h3>
                <p className="mb-4 text-lg leading-relaxed text-slate-600">
                  <a
                    href="https://auth.digitart.jp/join/form"
                    target="_blank"
                    rel="noreferrer"
                    className="border-b-2 border-brand/30 font-bold text-brand transition-colors hover:border-brand hover:text-brand-logo"
                  >
                    仮入会フォーム
                  </a>
                  より必要事項を入力し、Discordへの招待リンクを取得してください。
                </p>
                <div className="border-l-4 border-brand bg-slate-50 p-5 text-sm text-slate-600">
                  <p>
                    <a
                      href="https://auth.digitart.jp/contact"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-brand hover:underline"
                    >
                      お問い合わせフォーム
                    </a>
                    、及び公式SNS（
                    <a
                      href={SOCIAL_LINKS.twitter.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold hover:underline"
                    >
                      X
                    </a>{" "}
                    /
                    <a
                      href={SOCIAL_LINKS.instagram.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold hover:underline"
                    >
                      Instagram
                    </a>
                    ）のDMでも受け付けています。仮入会フォームが使用できない場合はご利用ください。
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex reveal flex-col gap-6 md:flex-row md:gap-12">
              <div className="shrink-0">
                <span className="text-6xl font-black text-slate-200 md:text-7xl">02</span>
              </div>
              <div className="flex-1 pt-2 md:pt-4">
                <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
                  Discordへの参加{" "}
                  <span className="text-xl text-brand md:text-2xl">(仮入会完了)</span>
                </h3>
                <p className="text-lg leading-relaxed text-slate-600">
                  受け取った招待リンクから、当サークルのDiscordサーバに参加してください。これにより仮入会が完了となります。
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex reveal flex-col gap-6 md:flex-row md:gap-12">
              <div className="relative z-10 shrink-0">
                <span className="bg-gradient-to-br from-brand to-emerald-600 bg-clip-text text-6xl font-black text-transparent md:text-7xl">
                  03
                </span>
              </div>
              <div className="flex-1 pt-2 md:pt-4">
                <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
                  正式入会・入会費の納入
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-slate-600">
                  正式に入会される際、入会費として{" "}
                  <span className="rounded-lg bg-rose-50 px-2 py-1 text-xl font-bold text-rose-600">
                    1,000円
                  </span>{" "}
                  を頂戴いたします。
                  <br />
                  お支払いは一度きりです。年会費はございません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact & Activities ─────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-12">
          {/* Contact */}
          <div className="reveal">
            <div className="mb-8">
              <Eyebrow className="mb-3">Contact</Eyebrow>
              <h2 className="text-3xl leading-tight font-black text-slate-900">お問い合わせ窓口</h2>
            </div>
            <p className="mb-10 text-lg leading-relaxed text-slate-600">
              入会のご連絡・ご質問はこちらの窓口からお願いいたします。
            </p>
            <div className="flex flex-col gap-6">
              <a
                href="https://auth.digitart.jp/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-700 transition-colors group-hover:bg-brand group-hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span className="text-lg font-bold text-slate-800 transition-colors group-hover:text-brand">
                  お問い合わせフォーム
                </span>
              </a>
              <a
                href={SOCIAL_LINKS.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-black/30 hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-700 transition-colors group-hover:bg-black group-hover:text-white">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
                <span className="text-lg font-bold text-slate-800 transition-colors group-hover:text-black">
                  {SOCIAL_LINKS.twitter.label}
                </span>
              </a>
              <a
                href={SOCIAL_LINKS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-instagram/30 hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-700 transition-colors group-hover:bg-instagram group-hover:text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"></path>
                    <line
                      x1="17.5"
                      y1="6.5"
                      x2="17.51"
                      y2="6.5"
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></line>
                  </svg>
                </span>
                <span className="text-lg font-bold text-slate-800 transition-colors group-hover:text-instagram">
                  {SOCIAL_LINKS.instagram.label}
                </span>
              </a>
            </div>
          </div>

          {/* Activities */}
          <div className="reveal">
            <div className="mb-8">
              <Eyebrow className="mb-3">Activities</Eyebrow>
              <h2 className="text-3xl leading-tight font-black text-slate-900">主な活動内容</h2>
            </div>
            <p className="mb-10 text-lg leading-relaxed text-slate-600">
              Digitartが普段どのような活動を行っているか、過去の制作物やイベントの様子はAboutページに詳しくまとめています。入会をご検討中の方はぜひ一度ご覧ください。
            </p>
            <ButtonLink href="/about" variant="outline-dark" size="lg" className="group">
              詳しくはこちら
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
