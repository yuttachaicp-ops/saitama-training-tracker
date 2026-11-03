/**
 * progress.js — ตรรกะการคำนวณความก้าวหน้าทั้งหมด
 * ทุกตัวเลขในหน้า Dashboard และ Statistics คำนวณจากเซสชันจริงที่บันทึกไว้เท่านั้น
 */

import { todayKey, addDays, daysBetween, fromKey } from '../core/dates.js';
import { locateDate, getDayPlan, TOTAL_WEEKS } from '../data/program.js';
import { EXERCISES, UNIT } from '../data/exercises.js';

/** สร้างเซสชันเปล่าจากแผนของวันนั้น */
export function createSession(dateKey, plan) {
  const s = {
    date: dateKey,
    week: plan.week,
    planKey: plan.planKey,
    type: plan.type,
    title: plan.title,
    status: 'in_progress',
    startedAt: new Date().toISOString(),
    completedAt: null,
    elapsedSec: 0,
    exercises: [],
    run: null,
    rpe: null,
    note: '',
  };

  if (plan.type === 'strength') {
    s.exercises = plan.exercises.map((e) => ({
      id: e.id,
      name: e.name,
      icon: e.icon,
      unit: e.unit,
      targetReps: e.reps,
      targetSets: e.sets,
      repsDone: Array.from({ length: e.sets }, () => null),
      done: false,
    }));
  }
  return s;
}

/** ความคืบหน้าในเซสชัน 0..1 */
export function sessionProgress(session) {
  if (!session) return 0;
  if (session.type === 'strength') {
    const total = session.exercises.length || 1;
    const done = session.exercises.filter((e) => e.done).length;
    return done / total;
  }
  if (session.type === 'running') {
    return session.status === 'completed' ? 1 : session.run ? 0.5 : 0;
  }
  return session.status === 'completed' ? 1 : 0;
}

export function isCompleted(session) {
  return !!session && session.status === 'completed';
}

/** จำนวนครั้งรวมที่ทำได้ในเซสชัน (เฉพาะท่าที่นับเป็นครั้ง) */
export function totalRepsOf(session) {
  if (!session || session.type !== 'strength') return 0;
  return session.exercises.reduce((sum, e) => {
    if (e.unit === UNIT.SECONDS) return sum;
    return sum + e.repsDone.reduce((a, b) => a + (Number(b) || 0), 0);
  }, 0);
}

/** เวลาที่ใช้ทั้งหมดของเซสชัน (วินาที) */
export function secondsOf(session) {
  if (!session) return 0;
  if (session.type === 'running') return Number(session.run?.durationSec) || 0;
  return Number(session.elapsedSec) || 0;
}

export function distanceOf(session) {
  if (!session || session.type !== 'running') return 0;
  return Number(session.run?.distanceKm) || 0;
}

/* ------------------------------------------------------------------ */

/** วันฝึกของโปรแกรมที่ "ผ่านมาแล้ว" (ไม่รวมวันพัก, ไม่รวมอนาคต) */
export function elapsedTrainingDays(data, upTo = todayKey()) {
  const start = data.settings.startDate;
  const offset = daysBetween(start, upTo);
  if (offset < 0) return 0;
  const maxOffset = Math.min(offset, TOTAL_WEEKS * 7 - 1);
  let n = 0;
  for (let i = 0; i <= maxOffset; i++) {
    if (i % 7 !== 6) n++; // index 6 = อาทิตย์ = วันพัก
  }
  return n;
}

export const TOTAL_TRAINING_DAYS = TOTAL_WEEKS * 6;

/** จำนวนวันฝึกที่ทำสำเร็จทั้งโปรแกรม */
export function completedTrainingDays(data) {
  return Object.values(data.sessions).filter(
    (s) => s.status === 'completed' && s.type !== 'rest'
  ).length;
}

/** ความคืบหน้ารวมของโปรแกรม 0..1 */
export function programProgress(data) {
  return Math.min(1, completedTrainingDays(data) / TOTAL_TRAINING_DAYS);
}

/** อัตราการฝึกสำเร็จเทียบกับวันที่ผ่านมาแล้ว 0..1 */
export function successRate(data) {
  const elapsed = elapsedTrainingDays(data);
  if (elapsed <= 0) return 0;
  const done = Object.values(data.sessions).filter((s) => {
    if (s.status !== 'completed' || s.type === 'rest') return false;
    return daysBetween(data.settings.startDate, s.date) <= daysBetween(data.settings.startDate, todayKey());
  }).length;
  return Math.min(1, done / elapsed);
}

/** จำนวนวันฝึกต่อเนื่องล่าสุด (วันพักไม่ตัดสตรีค) */
export function currentStreak(data) {
  const start = data.settings.startDate;
  let key = todayKey();
  let streak = 0;

  for (let guard = 0; guard < 400; guard++) {
    const loc = locateDate(key, start);
    if (!loc.inProgram) break;

    const plan = getDayPlan(loc.week, loc.dayIndex, data.settings, data.programOverrides);
    const session = data.sessions[key];

    if (plan && plan.type === 'rest') {
      key = addDays(key, -1);
      continue; // วันพักไม่นับและไม่ตัดสตรีค
    }

    if (session && session.status === 'completed') {
      streak++;
    } else if (key === todayKey()) {
      // วันนี้ยังไม่ได้ฝึก — ยังไม่ตัดสตรีค
    } else {
      break;
    }
    key = addDays(key, -1);
  }
  return streak;
}

