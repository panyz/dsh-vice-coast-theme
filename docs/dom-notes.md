# DSH Web UI — DOM / visual anatomy (reconstructed from CSS class names)

Prefix map (first 6–8 chars of each CSS‑module class are the module hash):

| prefix | package | what it draws |
|---|---|---|
| `pI_x6G_` | `dsh-client-ui-layout` | app frame, sidebar column, centre column, right column, resize handle |
| `hHd-Xa_` | `dsh-client-ui-sidebar` | sidebar shell: top strip, brand row, new‑session button, panel rows, regions, footer |
| `YDXeBa_` | `dsh-client-ui-workspace` | workspace/project rows + **session rows** in the sidebar |
| `wSkVaW_` | `dsh-client-ui-conversation` | conversation root, header/title row, tabs, scroll body, composer seat |
| `uV2eYG_` | `dsh-client-ui-conversation` | composer card (“InputBar”) |
| `pXSMma_` | `dsh-client-ui-conversation` | hero / empty state |
| `JObwrW_` | `dsh-client-ui-conversation` | context (token) meter + its popover |
| `EvIC1a_` | `dsh-client-ui-chat` | chat scroller, message column, flow spacing, running row |
| `Sixlwa_` | `dsh-client-ui-chat` | user row, attachments, compaction/retry/error rows |
| `hWmORq_` | `dsh-client-ui-chat` | assistant markdown wrapper |
| `O_Ebla_`, `l_V-RG_`, `oz9t_a_` | `dsh-client-ui-chat` | reasoning row, process-node toggle row, turn‑trigger card |
| `o3BgMG_` | `dsh-client-ui-tool` | **tool row** (leading icon, title, summary, diff stat, body) |
| `DXqwVW_` | `dsh-client-ui-tool` | tool detail list (permission / ask / tsx cards) |
| `P3OORG_` | `dsh-client-ui-sidebar-right` | right rail shell |
| `_markdown_rve47_` | `dsh-web-frontend` bundle | markdown prose (headings, lists, tables, inline code, links) |
| `_*_7gxqk_`, `_*_1mqf1_`, `_*_1cyuy_`, `_*_15hvo_` | `dsh-web-frontend` bundle | **code block + banner**, code card, **diff block**, terminal block |
| `_dot_1i3xo_` | `dsh-web-frontend` bundle | state dot / spinner (tool status) |
| `_boot_u7vgf_` | `dsh-web-frontend` bundle | pre‑React boot screen |

---

## 1. Frame and the top title row

```
html[data-platform=darwin]                     ← --dsh-frame-top-clearance: 48px
└ body[data-ds-dark-theme?][data-ds-theme-source]
  └ #root
    └ .pI_x6G_frame                            grid  [ sidebar | centre | right ]
      ├ .pI_x6G_sidebarCol                     grid-area 1/1
      │ └ .hHd-Xa_root (sidebar)
      ├ .pI_x6G_centerCol                      grid-area 1/2, display:flex column
      │ ├ .pI_x6G_mainPanel                    flex:1; column
      │ │ └ .wSkVaW_root (conversation)
      │ │   ├ .wSkVaW_header   ← title row + tabs
      │ │   ├ .wSkVaW_scrollBody
      │ │   └ .wSkVaW_composerSeat
      │ └ .pI_x6G_bottomRow                    grid-column:1/-1 (status/tear-off row)
      ├ .pI_x6G_rightbarCol                    grid-area 1/3
      ├ .pI_x6G_handle                        8px col-resize, margin-left:-4px
      ├ .pI_x6G_leadingSeat                   absolute top:11px left:88px (darwin) / 12px
      └ .pI_x6G_overlayLayer                  z-index:20
```

| piece | class | concrete look |
|---|---|---|
| frame | `.pI_x6G_frame` | `grid-template-rows: minmax(0,1fr) auto`, `height:100%`, `overflow:hidden`, `background: var(--dsw-alias-bg-base)`; columns inline `${sidebar}px minmax(400px,1fr) minmax(0,${0.7·vw}px)` |
| sidebar column | `.pI_x6G_sidebarCol` | `background: var(--dsw-specific-sidebar-fill)`, `border-right: .5px solid var(--dsw-alias-border-l3)`; darwin: no border, translucent gradient (§2) |
| centre column | `.pI_x6G_centerCol` | `background: var(--dsw-alias-bg-base)`; darwin adds `border-left:.5px solid var(--dsw-alias-border-l3)` |
| right column | `.pI_x6G_rightbarCol` | `grid-area:1/3; overflow:visible` (rail floats over it) |
| resize handle | `.pI_x6G_handle` | `width:8px; margin-left:-4px; cursor:col-resize; position:absolute; top:0; bottom:0` |
| drawer mask | `.pI_x6G_drawerMask` | `background: var(--dsw-alias-bg-mask-1); backdrop-filter: var(--dsw-mask-blur)` |

