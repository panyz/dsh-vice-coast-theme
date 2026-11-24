// GTA6 · Vice Coast — palette source of truth.
//
// Two palettes anchored on the official Grand Theft Auto VI key art, sampled
// with k-means (see research/sample-palette.mjs):
//   frame violet  #1E032C / #240C30      pastel violet sky #7274AF / #6D6B9E
//   dusty pink    #C67EA9 / #DC8785      sunset peach     #F3BEB1 / #ED9461
//   warm paper    #FAF6F4               pool pale blue   #89A6C0
//
// Everything below is a *derivation* of a small primitive set so both palettes
// stay coherent and the eventual plugin build can validate them mechanically.

export const meta = {
  id: 'vice-coast',
  name: 'GTA6 · Vice Coast',
  nameZh: '罪恶海岸',
  presets: [
    { id: 'night', label: 'Night Drive', labelZh: '夜驾', palette: 'dark' },
    { id: 'postcard', label: 'Postcard', labelZh: '明信片', palette: 'light' },
    { id: 'stock', label: 'Stock', labelZh: '还原', palette: null },
  ],
  // The one memorable gesture: the mark's magenta→orange sweep. It is allowed
  // in exactly three places (thinking shimmer, primary action, active session
  // edge) and nowhere else.
  // display grade — brand mark, sheet, anything decorative
  sunset: {
    dark: 'linear-gradient(100deg, #FF2E8F 0%, #FF5F55 52%, #FFA24A 100%)',
    light: 'linear-gradient(100deg, #D9126F 0%, #E4572E 55%, #E8892A 100%)',
  },
  // button grade — one step deeper so the shell's hardcoded #fff send glyph
  // still clears 3:1 against every stop
  sunsetButton: {
    dark: 'linear-gradient(100deg, #C2146E 0%, #D8391F 55%, #E0691A 100%)',
    light: 'linear-gradient(100deg, #C4106A 0%, #D8401C 55%, #E4572E 100%)',
  },
  // shape is the shell's own (:root literals, not alias tokens) — untouched
  radiiStock: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, panel: 28 },
  motion: {
    ease: 'cubic-bezier(.22,.61,.16,1)',
    duration: 0.2,
    fast: 0.12,
    slow: 0.34,
  },
};

// ── primitives ────────────────────────────────────────────────────────────────
const dark = {
  // violet-tinted value ladder — the key art's frame, not a neutral black
  void: '#0D0116',
  base: '#150420',
  layer1: '#1D082B',
  layer2: '#250F37',
  layer3: '#311546',
  overlay: '#2A113D',
  sidebar: '#120320',

  text1: '#F8F2F7',
  text2: '#CDBAD8',
  text3: '#A38FB4',
  text4: '#7C6991',

  pink: '#FF5CA8',
  pinkDim: '#3A1230',
  pinkDeep: '#B81C63',
  orange: '#FF8A3C',
  aqua: '#58E6D6',
  amber: '#FFB65C',
  crimson: '#FF5E72',
  green: '#45D98A',
  violet: '#B98CFF',
  peach: '#FFD9C6',
  operator: '#380F27',
};

const light = {
  void: '#E7DFEF',
  base: '#FBF7F6',      // warm paper, sampled #FAF6F4
  layer1: '#FFFFFF',
  layer2: '#F4EDF7',
  layer3: '#EBE2F4',
  overlay: '#F7F2F9',
  sidebar: '#F7EFF6',

  text1: '#21102E',
  text2: '#54415E',
  text3: '#736180',
  text4: '#9B8CA6',

  pink: '#D1116E',
  pinkDim: '#FCE3EE',
  pinkDeep: '#9C0B4F',
  orange: '#C24E14',
  aqua: '#087069',
  amber: '#9A5600',
  crimson: '#C1213A',
  green: '#0B7442',
  violet: '#6B3BC2',
  peach: '#8A4A28',
  operator: '#FFE3EF',
};

