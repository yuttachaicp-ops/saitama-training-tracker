/** running.js — หน้าบันทึกการวิ่ง */

import { icon, exIcon } from '../components/icons.js';
import { stat, note, segmented, escapeHtml } from '../components/ui.js';
import { confirmDialog } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { todayKey, fmtThaiFull, fmtDuration, fmtPace, fmtDurationTh } from '../core/dates.js';
import { locateDate, getDayPlan } from '../data/program.js';
import { createSession } from '../logic/progress.js';
import { runningStats } from '../logic/progress.js';
import { evaluate } from '../logic/achievements.js';
import * as state from '../core/state.js';
import { navigate } from '../core/router.js';

const RUN_TYPES = [
  { value: 'RunningA', label: 'Running A' },
  { value: 'RunningB', label: 'Running B' },
  { value: 'LongRun', label: 'Long Run' },
];

/* ตัวจับเวลาสำหรับการวิ่ง */
const rtimer = { id: null, running: false, sec: 0, date: null };

function stopRun() {
  if (rtimer.id) clearInterval(rtimer.id);
  rtimer.id = null;
  rtimer.running = false;
}

export function header(params) {
  const date = params.date || todayKey();
  return {
    title: 'บันทึกการวิ่ง',
    subtitle: fmtThaiFull(date),
    back: '/',
  };
}

