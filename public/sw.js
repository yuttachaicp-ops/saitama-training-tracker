/**
 * sw.js — Service Worker สำหรับใช้งานออฟไลน์
 *
 * กลยุทธ์:
 * - หน้าเว็บ (navigation): network-first แล้ว fallback เป็นแคช
 *   เพื่อให้ได้เวอร์ชันใหม่เสมอเมื่อมีเน็ต และยังเปิดได้เมื่อไม่มีเน็ต
 * - ไฟล์ asset ที่มี hash ในชื่อ (js/css): cache-first เพราะชื่อเปลี่ยนทุกครั้งที่ build
 * - ฟอนต์จาก Google Fonts: cache-first เก็บไว้ใช้ตอนออฟไลน์
 *
 * หมายเหตุ: ข้อมูลการฝึกเก็บใน localStorage ไม่เกี่ยวกับแคชนี้
 * การล้างแคชจึงไม่ทำให้ข้อมูลการฝึกหาย
 */

const CACHE = 'saitama-training-tracker-v4';

const CORE = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isFontRequest(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (!sameOrigin && !isFontRequest(url)) return;

  // หน้าเว็บ: เอาของใหม่ก่อน ถ้าไม่มีเน็ตค่อยใช้แคช
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match('./index.html').then((hit) => hit || caches.match('./'))
        )
    );
    return;
  }

  // ไฟล์อื่น ๆ: ใช้แคชก่อน แล้วค่อยอัปเดตเบื้องหลัง
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res && (res.status === 200 || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => hit);
    })
  );
});
