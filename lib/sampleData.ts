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


// ─── 保育園 Items ─────────────────────────────────────────────
export const NURSERY_SAMPLE_ITEMS: Item[] = [
  { id: 'ns-1', title: '3月3日（火）体操', cat: '行事', date: '2026-03-03', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-2', title: '3月5日（木）リトミック参観', cat: '行事', date: '2026-03-05', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-3', title: '3月6日（金）ひまわり組を送る会', cat: '行事', date: '2026-03-06', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-4', title: '3月10日（火）卒園式予行', cat: '行事', date: '2026-03-10', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-5', title: '3月12日（木）英語', cat: '行事', date: '2026-03-12', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-6', title: '3月14日（土）卒園式', cat: '行事', date: '2026-03-14', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-7', title: '3月16日（月）造形ばら・ゆり', cat: '行事', date: '2026-03-16', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-8', title: '3月17日（火）体操', cat: '行事', date: '2026-03-17', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-9', title: '3月18日（水）誕生会', cat: '行事', date: '2026-03-18', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-10', title: '3月20日（金）春分の日', cat: '行事', date: '2026-03-20', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-11', title: '3月24日（火）卒園遠足', cat: '行事', date: '2026-03-24', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-12', title: '3月26日（木）英語', cat: '行事', date: '2026-03-26', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
  { id: 'ns-13', title: '3月31日（火）進級式', cat: '行事', date: '2026-03-31', memo: '〜3月の保育園行事予定', done: false, checkItems: [], mode: 'nursery' },
];

// ─── 小学校 Items（2年3組 3/16〜3/20）─────────────────────────
export const ELEMENTARY_SAMPLE_ITEMS: Item[] = [
  {
    id: 'el-1',
    title: '3月16日（月）行事: 給食最終日・お別れ花道',
    cat: '行事',
    date: weekDate(0),
    memo: '時間割: 国語（自分はっけん発表会）/ 生活（お手紙オープン）/ 算数（学習のまとめ）/ 学活（お別れ花道）。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-2',
    title: '3月17日（火）卒業証書授与式（臨時休業）',
    cat: '行事',
    date: weekDate(1),
    memo: '朝自習〜4校時まで臨時休業。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-3',
    title: '3月18日（水）短縮4時間（給食なし）',
    cat: 'お知らせ',
    date: weekDate(2),
    memo: '下校 12:10。時間割: 国語（書写）/ 図工（紙けん玉）/ 図工（1年間の作品まとめ）/ 体育（持久走・ボールけり）。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-4',
    title: '3月19日（木）短縮4時間（給食なし）',
    cat: 'お知らせ',
    date: weekDate(3),
    memo: '下校 12:10。時間割: 国語（ひろがることば）/ 学活（お楽しみ会）/ 体育（スポーツ版）/ 算数（サプライズ）。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-5',
    title: '3月20日（金）春分の日',
    cat: '行事',
    date: weekDate(4),
    memo: '自然をたたえ、生物をいつくしむ日。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-6',
    title: '持ち物（3月16日）',
    cat: '持ち物',
    date: weekDate(0),
    memo: '上ばき・体そうふく・工作マット・わりばし・毛糸（1mくらい）・自分はっけんファイル。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-7',
    title: '持ち物（3月18日/19日）',
    cat: '持ち物',
    date: weekDate(2),
    memo: '18日: ファイル・教科書持ち帰り。19日: 作品バッグ持ち帰り。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
  {
    id: 'el-8',
    title: '3月16日 連絡',
    cat: 'お知らせ',
    date: weekDate(0),
    memo: '〜10:30 業間休み / 10:35〜11:10 3時間目 / 11:15〜11:30 そうじ / 11:35〜11:45 帰りのしたく / 11:45〜12:30 給食 / 12:30〜13:00 放送。下校 13:30。',
    done: false,
    checkItems: [],
    mode: 'elementary',
  },
];

// ─── 献立（保育園） ───────────────────────────────────────────
export const NURSERY_MEAL_SAMPLE: MealMenu[] = [
  { date: '2026-03-02', lunch: 'のりたまごはん・鶏の照り焼き・切り干し大根の和え物・たまねぎとじゃがいものみそ汁', snack: 'りんご' },
  { date: '2026-03-03', lunch: 'お花のいろどりむすび・鮭のオーロラソース・ブロッコリーのおかか和え・菜の花と油麩のすまし汁', snack: 'ももゼリー' },
  { date: '2026-03-04', lunch: '具沢山ちゃんぽんめん・大学いも・のりとしらすのサラダ・ソフール いちご味', snack: '' },
  { date: '2026-03-05', lunch: '納豆ご飯（きりざい）・さばのごまねぎソース・茎わかめの炒り煮・はくさいとなすのみそ汁', snack: 'バナナ' },
  { date: '2026-03-06', lunch: 'マカロニグラタン・コーンとレタスのサラダ・ポトフスープ', snack: 'みかん' },
  { date: '2026-03-07', lunch: 'ねぎ塩にゅうめん・和風じゃがベー・青りんごゼリー', snack: '' },
  { date: '2026-03-09', lunch: '白飯・かじきのフライ・なっとうサラダ・せりと豚肉のみそ汁', snack: 'バナナ' },
  { date: '2026-03-10', lunch: 'タコライス・ウィンナーとアスパラのソテー・アーサー汁・チチヤスヨーグルト', snack: '' },
  { date: '2026-03-11', lunch: 'バターロール・スパニッシュオムレツ・トマトとキャベツのサラダ・ゴロゴロ野菜のミルクスープ', snack: 'バナナ' },
  { date: '2026-03-12', lunch: 'たらこスパゲッティ・スティックサラダ・肉団子スープ・青りんごゼリー', snack: '' },
  { date: '2026-03-13', lunch: 'チキンカレーライス・もやしとささみのナムル・かき玉汁', snack: 'バナナ' },
  { date: '2026-03-18', lunch: 'ハンバーガー・しましまハムチーズ・春セロリの鶏がらスープ・ピーチゼリー', snack: '' },
  { date: '2026-03-24', lunch: '麻婆豆腐丼・せんまいの3色ナムル・ビーフンスープ', snack: 'りんご' },
  { date: '2026-03-28', lunch: '五目豚肉うどん・鶏肉とさつまいもの洋風ソテー・チチヤスヨーグルト', snack: '' },
  { date: '2026-03-30', lunch: 'ミートソーススパゲティー・ウィンナーとアスパラのソテー・アーサー汁・チチヤスヨーグルト', snack: '' },
  { date: '2026-03-31', lunch: 'バターロール・ハンバーグ・マカロニサラダ・コーンスープ', snack: 'みかん' },
];

// ─── 献立（小学校） ───────────────────────────────────────────
export const ELEMENTARY_MEAL_SAMPLE: MealMenu[] = [
  { date: weekDate(0), lunch: '給食最終日', memo: '通常給食' },
  { date: weekDate(1), lunch: '臨時休業（給食なし）', memo: '卒業証書授与式' },
  { date: weekDate(2), lunch: '給食なし', memo: '短縮4時間' },
  { date: weekDate(3), lunch: '給食なし', memo: '短縮4時間' },
  { date: weekDate(4), lunch: '祝日（春分の日）', memo: '学校休業日' },
];

// ─── 時間割（2年3組 3/16〜3/20）──────────────────────────────
export const TIMETABLE_SAMPLE: Timetable = {
  mon: [
    { subject: '国語', note: '自分はっけん発表会／お気に入りページの発表' },
    { subject: '生活', note: '自分はっけん発表会／お手紙オープン' },
    { subject: '算数', note: '学習のまとめ／学活 じゅんび' },
    { subject: '学活', note: 'お別れ花道（6年生に思いをこめて）' },
  ],
  tue: [
    { subject: '臨時休業', note: '卒業証書授与式' },
    { subject: '臨時休業' },
    { subject: '臨時休業' },
    { subject: '臨時休業' },
  ],
  wed: [
    { subject: '国語', note: '書写／2年生で学習した漢字をまとめよう' },
    { subject: '図工', note: '紙けん玉を作ろう／作り方を工夫しよう' },
    { subject: '図工', note: '10:20〜11:05 1年間の作品をまとめよう' },
    { subject: '体育', note: '11:10〜11:55（校庭）持久走・ボールけり' },
  ],
  thu: [
    { subject: '国語', note: 'ひろがることば／これまでこれから' },
    { subject: '学活', note: 'お楽しみ会（教室バージョン）' },
    { subject: '体育', note: '10:20〜11:05（体育館）お楽しみ会 スポーツ版' },
    { subject: '算数', note: '11:10〜11:55 河合先生と森先生にサプライズ' },
  ],
  fri: [
    { subject: '春分の日', note: '祝日' },
  ],
};

// ─── 宿題（小学校） ─────────────────────────────────────────
export const HOMEWORK_SAMPLE: HomeworkEntry[] = [];