**Title row** lives inside `.wSkVaW_header`:

| element | class | values |
|---|---|---|
| header grid | `.wSkVaW_header` | `grid-template-columns: auto minmax(0,1fr)`; `min-height:76px`; `padding:10px 28px 0 20px`; `border-bottom:.5px solid var(--dsw-alias-border-l3)`; no tabs → `min-height:0; padding-bottom:10px` |
| leading cluster | `.wSkVaW_headerLeading` | `grid-area:1/1; gap:8px` (back button, sidebar toggle) |
| title row | `.wSkVaW_titleRow` | `grid-column:2; min-height:30px; padding-inline-start: max(0, calc(clearance − 20px))` |
| breadcrumb trail | `.wSkVaW_crumbs` / `_crumbSeg` / `_crumb` / `_crumbSep` | `crumbs{gap:4px}`; `crumb{font-size:14px;line-height:20px;padding:4px 8px;border-radius:var(--dsw-radius-md);max-width:220px;color:var(--dsw-alias-label-tertiary)}`; hover `background:var(--dsw-alias-interactive-bg-hover)`; current crumb `color:var(--dsw-alias-label-primary); font-weight:500`; sep `14px/20px`, `color:var(--dsw-alias-label-caption)` |
| fade mask | `.wSkVaW_titleCluster` | `mask-image:linear-gradient(to left, transparent calc(.3*20px), #000 20px)`, `gap:10px` |
| right utilities | `.wSkVaW_headerActions` / `_headerUtilities` / `_headerCorner` | `gap:8px`; utilities `margin-left:20px`; corner `margin-right:-16px` |
| view tabs | `.wSkVaW_viewTabs` / `_tab` / `_tabActive` | `gap:32px; min-height:25px`; `tab{min-height:35px;padding:10px 10px 9px;font-size:13px;font-weight:500;line-height:16px;color:var(--dsw-alias-label-tertiary)}`; active `color:var(--dsw-alias-state-business-primary)` + `:after{height:2px;border-radius:2px;background:currentColor;bottom:-1px}`; label max-width 88px ellipsis |

---

## 2. Sidebar (left)

`.hHd-Xa_root` — `display:flex; column; padding:6px 8px; font-size:14px; background: var(--dsw-specific-sidebar-fill); color: var(--dsw-alias-label-primary)`.
Local vars: `--dsh-sidebar-inline-padding:8px`, `--dsh-sidebar-row-padding:12px`, `--dsh-sidebar-label-gap:6px`, `--dsh-sidebar-paint-inset:3px`.
Width: 264–420 px (JS clamp), collapsed rail 56 px (`padding:18px 10px 6px`).
On darwin the whole column is transparent and the vibrancy gradient is painted on `.pI_x6G_sidebarCol`:
`linear-gradient(to bottom, #7a9bf01a, #7a9bf000 35%, #8f89b800 68%, #8f89b817), color-mix(in srgb, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 97%, #7a9bf0) 40%, transparent)`
(dark: `#7a9bf014 … #8f89b812`, `50%`). `[data-platform=darwin] .hHd-Xa_root{background:0 0}`.

Top‑to‑bottom inventory:

