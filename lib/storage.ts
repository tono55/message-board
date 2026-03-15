import { Item, SchoolMode, MealMenu, Timetable, PickupRecord, HomeworkEntry, HealthRecord } from './types';
import {
  getSampleDataForMonth,
  getSampleMonthKey,
} from './sampleData';

const STORAGE_PREFIX = 'otayori-board';

function itemsKey(mode: SchoolMode): string {
  return `${STORAGE_PREFIX}-${mode}-items`;
}

const MODE_KEY = `${STORAGE_PREFIX}-mode`;

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

export function loadItems(mode: SchoolMode): Item[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(itemsKey(mode));
    return data ? dedupeItems(JSON.parse(data)) : [];
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
  const existingDates = new Set(existing.map(menu => menu.date));
  return [...existing, ...incoming.filter(menu => !existingDates.has(menu.date))];
}

function mergeHomework(existing: HomeworkEntry[], incoming: HomeworkEntry[]): HomeworkEntry[] {
  const existingIds = new Set(existing.map(entry => entry.id));
  return [...existing, ...incoming.filter(entry => !existingIds.has(entry.id))];
}

function isEmptyTimetable(timetable: Timetable): boolean {
  return Object.values(timetable).every(entries => entries.length === 0);
}

export function seedSampleData(): void {
  if (typeof window === 'undefined') return;
  const monthKey = getSampleMonthKey();
  const sampleData = getSampleDataForMonth(monthKey);
  if (!sampleData) return;

  const seededMonths = loadJson<string[]>(SEEDED_MONTHS_KEY, []);

  saveJson(itemsKey('nursery'), dedupeItems(mergeItems(loadItems('nursery'), sampleData.nurseryItems)));
  saveJson(itemsKey('elementary'), dedupeItems(mergeItems(loadItems('elementary'), sampleData.elementaryItems)));
  saveJson(storageKey('nursery', 'meals'), mergeMeals(loadMealMenus('nursery'), sampleData.nurseryMeals));
  saveJson(storageKey('elementary', 'meals'), mergeMeals(loadMealMenus('elementary'), sampleData.elementaryMeals));

  const currentTimetable = loadTimetable();
  if (isEmptyTimetable(currentTimetable)) {
    saveJson(storageKey('elementary', 'timetable'), sampleData.timetable);
  }

  saveJson(storageKey('elementary', 'homework'), mergeHomework(loadHomework(), sampleData.homework));
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
export function loadTimetable(): Timetable {
  const empty: Timetable = { mon: [], tue: [], wed: [], thu: [], fri: [] };
  return loadJson(storageKey('elementary', 'timetable'), empty);
}
export function saveTimetable(timetable: Timetable): void {
  saveJson(storageKey('elementary', 'timetable'), timetable);
}

// お迎え
export function loadPickups(): PickupRecord[] {
  return loadJson(storageKey('nursery', 'pickups'), []);
}
export function savePickups(records: PickupRecord[]): void {
  saveJson(storageKey('nursery', 'pickups'), records);
}

// 宿題
export function loadHomework(): HomeworkEntry[] {
  return loadJson(storageKey('elementary', 'homework'), []);
}
export function saveHomework(entries: HomeworkEntry[]): void {
  saveJson(storageKey('elementary', 'homework'), entries);
}

// 体調記録
export function loadHealthRecords(): HealthRecord[] {
  return loadJson(storageKey('nursery', 'health'), []);
}
export function saveHealthRecords(records: HealthRecord[]): void {
  saveJson(storageKey('nursery', 'health'), records);
}
