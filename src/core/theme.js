/** theme.js — สลับธีมมืด/สว่าง/ตามระบบ */

const mq = window.matchMedia('(prefers-color-scheme: dark)');
let currentSetting = 'dark';

function resolve(setting) {
  if (setting === 'system') return mq.matches ? 'dark' : 'light';
  return setting === 'light' ? 'light' : 'dark';
}

export function applyTheme(setting) {
  currentSetting = setting || 'dark';
  const theme = resolve(currentSetting);
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#111318' : '#f4f5f7');
}

export function getResolvedTheme() {
  return resolve(currentSetting);
}

export function initTheme(setting, onSystemChange) {
  applyTheme(setting);
  mq.addEventListener('change', () => {
    if (currentSetting === 'system') {
      applyTheme('system');
      onSystemChange?.();
    }
  });
}
