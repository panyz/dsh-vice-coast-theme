/* built with logo: assets/logo-default.png (4450 B, a4527a967399) */
window.__ModuleLoader__.load({
  id: 'dsh-vice-coast-theme',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Plugin identity: also the token-layer source name. */
    const SOURCE = 'dsh-vice-coast-theme'
    /** Root attribute naming the active preset; also scopes the plugin's own CSS. */
    const ATTR = 'data-vice-coast'
    /** Durable per-browser preference. */
    const STORAGE_KEY = 'dsh.vice-coast'
    /** Locale namespace owned by this plugin's settings row. */
    const NS = 'vice-coast'
    /** Preset order: also the roving-focus order in the settings row. */
    const PRESET_IDS = ['vice', 'stock']
    const DEFAULT_STATE = { preset: 'vice' }
    /** Wins the brand-mark seats over a plain mark (occupants sort ascending). */
    const MARK_PRIORITY = -340

    /** Colour layer, generated from palette.mjs — the single source of truth. */
    const PALETTE_LIGHT = {
          "--dsw-alias-bg-base": "#FBF7F6",
          "--dsw-alias-bg-layer-1": "#FFFFFF",
          "--dsw-alias-bg-layer-2": "#F4EDF7",
          "--dsw-alias-bg-layer-3": "#EBE2F4",
          "--dsw-alias-bg-overlay": "#F7F2F9",
          "--dsw-alias-bg-module-platform": "#F4EDF7",
          "--dsw-alias-bg-multi-select": "#d1116e1f",
          "--dsw-alias-bg-skeleton": "#21102e0d",
          "--dsw-alias-bg-document-preview": "#F4EDF7",
          "--dsw-alias-bg-document-selection": "#d1116e38",
          "--dsw-alias-bg-mask-1": "#e7dfef6b",
          "--dsw-alias-bg-mask-2": "#e7dfef38",
          "--dsw-alias-bg-mask-3": "#e7dfef9e",
          "--dsw-alias-bg-mask-drop": "#ffffffb8",
          "--dsw-alias-bg-mask-photo": "#e7dfefdb",
          "--dsw-alias-border-l1": "#21102e14",
          "--dsw-alias-border-l2": "#21102e21",
          "--dsw-alias-border-l2-darkmode-thin": "#21102e21",
          "--dsw-alias-border-l3": "#21102e2e",
          "--dsw-alias-border-l4": "#21102e3d",
          "--dsw-alias-border-inverted": "#e7dfef1f",
          "--dsw-alias-border-inverted2": "#e7dfef14",
          "--dsw-alias-separator-primary": "#21102e17",
          "--dsw-elevation-stroke-color": "#21102e1a",
          "--dsw-alias-label-primary": "#21102E",
          "--dsw-alias-label-secondary": "#54415E",
          "--dsw-alias-label-tertiary": "#736180",
          "--dsw-alias-label-quaternary": "#9B8CA6",
          "--dsw-alias-label-caption": "#736180",
          "--dsw-alias-label-dimmed": "#21102e99",
          "--dsw-alias-label-primary-dimmed": "#21102ea8",
          "--dsw-alias-label-primary-inverted": "#E7DFEF",
          "--dsw-alias-label-primary-foreground": "#E7DFEF",
          "--dsw-alias-label-primary-bluish": "#21102E",
          "--dsw-alias-label-deep-diving": "#54415E",
          "--dsw-alias-label-deep-diving-shimmer": "linear-gradient(100deg, #D9126F 0%, #E4572E 55%, #E8892A 100%)",
          "--dsw-alias-label-shimmer": "linear-gradient(100deg, #D9126F 0%, #E4572E 55%, #E8892A 100%)",
          "--dsw-alias-label-document-preview": "#54415E",
          "--dsw-alias-brand-primary": "#D1116E",
          "--dsw-alias-brand-primary-invert": "#FFFFFF",
          "--dsw-alias-brand-primary-new-colorprimary-new-color": "#D1116E",
          "--dsw-alias-brand-text": "#FFFFFF",
          "--dsw-alias-button-primary-fill": "#D1116E",
          "--dsw-alias-button-primary-hover": "#9C0B4F",
          "--dsw-alias-button-primary-dimmed": "#FCE3EE",
          "--dsw-alias-button-contrast-fill": "#21102E",
          "--dsw-alias-button-elevated-fill": "#FFFFFF",
          "--dsw-alias-button-floating-fill": "#FFFFFF",
          "--dsw-alias-button-floating-hover": "#EBE2F4",
          "--dsw-alias-button-ghost-active-border": "#d1116e73",
          "--dsw-alias-button-ghost-active-fill": "#d1116e1a",
          "--dsw-alias-button-ghost-active-hover": "#d1116e29",
          "--dsw-alias-button-info-fill": "linear-gradient(100deg, #C4106A 0%, #D8401C 55%, #E4572E 100%)",
          "--dsw-alias-button-info-hover": "linear-gradient(100deg, #BE1068 0%, #D03C1C 55%, #D8661A 100%)",
          "--dsw-alias-button-tool-bar-fill": "#ffffffd1",
          "--dsw-alias-button-tool-bar-fill-invisible": "#e7dfef47",
          "--dsw-alias-button-tool-bar-hover": "#f4edf7eb",
          "--dsw-alias-interactive-bg-hover": "#21102e0d",
          "--dsw-alias-interactive-bg-hover-solid": "#F4EDF7",
          "--dsw-alias-interactive-bg-hover-accent": "#d1116e17",
          "--dsw-alias-interactive-bg-hover-danger": "#c1213a17",
          "--dsw-alias-interactive-bg-active": "#d1116e24",
          "--dsw-alias-state-error-primary": "#C1213A",
          "--dsw-alias-state-error-secondary": "#c1213a24",
          "--dsw-alias-state-warn-primary": "#9A5600",
          "--dsw-alias-state-warn-secondary": "#9a560024",
          "--dsw-alias-state-warn-tertiary": "#9a560014",
          "--dsw-alias-state-warn-label": "#9A5600",
          "--dsw-alias-state-success-primary": "#0B7442",
          "--dsw-alias-state-success-secondary": "#0b744224",
          "--dsw-alias-state-success-tertiary": "#0b744214",
          "--dsw-alias-state-done-primary": "#6B3BC2",
          "--dsw-alias-state-idle-primary": "#736180",
          "--dsw-alias-state-business-primary": "#087069",
          "--dsw-alias-state-business-tertiary": "#0870691f",
          "--dsw-alias-link": "#087069",
          "--dsw-alias-markdown-code-block": "#F5EEF3",
          "--dsw-alias-markdown-code-block-banner": "#EFE6EE",
          "--dsw-alias-markdown-code-segment-selected": "#21102e1a",
          "--dsw-alias-markdown-code-segment-unselected": "#21102e0a",
          "--dsw-alias-markdown-inline-code": "#d1116e1a",
          "--dsw-alias-markdown-placeholder": "#21102e6b",
          "--dsw-alias-markdown-tag": "#087069",
          "--dsw-alias-markdown-citation": "#087069",
          "--shiki-background": "transparent",
          "--shiki-foreground": "#21102E",
          "--shiki-token-comment": "#8A7695",
          "--shiki-token-constant": "#6B3BC2",
          "--shiki-token-function": "#087069",
          "--shiki-token-keyword": "#D1116E",
          "--shiki-token-link": "#087069",
          "--shiki-token-parameter": "#C24E14",
          "--shiki-token-punctuation": "#21102e99",
          "--shiki-token-string": "#8A5510",
          "--shiki-token-string-expression": "#7A4A0C",
          "--dsw-alias-code-diff-added": "#0b744221",
          "--dsw-alias-code-diff-deleted": "#c1213a1f",
          "--dsw-alias-file-diff-added-bg": "#0b744214",
          "--dsw-alias-file-diff-added-gutter": "#0b744229",
          "--dsw-alias-file-diff-added-marker": "#0B7442",
          "--dsw-alias-file-diff-deleted-bg": "#c1213a12",
          "--dsw-alias-file-diff-deleted-gutter": "#c1213a29",
          "--dsw-alias-file-diff-deleted-marker": "#C1213A",
          "--dsw-specific-sidebar-fill": "#F7EFF6",
          "--dsw-specific-sidebar-nav-item-active": "#d1116e1c",
          "--dsw-specific-sidebar-nav-item-active-accent": "#D1116E",
          "--dsw-specific-menu": "#F4EDF7",
          "--dsw-specific-selector": "#EBE2F4",
          "--dsw-specific-input-major": "#FFFFFF",
          "--dsw-specific-login-input": "#FFFFFF",
          "--dsw-specific-tip": "#08706914",
          "--dsw-specific-bubble": "#FFE3EF",
          "--dsw-specific-bubble-highlight": "#d1116e33",
          "--dsw-alias-menu-group-header-fill": "#21102e08",
          "--dsw-alias-menu-icon": "#54415E",
          "--dsw-alias-tooltip-bg": "#2A1338",
          "--dsw-alias-tooltip-key-bg": "#8a4a2833",
          "--dsw-alias-toast-bg": "#EBE2F4",
          "--dsw-alias-toast-label": "#21102E",
          "--dsw-alias-turn-trigger-bg": "#21102e0a",
          "--dsw-alias-turn-trigger-bg-hover": "#21102e12",
          "--dsw-alias-scrollbar-bg-l1": "#21102e1f",
          "--dsw-alias-scrollbar-bg-l2": "#21102e29",
          "--dsw-alias-scrollbar-hover-l1": "#d1116e61",
          "--dsw-alias-scrollbar-hover-l2": "#d1116e75",
          "--dsw-alias-switch-thumb": "#FFFFFF",
          "--dsw-alias-settings-card-fill": "#FFFFFF",
          "--dsw-alias-settings-card-stroke": "#21102e17",
          "--dsw-alias-onboarding-accent": "#D1116E",
          "--dsw-alias-onboarding-card-fill": "#FFFFFF",
          "--dsw-alias-onboarding-checkbox-border": "#21102e3d",
          "--dsw-alias-onboarding-secondary-fill": "#F4EDF7",
          "--dsw-alias-fill-l1": "#21102e0f",
          "--dsw-alias-fill-l2": "#21102e1a",
          "--dsw-alias-fill-tertiary": "#21102e0d",
          "--dsw-alias-fill-tsp-secondary": "#21102e12",
          "--dsw-alias-illustration-background": "#F4EDF7",
          "--dsw-alias-illustration-backing": "#EBE2F4",
          "--dsw-alias-illustration-detail": "#D1116E",
          "--dsw-alias-illustration-inset": "#FFFFFF",
          "--dsw-alias-illustration-shadow": "#e7dfef1f",
          "--dsw-alias-illustration-surface": "#F4EDF7",
          "--ds-ease-in-out": "cubic-bezier(.22,.61,.16,1)",
          "--ds-transition-duration": "0.2s",
          "--ds-transition-duration-fast": "0.12s",
          "--ds-transition-duration-slow": "0.34s",
          "--vc-peach": "#8A4A28",
          "--vc-sunset": "linear-gradient(100deg, #D9126F 0%, #E4572E 55%, #E8892A 100%)"
    }
    const PALETTE_DARK = {
          "--dsw-alias-bg-base": "#150420",
          "--dsw-alias-bg-layer-1": "#1D082B",
          "--dsw-alias-bg-layer-2": "#250F37",
          "--dsw-alias-bg-layer-3": "#311546",
          "--dsw-alias-bg-overlay": "#2A113D",
          "--dsw-alias-bg-module-platform": "#250F37",
          "--dsw-alias-bg-multi-select": "#ff5ca829",
          "--dsw-alias-bg-skeleton": "#ffd9c612",
          "--dsw-alias-bg-document-preview": "#250F37",
          "--dsw-alias-bg-document-selection": "#ff5ca857",
          "--dsw-alias-bg-mask-1": "#0d01166b",
          "--dsw-alias-bg-mask-2": "#0d011638",
          "--dsw-alias-bg-mask-3": "#0d01169e",
          "--dsw-alias-bg-mask-drop": "#0d01168c",
          "--dsw-alias-bg-mask-photo": "#0d0116db",
          "--dsw-alias-border-l1": "#ffd9c617",
          "--dsw-alias-border-l2": "#ffd9c629",
          "--dsw-alias-border-l2-darkmode-thin": "#ffd9c621",
          "--dsw-alias-border-l3": "#ffd9c638",
          "--dsw-alias-border-l4": "#ffd9c64d",
          "--dsw-alias-border-inverted": "#0d011680",
          "--dsw-alias-border-inverted2": "#0d01164d",
          "--dsw-alias-separator-primary": "#ffd9c61a",
          "--dsw-elevation-stroke-color": "#ffd9c61f",
          "--dsw-alias-label-primary": "#F8F2F7",
          "--dsw-alias-label-secondary": "#CDBAD8",
          "--dsw-alias-label-tertiary": "#A38FB4",
          "--dsw-alias-label-quaternary": "#7C6991",
          "--dsw-alias-label-caption": "#A38FB4",
          "--dsw-alias-label-dimmed": "#f8f2f78c",
          "--dsw-alias-label-primary-dimmed": "#f8f2f79e",
          "--dsw-alias-label-primary-inverted": "#0D0116",
          "--dsw-alias-label-primary-foreground": "#0D0116",
          "--dsw-alias-label-primary-bluish": "#F8F2F7",
          "--dsw-alias-label-deep-diving": "#CDBAD8",
          "--dsw-alias-label-deep-diving-shimmer": "linear-gradient(100deg, #FF2E8F 0%, #FF5F55 52%, #FFA24A 100%)",
          "--dsw-alias-label-shimmer": "linear-gradient(100deg, #FF2E8F 0%, #FF5F55 52%, #FFA24A 100%)",
          "--dsw-alias-label-document-preview": "#CDBAD8",
          "--dsw-alias-brand-primary": "#FF5CA8",
          "--dsw-alias-brand-primary-invert": "#1A0512",
          "--dsw-alias-brand-primary-new-colorprimary-new-color": "#FF5CA8",
          "--dsw-alias-brand-text": "#1A0512",
          "--dsw-alias-button-primary-fill": "#FF5CA8",
          "--dsw-alias-button-primary-hover": "#FF77B8",
          "--dsw-alias-button-primary-dimmed": "#3A1230",
          "--dsw-alias-button-contrast-fill": "#F8F2F7",
          "--dsw-alias-button-elevated-fill": "#1D082B",
          "--dsw-alias-button-floating-fill": "#250F37",
          "--dsw-alias-button-floating-hover": "#311546",
          "--dsw-alias-button-ghost-active-border": "#ff5ca880",
          "--dsw-alias-button-ghost-active-fill": "#ff5ca824",
          "--dsw-alias-button-ghost-active-hover": "#ff5ca838",
          "--dsw-alias-button-info-fill": "linear-gradient(100deg, #C2146E 0%, #D8391F 55%, #E0691A 100%)",
          "--dsw-alias-button-info-hover": "linear-gradient(100deg, #D6247C 0%, #E8462A 55%, #EE7A24 100%)",
          "--dsw-alias-button-tool-bar-fill": "#1d082bd1",
          "--dsw-alias-button-tool-bar-fill-invisible": "#0d011647",
          "--dsw-alias-button-tool-bar-hover": "#250f37eb",
          "--dsw-alias-interactive-bg-hover": "#ffd9c60f",
          "--dsw-alias-interactive-bg-hover-solid": "#250F37",
          "--dsw-alias-interactive-bg-hover-accent": "#ff5ca81f",
          "--dsw-alias-interactive-bg-hover-danger": "#ff5e721f",
          "--dsw-alias-interactive-bg-active": "#ff5ca833",
          "--dsw-alias-state-error-primary": "#FF5E72",
          "--dsw-alias-state-error-secondary": "#ff5e7224",
          "--dsw-alias-state-warn-primary": "#FFB65C",
          "--dsw-alias-state-warn-secondary": "#ffb65c24",
          "--dsw-alias-state-warn-tertiary": "#ffb65c14",
          "--dsw-alias-state-warn-label": "#FFB65C",
          "--dsw-alias-state-success-primary": "#45D98A",
          "--dsw-alias-state-success-secondary": "#45d98a24",
          "--dsw-alias-state-success-tertiary": "#45d98a14",
          "--dsw-alias-state-done-primary": "#B98CFF",
          "--dsw-alias-state-idle-primary": "#A38FB4",
          "--dsw-alias-state-business-primary": "#58E6D6",
          "--dsw-alias-state-business-tertiary": "#58e6d61f",
          "--dsw-alias-link": "#58E6D6",
          "--dsw-alias-markdown-code-block": "#120219",
          "--dsw-alias-markdown-code-block-banner": "#1A0626",
          "--dsw-alias-markdown-code-segment-selected": "#ffd9c624",
          "--dsw-alias-markdown-code-segment-unselected": "#ffd9c60a",
          "--dsw-alias-markdown-inline-code": "#ff5ca829",
          "--dsw-alias-markdown-placeholder": "#f8f2f766",
          "--dsw-alias-markdown-tag": "#58E6D6",
          "--dsw-alias-markdown-citation": "#58E6D6",
          "--shiki-background": "transparent",
          "--shiki-foreground": "#F8F2F7",
          "--shiki-token-comment": "#7E6B92",
          "--shiki-token-constant": "#B98CFF",
          "--shiki-token-function": "#58E6D6",
          "--shiki-token-keyword": "#FF5CA8",
          "--shiki-token-link": "#58E6D6",
          "--shiki-token-parameter": "#FF8A3C",
          "--shiki-token-punctuation": "#f8f2f79e",
          "--shiki-token-string": "#FFC07A",
          "--shiki-token-string-expression": "#FFA85C",
          "--dsw-alias-code-diff-added": "#45d98a29",
          "--dsw-alias-code-diff-deleted": "#ff5e7229",
          "--dsw-alias-file-diff-added-bg": "#45d98a1a",
          "--dsw-alias-file-diff-added-gutter": "#45d98a33",
          "--dsw-alias-file-diff-added-marker": "#45D98A",
          "--dsw-alias-file-diff-deleted-bg": "#ff5e721a",
          "--dsw-alias-file-diff-deleted-gutter": "#ff5e7233",
          "--dsw-alias-file-diff-deleted-marker": "#FF5E72",
          "--dsw-specific-sidebar-fill": "#120320",
          "--dsw-specific-sidebar-nav-item-active": "#ff5ca82e",
          "--dsw-specific-sidebar-nav-item-active-accent": "#FF5CA8",
          "--dsw-specific-menu": "#250F37",
          "--dsw-specific-selector": "#311546",
          "--dsw-specific-input-major": "#250F37",
          "--dsw-specific-login-input": "#250F37",
          "--dsw-specific-tip": "#58e6d61a",
          "--dsw-specific-bubble": "#380F27",
          "--dsw-specific-bubble-highlight": "#ff5ca84d",
          "--dsw-alias-menu-group-header-fill": "#ffd9c608",
          "--dsw-alias-menu-icon": "#CDBAD8",
          "--dsw-alias-tooltip-bg": "#0C0113",
          "--dsw-alias-tooltip-key-bg": "#ffd9c624",
          "--dsw-alias-toast-bg": "#311546",
          "--dsw-alias-toast-label": "#F8F2F7",
          "--dsw-alias-turn-trigger-bg": "#ffd9c60d",
          "--dsw-alias-turn-trigger-bg-hover": "#ffd9c617",
          "--dsw-alias-scrollbar-bg-l1": "#ffd9c61a",
          "--dsw-alias-scrollbar-bg-l2": "#ffd9c624",
          "--dsw-alias-scrollbar-hover-l1": "#ff5ca866",
          "--dsw-alias-scrollbar-hover-l2": "#ff5ca880",
          "--dsw-alias-switch-thumb": "#FFF6FB",
          "--dsw-alias-settings-card-fill": "#1D082B",
          "--dsw-alias-settings-card-stroke": "#ffd9c61a",
          "--dsw-alias-onboarding-accent": "#FF5CA8",
          "--dsw-alias-onboarding-card-fill": "#1D082B",
          "--dsw-alias-onboarding-checkbox-border": "#ffd9c63d",
          "--dsw-alias-onboarding-secondary-fill": "#250F37",
          "--dsw-alias-fill-l1": "#ffd9c612",
          "--dsw-alias-fill-l2": "#ffd9c61f",
          "--dsw-alias-fill-tertiary": "#ffd9c60d",
          "--dsw-alias-fill-tsp-secondary": "#ffd9c614",
          "--dsw-alias-illustration-background": "#250F37",
          "--dsw-alias-illustration-backing": "#311546",
          "--dsw-alias-illustration-detail": "#FF5CA8",
          "--dsw-alias-illustration-inset": "#1D082B",
          "--dsw-alias-illustration-shadow": "#0d011680",
          "--dsw-alias-illustration-surface": "#311546",
          "--ds-ease-in-out": "cubic-bezier(.22,.61,.16,1)",
          "--ds-transition-duration": "0.2s",
          "--ds-transition-duration-fast": "0.12s",
          "--ds-transition-duration-slow": "0.34s",
          "--vc-peach": "#FFD9C6",
          "--vc-sunset": "linear-gradient(100deg, #FF2E8F 0%, #FF5F55 52%, #FFA24A 100%)"
    }

    /** Settings-row copy, one entry per locale. */
    const COPY = {
          "zh": {
                "row": {
                      "title": "罪恶海岸主题",
                      "description": "整体配色取自 GTA VI 主视觉：画框紫做底、日落渐变只给思考与发送键、语义色不跟着变。你的头像抠掉蓝底，站在同一片落日上。"
                },
                "preset": {
                      "label": "配色方案",
                      "vice": "罪恶海岸",
                      "stock": "原厂还原"
                }
          },
          "en": {
                "row": {
                      "title": "Vice Coast theme",
                      "description": "Colours taken from the GTA VI key art — violet night surfaces, the sunset sweep only on reasoning and the send key, semantics unchanged. Your avatar is matted off its blue background and stands on the same sunset."
                },
                "preset": {
                      "label": "Palette",
                      "vice": "Vice Coast",
                      "stock": "Stock"
                }
          }
    }

    /** The two palettes of one theme: light is the day postcard, dark is the night drive. */
    const PALETTE = { light: PALETTE_LIGHT, dark: PALETTE_DARK }

    /**
     * The supplied avatar, inlined as one PNG data URL: the 24px sidebar seat and
     * the hero seat share it, so the bundle needs no runtime asset route.
     */
    const AVATAR_URL = 'data:image/png;base64,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'

    /**
     * Compose the override layer: one value per colour scheme, both mandatory.
     * @returns {Record<string, { light: string, dark: string }>} the layer
     */
    function composeLayer() {
      const layer = {}
      for (const name of Object.keys(PALETTE.light)) {
        layer[name] = { light: PALETTE.light[name], dark: PALETTE.dark[name] }
      }
      return layer
    }

    /** Read the stored preference; anything malformed falls back to the default. */
    function readState() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw === null) return { ...DEFAULT_STATE }
        const parsed = JSON.parse(raw)
        return { preset: PRESET_IDS.includes(parsed.preset) ? parsed.preset : DEFAULT_STATE.preset }
      } catch (error) {
        console.error('[vice-coast] stored preference unreadable; using the default preset', error)
        return { ...DEFAULT_STATE }
      }
    }

    /** Persist the preference; a browser that refuses storage keeps the live value. */
    function writeState(state) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch (error) {
        console.error('[vice-coast] preference could not be saved', error)
      }
    }

    /**
     * One live preference store in the shape a slot hook reads
     * (`getSnapshot`/`subscribe`), shared by the settings row and the token layer.
     * @returns the store
     */
    function createStore() {
      let state = readState()
      const listeners = new Set()
      const source = {
        getSnapshot: () => state,
        subscribe: (listener) => {
          listeners.add(listener)
          return () => {
            listeners.delete(listener)
          }
        },
      }
      const set = (patch) => {
        const next = { preset: patch.preset === undefined ? state.preset : patch.preset }
        if (next.preset === state.preset) return
        state = next
        writeState(state)
        for (const listener of [...listeners]) listener()
      }
      return { source, get: () => state, set }
    }

    /**
     * The owner's logo: the supplied avatar with its blue background matted out,
     * standing on the theme's sunset plate so the black cap keeps its contour.
     * @param {object} props - slot owner props
     * @param {number} props.size - requested square edge in pixels
     * @param {string} [props.className] - class the host surface applies
     * @returns {object} the mark element
     */
    function BrandMark({ size = 24, className }) {
      const edge = typeof size === 'number' && size > 0 ? size : 24
      return h(
        'span',
        {
          className: className === undefined ? 'vc-mark' : `vc-mark ${className}`,
          style: { width: `${edge}px`, height: `${edge}px` },
        },
        h('img', {
          src: AVATAR_URL,
          alt: '',
          draggable: false,
          decoding: 'async',
        }),
      )
    }

    /** Mark chrome: one plate, one matted cutout, a 0.5px hairline to crisp the edge. */
    const MARK_CSS = [
      '.vc-mark{position:relative;display:inline-block;flex:none;line-height:0;vertical-align:middle;',
      'border-radius:30%;overflow:hidden;',
      'background:linear-gradient(160deg,#FF2E8F 0%,#FF5F55 52%,#FFA24A 100%);',
      'box-shadow:inset 0 0 0 .5px rgba(255,255,255,.3)}',
      '.vc-mark>img{position:absolute;left:4%;bottom:0;width:92%;height:97%;display:block;',
      'object-fit:contain;object-position:bottom center}',
    ].join('')

    /** Settings-row chrome, matched to the host General rows and scoped under one prefix. */
    const ROW_CSS = [
      '.vct-row{display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2);flex-wrap:wrap}',
      '.vct-text{display:flex;flex-direction:column;gap:4px;flex:1 1 240px;min-width:0}',
      '.vct-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}',
      '.vct-desc{color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:400;line-height:18px;max-width:58ch}',
      '.vct-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-left:auto}',
      '.vct-group{display:flex;gap:2px;padding:3px;border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-module-platform);border:.5px solid var(--dsw-alias-border-l1)}',
      '.vct-option{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 9px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;white-space:nowrap}',
      '.vct-option:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.vct-option[aria-checked="true"]{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l3)}',
      '.vct-chip{display:inline-flex;width:15px;height:11px;border-radius:2px;overflow:hidden;box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3);flex:none}',
      '.vct-chip i{display:block;flex:1;height:100%}',
      '.vct-switch{display:inline-flex;align-items:center;gap:8px;padding:0;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;white-space:nowrap}',
      '.vct-switch:disabled{opacity:.45;cursor:default}',
      '.vct-track{position:relative;display:block;width:32px;height:18px;border-radius:999px;background:var(--dsw-alias-bg-layer-3);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3);transition:background .16s cubic-bezier(.2,.8,.2,1)}',
      '.vct-switch[aria-checked="true"] .vct-track{background:var(--dsw-alias-state-business-primary)}',
      '.vct-thumb{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:999px;background:var(--dsw-alias-switch-thumb);transition:transform .16s cubic-bezier(.2,.8,.2,1),background .16s cubic-bezier(.2,.8,.2,1)}',
      '.vct-switch[aria-checked="true"] .vct-thumb{transform:translateX(14px);background:var(--dsw-alias-label-primary-foreground)}',
      '.vct-row :focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}',
      '@media (prefers-reduced-motion: reduce){.vct-track,.vct-thumb{transition:none}}',
      '@media (max-width: 860px){.vct-controls{margin-left:0;width:100%}}',
    ].join('')

    /** Preset preview ramps: the three anchors of the theme, in one chip each. */
    const PREVIEW = {
      vice: ['#150420', '#FF2E8F', '#FFA24A', '#58E6D6'],
      stock: ['#151517', '#7f8287', '#d4d4d4', '#151517'],
    }

    /**
     * The settings row: theme preset as a radio group of preview chips.
     * "Stock" removes the layer entirely.
     * @param {object} props - composed slot props
     * @param {Function} props.useVice - selector hook over the preference store
     * @param {Function} props.setVice - patch writer
     * @param {Function} props.t - namespace translator
     * @returns {object} the row element
     */
    function ThemeRow({ useVice, setVice, t }) {
      const state = useVice((value) => value)
      const optionRefs = React.useRef({})
      const stock = state.preset === 'stock'
      const move = (event) => {
        const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
        if (!keys.includes(event.key)) return
        event.preventDefault()
        const index = PRESET_IDS.indexOf(state.preset)
        const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
        const nextIndex =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? PRESET_IDS.length - 1
              : (index + step + PRESET_IDS.length) % PRESET_IDS.length
        const next = PRESET_IDS[nextIndex]
        setVice({ preset: next })
        const node = optionRefs.current[next]
        if (node !== undefined) node.focus()
      }
      return h(
        'div',
        { className: 'vct-row' },
        h(
          'div',
          { className: 'vct-text' },
          h('div', { className: 'vct-title' }, t('row.title')),
          h('div', { className: 'vct-desc' }, t('row.description')),
        ),
        h(
          'div',
          { className: 'vct-controls' },
          h(
            'div',
            { className: 'vct-group', role: 'radiogroup', 'aria-label': t('preset.label'), onKeyDown: move },
            PRESET_IDS.map((id) => {
              const checked = state.preset === id
              return h(
                'button',
                {
                  key: id,
                  type: 'button',
                  role: 'radio',
                  'aria-checked': checked,
                  tabIndex: checked ? 0 : -1,
                  className: 'vct-option',
                  ref: (node) => {
                    optionRefs.current[id] = node
                  },
                  onClick: () => setVice({ preset: id }),
                },
                h(
                  'span',
                  { className: 'vct-chip', 'aria-hidden': 'true' },
                  PREVIEW[id].map((stop, index) => h('i', { key: index, style: { background: stop } })),
                ),
                t(`preset.${id}`),
              )
            }),
          ),
        ),
      )
    }

    /**
     * Mount one plugin-owned stylesheet and return its remover.
     * @param {object} ctx - client root context
     * @param {string} css - stylesheet text
     * @param {string} name - tag identity for the devtools stylesheet list
     * @returns {() => void} remover
     */
    function mountStyle(ctx, css, name) {
      return ctx.effect(() => {
        const tag = document.createElement('style')
        tag.dataset.plugin = SOURCE
        tag.dataset.pluginCss = `${SOURCE}/${name}`
        tag.textContent = css
        document.head.appendChild(tag)
        return () => {
          tag.remove()
        }
      }, `vice-coast: ${name}`)
    }

    /** Client plugin: owns the token layer, the settings row and the brand mark. */
    return {
      inject: ['slots', 'theme', 'locale'],
      /**
       * Apply the theme and mount its controls.
       * @param {object} ctx - client root context
       */
      apply(ctx) {
        for (const [locale, dict] of Object.entries(COPY)) {
          ctx.effect(() => ctx.locale.register(NS, locale, dict), `vice-coast: ${locale} copy`)
        }
        mountStyle(ctx, MARK_CSS, 'mark.css')
        mountStyle(ctx, ROW_CSS, 'settings.css')

        const store = createStore()

        ctx.effect(() => {
          const root = document.documentElement
          let disposeLayer = () => {}
          const paint = () => {
            const state = store.get()
            disposeLayer()
            disposeLayer = () => {}
            if (state.preset === 'stock') {
              root.removeAttribute(ATTR)
              return
            }
            root.setAttribute(ATTR, state.preset)
            disposeLayer = ctx.theme.overrideTokens(SOURCE, composeLayer())
          }
          paint()
          const off = store.source.subscribe(paint)
          return () => {
            off()
            disposeLayer()
            root.removeAttribute(ATTR)
          }
        }, 'vice-coast: token layer')

        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            {
              name: 'settings.general.item',
              id: 'vice-coast',
              order: 24,
              locale: NS,
              inject: () => ({
                hooks: { useVice: store.source },
                setVice: (patch) => {
                  store.set(patch)
                },
              }),
            },
            ThemeRow,
          ),
        )

        for (const seat of ['sidebar.brand.mark', 'conversation.hero.brand.mark']) {
          ctx.slots.inject(seat, () => ctx.slots.register({ name: seat, priority: MARK_PRIORITY }, BrandMark))
        }
      },
    }
  },
})
