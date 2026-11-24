# 罪恶海岸 · Vice Coast — GTA6 色彩主题设计方案

DSH 工作台主题 · v1 · 2026-11 · MIT

> 非官方项目：与 Rockstar Games、Take-Two、DeepSeek 无关联，也未获其背书。配色取自官方宣传图的公开采样，仓库不含任何官方美术资源；产品名仅用于说明来源。

> 从官方主视觉里取三块颜色 —— **画框紫、日落渐变、纸白** —— 交给一个每天读几千行代码的工作台。

| | |
| --- | --- |
| 主题名 | 罪恶海岸 Vice Coast |
| 预设 | **罪恶海岸**（明度随外观设置：暗＝夜驾 / 亮＝明信片）· **原厂还原** |
| 干预范围 | 颜色层（alias token）+ 一条动效曲线；**不碰** 字体、字号、间距、圆角、结构 |
| 覆盖度 | 148 个 token × 2 明度；17 组关键配对实测全部达标（正文级 ≥ 4.58:1，注释级 ≥ 3.60:1） |
| 效果图 | [夜驾](mockups/01-night.png) · [明信片](mockups/02-postcard.png) · [主题说明书](mockups/03-spec-sheet.png) · [前后对照](mockups/04-before-after.png) |

---

## 1. 这不是什么

**不是霓虹赛博朋克。** 黑底 + 单色荧光是最容易做的"游戏主题"，但它属于 Vice City（1986）的合成波记忆，也是任何 AI 接到"赛博风"都会给出的默认答案。GTA VI 的官方主视觉恰好相反：**白日明信片拼贴，套在一个深紫画框里**，标志是洋红到橙的铬面渐变。方案跟着这个走。

**不是换皮海报。** DSH 是 Operate 界面 —— 成功标准是"把活干完"，不是"看一眼被震到"。所以主题只做颜色：不改字体（会破坏排版测量）、不改间距（宿主写死）、不加装饰性渐变（会和 diff、状态色抢语义）。

---

## 2. 取样（可复核）

官方 OG 主视觉（`rockstargames.com/VI`，1200×630）下载后 ffmpeg 解码 → k-means(k=12) + 定点取样，脚本见 [`docs/sample-palette.mjs`](docs/sample-palette.mjs)，可复跑。

| 锚点 | 十六进制 | 像素占比 | L\* a\* b\* | 在界面里成为 |
| --- | --- | --- | --- | --- |
| 画框紫 | `#1E032C` | 15.4% | 5 / 21 / −21 | 暗色页底（提亮到 `#150420` 让尺度更大） |
| 天空紫 | `#7274AF` | 8.3% | 51 / 11 / −28 | 亮色面板的冷调 |
| 落日桃 | `#F3BEB1` `#ED9461` | 8.2% + 3.0% | 81 / 17 / 14 · 70 / 29 / 41 | 自己的话（气泡）、渐变尾巴 |
| 灰粉 | `#C67EA9` | 8.2% | 61 / 34 / −11 | 信号粉的中间调参照 |
| 暖纸 | `#FAF6F4` | 5.8% | 97 / 1 / 1 | 亮色页底 |
| 水蓝 | `#89A6C0` | 9.7% | 67 / −4 / −16 | 交互青的冷端参照 |

一个值决定了整个暗色方案：**画框紫的 L\* 只有 5，a\* 却到 21** —— 它是被洋红压过的紫，不是中性灰。把它当页底，界面天生带一层海报画框；换成 `#151517`（原厂暗色）就立刻变回一块中性的黑。

---

## 3. 三原语 → 两套配色

| 原语 | 值 | 成为 |
| --- | --- | --- |
| 画框紫 | `#1E032C` → `#150420` | 暗色表面阶梯的第 0 级（页面底） |
| 日落渐变 | `#FF2E8F → #FF5F55 → #FFA24A` | 唯一手势，只走两处（见 §4） |
| 纸白 | `#FAF6F4` → `#FBF7F6` | 亮色页底 |

两套配色**同结构、同层级**，不是反色：暗色是紫夜（表面靠明度差拉开，色相统一在 285° 附近），亮色是明信片（暖纸 + 淡紫面板，靠 0.5px 描边分栏）。语义色两套一致：红仍是红，琥珀仍是琥珀。

