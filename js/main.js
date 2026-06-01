// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('research-grid');
  if (!gridContainer) return;

  // 加载 publications.json 数据
  fetch('data/publications.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!data.length) {
        gridContainer.innerHTML = '<div class="loading-placeholder">No publications found.</div>';
        return;
      }
      renderCards(data, gridContainer);
    })
    .catch(error => {
      console.error('Failed to load publications:', error);
      gridContainer.innerHTML = '<div class="loading-placeholder">⚠️ Unable to load research data. Please try again later.</div>';
    });
});

/**
 * 渲染研究成果卡片
 * @param {Array} publications 成果列表
 * @param {HTMLElement} container 容器元素
 */
function renderCards(publications, container) {
  container.innerHTML = '';
  // 按年份降序排序（假设 json 中有 year 字段，若没有就按原顺序）
  const sorted = [...publications].sort((a, b) => (b.year || 0) - (a.year || 0));

  for (const pub of sorted) {
    const card = document.createElement('article');
    card.className = 'card';

    // 缩略图区域（无图则显示占位符）
    const thumbDiv = document.createElement('div');
    thumbDiv.className = 'card-thumb';
    if (pub.thumbnail) {
      // 如果有真实缩略图路径，创建一个img
      const img = document.createElement('img');
      img.src = pub.thumbnail;
      img.alt = pub.title;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      thumbDiv.appendChild(img);
    } else {
      thumbDiv.innerHTML = '<i class="fas fa-flask" style="opacity:0.5; font-size: 2rem;"></i><span style="margin-left:6px;">preprint</span>';
    }

    // 内容区
    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-content';

    // 标题 + 链接到详情页
    const titleLink = document.createElement('a');
    titleLink.href = pub.pageUrl;
    titleLink.textContent = pub.title;
    const titleElem = document.createElement('h3');
    titleElem.className = 'card-title';
    titleElem.appendChild(titleLink);
    contentDiv.appendChild(titleElem);

    // 作者
    const authorsElem = document.createElement('div');
    authorsElem.className = 'card-authors';
    authorsElem.textContent = pub.authors || 'Your Name et al.';
    contentDiv.appendChild(authorsElem);

    // 发表信息
    const venueElem = document.createElement('div');
    venueElem.className = 'card-venue';
    venueElem.textContent = pub.venue || '';
    contentDiv.appendChild(venueElem);

    // 摘要（截取前120字，也可完整显示后限制行数css处理）
    const abstractElem = document.createElement('div');
    abstractElem.className = 'card-abstract';
    let abstractText = pub.abstract || '';
    if (abstractText.length > 140) abstractText = abstractText.slice(0, 137) + '...';
    abstractElem.textContent = abstractText;
    contentDiv.appendChild(abstractElem);

    // 链接按钮组（pdf / code）
    const linksDiv = document.createElement('div');
    linksDiv.className = 'card-links';
    if (pub.pdfUrl) {
      const pdfLink = document.createElement('a');
      pdfLink.href = pub.pdfUrl;
      pdfLink.target = '_blank';
      pdfLink.innerHTML = '<i class="fas fa-file-pdf"></i> PDF';
      linksDiv.appendChild(pdfLink);
    }
    if (pub.codeUrl) {
      const codeLink = document.createElement('a');
      codeLink.href = pub.codeUrl;
      codeLink.target = '_blank';
      codeLink.innerHTML = '<i class="fab fa-github"></i> Code';
      linksDiv.appendChild(codeLink);
    }
    if (linksDiv.children.length === 0) {
      // 若没有任何链接，可展示详情入口
      const detailsLink = document.createElement('a');
      detailsLink.href = pub.pageUrl;
      detailsLink.innerHTML = '<i class="fas fa-book-open"></i> Details →';
      linksDiv.appendChild(detailsLink);
    }
    contentDiv.appendChild(linksDiv);

    card.appendChild(thumbDiv);
    card.appendChild(contentDiv);
    container.appendChild(card);
  }
}
