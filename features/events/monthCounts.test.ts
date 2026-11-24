import { describe, expect, it } from "vitest";

import { countEventsByMonth, parseMonths } from "@/features/events/monthCounts";

describe("parseMonths", () => {
  it.each([
    ["4月", [4]],
    ["6-7月", [6, 7]],
    ["12月, 1月", [12, 1]],
    ["8〜9月", [8, 9]],
    // 年をまたぐ範囲
    ["11-2月", [11, 12, 1, 2]],
    ["未定", []],
  ])("%s を月の番号にする", (month, expected) => {
    expect(parseMonths(month)).toEqual(expected);
  });
});

describe("countEventsByMonth", () => {
  it("範囲に含まれる月すべてに 1 件ずつ数える", () => {
    const counts = countEventsByMonth([{ month: "4-5月" }, { month: "5月" }]);

    expect(counts[4]).toBe(1);
    expect(counts[5]).toBe(2);
    expect(counts[6]).toBe(0);
    expect(Object.keys(counts)).toHaveLength(12);
  });
});
