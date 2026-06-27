'use strict';

/*-----------------------------------*\
  #NAV
\*-----------------------------------*/
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('article[data-page]');

function renderSection(target) {
  // Si on quitte la page détail, on purge le contenu pour éviter tout flash ultérieur
  if (target !== 'project-detail' && window.Portfolio && typeof window.Portfolio.resetDetail === 'function') {
    window.Portfolio.resetDetail();
  }

  navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === target));
  pages.forEach(p => p.classList.toggle('active', p.dataset.page === target));
}

function showFromHash() {
  const h = (location.hash || '').slice(1);       // sans "#"
  const proj = h.match(/^project=(.+)$/);

  if (proj) {
    // Déléguer au loader projet existant
    if (window.Portfolio && typeof window.Portfolio.openProjectById === 'function') {
      window.Portfolio.openProjectById(decodeURIComponent(proj[1]));
      return;
    }
  }

  // Sinon: navigation section (about/resume/portfolio/links)
  const wanted = h || 'about';
  const valid = new Set(Array.from(pages).map(p => p.dataset.page));
  renderSection(valid.has(wanted) ? wanted : 'about');
}

// Sync avec flèches avant/arrière + changement manuel du hash
window.addEventListener('popstate', showFromHash);
window.addEventListener('hashchange', showFromHash);

// Clic navbar -> pousse un hash de section
navLinks.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = btn.dataset.target;
    if (location.hash !== '#' + target) {
      history.pushState(null, '', '#' + target);
    }
    showFromHash();
  });
});

// Affiche la bonne vue au chargement
document.addEventListener('DOMContentLoaded', showFromHash);



