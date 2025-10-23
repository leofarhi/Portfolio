'use strict';

/*-----------------------------------*\
  #NAV
\*-----------------------------------*/
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('article[data-page]');

navLinks.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    navLinks.forEach(l => l.classList.toggle('active', l === btn));
    pages.forEach(page => {
      page.classList.toggle('active', page.dataset.page === target);
    });
    if (location.hash.startsWith('#project=')) {
      const u = new URL(location.href);
      u.hash = '';
      history.replaceState(null, '', u);
    }
  });
});


/*-----------------------------------*\
  #PROJECT DETAIL LOADER
\*-----------------------------------*/
(function () {
  const STATE = { data: null, cache: new Map() };

  const el = {
    page: document.querySelector('[data-page="project-detail"]'),
    title: document.getElementById('pj-title'),
    desc: document.getElementById('pj-description'),
    heroWrap: document.getElementById('pj-hero'),
    heroImg: document.getElementById('pj-hero-img'),
    sections: document.getElementById('pj-sections'),
    galleryWrap: document.getElementById('pj-gallery'),
    thumbs: document.getElementById('pj-thumbs'),
    modal: document.getElementById('img-modal'),
    overlay: document.getElementById('img-overlay'),
    modalImg: document.getElementById('img-full'),
    modalClose: document.getElementById('img-close')
  };

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
    const replaced = String(src).replace(/\[url=(.+?)\](.+?)\[\/url\]/gi, (_m, href, text) => {
      const h = String(href || '').trim();
      const t = String(text || '').trim();
      const safeHref = escapeHtml(h);
      const safeText = escapeHtml(t);
      const ok = /^(https?:\/\/|\/)/i.test(h);
      const a = `<a href="${ok ? safeHref : '#'}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
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
  }
  if (el.overlay) el.overlay.addEventListener('click', closeModal);
  if (el.modalClose) el.modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function createThumbs(medias) {
    const box = document.createElement('div');
    box.className = 'project-thumbs has-scrollbar';

    medias.forEach(src => {
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

        btn.addEventListener('click', () => openModalMedia(src));
      } else {
        btn.innerHTML = `<img src="${src}" alt="Miniature" class="thumb-media">`;
        btn.addEventListener('click', () => openModalMedia(src));
      }

      box.appendChild(btn);
    });
    return box;
  }

  const hasMedias = (arr) => Array.isArray(arr) && arr.length > 0;

  function renderProject(project) {
    if (!project) return;

    el.title.textContent = project.title || '';
    el.desc.innerHTML = parseDescription(project.description || '');

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

    el.sections.innerHTML = '';
    if (Array.isArray(project.sections) && project.sections.length) {
      project.sections.forEach(s => {
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
  }

  function loadDataFromInline() {
    if (STATE.data) return STATE.data;
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
          description: '',
          media: src,
          sections: [],
          medias: src ? [src] : []
        };
      } else {
        project = { id, title: id, description: '', sections: [], medias: [] };
      }
    }

    if (!project.media && project.image) project.media = project.image;
    if (!project.medias && project.images) project.medias = project.images;

    renderProject(project);
    navigateToDetail();

    const u = new URL(location.href);
    u.hash = `#project=${encodeURIComponent(id)}`;
    history.replaceState(null, '', u);
  }

  function onProjectTileClick(e) {
    const li = e.currentTarget;
    const id = li.getAttribute('data-project-id');
    if (!id) return;
    const a = e.target.closest('a');
    if (a) e.preventDefault();
    openProjectById(id);
  }

  function bindProjectLinks() {
    document.querySelectorAll('[data-project-id]').forEach(li => {
      li.removeEventListener('click', onProjectTileClick, true);
      li.addEventListener('click', onProjectTileClick, true);
    });
  }

  function bindNavbarHashCleanup() {
    document.querySelectorAll('[data-nav-link]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (location.hash.startsWith('#project=')) {
          const u = new URL(location.href);
          u.hash = '';
          history.replaceState(null, '', u);
        }
      });
    });
  }

  function openFromHash() {
    const match = location.hash.match(/project=([^&]+)/);
    if (match && match[1]) openProjectById(decodeURIComponent(match[1]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindProjectLinks();
    bindNavbarHashCleanup();
    openFromHash();
  });

  window.Portfolio = Object.assign(window.Portfolio || {}, {
    openProjectById,
    bindTiles: bindProjectLinks
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
    const catLabel = p.category || 'Autres';
    const catSlug  = slug(catLabel);
    const thumb    = pickThumb(p);
    const isVid    = isVideo(thumb);
    const title    = p.title || p.id || 'Projet';

    const mediaHTML = isVid
      ? `<video src="${thumb}" muted playsinline preload="metadata" class="thumb-video"></video>`
      : `<img src="${thumb}" alt="${escapeHtml(title)}" loading="lazy">`;

    return `
<li class="project-item active" data-filter-item data-category="${catSlug}" data-project-id="${p.id}">
  <a href="#">
    <figure class="project-img">
      <div class="project-item-icon-box">
        <ion-icon name="eye-outline"></ion-icon>
      </div>
      ${mediaHTML}
    </figure>
    <h3 class="project-title">${escapeHtml(title)}</h3>
    <p class="project-category">${escapeHtml(catLabel)}</p>
  </a>
</li>`;
  }

  function renderProjects(projects) {
    if (!root.list) return;
    root.list.innerHTML = projects.map(projectItemHTML).join('');
    if (window.Portfolio && typeof window.Portfolio.bindTiles === 'function') {
      window.Portfolio.bindTiles();
    }
  }

  function collectCategories(projects) {
    const map = new Map();
    map.set('all', 'Tous');
    projects.forEach(p => {
      const label = p.category || 'Autres';
      map.set(slug(label), label);
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
        li.classList.toggle('active', li.getAttribute('data-category') === value);
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

  function initGrid() {
    if (!root.list) return;
    const projects = readProjects();
    renderProjects(projects);
    renderFilters(collectCategories(projects));
    bindFilters();
    bindProjectClicks();
    applyFilter('all');
  }

  document.addEventListener('DOMContentLoaded', initGrid);
})();
