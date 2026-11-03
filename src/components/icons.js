/**
 * icons.js — ไอคอน SVG แบบ inline ทั้งหมด (ไม่มีไฟล์ภาพภายนอก ไม่มีตัวละคร)
 * ทุกไอคอนใช้ currentColor จึงเปลี่ยนสีตามธีมอัตโนมัติ
 */

const S = (body, opts = '') =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${opts}>${body}</svg>`;

/* ---------- ไอคอนอินเทอร์เฟซ ---------- */
export const UI = {
  home: S('<path d="M3 10.5 12 3.5l9 7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  calendar: S(
    '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>'
  ),
  chart: S('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  settings: S(
    '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1z"/>'
  ),
  dumbbell: S('<path d="M6 7v10M3.5 9.5v5M18 7v10M20.5 9.5v5M6 12h12"/>'),
  run: S(
    '<circle cx="15.5" cy="4.6" r="1.9"/><path d="M12.4 21.5l1.6-5.1-3-2.6-.9 4M14 16.4l-3.6-2.9 1.1-4.6 3.3-1.3 2.4 3.3 2.6 1.1M11.5 7.9 8.2 9.2l-1 3.1M5.5 20.5l2.3-3.4"/>'
  ),
  check: S('<path d="M4.5 12.5 9.5 17.5 19.5 6.8"/>', 'stroke-width="2.6"'),
  play: S('<path d="M7 4.6 19.2 12 7 19.4z" fill="currentColor"/>'),
  pause: S('<rect x="6.5" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none"/>'),
  stop: S('<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>'),
  plus: S('<path d="M12 5v14M5 12h14"/>'),
  minus: S('<path d="M5 12h14"/>'),
  left: S('<path d="M15 5 8 12l7 7"/>'),
  right: S('<path d="M9 5l7 7-7 7"/>'),
  down: S('<path d="M5 9l7 7 7-7"/>'),
  sun: S(
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/>'
  ),
  moon: S('<path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z"/>'),
  monitor: S('<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8.5 21h7M12 17v4"/>'),
  trophy: S(
    '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4.5v1A3.5 3.5 0 0 0 8 10M17 5.5h2.5v1A3.5 3.5 0 0 1 16 10M9.5 20h5M12 14v6"/>'
  ),
  clock: S('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.3 2"/>'),
  flame: S(
    '<path d="M12 22a6 6 0 0 0 6-6c0-4-3-5.5-3.5-9-2 1.5-2.5 3.5-2 5.5-1.2-.6-1.8-2-1.8-3.4C8.4 10.6 6 12.8 6 16a6 6 0 0 0 6 6z"/>'
  ),
  ruler: S('<path d="M3.8 14.2 14.2 3.8l6 6L9.8 20.2z"/><path d="M8 8l2 2M11 5l2 2M5 11l2 2"/>'),
  history: S(
    '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1M3.5 4.5V9H8"/><path d="M12 7.5V12l3 1.8"/>'
  ),
  bell: S(
    '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9z"/><path d="M13.7 19a2 2 0 0 1-3.4 0"/>'
  ),
  download: S('<path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4 19.5h16"/>'),
  upload: S('<path d="M12 15.5v-11M7.5 8.5 12 4l4.5 4.5M4 19.5h16"/>'),
  trash: S(
    '<path d="M4 6.5h16M9.5 6.5V4.2h5v2.3M6.5 6.5l.9 13a1.5 1.5 0 0 0 1.5 1.3h6.2a1.5 1.5 0 0 0 1.5-1.3l.9-13"/><path d="M10 10.5v6.5M14 10.5v6.5"/>'
  ),
  edit: S('<path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 7.5l2 2"/>'),
  info: S('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.3"/>'),
  alert: S('<path d="M12 3.5 22 20H2z"/><path d="M12 9.5v4M12 16.8v.3"/>'),
  x: S('<path d="M6 6l12 12M18 6 6 18"/>'),
  target: S('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
  search: S('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
  filter: S('<path d="M3.5 5.5h17l-6.5 7.5V20l-4-2v-5z"/>'),
  save: S('<path d="M5 4h11l3 3v13H5z"/><path d="M8.5 4v5h7V4M8.5 20v-5h7v5"/>'),
  refresh: S('<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6M20.5 3.5V9H15"/>'),
  book: S('<path d="M4 4.5h6a3 3 0 0 1 3 3V21a2.4 2.4 0 0 0-2.4-2.4H4z"/><path d="M20 4.5h-6a3 3 0 0 0-3 3V21a2.4 2.4 0 0 1 2.4-2.4H20z"/>'),
  heart: S('<path d="M12 20.2 4.6 13A4.5 4.5 0 0 1 12 7.8 4.5 4.5 0 0 1 19.4 13z"/>'),
  lock: S('<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/>'),
  user: S('<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>'),
  road: S('<path d="M8 3 5 21M16 3l3 18M12 4v3M12 11v3M12 18v3"/>'),
};

/* ---------- ไอคอนท่าออกกำลังกาย (เส้นเรียบ ไม่ใช่ตัวการ์ตูน) ---------- */
const E = (body) =>
  `<svg viewBox="0 0 48 32" width="44" height="29" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const EX_ICON = {
  // ลำตัวตรงแนวนอน แขนดันขึ้นลง
  pushup: E(
    '<circle cx="9" cy="12" r="2.6"/><path d="M12 13h20l6 5"/><path d="M14 13v8M30 13v8"/><path d="M38 18l3 3"/>'
  ),
  // ลำตัวเอียง มือวางที่สูงกว่า
  incline_pushup: E(
    '<circle cx="8" cy="17" r="2.6"/><path d="M11 17.5 32 10"/><path d="M13 18v6M29 11v13"/><path d="M34 8h10v4"/>'
  ),
  // ย่อเข่า
  squat: E(
    '<circle cx="18" cy="6" r="2.8"/><path d="M18 9v7l-6 5v5"/><path d="M18 16l6 5v5"/><path d="M18 11l-6 2"/>'
  ),
  // สะโพกยกจากพื้น
  glute_bridge: E(
    '<circle cx="7" cy="20" r="2.6"/><path d="M10 20 20 11l8 9"/><path d="M28 20v6"/><path d="M4 27h40"/>'
  ),
  // นอนหงายยกแขนขาสลับ
  dead_bug: E(
    '<circle cx="10" cy="20" r="2.6"/><path d="M13 21h18"/><path d="M16 21 13 11M31 21l4-9"/><path d="M26 21l2 7"/><path d="M4 27h40"/>'
  ),
  // เขย่งปลายเท้า
  calf_raise: E(
    '<circle cx="24" cy="5" r="2.8"/><path d="M24 8v12"/><path d="M24 20v5l4 2"/><path d="M24 11l-6 3M24 11l6 3"/><path d="M8 27h32"/>'
  ),
  // ก้าวขาถอยหลัง
  reverse_lunge: E(
    '<circle cx="20" cy="5" r="2.8"/><path d="M20 8v9"/><path d="M20 17l-4 5v5"/><path d="M20 17l8 4 4 6"/><path d="M6 27h36"/>'
  ),
  // พับสะโพก ก้มลำตัว
  hip_hinge: E(
    '<circle cx="12" cy="11" r="2.8"/><path d="M15 12h10l3 8"/><path d="M28 20v6"/><path d="M15 14l-3 6"/><path d="M6 27h36"/>'
  ),
  // คลานยกแขนขาสลับ
  bird_dog: E(
    '<circle cx="12" cy="11" r="2.6"/><path d="M15 12h14"/><path d="M29 12v9M18 12v9"/><path d="M15 12 7 7M29 16l8-5"/><path d="M4 24h40"/>'
  ),
  // ลำตัวตรงยันศอก
  plank: E(
    '<circle cx="9" cy="13" r="2.6"/><path d="M12 14h22l5 7"/><path d="M14 14v7h-3"/><path d="M4 24h40"/>'
  ),
  // ยืดเหยียด
  stretch: E(
    '<circle cx="14" cy="7" r="2.8"/><path d="M14 10v8l-5 8"/><path d="M14 18l9 8"/><path d="M14 12l-6-3M14 12l10-4"/>'
  ),
  // วิ่ง
  run: E(
    '<circle cx="30" cy="6" r="2.8"/><path d="M28 10 22 14l1 6-4 7"/><path d="M23 20l6 2 2 6"/><path d="M26 12l6 1 3 4"/><path d="M20 13l-6 2"/>'
  ),
  // เดิน
  walk: E(
    '<circle cx="26" cy="6" r="2.8"/><path d="M26 9v8"/><path d="M26 17l-5 9M26 17l5 9"/><path d="M26 12l-6 3M26 12l6 2"/>'
  ),

  // ---------- ท่าวอร์มอัป (เคลื่อนไหว) ----------
  // ยกเข่าสลับอยู่กับที่
  march: E(
    '<circle cx="24" cy="5" r="2.6"/><path d="M24 8v9"/><path d="M24 17l-6 3 2 7M24 17l4 4v6"/><path d="M24 11l-5 4M24 11l5-2"/><path d="M8 28h32"/>'
  ),
  // หมุนไหล่และแขนเป็นวง
  arm_circles: E(
    '<circle cx="20" cy="6" r="2.6"/><path d="M20 9v10l-3 8M20 19l3 8"/><path d="M20 12l6-3"/><path d="M32 4a7 7 0 1 1-5 12" stroke-dasharray="3 3"/><path d="M28 14l-1 3 3 .5"/>'
  ),
  // บิดลำตัวซ้ายขวา
  torso_twist: E(
    '<circle cx="24" cy="5" r="2.6"/><path d="M24 8v10"/><path d="M24 18l-4 9M24 18l4 9"/><path d="M14 12h20"/><path d="M14 12l3-3M14 12l3 3M34 12l-3-3M34 12l-3 3"/>'
  ),
  // หมุนสะโพก
  hip_circles: E(
    '<circle cx="24" cy="5" r="2.6"/><path d="M24 8v8"/><ellipse cx="24" cy="18" rx="8" ry="4" stroke-dasharray="3 3"/><path d="M21 21l-2 6M27 21l2 6"/><path d="M24 11l-5 2M24 11l5 2"/>'
  ),
  // แกว่งขาหน้า-หลัง
  leg_swings: E(
    '<circle cx="24" cy="5" r="2.6"/><path d="M24 8v10"/><path d="M24 18v9"/><path d="M24 18l9 4" stroke-dasharray="3 2"/><path d="M24 18l-8 5" stroke-dasharray="3 2"/><path d="M38 14v10"/>'
  ),
  // หมุนข้อเท้า
  ankle_circles: E(
    '<path d="M20 6v12l-4 6h12"/><ellipse cx="26" cy="25" rx="7" ry="3.5" stroke-dasharray="3 3"/><path d="M14 6h12"/>'
  ),
  // แอ่น-โก่งหลัง (Cat-Cow)
  cat_cow: E(
    '<circle cx="12" cy="12" r="2.6"/><path d="M15 13c6-5 14-5 18 1"/><path d="M33 14v9M18 12v11"/><path d="M4 25h40"/>'
  ),

  // ---------- ท่ายืดค้าง (หลังฝึก) ----------
  // ยืดต้นขาหน้า
  quad_stretch: E(
    '<circle cx="22" cy="5" r="2.6"/><path d="M22 8v9"/><path d="M22 17v10"/><path d="M22 17l6 2-4 6"/><path d="M22 11l6 6"/><path d="M8 28h32"/>'
  ),
  // ยืดต้นขาหลัง
  hamstring_stretch: E(
    '<circle cx="14" cy="8" r="2.6"/><path d="M17 10l4 5"/><path d="M21 15h13"/><path d="M21 15l-3 11"/><path d="M17 11l6 5"/><path d="M6 27h36"/>'
  ),
  // ยืดน่อง
  calf_stretch: E(
    '<circle cx="16" cy="7" r="2.6"/><path d="M16 10v8"/><path d="M16 18l-7 8M16 18l7 8"/><path d="M16 12l10-2"/><path d="M30 4v22"/><path d="M4 26h26"/>'
  ),
  // ยืดสะโพกท่าเลข 4
  figure_four: E(
    '<circle cx="9" cy="16" r="2.6"/><path d="M12 17h10"/><path d="M22 17l5-7M22 17l6 6"/><path d="M24 13l7 3"/><path d="M4 26h40"/>'
  ),
  // ยืดอกและไหล่
  chest_stretch: E(
    '<circle cx="24" cy="5" r="2.6"/><path d="M24 8v10"/><path d="M24 18l-4 9M24 18l4 9"/><path d="M24 11l-9-4M24 11l9-4"/><path d="M15 7l-2 3M33 7l2 3"/>'
  ),
  // ท่าเด็ก (Child Pose)
  child_pose: E(
    '<path d="M10 22h8l12-8"/><circle cx="8" cy="21" r="2.6"/><path d="M30 14l4 8h-6"/><path d="M12 22c4-6 10-8 16-8"/><path d="M4 25h40"/>'
  ),
  // หายใจลึก
  breathe: E(
    '<circle cx="24" cy="16" r="8" stroke-dasharray="4 3"/><path d="M24 20v-9M24 11l-3 3M24 11l3 3"/>'
  ),
  // พัก
  rest: E(
    '<path d="M16 8h10l-10 12h10"/><path d="M30 14h6l-6 7h6"/>'
  ),
};

export function icon(name, cls = '') {
  const svg = UI[name] || UI.info;
  return cls ? svg.replace('<svg ', `<svg class="${cls}" `) : svg;
}

export function exIcon(name) {
  return EX_ICON[name] || EX_ICON.stretch;
}
