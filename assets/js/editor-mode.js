'use strict';

(function () {
  const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
  const params = new URLSearchParams(location.search);
  const enabled = LOCAL_HOSTS.has(location.hostname) && params.get('edit') === '1';

  let dataCache = null;
  let saveTimer = null;
  let gridRefreshTimer = null;
  let statusEl = null;
  let saveChain = Promise.resolve();
  const activePageByProject = new Map();
  let textToolsMenu = null;
  let activeTextToolsTextarea = null;
  let activeTextToolsRange = null;

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  function normalizeData(data) {
    if (!data || typeof data !== 'object') data = {};
    if (!Array.isArray(data.projects)) data.projects = [];

    data.projects.forEach((project) => {
      if (!Array.isArray(project.category)) {
        project.category = project.category ? [project.category] : [];
      }
      if (!Array.isArray(project.pages)) project.pages = [];
      project.pages.forEach((page) => {
        if (!page || typeof page !== 'object') return;
        if (!page.name || typeof page.name !== 'string') page.name = 'Contexte';
        if (!Array.isArray(page.sections)) page.sections = [];
      });
      if (!Array.isArray(project.medias)) project.medias = [];
      if (!project.id && project.title) project.id = makeProjectId(project.title);
      if (!project.title && project.id) project.title = project.id;
    });

    return data;
  }

  function readInlineData() {
    const inline = document.getElementById('projects-json');

    if (inline && inline.textContent.trim()) {
      try {
        return normalizeData(JSON.parse(inline.textContent));
      } catch (error) {
        console.error('[Portfolio editor] Impossible de lire projects-json.', error);
      }
    }

    if (window.PROJECTS_DATA) {
      return normalizeData(deepClone(window.PROJECTS_DATA));
    }

    return normalizeData({ projects: [] });
  }

  function getData() {
    if (!dataCache) dataCache = readInlineData();
    return dataCache;
  }

  function syncInlineData() {
    const data = getData();
    let inline = document.getElementById('projects-json');

    if (!inline) {
      inline = document.createElement('script');
      inline.type = 'application/json';
      inline.id = 'projects-json';
      document.head.appendChild(inline);
    }

    inline.textContent = JSON.stringify(data, null, 2);
    window.PROJECTS_DATA = data;

    if (window.Portfolio && typeof window.Portfolio.refreshDataCache === 'function') {
      window.Portfolio.refreshDataCache();
    }
  }

  function makeProjectId(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const isVideoPath = (src) => /\.(mp4|webm|ogg|mov)$/i.test(String(src || ''));

  async function pickMediaPath() {
    setStatus('Ouverture de l’explorateur...', 'saving');

    try {
      const response = await fetch('/api/pick-media', { method: 'POST' });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.error) {
        throw new Error(result.error || `Erreur HTTP ${response.status}`);
      }

      if (result.cancelled) {
        setStatus('Sélection annulée', 'info');
        return null;
      }

      if (!result.path) {
        throw new Error('Aucun chemin média reçu.');
      }

      setStatus('Média sélectionné', 'ok');
      return result.path;
    } catch (error) {
      console.error('[Portfolio editor] Sélection média impossible.', error);
      setStatus('Sélection impossible', 'error');
      alert(error.message || 'Impossible de sélectionner ce média.');
      return null;
    }
  }

  function findProject(id) {
    return getData().projects.find((project) => project.id === id) || null;
  }

  function setStatus(message, type = 'info') {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.status = type;
  }

  function refreshGridSoon() {
    clearTimeout(gridRefreshTimer);
    gridRefreshTimer = setTimeout(() => {
      if (window.PortfolioGrid && typeof window.PortfolioGrid.reload === 'function') {
        window.PortfolioGrid.reload();
      }
    }, 180);
  }

  function saveNow() {
    if (!enabled) return Promise.resolve();

    clearTimeout(saveTimer);
    syncInlineData();
    setStatus('Sauvegarde...', 'saving');

    const payload = JSON.stringify(getData());

    saveChain = saveChain
      .catch(() => {})
      .then(async () => {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });

        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(text || `Erreur HTTP ${response.status}`);
        }

        setStatus('Sauvegardé', 'ok');
      })
      .catch((error) => {
        console.error('[Portfolio editor] Sauvegarde impossible.', error);
        setStatus('Non sauvegardé — serveur local absent ?', 'error');
      });

    return saveChain;
  }

  function scheduleSave({ refreshGrid = false } = {}) {
    if (!enabled) return;

    syncInlineData();
    setStatus('Modifications locales...', 'dirty');

    if (refreshGrid) refreshGridSoon();

    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 650);
  }

  function createEditorToolbar() {
    if (!enabled || document.getElementById('portfolio-editor-toolbar')) return;

    const portfolio = document.querySelector('[data-page="portfolio"]');
    const header = portfolio?.querySelector('header');
    if (!portfolio || !header) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'portfolio-editor-toolbar';
    toolbar.className = 'portfolio-editor-toolbar';
    toolbar.innerHTML = `
      <div>
        <span class="portfolio-editor-badge">Mode édition local</span>
        <span class="portfolio-editor-status" data-status="ok">Prêt</span>
      </div>
      <button type="button" class="portfolio-editor-primary" id="portfolio-editor-create">
        + Créer un projet
      </button>
    `;

    header.insertAdjacentElement('afterend', toolbar);
    statusEl = toolbar.querySelector('.portfolio-editor-status');
    toolbar.querySelector('#portfolio-editor-create')?.addEventListener('click', createProject);
  }

  async function createProject() {
    const rawId = prompt('ID du nouveau projet :');
    if (rawId === null) return;

    const id = makeProjectId(rawId);
    if (!id) {
      alert('ID invalide.');
      return;
    }

    const data = getData();
    if (data.projects.some((project) => project.id === id)) {
      alert(`Le projet "${id}" existe déjà.`);
      return;
    }

    const project = {
      id,
      title: id,
      date: '',
      duration: '',
      category: [],
      icon: '',
      media: '',
      description: '',
      pages: [{ name: 'Contexte', sections: [] }],
      medias: []
    };

    data.projects.unshift(project);
    syncInlineData();

    if (window.PortfolioGrid && typeof window.PortfolioGrid.reload === 'function') {
      window.PortfolioGrid.reload();
    }

    await saveNow();

    history.pushState(null, '', `#project=${encodeURIComponent(id)}`);
    if (window.Portfolio && typeof window.Portfolio.openProjectById === 'function') {
      window.Portfolio.openProjectById(id);
    }
  }

  async function deleteProject(id) {
    const data = getData();
    const index = data.projects.findIndex((project) => project.id === id);
    if (index < 0) return;

    const project = data.projects[index];
    const label = project.title || project.id;
    if (!confirm(`Supprimer le projet "${label}" ?`)) return;

    data.projects.splice(index, 1);
    syncInlineData();

    if (window.PortfolioGrid && typeof window.PortfolioGrid.reload === 'function') {
      window.PortfolioGrid.reload();
    }

    if (location.hash === `#project=${encodeURIComponent(id)}`) {
      history.pushState(null, '', '#portfolio');
      if (typeof window.renderSection === 'function') window.renderSection('portfolio');
    }

    await saveNow();
  }

  function moveProject(id, direction) {
    const data = getData();
    const projects = data.projects || [];
    const index = projects.findIndex((project) => project.id === id);
    const nextIndex = index + direction;

    if (index < 0 || nextIndex < 0 || nextIndex >= projects.length) return;

    const [project] = projects.splice(index, 1);
    projects.splice(nextIndex, 0, project);
    syncInlineData();

    if (window.PortfolioGrid && typeof window.PortfolioGrid.reload === 'function') {
      window.PortfolioGrid.reload();
    }

    scheduleSave();
  }

  function enhanceGrid() {
    if (!enabled) return;
    createEditorToolbar();

    document.querySelectorAll('.project-item[data-project-id]').forEach((item) => {
      if (item.querySelector('.portfolio-editor-project-controls')) return;

      const id = item.getAttribute('data-project-id');
      const figure = item.querySelector('.project-img');
      if (!id || !figure) return;

      const data = getData();
      const projects = data.projects || [];
      const projectIndex = projects.findIndex((project) => project.id === id);
      const canMoveUp = projectIndex > 0;
      const canMoveDown = projectIndex >= 0 && projectIndex < projects.length - 1;

      const controls = document.createElement('div');
      controls.className = 'portfolio-editor-project-controls';
      controls.innerHTML = `
        <button type="button" class="portfolio-editor-project-control" data-editor-move-project="-1" aria-label="Monter ${escapeAttr(id)}" ${canMoveUp ? '' : 'disabled'}>
          <ion-icon name="arrow-up-outline" aria-hidden="true"></ion-icon>
        </button>
        <button type="button" class="portfolio-editor-project-control" data-editor-move-project="1" aria-label="Descendre ${escapeAttr(id)}" ${canMoveDown ? '' : 'disabled'}>
          <ion-icon name="arrow-down-outline" aria-hidden="true"></ion-icon>
        </button>
        <button type="button" class="portfolio-editor-project-control danger" data-editor-delete-project="${escapeAttr(id)}" aria-label="Supprimer ${escapeAttr(id)}">
          <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
        </button>
      `;

      controls.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (button.hasAttribute('data-editor-delete-project')) {
            deleteProject(id);
            return;
          }

          const direction = Number(button.getAttribute('data-editor-move-project'));
          if (direction) moveProject(id, direction);
        });
      });

      figure.appendChild(controls);
    });
  }

  function ensureProjectInData(project) {
    if (!project?.id) return null;

    const data = getData();
    let editableProject = data.projects.find((item) => item.id === project.id);

    if (!editableProject) {
      editableProject = normalizeData({ projects: [deepClone(project)] }).projects[0];
      data.projects.push(editableProject);
    }

    return editableProject;
  }

  function makeContentEditable(element, placeholder, onInput) {
    if (!element) return;

    element.setAttribute('contenteditable', 'true');
    element.setAttribute('spellcheck', 'true');
    element.dataset.placeholder = placeholder;
    element.classList.add('portfolio-editor-editable');

    element.oninput = () => {
      onInput(element.textContent.trim());
      scheduleSave({ refreshGrid: true });
    };

    element.onblur = () => saveNow();
  }

  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(180, textarea.scrollHeight)}px`;
  }

  function getTextareaRange(textarea) {
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? start;

    return {
      start,
      end,
      text: textarea.value.slice(start, end)
    };
  }

  function getActiveTextToolsRange(textarea) {
    if (activeTextToolsTextarea === textarea && activeTextToolsRange) {
      return activeTextToolsRange;
    }

    return getTextareaRange(textarea);
  }

  function replaceTextareaRange(textarea, value, selectionStart = null, selectionEnd = null) {
    const range = getActiveTextToolsRange(textarea);
    textarea.setRangeText(value, range.start, range.end, 'end');

    const fallbackCaret = range.start + value.length;
    textarea.focus({ preventScroll: true });
    textarea.setSelectionRange(
      selectionStart ?? fallbackCaret,
      selectionEnd ?? fallbackCaret
    );

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    activeTextToolsRange = getTextareaRange(textarea);
  }

  function wrapTextareaSelection(textarea, before, after, fallback) {
    const range = getActiveTextToolsRange(textarea);
    const selectedText = range.text || fallback;
    const value = `${before}${selectedText}${after}`;
    const selectionStart = range.start + before.length;
    const selectionEnd = selectionStart + selectedText.length;

    replaceTextareaRange(textarea, value, selectionStart, selectionEnd);
  }

  function insertEnumTag(textarea, level) {
    const range = getActiveTextToolsRange(textarea);
    const selectedText = range.text || 'Nouvel element';
    const value = selectedText
      .replaceAll('\r\n', '\n')
      .split('\n')
      .map((line) => line.trim() ? `[enum=${level}]${line}[/enum]` : '')
      .join('\n');

    replaceTextareaRange(textarea, value);
  }

  function insertFormatTag(textarea, tag, fallback) {
    wrapTextareaSelection(textarea, `[${tag}]`, `[/${tag}]`, fallback);
  }

  function promptText(label, fallback) {
    const value = prompt(label, fallback);
    if (value === null) return null;
    return value.trim();
  }

  function insertUrlTag(textarea) {
    const range = getActiveTextToolsRange(textarea);
    const url = promptText('URL du lien :', 'https://');
    if (!url) return;

    const label = range.text || promptText('Texte affiché :', 'Lien');
    if (label === null) return;

    replaceTextareaRange(textarea, `[url=${url}]${label || 'Lien'}[/url]`);
  }

  function insertProjectTag(textarea) {
    const range = getActiveTextToolsRange(textarea);
    const projectId = promptText('ID du projet :', '');
    if (!projectId) return;

    const label = range.text || promptText('Texte affiché :', projectId);
    if (label === null) return;

    replaceTextareaRange(textarea, `[projet=${projectId}]${label || projectId}[/projet]`);
  }

  function insertButtonTag(textarea) {
    const range = getActiveTextToolsRange(textarea);
    const url = promptText('URL du bouton :', 'https://');
    if (!url) return;

    const label = range.text || promptText('Texte du bouton :', 'Voir le lien');
    if (label === null) return;

    replaceTextareaRange(textarea, `[button=${url}]${label || 'Voir le lien'}[/button]`);
  }

  function insertProjectButtonTag(textarea) {
    const range = getActiveTextToolsRange(textarea);
    const projectId = promptText('ID du projet :', '');
    if (!projectId) return;

    const label = range.text || promptText('Texte du bouton :', projectId);
    if (label === null) return;

    replaceTextareaRange(textarea, `[button-projet=${projectId}]${label || projectId}[/button-projet]`);
  }

  function hideTextToolsMenu() {
    if (textToolsMenu) textToolsMenu.hidden = true;
  }

  function ensureTextToolsMenu() {
    if (textToolsMenu) return textToolsMenu;

    const tools = [
      { label: 'Gras', hint: '[b]', icon: 'text-outline', action: (textarea) => insertFormatTag(textarea, 'b', 'texte en gras') },
      { label: 'Italique', hint: '[i]', icon: 'text-outline', action: (textarea) => insertFormatTag(textarea, 'i', 'texte en italique') },
      { label: 'Souligné', hint: '[u]', icon: 'text-outline', action: (textarea) => insertFormatTag(textarea, 'u', 'texte souligné') },
      { label: 'Barré', hint: '[s]', icon: 'text-outline', action: (textarea) => insertFormatTag(textarea, 's', 'texte barré') },
      { label: 'Enum niveau 1', hint: '[enum=1]', icon: 'list-outline', action: (textarea) => insertEnumTag(textarea, 1) },
      { label: 'Enum niveau 2', hint: '[enum=2]', icon: 'return-down-forward-outline', action: (textarea) => insertEnumTag(textarea, 2) },
      { label: 'Lien externe', hint: '[url]', icon: 'link-outline', action: insertUrlTag },
      { label: 'Lien projet', hint: '[projet]', icon: 'git-branch-outline', action: insertProjectTag },
      { label: 'Bouton externe', hint: '[button]', icon: 'open-outline', action: insertButtonTag },
      { label: 'Bouton projet', hint: '[button-projet]', icon: 'albums-outline', action: insertProjectButtonTag }
    ];

    textToolsMenu = document.createElement('div');
    textToolsMenu.className = 'portfolio-editor-text-tools-menu';
    textToolsMenu.hidden = true;
    textToolsMenu.setAttribute('role', 'menu');
    textToolsMenu.innerHTML = `
      <div class="portfolio-editor-text-tools-title">Insérer</div>
      ${tools.map((tool, index) => `
        <button type="button" role="menuitem" data-text-tool="${index}">
          <ion-icon name="${tool.icon}" aria-hidden="true"></ion-icon>
          <span>${tool.label}</span>
          <small>${tool.hint}</small>
        </button>
      `).join('')}
    `;

    textToolsMenu.querySelectorAll('[data-text-tool]').forEach((button) => {
      button.addEventListener('mousedown', (event) => event.preventDefault());
      button.addEventListener('click', () => {
        const textarea = activeTextToolsTextarea;
        const tool = tools[Number(button.getAttribute('data-text-tool'))];
        hideTextToolsMenu();
        if (!textarea || !tool) return;
        tool.action(textarea);
      });
    });

    document.body.appendChild(textToolsMenu);

    document.addEventListener('click', (event) => {
      if (!textToolsMenu || textToolsMenu.hidden) return;
      if (textToolsMenu.contains(event.target)) return;
      hideTextToolsMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hideTextToolsMenu();
    });

    window.addEventListener('scroll', hideTextToolsMenu, true);
    window.addEventListener('resize', hideTextToolsMenu);

    return textToolsMenu;
  }

  function showTextToolsMenu(textarea, x, y) {
    const menu = ensureTextToolsMenu();

    activeTextToolsTextarea = textarea;
    activeTextToolsRange = getTextareaRange(textarea);

    menu.hidden = false;
    menu.style.left = '0px';
    menu.style.top = '0px';

    const rect = menu.getBoundingClientRect();
    const left = Math.min(Math.max(12, x), window.innerWidth - rect.width - 12);
    const top = Math.min(Math.max(12, y), window.innerHeight - rect.height - 12);

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function bindDescriptionTextTools(textarea) {
    if (!textarea || textarea.dataset.textToolsBound === '1') return;

    textarea.dataset.textToolsBound = '1';
    textarea.classList.add('portfolio-editor-description-textarea');
    textarea.addEventListener('contextmenu', (event) => {
      if (!enabled) return;

      event.preventDefault();
      textarea.focus({ preventScroll: true });
      showTextToolsMenu(textarea, event.clientX, event.clientY);
    });
  }

  function enhanceDescription(project) {
    const desc = document.getElementById('pj-description');
    if (!desc) return;

    desc.innerHTML = '';

    const textarea = document.createElement('textarea');
    textarea.className = 'portfolio-editor-textarea';
    textarea.placeholder = 'Description du projet...';
    textarea.value = project.description || '';
    textarea.addEventListener('input', () => {
      project.description = textarea.value;
      autoResizeTextarea(textarea);
      scheduleSave();
    });
    textarea.addEventListener('blur', () => saveNow());

    desc.appendChild(textarea);
    bindDescriptionTextTools(textarea);
    autoResizeTextarea(textarea);
  }

  async function rerenderProject(project) {
    syncInlineData();
    if (window.Portfolio && typeof window.Portfolio.openProjectById === 'function') {
      await window.Portfolio.openProjectById(project.id);
    }
  }

  function ensureIconButton(project) {
    const meta = document.getElementById('pj-meta');
    if (!meta) return;

    document.getElementById('pj-editor-change-icon')?.remove();

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'pj-editor-change-icon';
    button.className = 'portfolio-editor-inline-btn';
    button.innerHTML = `
      <ion-icon name="image-outline" aria-hidden="true"></ion-icon>
      Changer l’icône
    `;

    button.addEventListener('click', async () => {
      const path = await pickMediaPath();
      if (!path) return;

      project.icon = path;
      scheduleSave({ refreshGrid: true });
      await saveNow();
    });

    meta.appendChild(button);
  }

  function clearHeroEditorControls(heroWrap) {
    heroWrap.querySelectorAll('[data-editor-hero-control], .portfolio-editor-hero-empty').forEach((node) => {
      node.remove();
    });
    heroWrap.classList.remove('portfolio-editor-hero-placeholder');
  }

  function createMediaButton(className, iconName, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);
    button.innerHTML = `<ion-icon name="${iconName}" aria-hidden="true"></ion-icon>`;
    return button;
  }

  function enhanceHeroMedia(project) {
    const heroWrap = document.getElementById('pj-hero');
    const heroImg = document.getElementById('pj-hero-img');
    if (!heroWrap) return;

    clearHeroEditorControls(heroWrap);

    const currentMedia = project.media || project.image || '';
    heroWrap.style.display = '';

    if (currentMedia) {
      const deleteButton = createMediaButton(
        'portfolio-editor-media-action danger',
        'trash-outline',
        'Supprimer le média principal'
      );
      deleteButton.setAttribute('data-editor-hero-control', '');
      deleteButton.addEventListener('click', async () => {
        if (!confirm('Supprimer le média principal ?')) return;

        project.media = '';
        project.image = '';
        scheduleSave({ refreshGrid: true });
        await saveNow();
        await rerenderProject(project);
      });

      heroWrap.appendChild(deleteButton);
      return;
    }

    const oldVideo = heroWrap.querySelector('video');
    if (oldVideo) oldVideo.remove();
    if (heroImg) {
      heroImg.removeAttribute('src');
      heroImg.style.display = 'none';
    }

    heroWrap.classList.add('portfolio-editor-hero-placeholder');

    const empty = document.createElement('div');
    empty.className = 'portfolio-editor-hero-empty';
    empty.setAttribute('data-editor-hero-control', '');
    empty.innerHTML = `
      <button type="button" class="portfolio-editor-primary">
        <ion-icon name="add-circle-outline" aria-hidden="true"></ion-icon>
        Ajouter le média principal
      </button>
    `;

    empty.querySelector('button').addEventListener('click', async () => {
      const path = await pickMediaPath();
      if (!path) return;

      project.media = path;
      scheduleSave({ refreshGrid: true });
      await saveNow();
      await rerenderProject(project);
    });

    heroWrap.appendChild(empty);
  }

  function renderEditableMediaList(medias, label) {
    const mediaItems = Array.isArray(medias) ? medias : [];

    return `
      <div class="portfolio-editor-section-medias">
        <div class="portfolio-editor-section-medias-head">
          <span>${escapeHtml(label)}</span>
          <button type="button" class="portfolio-editor-section-add-media" data-media-add aria-label="Ajouter un média">
            <ion-icon name="add-outline" aria-hidden="true"></ion-icon>
          </button>
        </div>
        <div class="portfolio-editor-section-media-list">
          ${mediaItems.map((src, mediaIndex) => {
            const safeSrc = escapeAttr(src);
            const isVideo = isVideoPath(src);
            const media = isVideo
              ? `<video src="${safeSrc}" muted playsinline preload="metadata"></video>`
              : `<img src="${safeSrc}" alt="">`;

            return `
              <figure class="portfolio-editor-section-media" data-media-index="${mediaIndex}">
                ${media}
                <button type="button" class="portfolio-editor-section-media-delete" data-media-delete aria-label="Supprimer ce média">
                  <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
                </button>
                <div class="portfolio-editor-section-media-move">
                  <button type="button" data-media-left aria-label="Déplacer à gauche" ${mediaIndex === 0 ? 'disabled' : ''}>&lt;-</button>
                  <button type="button" data-media-right aria-label="Déplacer à droite" ${mediaIndex === mediaItems.length - 1 ? 'disabled' : ''}>-&gt;</button>
                </div>
              </figure>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function bindEditableMediaList(container, medias, onChange) {
    container.querySelector('[data-media-add]')?.addEventListener('click', async () => {
      const path = await pickMediaPath();
      if (!path) return;

      medias.push(path);
      onChange();
    });

    container.querySelectorAll('.portfolio-editor-section-media').forEach((mediaItem) => {
      const mediaIndex = Number(mediaItem.getAttribute('data-media-index'));
      if (!Number.isInteger(mediaIndex)) return;

      mediaItem.querySelector('[data-media-delete]')?.addEventListener('click', () => {
        medias.splice(mediaIndex, 1);
        onChange();
      });

      mediaItem.querySelector('[data-media-left]')?.addEventListener('click', () => {
        if (mediaIndex <= 0) return;
        const [media] = medias.splice(mediaIndex, 1);
        medias.splice(mediaIndex - 1, 0, media);
        onChange();
      });

      mediaItem.querySelector('[data-media-right]')?.addEventListener('click', () => {
        if (mediaIndex >= medias.length - 1) return;
        const [media] = medias.splice(mediaIndex, 1);
        medias.splice(mediaIndex + 1, 0, media);
        onChange();
      });
    });
  }

  function enhanceProjectGallery(project) {
    const gallery = document.getElementById('pj-gallery');
    if (!gallery) return;

    if (!Array.isArray(project.medias)) project.medias = project.images || [];
    if (!Array.isArray(project.medias)) project.medias = [];

    gallery.style.display = '';
    gallery.innerHTML = `
      <h3 class="h3">Galerie</h3>
      <div class="portfolio-editor-main-gallery">
        ${renderEditableMediaList(project.medias, 'Galerie principale du projet')}
      </div>
    `;

    bindEditableMediaList(gallery, project.medias, () => {
      enhanceProjectGallery(project);
      scheduleSave();
    });
  }

  function getProjectPages(project) {
    if (!Array.isArray(project.pages)) project.pages = [];
    return project.pages;
  }

  function getActivePageIndex(project) {
    const pages = getProjectPages(project);
    if (!pages.length) return -1;

    const savedIndex = activePageByProject.get(project.id) ?? 0;
    const index = Math.min(Math.max(savedIndex, 0), pages.length - 1);
    activePageByProject.set(project.id, index);
    return index;
  }

  function getActivePage(project) {
    const index = getActivePageIndex(project);
    return index >= 0 ? project.pages[index] : null;
  }

  function setActivePageIndex(project, index) {
    activePageByProject.set(project.id, index);
  }

  function renamePage(project, index, hooks) {
    const pages = getProjectPages(project);
    const page = pages[index];
    if (!page) return;

    const currentName = page.name || `Page ${index + 1}`;
    const rawName = prompt('Nouveau nom de la page :', currentName);
    if (rawName === null) return;

    const name = rawName.trim();
    if (!name) {
      alert('Le nom de la page ne peut pas être vide.');
      return;
    }

    page.name = name;
    renderProjectPagesEditor(project, hooks);
    scheduleSave();
  }

  function movePage(project, fromIndex, toIndex, hooks) {
    const pages = getProjectPages(project);
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= pages.length || toIndex >= pages.length) return;

    const [page] = pages.splice(fromIndex, 1);
    pages.splice(toIndex, 0, page);
    setActivePageIndex(project, toIndex);
    renderProjectPagesEditor(project, hooks);
    renderSectionsEditor(project, hooks);
    scheduleSave();
  }

  function renderProjectPagesEditor(project, hooks = {}) {
    const tabsContainer = document.getElementById('pj-page-tabs');
    if (!tabsContainer) return;

    const pages = getProjectPages(project);
    const activeIndex = getActivePageIndex(project);

    tabsContainer.innerHTML = `
      <div class="portfolio-editor-pages">
        <div class="portfolio-editor-pages-head">
          <h3 class="h3">Pages</h3>
          <button type="button" class="portfolio-editor-primary" id="pj-editor-add-page">
            <ion-icon name="add-circle-outline" aria-hidden="true"></ion-icon>
            Ajouter une page
          </button>
        </div>
        <div class="portfolio-editor-page-tabs">
          ${pages.map((page, index) => `
            <div class="portfolio-editor-page-tab ${index === activeIndex ? 'active' : ''}">
              <button type="button" class="portfolio-editor-page-select" data-editor-page-select="${index}">
                ${escapeHtml(page.name || `Page ${index + 1}`)}
              </button>
              <div class="portfolio-editor-page-actions">
                <button type="button" class="portfolio-editor-page-action" data-editor-page-left="${index}" aria-label="Déplacer la page à gauche" ${index === 0 ? 'disabled' : ''}>
                  <ion-icon name="chevron-back-outline" aria-hidden="true"></ion-icon>
                </button>
                <button type="button" class="portfolio-editor-page-action" data-editor-page-right="${index}" aria-label="Déplacer la page à droite" ${index === pages.length - 1 ? 'disabled' : ''}>
                  <ion-icon name="chevron-forward-outline" aria-hidden="true"></ion-icon>
                </button>
                <button type="button" class="portfolio-editor-page-action" data-editor-page-rename="${index}" aria-label="Renommer cette page">
                  <ion-icon name="pencil-outline" aria-hidden="true"></ion-icon>
                </button>
                <button type="button" class="portfolio-editor-page-action danger" data-editor-page-delete="${index}" aria-label="Supprimer cette page">
                  <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    tabsContainer.querySelector('#pj-editor-add-page')?.addEventListener('click', () => {
      const rawName = prompt('Nom de la nouvelle page :', 'Installation');
      if (rawName === null) return;

      const name = rawName.trim() || `Page ${pages.length + 1}`;
      pages.push({ name, sections: [] });
      setActivePageIndex(project, pages.length - 1);
      renderProjectPagesEditor(project, hooks);
      renderSectionsEditor(project, hooks);
      scheduleSave();
    });

    tabsContainer.querySelectorAll('[data-editor-page-select]').forEach((button) => {
      button.addEventListener('click', () => {
        setActivePageIndex(project, Number(button.getAttribute('data-editor-page-select')));
        renderProjectPagesEditor(project, hooks);
        renderSectionsEditor(project, hooks);
      });
    });

    tabsContainer.querySelectorAll('[data-editor-page-left]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-editor-page-left'));
        movePage(project, index, index - 1, hooks);
      });
    });

    tabsContainer.querySelectorAll('[data-editor-page-right]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-editor-page-right'));
        movePage(project, index, index + 1, hooks);
      });
    });

    tabsContainer.querySelectorAll('[data-editor-page-rename]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-editor-page-rename'));
        renamePage(project, index, hooks);
      });
    });

    tabsContainer.querySelectorAll('[data-editor-page-delete]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-editor-page-delete'));
        const page = pages[index];
        if (!page) return;
        if (!confirm(`Supprimer la page "${page.name || `Page ${index + 1}`}" ?`)) return;

        pages.splice(index, 1);
        const nextIndex = Math.min(index, pages.length - 1);
        setActivePageIndex(project, nextIndex);
        renderProjectPagesEditor(project, hooks);
        renderSectionsEditor(project, hooks);
        scheduleSave();
      });
    });
  }

  function ensureSectionsToolbar(project, hooks) {
    const sectionsContainer = document.getElementById('pj-sections');
    if (!sectionsContainer) return null;

    let toolbar = document.getElementById('pj-editor-sections-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.id = 'pj-editor-sections-toolbar';
      toolbar.className = 'portfolio-editor-sections-toolbar';
      sectionsContainer.insertAdjacentElement('beforebegin', toolbar);
    }

    toolbar.innerHTML = '<h3 class="h3">Sections</h3>';

    return toolbar;
  }

  function ensureAddSectionButton(project, hooks) {
    const sectionsContainer = document.getElementById('pj-sections');
    if (!sectionsContainer) return null;

    let footer = document.getElementById('pj-editor-add-section-wrap');
    if (!footer) {
      footer = document.createElement('div');
      footer.id = 'pj-editor-add-section-wrap';
      footer.className = 'portfolio-editor-add-section-wrap';
      sectionsContainer.insertAdjacentElement('afterend', footer);
    }

    footer.innerHTML = `
      <button type="button" class="portfolio-editor-primary" id="pj-editor-add-section">
        <ion-icon name="add-circle-outline" aria-hidden="true"></ion-icon>
        Ajouter une section
      </button>
    `;

    footer.querySelector('#pj-editor-add-section')?.addEventListener('click', () => {
      const page = getActivePage(project);
      if (!page) {
        alert('Crée d’abord une page.');
        return;
      }

      page.sections.push({
        title: 'Nouvelle section',
        description: '',
        medias: []
      });

      renderSectionsEditor(project, hooks);
      scheduleSave();
    });

    return footer;
  }

  function moveSection(project, page, fromIndex, toIndex, hooks) {
    if (!page || toIndex < 0 || toIndex >= page.sections.length) return;

    const [section] = page.sections.splice(fromIndex, 1);
    page.sections.splice(toIndex, 0, section);
    renderSectionsEditor(project, hooks);
    scheduleSave();
  }

  function deleteSection(project, page, index, hooks) {
    if (!page) return;

    const section = page.sections[index];
    const label = section?.title || `Section ${index + 1}`;
    if (!confirm(`Supprimer "${label}" ?`)) return;

    page.sections.splice(index, 1);
    renderSectionsEditor(project, hooks);
    scheduleSave();
  }

  function renderSectionMedias(section) {
    const medias = section.medias || section.images || [];
    const mediaItems = Array.isArray(medias) ? medias : [];

    return `
      <div class="portfolio-editor-section-medias">
        <div class="portfolio-editor-section-medias-head">
          <span>Médias de la section</span>
          <button type="button" class="portfolio-editor-section-add-media" data-section-add-media aria-label="Ajouter un média">
            <ion-icon name="add-outline" aria-hidden="true"></ion-icon>
          </button>
        </div>
        <div class="portfolio-editor-section-media-list">
          ${mediaItems.map((src, mediaIndex) => {
            const safeSrc = escapeAttr(src);
            const isVideo = isVideoPath(src);
            const media = isVideo
              ? `<video src="${safeSrc}" muted playsinline preload="metadata"></video>`
              : `<img src="${safeSrc}" alt="">`;

            return `
              <figure class="portfolio-editor-section-media" data-section-media-index="${mediaIndex}">
                ${media}
                <button type="button" class="portfolio-editor-section-media-delete" data-media-delete aria-label="Supprimer ce média">
                  <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
                </button>
                <div class="portfolio-editor-section-media-move">
                  <button type="button" data-media-left aria-label="Déplacer à gauche" ${mediaIndex === 0 ? 'disabled' : ''}>&lt;-</button>
                  <button type="button" data-media-right aria-label="Déplacer à droite" ${mediaIndex === mediaItems.length - 1 ? 'disabled' : ''}>-&gt;</button>
                </div>
              </figure>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderSectionsEditor(project, hooks = {}) {
    const container = document.getElementById('pj-sections');
    if (!container) return;

    const page = getActivePage(project);

    ensureSectionsToolbar(project, hooks);
    ensureAddSectionButton(project, hooks);
    container.innerHTML = '';

    if (!page) {
      const empty = document.createElement('p');
      empty.className = 'portfolio-editor-empty';
      empty.textContent = 'Aucune page pour l’instant.';
      container.appendChild(empty);
      return;
    }

    if (!Array.isArray(page.sections)) page.sections = [];

    if (!page.sections.length) {
      const empty = document.createElement('p');
      empty.className = 'portfolio-editor-empty';
      empty.textContent = 'Aucune section pour l’instant.';
      container.appendChild(empty);
      return;
    }

    page.sections.forEach((section, index) => {
      if (!section || typeof section !== 'object') {
        section = page.sections[index] = { title: '', description: '', medias: [] };
      }
      if (!Array.isArray(section.medias)) section.medias = section.images || [];

      const card = document.createElement('section');
      card.className = 'project-section portfolio-editor-section-card';
      card.innerHTML = `
        <div class="portfolio-editor-section-header">
          <span class="portfolio-editor-section-index">Section ${index + 1}</span>
          <div class="portfolio-editor-section-actions">
            <button type="button" class="portfolio-editor-section-btn" data-section-up aria-label="Monter la section" ${index === 0 ? 'disabled' : ''}>
              <ion-icon name="arrow-up-outline" aria-hidden="true"></ion-icon>
            </button>
            <button type="button" class="portfolio-editor-section-btn" data-section-down aria-label="Descendre la section" ${index === page.sections.length - 1 ? 'disabled' : ''}>
              <ion-icon name="arrow-down-outline" aria-hidden="true"></ion-icon>
            </button>
            <button type="button" class="portfolio-editor-section-btn danger" data-section-delete aria-label="Supprimer la section">
              <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
            </button>
          </div>
        </div>

        <label class="portfolio-editor-label">Titre</label>
        <input class="portfolio-editor-input portfolio-editor-section-title" type="text" value="${escapeAttr(section.title || '')}" placeholder="Titre de la section">

        <label class="portfolio-editor-label">Description</label>
        <textarea class="portfolio-editor-textarea portfolio-editor-section-description" placeholder="Description de la section...">${escapeHtml(section.description || '')}</textarea>

        ${renderSectionMedias(section)}
      `;

      const titleInput = card.querySelector('.portfolio-editor-section-title');
      const descInput = card.querySelector('.portfolio-editor-section-description');

      titleInput.addEventListener('input', () => {
        section.title = titleInput.value;
        scheduleSave();
      });
      titleInput.addEventListener('blur', () => saveNow());

      descInput.addEventListener('input', () => {
        section.description = descInput.value;
        autoResizeTextarea(descInput);
        scheduleSave();
      });
      descInput.addEventListener('blur', () => saveNow());
      autoResizeTextarea(descInput);
      bindDescriptionTextTools(descInput);

      card.querySelector('[data-section-add-media]')?.addEventListener('click', async () => {
        const path = await pickMediaPath();
        if (!path) return;

        section.medias.push(path);
        renderSectionsEditor(project, hooks);
        scheduleSave();
      });

      card.querySelectorAll('.portfolio-editor-section-media').forEach((mediaItem) => {
        const mediaIndex = Number(mediaItem.getAttribute('data-section-media-index'));
        if (!Number.isInteger(mediaIndex)) return;

        mediaItem.querySelector('[data-media-delete]')?.addEventListener('click', () => {
          section.medias.splice(mediaIndex, 1);
          renderSectionsEditor(project, hooks);
          scheduleSave();
        });

        mediaItem.querySelector('[data-media-left]')?.addEventListener('click', () => {
          if (mediaIndex <= 0) return;
          const [media] = section.medias.splice(mediaIndex, 1);
          section.medias.splice(mediaIndex - 1, 0, media);
          renderSectionsEditor(project, hooks);
          scheduleSave();
        });

        mediaItem.querySelector('[data-media-right]')?.addEventListener('click', () => {
          if (mediaIndex >= section.medias.length - 1) return;
          const [media] = section.medias.splice(mediaIndex, 1);
          section.medias.splice(mediaIndex + 1, 0, media);
          renderSectionsEditor(project, hooks);
          scheduleSave();
        });
      });

      card.querySelector('[data-section-up]')?.addEventListener('click', () => {
        moveSection(project, page, index, index - 1, hooks);
      });

      card.querySelector('[data-section-down]')?.addEventListener('click', () => {
        moveSection(project, page, index, index + 1, hooks);
      });

      card.querySelector('[data-section-delete]')?.addEventListener('click', () => {
        deleteSection(project, page, index, hooks);
      });

      container.appendChild(card);
    });
  }

  function renderTags(project) {
    const header = document.querySelector('.project-detail-header');
    if (!header) return;

    let panel = document.getElementById('pj-editor-tags');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'pj-editor-tags';
      panel.className = 'portfolio-editor-tags';
      header.insertAdjacentElement('afterend', panel);
    }

    const categories = Array.isArray(project.category) ? project.category : [];
    panel.innerHTML = `
      <label class="portfolio-editor-label">Tags du projet</label>
      <div class="portfolio-editor-tag-list">
        ${categories.map((tag) => `
          <button type="button" class="portfolio-editor-tag" data-editor-remove-tag="${escapeAttr(tag)}">
            <span>${escapeHtml(tag)}</span>
            <span aria-hidden="true">×</span>
          </button>
        `).join('')}
      </div>
      <div class="portfolio-editor-tag-form">
        <input type="text" id="pj-editor-new-tag" placeholder="Ajouter un tag">
        <button type="button" id="pj-editor-add-tag">Ajouter</button>
      </div>
    `;

    panel.querySelectorAll('[data-editor-remove-tag]').forEach((button) => {
      button.addEventListener('click', () => {
        const tag = button.getAttribute('data-editor-remove-tag');
        project.category = categories.filter((item) => item !== tag);
        renderTags(project);
        scheduleSave({ refreshGrid: true });
      });
    });

    const input = panel.querySelector('#pj-editor-new-tag');
    const addButton = panel.querySelector('#pj-editor-add-tag');

    const addTag = () => {
      const tag = String(input.value || '').trim();
      if (!tag) return;
      if (!project.category.includes(tag)) project.category.push(tag);
      input.value = '';
      renderTags(project);
      scheduleSave({ refreshGrid: true });
    };

    addButton.addEventListener('click', addTag);
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      addTag();
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replaceAll('`', '&#096;');
  }

  function enhanceDetail(project, hooks = {}) {
    if (!enabled) return;

    const editableProject = ensureProjectInData(project);
    if (!editableProject) return;

    document.body.classList.add('portfolio-editor-mode');

    const title = document.getElementById('pj-title');
    const meta = document.getElementById('pj-meta');
    const dateWrap = document.getElementById('pj-date-wrap');
    const durationWrap = document.getElementById('pj-duration-wrap');
    const date = document.getElementById('pj-date');
    const duration = document.getElementById('pj-duration');

    if (meta) meta.hidden = false;
    if (dateWrap) dateWrap.hidden = false;
    if (durationWrap) durationWrap.hidden = false;

    if (title && title.textContent !== editableProject.title) {
      title.textContent = editableProject.title || editableProject.id || '';
    }
    if (date && date.textContent !== (editableProject.date || '')) date.textContent = editableProject.date || '';
    if (duration && duration.textContent !== (editableProject.duration || '')) duration.textContent = editableProject.duration || '';

    makeContentEditable(title, 'Titre du projet', (value) => {
      editableProject.title = value || editableProject.id;
      hooks.scheduleProjectTitleFit?.();
    });

    makeContentEditable(date, 'Date', (value) => {
      editableProject.date = value;
    });

    makeContentEditable(duration, 'Durée', (value) => {
      editableProject.duration = value;
    });

    ensureIconButton(editableProject);
    enhanceHeroMedia(editableProject);
    enhanceProjectGallery(editableProject);
    renderTags(editableProject);
    enhanceDescription(editableProject);
    renderProjectPagesEditor(editableProject, hooks);
    renderSectionsEditor(editableProject, hooks);
    hooks.scheduleProjectTitleFit?.();
  }

  window.PortfolioEditor = {
    enabled,
    getData,
    saveNow,
    enhanceGrid,
    enhanceDetail
  };

  if (!enabled) return;

  document.body.classList.add('portfolio-editor-mode');

  document.addEventListener('DOMContentLoaded', () => {
    getData();
    createEditorToolbar();
    enhanceGrid();
  });
})();
