'use client';

import { useState } from 'react';
import { MealMenu } from '@/lib/types';

interface Props {
  date: string;
  existing?: MealMenu;
  isNursery: boolean;
  onSave: (menu: MealMenu) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function MealMenuEditModal({ date, existing, isNursery, onSave, onDelete, onClose }: Props) {
  const [lunch, setLunch] = useState(existing?.lunch || '');
  const [snack, setSnack] = useState(existing?.snack || '');
  const [allergens, setAllergens] = useState(existing?.allergens || '');
  const [memo, setMemo] = useState(existing?.memo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lunch.trim()) return;
    onSave({
      date,
      lunch: lunch.trim(),
      snack: isNursery ? snack.trim() || undefined : undefined,
      allergens: allergens.trim() || undefined,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{date.slice(5)} の献立</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">給食</label>
            <input
              type="text"
              value={lunch}
              onChange={e => setLunch(e.target.value)}
              placeholder="例: カレーライス、サラダ、牛乳"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green"
              autoFocus
            />
          </div>
          {isNursery && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">おやつ</label>
              <input
                type="text"
                value={snack}
                onChange={e => setSnack(e.target.value)}
                placeholder="例: せんべい、バナナ"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">アレルゲン</label>
            <input
              type="text"
              value={allergens}
              onChange={e => setAllergens(e.target.value)}
              placeholder="例: 乳、卵、小麦"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">メモ</label>
            <input
              type="text"
              value={memo}
              onChange={e => setMemo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!lunch.trim()}
              className="flex-1 bg-accent-green hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
            >
              保存
            </button>
            {existing && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-sm"
              >
                削除
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
