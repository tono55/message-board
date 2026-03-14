'use client';

import { useState } from 'react';
import { PickupRecord } from '@/lib/types';
import { todayString } from '@/lib/utils';

interface Props {
  onSave: (record: PickupRecord) => void;
  onClose: () => void;
}

const PICKUP_PERSONS = ['ママ', 'パパ', 'おじいちゃん', 'おばあちゃん', 'その他'];

export default function PickupEditModal({ onSave, onClose }: Props) {
  const [date, setDate] = useState(todayString());
  const [plannedTime, setPlannedTime] = useState('17:00');
  const [pickedUpBy, setPickedUpBy] = useState('ママ');
  const [customPerson, setCustomPerson] = useState('');
  const [isExtended, setIsExtended] = useState(false);
  const [memo, setMemo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const person = pickedUpBy === 'その他' ? customPerson.trim() || 'その他' : pickedUpBy;
    onSave({
      date,
      plannedTime,
      pickedUpBy: person,
      isExtended,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">お迎え登録</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">日付</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">お迎え時間</label>
            <input
              type="time"
              value={plannedTime}
              onChange={e => setPlannedTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">お迎えの人</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PICKUP_PERSONS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPickedUpBy(p)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    pickedUpBy === p ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {pickedUpBy === 'その他' && (
              <input
                type="text"
                value={customPerson}
                onChange={e => setCustomPerson(e.target.value)}
                placeholder="お迎えの方のお名前"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="extended"
              checked={isExtended}
              onChange={e => setIsExtended(e.target.checked)}
              className="accent-accent-green"
            />
            <label htmlFor="extended" className="text-sm text-gray-600">延長保育</label>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">メモ（任意）</label>
            <input
              type="text"
              value={memo}
              onChange={e => setMemo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent-green hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
          >
            登録する
          </button>
        </form>
      </div>
    </div>
  );
}
