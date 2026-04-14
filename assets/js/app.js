(() => {
  'use strict';

  const dataApi = globalThis.PruebaLunarData;
  if (!dataApi) {
    console.error('Prueba Lunar: falta cargar assets/js/data.local.js antes de app.js');
    return;
  }

  const APP_VERSION = 'v4.1.0';
  const APP_VERSION_LABEL = `Prueba Lunar ${APP_VERSION}`;
  const MODE_STORAGE_KEYS = {
    solo: `prueba-lunar-state-${APP_VERSION}-solo`,
    supervisado: `prueba-lunar-state-${APP_VERSION}-supervisado`
  };

  const buildLegacyChallengeFromBoss = dataApi.buildChallengeFromBoss;
  const getLegacyModeConfig = dataApi.getModeConfig;
  const getLegacyBossPoolForMode = dataApi.getBossPoolForMode;

  function getModeConfig(modeKey) {
    const legacyConfig = getLegacyModeConfig(modeKey);

    return {
      ...legacyConfig,
      storageKey: MODE_STORAGE_KEYS[legacyConfig.key] || legacyConfig.storageKey,
      versionLabel: `${APP_VERSION_LABEL} · ${legacyConfig.label}`
    };
  }

  function getBossPoolForMode(modeKey) {
    return getLegacyBossPoolForMode(modeKey);
  }

function pickRandom(items) {
  if (!Array.isArray(items) || !items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}
function shuffleArray(items) {
  const copy = Array.isArray(items) ? [...items] : [];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }

  return copy;
}
function formatTimerMarkup(totalTenths) {
  const safeTime = Math.max(Number(totalTenths) || 0, 0);
  const minutes = Math.floor(safeTime / 600);
  const seconds = Math.floor((safeTime % 600) / 10);
  const tenths = safeTime % 10;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}<small>.${tenths}</small>`;
}
function formatMinutesLabel(minutes) {
  return `${minutes} minuto${minutes === 1 ? '' : 's'}`;
}
function isTypingTarget(target) {
  if (!target) return false;
  const tagName = target.tagName?.toLowerCase();
  return ['input', 'textarea', 'select', 'button'].includes(tagName) || target.isContentEditable;
}
function normalizeName(value) {
  return String(value || '').trim().replaceAll(/\s+/g, ' ');
}
function createLiveAnnouncer(element) {
  if (!element) {
    return () => {};
  }

  return message => {
    element.textContent = '';
    globalThis.requestAnimationFrame(() => {
      element.textContent = message;
    });
  };
}

function createStorage(storageKey) {
  return {
    load(fallbackValue) {
      try {
        const raw = globalThis.localStorage?.getItem(storageKey);
        if (!raw) return fallbackValue;
        return JSON.parse(raw);
      } catch {
        return fallbackValue;
      }
    },

    save(value) {
      try {
        globalThis.localStorage?.setItem(storageKey, JSON.stringify(value));
      } catch {
        // Ignorar errores de persistencia para no romper la experiencia en vivo.
      }
    },

    clear() {
      try {
        globalThis.localStorage?.removeItem(storageKey);
      } catch {
        // Sin acción adicional.
      }
    }
  };
}

const ROUND_COUNT = 3;
const DEFAULT_RESULTS = Array.from({ length: ROUND_COUNT }, () => null);
function createDefaultGameState() {
  return {
    assigned: [],
    results: [...DEFAULT_RESULTS],
    currentRound: 0,
    gameOver: false,
    typeFilter: 'all',
    timerRemaining: 0,
    timerInitial: 0,
    timerRunning: false,
    rouletteRotation: 0
  };
}
function hydrateGameState(snapshot) {
  const baseState = createDefaultGameState();

  if (!snapshot || typeof snapshot !== 'object') {
    return baseState;
  }

  return {
    ...baseState,
    ...snapshot,
    results: Array.isArray(snapshot.results) && snapshot.results.length === ROUND_COUNT
      ? [...snapshot.results]
      : [...baseState.results],
    timerRunning: false,
    rouletteRotation: Number(snapshot.rouletteRotation) || 0,
    typeFilter: snapshot.typeFilter || 'all'
  };
}
function serializeGameState(state) {
  return {
    assigned: state.assigned,
    results: state.results,
    currentRound: state.currentRound,
    gameOver: state.gameOver,
    typeFilter: state.typeFilter,
    timerRemaining: state.timerRemaining,
    timerInitial: state.timerInitial,
    timerRunning: false,
    rouletteRotation: state.rouletteRotation || 0
  };
}
function getScore(results) {
  const wins = results.filter(result => result === 'win').length;
  const losses = results.filter(result => result === 'lose').length;
  return { wins, losses };
}

function getFilteredBossPool(modeKey, filterValue = 'all') {
  const pool = getBossPoolForMode(modeKey);
  return filterValue === 'all' ? pool : pool.filter(boss => boss.type === filterValue);
}
function buildAssignedChallenges(pool, modeConfig, roundCount = 3) {
  const fallbackPool = getBossPoolForMode(modeConfig.key);
  const sourcePool = pool.length >= roundCount ? pool : fallbackPool;
  return shuffleArray(sourcePool)
    .slice(0, roundCount)
    .map(boss => buildLegacyChallengeFromBoss(boss, modeConfig));
}
function buildChallengeFromBoss(boss, modeConfig) {
  return buildLegacyChallengeFromBoss(boss, modeConfig);
}
function pickBossForReroll(pool, currentBossId) {
  const eligiblePool = pool.filter(boss => boss.id !== Number(currentBossId));
  return pickRandom(eligiblePool.length ? eligiblePool : pool);
}

const BOSS_COLORS = {
  1: 'rgba(55, 165, 220, 0.56)',
  2: 'rgba(196, 68, 58, 0.58)',
  3: 'rgba(230, 120, 60, 0.56)',
  4: 'rgba(72, 150, 222, 0.56)',
  5: 'rgba(120, 210, 255, 0.58)',
  6: 'rgba(170, 185, 205, 0.58)',
  7: 'rgba(170, 90, 210, 0.56)',
  8: 'rgba(110, 125, 145, 0.56)',
  9: 'rgba(80, 215, 180, 0.56)',
  10: 'rgba(64, 110, 190, 0.58)',
  11: 'rgba(235, 195, 70, 0.6)',
  12: 'rgba(145, 120, 90, 0.58)',
  13: 'rgba(105, 210, 245, 0.58)',
  14: 'rgba(225, 92, 56, 0.6)',
  15: 'rgba(95, 175, 95, 0.58)',
  16: 'rgba(150, 160, 168, 0.56)',
  17: 'rgba(145, 120, 180, 0.56)',
  18: 'rgba(214, 158, 46, 0.58)',
  19: 'rgba(76, 175, 135, 0.58)'
};

let rouletteAudioContext = null;

function getRouletteColor(boss) {
  return BOSS_COLORS[boss.id] || 'rgba(196, 163, 90, 0.45)';
}

function getAudioContext() {
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!rouletteAudioContext) {
    rouletteAudioContext = new AudioContextClass();
  }

  if (rouletteAudioContext.state === 'suspended') {
    rouletteAudioContext.resume().catch(() => {});
  }

  return rouletteAudioContext;
}

function playTone(frequency, duration = 0.08, type = 'sine', volume = 0.03, delay = 0) {
  const audioContext = getAudioContext();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const startAt = audioContext.currentTime + delay;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);

  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.03);
}

function playStartSound() {
  [0, 0.11, 0.22, 0.34, 0.46].forEach((delay, index) => {
    playTone(520 + (index * 35), 0.05, 'triangle', 0.018, delay);
  });
}

function playWinSound() {
  playTone(660, 0.08, 'sine', 0.03, 0);
  playTone(880, 0.1, 'sine', 0.04, 0.08);
  playTone(1040, 0.16, 'triangle', 0.05, 0.18);
}
function createRouletteController({ wheel, status, announce } = {}) {
  let rotation = 0;
  let spinning = false;

  function render(pool, selectedBossId = null) {
    if (!wheel) return;

    const safePool = Array.isArray(pool) && pool.length ? pool : [];
    wheel.classList.remove('is-celebrating');
    wheel.style.transition = 'none';
    wheel.innerHTML = '<div class="roulette-center">☾</div>';

    if (!safePool.length) {
      if (status) {
        status.textContent = 'No hay jefes disponibles para el filtro actual.';
      }
      return;
    }

    const step = 360 / safePool.length;
    const startAngle = -90 - (step / 2);
    const gradient = safePool
      .map((boss, index) => `${getRouletteColor(boss)} ${index * step}deg ${(index + 1) * step}deg`)
      .join(', ');

    wheel.style.background = `radial-gradient(circle at center, rgba(10, 12, 16, 0.85) 0 18%, transparent 18%), conic-gradient(from ${startAngle}deg, ${gradient})`;
    wheel.style.transform = `rotate(${rotation}deg)`;

    safePool.forEach((boss, index) => {
      const angle = index * step;
      const label = document.createElement('div');
      label.className = 'roulette-label';
      if (boss.id === Number(selectedBossId)) {
        label.classList.add('is-selected');
      }

      label.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--roulette-radius) * -1)) rotate(${-angle}deg)`;
      label.title = boss.name;
      label.innerHTML = `<span class="roulette-emoji">${boss.enemyIcon}</span>`;
      wheel.appendChild(label);
    });

    if (status && !spinning) {
      status.textContent = selectedBossId
        ? 'La rueda señala al jefe actual del reto.'
        : `La rueda contiene ${safePool.length} leyendas disponibles.`;
    }
  }

  function highlightWinner(boss) {
    const center = wheel?.querySelector('.roulette-center');
    if (!center || !boss) return;

    center.textContent = boss.enemyIcon;
    center.classList.add('winner-reveal');

    globalThis.setTimeout(() => {
      center.textContent = '☾';
      center.classList.remove('winner-reveal');
    }, 1800);
  }

  function spin({ pool, currentBossId }) {
    const safePool = Array.isArray(pool) && pool.length ? pool : [];
    const selectedBoss = pickBossForReroll(safePool, currentBossId);

    if (!wheel || !selectedBoss || !safePool.length || spinning) {
      return Promise.resolve(selectedBoss);
    }

    const bossIndex = safePool.findIndex(boss => boss.id === selectedBoss.id);
    const step = 360 / safePool.length;
    const centerAngle = bossIndex * step;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const desiredRotation = (360 - centerAngle) % 360;
    const deltaRotation = (desiredRotation - normalizedRotation + 360) % 360;
    const targetRotation = rotation + (extraSpins * 360) + deltaRotation;

    spinning = true;
    if (status) {
      status.textContent = 'La ruleta está girando...';
    }

    playStartSound();
    render(safePool);
    wheel.style.transition = 'none';
    wheel.style.transform = `rotate(${rotation}deg)`;
    wheel.getBoundingClientRect();
    wheel.style.transition = 'transform 4.6s cubic-bezier(0.12, 0.8, 0.18, 1)';

    globalThis.requestAnimationFrame(() => {
      wheel.style.transform = `rotate(${targetRotation}deg)`;
    });

    return new Promise(resolve => {
      let completed = false;

      const finalize = () => {
        if (completed) return;
        completed = true;
        spinning = false;
        rotation = targetRotation;
        render(safePool, selectedBoss.id);
        wheel.classList.add('is-celebrating');
        highlightWinner(selectedBoss);
        playWinSound();
        if (status) {
          status.textContent = `La ruleta eligió: ${selectedBoss.enemyIcon} ${selectedBoss.name}`;
        }
        announce?.(`La ruleta eligió ${selectedBoss.name}.`);
        globalThis.setTimeout(() => wheel.classList.remove('is-celebrating'), 1500);
        resolve(selectedBoss);
      };

      wheel.addEventListener('transitionend', finalize, { once: true });
      globalThis.setTimeout(finalize, 4800);
    });
  }

  return {
    render,
    spin,
    setRotation(value) {
      rotation = Number(value) || 0;
    },
    getRotation() {
      return rotation;
    },
    isSpinning() {
      return spinning;
    }
  };
}

