// Render a local HTML file to PNG with headless Chrome.
// usage: node tools/shot.mjs <file.html> <out.png> [width] [height] [scale]
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { statSync } from 'node:fs';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [, , html, out, w = '1600', h = '1000', scale = '2', ...flags] = process.argv;
const transparent = flags.includes('--transparent');
if (!html || !out) {
  console.error('usage: node tools/shot.mjs <file.html> <out.png> [w] [h] [scale]');
  process.exit(2);
}
const [file, query] = html.split('?');
const abs = resolve(file);
statSync(abs);

const r = spawnSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    ...(transparent ? ['--default-background-color=00000000'] : []),
    '--allow-file-access-from-files',
    '--no-first-run',
    `--user-data-dir=${resolve('..', '.tmp', 'chrome-profile-shot')}`,
    '--no-sandbox',
    '--no-default-browser-check',
    '--font-render-hinting=none',
    `--force-device-scale-factor=${scale}`,
    `--window-size=${w},${h}`,
    '--virtual-time-budget=2500',
    `--screenshot=${resolve(out)}`,
    `file://${abs}${query ? '?' + query : ''}`,
  ],
  { stdio: ['ignore', 'ignore', 'pipe'], timeout: 60_000 },
);
const err = r.stderr?.toString() ?? '';
if (err && !/DevTools|Fontconfig|GPU|WritePngToFile/.test(err)) process.stderr.write(err);
statSync(resolve(out));
console.log(`${out}  ${w}x${h} @${scale}x`);
