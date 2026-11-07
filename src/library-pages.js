import {articleTopics, resourceTypes, articles, resources} from './library.js';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const back = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H5m6-7-7 7 7 7"/></svg>';
export const escapeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const topicFor = id => articleTopics.find(topic => topic.id === id);
export const publishedArticles = (items = articles) => items.filter(item => item.status === 'published' && topicFor(item.category));
export function safeExternalUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
const filters = (items, active) => `<div class="library-filters" role="group" aria-label="分类筛选">${[{id:'all',name:'全部'}, ...items].map(item => `<button type="button" data-filter="${item.id}" aria-pressed="${active === item.id}">${escapeText(item.name)}</button>`).join('')}</div>`;
const topicIndex = items => `<div class="topic-index">${items.map((item, index) => `<div><span class="eyebrow">0${index + 1}</span><h2>${escapeText(item.name)}</h2><p>${escapeText(item.description)}</p></div>`).join('')}</div>`;
const emptyState = (title, text) => `<div class="library-empty"><span class="empty-mark" aria-hidden="true">—</span><h2>${title}</h2><p>${text}</p></div>`;

export function articleResults(category = 'all', items = articles) {
  const published = publishedArticles(items);
  const filtered = published.filter(article => category === 'all' || article.category === category);
  if (!filtered.length) return emptyState(published.length ? '该分类暂无文章' : '文章整理中', published.length ? '可以切换分类，浏览其他文章。' : '关于 AI、HR 与 Vibe Coding 的思考与实践，将在这里陆续更新。');
  return `<div class="writing-list">${filtered.map(article => `<a class="writing-row" href="#/article/${encodeURIComponent(article.id)}"><div class="writing-meta"><span>${escapeText(topicFor(article.category).name)}</span>${article.date ? `<time datetime="${escapeText(article.date)}">${escapeText(article.date)}</time>` : ''}</div><div class="writing-text"><h2>${escapeText(article.title)}</h2><p>${escapeText(article.summary)}</p></div>${arrow}</a>`).join('')}</div>`;
}

export function resourceResults(category = 'all', items = resources) {
  const available = items.filter(resource => resourceTypes.some(type => type.id === resource.category));
  const filtered = available.filter(resource => category === 'all' || resource.category === category);
  if (!filtered.length) return emptyState(available.length ? '该分类暂无资源' : '资源清单整理中', available.length ? '可以切换分类，查看其他工具与资源。' : '工具、插件、Skills 与 UI 参考将在这里持续更新。');
  return `<div class="resource-grid">${filtered.map(resource => { const url = safeExternalUrl(resource.url); const body = `<span class="eyebrow">${escapeText(resourceTypes.find(type => type.id === resource.category).name)}</span><h2>${escapeText(resource.name)}</h2><p>${escapeText(resource.description)}</p><span class="resource-domain">${escapeText(url ? new URL(url).hostname : resource.linkLabel || 'Link pending')}</span>${url ? arrow : ''}`; return url ? `<a class="resource-card" href="${escapeText(url)}" target="_blank" rel="noopener noreferrer">${body}</a>` : `<div class="resource-card is-pending">${body}</div>`; }).join('')}</div>`;
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
  main.innerHTML = `<div class="page library-page writing-page"><header class="page-intro"><h1 class="display-heading">Writing<span class="heading-period">.</span></h1><div class="intro-aside"><p class="intro-chinese">AI、HR 与 Vibe Coding。</p><p>关于技术应用、人才工作<br>与产品实践的文章。</p></div></header>${topicIndex(articleTopics)}${filters(articleTopics, 'all')}<section class="library-results" aria-live="polite" aria-label="文章列表">${articleResults()}</section></div>`;
  bindFilters(main, articleResults);
}

export function renderToolkit(main) {
  main.innerHTML = `<div class="page library-page toolkit-page"><header class="page-intro"><h1 class="display-heading">Toolkit<span class="heading-period">.</span></h1><div class="intro-aside"><p class="intro-chinese">工具与资源。</p><p>AI 工具、DSH 插件、Skills<br>与 UI 参考，按用途整理。</p></div></header>${topicIndex(resourceTypes)}${filters(resourceTypes, 'all')}<section class="library-results" aria-live="polite" aria-label="工具与资源列表">${resourceResults()}</section></div>`;
  bindFilters(main, resourceResults);
}

export function articleMarkup(id, items = articles) {
  const article = publishedArticles(items).find(item => item.id === id);
  if (!article) return null;
  return `<article class="page writing-detail"><a class="back-link" href="#/writing">${back}全部文章</a><header class="writing-detail-header"><p class="eyebrow">${escapeText(topicFor(article.category).name)}${article.date ? ` / <time datetime="${escapeText(article.date)}">${escapeText(article.date)}</time>` : ''}</p><h1>${escapeText(article.title)}</h1><p class="writing-summary">${escapeText(article.summary)}</p></header><div class="writing-body">${(article.sections || []).map(section => `<section>${section.heading ? `<h2>${escapeText(section.heading)}</h2>` : ''}${(section.paragraphs || []).map(paragraph => `<p>${escapeText(paragraph)}</p>`).join('')}${section.items?.length ? `<ul>${section.items.map(item => `<li>${escapeText(item)}</li>`).join('')}</ul>` : ''}</section>`).join('')}</div><a class="text-link" href="#/writing">返回文章目录 ${back}</a></article>`;
}

export function renderArticle(main, id) {
  let decodedId;
  try { decodedId = decodeURIComponent(id); } catch { return null; }
  const markup = articleMarkup(decodedId);
  if (!markup) return null;
  main.innerHTML = markup;
  return publishedArticles().find(article => article.id === decodedId).title;
}