**夜驾 Night Drive** 表面阶梯 `#150420 → #1D082B → #250F37 → #311546`；**明信片 Postcard** `#FBF7F6 → #FFFFFF → #F4EDF7 → #EBE2F4`。两套明度不是两个开关：它们跟着 DSH 自己的「外观」设置走，切深色就是夜驾，切浅色就是明信片，主题层只管把两套值都备好。

**唯一的暖色面是"自己的话"。** 气泡底色取自落日桃的深色演绎（暗 `#380F27`、亮 `#FFE3EF`），文字仍用 `label-primary` —— 因为 shell 里气泡文字不是独立 token（`--dsw-specific-bubble` 只管底）。你说话的地方是整屏唯一的暖色，其余都是紫夜或纸白。

---

## 4. 唯一手势：日落渐变，只有两处

grep 过全部客户端包，渐变能落地的槽位只有两个（这也正好够）：

| 落点 | token | 为什么是它 |
| --- | --- | --- |
| 思考 / 运行中的文字 | `--dsw-alias-label-deep-diving-shimmer` | shell 的 `.EvIC1a_running` 显式把它指给 `--dsw-alias-label-shimmer`，是唯一自带渐变文字管线的位置 |
| 发送键 | `--dsw-alias-button-info-fill` / `-hover` | 全 shell 里这个 token 只有 1 个消费者 —— 就是发送键 |

渐变有两档，**不是随手取两个值**：

- **展示档** `linear-gradient(100deg, #FF2E8F, #FF5F55 52%, #FFA24A)`：给标志、说明书、任何装饰使用。
- **按钮档** `linear-gradient(100deg, #C2146E, #D8391F 55%, #E0691A)`：发送键的箭头是 shell **硬编码的白色**，白字在展示档的橙端只有 1.9:1；压深一档后全段 ≥ 3.3:1，图标才立得住。

**禁止清单**：栏位分隔、标签页、次级按钮、hover 底、diff、代码高亮、图表 —— 一律纯色。想加第三处渐变的地方，基本都是把"装饰"当"信息"。

---

## 5. 组件映射

**左侧栏** —— 底 `--dsw-specific-sidebar-fill`（暗色比页底再收一档，让正文列跳出来）；会话行 32px，选中只给 `--dsw-alias-interactive-bg-hover`（粉 6%）+ 标题 500，不额外画边（原厂没有钩子）；相对时间 12px `label-tertiary`。

**标题行** —— 76px，底部 `--dsw-alias-border-l3`；面包屑 14px，当前项 `label-primary` 500，其余 `label-tertiary`；视图标签 13px 500，激活态 `state-business-primary` + 2px 下划线（青，不是粉 —— 粉留给"要做的事"）。

**会话列** —— 内容宽 845px（原厂 clamp 的中段）、行高 24px、正文 `label-primary`；行内代码 `.875em` + `markdown-inline-code` 底 + 0.5px `border-l1` 描边；运行行是 `label-deep-diving` 打底、渐变文字覆盖。

**工具行** —— 标题 13px：工具名 `label-primary`、参数 `label-secondary`、退出状态用 `state-success-primary`（绿）或 `state-error-primary`（红）；下方的 IO 卡片是 `markdown-code-block` 底 + 0.5px `border-l1` + 16px 圆角，标签 `label-caption`、值 `label-secondary`。**状态只靠颜色家族区分，不靠亮度**：绿=成、红=败、青=在跑。

**diff** —— 新增行 `file-diff-added-bg` / 标记 `file-diff-added-marker`，删除行同理。两套配色都保留 6–10% 的底色强度：低于 5% 时暗色下看不清块，高于 14% 时正文开始发灰。

**计划 / 轨迹** —— 卡片 `bg-layer-1` + 16px 圆角 + `border-l2`；已完成 `state-done-primary`（紫）+ 删除线，进行中 `state-business-primary`（青）+ 光环，未开始 `border-l4` 空心圈。

**输入卡片** —— 底 `specific-input-major`、28px 圆角、0.5px `border-l2` 描边（elevation stroke）、光标 `state-business-primary`、占位符 `label-caption`；发送键 34px 圆 + 按钮档渐变。

**弹层 / 设置** —— `specific-menu` 底 + shell 自带的 `backdrop-filter: blur(40px) saturate(150%)`（这是写死的，正好和紫夜底相配）；设置卡片 `settings-card-fill`。

