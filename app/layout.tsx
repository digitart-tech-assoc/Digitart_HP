import { Geist, Geist_Mono } from "next/font/google";

import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

import type { Metadata } from "next";
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
  keywords: [
    "青学",
    "青山学院大学",
    "サークル",
    "プログラミング",
    "ゲーム",
    "ゲーム開発",
    "AI",
    "機械学習",
    "テクノロジー",
    "学生団体",
    "Digitart",
  ],
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
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased selection:bg-emerald-100`}
      >
        {children}
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "ec137f383473422da320b985a577919c"}'
        ></script>
      </body>
    </html>
  );
}
