import * as motion from "motion/react-client";

import { JoinUsSection } from "@/components/sections/JoinUsSection";
import { PageHero } from "@/components/sections/PageHero";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { TIMELINE } from "@/features/history/data";

export function HistoryPage() {
  return (
    <div className="bg-white">
      <PageHero title="団体の歩み" subtitle="Digitartの挑戦の歴史" backHref="/about" />

      {/* Intro */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg leading-relaxed text-gray-600"
          >
            2019年に設立されたDigitartテクノロジー愛好会。
            わずか5名からスタートした団体が、どのように成長し、挑戦を続けてきたのか。
            ターニングポイントとなった出来事をお伝えします。
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-12 pb-32">
        <div className="relative mx-auto max-w-5xl">
          {/* Center line */}
          <div className="absolute top-0 bottom-0 left-6 w-0.5 transform bg-emerald-200 md:left-1/2 md:-translate-x-0.5" />

          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`relative mb-16 flex flex-col items-start gap-8 md:flex-row ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-6 z-10 h-4 w-4 -translate-x-2 transform rounded-full border-4 border-white bg-emerald-400 shadow-md md:left-1/2 md:-translate-x-2" />

              {/* Content */}
              <div
                className={`ml-14 flex-1 md:ml-0 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}
              >
                <span className="text-sm text-emerald-500" style={{ fontWeight: 600 }}>
                  {item.year}
                </span>
                <h3 className="mt-1 mb-3 text-2xl text-gray-900" style={{ fontWeight: 700 }}>
                  {item.title}
                </h3>
                <p className="leading-relaxed text-gray-600">{item.desc}</p>
              </div>

              {/* Image */}
              <div className={`ml-14 flex-1 md:ml-0 ${i % 2 === 0 ? "md:pl-16" : "md:pr-16"}`}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="overflow-hidden rounded-2xl shadow-lg"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="aspect-video w-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <JoinUsSection />
    </div>
  );
}
