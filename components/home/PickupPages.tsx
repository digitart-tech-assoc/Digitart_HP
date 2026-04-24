import Link from "next/link";
import Image, { StaticImageData } from "next/image";

type PickupItem = {
  href: string;
  en: string;
  ja: string;
  desc: string;
  image: StaticImageData;
  imagePosition?: string;
};

export default function PickupPages({ items }: { items: PickupItem[] }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className="group relative min-h-[180px] md:min-h-[210px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className={`absolute inset-0 bg-cover ${item.imagePosition ?? "bg-center"} transition-transform duration-500 group-hover:scale-105`}
              style={{ backgroundImage: `url(${item.image.src})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/62 via-slate-900/48 to-emerald-900/52 group-hover:from-slate-900/55 group-hover:to-emerald-800/45 transition-colors duration-300" />
            <div className="relative flex items-start justify-between gap-4 p-5 md:p-6 h-full">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/60">{item.en}</p>
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{item.ja}</h3>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">{item.desc}</p>
              </div>
              <svg
                className="w-5 h-5 text-[#8cc63f] shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
