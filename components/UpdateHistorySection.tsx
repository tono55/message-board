'use client';

import { UpdateHistoryEntry } from '@/lib/types';

interface Props {
  entries: UpdateHistoryEntry[];
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatRelatedDates(dates: string[]): string {
  if (dates.length === 0) return '';
  if (dates.length === 1) return dates[0];
  return `${dates[0]} - ${dates[dates.length - 1]}`;
}

export default function UpdateHistorySection({ entries }: Props) {
  return (
    <section id="update-history" className="max-w-5xl mx-auto px-4 py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[11px] tracking-wide text-gray-400">DATA UPDATES</p>
            <h2 className="text-lg font-bold text-gray-900">更新履歴</h2>
          </div>
          <span className="text-xs text-gray-400">{entries.length}件</span>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">まだ反映履歴はありません。</p>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500">{formatTimestamp(entry.timestamp)}</span>
                  {entry.mode && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      entry.mode === 'nursery' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {entry.mode === 'nursery' ? '保育園' : '小学校'}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-800">{entry.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{entry.summary}</p>
                {entry.relatedDates && entry.relatedDates.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">対象日: {formatRelatedDates(entry.relatedDates)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
