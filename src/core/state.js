/**
 * state.js — ศูนย์กลางข้อมูลของแอป (single source of truth)
 * - โหลดข้อมูลจาก storage ครั้งเดียวตอนเปิดแอป
 * - ทุกการแก้ไขผ่าน update() ซึ่งบันทึกลง storage แล้วแจ้ง subscriber
 */

import * as storage from './storage.js';
import { defaultData } from './defaults.js';

let data = storage.load();
const listeners = new Set();

export function getData() {
  return data;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(reason) {
  for (const fn of listeners) {
    try {
      fn(data, reason);
    } catch (err) {
      console.error('[state] subscriber error', err);
    }
  }
}

/**
 * แก้ไขข้อมูล: ส่ง callback ที่แก้ object โดยตรง
 * @param {(d:object)=>void} mutator
 * @param {{silent?:boolean, reason?:string}} opts
 */
export function update(mutator, opts = {}) {
  try {
    mutator(data);
  } catch (err) {
    console.error('[state] mutator error', err);
    return false;
  }
  const ok = storage.save(data);
  if (!opts.silent) notify(opts.reason || 'update');
  return ok;
}

/** แทนที่ข้อมูลทั้งก้อน (ใช้ตอน import / reset) */
export function replace(next, reason = 'replace') {
  data = next;
  storage.save(data);
  notify(reason);
}

export function resetAll() {
  storage.writeBackup(data);
  const fresh = defaultData();
  fresh.lastBackup = new Date().toISOString();
  replace(fresh, 'reset-all');
}

/** รีเซ็ตเฉพาะความคืบหน้า เก็บโปรไฟล์และการตั้งค่าไว้ */
export function resetProgram(newStartDate) {
  storage.writeBackup(data);
  update((d) => {
    d.sessions = {};
    d.achievements = {};
    d.programOverrides = {};
    d.lastBackup = new Date().toISOString();
    if (newStartDate) d.settings.startDate = newStartDate;
  }, { reason: 'reset-program' });
}

export const storageAvailable = storage.isStorageAvailable;
export const readBackup = storage.readBackup;
export const validateImport = storage.validateImport;

/* ---------- ตัวช่วยเข้าถึงเซสชัน ---------- */

export function getSession(dateKey) {
  return data.sessions[dateKey] || null;
}

export function putSession(session) {
  update((d) => {
    d.sessions[session.date] = session;
  }, { reason: 'session' });
}

export function deleteSession(dateKey) {
  update((d) => {
    delete d.sessions[dateKey];
  }, { reason: 'session-delete' });
}

/** คืนเซสชันทั้งหมด เรียงจากใหม่ไปเก่า */
export function allSessions() {
  return Object.values(data.sessions).sort((a, b) => (a.date < b.date ? 1 : -1));
}