| # | element | class | values |
|---|---|---|---|
| 1 | top strip (toggle button) | `.hHd-Xa_topStrip` | `height:52px; padding:0 12px 2px; justify-content:flex-end; margin:-6px -8px 0` |
| 2 | brand row | `.hHd-Xa_logoRow` | `height:60px; padding:8px 0 8px 8px; gap:8px; justify-content:flex-end` (wordmark on the right, toggle on the left in the strip) |
| 2a | brand mark + name | `.hHd-Xa_brandIdentity` / `_brandMark` / `_brandName` | `gap:5px`, `height:24px`; name `font-size:18px; font-weight:600; line-height:24px; letter-spacing:.04em` |
| 2b | icon buttons | `.hHd-Xa_iconButton` | `28×28; border-radius: var(--dsw-radius-sm); color: var(--dsw-alias-label-secondary)`; hover `background-color: var(--dsw-alias-interactive-bg-hover)` |
| 2c | build version chip | `.hHd-Xa_buildVersion` | `height:10px; font-size:6px; line-height:10px; padding:0 3px; border-radius:2px; font-family: var(--ds-font-family-code); background: var(--dsw-alias-label-primary); color: var(--dsw-alias-label-primary-inverted)` |
| 3 | new session | `.hHd-Xa_newSession` | `height:38px; border:.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-md); background: var(--dsw-alias-button-elevated-fill); font:500 14px/22px; padding:8px 12px; margin:0 4px 10px`; hover `var(--dsw-alias-button-floating-hover)`. **darwin:** `background:#ffffff8c`, hover `#ffffff4d`, dark `#ffffff26`, dark‑hover `#fff3` (hardcoded — §7) |
| 4 | primary nav rows | `.hHd-Xa_panelList` / `.hHd-Xa_panelRow` | list `gap:2px; margin-bottom:8px`; row `min-height:36px; padding:7px 9px; border-radius: var(--dsw-radius-md); line-height:22px; border-inline:3px solid transparent; background-clip:padding-box`; hover **and** `.hHd-Xa_panelActive` → `background-color: var(--dsw-alias-interactive-bg-hover)`; collapsed `36×36` `radius md` |
| 5 | region area (session list) | `.hHd-Xa_regionArea` | `flex:1; overflow:hidden; padding-left:4px; margin-right:-8px` |
| 5a | workspace/project row | `.YDXeBa_projectRow` | same radius/padding scheme, `padding-inline-start: calc(12px − 3px + indent)`, chevron `.YDXeBa_arrow` rotates on open |
| 5b | **session row** | `.YDXeBa_sessionRow` | `height:32px; border-radius: var(--dsw-radius-md); padding:0 8px` + `padding-inline-start:9px`; `color: var(--dsw-alias-label-primary)`; hover and `.YDXeBa_selected` → `background-color: var(--dsw-alias-interactive-bg-hover)` |
| 5c | session title / meta / slot | `.YDXeBa_title` / `_meta` / `_slot` | title `flex:1`, edges fade with `mask-image` 12px when scrolled/clipped; meta `font-size:12px; line-height:20px; color: var(--dsw-alias-label-tertiary)`; slot icon `16×20` tertiary; archived rows use `--dsw-alias-label-caption`; `.YDXeBa_rowActions` replaces `.YDXeBa_rowResting` only on hover/menu‑open/focus |
| 6 | footer | `.hHd-Xa_footArea` / `_settingsArea` / `_footerActions` | column; collapsed → centred icon buttons |

Collapsed rail: `.hHd-Xa_collapsed` → `36×36` icon buttons with `border-radius: var(--dsw-radius-md)` and `color: var(--dsw-alias-label-primary)`, panel list `gap:12px`.

---

## 3. Conversation column

```
.wSkVaW_root
├ .wSkVaW_header (.wSkVaW_tabs)
├ .wSkVaW_body            --dsh-chat-content-width: clamp(680px, 64% of column, 920px)
│ └ .wSkVaW_scrollBody    scrollbar-gutter:stable; margin-right:2px
│   ├ .wSkVaW_viewArea
│   │ └ .EvIC1a_frame / .EvIC1a_root / .EvIC1a_scroll   padding:16px 32px
│   │   └ .EvIC1a_column  max-width: var(--dsh-chat-content-width); margin:0 auto
│   │     ├ [data-chat-flow-kind=user]      → .Sixlwa_userRow → .Sixlwa_userStack → ._bubble_1sgyj_1
│   │     ├ [data-chat-flow-kind=turn-process] → .O_Ebla_root / tool rows (.o3BgMG_root)
│   │     ├ [data-chat-flow-kind=response]  → .hWmORq_root (markdown prose)
│   │     └ .EvIC1a_running (thinking placeholder row)
│   └ .wSkVaW_composerStack → .wSkVaW_composerSeat (sticky) → .uV2eYG_root (composer)
```

| part | values |
|---|---|
| scroller | `.EvIC1a_scroll{padding:16px calc(var(--dsh-composer-side-clearance) + 16px)}` = **16px 32px**; `overflow:clip auto` |
| column | `.EvIC1a_column{max-width:var(--dsh-chat-content-width); width:100%; margin:0 auto}`; content width **680–920 px** |
| vertical rhythm | `--dsh-chat-flow-gap`: `4px` default · `12px` after a `[data-chat-group-part=response]` · `16px` after a `[data-chat-flow-kind=turn-process]` · `44px + content-delta` where a steering batch starts |
| composer seat | `position:sticky; bottom:0; z-index:9; background:linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 0%, transparent) 0px, var(--dsw-alias-bg-base) 36px)`; stack `gap:6px` |

### 3.1 User turn

