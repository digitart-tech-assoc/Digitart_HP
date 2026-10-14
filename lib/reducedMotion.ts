import { useSyncExternalStore } from "react";

/** OS の「視差効果を減らす」（アニメーションを減らす）設定 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** 今の時点で、視差効果を減らす設定になっているか。クリック時など、その場で一度だけ判定するときに使う */
export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * 視差効果を減らす設定になっているか。ページを開いたまま OS の設定を変えても追従する。
 * サーバーでは設定が分からないため false（アニメーションあり）として描画する。
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
