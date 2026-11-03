/**
 * program.js — ตัวสร้างโปรแกรมฝึก 12 สัปดาห์
 *
 * หลักการ:
 * - 6 วันฝึก + 1 วันพัก (อาทิตย์)
 * - Progressive Overload ตามตารางสัปดาห์
 * - สัปดาห์ที่ 4 และ 8 เป็น Deload (ลดความหนักเพื่อให้ร่างกายฟื้นตัว)
 * - ผู้ใช้ปรับจำนวนครั้ง/เซตรายสัปดาห์ได้ (programOverrides) และค่าที่ปรับจะชนะเสมอ
 */

import { EXERCISES, UNIT } from './exercises.js';
import { DIFFICULTY_FACTOR } from '../core/defaults.js';
import { daysBetween, programDayIndex } from '../core/dates.js';

export const TOTAL_WEEKS = 12;
export const TRAINING_DAYS_PER_WEEK = 6;

/** ตารางหลัก: จำนวนครั้งของท่าอ้างอิง และจำนวนเซตของสัปดาห์นั้น */
const WEEK_TABLE = {
  1: { pushup: [6, 6], squat: [10, 10], sets: 2, focus: 'สร้างพื้นฐานให้แข็งแรง' },
  2: { pushup: [8, 8], squat: [12, 12], sets: 2, focus: 'เพิ่มปริมาณอย่างค่อยเป็นค่อยไป' },
  3: { pushup: [8, 10], squat: [15, 15], sets: 2, focus: 'คุ้นเคยกับฟอร์มที่ถูกต้อง' },
  4: { pushup: [8, 8], squat: [12, 12], sets: 2, deload: true, focus: 'สัปดาห์ฟื้นตัว ลดความหนัก' },
  5: { pushup: [8, 10], squat: [15, 15], sets: 3, focus: 'เพิ่มเป็น 3 เซต' },
  6: { pushup: [10, 12], squat: [15, 15], sets: 3, focus: 'เพิ่มความแข็งแรงต่อเนื่อง' },
  7: { pushup: [12, 12], squat: [18, 18], sets: 3, focus: 'ท้าทายขึ้นอีกขั้น' },
  8: { pushup: [10, 10], squat: [15, 15], sets: 2, deload: true, focus: 'สัปดาห์ฟื้นตัว ลดความหนัก' },
  9: { pushup: [12, 12], squat: [20, 20], sets: 3, focus: 'กลับเข้าสู่ปริมาณเต็ม' },
  10: { pushup: [12, 15], squat: [20, 20], sets: 3, focus: 'สะสมความอึด' },
  11: { pushup: [15, 15], squat: [20, 25], sets: 3, focus: 'เข้าใกล้เป้าหมาย' },
  12: { pushup: [15, 20], squat: [25, 25], sets: 3, focus: 'สัปดาห์สุดท้าย เก็บให้ครบ' },
};

/** ช่วงค่าเริ่มต้น -> ปลายทางของท่าอื่น ๆ (สัปดาห์ 1 -> 12) */
const RAMP = {
  glute_bridge: [12, 15],
  calf_raise: [12, 20],
  dead_bug: [8, 12],
  bird_dog: [8, 12],
  reverse_lunge: [6, 10],
  hip_hinge: [10, 15],
  incline_pushup: [8, 20],
  plank: [15, 40], // วินาที
};

/** ตารางการวิ่ง */
const RUN_RAMP = {
  runningA_rounds: [6, 12], // จำนวนรอบ วิ่ง 1 นาที / เดิน 2 นาที
  runningB_minutes: [20, 35], // วิ่งเบา/เดินเร็วต่อเนื่อง
  longRun_km: [2, 6], // ระยะทางเป้าหมาย
};

export function isDeloadWeek(week) {
  return !!WEEK_TABLE[week]?.deload;
}

export function weekFocus(week) {
  return WEEK_TABLE[week]?.focus || '';
}

/** สัปดาห์ deload ใช้ปริมาณเทียบเท่าสองสัปดาห์ก่อนหน้า */
function effectiveWeek(week) {
  return isDeloadWeek(week) ? Math.max(1, week - 2) : week;
}

