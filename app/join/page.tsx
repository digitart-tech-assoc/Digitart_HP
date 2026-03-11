"use client";

import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";

export default function JoinPage() {
  return (
    <div className="bg-white text-gray-900 font-sans selection:bg-emerald-200">
      <div className="max-w-6xl mx-auto space-y-16 py-20 px-6">
        
        {/* Header Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900" style={{ fontWeight: 700 }}>
            How to <span className="text-emerald-600">Join</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Digitartテクノロジー愛好会に興味を持っていただきありがとうございます！<br className="hidden md:block" />
            当サークルへの入会方法や、各種お問い合わせについてはこちらをご覧ください。
          </p>
        </motion.section>

        {/* How to Join Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-emerald-50/50 rounded-3xl shadow-xl border border-emerald-100 p-8 md:p-12 mb-20"
        >
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-emerald-200/50">
            <div className="flex-shrink-0 w-12 h-12 bg-white shadow-sm text-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl text-gray-900" style={{ fontWeight: 700 }}>入会方法</h2>
          </div>
          
          <div className="space-y-8 relative">
            {/* 接続線 */}
            <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-emerald-200/50 hidden md:block"></div>

            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex flex-col md:flex-row gap-4 md:gap-8 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl border-4 border-emerald-50 shadow-sm relative z-10" style={{ fontWeight: 700 }}>1</div>
              <div className="flex-grow bg-white rounded-2xl p-8 border border-gray-100 w-full hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <h3 className="text-xl text-gray-900 mb-3" style={{ fontWeight: 700 }}>SNSでDMを送信</h3>
                <p className="text-gray-600 leading-relaxed">
                  当サークルの公式SNS（
				  	<a href={SOCIAL_LINKS.twitter.url} target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-600 font-bold underline decoration-sky-200 hover:decoration-sky-500 underline-offset-4 transition">
					  {SOCIAL_LINKS.twitter.label}
					</a>
				  または
				    <a href={SOCIAL_LINKS.instagram.url} target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-600 font-bold underline decoration-pink-200 hover:decoration-pink-500 underline-offset-4 transition">
					  {SOCIAL_LINKS.instagram.label}
					</a>
				  ）へ、入会希望の旨を記載してDMをお送りください。
                </p>
                <p className="text-sm text-gray-500 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  ※ メールでのお問い合わせも受け付けております。メールアドレスはページ下部に記載しています。
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative flex flex-col md:flex-row gap-4 md:gap-8 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl border-4 border-emerald-50 shadow-sm relative z-10" style={{ fontWeight: 700 }}>2</div>
              <div className="flex-grow bg-white rounded-2xl p-8 border border-gray-100 w-full hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <h3 className="text-xl text-gray-900 mb-3" style={{ fontWeight: 700 }}>担当者からのDiscord招待リンクの送信</h3>
                <p className="text-gray-600 leading-relaxed">
                  担当者より当サークルへのDiscordサーバ招待リンクをお送りいたします。サーバに参加していただくことで、仮入会となります。
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative flex flex-col md:flex-row gap-4 md:gap-8 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl border-4 border-emerald-50 shadow-sm relative z-10" style={{ fontWeight: 700 }}>3</div>
              <div className="flex-grow bg-white rounded-2xl p-8 border border-gray-100 w-full hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <h3 className="text-xl text-gray-900 mb-3" style={{ fontWeight: 700 }}>正式入会・入会費の納入</h3>
                <p className="text-gray-600 leading-relaxed">
                  正式に入会される際、入会費として <span className="text-rose-600 text-lg bg-rose-50 px-2 py-1 rounded-md mx-1 border border-rose-100" style={{ fontWeight: 700 }}>1,000円</span> を徴収させていただきます。<br />
                  <span className="text-sm text-gray-500 mt-5 block flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100" style={{ fontWeight: 600 }}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    お支払いは1度きりです。当サークルの年会費はありません。
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Grid Section for Contact & Activities */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Contact Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 transition-transform hover:-translate-y-2 duration-500"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>お問い合わせ・SNS</h2>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              入会のご連絡・ご質問はこちらの窓口からお願いいたします。
            </p>
            <div className="space-y-4">
              <a href={SOCIAL_LINKS.twitter.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition duration-300 group">
                <div className="bg-black text-white p-2.5 rounded-xl group-hover:scale-110 shadow-sm transition-transform duration-300">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-gray-900" style={{ fontWeight: 700 }}>{SOCIAL_LINKS.twitter.label}</div>
                  <div className="text-sm text-gray-500">{SOCIAL_LINKS.twitter.handle}</div>
                </div>
              </a>
              <a href={SOCIAL_LINKS.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition duration-300 group">
                <div className="bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white p-2.5 rounded-xl group-hover:scale-110 shadow-sm transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round"></line>
                  </svg>
                </div>
                <div>
                  <div className="text-gray-900" style={{ fontWeight: 700 }}>{SOCIAL_LINKS.instagram.label}</div>
                  <div className="text-sm text-gray-500">{SOCIAL_LINKS.instagram.handle}</div>
                </div>
              </a>
              <a href={`mailto:${SOCIAL_LINKS.email.address}`} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition duration-300 group">
                <div className="bg-emerald-500 text-white p-2.5 rounded-xl group-hover:scale-110 shadow-sm transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-900" style={{ fontWeight: 700 }}>{SOCIAL_LINKS.email.label}</div>
                  <div className="text-sm text-gray-500">{SOCIAL_LINKS.email.address.split('@')[0]}</div>
                </div>
              </a>
            </div>
          </motion.section>

          {/* About Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl shadow-xl p-8 md:p-10 text-white relative overflow-hidden transition-transform hover:-translate-y-2 duration-500"
          >
            {/* Background decoration */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-teal-400/30 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl" style={{ fontWeight: 700 }}>サークルの活動内容</h2>
              </div>
              <div className="text-emerald-50 mb-10 flex-grow leading-relaxed space-y-4">
                <p>
                  私たちDigitartが普段どのような活動を行っているか、過去の制作物やイベントの様子などはAboutページに詳しくまとめています。
                </p>
                <p>
                  入会をご検討中の方はぜひ一度ご覧ください！
                </p>
              </div>
              
              <Link href="/about" aria-label="詳しくはこちら" className="inline-flex items-center justify-center w-full bg-white text-emerald-800 py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-emerald-50 transition duration-300 group" style={{ fontWeight: 700 }}>
                詳しくはこちら
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.section>
          
        </div>

      </div>
    </div>
  );
}
