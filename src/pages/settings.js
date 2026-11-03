/** settings.js — หน้าตั้งค่า โปรไฟล์ และการจัดการข้อมูล */

import { icon } from '../components/icons.js';
import { note, escapeHtml } from '../components/ui.js';
import { confirmDialog, openModal } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { mondayOf, fmtThaiFull, todayKey } from '../core/dates.js';
import { DIFFICULTY_LABEL, LEVEL_LABEL } from '../core/defaults.js';
import { applyTheme } from '../core/theme.js';
import * as reminder from '../core/reminder.js';
import * as state from '../core/state.js';
import { navigate } from '../core/router.js';

export function header() {
  return { title: 'ตั้งค่า', subtitle: 'โปรไฟล์ โปรแกรม และข้อมูล', back: '/' };
}

const THEMES = [
  { value: 'light', label: 'โหมดสว่าง', icon: 'sun' },
  { value: 'dark', label: 'โหมดมืด', icon: 'moon' },
  { value: 'system', label: 'ตามระบบ', icon: 'monitor' },
];

export function view(params, data) {
  const p = data.profile;
  const s = data.settings;
  const perm = reminder.permission();

  return `<div class="page">
    <div class="section-title"><span class="row" style="gap:8px">${icon('user')}<span>โปรไฟล์</span></span></div>
    <div class="card">
      <div class="field"><label>ชื่อที่ใช้แสดง</label>
        <input class="input" data-p="name" value="${escapeHtml(p.name)}"/></div>
      <div class="grid g3">
        <div class="field"><label>อายุ (ปี)</label>
          <input class="input" type="number" min="10" max="100" data-p="age" value="${p.age}"/></div>
        <div class="field"><label>ส่วนสูง (ซม.)</label>
          <input class="input" type="number" min="100" max="230" data-p="heightCm" value="${p.heightCm}"/></div>
        <div class="field"><label>น้ำหนัก (กก.)</label>
          <input class="input" type="number" min="30" max="250" step="0.1" data-p="weightKg" value="${p.weightKg}"/></div>
      </div>
      <div class="grid g2">
        <div class="field"><label>เพศ</label>
          <select class="select" data-p="gender">
            <option value="male" ${p.gender === 'male' ? 'selected' : ''}>ชาย</option>
            <option value="female" ${p.gender === 'female' ? 'selected' : ''}>หญิง</option>
            <option value="other" ${p.gender === 'other' ? 'selected' : ''}>ไม่ระบุ</option>
          </select></div>
        <div class="field"><label>ระดับความสามารถ</label>
          <select class="select" data-p="level">
            ${Object.entries(LEVEL_LABEL)
              .map(
                ([k, v]) => `<option value="${k}" ${p.level === k ? 'selected' : ''}>${v}</option>`
              )
              .join('')}
          </select></div>
      </div>
      <div class="field"><label>เป้าหมาย</label>
        <textarea class="textarea" data-p="goals">${escapeHtml(p.goals)}</textarea></div>
      <div class="grid g2">
        <div class="field" style="margin:0"><label>เวลาฝึกต่อวัน (นาที)</label>
          <input class="input" type="number" min="10" max="180" data-p="sessionMinutes" value="${p.sessionMinutes}"/></div>
        <div class="field" style="margin:0"><label>ความถี่ (วัน/สัปดาห์)</label>
          <input class="input" type="number" min="1" max="7" data-p="daysPerWeek" value="${p.daysPerWeek}"/></div>
      </div>
      <button class="btn btn-primary btn-block mt-14" data-save-profile>${icon('save')} บันทึกโปรไฟล์</button>
    </div>

    <div class="section-title"><span class="row" style="gap:8px">${icon('calendar')}<span>การฝึก</span></span></div>
    <div class="card">
      <div class="field"><label>วันเริ่มโปรแกรม (ระบบจะปรับเป็นวันจันทร์ของสัปดาห์นั้น)</label>
        <input class="input" type="date" data-s="startDate" value="${s.startDate}"/>
        <div class="tiny muted mt-8">ขณะนี้เริ่ม ${fmtThaiFull(s.startDate)}</div></div>
      <div class="grid g2">
        <div class="field"><label>เวลาออกกำลังกาย</label>
          <input class="input" type="time" data-s="workoutTime" value="${s.workoutTime}"/></div>
        <div class="field"><label>เวลาพักระหว่างเซต (วินาที)</label>
          <input class="input" type="number" min="15" max="300" step="5" data-s="restSeconds" value="${s.restSeconds}"/></div>
      </div>
      <div class="grid g2">
        <div class="field" style="margin:0"><label>ระดับความยาก</label>
          <select class="select" data-s="difficulty">
            ${Object.entries(DIFFICULTY_LABEL)
              .map(
                ([k, v]) =>
                  `<option value="${k}" ${s.difficulty === k ? 'selected' : ''}>${v}</option>`
              )
              .join('')}
          </select></div>
        <div class="field" style="margin:0"><label>หน่วยระยะทาง</label>
          <select class="select" data-s="distanceUnit">
            <option value="km" ${s.distanceUnit === 'km' ? 'selected' : ''}>กิโลเมตร (กม.)</option>
            <option value="mi" ${s.distanceUnit === 'mi' ? 'selected' : ''}>ไมล์ (mi)</option>
          </select></div>
      </div>
      <button class="btn btn-primary btn-block mt-14" data-save-settings>${icon('save')} บันทึกการตั้งค่าการฝึก</button>
      <div class="mt-14">${note(
        'การเปลี่ยนระดับความยากจะมีผลกับจำนวนครั้งที่แนะนำในสัปดาห์ถัดไป ข้อมูลที่บันทึกไว้แล้วจะไม่เปลี่ยน'
      )}</div>
    </div>

    <div class="section-title"><span class="row" style="gap:8px">${icon('sun')}<span>รูปแบบการแสดงผล</span></span></div>
    <div class="card">
      <div class="theme-picker">
        ${THEMES.map(
          (t) =>
            `<button class="theme-opt ${s.theme === t.value ? 'active' : ''}" data-theme="${t.value}">
              ${icon(t.icon)}${t.label}
            </button>`
        ).join('')}
      </div>
    </div>

    <div class="section-title"><span class="row" style="gap:8px">${icon('bell')}<span>การแจ้งเตือน</span></span></div>
    <div class="card">
      <div class="setting-row">
        <div class="grow">แจ้งเตือนเวลาออกกำลังกาย
          <div class="tiny muted">เวลา ${s.workoutTime} น.</div>
        </div>
        <button class="switch ${s.reminderEnabled ? 'on' : ''}" data-toggle-reminder aria-label="เปิดปิดการแจ้งเตือน"></button>
      </div>
      <div class="mt-14">${note(
        `ข้อจำกัดที่ต้องทราบ: แอปนี้เป็นเว็บแอป จึงแจ้งเตือนได้<b>เฉพาะตอนที่เปิดแอปค้างไว้ในเบราว์เซอร์</b>เท่านั้น ไม่สามารถแจ้งเตือนขณะปิดแอปได้ หากต้องการเตือนที่แน่นอน แนะนำให้ตั้งนาฬิกาปลุกในโทรศัพท์ควบคู่ไปด้วย${
          reminder.supported()
            ? perm === 'denied'
              ? ' — ขณะนี้เบราว์เซอร์ปฏิเสธสิทธิ์การแจ้งเตือนไว้'
              : ''
            : ' — เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน'
        }`,
        'warn'
      )}</div>
    </div>

    <div class="section-title"><span class="row" style="gap:8px">${icon('save')}<span>จัดการข้อมูล</span></span></div>
    <div class="card">
      <div class="setting-row">
        <div class="grow">ส่งออกข้อมูล (JSON)
          <div class="tiny muted">บันทึกไฟล์สำรองไว้ในเครื่อง</div></div>
        <button class="btn btn-ghost btn-sm" data-export>${icon('download')} ส่งออก</button>
      </div>
      <div class="setting-row">
        <div class="grow">นำเข้าข้อมูล (JSON)
          <div class="tiny muted">ข้อมูลปัจจุบันจะถูกแทนที่</div></div>
        <button class="btn btn-ghost btn-sm" data-import>${icon('upload')} นำเข้า</button>
        <input type="file" accept="application/json,.json" class="hidden" data-file/>
      </div>
      <div class="setting-row">
        <div class="grow">กู้คืนจากข้อมูลสำรอง
          <div class="tiny muted">${
            data.lastBackup ? `สำรองล่าสุด ${fmtThaiFull(data.lastBackup.slice(0, 10))}` : 'ยังไม่มีข้อมูลสำรอง'
          }</div></div>
        <button class="btn btn-ghost btn-sm" data-restore ${data.lastBackup ? '' : 'disabled'}>${icon('refresh')} กู้คืน</button>
      </div>
      <div class="setting-row">
        <div class="grow">รีเซ็ตโปรแกรม
          <div class="tiny muted">ลบประวัติการฝึก แต่เก็บโปรไฟล์และการตั้งค่าไว้</div></div>
        <button class="btn btn-danger btn-sm" data-reset-program>รีเซ็ต</button>
      </div>
      <div class="setting-row">
        <div class="grow">ลบข้อมูลทั้งหมด
          <div class="tiny muted">คืนค่าแอปกลับเป็นเริ่มต้น</div></div>
        <button class="btn btn-danger btn-sm" data-reset-all>ลบทั้งหมด</button>
      </div>
    </div>

    <div class="mt-20">
      ${note(
        'ข้อมูลทั้งหมดเก็บอยู่ในเบราว์เซอร์ของเครื่องนี้เท่านั้น ไม่ได้ส่งขึ้นเซิร์ฟเวอร์ใด ๆ หากล้างข้อมูลเบราว์เซอร์หรือเปลี่ยนเครื่อง ให้ใช้ไฟล์ส่งออก/นำเข้าเพื่อย้ายข้อมูล'
      )}
    </div>

    <p class="tiny muted center mt-20">Saitama Training Tracker · v1.0.0</p>
  </div>`;
}