/*-----------------------------------*\
  #PROJECT DETAIL LOADER
\*-----------------------------------*/
(function () {
  const STATE = { data: null, cache: new Map() };

    const el = {
    page: document.querySelector('[data-page="project-detail"]'),
    navbar: document.querySelector('.navbar'),
    title: document.getElementById('pj-title'),
    meta: document.getElementById('pj-meta'),
    dateWrap: document.getElementById('pj-date-wrap'),
    date: document.getElementById('pj-date'),
    durationWrap: document.getElementById('pj-duration-wrap'),
    duration: document.getElementById('pj-duration'),
    desc: document.getElementById('pj-description'),
    heroWrap: document.getElementById('pj-hero'),
    heroImg: document.getElementById('pj-hero-img'),
    pageTabs: document.getElementById('pj-page-tabs'),
    sections: document.getElementById('pj-sections'),
    galleryWrap: document.getElementById('pj-gallery'),
    thumbs: document.getElementById('pj-thumbs'),
    modal: document.getElementById('img-modal'),
    overlay: document.getElementById('img-overlay'),
    modalImg: document.getElementById('img-full'),
    modalClose: document.getElementById('img-close'),
    modalPrev: document.getElementById('img-prev'),
    modalNext: document.getElementById('img-next')
  };

  function resetProjectDetail() {
    if (!el.page) return;

    // Texte
    el.title.textContent = '';
    el.title.style.removeProperty('font-size');
    el.title.style.removeProperty('max-width');
    el.title.classList.remove('project-title-wrap');
    el.date.textContent = '';
    el.duration.textContent = '';
    el.dateWrap.hidden = true;
    el.durationWrap.hidden = true;
    el.meta.hidden = true;
    el.desc.innerHTML = '';

    // Hero
    const oldVid = el.heroWrap.querySelector('video');
    if (oldVid) oldVid.remove();
    el.heroImg.removeAttribute('src');
    el.heroImg.style.display = 'none';
    el.heroWrap.style.display = 'none';

    // Sections & galerie
    el.pageTabs.innerHTML = '';
    el.sections.innerHTML = '';
    el.galleryWrap.style.display = 'none';

    // Thumbs : recrée un conteneur vide propre
    const fresh = document.createElement('div');
    fresh.className = 'project-thumbs has-scrollbar';
    fresh.id = 'pj-thumbs';
    el.thumbs.replaceWith(fresh);
    el.thumbs = fresh;
  }

  const MIN_PROJECT_TITLE_SIZE = 16;
  let titleFitFrame = null;

  function fitProjectTitle() {
    titleFitFrame = null;
    if (!el.title || !el.title.textContent.trim()) return;

    el.title.style.removeProperty('font-size');
    el.title.style.removeProperty('max-width');
    el.title.classList.remove('project-title-wrap');

    const baseSize = Number.parseFloat(getComputedStyle(el.title).fontSize);
    if (!Number.isFinite(baseSize)) return;

    const titleRect = el.title.getBoundingClientRect();
    const headerRect = el.title.parentElement.getBoundingClientRect();
    const navbarRect = el.navbar?.getBoundingClientRect();
    let rightLimit = headerRect.right;

    if (
      navbarRect
      && navbarRect.top < titleRect.bottom
      && navbarRect.bottom > titleRect.top
      && navbarRect.left > titleRect.left
    ) {
      rightLimit = Math.min(rightLimit, navbarRect.left - 20);
    }

    const availableWidth = Math.max(0, rightLimit - titleRect.left);
    const naturalWidth = el.title.scrollWidth;
    if (!availableWidth || naturalWidth <= availableWidth) return;

    const fittedSize = Math.max(
      MIN_PROJECT_TITLE_SIZE,
      Math.floor((baseSize * availableWidth / naturalWidth) * 10) / 10
    );
    el.title.style.fontSize = `${fittedSize}px`;

    // Cas extrême : si la taille minimale ne suffit plus, le titre passe sur deux lignes.
    if (el.title.scrollWidth > availableWidth + 1) {
      el.title.style.maxWidth = `${availableWidth}px`;
      el.title.classList.add('project-title-wrap');
    }
  }

  function scheduleProjectTitleFit() {
    if (titleFitFrame !== null) cancelAnimationFrame(titleFitFrame);
    titleFitFrame = requestAnimationFrame(fitProjectTitle);
  }

  window.addEventListener('resize', scheduleProjectTitleFit);
  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleProjectTitleFit);
  }


  const modalBody = el.modal?.querySelector('.modal-body');

  const VIDEO_EXT = /\.(mp4|webm|ogg)$/i;
  const isVideo = (src) => VIDEO_EXT.test(String(src || ''));
  const escapeHtml = (s) => String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function bbcodeInlinePreserve(src) {
    const links = [];

    // --- [button=...]...[/button]
    let replaced = String(src).replace(/\[button=(.+?)\](.+?)\[\/button\]/gi, (_m, href, text) => {
      const h = String(href || '').trim();
      const t = String(text || '').trim();
      const safeHref = escapeHtml(h);
      const safeText = escapeHtml(t);
      const ok = /^(https?:\/\/|\/)/i.test(h);
      const a = `<a href="${ok ? safeHref : '#'}" class="pj-button-link" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
      links.push(a);
      return `\uE000${links.length - 1}\uE001`;
    });

    // --- [button-projet=ID]Nom[/button-projet]
    replaced = replaced.replace(/\[button-projet=(.+?)\](.+?)\[\/button-projet\]/gi, (_m, id, text) => {
      const pid = String(id || '').trim();
      const t = escapeHtml(String(text || '').trim());

      const a =
        `<a href="#project=${encodeURIComponent(pid)}" class="pj-button-link" data-open-project="${pid}">${t}</a>`;

      links.push(a);
      return `\uE000${links.length - 1}\uE001`;
    });

    // --- [url=...]...[/url]
    replaced = replaced.replace(/\[url=(.+?)\](.+?)\[\/url\]/gi, (_m, href, text) => {
      const h = String(href || '').trim();
      const t = String(text || '').trim();
      const safeHref = escapeHtml(h);
      const safeText = escapeHtml(t);
      const ok = /^(https?:\/\/|\/)/i.test(h);
      const a = `<a href="${ok ? safeHref : '#'}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
      links.push(a);
      return `\uE000${links.length - 1}\uE001`;
    });

    // --- [projet=ID]Nom[/projet]
    replaced = replaced.replace(/\[projet=(.+?)\](.+?)\[\/projet\]/gi, (_m, id, text) => {
      const pid = String(id || '').trim();
      const t = escapeHtml(String(text || '').trim());

      const a =
        `<a href="#project=${encodeURIComponent(pid)}" class="pj-link" data-open-project="${pid}">${t}</a>`;

      links.push(a);
      return `\uE000${links.length - 1}\uE001`;
    });

    let esc = escapeHtml(replaced);
    esc = esc.replace(/\uE000(\d+)\uE001/g, (_m, i) => links[Number(i)]);
    return esc;
  }


  function textToParagraphs(raw) {
    const safe = bbcodeInlinePreserve(String(raw).replaceAll('\r\n', '\n'));
    const blocks = safe.split(/\n{2,}/);
    return blocks.map(b => `<p>${b.replaceAll('\n', '<br>')}</p>`).join('');
  }

  function parseDescription(text) {
    if (!text) return '';
    const lines = String(text).replaceAll('\r\n', '\n').split('\n');

    let html = '';
    let level = 0;
    let buf = [];

    const open = (n) => { for (let i = 0; i < n; i++) html += '<ul class="enum">'; };
    const close = (n) => { for (let i = 0; i < n; i++) html += '</ul>'; };
    const flushBuf = () => {
      if (buf.length) {
        html += textToParagraphs(buf.join('\n'));
        buf = [];
      }
    };

    for (const raw of lines) {
      const m = raw.match(/^\s*\[enum=(\d+)\](.*?)\[\/enum\]\s*$/i);
      if (m) {
        const n = Math.max(1, parseInt(m[1], 10));
        const content = bbcodeInlinePreserve(m[2] || '');
        flushBuf();

        if (n > level) open(n - level);
        if (n < level) close(level - n);
        level = n;

        html += `<li>${content}</li>`;
      } else {
        if (level > 0) { close(level); level = 0; }
        buf.push(raw);
      }
    }

    if (level > 0) close(level);
    flushBuf();

    return html;
  }

  function navigateToDetail() {
    document.querySelectorAll('article[data-page]').forEach(a => a.classList.remove('active'));
    if (el.page) el.page.classList.add('active');
    document.querySelectorAll('[data-nav-link]').forEach(btn => btn.classList.remove('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  let modalVideo = null;
  function ensureModalVideo() {
    if (modalVideo) return modalVideo;
    const body = el.modal?.querySelector('.modal-body');
    if (!body) return null;
    modalVideo = document.createElement('video');
    modalVideo.setAttribute('id', 'vid-full');
    modalVideo.setAttribute('controls', '');
    modalVideo.setAttribute('playsinline', '');
    modalVideo.style.maxWidth = '100%';
    modalVideo.style.maxHeight = '80vh';
    modalVideo.style.display = 'none';
    body.appendChild(modalVideo);
    return modalVideo;
  }

  function openModalMedia(src) {
    if (!el.modal || !el.overlay) return;

    const isVid = isVideo(src);
    const vid = ensureModalVideo();

    if (isVid) {
      if (el.modalImg) { el.modalImg.src = ''; el.modalImg.style.display = 'none'; }
      if (vid) {
        vid.src = src;
        vid.style.display = '';
        vid.currentTime = 0;
        vid.play().catch(()=>{});
      }
    } else {
      if (vid) { vid.pause(); vid.removeAttribute('src'); vid.load(); vid.style.display = 'none'; }
      if (el.modalImg) { el.modalImg.src = src; el.modalImg.style.display = ''; }
    }

    el.modal.classList.add('active');
    el.overlay.classList.add('active');
    el.modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!el.modal || !el.overlay) return;
    const vid = modalVideo;
    if (vid) { vid.pause(); vid.removeAttribute('src'); vid.load(); vid.style.display = 'none'; }
    if (el.modalImg) { el.modalImg.src = ''; }
    el.modal.classList.remove('active');
    el.overlay.classList.remove('active');
    el.modal.setAttribute('aria-hidden', 'true');

    CURRENT_LIST = [];
    CURRENT_INDEX = -1;
  }
  if (el.overlay) el.overlay.addEventListener('click', closeModal);
  if (el.modalClose) el.modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  let CURRENT_LIST = [];
  let CURRENT_INDEX = -1;

  function openModalAt(index, list) {
    if (!Array.isArray(list) || !list.length) return;
    CURRENT_LIST = list.slice();
    CURRENT_INDEX = (index + CURRENT_LIST.length) % CURRENT_LIST.length;
    openModalMedia(CURRENT_LIST[CURRENT_INDEX]);
  }

  function showPrev() {
    if (!CURRENT_LIST.length) return;
    CURRENT_INDEX = (CURRENT_INDEX - 1 + CURRENT_LIST.length) % CURRENT_LIST.length;
    openModalMedia(CURRENT_LIST[CURRENT_INDEX]);
  }

  function showNext() {
    if (!CURRENT_LIST.length) return;
    CURRENT_INDEX = (CURRENT_INDEX + 1) % CURRENT_LIST.length;
    openModalMedia(CURRENT_LIST[CURRENT_INDEX]);
  }

  if (el.modalPrev) el.modalPrev.addEventListener('click', showPrev);
  if (el.modalNext) el.modalNext.addEventListener('click', showNext);

  document.addEventListener('keydown', e => {
    if (!el.modal?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); showPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showNext(); }
  });

  let touchStartX = 0, touchStartY = 0, touchActive = false;
  const SWIPE_MIN = 50, SWIPE_MAX_ANGLE = 80;
  function onTouchStart(ev) {
    const t = ev.changedTouches ? ev.changedTouches[0] : ev;
    touchStartX = t.clientX; touchStartY = t.clientY; touchActive = true;
  }
  function onTouchEnd(ev) {
    if (!touchActive) return;
    const t = ev.changedTouches ? ev.changedTouches[0] : ev;
    const dx = t.clientX - touchStartX;
    const dy = Math.abs(t.clientY - touchStartY);
    touchActive = false;
    if (Math.abs(dx) >= SWIPE_MIN && dy <= SWIPE_MAX_ANGLE) {
      if (dx < 0) showNext(); else showPrev();
    }
  }
  if (modalBody) {
    modalBody.addEventListener('touchstart', onTouchStart, { passive: true });
    modalBody.addEventListener('touchend', onTouchEnd, { passive: true });
  }

  function createThumbs(medias) {
    const box = document.createElement('div');
    box.className = 'project-thumbs has-scrollbar';

    medias.forEach((src, i) => {
      const btn = document.createElement('button');
      btn.className = 'thumb-btn';
      btn.setAttribute('aria-label', isVideo(src) ? 'Voir la vidéo' : 'Voir l’image');

      if (isVideo(src)) {
        const v = document.createElement('video');
        v.src = src;
        v.muted = true;
        v.playsInline = true;
        v.preload = 'metadata';
        v.className = 'thumb-media thumb-video';
        v.style.maxHeight = '120px';
        btn.appendChild(v);

        const badge = document.createElement('span');
        badge.className = 'thumb-play-badge';
        badge.textContent = '▶';
        btn.appendChild(badge);

        btn.addEventListener('click', () => openModalAt(i, medias));
      } else {
        btn.innerHTML = `<img src="${src}" alt="Miniature" class="thumb-media">`;
        btn.addEventListener('click', () => openModalAt(i, medias));
      }

      box.appendChild(btn);
    });
    return box;
  }

  const hasMedias = (arr) => Array.isArray(arr) && arr.length > 0;

  function renderProjectSections(sections, footer = null) {
    el.sections.innerHTML = '';

    if (Array.isArray(sections) && sections.length) {
      sections.forEach(s => {
        const sec = document.createElement('section');
        sec.className = 'project-section';
        const titleHTML = s.title ? `<h3 class="h3">${escapeHtml(s.title)}</h3>` : '';
        const descHTML  = s.description ? `<div class="about-text">${parseDescription(s.description)}</div>` : '';
        sec.innerHTML = `${titleHTML}${descHTML}`;

        const medias = s.medias || s.images || [];
        if (hasMedias(medias)) sec.appendChild(createThumbs(medias));

        el.sections.appendChild(sec);
      });
    }

    if (footer) el.sections.appendChild(footer);
  }

  function scrollToProjectPageStart() {
    const target = el.pageTabs || el.sections;
    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function renderProjectPageTabs(projectPages) {
    if (!el.pageTabs) return;

    el.pageTabs.innerHTML = '';
    if (!Array.isArray(projectPages) || !projectPages.length) {
      renderProjectSections([]);
      return;
    }

    const tabs = document.createElement('div');
    tabs.className = 'project-page-tabs';

    const getPageName = (page, index) => page?.name || `Page ${index + 1}`;

    const createPageNavButton = (index, direction) => {
      const page = projectPages[index];
      const name = getPageName(page, index);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `project-page-nav-btn ${direction === 'prev' ? 'project-page-nav-prev' : 'project-page-nav-next'}`;
      button.setAttribute('aria-label', `Aller a la page ${name}`);

      if (direction === 'prev') {
        button.innerHTML = `
          <ion-icon name="chevron-back-outline" aria-hidden="true"></ion-icon>
          <span>${escapeHtml(name)}</span>
        `;
      } else {
        button.innerHTML = `
          <span>${escapeHtml(name)}</span>
          <ion-icon name="chevron-forward-outline" aria-hidden="true"></ion-icon>
        `;
      }

      button.addEventListener('click', () => showPage(index, true));
      return button;
    };

    const createProjectPageNav = (index) => {
      if (projectPages.length < 2) return null;

      const nav = document.createElement('nav');
      nav.className = 'project-page-nav';
      nav.setAttribute('aria-label', 'Navigation entre les pages du projet');

      if (index > 0) nav.appendChild(createPageNavButton(index - 1, 'prev'));
      if (index < projectPages.length - 1) nav.appendChild(createPageNavButton(index + 1, 'next'));

      return nav;
    };

    const showPage = (index, shouldScroll = false) => {
      const page = projectPages[index];
      tabs.querySelectorAll('[data-project-page-tab]').forEach((button, buttonIndex) => {
        button.classList.toggle('active', buttonIndex === index);
      });
      renderProjectSections(page.sections, createProjectPageNav(index));
      if (shouldScroll) scrollToProjectPageStart();
    };

    projectPages.forEach((page, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = index === 0 ? 'active' : '';
      button.setAttribute('data-project-page-tab', '');
      button.textContent = getPageName(page, index);
      button.addEventListener('click', () => showPage(index, false));
      tabs.appendChild(button);
    });

    el.pageTabs.appendChild(tabs);
    showPage(0);
  }

  function renderProject(project) {
    if (!project) return;

    el.title.textContent = project.title || '';
    const projectDate = String(project.date || '').trim();
    const projectDuration = String(project.duration || '').trim();
    el.date.textContent = projectDate;
    el.duration.textContent = projectDuration;
    el.dateWrap.hidden = !projectDate;
    el.durationWrap.hidden = !projectDuration;
    el.meta.hidden = !projectDate && !projectDuration;
    el.desc.innerHTML = parseDescription(project.description || '');
    fitProjectTitle();

    const heroSrc = project.media || project.image || null;

    const oldVid = el.heroWrap.querySelector('video');
    if (oldVid) oldVid.remove();
    el.heroImg.style.display = 'none';
    el.heroWrap.style.display = 'none';

    if (heroSrc) {
      if (isVideo(heroSrc)) {
        const v = document.createElement('video');
        v.src = heroSrc;
        v.controls = true;
        v.playsInline = true;
        v.style.width = '100%';
        v.style.borderRadius = '12px';
        el.heroWrap.appendChild(v);
        el.heroWrap.style.display = '';
      } else {
        el.heroImg.src = heroSrc;
        el.heroImg.style.display = '';
        el.heroWrap.style.display = '';
      }
    }

    renderProjectPageTabs(project.pages);

    const globalMedias = project.medias || project.images || [];
    el.thumbs.innerHTML = '';
    if (hasMedias(globalMedias)) {
      const thumbs = createThumbs(globalMedias);
      el.thumbs.replaceWith(thumbs);
      el.thumbs = thumbs;
      el.galleryWrap.style.display = '';
    } else {
      el.galleryWrap.style.display = 'none';
    }

    if (window.PortfolioEditor && typeof window.PortfolioEditor.enhanceDetail === 'function') {
      window.PortfolioEditor.enhanceDetail(project, { scheduleProjectTitleFit });
    }
  }

  function loadDataFromInline(force = false) {
    if (STATE.data && !force) return STATE.data;
    STATE.cache.clear();

    if (window.PortfolioEditor && typeof window.PortfolioEditor.getData === 'function') {
      const editorData = window.PortfolioEditor.getData();
      STATE.data = editorData.projects || [];
      STATE.data.forEach(p => STATE.cache.set(p.id, p));
      return STATE.data;
    }

    const inline = document.getElementById('projects-json');
    if (!inline || !inline.textContent.trim()) {
      STATE.data = [];
      return STATE.data;
    }
    try {
      const json = JSON.parse(inline.textContent);
      STATE.data = json.projects || [];
      STATE.data.forEach(p => STATE.cache.set(p.id, p));
      return STATE.data;
    } catch {
      STATE.data = [];
      return STATE.data;
    }
  }

  async function openProjectById(id) {
    // 1) Reset immédiat pour ne rien laisser afficher de l'ancien projet
    resetProjectDetail();
    if (el.page) el.page.classList.add('loading');

    // 2) Ouvre la page vide (blank state) tout de suite
    navigateToDetail();

    // 🔽 Remet le scroll tout en haut (instantané)
    window.scrollTo({ top: 0, behavior: 'auto' });

    // 3) Charge prévisualisation / data
    loadDataFromInline();
    let project = STATE.cache.get(id);

    if (!project) {
      const tile = document.querySelector(`.project-item[data-project-id="${CSS.escape(id)}"]`);
      if (tile) {
        const titleEl = tile.querySelector('.project-title');
        const imgEl = tile.querySelector('img, video');
        const src = imgEl ? (imgEl.getAttribute('src') || '') : '';
        project = {
          id,
          title: titleEl ? titleEl.textContent.trim() : id,
          date: '',
          duration: '',
          description: '',
          media: src,
          pages: [{ name: 'Contexte', sections: [] }],
          medias: src ? [src] : []
        };
      } else {
        project = { id, title: id, date: '', duration: '', description: '', pages: [{ name: 'Contexte', sections: [] }], medias: [] };
      }
    }

    if (!project.media && project.image) project.media = project.image;
    if (!project.medias && project.images) project.medias = project.images;

    // 4) Rendu du nouveau projet
    renderProject(project);

    // 5) Fin du mode "loading"
    if (el.page) el.page.classList.remove('loading');
  }


  function onProjectTileClick(e) {
    if (e.target.closest('[data-editor-delete-project]')) return;
    const li = e.currentTarget;
    const id = li.getAttribute('data-project-id');
    if (!id) return;
    const a = e.target.closest('a');
    if (a) e.preventDefault();

    const newHash = `#project=${encodeURIComponent(id)}`;
    if (location.hash !== newHash) {
      history.pushState(null, '', newHash);
    }
    showFromHash();
  }

  function bindProjectLinks() {
    document.querySelectorAll('[data-project-id]').forEach(li => {
      li.removeEventListener('click', onProjectTileClick, true);
      li.addEventListener('click', onProjectTileClick, true);
    });
  }

  function openFromHash() {
    const match = location.hash.match(/project=([^&]+)/);
    if (match && match[1]) openProjectById(decodeURIComponent(match[1]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindProjectLinks();

    // --- Gestion des balises [projet=...]
    document.body.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-open-project]');
      if (!a) return;
      e.preventDefault();

      const id = a.getAttribute('data-open-project');
      if (!id) return;

      const hash = `#project=${encodeURIComponent(id)}`;
      if (location.hash !== hash) {
        history.pushState(null, '', hash);
      }
      showFromHash();
    });
  });


  window.Portfolio = Object.assign(window.Portfolio || {}, {
    openProjectById,
    bindTiles: bindProjectLinks,
    resetDetail: resetProjectDetail,
    refreshDataCache: () => loadDataFromInline(true)
  });
})();


