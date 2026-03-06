import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();
  // 左列に Home と About を固定配置し、残りを右列に配置する
  const leftKeys = ["/", "/about"];
  const left = leftKeys.map((k) => NAV_LINKS.find((l) => l.href === k)).filter(Boolean) as any[];
  const right = NAV_LINKS.filter((l) => !leftKeys.includes(l.href));
  const cols = [left, right];

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ブランド */}
        <div className="col-span-1">
          <h3 className="text-white text-lg font-semibold">{SITE_NAME}</h3>
          <p className="mt-2 text-sm text-slate-400">青山学院大学公認学生団体</p>
          <p className="text-sm text-slate-400">Digitart テクノロジー愛好会</p>
        </div>

        {/* サイトマップ */}
        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold text-white mb-3">サイトマップ</h4>
          <div className="flex gap-6">
            <ul className="flex-1 space-y-2 text-sm">
              {cols[0].map((link: any) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-300 hover:text-white">
                    {link.label}
                  </Link>
                  {link.children?.length ? (
                    <ul className="mt-1 ml-3 space-y-1 text-sm">
                      {link.children.map((c: any) => (
                        <li key={c.href}>
                          <Link href={c.href} className="text-slate-400 hover:text-white">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>

            <ul className="flex-1 space-y-2 text-sm">
              {cols[1].map((link: any) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-300 hover:text-white">
                    {link.label}
                  </Link>
                  {link.children?.length ? (
                    <ul className="mt-1 ml-3 space-y-1 text-sm">
                      {link.children.map((c: any) => (
                        <li key={c.href}>
                          <Link href={c.href} className="text-slate-400 hover:text-white">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 連絡先 */}
        <div className="col-span-1">
          <h4 className="text-sm font-semibold text-white mb-3">連絡先</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            {SOCIAL_LINKS.twitter && (
              <li>
                <a href={SOCIAL_LINKS.twitter.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {SOCIAL_LINKS.twitter.label} {SOCIAL_LINKS.twitter.handle ? `(${SOCIAL_LINKS.twitter.handle})` : ""}
                </a>
              </li>
            )}
            {SOCIAL_LINKS.instagram && (
              <li>
                <a href={SOCIAL_LINKS.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {SOCIAL_LINKS.instagram.label} {SOCIAL_LINKS.instagram.handle ? `(${SOCIAL_LINKS.instagram.handle})` : ""}
                </a>
              </li>
            )}
            {SOCIAL_LINKS.email && (
              <li>
                <a href={`mailto:${SOCIAL_LINKS.email.address}`} className="hover:text-white">
                  {SOCIAL_LINKS.email.label}: {SOCIAL_LINKS.email.address}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* コピーライト */}
      <div className="border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        &copy; {year} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