function ramp(week, [from, to], roundTo = 1) {
  const w = effectiveWeek(week);
  const raw = from + ((to - from) * (w - 1)) / (TOTAL_WEEKS - 1);
  return Math.max(roundTo, Math.round(raw / roundTo) * roundTo);
}

function applyDifficulty(value, difficulty, min = 1) {
  const f = DIFFICULTY_FACTOR[difficulty] ?? 1;
  return Math.max(min, Math.round(value * f));
}

function repsLabel(ex, lo, hi) {
  const unit = ex.unit;
  const text = lo === hi ? `${lo}` : `${lo}–${hi}`;
  if (unit === UNIT.SECONDS) return `${text} วินาที`;
  if (unit === UNIT.REPS_SIDE) return `${text} ครั้ง/ข้าง`;
  return `${text} ครั้ง`;
}

/** สร้างรายการท่าของวันฝึกกล้ามเนื้อหนึ่งวัน */
function buildStrength(week, planKey, exerciseIds, settings, overrides) {
  const table = WEEK_TABLE[week];
  const difficulty = settings?.difficulty || 'standard';
  const baseSets = table.sets;

  return exerciseIds.map((id) => {
    const ex = EXERCISES[id];
    let lo;
    let hi;

    if (id === 'pushup') {
      [lo, hi] = table.pushup;
    } else if (id === 'squat') {
      [lo, hi] = table.squat;
    } else {
      const roundTo = id === 'plank' ? 5 : 1;
      lo = ramp(week, RAMP[id] || [8, 12], roundTo);
      hi = lo;
    }

    lo = applyDifficulty(lo, difficulty, ex.unit === UNIT.SECONDS ? 10 : 1);
    hi = applyDifficulty(hi, difficulty, ex.unit === UNIT.SECONDS ? 10 : 1);

    let reps = lo;
    let sets = baseSets;

    const ov = overrides?.[`${week}:${planKey}:${id}`];
    if (ov) {
      if (Number.isFinite(ov.reps)) {
        reps = ov.reps;
        lo = ov.reps;
        hi = ov.reps;
      }
      if (Number.isFinite(ov.sets)) sets = ov.sets;
    }

    return {
      id,
      name: ex.name,
      icon: ex.icon,
      unit: ex.unit,
      reps,
      repsHigh: hi,
      repsLabel: repsLabel(ex, lo, hi),
      sets,
      customized: !!ov,
    };
  });
}

function buildRun(week, planKey, settings) {
  const difficulty = settings?.difficulty || 'standard';
  const f = DIFFICULTY_FACTOR[difficulty] ?? 1;

  if (planKey === 'RunningA') {
    const rounds = Math.max(3, Math.round(ramp(week, RUN_RAMP.runningA_rounds) * f));
    return {
      mode: 'intervals',
      rounds,
      runMin: 1,
      walkMin: 2,
      estMinutes: rounds * 3 + 8,
      summary: `วิ่ง 1 นาที / เดิน 2 นาที × ${rounds} รอบ`,
      note: 'เน้นสร้างพื้นฐานความอึด ควรยังพูดเป็นประโยคสั้น ๆ ได้ระหว่างวิ่ง',
    };
  }
  if (planKey === 'RunningB') {
    const minutes = Math.max(10, Math.round(ramp(week, RUN_RAMP.runningB_minutes) * f));
    return {
      mode: 'easy',
      minutes,
      estMinutes: minutes + 8,
      summary: `วิ่งเบาหรือเดินเร็วต่อเนื่อง ${minutes} นาที`,
      note: 'เน้นความต่อเนื่อง ไม่ต้องเร่งความเร็ว',
    };
  }
  // LongRun
  const km = Math.max(1, Math.round(ramp(week, RUN_RAMP.longRun_km, 1) * f * 2) / 2);
  return {
    mode: 'long',
    distanceKm: km,
    estMinutes: Math.round(km * 9) + 10,
    summary: `วิ่งหรือเดินระยะยาว ประมาณ ${km} กม.`,
    note: 'สลับวิ่ง-เดินได้ตามสภาพร่างกาย เป้าหมายคือระยะทางและความต่อเนื่อง',
  };
}

