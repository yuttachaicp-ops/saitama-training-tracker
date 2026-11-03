/** nav.js — แถบนำทาง (sidebar บนเดสก์ท็อป / bottom nav บนมือถือ) */

import { icon, UI } from './icons.js';
import { navigate } from '../core/router.js';

export const NAV_ITEMS = [
  { path: '/', label: 'หน้าหลัก', icon: 'home' },
  { path: '/workout', label: 'ฝึกวันนี้', icon: 'dumbbell' },
  { path: '/program', label: 'โปรแกรม', icon: 'calendar' },
  { path: '/stats', label: 'สถิติ', icon: 'chart' },
  { path: '/settings', label: 'ตั้งค่า', icon: 'settings' },
];

const EXTRA_ITEMS = [
  { path: '/warmup', label: 'วอร์มอัป & ยืดเหยียด', icon: 'heart' },
  { path: '/running', label: 'บันทึกการวิ่ง', icon: 'run' },
  { path: '/history', label: 'ประวัติการฝึก', icon: 'history' },
  { path: '/achievements', label: 'ความสำเร็จ', icon: 'trophy' },
  { path: '/guide', label: 'คำแนะนำความปลอดภัย', icon: 'book' },
];

export function sidebarHtml() {
  const link = (it) =>
    `<button class="side-link" data-nav="${it.path}">${icon(it.icon)}<span>${it.label}</span></button>`;
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">${UI.dumbbell}</div>
        <div>
          <div class="brand-name">Saitama</div>
          <div class="brand-sub">Training Tracker</div>
        </div>
      </div>
      ${NAV_ITEMS.map(link).join('')}
      <div class="side-divider"></div>
      ${EXTRA_ITEMS.map(link).join('')}
      <div class="side-foot">
        เครื่องมือติดตามการฝึก ไม่ใช่คำแนะนำทางการแพทย์
      </div>
    </aside>`;
}

export function bottomNavHtml() {
  return `
    <nav class="bottom-nav">
      ${NAV_ITEMS.map(
        (it) =>
          `<button class="bn-item" data-nav="${it.path}">${icon(it.icon)}<span>${it.label}</span></button>`
      ).join('')}
    </nav>`;
}

export function bindNav(rootEl) {
  rootEl.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.nav));
  });
}

export function highlightNav(path) {
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    const p = btn.dataset.nav;
    const active = p === path || (p !== '/' && path.startsWith(p));
    btn.classList.toggle('active', active);
  });
}
