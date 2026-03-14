'use client';

import { useState } from 'react';
import { Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/utils';

interface AddModalProps {
  categories: Category[];
  onClose: () => void;
  onAdd: (data: { title: string; cat: Category; date: string; memo: string }) => void;
}

export default function AddModal({ categories, onClose, onAdd }: AddModalProps) {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState<Category>(categories.includes('お知らせ') ? 'お知らせ' : categories[0]);
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), cat, date, memo: memo.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">おたよりを追加</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例: 運動会のお知らせ"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">カテゴリ</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => {
                const colors = CATEGORY_COLORS[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      cat === c ? colors.pillActive : colors.pill
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">期日（任意）</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">メモ（任意）</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              rows={3}
              placeholder="持ち物や注意事項など"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-accent-green hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
          >
            追加する
          </button>
        </form>
      </div>
    </div>
  );
}
