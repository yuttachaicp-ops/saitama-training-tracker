# วิธีติดตั้งและเปิดใช้งาน

## สิ่งที่ต้องมี

- **Node.js 18 ขึ้นไป** (แนะนำ 20 หรือ 22) — ดาวน์โหลดจาก https://nodejs.org
- npm (ติดมากับ Node.js)
- เบราว์เซอร์รุ่นใหม่: Chrome, Edge, Firefox หรือ Safari

ตรวจสอบว่าติดตั้งแล้ว:

```bash
node -v
npm -v
```

---

## บน Windows

### 1. ติดตั้ง Node.js

ดาวน์โหลดตัวติดตั้ง LTS จาก https://nodejs.org แล้วติดตั้งตามปกติ (กด Next จนจบ)
ปิดและเปิด PowerShell ใหม่หลังติดตั้งเสร็จ

### 2. เปิดโฟลเดอร์โปรเจกต์

เปิด **PowerShell** แล้วย้ายเข้าโฟลเดอร์ (แก้ path ให้ตรงกับเครื่องคุณ):

```powershell
cd "$HOME\Projects\saitama-training-tracker"
```

### 3. ติดตั้ง dependency

```powershell
npm install
```

### 4. เปิดใช้งานแบบ development

```powershell
npm run dev
```

จะได้ข้อความประมาณ `Local: http://localhost:5173/` — เปิด URL นั้นในเบราว์เซอร์

ถ้าต้องการเปิดจากมือถือที่อยู่ Wi-Fi เดียวกัน ให้ดูบรรทัด `Network: http://192.168.x.x:5173/` แล้วเปิดบนมือถือ

### 5. สร้างไฟล์สำหรับใช้งานจริง

```powershell
npm run build
npm run preview
```

ไฟล์ทั้งหมดจะอยู่ในโฟลเดอร์ `dist\`

> **หมายเหตุ:** ไฟล์ใน `dist\` ใช้ ES Modules จึงต้องเปิดผ่านเว็บเซิร์ฟเวอร์
> การดับเบิลคลิก `dist\index.html` ตรง ๆ (โปรโตคอล `file://`) จะไม่ทำงาน
> ใช้ `npm run preview` หรือคำสั่งด้านล่างแทน:
>
> ```powershell
> npx serve dist
> ```

---

## บน macOS / Linux

```bash
cd ~/Projects/saitama-training-tracker
npm install
npm run dev
```

---

## นำขึ้นเว็บ

แอปนี้ขึ้น GitHub Pages ไว้แล้วที่
**https://yuttachaicp-ops.github.io/saitama-training-tracker/**

### อัปเดตเว็บหลังแก้โค้ด

```powershell
npm run deploy
```

คำสั่งเดียวจบ — มันจะ `npm run build` แล้ว push โฟลเดอร์ `dist/` ขึ้น branch `gh-pages` ให้
GitHub Pages จะอัปเดตภายใน 1–2 นาที

> ครั้งแรกที่ push git จะถามชื่อผู้ใช้/รหัสผ่าน ให้ใส่ชื่อผู้ใช้ GitHub และใช้ **Personal Access Token** แทนรหัสผ่าน
> ติดตั้ง [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager) ไว้จะจำให้ ไม่ต้องกรอกซ้ำ

### เปลี่ยนไปใช้ GitHub Actions แทน (ไม่บังคับ)

ถ้าอยากให้ build และ deploy เองอัตโนมัติทุกครั้งที่ `git push` ขึ้น `main`

1. เปิด repo บนเว็บ GitHub → **Add file → Create new file**
2. ตั้งชื่อไฟล์เป็น `.github/workflows/deploy.yml`
3. คัดลอกเนื้อหาจาก `docs/github-pages-workflow.yml` ในโปรเจกต์นี้มาวาง แล้ว commit
4. ไป **Settings → Pages → Source** เปลี่ยนเป็น **GitHub Actions**

ต้องสร้างผ่านหน้าเว็บ เพราะการ push ไฟล์ใน `.github/workflows/` ต้องใช้ token ที่มี scope `workflow`

### Netlify / Vercel / Cloudflare Pages

- Build command: `npm run build`
- Publish directory: `dist`

