'use client';

import { Item, SchoolMode, HomeworkEntry } from '@/lib/types';
import { daysUntil, MODE_LABELS } from '@/lib/utils';

interface HeroProps {
  items: Item[];
  mode: SchoolMode;
  todayHomework?: HomeworkEntry[];
}

export default function Hero({ items, mode, todayHomework }: HeroProps) {
  const total = items.length;
  const pending = items.filter(i => !i.done).length;
  const upcoming = items.filter(i => {
    if (i.done || !i.date) return false;
    const d = daysUntil(i.date);
    return d >= 0 && d <= 7;
  }).length;

  const isNursery = mode === 'nursery';

  // 宿題進捗（小学校のみ）
  const hwTotal = todayHomework?.length || 0;
  const hwDone = todayHomework?.filter(h => h.done).length || 0;

  return (
    <section className="bg-hero text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <p className="text-sm text-gray-400 mb-2 tracking-widest uppercase">{MODE_LABELS[mode].subtitle}</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          プリントの見落とし、<span className="text-accent-green">0</span>へ。
        </h1>
        <p className="text-gray-400 text-sm mb-8">お子さまの大切なおたよりを、かんたんに整理・管理できます。</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-gray-400 mt-1">登録数</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{pending}</div>
            <div className="text-xs text-gray-400 mt-1">未対応</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            {!isNursery && hwTotal > 0 ? (
              <>
                <div className={`text-2xl font-bold ${hwDone === hwTotal ? 'text-green-400' : 'text-pink-400'}`}>
                  {hwDone}/{hwTotal}
                </div>
                <div className="text-xs text-gray-400 mt-1">宿題</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-pink-400">{upcoming}</div>
                <div className="text-xs text-gray-400 mt-1">今週の予定</div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
