/** history.js — ประวัติการฝึกย้อนหลัง (ดู / ค้นหา / กรอง / แก้ไข / ลบ) */

import { icon, exIcon } from '../components/icons.js';
import { emptyState, escapeHtml, note } from '../components/ui.js';
import { openModal, confirmDialog } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { fmtThaiFull, fmtDuration, fmtPace, fmtThai } from '../core/dates.js';
import { totalRepsOf, secondsOf } from '../logic/progress.js';
import { unitLabel, EXERCISES } from '../data/exercises.js';
import * as state from '../core/state.js';
import { navigate } from '../core/router.js';

const FILTERS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'strength', label: 'ฝึกกล้ามเนื้อ' },
  { value: 'running', label: 'การวิ่ง' },
  { value: 'rest', label: 'วันพัก' },
];

const RPE_LABEL = { 1: 'สบาย', 2: 'กำลังดี', 3: 'เหนื่อย', 4: 'หนักมาก', 5: 'ล้าเกินไป' };

export function header() {
  return { title: 'ประวัติการฝึก', subtitle: 'ย้อนดู แก้ไข หรือลบบันทึกได้', back: '/' };
}

function matches(s, { type, q, from, to }) {
  if (type !== 'all' && s.type !== type) return false;
  if (from && s.date < from) return false;
  if (to && s.date > to) return false;
  if (q) {
    const hay = [
      s.title,
      s.note || '',
      fmtThai(s.date),
      ...(s.exercises || []).map((e) => e.name),
    ]
      .join(' ')
      .toLowerCase();
    if (!hay.includes(q.toLowerCase())) return false;
  }
  return true;
}

export function view(params, data) {
  const filter = {
    type: params.type || 'all',
    q: params.q || '',
    from: params.from || '',
    to: params.to || '',
  };

  const sessions = Object.values(data.sessions)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter((s) => matches(s, filter));

  const total = Object.keys(data.sessions).length;

  return `<div class="page">
    <div class="card">
      <div class="row" style="gap:10px">
        <div class="grow" style="position:relative">
          <input class="input" data-q placeholder="ค้นหาจากชื่อท่า วันที่ หรือหมายเหตุ" value="${escapeHtml(
            filter.q
          )}"/>
        </div>
        <button class="icon-btn" data-adv aria-label="ตัวกรองเพิ่มเติม">${icon('filter')}</button>
      </div>
      <div class="pills mt-14">
        ${FILTERS.map(
          (f) =>
            `<button class="pill ${f.value === filter.type ? 'active' : ''}" data-type="${f.value}">${f.label}</button>`
        ).join('')}
      </div>
      <div class="grid g2 mt-14 ${filter.from || filter.to ? '' : 'hidden'}" data-range-box>
        <div class="field" style="margin:0">
          <label>ตั้งแต่วันที่</label>
          <input class="input" type="date" data-from value="${filter.from}"/>
        </div>
        <div class="field" style="margin:0">
          <label>ถึงวันที่</label>
          <input class="input" type="date" data-to value="${filter.to}"/>
        </div>
      </div>
      ${
        filter.q || filter.type !== 'all' || filter.from || filter.to
          ? `<button class="btn btn-ghost btn-sm btn-block mt-14" data-clear>ล้างตัวกรอง</button>`
          : ''
      }
    </div>

    <div class="section-title">
      ${sessions.length} รายการ
      <span class="muted tiny">จากทั้งหมด ${total}</span>
    </div>

    ${
      sessions.length === 0
        ? `<div class="card">${emptyState(
            total === 0 ? 'ยังไม่มีประวัติการฝึก' : 'ไม่พบรายการที่ตรงกับตัวกรอง',
            total === 0
              ? 'เมื่อบันทึกการฝึกครั้งแรก รายการจะแสดงที่นี่'
              : 'ลองเปลี่ยนคำค้นหรือล้างตัวกรอง',
            'history',
            total === 0 ? '<button class="btn btn-primary" data-nav="/workout">เริ่มฝึกวันนี้</button>' : ''
          )}</div>`
        : sessions.map(rowHtml).join('')
    }

    ${
      sessions.length
        ? `<div class="mt-20">${note('กดที่รายการเพื่อดูรายละเอียด แก้ไข หรือลบ')}</div>`
        : ''
    }
  </div>`;
}

function rowHtml(s) {
  const sub =
    s.type === 'strength'
      ? `${s.exercises.filter((e) => e.done).length}/${s.exercises.length} ท่า · ${totalRepsOf(s)} ครั้ง`
      : s.type === 'running'
        ? `${(s.run?.distanceKm || 0).toFixed(1)} กม. · ${fmtDuration(s.run?.durationSec || 0)}`
        : s.note
          ? escapeHtml(s.note).slice(0, 60)
          : 'วันพัก';

  return `<button class="hist-row" data-open="${s.date}">
    <div class="ex-icon" style="width:40px;height:40px;flex:0 0 40px">
      ${exIcon(s.type === 'running' ? 'run' : s.type === 'rest' ? 'rest' : 'pushup')}
    </div>
    <div class="grow">
      <div class="small bold">${fmtThaiFull(s.date)}</div>
      <div class="tiny muted">${escapeHtml(s.title)} · ${sub}</div>
    </div>
    ${
      s.status === 'completed'
        ? `<span class="badge badge-success">${icon('check')}</span>`
        : `<span class="badge badge-warn">ค้างอยู่</span>`
    }
    ${icon('right')}
  </button>`;
}

