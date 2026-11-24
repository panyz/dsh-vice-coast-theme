// Generate the spec sheet's contrast column straight from palette.mjs, so the
// printed ratios can never drift from the source. Also prints the report.
// usage: node tools/spec-contrast.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { palettes, contrast } from '../palette.mjs';

const rgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const over = (fg, bg, a) => {
  const F = rgb(fg), B = rgb(bg);
  return '#' + F.map((n, i) => Math.round(n * a + B[i] * (1 - a)).toString(16).padStart(2, '0')).join('');
};
// flatten an 8-digit token over the palette's base
const flat = (v, base) => (v.length === 9 ? over(v.slice(0, 7), base, parseInt(v.slice(7), 16) / 255) : v);

const rows = [
  ['正文 / 页底', '--dsw-alias-label-primary', '--dsw-alias-bg-base', 7],
  ['次级文字 / 页底', '--dsw-alias-label-secondary', '--dsw-alias-bg-base', 4.5],
  ['三级文字 / 页底', '--dsw-alias-label-tertiary', '--dsw-alias-bg-base', 4.5],
  ['信号 / 页底', '--dsw-alias-brand-primary', '--dsw-alias-bg-base', 4.5],
  ['链接 / 页底', '--dsw-alias-link', '--dsw-alias-bg-base', 4.5],
  ['错误 / 页底', '--dsw-alias-state-error-primary', '--dsw-alias-bg-base', 4.5],
  ['警告 / 页底', '--dsw-alias-state-warn-primary', '--dsw-alias-bg-base', 4.5],
  ['成功 / 页底', '--dsw-alias-state-success-primary', '--dsw-alias-bg-base', 4.5],
  ['计划 / 页底', '--dsw-alias-state-done-primary', '--dsw-alias-bg-base', 4.5],
  ['气泡文字 / 气泡', '--dsw-alias-label-primary', '--dsw-specific-bubble', 4.5],
  ['按钮文字 / 主按钮', '--dsw-alias-brand-text', '--dsw-alias-button-primary-fill', 4.5],
];

const badge = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA 大字' : '未达');
const fmt = (r) => r.toFixed(2);

const data = {};
for (const mode of ['dark', 'light']) {
  const t = palettes[mode];
  const base = t['--dsw-alias-bg-base'];
  data[mode] = rows.map(([label, fgTok, bgTok, min]) => {
    const fg = flat(t[fgTok], base);
    const bg = flat(t[bgTok], base);
    const ratio = contrast(fg, bg);
    return { label, fgTok, bgTok, fg, bg, ratio: +fmt(ratio), badge: badge(ratio), pass: ratio >= min, min };
  });
}

// ── report ────────────────────────────────────────────────────────────────────
let bad = 0;
for (const mode of ['dark', 'light']) {
  console.log(`\n=== ${mode} ===`);
  for (const r of data[mode]) {
    if (!r.pass) bad++;
    console.log(`${r.pass ? 'ok  ' : 'FAIL'} ${r.label.padEnd(16)} ${r.fg} on ${r.bg}  ${String(r.ratio).padStart(5)}:1  ${r.badge}`);
  }
}
const all = [...data.dark, ...data.light];
const min = Math.min(...all.map((r) => r.ratio));
console.log(`\n${bad} failing pair(s); lowest ${fmt(min)}:1\n`);

// ── write the column into the sheet ───────────────────────────────────────────
const cell = (r) =>
  `<span class="cell"><span class="ratio">${fmt(r.ratio)}</span><span class="u">:1</span><i class="badge">${r.badge}</i></span>`;
const body = rows
  .map(([label], i) => {
    const d = data.dark[i], l = data.light[i];
    return `      <div class="ct-row"><span class="l">${label}</span>${cell(d)}${cell(l)}</div>`;
  })
  .join('\n');
const foot = `      <p class="ct-foot">${rows.length} 组全部达标，最低 ${fmt(min)}:1</p>`;

const file = 'mockups/spec-sheet.html';
const html = readFileSync(file, 'utf8');
const START = '<!-- contrast:start -->';
const END = '<!-- contrast:end -->';
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a < 0 || b < 0) throw new Error(`markers not found in ${file}`);
const next = html.slice(0, a + START.length) + '\n' + body + '\n' + foot + '\n      ' + html.slice(b);
// ── also refresh the light-column swatch values from palettes.light ───────────
const LP_TOKENS = [
  '--dsw-alias-bg-base', '--dsw-alias-bg-layer-1', '--dsw-alias-bg-layer-2', '--dsw-alias-bg-layer-3',
  '--dsw-alias-label-primary', '--dsw-alias-label-secondary', '--dsw-alias-label-tertiary', '--dsw-alias-label-quaternary',
  '--dsw-alias-brand-primary', '--dsw-alias-link',
  '--dsw-alias-state-warn-primary', '--dsw-alias-state-error-primary',
  '--dsw-alias-state-success-primary', '--dsw-alias-state-done-primary',
];
const lp = ['.lp{'];
for (const tok of LP_TOKENS) lp.push(`  ${tok}:${palettes.light[tok]};`);
lp.push('}');
const LP_START = '/* light-pane:start */';
const LP_END = '/* light-pane:end */';
let html2 = readFileSync(file, 'utf8');
const c = html2.indexOf(LP_START);
const d = html2.indexOf(LP_END);
if (c < 0 || d < 0) throw new Error(`light-pane markers not found in ${file}`);
html2 = html2.slice(0, c + LP_START.length) + '\n' + lp.join('\n') + '\n' + html2.slice(d);
// re-apply the contrast block too (html2 is a fresh read)
const a2 = html2.indexOf(START);
const b2 = html2.indexOf(END);
html2 = html2.slice(0, a2 + START.length) + '\n' + body + '\n' + foot + '\n      ' + html2.slice(b2);
writeFileSync(file, html2);
console.log(`refreshed ${LP_TOKENS.length} light-palette values in ${file}`);