/*-----------------------------------*\
  #PORTFOLIO GRID
\*-----------------------------------*/
(function () {
  const VIDEO_EXT = /\.(mp4|webm|ogg)$/i;
  const isVideo = (src) => VIDEO_EXT.test(String(src || ''));
  const slug = (s) => String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'uncategorized';

  const escapeHtml = (s) => String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const root = {
    filterList: document.getElementById('pf-filter'),
    selectToggle: document.getElementById('pf-select-toggle'),
    selectValue: document.getElementById('pf-select-value'),
    selectList: document.getElementById('pf-select-list'),
    list: document.getElementById('pf-list'),
  };

  function readProjects() {
    if (window.PortfolioEditor && typeof window.PortfolioEditor.getData === 'function') {
      const data = window.PortfolioEditor.getData();
      const arr = data.projects || [];
      arr.forEach(p => {
        if (!p.medias && p.images) p.medias = p.images;
        if (!p.media && p.image) p.media = p.image;
      });
      return arr;
    }

    const inline = document.getElementById('projects-json');
    if (!inline || !inline.textContent.trim()) return [];
    try {
      const json = JSON.parse(inline.textContent);
      const arr = json.projects || [];
      arr.forEach(p => {
        if (!p.medias && p.images) p.medias = p.images;
        if (!p.media && p.image) p.media = p.image;
      });
      return arr;
    } catch {
      return [];
    }
  }

  function pickThumb(project) {
    return project.icon || project.media || (project.medias && project.medias[0]) || project.image || (project.images && project.images[0]) || '';
  }

  function projectItemHTML(p) {
    const categories = Array.isArray(p.category) ? p.category : [p.category || 'Autres'];
    const catSlugs = categories.map(slug);
    const catLabels = categories.join(', ');
    const thumb    = pickThumb(p);
    const isVid    = isVideo(thumb);
    const title    = p.title || p.id || 'Projet';

    const mediaHTML = !thumb
      ? `<div class="project-thumb-placeholder" role="img" aria-label="Visuel du projet en préparation">
           <span>Visuel en préparation</span>
         </div>`
      : isVid
        ? `<video src="${thumb}" muted playsinline preload="metadata" class="thumb-video"></video>`
        : `<img src="${thumb}" alt="${escapeHtml(title)}" loading="lazy">`;

    return `
<li class="project-item active"
    data-filter-item
    data-categories="${catSlugs.join(',')}"
    data-project-id="${p.id}">
  <a href="#">
    <figure class="project-img">
      <div class="project-item-icon-box">
        <ion-icon name="eye-outline"></ion-icon>
      </div>
      ${mediaHTML}
    </figure>
    <h3 class="project-title">${escapeHtml(title)}</h3>
    <p class="project-category">${escapeHtml(catLabels)}</p>
  </a>
</li>`;
  }

  function renderProjects(projects) {
    if (!root.list) return;
    root.list.innerHTML = projects.map(projectItemHTML).join('');
    if (window.Portfolio && typeof window.Portfolio.bindTiles === 'function') {
      window.Portfolio.bindTiles();
    }
    if (window.PortfolioEditor && typeof window.PortfolioEditor.enhanceGrid === 'function') {
      window.PortfolioEditor.enhanceGrid();
    }
  }

  function collectCategories(projects) {
    const map = new Map();
    map.set('all', 'Tous');
    projects.forEach(p => {
      const categories = Array.isArray(p.category) ? p.category : [p.category || 'Autres'];
      categories.forEach(cat => map.set(slug(cat), cat));
    });
    return [...map.entries()].map(([value, label]) => ({ value, label }));
  }

  function renderFilters(cats) {
    if (root.filterList) {
      root.filterList.innerHTML = cats.map((c, i) =>
        `<li class="filter-item">
           <button class="${i===0 ? 'active' : ''}" data-pf-filter-btn data-pf-filter="${c.value}">${c.label}</button>
         </li>`
      ).join('');
    }
    if (root.selectList) {
      root.selectList.innerHTML = cats.map(c =>
        `<li class="select-item">
           <button data-pf-select-item data-pf-filter="${c.value}">${c.label}</button>
         </li>`
      ).join('');
    }
    if (root.selectValue) root.selectValue.textContent = cats[0]?.label || 'Tous';
  }

  function applyFilter(value) {
    const items = root.list?.querySelectorAll('.project-item[data-filter-item]') || [];
    if (value === 'all') {
      items.forEach(li => li.classList.add('active'));
    } else {
      items.forEach(li => {
        const cats = (li.getAttribute('data-categories') || '').split(',').map(s => s.trim());
        li.classList.toggle('active', cats.includes(value));
      });
    }

    root.filterList?.querySelectorAll('[data-pf-filter-btn]')?.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-pf-filter') === value);
    });

    const lab = root.selectList?.querySelector(`[data-pf-filter="${value}"]`)?.textContent || 'Tous';
    if (root.selectValue) root.selectValue.textContent = lab;
  }

  function bindFilters() {
    root.filterList?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pf-filter-btn]');
      if (!btn) return;
      applyFilter(btn.getAttribute('data-pf-filter'));
    });

    root.selectToggle?.addEventListener('click', () => {
      root.selectToggle.classList.toggle('active');
      root.selectList.classList.toggle('open');
    });

    root.selectList?.addEventListener('click', (e) => {
      const itm = e.target.closest('[data-pf-select-item]');
      if (!itm) return;
      applyFilter(itm.getAttribute('data-pf-filter'));
      root.selectToggle.classList.remove('active');
      root.selectList.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (!root.selectToggle) return;
      if (!root.selectToggle.contains(e.target) && !root.selectList.contains(e.target)) {
        root.selectToggle.classList.remove('active');
        root.selectList.classList.remove('open');
      }
    });
  }

  function bindProjectClicks() {
    root.list?.addEventListener('click', (e) => {
      const item = e.target.closest('.project-item[data-project-id]');
      if (!item) return;
      e.preventDefault();
      const id = item.getAttribute('data-project-id');
      if (window.Portfolio && typeof window.Portfolio.openProjectById === 'function') {
        window.Portfolio.openProjectById(id);
      }
    });
  }

  function reloadGrid() {
    if (!root.list) return;
    const projects = readProjects();
    renderProjects(projects);
    renderFilters(collectCategories(projects));
    applyFilter('all');
  }

  function initGrid() {
    if (!root.list) return;
    reloadGrid();
    bindFilters();
    bindProjectClicks();
  }

  window.PortfolioGrid = Object.assign(window.PortfolioGrid || {}, {
    reload: reloadGrid,
    readProjects
  });

  document.addEventListener('DOMContentLoaded', initGrid);
})();
