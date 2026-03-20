import { Item, SchoolMode, MealMenu, Timetable, TimetableByWeek, PickupRecord, HealthRecord, UpdateHistoryEntry } from './types';
import {
  getSampleDataForMonth,
  getSampleUpdateHistoryForMonth,
  getSampleMonthKey,
} from './sampleData';
import { emptyTimetable, getWeekKey } from './utils';

const STORAGE_PREFIX = 'otayori-board';

function itemsKey(mode: SchoolMode): string {
  return `${STORAGE_PREFIX}-${mode}-items`;
}

const MODE_KEY = `${STORAGE_PREFIX}-mode`;
const UPDATE_HISTORY_KEY = `${STORAGE_PREFIX}-update-history`;
const SEEDED_TIMETABLE_MONTHS_KEY = `${STORAGE_PREFIX}-seeded-timetable-months`;

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
    return { [getWeekKey()]: legacy };
  }

  return candidate as TimetableByWeek;
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
