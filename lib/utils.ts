import { Category, SchoolMode, NurseryCategory, ElementaryCategory, Weekday } from './types';

export const NURSERY_CATEGORIES: NurseryCategory[] = ['行事', 'お知らせ', '持ち物'];
export const ELEMENTARY_CATEGORIES: ElementaryCategory[] = ['行事', '提出物', 'お知らせ', '持ち物'];

export function getCategoriesForMode(mode: SchoolMode): Category[] {
  return mode === 'nursery' ? NURSERY_CATEGORIES : ELEMENTARY_CATEGORIES;
}

type CategoryColorSet = { bg: string; border: string; text: string; dot: string; pill: string; pillActive: string };

export const CATEGORY_COLORS: Record<Category, CategoryColorSet> = {
  '行事':   { bg: 'bg-pink-50',   border: 'border-pink-400',   text: 'text-pink-700',   dot: 'bg-pink-400',   pill: 'bg-pink-100 text-pink-700', pillActive: 'bg-pink-500 text-white' },
  '提出物': { bg: 'bg-amber-50',  border: 'border-amber-400',  text: 'text-amber-700',  dot: 'bg-amber-400',  pill: 'bg-amber-100 text-amber-700', pillActive: 'bg-amber-500 text-white' },
  'お知らせ': { bg: 'bg-blue-50', border: 'border-blue-400',   text: 'text-blue-700',   dot: 'bg-blue-400',   pill: 'bg-blue-100 text-blue-700', pillActive: 'bg-blue-500 text-white' },
  '持ち物': { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', dot: 'bg-purple-400', pill: 'bg-purple-100 text-purple-700', pillActive: 'bg-purple-500 text-white' },
};

export const MODE_LABELS: Record<SchoolMode, { name: string; subtitle: string }> = {
  nursery: { name: '保育園', subtitle: 'Nursery School Print Manager' },
  elementary: { name: '小学校', subtitle: 'Elementary School Print Manager' },
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function trimLeadingDateLabel(title: string): string {
  return title
    .replace(/^\d{1,2}月\d{1,2}日(?:（[^）]+）|\([^)]+\)|\s*[月火水木金土日])?\s*/u, '')
    .trim();
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay(); // 0=Sun
  // Fill from previous month
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  // Current month
  const lastDate = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= lastDate; i++) {
    days.push(new Date(year, month, i));
  }
  // Fill remaining to complete 6 rows
  while (days.length < 42) {
    const nextDay = days.length - startOffset - lastDate + 1;
    days.push(new Date(year, month + 1, nextDay));
  }
  return days;
}

export function todayString(): string {
  return toDateString(new Date());
}

// 指定日を含む週の日曜日を返す
export function getWeekStart(base: Date): Date {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // 日曜起点
  return d;
}

// 2週間分の日付を返す（日曜〜土曜 × 2週）
export function getTwoWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }
  return days;
}

// 教科色マップ
export const SUBJECT_COLORS: Record<string, string> = {
  '国語': 'bg-red-100 text-red-700 border-red-300',
  '算数': 'bg-blue-100 text-blue-700 border-blue-300',
  '数学': 'bg-blue-100 text-blue-700 border-blue-300',
  '理科': 'bg-green-100 text-green-700 border-green-300',
  '社会': 'bg-orange-100 text-orange-700 border-orange-300',
  '英語': 'bg-purple-100 text-purple-700 border-purple-300',
  '体育': 'bg-cyan-100 text-cyan-700 border-cyan-300',
  '音楽': 'bg-pink-100 text-pink-700 border-pink-300',
  '図工': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  '図画工作': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  '美術': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  '家庭': 'bg-amber-100 text-amber-700 border-amber-300',
  '道徳': 'bg-indigo-100 text-indigo-700 border-indigo-300',
  '生活': 'bg-lime-100 text-lime-700 border-lime-300',
  '書写': 'bg-stone-100 text-stone-700 border-stone-300',
  '総合': 'bg-teal-100 text-teal-700 border-teal-300',
};

export const DEFAULT_SUBJECT_COLOR = 'bg-gray-100 text-gray-700 border-gray-300';

export function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || DEFAULT_SUBJECT_COLOR;
}

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: '月', tue: '火', wed: '水', thu: '木', fri: '金',
};

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

export const COMMON_SUBJECTS = ['国語', '算数', '理科', '社会', '英語', '体育', '音楽', '図工', '家庭', '道徳', '生活', '書写', '総合'];

// 今週の月〜金の日付を取得
export function getWeekDates(baseDate?: Date): { weekday: Weekday; date: Date; dateStr: string }[] {
  const base = baseDate || new Date();
  const day = base.getDay(); // 0=Sun
  const monday = new Date(base);
  monday.setDate(base.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  return WEEKDAYS.map((wd, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { weekday: wd, date: d, dateStr: toDateString(d) };
  });
}

export const CONDITION_LABELS: Record<string, string> = {
  good: '良好',
  fair: 'ふつう',
  poor: '不調',
};

export const CONDITION_COLORS: Record<string, string> = {
  good: 'text-green-600',
  fair: 'text-amber-600',
  poor: 'text-red-600',
};
