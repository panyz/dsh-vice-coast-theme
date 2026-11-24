// Execute plugin/client.js against a stubbed page and assert the contract the
// shell relies on. Run: node verify/smoke.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const code = readFileSync(new URL('../plugin/client.js', import.meta.url), 'utf8');

// ── stub page ────────────────────────────────────────────────────────────────
const attrs = new Map();
const elements = [];
function makeStyle() {
  const el = {
    dataset: {},
    textContent: '',
    removed: false,
    remove() {
      this.removed = true;
    },
  };
  elements.push(el);
  return el;
}
const localStorage = {
  data: new Map(),
  getItem(k) {
    return this.data.has(k) ? this.data.get(k) : null;
  },
  setItem(k, v) {
    this.data.set(k, String(v));
  },
};

globalThis.window = {
  localStorage,
  __ModuleLoader__: {
    load(def) {
      globalThis.window.__loaded = def;
    },
  },
};
globalThis.document = {
  documentElement: {
    setAttribute: (k, v) => attrs.set(k, v),
    removeAttribute: (k) => attrs.delete(k),
    getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
  },
  head: { appendChild: (el) => el },
  createElement: makeStyle,
};

// ── stub runtime ─────────────────────────────────────────────────────────────
const calls = { locale: [], layers: [], registrations: [], effects: [], disposers: [] };

const theme = {
  overrideTokens(source, layer) {
    calls.layers.push({ source, layer });
    return () => calls.disposers.push(`layer:${source}`);
  },
};
const slots = {
  inject(seat, register) {
    register();
  },
  register(options, component) {
    calls.registrations.push({ seat: options.name, options, component });
    return () => {};
  },
};
const locale = {
  register(ns, lang, dict) {
    calls.locale.push({ ns, lang, keys: Object.keys(dict) });
    return () => {};
  },
};
const ctx = {
  theme,
  slots,
  locale,
  effect(fn, label) {
    calls.effects.push(label);
    const cleanup = fn();
    if (typeof cleanup === 'function') calls.disposers.push(cleanup);
    return cleanup;
  },
};

// ── load the module ──────────────────────────────────────────────────────────
new Function(code)();
const def = window.__loaded;
assert.equal(def.id, 'dsh-vice-coast-theme', 'module id');
const plugin = def.factory((name) => {
  if (name === 'react') {
    return {
      createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
      useRef: (value) => ({ current: value }),
    };
  }
  throw new Error(`unexpected require: ${name}`);
});

assert.deepEqual(plugin.inject, ['slots', 'theme', 'locale'], 'injected services');
plugin.apply(ctx);

// ── assertions ───────────────────────────────────────────────────────────────
const [layer] = calls.layers;
assert.equal(calls.layers.length, 1, 'exactly one override layer applied');
assert.equal(layer.source, 'dsh-vice-coast-theme', 'layer source name');
const tokens = Object.keys(layer.layer);
assert.ok(tokens.length === 148, `148 tokens, got ${tokens.length}`);
for (const name of tokens) {
  const pair = layer.layer[name];
  assert.equal(typeof pair.light, 'string', `${name}.light is a string`);
  assert.equal(typeof pair.dark, 'string', `${name}.dark is a string`);
  assert.ok(pair.light.length > 0 && pair.dark.length > 0, `${name} pair is non-empty`);
}
assert.equal(layer.layer['--dsw-alias-bg-base'].dark, '#150420');
assert.equal(layer.layer['--dsw-alias-bg-base'].light, '#FBF7F6');
assert.match(layer.layer['--dsw-alias-button-info-fill'].dark, /^linear-gradient\(/, 'send key keeps its gradient');

assert.equal(attrs.get('data-vice-coast'), 'vice', 'preset attribute applied');

const seats = calls.registrations.map((r) => r.seat);
assert.ok(seats.includes('settings.general.item'), 'settings row registered');
assert.ok(seats.includes('sidebar.brand.mark'), 'sidebar mark registered');
assert.ok(seats.includes('conversation.hero.brand.mark'), 'hero mark registered');
const marks = calls.registrations.filter((r) => r.seat.endsWith('brand.mark'));
for (const mark of marks) assert.equal(mark.options.priority, -340, 'mark outranks the plain mark');
const row = calls.registrations.find((r) => r.seat === 'settings.general.item');
assert.equal(row.options.locale, 'vice-coast');
assert.equal(typeof row.options.inject, 'function');
assert.deepEqual(calls.locale.map((l) => l.lang).sort(), ['en', 'zh'], 'both locales registered');

// brand mark renders the owner's avatar at the requested edge
const mark = marks[0].component({ size: 34, className: undefined });
assert.equal(mark.type, 'span');
assert.equal(mark.props.style.width, '34px');
assert.equal(mark.props.className, 'vc-mark');
const img = mark.children[0];
assert.match(img.props.src, /^data:image\/png;base64,iVBOR/, 'matted cutout inlined as a PNG data URL');
assert.equal(img.props.alt, '', 'decorative image has an empty alt');

// settings row: drive the plugin's real store through the wiring it registered
const wiring = row.options.inject();
const useVice = (select) => select(wiring.hooks.useVice.getSnapshot());
const setVice = wiring.setVice;
const t = (key) => key;
const rendered = row.component({ useVice, setVice, t });
assert.equal(rendered.type, 'div');
const presets = flattened(rendered).filter((n) => n?.props?.role === 'radio');
assert.equal(presets.length, 2, 'two presets offered');
assert.equal(flattened(rendered).filter((n) => n?.props?.role === 'switch').length, 0, 'no frame switch');

// switching to stock removes the layer and both attributes
setVice({ preset: 'stock' });
assert.equal(calls.disposers.includes('layer:dsh-vice-coast-theme'), true, 'stock disposes the layer');
assert.equal(attrs.has('data-vice-coast'), false, 'stock clears the preset attribute');

// back to vice: a fresh layer mounts again
setVice({ preset: 'vice' });
assert.equal(calls.layers.length, 2, 'returning to Vice Coast restacks a layer');
assert.equal(attrs.get('data-vice-coast'), 'vice', 'attribute restored with the layer');

// plugin disposal: every effect cleanup runs
for (const dispose of calls.disposers) if (typeof dispose === 'function') dispose();
assert.equal(attrs.size, 0, 'disposal removes every root attribute');
assert.ok(elements.every((el) => el.removed), 'disposal removes both injected stylesheets');

console.log(`ok — ${tokens.length} tokens × 2 schemes, ${calls.registrations.length} registrations, ${calls.locale.length} locales, ${calls.effects.length} effects`);

// ── helpers ──────────────────────────────────────────────────────────────────
function flattened(node, out = []) {
  if (node === null || node === undefined || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const child of node) flattened(child, out);
    return out;
  }
  out.push(node);
  for (const child of node.children ?? []) flattened(child, out);
  return out;
}