/** สตรีคที่ยาวที่สุดที่เคยทำได้ */
export function bestStreak(data) {
  const dates = Object.values(data.sessions)
    .filter((s) => s.status === 'completed' && s.type !== 'rest')
    .map((s) => s.date)
    .sort();
  if (!dates.length) return 0;

  let best = 1;
  let cur = 1;
  for (let i = 1; i < dates.length; i++) {
    const gap = daysBetween(dates[i - 1], dates[i]);
    // เว้นได้ไม่เกิน 1 วัน (วันพัก)
    if (gap === 1 || gap === 2) cur++;
    else cur = 1;
    best = Math.max(best, cur);
  }
  return best;
}

export function totalTrainingSeconds(data) {
  return Object.values(data.sessions)
    .filter((s) => s.status === 'completed')
    .reduce((a, s) => a + secondsOf(s), 0);
}

export function totalDistanceKm(data) {
  return Object.values(data.sessions)
    .filter((s) => s.status === 'completed')
    .reduce((a, s) => a + distanceOf(s), 0);
}

export function runSessions(data) {
  return Object.values(data.sessions)
    .filter((s) => s.type === 'running' && s.status === 'completed' && s.run)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

/** สถิติการวิ่งโดยรวม */
export function runningStats(data) {
  const runs = runSessions(data);
  const totalKm = runs.reduce((a, s) => a + (Number(s.run.distanceKm) || 0), 0);
  const totalSec = runs.reduce((a, s) => a + (Number(s.run.durationSec) || 0), 0);
  const best = runs.reduce((m, s) => Math.max(m, Number(s.run.distanceKm) || 0), 0);
  return {
    count: runs.length,
    totalKm,
    totalSec,
    bestKm: best,
    avgPaceSec: totalKm > 0 ? totalSec / totalKm : 0,
  };
}

/** สถิติที่ดีที่สุดของแต่ละท่า (จำนวนครั้งสูงสุดในหนึ่งเซต) */
export function personalBests(data) {
  const pb = {};
  for (const s of Object.values(data.sessions)) {
    if (s.type !== 'strength' || !Array.isArray(s.exercises)) continue;
    for (const e of s.exercises) {
      const best = e.repsDone.reduce((m, v) => Math.max(m, Number(v) || 0), 0);
      if (best > 0 && best > (pb[e.id]?.value || 0)) {
        pb[e.id] = { value: best, date: s.date, unit: e.unit, name: e.name };
      }
    }
  }
  return pb;
}

/**
 * ชุดข้อมูลกราฟพัฒนาการของท่าหนึ่ง (จำนวนครั้งที่ดีที่สุดในแต่ละวันที่ฝึกท่านั้น)
 * @returns {{date:string,value:number}[]}
 */
export function exerciseSeries(data, exerciseId) {
  const out = [];
  for (const s of Object.values(data.sessions)) {
    if (s.type !== 'strength' || s.status !== 'completed') continue;
    const e = (s.exercises || []).find((x) => x.id === exerciseId);
    if (!e) continue;
    const best = e.repsDone.reduce((m, v) => Math.max(m, Number(v) || 0), 0);
    if (best > 0) out.push({ date: s.date, value: best });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : 1));
}

/** ระยะทางวิ่งรายสัปดาห์ของโปรแกรม */
export function weeklyDistance(data) {
  const out = Array.from({ length: TOTAL_WEEKS }, (_, i) => ({ week: i + 1, value: 0 }));
  for (const s of Object.values(data.sessions)) {
    if (s.type !== 'running' || s.status !== 'completed' || !s.run) continue;
    const loc = locateDate(s.date, data.settings.startDate);
    if (loc.week >= 1 && loc.week <= TOTAL_WEEKS) {
      out[loc.week - 1].value += Number(s.run.distanceKm) || 0;
    }
  }
  return out;
}

/** ความสำเร็จรายสัปดาห์ (ฝึกสำเร็จกี่วันจาก 6) */
export function weeklyCompletion(data) {
  const out = Array.from({ length: TOTAL_WEEKS }, (_, i) => ({ week: i + 1, value: 0 }));
  for (const s of Object.values(data.sessions)) {
    if (s.status !== 'completed' || s.type === 'rest') continue;
    const loc = locateDate(s.date, data.settings.startDate);
    if (loc.week >= 1 && loc.week <= TOTAL_WEEKS) out[loc.week - 1].value += 1;
  }
  return out;
}

/** กรองเซสชันตามช่วงเวลา: 7 | 30 | 84 | 'all' */
export function filterByRange(sessions, range) {
  if (range === 'all') return sessions;
  const days = Number(range) || 7;
  const from = addDays(todayKey(), -(days - 1));
  return sessions.filter((s) => s.date >= from);
}

/** สรุปภาพรวมสำหรับ Dashboard */
export function overview(data) {
  const today = todayKey();
  const loc = locateDate(today, data.settings.startDate);
  const week = Math.min(Math.max(loc.week, 1), TOTAL_WEEKS);
  const plan = loc.inProgram
    ? getDayPlan(loc.week, loc.dayIndex, data.settings, data.programOverrides)
    : null;

  return {
    today,
    loc,
    plan,
    week,
    notStarted: loc.offsetDays < 0,
    finished: loc.week > TOTAL_WEEKS,
    session: data.sessions[today] || null,
    programPct: programProgress(data),
    completedDays: completedTrainingDays(data),
    totalDays: TOTAL_TRAINING_DAYS,
    streak: currentStreak(data),
    totalSeconds: totalTrainingSeconds(data),
    totalKm: totalDistanceKm(data),
    successRate: successRate(data),
    weeksLeft: Math.max(0, TOTAL_WEEKS - week),
  };
}

export { EXERCISES, fromKey };
