'use client';

import { useMemo, useState } from 'react';
import { MealMenu, SchoolMode } from '@/lib/types';
import { getWeekDates, WEEKDAY_LABELS } from '@/lib/utils';
import MealMenuEditModal from './MealMenuEditModal';

interface Props {
  menus: MealMenu[];
  mode: SchoolMode;
  baseDate?: Date;
  onNavigateWeek?: (delta: number) => void;
  onResetWeek?: () => void;
  onUpsert: (menu: MealMenu) => void;
  onDelete: (date: string) => void;
}

export default function MealMenuSection({ menus, mode, baseDate, onNavigateWeek, onResetWeek, onUpsert, onDelete }: Props) {
  const [editDate, setEditDate] = useState<string | null>(null);
  const isNursery = mode === 'nursery';

  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate]);
  const getMenu = (dateStr: string) => menus.find(m => m.date === dateStr);

  const weekLabel = (() => {
    const first = weekDates[0].date;
    const last = weekDates[4].date;
    const firstLabel = `${first.getMonth() + 1}/${first.getDate()}`;
    const lastLabel = `${last.getMonth() + 1}/${last.getDate()}`;
    return `${firstLabel} - ${lastLabel}`;
  })();

  return (
    <section id="meal-menu" className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">献立一覧</h2>
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
      {/* モバイル: カードレイアウト */}
      <div className="sm:hidden space-y-2">
        {weekDates.map(({ weekday, dateStr }) => {
          const menu = getMenu(dateStr);
          return (
            <div key={dateStr} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{WEEKDAY_LABELS[weekday]}</span>
                  <span className="text-xs text-gray-400">{dateStr.slice(5)}</span>
                </div>
                <button
                  onClick={() => setEditDate(dateStr)}
                  className="text-xs text-accent-green hover:underline cursor-pointer"
                >
                  編集
                </button>
              </div>
              <div className="px-3 py-2 space-y-1">
                <div className="flex gap-2 text-sm">
                  <span className="text-xs text-gray-400 w-10 shrink-0 pt-0.5">給食</span>
                  <span className="text-gray-700">{menu?.lunch || <span className="text-gray-300">-</span>}</span>
                </div>
                {isNursery && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-xs text-gray-400 w-10 shrink-0 pt-0.5">おやつ</span>
                    <span className="text-gray-700">{menu?.snack || <span className="text-gray-300">-</span>}</span>
                  </div>
                )}
                {menu?.allergens && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-xs text-gray-400 w-10 shrink-0 pt-0.5">アレルギー</span>
                    <span className="text-xs text-gray-500">{menu.allergens}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* デスクトップ: テーブルレイアウト */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-3 py-2 text-left w-16">曜日</th>
              <th className="border border-gray-200 px-3 py-2 text-left">給食</th>
              {isNursery && <th className="border border-gray-200 px-3 py-2 text-left w-28">おやつ</th>}
              <th className="border border-gray-200 px-3 py-2 w-16 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {weekDates.map(({ weekday, dateStr }) => {
              const menu = getMenu(dateStr);
              return (
                <tr key={dateStr} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 font-medium whitespace-nowrap">
                    {WEEKDAY_LABELS[weekday]}
                    <span className="text-xs text-gray-400 block">{dateStr.slice(5).replace('-', '/')}</span>
                  </td>
                  <td className="border border-gray-200 px-3 py-2 leading-relaxed">
                    {menu?.lunch
                      ? menu.lunch.split('／').map((line, i) => (
                          <span key={i} className="block">{line}</span>
                        ))
                      : <span className="text-gray-300">-</span>
                    }
                  </td>
                  {isNursery && (
                    <td className="border border-gray-200 px-3 py-2">
                      {menu?.snack || <span className="text-gray-300">-</span>}
                    </td>
                  )}
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    <button
                      onClick={() => setEditDate(dateStr)}
                      className="text-xs text-accent-green hover:underline cursor-pointer"
                    >
                      編集
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editDate && (
        <MealMenuEditModal
          date={editDate}
          existing={getMenu(editDate)}
          isNursery={isNursery}
          onSave={(menu) => { onUpsert(menu); setEditDate(null); }}
          onDelete={() => { onDelete(editDate); setEditDate(null); }}
          onClose={() => setEditDate(null)}
        />
      )}
    </section>
  );
}
