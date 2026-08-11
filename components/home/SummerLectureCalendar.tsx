"use client";

import { useState, useEffect, useCallback } from "react";
import rawLectures from "@/lib/lectures.json";

interface Lecture {
  presenters: string[];
  title: string;
  datetime: string | null; // "MM/DD_HH:MM~HH:MM" or null（日程未定）
  notes?: string;
}

interface LectureWithDate extends Lecture {
  month: number;
  day: number;
  startTime: string;
  endTime: string;
}

// 表示期間
const SUMMER_START = { month: 8, day: 1 };
const SUMMER_END   = { month: 9, day: 13 };

// 輪講日の色情報
const GREEN = { day: "#ceffe0", bg: "#f7fff5", border: "#86efac", text: "#14562d", dot: "#22c55e" };

// JSONパース & ソート（datetime: null は日程未定として分離）
const undatedLectures: Lecture[] = (rawLectures as Lecture[]).filter((l) => l.datetime === null);

const lectures: LectureWithDate[] = (rawLectures as Lecture[])
  .filter((l): l is Lecture & { datetime: string } => l.datetime !== null)
  .map((l) => {
    const [datePart, timePart] = l.datetime.split("_");
    const [mm, dd] = datePart.split("/").map(Number);
    const [startTime, endTime] = timePart.split("~");
    return { ...l, month: mm, day: dd, startTime, endTime };
  })
  .sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    if (a.day   !== b.day)   return a.day   - b.day;
    return a.startTime.localeCompare(b.startTime);
  });

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function buildCalendarWeeks(): (Date | null)[][] {
  const year  = new Date().getFullYear();
  const start = new Date(year, SUMMER_START.month - 1, SUMMER_START.day);
  const end   = new Date(year, SUMMER_END.month   - 1, SUMMER_END.day);

  const startSunday = new Date(start);
  startSunday.setDate(start.getDate() - start.getDay());

  const endSaturday = new Date(end);
  endSaturday.setDate(end.getDate() + (6 - end.getDay()));

  const weeks: (Date | null)[][] = [];
  const cur = new Date(startSunday);

  while (cur <= endSaturday) {
    const week: (Date | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(cur);
      week.push(cell >= start && cell <= end ? cell : null);
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function getLecturesForDate(month: number, day: number): LectureWithDate[] {
  return lectures.filter((l) => l.month === month && l.day === day);
}

export default function SummerLectureCalendar() {
  const [selectedLectures, setSelectedLectures] = useState<LectureWithDate[]>([]);
  const [selectedDateLabel, setSelectedDateLabel] = useState("");
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // モーダル開閉アニメーション
  const openModal = (date: Date) => {
    const m    = date.getMonth() + 1;
    const d    = date.getDate();
    const lecs = getLecturesForDate(m, d);
    if (lecs.length === 0) return;
    setSelectedDateLabel(`${m}月${d}日（${WEEKDAYS[date.getDay()]}）`);
    setSelectedLectures(lecs);
    setIsModalOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsModalVisible(true)));
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setIsModalOpen(false), 250);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") closeModal();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 表示期間チェック
  const now   = new Date();
  const year  = now.getFullYear();
  const calStart = new Date(year, SUMMER_START.month - 1, SUMMER_START.day);
  const calEnd   = new Date(year, SUMMER_END.month   - 1, SUMMER_END.day, 23, 59, 59);
  if (now < calStart || now > calEnd) return null;

  const weeks = buildCalendarWeeks();

  return (
    <>
      {/* セクションヘッダー */}
      <div className="mb-8 md:mb-10">
        <h3 className="text-xl md:text-3xl font-black text-slate-800 mb-1">スケジュール</h3>
        <p className="text-sm text-slate-500">
          8月1日〜9月13日｜輪講のある日をクリックすると詳細が見られます
        </p>
      </div>

      {/* カレンダー */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[480px]">
          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((wd, i) => (
              <div
                key={wd}
                className="text-center text-xs font-bold py-2 rounded-t"
                style={{
                  color:      i === 0 ? "#dc2626" : i === 6 ? "#2563eb" : "#64748b",
                  background: i === 0 ? "#fef2f2" : i === 6 ? "#eff6ff" : "#f8fafc",
                }}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* 週ごとの行 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 border-b border-slate-100 last:border-b-0">
                {week.map((date, di) => {
                  if (!date) {
                    return (
                      <div
                        key={di}
                        className="min-h-[80px] md:min-h-[100px] border-r border-slate-100 last:border-r-0 bg-slate-50/50"
                      />
                    );
                  }

                  const m           = date.getMonth() + 1;
                  const d           = date.getDate();
                  const dayLectures = getLecturesForDate(m, d);
                  const hasLectures = dayLectures.length > 0;
                  const isToday     = date.toDateString() === new Date().toDateString();
                  const isSun       = date.getDay() === 0;
                  const isSat       = date.getDay() === 6;

                  return (
                    <div
                      key={di}
                      onClick={() => hasLectures && openModal(date)}
                      className="border-r border-slate-100 last:border-r-0 p-1 md:p-1.5 transition-colors duration-150"
                      style={{
                        minHeight: "80px",
                        cursor:     hasLectures ? "pointer" : "default",
                        background: isSun ? "#fef2f2" : isSat ? "#eff6ff" : "#ffffff",
                      }}
                      role={hasLectures ? "button" : undefined}
                      aria-label={hasLectures ? `${m}/${d}の輪講を見る` : undefined}
                      onMouseEnter={(e) => {
                        if (hasLectures)
                          (e.currentTarget as HTMLDivElement).style.background = GREEN.day;
                      }}
                      onMouseLeave={(e) => {
                        if (hasLectures)
                          (e.currentTarget as HTMLDivElement).style.background =
                            isSun ? "#fef2f2" : isSat ? "#eff6ff" : "#ffffff";
                      }}
                    >
                      {/* 日付番号 */}
                      <div className="mb-1">
                        <span
                          className="text-xs md:text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full"
                          style={{
                            color:      isToday ? "#fff" : isSun ? "#dc2626" : isSat ? "#2563eb" : "#334155",
                            background: isToday ? GREEN.dot : "transparent",
                          }}
                        >
                          {d}
                        </span>
                      </div>

                      {/* 輪講タイトルチップ */}
                      <div className="flex flex-col gap-0.5">
                        {dayLectures.map((lec, li) => (
                          <div
                            key={li}
                            className="rounded px-1 py-0.5 text-[10px] md:text-xs leading-snug font-medium whitespace-normal break-words"
                            style={{
                              background:  GREEN.bg,
                              color:       GREEN.text,
                              border:      `2px dotted ${GREEN.border}`
                            }}
                          >
                            {lec.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 凡例 */}
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: GREEN.bg, border: `2px solid ${GREEN.dot}` }} />
              輪講開催日
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: GREEN.dot }} />
              今日
            </span>
          </div>
        </div>
      </div>

      {/* 日程未定の輪講 */}
      {undatedLectures.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3">日程未定</p>
          <div className="flex flex-col gap-2">
            {undatedLectures.map((lec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: GREEN.bg, border: `2px dotted ${GREEN.border}` }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-bold leading-snug break-words"
                    style={{ color: GREEN.text }}
                  >
                    {lec.title}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: GREEN.text, opacity: 0.7 }}>
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {lec.presenters.join("・")}
                  </p>
                  {lec.notes && (
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: GREEN.text, opacity: 0.7 }}>
                      {lec.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* モーダル */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background:    `rgba(15,23,42,${isModalVisible ? "0.55" : "0"})`,
            backdropFilter: isModalVisible ? "blur(4px)" : "none",
            transition:    "background 0.25s ease, backdrop-filter 0.25s ease",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{
              background:  "#fff",
              opacity:     isModalVisible ? 1 : 0,
              transform:   isModalVisible ? "translateY(0)" : "translateY(12px)",
              transition:  "opacity 0.25s ease, transform 0.25s ease",
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* モーダルヘッダー */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100"
              style={{ background: GREEN.bg }}
            >
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-0.5">
                  Lecture Schedule
                </p>
                <h4 className="text-xl font-black text-slate-800">{selectedDateLabel}</h4>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-green-100 hover:text-green-700 transition-colors"
                aria-label="閉じる"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 輪講一覧 */}
            <div className="px-6 py-5 flex flex-col gap-5">
              {selectedLectures.map((lec, li) => (
                <div
                  key={li}
                  className="rounded-xl p-4 border"
                  style={{ background: GREEN.bg, border: `2px dotted ${GREEN.border}` }}
                >
                  <h5
                    className="text-base md:text-lg font-black leading-snug mb-3"
                    style={{ color: GREEN.text }}
                  >
                    {lec.title}
                  </h5>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {/* 時間 */}
                    <div className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 opacity-70" fill="none" stroke={GREEN.dot} strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
                      </svg>
                      <span style={{ color: GREEN.text }}>
                        <span className="font-bold">{lec.startTime}</span>
                        <span className="mx-1 opacity-60">〜</span>
                        <span className="font-bold">{lec.endTime}</span>
                      </span>
                    </div>

                    {/* スピーカー */}
                    <div className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 opacity-70" fill="none" stroke={GREEN.dot} strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span style={{ color: GREEN.text }}>
                        {lec.presenters.join("・")}
                      </span>
                    </div>

                    {/* 補足 */}
                    {lec.notes && (
                      <div className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 mt-0.5 shrink-0 opacity-60" fill="none" stroke={GREEN.dot} strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs leading-relaxed" style={{ color: GREEN.text }}>
                          {lec.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
