"use client";

import type { ComponentProps, MouseEvent } from "react";

type SmoothScrollLinkProps = Omit<ComponentProps<"a">, "href"> & {
  /** 移動先の要素の id（# は付けない） */
  targetId: string;
};

/**
 * 同じページ内の見出しへスクロールで移動するリンク。
 * html 全体に scroll-behavior: smooth を付けるとページ遷移時にも効いてしまうため、このリンクだけで制御する。
 */
export function SmoothScrollLink({ targetId, onClick, ...rest }: SmoothScrollLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    // 視差効果を減らす設定の人には、アニメーションせずに移動する
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 位置は移動先の scroll-margin-top（固定ヘッダーの高さ分）を考慮して決まる
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    // URL にも #id を残し、共有やブラウザの戻る操作で同じ位置に来られるようにする
    window.history.pushState(null, "", `#${targetId}`);
  };

  return <a href={`#${targetId}`} onClick={handleClick} {...rest} />;
}
