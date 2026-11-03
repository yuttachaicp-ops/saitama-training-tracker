/**
 * storage.js — ชั้นจัดเก็บข้อมูลถาวร (localStorage)
 * ข้อมูลของแอปมีขนาดเล็ก (12 สัปดาห์ ~ 90 เซสชัน) จึงใช้ localStorage
 * ซึ่งอ่าน/เขียนแบบ synchronous ได้เร็วและรองรับทุกเบราว์เซอร์
 *
 * ทุกฟังก์ชันมี try/catch — หากเบราว์เซอร์ปิด storage ไว้ แอปยังทำงานต่อได้
 * (แต่ข้อมูลจะไม่ถูกบันทึก และจะมีการแจ้งเตือนผู้ใช้)
 */

import { defaultData, SCHEMA_VERSION } from './defaults.js';

const KEY = 'saitama-training-tracker/v1';
const BACKUP_KEY = 'saitama-training-tracker/backup';

let storageWorks = true;

export function isStorageAvailable() {
  return storageWorks;
}

function probe() {
  try {
    const t = '__stt_probe__';
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
    storageWorks = true;
  } catch {
    storageWorks = false;
  }
  return storageWorks;
}

/** รวมข้อมูลที่โหลดมากับโครงสร้างเริ่มต้น เพื่อกันคีย์หายเมื่ออัปเกรดเวอร์ชัน */
function migrate(raw) {
  const base = defaultData();
  if (!raw || typeof raw !== 'object') return base;

  const out = {
    ...base,
    ...raw,
    schemaVersion: SCHEMA_VERSION,
    profile: { ...base.profile, ...(raw.profile || {}) },
    settings: { ...base.settings, ...(raw.settings || {}) },
    programOverrides: raw.programOverrides || {},
    sessions: raw.sessions && typeof raw.sessions === 'object' ? raw.sessions : {},
    achievements: raw.achievements && typeof raw.achievements === 'object' ? raw.achievements : {},
  };

  // ป้องกันข้อมูลเสียหาย: เซสชันต้องเป็น object ที่มี date
  for (const [k, v] of Object.entries(out.sessions)) {
    if (!v || typeof v !== 'object' || !v.date) delete out.sessions[k];
    else if (!Array.isArray(v.exercises)) v.exercises = v.exercises ? [] : [];
  }
  return out;
}

export function load() {
  probe();
  if (!storageWorks) return defaultData();
  try {
    const txt = localStorage.getItem(KEY);
    if (!txt) return defaultData();
    return migrate(JSON.parse(txt));
  } catch (err) {
    console.error('[storage] อ่านข้อมูลไม่สำเร็จ ใช้ค่าเริ่มต้นแทน', err);
    return defaultData();
  }
}

export function save(data) {
  if (!storageWorks) return false;
  try {
    data.updatedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('[storage] บันทึกข้อมูลไม่สำเร็จ', err);
    storageWorks = false;
    return false;
  }
}

/** สำรองข้อมูลปัจจุบันไว้หนึ่งชุด (ใช้ก่อนรีเซ็ต) */
export function writeBackup(data) {
  try {
    localStorage.setItem(
      BACKUP_KEY,
      JSON.stringify({ at: new Date().toISOString(), data })
    );
    return true;
  } catch {
    return false;
  }
}

export function readBackup() {
  try {
    const txt = localStorage.getItem(BACKUP_KEY);
    return txt ? JSON.parse(txt) : null;
  } catch {
    return null;
  }
}

export function clearAll() {
  try {
    localStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}

/** ตรวจสอบไฟล์ JSON ที่นำเข้า — คืน { ok, data, error } */
export function validateImport(obj) {
  if (!obj || typeof obj !== 'object') {
    return { ok: false, error: 'ไฟล์ไม่ใช่ JSON ที่ถูกต้อง' };
  }
  if (!obj.profile && !obj.sessions && !obj.settings) {
    return { ok: false, error: 'ไม่พบข้อมูลของแอปในไฟล์นี้' };
  }
  try {
    return { ok: true, data: migrate(obj) };
  } catch (err) {
    return { ok: false, error: 'โครงสร้างข้อมูลในไฟล์เสียหาย' };
  }
}