### Netlify / Vercel / Cloudflare Pages

- Build command: `npm run build`
- Publish directory: `dist`

---

## ติดตั้งลงหน้าจอมือถือ

เปิดเว็บแอปในเบราว์เซอร์บนมือถือ แล้วเลือก

- **Android (Chrome):** เมนู ⋮ → "เพิ่มลงในหน้าจอหลัก"
- **iPhone (Safari):** ปุ่มแชร์ → "เพิ่มไปยังหน้าจอโฮม"

จะได้ไอคอนเปิดแบบเต็มจอ ข้อมูลยังเก็บอยู่ในเบราว์เซอร์เครื่องนั้นเหมือนเดิม

---

## สำรองและกู้คืนข้อมูล

ข้อมูลทั้งหมดอยู่ใน `localStorage` ของเบราว์เซอร์ **เครื่องนั้นและ URL นั้น** เท่านั้น
ถ้าเปลี่ยนเครื่อง เปลี่ยนเบราว์เซอร์ หรือล้างข้อมูลเบราว์เซอร์ ข้อมูลจะหาย จึงควรสำรองเป็นระยะ

### สำรอง (Export)

1. เปิดแอป → **ตั้งค่า** → หัวข้อ **จัดการข้อมูล**
2. กด **ส่งออก**
3. จะได้ไฟล์ `training-backup-YYYY-MM-DD.json` ในโฟลเดอร์ดาวน์โหลด
4. เก็บไฟล์นี้ไว้ใน Google Drive, OneDrive หรือที่ปลอดภัยอื่น

### กู้คืน (Import)

1. เปิดแอปบนเครื่อง/เบราว์เซอร์ที่ต้องการ
2. **ตั้งค่า** → **จัดการข้อมูล** → **นำเข้า**
3. เลือกไฟล์ `.json` ที่สำรองไว้
4. ระบบจะบอกว่าไฟล์มีกี่รายการ แล้วให้ยืนยันก่อนแทนที่ข้อมูลเดิม

### ข้อมูลสำรองอัตโนมัติ

ก่อน **รีเซ็ตโปรแกรม**, **ลบข้อมูลทั้งหมด** หรือ **นำเข้าข้อมูล** แอปจะสำรองข้อมูลเดิมไว้ให้หนึ่งชุดโดยอัตโนมัติ
กู้คืนได้ที่ **ตั้งค่า → จัดการข้อมูล → กู้คืนจากข้อมูลสำรอง** (เก็บไว้ชุดล่าสุดชุดเดียว)

---

## ทดสอบระบบอัตโนมัติ

มีสคริปต์ทดสอบที่กดปุ่มจริงทุกหน้าด้วยเบราว์เซอร์จำลอง (ต้องมี Playwright)

```bash
npm run build
npx vite preview --port 4173 &
node scripts/smoke-test.mjs http://localhost:4173 ./screenshots
```

สคริปต์จะรายงานผลทีละข้อ แสดง console error ที่พบ และบันทึกภาพหน้าจอไว้ในโฟลเดอร์ที่ระบุ

---

## ปัญหาที่พบบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| `npm : ไม่รู้จักคำสั่ง` | ยังไม่ได้ติดตั้ง Node.js หรือยังไม่ได้เปิด PowerShell ใหม่หลังติดตั้ง |
| เปิด `dist/index.html` แล้วหน้าขาว | ต้องเปิดผ่านเซิร์ฟเวอร์ ใช้ `npm run preview` หรือ `npx serve dist` |
| ข้อมูลหายหลังปิดเบราว์เซอร์ | เปิดในโหมดส่วนตัว/ไม่ระบุตัวตน หรือเบราว์เซอร์บล็อกการเก็บข้อมูลไว้ แอปจะเตือนเมื่อเกิดกรณีนี้ |
| พอร์ต 5173 ถูกใช้แล้ว | `npm run dev -- --port 5174` |
| ฟอนต์ไทยดูไม่เหมือนในภาพ | เครื่องออฟไลน์จึงโหลดฟอนต์จาก Google Fonts ไม่ได้ แอปจะใช้ฟอนต์ระบบแทนโดยอัตโนมัติ |