| element | class | values |
|---|---|---|
| row | `.Sixlwa_userRow` | `flex-direction:column; align-items:flex-end; gap:6px` |
| stack | `.Sixlwa_userStack` | `max-width: min(calc(var(--dsh-chat-content-width,748px) * .702), 82%); gap:8px; align-items:flex-end` |
| bubble | `._bubble_1sgyj_1` (web‑frontend bundle) | `max-width:100%; background: var(--dsw-specific-bubble); border-radius: var(--dsw-radius-xl)` = **20px**; `padding:10px 16px`; `font-size: var(--dsh-content-font-size,14px)`; `line-height: calc(22px + content delta)`; `color: var(--dsw-alias-label-primary)`; `white-space:pre-wrap; word-break:break-word` |
| no border, no shadow | — | confirmed: no border/shadow declaration on the bubble rule |
| attachments row | `.Sixlwa_attachmentRow` | `flex-wrap:wrap; justify-content:flex-end; gap:8px` |
| attachment chip | `.Sixlwa_fileCard` | `flex:0 0 240px; width:240px; min-height:64px; padding:8px 12px; gap:10px; border:.5px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-lg)` = 16px; `background: var(--dsw-specific-input-major)`; icon `28×28`; name `14px/22px, weight 500`; meta `12px/15px` `var(--dsw-alias-label-tertiary)` |
| reference chip (in composer) | `.yAWgPa_chip` | `max-width:240px; color: var(--dsw-alias-state-business-primary); gap:3px; baseline`; invalid state `--dsw-alias-state-error-primary; opacity:.7; line-through` |

### 3.2 Assistant prose

| element | class | values |
|---|---|---|
| wrapper | `.hWmORq_root` | `font-size:var(--dsh-content-font-size,14px); line-height:calc(24px + delta); color: var(--dsw-alias-label-primary)` |
| block stack | `.hWmORq_body` | `flex-direction:column; gap:16px` |
| prose element | `._markdown_rve47_5` | `font: var(--dsw-font-markdown-base)` = `400 14px/24px system stack`; `overflow-wrap:anywhere` |
| paragraphs | `.p` | `margin:16px 0`; first/last child `margin:0 !important` |
| headings | h1–h4 | `h1: 700 calc(21px+Δ)/calc(30px+Δ)`, `h2: 700 calc(19px+Δ)/calc(28px+Δ)`, `h3: 700 calc(18px+Δ)/calc(26px+Δ)`, `h4: 600 14px/calc(24px+Δ)`; margins `32px 0 16px` (h4 `16px 0`) |
| lists | `ul/ol` | `margin:16px 0; padding-left:18px`; `li::marker{line-height:24px;color:var(--dsw-alias-label-secondary)}`; nested list `li:not(:first-child){margin-top:6px}` |
| rule | `hr` | `height:.5px; margin:32px 0; background: var(--dsw-alias-border-l2)` |
| quote | `blockquote` | `border-left:2px solid var(--dsw-alias-label-caption); padding-left:14px; margin:16px 0 0` |
| inline code | `:not(pre)>code` | `display:inline-flex; background: var(--dsw-alias-markdown-inline-code); border:.5px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-sm); padding:0 5px; font-family: var(--ds-font-family-code); font-size:.875em` |
| links | `a` | `color: var(--dsw-alias-link); font-weight:500; text-decoration:none`; hover/focus `underline dotted`, `text-underline-offset:3px`; focus-visible ring `0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary))` |
| tables | `._tableScroll_rve47_199` | `th{padding:10px 16px; border-bottom:.5px solid var(--dsw-alias-border-l3); font:500 13px/22px}`, `td{padding:10px 16px; border-bottom:.5px solid var(--dsw-alias-border-l2); font:13px/22px}`, first col `padding-left:0`, last `padding-right:0`, cell `min-width:100px; max-width:min(30vw,320px)`, `border-collapse:collapse` |
| images | `._image_rve47_300` | `border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-base); max-width:min(100%,640px)` inside button |
| stopped badge | `.hWmORq_stopped` | `background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-tertiary); border-radius: var(--dsw-radius-sm); padding:0 6px; font-size:11px; line-height:18px` |
| actions row | `.hWmORq_actions` | `margin-top:16px; margin-left:-6px` |
| compact variant | `._compact_rve47_351` | `13px / calc(20px + Δ₂)`, `color: var(--dsw-alias-label-tertiary)`, block margins 4–8px |

### 3.3 Reasoning / “thinking” rows

| element | class | values |
|---|---|---|
| reasoning toggle | `.O_Ebla_title` | `display:flex; gap:6px; font-size: var(--dsh-content-font-size,14px); line-height: calc(24px + Δ); color: var(--dsw-alias-label-tertiary)`; hover → `--dsw-alias-label-secondary` |
| leading glyph | `.O_Ebla_leading` | `16px + Δ` square, svg `14px + Δ`; activity icon cross‑fades to a chevron on hover/focus |
| process-node toggle | `.l_V-RG_root` | `height: calc(33px + Δ); padding:0 0 8px; border-bottom:.5px solid var(--dsw-alias-border-l2); font-size: var(--dsh-content-font-size,14px); color: var(--dsw-alias-label-tertiary)`; chevron 14×14 rotates 180° when `[data-open]` |
| running row | `.EvIC1a_running` | `font-size: calc(content − 2px); line-height: calc(22px + Δ); color: var(--dsw-alias-label-deep-diving)`; `.EvIC1a_runningDivider{height:.5px; top:-4px; background: color-mix(in srgb, var(--dsw-alias-border-l1) 75%, var(--dsw-alias-border-l2))}` |
| turn trigger card | `.oz9t_a_root` | `border:.5px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-xl)` (20px); `background: var(--dsw-alias-turn-trigger-bg, var(--dsw-alias-markdown-code-block))`; hover `…-hover, var(--dsw-alias-interactive-bg-hover)`; header `padding:12px 16px; gap:10px; 14px`; body `padding:0 16px 12px 40px`; content `font: var(--dsw-font-xxs-12); max-height:240px` |

