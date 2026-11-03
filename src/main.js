/**
 * main.js — จุดเริ่มต้นของแอป
 * ประกอบโครงหน้าจอ ลงทะเบียนเส้นทาง และผูกเหตุการณ์ระดับแอป
 */

import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';

import * as state from './core/state.js';
import { initTheme } from './core/theme.js';
import * as router from './core/router.js';
import { sidebarHtml, bottomNavHtml, bindNav, highlightNav } from './components/nav.js';
import { icon } from './components/icons.js';
import { toast } from './components/toast.js';
import * as reminder from './core/reminder.js';

import * as Dashboard from './pages/dashboard.js';
import * as Workout from './pages/workout.js';
import * as Running from './pages/running.js';
import * as Program from './pages/program.js';
import * as Stats from './pages/stats.js';
import * as History from './pages/history.js';
import * as Achievements from './pages/achievements.js';
import * as Settings from './pages/settings.js';
import * as Guide from './pages/guide.js';

/* ---------- โครงหน้าจอ ---------- */

const app = document.getElementById('app');
app.innerHTML = `
  <div class="app-shell">
    ${sidebarHtml()}
    <div class="main">
      <header class="topbar"><div class="topbar-in" id="topbar"></div></header>
      <div id="view"></div>
    </div>
  </div>
  ${bottomNavHtml()}
`;

bindNav(app);

const topbarEl = document.getElementById('topbar');
const viewEl = document.getElementById('view');

/* ---------- ธีม ---------- */
initTheme(state.getData().settings.theme, () => router.render());

/* ---------- การแจ้งเตือน (ทำงานเฉพาะตอนเปิดแอปค้างไว้) ---------- */
if (state.getData().settings.reminderEnabled) reminder.start();

/* ---------- ลงทะเบียนหน้า ---------- */

const PAGES = {
  '/': Dashboard,
  '/workout': Workout,
  '/running': Running,
  '/program': Program,
  '/stats': Stats,
  '/history': History,
  '/achievements': Achievements,
  '/settings': Settings,
  '/guide': Guide,
};

function renderPage(mod, params) {
  const data = state.getData();
  const head = mod.header ? mod.header(params, data) : { title: '' };

  topbarEl.innerHTML = `
    ${head.back ? `<button class="icon-btn" data-back="${head.back}" aria-label="ย้อนกลับ">${icon('left')}</button>` : ''}
    <div class="topbar-title">${head.title || ''}${
      head.subtitle ? `<span class="topbar-sub">${head.subtitle}</span>` : ''
    }</div>
    ${head.right || ''}`;

  topbarEl.querySelector('[data-back]')?.addEventListener('click', (e) => {
    router.navigate(e.currentTarget.dataset.back);
  });

  viewEl.innerHTML = mod.view(params, data);
  mod.mount?.(viewEl, params, { rerender: () => renderPage(mod, params) });

  // ปุ่มนำทางที่ฝังอยู่ในเนื้อหาของหน้า
  bindNav(topbarEl);
  bindNav(viewEl);
}

for (const [path, mod] of Object.entries(PAGES)) {
  router.defineRoute(path, (params) => renderPage(mod, params));
}

router.setNotFound(() => renderPage(Dashboard, {}));
router.onRouteChange((r) => highlightNav(r.path));

/* ---------- แจ้งเตือนเมื่อบันทึกข้อมูลไม่ได้ ---------- */
if (!state.storageAvailable()) {
  setTimeout(
    () =>
      toast(
        'เบราว์เซอร์นี้ปิดการเก็บข้อมูลไว้ ข้อมูลจะหายเมื่อปิดหน้า',
        'err',
        6000
      ),
    800
  );
}

/* ---------- Service Worker (ใช้งานออฟไลน์) ---------- */
// ลงทะเบียนเฉพาะไฟล์ที่ build แล้ว เพื่อไม่ให้แคชมารบกวนตอน development
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .catch((err) => console.warn('[sw] ลงทะเบียนไม่สำเร็จ', err));
  });
}

/* ---------- เริ่มทำงาน ---------- */
router.start();

// ช่วยให้ดีบักได้จาก console
window.__stt = { state, router };
