export type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * パス文字列からBreadcrumbListアイテムを生成
 */
export function generateBreadcrumbs(pathname: string, siteUrl: string): BreadcrumbItem[] {
  // パスの正規化（末尾のスラッシュを削除）
  const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  // ホームは常に含める
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: "Home",
      url: siteUrl,
    },
  ];

  // / のみの場合はホームのみ返す
  if (normalizedPath === "/") {
    return breadcrumbs;
  }

  // パスを分割してBreadcrumbを構築
  const pathSegments = normalizedPath.split("/").filter(Boolean);

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // セグメントを人間が読める形式に変換
    const name = getDisplayName(segment);

    breadcrumbs.push({
      name,
      url: `${siteUrl}${currentPath}`,
    });
  });

  return breadcrumbs;
}

/**
 * URLセグメントを表示用の名前に変換
 */
function getDisplayName(segment: string): string {
  const segmentMap: Record<string, string> = {
    about: "About",
    events: "Events",
    works: "Works",
    history: "History",
    data: "Data",
    supporter: "Supporter",
    news: "News",
    join: "Join Us",
    bylaws: "Bylaws",
    contact: "Contact",
  };

  // スラッグ（記事IDなど）の場合は汎用的な名前を返す
  if (segmentMap[segment]) {
    return segmentMap[segment];
  }

  // 数字や特殊文字を含むスラッグは親のページ名を使用
  if (/^[\d\-]+/.test(segment)) {
    return "Article";
  }

  // キャメルケースやスネークケースをスペース区切りに
  return segment
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
