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

    /* @@PALETTE@@ */

    /* @@COPY@@ */

    /** The two palettes of one theme: light is the day postcard, dark is the night drive. */
    const PALETTE = { light: PALETTE_LIGHT, dark: PALETTE_DARK }

    /**
     * The supplied avatar, inlined as one PNG data URL: the 24px sidebar seat and
     * the hero seat share it, so the bundle needs no runtime asset route.
     */
    const AVATAR_URL = 'data:image/png;base64,@@AVATAR@@'

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
