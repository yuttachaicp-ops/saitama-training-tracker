/** toast.js — ข้อความแจ้งเตือนสั้น ๆ มุมล่างจอ */

import { icon } from './icons.js';

const root = () => document.getElementById('toast-root');

export function toast(message, kind = 'ok', ms = 2600) {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `${icon(kind === 'err' ? 'alert' : 'check')}<span>${message}</span>`;
  root()?.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s, transform .25s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 260);
  }, ms);
}
