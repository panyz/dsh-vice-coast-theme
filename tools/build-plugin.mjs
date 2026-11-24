// Generate the shipped browser module from its sources:
//   palette.mjs (colour truth) + design/client.template.js (logic)
//   + plugin/locale/*.json (copy) + brand-avatar/assets/avatar-128.png (the owner's logo)
// Run: node tools/build-plugin.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { palettes } from '../palette.mjs';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(root + p, 'utf8');
const json = (p) => JSON.parse(read(p));

const LOCALES = ['zh', 'en'];
const LANG_NAMES = { zh: 'zh', en: 'en' };

// ── palette ──────────────────────────────────────────────────────────────────
const light = palettes.light;
const dark = palettes.dark;
const shared = Object.keys(light).filter((k) => dark[k] !== undefined);
if (shared.length !== Object.keys(light).length) throw new Error('light/dark token sets differ');
const bad = shared.filter((k) => {
  const v = light[k] + dark[k];
  return v.includes('`') || v.includes('${') || v.includes('\\');
});
if (bad.length > 0) throw new Error(`token values need escaping: ${bad.join(', ')}`);

// ── copy: every locale file's strings except the plugin metadata ─────────────
const copy = {};
for (const lang of LOCALES) {
  const dict = json(`plugin/locale/${LANG_NAMES[lang]}.json`);
  const { meta: _meta, ...strings } = dict;
  copy[lang] = strings;
}

// ── logo: default original glyph, or a personal mark via --logo <png> --------
// The default build ships assets/logo-default.png (original line art). A user who
// wants their own avatar runs assets/matte.sh on it and then:
//   node tools/build-plugin.mjs --logo assets/logo-personal.png
const logoArg = process.argv.indexOf('--logo');
const logoPath = logoArg > -1 ? process.argv[logoArg + 1] : 'assets/logo-default.png';
const cutBytes = readFileSync(root + logoPath);
const isPng = cutBytes.subarray(1, 4).toString() === 'PNG';
const colorType = cutBytes[25];
if (!isPng) throw new Error(`${logoPath} is not a PNG`);
if (colorType !== 6) throw new Error(`${logoPath} must be RGBA (color type 6), got ${colorType}`);
const avatar = cutBytes.toString('base64');

// ── emit ─────────────────────────────────────────────────────────────────────
let out = read('design/client.template.js');
const fill = (marker, value) => {
  if (!out.includes(marker)) throw new Error(`template is missing ${marker}`);
  out = out.replace(marker, value);
};
fill('/* @@PALETTE@@ */', `/** Colour layer, generated from palette.mjs — the single source of truth. */\n    const PALETTE_LIGHT = ${JSON.stringify(light, null, 6).replace(/\n/g, '\n    ')}\n    const PALETTE_DARK = ${JSON.stringify(dark, null, 6).replace(/\n/g, '\n    ')}`);
fill('/* @@COPY@@ */', `/** Settings-row copy, one entry per locale. */\n    const COPY = ${JSON.stringify(copy, null, 6).replace(/\n/g, '\n    ')}`);
out = out.replace('@@AVATAR@@', avatar);

if (out.includes('@@')) throw new Error('unresolved template marker remains');
const logoNote = `/* built with logo: ${logoPath} (${cutBytes.length} B, ${createHash('sha256').update(cutBytes).digest('hex').slice(0, 12)}) */`;
out = out.replace('window.__ModuleLoader__.load({', `${logoNote}\nwindow.__ModuleLoader__.load({`);
writeFileSync(root + 'plugin/client.js', out);
execFileSync('node', ['--check', root + 'plugin/client.js'], { stdio: 'inherit' });
console.log(`plugin/client.js — ${Object.keys(light).length} tokens × 2 schemes, ${LOCALES.length} locales, logo ${logoPath} (${(avatar.length / 1024).toFixed(0)} KiB base64)`);
