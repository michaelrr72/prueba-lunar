/**
 * Prueba Lunar — Generador de equipos
 * ====================================
 * Modal flotante con tres modalidades de generación:
 *   - aleatorio: 4 al azar
 *   - filtros:   restricciones por elemento/arma/región
 *   - balanceado: rol DPS/Sub/Support/Healer
 *
 * Dos fuentes de pool:
 *   - generic:    todos los personajes jugables
 *   - roster:     solo los marcados como propios
 *
 * Roster del usuario poblado por:
 *   - checkboxes + filtros
 *   - pegado de texto (separa por coma, salto de línea, pipe, ...)
 */
(function attachTeamGenerator(global) {
  'use strict';

  const data = global.PruebaLunarCharacters;
  if (!data) {
    console.error('[team-generator] PruebaLunarCharacters no está cargado');
    return;
  }

  // -------------------------------------------------------------------
  // Estado en memoria (no persistente excepto el roster)
  // -------------------------------------------------------------------
  const state = {
    isOpen: false,
    activeTab: 'generate',          // generate | roster | help
    pool: 'generic',                 // generic | roster
    modality: 'random',              // random | filters | balanced
    filters: {
      elements: new Set(),
      weapons: new Set(),
      rarities: new Set()
    },
    rosterFilters: {
      element: 'all',
      weapon: 'all',
      rarity: 'all',
      region: 'all',
      search: ''
    },
    lastResult: null,
    lastError: null
  };

  let elements = {};       // refs DOM cacheadas
  let modalRoot = null;    // <div> que contiene el modal entero

  // -------------------------------------------------------------------
  // Construcción del DOM del modal
  // -------------------------------------------------------------------
  function buildModalMarkup() {
    return `
      <div class="tg-backdrop" data-tg-close="true"></div>
      <div class="tg-modal" role="dialog" aria-modal="true" aria-labelledby="tg-title">
        <div class="tg-header">
          <h2 class="tg-title" id="tg-title">
            <span aria-hidden="true">🎲</span> Generador de equipos
          </h2>
          <button class="tg-close" type="button" aria-label="Cerrar generador" data-tg-close="true">×</button>
        </div>

        <div class="tg-tabs" role="tablist">
          <button class="tg-tab is-active" role="tab" data-tg-tab="generate" aria-selected="true">
            Generar
          </button>
          <button class="tg-tab" role="tab" data-tg-tab="roster" aria-selected="false">
            Mi lista
          </button>
          <button class="tg-tab" role="tab" data-tg-tab="help" aria-selected="false">
            Cómo funciona
          </button>
        </div>

        <div class="tg-body">
          ${buildGenerateTabMarkup()}
          ${buildRosterTabMarkup()}
          ${buildHelpTabMarkup()}
        </div>
      </div>
    `;
  }

  function buildGenerateTabMarkup() {
    return `
      <section class="tg-pane is-active" data-tg-pane="generate">
        <div class="tg-field-group">
          <p class="tg-field-label">Pool de personajes</p>
          <div class="tg-segmented" role="radiogroup" aria-label="Pool de personajes">
            <button class="tg-seg is-active" data-tg-pool="generic" role="radio" aria-checked="true">
              🌐 Todos (${data.CHARACTERS.length})
            </button>
            <button class="tg-seg" data-tg-pool="roster" role="radio" aria-checked="false">
              👤 Mi lista (<span id="tg-roster-count">0</span>)
            </button>
          </div>
        </div>

        <div class="tg-field-group">
          <p class="tg-field-label">Modalidad</p>
          <div class="tg-segmented" role="radiogroup" aria-label="Modalidad de generación">
            <button class="tg-seg is-active" data-tg-mod="random" role="radio" aria-checked="true">
              Aleatorio
            </button>
            <button class="tg-seg" data-tg-mod="filters" role="radio" aria-checked="false">
              Con filtros
            </button>
            <button class="tg-seg" data-tg-mod="balanced" role="radio" aria-checked="false">
              Balanceado
            </button>
          </div>
        </div>

        <div class="tg-modality-panel" id="tg-modality-random">
          <p class="tg-helper">Sortea 4 personajes del pool sin restricciones.</p>
        </div>

        <div class="tg-modality-panel" id="tg-modality-filters" hidden>
          <p class="tg-helper">Marca al menos un elemento/arma/rareza requerido. Cada uno aparecerá al menos una vez si es posible.</p>
          <div class="tg-chip-row">
            <span class="tg-chip-row-label">Elementos:</span>
            ${data.ELEMENTS.map(e => `
              <button class="tg-chip tg-chip-element" data-tg-element="${e}" type="button" aria-pressed="false">
                ${data.ELEMENT_LABELS[e]}
              </button>
            `).join('')}
          </div>
          <div class="tg-chip-row">
            <span class="tg-chip-row-label">Armas:</span>
            ${data.WEAPONS.map(w => `
              <button class="tg-chip" data-tg-weapon="${w}" type="button" aria-pressed="false">
                ${data.WEAPON_LABELS[w]}
              </button>
            `).join('')}
          </div>
          <div class="tg-chip-row">
            <span class="tg-chip-row-label">Rareza:</span>
            <button class="tg-chip" data-tg-rarity="5" type="button" aria-pressed="false">5★</button>
            <button class="tg-chip" data-tg-rarity="4" type="button" aria-pressed="false">4★</button>
          </div>
        </div>

        <div class="tg-modality-panel" id="tg-modality-balanced" hidden>
          <p class="tg-helper">Intenta cubrir un equipo con un DPS, un Sub-DPS, un Support y un Healer. Si el pool no cubre algún rol, completa con lo más cercano.</p>
        </div>

        <div class="tg-actions">
          <button class="btn btn-gold" id="tg-btn-generate" type="button">
            <span aria-hidden="true">🎲</span> Generar equipo
          </button>
          <button class="btn btn-ghost" id="tg-btn-copy" type="button" disabled>
            <span aria-hidden="true">📋</span> Copiar
          </button>
        </div>

        <div class="tg-result" id="tg-result"></div>
      </section>
    `;
  }

  function buildRosterTabMarkup() {
    return `
      <section class="tg-pane" data-tg-pane="roster" hidden>
        <div class="tg-roster-toolbar">
          <input type="search" class="tg-search" id="tg-roster-search"
                 placeholder="Buscar personaje..." aria-label="Buscar personaje" />
          <select class="tg-select" id="tg-roster-filter-element" aria-label="Filtrar por elemento">
            <option value="all">Todos los elementos</option>
            ${data.ELEMENTS.map(e => `<option value="${e}">${data.ELEMENT_LABELS[e]}</option>`).join('')}
          </select>
          <select class="tg-select" id="tg-roster-filter-weapon" aria-label="Filtrar por arma">
            <option value="all">Todas las armas</option>
            ${data.WEAPONS.map(w => `<option value="${w}">${data.WEAPON_LABELS[w]}</option>`).join('')}
          </select>
          <select class="tg-select" id="tg-roster-filter-rarity" aria-label="Filtrar por rareza">
            <option value="all">Todas las rarezas</option>
            <option value="5">5★</option>
            <option value="4">4★</option>
          </select>
          <select class="tg-select" id="tg-roster-filter-region" aria-label="Filtrar por región">
            <option value="all">Todas las regiones</option>
            ${data.REGIONS.map(r => `<option value="${r}">${data.REGION_LABELS[r]}</option>`).join('')}
          </select>
        </div>

        <div class="tg-roster-bulk">
          <button class="btn btn-ghost btn-sm" id="tg-roster-select-all" type="button">Marcar visibles</button>
          <button class="btn btn-ghost btn-sm" id="tg-roster-clear" type="button">Limpiar todo</button>
          <span class="tg-roster-stats" id="tg-roster-stats">0 marcados</span>
        </div>

        <div class="tg-roster-grid" id="tg-roster-grid"></div>

        <details class="tg-paste-block">
          <summary class="tg-paste-summary">📝 Pegar lista de texto</summary>
          <div class="tg-paste-body">
            <p class="tg-helper">Pega los nombres separados por coma, salto de línea o pipe. Reconoce alias comunes ("Hu Tao", "Childe", "Shogun Raiden") y limpia sufijos tipo "Nv. 90".</p>
            <textarea class="tg-textarea" id="tg-paste-input" rows="6"
                      placeholder="Hu Tao, Xingqiu, Bennett, Kazuha
Furina Nv. 90
Neuvillette
Yelan"></textarea>
            <div class="tg-paste-actions">
              <button class="btn btn-gold btn-sm" id="tg-btn-paste-apply" type="button">Añadir al roster</button>
              <button class="btn btn-ghost btn-sm" id="tg-btn-paste-clear" type="button">Limpiar</button>
            </div>
            <div class="tg-paste-feedback" id="tg-paste-feedback" hidden></div>
          </div>
        </details>
      </section>
    `;
  }

  function buildHelpTabMarkup() {
    return `
      <section class="tg-pane" data-tg-pane="help" hidden>
        <h3 class="tg-help-title">¿Cómo funciona?</h3>
        <ul class="tg-help-list">
          <li><strong>Pool genérico</strong> usa los ${data.CHARACTERS.length} personajes jugables del juego (hasta v6.6).</li>
          <li><strong>Mi lista</strong> usa solo los personajes que has marcado en la pestaña <em>Mi lista</em>.</li>
        </ul>

        <h3 class="tg-help-title">Modalidades</h3>
        <ul class="tg-help-list">
          <li><strong>Aleatorio</strong>: 4 al azar del pool, sin restricciones.</li>
          <li><strong>Con filtros</strong>: especificas qué elementos/armas/rarezas tienen que aparecer. Si activas "Pyro" y "Electro", cada uno aparecerá al menos una vez. El resto se rellena al azar.</li>
          <li><strong>Balanceado</strong>: intenta cubrir DPS principal + Sub-DPS + Support + Sanador. Si el pool no tiene de algún rol, completa con lo más cercano.</li>
        </ul>

        <h3 class="tg-help-title">Tips</h3>
        <ul class="tg-help-list">
          <li>Los roles primario/secundario son una <strong>aproximación de comunidad</strong>. Algunos personajes son flexibles según el equipo.</li>
          <li>El roster se guarda en este dispositivo (localStorage). Si limpias el almacenamiento del navegador, se borra.</li>
          <li>Los retratos vienen de un CDN público. Si no carga, se muestra el nombre con su elemento y arma.</li>
        </ul>

        <p class="legal-notice" style="margin-top: 18px; text-align: left;">
          Retratos: <a href="https://genshin.jmp.blue/" target="_blank" rel="noopener noreferrer">genshin.jmp.blue</a>,
          <a href="https://enka.network/" target="_blank" rel="noopener noreferrer">enka.network</a>.
          Personajes y assets © COGNOSPHERE PTE. LTD. / HoYoverse.
          Proyecto fan no oficial.
        </p>
      </section>
    `;
  }

  // -------------------------------------------------------------------
  // Lifecycle: abrir/cerrar
  // -------------------------------------------------------------------
  function open() {
    if (state.isOpen) return;
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.className = 'tg-root';
      modalRoot.innerHTML = buildModalMarkup();
      document.body.appendChild(modalRoot);
      cacheElements();
      attachEvents();
    }
    state.isOpen = true;
    modalRoot.classList.add('is-open');
    document.body.classList.add('tg-modal-open');
    refreshAll();
    setTimeout(() => elements.btnGenerate?.focus(), 50);
  }

  function close() {
    if (!state.isOpen || !modalRoot) return;
    state.isOpen = false;
    modalRoot.classList.remove('is-open');
    document.body.classList.remove('tg-modal-open');
  }

  // -------------------------------------------------------------------
  // Referencias DOM
  // -------------------------------------------------------------------
  function cacheElements() {
    elements = {
      backdrops: modalRoot.querySelectorAll('[data-tg-close="true"]'),
      tabs: modalRoot.querySelectorAll('.tg-tab'),
      panes: modalRoot.querySelectorAll('.tg-pane'),
      poolSegs: modalRoot.querySelectorAll('[data-tg-pool]'),
      modSegs: modalRoot.querySelectorAll('[data-tg-mod]'),
      modalityPanels: {
        random: modalRoot.querySelector('#tg-modality-random'),
        filters: modalRoot.querySelector('#tg-modality-filters'),
        balanced: modalRoot.querySelector('#tg-modality-balanced')
      },
      elementChips: modalRoot.querySelectorAll('[data-tg-element]'),
      weaponChips: modalRoot.querySelectorAll('[data-tg-weapon]'),
      rarityChips: modalRoot.querySelectorAll('[data-tg-rarity]'),
      btnGenerate: modalRoot.querySelector('#tg-btn-generate'),
      btnCopy: modalRoot.querySelector('#tg-btn-copy'),
      result: modalRoot.querySelector('#tg-result'),
      rosterCount: modalRoot.querySelector('#tg-roster-count'),
      rosterStats: modalRoot.querySelector('#tg-roster-stats'),
      rosterSearch: modalRoot.querySelector('#tg-roster-search'),
      rosterFilterElement: modalRoot.querySelector('#tg-roster-filter-element'),
      rosterFilterWeapon: modalRoot.querySelector('#tg-roster-filter-weapon'),
      rosterFilterRarity: modalRoot.querySelector('#tg-roster-filter-rarity'),
      rosterFilterRegion: modalRoot.querySelector('#tg-roster-filter-region'),
      rosterGrid: modalRoot.querySelector('#tg-roster-grid'),
      btnSelectAll: modalRoot.querySelector('#tg-roster-select-all'),
      btnClear: modalRoot.querySelector('#tg-roster-clear'),
      pasteInput: modalRoot.querySelector('#tg-paste-input'),
      btnPasteApply: modalRoot.querySelector('#tg-btn-paste-apply'),
      btnPasteClear: modalRoot.querySelector('#tg-btn-paste-clear'),
      pasteFeedback: modalRoot.querySelector('#tg-paste-feedback')
    };
  }

  // -------------------------------------------------------------------
  // Listeners
  // -------------------------------------------------------------------
  function attachEvents() {
    elements.backdrops.forEach(el => el.addEventListener('click', close));

    elements.tabs.forEach(tab => {
      tab.addEventListener('click', () => setTab(tab.dataset.tgTab));
    });

    elements.poolSegs.forEach(seg => {
      seg.addEventListener('click', () => setPool(seg.dataset.tgPool));
    });

    elements.modSegs.forEach(seg => {
      seg.addEventListener('click', () => setModality(seg.dataset.tgMod));
    });

    elements.elementChips.forEach(chip => {
      chip.addEventListener('click', () => toggleFilter('elements', chip.dataset.tgElement, chip));
    });
    elements.weaponChips.forEach(chip => {
      chip.addEventListener('click', () => toggleFilter('weapons', chip.dataset.tgWeapon, chip));
    });
    elements.rarityChips.forEach(chip => {
      chip.addEventListener('click', () => toggleFilter('rarities', Number(chip.dataset.tgRarity), chip));
    });

    elements.btnGenerate.addEventListener('click', generate);
    elements.btnCopy.addEventListener('click', copyTeamToClipboard);

    elements.rosterSearch.addEventListener('input', () => {
      state.rosterFilters.search = elements.rosterSearch.value;
      renderRosterGrid();
    });
    elements.rosterFilterElement.addEventListener('change', () => {
      state.rosterFilters.element = elements.rosterFilterElement.value;
      renderRosterGrid();
    });
    elements.rosterFilterWeapon.addEventListener('change', () => {
      state.rosterFilters.weapon = elements.rosterFilterWeapon.value;
      renderRosterGrid();
    });
    elements.rosterFilterRarity.addEventListener('change', () => {
      state.rosterFilters.rarity = elements.rosterFilterRarity.value;
      renderRosterGrid();
    });
    elements.rosterFilterRegion.addEventListener('change', () => {
      state.rosterFilters.region = elements.rosterFilterRegion.value;
      renderRosterGrid();
    });

    elements.btnSelectAll.addEventListener('click', selectAllVisible);
    elements.btnClear.addEventListener('click', clearAll);

    elements.btnPasteApply.addEventListener('click', applyPastedRoster);
    elements.btnPasteClear.addEventListener('click', () => {
      elements.pasteInput.value = '';
      elements.pasteFeedback.hidden = true;
    });

    // ESC para cerrar.
    document.addEventListener('keydown', e => {
      if (state.isOpen && e.key === 'Escape') close();
    });
  }

  // -------------------------------------------------------------------
  // State setters → re-render
  // -------------------------------------------------------------------
  function setTab(tab) {
    state.activeTab = tab;
    elements.tabs.forEach(t => {
      const active = t.dataset.tgTab === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    elements.panes.forEach(p => {
      const active = p.dataset.tgPane === tab;
      p.classList.toggle('is-active', active);
      p.hidden = !active;
    });
    if (tab === 'roster') renderRosterGrid();
  }

  function setPool(pool) {
    state.pool = pool;
    elements.poolSegs.forEach(seg => {
      const active = seg.dataset.tgPool === pool;
      seg.classList.toggle('is-active', active);
      seg.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  function setModality(mod) {
    state.modality = mod;
    elements.modSegs.forEach(seg => {
      const active = seg.dataset.tgMod === mod;
      seg.classList.toggle('is-active', active);
      seg.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    Object.entries(elements.modalityPanels).forEach(([key, panel]) => {
      panel.hidden = key !== mod;
    });
  }

  function toggleFilter(group, value, chip) {
    const set = state.filters[group];
    if (set.has(value)) set.delete(value);
    else set.add(value);
    chip.classList.toggle('is-active', set.has(value));
    chip.setAttribute('aria-pressed', set.has(value) ? 'true' : 'false');
  }

  // -------------------------------------------------------------------
  // Generación de equipos
  // -------------------------------------------------------------------
  function getActivePool() {
    if (state.pool === 'roster') {
      const ids = new Set(data.getRoster());
      return data.CHARACTERS.filter(c => ids.has(c.id));
    }
    return data.CHARACTERS.slice();
  }

  /** Fisher-Yates */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRandom(pool, n) {
    return shuffle(pool).slice(0, n);
  }

  /**
   * Devuelve true si `candidate` puede unirse a `team` respetando:
   *  - no es el mismo personaje (id)
   *  - no comparte groupId con ningún miembro del equipo (las 7
   *    formas del Trotamundos comparten groupId 'traveler', así que
   *    solo una puede entrar por equipo).
   */
  function isCompatibleWith(team, candidate) {
    return !team.some(member => {
      if (member.id === candidate.id) return true;
      if (candidate.groupId && member.groupId && member.groupId === candidate.groupId) return true;
      return false;
    });
  }

  /** Toma el siguiente candidato compatible de una lista (ya barajada). */
  function nextCompatible(shuffledCandidates, team) {
    for (const c of shuffledCandidates) {
      if (isCompatibleWith(team, c)) return c;
    }
    return null;
  }

  function generateRandom(pool) {
    if (pool.length < 4) return { error: shortPoolError(pool) };
    const shuffled = shuffle(pool);
    const team = [];
    for (const c of shuffled) {
      if (team.length === 4) break;
      if (isCompatibleWith(team, c)) team.push(c);
    }
    if (team.length < 4) {
      return { team, warning: 'El pool no tiene suficientes personajes únicos (sin compartir grupo) para llegar a 4.' };
    }
    return { team };
  }

  function generateFilters(pool) {
    if (pool.length < 4) return { error: shortPoolError(pool) };

    const need = {
      elements: Array.from(state.filters.elements),
      weapons: Array.from(state.filters.weapons),
      rarities: Array.from(state.filters.rarities)
    };
    const totalConstraints = need.elements.length + need.weapons.length + need.rarities.length;
    if (totalConstraints === 0) return generateRandom(pool);
    if (totalConstraints > 4) {
      return { error: 'Has marcado más de 4 restricciones; reduce las exigencias o usa "Aleatorio".' };
    }

    const team = [];

    function findAndAdd(predicate) {
      const candidates = shuffle(pool.filter(c => predicate(c)));
      const picked = nextCompatible(candidates, team);
      if (!picked) return false;
      team.push(picked);
      return true;
    }

    // Cubrir restricciones en orden.
    const unsatisfied = [];
    need.elements.forEach(e => {
      if (team.some(c => c.element === e)) return;
      if (!findAndAdd(c => c.element === e)) unsatisfied.push(`elemento ${data.ELEMENT_LABELS[e]}`);
    });
    need.weapons.forEach(w => {
      if (team.some(c => c.weapon === w)) return;
      if (!findAndAdd(c => c.weapon === w)) unsatisfied.push(`arma ${data.WEAPON_LABELS[w]}`);
    });
    need.rarities.forEach(r => {
      if (team.some(c => c.rarity === r)) return;
      if (!findAndAdd(c => c.rarity === r)) unsatisfied.push(`rareza ${r}★`);
    });

    // Rellenar hasta 4 con aleatorios compatibles.
    const remainingPool = shuffle(pool);
    for (const c of remainingPool) {
      if (team.length === 4) break;
      if (isCompatibleWith(team, c)) team.push(c);
    }

    return {
      team,
      warning: unsatisfied.length
        ? `No se pudo cubrir: ${unsatisfied.join(', ')}.`
        : null
    };
  }

  function generateBalanced(pool) {
    if (pool.length < 4) return { error: shortPoolError(pool) };

    const targetRoles = ['dps', 'sub-dps', 'support', 'healer'];
    const team = [];

    // Para cada rol objetivo, buscar primero por primario, luego por secundario.
    targetRoles.forEach(role => {
      let candidates = shuffle(pool.filter(c => c.roles.primary === role));
      let picked = nextCompatible(candidates, team);
      if (!picked) {
        candidates = shuffle(pool.filter(c => c.roles.secondary === role));
        picked = nextCompatible(candidates, team);
      }
      if (picked) team.push(picked);
    });

    const unfilledRoles = targetRoles.filter(role =>
      !team.some(c => c.roles.primary === role || c.roles.secondary === role)
    );

    // Rellenar con aleatorios compatibles.
    const remainingPool = shuffle(pool);
    for (const c of remainingPool) {
      if (team.length === 4) break;
      if (isCompatibleWith(team, c)) team.push(c);
    }

    return {
      team,
      warning: unfilledRoles.length
        ? `El pool no cubre estos roles: ${unfilledRoles.map(r => data.ROLE_LABELS[r]).join(', ')}.`
        : null
    };
  }

  function shortPoolError(pool) {
    if (state.pool === 'roster' && pool.length === 0) {
      return 'Tu roster está vacío. Marca personajes en la pestaña "Mi lista" o pega una lista de texto.';
    }
    return `El pool tiene solo ${pool.length} personajes; se necesitan al menos 4.`;
  }

  function generate() {
    const pool = getActivePool();
    let result;
    if (state.modality === 'filters') result = generateFilters(pool);
    else if (state.modality === 'balanced') result = generateBalanced(pool);
    else result = generateRandom(pool);

    state.lastResult = result.team || null;
    state.lastError = result.error || null;
    renderResult(result);
    elements.btnCopy.disabled = !state.lastResult || state.lastResult.length === 0;
  }

  // -------------------------------------------------------------------
  // Renderizado del resultado
  // -------------------------------------------------------------------
  function renderResult({ team, warning, error }) {
    if (error) {
      elements.result.innerHTML = `<div class="tg-result-error">${escapeHtml(error)}</div>`;
      return;
    }
    if (!team || !team.length) {
      elements.result.innerHTML = '';
      return;
    }
    const warningHtml = warning
      ? `<div class="tg-result-warning">⚠ ${escapeHtml(warning)}</div>`
      : '';
    elements.result.innerHTML = `
      ${warningHtml}
      <div class="tg-team-grid">
        ${team.map(c => renderCharacterCard(c)).join('')}
      </div>
    `;
  }

  function renderCharacterCard(c) {
    const iconUrls = data.getIconUrls(c);
    const elementLabel = data.ELEMENT_LABELS[c.element];
    const weaponLabel = data.WEAPON_LABELS[c.weapon];
    const color = data.ELEMENT_COLORS[c.element];
    const glyph = data.ELEMENT_GLYPHS[c.element] || '✶';
    const rolePrimary = data.ROLE_LABELS[c.roles.primary];

    // Si no hay ninguna URL candidata, vamos directos al glifo.
    const fallbackUpfront = iconUrls.length === 0;

    // Serializo el resto de URLs como JSON en un data-attribute para
    // que onerror las pueda probar una a una. La primera URL la pongo
    // en src directamente; el resto queda en data-fallback-urls.
    const firstUrl = iconUrls[0] || '';
    const fallbackUrlsAttr = iconUrls.length > 1
      ? `data-tg-fallback='${escapeHtml(JSON.stringify(iconUrls.slice(1)))}'`
      : '';

    // Handler inline: lee el siguiente candidato; si está, lo aplica;
    // si no, marca al contenedor como is-fallback y se borra.
    const onerrorHandler = `
      try{
        var arr = JSON.parse(this.dataset.tgFallback || '[]');
        if (arr.length) {
          this.src = arr.shift();
          this.dataset.tgFallback = JSON.stringify(arr);
        } else {
          this.parentElement.classList.add('is-fallback');
          this.remove();
        }
      } catch(e) {
        this.parentElement.classList.add('is-fallback');
        this.remove();
      }
    `.replace(/\s+/g, ' ').trim();

    return `
      <div class="tg-char-card" data-element="${c.element}" style="--tg-elem-color: ${color}">
        <div class="tg-char-portrait ${fallbackUpfront ? 'is-fallback' : ''}">
          ${firstUrl
            ? `<img src="${firstUrl}" ${fallbackUrlsAttr} alt="${escapeHtml(c.name)}" loading="lazy"
                    onerror="${onerrorHandler}" />`
            : ''}
          <div class="tg-char-portrait-fallback" aria-hidden="true">
            <span class="tg-char-glyph">${glyph}</span>
          </div>
          <span class="tg-char-rarity">${'★'.repeat(c.rarity)}</span>
        </div>
        <div class="tg-char-info">
          <div class="tg-char-name">${escapeHtml(c.name)}</div>
          <div class="tg-char-chips">
            <span class="tg-char-chip tg-char-chip-element">${elementLabel}</span>
            <span class="tg-char-chip">${weaponLabel}</span>
          </div>
          <div class="tg-char-role">${rolePrimary}</div>
        </div>
      </div>
    `;
  }

  function copyTeamToClipboard() {
    if (!state.lastResult) return;
    const text = state.lastResult
      .map(c => `${c.name} (${data.ELEMENT_LABELS[c.element]}, ${data.WEAPON_LABELS[c.weapon]})`)
      .join(', ');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        elements.btnCopy.textContent = '✓ Copiado';
        setTimeout(() => {
          elements.btnCopy.innerHTML = '<span aria-hidden="true">📋</span> Copiar';
        }, 1500);
      });
    }
  }

  // -------------------------------------------------------------------
  // Tab "Mi lista"
  // -------------------------------------------------------------------
  function getFilteredCharacters() {
    const f = state.rosterFilters;
    const query = data.normalize(f.search);
    return data.CHARACTERS.filter(c => {
      if (f.element !== 'all' && c.element !== f.element) return false;
      if (f.weapon !== 'all' && c.weapon !== f.weapon) return false;
      if (f.rarity !== 'all' && c.rarity !== Number(f.rarity)) return false;
      if (f.region !== 'all' && c.region !== f.region) return false;
      if (query) {
        const inName = data.normalize(c.name).includes(query)
                    || data.normalize(c.nameEs).includes(query);
        if (!inName) return false;
      }
      return true;
    });
  }

  function renderRosterGrid() {
    const roster = new Set(data.getRoster());
    const filtered = getFilteredCharacters();
    elements.rosterGrid.innerHTML = filtered.map(c => {
      const inRoster = roster.has(c.id);
      return `
        <label class="tg-roster-item ${inRoster ? 'is-checked' : ''}">
          <input type="checkbox" data-tg-roster-id="${c.id}" ${inRoster ? 'checked' : ''} />
          <span class="tg-roster-item-name">${escapeHtml(c.name)}</span>
          <span class="tg-roster-item-tags">
            <span class="tg-mini-chip" style="--tg-elem-color: ${data.ELEMENT_COLORS[c.element]}">${data.ELEMENT_LABELS[c.element]}</span>
            <span class="tg-mini-chip">${data.WEAPON_LABELS[c.weapon]}</span>
            <span class="tg-mini-chip">${c.rarity}★</span>
          </span>
        </label>
      `;
    }).join('');

    elements.rosterGrid.querySelectorAll('input[data-tg-roster-id]').forEach(input => {
      input.addEventListener('change', () => {
        data.toggleInRoster(input.dataset.tgRosterId);
        input.closest('.tg-roster-item').classList.toggle('is-checked', input.checked);
        updateRosterCounts();
      });
    });

    updateRosterCounts();
  }

  function updateRosterCounts() {
    const roster = data.getRoster();
    if (elements.rosterCount) elements.rosterCount.textContent = roster.length;
    if (elements.rosterStats) elements.rosterStats.textContent = `${roster.length} marcados`;
  }

  function selectAllVisible() {
    const filtered = getFilteredCharacters();
    const roster = new Set(data.getRoster());
    filtered.forEach(c => roster.add(c.id));
    data.setRoster(Array.from(roster));
    renderRosterGrid();
  }

  function clearAll() {
    if (!confirm('¿Limpiar todo el roster? Esta acción no se puede deshacer.')) return;
    data.clearRoster();
    renderRosterGrid();
  }

  function applyPastedRoster() {
    const text = elements.pasteInput.value;
    const { matched, unmatched } = data.parseRosterText(text);

    if (matched.length === 0 && unmatched.length === 0) {
      showPasteFeedback('warn', 'El cuadro está vacío.');
      return;
    }

    const roster = new Set(data.getRoster());
    matched.forEach(c => roster.add(c.id));
    data.setRoster(Array.from(roster));

    let html = `<strong>${matched.length}</strong> añadidos al roster.`;
    if (unmatched.length) {
      html += `<br><span class="tg-paste-warn">No identificados (${unmatched.length}):</span> ${unmatched.map(escapeHtml).join(', ')}`;
    }
    showPasteFeedback('ok', html, true);
    renderRosterGrid();
  }

  function showPasteFeedback(kind, html, asHtml) {
    elements.pasteFeedback.hidden = false;
    elements.pasteFeedback.className = `tg-paste-feedback is-${kind}`;
    if (asHtml) elements.pasteFeedback.innerHTML = html;
    else elements.pasteFeedback.textContent = html;
  }

  function refreshAll() {
    updateRosterCounts();
    if (state.activeTab === 'roster') renderRosterGrid();
  }

  // -------------------------------------------------------------------
  // Utilidades
  // -------------------------------------------------------------------
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // -------------------------------------------------------------------
  // Inicialización automática: añadir botón en topbar de los modos.
  // -------------------------------------------------------------------
  function ensureTopbarButton() {
    document.querySelectorAll('.topbar-actions').forEach(container => {
      if (container.querySelector('[data-tg-trigger]')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-ghost btn-sm tg-trigger';
      btn.setAttribute('data-tg-trigger', 'true');
      btn.setAttribute('aria-label', 'Abrir generador de equipos');
      btn.innerHTML = '<span aria-hidden="true">🎲</span> <span class="tg-trigger-label">Equipos</span>';
      btn.addEventListener('click', open);
      // Insertarlo justo antes del primer enlace, para que quede a la
      // izquierda de los enlaces de navegación.
      const firstLink = container.querySelector('a.btn');
      if (firstLink) container.insertBefore(btn, firstLink);
      else container.appendChild(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureTopbarButton);
  } else {
    ensureTopbarButton();
  }
  // Re-evaluar tras los renders dinámicos de buildModeShell del coop.
  const observer = new MutationObserver(() => ensureTopbarButton());
  observer.observe(document.body, { childList: true, subtree: true });

  // -------------------------------------------------------------------
  // Export para integración manual y testing
  // -------------------------------------------------------------------
  global.PruebaLunarTeamGenerator = { open, close, generate };
})(typeof window !== 'undefined' ? window : globalThis);
