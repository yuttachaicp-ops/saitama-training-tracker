/**
 * smoke-test.mjs — ทดสอบการทำงานจริงของแอปด้วยเบราว์เซอร์จำลอง
 *
 * วิธีใช้:
 *   npm run build
 *   npx vite preview --port 4173 &
 *   node scripts/smoke-test.mjs http://localhost:4173
 *
 * สคริปต์จะกดปุ่มจริงทุกขั้นตอน ตรวจว่าข้อมูลถูกบันทึก และรายงาน console error
 */

import { createRequire } from 'node:module';

// playwright อาจถูกติดตั้งไว้นอกโปรเจกต์ จึงหาตำแหน่งแบบยืดหยุ่น
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright/index.js'));
}

const BASE = process.argv[2] || 'http://localhost:4173';
const SHOT_DIR = process.argv[3] || '/tmp/stt-shots';

const results = [];
const errors = [];

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

/** วันจันทร์ของสัปดาห์ปัจจุบัน (ตรงกับค่าเริ่มต้นของแอป) */
function mondayKey() {
  const d = new Date();
  const idx = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - idx);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  const go = async (hash) => {
    await page.goto(`${BASE}/${hash}`, { waitUntil: 'load' });
    await page.waitForTimeout(350);
  };
  const shot = (n) => page.screenshot({ path: `${SHOT_DIR}/${n}.png`, fullPage: true });

  /* 1. Dashboard */
  await go('#/');
  check('โหลดหน้าหลักได้', await page.locator('.hero').isVisible());
  check('มีการ์ดการฝึกวันนี้', await page.locator('.today-card').isVisible());
  await shot('01-dashboard-dark');

  /* 2. สลับธีม */
  await page.click('[data-toggle-theme]');
  await page.waitForTimeout(250);
  check('สลับเป็นโหมดสว่างได้', (await page.getAttribute('html', 'data-theme')) === 'light');
  await shot('02-dashboard-light');
  await page.click('[data-toggle-theme]');
  await page.waitForTimeout(250);

  /* 3. หน้าฝึกกล้ามเนื้อ (วันจันทร์ = Strength A) */
  const mon = mondayKey();
  await go(`#/workout?date=${mon}`);
  check('เปิดหน้าฝึกประจำวันได้', await page.locator('.timer-box').isVisible());

  await page.click('[data-start]');
  await page.waitForTimeout(1400);
  const t1 = await page.locator('[data-timer]').innerText();
  check('ตัวจับเวลาเดิน', t1 !== '00:00', `เวลา = ${t1}`);

  // เช็กท่าแรก -> ต้องมีหน้าจอพักขึ้นมา
  await page.locator('[data-check]').first().click();
  await page.waitForTimeout(400);
  check('หน้าจอจับเวลาพักทำงาน', await page.locator('.rest-overlay').isVisible());
  await page.click('[data-skip]');
  await page.waitForTimeout(250);
  check('ท่าแรกถูกทำเครื่องหมายแล้ว', await page.locator('.ex-row.done').first().isVisible());
  await shot('03-workout');

  // บันทึกจำนวนครั้งจริงของท่าที่สอง
  await page.locator('[data-ex="1"] [data-set]').first().click();
  await page.waitForTimeout(350);
  check('เปิดกล่องบันทึกจำนวนครั้งได้', await page.locator('.modal').isVisible());
  await page.locator('.modal [data-stepper] [data-inc]').first().click();
  await page.click('.modal-actions .btn-primary');
  await page.waitForTimeout(350);
  const chipTxt = await page.locator('[data-ex="1"] .set-chip').first().innerText();
  check('บันทึกจำนวนครั้งลงเซตได้', /\d/.test(chipTxt), chipTxt.replace(/\n/g, ' '));

  // ดูรายละเอียดท่า
  await page.locator('[data-detail]').first().click();
  await page.waitForTimeout(300);
  check('เปิดรายละเอียดท่าได้', await page.locator('.modal-title').isVisible());
  await page.click('.modal-actions .btn');
  await page.waitForTimeout(250);

  // เลือกความรู้สึก + หมายเหตุ
  await page.locator('[data-rpe="2"]').click();
  await page.fill('[data-note]', 'ทดสอบระบบอัตโนมัติ');
  await page.waitForTimeout(150);

  // บันทึกผล (ยังทำไม่ครบ -> ต้องมีกล่องยืนยัน)
  await page.click('[data-finish]');
  await page.waitForTimeout(350);
  check('มีกล่องยืนยันเมื่อทำไม่ครบ', await page.locator('.modal').isVisible());
  await page.click('.modal-actions .btn-primary');
  await page.waitForTimeout(500);
  check('แสดงหน้าสรุปผลหลังบันทึก', await page.locator('.done-badge').isVisible());
  await shot('04-workout-done');

  /* 4. ข้อมูลไม่หายหลังรีเฟรช */
  await go('#/');
  const stored = await page.evaluate(() => {
    const raw = localStorage.getItem('saitama-training-tracker/v1');
    return raw ? Object.keys(JSON.parse(raw).sessions).length : 0;
  });
  check('ข้อมูลถูกบันทึกลง localStorage', stored > 0, `${stored} เซสชัน`);

  /* 5. บันทึกการวิ่ง */
  await go('#/running');
  check('เปิดหน้าบันทึกการวิ่งได้', await page.locator('[data-rsave]').isVisible());
  await page.fill('[data-f="distanceKm"]', '2.8');
  await page.fill('[data-f="durationMin"]', '24');
  await page.waitForTimeout(250);
  const pace = await page.locator('[data-pace]').innerText();
  check('คำนวณ pace ได้', pace.includes('/'), pace);
  await page.locator('[data-rfeel="2"]').click();
  await shot('05-running');
  await page.click('[data-rsave]');
  await page.waitForTimeout(600);
  check('บันทึกการวิ่งแล้วกลับหน้าหลัก', page.url().includes('#/'));

  /* 6. โปรแกรม 12 สัปดาห์ */
  await go('#/program');
  check('เปิดหน้าโปรแกรมได้', (await page.locator('.day-card').count()) === 7);
  await page.click('[data-week="5"]');
  await page.waitForTimeout(350);
  check('เปลี่ยนสัปดาห์ได้', (await page.locator('.topbar-sub').innerText()).includes('สัปดาห์ที่ 5'));
  await page.locator('.day-card').first().click();
  await page.waitForTimeout(350);
  check('เปิดรายละเอียดวันได้', await page.locator('.modal [data-stepper]').first().isVisible());
  await page.locator('.modal [data-stepper] [data-inc]').first().click();
  await page.waitForTimeout(200);
  await page.click('.modal-actions .btn-ghost');
  await page.waitForTimeout(350);
  const ov = await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem('saitama-training-tracker/v1'));
    return Object.keys(raw.programOverrides).length;
  });
  check('ปรับจำนวนครั้งรายสัปดาห์แล้วบันทึกได้', ov > 0, `${ov} รายการ`);
  await shot('06-program');

  /* 7. สถิติ */
  await go('#/stats');
  check('หน้าสถิติมีกราฟจากข้อมูลจริง', (await page.locator('svg.chart').count()) > 0);
  await page.click('[data-ex="squat"]');
  await page.waitForTimeout(350);
  check('สลับท่าในกราฟได้', page.url().includes('ex=squat'));
  await page.click('[data-range="7"]');
  await page.waitForTimeout(350);
  check('เปลี่ยนช่วงเวลาได้', page.url().includes('range=7'));
  await shot('07-stats');

  /* 8. ประวัติ */
  await go('#/history');
  const rows = await page.locator('.hist-row').count();
  check('ประวัติแสดงรายการที่บันทึกไว้', rows >= 2, `${rows} รายการ`);
  await page.locator('[data-type="running"]').click();
  await page.waitForTimeout(400);
  check('กรองตามประเภทได้', (await page.locator('.hist-row').count()) >= 1);
  await page.locator('.hist-row').first().click();
  await page.waitForTimeout(350);
  check('เปิดรายละเอียดประวัติได้', await page.locator('.modal').isVisible());
  await page.click('.modal-actions .btn-ghost');
  await page.waitForTimeout(250);
  await shot('08-history');

  /* 9. ความสำเร็จ */
  await go('#/achievements');
  const unlocked = await page.locator('.ach.unlocked').count();
  check('ปลดล็อกความสำเร็จจากข้อมูลจริง', unlocked > 0, `${unlocked} รายการ`);
  await shot('09-achievements');

  /* 10. ตั้งค่า */
  await go('#/settings');
  await page.fill('[data-p="name"]', 'Tanny');
  await page.click('[data-save-profile]');
  await page.waitForTimeout(400);
  const name = await page.evaluate(
    () => JSON.parse(localStorage.getItem('saitama-training-tracker/v1')).profile.name
  );
  check('บันทึกโปรไฟล์ได้', name === 'Tanny');

  await page.selectOption('[data-s="difficulty"]', 'easy');
  await page.click('[data-save-settings]');
  await page.waitForTimeout(400);
  const diff = await page.evaluate(
    () => JSON.parse(localStorage.getItem('saitama-training-tracker/v1')).settings.difficulty
  );
  check('บันทึกการตั้งค่าการฝึกได้', diff === 'easy');

  await page.click('[data-theme="light"]');
  await page.waitForTimeout(300);
  check('เลือกธีมในหน้าตั้งค่าได้', (await page.getAttribute('html', 'data-theme')) === 'light');
  await shot('10-settings-light');
  await page.click('[data-theme="dark"]');
  await page.waitForTimeout(250);

  /* 11. คำแนะนำ */
  await go('#/guide');
  check('เปิดหน้าคำแนะนำได้', (await page.locator('[data-ex]').count()) > 5);
  await shot('11-guide');

  /* 12. ตรวจว่าไม่มีปุ่มที่ไม่มีการทำงาน */
  const deadButtons = await page.evaluate(() => {
    const names = [];
    document.querySelectorAll('#view button, .sidebar button, .bottom-nav button').forEach((b) => {
      const hasData = [...b.attributes].some((a) => a.name.startsWith('data-'));
      if (!hasData && !b.className.includes('link')) names.push(b.outerHTML.slice(0, 60));
    });
    return names;
  });
  check('ไม่มีปุ่มที่ไม่ผูกการทำงาน', deadButtons.length === 0, deadButtons.join(' | '));

  /* 13. มือถือ */
  await ctx.addInitScript(() => {});
  await page.setViewportSize({ width: 390, height: 844 });
  await go('#/');
  check('มี bottom navigation บนมือถือ', await page.locator('.bottom-nav').isVisible());
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2
  );
  check('ไม่มีการล้นแนวนอนบนมือถือ', !overflow);
  await shot('12-mobile-dashboard');
  await go('#/stats');
  await shot('13-mobile-stats');

  await browser.close();

  console.log('\n--- console errors ---');
  if (errors.length === 0) console.log('ไม่มี');
  else errors.forEach((e) => console.log('ERR:', e));

  const failed = results.filter((r) => !r.ok);
  console.log(`\nสรุป: ผ่าน ${results.length - failed.length}/${results.length}`);
  if (failed.length || errors.length) process.exitCode = 1;
};

run().catch((e) => {
  console.error('ทดสอบล้มเหลว:', e);
  process.exit(1);
});
