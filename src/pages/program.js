/** program.js — หน้าโปรแกรม 12 สัปดาห์ */

import { icon, exIcon } from '../components/icons.js';
import { progressBar, note, stepper, bindSteppers } from '../components/ui.js';
import { openModal } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { todayKey, addDays, fmtThai, DOW_TH, DOW_FULL_TH } from '../core/dates.js';
import {
  getWeekPlan,
  locateDate,
  isDeloadWeek,
  weekFocus,
  TOTAL_WEEKS,
  weekStartOffset,
} from '../data/program.js';
import { EXERCISES, unitLabel } from '../data/exercises.js';
import { weeklyCompletion } from '../logic/progress.js';
import * as state from '../core/state.js';
import { navigate } from '../core/router.js';

function currentWeek(data) {
  const loc = locateDate(todayKey(), data.settings.startDate);
  return Math.min(Math.max(loc.week, 1), TOTAL_WEEKS);
}

export function header(params, data) {
  const week = Number(params.week) || currentWeek(data);
  return {
    title: 'โปรแกรม 12 สัปดาห์',
    subtitle: `สัปดาห์ที่ ${week} · ${weekFocus(week)}`,
    back: '/',
  };
}

function dateOfDay(data, week, dayIndex) {
  return addDays(data.settings.startDate, weekStartOffset(week) + dayIndex);
}

function statusOf(data, dateKey, plan) {
  const s = data.sessions[dateKey];
  const today = todayKey();
  if (s?.status === 'completed') return 'completed';
  if (plan.type === 'rest') return 'rest';
  if (dateKey === today) return 'today';
  if (dateKey < today) return 'missed';
  return 'upcoming';
}

const STATUS_BADGE = {
  completed: '<span class="badge badge-success">สำเร็จ</span>',
  today: '<span class="badge badge-primary">วันนี้</span>',
  missed: '<span class="badge badge-warn">ยังไม่ได้ฝึก</span>',
  upcoming: '<span class="badge">รออยู่</span>',
  rest: '<span class="badge">วันพัก</span>',
};

export function view(params, data) {
  const week = Math.min(Math.max(Number(params.week) || currentWeek(data), 1), TOTAL_WEEKS);
  const plans = getWeekPlan(week, data.settings, data.programOverrides);
  const weekDone = weeklyCompletion(data);

  const doneThisWeek = plans.filter((p, i) => {
    if (p.type === 'rest') return false;
    const k = dateOfDay(data, week, i);
    return data.sessions[k]?.status === 'completed';
  }).length;

  return `<div class="page">
    <div class="card card-lg">
      <div class="row-between">
        <div>
          <div class="small muted">สัปดาห์</div>
          <div class="hero-week">${week} <span>/ ${TOTAL_WEEKS}</span></div>
        </div>
        <div class="row" style="gap:8px">
          <button class="icon-btn" data-week-prev ${week <= 1 ? 'disabled' : ''}>${icon('left')}</button>
          <button class="icon-btn" data-week-next ${week >= TOTAL_WEEKS ? 'disabled' : ''}>${icon('right')}</button>
        </div>
      </div>
      <p class="small muted mt-8">${weekFocus(week)}</p>
      ${isDeloadWeek(week) ? `<span class="badge badge-warn mt-8">สัปดาห์ฟื้นตัว (Deload)</span>` : ''}
      <div class="mt-14">${progressBar(doneThisWeek / 6, doneThisWeek >= 6)}</div>
      <div class="small muted mt-8">ฝึกสำเร็จ ${doneThisWeek} / 6 วันของสัปดาห์นี้</div>
    </div>

    <div class="section-title">เลือกสัปดาห์</div>
    <div class="week-strip">
      ${Array.from({ length: TOTAL_WEEKS }, (_, i) => {
        const w = i + 1;
        const done = weekDone[i]?.value >= 6;
        return `<button class="wk ${w === week ? 'active' : ''} ${
          isDeloadWeek(w) ? 'deload' : ''
        } ${done ? 'done' : ''}" data-week="${w}">
          W${w}${isDeloadWeek(w) ? '<small>deload</small>' : '<small>&nbsp;</small>'}
        </button>`;
      }).join('')}
    </div>

    <div class="section-title">ตารางประจำสัปดาห์</div>
    <div class="grid" style="gap:9px">
      ${plans
        .map((p, i) => {
          const k = dateOfDay(data, week, i);
          const st = statusOf(data, k, p);
          const sub =
            p.type === 'strength'
              ? p.exercises.map((e) => e.name).join(' · ')
              : p.type === 'running'
                ? p.run.summary
                : 'ฟื้นตัว · ยืดเหยียดเบา ๆ';
          return `<button class="day-card s-${st}" data-day="${i}">
            <div class="day-dow">
              <b>${DOW_TH[(i + 1) % 7]}</b>
              <span>${fmtThai(k, false)}</span>
            </div>
            <div class="ex-icon" style="width:38px;height:38px;flex:0 0 38px">
              ${exIcon(p.type === 'running' ? 'run' : p.type === 'rest' ? 'rest' : 'pushup')}
            </div>
            <div class="grow">
              <div class="bold small">${p.title}</div>
              <div class="tiny muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${sub}</div>
            </div>
            ${STATUS_BADGE[st]}
          </button>`;
        })
        .join('')}
    </div>

    <div class="mt-20">
      ${note(
        'กดที่วันใดก็ได้เพื่อดูรายละเอียด ปรับจำนวนครั้งและเซตของสัปดาห์นั้นได้ตามความพร้อมของร่างกาย ไม่จำเป็นต้องเพิ่มความหนักถ้ายังไม่ไหว'
      )}
    </div>
  </div>`;
}

