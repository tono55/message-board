'use client';

import { useState } from 'react';
import { HealthRecord } from '@/lib/types';
import { todayString, CONDITION_LABELS } from '@/lib/utils';

interface Props {
  existing?: HealthRecord;
  onSave: (record: HealthRecord) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function HealthLogEditModal({ existing, onSave, onDelete, onClose }: Props) {
  const [date, setDate] = useState(existing?.date || todayString());
  const [temperature, setTemperature] = useState(existing?.temperature?.toString() || '36.5');
  const [condition, setCondition] = useState<HealthRecord['condition']>(existing?.condition || 'good');
  const [symptoms, setSymptoms] = useState(existing?.symptoms || '');
  const [memo, setMemo] = useState(existing?.memo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const temp = parseFloat(temperature);
    if (isNaN(temp) || temp < 34 || temp > 42) return;
    onSave({
      date,
      temperature: temp,
      condition,
      symptoms: symptoms.trim() || undefined,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">体調を記録</h2>
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
            <label className="block text-xs font-medium text-gray-500 mb-1">体温 (℃)</label>
            <input
              type="number"
              step="0.1"
              min="34"
              max="42"
              value={temperature}
              onChange={e => setTemperature(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">体調</label>
            <div className="flex gap-2">
              {(['good', 'fair', 'poor'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`flex-1 text-sm py-2 rounded-lg border transition-colors cursor-pointer ${
                    condition === c
                      ? c === 'good' ? 'bg-green-100 border-green-400 text-green-700'
                        : c === 'fair' ? 'bg-amber-100 border-amber-400 text-amber-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {CONDITION_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">症状（任意）</label>
            <input
              type="text"
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="例: 鼻水、咳"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">メモ（任意）</label>
            <input
              type="text"
              value={memo}
              onChange={e => setMemo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-accent-green hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
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
