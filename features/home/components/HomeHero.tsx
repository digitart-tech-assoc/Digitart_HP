import { HomeHeroBase } from "@/features/home/components/HomeHeroBase";
import { HomeHeroIntro } from "@/features/home/components/HomeHeroIntro";

/**
 * トップページのヒーロー。
 * 見出し・キャッチコピー・入会ボタンを初期 HTML に含めるため、サーバーで描画する。
 */
export function HomeHero() {
  /*
   * 背景の 1 枚目は、HomeHeroBase の <img fetchPriority="high"> で読み込む。
   * ここ（サーバーコンポーネント）で preload() を呼ぶと、ヒントが RSC ペイロードに入る。
   * すると、ヘッダーのロゴのリンクが / を先読みしたときに、ヒーローを表示しないページでも画像が読み込まれてしまう
   */
  return (
    <>
      <HomeHeroIntro />
      <HomeHeroBase />
    </>
  );
}
