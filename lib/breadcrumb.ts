import { NAV_LINKS, type NavItem } from "@/lib/constants";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

/** ナビゲーションの定義から作る「パス → 表示名」の対応表。ページ名の管理を NAV_LINKS に一本化する */
function collectLabels(items: NavItem[], labels = new Map<string, string>()) {
  for (const item of items) {
    if (item.href.startsWith("/")) labels.set(item.href, item.label);
    if (item.children) collectLabels(item.children, labels);
  }
  return labels;
}

const NAV_LABELS = collectLabels(NAV_LINKS);

/**
 * パスのセグメントからパンくずリストの項目を作る。
 * 途中の階層は NAV_LINKS にあるものだけを入れる（/sagamihara-fes のように、ページのない階層は飛ばす）。
 * 最後の項目は currentLabel（記事タイトルなど）があればそれを使い、なければ NAV_LINKS から引く。
 */
export function generateBreadcrumbs(
  segments: string[],
  siteUrl: string,
  currentLabel?: string,
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ name: NAV_LABELS.get("/") ?? "Home", url: siteUrl }];

  let currentPath = "";
  segments.forEach((segment, i) => {
    currentPath += `/${segment}`;
    const isLast = i === segments.length - 1;
    const name =
      (isLast && currentLabel) || NAV_LABELS.get(currentPath) || (isLast ? segment : undefined);
    if (name) breadcrumbs.push({ name, url: `${siteUrl}${currentPath}` });
  });

  return breadcrumbs;
}
