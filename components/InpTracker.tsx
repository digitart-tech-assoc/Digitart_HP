"use client";

import { useEffect } from 'react';
import { onINP } from 'web-vitals';

export default function InpTracker() {
  useEffect(() => {
    // INPを計測してコンソールに出力
    onINP((metric) => {
      console.log('===== INP計測結果 =====');
      console.log(`数値: ${metric.value} ms`);
      console.log(`対象要素:`, metric.entries[0]?.target);
      console.log('=====================');
    }, { reportAllChanges: true });
}, []);

  return null; // 画面には何も表示しないためnullを返す
}