### 3.4 Tool card

Row (one line per tool call), `.o3BgMG_*`:

```
.o3BgMG_root (column)
├ .o3BgMG_leading          status icon / dot (14–16 px)
├ .o3BgMG_title            tool name            (font-weight:400; 500 for cordis_*)
├ .o3BgMG_sep              2×2 dot, margin 0 8px
├ .o3BgMG_summary          13px / calc(24px+Δ) args one-liner, ellipsis
├ .o3BgMG_summarySuffix     13px, margin-left:4px
├ .o3BgMG_diffStat         mono, calc(13px − 2px); +N / −N
└ .o3BgMG_bodyWrap
  ├ .o3BgMG_ioCard        border .5px border-l1 · radius lg · background markdown-code-block
  │ ├ .o3BgMG_ioSection   grid  [max-content | 1fr]; column-gap:14px; padding:12px 16px; max-height:150px
  │ ├ .o3BgMG_ioLabel     sticky label, color label-caption
  │ ├ .o3BgMG_ioDivider   .5px border-l2
  │ └ .o3BgMG_ioText      pre-wrap, color label-secondary; [data-error] → state-error-primary
  └ .o3BgMG_inspectButton  border .5px border-l3 · radius 999px · 11px/16px · opacity 0 → 1 on hover
```

| piece | values |
|---|---|
| row hover container | `.EvIC1a_callRow{border-radius: var(--dsw-radius-sm)}` (chat flow) — the packages do **not** declare a background hover for tool rows; only the inner buttons/cards have hover states |
| status semantics | `._dot_1i3xo_2[data-state]` → `done: --dsw-alias-state-success-primary`, `warning: --dsw-alias-state-warn-primary`, `error: --dsw-alias-state-error-primary`, `idle: --dsw-alias-state-idle-primary`; dot is `currentColor` inset 20 %, `border-radius:50%` |
| error / stopped suffix | `.o3BgMG_errorSummary{color: var(--dsw-alias-state-error-primary)}`, `.o3BgMG_stoppedSummary{color: var(--dsw-alias-state-warn-label)}` |
| diff stat colours | `.o3BgMG_diffAdded` / `_diffRemoved` only colourise on row hover or `[aria-expanded=true]`: success / error primary |
| detail cards | `.DXqwVW_root{border:.5px solid border-l1; border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-markdown-code-block); font: var(--dsw-font-xs-13)}`; items `padding:10px 14px` separated by `.5px border-l2`; list `max-height:320px`; badge = `5px` dot + `12px` label, tone `info` → business primary, `success` → success primary |
| terminal body | `.o3BgMG_terminalBody{--dsl-terminal-font: markdown-code-block-small; --dsl-terminal-line-height:18px; --dsl-terminal-output-max-height:224px; border:.5px solid var(--dsw-alias-border-l1)}` |

### 3.5 Code block (with banner) — web‑frontend bundle `.md-code-block`

```
._block_7gxqk_4
├ ._bannerWrap_7gxqk_24 (sticky top:0, z-index:6, bg = alias-bg-base)
│ └ ._banner_7gxqk_24  padding:9px 14px · justify-content:space-between · gap:12px
│   ├ ._infostring_7gxqk_45   language label · mono · 11px/18px · label-primary
│   └ ._action_7gxqk_56 → ._copyButton_7gxqk_62  (transparent, inherit font)
└ pre  padding:16px (or 6px 22px 20px in card variant) · overflow-x:auto
```

