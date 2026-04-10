import {
  ROUND_COUNT,
  createDefaultGameState,
  getScore,
  hydrateGameState,
  serializeGameState
} from '../core/state.js';
import { createStorage } from '../core/storage.js';
import {
  createLiveAnnouncer,
  formatMinutesLabel,
  formatTimerMarkup,
  isTypingTarget
} from '../core/utils.js';
import { APP_VERSION_LABEL, getModeConfig } from '../data/modes.js';
import {
  buildAssignedChallenges,
  buildChallengeFromBoss,
  getFilteredBossPool
} from './challenge-generator.js';
import { createRouletteController } from './roulette.js';
import { createTimerController } from './timer.js';

function buildListMarkup(items) {
  return items.map(item => `<li>${item}</li>`).join('');
}

function buildShortcutMarkup() {
  return `
    <li><kbd>S</kbd> sortear reto</li>
    <li><kbd>Espacio</kbd> iniciar o pausar tiempo</li>
    <li><kbd>R</kbd> reiniciar intento</li>
    <li><kbd>W</kbd> marcar victoria</li>
    <li><kbd>L</kbd> marcar derrota</li>
  `;
}

function buildLivePanelCopy(modeKey) {
  if (modeKey === 'supervisado') {
    return [
      'El supervisor valida sin intervenir en combate.',
      'Usa la ruleta para cambiar rápido de reto durante el directo.',
      'Cuando el tiempo termine, registra el resultado manualmente sin popups bloqueantes.'
    ];
  }

  return [
    'Gestiona cada ronda con accesos rápidos para directo.',
    'El cronómetro avisa hitos importantes y evita pausas innecesarias.',
    'Puedes editar el reto actual si necesitas una variante personalizada.'
  ];
}

function extractTimeLimitFromConditions(conditions, fallbackMinutes = 6) {
  const timeText = conditions.find(text => text.toLowerCase().includes('tiempo limite:') || text.toLowerCase().includes('tiempo límite:'));
  if (!timeText) return fallbackMinutes;

  const match = timeText.match(/(\d+)/);
  return match ? Number(match[1]) : fallbackMinutes;
}

