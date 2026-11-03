import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** 入会案内とお問い合わせへ誘導する、ページ末尾の共通セクション */
export function JoinUsSection() {
  return (
    <section className="relative overflow-clip bg-slate-900 px-6 py-24 md:py-32">
      {/* Decorative background element */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-1/2 translate-x-1/4 -skew-x-12 bg-brand/10" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="reveal">
          <Eyebrow className="mb-3">Contact</Eyebrow>
          <h2 className="mb-8 text-4xl font-black text-white md:text-6xl">Join Us</h2>
          <p className="mb-12 text-base leading-relaxed font-medium text-slate-300 md:text-xl">
            経験やスキルは問いません。テクノロジーに興味があれば、誰でも歓迎します。
          </p>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <ButtonLink href="/join" variant="primary" size="lg">
              入会案内
              <ArrowRight className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="https://auth.digitart.jp/contact" variant="outline-light" size="lg">
              お問い合わせ
              <ArrowRight className="h-5 w-5" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
