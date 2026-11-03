/** mobility.js — หน้าวอร์มอัปก่อนฝึก และยืดเหยียดหลังฝึก พร้อมโหมดจับเวลานำทีละท่า */

import { icon, exIcon } from '../components/icons.js';
import { note, segmented, progressBar } from '../components/ui.js';
import { openModal } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { fmtDuration, fmtDurationTh } from '../core/dates.js';
import { ROUTINES, routineSeconds } from '../data/mobility.js';
import { navigate } from '../core/router.js';

/* ---------- หัวหน้าจอ ---------- */

function routineOf(params) {
  return ROUTINES[params.r] || ROUTINES.warmup;
}

export function header(params) {
  const r = routineOf(params);
  return {
    title: 'วอร์มอัป & ยืดเหยียด',
    subtitle: r.subtitle,
    back: params.from || '/',
  };
}

/* ---------- มุมมอง ---------- */

function durationLabel(m) {
  if (m.perSide) return `ข้างละ ${Math.round(m.seconds / 2)} วินาที`;
  return `${m.seconds} วินาที`;
}

function moveRow(m, i) {
  return `
    <button class="ex-row" data-move="${i}" style="width:100%;text-align:left">
      <div class="ex-icon">${exIcon(m.icon)}</div>
      <div class="grow">
        <div class="ex-name">${i + 1}. ${m.name}</div>
        <div class="ex-meta">${durationLabel(m)} · ${m.target}</div>
      </div>
      ${icon('right')}
    </button>`;
}

export function view(params) {
  const r = routineOf(params);
  const total = routineSeconds(r.moves);

  return `<div class="page">
    ${segmented(
      [
        { value: 'warmup', label: 'ก่อนฝึก' },
        { value: 'cooldown', label: 'หลังฝึก' },
      ],
      r.key,
      'data-routine'
    )}

    <div class="card card-lg mt-14">
      <div class="row-between">
        <div class="grow">
          <div class="bold">${r.title}</div>
          <div class="small muted mt-8">${r.moves.length} ท่า · รวมประมาณ ${fmtDurationTh(total)}</div>
        </div>
        <div class="ex-icon" style="background:var(--primary-soft)">
          ${exIcon(r.key === 'warmup' ? 'march' : 'child_pose')}
        </div>
      </div>
      <button class="btn btn-primary btn-block mt-14" data-start-routine>
        ${icon('play')} เริ่มโหมดจับเวลา
      </button>
      <p class="tiny muted center mt-8">แอปจะนำทีละท่าและนับเวลาให้เอง</p>
    </div>

    <div class="mt-14">${note(r.why)}</div>

    <div class="section-title">ลำดับท่า</div>
    <div class="card">
      ${r.moves.map((m, i) => moveRow(m, i)).join('')}
    </div>

    <div class="mt-20">
      ${note(
        'ยืดจนรู้สึกตึงพอดี ไม่ถึงกับเจ็บ ห้ามเด้งหรือกระตุก หากมีอาการเจ็บแปลบที่ข้อต่อให้หยุดท่านั้นทันที',
        'warn'
      )}
    </div>

    <div class="row mt-14" style="gap:10px">
      <button class="btn btn-ghost grow" data-nav="/guide">คำแนะนำความปลอดภัย</button>
      <button class="btn btn-ghost grow" data-nav="/workout">ไปหน้าฝึกวันนี้</button>
    </div>
  </div>`;
}

/* ---------- รายละเอียดท่า ---------- */

function openMoveModal(m) {
  openModal({
    title: m.name,
    subtitle: `${m.en} · ${m.target}`,
    body: `
      <div class="ex-hero">${exIcon(m.icon)}</div>
      <div class="row-between card-flat" style="padding:11px;border-radius:12px;margin-bottom:14px">
        <span class="small muted">เวลาที่แนะนำ</span>
        <b>${durationLabel(m)}</b>
      </div>
      <div class="label">วิธีทำ</div>
      <ol class="small muted" style="margin:0 0 14px;padding-left:18px;line-height:1.85">
        ${m.how.map((h) => `<li>${h}</li>`).join('')}
      </ol>
      ${m.tip ? note(m.tip) : ''}
    `,
    actions: [{ label: 'ปิด', cls: 'btn-primary' }],
  });
}

/* ---------- โหมดจับเวลานำทีละท่า ---------- */

const player = { id: null, wakeLock: null };

async function acquireWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      player.wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch {
    /* ไม่รองรับก็ข้ามไป */
  }
}

function releaseWakeLock() {
  try {
    player.wakeLock?.release?.();
  } catch {
    /* ไม่เป็นไร */
  }
  player.wakeLock = null;
}

function stopPlayer() {
  if (player.id) clearInterval(player.id);
  player.id = null;
  releaseWakeLock();
}

