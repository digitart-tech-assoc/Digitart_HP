import { Quote } from "lucide-react";

import { JoinUsSection } from "@/components/sections/JoinUsSection";
import { PageHero } from "@/components/sections/PageHero";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { MEMBERS, QA } from "@/features/supporters/data";

export function SupportersPage() {
  return (
    <div className="bg-white">
      <PageHero title="幹部紹介" subtitle="Digitartを支える人たち" backHref="/about" />

      {/* Intro */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="reveal text-lg leading-relaxed text-gray-600">
            Digitartにはどんなメンバーが集まっているのか？
            <br />
            Digitartを支える「人」にフォーカスします。
          </p>
        </div>
      </section>

      {/* Member Profiles */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl text-gray-900 md:text-4xl" style={{ fontWeight: 700 }}>
              第7期役員
            </h2>
          </div>
          {MEMBERS.map((member, i) => {
            return (
              <div
                key={member.name}
                className={`flex reveal flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12`}
              >
                <div className="flex-shrink-0">
                  <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-emerald-100 shadow-xl transition-transform duration-300 hover:scale-105 md:h-64 md:w-64">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <span className="text-sm text-emerald-500" style={{ fontWeight: 600 }}>
                    {member.year}
                  </span>
                  <h3 className="mt-1 mb-1 text-3xl text-gray-900" style={{ fontWeight: 700 }}>
                    {member.name}
                  </h3>
                  <p className="mb-6 text-emerald-600" style={{ fontWeight: 500 }}>
                    {member.role}
                  </p>
                  <div className="relative rounded-2xl bg-emerald-50 p-6">
                    <Quote className="absolute top-4 left-4 h-8 w-8 text-emerald-300" />
                    <p className="pt-2 pl-8 leading-relaxed text-gray-700 italic">{member.quote}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Q&A Section */}
      <section className="bg-emerald-50/60 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 reveal text-center">
            <h2 className="mb-4 text-4xl text-gray-900" style={{ fontWeight: 700 }}>
              Q&A
            </h2>
            <p className="text-gray-600">よくある質問</p>
          </div>

          <div className="space-y-6">
            {QA.map((item, i) => (
              <div key={i} className="reveal rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-start gap-4">
                  <span className="text-2xl text-emerald-500" style={{ fontWeight: 700 }}>
                    Q.{String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-xl text-gray-900" style={{ fontWeight: 600 }}>
                    {item.q}
                  </h4>
                </div>
                <p className="ml-14 leading-relaxed text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JoinUsSection />
    </div>
  );
}