export function view(params, data) {
  const date = params.date || todayKey();
  const loc = locateDate(date, data.settings.startDate);
  const plan = loc.inProgram
    ? getDayPlan(loc.week, loc.dayIndex, data.settings, data.programOverrides)
    : null;

  const existing = data.sessions[date] || null;
  const blocked = existing && existing.type !== 'running';
  const session = existing && existing.type === 'running' ? existing : null;
  const completed = session?.status === 'completed';

  const planType = plan?.type === 'running' ? plan.planKey : null;
  const activeType = session?.planKey || planType || 'RunningB';
  const run = session?.run || {};

  if (rtimer.date !== date) {
    stopRun();
    rtimer.sec = Number(run.durationSec) || 0;
    rtimer.date = date;
  }

  const rs = runningStats(data);

  return `<div class="page">
    ${
      blocked
        ? `<div class="mt-8">${note(
            `วันที่นี้มีบันทึกการฝึก "${escapeHtml(existing.title)}" อยู่แล้ว หนึ่งวันเก็บได้หนึ่งบันทึก หากต้องการบันทึกการวิ่งของวันนี้ ให้ลบบันทึกเดิมในหน้าประวัติก่อน`,
            'warn'
          )}</div>`
        : ''
    }

    ${
      plan?.type === 'running'
        ? `<div class="card card-lg">
            <div class="today-type">
              <div class="ex-icon">${exIcon('run')}</div>
              <div class="grow">
                <div class="bold">${plan.title} · สัปดาห์ที่ ${plan.week}</div>
                <div class="small muted">${plan.run.summary}</div>
              </div>
              ${completed ? `<span class="badge badge-success">${icon('check')} สำเร็จ</span>` : ''}
            </div>
            <p class="small muted mt-14">${plan.run.note}</p>
          </div>`
        : `<div class="card">${note(
            'วันนี้ไม่ใช่วันวิ่งตามโปรแกรม แต่บันทึกการวิ่งเพิ่มเติมได้'
          )}</div>`
    }

    <div class="section-title">ประเภทการฝึก</div>
    ${segmented(RUN_TYPES, activeType, 'data-rtype')}

    <div class="timer-box mt-14">
      <div>
        <div class="small muted">เวลาที่ใช้</div>
        <div class="timer-val" data-rtimer>${fmtDuration(rtimer.sec)}</div>
      </div>
      <div class="row" style="gap:8px">
        <button class="btn btn-ghost" data-rtoggle ${blocked ? 'disabled' : ''}>
          ${icon(rtimer.running ? 'pause' : 'play')} <span>${rtimer.running ? 'พัก' : rtimer.sec > 0 ? 'ต่อ' : 'เริ่ม'}</span>
        </button>
        <button class="btn btn-ghost" data-rclear ${blocked ? 'disabled' : ''}>${icon('refresh')}</button>
      </div>
    </div>

    <div class="card mt-14">
      <div class="card-head">${icon('ruler')} ข้อมูลการวิ่ง</div>
      <p class="tiny muted" style="margin-bottom:12px">
        แอปนี้ไม่ใช้ GPS — กรอกระยะทางจากลู่วิ่ง นาฬิกา หรือแอปแผนที่ที่คุณใช้
      </p>

      <div class="grid g2">
        <div class="field">
          <label>ระยะทาง (กม.)</label>
          <input class="input" type="number" step="0.1" min="0" data-f="distanceKm"
                 value="${run.distanceKm ?? ''}" placeholder="เช่น 2.8"/>
        </div>
        <div class="field">
          <label>เวลา (นาที)</label>
          <input class="input" type="number" step="1" min="0" data-f="durationMin"
                 value="${run.durationSec ? Math.round(run.durationSec / 60) : ''}" placeholder="เช่น 24"/>
        </div>
        <div class="field">
          <label>จำนวนรอบ (ถ้าวิ่งสลับเดิน)</label>
          <input class="input" type="number" step="1" min="0" data-f="rounds"
                 value="${run.rounds ?? (plan?.run?.rounds ?? '')}"/>
        </div>
        <div class="field">
          <label>เวลาวิ่ง / เดิน ต่อรอบ (นาที)</label>
          <div class="row" style="gap:8px">
            <input class="input" type="number" step="0.5" min="0" data-f="runMin"
                   value="${run.runMin ?? (plan?.run?.runMin ?? '')}" placeholder="วิ่ง"/>
            <input class="input" type="number" step="0.5" min="0" data-f="walkMin"
                   value="${run.walkMin ?? (plan?.run?.walkMin ?? '')}" placeholder="เดิน"/>
          </div>
        </div>
      </div>

      <div class="row-between card-flat" style="padding:12px;border-radius:12px;margin-top:4px">
        <span class="small muted">Pace เฉลี่ย</span>
        <b data-pace>—</b>
      </div>

      <label class="label mt-14">ความรู้สึกหลังวิ่ง</label>
      ${segmented(
        [
          { value: 1, label: 'สบาย' },
          { value: 2, label: 'กำลังดี' },
          { value: 3, label: 'เหนื่อย' },
          { value: 4, label: 'หนักมาก' },
        ],
        session?.rpe ?? '',
        'data-rfeel'
      )}

      <label class="label mt-14">หมายเหตุ</label>
      <textarea class="textarea" data-f="note" placeholder="เช่น อากาศร้อน เดินมากกว่าที่ตั้งใจ">${escapeHtml(
        session?.note || ''
      )}</textarea>

      <div class="row mt-14" style="gap:10px">
        ${
          session
            ? `<button class="btn btn-ghost" data-rdelete>${icon('trash')} ลบ</button>`
            : ''
        }
        <button class="btn btn-primary grow" data-rsave ${blocked ? 'disabled' : ''}>
          ${icon('save')} ${completed ? 'บันทึกการแก้ไข' : 'บันทึกผลการวิ่ง'}
        </button>
      </div>
    </div>

    <div class="section-title">สถิติการวิ่งทั้งหมด</div>
    ${
      rs.count === 0
        ? `<div class="card">${note('ยังไม่มีข้อมูลการวิ่ง เมื่อบันทึกครั้งแรกแล้วสถิติจะแสดงที่นี่')}</div>`
        : `<div class="grid g2">
            ${stat('road', 'ระยะทางสะสม', rs.totalKm.toFixed(1), 'กม.')}
            ${stat('clock', 'เวลาวิ่งสะสม', fmtDurationTh(rs.totalSec), '')}
            ${stat('target', 'Pace เฉลี่ย', fmtPace(rs.avgPaceSec), '/กม.')}
            ${stat('trophy', 'ระยะไกลสุด', rs.bestKm.toFixed(1), 'กม.')}
          </div>
          <div class="small muted mt-8 center">วิ่งมาแล้ว ${rs.count} ครั้ง</div>`
    }
  </div>`;
}