// ── helpers ───────────────────────────────────────────────────────────────────
const rgb = (hex) => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
const alpha = (hex, a) => {
  const [r, g, b] = rgb(hex);
  const v = Math.round(a * 255).toString(16).padStart(2, '0');
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}${v}`;
};
const mix = (a, b, t) => {
  const A = rgb(a), B = rgb(b);
  return '#' + A.map((n, i) => Math.round(n + (B[i] - n) * t).toString(16).padStart(2, '0')).join('');
};

// ── the token layer ───────────────────────────────────────────────────────────
function build(p, mode) {
  const isDark = mode === 'dark';
  // hairline colour: warm-pink-white in dark (poster frame line), deep violet in light
  const line = isDark ? p.peach : p.text1;

  return {
    // surfaces
    '--dsw-alias-bg-base': p.base,
    '--dsw-alias-bg-layer-1': p.layer1,
    '--dsw-alias-bg-layer-2': p.layer2,
    '--dsw-alias-bg-layer-3': p.layer3,
    '--dsw-alias-bg-overlay': p.overlay,
    '--dsw-alias-bg-module-platform': p.layer2,
    '--dsw-alias-bg-multi-select': alpha(p.pink, isDark ? 0.16 : 0.12),
    '--dsw-alias-bg-skeleton': alpha(line, isDark ? 0.07 : 0.05),
    '--dsw-alias-bg-document-preview': p.layer2,
    '--dsw-alias-bg-document-selection': alpha(p.pink, isDark ? 0.34 : 0.22),
    '--dsw-alias-bg-mask-1': alpha(p.void, 0.42),
    '--dsw-alias-bg-mask-2': alpha(p.void, 0.22),
    '--dsw-alias-bg-mask-3': alpha(p.void, 0.62),
    '--dsw-alias-bg-mask-drop': isDark ? alpha(p.void, 0.55) : alpha('#FFFFFF', 0.72),
    '--dsw-alias-bg-mask-photo': alpha(p.void, 0.86),

    // hairlines — the poster frame
    '--dsw-alias-border-l1': alpha(line, isDark ? 0.09 : 0.08),
    '--dsw-alias-border-l2': alpha(line, isDark ? 0.16 : 0.13),
    '--dsw-alias-border-l2-darkmode-thin': alpha(line, isDark ? 0.13 : 0.13),
    '--dsw-alias-border-l3': alpha(line, isDark ? 0.22 : 0.18),
    '--dsw-alias-border-l4': alpha(line, isDark ? 0.3 : 0.24),
    '--dsw-alias-border-inverted': alpha(p.void, isDark ? 0.5 : 0.12),
    '--dsw-alias-border-inverted2': alpha(p.void, isDark ? 0.3 : 0.08),
    '--dsw-alias-separator-primary': alpha(line, isDark ? 0.1 : 0.09),
    '--dsw-elevation-stroke-color': alpha(line, isDark ? 0.12 : 0.1),

    // text
    '--dsw-alias-label-primary': p.text1,
    '--dsw-alias-label-secondary': p.text2,
    '--dsw-alias-label-tertiary': p.text3,
    '--dsw-alias-label-quaternary': p.text4,
    '--dsw-alias-label-caption': p.text3,
    '--dsw-alias-label-dimmed': alpha(p.text1, isDark ? 0.55 : 0.6),
    '--dsw-alias-label-primary-dimmed': alpha(p.text1, isDark ? 0.62 : 0.66),
    '--dsw-alias-label-primary-inverted': p.void,
    '--dsw-alias-label-primary-foreground': p.void,
    '--dsw-alias-label-primary-bluish': p.text1,
    '--dsw-alias-label-deep-diving': p.text2,
    '--dsw-alias-label-deep-diving-shimmer': isDark ? meta.sunset.dark : meta.sunset.light,
    '--dsw-alias-label-shimmer': isDark ? meta.sunset.dark : meta.sunset.light,
    '--dsw-alias-label-document-preview': p.text2,

    // brand + actions
    '--dsw-alias-brand-primary': p.pink,
    '--dsw-alias-brand-primary-invert': isDark ? '#1A0512' : '#FFFFFF',
    '--dsw-alias-brand-primary-new-colorprimary-new-color': p.pink,
    '--dsw-alias-brand-text': isDark ? '#1A0512' : '#FFFFFF',
    '--dsw-alias-button-primary-fill': p.pink,
    '--dsw-alias-button-primary-hover': isDark ? '#FF77B8' : p.pinkDeep,
    '--dsw-alias-button-primary-dimmed': isDark ? p.pinkDim : p.pinkDim,
    '--dsw-alias-button-contrast-fill': p.text1,
    '--dsw-alias-button-elevated-fill': p.layer1,
    '--dsw-alias-button-floating-fill': isDark ? p.layer2 : p.layer1,
    '--dsw-alias-button-floating-hover': p.layer3,
    '--dsw-alias-button-ghost-active-border': alpha(p.pink, isDark ? 0.5 : 0.45),
    '--dsw-alias-button-ghost-active-fill': alpha(p.pink, isDark ? 0.14 : 0.1),
    '--dsw-alias-button-ghost-active-hover': alpha(p.pink, isDark ? 0.22 : 0.16),
    '--dsw-alias-button-info-fill': isDark ? meta.sunsetButton.dark : meta.sunsetButton.light,
    '--dsw-alias-button-info-hover': isDark
      ? 'linear-gradient(100deg, #D6247C 0%, #E8462A 55%, #EE7A24 100%)'
      : 'linear-gradient(100deg, #BE1068 0%, #D03C1C 55%, #D8661A 100%)',
    '--dsw-alias-button-tool-bar-fill': alpha(p.layer1, 0.82),
    '--dsw-alias-button-tool-bar-fill-invisible': alpha(p.void, 0.28),
    '--dsw-alias-button-tool-bar-hover': alpha(p.layer2, 0.92),

    // interaction states
    '--dsw-alias-interactive-bg-hover': alpha(line, isDark ? 0.06 : 0.05),
    '--dsw-alias-interactive-bg-hover-solid': p.layer2,
    '--dsw-alias-interactive-bg-hover-accent': alpha(p.pink, isDark ? 0.12 : 0.09),
    '--dsw-alias-interactive-bg-hover-danger': alpha(p.crimson, isDark ? 0.12 : 0.09),
    '--dsw-alias-interactive-bg-active': alpha(p.pink, isDark ? 0.2 : 0.14),

    // semantics — a personal palette may not redefine what red means
    '--dsw-alias-state-error-primary': p.crimson,
    '--dsw-alias-state-error-secondary': alpha(p.crimson, 0.14),
    '--dsw-alias-state-warn-primary': p.amber,
    '--dsw-alias-state-warn-secondary': alpha(p.amber, 0.14),
    '--dsw-alias-state-warn-tertiary': alpha(p.amber, 0.08),
    '--dsw-alias-state-warn-label': p.amber,
    '--dsw-alias-state-success-primary': p.green,
    '--dsw-alias-state-success-secondary': alpha(p.green, 0.14),
    '--dsw-alias-state-success-tertiary': alpha(p.green, 0.08),
    '--dsw-alias-state-done-primary': p.violet,
    '--dsw-alias-state-idle-primary': p.text3,
    '--dsw-alias-state-business-primary': p.aqua,
    '--dsw-alias-state-business-tertiary': alpha(p.aqua, 0.12),

    // links, code, markdown
    '--dsw-alias-link': p.aqua,
    '--dsw-alias-markdown-code-block': isDark ? '#120219' : '#F5EEF3',
    '--dsw-alias-markdown-code-block-banner': isDark ? '#1A0626' : '#EFE6EE',
    '--dsw-alias-markdown-code-segment-selected': alpha(line, isDark ? 0.14 : 0.1),
    '--dsw-alias-markdown-code-segment-unselected': alpha(line, isDark ? 0.04 : 0.04),
    '--dsw-alias-markdown-inline-code': alpha(p.pink, isDark ? 0.16 : 0.1),
    '--dsw-alias-markdown-placeholder': alpha(p.text1, isDark ? 0.4 : 0.42),
    '--dsw-alias-markdown-tag': p.aqua,
    '--dsw-alias-markdown-citation': p.aqua,
    '--shiki-background': 'transparent',
    '--shiki-foreground': p.text1,
    '--shiki-token-comment': isDark ? '#7E6B92' : '#8A7695',
    '--shiki-token-constant': p.violet,
    '--shiki-token-function': p.aqua,
    '--shiki-token-keyword': p.pink,
    '--shiki-token-link': p.aqua,
    '--shiki-token-parameter': p.orange,
    '--shiki-token-punctuation': isDark ? alpha(p.text1, 0.62) : alpha(p.text1, 0.6),
    '--shiki-token-string': isDark ? '#FFC07A' : '#8A5510',
    '--shiki-token-string-expression': isDark ? '#FFA85C' : '#7A4A0C',

    // diff
    '--dsw-alias-code-diff-added': alpha(p.green, isDark ? 0.16 : 0.13),
    '--dsw-alias-code-diff-deleted': alpha(p.crimson, isDark ? 0.16 : 0.12),
    '--dsw-alias-file-diff-added-bg': alpha(p.green, isDark ? 0.1 : 0.08),
    '--dsw-alias-file-diff-added-gutter': alpha(p.green, isDark ? 0.2 : 0.16),
    '--dsw-alias-file-diff-added-marker': p.green,
    '--dsw-alias-file-diff-deleted-bg': alpha(p.crimson, isDark ? 0.1 : 0.07),
    '--dsw-alias-file-diff-deleted-gutter': alpha(p.crimson, isDark ? 0.2 : 0.16),
    '--dsw-alias-file-diff-deleted-marker': p.crimson,

    // chrome: sidebar, menus, overlays
    '--dsw-specific-sidebar-fill': p.sidebar,
    '--dsw-specific-sidebar-nav-item-active': alpha(p.pink, isDark ? 0.18 : 0.11),
    '--dsw-specific-sidebar-nav-item-active-accent': p.pink,
    '--dsw-specific-menu': p.layer2,
    '--dsw-specific-selector': p.layer3,
    '--dsw-specific-input-major': isDark ? p.layer2 : p.layer1,
    '--dsw-specific-login-input': isDark ? p.layer2 : p.layer1,
    '--dsw-specific-tip': alpha(p.aqua, isDark ? 0.1 : 0.08),
    '--dsw-specific-bubble': p.operator,
    '--dsw-specific-bubble-highlight': alpha(p.pink, isDark ? 0.3 : 0.2),
    '--dsw-alias-menu-group-header-fill': alpha(line, isDark ? 0.03 : 0.03),
    '--dsw-alias-menu-icon': p.text2,
    '--dsw-alias-tooltip-bg': isDark ? '#0C0113' : '#2A1338',
    '--dsw-alias-tooltip-key-bg': alpha(p.peach, isDark ? 0.14 : 0.2),
    '--dsw-alias-toast-bg': p.layer3,
    '--dsw-alias-toast-label': p.text1,
    '--dsw-alias-turn-trigger-bg': alpha(line, isDark ? 0.05 : 0.04),
    '--dsw-alias-turn-trigger-bg-hover': alpha(line, isDark ? 0.09 : 0.07),
    '--dsw-alias-scrollbar-bg-l1': alpha(line, isDark ? 0.1 : 0.12),
    '--dsw-alias-scrollbar-bg-l2': alpha(line, isDark ? 0.14 : 0.16),
    '--dsw-alias-scrollbar-hover-l1': alpha(p.pink, isDark ? 0.4 : 0.38),
    '--dsw-alias-scrollbar-hover-l2': alpha(p.pink, isDark ? 0.5 : 0.46),
    '--dsw-alias-switch-thumb': isDark ? '#FFF6FB' : '#FFFFFF',
    '--dsw-alias-settings-card-fill': isDark ? p.layer1 : p.layer1,
    '--dsw-alias-settings-card-stroke': alpha(line, isDark ? 0.1 : 0.09),
    '--dsw-alias-onboarding-accent': p.pink,
    '--dsw-alias-onboarding-card-fill': p.layer1,
    '--dsw-alias-onboarding-checkbox-border': alpha(line, 0.24),
    '--dsw-alias-onboarding-secondary-fill': p.layer2,
    '--dsw-alias-fill-l1': alpha(line, isDark ? 0.07 : 0.06),
    '--dsw-alias-fill-l2': alpha(line, isDark ? 0.12 : 0.1),
    '--dsw-alias-fill-tertiary': alpha(line, isDark ? 0.05 : 0.05),
    '--dsw-alias-fill-tsp-secondary': alpha(line, isDark ? 0.08 : 0.07),

    // NOTE: --dsw-linear-gradient-think / -think-select are alpha fades used as
    // masks (linear-gradient(180deg, #fff, #fff0)); overriding them with colour
    // gradients would repaint masks. Left at stock on purpose.

    // illustration set (empty states, onboarding)
    '--dsw-alias-illustration-background': isDark ? p.layer2 : p.layer2,
    '--dsw-alias-illustration-backing': isDark ? p.layer3 : p.layer3,
    '--dsw-alias-illustration-detail': p.pink,
    '--dsw-alias-illustration-inset': isDark ? p.layer1 : '#FFFFFF',
    '--dsw-alias-illustration-shadow': alpha(p.void, isDark ? 0.5 : 0.12),
    '--dsw-alias-illustration-surface': isDark ? p.layer3 : p.layer2,

    // motion only — shape stays the shell's
    '--ds-ease-in-out': meta.motion.ease,
    '--ds-transition-duration': `${meta.motion.duration}s`,
    '--ds-transition-duration-fast': `${meta.motion.fast}s`,
    '--ds-transition-duration-slow': `${meta.motion.slow}s`,

    // exported for the mockup / docs only
    '--vc-peach': p.peach,
    '--vc-sunset': isDark ? meta.sunset.dark : meta.sunset.light,
  };
}

export const palettes = {
  dark: build(dark, 'dark'),
  light: build(light, 'light'),
};

// ── WCAG report ───────────────────────────────────────────────────────────────
function lum(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function over(fg, bg, a) {
  const F = rgb(fg), B = rgb(bg);
  return '#' + F.map((n, i) => Math.round(n * a + B[i] * (1 - a)).toString(16).padStart(2, '0')).join('');
}
export function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const pairs = (p, t) => {
  const flat = (v, bg) => (v.startsWith('#') && v.length === 9 ? over(v.slice(0, 7), bg, parseInt(v.slice(7), 16) / 255) : v.startsWith('#') ? v : null);
  const chk = (label, token, bgToken, min) => {
    const fg = flat(t[token], p.base);
    const bg = flat(t[bgToken], p.base);
    if (!fg || !bg) return null;
    const c = contrast(fg, bg);
    return { label, ratio: c, min, pass: c >= min };
  };
  return [
    chk('text1 / base', '--dsw-alias-label-primary', '--dsw-alias-bg-base', 7),
    chk('text2 / base', '--dsw-alias-label-secondary', '--dsw-alias-bg-base', 4.5),
    chk('text3 / base', '--dsw-alias-label-tertiary', '--dsw-alias-bg-base', 4.5),
    chk('text1 / layer2', '--dsw-alias-label-primary', '--dsw-alias-bg-layer-2', 7),
    chk('text3 / layer2', '--dsw-alias-label-tertiary', '--dsw-alias-bg-layer-2', 4.5),
    chk('pink / base', '--dsw-alias-brand-primary', '--dsw-alias-bg-base', 4.5),
    chk('pink / layer2', '--dsw-alias-brand-primary', '--dsw-alias-bg-layer-2', 4.5),
    chk('aqua link / base', '--dsw-alias-link', '--dsw-alias-bg-base', 4.5),
    chk('error / base', '--dsw-alias-state-error-primary', '--dsw-alias-bg-base', 4.5),
    chk('warn / base', '--dsw-alias-state-warn-primary', '--dsw-alias-bg-base', 4.5),
    chk('success / base', '--dsw-alias-state-success-primary', '--dsw-alias-bg-base', 4.5),
    chk('done / base', '--dsw-alias-state-done-primary', '--dsw-alias-bg-base', 4.5),
    chk('bubble text / bubble', '--dsw-alias-label-primary', '--dsw-specific-bubble', 4.5),
    chk('keyword / code', '--shiki-token-keyword', '--dsw-alias-markdown-code-block', 4.5),
    chk('string / code', '--shiki-token-string', '--dsw-alias-markdown-code-block', 4.5),
    chk('function / code', '--shiki-token-function', '--dsw-alias-markdown-code-block', 4.5),
    chk('comment / code', '--shiki-token-comment', '--dsw-alias-markdown-code-block', 3),
  ].filter(Boolean);
};

if (process.argv[1]?.endsWith('palette.mjs')) {
  let bad = 0;
  for (const [mode, prim] of Object.entries({ dark, light })) {
    console.log(`\n=== ${mode} ===`);
    for (const r of pairs(prim, palettes[mode])) {
      if (!r.pass) bad++;
      console.log(`${r.pass ? 'ok  ' : 'FAIL'} ${r.label.padEnd(22)} ${r.ratio.toFixed(2).padStart(5)}:1  (min ${r.min})`);
    }
  }
  console.log(`\n${bad} failing pair(s), ${Object.keys(palettes.dark).length} tokens per palette`);
}
