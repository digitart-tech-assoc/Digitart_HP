import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/images/digitart_OGP.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/images/digitart_OGP.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200`}
      >

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "ec137f383473422da320b985a577919c"}'
        ></script>

        <header>
           <div className="logo">
            <img src="/logo.png" alt="Digitart Logo"><img />
           <h1>Digitart</h1>
           </div>
           <nav>
            <a href="/">ホーム</a>
            <a href="/about">サークル紹介</a>
            <a href="/activities">活動内容</a>
            <a href="/work">作品</a>
            <a href="/members">メンバー</a>
            <a href="/contact">お問い合わせ</a>
          </nav>
        </header>
      <main>
        {children}
      </main>

      <footer>
        <p>© 2026 Digitart</p>
        <p>青山学院大学 デジタルアートサークル</p>
      </footer>

      </body>
    </html>
  );
}
