import { Item, SchoolMode, MealMenu, Timetable, TimetableByWeek, PickupRecord, HealthRecord, UpdateHistoryEntry } from './types';
import {
  getSampleDataForMonth,
  getSampleUpdateHistoryForMonth,
  getSampleMonthKey,
} from './sampleData';
import { emptyTimetable, getWeekKey, normalizeTimetable } from './utils';

const STORAGE_PREFIX = 'otayori-board';

function itemsKey(mode: SchoolMode): string {
  return `${STORAGE_PREFIX}-${mode}-items`;
}

const MODE_KEY = `${STORAGE_PREFIX}-mode`;
const UPDATE_HISTORY_KEY = `${STORAGE_PREFIX}-update-history`;
const SEEDED_TIMETABLE_MONTHS_KEY = `${STORAGE_PREFIX}-seeded-timetable-months`;
const APPLIED_FIXES_KEY = `${STORAGE_PREFIX}-applied-fixes`;

function storageKey(mode: SchoolMode, feature: string): string {
  return `${STORAGE_PREFIX}-${mode}-${feature}`;
}

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function sortUpdateHistory(entries: UpdateHistoryEntry[]): UpdateHistoryEntry[] {
  return [...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function mergeUpdateHistory(existing: UpdateHistoryEntry[], incoming: UpdateHistoryEntry[]): UpdateHistoryEntry[] {
  const existingIds = new Set(existing.map(entry => entry.id));
  return sortUpdateHistory([...existing, ...incoming.filter(entry => !existingIds.has(entry.id))]);
}

function dedupeItems(items: Item[]): Item[] {
  const seen = new Set<string>();
  const result: Item[] = [];
  for (const item of items) {
    const key = `${item.mode}::${item.date}::${item.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function normalizeLegacyCategory(category: unknown, mode: SchoolMode) {
  if (category === '連絡帳') return 'お知らせ';
  if (category === '給食') return 'お知らせ';
  if (category === '行事' || category === 'お知らせ' || category === '持ち物') return category;
  if (mode === 'elementary' && category === '提出物') return category;
  return 'お知らせ';
}

function normalizeStoredItem(raw: unknown, fallbackMode: SchoolMode): Item | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Partial<Item> & Record<string, unknown>;
  const mode = item.mode === 'nursery' || item.mode === 'elementary' ? item.mode : fallbackMode;
  const title = typeof item.title === 'string' ? item.title : '';
  if (!title) return null;

  return {
    id: typeof item.id === 'string' && item.id ? item.id : `${mode}-${title}`,
    title,
    cat: normalizeLegacyCategory(item.cat, mode),
    date: typeof item.date === 'string' ? item.date : '',
    memo: typeof item.memo === 'string' ? item.memo : '',
    done: Boolean(item.done),
    checkItems: Array.isArray(item.checkItems) ? item.checkItems.filter((v): v is string => typeof v === 'string') : [],
    mode,
  };
}

export function loadItems(mode: SchoolMode): Item[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(itemsKey(mode));
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return dedupeItems(parsed.map(item => normalizeStoredItem(item, mode)).filter((item): item is Item => item !== null));
  } catch {
    return [];
  }
}

export function saveItems(mode: SchoolMode, items: Item[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(itemsKey(mode), JSON.stringify(dedupeItems(items)));
}

export function loadMode(): SchoolMode {
  if (typeof window === 'undefined') return 'elementary';
  try {
    const mode = localStorage.getItem(MODE_KEY);
    return mode === 'nursery' ? 'nursery' : 'elementary';
  } catch {
    return 'elementary';
  }
}

export function saveMode(mode: SchoolMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODE_KEY, mode);
}

const SEEDED_MONTHS_KEY = `${STORAGE_PREFIX}-seeded-months`;

function mergeItems(existing: Item[], incoming: Item[]): Item[] {
  const existingIds = new Set(existing.map(item => item.id));
  return [...existing, ...incoming.filter(item => !existingIds.has(item.id))];
}

function mergeMeals(existing: MealMenu[], incoming: MealMenu[]): MealMenu[] {
  const incomingByDate = new Map(incoming.map(menu => [menu.date, menu]));
  const merged = existing.map(menu => {
    const incomingMenu = incomingByDate.get(menu.date);
    if (!incomingMenu) return menu;

    const isPlaceholderElementaryMeal =
      menu.lunch === '給食最終日' ||
      (menu.memo === '通常給食' && !menu.lunch.includes('／'));

    return isPlaceholderElementaryMeal ? incomingMenu : menu;
  });

  const existingDates = new Set(existing.map(menu => menu.date));
  return [...merged, ...incoming.filter(menu => !existingDates.has(menu.date))];
}

function isEmptyTimetable(timetable: Timetable): boolean {
  return Object.values(timetable).every(entries => entries.length === 0);
}

function mergeTimetables(existing: TimetableByWeek, incoming: TimetableByWeek): TimetableByWeek {
  return { ...existing, ...incoming };
}

function applyMarchWeekProgramFix(sampleData: ReturnType<typeof getSampleDataForMonth>): void {
  if (!sampleData) return;

  const appliedFixes = loadJson<string[]>(APPLIED_FIXES_KEY, []);
  const fixId = '2026-03-week-program-item-trim';
  if (appliedFixes.includes(fixId)) return;

  const correctedItems = new Map(
    sampleData.elementaryItems
      .filter(item => item.id === '2026-03-el-9' || item.id === '2026-03-el-10' || item.id === '2026-03-el-11')
      .map(item => [item.id, item]),
  );

  const legacyMemosById: Record<string, string[]> = {
    '2026-03-el-9': [
      '時間割: 国語（ひろがることば・これまでこれから／言葉あそび 日本のことばリズム）/ 算数（もうすぐ3年生・学習のまとめ）/ 体育（校庭 10:20〜11:05 スペシャルお楽しみ会）/ 図工（11:10〜11:55 作品バッグに自分マークをかこう）。下校 12:10。',
      '時間割: 国語（ひろがることば・これまでこれから）/ 算数（もうすぐ3年生・学習のまとめ）/ 体育（校庭 10:20〜11:05 スペシャルお楽しみ会）/ 図工（11:10〜11:55 作品バッグに自分マークをかこう）。朝自習: 作品まとめ。下校 12:10。',
    ],
    '2026-03-el-10': [
      '時間割: 学活（通知表を見て来年のめあてを立てよう）/ 生活（3年生の場所をかくにんしよう）/ 国語（連絡帳日記 1年間をふりかえろう）/ 学活（春休みの生活について）。下校 12:10。',
      '時間割: 国語（言葉あそび・日本のことばリズム 〜9:25）/ 生活（3年生の場所をかくにんしよう）/ 国語（10:20〜11:05 連絡帳日記・1年間をふりかえろう）/ 学活（11:10〜11:55 春休みの生活について）。朝自習: 作品のまとめ。下校 12:10。',
    ],
    '2026-03-el-11': [
      '朝自習: 作品のまとめ、体育館移動。8:35〜 修了式、10:25〜体育館移動、10:35〜 離任式。国語: 3年生になった自分へお手紙。下校 11:30。',
      '朝自習: 体育館移動。8:35〜 修了式。時間割: 学活（〜9:25 通知表を見て来年のめあてを立てよう）/ 国語（9:30〜10:15 3年生になった自分へお手紙）/ 行事（10:25〜体育館移動、10:35〜離任式）/ 帰りの会（11:10〜11:20）。下校 11:30。',
    ],
  };

  let itemFixApplied = false;
  const correctedStoredItems = loadItems('elementary').map(item => {
    const corrected = correctedItems.get(item.id);
    const legacyMemos = legacyMemosById[item.id];
    if (!corrected || !legacyMemos?.includes(item.memo)) return item;
    itemFixApplied = true;
    return {
      ...corrected,
      done: item.done,
      checkItems: item.checkItems,
    };
  });

  if (itemFixApplied) {
    saveItems('elementary', correctedStoredItems);
  }

  const legacyTimetable = loadTimetable('2026-03-23');
  const looksLikeLegacyWeekProgram =
    (
      legacyTimetable.mon[0]?.note === 'ひろがることば／これまでこれから／言葉あそび 日本のことばリズム' ||
      legacyTimetable.mon[1]?.note === 'ひろがることば／これまでこれから／言葉あそび 日本のことばリズム'
    ) &&
    (
      legacyTimetable.tue[0]?.subject === '学活' ||
      legacyTimetable.tue[1]?.subject === '学活'
    ) &&
    (
      legacyTimetable.wed[1]?.note === '春休み' ||
      legacyTimetable.wed[2]?.note === '春休み'
    );

  const needsMorningStudyWeekProgram =
    legacyTimetable.mon[0]?.subject !== '朝自習' &&
    legacyTimetable.tue[0]?.subject !== '朝自習' &&
    legacyTimetable.wed[0]?.subject !== '朝自習' &&
    legacyTimetable.mon.some(entry => entry.note === 'ひろがることば／これまでこれから') &&
    legacyTimetable.tue.some(entry => entry.note === '〜9:25 言葉あそび／日本のことばリズム') &&
    legacyTimetable.wed.some(entry => entry.note === '11:10〜11:20');

  if (looksLikeLegacyWeekProgram || needsMorningStudyWeekProgram) {
    saveTimetable('2026-03-23', sampleData.timetables['2026-03-23']);
  }

  if (itemFixApplied || looksLikeLegacyWeekProgram || needsMorningStudyWeekProgram) {
    saveJson(APPLIED_FIXES_KEY, [...appliedFixes, fixId]);
  }
}

function applyMarchWeek0316Supplement(sampleData: ReturnType<typeof getSampleDataForMonth>): void {
  if (!sampleData) return;

  const appliedFixes = loadJson<string[]>(APPLIED_FIXES_KEY, []);
  const fixId = '2026-03-week-0316-supplement-v2';
  if (appliedFixes.includes(fixId)) return;

  const correctedItems = new Map(
    sampleData.elementaryItems
      .filter(item => ['2026-03-el-1', '2026-03-el-6', '2026-03-el-8', '2026-03-el-15'].includes(item.id))
      .map(item => [item.id, item]),
  );

  const legacyMemosById: Record<string, string[]> = {
    '2026-03-el-1': [
      '時間割: 国語（自分はっけん発表会）/ 生活（お手紙オープン）/ 算数（学習のまとめ）/ 学活（お別れ花道）。',
    ],
    '2026-03-el-6': [
      '上ばき・体そうふく・工作マット・わりばし・毛糸（1mくらい）・自分はっけんファイル。',
    ],
    '2026-03-el-8': [
      '〜10:30 業間休み / 10:35〜11:10 3時間目 / 11:15〜11:30 そうじ / 11:35〜11:45 帰りのしたく / 11:45〜12:30 給食 / 12:30〜13:00 放送。下校 13:30。',
    ],
  };

  const existingItems = loadItems('elementary');
  let itemFixApplied = false;
  let hasLetterNotice = existingItems.some(item => item.id === '2026-03-el-15');

  const correctedStoredItems = existingItems.map(item => {
    const corrected = correctedItems.get(item.id);
    const legacyMemos = legacyMemosById[item.id];
    if (!corrected || !legacyMemos?.includes(item.memo)) return item;
    itemFixApplied = true;
    return {
      ...corrected,
      done: item.done,
      checkItems: item.checkItems,
    };
  });

  if (!hasLetterNotice) {
    correctedStoredItems.push(correctedItems.get('2026-03-el-15')!);
    hasLetterNotice = true;
    itemFixApplied = true;
  }

  if (itemFixApplied) {
    saveItems('elementary', correctedStoredItems);
  }

  const timetable0316 = loadTimetable('2026-03-16');
  const needsMorningStudyWeek0316 =
    timetable0316.mon[0]?.subject !== '朝自習' &&
    timetable0316.mon.some(entry => entry.note === '自分はっけん発表会／お気に入りページの発表') &&
    timetable0316.wed[0]?.subject !== '朝自習' &&
    timetable0316.thu[0]?.subject !== '朝自習';

  const needsDismissalWeek0316 =
    !timetable0316.mon.some(entry => entry.subject === '下校' && entry.note === '13:30') ||
    !timetable0316.wed.some(entry => entry.subject === '下校' && entry.note === '12:10') ||
    !timetable0316.thu.some(entry => entry.subject === '下校' && entry.note === '12:10');

  if (needsMorningStudyWeek0316 || needsDismissalWeek0316) {
    saveTimetable('2026-03-16', sampleData.timetables['2026-03-16']);
  }

  if (itemFixApplied || needsMorningStudyWeek0316 || needsDismissalWeek0316) {
    saveJson(APPLIED_FIXES_KEY, [...appliedFixes, fixId]);
  }
}

export function seedSampleData(): void {
  if (typeof window === 'undefined') return;
  const monthKey = getSampleMonthKey();
  const sampleData = getSampleDataForMonth(monthKey);
  if (!sampleData) return;

  const seededMonths = loadJson<string[]>(SEEDED_MONTHS_KEY, []);
  const seededTimetableMonths = loadJson<string[]>(SEEDED_TIMETABLE_MONTHS_KEY, []);

  saveJson(itemsKey('nursery'), dedupeItems(mergeItems(loadItems('nursery'), sampleData.nurseryItems)));
  saveJson(itemsKey('elementary'), dedupeItems(mergeItems(loadItems('elementary'), sampleData.elementaryItems)));
  saveJson(storageKey('nursery', 'meals'), mergeMeals(loadMealMenus('nursery'), sampleData.nurseryMeals));
  saveJson(storageKey('elementary', 'meals'), mergeMeals(loadMealMenus('elementary'), sampleData.elementaryMeals));

  if (!seededTimetableMonths.includes(monthKey)) {
    saveTimetables(mergeTimetables(loadTimetables(), sampleData.timetables));
    saveJson(SEEDED_TIMETABLE_MONTHS_KEY, [...seededTimetableMonths, monthKey]);
  }

  const seededHistory = getSampleUpdateHistoryForMonth(monthKey);
  if (seededHistory.length > 0) {
    saveUpdateHistory(mergeUpdateHistory(loadUpdateHistory(), seededHistory));
  }

  if (monthKey === '2026-03') {
    applyMarchWeekProgramFix(sampleData);
    applyMarchWeek0316Supplement(sampleData);
  }

  if (!seededMonths.includes(monthKey)) {
    localStorage.setItem(SEEDED_MONTHS_KEY, JSON.stringify([...seededMonths, monthKey]));
  }
}

// 献立
export function loadMealMenus(mode: SchoolMode): MealMenu[] {
  return loadJson(storageKey(mode, 'meals'), []);
}
export function saveMealMenus(mode: SchoolMode, menus: MealMenu[]): void {
  saveJson(storageKey(mode, 'meals'), menus);
}

// 時間割
export function loadTimetables(): TimetableByWeek {
  const empty: TimetableByWeek = {};
  const raw = loadJson<unknown>(storageKey('elementary', 'timetable'), empty);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return empty;

  const candidate = raw as Record<string, unknown>;
  const looksLikeLegacyTimetable = ['mon', 'tue', 'wed', 'thu', 'fri'].some(key => key in candidate);
  if (looksLikeLegacyTimetable) {
    const legacy = candidate as unknown as Timetable;
    if (isEmptyTimetable(legacy)) return empty;
    return { [getWeekKey()]: normalizeTimetable(legacy) };
  }

  return Object.fromEntries(
    Object.entries(candidate).map(([weekKey, timetable]) => [weekKey, normalizeTimetable(timetable as Timetable)]),
  ) as TimetableByWeek;
}
export function saveTimetables(timetables: TimetableByWeek): void {
  saveJson(storageKey('elementary', 'timetable'), timetables);
}
export function loadTimetable(weekKey: string): Timetable {
  return loadTimetables()[weekKey] ?? emptyTimetable();
}
export function saveTimetable(weekKey: string, timetable: Timetable): void {
  saveTimetables({ ...loadTimetables(), [weekKey]: timetable });
}

// 更新履歴
export function loadUpdateHistory(): UpdateHistoryEntry[] {
  return sortUpdateHistory(loadJson(UPDATE_HISTORY_KEY, [] as UpdateHistoryEntry[]));
}
export function saveUpdateHistory(entries: UpdateHistoryEntry[]): void {
  saveJson(UPDATE_HISTORY_KEY, sortUpdateHistory(entries));
}
export function addUpdateHistory(entry: Omit<UpdateHistoryEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): void {
  const timestamp = entry.timestamp ?? new Date().toISOString();
  const id = entry.id ?? `history-${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
  saveUpdateHistory([{ ...entry, id, timestamp }, ...loadUpdateHistory()]);
}

// お迎え
export function loadPickups(): PickupRecord[] {
  return loadJson(storageKey('nursery', 'pickups'), []);
}
export function savePickups(records: PickupRecord[]): void {
  saveJson(storageKey('nursery', 'pickups'), records);
}

// 体調記録
export function loadHealthRecords(): HealthRecord[] {
  return loadJson(storageKey('nursery', 'health'), []);
}
export function saveHealthRecords(records: HealthRecord[]): void {
  saveJson(storageKey('nursery', 'health'), records);
}
