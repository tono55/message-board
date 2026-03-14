'use client';

import { useState, useEffect, useCallback } from 'react';
import { SchoolMode, MealMenu, Timetable, PickupRecord, HomeworkEntry, HealthRecord } from './types';
import {
  loadMealMenus, saveMealMenus,
  loadTimetable, saveTimetable,
  loadPickups, savePickups,
  loadHomework, saveHomework,
  loadHealthRecords, saveHealthRecords,
} from './storage';
import { generateId, todayString } from './utils';

export function useMealMenus(mode: SchoolMode, loaded: boolean) {
  const [menus, setMenus] = useState<MealMenu[]>([]);

  useEffect(() => {
    if (!loaded) return;
    queueMicrotask(() => setMenus(loadMealMenus(mode)));
  }, [mode, loaded]);

  useEffect(() => {
    if (loaded) saveMealMenus(mode, menus);
  }, [menus, loaded, mode]);

  const upsertMenu = useCallback((menu: MealMenu) => {
    setMenus(prev => {
      const idx = prev.findIndex(m => m.date === menu.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = menu;
        return next;
      }
      return [...prev, menu];
    });
  }, []);

  const deleteMenu = useCallback((date: string) => {
    setMenus(prev => prev.filter(m => m.date !== date));
  }, []);

  return { menus, upsertMenu, deleteMenu };
}

export function useTimetable(loaded: boolean) {
  const [timetable, setTimetable] = useState<Timetable>({ mon: [], tue: [], wed: [], thu: [], fri: [] });

  useEffect(() => {
    if (!loaded) return;
    queueMicrotask(() => setTimetable(loadTimetable()));
  }, [loaded]);

  useEffect(() => {
    if (loaded) saveTimetable(timetable);
  }, [timetable, loaded]);

  const updateTimetable = useCallback((newTimetable: Timetable) => {
    setTimetable(newTimetable);
  }, []);

  return { timetable, updateTimetable };
}

export function usePickups(loaded: boolean) {
  const [pickups, setPickups] = useState<PickupRecord[]>([]);

  useEffect(() => {
    if (!loaded) return;
    queueMicrotask(() => setPickups(loadPickups()));
  }, [loaded]);

  useEffect(() => {
    if (loaded) savePickups(pickups);
  }, [pickups, loaded]);

  const addPickup = useCallback((record: Omit<PickupRecord, 'date'> & { date?: string }) => {
    setPickups(prev => {
      const newRecord: PickupRecord = { date: record.date || todayString(), ...record } as PickupRecord;
      return [newRecord, ...prev];
    });
  }, []);

  const deletePickup = useCallback((date: string) => {
    setPickups(prev => prev.filter(p => p.date !== date));
  }, []);

  return { pickups, addPickup, deletePickup };
}

export function useHomework(loaded: boolean) {
  const [homework, setHomework] = useState<HomeworkEntry[]>([]);

  useEffect(() => {
    if (!loaded) return;
    queueMicrotask(() => setHomework(loadHomework()));
  }, [loaded]);

  useEffect(() => {
    if (loaded) saveHomework(homework);
  }, [homework, loaded]);

  const addHomework = useCallback((entry: Omit<HomeworkEntry, 'id' | 'done'>) => {
    const newEntry: HomeworkEntry = { ...entry, id: generateId(), done: false };
    setHomework(prev => [newEntry, ...prev]);
  }, []);

  const toggleHomework = useCallback((id: string) => {
    setHomework(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  }, []);

  const deleteHomework = useCallback((id: string) => {
    setHomework(prev => prev.filter(h => h.id !== id));
  }, []);

  return { homework, addHomework, toggleHomework, deleteHomework };
}

export function useHealthRecords(loaded: boolean) {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    if (!loaded) return;
    queueMicrotask(() => setRecords(loadHealthRecords()));
  }, [loaded]);

  useEffect(() => {
    if (loaded) saveHealthRecords(records);
  }, [records, loaded]);

  const upsertRecord = useCallback((record: HealthRecord) => {
    setRecords(prev => {
      const idx = prev.findIndex(r => r.date === record.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = record;
        return next;
      }
      return [record, ...prev];
    });
  }, []);

  const deleteRecord = useCallback((date: string) => {
    setRecords(prev => prev.filter(r => r.date !== date));
  }, []);

  return { records, upsertRecord, deleteRecord };
}
