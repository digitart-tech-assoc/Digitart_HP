import { Logo } from "@/components/ui/Logo";

/**
 * トップページを開いたときに全画面で表示するロゴアニメーション。
 * ロゴを表示 → 拡大 → フェードアウトの流れを CSS アニメーション（globals.css の .home-intro）だけで行うため、
 * サーバーで描画でき、JS の読み込みを待たずに始まり、JS がなくても最後には消える。
 * 次の場合は表示しない（CSS で非表示にする）。
 * - 同じセッションですでに表示した（<html data-intro-seen>）
 * - 視差効果を減らす設定（prefers-reduced-motion: reduce）
 * 背景色は OS のダークモード設定に合わせる。
 */
export function HomeHeroIntro() {
  return (
    <div
      className="home-intro pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#222]"
      aria-hidden="true"
    >
      <div className="home-intro-logo">
        <Logo size={120} className="block" />
      </div>
    </div>
  );
}