**空态 / 引导** —— `illustration-*` 六件套：底 = 面板色、细节 = 粉、投影 = 深紫，不用灰色插图（灰色插图在紫夜里像加载失败）。

### 5.1 品牌位：标识站在落日底板上

侧栏左上角是 shell 的品牌位（`sidebar.brand.mark`，空会话页还有 `conversation.hero.brand.mark`）。主题把它换成一块**落日底板 + 标识图**：

- **底板**：`linear-gradient(160deg, #FF2E8F → #FFA24A)`，圆角 30%，外圈 0.5px 半透明描边。
- **标识**：默认是仓库自带的原创图形（落日盘 + 海平线，纸白线条，透明底）。需要「有底色的人像」时，底板正好把它的轮廓托起来 —— 尤其是黑帽檐、深发色这类会糊进紫夜底的暗部。
- **换自己的**：把 128–512px 的方形图交给 [`assets/matte.sh`](assets/matte.sh) 抠掉纯色底（默认天空蓝 `#5ABEFB`），再 `node tools/build-plugin.mjs --logo assets/logo-cut.png`。个人图默认被 `.gitignore` 挡住，不会被误提交。
- **还原预设**只卸颜色层，标识照旧 —— 它是你的品牌，不是主题的装饰。

三个尺寸都成立：64 / 34 / 24 px（[标识图](mockups/05-mark.png)）。浏览器标签页图标不归主题管：DSH 里另有插件/设置负责，主题不抢。

技术上都是插件自己的 CSS（`.vc-mark` + `.vc-mark>img`），不碰宿主组件的类名，也不改任何布局尺寸。

---

## 6. 排版、形状、动效：只动最后一项

- **字体不动**：系统栈，UI 14px、正文 14/24、代码 11/19，Montserrat 300/400/500 只用于品牌字标 —— 这是 shell 自己的声音，换字体会连带把量出来的行高、折行、组件高度全部打乱。
- **圆角不动**：`--dsw-radius-*` 是 `:root` 上的字面量，不在 alias 契约里；用内联变量去压它属于越界，升级会坏。原厂的 4/8/12/16/20/28 本来就和海报的硬边框气质兼容。
- **0.5px 描边沿用**：这是 shell 的分栏语法，也是这套配色里"纸感"的来源 —— 暖白细线压在紫底上。
- **动效一条曲线**：`cubic-bezier(.22,.61,.16,1)`，200ms（快 120ms / 慢 340ms）。只回应动作（悬停、展开、发送），不做入场编排；`prefers-reduced-motion` 的门全部保留。日落主题最容易犯的错就是让东西自己动起来，这里不。

---

## 7. 对比度实测

两套配色各 17 组关键配对全部达标（`node palette.mjs` 可复跑）：

| 配对 | 夜驾 | 明信片 | 门槛 |
| --- | --- | --- | --- |
| 正文 / 页底 | 17.79:1 | 16.75:1 | AAA 7 |
| 次级文字 / 页底 | 10.85:1 | 8.60:1 | AA 4.5 |
| 三级文字 / 页底 | 6.68:1 | 5.26:1 | AA 4.5 |
| 信号粉 / 页底 | 6.87:1 | 4.91:1 | AA 4.5 |
| 链接青 / 页底 | 12.81:1 | 5.59:1 | AA 4.5 |
| 气泡文字 / 气泡 | 15.04:1 | 14.84:1 | AA 4.5 |
| 关键字 / 代码底 | 7.01:1 | 4.58:1 | AA 4.5 |
| 注释 / 代码底 | 4.20:1 | 3.60:1 | AA 3 |

**一句实话**：第四档文字（`label-quaternary`，计数与极弱元信息）在亮色下低于 4.5:1。它不承担任何信息，按装饰处理；如果你要"全站字面 AA"，把 `--dsw-alias-label-quaternary` 提到 `#7C6B88` 即可，代价是它和三级文字几乎分不出来 —— 这是我故意不做的取舍。

---

## 8. 落地方式

```js
// 覆盖层：每个 token 必须给 {light, dark} 一对，写在 body 内联变量上，
// 因此天然压过 body[data-ds-dark-theme] 的调色板规则。
ctx.theme.overrideTokens('dsh-vice-coast-theme', {
  '--dsw-alias-bg-base': { light: '#FBF7F6', dark: '#150420' },
  '--dsw-alias-label-primary': { light: '#21102E', dark: '#F8F2F7' },
  // …148 个
});
```

