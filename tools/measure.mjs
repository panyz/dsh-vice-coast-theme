// Measure the mockup's block geometry by letting Chrome run a tiny script and
// dumping the resulting document title: node tools/measure.mjs <file.html>
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const html = resolve(process.argv[2] ?? 'mockups/app.html');
const probe = html.replace(/\.html$/, '.measure.html');

const script = `
<script>
addEventListener('load', () => {
  const sel = ${JSON.stringify(process.argv.slice(3))}.length ? ${JSON.stringify(process.argv.slice(3))} : ['.titlebar', '.thread', '.thread-inner', '.composer-wrap', '.composer', '.plan', '.card', '.row:last-of-type'];
  const out = {};
  for (const s of sel) {
    const el = document.querySelector(s);
    if (!el) { out[s] = null; continue; }
    const r = el.getBoundingClientRect();
    out[s] = { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
  }
  out.__doc = { scrollH: document.documentElement.scrollHeight, clientH: document.documentElement.clientHeight };
  document.title = JSON.stringify(out);
});
<\/script>`;

const raw = readFileSync(html, 'utf8');
const src = raw.includes('</body>') ? raw.replace('</body>', script + '</body>') : raw.replace('</html>', script + '</html>');
writeFileSync(probe, src);

const dom = execFileSync(
  CHROME,
  [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--user-data-dir=${resolve('..', '.tmp', 'chrome-profile-shot')}`,
    '--window-size=1600,1000', '--virtual-time-budget=2500', '--dump-dom', `file://${probe}`,
  ],
  { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024, timeout: 60_000 },
);
const title = dom.match(/<title>([^<]*)<\/title>/)?.[1] ?? '{}';
const data = JSON.parse(title.replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
for (const [k, v] of Object.entries(data)) console.log(k.padEnd(20), JSON.stringify(v));
