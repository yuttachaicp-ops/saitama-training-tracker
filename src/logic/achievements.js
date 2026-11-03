/**
 * achievements.js — ระบบความสำเร็จ
 * ปลดล็อกจากข้อมูลจริงเท่านั้น และตรวจสอบใหม่ทุกครั้งที่บันทึกการฝึก
 */

import {
  completedTrainingDays,
  currentStreak,
  totalDistanceKm,
  runSessions,
  personalBests,
  weeklyCompletion,
} from './progress.js';
import { TOTAL_WEEKS } from '../data/program.js';

export const ACHIEVEMENTS = [
  {
    id: 'first_workout',
    name: 'ก้าวแรก',
    desc: 'ฝึกสำเร็จเป็นครั้งแรก',
    icon: 'play',
    test: (d) => completedTrainingDays(d) >= 1,
  },
  {
    id: 'streak_3',
    name: 'ต่อเนื่อง 3 วัน',
    desc: 'ฝึกต่อเนื่องครบ 3 วัน',
    icon: 'flame',
    test: (d) => currentStreak(d) >= 3,
  },
  {
    id: 'streak_7',
    name: 'ต่อเนื่อง 7 วัน',
    desc: 'ฝึกต่อเนื่องครบ 7 วัน',
    icon: 'flame',
    test: (d) => currentStreak(d) >= 7,
  },
  {
    id: 'first_run',
    name: 'วิ่งครั้งแรก',
    desc: 'บันทึกการวิ่งเป็นครั้งแรก',
    icon: 'run',
    test: (d) => runSessions(d).length >= 1,
  },
  {
    id: 'club_5k',
    name: '5 KM Club',
    desc: 'วิ่งสะสมครบ 5 กิโลเมตร',
    icon: 'road',
    test: (d) => totalDistanceKm(d) >= 5,
  },
  {
    id: 'club_10k',
    name: '10 KM Club',
    desc: 'วิ่งสะสมครบ 10 กิโลเมตร',
    icon: 'road',
    test: (d) => totalDistanceKm(d) >= 10,
  },
  {
    id: 'club_25k',
    name: '25 KM Club',
    desc: 'วิ่งสะสมครบ 25 กิโลเมตร',
    icon: 'road',
    test: (d) => totalDistanceKm(d) >= 25,
  },
  {
    id: 'pushup_15',
    name: 'วิดพื้น 15 ครั้ง',
    desc: 'ทำวิดพื้นได้ 15 ครั้งในหนึ่งเซต',
    icon: 'dumbbell',
    test: (d) => (personalBests(d).pushup?.value || 0) >= 15,
  },
  {
    id: 'pushup_25',
    name: 'วิดพื้น 25 ครั้ง',
    desc: 'ทำวิดพื้นได้ 25 ครั้งในหนึ่งเซต',
    icon: 'dumbbell',
    test: (d) => (personalBests(d).pushup?.value || 0) >= 25,
  },
  {
    id: 'plank_60',
    name: 'แพลงก์ 1 นาที',
    desc: 'ค้างแพลงก์ได้ 60 วินาที',
    icon: 'clock',
    test: (d) => (personalBests(d).plank?.value || 0) >= 60,
  },
  {
    id: 'week_complete',
    name: 'ครบหนึ่งสัปดาห์',
    desc: 'ฝึกครบทั้ง 6 วันในสัปดาห์เดียว',
    icon: 'calendar',
    test: (d) => weeklyCompletion(d).some((w) => w.value >= 6),
  },
  {
    id: 'half_way',
    name: 'ครึ่งทาง',
    desc: 'ฝึกสำเร็จครบ 36 วัน',
    icon: 'target',
    test: (d) => completedTrainingDays(d) >= 36,
  },
  {
    id: 'program_complete',
    name: 'จบโปรแกรม 12 สัปดาห์',
    desc: `ฝึกสำเร็จครบ ${TOTAL_WEEKS * 6} วัน`,
    icon: 'trophy',
    test: (d) => completedTrainingDays(d) >= TOTAL_WEEKS * 6,
  },
];

/**
 * ตรวจและปลดล็อก — คืนลิสต์ achievement ที่เพิ่งปลดล็อกในรอบนี้
 * @param {object} data ข้อมูลแอป (จะถูกแก้ไข d.achievements โดยตรง)
 */
export function evaluate(data) {
  const unlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (data.achievements[a.id]) continue;
    let ok = false;
    try {
      ok = a.test(data);
    } catch (err) {
      console.error('[achievements] test error', a.id, err);
    }
    if (ok) {
      data.achievements[a.id] = new Date().toISOString();
      unlocked.push(a);
    }
  }
  return unlocked;
}

export function unlockedCount(data) {
  return Object.keys(data.achievements || {}).length;
}
