// Emit the design doc's token tables from palette.mjs — the doc never hand-copies a hex.
import { palettes } from '../palette.mjs';

const groups = [
  ['表面 surfaces', [
    ['--dsw-alias-bg-base', '页面底 / 会话列'],
    ['--dsw-alias-bg-layer-1', '卡片（轨迹、计划）'],
    ['--dsw-alias-bg-layer-2', '嵌套层、菜单'],
    ['--dsw-alias-bg-layer-3', '浮层、选中态'],
    ['--dsw-specific-sidebar-fill', '左侧栏'],
    ['--dsw-specific-input-major', '输入框卡片'],
    ['--dsw-specific-bubble', '自己的气泡'],
    ['--dsw-alias-markdown-code-block', '代码 / 工具输出底'],
    ['--dsw-alias-bg-overlay', '弹出层'],
  ]],
  ['文字 text', [
    ['--dsw-alias-label-primary', '正文、标题'],
    ['--dsw-alias-label-secondary', '次级说明、工具参数'],
    ['--dsw-alias-label-tertiary', '时间、路径、会话元信息'],
    ['--dsw-alias-label-caption', '占位符、行内小标签'],
    ['--dsw-alias-label-quaternary', '计数、极弱元信息（不承担信息）'],
    ['--dsw-alias-label-primary-inverted', '反色字（图标叠在亮底上）'],
  ]],
  ['描边 hairlines', [
    ['--dsw-alias-border-l1', '卡片内分隔'],
    ['--dsw-alias-border-l2', '卡片描边、输入框描边'],
    ['--dsw-alias-border-l3', '栏位分隔、标签页基线'],
    ['--dsw-alias-border-l4', '需要强调的分隔'],
    ['--dsw-alias-separator-primary', 'shell 消费但未声明的空槽（本主题补上）'],
    ['--dsw-elevation-stroke-color', '所有 elevation 的 0.5px 描边'],
  ]],
  ['信号 signals', [
    ['--dsw-alias-brand-primary', '行动：主按钮、链接强调底'],
    ['--dsw-alias-brand-primary-new-colorprimary-new-color', '轨迹里的“当前”标记'],
    ['--dsw-alias-state-business-primary', '进行中 / 交互强调（光标、标签页下划线）'],
    ['--dsw-alias-link', '链接、引用、信息'],
    ['--dsw-alias-state-warn-primary', '警告'],
    ['--dsw-alias-state-error-primary', '错误'],
    ['--dsw-alias-state-success-primary', '成功 / 工具退出 0'],
    ['--dsw-alias-state-done-primary', '已完成计划项'],
    ['--dsw-alias-state-idle-primary', '空闲圆点'],
  ]],
  ['手势（唯一的两处渐变）', [
    ['--dsw-alias-label-deep-diving-shimmer', '思考 / 运行中的文字渐变'],
    ['--dsw-alias-label-deep-diving', '其回落文字色'],
    ['--dsw-alias-button-info-fill', '发送键底（shell 里唯一消费者）'],
    ['--dsw-alias-button-info-hover', '发送键悬停'],
  ]],
  ['代码与 diff', [
    ['--dsw-alias-markdown-inline-code', '行内代码底'],
    ['--shiki-token-keyword', '关键字'],
    ['--shiki-token-string', '字符串'],
    ['--shiki-token-function', '函数'],
    ['--shiki-token-comment', '注释'],
    ['--dsw-alias-file-diff-added-bg', '新增行底'],
    ['--dsw-alias-file-diff-added-marker', '新增标记 / +N'],
    ['--dsw-alias-file-diff-deleted-bg', '删除行底'],
    ['--dsw-alias-file-diff-deleted-marker', '删除标记 / −N'],
  ]],
];

const cell = (v) => `\`${v}\``;
let out = '';
for (const [title, rows] of groups) {
  out += `\n**${title}**\n\n| token | 用在哪 | 夜驾 Night Drive | 明信片 Postcard |\n| --- | --- | --- | --- |\n`;
  for (const [token, use] of rows) {
    const l = palettes.light[token] ?? '—';
    const d = palettes.dark[token] ?? '—';
    out += `| ${cell(token)} | ${use} | ${cell(d)} | ${cell(l)} |\n`;
  }
}
console.log(out);