function detailBody(s) {
  if (s.type === 'strength') {
    return `
      <div class="grid g3" style="margin-bottom:14px">
        <div><div class="tiny muted">เวลาที่ใช้</div><b>${fmtDuration(s.elapsedSec || 0)}</b></div>
        <div><div class="tiny muted">จำนวนครั้งรวม</div><b>${totalRepsOf(s)}</b></div>
        <div><div class="tiny muted">ท่าที่ทำครบ</div><b>${s.exercises.filter((e) => e.done).length}/${s.exercises.length}</b></div>
      </div>
      ${s.exercises
        .map(
          (e) => `<div class="row-between" style="padding:8px 0;border-bottom:1px solid var(--line)">
            <span class="small">${e.name} ${e.done ? `<span class="badge badge-success">ครบ</span>` : ''}</span>
            <span class="small muted">${e.repsDone.map((v) => (v ? v : '—')).join(' / ')} ${unitLabel(
              EXERCISES[e.id]
            )}</span>
          </div>`
        )
        .join('')}`;
  }
  if (s.type === 'running') {
    const r = s.run || {};
    return `<div class="grid g2" style="gap:10px">
      <div><div class="tiny muted">ระยะทาง</div><b>${(r.distanceKm || 0).toFixed(2)} กม.</b></div>
      <div><div class="tiny muted">เวลา</div><b>${fmtDuration(r.durationSec || 0)}</b></div>
      <div><div class="tiny muted">Pace เฉลี่ย</div><b>${
        r.distanceKm > 0 ? `${fmtPace(r.durationSec / r.distanceKm)} /กม.` : '—'
      }</b></div>
      <div><div class="tiny muted">จำนวนรอบ</div><b>${r.rounds || '—'}</b></div>
    </div>`;
  }
  return `<p class="small muted">บันทึกวันพัก</p>`;
}

function openDetail(dateKey, rerender) {
  const s = state.getSession(dateKey);
  if (!s) return;

  openModal({
    title: s.title,
    subtitle: fmtThaiFull(s.date),
    body: `
      ${detailBody(s)}
      ${s.rpe ? `<div class="mt-14 small muted">ความรู้สึก: <b>${RPE_LABEL[s.rpe] || s.rpe}</b></div>` : ''}
      ${s.note ? `<div class="mt-8 small muted">หมายเหตุ: ${escapeHtml(s.note)}</div>` : ''}
      <button class="btn btn-ghost btn-block btn-sm mt-14" data-del>${icon('trash')} ลบรายการนี้</button>
    `,
    onMount: (body, api) => {
      body.querySelector('[data-del]').addEventListener('click', async () => {
        api.close();
        const ok = await confirmDialog({
          title: 'ลบบันทึกการฝึก',
          message: `ต้องการลบบันทึกของวันที่ ${fmtThaiFull(dateKey)} ใช่หรือไม่ การกระทำนี้ย้อนกลับไม่ได้`,
          confirmLabel: 'ลบ',
          danger: true,
        });
        if (!ok) return;
        state.deleteSession(dateKey);
        toast('ลบรายการแล้ว');
        rerender();
      });
    },
    actions: [
      { label: 'ปิด', cls: 'btn-ghost' },
      {
        label: 'แก้ไข',
        cls: 'btn-primary',
        onClick: () =>
          navigate(s.type === 'running' ? '/running' : '/workout', { date: dateKey }),
      },
    ],
  });
}

export function mount(root, params, ctx) {
  const cur = {
    type: params.type || 'all',
    q: params.q || '',
    from: params.from || '',
    to: params.to || '',
  };

  const go = (patch) => {
    const next = { ...cur, ...patch };
    const clean = {};
    for (const [k, v] of Object.entries(next)) if (v && v !== 'all') clean[k] = v;
    navigate('/history', clean);
  };

  root.querySelectorAll('[data-type]').forEach((b) =>
    b.addEventListener('click', () => go({ type: b.dataset.type }))
  );

  const qEl = root.querySelector('[data-q]');
  let t = null;
  qEl?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => go({ q: qEl.value.trim() }), 420);
  });
  qEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(t);
      go({ q: qEl.value.trim() });
    }
  });

  root.querySelector('[data-adv]')?.addEventListener('click', () => {
    root.querySelector('[data-range-box]')?.classList.toggle('hidden');
  });

  root.querySelector('[data-from]')?.addEventListener('change', (e) => go({ from: e.target.value }));
  root.querySelector('[data-to]')?.addEventListener('change', (e) => go({ to: e.target.value }));
  root.querySelector('[data-clear]')?.addEventListener('click', () => navigate('/history'));

  root.querySelectorAll('[data-open]').forEach((b) =>
    b.addEventListener('click', () => openDetail(b.dataset.open, ctx.rerender))
  );
}
