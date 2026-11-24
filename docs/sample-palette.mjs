// Sample dominant colours from official GTA VI reference art via ffmpeg raw RGB.
// usage: node sample-palette.mjs <image> [k]
import { execFileSync } from 'node:child_process';

const img = process.argv[2];
const K = Number(process.argv[3] ?? 10);
const W = 320;

const raw = execFileSync(
  'ffmpeg',
  ['-v', 'error', '-i', img, '-vf', `scale=${W}:-1:flags=area`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
  { maxBuffer: 200 * 1024 * 1024 },
);

const n = raw.length / 3;
const px = [];
for (let i = 0; i < n; i++) px.push([raw[i * 3], raw[i * 3 + 1], raw[i * 3 + 2]]);

// k-means++ seeded deterministic
let seed = 2026;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
let cents = [[0, 0, 0]];
for (let i = 1; i < K; i++) cents.push(px[Math.floor(rnd() * px.length)].slice());

const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

for (let iter = 0; iter < 24; iter++) {
  const sum = Array.from({ length: K }, () => [0, 0, 0, 0]);
  for (const p of px) {
    let best = 0;
    let bd = Infinity;
    for (let c = 0; c < K; c++) {
      const d = dist2(p, cents[c]);
      if (d < bd) { bd = d; best = c; }
    }
    sum[best][0] += p[0]; sum[best][1] += p[1]; sum[best][2] += p[2]; sum[best][3] += 1;
  }
  cents = sum.map((s, i) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : cents[i]));
}

const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const lab = (c) => {
  const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const [r, g, b] = c.map(f);
  const X = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const Y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const Z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const g2 = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = g2(X), fy = g2(Y), fz = g2(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

const counts = new Array(K).fill(0);
for (const p of px) {
  let best = 0, bd = Infinity;
  for (let c = 0; c < K; c++) { const d = dist2(p, cents[c]); if (d < bd) { bd = d; best = c; } }
  counts[best]++;
}
const rows = cents.map((c, i) => ({ hex: hex(c), share: (counts[i] / px.length) * 100, rgb: c.map(Math.round), lab: lab(c).map((v) => Math.round(v)) }));
rows.sort((a, b) => b.share - a.share);
console.log(`# ${img}  (${px.length} px sampled, k=${K})`);
for (const r of rows) console.log(`${r.hex}  ${r.share.toFixed(1).padStart(5)}%  L*${String(r.lab[0]).padStart(3)}  a*${String(r.lab[1]).padStart(4)}  b*${String(r.lab[2]).padStart(4)}`);

if (process.env.SAMPLES) {
  // targeted probes: [xPct, yPct, label]
  const { width, height } = { width: W, height: Math.round((raw.length / 3) / W) };
  console.log(`\n# targeted probes on ${width}x${height}`);
  for (const probe of JSON.parse(process.env.SAMPLES)) {
    const [xp, yp, label] = probe;
    const x = Math.min(width - 1, Math.round((xp / 100) * width));
    const y = Math.min(height - 1, Math.round((yp / 100) * height));
    const c = px[y * width + x];
    console.log(`${label.padEnd(22)} ${hex(c)}`);
  }
}
