'use client';

import { useState } from 'react';
import { HomeworkEntry } from '@/lib/types';
import { todayString, COMMON_SUBJECTS, getSubjectColor } from '@/lib/utils';

interface Props {
  onAdd: (entry: Omit<HomeworkEntry, 'id' | 'done'>) => void;
  onClose: () => void;
}

export default function HomeworkAddModal({ onAdd, onClose }: Props) {
  const [date, setDate] = useState(todayString());
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    onAdd({ date, subject: subject.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">宿題を追加</h2>
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
            <label className="block text-xs font-medium text-gray-500 mb-1">教科</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_SUBJECTS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                    subject === s ? getSubjectColor(s) + ' font-medium' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="教科名"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">内容</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="例: ドリルP.24-25"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!subject.trim() || !description.trim()}
            className="w-full bg-accent-green hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
          >
            追加する
          </button>
        </form>
      </div>
    </div>
  );
}
