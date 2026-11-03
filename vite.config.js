import { defineConfig } from 'vite';

export default defineConfig({
  // ใช้ path แบบ relative เพื่อให้เปิดไฟล์ build ได้ทั้งบนเว็บเซิร์ฟเวอร์และ GitHub Pages
  base: './',
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    target: 'es2019',
  },
});