const DAY_TEMPLATE = [
  {
    planKey: 'StrengthA',
    type: 'strength',
    title: 'Strength A',
    subtitle: 'ฝึกความแข็งแรง — ทั้งตัว',
    exercises: ['pushup', 'squat', 'glute_bridge', 'dead_bug', 'calf_raise'],
  },
  {
    planKey: 'RunningA',
    type: 'running',
    title: 'Running A',
    subtitle: 'วิ่งสลับเดิน — สร้างพื้นฐาน',
  },
  {
    planKey: 'StrengthB',
    type: 'strength',
    title: 'Strength B',
    subtitle: 'ฝึกความแข็งแรง — แกนกลางและขา',
    exercises: ['incline_pushup', 'reverse_lunge', 'hip_hinge', 'bird_dog', 'plank'],
  },
  {
    planKey: 'RunningB',
    type: 'running',
    title: 'Running B',
    subtitle: 'วิ่งเบา — เน้นความต่อเนื่อง',
  },
  {
    planKey: 'StrengthC',
    type: 'strength',
    title: 'Strength C',
    subtitle: 'ฝึกความแข็งแรง — เก็บรายละเอียด',
    exercises: ['pushup', 'squat', 'reverse_lunge', 'glute_bridge', 'plank'],
  },
  {
    planKey: 'LongRun',
    type: 'running',
    title: 'Long Run / Walk',
    subtitle: 'ระยะยาว — เน้นความอึด',
  },
  {
    planKey: 'Rest',
    type: 'rest',
    title: 'วันพัก',
    subtitle: 'ฟื้นตัว — ยืดเหยียดเบา ๆ ได้',
  },
];

/**
 * แผนของวันหนึ่งในสัปดาห์ที่กำหนด
 * @param {number} week 1..12
 * @param {number} dayIndex 0=จันทร์ ... 6=อาทิตย์
 */
export function getDayPlan(week, dayIndex, settings, overrides) {
  const t = DAY_TEMPLATE[dayIndex];
  if (!t) return null;

  const base = {
    week,
    dayIndex,
    planKey: t.planKey,
    type: t.type,
    title: t.title,
    subtitle: t.subtitle,
    deload: isDeloadWeek(week),
  };

  if (t.type === 'strength') {
    const exercises = buildStrength(week, t.planKey, t.exercises, settings, overrides);
    const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
    const rest = settings?.restSeconds ?? 60;
    const estMinutes = Math.round((totalSets * (45 + rest)) / 60) + 10;
    return { ...base, exercises, estMinutes, restSeconds: rest };
  }

  if (t.type === 'running') {
    const run = buildRun(week, t.planKey, settings);
    return { ...base, run, estMinutes: run.estMinutes };
  }

  return {
    ...base,
    estMinutes: 15,
    restActivities: [
      'เดินเบา ๆ 10–15 นาที',
      'ยืดเหยียดกล้ามเนื้อมัดใหญ่ มัดละ 20–30 วินาที',
      'นอนให้พอ — การฟื้นตัวคือส่วนหนึ่งของการฝึก',
    ],
  };
}

/** แผนทั้งสัปดาห์ (7 วัน) */
export function getWeekPlan(week, settings, overrides) {
  return Array.from({ length: 7 }, (_, i) => getDayPlan(week, i, settings, overrides));
}

/**
 * หาว่าวันที่หนึ่ง ๆ ตรงกับสัปดาห์/วันไหนของโปรแกรม
 * @returns {{week:number, dayIndex:number, inProgram:boolean, offsetDays:number}}
 */
export function locateDate(dateKey, startDate) {
  const offsetDays = daysBetween(startDate, dateKey);
  const week = Math.floor(offsetDays / 7) + 1;
  // วันเริ่มโปรแกรมถูกบังคับให้เป็นวันจันทร์เสมอ (ดู settings) ดัชนีวันจึงอิงจาก offset
  const dayIndex = offsetDays >= 0 ? offsetDays % 7 : programDayIndex(dateKey);
  return {
    week,
    dayIndex,
    offsetDays,
    inProgram: offsetDays >= 0 && week >= 1 && week <= TOTAL_WEEKS,
  };
}

/** คีย์วันที่เริ่มต้นของสัปดาห์ที่กำหนด */
export function weekStartOffset(week) {
  return (week - 1) * 7;
}

export { DAY_TEMPLATE, WEEK_TABLE };
