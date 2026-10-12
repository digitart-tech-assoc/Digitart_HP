import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/** 背景の格子模様（SVG） */
const GRID_PATTERN =
  "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]";

type PageHeroProps = {
  title: string;
  subtitle: string;
  /** 「戻る」リンクの遷移先 */
  backHref: string;
};

/** About 配下のページで使う、緑のグラデーション背景の見出しエリア */
export function PageHero({ title, subtitle, backHref }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 px-6 pt-32 pb-20 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 ${GRID_PATTERN}`} />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Link>
        <h1
          className="mb-4 text-5xl motion-safe:animate-rise md:text-7xl"
          style={{ fontWeight: 700 }}
        >
          {title}
        </h1>
        <p className="text-xl text-white/90 motion-safe:animate-rise motion-safe:[animation-delay:200ms]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
