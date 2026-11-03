/** workout.js — หน้าฝึกประจำวัน (เช็กลิสต์ + จับเวลา + บันทึกผลจริง) */

import { icon, exIcon } from '../components/icons.js';
import { progressBar, note, stepper, bindSteppers, segmented, escapeHtml } from '../components/ui.js';
import { openModal, closeModal, confirmDialog } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { todayKey, fmtThaiFull, fmtDuration, fmtDurationTh } from '../core/dates.js';
import { locateDate, getDayPlan, TOTAL_WEEKS } from '../data/program.js';
import { EXERCISES, UNIT, WARMUP, COOLDOWN, unitLabel } from '../data/exercises.js';
import { createSession, sessionProgress, totalRepsOf } from '../logic/progress.js';
import { evaluate } from '../logic/achievements.js';
import * as state from '../core/state.js';
import { navigate } from '../core/router.js';

/* ---------- ตัวจับเวลา (อยู่ในหน่วยความจำ) ---------- */
const timer = { id: null, running: false, date: null, tick: 0 };

function stopTimer() {
  if (timer.id) clearInterval(timer.id);
  timer.id = null;
  timer.running = false;
}

function persistElapsed(dateKey) {
  const s = state.getSession(dateKey);
  if (!s) return;
  state.update((d) => {
    d.sessions[dateKey] = s;
  }, { silent: true });
}

function startTimer(dateKey, onTick) {
  stopTimer();
  timer.running = true;
  timer.date = dateKey;
  timer.id = setInterval(() => {
    const s = state.getSession(dateKey);
    if (!s || s.status === 'completed') {
      stopTimer();
      return;
    }
    s.elapsedSec = (s.elapsedSec || 0) + 1;
    timer.tick++;
    if (timer.tick % 10 === 0) persistElapsed(dateKey);
    onTick?.(s.elapsedSec);
  }, 1000);
}

/* ---------- หัวหน้าจอ ---------- */

export function header(params, data) {
  const date = params.date || todayKey();
  return {
    title: 'การฝึกประจำวัน',
    subtitle: fmtThaiFull(date),
    back: '/',
    right: `<button class="icon-btn" data-warmup aria-label="วอร์มอัป">${icon('info')}</button>`,
  };
}

/* ---------- มุมมอง ---------- */

function outOfProgram(date, loc) {
  return `<div class="page">
    <div class="card">
      <b>วันที่นี้อยู่นอกช่วงโปรแกรม 12 สัปดาห์</b>
      <p class="small muted mt-8">
        ${loc.offsetDays < 0 ? 'โปรแกรมยังไม่เริ่มในวันนี้' : `โปรแกรมมีทั้งหมด ${TOTAL_WEEKS} สัปดาห์`}
      </p>
      <div class="row mt-14" style="gap:10px">
        <button class="btn btn-ghost grow" data-nav="/">กลับหน้าหลัก</button>
        <button class="btn btn-primary grow" data-nav="/settings">ตั้งค่าโปรแกรม</button>
      </div>
    </div>
  </div>`;
}

function restDayView(date, plan, session) {
  const done = session?.status === 'completed';
  return `<div class="page">
    <div class="card card-lg">
      <div class="today-type">
        <div class="ex-icon">${exIcon('rest')}</div>
        <div class="grow">
          <div class="bold">วันพัก</div>
          <div class="small muted">สัปดาห์ที่ ${plan.week} · วันอาทิตย์</div>
        </div>
        ${done ? `<span class="badge badge-success">${icon('check')} บันทึกแล้ว</span>` : ''}
      </div>
      <ul class="small muted mt-14" style="margin:0;padding-left:18px;line-height:1.9">
        ${plan.restActivities.map((t) => `<li>${t}</li>`).join('')}
      </ul>
    </div>

    <div class="card mt-14">
      <label class="label">บันทึกกิจกรรมวันพัก (ไม่บังคับ)</label>
      <textarea class="textarea" data-rest-note placeholder="เช่น ยืดเหยียด 10 นาที เดินเล่นตอนเย็น">${escapeHtml(
        session?.note || ''
      )}</textarea>
      <div class="row mt-14" style="gap:10px">
        ${
          done
            ? `<button class="btn btn-ghost grow" data-rest-delete>${icon('trash')} ลบบันทึก</button>`
            : ''
        }
        <button class="btn btn-primary grow" data-rest-save>${icon('save')} บันทึก</button>
      </div>
    </div>

    ${note('วันพักคือส่วนหนึ่งของโปรแกรม ไม่ต้องรู้สึกผิดที่ไม่ได้ฝึก กล้ามเนื้อเติบโตตอนพัก')}
  </div>`;
}

