import { ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";

/** 蜈･莨壽｡亥・縺ｨ縺雁撫縺・粋繧上○縺ｸ隱伜ｰ弱☆繧九√・繝ｼ繧ｸ譛ｫ蟆ｾ縺ｮ蜈ｱ騾壹そ繧ｯ繧ｷ繝ｧ繝ｳ */
export function JoinUsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 px-6 py-24 md:py-32">
      {/* Decorative background element */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-1/2 translate-x-1/4 -skew-x-12 bg-brand/10" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Eyebrow className="mb-3">Contact</Eyebrow>
          <h2 className="mb-8 text-4xl font-black text-white md:text-6xl">Join Us</h2>
          <p className="mb-12 text-base leading-relaxed font-medium text-slate-300 md:text-xl">
            邨碁ｨ薙ｄ繧ｹ繧ｭ繝ｫ縺ｯ蝠上＞縺ｾ縺帙ｓ縲ゅユ繧ｯ繝弱Ο繧ｸ繝ｼ縺ｫ闊亥袖縺後≠繧後・縲∬ｪｰ縺ｧ繧よｭ楢ｿ弱＠縺ｾ縺吶・          </p>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <Link
              href="/join"
              className="inline-flex min-w-52 items-center justify-center gap-3 rounded-full bg-brand px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(140,198,63,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-hover"
            >
              蜈･莨壽｡亥・
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://auth.digitart.jp/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-52 items-center justify-center gap-3 rounded-full border-2 border-white/20 bg-transparent px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              縺雁撫縺・粋繧上○
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
