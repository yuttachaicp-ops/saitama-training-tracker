/**
 * modal.js — กล่องโต้ตอบ (ยืนยัน / ฟอร์ม / รายละเอียด)
 * ใช้ DOM จริงทั้งหมด ปิดได้ด้วยปุ่ม Esc หรือคลิกพื้นหลัง
 */

import { icon } from './icons.js';

const root = () => document.getElementById('modal-root');
let escHandler = null;

export function closeModal() {
  const r = root();
  if (r) r.innerHTML = '';
  if (escHandler) {
    document.removeEventListener('keydown', escHandler);
    escHandler = null;
  }
  document.body.style.overflow = '';
}

/**
 * เปิด modal
 * @param {{title?:string, subtitle?:string, body:string, actions?:Array, onMount?:Function, dismissible?:boolean}} opts
 */
export function openModal(opts) {
  const r = root();
  if (!r) return;
  closeModal();

  const actions = opts.actions || [];
  r.innerHTML = `
    <div class="modal-backdrop" data-backdrop>
      <div class="modal" role="dialog" aria-modal="true">
        ${
          opts.title
            ? `<div class="row-between" style="margin-bottom:12px">
                 <div>
                   <div class="modal-title">${opts.title}</div>
                   ${opts.subtitle ? `<div class="small muted">${opts.subtitle}</div>` : ''}
                 </div>
                 <button class="icon-btn" data-close aria-label="ปิด">${icon('x')}</button>
               </div>`
            : ''
        }
        <div data-modal-body>${opts.body || ''}</div>
        ${
          actions.length
            ? `<div class="modal-actions">${actions
                .map(
                  (a, i) =>
                    `<button class="btn ${a.cls || 'btn-ghost'}" data-act="${i}">${a.label}</button>`
                )
                .join('')}</div>`
            : ''
        }
      </div>
    </div>`;

  document.body.style.overflow = 'hidden';

  const backdrop = r.querySelector('[data-backdrop]');
  const dismissible = opts.dismissible !== false;

  if (dismissible) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
    r.querySelector('[data-close]')?.addEventListener('click', closeModal);
    escHandler = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', escHandler);
  } else {
    r.querySelector('[data-close]')?.remove();
  }

  r.querySelectorAll('[data-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const a = actions[Number(btn.dataset.act)];
      const keepOpen = a?.onClick?.(r.querySelector('[data-modal-body]'));
      if (!keepOpen) closeModal();
    });
  });

  opts.onMount?.(r.querySelector('[data-modal-body]'), { close: closeModal });
}

/** กล่องยืนยันมาตรฐาน — คืน Promise<boolean> */
export function confirmDialog({
  title,
  message,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  danger = false,
}) {
  return new Promise((resolve) => {
    openModal({
      title,
      body: `<p class="small muted" style="line-height:1.6">${message}</p>`,
      actions: [
        { label: cancelLabel, cls: 'btn-ghost', onClick: () => resolve(false) },
        {
          label: confirmLabel,
          cls: danger ? 'btn-primary' : 'btn-primary',
          onClick: () => resolve(true),
        },
      ],
    });
    // ปิดด้วย Esc/backdrop ให้ถือว่า "ยกเลิก"
    const r = root();
    const obs = new MutationObserver(() => {
      if (!r.querySelector('.modal-backdrop')) {
        obs.disconnect();
        resolve(false);
      }
    });
    obs.observe(r, { childList: true, subtree: true });
  });
}
