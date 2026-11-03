/** achievements.js — หน้าความสำเร็จ */

import { icon } from '../components/icons.js';
import { progressBar, note } from '../components/ui.js';
import { fmtThai } from '../core/dates.js';
import { ACHIEVEMENTS } from '../logic/achievements.js';

export function header(params, data) {
  const n = Object.keys(data.achievements).length;
  return {
    title: 'ความสำเร็จ',
    subtitle: `ปลดล็อกแล้ว ${n} จาก ${ACHIEVEMENTS.length} รายการ`,
    back: '/',
  };
}

export function view(params, data) {
  const unlocked = data.achievements || {};
  const n = Object.keys(unlocked).length;

  return `<div class="page">
    <div class="card card-lg">
      <div class="row-between">
        <div>
          <div class="small muted">ความคืบหน้า</div>
          <div class="hero-week">${n} <span>/ ${ACHIEVEMENTS.length}</span></div>
        </div>
        <div style="color:var(--primary)">${icon('trophy')}</div>
      </div>
      <div class="mt-14">${progressBar(n / ACHIEVEMENTS.length, n === ACHIEVEMENTS.length)}</div>
    </div>

    <div class="section-title">รายการทั้งหมด</div>
    <div class="grid" style="gap:9px">
      ${ACHIEVEMENTS.map((a) => {
        const at = unlocked[a.id];
        return `<div class="ach ${at ? 'unlocked' : 'locked'}">
          <div class="ach-ic">${icon(at ? a.icon : 'lock')}</div>
          <div class="grow">
            <div class="small bold">${a.name}</div>
            <div class="tiny muted">${a.desc}</div>
          </div>
          ${
            at
              ? `<span class="badge badge-success">${fmtThai(at.slice(0, 10))}</span>`
              : `<span class="badge">ยังไม่ปลดล็อก</span>`
          }
        </div>`;
      }).join('')}
    </div>

    <div class="mt-20">
      ${note('ความสำเร็จจะปลดล็อกอัตโนมัติจากข้อมูลการฝึกจริงเท่านั้น ระบบตรวจสอบใหม่ทุกครั้งที่คุณบันทึกผล')}
    </div>
  </div>`;
}
