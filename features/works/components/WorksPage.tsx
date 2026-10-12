import { ExternalLink } from "lucide-react";
import * as motion from "motion/react-client";

import { JoinUsSection } from "@/components/sections/JoinUsSection";
import { PageHero } from "@/components/sections/PageHero";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { PROJECTS } from "@/features/works/data";

export function WorksPage() {
  return (
    <div className="bg-white">
      <PageHero
        title="作品紹介"
        subtitle="Digitartメンバーが生み出したプロジェクトの数々"
        backHref="/about"
      />

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
            プログラミング、デザイン、ハードウェアを横断するメンバーたちが、
            <br className="hidden md:block" />
            チームで生み出したプロジェクトの数々をご紹介します。
          </motion.p>
        </div>
      </section>

      {/* Projects */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-6xl space-y-20">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12`}
            >
              <div className="w-full flex-1">
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative overflow-hidden rounded-3xl shadow-xl"
                    >
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="aspect-[16/9] w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span
                          className="flex items-center gap-2 text-white"
                          style={{ fontWeight: 600 }}
                        >
                          View Project <ExternalLink className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="absolute top-4 left-4 rounded-full bg-brand px-3 py-1 text-sm font-bold tracking-wider text-white">
                        {project.category}
                      </div>
                    </motion.div>
                  </a>
                ) : (
                  <div className="block">
                    <div className="relative overflow-hidden rounded-3xl shadow-xl">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="aspect-[16/9] w-full object-cover"
                      />
                      <div className="absolute top-4 left-4 rounded-full bg-brand px-3 py-1 text-sm font-bold tracking-wider text-white">
                        {project.category}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="mb-4 text-3xl leading-tight font-black text-slate-900 md:text-4xl">
                  {project.title}
                </h3>
                <p className="mb-6 text-lg leading-relaxed font-medium text-slate-600 md:text-xl">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <JoinUsSection />
    </div>
  );
}
