import { preload } from "react-dom";

import { HomeHeroBase } from "@/features/home/components/HomeHeroBase";
import { HomeHeroIntro } from "@/features/home/components/HomeHeroIntro";
import { HERO_SLIDES } from "@/features/home/data";

/**
 * トップページのヒーロー。
 * 見出し・キャッチコピー・入会ボタンを初期 HTML に含めるため、サーバーで描画する。
 */
export function HomeHero() {
  // 背景は CSS の background-image で読み込むため、1 枚目だけは HTML の読み込み直後から取得を始める
  preload(HERO_SLIDES[0], { as: "image", fetchPriority: "high" });

  return (
    <>
      <HomeHeroIntro />
      <HomeHeroBase />
    </>
  );
}
