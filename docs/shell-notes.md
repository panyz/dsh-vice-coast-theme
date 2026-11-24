# DSH Web UI — shell notes (ground truth from installed packages)

All values below were read out of the installed packages; nothing is inferred from screenshots.
Paths are relative to the installed packages directory
`<dsh-install>/node_modules/@deepseek-ai/` (abbreviated `PKG/`). Measured on the
2026‑11‑09 Web build. The raw token dump lives outside this repository — re-derive
it from your own install with the method in `docs/README.md`.

---

## 1. How the theme layer works

### 1.1 Two separate mechanisms

| # | Mechanism | Owner | What it does |
|---|---|---|---|
| A | **`<style>` injection** | `dsh-client-ui-theme` (`lib/client.js`, `installThemeStyles`) + every ui‑* plugin | Appends one `<style data-plugin="…" data-plugin-css="…/name">` per stylesheet to `document.head`. The theme plugin injects 8 sheets in this order: `base.css`, `corner-shape.css`, `design-platform.css`, `focus.css`, `onboarding.css`, `scrollbar.css`, `gradient-shadow-text.css`, `shiki.css`. Every component plugin (`ui-chat`, `ui-tool`, `ui-layout`, `ui-sidebar`, `ui-conversation`, `ui-trajectory`, …) injects its own hashed CSS‑module sheet the same way. |
| B | **Inline CSS variables on `<body>`** | `ui-layout` `ThemePresenter.apply()` | Writes `body.style.setProperty('--dsw-alias-…', value)` for every token of the active theme, and `--dsh-content-font-size` / `--dsh-code-font-size` / `--dsh-terminal-font-size`, plus any user font lists. Also flips `body[data-ds-dark-theme]`, `html[data-ds-theme-source]`, `documentElement.style.colorScheme`. |

Because B is *inline style*, a token override wins over **every** stylesheet rule, including the
dark‑palette rules. That is the only way an alias override can beat `body[data-ds-dark-theme]`.

### 1.2 Public API (quoted from `dsh-client-ui-theme/lib/types/client/index.d.ts`)

```ts
/** Theme token dictionary: --dsw-alias-* overrides keyed by variable name. */
export type ThemeTokens = Record<string, string>;

/**
 * One override-layer token value: both palette modes are mandatory (repeat
 * the same value when the token is scheme-invariant) so an override never
 * goes illegible when the user switches to the other scheme.
 */
export interface ThemeTokenModes {
  light: string;
  dark: string;
}

/** Override-layer dictionary: token names to per-mode value pairs. */
export type ThemeTokenOverrides = Record<string, ThemeTokenModes>;

export interface ThemeDefinition {
  id: string;
  /** Which base palette this theme builds on. The presenter switches
   * `body[data-ds-dark-theme]` from this field — never from the id. */
  colorScheme: 'light' | 'dark';
  /** Alias-layer overrides applied as inline CSS variables over the base palette. */
  tokens: ThemeTokens;
  icons?: IconReplacements | undefined;
}

export declare class ThemeRuntime {
  getTheme(): ThemeSnapshot;
  exportInspectTokens(): ThemeTokenInspection[];
  setTheme(id: string): void;
  setFontSize(role: FontRole, px: number): void;
  setFontFamily(role: FontRole, value: string): void;
  register(definition: ThemeDefinition): () => void;
  /**
   * Stack a token override layer on top of the active theme … layers compose
   * in seq order with later layers winning per-token … Calling again with the
   * same source replaces that source's whole layer and restacks it on top.
   * @param tokens - token-name → `{ light, dark }` value pairs. Validated at
   * runtime … a bare string value throws a teaching error.
   */
  overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void;
}

interface Events {
  /** @mode emit */
  'theme/change'(snapshot: ThemeSnapshot): void;
}
```

`snapshot.active.tokens` is already *composed and scheme‑resolved*: `composeActive()` folds every
override layer (later `seq` wins per token) and picks `modes[active.colorScheme]`, so the presenter
only ever writes plain strings. **A single value written only once would go illegible on scheme
switch — hence the mandatory pair.**

Host side (`dsh-client-ui-theme/lib/index.js`) also pre‑paints before the bundle loads:

