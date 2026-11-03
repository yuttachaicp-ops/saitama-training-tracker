/**
 * router.js — เราเตอร์แบบ hash (#/path?query)
 * ใช้ hash เพื่อให้เปิดไฟล์ build ได้โดยไม่ต้องตั้งค่าเซิร์ฟเวอร์
 */

const routes = new Map();
let notFound = null;
let current = null;
let onChange = null;

export function defineRoute(path, handler) {
  routes.set(path, handler);
}

export function setNotFound(handler) {
  notFound = handler;
}

export function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  const params = {};
  new URLSearchParams(qs || '').forEach((v, k) => {
    params[k] = v;
  });
  return { path: path || '/', params };
}

export function navigate(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const next = `#${path}${qs ? `?${qs}` : ''}`;
  if (location.hash === next) {
    render();
  } else {
    location.hash = next;
  }
}

export function currentRoute() {
  return current;
}

export function onRouteChange(fn) {
  onChange = fn;
}

export function render() {
  const { path, params } = parseHash();
  current = { path, params };
  const handler = routes.get(path) || notFound;
  if (!handler) return;
  try {
    handler(params);
  } catch (err) {
    console.error('[router] render error', path, err);
    const app = document.getElementById('view');
    if (app) {
      app.innerHTML = `<div class="page"><div class="card"><b>เกิดข้อผิดพลาดในการแสดงหน้านี้</b><p class="small muted mt-8">${String(
        err.message || err
      )}</p></div></div>`;
    }
  }
  onChange?.(current);
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

export function start() {
  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '#/';
  render();
}
