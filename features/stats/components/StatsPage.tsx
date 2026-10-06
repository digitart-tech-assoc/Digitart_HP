import { JoinUsSection } from "@/components/sections/JoinUsSection";
import { PageHero } from "@/components/sections/PageHero";
import { AnimatedNumber } from "@/features/stats/components/AnimatedNumber";
import { getStats } from "@/features/stats/stats";

export function StatsPage() {
  const { stats, breakdowns } = getStats();

  return (
    <div className="bg-white">
      <PageHero title="活動データ" subtitle="データで見るDigitart" backHref="/about" />

      {/* Intro */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="reveal text-lg leading-relaxed text-gray-600">
            Digitartにまつわるさまざまな「数字」をご紹介します。
            <br />
            団体の規模感や活動の広がりを、データでお伝えします。
          </p>
        </div>
      </section>

      {/* Big Numbers */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="reveal rounded-3xl bg-emerald-50 p-6 text-center md:p-10"
              >
                <p className="mb-2 text-sm text-emerald-600" style={{ fontWeight: 600 }}>
                  {stat.label}
                </p>
                <p className="text-4xl text-emerald-700 md:text-6xl" style={{ fontWeight: 700 }}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-xs text-gray-400">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakdowns */}
      <section className="px-6 py-20 pb-32">
        <div className="mx-auto max-w-5xl space-y-16">
          {breakdowns.map((section) => (
            <div className="reveal" key={section.title}>
              <div className="mb-8 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <h3 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
                  {section.title}
                </h3>
              </div>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="w-28 shrink-0 text-sm text-gray-600">{item.label}</span>
                    <div className="h-8 flex-1 overflow-clip rounded-full bg-gray-100">
                      <div
                        className="flex h-full reveal-bar items-center justify-end rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 pr-3"
                        style={{ width: `${item.pct}%` }}
                      >
                        <span className="text-xs text-white" style={{ fontWeight: 600 }}>
                          {item.pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <JoinUsSection />
    </div>
  );
}
