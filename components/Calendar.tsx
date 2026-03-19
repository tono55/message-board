'use client';

import { useEffect, useState } from 'react';
import { Item, SchoolMode } from '@/lib/types';
import { getMonthDays, getTwoWeekDays, getWeekStart, toDateString, CATEGORY_COLORS, trimLeadingDateLabel, formatDate, daysUntil } from '@/lib/utils';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MODE_BADGE: Record<string, string> = {
  nursery: 'bg-orange-100 text-orange-600',
  elementary: 'bg-blue-100 text-blue-600',
};
const MODE_LABEL: Record<string, string> = {
  nursery: '保育園',
  elementary: '小学校',
};
const MODE_FILTER_OPTIONS: { value: SchoolMode | ''; label: string }[] = [
  { value: '', label: 'すべて' },
  { value: 'nursery', label: '保育園' },
  { value: 'elementary', label: '小学校' },
];

type CalendarView = '2weeks' | 'month';
type DetailView = 'date' | 'soon';

interface CalendarProps {
  items: Item[];
  mode: SchoolMode;
  currentMonth: Date;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onChangeMonth: (delta: number) => void;
  onItemClick: (item: Item) => void;
}

export default function Calendar({ items, mode, currentMonth, selectedDate, onSelectDate, onChangeMonth, onItemClick }: CalendarProps) {
  const [view, setView] = useState<CalendarView>('2weeks');
  const [detailView, setDetailView] = useState<DetailView>(selectedDate ? 'date' : 'soon');
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()));
  const [modeFilter, setModeFilter] = useState<SchoolMode | ''>(mode);

  useEffect(() => {
    setModeFilter(mode);
  }, [mode]);

  useEffect(() => {
    if (!selectedDate && detailView === 'date') {
      setDetailView('soon');
    }
  }, [detailView, selectedDate]);

  const todayStr = toDateString(new Date());
  const visibleItems = modeFilter ? items.filter(item => item.mode === modeFilter) : items;

  const itemsByDate: Record<string, Item[]> = {};
  for (const item of visibleItems) {
    if (item.date) {
      if (!itemsByDate[item.date]) itemsByDate[item.date] = [];
      itemsByDate[item.date].push(item);
    }
  }

  const handleTwoWeekNav = (delta: number) => {
    setWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta * 14);
      return d;
    });
  };

  const handleViewToggle = (v: CalendarView) => {
    if (v === '2weeks') setWeekStart(getWeekStart(new Date()));
    setView(v);
  };

  const handleDateFocus = (dateStr: string) => {
    const isSelected = dateStr === selectedDate;
    onSelectDate(isSelected ? '' : dateStr);
    setDetailView(isSelected ? 'soon' : 'date');
  };

  // ─── 月ビュー用セル（コンパクト） ────────────────────────────
  const renderMonthCell = (d: Date, key: number | string, isCurrentMonth?: boolean) => {
    const dateStr = toDateString(d);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;
    const dayItems = itemsByDate[dateStr] || [];
    const dayOfWeek = d.getDay();
    const dimmed = isCurrentMonth === false;

    return (
      <button
        key={key}
        onClick={() => handleDateFocus(dateStr)}
        className={`
          relative p-1 min-h-[44px] md:min-h-[56px] text-sm rounded-lg transition-colors cursor-pointer
          ${dimmed ? 'text-gray-300' : dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-700'}
          ${isToday ? 'bg-accent-green/10 font-bold' : ''}
          ${isSelected ? 'ring-2 ring-accent-green' : 'hover:bg-gray-50'}
        `}
      >
        <span className={`${isToday ? 'bg-accent-green text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-xs' : ''}`}>
          {d.getDate()}
        </span>
        {dayItems.length > 0 && (
          <div className="flex gap-0.5 justify-center mt-0.5 flex-wrap">
            {dayItems.slice(0, 3).map((item, j) => (
              <span key={j} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[item.cat].dot}`} />
            ))}
          </div>
        )}
      </button>
    );
  };

  // ─── 2週間ビュー用セル（タイトル表示あり） ──────────────────
  const renderTwoWeekCell = (d: Date, key: number | string) => {
    const dateStr = toDateString(d);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;
    const dayItems = itemsByDate[dateStr] || [];
    const dayOfWeek = d.getDay();
    const isSun = dayOfWeek === 0;
    const isSat = dayOfWeek === 6;

    return (
      <button
        key={key}
        type="button"
        onClick={() => handleDateFocus(dateStr)}
        className={`
          w-full text-left
          rounded-lg border transition-colors
          ${isToday ? 'border-accent-green bg-accent-green/5' : isSelected ? 'border-accent-green' : 'border-gray-100'}
          ${isSun ? 'bg-red-50/40' : isSat ? 'bg-blue-50/40' : 'bg-white'}
        `}
      >
        {/* 日付ヘッダー行 */}
        <div className="w-full text-left px-2 pt-1.5 pb-1">
          <span className={`
            text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full
            ${isToday ? 'bg-accent-green text-white' : isSun ? 'text-red-500' : isSat ? 'text-blue-500' : 'text-gray-700'}
          `}>
            {d.getDate()}
          </span>
        </div>

        {/* 予定リスト（デスクトップ: タイトル表示） */}
        <div className="hidden sm:block px-1 pb-1.5 space-y-0.5 min-h-[2rem]">
          {dayItems.slice(0, 4).map((item, j) => {
            const colors = CATEGORY_COLORS[item.cat];
            return (
              <div
                key={j}
                className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${colors.pill} ${item.done ? 'opacity-40 line-through' : ''}`}
                title={trimLeadingDateLabel(item.title)}
              >
                {trimLeadingDateLabel(item.title)}
              </div>
            );
          })}
          {dayItems.length > 4 && (
            <div className="text-[10px] text-gray-400 px-1">+{dayItems.length - 4}件</div>
          )}
        </div>
        {/* 予定リスト（モバイル: ドット表示） */}
        <div className="sm:hidden flex gap-0.5 justify-center pb-1.5 flex-wrap min-h-[1.5rem]">
          {dayItems.slice(0, 4).map((item, j) => (
            <span key={j} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[item.cat].dot}`} />
          ))}
          {dayItems.length > 4 && (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          )}
        </div>
      </button>
    );
  };

  // ─── ラベル ───────────────────────────────────────────────────
  const twoWeekDays = getTwoWeekDays(weekStart);
  const twoWeekLabel = (() => {
    const start = twoWeekDays[0];
    const end = twoWeekDays[13];
    const sm = start.getMonth() + 1;
    const em = end.getMonth() + 1;
    const sy = start.getFullYear();
    const ey = end.getFullYear();
    if (sy !== ey) return `${sy}年${sm}月〜${ey}年${em}月`;
    if (sm !== em) return `${sy}年${sm}月〜${em}月`;
    return `${sy}年${sm}月`;
  })();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthDays = getMonthDays(year, month);
  const actionableItems = visibleItems.filter(item => !item.done && item.date && daysUntil(item.date) >= 0);
  const soonItems = actionableItems
    .filter(item => daysUntil(item.date) <= 7)
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  const focusedDate = selectedDate || todayStr;
  const selectedDateItems = [...(itemsByDate[focusedDate] || [])].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.title.localeCompare(b.title);
  });
  const focusedItems = detailView === 'soon' ? soonItems : selectedDateItems;
  const soonCount = soonItems.length;
  const isSoonView = detailView === 'soon';

  return (
    <section id="calendar" className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => view === '2weeks' ? handleTwoWeekNav(-1) : onChangeMonth(-1)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
          >
            ◀
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">
              {view === '2weeks' ? twoWeekLabel : `${year}年${month + 1}月`}
            </h2>
            <div className="flex bg-gray-100 rounded-full p-0.5 text-xs">
              <button
                onClick={() => handleViewToggle('2weeks')}
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                  view === '2weeks' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                2週間
              </button>
              <button
                onClick={() => handleViewToggle('month')}
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                  view === 'month' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                1ヶ月
              </button>
            </div>
          </div>

          <button
            onClick={() => view === '2weeks' ? handleTwoWeekNav(1) : onChangeMonth(1)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
          >
            ▶
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {MODE_FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setModeFilter(opt.value)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                modeFilter === opt.value
                  ? opt.value === 'nursery'
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : opt.value === 'elementary'
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-800 text-white'
                  : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setDetailView('soon')}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              isSoonView ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            7日以内 {soonCount}件
          </button>
          {selectedDate && (
            <button
              onClick={() => setDetailView('date')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                !isSoonView ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              選択日 {formatDate(selectedDate)}
            </button>
          )}
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
              {w}
            </div>
          ))}
        </div>

        {/* 2週間ビュー */}
        {view === '2weeks' && (
          <div className="space-y-1">
            <div className="grid grid-cols-7 gap-1">
              {twoWeekDays.slice(0, 7).map((d, i) => renderTwoWeekCell(d, i))}
            </div>
            <div className="border-t border-dashed border-gray-200 my-1" />
            <div className="grid grid-cols-7 gap-1">
              {twoWeekDays.slice(7, 14).map((d, i) => renderTwoWeekCell(d, i + 7))}
            </div>
          </div>
        )}

        {/* 月ビュー */}
        {view === 'month' && (
          <div className="grid grid-cols-7 gap-px">
            {monthDays.map((d, i) => renderMonthCell(d, i, d.getMonth() === month))}
          </div>
        )}

        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/70 p-3 md:p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[11px] tracking-wide text-gray-400">
                {isSoonView ? '7日以内の予定' : '選択中の日付'}
              </p>
              <h3 className="text-sm md:text-base font-semibold text-gray-800">
                {isSoonView ? `直近7日 (${soonCount}件)` : formatDate(focusedDate)}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {selectedDate && (
                <button
                  onClick={() => onSelectDate('')}
                  className="text-[10px] px-2 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer"
                >
                  解除
                </button>
              )}
              <span className="text-[10px] text-gray-400">日付をタップで切替</span>
            </div>
          </div>

          {focusedItems.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">
              {isSoonView ? '7日以内の予定はありません' : '予定はありません'}
            </p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {focusedItems.slice(0, 5).map(item => {
                const colors = CATEGORY_COLORS[item.cat];
                return (
                  <button
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className={`rounded-lg px-2.5 py-2 text-left transition-shadow hover:shadow-sm cursor-pointer ${colors.bg} ${item.done ? 'opacity-50' : ''}`}
                  >
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colors.pill}`}>
                        {item.cat}
                      </span>
                      <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full ${MODE_BADGE[item.mode] ?? 'bg-gray-100 text-gray-500'}`}>
                        {MODE_LABEL[item.mode] ?? item.mode}
                      </span>
                      {item.done && (
                        <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500">
                          対応済み
                        </span>
                      )}
                    </div>
                    <p className={`text-xs leading-snug text-gray-800 ${item.done ? 'line-through' : ''}`}>
                      {trimLeadingDateLabel(item.title)}
                    </p>
                    {item.memo && (
                      <p className="text-[11px] leading-snug text-gray-500 mt-1 line-clamp-2">{item.memo}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {focusedItems.length > 5 && (
            <p className="text-[11px] text-gray-400 pt-2">ほか {focusedItems.length - 5} 件</p>
          )}
        </div>
      </div>
    </section>
  );
}