function buildModeShell(modeConfig) {
  const livePanelTitle = modeConfig.key === 'supervisado' ? 'Validación en vivo' : 'Flujo en vivo';

  return `
    <header class="topbar">
      <a class="brand" href="index.html">
        <span class="brand-mark" aria-hidden="true">☾</span>
        <span>Prueba Lunar</span>
      </a>
      <div class="topbar-actions">
        <span class="status-chip status-chip-live">${modeConfig.label}</span>
        <a class="btn btn-ghost btn-sm" href="index.html">Inicio</a>
        <a class="btn btn-ghost btn-sm" href="torneo.html">Torneo</a>
      </div>
    </header>

    <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>

    <main class="page-wrap page-dashboard">
      <section class="hero hero-dashboard">
        <div class="hero-copy">
          <div class="eyebrow">${modeConfig.label} · ${APP_VERSION_LABEL}</div>
          <h1 class="hero-title">Prueba Lunar</h1>
          <p class="hero-text" id="header-subtitle">${modeConfig.challengeSubtitle}</p>
          <div class="hero-actions">
            <div class="prize-pill"><span aria-hidden="true">☾</span><span id="prize-label">${modeConfig.prizeLabel}</span></div>
            <div class="mode-badge" id="mode-badge">${modeConfig.modeBadge}</div>
          </div>
          <p class="hero-note">Tres retos · dos victorias necesarias · persistencia local por modo</p>
        </div>

        <aside class="hero-panel live-flow-card">
          <div>
            <p class="panel-kicker">${livePanelTitle}</p>
            <ul class="live-shortcuts-list">
              ${buildListMarkup(buildLivePanelCopy(modeConfig.key))}
            </ul>
          </div>
          <div>
            <p class="live-shortcuts-title">Atajos útiles</p>
            <ul class="live-shortcuts-list">
              ${buildShortcutMarkup()}
            </ul>
          </div>
        </aside>
      </section>

      <div class="warning-box">
        <span class="warning-symbol" aria-hidden="true">⚠</span>
        <span id="warning-text">${modeConfig.warningText}</span>
      </div>

      <section class="dashboard-grid">
        <div class="panel-card global-rules-box">
          <div class="global-rules-title" id="rules-title">${modeConfig.modeRuleTitle}</div>
          <ul class="global-rules-list" id="rules-list">
            ${buildListMarkup(modeConfig.rules)}
          </ul>
        </div>

        <div class="panel-card">
          <div class="panel-title">Resumen del formato</div>
          <ul class="selector-rules-list">
            <li>${modeConfig.typeFilterOptions[0]?.label || 'Reto dinámico'}</li>
            <li>La ruleta y el tiempo se adaptan al modo activo.</li>
            <li>Los avisos se anuncian de forma más clara durante el directo.</li>
          </ul>
        </div>
      </section>

      <div id="result-banner" class="result-banner" aria-live="polite" aria-atomic="true">
        <div class="banner-icon" id="banner-icon">☾</div>
        <div class="banner-title" id="banner-title">Bendición Lunar obtenida</div>
        <div class="banner-sub" id="banner-sub">La luna reconoce el intento.</div>
      </div>

      <section class="scoreboard">
        <div class="rounds-row">
          <div class="round-orb" id="orb1"><span class="orb-icon" id="orb1-icon">I</span><span class="orb-label">RETO</span></div>
          <div class="round-orb" id="orb2"><span class="orb-icon" id="orb2-icon">II</span><span class="orb-label">RETO</span></div>
          <div class="round-orb" id="orb3"><span class="orb-icon" id="orb3-icon">III</span><span class="orb-label">RETO</span></div>
        </div>

        <div class="score-center">
          <div class="score-nums" id="score-nums">0 · 0</div>
          <div class="score-caption">victorias · derrotas</div>
          <div class="score-needed">necesita 2 victorias</div>
        </div>

        <div class="status-box">
          <div class="status-title">Estado actual</div>
          <div id="status-label" class="status-label">En curso...</div>
        </div>
      </section>

      <section class="panel-card controls-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Configuración</p>
            <h2 class="section-title">Prepara el siguiente reto</h2>
          </div>
        </div>

        <div class="controls">
          <div class="select-wrap">
            <label class="sr-only" for="type-filter">Filtrar tipo de reto</label>
            <select id="type-filter" aria-label="Filtrar tipo de reto"></select>
          </div>
          <button class="btn btn-gold" id="btn-shuffle" type="button">Sortear reto</button>
          <button class="btn btn-ghost" id="btn-reset" type="button">Reiniciar todo</button>
        </div>
      </section>

      <section class="experience-grid">
        <div class="roulette-panel">
          <div class="roulette-heading">
            <div>
              <div class="roulette-title">Ruleta Lunar</div>
              <div class="roulette-subtitle" id="roulette-status" aria-live="polite">La rueda está lista para elegir la próxima leyenda.</div>
            </div>
          </div>

          <div class="roulette-stage">
            <div class="roulette-pointer" aria-hidden="true">▼</div>
            <div class="roulette-wheel-shell">
              <div class="roulette-wheel" id="roulette-wheel">
                <div class="roulette-center">☾</div>
              </div>
            </div>
          </div>
        </div>

        <div class="challenge-wrap">
          <div class="challenge-card">
            <div class="card-header">
              <div class="round-badge" id="round-badge">1</div>
              <span class="type-tag" id="type-tag">-</span>
              <span class="diff-badge" id="diff-tag">-</span>
              <button class="edit-btn" id="btn-edit" type="button">Editar reto</button>
            </div>

            <div class="card-body">
              <div class="enemy-banner">
                <div class="enemy-icon" id="enemy-icon">👁</div>
                <div>
                  <div class="enemy-name" id="enemy-name">Leyenda Local</div>
                  <div class="enemy-region" id="enemy-region">Región · Tipo</div>
                </div>
              </div>

              <div class="challenge-name" id="c-name">-</div>
              <div class="challenge-desc" id="c-desc">-</div>

              <div class="mechanic-tip" id="c-tip">
                <span class="tip-symbol" aria-hidden="true">💡</span>
                <span id="c-tip-text"></span>
              </div>

              <div class="time-section">
                <div class="time-limit-box">
                  <div class="time-limit-title">Tiempo límite</div>
                  <div class="time-limit-value" id="time-limit-value">6 minutos</div>
                </div>

                <div class="timer-box">
                  <div class="timer-label">Tiempo del reto</div>
                  <div class="timer-display" id="timer-display" role="timer" aria-live="off">06:00<small>.0</small></div>
                  <div class="timer-actions">
                    <button class="btn btn-gold" id="btn-start-timer" type="button">Iniciar tiempo</button>
                    <button class="btn btn-ghost" id="btn-reset-timer" type="button">Reiniciar tiempo</button>
                  </div>
                </div>
              </div>

              <div class="conditions">
                <div class="conditions-title">Condiciones del sello</div>
                <ul id="c-conditions"></ul>
              </div>

              <div class="result-btns">
                <button class="btn-win" id="btn-win" type="button">Reto superado</button>
                <button class="btn-lose" id="btn-lose" type="button">Reto fallido</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="progress-dots">
        <div class="dot" id="dot0"></div>
        <div class="dot" id="dot1"></div>
        <div class="dot" id="dot2"></div>
      </div>

      <div class="divider-ornament">${APP_VERSION_LABEL}</div>
      <div class="footer" id="footer-version">${modeConfig.versionLabel}</div>
    </main>

    <dialog class="modal-overlay" id="modal-overlay" aria-labelledby="modal-title">
      <div class="modal">
        <div class="modal-title" id="modal-title">Personalizar reto</div>

        <label class="form-label" for="m-title">Nombre del reto</label>
        <input class="form-input" id="m-title" placeholder="Nombre del reto">

        <label class="form-label" for="m-desc">Descripción</label>
        <textarea class="form-textarea" id="m-desc" rows="3" placeholder="Describe el reto"></textarea>

        <label class="form-label" for="m-conds">Condiciones (separadas por | )</label>
        <input class="form-input" id="m-conds" placeholder="Condición 1 | Condición 2 | Tiempo límite: 7">

        <div class="modal-actions">
          <button class="btn btn-gold" id="btn-save-modal" type="button" style="flex:1">Guardar</button>
          <button class="btn btn-ghost" id="btn-close-modal" type="button">Cancelar</button>
        </div>
      </div>
    </dialog>
  `;
}