export function mount(root, params, ctx) {
  const date = params.date || todayKey();
  const data = state.getData();
  const existing = data.sessions[date];
  const blocked = existing && existing.type !== 'running';

  const timerEl = root.querySelector('[data-rtimer]');
  const paceEl = root.querySelector('[data-pace]');
  const get = (f) => root.querySelector(`[data-f="${f}"]`);

  let selectedType =
    existing?.planKey ||
    root.querySelector('[data-rtype].active')?.dataset.rtype ||
    'RunningB';
  let feel = existing?.rpe ?? null;

  function currentSeconds() {
    const mins = Number(get('durationMin')?.value);
    if (mins > 0) return Math.round(mins * 60);
    return rtimer.sec;
  }

  function updatePace() {
    const km = Number(get('distanceKm')?.value) || 0;
    const sec = currentSeconds();
    paceEl.textContent = km > 0 && sec > 0 ? `${fmtPace(sec / km)} /กม.` : '—';
  }

  updatePace();
  ['distanceKm', 'durationMin'].forEach((f) => {
    get(f)?.addEventListener('input', updatePace);
  });

  // ถ้าตัวจับเวลายังเดินอยู่ ให้ต่อการแสดงผล
  if (rtimer.running) {
    stopRun();
    startDisplay();
  }

  function startDisplay() {
    rtimer.running = true;
    rtimer.id = setInterval(() => {
      rtimer.sec++;
      const el = document.querySelector('[data-rtimer]');
      if (el) el.textContent = fmtDuration(rtimer.sec);
      const d = document.querySelector('[data-f="durationMin"]');
      if (d && !d.value) updatePace();
    }, 1000);
  }

  root.querySelector('[data-rtoggle]')?.addEventListener('click', () => {
    if (blocked) return;
    if (rtimer.running) {
      stopRun();
      if (!get('durationMin').value && rtimer.sec > 0) {
        get('durationMin').value = Math.max(1, Math.round(rtimer.sec / 60));
        updatePace();
      }
      toast('หยุดจับเวลา');
    } else {
      startDisplay();
      toast('เริ่มจับเวลา');
    }
    ctx.rerender();
  });

  root.querySelector('[data-rclear]')?.addEventListener('click', () => {
    stopRun();
    rtimer.sec = 0;
    ctx.rerender();
  });

  root.querySelectorAll('[data-rtype]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedType = btn.dataset.rtype;
      root.querySelectorAll('[data-rtype]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  root.querySelectorAll('[data-rfeel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      feel = Number(btn.dataset.rfeel);
      root.querySelectorAll('[data-rfeel]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  root.querySelector('[data-rsave]')?.addEventListener('click', () => {
    if (blocked) return;
    const km = Number(get('distanceKm').value) || 0;
    const sec = currentSeconds();

    if (km <= 0 && sec <= 0) {
      toast('กรอกระยะทางหรือเวลาอย่างน้อยหนึ่งอย่าง', 'err');
      return;
    }

    const loc = locateDate(date, state.getData().settings.startDate);
    const plan = loc.inProgram
      ? getDayPlan(loc.week, loc.dayIndex, state.getData().settings, state.getData().programOverrides)
      : null;

    const base =
      state.getSession(date) ||
      createSession(date, {
        week: loc.inProgram ? loc.week : 0,
        planKey: selectedType,
        type: 'running',
        title: RUN_TYPES.find((t) => t.value === selectedType)?.label || 'Running',
      });

    base.type = 'running';
    base.planKey = selectedType;
    base.title = RUN_TYPES.find((t) => t.value === selectedType)?.label || 'Running';
    base.week = loc.inProgram ? loc.week : base.week;
    base.run = {
      distanceKm: km,
      durationSec: sec,
      rounds: Number(get('rounds').value) || 0,
      runMin: Number(get('runMin').value) || 0,
      walkMin: Number(get('walkMin').value) || 0,
      paceSec: km > 0 && sec > 0 ? sec / km : 0,
    };
    base.rpe = feel;
    base.note = get('note').value.trim();
    base.status = 'completed';
    base.completedAt = new Date().toISOString();

    stopRun();

    let unlocked = [];
    state.update((d) => {
      d.sessions[date] = base;
      unlocked = evaluate(d);
    });

    if (unlocked.length) toast(`ปลดล็อก: ${unlocked.map((a) => a.name).join(', ')}`, 'ok', 4000);
    else toast('บันทึกผลการวิ่งเรียบร้อย');

    navigate('/');
  });

  root.querySelector('[data-rdelete]')?.addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: 'ลบบันทึกการวิ่ง',
      message: 'ต้องการลบบันทึกการวิ่งของวันนี้ใช่หรือไม่ การกระทำนี้ย้อนกลับไม่ได้',
      confirmLabel: 'ลบ',
      danger: true,
    });
    if (!ok) return;
    stopRun();
    rtimer.sec = 0;
    state.deleteSession(date);
    toast('ลบแล้ว');
    ctx.rerender();
  });
}
