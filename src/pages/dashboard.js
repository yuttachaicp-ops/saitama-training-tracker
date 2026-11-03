/** dashboard.js — หน้าหลัก */

import { icon, exIcon } from '../components/icons.js';
import { ring, progressBar, stat, note } from '../components/ui.js';
import {
  todayKey,
  fmtThaiFull,
  fmtDurationTh,
  weekKeys,
  DOW_TH,
  dowOf,
  addDays,
  fromKey,
} from '../core/dates.js';
import { overview, bestStreak } from '../logic/progress.js';
import { getDayPlan, locateDate, TOTAL_WEEKS, weekFocus, isDeloadWeek } from '../data/program.js';
import { navigate } from '../core/router.js';
import { applyTheme } from '../core/theme.js';
import * as state from '../core/state.js';

export function header(params, data) {
  return {
    title: `สวัสดี ${data.profile.name}`,
    subtitle: fmtThaiFull(todayKey()),
    right: `<button class="icon-btn" data-toggle-theme aria-label="สลับธีม">${icon(
      data.settings.theme === 'light' ? 'moon' : 'sun'
    )}</button>`,
  };
}

function todayCard(ov, data) {
  if (ov.notStarted) {
    return `<div class="today-card">
      <div class="today-type">
        <div class="ex-icon">${icon('calendar')}</div>
        <div class="grow">
          <div class="bold">โปรแกรมยังไม่เริ่ม</div>
          <div class="small muted">จะเริ่มวันที่ ${fmtThaiFull(data.settings.startDate)}</div>
        </div>
      </div>
      <button class="btn btn-ghost btn-block mt-14" data-nav="/settings">เปลี่ยนวันเริ่มโปรแกรม</button>
    </div>`;
  }

  if (ov.finished) {
    return `<div class="today-card">
      <div class="today-type">
        <div class="ex-icon">${icon('trophy')}</div>
        <div class="grow">
          <div class="bold">จบโปรแกรม 12 สัปดาห์แล้ว</div>
          <div class="small muted">ฝึกสำเร็จ ${ov.completedDays} จาก ${ov.totalDays} วัน</div>
        </div>
      </div>
      <div class="row mt-14" style="gap:10px">
        <button class="btn btn-ghost grow" data-nav="/stats">ดูสถิติ</button>
        <button class="btn btn-primary grow" data-nav="/settings">เริ่มรอบใหม่</button>
      </div>
    </div>`;
  }

  const plan = ov.plan;
  const s = ov.session;
  const done = s?.status === 'completed';
  const inProgress = s && s.status === 'in_progress';

  if (plan.type === 'rest') {
    return `<div class="today-card">
      <div class="today-type">
        <div class="ex-icon">${exIcon('rest')}</div>
        <div class="grow">
          <div class="bold">วันนี้: วันพัก</div>
          <div class="small muted">ฟื้นตัวคือส่วนหนึ่งของการฝึก</div>
        </div>
        ${done ? `<span class="badge badge-success">${icon('check')} บันทึกแล้ว</span>` : ''}
      </div>
      <ul class="small muted mt-14" style="margin:0;padding-left:18px;line-height:1.8">
        ${plan.restActivities.map((t) => `<li>${t}</li>`).join('')}
      </ul>
      <button class="btn ${done ? 'btn-ghost' : 'btn-primary'} btn-block mt-14" data-nav="/workout">
        ${icon(done ? 'edit' : 'check')} ${done ? 'แก้ไขบันทึกวันพัก' : 'บันทึกกิจกรรมวันพัก'}
      </button>
    </div>`;
  }

  const subtitle =
    plan.type === 'running'
      ? plan.run.summary
      : `${plan.exercises.length} ท่า · ประมาณ ${plan.estMinutes} นาที`;

  const target = plan.type === 'running' ? '/running' : '/workout';

  return `<div class="today-card">
    <div class="today-type">
      <div class="ex-icon">${exIcon(plan.type === 'running' ? 'run' : 'pushup')}</div>
      <div class="grow">
        <div class="bold">วันนี้: ${plan.title}</div>
        <div class="small muted">${subtitle}</div>
      </div>
      ${
        done
          ? `<span class="badge badge-success">${icon('check')} สำเร็จ</span>`
          : inProgress
            ? `<span class="badge badge-warn">กำลังทำ</span>`
            : ''
      }
    </div>

    ${
      plan.type === 'strength'
        ? `<div class="mt-14">${progressBar(
            (s?.exercises?.filter((e) => e.done).length || 0) / (plan.exercises.length || 1),
            done
          )}
           <div class="small muted mt-8">ทำแล้ว ${
             s?.exercises?.filter((e) => e.done).length || 0
           } จาก ${plan.exercises.length} ท่า</div></div>`
        : ''
    }

    <button class="btn ${done ? 'btn-ghost' : 'btn-primary'} btn-block mt-14" data-nav="${target}">
      ${icon(done ? 'edit' : inProgress ? 'play' : 'play')}
      ${done ? 'ดู / แก้ไขผลการฝึก' : inProgress ? 'ฝึกต่อ' : 'เริ่มฝึกวันนี้'}
    </button>
  </div>`;
}

