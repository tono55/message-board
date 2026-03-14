'use client';

import { useState, useEffect, useCallback } from 'react';
import { Item, Category, SchoolMode } from '@/lib/types';
import { loadItems, saveItems, loadMode, saveMode, seedSampleData } from '@/lib/storage';
import { generateId, getCategoriesForMode, todayString } from '@/lib/utils';
import { useMealMenus, useTimetable, useHomework } from '@/lib/hooks';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Calendar from '@/components/Calendar';
import Board from '@/components/Board';
import UpcomingEvents from '@/components/UpcomingEvents';
import Footer from '@/components/Footer';
import AddModal from '@/components/AddModal';
import DetailModal from '@/components/DetailModal';
import MealMenuSection from '@/components/MealMenuSection';
import TimetableSection from '@/components/TimetableSection';
import HomeworkSection from '@/components/HomeworkSection';

export default function Home() {
  const [mode, setMode] = useState<SchoolMode>('elementary');
  // 両モードのアイテムをそれぞれ管理
  const [nurseryItems, setNurseryItems] = useState<Item[]>([]);
  const [elementaryItems, setElementaryItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCat, setSelectedCat] = useState<Category | ''>('');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailItem, setDetailItem] = useState<Item | null>(null);

  const categories = getCategoriesForMode(mode);
  // 掲示板用: 両モードをマージ
  const allItems = [...nurseryItems, ...elementaryItems];

  const { menus, upsertMenu, deleteMenu } = useMealMenus(mode, loaded);
  const { timetable, updateTimetable } = useTimetable(loaded);
  const { homework, addHomework, toggleHomework, deleteHomework } = useHomework(loaded);

  const isNursery = mode === 'nursery';
  const today = todayString();
  const todayHomework = homework.filter(h => h.date === today);
  // Hero の統計は現在モードのアイテムで計算
  const currentItems = isNursery ? nurseryItems : elementaryItems;

  useEffect(() => {
    seedSampleData();
    const savedMode = loadMode();
    setMode(savedMode);
    setNurseryItems(loadItems('nursery'));
    setElementaryItems(loadItems('elementary'));
    setLoaded(true);
  }, []);

  // 各モードを個別に保存
  useEffect(() => {
    if (loaded) saveItems('nursery', nurseryItems);
  }, [nurseryItems, loaded]);

  useEffect(() => {
    if (loaded) saveItems('elementary', elementaryItems);
  }, [elementaryItems, loaded]);

  const setItemsForMode = useCallback((m: SchoolMode, updater: (prev: Item[]) => Item[]) => {
    if (m === 'nursery') setNurseryItems(updater);
    else setElementaryItems(updater);
  }, []);

  const handleModeChange = useCallback((newMode: SchoolMode) => {
    if (newMode === mode) return;
    saveMode(newMode);
    setMode(newMode);
    setSelectedCat('');
    setSelectedDate('');
    setDetailItem(null);
  }, [mode]);

  const handleAdd = useCallback((data: { title: string; cat: Category; date: string; memo: string }) => {
    const newItem: Item = {
      id: generateId(),
      title: data.title,
      cat: data.cat,
      date: data.date,
      memo: data.memo,
      done: false,
      checkItems: [],
      mode,
    };
    setItemsForMode(mode, prev => [newItem, ...prev]);
    setShowAddModal(false);
  }, [mode, setItemsForMode]);

  const handleToggleDone = useCallback((id: string) => {
    // どちらのモードに属するか判定してから更新
    const item = allItems.find(i => i.id === id);
    if (!item) return;
    setItemsForMode(item.mode, prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
    setDetailItem(prev => prev ? { ...prev, done: !prev.done } : null);
  }, [allItems, setItemsForMode]);

  const handleDelete = useCallback((id: string) => {
    const item = allItems.find(i => i.id === id);
    if (!item) return;
    setItemsForMode(item.mode, prev => prev.filter(i => i.id !== id));
    setDetailItem(null);
  }, [allItems, setItemsForMode]);

  const handleChangeMonth = useCallback((delta: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar mode={mode} onModeChange={handleModeChange} onAddClick={() => setShowAddModal(true)} />
      <Hero
        items={currentItems}
        mode={mode}
        todayHomework={!isNursery ? todayHomework : undefined}
      />

      {!isNursery && (
        <HomeworkSection
          homework={homework}
          onAdd={addHomework}
          onToggle={toggleHomework}
          onDelete={deleteHomework}
        />
      )}

      <UpcomingEvents items={allItems} />
      <Calendar
        items={allItems}
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onChangeMonth={handleChangeMonth}
      />

      {!isNursery && (
        <TimetableSection timetable={timetable} onUpdate={updateTimetable} />
      )}

      <MealMenuSection menus={menus} mode={mode} onUpsert={upsertMenu} onDelete={deleteMenu} />

      <Board
        items={allItems}
        categories={categories}
        selectedDate={selectedDate}
        selectedCat={selectedCat}
        onSelectCat={setSelectedCat}
        onCardClick={setDetailItem}
      />
      <Footer />

      {showAddModal && (
        <AddModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onToggleDone={handleToggleDone}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