function exerciseRow(e, idx) {
  const ex = EXERCISES[e.id];
  const logged = e.repsDone.filter((v) => Number(v) > 0).length;
  return `
    <div class="ex-row ${e.done ? 'done' : ''}" data-ex="${idx}">
      <div class="ex-icon">${exIcon(e.icon)}</div>
      <div class="grow">
        <div class="ex-name">${e.name}</div>
        <div class="ex-meta">
          เป้าหมาย ${e.targetReps} ${unitLabel(ex)} × ${e.targetSets} เซต
        </div>
        <div class="set-chips">
          ${e.repsDone
            .map(
              (v, i) =>
                `<button class="set-chip ${Number(v) > 0 ? 'on' : ''}" data-set="${idx}:${i}">
                   เซต ${i + 1}<br><b>${Number(v) > 0 ? v : '—'}</b>
                 </button>`
            )
            .join('')}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center">
        <button class="check ${e.done ? 'on' : ''}" data-check="${idx}" aria-label="ทำสำเร็จ">${icon('check')}</button>
        <button class="icon-btn" style="width:28px;height:28px;flex:0 0 28px" data-detail="${idx}" aria-label="รายละเอียดท่า">${icon('info')}</button>
      </div>
    </div>`;
}

function strengthView(date, plan, session, data) {
  const started = !!session;
  const completed = session?.status === 'completed';
  const pct = sessionProgress(session);
  const doneCount = session ? session.exercises.filter((e) => e.done).length : 0;

  const exercises = session
    ? session.exercises
    : plan.exercises.map((e) => ({
        id: e.id,
        name: e.name,
        icon: e.icon,
        unit: e.unit,
        targetReps: e.reps,
        targetSets: e.sets,
        repsDone: Array.from({ length: e.sets }, () => null),
        done: false,
      }));

  return `<div class="page">
    ${
      plan.deload
        ? `<div class="mt-8">${note('สัปดาห์นี้เป็นสัปดาห์ฟื้นตัว (Deload) — ตั้งใจลดความหนักลงเพื่อให้ร่างกายซ่อมแซมตัวเอง', 'warn')}</div>`
        : ''
    }

    <div class="timer-box">
      <div>
        <div class="small muted">${plan.title} · สัปดาห์ที่ ${plan.week}</div>
        <div class="timer-val" data-timer>${fmtDuration(session?.elapsedSec || 0)}</div>
        <div class="small muted">ทำแล้ว ${doneCount} / ${exercises.length} ท่า · ประมาณ ${plan.estMinutes} นาที</div>
      </div>
      <div class="row" style="gap:8px">
        ${
          completed
            ? `<span class="badge badge-success">${icon('check')} ฝึกสำเร็จแล้ว</span>`
            : !started
              ? `<button class="btn btn-primary" data-start>${icon('play')} เริ่มฝึก</button>`
              : `<button class="btn btn-ghost" data-toggle-timer>${icon(
                  timer.running ? 'pause' : 'play'
                )} <span>${timer.running ? 'พัก' : 'ฝึกต่อ'}</span></button>`
        }
      </div>
    </div>

    <div class="mt-14">${progressBar(pct, completed)}</div>

    <div class="section-title">ท่าออกกำลังกาย</div>
    <div class="card">
      ${exercises.map((e, i) => exerciseRow(e, i)).join('')}
      <div class="small muted mt-14 center">
        ${icon('clock')} พักระหว่างเซต ${plan.restSeconds} วินาที
        <button class="link" data-rest-start style="background:none;border:none;cursor:pointer;margin-left:6px">เริ่มจับเวลาพัก</button>
      </div>
    </div>

    ${
      started && !completed
        ? `<div class="card mt-14">
            <div class="card-head">${icon('heart')} ความรู้สึกหลังฝึก</div>
            ${segmented(
              [
                { value: 1, label: 'สบาย' },
                { value: 2, label: 'กำลังดี' },
                { value: 3, label: 'เหนื่อย' },
                { value: 4, label: 'หนักมาก' },
                { value: 5, label: 'ล้าเกินไป' },
              ],
              session?.rpe ?? '',
              'data-rpe'
            )}
            <label class="label mt-14">หมายเหตุ</label>
            <textarea class="textarea" data-note placeholder="เช่น ไหล่ตึงเล็กน้อย ลดจำนวนครั้งลง 2 ครั้ง">${escapeHtml(
              session?.note || ''
            )}</textarea>
          </div>`
        : ''
    }

    ${
      started
        ? `<div class="row mt-14" style="gap:10px">
             <button class="btn btn-ghost" data-reset>${icon('refresh')} รีเซ็ต</button>
             <button class="btn ${completed ? 'btn-ghost' : 'btn-primary'} grow" data-finish>
               ${icon('save')} ${completed ? 'บันทึกการแก้ไข' : 'บันทึกผลการฝึก'}
             </button>
           </div>`
        : `<div class="mt-14">${note(
            'กดเริ่มฝึกเพื่อเริ่มจับเวลา จากนั้นบันทึกจำนวนครั้งที่ทำได้จริงในแต่ละเซต ทำไม่ครบตามเป้าก็บันทึกได้ — ความสม่ำเสมอสำคัญกว่าตัวเลข'
          )}</div>`
    }

    ${
      completed
        ? `<div class="card mt-14">
            <div class="card-head">${icon('check')} สรุปผล</div>
            <div class="grid g3">
              <div><div class="tiny muted">เวลาที่ใช้</div><b>${fmtDuration(session.elapsedSec)}</b></div>
              <div><div class="tiny muted">จำนวนครั้งรวม</div><b>${totalRepsOf(session)}</b></div>
              <div><div class="tiny muted">ท่าที่ทำครบ</div><b>${doneCount}/${exercises.length}</b></div>
            </div>
            ${session.note ? `<p class="small muted mt-14">${escapeHtml(session.note)}</p>` : ''}
          </div>`
        : ''
    }
  </div>`;
}

