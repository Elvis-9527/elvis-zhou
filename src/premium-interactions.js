// 个人站 V3 - 高级感交互增强

// 鼠标跟随光晕效果
let mouseX = 50;
let mouseY = 50;
let targetX = 50;
let targetY = 50;
const smoothness = 0.15;

function updateMousePosition(e) {
  mouseX = (e.clientX / window.innerWidth) * 100;
  mouseY = (e.clientY / window.innerHeight) * 100;
}

function animateMouseGlow() {
  targetX += (mouseX - targetX) * smoothness;
  targetY += (mouseY - targetY) * smoothness;

  document.documentElement.style.setProperty('--mouse-x', `${targetX}%`);
  document.documentElement.style.setProperty('--mouse-y', `${targetY}%`);

  requestAnimationFrame(animateMouseGlow);
}

// 仅在非触摸设备上启用
if (!('ontouchstart' in window)) {
  document.addEventListener('mousemove', updateMousePosition);
  animateMouseGlow();
}

// 花谷页面实践标签（如果不存在则创建）
function initPracticeTags() {
  if (!document.body.classList.contains('is-home')) return;

  const homeBottom = document.querySelector('.home-bottom');
  if (!homeBottom) return;

  // 检查是否已存在
  if (document.querySelector('.practice-tags')) return;

  const tags = document.createElement('div');
  tags.className = 'practice-tags';
  tags.innerHTML = `
    <span>TALENT</span>
    <span>AI PRACTICE</span>
    <span>KNOWLEDGE</span>
  `;

  const home = document.querySelector('.home');
  if (home) {
    home.appendChild(tags);
  }
}

// 延迟初始化，等待 DOM 完全加载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPracticeTags);
} else {
  initPracticeTags();
}

// 监听路由变化，重新初始化标签
const observer = new MutationObserver(() => {
  initPracticeTags();
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});

// 工具卡片动态增强
function enhanceResourceCards() {
  const cards = document.querySelectorAll('.resource-card');

  cards.forEach(card => {
    // 如果已经增强过，跳过
    if (card.dataset.enhanced) return;
    card.dataset.enhanced = 'true';

    // 添加图标容器（如果不存在）
    if (!card.querySelector('.tool-icon')) {
      const icon = document.createElement('div');
      icon.className = 'tool-icon';
      icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
      </svg>`;
      card.insertBefore(icon, card.firstChild);
    }

    // 添加箭头（如果是链接卡片且没有箭头）
    const link = card.closest('a');
    if (link && !card.querySelector('.resource-card-arrow')) {
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('class', 'resource-card-arrow');
      arrow.setAttribute('viewBox', '0 0 24 24');
      arrow.setAttribute('fill', 'none');
      arrow.setAttribute('stroke', 'currentColor');
      arrow.setAttribute('stroke-width', '1.5');
      arrow.setAttribute('stroke-linecap', 'round');
      arrow.setAttribute('stroke-linejoin', 'round');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M7 17L17 7M17 7H7M17 7v10');
      arrow.appendChild(path);

      card.appendChild(arrow);
    }

    // 添加状态标签
    if (!card.querySelector('.status-badge')) {
      const h2 = card.querySelector('h2');
      const name = h2 ? h2.textContent.trim() : '';
      const hasUrl = card.closest('a')?.href;

      let statusClass, statusText;

      if (hasUrl && !hasUrl.includes('null')) {
        statusClass = 'status-available';
        statusText = 'AVAILABLE';
      } else if (name.includes('dsh-') || name.includes('@')) {
        statusClass = 'status-dev';
        statusText = 'DEV';
      } else {
        statusClass = 'status-internal';
        statusText = 'INTERNAL';
      }

      const badge = document.createElement('span');
      badge.className = `status-badge ${statusClass}`;
      badge.textContent = statusText;
      card.appendChild(badge);
    }
  });
}

// 监听DOM变化，动态增强新添加的卡片
const cardObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      enhanceResourceCards();
    }
  });
});

// 延迟一点执行，确保DOM已渲染
setTimeout(() => {
  enhanceResourceCards();

  // 开始监听后续变化
  const main = document.querySelector('main');
  if (main) {
    cardObserver.observe(main, {
      childList: true,
      subtree: true
    });
  }
}, 100);

// 导出函数供外部调用
export { enhanceResourceCards, initPracticeTags };
