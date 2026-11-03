/**
 * defaults.js — โครงสร้างข้อมูลเริ่มต้นของแอป
 * ค่าเหล่านี้เป็นเพียง "ค่าตั้งต้น" ผู้ใช้แก้ไขได้ทั้งหมดในหน้าตั้งค่า
 */

import { todayKey, mondayOf } from './dates.js';

export const SCHEMA_VERSION = 1;

export function defaultProfile() {
  return {
    name: 'นักฝึก',
    gender: 'male',
    age: 26,
    heightCm: 187,
    weightKg: 74,
    level: 'beginner',
    goals: 'เพิ่มความแข็งแรง เพิ่มความอึด และสร้างความสม่ำเสมอ',
    sessionMinutes: 60,
    daysPerWeek: 6,
    equipment: 'bodyweight',
  };
}

export function defaultSettings() {
  return {
    theme: 'dark', // 'dark' | 'light' | 'system'
    startDate: mondayOf(todayKey()), // โปรแกรมเริ่มนับจากวันจันทร์ของสัปดาห์ปัจจุบัน
    difficulty: 'standard', // 'easy' | 'standard' | 'hard'
    restSeconds: 60,
    distanceUnit: 'km', // 'km' | 'mi'
    workoutTime: '05:00',
    reminderEnabled: false,
  };
}

export function defaultData() {
  return {
    schemaVersion: SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: defaultProfile(),
    settings: defaultSettings(),
    /**
     * programOverrides: ผู้ใช้ปรับจำนวนครั้ง/เซตของท่าในสัปดาห์ใด ๆ ได้
     * key = `${week}:${planKey}:${exerciseId}` -> { reps, sets }
     */
    programOverrides: {},
    /**
     * sessions: เก็บผลการฝึกจริง key = 'YYYY-MM-DD'
     * { date, planKey, type, status, startedAt, completedAt, elapsedSec,
     *   exercises:[{id,name,targetReps,targetSets,setsDone,repsDone[],done}],
     *   run:{distanceKm,durationSec,rounds,runMin,walkMin},
     *   rpe, note }
     */
    sessions: {},
    /** achievements: { id: ISOstring ที่ปลดล็อก } */
    achievements: {},
    /** สำรองข้อมูลอัตโนมัติก่อนรีเซ็ต */
    lastBackup: null,
  };
}

export const DIFFICULTY_FACTOR = {
  easy: 0.8,
  standard: 1,
  hard: 1.2,
};

export const LEVEL_LABEL = {
  beginner: 'เริ่มต้น',
  intermediate: 'ปานกลาง',
  advanced: 'ขั้นสูง',
};

export const DIFFICULTY_LABEL = {
  easy: 'เบา (ลดจำนวนครั้ง 20%)',
  standard: 'มาตรฐาน (ตามโปรแกรม)',
  hard: 'หนัก (เพิ่มจำนวนครั้ง 20%)',
};