export function view(params, data) {
  const date = params.date || todayKey();
  const loc = locateDate(date, data.settings.startDate);
  if (!loc.inProgram) return outOfProgram(date, loc);

  const plan = getDayPlan(loc.week, loc.dayIndex, data.settings, data.programOverrides);
  const session = data.sessions[date] || null;

  if (plan.type === 'running') {
    // วันวิ่งใช้หน้าบันทึกการวิ่งโดยเฉพาะ
    setTimeout(() => navigate('/running', { date }), 0);
    return `<div class="page"><div class="card center small muted">กำลังเปิดหน้าบันทึกการวิ่ง…</div></div>`;
  }
  if (plan.type === 'rest') return restDayView(date, plan, session);
  return strengthView(date, plan, session, data);
}

/* ---------- การทำงาน ---------- */

function ensureSession(date, plan) {
  let s = state.getSession(date);
  if (!s) {
    s = createSession(date, plan);
    state.putSession(s);
  }
  return s;
}

function openSetModal(date, idx, rerender) {
  const s = state.getSession(date);
  if (!s) return;
  const e = s.exercises[idx];
  const ex = EXERCISES[e.id];
  const unit = unitLabel(ex);

  openModal({
    title: e.name,
    subtitle: `เป้าหมาย ${e.targetReps} ${unit} × ${e.targetSets} เซต`,
    body: `
      <p class="small muted" style="margin-bottom:12px">บันทึกจำนวนที่ทำได้จริง ไม่ต้องตรงกับเป้าหมายก็ได้</p>
      ${e.repsDone
        .map(
          (v, i) => `
        <div class="row-between" style="padding:7px 0">
          <span class="small bold">เซต ${i + 1}</span>
          ${stepper(`set${i}`, Number(v) || e.targetReps, {
            min: 0,
            max: ex.unit === UNIT.SECONDS ? 600 : 300,
            step: ex.unit === UNIT.SECONDS ? 5 : 1,
          })}
        </div>`
        )
        .join('')}
      <button class="btn btn-ghost btn-block btn-sm mt-8" data-fill>ใส่ค่าตามเป้าหมายทุกเซต</button>
    `,
    onMount: (body) => {
      bindSteppers(body);
      body.querySelector('[data-fill]')?.addEventListener('click', () => {
        body.querySelectorAll('[data-stepper] input').forEach((inp) => {
          inp.value = e.targetReps;
        });
      });
    },
    actions: [
      { label: 'ยกเลิก', cls: 'btn-ghost' },
      {
        label: 'บันทึก',
        cls: 'btn-primary',
        onClick: (body) => {
          const vals = [...body.querySelectorAll('[data-stepper] input')].map((i) =>
            Math.max(0, Number(i.value) || 0)
          );
          state.update((d) => {
            const ses = d.sessions[date];
            ses.exercises[idx].repsDone = vals;
            ses.exercises[idx].done = vals.every((v) => v > 0);
          });
          rerender();
        },
      },
    ],
  });
}

