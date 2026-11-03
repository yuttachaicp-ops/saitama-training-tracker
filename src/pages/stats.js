/** stats.js — หน้าสถิติและกราฟ (ข้อมูลทั้งหมดมาจากการฝึกจริงที่บันทึกไว้) */

import { icon } from '../components/icons.js';
import { stat, segmented, pills, emptyState, note } from '../components/ui.js';
import { lineChart, barChart } from '../components/chart.js';
import { fmtDurationTh, fmtPace, fmtThai, todayKey, addDays } from '../core/dates.js';
import {
  currentStreak,
  bestStreak,
  successRate,
  exerciseSeries,
  weeklyDistance,
  weeklyCompletion,
  personalBests,
  runningStats,
  secondsOf,
  distanceOf,
  filterByRange,
} from '../logic/progress.js';
import { EXERCISES, unitLabel, UNIT } from '../data/exercises.js';
import { TOTAL_WEEKS } from '../data/program.js';
import { navigate } from '../core/router.js';

const RANGES = [
  { value: '7', label: '7 วัน' },
  { value: '30', label: '30 วัน' },
  { value: '84', label: '12 สัปดาห์' },
  { value: 'all', label: 'ทั้งหมด' },
];

const TRACKED = ['pushup', 'squat', 'plank', 'reverse_lunge'];

export function header() {
  return { title: 'สถิติ', subtitle: 'ความก้าวหน้าจากข้อมูลจริง', back: '/' };
}

