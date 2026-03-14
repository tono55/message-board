'use client';

import { useState } from 'react';
import { HealthRecord } from '@/lib/types';
import { todayString, CONDITION_LABELS, CONDITION_COLORS } from '@/lib/utils';
import HealthLogEditModal from './HealthLogEditModal';

interface Props {
  records: HealthRecord[];
  onUpsert: (record: HealthRecord) => void;
  onDelete: (date: string) => void;
}

export default function HealthLogSection({ records, onUpsert, onDelete }: Props) {
  const [showModal, setShowModal] = useState(false);
  const today = todayString();
  const todayRecord = records.find(r => r.date === today);

  // 直近7日間のレコードを取得
  const recentRecords = (() => {
    const days: { date: string; record?: HealthRecord }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({ date: dateStr, record: records.find(r => r.date === dateStr) });
    }
    return days;
  })();

  const tempMin = 35.0;
  const tempMax = 39.0;
  const tempRange = tempMax - tempMin;

  return (
    <section id="health" className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">体温・体調記録</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-accent-green hover:underline cursor-pointer"
        >
          ＋ 記録
        </button>
      </div>

      {/* 今日の体温カード */}
      <div className={`rounded-xl p-4 mb-4 border ${todayRecord ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="text-xs text-gray-500 mb-1">今朝の体温</div>
        {todayRecord ? (
          <div className="flex items-center gap-4">
            <div className={`text-3xl font-bold ${todayRecord.temperature >= 37.5 ? 'text-red-600' : 'text-blue-700'}`}>
              {todayRecord.temperature.toFixed(1)}℃
            </div>
            <span className={`text-sm font-medium ${CONDITION_COLORS[todayRecord.condition]}`}>
              {CONDITION_LABELS[todayRecord.condition]}
            </span>
            {todayRecord.symptoms && (
              <span className="text-xs text-gray-500">{todayRecord.symptoms}</span>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400">未記録</div>
        )}
      </div>

      {/* 7日間ミニチャート */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="text-xs text-gray-400 mb-3">7日間の体温推移</div>
        <div className="flex items-end gap-1 h-24">
          {recentRecords.map(({ date, record }) => {
            const isToday = date === today;
            const temp = record?.temperature;
            const height = temp ? Math.max(10, ((temp - tempMin) / tempRange) * 100) : 0;
            const isHigh = temp && temp >= 37.5;
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                {temp ? (
                  <>
                    <span className={`text-xs font-medium ${isHigh ? 'text-red-500' : 'text-gray-600'}`}>
                      {temp.toFixed(1)}
                    </span>
                    <div
                      className={`w-full rounded-t transition-all ${
                        isHigh ? 'bg-red-400' : isToday ? 'bg-blue-500' : 'bg-blue-300'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </>
                ) : (
                  <>
                    <span className="text-xs text-gray-300">-</span>
                    <div className="w-full rounded-t bg-gray-100" style={{ height: '10%' }} />
                  </>
                )}
                <span className={`text-xs ${isToday ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  {date.slice(8)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <HealthLogEditModal
          existing={todayRecord}
          onSave={(record) => { onUpsert(record); setShowModal(false); }}
          onDelete={() => { if (todayRecord) onDelete(todayRecord.date); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