- **三个预设**：夜驾 / 明信片 切换同一个覆盖层的取值；**还原** = dispose 覆盖层，界面立刻回到原厂，不需要重装。
- **成本**：一个 client 插件 + 一份 `palette.mjs` 源（含 WCAG 自检）+ locale + 图标。不改任何宿主文件，卸载即恢复。
- **已知漏点**（token 层本来就碰不到的，写在这里免得验收时当 bug）：
  - 首帧底色由宿主预涂（`#151517` / `#fff`），覆盖层来不及 —— 启动时有一次轻微闪灰。
  - 发送键箭头 `#fff`、模型选择器箭头 `#81858C`、上下文计量条 `#a78bfa` 是硬编码，改色需换图标资源；本方案只用按钮档渐变解决了对比度，没有改它们的色相。
  - macOS 桌面壳在侧栏叠一层蓝色 vibrancy（`#7a9bf0`），侧栏会比设计稿略偏蓝。
  - Safari 的 `corner-shape: superellipse(1.5)` 会让圆角比 Chrome 稿更"鼓"。

**发布形态**：本仓库的 `plugin/` 就是一个完整的 DSH bundle —— `package.json` 声明 `dsh.bundle.patch` 与 `dsh.client`，`cordis.patch.yml` 插入一行 `vice-coast-theme`，浏览器模块是一个 `window.__ModuleLoader__.load` 工厂。安装走「本地目录 = bundle」的方式（见 README），宿主会把它当作一个普通插件行激活（`fiberPhase: active`）。开关位置：设置 → 通用 → **罪恶海岸主题**（罪恶海岸 / 原厂还原）。

**改了客户端模块要重启**：已安装包的浏览器模块由运行时加载并缓存，`client.js` 变了要重启一次 Harness 才会加载新的一代（宿主机制，不是主题的 bug）。

**验证边界（如实说明）**：这个环境拿不到已登录页面的浏览器控制（直接请求返回 401），所以只验证到「宿主插件行 active + 模块契约（148 token × 2 明度、三个注册、两套文案、Stock 正确释放层级）+ 同步的离线渲染图」。真实页面里的首帧闪灰、菜单 `backdrop-filter`、Shiki 高亮与品牌位的实际观感，需要装好后看一眼。

**与其它主题共存**：同一时间只应启用一层主题覆盖 —— 两个主题各挂一层 token，谁后注册谁赢，会互相覆盖。换主题前先停用旧的。

---

## 9. 效果图怎么做的

四张图不是"模拟器截图"，是**用真实 token 名渲染的同一套变量**：`mockups/tokens.css` 由 [`tools/gen-css.mjs`](tools/gen-css.mjs) 从 `palette.mjs` 生成，页面里每个颜色都写 `var(--dsw-alias-…)`；字体是 shell 自带的那套（系统栈 + 内置 Montserrat 字标）；尺寸用的是从宿主 CSS 里读出来的真实值 —— 侧栏 280、内容列 845、标题行 76、输入卡片 28px 圆角、会话行 32px。

| 图 | 内容 |
| --- | --- |
| `01-night.png` | 夜驾：会话、工具输出、diff、计划、输入卡片，左上角是品牌位 |
| `02-postcard.png` | 明信片：同一版式的亮色 |
| `03-spec-sheet.png` | 主题说明书：三原语、渐变、双模令牌、组件样本、对比度 |
| `04-before-after.png` | 左：原厂 token 真值（从宿主安装包实测的令牌表里取，仓库不转存该 dump），右：夜驾 |
| `05-mark.png` | 品牌位：默认标识在 96 / 64 / 34 / 24 px 四档，夜驾与明信片各一行 |

内容文字是示意的（一个正在做这套主题的会话），界面结构、字体、尺寸都按宿主真值。

---

## 10. 我砍掉了什么

- **当前会话的渐变左缘** —— 原厂选中态只有背景色，没有可挂的钩子；要加得注入 CSS 改宿主类名，升级即坏。砍掉，改成 `interactive-bg-hover` 的粉雾。
- **第三处渐变** —— 试过放在标题行下沿，很好看，但那是装饰不是信息。两处已经是上限。
- **霓虹青 + 黑** —— 看起来更像"赛博朋克主题"，但和官方主视觉无关，也正好撞上 AI 默认配色。
- **字体与圆角改造** —— 不在 alias 契约里，做了就是在赌升级。
- **贴官方美术素材** —— 交付物里只有采样出来的十六进制，没有海报图。

