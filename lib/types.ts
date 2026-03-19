export type SchoolMode = 'nursery' | 'elementary';

export type NurseryCategory = '行事' | '連絡帳' | 'お知らせ' | '給食' | '持ち物';
export type ElementaryCategory = '行事' | '提出物' | 'お知らせ' | '給食' | '持ち物';
export type Category = NurseryCategory | ElementaryCategory;

export interface Item {
  id: string;
  title: string;
  cat: Category;
  date: string; // YYYY-MM-DD or ''
  memo: string;
  done: boolean;
  checkItems: string[];
  mode: SchoolMode; // どのモードのおたよりか
}

// 献立
export interface MealMenu {
  date: string;       // YYYY-MM-DD
  lunch: string;      // "カレーライス、サラダ、牛乳"
  snack?: string;     // 保育園のみ: おやつ
  allergens?: string;
  memo?: string;
}

// 時間割（小学校のみ）
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
export interface TimetableEntry { subject: string; note?: string; }
export type Timetable = Record<Weekday, TimetableEntry[]>;

// お迎え（保育園のみ）
export interface PickupRecord {
  date: string;
  plannedTime: string;  // HH:MM
  pickedUpBy: string;   // "ママ", "パパ" 等
  isExtended: boolean;  // 延長保育
  memo?: string;
}

// 体調記録（保育園のみ）
export interface HealthRecord {
  date: string;
  temperature: number;  // 36.5
  condition: 'good' | 'fair' | 'poor';
  symptoms?: string;
  memo?: string;
}
