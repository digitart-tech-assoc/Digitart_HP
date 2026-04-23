"use client";

import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";

export default function JoinPage() {
  return (
    <div className="bg-transparent text-slate-900 font-sans pt-20">
      
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8cc63f]/10 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4 pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4 pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10" />
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent -z-10" />

        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#8cc63f] mb-3">
              入会案内
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8">
              Join Us
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
              Digitartテクノロジー愛好会に興味を持っていただきありがとうございます。<br className="hidden md:block" />
              当サークルへの入会方法や、各種お問い合わせについてはこちらをご覧ください。
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── How to Join ────────────────────────────────────── */}
      <section className="relative py-16 md:py-32 border-t border-slate-100 bg-slate-50/50 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8cc63f 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 z-10">
          <div className="mb-16 md:mb-24 text-center">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-3">Steps</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">入会手続き</h2>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row gap-6 md:gap-12"
            >
              <div className="shrink-0">
                <span className="text-6xl md:text-7xl font-black text-slate-200">01</span>
              </div>
              <div className="flex-1 pt-2 md:pt-4">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">仮入会フォームよりDiscordに参加</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-4">
                  <a href="https://auth.digitart.jp/join/form" target="_blank" rel="noreferrer" className="text-[#8cc63f] hover:text-[#6E9442] font-bold border-b-2 border-[#8cc63f]/30 hover:border-[#8cc63f] transition-colors">
                    仮入会フォーム
                  </a>
                  より必要事項を入力し、Discordへの招待リンクを取得してください。
                </p>
                <div className="bg-slate-50 border-l-4 border-[#8cc63f] p-5 text-sm text-slate-600">
                  <p>
                    <a href="https://auth.digitart.jp/contact" target="_blank" rel="noreferrer" className="text-[#8cc63f] font-bold hover:underline">お問い合わせフォーム</a>、及び公式SNS（
                    <a href={SOCIAL_LINKS.twitter.url} target="_blank" rel="noreferrer" className="font-bold hover:underline">X</a> / 
                    <a href={SOCIAL_LINKS.instagram.url} target="_blank" rel="noreferrer" className="font-bold hover:underline">Instagram</a>
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
              className="flex flex-col md:flex-row gap-6 md:gap-12"
            >
              <div className="shrink-0">
                <span className="text-6xl md:text-7xl font-black text-slate-200">02</span>
              </div>
              <div className="flex-1 pt-2 md:pt-4">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Discordへの参加 <span className="text-[#8cc63f] text-xl md:text-2xl">(仮入会完了)</span></h3>
                <p className="text-lg text-slate-600 leading-relaxed">
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
              className="flex flex-col md:flex-row gap-6 md:gap-12 relative"
            >
              <div className="shrink-0 relative z-10">
                <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#8cc63f] to-emerald-600">03</span>
              </div>
              <div className="flex-1 pt-2 md:pt-4">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">正式入会・入会費の納入</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  正式に入会される際、入会費として <span className="text-rose-600 font-bold text-xl px-2 py-1 bg-rose-50 rounded-lg">1,000円</span> を頂戴いたします。
                  <br />
                  お支払いは一度きりです。年会費はございません。
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contact & Activities ─────────────────────────── */}
      <section className="py-16 md:py-28 border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 md:gap-24">
          
          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-3">Contact</p>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">お問い合わせ窓口</h2>
            </div>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              入会のご連絡・ご質問はこちらの窓口からお願いいたします。
            </p>
            <div className="flex flex-col gap-6">
              <a href="https://auth.digitart.jp/contact" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-[#8cc63f]/30 transition-all">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-700 group-hover:bg-[#8cc63f] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <span className="text-lg font-bold text-slate-800 group-hover:text-[#8cc63f] transition-colors">お問い合わせフォーム</span>
              </a>
              <a href={SOCIAL_LINKS.twitter.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-black/30 transition-all">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-700 group-hover:bg-black group-hover:text-white transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </span>
                <span className="text-lg font-bold text-slate-800 group-hover:text-black transition-colors">{SOCIAL_LINKS.twitter.label}</span>
              </a>
              <a href={SOCIAL_LINKS.instagram.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-[#E1306C]/30 transition-all">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-700 group-hover:bg-[#E1306C] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round"></line></svg>
                </span>
                <span className="text-lg font-bold text-slate-800 group-hover:text-[#E1306C] transition-colors">{SOCIAL_LINKS.instagram.label}</span>
              </a>
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
              <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-3">Activities</p>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">主な活動内容</h2>
            </div>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Digitartが普段どのような活動を行っているか、過去の制作物やイベントの様子はAboutページに詳しくまとめています。入会をご検討中の方はぜひ一度ご覧ください。
            </p>
            <Link href="/about" className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-slate-900 bg-white border-2 border-slate-900 hover:bg-slate-900 hover:text-white rounded-full transition-all duration-300">
              詳しくはこちら
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
