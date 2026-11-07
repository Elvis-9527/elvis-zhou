# Elvis Zhou · 个人站 V3

花谷入口、作品展厅、六个项目详情、文章、工具、关于、职业简历与联系页面。

## 本地预览

需要 Node.js，无需安装依赖。

```powershell
npm start
```

打开 http://127.0.0.1:4176 。`npm run check` 检查脚本语法。

使用本地服务器访问，不直接双击 HTML；页面通过 ES Modules 加载内容。

## 结构

- `index.html`：站点入口。
- `src/content.js`：统一身份、经历与六个项目文案。
- `src/library.js`：文章、工具资源及分类。目前文章待用户提供，首批 19 项资源已确认。
- `src/library-pages.js`：文章目录、文章详情、工具资源与分类筛选。
- `src/app.js`：页面组合、导航、场景与联系交互。
- `src/styles.css`：视觉系统、V2 参考字体层级、响应式与简历打印样式。
- `assets/valley.html`：原版花谷引擎与场景，隔离于 iframe，仅首页加载。
- `assets/valley-poster.png`：实际场景静帧，用于加载与减少动态模式。
- `assets/atlas.html`：现有匿名知识图谱快照。
- `assets/projects`：项目图片；AICruit 界面中的个人数据已替换为示例数据。

## 来源与边界

花谷来源于现有 Fernhollow 实作，保留 Gladeye 场景与引擎，使用权限沿用该项目提供的依据，页脚保留署名。字体沿用已有 Antonio 与 Manrope 字体资源，中文使用系统字体。

项目截图来自 V1，职业内容根据既有资料整理为公开版，未将测试次数、内部篇数或未经核对的职级作为对外成果。AICruit 截图在 V3 副本中重新处理；旧版文件未修改。

字体采用混合方案：展示级标题使用 Cormorant Garamond，正文与中文界面保持 Manrope，导航与 UI 标签使用 Inter，项目编号、日期和资源域名使用 JetBrains Mono；字体文件均为本地资源。

设计、文案规则与验收记录：`D:\AI工作区\10-项目\20261106-个人站V3设计\设计与验收.md`。

当前仅本地预览，未提交或发布。预览服务器仅监听本机。公开托管时只需站点入口、src 与 assets；需用户确认后再发布。

## 文章与资源维护

文章入口 `#/writing`，工具入口 `#/toolkit`。在 `src/library.js` 中维护数据。分类无内容时显示空状态，不生成虚构文章。

每篇文章包含：

- `id`：稳定且唯一的 URL 标识，例如 `hr-research-notes`。
- `category`：`ai`、`hr` 或 `vibe-coding`。
- `status`：`published` 才会出现在目录并可通过 `#/article/<id>` 访问。未定稿内容不应放入待部署文件；隐藏状态不构成访问权限保护。
- `title`、`summary`：标题与摘要。
- `date`：可选，格式 `YYYY-MM-DD`，只填写真实日期。
- `sections`：正文小节数组，每节可含 `heading`、`paragraphs`（段落数组）、`items`（列表数组）。文字按纯文本转义，不执行 HTML。

每条工具资源包含 `name`、`category`、`description`、`url`。分类可选 `ai-tools`、`dsh-plugins`、`skills`、`ui-references`。链接使用不含账号凭据的 HTTPS 地址；以新标签页打开。官网、文档或仓库页面均可。暂未确认公开地址的 DSH 插件与 Skill 使用 `url: null`，页面会以不可点击的待补链接卡片展示，不伪造地址。

手机导航由 Menu 按钮展开，支持 Escape 收起、点击页面外侧收起、跳转后收起。桌面直接展示五个导航入口。
