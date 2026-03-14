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
  { date: weekDate(0), lunch: 'カレーライス・グリーンサラダ・牛乳', snack: 'りんご・せんべい', allergens: '乳・小麦' },
  { date: weekDate(1), lunch: 'ハンバーグ・コーンスープ・パン・牛乳', snack: 'バナナ・ビスケット', allergens: '乳・卵・小麦' },
  { date: weekDate(2), lunch: 'ちゃんぽん・小松菜おひたし・牛乳', snack: 'さつまいもスティック', allergens: '乳・小麦・えび' },
  { date: weekDate(3), lunch: '親子丼・みそ汁・牛乳', snack: 'ヨーグルト・ゼリー', allergens: '乳・卵・小麦・大豆' },
  { date: weekDate(4), lunch: 'スパゲッティミートソース・コールスロー・牛乳', snack: 'おにぎり・麦茶', allergens: '乳・卵・小麦' },
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