function startRoutine(routine) {
  const moves = routine.moves;
  let index = 0;
  let left = moves[0].seconds;
  let paused = false;
  let sideSwapped = false;

  const el = document.createElement('div');
  el.className = 'rest-overlay routine-player';
  document.body.appendChild(el);
  document.body.style.overflow = 'hidden';
  acquireWakeLock();

  const totalSteps = moves.length;

  function close() {
    stopPlayer();
    el.remove();
    document.body.style.overflow = '';
  }

  function finish() {
    stopPlayer();
    el.innerHTML = `
      <div style="max-width:420px;width:100%">
        <div class="done-badge">${icon('check')}</div>
        <h2>${routine.title}เสร็จแล้ว</h2>
        <p class="small muted mt-8">
          ${routine.key === 'warmup'
            ? 'ร่างกายพร้อมแล้ว เริ่มฝึกได้เลย'
            : 'ฟื้นตัวเรียบร้อย อย่าลืมดื่มน้ำและพักผ่อนให้พอ'}
        </p>
        <div class="row mt-20" style="gap:10px">
          <button class="btn btn-ghost grow" data-close>ปิด</button>
          <button class="btn btn-primary grow" data-go>
            ${routine.key === 'warmup' ? 'ไปหน้าฝึกวันนี้' : 'กลับหน้าหลัก'}
          </button>
        </div>
      </div>`;
    el.querySelector('[data-close]').addEventListener('click', close);
    el.querySelector('[data-go]').addEventListener('click', () => {
      close();
      navigate(routine.key === 'warmup' ? '/workout' : '/');
    });
    toast(`${routine.title}ครบทุกท่าแล้ว`);
  }

  function render() {
    const m = moves[index];
    const next = moves[index + 1];
    const elapsed = m.seconds - left;

    el.innerHTML = `
      <div style="max-width:460px;width:100%">
        <div class="small muted">ท่าที่ ${index + 1} จาก ${totalSteps} · ${routine.title}</div>

        <div class="ex-hero" style="width:132px;margin:14px auto 8px">${exIcon(m.icon)}</div>

        <h2 style="font-size:20px">${m.name}</h2>
        <div class="small muted mt-8">${durationLabel(m)} · ${m.target}</div>

        <div class="rest-count" style="margin:14px 0 6px">${left}</div>

        <div style="max-width:320px;margin:0 auto">
          ${progressBar(m.seconds ? elapsed / m.seconds : 0)}
        </div>

        <ul class="small muted" style="text-align:left;max-width:360px;margin:18px auto 0;padding-left:18px;line-height:1.75">
          ${m.how.map((h) => `<li>${h}</li>`).join('')}
        </ul>

        <div class="row mt-20" style="gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" data-prev ${index === 0 ? 'disabled' : ''}>
            ${icon('left')} ก่อนหน้า
          </button>
          <button class="btn btn-primary" data-toggle>
            ${icon(paused ? 'play' : 'pause')} ${paused ? 'เล่นต่อ' : 'พัก'}
          </button>
          <button class="btn btn-ghost btn-sm" data-next>
            ข้าม ${icon('right')}
          </button>
        </div>

        <div class="tiny muted mt-14">
          ${next ? `ถัดไป: ${next.name}` : 'ท่าสุดท้ายแล้ว'}
        </div>
        <button class="btn btn-ghost btn-sm mt-14" data-exit>${icon('x')} ออกจากโหมดจับเวลา</button>
      </div>`;

    el.querySelector('[data-toggle]').addEventListener('click', () => {
      paused = !paused;
      render();
    });
    el.querySelector('[data-next]').addEventListener('click', () => goTo(index + 1));
    el.querySelector('[data-prev]').addEventListener('click', () => goTo(index - 1));
    el.querySelector('[data-exit]').addEventListener('click', close);
  }

  function goTo(i) {
    if (i >= totalSteps) {
      finish();
      return;
    }
    index = Math.max(0, i);
    left = moves[index].seconds;
    sideSwapped = false;
    render();
  }

  stopPlayer();
  player.id = setInterval(() => {
    if (paused) return;
    left--;

    const m = moves[index];
    if (m.perSide && !sideSwapped && left === Math.round(m.seconds / 2)) {
      sideSwapped = true;
      toast('สลับข้าง', 'ok', 2200);
    }

    if (left <= 0) {
      if (index + 1 >= totalSteps) {
        finish();
        return;
      }
      goTo(index + 1);
      toast(`ต่อไป: ${moves[index].name}`, 'ok', 1800);
      return;
    }
    render();
  }, 1000);

  render();
}

/* ---------- ผูกเหตุการณ์ ---------- */

export function mount(root, params) {
  const r = routineOf(params);

  root.querySelectorAll('[data-routine]').forEach((btn) => {
    btn.addEventListener('click', () =>
      navigate('/warmup', { r: btn.dataset.routine, ...(params.from ? { from: params.from } : {}) })
    );
  });

  root.querySelectorAll('[data-move]').forEach((btn) => {
    btn.addEventListener('click', () => openMoveModal(r.moves[Number(btn.dataset.move)]));
  });

  root.querySelector('[data-start-routine]')?.addEventListener('click', () => startRoutine(r));
}

export { fmtDuration };