function openDetailModal(exId) {
  const ex = EXERCISES[exId];
  if (!ex) return;
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
      }
    `,
    actions: [{ label: 'เข้าใจแล้ว', cls: 'btn-primary' }],
  });
}

function openRestOverlay(seconds) {
  const el = document.createElement('div');
  el.className = 'rest-overlay';
  let left = seconds;
  el.innerHTML = `
    <div>
      <div class="small muted">พักระหว่างเซต</div>
      <div class="rest-count">${left}</div>
      <div class="row mt-20" style="gap:10px;justify-content:center">
        <button class="btn btn-ghost" data-add>+20 วินาที</button>
        <button class="btn btn-primary" data-skip>ข้าม</button>
      </div>
    </div>`;
  document.body.appendChild(el);

  const countEl = el.querySelector('.rest-count');
  const id = setInterval(() => {
    left--;
    countEl.textContent = left;
    if (left <= 0) {
      clearInterval(id);
      el.remove();
      toast('หมดเวลาพัก เริ่มเซตถัดไปได้', 'ok', 2000);
    }
  }, 1000);

  el.querySelector('[data-add]').addEventListener('click', () => {
    left += 20;
    countEl.textContent = left;
  });
  el.querySelector('[data-skip]').addEventListener('click', () => {
    clearInterval(id);
    el.remove();
  });
}

function openWarmupModal() {
  openModal({
    title: 'วอร์มอัป และ คูลดาวน์',
    body: `
      <div class="label">วอร์มอัปก่อนฝึก (5 นาที)</div>
      <ul class="small muted" style="margin:0 0 16px;padding-left:18px;line-height:1.9">
        ${WARMUP.map((w) => `<li>${w}</li>`).join('')}
      </ul>
      <div class="label">คูลดาวน์หลังฝึก (5 นาที)</div>
      <ul class="small muted" style="margin:0 0 14px;padding-left:18px;line-height:1.9">
        ${COOLDOWN.map((w) => `<li>${w}</li>`).join('')}
      </ul>
      ${note('หยุดทันทีหากเจ็บแปลบ เจ็บข้อ เวียนหัว หรือเหนื่อยผิดปกติ', 'warn')}
    `,
    actions: [{ label: 'ปิด', cls: 'btn-primary' }],
  });
}

export function mount(root, params, ctx) {
  const data = state.getData();
  const date = params.date || todayKey();
  const loc = locateDate(date, data.settings.startDate);

  document.querySelector('[data-warmup]')?.addEventListener('click', openWarmupModal);

  if (!loc.inProgram) return;
  const plan = getDayPlan(loc.week, loc.dayIndex, data.settings, data.programOverrides);
  if (plan.type === 'running') return;

  /* ----- วันพัก ----- */
  if (plan.type === 'rest') {
    root.querySelector('[data-rest-save]')?.addEventListener('click', () => {
      const text = root.querySelector('[data-rest-note]').value.trim();
      const s = state.getSession(date) || createSession(date, plan);
      s.note = text;
      s.status = 'completed';
      s.completedAt = new Date().toISOString();
      state.putSession(s);
      toast('บันทึกวันพักแล้ว');
      ctx.rerender();
    });
    root.querySelector('[data-rest-delete]')?.addEventListener('click', async () => {
      const ok = await confirmDialog({
        title: 'ลบบันทึกวันพัก',
        message: 'ต้องการลบบันทึกของวันนี้ใช่หรือไม่',
        confirmLabel: 'ลบ',
      });
      if (!ok) return;
      state.deleteSession(date);
      toast('ลบแล้ว');
      ctx.rerender();
    });
    return;
  }

  /* ----- วันฝึกกล้ามเนื้อ ----- */
  const timerEl = root.querySelector('[data-timer]');

  // ถ้าเปลี่ยนวัน ให้หยุดตัวจับเวลาเดิม
  if (timer.date && timer.date !== date) stopTimer();

  // ถ้าตัวจับเวลายังเดินอยู่สำหรับวันนี้ ให้ต่อการแสดงผล
  if (timer.running && timer.date === date) {
    startTimer(date, (sec) => {
      if (timerEl) timerEl.textContent = fmtDuration(sec);
    });
  }

  root.querySelector('[data-start]')?.addEventListener('click', () => {
    ensureSession(date, plan);
    startTimer(date, (sec) => {
      const el = document.querySelector('[data-timer]');
      if (el) el.textContent = fmtDuration(sec);
    });
    toast('เริ่มจับเวลาแล้ว');
    ctx.rerender();
  });

  root.querySelector('[data-toggle-timer]')?.addEventListener('click', () => {
    if (timer.running) {
      stopTimer();
      persistElapsed(date);
      toast('พักการจับเวลา');
    } else {
      startTimer(date, (sec) => {
        const el = document.querySelector('[data-timer]');
        if (el) el.textContent = fmtDuration(sec);
      });
      toast('จับเวลาต่อ');
    }
    ctx.rerender();
  });

  root.querySelectorAll('[data-check]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.check);
      const s = ensureSession(date, plan);
      const willBeDone = !s.exercises[idx].done;

      state.update((d) => {
        const e = d.sessions[date].exercises[idx];
        e.done = willBeDone;
        if (willBeDone && e.repsDone.every((v) => !v)) {
          e.repsDone = e.repsDone.map(() => e.targetReps);
        }
      });

      const left = state.getSession(date).exercises.filter((e) => !e.done).length;
      ctx.rerender();
      if (willBeDone && left > 0) openRestOverlay(plan.restSeconds);
      if (willBeDone && left === 0) toast('ทำครบทุกท่าแล้ว กดบันทึกผลได้เลย');
    });
  });

  root.querySelectorAll('[data-set]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [idx] = btn.dataset.set.split(':').map(Number);
      ensureSession(date, plan);
      openSetModal(date, idx, ctx.rerender);
    });
  });

  root.querySelectorAll('[data-detail]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.detail);
      const s = state.getSession(date);
      const list = s ? s.exercises : plan.exercises;
      openDetailModal(list[idx].id);
    });
  });

  root.querySelector('[data-rest-start]')?.addEventListener('click', () => {
    openRestOverlay(plan.restSeconds);
  });

  root.querySelectorAll('[data-rpe]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = Number(btn.dataset.rpe);
      state.update((d) => {
        if (d.sessions[date]) d.sessions[date].rpe = v;
      });
      root.querySelectorAll('[data-rpe]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (v >= 5) {
        toast('ถ้ารู้สึกล้าเกินไป ลดจำนวนครั้งลงหรือพักเพิ่มหนึ่งวันได้', 'ok', 4200);
      }
    });
  });

  const noteEl = root.querySelector('[data-note]');
  noteEl?.addEventListener('change', () => {
    state.update((d) => {
      if (d.sessions[date]) d.sessions[date].note = noteEl.value;
    }, { silent: true });
  });

  root.querySelector('[data-reset]')?.addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: 'รีเซ็ตการฝึกวันนี้',
      message: 'ข้อมูลที่บันทึกไว้ของวันนี้จะถูกลบทั้งหมด การกระทำนี้ย้อนกลับไม่ได้',
      confirmLabel: 'รีเซ็ต',
      danger: true,
    });
    if (!ok) return;
    stopTimer();
    state.deleteSession(date);
    toast('รีเซ็ตแล้ว');
    ctx.rerender();
  });

  root.querySelector('[data-finish]')?.addEventListener('click', async () => {
    const s = state.getSession(date);
    if (!s) return;
    const notDone = s.exercises.filter((e) => !e.done).length;

    if (notDone > 0) {
      const ok = await confirmDialog({
        title: 'ยังทำไม่ครบทุกท่า',
        message: `เหลืออีก ${notDone} ท่าที่ยังไม่ได้ทำเครื่องหมาย ต้องการบันทึกผลเท่าที่ทำได้เลยไหม`,
        confirmLabel: 'บันทึกเลย',
      });
      if (!ok) return;
    }

    if (noteEl) {
      state.update((d) => {
        d.sessions[date].note = noteEl.value;
      }, { silent: true });
    }

    stopTimer();

    let unlocked = [];
    state.update((d) => {
      const ses = d.sessions[date];
      ses.status = 'completed';
      ses.completedAt = new Date().toISOString();
      unlocked = evaluate(d);
    });

    showCompleted(root, date, unlocked, ctx);
  });
}

function showCompleted(root, date, unlocked, ctx) {
  const s = state.getSession(date);
  root.innerHTML = `
    <div class="page">
      <div class="done-screen">
        <div class="done-badge">${icon('check')}</div>
        <h2>บันทึกผลการฝึกแล้ว</h2>
        <p class="small muted mt-8">${fmtThaiFull(date)} · ${s.title}</p>
      </div>
      <div class="grid g3 mt-20">
        <div class="stat"><div class="stat-top">${icon('clock')}<span>เวลาที่ใช้</span></div><div class="stat-value">${fmtDuration(
          s.elapsedSec
        )}</div></div>
        <div class="stat"><div class="stat-top">${icon('dumbbell')}<span>จำนวนครั้งรวม</span></div><div class="stat-value">${totalRepsOf(
          s
        )}</div></div>
        <div class="stat"><div class="stat-top">${icon('check')}<span>ท่าที่ทำครบ</span></div><div class="stat-value">${
          s.exercises.filter((e) => e.done).length
        }/${s.exercises.length}</div></div>
      </div>
      ${
        unlocked.length
          ? `<div class="card mt-14" style="border-color:var(--primary)">
              <div class="card-head">${icon('trophy')} ปลดล็อกความสำเร็จใหม่</div>
              ${unlocked
                .map(
                  (a) =>
                    `<div class="row" style="padding:6px 0">${icon('trophy')}<div><b>${a.name}</b><div class="tiny muted">${a.desc}</div></div></div>`
                )
                .join('')}
            </div>`
          : ''
      }
      <div class="mt-14">${note(
        `อย่าลืมคูลดาวน์: เดินช้า ๆ 2–3 นาที แล้วยืดกล้ามเนื้อมัดใหญ่ ข้างละ 20–30 วินาที`
      )}</div>
      <div class="row mt-14" style="gap:10px">
        <button class="btn btn-ghost grow" data-nav="/stats">ดูสถิติ</button>
        <button class="btn btn-primary grow" data-nav="/">กลับหน้าหลัก</button>
      </div>
    </div>`;

  root.querySelectorAll('[data-nav]').forEach((b) =>
    b.addEventListener('click', () => navigate(b.dataset.nav))
  );

  if (unlocked.length) toast(`ปลดล็อก: ${unlocked.map((a) => a.name).join(', ')}`, 'ok', 4000);
  else toast('บันทึกผลการฝึกเรียบร้อย');
}

export { fmtDurationTh };