| piece | values |
|---|---|
| block | `margin:16px 0; border-radius: var(--dsw-radius-lg)` = **16px**; `background: var(--dsw-alias-markdown-code-block)`; `color: var(--dsw-alias-label-primary)`; `font: var(--dsw-font-markdown-code-block)` |
| banner | `background: var(--dsw-alias-markdown-code-block-banner)`; `font: 11px/18px var(--dsw-font-family)`; `border-top-left/right-radius: inherit` |
| banner text | info string `11px/18px` mono, `color: var(--dsw-alias-label-primary)` |
| code text | `font: var(--dsw-font-markdown-code-block)` = `400 11px / calc(19px + codeΔ) mono`; `white-space:pre-wrap; word-break:break-all` (default) / `pre` when `[data-code-wrap=false]`; `padding:16px` or `6px 22px 20px` |
| line numbers | `._numbered_7gxqk_122` → `.line{padding-inline-start: calc(gutter + 12px)}`, `:before{color: var(--dsw-alias-label-tertiary)}` |
| alternate code cards | `._card_1mqf1_1` header `padding:10px 18px 8px 22px; font:11px/18px var(--dsw-font-family); color: var(--dsw-alias-label-secondary)`, body `padding:6px 22px 20px`; `._language_1mqf1_30` mono, tertiary; actions `24×24 radius sm`, hover `interactive-bg-hover` |
| syntax colours | `--shiki-*`: light constant `#1c7ed6`, string `#2f9e44`, comment `#868e96`, keyword `#d6336c`, parameter `#e8590c`, function `#6741d9`, punctuation `#495057`, link `#1971c2`; dark `#4dabf7 / #69db7c / #adb5bd / #faa2c1 / #ffa94d / #b197fc / #ced4da / #74c0fc` |

### 3.6 Diff block

```
._block_1cyuy_1
└ ._body_1cyuy_5   display:grid; grid-template-columns:minmax(max-content,1fr); padding:6px 0 20px
  └ ._line_1cyuy_13  padding:0 22px; white-space:pre
    ├ ._del_1cyuy_38   :before "- "  · color state-error-primary   · background alias-code-diff-deleted · box-shadow: inset 3px 0 0 state-error-primary
    ├ ._add_1cyuy_48   :before "+ "  · color state-success-primary · background alias-code-diff-added   · box-shadow: inset 3px 0 0 state-success-primary
    └ ._context_1cyuy_58 :before "  " · color label-secondary
._path_1cyuy_29  color label-secondary; font-weight:500
._gap_1cyuy_34   color label-tertiary
```

`--dsw-alias-code-diff-added` = `#22c55e14` light / `#22c55e1f` dark;
`--dsw-alias-code-diff-deleted` = `#ec131314` / `#f25a5a1f`.
Read‑file blocks use the same pattern with `.gutter` (right‑aligned line numbers, tertiary, `margin-right:12px`).

---

## 4. Composer

```
.uV2eYG_root        padding:0 16px 4px
└ .uV2eYG_card      radius 28px · background alias-specific-input-major · shadow elevation-soft
  ├ .uV2eYG_accessory      (optional top row) padding:10px 12px 0; gap:8px
  ├ .uV2eYG_scroll         max-height:336px
  │ └ .uV2eYG_input        contenteditable, min-height:36px (hero 52px), padding:4px 8px 0 14px
  │   └ .uV2eYG_placeholder absolute, inset:4px 8px auto 14px
  └ .uV2eYG_row            padding:2px 8px 6px
    ├ .uV2eYG_tools        [+] add button 28×28 · model selector
    ├ .uV2eYG_modes        permission/mode pill(s)
    └ .uV2eYG_trailing     activity/meter + send button 34×34
```

