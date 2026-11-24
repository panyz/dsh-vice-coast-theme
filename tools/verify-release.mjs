// Guard before publishing: no personal artwork, no machine paths, no vendor dumps.
// Run: node tools/verify-release.mjs   (exit 1 = do not push)
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const problems = [];

// 1. the built browser module must carry the default glyph, not a personal mark
const client = readFileSync(root + 'plugin/client.js', 'utf8');
const marker = client.match(/built with logo: ([^\s]+)/)?.[1] ?? '(no marker)';
if (!marker.includes('logo-default')) problems.push(`plugin/client.js was built with ${marker}; run "node tools/build-plugin.mjs" before publishing`);

// 2. nothing machine-specific or secret in tracked files
const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const BAD = [/\/Users\//, /\/var\/folders\//, /gho_[A-Za-z0-9]{20,}/, /sk-[A-Za-z0-9]{20,}/];
for (const file of tracked) {
  let text = '';
  try {
    text = readFileSync(root + file, 'utf8');
  } catch {
    continue; // binary
  }
  for (const bad of BAD) if (bad.test(text)) problems.push(`${file} matches ${bad}`);
}

// 3. no personal / vendor assets in the tracked set
const FORBIDDEN = ['research/', 'assets/logo-cut.png', 'assets/logo-personal.png', 'mockups/logo.png', 'mockups/05-logo.png'];
for (const file of tracked) {
  for (const bad of FORBIDDEN) if (file.startsWith(bad)) problems.push(`${file} must not be published`);
}

// 4. the bundle needs its runtime files
for (const req of ['plugin/package.json', 'plugin/cordis.patch.yml', 'plugin/index.js', 'plugin/client.js', 'plugin/icon.svg', 'plugin/locale/zh.json', 'plugin/locale/en.json']) {
  if (!existsSync(root + req)) problems.push(`missing runtime file ${req}`);
}

if (problems.length > 0) {
  console.error('release check failed:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`release check ok — ${tracked.length} tracked files, logo: ${marker}`);
