'use client';

import { Item } from '@/lib/types';
import { CATEGORY_COLORS, formatDate, daysUntil } from '@/lib/utils';

interface CardProps {
  item: Item;
  onClick: () => void;
}

const MODE_BADGE: Record<string, string> = {
  nursery: 'bg-orange-100 text-orange-600',
  elementary: 'bg-blue-100 text-blue-600',
};

const MODE_LABEL: Record<string, string> = {
  nursery: '保育園',
  elementary: '小学校',
};

export default function Card({ item, onClick }: CardProps) {
  const colors = CATEGORY_COLORS[item.cat];
  const days = daysUntil(item.date);
  const isOverdue = days < 0 && !item.done;
  const isUrgent = days >= 0 && days <= 2 && !item.done;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-xl border-l-[3px] transition-all cursor-pointer
        ${colors.border} ${colors.bg}
        ${item.done ? 'opacity-50' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colors.pill}`}>
              {item.cat}
            </span>
            <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full ${MODE_BADGE[item.mode] ?? 'bg-gray-100 text-gray-500'}`}>
              {MODE_LABEL[item.mode] ?? item.mode}
            </span>
          </div>
          <h3 className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {item.title}
          </h3>
          {item.memo && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{item.memo}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {item.date && (
            <span className="text-[10px] text-gray-400">
              {formatDate(item.date)}
            </span>
          )}
          {item.done && (
            <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">
              対応済み
            </span>
          )}
          {isOverdue && (
            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
              期限超過
            </span>
          )}
          {isUrgent && (
            <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">
              あと{days}日
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