| piece | class | values |
|---|---|---|
| card | `.uV2eYG_card` | `max-width: calc(var(--dsh-chat-content-width) + 32px)`; `border-radius: var(--dsw-radius-panel)` = **28px**; `background: var(--dsw-specific-input-major)`; `box-shadow: var(--dsw-elevation-soft)`; `--dsw-elevation-stroke-color: var(--dsw-alias-border-l2)`; `border:0`; `padding-top:8px; gap:12px`; `font-size: var(--dsh-content-font-size,14px)`; `line-height: calc(24px + Δ)` |
| textarea | `.uV2eYG_input` | `min-height:36px`; `padding:4px 8px 0 14px`; `font-family: var(--dsw-font-family)`; `line-height: inherit`; `white-space:pre-wrap; overflow-wrap:anywhere`; `color: var(--dsw-alias-label-primary)`; `caret-color: var(--dsw-alias-state-business-primary)`; `outline:none` |
| placeholder | `.uV2eYG_placeholder` | `color: var(--dsw-alias-label-caption)`; hero variant wraps to 2 lines |
| send | `.uV2eYG_primary` | `34×34`; `border-radius:999px`; `background: var(--dsw-alias-button-info-fill)`; `color:#fff`; `transform: translateY(-2px)`; hover `var(--dsw-alias-button-info-hover)`; disabled `opacity:.4`, sending `opacity:1; cursor:progress` |
| add / attach | `.uV2eYG_add` | `28×28`; `border-radius:999px`; `background: var(--dsw-specific-selector)`; hover `var(--dsw-alias-interactive-bg-hover-solid)` |
| model selector | `.uV2eYG_select` | `height:28px; max-width:220px; border-radius: var(--dsw-radius-sm); background:transparent; font-size:13px; font-weight:500; line-height:20px; color: var(--dsw-alias-label-secondary)`; `padding:0 20px 0 8px`; chevron = inline SVG 12×12, `stroke='%2381858C'` (hardcoded); hover `background-color: var(--dsw-alias-interactive-bg-hover)` |
| notice strip | `.uV2eYG_notice` | `border-radius: var(--dsw-radius-md); background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-secondary); padding:4px 8px; font-size:12px; line-height:18px; margin-bottom:6px` |
| context meter | `.JObwrW_trigger` | `13px/20px`, tabular‑nums, `color: var(--dsw-alias-label-tertiary)`, `padding:1px 8px; gap:6px; border-radius: var(--dsw-radius-sm)`; hover/expanded → `interactive-bg-hover` + `label-secondary`; donut `stroke: var(--dsw-alias-border-l3)`, fill `stroke: var(--dsw-alias-label-tertiary)`, `stroke-width:2px` |
| meter popover | `.JObwrW_panel` | `width:min(264px,100vw-24px)`; `border-radius: var(--dsw-radius-lg)`; `background: var(--dsw-specific-menu)`; `backdrop-filter: var(--dsw-menu-backdrop-filter)`; `box-shadow: var(--dsw-elevation-prominent)`; `padding:12px; font-size:12px; line-height:20px`; bar `height:4px; radius:999px; background: var(--dsw-alias-interactive-bg-hover); gap:1px`; segments tinted `--meter-tint` |
| hero (empty state) | `.pXSMma_root` / `_headline` / `_stack` | centred, `padding:0 24px`, stack `max-width: var(--dsh-composer-card-max-width); gap:12px`; headline `font-size:26px; font-weight:500; line-height:32px; color: var(--dsw-alias-label-primary)`; workspace picker `13px/20px, weight 500, min-height:28px, radius sm`; composer hero `padding-bottom:32px` |

**All popovers/menus share one recipe**: `border-radius: var(--dsw-radius-lg)` + `background: var(--dsw-specific-menu)` + `backdrop-filter: var(--dsw-menu-backdrop-filter)` (i.e. `blur(40px) saturate(150%)`) + `box-shadow: var(--dsw-elevation-prominent)` + `width: min(288px, 100vw − 24px)` for sidebar menus / `264px` for the meter.

---

## 5. Right rail

| element | class | values |
|---|---|---|
| panel | `.P3OORG_panel` | `position:absolute; top:0; right:0; bottom:0; flex-column; overflow:clip`; slides in from `translateX(var(--dsh-sidebar-width))` with `--ds-transition-duration-slow` |
| tab body | `.P3OORG_tabBody` | `height:100%; overflow:hidden` |
| icon buttons | `.P3OORG_iconButton` | `28×28; padding:6px; border-radius: var(--dsw-radius-sm); svg 15×15; color: var(--dsw-alias-label-secondary)`; hover `var(--dsw-alias-interactive-bg-hover)` |
| unavailable state | `.P3OORG_unavailable` | `padding:12px; color: var(--dsw-alias-label-tertiary); font-size: var(--dsh-content-font-size-secondary,13px)` |
| attention flash | `[data-sidebar-right-flash]` | inset ring from `color-mix(in srgb, var(--dsw-alias-brand-primary-new-colorprimary-new-color) 48%, transparent)`; on dark the flash colour becomes `var(--dsw-static-neutral-00)` |
| dockkit chrome | `[data-dockkit-host=dock]`, `[data-dockkit-pane]`, `[data-dockkit-divider]`, `[data-dockkit-float]` | layers `--dsh-dockkit-dock-layer:10`, `--dsh-dockkit-float-layer:60`; fullscreen panel → 40 |

---

## 6. Scrollbars / misc chrome

* scrollbar `5px`, thumb `border-radius:999px`, track transparent, no margins.
  Thumb = `--dsw-alias-scrollbar-bg-l1` / hover `-hover-l1` globally, `-l2`/`-hover-l2` inside sidebar and composer.
* focus ring: `outline-width: var(--dsw-focus-ring-width)` = 2px, `outline-color: var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary))`; pointer modality sets it transparent.
* toast `. _toast_hr9yd_6`: `top:40px; left:50%`; `padding:12px 16px`; `border-radius: var(--dsw-radius-lg)`; `background: var(--dsw-alias-toast-bg)`; `color: var(--dsw-alias-toast-label)`; `font-size:14px; line-height:22px`; `box-shadow: var(--dsw-shadow-lv3)`.
* boot screen `._boot_u7vgf_3`: full-height grid centre; wordmark `16px/24px, weight 600, letter-spacing:.08em`; spinner 20×20, 2px ring, conic arc.
* `corner-shape: superellipse(1.5)` is applied to **every** element via `*,:before,:after` inside `@supports (corner-shape:superellipse(1.5))` — on supporting engines (Safari) every rounded corner is a squircle. Mockups in Figma/Chrome will show plain arcs.

