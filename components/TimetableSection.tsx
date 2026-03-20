'use client';

import { useMemo, useState } from 'react';
import { Timetable, Weekday } from '@/lib/types';
import { WEEKDAY_LABELS, WEEKDAYS, getSubjectColor, getWeekDates } from '@/lib/utils';
import TimetableEditModal from './TimetableEditModal';

interface Props {
  timetable: Timetable;
  baseDate?: Date;
  weekKey: string;
  onNavigateWeek?: (delta: number) => void;
  onResetWeek?: () => void;
  onUpdate: (timetable: Timetable) => void;
}

export default function TimetableSection({ timetable, baseDate, weekKey, onNavigateWeek, onResetWeek, onUpdate }: Props) {
  const [editDay, setEditDay] = useState<Weekday | null>(null);

  const maxPeriods = Math.max(1, ...WEEKDAYS.map(d => timetable[d].length));
  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate]);
  const weekDateMap = new Map(weekDates.map(({ weekday, dateStr }) => [weekday, dateStr.slice(5).replace('-', '/')]));
  const weekLabel = (() => {
    const first = weekDates[0].date;
    const last = weekDates[4].date;
    const firstLabel = `${first.getMonth() + 1}/${first.getDate()}`;
    const lastLabel = `${last.getMonth() + 1}/${last.getDate()}`;
    return `${firstLabel} - ${lastLabel}`;
  })();

  return (
    <section id="timetable" className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">時間割</h2>
          <p className="text-xs text-gray-400 mt-1">週キー: {weekKey}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateWeek?.(-1)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
          >
            ◀
          </button>
          <div className="min-w-[9rem] text-center leading-tight">
            <div className="text-[10px] tracking-wide text-gray-400">表示週</div>
            <div className="text-sm text-gray-600">{weekLabel}</div>
          </div>
          <button
            onClick={() => onResetWeek?.()}
            className="text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer"
          >
            今週へ戻す
          </button>
          <button
            onClick={() => onNavigateWeek?.(1)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
          >
            ▶
          </button>
        </div>
      </div>
      {/* モバイル: 曜日別カードレイアウト */}
      <div className="sm:hidden space-y-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
              <div className="flex flex-col">
                <span className="font-medium text-sm">{WEEKDAY_LABELS[d]}</span>
                <span className="text-xs text-gray-400">{weekDateMap.get(d)}</span>
              </div>
              <button
                onClick={() => setEditDay(d)}
                className="text-xs text-accent-green hover:underline cursor-pointer"
              >
                編集
              </button>
            </div>
            <div className="px-3 py-2 flex flex-wrap gap-1.5">
              {timetable[d].length === 0 ? (
                <span className="text-xs text-gray-300">科目なし</span>
              ) : (
                timetable[d].map((entry, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 w-4 text-right">{i + 1}.</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${getSubjectColor(entry.subject)}`}>
                      {entry.subject}
                    </span>
                    {entry.note && (
                      <span className="text-xs text-gray-400">{entry.note}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* デスクトップ: テーブルレイアウト */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-2 w-10"></th>
              {WEEKDAYS.map(d => (
                <th key={d} className="border border-gray-200 px-2 py-2 text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{WEEKDAY_LABELS[d]}</span>
                    <span className="text-[11px] font-normal text-gray-400">{weekDateMap.get(d)}</span>
                    <button
                      onClick={() => setEditDay(d)}
                      className="text-xs text-accent-green hover:underline cursor-pointer"
                    >
                      編集
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxPeriods }, (_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-2 py-2 text-center text-xs text-gray-400 font-medium">
                  {i + 1}
                </td>
                {WEEKDAYS.map(d => {
                  const entry = timetable[d][i];
                  return (
                    <td key={d} className="border border-gray-200 px-2 py-2 text-center">
                      {entry ? (
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getSubjectColor(entry.subject)}`}>
                            {entry.subject}
                          </span>
                          {entry.note && (
                            <div className="text-xs text-gray-400 mt-0.5">{entry.note}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-200">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editDay && (
        <TimetableEditModal
          weekday={editDay}
          entries={timetable[editDay]}
          onSave={(entries) => {
            onUpdate({ ...timetable, [editDay]: entries });
            setEditDay(null);
          }}
          onClose={() => setEditDay(null)}
        />
      )}
    </section>
  );
}
