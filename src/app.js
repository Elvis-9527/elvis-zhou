import {profile, projects, experience} from './content.js';
import {renderWriting, renderToolkit, renderArticle, topicIndex, loadArticleContent} from './library-pages.js';
import {initEffects} from './effects.js';
const main = document.querySelector('#main');
const header = document.querySelector('#header');
const footer = document.querySelector('#footer');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>';
const diagonal = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const back = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H5m6-7-7 7 7 7"/></svg>';
const emailIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
const githubIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.9a5.4 5.4 0 0 0-1.5-3.8A5 5 0 0 0 18.7 1S17.5.6 15 2.4a13 13 0 0 0-6 0C6.5.6 5.3 1 5.3 1a5 5 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.8c0 5.4 3.2 6.6 6.2 6.9a3.4 3.4 0 0 0-.9 2.6V22"/></svg>';
const wechatIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 8.5c-.4-3-3-5-6-5C4.9 3.5 2 6 2 9c0 1.7.9 3.3 2.4 4.3L4 16l3-1.5 1.5.1"/><path d="M22 14c0-3-2.8-5.5-6.2-5.5s-6.3 2.5-6.3 5.5 2.8 5.5 6.3 5.5l1.7-.2 3 1.2-.5-2.6c1.3-1 2-2.4 2-3.9Z"/><circle cx="6" cy="8" r=".65" fill="currentColor" stroke="none"/><circle cx="10" cy="8" r=".65" fill="currentColor" stroke="none"/><circle cx="13.5" cy="13.5" r=".65" fill="currentColor" stroke="none"/><circle cx="18" cy="13.5" r=".65" fill="currentColor" stroke="none"/></svg>';
const speaker = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9v6h4l4 4V5L8 9H4Z"/><path class="sound-wave" d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="sound-cross" d="m17 10 4 4m0-4-4 4"/></svg>';
let sceneTimer;
let motionEnabled = !reducedMotion.matches;
let sceneReady = false;
let soundOn = false;
let previousRoute = '';
let linkNavigation = false;
const scrollPositions = new Map();
history.scrollRestoration = 'manual';
const asset = file => `./assets/projects/${file}`;
const linkButton = (label, href, extra = '') => `<a class="text-link" href="${href}" ${extra}><span>${label}</span>${diagonal}</a>`;
const workTopics = [
  {name: '产品', description: '把日常任务做成可使用的工具'},
  {name: '研究', description: '整理信息，核验来源，形成判断'},
  {name: '实践', description: '把 AI 与方法带回真实工作'},
];
const aboutTopics = [
  {name: '人才与组织', description: '关注业务需求、人才市场与员工融入'},
  {name: '研究与判断', description: '整理信息、核验来源，为判断提供参考'},
  {name: 'AI 实践', description: '探索工具、流程与知识管理的实际应用'},
];
function renderHeader(route) {
  header.classList.remove('menu-open');
  header.innerHTML = `<a class="wordmark" href="#/" aria-label="${profile.name}，返回首页">${profile.name}.</a>
    <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="展开导航"><span>Menu</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></button>
    <nav id="primary-nav" aria-label="主导航">${[['work','作品'],['writing','文章'],['toolkit','工具'],['about','关于'],['contact','联系']].map(([id,label]) => `<a href="#/${id}" ${route === id || (id === 'work' && route === 'project') || (id === 'writing' && route === 'article') || (id === 'about' && route === 'resume') ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
  header.querySelector('.nav-toggle').onclick = () => {
    const open = header.classList.toggle('menu-open');
    header.querySelector('.nav-toggle').setAttribute('aria-expanded', String(open));
    header.querySelector('.nav-toggle').setAttribute('aria-label', open ? '收起导航' : '展开导航');
  };
  header.querySelector('nav').addEventListener('click', event => {
    const anchor = event.target.closest('a');
    if (anchor) closeMobileMenu(anchor.hash === location.hash);
  });
}
function closeMobileMenu(restoreFocus = false) {
  header.classList.remove('menu-open');
  const toggle = header.querySelector('.nav-toggle');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', '展开导航');
  if (restoreFocus) toggle?.focus();
}
function renderFooter() {
  footer.innerHTML = `<div class="footer-grid"><div class="footer-block footer-identity"><a class="wordmark" href="#/">${profile.name}.</a><span>${profile.role}</span></div><a class="footer-action" href="#/contact"><span>联系我</span>${diagonal}</a><a class="footer-action" href="#/"><span>返回花谷</span>${diagonal}</a></div>`;
}
function scenePost(action) {
  const frame = document.querySelector('#valley-frame');
  if (frame?.contentWindow) frame.contentWindow.postMessage({type:'portfolio-scene', action}, location.origin);
}
function updateSceneControls() {
  const motion = document.querySelector('#motion');
  const sound = document.querySelector('#sound');
  if (motion) { motion.setAttribute('aria-pressed', String(motionEnabled)); motion.textContent = motionEnabled ? '暂停动态' : '开启动态'; }
  if (sound) {
    sound.disabled = !sceneReady || !motionEnabled;
    sound.setAttribute('aria-pressed', String(soundOn));
    sound.setAttribute('aria-label', soundOn ? '关闭环境音效' : '开启环境音效');
    sound.title = soundOn ? '关闭环境音效' : '开启环境音效';
  }
}
function mountScene() {
  clearTimeout(sceneTimer);
  const layer = document.querySelector('#scene-layer');
  if (!layer) return;
  layer.querySelector('iframe')?.remove();
  sceneReady = false;
  soundOn = false;
  layer.classList.remove('is-ready');
  if (motionEnabled) {
    const frame = document.createElement('iframe');
    frame.id = 'valley-frame';
    frame.src = './assets/valley.html';
    frame.title = '交互式夜间花谷';
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.allow = 'autoplay';
    layer.append(frame);
    sceneTimer = setTimeout(() => {
      if (!sceneReady && document.querySelector('#scene-layer')) { motionEnabled = false; mountScene(); }
    }, 22000);
  }
  updateSceneControls();
}
function renderHome() {
  main.innerHTML = `<section class="home" aria-labelledby="home-title">
    <div class="scene-layer" id="scene-layer"><img class="scene-poster" src="./assets/valley-poster.webp" alt="" fetchpriority="high"></div>
    <div class="home-content">
      <h1 id="home-title">Ideas, in bloom.</h1>
      <div class="home-caption"><p><span class="identity-name">${profile.name}.</span><span class="caption-divider" aria-hidden="true"> / </span><span class="identity-role">${profile.role}</span></p><p>${profile.introduction}</p></div>
      <a href="#/work" class="home-cta" id="enter-work"><span class="circle-arrow">${arrow}</span><span>查看作品</span></a>
    </div>
    <div class="home-bottom"><div class="scene-controls"><span class="wander-label">滚动，漫游花谷</span><button id="motion" aria-pressed="true">暂停动态</button><span class="control-divider" aria-hidden="true"></span><button class="sound" id="sound" aria-pressed="false" aria-label="开启环境音效">${speaker}</button></div></div>
  </section>`;
  mountScene();
  document.querySelector('#motion').onclick = () => { motionEnabled = !motionEnabled; mountScene(); };
  document.querySelector('#sound').onclick = () => scenePost('sound');
  const cta = document.querySelector('#enter-work');
  cta.addEventListener('pointerenter', () => scenePost('hover-in'));
  cta.addEventListener('pointerleave', () => scenePost('hover-out'));
  cta.addEventListener('focus', () => scenePost('hover-in'));
  cta.addEventListener('blur', () => scenePost('hover-out'));
}
function researchVisual() {
  return `<div class="research-visual" aria-label="研究流程：定义问题、收集信息、形成判断"><span class="visual-label">RESEARCH / FRAMEWORK</span><div class="research-heading">让信息<br><span>形成判断。</span></div><div class="research-flow"><span>定义问题</span><i></i><span>收集信息</span><i></i><span>形成判断</span></div><span class="visual-bottom">海外竞品调研体系</span></div>`;
}
function projectVisual(project, detail = false) {
  if (project.id === 'research') return researchVisual();
  if (project.id === 'ledger') return `<div class="product-stage ledger-stage"><span class="stage-label">XIAOZHOU LEDGER</span><div class="phone-composition">${[['today','今日收支'],['transactions','流水查询'],['entry','记一笔']].map(([file,label]) => `<div class="phone-frame"><img src="${asset(`ledger-${file}.webp`)}" alt="小周记账 · ${label}" width="322" height="698" loading="${detail ? 'eager' : 'lazy'}"></div>`).join('')}</div><span class="stage-footnote">记录 / 查询 / 分析</span></div>`;
  if (project.id === 'enablement') return `<div class="publication-visual"><span>AI 赋能系列</span><strong>AI IN<br>PRACTICE<span>.</span></strong><div>理解工具 <i></i> 建立方法 <i></i> 回到实践</div></div>`;
  return `<div class="product-stage screen-stage stage-${project.id}"><span class="stage-label">${project.english}</span><div class="screen-frame"><div class="window-bar" aria-hidden="true"><i></i><i></i><i></i></div><img src="${asset(project.image)}" alt="${project.imageAlt}" loading="${detail ? 'eager' : 'lazy'}" width="1400" height="788"></div><span class="stage-footnote">${project.form}</span></div>`;
}
function feature(project, index) {
  return `<a class="feature feature-${project.id}" href="#/project/${project.id}" aria-label="查看${project.name}项目详情"><div class="feature-media">${projectVisual(project)}<span class="feature-arrow">${diagonal}</span></div><div class="feature-caption"><span class="project-number">${String(index).padStart(2,'0')}</span><div><h2>${project.name}</h2><p>${project.subtitle}</p></div><span class="project-category">${project.category}</span></div></a>`;
}
function renderWork() {
  main.innerHTML = `<div class="page work-page"><section class="page-intro"><h1 class="display-heading">Work<span class="heading-period">.</span></h1><div class="intro-aside"><p class="intro-chinese">作品</p><p>产品、研究与 AI 实践</p></div></section>${topicIndex(workTopics)}
    <section class="featured staggered-gallery" aria-label="全部六个项目">${projects.map((p,i) => feature(p,i+1)).join('')}</section>
    <section class="closing"><p>关于实践，也关于新的可能。</p><a href="#/contact">保持联系${diagonal}</a></section></div>`;
}
function sectionMarkup(section, index) {
  return `<section class="case-section"><div class="case-section-label"><span>${String(index + 1).padStart(2,'0')}</span><h2>${section.title}</h2></div><div class="case-section-content">${section.text ? `<p>${section.text}</p>` : ''}${section.items ? `<dl>${section.items.map(([term,desc]) => `<div><dt>${term}</dt><dd>${desc}</dd></div>`).join('')}</dl>` : ''}${section.steps ? `<ol class="process-list">${section.steps.map(([title,text],i) => `<li><span>${String(i+1).padStart(2,'0')}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}</ol>` : ''}</div></section>`;
}
function renderProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) { renderNotFound(); return; }
  document.title = `${project.name} · ${profile.name}`;
  const next = projects[(projects.indexOf(project)+1)%projects.length];
  const special = projectVisual(project, true);
  main.innerHTML = `<article class="page case-page"><a class="back-link" href="#/work">${back}全部作品</a><header class="case-header"><p class="eyebrow">${project.category} <span>/</span> ${project.english}</p><h1 class="case-title ${/[\u4e00-\u9fff]/.test(project.name) ? 'chinese-title' : ''}">${project.name}</h1><p class="case-subtitle">${project.subtitle}</p><div class="case-meta"><div><span>工作内容</span><p>${project.scope}</p></div><div><span>成果形态</span><p>${project.form}</p></div></div></header>
  <figure class="case-visual case-visual-${project.id}">${special}<figcaption>${project.id === 'aicruit' ? 'AICruit · 登录界面' : project.id === 'entrevue' ? '项目界面' : project.id === 'knowledge' ? '知识关系图谱 · 匿名结构视图' : project.name}</figcaption></figure>
  <p class="case-lead">${project.intro}</p><div class="case-body">${project.sections.map(sectionMarkup).join('')}</div>
  ${project.secondaryImage ? `<figure class="secondary-visual"><div class="secondary-stage"><img src="${asset(project.secondaryImage)}" alt="${project.secondaryAlt}" loading="lazy" width="1400" height="788"></div><figcaption>${project.secondaryAlt}</figcaption></figure>` : ''}
  ${project.links ? `<div class="case-links">${project.links.map(l=>linkButton(l.label,l.url,'target="_blank" rel="noopener noreferrer"')).join('')}</div>` : ''}
  <a class="next-project" href="#/project/${next.id}"><div><span>下一个项目</span><h2>${next.name}</h2></div>${diagonal}</a></article>`;
}
function timeline() {
  return `<div class="timeline">${experience.map(e=>`<div class="timeline-row"><span class="period">${e.period}</span><div><h3>${e.role}</h3><p class="company">${e.company}</p><p class="experience-description">${e.text}</p></div></div>`).join('')}</div>`;
}
function renderAbout() {
  main.innerHTML = `<div class="page about-page"><section class="page-intro about-page-intro"><h1 class="display-heading">About<span class="heading-period">.</span></h1><div class="intro-aside"><p class="intro-chinese">关于</p><p>人才工作、业务研究与 AI 实践</p></div></section>${topicIndex(aboutTopics)}
  <section class="about-intro about-overview"><div><p class="eyebrow">ABOUT / 关于</p><h2 class="about-heading">理解问题。<br>连接可能。</h2></div><div class="about-statement"><p class="name-line">${profile.name}.<span>${profile.role}</span></p><p class="about-description">${profile.about}</p><p>${profile.practice}</p>${linkButton('查看简历','#/resume')}</div></section>
  <section class="focus-section" aria-labelledby="focus-title"><div class="section-heading"><h2 id="focus-title">持续关注</h2><span>AREAS OF PRACTICE</span></div><div class="focus-grid"><article><span>01 / PEOPLE</span><h3>人才与组织</h3><p>关注业务需求、人才市场与员工融入。</p></article><article><span>02 / RESEARCH</span><h3>研究与判断</h3><p>整理信息、核验来源，为业务判断提供参考。</p></article><article><span>03 / AI PRACTICE</span><h3>工具与方法</h3><p>探索 AI 的实际应用，开发工具，整理方法。</p></article></div></section>
  <section class="experience-section"><div class="section-heading"><h2>职业经历</h2><span>EXPERIENCE</span></div>${timeline()}</section>
  <section class="closing"><a href="#/work">查看作品${diagonal}</a></section></div>`;
}
function renderResume() {
  main.innerHTML = `<article class="page resume-page"><div class="resume-actions"><a class="back-link" href="#/about">${back}返回关于</a><button class="text-link" id="print-resume">打印简历 ${diagonal}</button></div><header class="resume-header"><h1>${profile.name}.</h1><p>${profile.role}</p><div class="resume-contacts"><a href="mailto:${profile.email}" aria-label="Email: ${profile.email}">${emailIcon}<span>${profile.email}</span></a><button id="resume-wechat" aria-label="WeChat: ${profile.wechat}" aria-haspopup="dialog" aria-controls="wechat-dialog">${wechatIcon}<span>${profile.wechat}</span></button></div></header><section class="resume-section"><h2>职业概述</h2><p>具备猎头与企业人力资源工作经历，关注高端人才招聘、人才研究与员工融入。持续探索 AI 在工作中的应用，开展产品实践与方法分享。</p></section><section class="resume-section"><h2>工作经历</h2>${timeline()}</section><section class="resume-section"><h2>实践方向</h2><dl class="resume-skills"><div><dt>人才招聘与融入</dt><dd>岗位需求盘点、人才研究、招聘入职与员工融入。</dd></div><div><dt>业务研究</dt><dd>市场与竞品调研、访谈准备、报告整理。</dd></div><div><dt>AI 应用</dt><dd>Vibe Coding、流程自动化、知识管理与实践分享。</dd></div></dl></section><section class="resume-section"><h2>项目实践</h2><div class="resume-projects">${projects.map(p=>`<a href="#/project/${p.id}"><strong>${p.name}</strong><span>${p.summary}</span>${diagonal}</a>`).join('')}</div></section></article>`;
  document.querySelector('#print-resume').onclick = () => window.print();
  document.querySelector('#resume-wechat').onclick = () => document.querySelector('#wechat-dialog').showModal();
}
function renderContact() {
  main.innerHTML = `<section class="page contact-page"><h1 class="contact-heading">Let's talk<span>.</span></h1><div class="contact-copy"><h2>欢迎交流。</h2><p>关于人才招聘、业务研究与 AI 应用。</p></div><div class="contact-methods"><button class="contact-card" id="open-email" aria-label="Email — View address" aria-haspopup="dialog" aria-controls="email-dialog"><span class="contact-card-icon">${emailIcon}</span><span class="contact-card-title">Email</span><span class="contact-card-action">View address</span><span class="contact-card-arrow">${diagonal}</span></button><button class="contact-card" id="open-wechat" aria-label="WeChat — View QR code" aria-haspopup="dialog" aria-controls="wechat-dialog"><span class="contact-card-icon">${wechatIcon}</span><span class="contact-card-title">WeChat</span><span class="contact-card-action">View QR code</span><span class="contact-card-arrow">${diagonal}</span></button><a class="contact-card" href="${profile.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub — View profile (opens in a new tab)"><span class="contact-card-icon">${githubIcon}</span><span class="contact-card-title">GitHub</span><span class="contact-card-action">View profile</span><span class="contact-card-arrow">${diagonal}</span></a></div></section>`;
  document.querySelector('#open-email').onclick = () => {
    const address = document.querySelector('#email-address');
    address.textContent = profile.email;
    address.href = `mailto:${profile.email}`;
    document.querySelector('#email-dialog').showModal();
  };
  document.querySelector('#open-wechat').onclick = () => document.querySelector('#wechat-dialog').showModal();
}
function renderNotFound() {
  document.title = `页面未找到 · ${profile.name}`;
  main.innerHTML = `<section class="page not-found"><p class="eyebrow">404</p><h1>此处尚无内容。</h1><p>可以从作品集继续浏览。</p>${linkButton('返回作品','#/work')}</section>`;
}
let renderVersion = 0;
let effectsTimer;
async function render() {
  if (location.hash === '#main') { main.focus(); return; }
  const version = ++renderVersion;
  clearTimeout(effectsTimer);
  const hash = location.hash || '#/';
  if (previousRoute) scrollPositions.set(previousRoute, window.scrollY);
  clearTimeout(sceneTimer);
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  const [route = '', id] = hash.replace(/^#\/?/,'').split('/');
  document.body.classList.toggle('is-home', !route);
  document.title = `${profile.name} · ${profile.role}`;
  const pageTitles = {work:'作品',writing:'文章',toolkit:'工具',about:'关于',resume:'简历',contact:'联系'};
  if (pageTitles[route]) document.title = `${pageTitles[route]} · ${profile.name}`;
  renderHeader(route);
  renderFooter();
  if (!route) renderHome();
  else if (route === 'work') renderWork();
  else if (route === 'project') renderProject(id);
  else if (route === 'writing') renderWriting(main);
  else if (route === 'toolkit') renderToolkit(main);
  else if (route === 'article') {
    main.innerHTML = '<section class="page" aria-busy="true"><p role="status">正在载入文章…</p></section>';
    try { await loadArticleContent(); } catch {
      if (version !== renderVersion) return;
      main.innerHTML = '<section class="page"><p>文章暂时无法载入，请刷新重试。</p></section>';
      return;
    }
    if (version !== renderVersion) return;
    const title = renderArticle(main, id);
    if (title) document.title = `${title} · ${profile.name}`;
    else {
      document.title = `文章未找到 · ${profile.name}`;
      main.innerHTML = `<section class="page not-found"><p class="eyebrow">WRITING</p><h1>文章暂未发布。</h1><p>可以返回文章目录，浏览已发布内容。</p>${linkButton('返回文章目录','#/writing')}</section>`;
    }
  }
  else if (route === 'about') renderAbout();
  else if (route === 'resume') renderResume();
  else if (route === 'contact') renderContact();
  else renderNotFound();
  const restoreScroll = route === 'work' || (previousRoute && !linkNavigation);
  const position = restoreScroll ? (scrollPositions.get(hash) || 0) : 0;
  window.scrollTo({top:position,behavior:'instant'});
  if (previousRoute) main.focus({preventScroll:true});
  previousRoute = hash;
  linkNavigation = false;
  // Initialise React Bits effects after DOM is settled
  effectsTimer = setTimeout(() => initEffects(route), 80);
}
window.addEventListener('message', event => {
  const frame = document.querySelector('#valley-frame');
  if (event.origin !== location.origin || event.source !== frame?.contentWindow || event.data?.type !== 'portfolio-scene-status') return;
  if (event.data.ready) {
    clearTimeout(sceneTimer);
    sceneReady = true;
    document.querySelector('#scene-layer')?.classList.add('is-ready');
  }
  if (typeof event.data.soundOn === 'boolean') soundOn = event.data.soundOn;
  if (event.data.error) { motionEnabled = false; mountScene(); }
  updateSceneControls();
});
document.addEventListener('click', event => {
  if (header.classList.contains('menu-open') && !header.contains(event.target)) closeMobileMenu();
  const anchor = event.target.closest('a[href^="#/"]');
  if (anchor && anchor.hash !== location.hash && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) linkNavigation = true;
});
window.addEventListener('hashchange', render);
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) { closeMobileMenu(true); return; }
  if (event.key === 'Escape' && !document.querySelector('dialog[open]') && location.hash.startsWith('#/project/')) location.hash = '#/work';
});
window.matchMedia('(min-width:761px)').addEventListener('change', () => closeMobileMenu());
document.querySelector('.skip').addEventListener('click', event => { event.preventDefault(); main.focus(); });
document.querySelector('#wechat-id').textContent = profile.wechat;
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  const dialog = event.currentTarget;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
}));
reducedMotion.addEventListener('change', event => { motionEnabled = !event.matches; if (document.body.classList.contains('is-home')) mountScene(); });
render();
