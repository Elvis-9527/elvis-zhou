let articleContent = {};
export async function loadArticleContent() {
  ({articleContent} = await import('./article-content.js'));
}
import {articleTopics, resourceTypes, articles, resources} from './library.js';
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const back = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H5m6-7-7 7 7 7"/></svg>';
export const escapeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const topicFor = id => articleTopics.find(topic => topic.id === id);
export const publishedArticles = (items = articles) => items.filter(item => item.status === 'published' && topicFor(item.category));
const icon = body => '<svg class="resource-logo-svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">' + body + '</svg>';
const githubLogo = icon('<path fill="currentColor" d="M24 4a20 20 0 0 0-6 39c1 .2 1.3-.4 1.3-.9v-3.4c-5.4 1.2-6.5-2.3-6.5-2.3-.9-2.3-2.2-2.9-2.2-2.9-1.8-1.2.1-1.2.1-1.2 2 .1 3 2 3 2 1.8 3 4.6 2.2 5.8 1.6.2-1.3.7-2.2 1.2-2.7-4.4-.5-9-2.2-9-9.7 0-2.2.8-3.9 2.1-5.3-.2-.5-.9-2.5.2-5.2 0 0 1.7-.5 5.5 2a19 19 0 0 1 10 0c3.8-2.6 5.5-2 5.5-2 1.1 2.7.4 4.7.2 5.2 1.3 1.4 2.1 3.1 2.1 5.3 0 7.5-4.6 9.2-9 9.7.7.6 1.3 1.8 1.3 3.7v5.5c0 .5.4 1.1 1.4.9A20 20 0 0 0 24 4Z"/>');
const resourceIcon = resource => {
  const name = resource.name.toLowerCase();
  const url = safeExternalUrl(resource.url);
  if (name === 'claude') return icon('<path d="M24 7v34M7 24h34M12 12l24 24M36 12 12 36" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="24" cy="24" r="4" fill="currentColor"/>');
  if (name === 'obsidian') return icon('<path d="m24 5 14 8v22l-14 8-14-8V13L24 5Z" stroke="currentColor" stroke-width="2"/><path d="m18 27 6-11 6 11-6 4-6-4Z" fill="currentColor"/>');
  if (name === 'deepseek') return icon('<path d="M10 28c3-10 17-13 25-5-2 8-8 12-15 11-6-1-9-4-10-6Z" stroke="currentColor" stroke-width="2"/><path d="M15 21c2-4 5-6 8-8M25 22c3-1 5 0 7 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="21" cy="26" r="1.4" fill="currentColor"/>');
  if (name === 'cc switch') return icon('<path d="M31 15a10 10 0 1 0 0 18M17 15a10 10 0 1 0 0 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M27 24h-6" stroke="currentColor" stroke-width="2"/>');
  if (name === 'clash verge') return icon('<path d="M9 16c5-7 13-7 18-2s8 5 12-2M9 25c5-7 13-7 18-2s8 5 12-2M9 34c5-7 13-7 18-2s8 5 12-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
  if (name === 'openmausbot') return icon('<rect x="11" y="15" width="26" height="21" rx="5" stroke="currentColor" stroke-width="2"/><path d="M24 15V9m-4 0h8M17 25h.1M31 25h.1M18 31h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>');
  if (name.includes('guizang')) return icon('<path d="M14 14h20v20H14z" stroke="currentColor" stroke-width="2"/><path d="m20 21 4 3-4 3m7 0h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
  if (name.includes('boot-suite')) return icon('<path d="M24 8v9M18 12l6 5 6-5M12 25c0-4 5-7 12-7s12 3 12 7v9H12v-9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
  if (name.includes('shadertoy')) return icon('<path d="m24 7 15 9-15 9-15-9 15-9Z" stroke="currentColor" stroke-width="2"/><path d="m9 25 15 9 15-9M24 25v9" stroke="currentColor" stroke-width="2"/>');
  if (name.includes('universal-plugin')) return icon('<circle cx="14" cy="24" r="4" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="14" r="4" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="34" r="4" stroke="currentColor" stroke-width="2"/><path d="m18 23 12-7M18 25l12 7" stroke="currentColor" stroke-width="2"/>');
  if (name.includes('archify')) return icon('<path d="m24 8 14 8v16l-14 8-14-8V16l14-8Z" stroke="currentColor" stroke-width="2"/><path d="m16 24 5 5 11-11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
  if (name.includes('free-model')) return icon('<path d="M14 14h20v20H14zM19 19h10v10H19zM24 8v6M24 34v6M8 24h6M34 24h6" stroke="currentColor" stroke-width="2"/>');
  if (name.includes('less-ai-tone')) return icon('<path d="M10 24h28M16 15h16M16 33h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
  if (name.includes('writing-dna')) return icon('<path d="M13 36c4-10 8-20 11-24 4 4 7 14 11 24M16 29h16" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="12" r="2" fill="currentColor"/>');
  if (name === 'motion sites') return icon('<path d="M10 34V14l14-7 14 7v20l-14 7-14-7ZM10 14l14 7 14-7M24 21v20" stroke="currentColor" stroke-width="2"/>');
  if (name === 'uiverse') return icon('<rect x="10" y="10" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><rect x="26" y="10" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><rect x="10" y="26" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><rect x="26" y="26" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/>');
  if (name === 'react bits') return icon('<path d="M24 12c8 0 14 5 14 12s-6 12-14 12-14-5-14-12 6-12 14-12ZM24 7v34M7 24h34" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="3" fill="currentColor"/>');
  return url && new URL(url).hostname === 'github.com' ? githubLogo : icon('<path d="M24 8v32M8 24h32" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="10" stroke="currentColor" stroke-width="2"/>');
};
export function safeExternalUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
const filters = (items, active) => `<div class="library-filters" role="group" aria-label="分类筛选">${[{id:'all',name:'全部'}, ...items].map(item => `<button type="button" data-filter="${item.id}" aria-pressed="${active === item.id}">${escapeText(item.name)}</button>`).join('')}</div>`;
export const topicIndex = items => `<div class="topic-index">${items.map((item, index) => `<div><span class="eyebrow">0${index + 1}</span><h2>${escapeText(item.name)}</h2><p>${escapeText(item.description)}</p></div>`).join('')}</div>`;
const emptyState = (title, text) => `<div class="library-empty"><span class="empty-mark" aria-hidden="true">—</span><h2>${title}</h2><p>${text}</p></div>`;
export function articleResults(category = 'all', items = articles) {
  const published = publishedArticles(items);
  const filtered = published.filter(article => category === 'all' || article.category === category);
  if (!filtered.length) return emptyState(published.length ? '该分类暂无文章' : '文章整理中', published.length ? '可以切换分类，浏览其他文章。' : '关于 AI、HR 与 Vibe Coding 的思考与实践，将在这里陆续更新。');
  return `<div class="writing-list">${filtered.map(article => `<a class="writing-row" href="#/article/${encodeURIComponent(article.id)}"><div class="writing-meta"><span>${escapeText(topicFor(article.category).name)}</span></div><div class="writing-text"><h2>${escapeText(article.title)}</h2><p>${escapeText(article.summary)}</p></div>${arrow}</a>`).join('')}</div>`;
}
export function resourceResults(category = 'all', items = resources) {
  const available = items.filter(resource => resourceTypes.some(type => type.id === resource.category));
  const filtered = available.filter(resource => category === 'all' || resource.category === category);
  if (!filtered.length) return emptyState(available.length ? '该分类暂无资源' : '资源清单整理中', available.length ? '可以切换分类，查看其他工具与资源。' : '工具、插件、Skills 与 UI 参考将在这里持续更新。');
  return `<div class="resource-grid">${filtered.map(resource => { const url = safeExternalUrl(resource.url); const body = `<div class="resource-card-head"><span class="resource-logo" aria-hidden="true">${resourceIcon(resource)}</span></div><h2>${escapeText(resource.name)}</h2><p>${escapeText(resource.description)}</p>`; return url ? `<a class="resource-card" href="${escapeText(url)}" target="_blank" rel="noopener noreferrer">${body}</a>` : `<div class="resource-card is-pending">${body}</div>`; }).join('')}</div>`;
}
function bindFilters(main, renderResults) {
  main.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      main.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      main.querySelector('.library-results').innerHTML = renderResults(button.dataset.filter);
    });
  });
}
export function renderWriting(main) {
  main.innerHTML = `<div class="page library-page writing-page"><header class="page-intro"><h1 class="display-heading">Writing<span class="heading-period">.</span></h1><div class="intro-aside"><p class="intro-chinese">文章</p><p>关于技术应用、人才工作与产品实践</p></div></header>${topicIndex(articleTopics)}${filters(articleTopics, 'all')}<section class="library-results" aria-live="polite" aria-label="文章列表">${articleResults()}</section></div>`;
  bindFilters(main, articleResults);
}
export function renderToolkit(main) {
  main.innerHTML = `<div class="page library-page toolkit-page"><header class="page-intro"><h1 class="display-heading">Toolkit<span class="heading-period">.</span></h1><div class="intro-aside"><p class="intro-chinese">工具</p><p>AI 工具、插件、Skills 与界面参考</p></div></header>${topicIndex(resourceTypes)}${filters(resourceTypes, 'all')}<section class="library-results" aria-live="polite" aria-label="工具与资源列表">${resourceResults()}</section></div>`;
  bindFilters(main, resourceResults);
}
export function articleMarkup(id, items = articles) {
  const article = publishedArticles(items).find(item => item.id === id);
  if (!article) return null;
  const original = articleContent[article.id];
  return `<article class="page writing-detail"><a class="back-link" href="#/writing">${back}全部文章</a><header class="writing-detail-header"><p class="eyebrow">${escapeText(topicFor(article.category).name)}</p><h1>${escapeText(article.title)}</h1><div class="writing-summary">${original ? original.introHtml : `<p>${escapeText(article.summary)}</p>`}</div></header><div class="writing-body">${original ? original.bodyHtml : (article.sections || []).map(section => `<section>${section.heading ? `<h2>${escapeText(section.heading)}</h2>` : ''}${(section.paragraphs || []).map(paragraph => `<p>${escapeText(paragraph)}</p>`).join('')}${section.items?.length ? `<ul>${section.items.map(item => `<li>${escapeText(item)}</li>`).join('')}</ul>` : ''}</section>`).join('')}</div><a class="text-link" href="#/writing">返回文章目录 ${back}</a></article>`;
}
export function renderArticle(main, id) {
  let decodedId;
  try { decodedId = decodeURIComponent(id); } catch { return null; }
  const markup = articleMarkup(decodedId);
  if (!markup) return null;
  main.innerHTML = markup;
  return publishedArticles().find(article => article.id === decodedId).title;
}