function weekStrip(data) {
  const keys = weekKeys(todayKey());
  const today = todayKey();
  return `<div class="week-dots">
    ${keys
      .map((k) => {
        const loc = locateDate(k, data.settings.startDate);
        const plan = loc.inProgram
          ? getDayPlan(loc.week, loc.dayIndex, data.settings, data.programOverrides)
          : null;
        const s = data.sessions[k];
        const isToday = k === today;
        const done = s?.status === 'completed';
        const rest = plan?.type === 'rest';
        const missed = !done && !rest && k < today && loc.inProgram;

        const cls = [
          'wd',
          done ? 'done' : '',
          rest ? 'rest' : '',
          isToday ? 'today' : '',
          missed ? 'missed' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const mark = done
          ? icon('check')
          : rest
            ? ''
            : missed
              ? '!'
              : String(fromKey(k).getDate());

        return `<div class="${cls}" title="${fmtThaiFull(k)}">
          <div class="wd-day">${DOW_TH[dowOf(k)]}</div>
          <div class="wd-mark">${mark}</div>
        </div>`;
      })
      .join('')}
  </div>`;
}

export function view(params, data) {
  const ov = overview(data);
  const week = ov.week;
  const focus = weekFocus(week);

  return `<div class="page">
    <div class="hero">
      <div class="hero-left">
        ${ring(ov.programPct, {
          size: 124,
          caption: 'ความคืบหน้า',
          ok: ov.programPct >= 1,
        })}
        <div>
          <div class="small muted">สัปดาห์ที่</div>
          <div class="hero-week">${Math.min(week, TOTAL_WEEKS)} <span>/ ${TOTAL_WEEKS}</span></div>
          <div class="small muted mt-8">
            ${ov.finished ? 'จบโปรแกรมแล้ว' : `เหลืออีก ${ov.weeksLeft} สัปดาห์`}
          </div>
          ${
            isDeloadWeek(week) && !ov.finished
              ? `<span class="badge badge-warn mt-8">สัปดาห์ฟื้นตัว (Deload)</span>`
              : ''
          }
        </div>
      </div>
      <div class="hero-side">
        <div class="mini-stat">${icon('calendar')}<div class="grow"><div class="tiny muted">ฝึกสำเร็จ</div><b>${ov.completedDays} / ${ov.totalDays} วัน</b></div></div>
        <div class="mini-stat">${icon('flame')}<div class="grow"><div class="tiny muted">ฝึกต่อเนื่อง</div><b>${ov.streak} วัน</b></div></div>
        <div class="mini-stat">${icon('clock')}<div class="grow"><div class="tiny muted">เวลาฝึกสะสม</div><b>${fmtDurationTh(ov.totalSeconds)}</b></div></div>
      </div>
    </div>

    ${focus && !ov.finished ? `<p class="small muted mt-14">โฟกัสสัปดาห์นี้: ${focus}</p>` : ''}

    <div class="section-title">การฝึกวันนี้</div>
    ${todayCard(ov, data)}

    <div class="section-title">
      สัปดาห์นี้
      <button class="link" data-nav="/program">ดูทั้งโปรแกรม</button>
    </div>
    ${weekStrip(data)}

    <div class="section-title">ภาพรวม</div>
    <div class="grid g2">
      ${stat('target', 'อัตราการฝึกสำเร็จ', Math.round(ov.successRate * 100), '%')}
      ${stat('road', 'ระยะทางวิ่งสะสม', ov.totalKm.toFixed(1), 'กม.')}
      ${stat('flame', 'สตรีคดีที่สุด', bestStreak(data), 'วัน')}
      ${stat('trophy', 'ความสำเร็จที่ปลดล็อก', Object.keys(data.achievements).length, 'รายการ')}
    </div>

    <div class="section-title">ทางลัด</div>
    <div class="grid g3">
      <button class="card card-click center shortcut" data-nav="/running">
        ${icon('run')}<div class="small bold mt-8">บันทึกการวิ่ง</div>
      </button>
      <button class="card card-click center shortcut" data-nav="/history">
        ${icon('history')}<div class="small bold mt-8">ประวัติการฝึก</div>
      </button>
      <button class="card card-click center shortcut" data-nav="/achievements">
        ${icon('trophy')}<div class="small bold mt-8">ความสำเร็จ</div>
      </button>
    </div>

    <div class="mt-20">
      ${note(
        'วอร์มอัปก่อนฝึกทุกครั้ง และคูลดาวน์หลังฝึก หากเจ็บแปลบ เจ็บข้อ หรือเหนื่อยผิดปกติ ให้หยุดและพัก — แอปนี้เป็นเครื่องมือติดตามผล ไม่ใช่คำแนะนำทางการแพทย์ <button class="link" data-nav="/guide" style="background:none;border:none;padding:0;cursor:pointer">อ่านคำแนะนำ</button>'
      )}
    </div>
  </div>`;
}

export function mount(root, params, ctx) {
  document.querySelector('[data-toggle-theme]')?.addEventListener('click', () => {
    const cur = state.getData().settings.theme;
    const next = cur === 'light' ? 'dark' : 'light';
    state.update((d) => {
      d.settings.theme = next;
    });
    applyTheme(next);
    ctx.rerender();
  });

  root.querySelectorAll('.wd').forEach((el, i) => {
    el.addEventListener('click', () => {
      const keys = weekKeys(todayKey());
      navigate('/workout', { date: keys[i] });
    });
  });
}

export { addDays };
