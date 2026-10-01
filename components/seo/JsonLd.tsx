type JsonLdProps = {
  /** schema.org 形式の構造化データ */
  data: Record<string, unknown>;
};

/**
 * 構造化データ（JSON-LD）を <script type="application/ld+json"> として出力する。
 * サーバーで HTML に含めるため、検索エンジンのクローラーが JavaScript を実行しなくても読み取れる。
 */
export function JsonLd({ data }: JsonLdProps) {
  // "</script>" などで script タグが途中で閉じられないよう、< をエスケープする
  const json = JSON.stringify(data).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