---

## 11. 文件

| 路径 | 作用 |
| --- | --- |
| `palette.mjs` | 唯一真源：148 token × 2 明度 + WCAG 自检（`node palette.mjs`） |
| `tools/gen-css.mjs` | 生成 mockup 用的 `tokens.css`（含原厂 stock 对照） |
| `tools/render-all.mjs` | 一条命令重出四张图（`node tools/render-all.mjs`） |
| `tools/shot.mjs` `tools/measure.mjs` | 无头 Chrome 截图 / 量块几何 |
| `mockups/app.html` `mockups/comparison.html` | 按宿主真实尺寸与字体搭建的界面稿 |
| `plugin/` | **装好的插件包**：`package.json` · `cordis.patch.yml` · `index.js` · `client.js`（由 build 生成）· `locale/{zh,en}.json` · `icon.svg` |
| `assets/logo-default.svg` `assets/logo-default.png` | 默认标识（原创）：SVG 源 + 192px 透明 PNG |
| `assets/matte.sh` | 把自己的图抠成透明底的命令（可选） |
| `design/client.template.js` | 浏览器模块的源：token 层、设置行、品牌位、预设状态机 |
| `tools/build-plugin.mjs` | 把 `palette.mjs` + 文案 + 标识（`--logo` 可换）内联进 `plugin/client.js`，并跑 `node --check` |
| `verify/smoke.mjs` | 用桩页面执行 `client.js`，断言 token 对、注册、Stock 释放、画框开关、卸载清理 |
| `mockups/01-04*.png` | 四张效果图（1600×1000 / 620 @2x） |
| `docs/sample-palette.mjs` | 官方主视觉取样（k-means），可复跑 |
| `docs/shell-notes.md` `docs/dom-notes.md` | 宿主令牌机制、尺寸与硬编码色的实测记录（不含厂商 CSS 转存） |

---

## 12. 令牌表

**表面 surfaces**

| token | 用在哪 | 夜驾 Night Drive | 明信片 Postcard |
| --- | --- | --- | --- |
| `--dsw-alias-bg-base` | 页面底 / 会话列 | `#150420` | `#FBF7F6` |
| `--dsw-alias-bg-layer-1` | 卡片（轨迹、计划） | `#1D082B` | `#FFFFFF` |
| `--dsw-alias-bg-layer-2` | 嵌套层、菜单 | `#250F37` | `#F4EDF7` |
| `--dsw-alias-bg-layer-3` | 浮层、选中态 | `#311546` | `#EBE2F4` |
| `--dsw-specific-sidebar-fill` | 左侧栏 | `#120320` | `#F7EFF6` |
| `--dsw-specific-input-major` | 输入框卡片 | `#250F37` | `#FFFFFF` |
| `--dsw-specific-bubble` | 自己的气泡 | `#380F27` | `#FFE3EF` |
| `--dsw-alias-markdown-code-block` | 代码 / 工具输出底 | `#120219` | `#F5EEF3` |
| `--dsw-alias-bg-overlay` | 弹出层 | `#2A113D` | `#F7F2F9` |

**文字 text**

| token | 用在哪 | 夜驾 Night Drive | 明信片 Postcard |
| --- | --- | --- | --- |
| `--dsw-alias-label-primary` | 正文、标题 | `#F8F2F7` | `#21102E` |
| `--dsw-alias-label-secondary` | 次级说明、工具参数 | `#CDBAD8` | `#54415E` |
| `--dsw-alias-label-tertiary` | 时间、路径、会话元信息 | `#A38FB4` | `#736180` |
| `--dsw-alias-label-caption` | 占位符、行内小标签 | `#A38FB4` | `#736180` |
| `--dsw-alias-label-quaternary` | 计数、极弱元信息（不承担信息） | `#7C6991` | `#9B8CA6` |
| `--dsw-alias-label-primary-inverted` | 反色字（图标叠在亮底上） | `#0D0116` | `#E7DFEF` |

**描边 hairlines**

