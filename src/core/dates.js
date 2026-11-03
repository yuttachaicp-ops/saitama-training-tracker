/**
 * dates.js — ฟังก์ชันจัดการวันที่ทั้งหมด (ใช้เวลาท้องถิ่นของเครื่องผู้ใช้)
 * รูปแบบคีย์วันที่มาตรฐานของแอปคือ 'YYYY-MM-DD'
 */

export const DOW_TH = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
export const DOW_FULL_TH = [
  'อาทิตย์',
  'จันทร์',
  'อังคาร',
  'พุธ',
  'พฤหัสบดี',
  'ศุกร์',
  'เสาร์',
];
export const MONTH_TH = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

/** คืนคีย์ 'YYYY-MM-DD' ของ Date (เวลาท้องถิ่น) */
export function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** แปลงคีย์ 'YYYY-MM-DD' กลับเป็น Date (เที่ยงวัน เพื่อเลี่ยงปัญหา DST) */
export function fromKey(key) {
  const [y, m, d] = String(key).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

export function todayKey() {
  return toKey(new Date());
}

export function addDays(key, n) {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** จำนวนวันระหว่างสองคีย์ (b - a) */
export function daysBetween(a, b) {
  const ms = fromKey(b).getTime() - fromKey(a).getTime();
  return Math.round(ms / 86400000);
}

/** 0 = อาทิตย์ ... 6 = เสาร์ */
export function dowOf(key) {
  return fromKey(key).getDay();
}

/** แปลงเป็นดัชนีโปรแกรม 0 = จันทร์ ... 6 = อาทิตย์ */
export function programDayIndex(key) {
  return (dowOf(key) + 6) % 7;
}

/** วันจันทร์ของสัปดาห์ที่คีย์นั้นอยู่ */
export function mondayOf(key) {
  return addDays(key, -programDayIndex(key));
}

/** '3 พ.ย. 2568' (พ.ศ.) */
export function fmtThai(key, withYear = true) {
  const d = fromKey(key);
  const base = `${d.getDate()} ${MONTH_TH[d.getMonth()]}`;
  return withYear ? `${base} ${d.getFullYear() + 543}` : base;
}

/** 'จ. 3 พ.ย. 2568' */
export function fmtThaiFull(key) {
  return `${DOW_TH[dowOf(key)]} ${fmtThai(key)}`;
}

/** วินาที -> 'MM:SS' หรือ 'H:MM:SS' */
export function fmtDuration(sec) {
  sec = Math.max(0, Math.round(sec || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** วินาที -> '1 ชม. 20 นาที' สำหรับข้อความสรุป */
export function fmtDurationTh(sec) {
  sec = Math.max(0, Math.round(sec || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h > 0) return m > 0 ? `${h} ชม. ${m} นาที` : `${h} ชม.`;
  if (m > 0) return `${m} นาที`;
  if (sec > 0) return `${sec} วินาที`;
  return '0 นาที';
}

/** pace วินาที/กม. -> "6:12 /กม." */
export function fmtPace(secPerKm) {
  if (!isFinite(secPerKm) || secPerKm <= 0) return '—';
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** คืนลิสต์คีย์วันที่ 7 วันของสัปดาห์ที่คีย์นั้นอยู่ (จันทร์ -> อาทิตย์) */
export function weekKeys(key) {
  const mon = mondayOf(key);
  return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
}
