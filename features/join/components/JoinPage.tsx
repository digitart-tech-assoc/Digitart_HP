import { ArrowRightIcon } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";

import { ContactLinkCard } from "@/components/ui/ContactLinkCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { InstagramIcon, MailIcon, XIcon } from "@/components/ui/SocialIcons";
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Eyebrow className="mb-3">Welcome</Eyebrow>
            <h1 className="mb-8 text-5xl leading-tight font-black text-slate-900 md:text-7xl">
              Join Us
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed font-medium text-slate-600 md:text-lg">
              Digitartテクノロジー愛好会に興味を持っていただきありがとうございます。
              <br className="hidden md:block" />
              当サークルへの入会方法や、各種お問い合わせについてはこちらをご覧ください。
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── How to Join ────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-slate-100 bg-slate-50/50 py-16 md:py-32">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6 md:flex-row md:gap-12"
            >
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
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6 md:flex-row md:gap-12"
            >
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
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex flex-col gap-6 md:flex-row md:gap-12"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contact & Activities ─────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-12">
          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <Eyebrow className="mb-3">Contact</Eyebrow>
              <h2 className="text-3xl leading-tight font-black text-slate-900">お問い合わせ窓口</h2>
            </div>
            <p className="mb-10 text-lg leading-relaxed text-slate-600">
              入会のご連絡・ご質問はこちらの窓口からお願いいたします。
            </p>
            <div className="flex flex-col gap-6">
              <ContactLinkCard
                href="https://auth.digitart.jp/contact"
                label="お問い合わせフォーム"
                icon={<MailIcon />}
                tone="brand"
              />
              <ContactLinkCard
                href={SOCIAL_LINKS.twitter.url}
                label={SOCIAL_LINKS.twitter.label}
                icon={<XIcon />}
                tone="x"
              />
              <ContactLinkCard
                href={SOCIAL_LINKS.instagram.url}
                label={SOCIAL_LINKS.instagram.label}
                icon={<InstagramIcon />}
                tone="instagram"
              />
            </div>
          </motion.div>

          {/* Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-8">
              <Eyebrow className="mb-3">Activities</Eyebrow>
              <h2 className="text-3xl leading-tight font-black text-slate-900">主な活動内容</h2>
            </div>
            <p className="mb-10 text-lg leading-relaxed text-slate-600">
              Digitartが普段どのような活動を行っているか、過去の制作物やイベントの様子はAboutページに詳しくまとめています。入会をご検討中の方はぜひ一度ご覧ください。
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 rounded-full border-2 border-slate-900 bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-all duration-300 hover:bg-slate-900 hover:text-white"
            >
              詳しくはこちら
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