| token | 用在哪 | 夜驾 Night Drive | 明信片 Postcard |
| --- | --- | --- | --- |
| `--dsw-alias-border-l1` | 卡片内分隔 | `#ffd9c617` | `#21102e14` |
| `--dsw-alias-border-l2` | 卡片描边、输入框描边 | `#ffd9c629` | `#21102e21` |
| `--dsw-alias-border-l3` | 栏位分隔、标签页基线 | `#ffd9c638` | `#21102e2e` |
| `--dsw-alias-border-l4` | 需要强调的分隔 | `#ffd9c64d` | `#21102e3d` |
| `--dsw-alias-separator-primary` | shell 消费但未声明的空槽（本主题补上） | `#ffd9c61a` | `#21102e17` |
| `--dsw-elevation-stroke-color` | 所有 elevation 的 0.5px 描边 | `#ffd9c61f` | `#21102e1a` |

**信号 signals**

| token | 用在哪 | 夜驾 Night Drive | 明信片 Postcard |
| --- | --- | --- | --- |
| `--dsw-alias-brand-primary` | 行动：主按钮、链接强调底 | `#FF5CA8` | `#D1116E` |
| `--dsw-alias-brand-primary-new-colorprimary-new-color` | 轨迹里的“当前”标记 | `#FF5CA8` | `#D1116E` |
| `--dsw-alias-state-business-primary` | 进行中 / 交互强调（光标、标签页下划线） | `#58E6D6` | `#087069` |
| `--dsw-alias-link` | 链接、引用、信息 | `#58E6D6` | `#087069` |
| `--dsw-alias-state-warn-primary` | 警告 | `#FFB65C` | `#9A5600` |
| `--dsw-alias-state-error-primary` | 错误 | `#FF5E72` | `#C1213A` |
| `--dsw-alias-state-success-primary` | 成功 / 工具退出 0 | `#45D98A` | `#0B7442` |
| `--dsw-alias-state-done-primary` | 已完成计划项 | `#B98CFF` | `#6B3BC2` |
| `--dsw-alias-state-idle-primary` | 空闲圆点 | `#A38FB4` | `#736180` |

**手势（唯一的两处渐变）**

| token | 用在哪 | 夜驾 Night Drive | 明信片 Postcard |
| --- | --- | --- | --- |
| `--dsw-alias-label-deep-diving-shimmer` | 思考 / 运行中的文字渐变 | `linear-gradient(100deg, #FF2E8F 0%, #FF5F55 52%, #FFA24A 100%)` | `linear-gradient(100deg, #D9126F 0%, #E4572E 55%, #E8892A 100%)` |
| `--dsw-alias-label-deep-diving` | 其回落文字色 | `#CDBAD8` | `#54415E` |
| `--dsw-alias-button-info-fill` | 发送键底（shell 里唯一消费者） | `linear-gradient(100deg, #C2146E 0%, #D8391F 55%, #E0691A 100%)` | `linear-gradient(100deg, #C4106A 0%, #D8401C 55%, #E4572E 100%)` |
| `--dsw-alias-button-info-hover` | 发送键悬停 | `linear-gradient(100deg, #D6247C 0%, #E8462A 55%, #EE7A24 100%)` | `linear-gradient(100deg, #BE1068 0%, #D03C1C 55%, #D8661A 100%)` |

**代码与 diff**

| token | 用在哪 | 夜驾 Night Drive | 明信片 Postcard |
| --- | --- | --- | --- |
| `--dsw-alias-markdown-inline-code` | 行内代码底 | `#ff5ca829` | `#d1116e1a` |
| `--shiki-token-keyword` | 关键字 | `#FF5CA8` | `#D1116E` |
| `--shiki-token-string` | 字符串 | `#FFC07A` | `#8A5510` |
| `--shiki-token-function` | 函数 | `#58E6D6` | `#087069` |
| `--shiki-token-comment` | 注释 | `#7E6B92` | `#8A7695` |
| `--dsw-alias-file-diff-added-bg` | 新增行底 | `#45d98a1a` | `#0b744214` |
| `--dsw-alias-file-diff-added-marker` | 新增标记 / +N | `#45D98A` | `#0B7442` |
| `--dsw-alias-file-diff-deleted-bg` | 删除行底 | `#ff5e721a` | `#c1213a12` |
| `--dsw-alias-file-diff-deleted-marker` | 删除标记 / −N | `#FF5E72` | `#C1213A` |
