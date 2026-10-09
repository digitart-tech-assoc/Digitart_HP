"use client";

import { MotionConfig } from "motion/react";

/**
 * prefers-reduced-motion を尊重するプロバイダー。
 * ユーザーが「アニメーションを減らす」設定にしている場合、
 * Motion のアニメーションを自動的に無効化する。
 */
export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
