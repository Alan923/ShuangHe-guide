(() => {
  'use strict';
  const data = window.SH_GUIDE_DATA;
  if (!data) return;

  const $ = (s, root = document) => root.querySelector(s);
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const categories = ['全部', '农业科技', '乡村文旅', '自然风光', '红色文化'];
  let currentCategory = '全部';
  let currentKeyword = '';
  let toastTimer = null;

  function setScrollLock() {
    document.body.classList.toggle('dialog-open', $('#detailDialog').open || $('#infoDialog').open);
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 2600);
  }

  async function shareLink(title, url) {
    if (location.protocol === 'file:') {
      toast('本地预览状态下暂不支持分享，请发布后使用。');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast('链接已复制');
    } catch (err) {
      toast('复制失败，请手动复制地址');
    }
  }

  function spotUrl(id) {
    const url = new URL(location.href);
    url.searchParams.set('spot', id);
    url.hash = '';
    return url.href;
  }

  function renderStats() {
    $('#stats').innerHTML = data.stats.map(item => `
      <div class="stat-card">
        <div class="stat-value">${escapeHtml(item.value)}${item.unit ? `<span>${escapeHtml(item.unit)}</span>` : ''}</div>
        <div class="stat-label">${escapeHtml(item.label)}</div>
      </div>
    `).join('');
  }

  function renderTown() {
    $('#townIntro').textContent = data.town.intro;
    $('#townEconomy').textContent = data.town.economy;
    $('#townAchievements').textContent = data.town.achievements;
  }

  function renderFilters() {
    $('#filters').innerHTML = categories.map(cat => `
      <button type="button" class="filter-btn${cat === currentCategory ? ' active' : ''}" data-filter="${escapeHtml(cat)}" aria-pressed="${cat === currentCategory}">${escapeHtml(cat)}</button>
    `).join('');
  }

  function getFilteredSpots() {
    const kw = currentKeyword.toLowerCase();
    return data.spots.filter(spot => {
      const categoryOk = currentCategory === '全部' || spot.category === currentCategory;
      const textPool = [spot.name, spot.shortName, spot.village, spot.label, spot.subtitle, spot.teaser].join(' ').toLowerCase();
      const keywordOk = !kw || textPool.includes(kw);
      return categoryOk && keywordOk;
    });
  }

  function renderPlaces() {
    const spots = getFilteredSpots();
    $('#placesGrid').innerHTML = spots.map((spot, index) => `
      <button type="button" class="place-card" data-spot="${escapeHtml(spot.id)}" aria-label="查看${escapeHtml(spot.name)}">
        <div class="place-image">
          <img src="${escapeHtml(spot.images[0])}" alt="${escapeHtml(spot.name)}" loading="${index < 4 ? 'eager' : 'lazy'}">
          <span class="place-badge">${escapeHtml(spot.label)}</span>
        </div>
        <div class="place-body">
          <div class="place-meta"><span>${escapeHtml(spot.village)}</span><span>${escapeHtml(spot.category)}</span></div>
          <h3 class="place-title">${escapeHtml(spot.shortName)}</h3>
          <p class="place-desc">${escapeHtml(spot.teaser)}</p>
          <div class="place-link">查看详情</div>
        </div>
      </button>
    `).join('');
    $('#emptyState').hidden = spots.length > 0;
  }

  function openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
    setScrollLock();
  }

  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
    setScrollLock();
  }

  function clearSpotParam() {
    const url = new URL(location.href);
    if (url.searchParams.has('spot')) {
      url.searchParams.delete('spot');
      history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  }

  function showSpot(id, updateUrl = true) {
    const spot = data.spots.find(item => item.id === id);
    if (!spot) return;
    closeDialog($('#infoDialog'));

    $('#detailContent').innerHTML = `
      <div class="detail-hero">
        <img src="${escapeHtml(spot.images[0])}" alt="${escapeHtml(spot.name)}">
        <button type="button" class="dialog-close" data-close="detail" aria-label="关闭">×</button>
        <div class="detail-titlebox">
          <small>${escapeHtml(spot.village)} · ${escapeHtml(spot.category)}</small>
          <h3>${escapeHtml(spot.name)}</h3>
        </div>
      </div>
      <div class="detail-body">
        <h4 class="detail-subtitle">${escapeHtml(spot.subtitle)}</h4>
        <p class="detail-teaser">${escapeHtml(spot.teaser)}</p>
        <div class="detail-highlights">${spot.highlight.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
        <div class="detail-block">
          <h4>景点介绍</h4>
          ${spot.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
        ${spot.images.length > 1 ? `
        <div class="detail-block">
          <h4>实景图片</h4>
          <div class="detail-gallery">${spot.images.slice(1).map((img, idx) => `<img src="${escapeHtml(img)}" alt="${escapeHtml(spot.shortName)}实景图${idx + 2}" loading="lazy">`).join('')}</div>
        </div>` : ''}
        <div class="detail-actions">
          <button type="button" class="detail-btn primary" data-share-spot="${escapeHtml(spot.id)}">分享此页</button>
          <button type="button" class="detail-btn" data-close="detail">返回</button>
        </div>
      </div>
    `;

    openDialog($('#detailDialog'));
    $('#detailContent').scrollTop = 0;
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('spot', id);
      history.pushState({ spot: id }, '', url.pathname + url.search + url.hash);
    }
  }

  function showInfo(title, subtitle, paragraphs, extraHtml = '') {
    closeDialog($('#detailDialog'));
    $('#infoContent').innerHTML = `
      <button type="button" class="dialog-close" data-close="info" aria-label="关闭">×</button>
      <div class="info-head">
        <small>${escapeHtml(subtitle)}</small>
        <h3>${escapeHtml(title)}</h3>
      </div>
      <div class="info-body">
        ${extraHtml}
        ${paragraphs.map(text => `<p>${escapeHtml(text)}</p>`).join('')}
      </div>
    `;
    openDialog($('#infoDialog'));
    $('#infoContent').scrollTop = 0;
  }

  renderStats();
  renderTown();
  renderFilters();
  renderPlaces();

  $('#shareBtn').addEventListener('click', () => {
    const url = new URL(location.href);
    url.searchParams.delete('spot');
    url.hash = '';
    shareLink(data.title, url.href);
  });

  $('#filters').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-filter]');
    if (!btn) return;
    currentCategory = btn.dataset.filter;
    renderFilters();
    renderPlaces();
  });

  $('#searchInput').addEventListener('input', (event) => {
    currentKeyword = event.target.value.trim();
    renderPlaces();
  });

  document.addEventListener('click', (event) => {
    const spotBtn = event.target.closest('[data-spot]');
    if (spotBtn) {
      showSpot(spotBtn.dataset.spot);
      return;
    }

    const themeBtn = event.target.closest('[data-theme]');
    if (themeBtn) {
      const theme = data.town.themes[Number(themeBtn.dataset.theme)];
      if (theme) showInfo(theme.title, theme.subtitle, [theme.body]);
      return;
    }

    const closeBtn = event.target.closest('[data-close]');
    if (closeBtn) {
      const target = closeBtn.dataset.close === 'detail' ? $('#detailDialog') : $('#infoDialog');
      closeDialog(target);
      return;
    }

    const shareSpotBtn = event.target.closest('[data-share-spot]');
    if (shareSpotBtn) {
      const spot = data.spots.find(item => item.id === shareSpotBtn.dataset.shareSpot);
      if (spot) shareLink(`${spot.name} - ${data.title}`, spotUrl(spot.id));
    }
  });

  [$('#detailDialog'), $('#infoDialog')].forEach(dialog => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
    dialog.addEventListener('close', () => {
      if (dialog.id === 'detailDialog') clearSpotParam();
      setScrollLock();
    });
  });

  window.addEventListener('popstate', () => {
    const spotId = new URL(location.href).searchParams.get('spot');
    if (spotId && data.spots.some(item => item.id === spotId)) showSpot(spotId, false);
    else closeDialog($('#detailDialog'));
  });

  const initialSpot = new URL(location.href).searchParams.get('spot');
  if (initialSpot && data.spots.some(item => item.id === initialSpot)) {
    setTimeout(() => showSpot(initialSpot, false), 80);
  }
})();
