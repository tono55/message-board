'use client';

import { useState } from 'react';
import { TimetableEntry, Weekday } from '@/lib/types';
import { WEEKDAY_LABELS, COMMON_SUBJECTS, getSubjectColor, getTimetableRowLabel } from '@/lib/utils';

interface Props {
  weekday: Weekday;
  entries: TimetableEntry[];
  onSave: (entries: TimetableEntry[]) => void;
  onClose: () => void;
}

export default function TimetableEditModal({ weekday, entries, onSave, onClose }: Props) {
  const [rows, setRows] = useState<TimetableEntry[]>(
    entries.length > 0 ? [...entries] : [{ subject: '' }]
  );

  const updateRow = (i: number, field: keyof TimetableEntry, value: string) => {
    const next = [...rows];
    next[i] = { ...next[i], [field]: value };
    setRows(next);
  };

  const addRow = () => setRows(prev => [...prev, { subject: '' }]);
  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = [...rows];
    while (trimmed.length > 0) {
      const last = trimmed[trimmed.length - 1];
      if (last.subject.trim() || last.note?.trim()) break;
      trimmed.pop();
    }
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{WEEKDAY_LABELS[weekday]}曜日の時間割</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs text-gray-400 mt-2.5 w-5 shrink-0">{getTimetableRowLabel(i, rows.length)}</span>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap gap-1 mb-1">
                  {COMMON_SUBJECTS.map(subj => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => updateRow(i, 'subject', subj)}
                      className={`text-xs px-2 py-0.5 rounded border cursor-pointer transition-colors ${
                        row.subject === subj ? getSubjectColor(subj) + ' font-medium' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={row.subject}
                  onChange={e => updateRow(i, 'subject', e.target.value)}
                  placeholder="教科名"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
                />
                <input
                  type="text"
                  value={row.note || ''}
                  onChange={e => updateRow(i, 'note', e.target.value)}
                  placeholder="メモ（任意）"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-green/50"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="text-gray-300 hover:text-red-400 mt-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="w-full border border-dashed border-gray-300 rounded-lg py-2 text-xs text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer"
          >
            ＋ 時限を追加
          </button>
          <button
            type="submit"
            className="w-full bg-accent-green hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
          >
            保存
          </button>
        </form>
      </div>
    </div>
  );
}
