import { Item, SchoolMode, MealMenu, Timetable, PickupRecord, HomeworkEntry, HealthRecord } from './types';
import {
  NURSERY_SAMPLE_ITEMS, ELEMENTARY_SAMPLE_ITEMS,
  NURSERY_MEAL_SAMPLE, ELEMENTARY_MEAL_SAMPLE,
  TIMETABLE_SAMPLE, HOMEWORK_SAMPLE,
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

export function loadItems(mode: SchoolMode): Item[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(itemsKey(mode));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveItems(mode: SchoolMode, items: Item[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(itemsKey(mode), JSON.stringify(items));
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

const SEEDED_KEY = `${STORAGE_PREFIX}-seeded`;
const SEEDED_VERSION = '4'; // バージョンを上げると既存ユーザーも再シード

export function seedSampleData(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(SEEDED_KEY) === SEEDED_VERSION) return;

  // Items
  saveJson(itemsKey('nursery'), NURSERY_SAMPLE_ITEMS);
  saveJson(itemsKey('elementary'), ELEMENTARY_SAMPLE_ITEMS);
  // 献立
  saveJson(storageKey('nursery', 'meals'), NURSERY_MEAL_SAMPLE);
  saveJson(storageKey('elementary', 'meals'), ELEMENTARY_MEAL_SAMPLE);
  // 時間割
  saveJson(storageKey('elementary', 'timetable'), TIMETABLE_SAMPLE);
  // 宿題
  saveJson(storageKey('elementary', 'homework'), HOMEWORK_SAMPLE);

  localStorage.setItem(SEEDED_KEY, SEEDED_VERSION);
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