```js
const LIGHT_BACKGROUND = "#fff";
const DARK_BACKGROUND  = "#151517";
// head style: `:root{color-scheme:light} body{background-color:#fff;--dsh-boot-bg:#fff}`
// dark variant identical with #151517, or wrapped in @media(prefers-color-scheme:dark) when preference==='system'
// body script:
document.documentElement.dataset.dsThemeSource = preference
document.body.toggleAttribute('data-ds-dark-theme', dark)
document.body.style.setProperty('--dsh-content-font-size', '14px')   // …per role
```

### 1.3 Light / dark requirement and decision path

| Step | Code | Result |
|---|---|---|
| Preference | `ThemePreference = 'light' \| 'dark' \| 'system'`, stored in ns `ui-theme` field `preference` | persisted in host user settings |
| Resolve `system` | `matchMedia("(prefers-color-scheme: dark)")` — `ThemeRuntime.media`, watched with `addEventListener('change')` | re‑emits `theme/change` |
| Choose palette | `buildSnapshot()`: `resolvedId = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference` | `active.colorScheme` |
| Publish | `ThemePresenter.apply()`: `body.toggleAttribute('data-ds-dark-theme', scheme === 'dark')` (`DARK_ATTRIBUTE = "data-ds-dark-theme"`) | attribute set to `""` |
| CSS | `body[data-ds-dark-theme] { … }` (specificity 0,1,1) beats `body { … }` (0,0,1) | dark values win |

**No palette token is declared inside a `@media (prefers-color-scheme: …)` block.** The only
media-query conditional is the pre-paint bootstrap style, which (for `system`) wraps
`:root{color-scheme:dark} body{background-color:#151517;--dsh-boot-bg:#151517}` in
`@media(prefers-color-scheme:dark)`; `--dsh-boot-bg` is a one-off boot fallback, not part of the
`--dsw-alias-*` system. `system` is resolved in JS (matchMedia) for everything else.
Registered non‑built‑in themes never become the attribute — only their `colorScheme` field matters.

### 1.4 How a bundle/plugin plugs in (the working pattern in this workspace)

A client plugin (`window.__ModuleLoader__.load({id, factory})`) declares
`inject: ['slots', 'theme', 'locale']`, then:

```js
const SOURCE = '@local/gta6-theme'          // also the override-layer identity
let dispose = ctx.theme.overrideTokens(SOURCE, {
  '--dsw-alias-bg-base':  { light: '#0b0b0d', dark: '#07070a' },
  '--dsw-alias-label-primary': { light: '#f4efe4', dark: '#f7f2e6' },
  …
})
ctx.effect(() => () => dispose(), 'gta6-theme: token layer')
```

Notes that matter for the bundle:

* `overrideTokens` does **not** validate token names — any custom property name is accepted
  (`dynamicToken()` sets `cssVariable` only when the name starts with `--`). Unknown names simply
  do nothing unless some CSS reads them.
* Layer removal restores whatever it covered, so it is safe for a toggleable theme.
* Disposing the layer while it is the top layer re‑emits `theme/change`; the presenter removes the
  previously applied property names (`appliedTokens`) before writing the new set.
* `register({id, colorScheme, tokens})` is the other route: it adds a *selectable* theme to the
  registry (duplicate id throws; `'system'` is a preference, not an id) and lets `setTheme('gta6')`
  switch to it. `register` takes flat `ThemeTokens` (`Record<string,string>`), **not** the
  `{light,dark}` pairs — the pair envelope belongs to `overrideTokens`.
* `ctx.theme.exportInspectTokens()` returns `ThemeTokenInspection[]` (`name`, `description`,
  `valueType`, `requiresLightAndDark`, `cssVariable`) — a ready-made manifest of the documented
  tokens; useful to enumerate what exists before overriding.
* The plugin may also write its own `<style>` for things tokens cannot express (see §5).

---

## 2. Typography

### 2.1 Shipped `@font-face`

| Family | Weights | Files | Where declared |
|---|---|---|---|
| `Montserrat` | 300, 400, 500 | `montserrat-light.woff2`, `montserrat-regular.woff2`, `montserrat-medium.woff2` (+ `Montserrat-OFL.txt`) | `PKG/dsh-client-ui-theme/lib/styles/brand-font.css` **and** duplicated in `dsh-web-frontend/dist/assets/index-lh_YM6sT.css` with hashed filenames (`montserrat-*-*.woff2`, same bytes) |
| `KaTeX_AMS`, `KaTeX_Caligraphic`, `KaTeX_Fraktur`, `KaTeX_Main`, `KaTeX_Math`, `KaTeX_SansSerif`, `KaTeX_Script`, `KaTeX_Size1`, `KaTeX_Size2`, `KaTeX_Size3`, `KaTeX_Size4`, `KaTeX_Typewriter` | regular/bold/italic per family | `dsh-web-frontend/dist/assets/fonts/KaTeX_*.woff2` | markup/KaTeX CSS in `dsh-web-frontend` |

There is **no UI webfont** — all chrome and prose use the system stack. Montserrat is used only by
`--dsw-font-family-brand` (brand wordmark). `KaTeX_Size3` has an `@font-face` rule but no woff2 file
in `dist/assets/fonts/` (missing asset; only affects rare math delimiters).

### 2.2 Font stacks (verbatim)

```css
/* :root, base.css */
--dsh-font-family-text-default: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
  "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
--dsw-font-family: var(--dsh-font-family-text-default);
--dsw-font-family-brand: "Montserrat", var(--dsh-font-family-text-default);

--dsh-font-family-code-default: "SF Mono", "JetBrains Mono", "Fira Code", Consolas,
  "Liberation Mono", Menlo, Courier, "PingFang SC", "Microsoft YaHei";
--ds-font-family-code: var(--dsh-font-family-code-default);

/* body, base.css — note the doubled stack (quirk, harmless) */
--dsw-font-family: var(--dsh-font-family-text, var(--dsh-font-family-text-default)),
                   var(--dsh-font-family-text-default);
--ds-font-family-code: var(--dsh-font-family-code, var(--dsh-font-family-code-default)),
                       var(--dsh-font-family-code-default);
```

**Effective body stack** (`dsh-web-frontend/dist/assets/index-*.css`):

```css
body{ font-family: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI",
  "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica,
  Arial, sans-serif);
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  color: var(--dsw-alias-label-primary, #0f1115);
  background: var(--dsw-alias-bg-base, #fff);
  text-autospace: normal }
```

`code, pre, [data-diff], [data-read], [data-search], [data-terminal] { text-autospace: no-autospace }`
`button, input, select, textarea { font-family: inherit }`

### 2.3 Size / line-height

* **No global `font-size` on `html`, `body` or `#root`** — only `html,body,#root{height:100%;margin:0}`.
  So the root is the browser default 16px and every surface sets its own size. The de‑facto UI size
  is 14px because each root container declares it (`--dsh-sidebar-inline-padding… .hHd-Xa_root{font-size:14px}`,
  composer card `font-size: var(--dsh-content-font-size,14px)`).
* User font sizes are inline vars on body, default `14px` text / `11px` code / `13px` terminal
  (`FONT_SIZE_SPECS`), ranges 10–22 / 10–16 / 10–20.
* Derived deltas (declared on `body` in `gradient-shadow-text.css`):

```css
--dsh-content-font-delta: calc(var(--dsh-content-font-size,14px) - 14px);
--dsh-content-font-size-secondary: min(calc(var(--dsh-content-font-size,14px) - 1px),
                                      max(13px, calc(var(--dsh-content-font-size,14px) - 2px))); /* 13px @14 */
--dsh-content-font-delta-secondary: calc(var(--dsh-content-font-size-secondary) - 13px);
--dsh-code-font-delta: calc(var(--dsh-code-font-size,11px) - 11px);
```

| Role | Token | Effective @ defaults |
|---|---|---|
| Chat prose (assistant markdown) | `--dsw-font-markdown-base` | `400 14px / 24px var(--dsw-font-family)` |
| User message bubble | `--dsh-content-font-size` | `14px / 22px` |
| UI labels (sidebar, composer select, tool summary) | literal | `13px/20px`, `14px/22px`, `12px/18px`, `11px/14px` |
| Code block | `--dsw-font-markdown-code-block` | `400 11px / 19px var(--ds-font-family-code)` |
| Inline code | `--dsw-font-markdown-code` | `calc(12px + code-delta) / calc(19px + code-delta)`; rendered at `font-size:.875em!important` |
| Code block, small (tool IO) | `--dsw-font-markdown-code-block-small` | `11px / calc(16px + delta)` |
| Markdown h1/h2/h3/h4 | `--dsw-font-markdown-h*` | `700 21/30`, `700 19/28`, `700 18/26`, `600 14/24` (+content delta) |
| Markdown tables | `--dsw-font-markdown-table` / `-head` | `13px/22px` / `500 13px/22px` |
| Type ramp | `--dsw-font-{xxxs-11, xxs-12, xs-13, s-14, base-16, m-18, l-20, xl-24}` | `11/14, 12/18, 13/20, 14/22, 16/24, 500 16/28, 500 20/28, 600 24/32` |
| Brand wordmark | — | `18px/24px 600, letter-spacing:.04em` (`.hHd-Xa_brandName`) |

**Which family each surface uses:** chrome/UI labels and chat prose → `--dsw-font-family`
(system stack); inline code, code blocks, diff/read/search/terminal viewers, file meta badges and
the small "build version" chip → `--ds-font-family-code` (SF Mono first); brand wordmark →
`--dsw-font-family-brand` (Montserrat); math → KaTeX families.

---

## 3. Layout metrics (raw)

### 3.1 App frame — `dsh-client-ui-layout`, class prefix `.pI_x6G_`

| Part | Value |
|---|---|
| `.pI_x6G_frame` | `display:grid; grid-template-rows: minmax(0,1fr) auto; height:100%; overflow:hidden; background: var(--dsw-alias-bg-base)` |
| columns (set inline by JS) | `` gridTemplateColumns: `${cols.sidebar}px minmax(${cols.rightbar===0?0:400}px, 1fr) minmax(0px, ${rightbarMax}px)` `` |
| sidebar width | `clampWidth(sidebar, 264, 420)` → **264–420 px**, pref default 280 (`layoutInfo.sidebar \|\| 280` in the drawer branch) |
| collapsed sidebar track | **56 px** (`computeColumns(viewport, sidebar, rightbar, collapsedWidth = 56, …)`); macOS desktop passes 0 to hide |
| centre minimum | 400 px is reserved for the right panel before it can exist (`available = viewport - s - 400`) |
| right panel | min **300 px**, max `70%` of frame (`RIGHTBAR_MAX_RATIO = .7`), first open `45%` (`RIGHTBAR_DEFAULT_RATIO = .45`) |
| drawer sidebar | `width: min(layoutInfo.sidebar \|\| 280, viewport - 48)`, absolutely positioned, `z-index:71` |
| auto‑collapse | viewport `< 1024 px` (`SIDEBAR_AUTO_COLLAPSE`) |
| `.pI_x6G_sidebarCol` | `background: var(--dsw-specific-sidebar-fill); border-right: .5px solid var(--dsw-alias-border-l3)` |
| `.pI_x6G_centerCol` | `background: var(--dsw-alias-bg-base)`; on darwin `border-left:.5px solid var(--dsw-alias-border-l3)` |
| `.pI_x6G_handle` (resize) | `width:8px; margin-left:-4px; cursor:col-resize` |
| `.pI_x6G_leadingSeat` | `position:absolute; top:11px; left:88px` (darwin) / `left:12px` |
| frame clearance vars | `html[data-platform=darwin]{--dsh-frame-top-clearance:48px}`; `--dsh-frame-overlay-top: calc(clearance + 20px)` |
| windows titlebar | `--dsh-windows-content-radius:16px`, `[data-windows-titlebar] .pI_x6G_frame{padding-top: var(--dsh-windows-titlebar-height); background: var(--dsw-specific-sidebar-fill)}` |
| darwin sidebar vibrancy | `background: linear-gradient(to bottom, #7a9bf01a, #7a9bf000 35%, #8f89b800 68%, #8f89b817), color-mix(in srgb, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 97%, #7a9bf0) 40%, transparent)` (dark: `#7a9bf014 … #8f89b812`, `50%`) |

### 3.2 Sidebar — `dsh-client-ui-sidebar` (`.hHd-Xa_`) + `dsh-client-ui-workspace` (`.YDXeBa_`)

| Part | Value |
|---|---|
| root | `padding:6px 8px; font-size:14px; background: var(--dsw-specific-sidebar-fill)`; local vars `--dsh-sidebar-inline-padding:8px; --dsh-sidebar-row-padding:12px; --dsh-sidebar-label-gap:6px; --dsh-sidebar-paint-inset:3px` |
| collapsed root | `padding:18px 10px 6px` |
| `.hHd-Xa_topStrip` | `height:52px; margin:-6px -8px 0; padding:0 12px 2px` |
| `.hHd-Xa_logoRow` | `height:60px; padding:8px 0 8px 8px; gap:8px` (collapsed `36px`, `margin-bottom:12px`) |
| `.hHd-Xa_brandName` | `font-size:18px; font-weight:600; line-height:24px; letter-spacing:.04em` |
| `.hHd-Xa_iconButton` | `28×28; border-radius: var(--dsw-radius-sm)`; collapsed `36×36; radius md` |
| `.hHd-Xa_buildVersion` | `height:10px; font-size:6px; line-height:10px; padding:0 3px; radius:2px`; `color: var(--dsw-alias-label-primary-inverted); background: var(--dsw-alias-label-primary)` |
| `.hHd-Xa_newSession` | `height:38px; border:.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-md); background: var(--dsw-alias-button-elevated-fill); font:500 14px/22px; padding:8px 12px; margin:0 4px 10px` |
| `.hHd-Xa_panelList` | `gap:2px; margin-bottom:8px` |
| `.hHd-Xa_panelRow` | `min-height:36px; padding:7px 9px; border-radius: var(--dsw-radius-md); line-height:22px` (`12px − 3px paint inset`); hover **and** active = `var(--dsw-alias-interactive-bg-hover)`; collapsed `36×36` |
| session row `.YDXeBa_sessionRow` | `height:32px; border-radius: var(--dsw-radius-md); padding:0 8px; padding-inline-start: calc(12px − 3px + indent)`; hover / `.YDXeBa_selected` = `var(--dsw-alias-interactive-bg-hover)` |
| session title / meta | title `flex:1`, scroll/clip `mask-image` fades 12px; `.YDXeBa_meta{font-size:12px; line-height:20px; color: var(--dsw-alias-label-tertiary)}`; archived → `--dsw-alias-label-caption` |
| session slot icon | `16×20; color: var(--dsw-alias-label-tertiary)` |

### 3.3 Conversation header / title row — `dsh-client-ui-conversation` (`.wSkVaW_`)

| Part | Value |
|---|---|
| `.wSkVaW_header` | `grid-template-columns: auto minmax(0,1fr); min-height:76px; padding:10px 28px 0 20px; border-bottom:.5px solid var(--dsw-alias-border-l3)` |
| header without tabs | `min-height:0; padding-bottom:10px` |
| `.wSkVaW_titleRow` | `min-height:30px; grid-column:2; gap:0; padding-inline-start: max(0px, calc(var(--dsh-frame-leading-clearance,0px) − 20px))` |
| `.wSkVaW_crumb` | `font-size:14px; line-height:20px; padding:4px 8px; border-radius: var(--dsw-radius-md); color: var(--dsw-alias-label-tertiary); max-width:220px`; current → `--dsw-alias-label-primary`, `font-weight:500`; hover → `--dsw-alias-interactive-bg-hover` |
| `.wSkVaW_crumbSep` | `font-size:14px; line-height:20px; color: var(--dsw-alias-label-caption)` |
| `.wSkVaW_headerUtilities` | `gap:8px; margin-left:20px`; `.headerCorner{margin-left:8px; margin-right:-16px}` |
| `.wSkVaW_tabs` / `.wSkVaW_viewTabs` | `margin-top:10px; padding-left:8px; gap:16px 20px` / `gap:32px; min-height:25px` |
| `.wSkVaW_tab` | `min-height:35px; padding:10px 10px 9px; font-size:13px; font-weight:500; line-height:16px; color: var(--dsw-alias-label-tertiary)`; active → `--dsw-alias-state-business-primary` + `:after{height:2px; border-radius:2px; background: currentColor}` |

### 3.4 Conversation column — `dsh-client-ui-chat` (`.EvIC1a_`) + `.wSkVaW_`

| Part | Value |
|---|---|
| `.EvIC1a_scroll` | `padding:16px calc(var(--dsh-composer-side-clearance) + 16px)` = **16px 32px**; `overflow: clip auto; container-type: inline-size` |
| `.EvIC1a_column` | `max-width: var(--dsh-chat-content-width); width:100%; margin:0 auto` |
| `--dsh-chat-content-width` | `var(--dsh-chat-user-width, clamp(680px, calc(var(--dsh-conversation-column-width,0px) * .64), 920px))` → **680–920 px** |
| `--dsh-composer-card-max-width` | `calc(var(--dsh-chat-content-width) + 32px)` |
| flow gap | `--dsh-chat-flow-gap` = `4px` default, `12px` after a response, `16px` after a turn‑process block, `calc(44px + content delta)` at a steering batch |
| user stack | `.Sixlwa_userStack{max-width: min(calc(var(--dsh-chat-content-width,748px) * .702), 82%); gap:8px; align-items:flex-end}` |
| user bubble | `._bubble_1sgyj_1{max-width:100%; background: var(--dsw-specific-bubble); border-radius: var(--dsw-radius-xl); padding:10px 16px; font-size: var(--dsh-content-font-size,14px); line-height: calc(22px + content delta); color: var(--dsw-alias-label-primary); white-space:pre-wrap}` |
| assistant prose | `.hWmORq_root{font-size: var(--dsh-content-font-size,14px); line-height: calc(24px + delta); color: var(--dsw-alias-label-primary)}`; `.hWmORq_body{gap:16px; flex-direction:column}` |
| markdown block rhythm | `p{margin:16px 0}`, `h1–h3{margin:32px 0 16px}`, `h4{margin:16px 0}`, `ul/ol{margin:16px 0; padding-left:18px}`, `hr{height:.5px; margin:32px 0; background: var(--dsw-alias-border-l2)}`, `blockquote{border-left:2px solid var(--dsw-alias-label-caption); padding-left:14px}`, first/last child margins `0!important` |
| inline code | `border:.5px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-sm); padding:0 5px; background: var(--dsw-alias-markdown-inline-code); font-size:.875em` |
| links | `color: var(--dsw-alias-link); font-weight:500; text-decoration:none`; hover `dotted underline`, `text-underline-offset:3px` |
| tables | `th{padding:10px 16px; border-bottom:.5px solid var(--dsw-alias-border-l3); font: markdown-table-head}` `td{padding:10px 16px; border-bottom:.5px solid var(--dsw-alias-border-l2)}` first col `padding-left:0`, last `padding-right:0` |
| code block | see §4.5 |
| attachments | `.Sixlwa_fileCard{flex:0 0 240px; width:240px; min-height:64px; padding:8px 12px; gap:10px; border:.5px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-lg); background: var(--dsw-specific-input-major)}`; name `14px/22px 500`, meta `12px/15px` tertiary; row `gap:8px; justify-content:flex-end` |
| running/thinking row | `font-size: calc(content − 2px); line-height: calc(22px + delta); --dsw-alias-label-shimmer: var(--dsw-alias-label-deep-diving-shimmer); color: var(--dsw-alias-label-deep-diving)` |
| composer seat | `.wSkVaW_composerSeat{--dsh-composer-text-max-height:336px; position:sticky; bottom:0; background: linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 0%, transparent) 0px, var(--dsw-alias-bg-base) 36px)}`; stack gap `6px` |

### 3.5 Composer — `dsh-client-ui-conversation` (`.uV2eYG_`)

| Part | Value |
|---|---|
| `.uV2eYG_root` | `padding:0 var(--dsh-composer-side-clearance) 4px` (= 0 16px 4px), `align-items:center` |
| `.uV2eYG_card` | `max-width: var(--dsh-composer-card-max-width); border-radius: var(--dsw-radius-panel)` (**28px**); `background: var(--dsw-specific-input-major)`; `box-shadow: var(--dsw-elevation-soft)`; `--dsw-elevation-stroke-color: var(--dsw-alias-border-l2)`; `border:0`; `padding-top:8px; gap:12px; font-size: var(--dsh-content-font-size,14px); line-height: calc(24px + delta)`; `@media (pointer:coarse){font-size: max(16px, …)}` |
| editor area `.uV2eYG_scroll` | `max-height: var(--dsh-composer-text-max-height)` = **336px** |
| `.uV2eYG_input` | `min-height:36px` (hero `52px`); `padding:4px 8px 0 14px`; `line-height: inherit`; caret `var(--dsw-alias-state-business-primary)`; `white-space:pre-wrap` |
| placeholder | `inset:4px 8px auto 14px; color: var(--dsw-alias-label-caption)` |
| bottom row `.uV2eYG_row` | `padding:2px 8px 6px; gap:12px`; `@container (width<=560px){gap:8px}` |
| add / attach `.uV2eYG_add` | `28×28; border-radius:999px; background: var(--dsw-specific-selector)`; hover `--dsw-alias-interactive-bg-hover-solid` |
| model select `.uV2eYG_select` | `height:28px; max-width:220px; border-radius: var(--dsw-radius-sm); font-size:13px; font-weight:500; line-height:20px; color: var(--dsw-alias-label-secondary)`; chevron is an inline SVG with hardcoded `stroke='%2381858C'` |
| send `.uV2eYG_primary` | `34×34; border-radius:999px; background: var(--dsw-alias-button-info-fill); color:#fff; transform: translateY(-2px)`; hover `var(--dsw-alias-button-info-hover)`; disabled `opacity:.4`; `[data-sending]` → `opacity:1; cursor:progress` + 0.8s spin |
| notice strip `.uV2eYG_notice` | `border-radius: var(--dsw-radius-md); background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-secondary); padding:4px 8px; font-size:12px; line-height:18px` |
| hero phase | `.wSkVaW_composerHero{padding-bottom:32px; width:min(calc(card-max + 2*16px), 100%)}` |
| dock `.uV2eYG_dock` | `gap:12px; padding-top:4px; min-height: calc(22px + secondary delta)` |

### 3.6 Tool card — `dsh-client-ui-tool` (`.o3BgMG_`) + `.DXqwVW_`

| Part | Value |
|---|---|
| row `.o3BgMG_root` | `display:flex; flex-direction:column` (the row itself is built by `ui-trajectory`'s process-row grid) |
| `.o3BgMG_title` | `font-weight:400` (`[data-tool^=cordis_]` → `500`) |
| `.o3BgMG_summary` | `font-size: var(--dsh-content-font-size-secondary,13px); line-height: calc(24px + delta)` |
| `.o3BgMG_sep` | `2×2; border-radius:1px; margin:0 8px; background: var(--dsw-alias-label-caption)` |
| `.o3BgMG_diffStat` | `font-family: var(--ds-font-family-code); font-size: calc(secondary − 2px)`; added/removed coloured on hover/expand |
| details card `.o3BgMG_ioCard` | `border:.5px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-markdown-code-block); font: var(--dsw-font-markdown-code-block-small); margin:4px 0 4px 4px` |
| IO section | `grid-template-columns: max-content 1fr; column-gap:14px; padding:12px 16px; max-height:150px`; label `--dsw-alias-label-caption` sticky; text `--dsw-alias-label-secondary`, `[data-error]` → `--dsw-alias-state-error-primary`; divider `.5px` `--dsw-alias-border-l2` |
| scroll body | `max-height:260px` |
| inspect button | `border:.5px solid var(--dsw-alias-border-l3); border-radius:999px; padding:2px 8px; font-size:11px; line-height:16px; background: var(--dsw-alias-bg-base); opacity:0` → 1 on row hover / touch |
| inline terminal body | `--dsl-terminal-font: markdown-code-block-small; --dsl-terminal-line-height:18px; --dsl-terminal-output-max-height:224px; border:.5px solid var(--dsw-alias-border-l1)` |
| permission/ask card `.DXqwVW_root` | `border:.5px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-markdown-code-block); font: var(--dsw-font-xs-13); margin:4px 0 4px 4px`; items `padding:10px 14px`, separated by `.5px` `--dsw-alias-border-l2`, list `max-height:320px`; badges = 5px dot + `font-size:12px` |

### 3.7 Right rail — `dsh-client-ui-sidebar-right` (`.P3OORG_`)

| Part | Value |
|---|---|
| panel | `position:absolute; top:0; right:0; bottom:0; overflow:clip`, `display:flex; flex-direction:column`; slide-in `transform: translateX(var(--dsh-sidebar-width))` over `--ds-transition-duration-slow` |
| lanes/floats | dockkit layers: `--dsh-dockkit-dock-layer:10; --dsh-dockkit-float-layer:60`; fullscreen panel raises dock layer to 40 |
| icon button | `28×28; padding:6px; border-radius: var(--dsw-radius-sm); svg 15×15`; hover `--dsw-alias-interactive-bg-hover` |
| flash ring | ring `color-mix(in srgb, brand-new-color 48%, transparent)`, near 16 %, far 10 % |
| panel body | `.P3OORG_tabBody{height:100%; overflow:hidden}` |

### 3.8 Scrollbars (`scrollbar.css`)

```css
body{--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l1);
     --dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l1);
     --dsh-scrollbar-thumb-border:0px; --dsh-scrollbar-track-margin:0px;
     --dsh-scrollbar-width:5px}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{margin-block:0;background:0 0}
::-webkit-scrollbar-thumb{background:var(--dsh-scrollbar-thumb);border-radius:999px;
  background-clip:content-box;border:0 solid transparent;corner-shape:round}
@media (hover:hover){::-webkit-scrollbar-thumb:hover{background-color:var(--dsh-scrollbar-thumb-hover)}}
@supports not selector(::-webkit-scrollbar){body,body *{scrollbar-width:thin;
  scrollbar-color:var(--dsh-scrollbar-thumb) transparent}}
```

Sidebar and composer re-point the pair to `--dsw-alias-scrollbar-bg-l2` / `-hover-l2`.
`.wSkVaW_scrollBody` sets `scrollbar-gutter:stable` and `margin-right:2px`; chat scroller uses
`scrollbar-gutter:stable`.

### 3.9 Radius / shadow scale (for mockup)

| Token | Value |
|---|---|
| `--dsw-radius-xs` | 4px |
| `--dsw-radius-sm` | 8px |
| `--dsw-radius-md` | 12px |
| `--dsw-radius-lg` | 16px |
| `--dsw-radius-xl` | 20px |
| `--dsw-radius-panel` | 28px |
| `--dsw-shadow-lv1` | `0 2px 4px 0 #0000000d` |
| `--dsw-shadow-lv1-blur` | `0 4px 12px 0 #00000005` |
| `--dsw-shadow-lv2` | `0 4px 12px 0 #00000005, 0 2px 8px 0 #0000000a` |
| `--dsw-shadow-lv3` | `0 0 1px 0 #0003, 0 0 4px 0 #00000005, 0 12px 32px 0 #00000014` |
| `--dsw-elevation-stroke` | `0 0 0 .5px var(--dsw-elevation-stroke-color)` |
| `--dsw-elevation-soft` | `stroke, 0 4px 16px 0 #00000008, 0 0 24px 0 #00000008` |
| `--dsw-elevation-panel` | `stroke, 0 3px 8px 0 #00000008, 0 0 16px 0 #00000005` |
| `--dsw-elevation-prominent` | `stroke, 0 3px 8px 0 #0000000a, 0 0 20px 0 #0000000d` |
| `--dsw-focus-ring-width` | 2px |

---

## 4. Ranked token coverage (visible weight)

Method: count `var(--dsw-alias-…)` occurrences in each package's `lib/client.js`
(chat · tool · layout · sidebar (+sidebar‑right) · conversation · trajectory).
Raw data: `_tmp/coverage.json`.

| group | alias refs | distinct tokens | packages |
|---|---|---|---|
| trajectory | 251 | 29 | `dsh-client-ui-trajectory` |
| chat | 114 | 26 | `dsh-client-ui-chat` |
| conversation (incl. composer) | 106 | 23 | `dsh-client-ui-conversation` |
| tool | 75 | 18 | `dsh-client-ui-tool` |
| sidebar | 38 | 13 | `dsh-client-ui-sidebar`, `dsh-client-ui-sidebar-right` |
| layout | 8 | 3 | `dsh-client-ui-layout` |

Top of the ranking (full 46‑row table below):

| # | token | total | chat | tool | layout | sidebar | conversation | trajectory |
|---|---|---|---|---|---|---|---|---|
| 1 | `--dsw-alias-label-tertiary` | 80 | 28 | 11 | – | 4 | 16 | 21 |
| 2 | `--dsw-alias-label-primary` | 71 | 9 | 5 | – | 8 | 15 | 34 |
| 3 | `--dsw-alias-label-secondary` | 70 | 20 | 7 | – | 6 | 8 | 29 |
| 4 | `--dsw-alias-state-business-primary` | 51 | 3 | 2 | – | 2 | 10 | 34 |
| 5 | `--dsw-alias-interactive-bg-hover` | 42 | 9 | – | – | 9 | 12 | 12 |
| 6 | `--dsw-alias-label-caption` | 40 | 11 | 10 | – | – | 5 | 14 |
| 7 | `--dsw-alias-bg-layer-1` | 30 | 1 | – | – | 1 | – | 28 |
| 8 | `--dsw-alias-state-error-primary` | 30 | 3 | 9 | – | – | 2 | 16 |
| 9 | `--dsw-alias-border-l2` | 23 | 6 | 6 | – | – | 2 | 9 |
| 10 | `--dsw-alias-border-l1` | 21 | 4 | 6 | – | – | 6 | 5 |

Full table (all 46 alias tokens actually consumed):

| token | total | chat | tool | layout | sidebar | conversation | trajectory |
|---|---|---|---|---|---|---|---|
| `--dsw-alias-label-tertiary` | 80 | 28 | 11 | – | 4 | 16 | 21 |
| `--dsw-alias-label-primary` | 71 | 9 | 5 | – | 8 | 15 | 34 |
| `--dsw-alias-label-secondary` | 70 | 20 | 7 | – | 6 | 8 | 29 |
| `--dsw-alias-state-business-primary` | 51 | 3 | 2 | – | 2 | 10 | 34 |
| `--dsw-alias-interactive-bg-hover` | 42 | 9 | – | – | 9 | 12 | 12 |
| `--dsw-alias-label-caption` | 40 | 11 | 10 | – | – | 5 | 14 |
| `--dsw-alias-bg-layer-1` | 30 | 1 | – | – | 1 | – | 28 |
| `--dsw-alias-state-error-primary` | 30 | 3 | 9 | – | – | 2 | 16 |
| `--dsw-alias-border-l2` | 23 | 6 | 6 | – | – | 2 | 9 |
| `--dsw-alias-border-l1` | 21 | 4 | 6 | – | – | 6 | 5 |
| `--dsw-alias-bg-base` | 16 | 2 | 3 | 5 | – | 5 | 1 |
| `--dsw-alias-border-l3` | 9 | 1 | 1 | 2 | 2 | 2 | 1 |
| `--dsw-alias-scrollbar-bg-l2` | 9 | 1 | – | – | 1 | 4 | 3 |
| `--dsw-alias-scrollbar-hover-l2` | 9 | 1 | – | – | 1 | 4 | 3 |
| `--dsw-alias-brand-primary-new-colorprimary-new-color` | 9 | – | – | – | 1 | – | 8 |
| `--dsw-alias-bg-layer-2` | 8 | – | – | – | – | – | 8 |
| `--dsw-alias-markdown-code-block` | 7 | 3 | 3 | – | – | – | 1 |
| `--dsw-alias-state-success-primary` | 7 | – | 4 | – | – | – | 3 |
| `--dsw-alias-bg-module-platform` | 6 | 1 | – | – | – | 1 | 4 |
| `--dsw-alias-border-l4` | 5 | 1 | 1 | – | – | 2 | 1 |
| `--dsw-alias-interactive-bg-hover-solid` | 5 | 2 | 2 | – | – | 1 | – |
| `--dsw-alias-state-warn-label` | 5 | – | 2 | – | – | – | 3 |
| `--dsw-alias-state-business-tertiary` | 4 | – | – | – | – | 3 | 1 |
| `--dsw-alias-button-floating-hover` | 3 | 1 | 1 | – | 1 | – | – |
| `--dsw-alias-state-error-secondary` | 3 | – | – | – | – | – | 3 |
| `--dsw-alias-button-floating-fill` | 2 | 1 | 1 | – | – | – | – |
| `--dsw-alias-state-warn-primary` | 2 | 1 | 1 | – | – | – | – |
| `--dsw-alias-label-primary-dimmed` | 2 | – | – | – | – | 2 | – |
| `--dsw-alias-scrollbar-bg-l1` | 2 | – | – | – | – | 2 | – |
| `--dsw-alias-label-dimmed` | 2 | – | – | – | – | 1 | 1 |
| `--dsw-alias-state-success-tertiary` | 2 | – | – | – | – | – | 2 |
| `--dsw-alias-state-warn-tertiary` | 2 | – | – | – | – | – | 2 |
| `--dsw-alias-border-l2-darkmode-thin` | 2 | – | – | – | – | – | 2 |
| `--dsw-alias-label-deep-diving-shimmer` | 1 | 1 | – | – | – | – | – |
| `--dsw-alias-label-deep-diving` | 1 | 1 | – | – | – | – | – |
| `--dsw-alias-turn-trigger-bg` | 1 | 1 | – | – | – | – | – |
| `--dsw-alias-turn-trigger-bg-hover` | 1 | 1 | – | – | – | – | – |
| `--dsw-alias-separator-primary` | 1 | 1 | – | – | – | – | – |
| `--dsw-alias-bg-mask-1` | 1 | – | – | 1 | – | – | – |
| `--dsw-alias-label-primary-inverted` | 1 | – | – | – | 1 | – | – |
| `--dsw-alias-button-elevated-fill` | 1 | – | – | – | 1 | – | – |
| `--dsw-alias-label-primary-bluish` | 1 | – | – | – | – | 1 | – |
| `--dsw-alias-button-info-fill` | 1 | – | – | – | – | 1 | – |
| `--dsw-alias-button-info-hover` | 1 | – | – | – | – | 1 | – |
| `--dsw-alias-interactive-bg-active` | 1 | – | – | – | – | – | 1 |
| `--dsw-alias-markdown-citation` | 1 | – | – | – | – | – | 1 |

`--dsw-specific-*` layer (same override semantics, all declared on `body`):
`--dsw-specific-sidebar-fill` ×8, `--dsw-specific-menu` ×4, `--dsw-specific-input-major` ×2,
`--dsw-specific-selector` ×1 in these six packages; `--dsw-specific-bubble` ×1 in
`dsh-web-frontend`'s bundled CSS (the user bubble), plus `dsh-client-ui-goal` and the session
inspector. `--dsw-static-*` is read 7× (blue‑500, blue‑450, neutral‑00/200/700, bluish‑400) chiefly
in `ui-trajectory`/`ui-conversation` context meters — static entries are *not* meant to be themed.

**Weight read for a colour-only theme:** the whole UI is dominated by four families —
`label-*` (261 refs), `state-*` (~110), `bg-base`/`bg-layer-1`/`bg-layer-2` (54),
`interactive-bg-hover*` (47) — plus `border-l1..l4` (60) and `markdown-code-block` (7). If the theme
gets `label-primary/secondary/tertiary/caption`, the four borders, `bg-base`, `bg-layer-1/2`,
`interactive-bg-hover`, `specific-sidebar-fill`, `specific-bubble`, `specific-input-major`,
`markdown-code-block`, `state-business-primary` and `brand-primary-new-…` right, it is ~95 % of the
visible surface.

---

## 5. What a theme cannot change (must be respected)

| Locked | Evidence |
|---|---|
| **Font family / size** — not tokens a theme layer owns | driven by `ctx.theme.setFontFamily/setFontSize` (host settings), written as body inline vars `--dsh-font-family-{text,code,terminal}` / `--dsh-{content,code,terminal}-font-size`. `overrideTokens` *can* write them (inline wins) but that fights the user's Appearance settings and the size ranges (10–22 px text). A theme should style colour only; if it ships a different family it must also own the size deltas. |
| **Spacing / layout metrics** | all literals in component CSS (`padding:6px 8px`, `gap:12px`, `min-height:36px`, sidebar 264–420 px, content 680–920 px, composer 336 px, header 76 px). Only a `<style>` injection could change them, not token overrides. |
| **Radii** | `--dsw-radius-*` are plain values on `:root` in `base.css`, **not** the alias layer. An inline body override does reach every body descendant (custom properties inherit) and this is what `ai-tech-theme` does, but `overrideTokens` with `--dsw-radius-*` is outside the documented alias contract and will not reach `html`‑level styling. |
| **Shadow geometry** | `--dsw-shadow-lv1/2/3`, `--dsw-elevation-*` are composed literals. Only their stroke colour (`--dsw-elevation-stroke-color`) is alias-driven. |
| **Mask / fade gradients** | literal `mask-image: linear-gradient(#0000 0, #000 24px 100%)` (`.eGxaPq_fadeTop`, `.O_Ebla_fadeTop`, `.wSkVaW_titleCluster`, `.YDXeBa_title[data-scrolled]`) — `#000`/`#0000` here are alpha stops, not a colour choice. |
| **Hardcoded colours in components** | listed in `dom-notes.md` §7 — they survive any token override. |
| **Icon artwork** | SVG symbols ship fill `currentColor` mostly, but several UI icons embed literal colours (e.g. composer chevron `#81858C`, context-meter `#a78bfa`); a token theme cannot recolour them. `ThemeDefinition.icons` can replace whole symbols (ids from `ui-primitives ICON_SYMBOLS`). |
| **KaTeX math** | own fonts + own colours from KaTeX CSS; only inherits text colour. |

---

## 6. Unknowns

* The exact rendered sidebar width at any moment is a persisted user preference
  (`layoutInfo.sidebar`), clamped 264–420; the store's default value is not in the packages I read
  (only the drawer fallback `280`). Treat **280 px** as the proposal default and 264–420 as the
  legal range.
* `--dsh-conversation-column-width` is measured at runtime from the layout viewport; the content
  width therefore resolves inside 680–920 px, not to a fixed number.
* Actual `--dsh-windows-titlebar-height` and `--dsh-frame-leading-clearance` values are injected by
  the host shell per platform and were not found as literals in the packages read.
* Visual verification (real screenshots) was out of scope; every number here comes from CSS/JS
  source, so anything the host injects at runtime is listed above as unknown.