function openDayModal(data, week, dayIndex, rerender) {
  const plans = getWeekPlan(week, data.settings, data.programOverrides);
  const p = plans[dayIndex];
  const dateKey = addDays(data.settings.startDate, weekStartOffset(week) + dayIndex);
  const session = data.sessions[dateKey];

  let body = '';
  if (p.type === 'strength') {
    body = `
      <p class="small muted" style="margin-bottom:12px">ปรับจำนวนครั้ง/เซตได้ ค่าที่ปรับจะใช้กับสัปดาห์ที่ ${week} เท่านั้น</p>
      ${p.exercises
        .map(
          (e, i) => `
        <div class="ex-row" style="align-items:flex-start">
          <div class="ex-icon">${exIcon(e.icon)}</div>
          <div class="grow">
            <div class="ex-name">${e.name}${e.customized ? ' <span class="badge badge-primary">ปรับแล้ว</span>' : ''}</div>
            <div class="ex-meta">แนะนำ ${e.repsLabel} × ${e.sets} เซต</div>
            <div class="row mt-8 wrap" style="gap:10px">
              <div><div class="tiny muted">${unitLabel(EXERCISES[e.id])}</div>${stepper(
                `reps:${e.id}`,
                e.reps,
                { min: 1, max: 300, step: EXERCISES[e.id].unit === 'seconds' ? 5 : 1 }
              )}</div>
              <div><div class="tiny muted">เซต</div>${stepper(`sets:${e.id}`, e.sets, {
                min: 1,
                max: 8,
              })}</div>
            </div>
          </div>
        </div>`
        )
        .join('')}
      <button class="btn btn-ghost btn-block btn-sm mt-14" data-reset-week>คืนค่าตามโปรแกรมเดิม</button>`;
  } else if (p.type === 'running') {
    body = `
      <div class="card card-flat">
        <div class="bold">${p.run.summary}</div>
        <p class="small muted mt-8">${p.run.note}</p>
        <div class="small muted mt-8">เวลาโดยประมาณ ${p.estMinutes} นาที</div>
      </div>`;
  } else {
    body = `<ul class="small muted" style="margin:0;padding-left:18px;line-height:1.9">
      ${p.restActivities.map((t) => `<li>${t}</li>`).join('')}
    </ul>`;
  }

  openModal({
    title: `${DOW_FULL_TH[(dayIndex + 1) % 7]} · ${p.title}`,
    subtitle: `${fmtThai(dateKey)}${session?.status === 'completed' ? ' · ฝึกสำเร็จแล้ว' : ''}`,
    body,
    onMount: (el) => {
      bindSteppers(el, (name, value) => {
        const [field, exId] = name.split(':');
        state.update((d) => {
          const key = `${week}:${p.planKey}:${exId}`;
          const cur = d.programOverrides[key] || {};
          d.programOverrides[key] = { ...cur, [field]: value };
        });
      });
      el.querySelector('[data-reset-week]')?.addEventListener('click', () => {
        state.update((d) => {
          for (const k of Object.keys(d.programOverrides)) {
            if (k.startsWith(`${week}:${p.planKey}:`)) delete d.programOverrides[k];
          }
        });
        toast('คืนค่าตามโปรแกรมเดิมแล้ว');
        rerender();
      });
    },
    actions: [
      { label: 'ปิด', cls: 'btn-ghost', onClick: () => rerender() },
      {
        label: p.type === 'rest' ? 'บันทึกวันพัก' : 'ไปที่หน้าฝึก',
        cls: 'btn-primary',
        onClick: () => {
          navigate(p.type === 'running' ? '/running' : '/workout', { date: dateKey });
        },
      },
    ],
  });
}

export function mount(root, params, ctx) {
  const data = state.getData();
  const week = Math.min(Math.max(Number(params.week) || currentWeek(data), 1), TOTAL_WEEKS);

  root.querySelector('[data-week-prev]')?.addEventListener('click', () => {
    if (week > 1) navigate('/program', { week: week - 1 });
  });
  root.querySelector('[data-week-next]')?.addEventListener('click', () => {
    if (week < TOTAL_WEEKS) navigate('/program', { week: week + 1 });
  });
  root.querySelectorAll('[data-week]').forEach((btn) => {
    btn.addEventListener('click', () => navigate('/program', { week: Number(btn.dataset.week) }));
  });
  root.querySelectorAll('[data-day]').forEach((btn) => {
    btn.addEventListener('click', () =>
      openDayModal(state.getData(), week, Number(btn.dataset.day), ctx.rerender)
    );
  });
}
