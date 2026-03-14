'use client';

import { useState } from 'react';
import { PickupRecord } from '@/lib/types';
import { todayString, getWeekDates, WEEKDAY_LABELS } from '@/lib/utils';
import PickupEditModal from './PickupEditModal';

interface Props {
  pickups: PickupRecord[];
  onAdd: (record: PickupRecord) => void;
}

export default function PickupSection({ pickups, onAdd }: Props) {
  const [showModal, setShowModal] = useState(false);
  const today = todayString();
  const todayPickup = pickups.find(p => p.date === today);
  const weekDates = getWeekDates();

  return (
    <section id="pickup" className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">お迎え</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-accent-green hover:underline cursor-pointer"
        >
          ＋ 登録
        </button>
      </div>

      {/* 今日のお迎えカード */}
      <div className={`rounded-xl p-4 mb-4 border ${todayPickup ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="text-xs text-gray-500 mb-1">今日のお迎え</div>
        {todayPickup ? (
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="text-2xl font-bold text-green-700">{todayPickup.plannedTime}</div>
            <div className="text-sm text-gray-600">{todayPickup.pickedUpBy}</div>
            {todayPickup.isExtended && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">延長</span>
            )}
            {todayPickup.memo && <div className="text-xs text-gray-400">{todayPickup.memo}</div>}
          </div>
        ) : (
          <div className="text-sm text-gray-400">未登録</div>
        )}
      </div>

      {/* 今週の一覧 */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {weekDates.map(({ weekday, dateStr }) => {
          const pickup = pickups.find(p => p.date === dateStr);
          const isToday = dateStr === today;
          return (
            <div
              key={dateStr}
              className={`rounded-lg p-1.5 sm:p-2 text-center text-sm border overflow-hidden ${
                isToday ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-xs text-gray-400 font-medium">{WEEKDAY_LABELS[weekday]}</div>
              {pickup ? (
                <>
                  <div className="font-bold text-gray-800 text-xs sm:text-sm">{pickup.plannedTime}</div>
                  <div className="text-xs text-gray-500 truncate">{pickup.pickedUpBy}</div>
                  {pickup.isExtended && <div className="text-xs text-amber-600">延長</div>}
                </>
              ) : (
                <div className="text-gray-300 text-xs mt-1">-</div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <PickupEditModal
          onSave={(record) => { onAdd(record); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
