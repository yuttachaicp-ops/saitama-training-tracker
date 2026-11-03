/**
 * chart.js — กราฟ SVG ขนาดเล็กที่เขียนเอง (ไม่พึ่ง library ภายนอก)
 * รองรับกราฟเส้นและกราฟแท่ง ปรับขนาดตามความกว้างของการ์ด
 */

const W = 360;
const H = 132;
const PAD = { l: 30, r: 8, t: 12, b: 22 };

function niceMax(v) {
  if (v <= 0) return 10;
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const n = v / base;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * base;
}

function fmtNum(v) {
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k';
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function axisAndGrid(max, ticks = 3) {
  const innerH = H - PAD.t - PAD.b;
  let out = '';
  for (let i = 0; i <= ticks; i++) {
    const val = (max / ticks) * i;
    const y = PAD.t + innerH - (innerH * i) / ticks;
    out += `<line class="grid-line" x1="${PAD.l}" y1="${y.toFixed(1)}" x2="${W - PAD.r}" y2="${y.toFixed(1)}"/>`;
    out += `<text class="axis-text" x="${PAD.l - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end">${fmtNum(val)}</text>`;
  }
  return out;
}

function xLabels(points) {
  if (!points.length) return '';
  const innerW = W - PAD.l - PAD.r;
  const idxs =
    points.length <= 3
      ? points.map((_, i) => i)
      : [0, Math.floor((points.length - 1) / 2), points.length - 1];
  return idxs
    .map((i) => {
      const x = points.length === 1 ? PAD.l + innerW / 2 : PAD.l + (innerW * i) / (points.length - 1);
      const anchor = i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle';
      return `<text class="axis-text" x="${x.toFixed(1)}" y="${H - 6}" text-anchor="${anchor}">${points[i].label ?? ''}</text>`;
    })
    .join('');
}

/**
 * กราฟเส้น
 * @param {{label:string,value:number}[]} points
 */
export function lineChart(points, { color = 'var(--primary)', fill = true } = {}) {
  if (!points || points.length === 0) return '';
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const max = niceMax(Math.max(...points.map((p) => p.value), 1));

  const xy = points.map((p, i) => {
    const x = points.length === 1 ? PAD.l + innerW / 2 : PAD.l + (innerW * i) / (points.length - 1);
    const y = PAD.t + innerH - (innerH * Math.min(p.value, max)) / max;
    return [x, y];
  });

  const d = xy.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = fill
    ? `<path d="${d} L${xy[xy.length - 1][0].toFixed(1)},${(PAD.t + innerH).toFixed(1)} L${xy[0][0].toFixed(1)},${(PAD.t + innerH).toFixed(1)} Z" fill="${color}" opacity="0.12"/>`
    : '';

  const dots = xy
    .map(([x, y]) => `<circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${color}"/>`)
    .join('');

  return `<svg class="chart" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img">
    ${axisAndGrid(max)}
    ${area}
    <path class="ln" d="${d}" stroke="${color}"/>
    ${dots}
    ${xLabels(points)}
  </svg>`;
}

/**
 * กราฟแท่ง
 * @param {{label:string,value:number}[]} points
 */
export function barChart(points, { color = 'var(--primary)', highlightIndex = -1 } = {}) {
  if (!points || points.length === 0) return '';
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const max = niceMax(Math.max(...points.map((p) => p.value), 1));
  const slot = innerW / points.length;
  const bw = Math.max(3, Math.min(22, slot * 0.6));

  const bars = points
    .map((p, i) => {
      const h = (innerH * Math.min(p.value, max)) / max;
      const x = PAD.l + slot * i + (slot - bw) / 2;
      const y = PAD.t + innerH - h;
      const op = highlightIndex >= 0 && i !== highlightIndex ? 0.42 : 1;
      return `<rect class="bar-rect" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" fill="${color}" opacity="${op}"/>`;
    })
    .join('');

  return `<svg class="chart" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img">
    ${axisAndGrid(max)}
    ${bars}
    ${xLabels(points)}
  </svg>`;
}
