/**
 * deploy-pages.mjs — build แล้วอัปโหลดโฟลเดอร์ dist ขึ้น branch gh-pages
 *
 * ใช้:  npm run deploy
 *
 * ทำงานได้ทั้ง Windows, macOS และ Linux
 * ต้องตั้ง remote `origin` ไว้แล้ว และต้องมีสิทธิ์ push ขึ้น repo นั้น
 */

import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BRANCH = 'gh-pages';
const run = (args, cwd) =>
  execFileSync('git', args, { cwd, stdio: 'inherit', encoding: 'utf8' });
const read = (args, cwd) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

if (!existsSync('dist')) {
  console.error('ไม่พบโฟลเดอร์ dist — รัน `npm run build` ก่อน');
  process.exit(1);
}

let remote;
try {
  remote = read(['remote', 'get-url', 'origin'], process.cwd());
} catch {
  console.error('ยังไม่ได้ตั้ง remote origin — รัน git remote add origin <url> ก่อน');
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'ghpages-'));
console.log(`เตรียมไฟล์ใน ${work}`);

cpSync('dist', work, { recursive: true });
writeFileSync(join(work, '.nojekyll'), ''); // กัน GitHub Pages ประมวลผลด้วย Jekyll

try {
  run(['init', '-q', '-b', BRANCH], work);
  run(['add', '-A'], work);
  run(['commit', '-q', '-m', `Deploy ${new Date().toISOString()}`], work);
  console.log(`กำลัง push ขึ้น ${BRANCH} ...`);
  run(['push', '--force', remote, BRANCH], work);
  console.log('\nสำเร็จ — GitHub Pages จะอัปเดตภายใน 1–2 นาที');
} finally {
  rmSync(work, { recursive: true, force: true });
}
