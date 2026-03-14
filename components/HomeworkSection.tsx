'use client';

import { useState } from 'react';
import { HomeworkEntry } from '@/lib/types';
import { todayString, getSubjectColor } from '@/lib/utils';
import HomeworkAddModal from './HomeworkAddModal';

interface Props {
  homework: HomeworkEntry[];
  onAdd: (entry: Omit<HomeworkEntry, 'id' | 'done'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HomeworkSection({ homework, onAdd, onToggle, onDelete }: Props) {
  const [showModal, setShowModal] = useState(false);
  const today = todayString();
  const todayHomework = homework.filter(h => h.date === today);
  const doneCount = todayHomework.filter(h => h.done).length;
  const totalCount = todayHomework.length;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <section id="homework" className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">宿題チェッカー</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-accent-green hover:underline cursor-pointer"
        >
          ＋ 追加
        </button>
      </div>

      {/* 進捗バー */}
      {totalCount > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>今日の進捗</span>
            <span>{doneCount}/{totalCount} 完了</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-accent-green h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* チェックリスト */}
      <div className="space-y-2">
        {todayHomework.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            今日の宿題はまだ登録されていません
          </div>
        ) : (
          todayHomework.map(hw => (
            <div
              key={hw.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                hw.done ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-green-300'
              }`}
            >
              <input
                type="checkbox"
                checked={hw.done}
                onChange={() => onToggle(hw.id)}
                className="accent-accent-green w-4 h-4 cursor-pointer"
              />
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getSubjectColor(hw.subject)}`}>
                {hw.subject}
              </span>
              <span className={`flex-1 text-sm ${hw.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {hw.description}
              </span>
              <button
                onClick={() => onDelete(hw.id)}
                className="text-gray-300 hover:text-red-400 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* 過去の未完了 */}
      {homework.filter(h => h.date < today && !h.done).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-red-500 mb-2">未完了の宿題</h3>
          <div className="space-y-2">
            {homework.filter(h => h.date < today && !h.done).map(hw => (
              <div key={hw.id} className="flex items-center gap-3 p-3 rounded-lg border border-red-200 bg-red-50">
                <input
                  type="checkbox"
                  checked={hw.done}
                  onChange={() => onToggle(hw.id)}
                  className="accent-accent-green w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-gray-400">{hw.date.slice(5)}</span>
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getSubjectColor(hw.subject)}`}>
                  {hw.subject}
                </span>
                <span className="flex-1 text-sm text-gray-700">{hw.description}</span>
                <button
                  onClick={() => onDelete(hw.id)}
                  className="text-gray-300 hover:text-red-400 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <HomeworkAddModal
          onAdd={(entry) => { onAdd(entry); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
