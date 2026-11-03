/** guide.js — คำแนะนำด้านความปลอดภัยและวิธีใช้โปรแกรม */

import { icon, exIcon } from '../components/icons.js';
import { note } from '../components/ui.js';
import { WARMUP, COOLDOWN, EXERCISES } from '../data/exercises.js';
import { openModal } from '../components/modal.js';

export function header() {
  return { title: 'คำแนะนำ', subtitle: 'ฝึกอย่างปลอดภัยและยั่งยืน', back: '/' };
}

export function view() {
  return `<div class="page">
    ${note(
      'แอปนี้เป็นเครื่องมือช่วยติดตามการออกกำลังกาย ไม่ใช่เครื่องมือวินิจฉัยหรือคำแนะนำทางการแพทย์ หากมีโรคประจำตัว เคยบาดเจ็บ หรือไม่แน่ใจว่าร่างกายพร้อมหรือไม่ ควรปรึกษาแพทย์หรือผู้เชี่ยวชาญก่อนเริ่มโปรแกรม',
      'warn'
    )}

    <div class="section-title">หลักการของโปรแกรมนี้</div>
    <div class="card">
      <ul class="small muted" style="margin:0;padding-left:18px;line-height:1.95">
        <li>ออกแบบสำหรับผู้เริ่มต้น ใช้น้ำหนักตัวล้วน ไม่ต้องใช้อุปกรณ์</li>
        <li>เพิ่มความหนักทีละน้อยตลอด 12 สัปดาห์ (Progressive Overload)</li>
        <li>สัปดาห์ที่ 4 และ 8 เป็นสัปดาห์ฟื้นตัว ลดความหนักลงโดยตั้งใจ</li>
        <li>ฝึก 6 วัน พัก 1 วัน — วันพักสำคัญไม่แพ้วันฝึก</li>
        <li>ไม่มีการบังคับทำ 100 ครั้งหรือวิ่ง 10 กม. ตั้งแต่เริ่ม สิ่งเหล่านั้นเป็นเป้าหมายระยะยาวเท่านั้น</li>
      </ul>
    </div>

    <div class="section-title">วอร์มอัปก่อนฝึก</div>
    <div class="card">
      <ul class="small muted" style="margin:0;padding-left:18px;line-height:1.95">
        ${WARMUP.map((w) => `<li>${w}</li>`).join('')}
      </ul>
    </div>

    <div class="section-title">คูลดาวน์หลังฝึก</div>
    <div class="card">
      <ul class="small muted" style="margin:0;padding-left:18px;line-height:1.95">
        ${COOLDOWN.map((w) => `<li>${w}</li>`).join('')}
      </ul>
    </div>

    <div class="section-title">สัญญาณที่ควรหยุดทันที</div>
    <div class="card">
      <ul class="small muted" style="margin:0;padding-left:18px;line-height:1.95">
        <li>เจ็บแปลบ เจ็บข้อ หรือปวดร้าวลงขา/แขน</li>
        <li>เวียนหัว หน้ามืด ใจสั่น หรือแน่นหน้าอก</li>
        <li>หายใจไม่ทันจนพูดไม่เป็นคำ</li>
        <li>ฟอร์มเสียจนควบคุมไม่ได้ — หยุดเซตนั้นทันที</li>
      </ul>
      <div class="mt-14">${note(
        'ปวดเมื่อยกล้ามเนื้อหลังฝึก 1–2 วันเป็นเรื่องปกติ แต่อาการเจ็บแหลมที่ข้อต่อไม่ปกติ ถ้าไม่แน่ใจให้พักและปรึกษาผู้เชี่ยวชาญ',
        'warn'
      )}</div>
    </div>

    <div class="section-title">คลังท่าออกกำลังกาย</div>
    <div class="grid g2">
      ${Object.values(EXERCISES)
        .map(
          (ex) => `<button class="card card-click" data-ex="${ex.id}">
            <div class="row">
              <div class="ex-icon">${exIcon(ex.icon)}</div>
              <div class="grow">
                <div class="small bold">${ex.name}</div>
                <div class="tiny muted">${ex.en}</div>
              </div>
              ${icon('right')}
            </div>
          </button>`
        )
        .join('')}
    </div>
  </div>`;
}

export function mount(root) {
  root.querySelectorAll('[data-ex]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ex = EXERCISES[btn.dataset.ex];
      openModal({
        title: ex.name,
        subtitle: `${ex.en} · ${ex.muscles}`,
        body: `
          <div class="ex-hero">${exIcon(ex.icon)}</div>
          <div class="label">วิธีทำ</div>
          <ol class="small muted" style="margin:0 0 14px;padding-left:18px;line-height:1.85">
            ${ex.how.map((h) => `<li>${h}</li>`).join('')}
          </ol>
          ${note(ex.caution, 'warn')}
          ${
            ex.easier && ex.easier !== '—'
              ? `<div class="mt-14">${note(`ถ้ายังหนักเกินไป: ${ex.easier}`)}</div>`
              : ''
          }`,
        actions: [{ label: 'ปิด', cls: 'btn-primary' }],
      });
    });
  });
}
