import { HomeHeroBase } from "@/features/home/components/HomeHeroBase";
import { HomeHeroIntro } from "@/features/home/components/HomeHeroIntro";

/**
 * トップページのヒーロー。
 * 見出し・キャッチコピー・入会ボタンを初期 HTML に含めるため、サーバーで描画する。
 * 背景の 1 枚目の先読みは HomeHeroBase の画像に任せ、ここでは preload() を呼ばない
 * （ここで呼ぶと、他のページがトップページを先読みしただけで背景画像が読み込まれる）。
 */
export function HomeHero() {
  return (
    <>
      <HomeHeroIntro />
      <HomeHeroBase />
    </>
  );
}