---

## 7. Hardcoded colours that survive a token override

Extracted from the `client.js` CSS of the six UI packages (grep for hex/rgb literals; `#000`/`#0000`
alpha stops inside `mask-image`/`linear-gradient` are listed separately because they are not
colours the user sees).

| package | file / class | value | where / effect |
|---|---|---|---|
| `dsh-client-ui-sidebar` | `.hHd-Xa_newSession` under `[data-platform=darwin]` | `#ffffff8c` (base), `#ffffff4d` (hover) | glass new‑session button on macOS |
| `dsh-client-ui-sidebar` | same, `[data-ds-dark-theme]` | `#ffffff26` (base), `#fff3` (hover) | dark glass variant |
| `dsh-client-ui-layout` | `.pI_x6G_sidebarCol` darwin vibrancy | `#7a9bf01a`, `#7a9bf000`, `#8f89b800`, `#8f89b817`, mix colour `#7a9bf0` | the 4‑stop MVP of the translucent sidebar |
| `dsh-client-ui-layout` | same, dark | `#7a9bf014`, `#7a9bf000`, `#8f89b800`, `#8f89b812` | dark vibrancy |
| `dsh-client-ui-conversation` | `.JObwrW_colorTools{--meter-tint:#a78bfa}` | `#a78bfa` (violet) | “Tools” segment of the context meter — stays violet in any theme |
| `dsh-client-ui-conversation` | `.uV2eYG_primary` send button | `#fff` | send glyph colour (fixed white on the info fill) |
| `dsh-client-ui-conversation` | `.uV2eYG_select` chevron | `#81858C` inside a data‑URI SVG | model‑selector caret |
| `dsh-client-ui-conversation` | `.JObwrW_colorSystem` / `_colorMessages` | `var(--dsw-static-neutral-bluish-400)`, `var(--dsw-static-blue-450)` | meter tints read the *static* palette, not aliases |
| `dsh-client-ui-trajectory` | `.Y0dWHa_requestBoundaryControl:after` | shadow `0 2px 6px #0000001f` | boundary tooltip shadow |
| `dsh-client-ui-trajectory` | `.Y0dWHa_details` (narrow) | shadow `-12px 0 32px #00000024` | slide‑over detail panel |
| `dsh-client-ui-trajectory` | various | `color-mix(… var(--dsw-static-blue-500) …)` | static palette used directly |
| `dsh-client-ui-sidebar-right` | `[data-sidebar-right-flash]` dark | `var(--dsw-static-neutral-00)` | flash ring becomes pure white on dark |
| `dsh-client-ui-chat` | `.Sixlwa_fileCard` | fallbacks `#0000001f` (border‑l2) / `#00000073` (label‑tertiary) | only used if the token is missing |
| `dsh-client-ui-chat`, `-tool`, `-conversation`, `-trajectory` | `#000` / `#0000` | `mask-image: linear-gradient(#0000 0, #000 24px 100%)` | **alpha stops in masks — not themable and not visually a colour** |
| `dsh-web-frontend` bundle | `._markdown_rve47_5 a` transparent borders | `rgb(255 255 255 / 0)` | layout hack for the focus ring, no visual effect |

**Also fixed regardless of theme:** all `--shiki-*` defaults if not overridden (they are declared, so
themeable, but they are *not* `--dsw-*`), and the KaTeX CSS palette.

---

## 8. Unknowns

* No screenshot/DOM capture was possible from this environment — the tree above is reconstructed
  from CSS selectors and JSX class bindings, so *sibling order* inside the sidebar footer, the header
  utilities and the composer trailing cluster is inferred from layout CSS (`justify-content`,
  `margin-left:auto`) rather than seen.
* The hover/active background for a whole tool row in the chat flow is not declared in
  `dsh-client-ui-chat`/`-tool`; only `.EvIC1a_callRow{border-radius: var(--dsw-radius-sm)}` exists.
  Treat row hover as “no row fill; only inner controls highlight”.
* `--dsh-tab-hit-inline`, `--dsh-composer-hint`, `--dsh-chat-user-width` etc. are set at runtime by
  their components (defaults quoted where declared); their live values depend on the running build.
* The right rail's tab strip and split‑pane chrome come from `dockkit` attributes
  (`[data-dockkit-*]`) whose own CSS lives outside the packages read here; only the shell
  `.P3OORG_*` metrics above are confirmed.
