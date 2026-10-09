import { ExternalLink } from "lucide-react";
import * as motion from "motion/react-client";

import { JoinUsSection } from "@/components/sections/JoinUsSection";
import { PageHero } from "@/components/sections/PageHero";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ANNUAL_EVENTS, REGULAR_ACTIVITIES } from "@/features/events/data";
import { countEventsByMonth, monthBgClass, monthTextClass } from "@/features/events/monthCounts";

/** 譛医＃縺ｨ縺ｮ繧､繝吶Φ繝域焚・医せ繧ｱ繧ｸ繝･繝ｼ繝ｫ縺ｮ譛医ヰ繝ｼ縺ｮ濶ｲ蛻・￠縺ｫ菴ｿ縺・ｼ・*/
const MONTH_COUNTS = countEventsByMonth(ANNUAL_EVENTS);

/** 蟷ｴ蠎ｦ縺ｮ荳ｦ縺ｳ鬆・ｼ・譛亥ｧ九∪繧奇ｼ・*/
const FISCAL_MONTHS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

export function EventsPage() {
  return (
    <div className="bg-white">
      <PageHero
        title="蟷ｴ髢楢｡御ｺ・
        subtitle="荳蟷ｴ繧帝壹＠縺ｦ螳滓命縺輔ｌ繧九う繝吶Φ繝医ｒ縺皮ｴｹ莉・
        backHref="/about"
      />

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
            Digitart縺ｧ縺ｯ蟷ｴ髢薙ｒ騾壹§縺ｦ縺輔∪縺悶∪縺ｪ繧､繝吶Φ繝医ｒ髢句ぎ縺励※縺・∪縺吶・            <br />
            繝上ャ繧ｫ繧ｽ繝ｳ縺九ｉ蟄ｦ蝨堤･ｭ蜃ｺ螻輔´T螟ｧ莨壹∪縺ｧ縲・            <br className="hidden md:block" />
            繝・け繝弱Ο繧ｸ繝ｼ繧呈･ｽ縺励・讖滉ｼ壹′逶帙ｊ縺縺上＆繧薙〒縺吶・          </motion.p>
        </div>
      </section>

      {/* Annual Timeline Visual */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex items-center gap-3"
          >
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <h2 className="text-3xl text-gray-900 md:text-4xl" style={{ fontWeight: 700 }}>
              繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ
            </h2>
          </motion.div>

          {/* Month Bar */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 hidden items-center gap-1 px-4 md:flex"
          >
            {FISCAL_MONTHS.map((m) => {
              const count = MONTH_COUNTS[m];
              const barClass = monthBgClass(count);
              const textClass = monthTextClass(count);
              return (
                <div key={m} className="flex-1 text-center">
                  <div className={`mx-0.5 h-2 rounded-full ${barClass}`} />
                  <span
                    className={`mt-2 block text-xs ${textClass}`}
                    style={count > 0 ? { fontWeight: 600 } : {}}
                  >
                    {m}譛・                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Event Cards */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl space-y-8">
          {ANNUAL_EVENTS.map((event, i) => (
            <motion.div
              key={`${event.month}-${i}`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="group"
            >
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
                {/* Collapsed View */}
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative flex-shrink-0 overflow-hidden md:w-72 lg:w-80">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full"
                    />
                    <div className="absolute top-4 left-4 rounded-xl bg-white/95 px-4 py-2 shadow-sm backdrop-blur-sm">
                      <span className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
                        {event.month}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span
                          className={`mb-3 inline-block rounded-full px-3 py-1 text-xs ${event.tagColor}`}
                          style={{ fontWeight: 600 }}
                        >
                          {event.season}
                        </span>
                        <h3
                          className="mb-3 text-xl text-gray-900 md:text-2xl"
                          style={{ fontWeight: 700 }}
                        >
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 md:line-clamp-2">{event.desc}</p>
                        {event.url && event.url !== "null" && (
                          <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-emerald-600 transition-colors hover:text-emerald-700"
                            style={{ fontWeight: 600 }}
                          >
                            驕主悉縺ｮ繝ｬ繝昴・繝・                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Regular Activities */}
      <section className="bg-emerald-50/60 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl text-gray-900 md:text-4xl" style={{ fontWeight: 700 }}>
              螳壻ｾ区ｴｻ蜍・            </h2>
            <p className="text-gray-600">繧､繝吶Φ繝井ｻ･螟悶↓繧ゅ∵律蟶ｸ逧・↓豢ｻ蜍輔＠縺ｦ縺・∪縺吶・/p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {REGULAR_ACTIVITIES.map((act, i) => (
              <motion.div
                key={act.label}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <act.icon className="mx-auto mb-4 h-10 w-10 text-emerald-500" />
                <h4 className="mb-2 text-lg text-gray-900" style={{ fontWeight: 700 }}>
                  {act.label}
                </h4>
                <p className="text-sm text-gray-500">{act.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <JoinUsSection />
    </div>
  );
}
