'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SchoolMode, TimetableByWeek, MealMenu, Timetable, PickupRecord, HealthRecord } from './types';
import {
  loadMealMenus, saveMealMenus,
  loadTimetables, saveTimetables,
  loadPickups, savePickups,
  loadHealthRecords, saveHealthRecords,
} from './storage';
import { emptyTimetable, getWeekKey, todayString } from './utils';

export function useMealMenus(mode: SchoolMode, loaded: boolean) {
  const [menus, setMenus] = useState<MealMenu[]>([]);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!loaded) return;
    hydratedRef.current = false;
    queueMicrotask(() => {
      setMenus(loadMealMenus(mode));
      hydratedRef.current = true;
    });
  }, [mode, loaded]);

  useEffect(() => {
    if (loaded && hydratedRef.current) saveMealMenus(mode, menus);
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

export function useTimetable(loaded: boolean, baseDate?: Date) {
  const [timetables, setTimetables] = useState<TimetableByWeek>({});
  const hydratedRef = useRef(false);
  const weekKey = getWeekKey(baseDate);

  useEffect(() => {
    if (!loaded) return;
    hydratedRef.current = false;
    queueMicrotask(() => {
      setTimetables(loadTimetables());
      hydratedRef.current = true;
    });
  }, [loaded]);

  useEffect(() => {
    if (loaded && hydratedRef.current) saveTimetables(timetables);
  }, [timetables, loaded]);

  const updateTimetable = useCallback((newTimetable: Timetable) => {
    setTimetables(prev => ({ ...prev, [weekKey]: newTimetable }));
  }, [weekKey]);

  const timetable = timetables[weekKey] ?? emptyTimetable();
  return { timetable, updateTimetable };
}

export function usePickups(loaded: boolean) {
  const [pickups, setPickups] = useState<PickupRecord[]>([]);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!loaded) return;
    hydratedRef.current = false;
    queueMicrotask(() => {
      setPickups(loadPickups());
      hydratedRef.current = true;
    });
  }, [loaded]);

  useEffect(() => {
    if (loaded && hydratedRef.current) savePickups(pickups);
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

export function useHealthRecords(loaded: boolean) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!loaded) return;
    hydratedRef.current = false;
    queueMicrotask(() => {
      setRecords(loadHealthRecords());
      hydratedRef.current = true;
    });
  }, [loaded]);

  useEffect(() => {
    if (loaded && hydratedRef.current) saveHealthRecords(records);
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