export function initializeModeApp() {
  const activeMode = document.body.dataset.mode || 'solo';
  const modeConfig = getModeConfig(activeMode);
  const storage = createStorage(modeConfig.storageKey);
  const root = document.getElementById('app-root');

  if (!root) {
    return;
  }

  document.title = modeConfig.versionLabel;
  root.innerHTML = buildModeShell(modeConfig);

  const elements = {
    liveRegion: document.getElementById('live-region'),
    footerVersion: document.getElementById('footer-version'),
    modeBadge: document.getElementById('mode-badge'),
    warningText: document.getElementById('warning-text'),
    rulesList: document.getElementById('rules-list'),
    typeFilter: document.getElementById('type-filter'),
    rouletteWheel: document.getElementById('roulette-wheel'),
    rouletteStatus: document.getElementById('roulette-status'),
    resultBanner: document.getElementById('result-banner'),
    bannerIcon: document.getElementById('banner-icon'),
    bannerTitle: document.getElementById('banner-title'),
    bannerSub: document.getElementById('banner-sub'),
    statusLabel: document.getElementById('status-label'),
    scoreNums: document.getElementById('score-nums'),
    roundBadge: document.getElementById('round-badge'),
    typeTag: document.getElementById('type-tag'),
    diffTag: document.getElementById('diff-tag'),
    enemyIcon: document.getElementById('enemy-icon'),
    enemyName: document.getElementById('enemy-name'),
    enemyRegion: document.getElementById('enemy-region'),
    challengeName: document.getElementById('c-name'),
    challengeDesc: document.getElementById('c-desc'),
    challengeTip: document.getElementById('c-tip'),
    challengeTipText: document.getElementById('c-tip-text'),
    challengeConditions: document.getElementById('c-conditions'),
    btnShuffle: document.getElementById('btn-shuffle'),
    btnReset: document.getElementById('btn-reset'),
    btnEdit: document.getElementById('btn-edit'),
    btnWin: document.getElementById('btn-win'),
    btnLose: document.getElementById('btn-lose'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalTitleInput: document.getElementById('m-title'),
    modalDescInput: document.getElementById('m-desc'),
    modalCondsInput: document.getElementById('m-conds'),
    btnSaveModal: document.getElementById('btn-save-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    timeLimitValue: document.getElementById('time-limit-value'),
    timerDisplay: document.getElementById('timer-display'),
    btnStartTimer: document.getElementById('btn-start-timer'),
    btnResetTimer: document.getElementById('btn-reset-timer')
  };

  const announce = createLiveAnnouncer(elements.liveRegion);
  const state = hydrateGameState(storage.load(createDefaultGameState()));
  let lastFocusedElement = null;

  const roulette = createRouletteController({
    wheel: elements.rouletteWheel,
    status: elements.rouletteStatus,
    announce
  });

  const timer = createTimerController({
    onTick(remaining, initial) {
      state.timerRemaining = remaining;
      state.timerInitial = initial;
      renderTimer();
      saveState();
    },
    onStateChange() {
      updateTimerButton();
      saveState();
    },
    onFinish() {
      setStatus('Tiempo agotado · marca el resultado', 'var(--warning)');
      announce('El tiempo se agotó. Marca si el reto fue superado o fallido.');
      saveState();
    },
    onMilestone(secondsLeft) {
      if (secondsLeft === 60) announce('Queda un minuto.');
      if (secondsLeft === 30) announce('Quedan treinta segundos.');
      if (secondsLeft === 10) announce('Últimos diez segundos.');
    }
  });

  function saveState() {
    state.rouletteRotation = roulette.getRotation();
    storage.save(serializeGameState(state));
  }

  function getCurrentPool() {
    return getFilteredBossPool(modeConfig.key, state.typeFilter);
  }

  function populateTypeFilter() {
    elements.typeFilter.innerHTML = '';

    modeConfig.typeFilterOptions.forEach(option => {
      const node = document.createElement('option');
      node.value = option.value;
      node.textContent = option.label;
      elements.typeFilter.appendChild(node);
    });
  }

  function setStatus(label, color = 'var(--text)') {
    elements.statusLabel.textContent = label;
    elements.statusLabel.style.color = color;
  }

  function clearBanner() {
    elements.resultBanner.className = 'result-banner';
    setStatus('En curso...', 'var(--text2)');
  }

  function updateTimerButton() {
    if (!elements.btnStartTimer) return;

    if (timer.isRunning()) {
      elements.btnStartTimer.textContent = 'Pausar tiempo';
      return;
    }

    const hasProgress = state.timerRemaining > 0 && state.timerRemaining < state.timerInitial;
    elements.btnStartTimer.textContent = hasProgress ? 'Reanudar tiempo' : 'Iniciar tiempo';
  }

  function renderTimer() {
    elements.timerDisplay.innerHTML = formatTimerMarkup(state.timerRemaining);
    elements.timerDisplay.classList.toggle('danger', state.timerRemaining <= 300);

    const secondsLeft = Math.ceil(state.timerRemaining / 10);
    elements.timerDisplay.setAttribute('aria-label', `Tiempo restante ${secondsLeft} segundos`);
  }

  function renderConditions(conditions) {
    elements.challengeConditions.innerHTML = '';

    conditions.forEach(condition => {
      const item = document.createElement('li');
      item.textContent = condition;
      elements.challengeConditions.appendChild(item);
    });
  }

  function renderOrbs() {
    const labels = ['I', 'II', 'III'];

    for (let index = 0; index < ROUND_COUNT; index += 1) {
      const orb = document.getElementById(`orb${index + 1}`);
      const icon = document.getElementById(`orb${index + 1}-icon`);
      if (!orb || !icon) continue;

      orb.className = 'round-orb';

      if (state.results[index] === 'win') {
        orb.classList.add('won');
        icon.textContent = '✓';
      } else if (state.results[index] === 'lose') {
        orb.classList.add('lost');
        icon.textContent = '✕';
      } else {
        icon.textContent = labels[index];
        if (index === state.currentRound && !state.gameOver) {
          orb.classList.add('active');
        }
      }
    }
  }

  function renderScore() {
    const { wins, losses } = getScore(state.results);
    elements.scoreNums.textContent = `${wins} · ${losses}`;
  }

  function renderDots() {
    for (let index = 0; index < ROUND_COUNT; index += 1) {
      const dot = document.getElementById(`dot${index}`);
      if (!dot) continue;

      dot.className = 'dot';

      if (state.results[index] === 'win') {
        dot.classList.add('won');
      } else if (state.results[index] === 'lose') {
        dot.classList.add('lost');
      } else if (index === state.currentRound && !state.gameOver) {
        dot.classList.add('active');
      }
    }
  }

  function renderChallenge() {
    const current = state.assigned[state.currentRound];
    const hasChallenge = Boolean(current);

    elements.roundBadge.textContent = String(state.currentRound + 1);
    elements.btnEdit.disabled = !hasChallenge || state.gameOver;
    elements.btnWin.disabled = !hasChallenge || state.gameOver;
    elements.btnLose.disabled = !hasChallenge || state.gameOver;
    elements.btnStartTimer.disabled = !hasChallenge;
    elements.btnResetTimer.disabled = !hasChallenge;

    if (!hasChallenge) {
      elements.typeTag.textContent = 'Pendiente';
      elements.typeTag.className = 'type-tag';
      elements.diffTag.textContent = 'Sin sorteo';
      elements.diffTag.className = 'diff-badge';
      elements.enemyIcon.textContent = '☾';
      elements.enemyName.textContent = 'Aún no hay jefe seleccionado';
      elements.enemyRegion.textContent = 'Usa la ruleta para definir el reto actual';
      elements.challengeName.textContent = 'Esperando el primer sorteo';
      elements.challengeDesc.textContent = 'Pulsa “Sortear reto” para que la ruleta elija al jefe de esta ronda.';
      elements.timeLimitValue.textContent = 'Pendiente';
      elements.challengeTip.style.display = 'flex';
      elements.challengeTipText.textContent = 'Cada nueva ronda queda vacía hasta que hagas el siguiente sorteo manual.';
      renderConditions(['Pendiente de sorteo']);

      if (!roulette.isSpinning()) {
        roulette.render(getCurrentPool());
      }
      return;
    }

    elements.typeTag.textContent = current.tag;
    elements.typeTag.className = `type-tag ${current.tagClass}`;
    elements.diffTag.textContent = current.diffLabel;
    elements.diffTag.className = `diff-badge ${current.diffClass}`;
    elements.enemyIcon.textContent = current.enemyIcon;
    elements.enemyName.textContent = current.enemy;
    elements.enemyRegion.textContent = current.region;
    elements.challengeName.textContent = current.title;
    elements.challengeDesc.textContent = current.desc;
    elements.timeLimitValue.textContent = formatMinutesLabel(current.timeLimit);

    if (current.tip) {
      elements.challengeTip.style.display = 'flex';
      elements.challengeTipText.textContent = current.tip;
    } else {
      elements.challengeTip.style.display = 'none';
      elements.challengeTipText.textContent = '';
    }

    renderConditions(current.conditions || []);

    if (!roulette.isSpinning()) {
      roulette.render(getCurrentPool(), current.bossId);
    }
  }

  function renderAll() {
    renderOrbs();
    renderChallenge();
    renderScore();
    renderDots();
    renderTimer();
    updateTimerButton();
  }

  function resetTimerForCurrentChallenge() {
    const current = state.assigned[state.currentRound];
    const minutes = current?.timeLimit ?? 6;
    timer.resetForMinutes(minutes);
  }

  function initNewGame() {
    state.assigned = Array.from({ length: ROUND_COUNT }, () => null);
    state.results = Array.from({ length: ROUND_COUNT }, () => null);
    state.currentRound = 0;
    state.gameOver = false;
    clearBanner();
    timer.restore({ remainingTenths: 0, initialTenths: 0 });
    renderAll();
    setStatus('Listo para sortear', 'var(--primary-2)');
    announce(`Nuevo intento preparado para ${modeConfig.label}. Usa “Sortear reto” para iniciar.`);
    saveState();
  }

  function showVictory(shouldAnnounce = true) {
    elements.resultBanner.className = 'result-banner victory show';
    elements.bannerIcon.textContent = '☾';
    elements.bannerTitle.textContent = 'Bendición Lunar obtenida';
    elements.bannerSub.textContent = modeConfig.key === 'supervisado'
      ? 'El juez confirma que el participante cumplió el reto.'
      : 'La luna reconoce la constancia y la ejecución del intento.';
    setStatus('Victoria', 'var(--win)');
    elements.resultBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (shouldAnnounce) {
      announce('Victoria confirmada. La bendición lunar fue obtenida.');
    }
  }

  function showDefeat(shouldAnnounce = true) {
    elements.resultBanner.className = 'result-banner defeat show';
    elements.bannerIcon.textContent = '✕';
    elements.bannerTitle.textContent = 'Las leyendas permanecen invictas';
    elements.bannerSub.textContent = modeConfig.key === 'supervisado'
      ? 'La validación confirma que el reto no se completó.'
      : 'Los sellos no se rompieron. La luna espera un nuevo intento.';
    setStatus('Derrota', 'var(--lose)');
    elements.resultBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (shouldAnnounce) {
      announce('Derrota registrada. El reto no fue superado.');
    }
  }

  function recordResult(result) {
    if (state.gameOver || !state.assigned[state.currentRound]) return;

    timer.pause();
    state.results[state.currentRound] = result;

    const { wins, losses } = getScore(state.results);

    if (wins >= 2) {
      state.gameOver = true;
      renderAll();
      showVictory();
      saveState();
      return;
    }

    if (losses >= 2) {
      state.gameOver = true;
      renderAll();
      showDefeat();
      saveState();
      return;
    }

    state.currentRound += 1;
    clearBanner();
    timer.restore({ remainingTenths: 0, initialTenths: 0 });
    renderAll();
    setStatus(`Ronda ${state.currentRound + 1} lista · sortea el siguiente reto`, 'var(--primary-2)');
    announce(`Resultado registrado. Sortea el reto de la ronda ${state.currentRound + 1}.`);
    saveState();
  }

  function assignBossToCurrentChallenge(boss) {
    if (!boss) return;

    state.assigned[state.currentRound] = buildChallengeFromBoss(boss, modeConfig);
    renderChallenge();
    resetTimerForCurrentChallenge();
    saveState();
  }

  async function rerollCurrentChallenge() {
    if (state.gameOver || roulette.isSpinning()) return;

    const visiblePool = getCurrentPool();
    elements.btnShuffle.disabled = true;
    elements.btnReset.disabled = true;
    elements.typeFilter.disabled = true;
    elements.btnShuffle.setAttribute('aria-busy', 'true');

    try {
      const winner = await roulette.spin({
        pool: visiblePool,
        currentBossId: state.assigned[state.currentRound]?.bossId
      });

      if (winner) {
        assignBossToCurrentChallenge(winner);
      }
    } finally {
      elements.btnShuffle.disabled = false;
      elements.btnReset.disabled = false;
      elements.typeFilter.disabled = false;
      elements.btnShuffle.removeAttribute('aria-busy');
    }
  }

  function openModal() {
    if (state.gameOver) return;

    const current = state.assigned[state.currentRound];
    if (!current) return;

    lastFocusedElement = document.activeElement;
    elements.modalTitleInput.value = current.title;
    elements.modalDescInput.value = current.desc;
    elements.modalCondsInput.value = (current.conditions || []).join(' | ');

    if (typeof elements.modalOverlay.showModal === 'function') {
      elements.modalOverlay.showModal();
    }

    elements.modalOverlay.classList.add('open');
    globalThis.setTimeout(() => elements.modalTitleInput.focus(), 20);
  }

  function closeModal() {
    elements.modalOverlay.classList.remove('open');

    if (elements.modalOverlay.open && typeof elements.modalOverlay.close === 'function') {
      elements.modalOverlay.close();
    }

    lastFocusedElement?.focus?.();
  }

  function saveModal() {
    const title = elements.modalTitleInput.value.trim();
    const desc = elements.modalDescInput.value.trim();
    const rawConditions = elements.modalCondsInput.value.trim();

    if (!title) {
      elements.modalTitleInput.focus();
      return;
    }

    const conditions = rawConditions
      ? rawConditions.split('|').map(item => item.trim()).filter(Boolean)
      : [];

    const newTimeLimit = extractTimeLimitFromConditions(
      conditions,
      state.assigned[state.currentRound]?.timeLimit ?? 6
    );

    state.assigned[state.currentRound] = {
      ...state.assigned[state.currentRound],
      title,
      desc,
      conditions: conditions.filter(item => !/tiempo\s+l[ií]mite:/i.test(item)),
      timeLimit: newTimeLimit
    };

    closeModal();
    renderChallenge();
    resetTimerForCurrentChallenge();
    announce('El reto actual fue personalizado.');
    saveState();
  }

  function handleKeyboardShortcuts(event) {
    if (event.key === 'Escape' && elements.modalOverlay.open) {
      closeModal();
      return;
    }

    if (elements.modalOverlay.open || isTypingTarget(document.activeElement)) {
      return;
    }

    const shortcut = event.key.toLowerCase();

    if (shortcut === ' ') {
      event.preventDefault();
      timer.toggle();
      return;
    }

    if (shortcut === 's') {
      event.preventDefault();
      rerollCurrentChallenge();
      return;
    }

    if (shortcut === 'r') {
      event.preventDefault();
      initNewGame();
      return;
    }

    if (shortcut === 'w') {
      event.preventDefault();
      recordResult('win');
      return;
    }

    if (shortcut === 'l') {
      event.preventDefault();
      recordResult('lose');
      return;
    }

    if (shortcut === 'e') {
      event.preventDefault();
      openModal();
    }
  }

  function attachEvents() {
    elements.typeFilter.addEventListener('change', event => {
      state.typeFilter = event.target.value;
      initNewGame();
      announce(`Filtro actualizado a ${event.target.options[event.target.selectedIndex]?.textContent || 'Todos'}.`);
    });

    elements.btnShuffle.addEventListener('click', rerollCurrentChallenge);
    elements.btnReset.addEventListener('click', initNewGame);
    elements.btnEdit.addEventListener('click', openModal);
    elements.btnWin.addEventListener('click', () => recordResult('win'));
    elements.btnLose.addEventListener('click', () => recordResult('lose'));
    elements.btnStartTimer.addEventListener('click', () => timer.toggle());
    elements.btnResetTimer.addEventListener('click', resetTimerForCurrentChallenge);
    elements.btnSaveModal.addEventListener('click', saveModal);
    elements.btnCloseModal.addEventListener('click', closeModal);

    elements.modalOverlay.addEventListener('click', event => {
      if (event.target === elements.modalOverlay) {
        closeModal();
      }
    });

    elements.modalOverlay.addEventListener('cancel', event => {
      event.preventDefault();
      closeModal();
    });

    document.addEventListener('keydown', handleKeyboardShortcuts);
  }

  populateTypeFilter();
  elements.typeFilter.value = state.typeFilter || 'all';
  roulette.setRotation(state.rouletteRotation || 0);
  attachEvents();

  if (state.assigned.length) {
    renderAll();

    if (state.assigned[state.currentRound]) {
      if (state.timerInitial > 0) {
        timer.restore({ remainingTenths: state.timerRemaining, initialTenths: state.timerInitial });
      } else {
        resetTimerForCurrentChallenge();
      }
    } else {
      timer.restore({ remainingTenths: 0, initialTenths: 0 });
      if (!state.gameOver) {
        setStatus(`Ronda ${state.currentRound + 1} lista · sortea el siguiente reto`, 'var(--primary-2)');
      }
    }

    const { wins, losses } = getScore(state.results);
    if (state.gameOver && wins >= 2) showVictory(false);
    if (state.gameOver && losses >= 2) showDefeat(false);
  } else {
    initNewGame();
  }
}