function createTimerController({
  onTick,
  onStateChange,
  onFinish,
  onMilestone
} = {}) {
  let intervalId = null;
  let remaining = 0;
  let initial = 0;
  let running = false;
  const announcedMilestones = new Set();

  function emitTick() {
    onTick?.(remaining, initial);
  }

  function emitState() {
    onStateChange?.(running);
  }

  function stopInterval() {
    if (intervalId) {
      globalThis.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function pause() {
    stopInterval();
    running = false;
    emitState();
  }

  function announceMilestones() {
    const secondsLeft = Math.ceil(remaining / 10);
    const milestones = [60, 30, 10];

    milestones.forEach(value => {
      if (secondsLeft === value && !announcedMilestones.has(value)) {
        announcedMilestones.add(value);
        onMilestone?.(value);
      }
    });
  }

  function start() {
    if (running || remaining <= 0) return;

    running = true;
    emitState();

    intervalId = globalThis.setInterval(() => {
      remaining = Math.max(remaining - 1, 0);
      announceMilestones();
      emitTick();

      if (remaining <= 0) {
        pause();
        onFinish?.();
      }
    }, 100);
  }

  function toggle() {
    if (running) {
      pause();
      return;
    }

    start();
  }

  function resetForMinutes(minutes) {
    initial = Math.max(Number(minutes) || 0, 0) * 600;
    remaining = initial;
    announcedMilestones.clear();
    pause();
    emitTick();
  }

  function restore({ remainingTenths = 0, initialTenths = 0 } = {}) {
    remaining = Math.max(Number(remainingTenths) || 0, 0);
    initial = Math.max(Number(initialTenths) || 0, 0);
    announcedMilestones.clear();
    pause();
    emitTick();
  }

  function getSnapshot() {
    return {
      remaining,
      initial,
      running
    };
  }

  return {
    start,
    pause,
    toggle,
    resetForMinutes,
    restore,
    getSnapshot,
    isRunning: () => running
  };
}

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
              <div class="enemy-banner" id="enemy-info-block">
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

              <section class="round-intro-banner" id="round-intro-banner" hidden aria-live="polite">
                <div class="round-intro-top">
                  <p class="round-intro-kicker">Antes del cronómetro</p>
                  <span class="diff-badge" id="intro-diff-badge">-</span>
                </div>
                <h3 class="round-intro-title" id="intro-enemy-name">Leyenda Local</h3>
                <p class="round-intro-meta" id="intro-enemy-meta">Región · Tipo</p>
                <button class="btn btn-ghost btn-sm" id="btn-toggle-intro-tip" type="button" aria-expanded="false">Mostrar tip de mecánica</button>
                <p class="round-intro-tip" id="intro-tip" hidden></p>
                <button class="btn btn-gold" id="btn-start-round" type="button">Comenzar ronda</button>
              </section>

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
function initializeModeApp() {
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
    roundIntroBanner: document.getElementById('round-intro-banner'),
    introDiffBadge: document.getElementById('intro-diff-badge'),
    introEnemyName: document.getElementById('intro-enemy-name'),
    introEnemyMeta: document.getElementById('intro-enemy-meta'),
    introTip: document.getElementById('intro-tip'),
    btnToggleIntroTip: document.getElementById('btn-toggle-intro-tip'),
    btnStartRound: document.getElementById('btn-start-round'),
    enemyInfoBlock: document.getElementById('enemy-info-block'),
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
  let roundHasStarted = false;
  let introTipExpanded = false;

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

  function renderRoundIntroBanner(currentChallenge = state.assigned[state.currentRound]) {
    if (!elements.roundIntroBanner) return;

    const hasChallenge = Boolean(currentChallenge);
    const shouldShow = hasChallenge && !state.gameOver && !roundHasStarted;

    elements.roundIntroBanner.hidden = !shouldShow;

    // Ocultar el bloque original de nombre/región/tip mientras el banner está visible.
    // Se restaura cuando shouldShow es false (ronda iniciada o sin reto).
    if (elements.enemyInfoBlock) {
      elements.enemyInfoBlock.hidden = shouldShow;
    }
    if (elements.challengeTip) {
      elements.challengeTip.style.visibility = shouldShow ? 'hidden' : '';
      elements.challengeTip.style.pointerEvents = shouldShow ? 'none' : '';
    }

    if (!shouldShow) return;

    elements.introEnemyName.textContent = currentChallenge.enemy;
    elements.introEnemyMeta.textContent = `${currentChallenge.region} · ${currentChallenge.tag}`;
    elements.introDiffBadge.textContent = currentChallenge.diffLabel;
    elements.introDiffBadge.className = `diff-badge ${currentChallenge.diffClass}`;

    const introTipText = currentChallenge.tip || 'No hay tip adicional para esta leyenda.';
    elements.introTip.textContent = introTipText;
    elements.introTip.hidden = !introTipExpanded;
    elements.btnToggleIntroTip.setAttribute('aria-expanded', String(introTipExpanded));
    elements.btnToggleIntroTip.textContent = introTipExpanded
      ? 'Ocultar tip de mecánica'
      : 'Mostrar tip de mecánica';
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
      roundHasStarted = false;
      introTipExpanded = false;
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
      renderRoundIntroBanner(null);
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
    renderRoundIntroBanner(current);

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
    roundHasStarted = false;
    introTipExpanded = false;
    timer.resetForMinutes(minutes);
    renderRoundIntroBanner(current || null);
  }

  function startRoundTimer() {
    if (timer.isRunning()) return;

    const current = state.assigned[state.currentRound];
    if (!current) return;

    roundHasStarted = true;
    renderRoundIntroBanner(current);
    timer.start();
    updateTimerButton();
    setStatus(`Ronda ${state.currentRound + 1} en curso`, 'var(--primary-2)');
    announce(`Ronda ${state.currentRound + 1} iniciada. Cronómetro en marcha.`);
    saveState();
  }

  function toggleTimerFromControls() {
    const current = state.assigned[state.currentRound];
    if (!current) return;

    if (timer.isRunning()) {
      timer.pause();
      return;
    }

    const hasProgress = state.timerRemaining > 0 && state.timerRemaining < state.timerInitial;
    if (!hasProgress) {
      startRoundTimer();
      return;
    }

    timer.start();
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
    roundHasStarted = false;
    introTipExpanded = false;
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
    roundHasStarted = false;
    introTipExpanded = false;
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
      toggleTimerFromControls();
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
    elements.btnStartTimer.addEventListener('click', toggleTimerFromControls);
    elements.btnStartRound.addEventListener('click', startRoundTimer);
    elements.btnToggleIntroTip.addEventListener('click', () => {
      introTipExpanded = !introTipExpanded;
      renderRoundIntroBanner(state.assigned[state.currentRound] || null);
    });
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
    roundHasStarted = state.timerInitial > 0 && state.timerRemaining < state.timerInitial;
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeModeApp(), { once: true });
  } else {
    initializeModeApp();
  }
})();