export function view(params, data) {
  const range = params.range || '30';
  const exId = params.ex && EXERCISES[params.ex] ? params.ex : 'pushup';

  const all = Object.values(data.sessions).filter((s) => s.status === 'completed');
  const inRange = filterByRange(all, range);
  const trainingDays = inRange.filter((s) => s.type !== 'rest');

  const totalSec = inRange.reduce((a, s) => a + secondsOf(s), 0);
  const totalKm = inRange.reduce((a, s) => a + distanceOf(s), 0);

  const series = filterByRange(exerciseSeries(data, exId), range).map((p) => ({
    label: fmtThai(p.date, false),
    value: p.value,
  }));

  const wkDist = weeklyDistance(data);
  const wkDone = weeklyCompletion(data);
  const hasRun = wkDist.some((w) => w.value > 0);
  const hasAnyWeek = wkDone.some((w) => w.value > 0);

  // ระยะทางสะสม
  let acc = 0;
  const cumulative = wkDist.map((w) => {
    acc += w.value;
    return { label: `W${w.week}`, value: Number(acc.toFixed(2)) };
  });

  const pb = personalBests(data);
  const rs = runningStats(data);

  if (all.length === 0) {
    return `<div class="page">
      ${segmented(RANGES, range, 'data-range')}
      <div class="card mt-14">
        ${emptyState(
          'ยังไม่มีข้อมูลสถิติ',
          'เมื่อคุณบันทึกการฝึกครั้งแรก กราฟและตัวเลขทั้งหมดจะถูกคำนวณจากข้อมูลจริงของคุณ',
          'chart',
          '<button class="btn btn-primary" data-nav="/workout">เริ่มฝึกวันนี้</button>'
        )}
      </div>
    </div>`;
  }

  return `<div class="page">
    ${segmented(RANGES, range, 'data-range')}

    <div class="section-title">ภาพรวมการฝึก</div>
    <div class="grid g2">
      ${stat('calendar', 'วันที่ออกกำลังกาย', trainingDays.length, 'วัน')}
      ${stat('target', 'อัตราการฝึกสำเร็จ', Math.round(successRate(data) * 100), '%')}
      ${stat('clock', 'เวลาฝึกสะสม', fmtDurationTh(totalSec), '')}
      ${stat('flame', 'ฝึกต่อเนื่องขณะนี้', currentStreak(data), 'วัน')}
      ${stat('trophy', 'สตรีคดีที่สุด', bestStreak(data), 'วัน')}
      ${stat('road', 'ระยะทางวิ่ง', totalKm.toFixed(1), 'กม.')}
    </div>

    <div class="section-title">ความสำเร็จรายสัปดาห์</div>
    <div class="card">
      ${
        hasAnyWeek
          ? `${barChart(
              wkDone.map((w) => ({ label: `W${w.week}`, value: w.value })),
              { color: 'var(--success)' }
            )}
            <div class="legend"><span><i style="background:var(--success)"></i>จำนวนวันที่ฝึกสำเร็จ (เต็ม 6 วัน/สัปดาห์)</span></div>`
          : emptyState('ยังไม่มีสัปดาห์ที่บันทึก', 'บันทึกการฝึกเพื่อดูกราฟรายสัปดาห์', 'calendar')
      }
    </div>

    <div class="section-title">พัฒนาการความแข็งแรง</div>
    ${pills(
      TRACKED.map((id) => ({ value: id, label: EXERCISES[id].name })),
      exId,
      'data-ex'
    )}
    <div class="card mt-14">
      ${
        series.length
          ? `${lineChart(series, { color: 'var(--primary)' })}
             <div class="legend">
               <span><i style="background:var(--primary)"></i>${EXERCISES[exId].name} — จำนวนที่ดีที่สุดในหนึ่งเซต (${unitLabel(
                 EXERCISES[exId]
               )})</span>
             </div>
             ${
               pb[exId]
                 ? `<div class="row-between card-flat mt-14" style="padding:11px;border-radius:12px">
                      <span class="small muted">สถิติดีที่สุด</span>
                      <b>${pb[exId].value} ${unitLabel(EXERCISES[exId])} · ${fmtThai(pb[exId].date)}</b>
                    </div>`
                 : ''
             }`
          : emptyState(
              'ยังไม่มีข้อมูลของท่านี้',
              'บันทึกจำนวนครั้งที่ทำได้ในหน้าฝึกประจำวัน แล้วกราฟจะขึ้นที่นี่',
              'dumbbell'
            )
      }
    </div>

    <div class="section-title">การวิ่ง</div>
    ${
      hasRun
        ? `<div class="grid g2">
             ${stat('road', 'ระยะทางสะสมทั้งหมด', rs.totalKm.toFixed(1), 'กม.')}
             ${stat('clock', 'เวลาวิ่งสะสม', fmtDurationTh(rs.totalSec), '')}
             ${stat('target', 'Pace เฉลี่ย', fmtPace(rs.avgPaceSec), '/กม.')}
             ${stat('trophy', 'ระยะไกลสุด', rs.bestKm.toFixed(1), 'กม.')}
           </div>
           <div class="card mt-14">
             <div class="card-head">${icon('chart')} ระยะทางรายสัปดาห์ (กม.)</div>
             ${barChart(wkDist.map((w) => ({ label: `W${w.week}`, value: Number(w.value.toFixed(2)) })), {
               color: 'var(--info)',
             })}
           </div>
           <div class="card mt-14">
             <div class="card-head">${icon('road')} ระยะทางสะสม (กม.)</div>
             ${lineChart(cumulative, { color: 'var(--success)' })}
           </div>`
        : `<div class="card">${emptyState(
            'ยังไม่มีข้อมูลการวิ่ง',
            'บันทึกการวิ่งครั้งแรกเพื่อเริ่มเก็บสถิติระยะทางและ pace',
            'run',
            '<button class="btn btn-primary" data-nav="/running">บันทึกการวิ่ง</button>'
          )}</div>`
    }

    <div class="section-title">สถิติส่วนตัวที่ดีที่สุด</div>
    <div class="card">
      ${
        Object.keys(pb).length
          ? Object.values(pb)
              .sort((a, b) => b.value - a.value)
              .map(
                (p) => `<div class="row-between" style="padding:9px 0;border-bottom:1px solid var(--line)">
                  <span class="small">${p.name}</span>
                  <span><b>${p.value}</b> <span class="tiny muted">${
                    p.unit === UNIT.SECONDS ? 'วินาที' : p.unit === UNIT.REPS_SIDE ? 'ครั้ง/ข้าง' : 'ครั้ง'
                  } · ${fmtThai(p.date)}</span></span>
                </div>`
              )
              .join('')
          : emptyState('ยังไม่มีสถิติส่วนตัว', 'บันทึกจำนวนครั้งที่ทำได้เพื่อเริ่มเก็บสถิติ', 'trophy')
      }
    </div>

    <div class="mt-20">
      ${note(
        `กราฟทั้งหมดคำนวณจากเซสชันที่บันทึกไว้จริงเท่านั้น ไม่มีข้อมูลตัวอย่าง โปรแกรมทั้งหมดมี ${TOTAL_WEEKS} สัปดาห์`
      )}
    </div>
  </div>`;
}

export function mount(root, params) {
  const range = params.range || '30';
  const exId = params.ex || 'pushup';

  root.querySelectorAll('[data-range]').forEach((btn) => {
    btn.addEventListener('click', () =>
      navigate('/stats', { range: btn.dataset.range, ex: exId })
    );
  });
  root.querySelectorAll('[data-ex]').forEach((btn) => {
    btn.addEventListener('click', () => navigate('/stats', { range, ex: btn.dataset.ex }));
  });
}

export { addDays, todayKey };
