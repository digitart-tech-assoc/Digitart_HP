/**
 * 年間行事の「月」表記（"4月"、"6-7月"、"12月, 1月" など）を月の番号の配列に変換する。
 * "11-2月" のように年をまたぐ範囲にも対応する。
 */
export function parseMonths(month: string): number[] {
  const nums: number[] = [];
  for (const part of month.split(/[,、]/)) {
    const rangeMatch = part.match(/(\d+)\s*[-~〜]\s*(\d+)/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start <= end) {
        for (let i = start; i <= end; i++) nums.push(i);
      } else {
        for (let i = start; i <= 12; i++) nums.push(i);
        for (let i = 1; i <= end; i++) nums.push(i);
      }
    } else {
      const single = part.match(/(\d+)/);
      if (single) nums.push(parseInt(single[1], 10));
    }
  }
  return nums;
}

/** 月（1〜12）ごとのイベント数を数える */
export function countEventsByMonth(events: { month: string }[]): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 12; i++) counts[i] = 0;
  for (const event of events) {
    for (const m of parseMonths(event.month)) {
      counts[m] = (counts[m] ?? 0) + 1;
    }
  }
  return counts;
}

/** イベント数に応じた月バーの背景色（多いほど濃い緑） */
export function monthBgClass(count: number) {
  if (count <= 0) return "bg-gray-100";
  if (count === 1) return "bg-emerald-200";
  if (count === 2) return "bg-emerald-400";
  if (count === 3) return "bg-emerald-600";
  return "bg-emerald-800";
}

/** イベント数に応じた月ラベルの文字色 */
export function monthTextClass(count: number) {
  if (count <= 0) return "text-gray-400";
  if (count === 1) return "text-emerald-600";
  if (count === 2) return "text-emerald-700";
  return "text-emerald-900";
}
