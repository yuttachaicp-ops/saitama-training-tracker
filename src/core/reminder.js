/**
 * reminder.js — การแจ้งเตือนเวลาออกกำลังกาย
 *
 * ข้อจำกัดที่ต้องบอกผู้ใช้ตามจริง:
 * นี่คือเว็บแอปที่ไม่มี Service Worker แบบ push จึงแจ้งเตือนได้
 * "เฉพาะตอนที่เปิดแอปค้างไว้ในเบราว์เซอร์" เท่านั้น
 * ไม่สามารถแจ้งเตือนขณะปิดแอปได้
 */

import * as state from './state.js';
import { todayKey } from './dates.js';
import { toast } from '../components/toast.js';

let intervalId = null;
let lastFiredKey = null;

export function supported() {
  return typeof Notification !== 'undefined';
}

export function permission() {
  return supported() ? Notification.permission : 'unsupported';
}

export async function requestPermission() {
  if (!supported()) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

function fire(timeStr) {
  const key = `${todayKey()} ${timeStr}`;
  if (lastFiredKey === key) return;
  lastFiredKey = key;

  const body = 'ถึงเวลาฝึกตามโปรแกรมแล้ว เปิดแอปเพื่อเริ่มได้เลย';
  if (permission() === 'granted') {
    try {
      new Notification('Saitama Training Tracker', { body });
      return;
    } catch {
      /* ตกไปใช้ toast ด้านล่าง */
    }
  }
  toast(body, 'ok', 6000);
}

export function start() {
  stop();
  intervalId = setInterval(() => {
    const { settings } = state.getData();
    if (!settings.reminderEnabled) return;
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (hhmm === settings.workoutTime) fire(hhmm);
  }, 20000);
}

export function stop() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
}
