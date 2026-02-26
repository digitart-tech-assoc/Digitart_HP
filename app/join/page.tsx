import Link from 'next/link';

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12 lg:p-24 selection:bg-blue-200">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            Join <span className="text-blue-600">Digitart</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Digitartテクノロジー愛好会に興味を持っていただきありがとうございます！<br className="hidden md:block" />
            当サークルへの入会方法や、各種お問い合わせについてはこちらをご覧ください。
          </p>
        </section>

        {/* How to Join Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">入会方法</h2>
          </div>
          
          <div className="space-y-6 relative">
            {/* 接続線 */}
            <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-slate-200 hidden md:block"></div>

            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row gap-4 md:gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm relative z-10">1</div>
              <div className="flex-grow bg-slate-50 rounded-2xl p-6 border border-slate-200 w-full hover:shadow-md transition-shadow">
                <h3 className="font-bold text-xl text-slate-900 mb-2">SNSでDMを送信</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  当サークルの公式SNS（<a href="https://x.com/PiedPiper_AGU" target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-600 font-bold underline decoration-sky-200 hover:decoration-sky-500 underline-offset-4 transition-all">X (Twitter)</a> または <a href="https://www.instagram.com/piedpiper_aoyama" target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-600 font-bold underline decoration-pink-200 hover:decoration-pink-500 underline-offset-4 transition-all">Instagram</a>）へ、入会希望の旨を記載してDMをお送りください。
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row gap-4 md:gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm relative z-10">2</div>
              <div className="flex-grow bg-slate-50 rounded-2xl p-6 border border-slate-200 w-full hover:shadow-md transition-shadow">
                <h3 className="font-bold text-xl text-slate-900 mb-2">担当者からのDiscord招待リンクの送信</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  担当者より当サークルへのDiscordサーバ招待リンクをお送りいたします。サーバに参加していただくことで、仮入会となります。
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row gap-4 md:gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm relative z-10">3</div>
              <div className="flex-grow bg-slate-50 rounded-2xl p-6 border border-slate-200 w-full hover:shadow-md transition-shadow">
                <h3 className="font-bold text-xl text-slate-900 mb-2">正式入会・入会費の納入</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  正式に入会される際、入会費として <span className="font-bold text-rose-500 text-lg bg-rose-50 px-2 py-1 rounded-md mx-1 border border-rose-100">1,000円</span> を徴収させていただきます。<br />
                  <span className="text-sm text-slate-500 mt-4 block font-semibold flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    お支払いは1度きりです。当サークルの年会費はありません。
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Grid Section for Contact & Activities */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Contact Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">お問い合わせ・SNS</h2>
            </div>
            <p className="text-slate-600 mb-8 font-medium leading-relaxed">
              入会のご連絡・ご質問はこちらの窓口からお願いいたします。
            </p>
            <div className="space-y-4">
              <a href="https://x.com/PiedPiper_AGU" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-300 hover:shadow-md transition-all group">
                <div className="bg-black text-white p-2.5 rounded-xl group-hover:scale-110 shadow-sm transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-900">X (Twitter)</div>
                  <div className="text-sm text-slate-500 font-medium">@PiedPiper_AGU</div>
                </div>
              </a>
              <a href="https://www.instagram.com/piedpiper_aoyama" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-300 hover:shadow-md transition-all group">
                <div className="bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white p-2.5 rounded-xl group-hover:scale-110 shadow-sm transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round"></line>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Instagram</div>
                  <div className="text-sm text-slate-500 font-medium">@piedpiper_aoyama</div>
                </div>
              </a>
              <a href="mailto:aoyama.tech.exe@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-300 hover:shadow-md transition-all group">
                <div className="bg-blue-500 text-white p-2.5 rounded-xl group-hover:scale-110 shadow-sm transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-900">メールアドレス</div>
                  <div className="text-sm text-slate-500 font-medium">aoyama.tech.exe</div>
                </div>
              </a>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-md p-8 text-white relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
            {/* Background decoration */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-400/30 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">サークルの活動内容</h2>
              </div>
              <div className="text-blue-100 mb-10 flex-grow leading-relaxed font-medium space-y-4">
                <p>
                  私たちDigitartが普段どのような活動を行っているか、過去の制作物やイベントの様子などはAboutページに詳しくまとめています。
                </p>
                <p>
                  入会をご検討中の方はぜひ一度ご覧ください！
                </p>
              </div>
              
              <div className="inline-flex items-center justify-center w-full bg-slate-300 text-slate-500 font-bold py-4 px-6 rounded-2xl shadow-inner cursor-not-allowed group">
                Aboutページは準備中です...
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </section>
          
        </div>

      </div>
    </main>
  );
}
