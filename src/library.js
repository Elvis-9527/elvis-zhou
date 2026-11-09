export const articleTopics = [
  {id: 'ai', name: 'AI', description: '工具应用与工作方法'},
  {id: 'hr', name: 'HR', description: '人才、组织与业务'},
  {id: 'vibe-coding', name: 'Vibe Coding', description: '从想法到产品的开发实践'},
];

export const resourceTypes = [
  {id: 'ai-tools', name: 'AI 工具', description: '写作、研究与开发'},
  {id: 'dsh-plugins', name: 'DSH Plugins', description: '插件、模型与扩展'},
  {id: 'skills', name: 'Skills', description: '可复用的任务方法'},
  {id: 'ui-references', name: 'UI References', description: '动效、组件与界面参考'},
];

// Only published entries appear on the website. See README for content fields.
export const articles = [
  {
    "id": "okr-target",
    "title": "OKR 的目标不能让 AI 代笔",
    "summary": "O 是承诺不是文字。用 AI 代笔写出来的目标，到年底往往推不动，因为团队失去了对目标的理解和掌控感。",
    "category": "ai",
    "date": "2026-11-07",
    "status": "published"
  },
  {
    "id": "ui-baseline",
    "title": "冻结基线对界面设计的重要性",
    "summary": "小周记账改到第五版依旧不满意。个人项目也需要保存基线、记录取舍，让每一轮界面调整都有参照。",
    "category": "ai",
    "date": "2026-11-07",
    "status": "published"
  },
  {
    "id": "skill-reuse",
    "title": "大量重复工作如何标准化",
    "summary": "把重复工作的输入、输出和检查规则写成可复用的技能，让流程更稳定，也更容易交接。",
    "category": "ai",
    "date": "2026-11-07",
    "status": "published"
  },
  {
    "id": "hr-tools-fail",
    "title": "死掉的项目：智能招聘系统",
    "summary": "花了 100 多小时开发的全链路招聘系统最后失败了。不是技术做不了，而是需求定义有根本性缺陷。",
    "category": "hr",
    "date": "2026-11-07",
    "status": "published"
  },
  {
    "id": "dingtalk-structure",
    "title": "钉钉文档的真相是块结构",
    "summary": "把 AI 生成的内容导入钉钉文档失败了。不是因为 AI 写不好，而是没理解钉钉文档的块结构。",
    "category": "ai",
    "date": "2026-11-07",
    "status": "published"
  },
  {
    "id": "resume-guide",
    "title": "关于职业规划",
    "summary": "从目标公司与岗位需求出发，梳理自己的经历、能力缺口和行动路径，让职业规划落实到具体准备。",
    "category": "hr",
    "date": "2026-11-07",
    "status": "published"
  },
  {
    "id": "research-method",
    "title": "研究报告的三层分离法",
    "summary": "最常见的研究错误：把推测写成结论。事实、判断和缺口要严格分开，才能写出可信的报告。",
    "category": "ai",
    "date": "2026-11-07",
    "status": "published"
  },
  {
    "id": "condition-over-method",
    "title": "条件比方法重要",
    "summary": "一个 HR 朋友尝试工具后依然很累。方法有没有用，要看任务规模、判断标准和改变流程的余力。",
    "category": "hr",
    "date": "2026-11-07",
    "status": "published"
  }
];
export const resources = [
  {name: 'Claude', category: 'ai-tools', description: '适合长文本整理、研究分析、写作与开发协作，支持把复杂问题拆成可复核的步骤。', url: 'https://claude.ai/download'},
  {name: 'Obsidian', category: 'ai-tools', description: '本地优先的知识库，用双向链接、标签和插件把资料整理成可持续维护的网络。', url: 'https://obsidian.md/download'},
  {name: 'DeepSeek', category: 'ai-tools', description: '面向中文问答、资料整理与代码辅助的模型工具，适合快速形成初步思路。', url: 'https://www.deepseek.com/'},
  {name: 'CC Switch', category: 'ai-tools', description: '集中管理 AI 编程工具的模型、接口与配置，在不同工作环境间快速切换。', url: 'https://github.com/farion1231/cc-switch'},
  {name: 'Clash Verge', category: 'ai-tools', description: '管理代理订阅、网络协议与分流规则，方便在不同网络环境下切换连接。', url: 'https://clash-verge-rev.github.io/'},
  {name: 'OpenMausBot', category: 'ai-tools', description: '用于探索开源 Bot 交互、模型调用与自动化流程的实验项目。', url: 'https://github.com/milind-soni/OpenMausBot'},
  {name: 'dsh-guizang-design', category: 'dsh-plugins', description: '把常用的设计检查、参考整理与界面拆解收进 DSH 工作流，减少重复准备。', url: null, linkLabel: '内部插件'},
  {name: 'dsh-boot-suite', category: 'dsh-plugins', description: '为 DSH 项目提供启动阶段的场景、揭幕与交互初始化能力。', url: null, linkLabel: '内部插件'},
  {name: 'dsh-shadertoy-skin', category: 'dsh-plugins', description: '将 ShaderToy 视觉效果接入页面背景，用于测试动态材质和夜间氛围。', url: null, linkLabel: '内部插件'},
  {name: 'universal-plugin-hub', category: 'dsh-plugins', description: '集中查看与管理插件、Skills 和 MCP 资源，作为工作流的入口。', url: 'https://github.com/Ultmebius/unihub'},
  {name: '@ebony-vinyl/dsh-our-free-model', category: 'dsh-plugins', description: '围绕免费模型接入与调用方式的 DSH 实验插件，用于验证模型切换流程。', url: null, linkLabel: '内部插件'},
  {name: '@tt-ai1/archify-dsh', category: 'dsh-plugins', description: '把文字结构转换为架构图，帮助快速表达系统边界、模块与连接关系。', url: 'https://github.com/tt-ai1/archify'},
  {name: 'lieflat-less-ai-tone', category: 'skills', description: '检查并减少模板化表达，让内容保留自然语气、具体细节和个人判断。', url: null, linkLabel: '内部 Skill'},
  {name: 'writing-dna-skill', category: 'skills', description: '提取文章中的用词、句式与节奏，帮助在不同任务里保持稳定的写作风格。', url: null, linkLabel: '内部 Skill'},
  {name: 'Motion Sites', category: 'ui-references', description: '收集网页动效、转场和交互节奏，适合在实现前寻找可落地的运动参考。', url: 'https://motionsites.ai/'},
  {name: 'UIverse', category: 'ui-references', description: '提供可查看源码的 UI 组件与交互样式，用于比较结构、状态和细节处理。', url: 'https://uiverse.io/'},
  {name: 'React Bits', category: 'ui-references', description: '面向 React 的动效与组件示例，适合验证微交互和页面层次的实现方式。', url: 'https://reactbits.dev/'},
];
