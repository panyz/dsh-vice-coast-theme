// Re-render every effect image from source. `node tools/render-all.mjs`
import { execFileSync } from 'node:child_process';

const shots = [
  ['mockups/app.html?theme=dark', 'mockups/01-night.png', '1600', '1000'],
  ['mockups/app.html?theme=light', 'mockups/02-postcard.png', '1600', '1000'],
  // the stock reference is an input for the before/after strip, not a deliverable
  ['mockups/app.html?theme=stock-dark', 'mockups/_stock.png', '1600', '1000'],
  ['mockups/comparison.html', 'mockups/04-before-after.png', '1600', '620'],
];

execFileSync('node', ['tools/gen-css.mjs'], { stdio: 'inherit' });
for (const [src, out, w, h] of shots) {
  execFileSync('node', ['tools/shot.mjs', src, out, w, h, '2'], { stdio: 'pipe' });
  console.log(`${out}  (${w}x${h} @2x)`);
}
console.log('done — 03-spec-sheet.png is rendered by its own page: see tools/spec-contrast.mjs');
