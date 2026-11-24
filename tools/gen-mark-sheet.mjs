// Public brand-mark figure: the shipped default glyph on the sunset plate, at the
// sizes the shell actually uses, on both palettes.
// Run: node tools/gen-mark-sheet.mjs && node tools/shot.mjs mockups/mark-sheet.html mockups/05-mark.png 1600 380 2
import { writeFileSync } from 'node:fs';
import { palettes } from '../palette.mjs';

const d = palettes.dark;
const l = palettes.light;
const PLATE = 'linear-gradient(160deg,#FF2E8F 0%,#FF5F55 52%,#FFA24A 100%)';

const marks = (sizes) =>
  sizes
    .map(
      (edge) =>
        `<span class="mk" style="--e:${edge}px;--r:${Math.round(edge * 0.3)}px"><img src="logo-default.png" alt=""></span>`,
    )
    .join('');

const pane = (bg, fg, dim, line, title, sub) => `
  <section class="pane" style="background:${bg};color:${fg};--line:${line};--dim:${dim}">
    <div class="head"><span class="t">${title}</span><span class="s">${sub}</span></div>
    <div class="row">${marks([96, 64, 34, 24])}</div>
  </section>`;

const html = `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<title>brand mark</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; width: 1600px; height: 380px; overflow: hidden; background: ${d['--dsw-alias-bg-base']};
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif; -webkit-font-smoothing: antialiased;
    display: flex; flex-direction: column; gap: 13px; padding: 22px 32px; }
  .pane { border-radius: 16px; padding: 16px 22px 18px; flex: 1; display: flex; flex-direction: column; gap: 14px;
    box-shadow: inset 0 0 0 1px var(--line); }
  .head { display: flex; align-items: baseline; gap: 10px; }
  .t { font-size: 11.5px; font-weight: 500; letter-spacing: .14em; }
  .s { font-size: 12.5px; opacity: .62; }
  .row { display: flex; align-items: flex-end; gap: 22px; }
  .mk { position: relative; display: inline-block; width: var(--e); height: var(--e); border-radius: var(--r);
    background: ${PLATE}; box-shadow: inset 0 0 0 .5px rgba(255,255,255,.3); overflow: hidden; flex: none; }
  .mk img { position: absolute; left: 4%; bottom: 8%; width: 92%; height: 84%; object-fit: contain; display: block; }
</style>
${pane(d['--dsw-alias-bg-base'], d['--dsw-alias-label-primary'], d['--dsw-alias-label-caption'], d['--dsw-alias-border-l2'], '夜驾 NIGHT DRIVE', '默认标识：落日盘 + 海平线，站在同一块日落底板上')}
${pane(l['--dsw-alias-bg-base'], l['--dsw-alias-label-primary'], l['--dsw-alias-label-caption'], l['--dsw-alias-border-l2'], '明信片 POSTCARD', '想换成自己的头像：见 README 的「换成你的标识」一节')}
</html>`;

writeFileSync(new URL('../mockups/mark-sheet.html', import.meta.url).pathname, html);
console.log('mockups/mark-sheet.html');
