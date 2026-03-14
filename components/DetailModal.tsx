'use client';

import { Item } from '@/lib/types';
import { CATEGORY_COLORS, formatDate, daysUntil } from '@/lib/utils';

interface DetailModalProps {
  item: Item;
  onClose: () => void;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DetailModal({ item, onClose, onToggleDone, onDelete }: DetailModalProps) {
  const colors = CATEGORY_COLORS[item.cat];
  const days = daysUntil(item.date);

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.pill}`}>
              {item.cat}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              item.mode === 'nursery' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {item.mode === 'nursery' ? '保育園' : '小学校'}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
        </div>

        <h2 className={`text-xl font-bold mb-2 ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {item.title}
        </h2>

        {item.date && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">📅 {formatDate(item.date)}</span>
            {!item.done && item.date && days >= 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                days === 0 ? 'bg-red-100 text-red-600' : days <= 2 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
              }`}>
                {days === 0 ? '今日' : `あと${days}日`}
              </span>
            )}
            {!item.done && days < 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600">
                期限超過
              </span>
            )}
          </div>
        )}

        {item.memo && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.memo}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onToggleDone(item.id)}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
              item.done
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-accent-green text-white hover:bg-green-600'
            }`}
          >
            {item.done ? '未対応に戻す' : '対応済みにする'}
          </button>
          <button
            onClick={() => {
              if (confirm('このおたよりを削除しますか？')) {
                onDelete(item.id);
              }
            }}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-colors cursor-pointer"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