function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function mount(root, params, ctx) {
  /* ---- โปรไฟล์ ---- */
  root.querySelector('[data-save-profile]')?.addEventListener('click', () => {
    const vals = {};
    root.querySelectorAll('[data-p]').forEach((el) => {
      vals[el.dataset.p] = el.type === 'number' ? Number(el.value) : el.value;
    });
    if (!vals.name?.trim()) {
      toast('กรุณากรอกชื่อ', 'err');
      return;
    }
    state.update((d) => {
      Object.assign(d.profile, vals);
    });
    toast('บันทึกโปรไฟล์แล้ว');
    ctx.rerender();
  });

  /* ---- การฝึก ---- */
  root.querySelector('[data-save-settings]')?.addEventListener('click', async () => {
    const vals = {};
    root.querySelectorAll('[data-s]').forEach((el) => {
      vals[el.dataset.s] = el.type === 'number' ? Number(el.value) : el.value;
    });

    const old = state.getData().settings.startDate;
    const nextStart = mondayOf(vals.startDate || old);

    if (nextStart !== old && Object.keys(state.getData().sessions).length > 0) {
      const ok = await confirmDialog({
        title: 'เปลี่ยนวันเริ่มโปรแกรม',
        message:
          'การเปลี่ยนวันเริ่มจะทำให้สัปดาห์ของบันทึกเดิมเลื่อนตามไปด้วย ประวัติการฝึกจะไม่ถูกลบ ต้องการดำเนินการต่อหรือไม่',
        confirmLabel: 'เปลี่ยน',
      });
      if (!ok) return;
    }

    state.update((d) => {
      Object.assign(d.settings, vals, { startDate: nextStart });
      d.settings.restSeconds = Math.max(15, Math.min(300, d.settings.restSeconds || 60));
    });
    toast('บันทึกการตั้งค่าแล้ว');
    ctx.rerender();
  });

  /* ---- ธีม ---- */
  root.querySelectorAll('[data-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.theme;
      state.update((d) => {
        d.settings.theme = v;
      });
      applyTheme(v);
      ctx.rerender();
    });
  });

  /* ---- การแจ้งเตือน ---- */
  root.querySelector('[data-toggle-reminder]')?.addEventListener('click', async () => {
    const on = !state.getData().settings.reminderEnabled;
    if (on && reminder.supported() && reminder.permission() === 'default') {
      await reminder.requestPermission();
    }
    state.update((d) => {
      d.settings.reminderEnabled = on;
    });
    if (on) {
      reminder.start();
      toast('เปิดการแจ้งเตือนแล้ว (ทำงานเมื่อเปิดแอปค้างไว้)', 'ok', 4000);
    } else {
      reminder.stop();
      toast('ปิดการแจ้งเตือนแล้ว');
    }
    ctx.rerender();
  });

  /* ---- ข้อมูล ---- */
  root.querySelector('[data-export]')?.addEventListener('click', () => {
    downloadJson(state.getData(), `training-backup-${todayKey()}.json`);
    toast('ส่งออกไฟล์แล้ว');
  });

  const fileEl = root.querySelector('[data-file]');
  root.querySelector('[data-import]')?.addEventListener('click', () => fileEl.click());

  fileEl?.addEventListener('change', async () => {
    const f = fileEl.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      const res = state.validateImport(parsed);
      if (!res.ok) {
        toast(res.error, 'err', 4000);
        fileEl.value = '';
        return;
      }
      const n = Object.keys(res.data.sessions || {}).length;
      const ok = await confirmDialog({
        title: 'นำเข้าข้อมูล',
        message: `ไฟล์นี้มีบันทึกการฝึก ${n} รายการ ข้อมูลปัจจุบันทั้งหมดจะถูกแทนที่ (ระบบจะสำรองข้อมูลเดิมไว้ให้ก่อน)`,
        confirmLabel: 'นำเข้า',
      });
      if (!ok) {
        fileEl.value = '';
        return;
      }
      state.replace(res.data, 'import');
      applyTheme(res.data.settings.theme);
      toast('นำเข้าข้อมูลเรียบร้อย');
      navigate('/');
    } catch (err) {
      toast('อ่านไฟล์ไม่สำเร็จ: ' + (err.message || err), 'err', 4500);
    }
    fileEl.value = '';
  });

  root.querySelector('[data-restore]')?.addEventListener('click', async () => {
    const bk = state.readBackup();
    if (!bk?.data) {
      toast('ไม่พบข้อมูลสำรอง', 'err');
      return;
    }
    const ok = await confirmDialog({
      title: 'กู้คืนข้อมูลสำรอง',
      message: `กู้คืนข้อมูลจากวันที่ ${fmtThaiFull(bk.at.slice(0, 10))} ข้อมูลปัจจุบันจะถูกแทนที่`,
      confirmLabel: 'กู้คืน',
    });
    if (!ok) return;
    const res = state.validateImport(bk.data);
    if (!res.ok) {
      toast(res.error, 'err');
      return;
    }
    state.replace(res.data, 'restore');
    applyTheme(res.data.settings.theme);
    toast('กู้คืนข้อมูลแล้ว');
    navigate('/');
  });

  root.querySelector('[data-reset-program]')?.addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: 'รีเซ็ตโปรแกรม',
      message:
        'ประวัติการฝึก ความสำเร็จ และการปรับจำนวนครั้งทั้งหมดจะถูกลบ (ระบบจะสำรองข้อมูลเดิมไว้ให้) โปรไฟล์และการตั้งค่าจะยังอยู่',
      confirmLabel: 'รีเซ็ตโปรแกรม',
      danger: true,
    });
    if (!ok) return;
    openModal({
      title: 'เริ่มโปรแกรมใหม่เมื่อไร',
      body: `<div class="field"><label>วันเริ่มโปรแกรมใหม่</label>
        <input class="input" type="date" data-new-start value="${todayKey()}"/>
        <div class="tiny muted mt-8">ระบบจะปรับเป็นวันจันทร์ของสัปดาห์ที่เลือก</div></div>`,
      actions: [
        { label: 'ยกเลิก', cls: 'btn-ghost' },
        {
          label: 'เริ่มใหม่',
          cls: 'btn-primary',
          onClick: (body) => {
            const v = body.querySelector('[data-new-start]').value || todayKey();
            state.resetProgram(mondayOf(v));
            toast('รีเซ็ตโปรแกรมแล้ว');
            navigate('/');
          },
        },
      ],
    });
  });

  root.querySelector('[data-reset-all]')?.addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: 'ลบข้อมูลทั้งหมด',
      message:
        'ข้อมูลทุกอย่างจะถูกลบและคืนค่าเป็นเริ่มต้น (ระบบจะสำรองข้อมูลเดิมไว้ให้หนึ่งชุด) ต้องการดำเนินการต่อหรือไม่',
      confirmLabel: 'ลบทั้งหมด',
      danger: true,
    });
    if (!ok) return;
    state.resetAll();
    applyTheme(state.getData().settings.theme);
    toast('ลบข้อมูลทั้งหมดแล้ว');
    navigate('/');
  });
}
