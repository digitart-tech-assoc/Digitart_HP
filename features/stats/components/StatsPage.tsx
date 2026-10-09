import * as motion from "motion/react-client";

import { JoinUsSection } from "@/components/sections/JoinUsSection";
import { PageHero } from "@/components/sections/PageHero";
import { AnimatedNumber } from "@/features/stats/components/AnimatedNumber";
import { STATS, BREAKDOWNS } from "@/features/stats/data";

export function StatsPage() {
  return (
    <div className="bg-white">
      <PageHero title="活動データ" subtitle="データで見るDigitart" backHref="/about" />

      {/* Intro */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg leading-relaxed text-gray-600"
          >
            Digitartにまつわるさまざまな「数字」をご紹介します。
            <br />
            団体の規模感や活動の広がりを、データでお伝えします。
          </motion.p>
        </div>
      </section>

      {/* Big Numbers */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-3xl bg-emerald-50 p-6 text-center md:p-10"
              >
                <p className="mb-2 text-sm text-emerald-600" style={{ fontWeight: 600 }}>
                  {stat.label}
                </p>
                <p className="text-4xl text-emerald-700 md:text-6xl" style={{ fontWeight: 700 }}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-xs text-gray-400">{stat.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakdowns */}
      <section className="px-6 py-20 pb-32">
        <div className="mx-auto max-w-5xl space-y-16">
          {BREAKDOWNS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <h3 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
                  {section.title}
                </h3>
              </div>
              <div className="space-y-4">
                {section.items.map((item, ii) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="w-28 shrink-0 text-sm text-gray-600">{item.label}</span>
                    <div className="h-8 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        initial={false}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: si * 0.2 + ii * 0.1,
                        }}
                        className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 pr-3"
                      >
                        <span className="text-xs text-white" style={{ fontWeight: 600 }}>
                          {item.pct}%
                        </span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <JoinUsSection />
    </div>
  );
}
