import { Item, MealMenu, Timetable, HomeworkEntry } from './types';
import { toDateString } from './utils';

// 今週の月曜日を基準に相対日付を生成
function weekDate(offsetDays: number): string {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  const d = new Date(monday);
  d.setDate(monday.getDate() + offsetDays);
  return toDateString(d);
}

function relDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return toDateString(d);
}

// ─── 保育園 Items ─────────────────────────────────────────────
export const NURSERY_SAMPLE_ITEMS: Item[] = [
  {
    id: 'ns-1',
    title: '春の遠足のお知らせ',
    cat: '行事',
    date: relDate(10),
    memo: '持ち物: お弁当、水筒、レジャーシート、帽子。雨天中止の場合は前日18時にメール連絡します。',
    done: false,
    checkItems: [],
    mode: 'nursery',
  },
  {
    id: 'ns-2',
    title: '4月の保育参観',
    cat: '行事',
    date: relDate(18),
    memo: '10:00〜11:30。保護者証をお持ちください。駐車場は園庭をご利用ください。',
    done: false,
    checkItems: [],
    mode: 'nursery',
  },
  {
    id: 'ns-3',
    title: '健康診断のお知らせ',
    cat: 'お知らせ',
    date: relDate(5),
    memo: '園医による内科・歯科検診を実施します。当日は動きやすい服装でお越しください。',
    done: false,
    checkItems: [],
    mode: 'nursery',
  },
  {
    id: 'ns-4',
    title: '4月の給食献立表',
    cat: '給食',
    date: relDate(1),
    memo: 'アレルギー対応が必要な方は担任まで早めにご相談ください。',
    done: true,
    checkItems: [],
    mode: 'nursery',
  },
  {
    id: 'ns-5',
    title: '絵本バッグの持参について',
    cat: '持ち物',
    date: relDate(3),
    memo: '毎週金曜日に絵本の貸し出しを行います。専用の絵本バッグをご用意ください（市販品で可）。',
    done: false,
    checkItems: [],
    mode: 'nursery',
  },
  {
    id: 'ns-6',
    title: '連絡帳の記入のお願い',
    cat: '連絡帳',
    date: relDate(0),
    memo: '体温・朝食の有無・体調の欄を毎朝ご記入ください。',
    done: true,
    checkItems: [],
    mode: 'nursery',
  },
];

// ─── 小学校 Items ─────────────────────────────────────────────
export const ELEMENTARY_SAMPLE_ITEMS: Item[] = [
  {
    id: 'el-1',
    title: '運動会のご案内',
    cat: '行事',
    date: relDate(21),
    memo: '場所取りは当日6時から可。競技プログラムは別途配布します。雨天順延の場合は翌週土曜日。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-2',
    title: '社会科見学（市役所）',
    cat: '行事',
    date: relDate(7),
    memo: '集合8:30、正門前。弁当・水筒持参。公共交通機関を利用するため交通カードを準備してください。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-3',
    title: '読書感想文の提出',
    cat: '提出物',
    date: relDate(4),
    memo: '原稿用紙3〜5枚。タイトルと氏名を必ず書くこと。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-4',
    title: '緊急連絡先カードの提出',
    cat: '提出物',
    date: relDate(2),
    memo: '昨年から変更がある場合は新しいカードに記入して提出してください。',
    done: true,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-5',
    title: '学校だより（4月号）',
    cat: 'お知らせ',
    date: relDate(0),
    memo: '年間行事予定、PTA役員名簿が掲載されています。',
    done: true,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-6',
    title: '水泳道具の準備',
    cat: '持ち物',
    date: relDate(14),
    memo: '水着、スイムキャップ、ゴーグル（任意）、バスタオル。名前を記入のこと。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
];

// ─── 献立（保育園） ───────────────────────────────────────────
export const NURSERY_MEAL_SAMPLE: MealMenu[] = [
  { date: weekDate(0), lunch: 'カレーライス・グリーンサラダ・牛乳', snack: 'りんご・せんべい', allergens: '乳・小麦' },
  { date: weekDate(1), lunch: 'ハンバーグ・コーンスープ・パン・牛乳', snack: 'バナナ・ビスケット', allergens: '乳・卵・小麦' },
  { date: weekDate(2), lunch: 'ちゃんぽん・小松菜おひたし・牛乳', snack: 'さつまいもスティック', allergens: '乳・小麦・えび' },
  { date: weekDate(3), lunch: '親子丼・みそ汁・牛乳', snack: 'ヨーグルト・ゼリー', allergens: '乳・卵・小麦・大豆' },
  { date: weekDate(4), lunch: 'スパゲッティミートソース・コールスロー・牛乳', snack: 'おにぎり・麦茶', allergens: '乳・卵・小麦' },
];

// ─── 献立（小学校） ───────────────────────────────────────────
export const ELEMENTARY_MEAL_SAMPLE: MealMenu[] = [
  { date: weekDate(0), lunch: 'カレーライス・福神漬け・牛乳', allergens: '乳・小麦' },
  { date: weekDate(1), lunch: 'ソフトめん・肉みそかけ・ほうれん草ソテー・牛乳', allergens: '乳・小麦・大豆' },
  { date: weekDate(2), lunch: '鶏のから揚げ・ごはん・わかめスープ・牛乳', allergens: '乳・小麦・大豆' },
  { date: weekDate(3), lunch: 'ポークカレー・ブロッコリーサラダ・牛乳', allergens: '乳・小麦' },
  { date: weekDate(4), lunch: 'サバの塩焼き・ごはん・豚汁・牛乳', allergens: '乳・さば' },
];

// ─── 時間割 ───────────────────────────────────────────────────
export const TIMETABLE_SAMPLE: Timetable = {
  mon: [
    { subject: '国語' },
    { subject: '算数' },
    { subject: '体育', note: '体操服持参' },
    { subject: '理科' },
    { subject: '総合' },
    { subject: '道徳' },
  ],
  tue: [
    { subject: '算数' },
    { subject: '国語' },
    { subject: '社会' },
    { subject: '音楽' },
    { subject: '英語' },
  ],
  wed: [
    { subject: '理科' },
    { subject: '国語' },
    { subject: '算数' },
    { subject: '図工', note: '絵の具持参' },
    { subject: '図工', note: '絵の具持参' },
  ],
  thu: [
    { subject: '社会' },
    { subject: '算数' },
    { subject: '国語' },
    { subject: '体育' },
    { subject: '英語' },
    { subject: '学活' },
  ],
  fri: [
    { subject: '国語' },
    { subject: '理科' },
    { subject: '算数' },
    { subject: '社会' },
    { subject: '道徳' },
  ],
};

// ─── 宿題 ─────────────────────────────────────────────────────
export const HOMEWORK_SAMPLE: HomeworkEntry[] = [
  { id: 'hw-1', date: relDate(0), subject: '算数', description: 'ドリル P.24〜25（わり算）', done: false },
  { id: 'hw-2', date: relDate(0), subject: '国語', description: '漢字練習ノート P.18（10問）', done: true },
  { id: 'hw-3', date: relDate(0), subject: '英語', description: 'ワークシート No.7 を仕上げる', done: false },
  { id: 'hw-4', date: relDate(1), subject: '理科', description: '植物の観察日記を書く', done: false },
  { id: 'hw-5', date: relDate(1), subject: '社会', description: '教科書 P.32〜35 を読んでくる', done: false },
];
