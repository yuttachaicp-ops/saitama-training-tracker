/** ui.js — ชิ้นส่วน UI ที่ใช้ซ้ำ (คืนค่าเป็น HTML string) */

import { icon } from './icons.js';

export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * วงแหวนความคืบหน้า
 * @param {number} pct 0..1
 */
export function ring(pct, { size = 118, stroke = 11, label, caption, ok = false } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct || 0));
  const offset = c * (1 - p);
  return `
    <div class="ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}">
        <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
        <circle class="bar ${ok ? 'ok' : ''}" cx="${size / 2}" cy="${size / 2}" r="${r}"
          stroke-width="${stroke}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"/>
      </svg>
      <div class="ring-label">
        <div class="ring-value">${label ?? Math.round(p * 100) + '%'}</div>
        ${caption ? `<div class="ring-cap">${caption}</div>` : ''}
      </div>
    </div>`;
}

export function progressBar(pct, ok = false) {
  const p = Math.max(0, Math.min(1, pct || 0));
  return `<div class="bar-track"><div class="bar-fill ${ok ? 'ok' : ''}" style="width:${(p * 100).toFixed(1)}%"></div></div>`;
}

export function stat(iconName, label, value, unit = '') {
  return `
    <div class="stat">
      <div class="stat-top">${icon(iconName)}<span>${label}</span></div>
      <div class="stat-value">${value}${unit ? `<span class="stat-unit">${unit}</span>` : ''}</div>
    </div>`;
}

export function emptyState(title, text, iconName = 'chart', actionHtml = '') {
  return `
    <div class="empty">
      ${icon(iconName)}
      <div class="empty-title">${title}</div>
      <div class="small">${text}</div>
      ${actionHtml ? `<div class="mt-14">${actionHtml}</div>` : ''}
    </div>`;
}

export function note(text, kind = 'info') {
  return `<div class="note ${kind === 'warn' ? 'note-warn' : ''}">${icon(
    kind === 'warn' ? 'alert' : 'info'
  )}<div>${text}</div></div>`;
}

export function pills(items, activeValue, dataAttr = 'data-pill') {
  return `<div class="pills">${items
    .map(
      (it) =>
        `<button class="pill ${String(it.value) === String(activeValue) ? 'active' : ''}" ${dataAttr}="${it.value}">${it.label}</button>`
    )
    .join('')}</div>`;
}

export function segmented(items, activeValue, dataAttr = 'data-seg') {
  return `<div class="seg">${items
    .map(
      (it) =>
        `<button class="${String(it.value) === String(activeValue) ? 'active' : ''}" ${dataAttr}="${it.value}">${it.label}</button>`
    )
    .join('')}</div>`;
}

/** ตัวเพิ่ม/ลดตัวเลข */
export function stepper(name, value, { min = 0, max = 999, step = 1 } = {}) {
  return `
    <div class="stepper" data-stepper="${name}" data-min="${min}" data-max="${max}" data-step="${step}">
      <button type="button" data-dec aria-label="ลด">−</button>
      <input type="number" value="${value}" inputmode="numeric" aria-label="${name}"/>
      <button type="button" data-inc aria-label="เพิ่ม">+</button>
    </div>`;
}

/** ผูกเหตุการณ์ของ stepper ทั้งหมดภายใน container */
export function bindSteppers(container, onChange) {
  container.querySelectorAll('[data-stepper]').forEach((el) => {
    const input = el.querySelector('input');
    const min = Number(el.dataset.min);
    const max = Number(el.dataset.max);
    const step = Number(el.dataset.step) || 1;
    const name = el.dataset.stepper;

    const set = (v) => {
      const n = Math.max(min, Math.min(max, Math.round(Number(v) || 0)));
      input.value = n;
      onChange?.(name, n, el);
    };
    el.querySelector('[data-dec]').addEventListener('click', () => set(Number(input.value) - step));
    el.querySelector('[data-inc]').addEventListener('click', () => set(Number(input.value) + step));
    input.addEventListener('change', () => set(input.value));
  });
}

export { icon };
