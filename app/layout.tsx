import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SOCIAL_LINKS } from "@/lib/constants";
import JsonLd from "@/components/JsonLd";
import InpTracker from "@/components/InpTracker";
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
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "デジタルト テクノロジー愛好会",
    url: SITE_URL,
    logo: `${SITE_URL}/images/digitart_OGP.jpg`,
    sameAs: [SOCIAL_LINKS.twitter.url, SOCIAL_LINKS.instagram.url],
  };

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200`}
      >
        <InpTracker />
        <JsonLd data={orgJsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
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
