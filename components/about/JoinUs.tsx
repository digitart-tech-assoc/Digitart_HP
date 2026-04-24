"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function JoinUs() {
  return (
    <section className="relative py-24 md:py-32 px-6 bg-slate-900 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#8cc63f]/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-3">
            Contact
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Join Us
          </h2>
          <p className="text-base md:text-xl mb-12 text-slate-300 leading-relaxed font-medium">
            経験やスキルは問いません。テクノロジーに興味があれば、誰でも歓迎します。
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-3 bg-[#8cc63f] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#7ab135] transition-all duration-300 shadow-[0_0_30px_rgba(140,198,63,0.3)] hover:-translate-y-1 min-w-52"
            >
              入会案内
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://auth.digitart.jp/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-transparent text-white border-2 border-white/20 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 hover:border-white transition-all duration-300 min-w-52"
            >
              お問い合わせ
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
