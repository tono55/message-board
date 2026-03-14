'use client';

import { useState } from 'react';
import { Timetable, Weekday } from '@/lib/types';
import { WEEKDAY_LABELS, WEEKDAYS, getSubjectColor } from '@/lib/utils';
import TimetableEditModal from './TimetableEditModal';

interface Props {
  timetable: Timetable;
  onUpdate: (timetable: Timetable) => void;
}

export default function TimetableSection({ timetable, onUpdate }: Props) {
  const [editDay, setEditDay] = useState<Weekday | null>(null);

  const maxPeriods = Math.max(1, ...WEEKDAYS.map(d => timetable[d].length));

  return (
    <section id="timetable" className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">時間割</h2>
      </div>
      {/* モバイル: 曜日別カードレイアウト */}
      <div className="sm:hidden space-y-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
              <span className="font-medium text-sm">{WEEKDAY_LABELS[d]}</span>
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
                  <span>{WEEKDAY_LABELS[d]}</span>
                  <button
                    onClick={() => setEditDay(d)}
                    className="ml-1 text-xs text-accent-green hover:underline cursor-pointer"
                  >
                    編集
                  </button>
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
