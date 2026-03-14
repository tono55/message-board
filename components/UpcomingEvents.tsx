'use client';

import { Item } from '@/lib/types';
import { CATEGORY_COLORS, daysUntil } from '@/lib/utils';

interface UpcomingEventsProps {
  items: Item[];
}

export default function UpcomingEvents({ items }: UpcomingEventsProps) {
  const upcoming = items
    .filter(i => !i.done && i.date && daysUntil(i.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-lg font-bold mb-4">近日中の予定</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {upcoming.map(item => {
          const d = new Date(item.date + 'T00:00:00');
          const days = daysUntil(item.date);
          const colors = CATEGORY_COLORS[item.cat];

          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-3">
              <div className="bg-gray-50 rounded-lg w-14 h-14 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs text-gray-400">{d.getMonth() + 1}月</span>
                <span className="text-xl font-bold text-gray-800">{d.getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mb-1 ${colors.pill}`}>
                  {item.cat}
                </span>
                <h3 className="text-sm font-medium text-gray-800 truncate">{item.title}</h3>
              </div>
              <div className="shrink-0 self-start">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  days === 0 ? 'bg-red-100 text-red-600' : days <= 2 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                }`}>
                  {days === 0 ? '今日' : `あと${days}日`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
