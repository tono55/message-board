'use client';

import { useState } from 'react';
import { Item, Category, SchoolMode } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/utils';
import Card from './Card';

interface BoardProps {
  items: Item[];
  categories: Category[];
  selectedDate: string;
  selectedCat: Category | '';
  onSelectCat: (cat: Category | '') => void;
  onCardClick: (item: Item) => void;
}

const MODE_FILTER_OPTIONS: { value: SchoolMode | ''; label: string }[] = [
  { value: '', label: 'すべて' },
  { value: 'nursery', label: '保育園' },
  { value: 'elementary', label: '小学校' },
];

// 両モードのカテゴリをユニークに集める
function getAllCategories(items: Item[]): Category[] {
  const seen = new Set<Category>();
  const result: Category[] = [];
  for (const item of items) {
    if (!seen.has(item.cat)) {
      seen.add(item.cat);
      result.push(item.cat);
    }
  }
  return result;
}

export default function Board({ items, categories, selectedDate, selectedCat, onSelectCat, onCardClick }: BoardProps) {
  const [modeFilter, setModeFilter] = useState<SchoolMode | ''>('');

  const allCategories = getAllCategories(items);

  const filtered = items.filter(item => {
    if (modeFilter && item.mode !== modeFilter) return false;
    if (selectedDate && item.date !== selectedDate) return false;
    if (selectedCat && item.cat !== selectedCat) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.date && b.date) return a.date.localeCompare(b.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  return (
    <section id="board" className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-lg font-bold mb-4">掲示板</h2>

      {/* モードフィルター */}
      <div className="flex items-center gap-2 mb-3">
        {MODE_FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setModeFilter(opt.value)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
              modeFilter === opt.value
                ? opt.value === 'nursery'
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : opt.value === 'elementary'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-800 text-white'
                : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => onSelectCat('')}
          className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
            selectedCat === '' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          カテゴリ: すべて
        </button>
        {allCategories.map(cat => {
          const colors = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => onSelectCat(selectedCat === cat ? '' : cat)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                selectedCat === cat ? colors.pillActive : colors.pill + ' hover:opacity-80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <p className="text-xs text-gray-400 mb-3">
          {selectedDate} の予定を表示中
        </p>
      )}

      <div className="grid gap-2">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {selectedDate || selectedCat || modeFilter ? '該当するおたよりはありません' : 'おたよりを追加してみましょう'}
          </div>
        ) : (
          sorted.map(item => (
            <Card key={item.id} item={item} onClick={() => onCardClick(item)} />
          ))
        )}
      </div>
    </section>
  );
}
