(() => {
  'use strict';

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
    return BOSS_COLORS[boss?.id] || 'rgba(196, 163, 90, 0.45)';
  }

  function getAudioContext() {
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!rouletteAudioContext) {
      rouletteAudioContext = new AudioContextClass();
    }

    if (rouletteAudioContext.state === 'suspended') {
      rouletteAudioContext.resume().catch(() => { });
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

  function pickBossForReroll(pool, currentBossId) {
    const current = Number(currentBossId);
    const eligiblePool = (pool || []).filter(boss => Number(boss.id) !== current);
    const source = eligiblePool.length ? eligiblePool : (pool || []);
    if (!source.length) return null;
    return source[Math.floor(Math.random() * source.length)];
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
        if (Number(boss.id) === Number(selectedBossId)) {
          label.classList.add('is-selected');
        }

        label.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--roulette-radius) * -1)) rotate(${-angle}deg)`;
        label.title = boss.name;
        label.innerHTML = `<span class="roulette-emoji">${boss.enemyIcon || '👁'}</span>`;
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

      center.textContent = boss.enemyIcon || '👁';
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

      const bossIndex = safePool.findIndex(boss => Number(boss.id) === Number(selectedBoss.id));
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
            status.textContent = `La ruleta eligió: ${selectedBoss.enemyIcon || '👁'} ${selectedBoss.name}`;
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

  const APP_VERSION = 'v4.1.0';
  const COOP_STORAGE_KEY = `prueba-lunar-coop-${APP_VERSION}`;
  const ROUND_COUNT = 3;
  const WINS_NEEDED = 2;

  const dataApi = globalThis.PruebaLunarData;
  if (!dataApi) {
    console.error('Prueba Lunar: falta cargar data.local.js antes de coop-mode.js');
    return;
  }

  // Condiciones individuales — se leen de la API; el array inline actúa como fallback.
  const INDIVIDUAL_CONDITIONS = dataApi.INDIVIDUAL_CONDITIONS ?? [
    { id: 'ind-no-skill', text: 'Solo puedes usar ataques normales (sin habilidades E ni Ultimates)' },
    { id: 'ind-no-burst', text: 'No puedes usar tu Ultimate durante el combate' },
    { id: 'ind-one-char', text: 'Solo puedes usar un personaje durante toda la ronda' },
    { id: 'ind-no-heal', text: 'Tus personajes no pueden curar durante el combate' },
    { id: 'ind-no-shield', text: 'Tus personajes no pueden usar escudos' },
    { id: 'ind-no-food', text: 'Sin consumibles de curacion o buff durante el combate' },
    { id: 'ind-no-swap', text: 'No puedes cambiar de personaje una vez iniciado el combate' },
    { id: 'ind-survive-first', text: 'Debes sobrevivir la primera fase del jefe sin perder ningun personaje' },
    { id: 'ind-max-switches', text: 'Maximo 10 cambios de personaje en toda la ronda' },
    { id: 'ind-no-same-element', text: 'Tus personajes del equipo no pueden repetir elemento' },
    { id: 'ind-finish-starter', text: 'Debes terminar el combate con el mismo personaje con el que entraste' },
    { id: 'ind-no-dash', text: 'Sin usar esquiva durante los primeros 30 segundos de combate' }
  ];

  // Config de generación de retos: usa el pool y condiciones del modo Solo.
  const soloModeConfig = dataApi.getModeConfig('solo');
  const COOP_CHALLENGE_CONFIG = {
    key: 'coop',
    mediumConditions: soloModeConfig.mediumConditions,
    hardConditionsByType: soloModeConfig.hardConditionsByType,
    timeModifier: 0
  };

  // ── Utilidades ────────────────────────────────────────────────────────

  function pickRandom(arr) {
    if (!Array.isArray(arr) || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffleArray(arr) {
    const copy = Array.isArray(arr) ? [...arr] : [];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
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

  // ── Estado ────────────────────────────────────────────────────────────

  function createInitialState(player1Name, player2Name) {
    return {
      player1Name: player1Name || 'Jugador 1',
      player2Name: player2Name || 'Jugador 2',
      results: [null, null, null],
      currentRound: 0,
      gameOver: false,
      currentBoss: null,
      generalConditions: [],
      player1Condition: null,
      player2Condition: null,
      player1RoundResult: null,
      player2RoundResult: null,
      // Re-roll de condición individual: 1 uso por intento (sesión completa
      // hasta game over). Se persiste para sobrevivir a recargas y solo se
      // reinicia cuando se reinicia la prueba o se cambian los jugadores.
      player1RerollUsed: false,
      player2RerollUsed: false,
      timerRemaining: 0,
      timerInitial: 0,
      roundStarted: false,
      challengeTitle: null,
      challengeDesc: null,
      challengeTip: null,
      challengeTag: null,
      challengeTagClass: null,
      rouletteRotation: 0
    };
  }

  function loadPersistedState() {
    try {
      const raw = globalThis.localStorage?.getItem(COOP_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveState() {
    try {
      globalThis.localStorage?.setItem(COOP_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Sin acción adicional — entornos sin localStorage siguen funcionando.
    }
  }

  function buildCoopShell() {
    return `
      <header class="topbar">
        <a class="brand" href="index.html">
          <span class="brand-mark" aria-hidden="true">☾</span>
          <span>Prueba Lunar</span>
        </a>
        <div class="topbar-actions">
          <span class="status-chip status-chip-live">Co-op</span>
          <a class="btn btn-ghost btn-sm" href="index.html">Inicio</a>
          <a class="btn btn-ghost btn-sm" href="torneo.html">Torneo</a>
        </div>
      </header>

      <div id="coop-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>

      <!-- ── Pantalla de configuración ─────────────────────────────────── -->
      <main id="coop-setup" class="page-wrap coop-setup-wrap">
        <section class="hero hero-landing">
          <div class="hero-copy">
            <div class="eyebrow">Co-op · 2 jugadores · mismo jefe</div>
            <h1 class="hero-title">Modo Cooperativo</h1>
            <p class="hero-text">
              Dos jugadores, un mismo reto. Cada jugador enfrenta el jefe con su condición individual
              además de la condición compartida. Los dos deben cumplir para ganar la ronda.
            </p>
            <p class="hero-note">Tres retos · dos victorias necesarias · un solo equipo</p>
          </div>

          <aside class="hero-panel" aria-label="Reglas del modo cooperativo">
            <div class="panel-kicker">Reglas del modo</div>
            <ul class="live-shortcuts-list">
              <li>El HP del jefe escala en co-op — la dificultad sube un nivel.</li>
              <li>Condición general: igual para ambos jugadores.</li>
              <li>Condición individual: distinta para cada jugador.</li>
              <li>Si uno falla su condición, la ronda se pierde aunque el jefe caiga.</li>
            </ul>
          </aside>
        </section>

        <div class="panel-card coop-setup-card">
          <div class="panel-title">Registrar jugadores</div>
          <p class="mode-selector-copy">Introduce los nombres antes de comenzar. Se guardarán en el dispositivo.</p>

          <div class="coop-setup-fields">
            <div class="coop-setup-field">
              <label class="form-label" for="input-player1">Jugador 1</label>
              <input class="form-input" id="input-player1" type="text" placeholder="Nombre del Jugador 1" autocomplete="off" maxlength="40">
            </div>
            <div class="coop-setup-field">
              <label class="form-label" for="input-player2">Jugador 2</label>
              <input class="form-input" id="input-player2" type="text" placeholder="Nombre del Jugador 2" autocomplete="off" maxlength="40">
            </div>
          </div>

          <button class="btn btn-gold coop-setup-btn" id="btn-coop-start" type="button">Comenzar modo co-op</button>
        </div>
      </main>

      <!-- ── Pantalla de juego ─────────────────────────────────────────── -->
      <main id="coop-game" class="page-wrap page-dashboard" hidden>

        <section class="hero hero-compact">
          <div class="hero-compact-titles">
            <div class="eyebrow">Modo Cooperativo · Prueba Lunar v4.1.0</div>
            <h1 class="hero-title">Prueba Lunar</h1>
            <p class="hero-compact-subtitle">
              <span id="coop-hero-p1-name">Jugador 1</span>
              <span class="coop-hero-sep" aria-hidden="true"> &amp; </span>
              <span id="coop-hero-p2-name">Jugador 2</span>
            </p>
          </div>
          <div class="hero-compact-tags">
            <div class="prize-pill"><span aria-hidden="true">☾</span><span>Bendición Lunar</span></div>
            <div class="mode-badge">Co-op · dificultad escalada</div>
          </div>
        </section>

        <!-- Marcador -->
        <section class="scoreboard">
          <div class="rounds-row">
            <div class="round-orb" id="coop-orb1">
              <span class="orb-icon" id="coop-orb1-icon">I</span>
              <span class="orb-label">RETO</span>
            </div>
            <div class="round-orb" id="coop-orb2">
              <span class="orb-icon" id="coop-orb2-icon">II</span>
              <span class="orb-label">RETO</span>
            </div>
            <div class="round-orb" id="coop-orb3">
              <span class="orb-icon" id="coop-orb3-icon">III</span>
              <span class="orb-label">RETO</span>
            </div>
          </div>

          <div class="score-center">
            <div class="score-nums" id="coop-score-nums">0 · 0</div>
            <div class="score-caption">victorias · derrotas</div>
            <div class="score-needed">necesita 2 victorias</div>
          </div>

          <div class="status-box">
            <div class="status-title">Estado actual</div>
            <div id="coop-status" class="status-label">En curso...</div>
          </div>
        </section>

        <!-- Banner de resultado -->
        <div id="coop-result-banner" class="result-banner" aria-live="polite" aria-atomic="true">
          <div class="banner-icon" id="coop-banner-icon">☾</div>
          <div class="banner-title" id="coop-banner-title"></div>
          <div class="banner-sub" id="coop-banner-sub"></div>
        </div>

        <!-- Controles -->
        <section class="panel-card controls-panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Configuración</p>
              <h2 class="section-title">Prepara el siguiente reto</h2>
            </div>
          </div>
          <div class="controls">
            <button class="btn btn-gold" id="coop-btn-shuffle" type="button">Sortear reto</button>
            <button class="btn btn-ghost friendly-mode-toggle" id="btn-friendly-mode-coop" type="button"
                    aria-pressed="false"
                    aria-label="Activar Modo amable: filtra las condiciones más duras del próximo sorteo">
              <span aria-hidden="true">🤍</span>
              <span class="friendly-mode-label">Modo amable</span>
            </button>
            <button class="btn btn-ghost" id="coop-btn-reset-round" type="button">Reiniciar ronda</button>
            <button class="btn btn-ghost" id="coop-btn-change-players" type="button">Cambiar jugadores</button>
          </div>
        </section>

        <section class="roulette-panel" aria-label="Ruleta de jefes cooperativa">
          <div class="roulette-heading">
            <div>
              <div class="roulette-title">Ruleta Lunar</div>
              <div class="roulette-subtitle" id="coop-roulette-status" aria-live="polite">
                La rueda está lista para elegir la próxima leyenda.
              </div>
            </div>
          </div>
          <div class="roulette-stage">
            <div class="roulette-pointer" aria-hidden="true">▼</div>
            <div class="roulette-wheel-shell">
              <div class="roulette-wheel" id="coop-roulette-wheel">
                <div class="roulette-center">☾</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Tarjeta del reto -->
        <section class="experience-grid">
          <div class="challenge-wrap" style="grid-column: 1 / -1">
            <div class="challenge-card">
              <div class="card-header">
                <div class="round-badge" id="coop-round-badge">1</div>
                <span class="type-tag" id="coop-type-tag">-</span>
                <span class="diff-badge" id="coop-diff-tag">-</span>
                <span class="diff-badge diff-extremo coop-scale-badge" id="coop-scale-badge" hidden aria-label="Dificultad escalada por co-op">Co-op ↑</span>
                <span class="friendly-active-chip" id="coop-friendly-active-chip" hidden aria-hidden="true">
                  <span aria-hidden="true">🤍</span><span>Modo amable</span>
                </span>
              </div>

              <div class="card-body">
                <!-- Estado vacío -->
                <div id="coop-empty-state" class="coop-empty-state">
                  <p>Sortea el reto para comenzar la ronda.</p>
                  <p class="coop-empty-hint">Pulsa <kbd>S</kbd> o el botón <strong>Sortear reto</strong>.</p>
                </div>

                <!-- Información del jefe (oculta hasta sortear) -->
                <div id="coop-boss-info" hidden>
                  <div class="enemy-banner">
                    <div class="enemy-icon" id="coop-enemy-icon">👁</div>
                    <div>
                      <div class="enemy-name" id="coop-enemy-name">Leyenda Local</div>
                      <div class="enemy-region" id="coop-enemy-region">Región · Tipo</div>
                    </div>
                  </div>

                  <div class="challenge-name" id="coop-challenge-title">-</div>
                  <div class="challenge-desc" id="coop-challenge-desc">-</div>

                  <div class="mechanic-tip">
                    <span class="tip-symbol" aria-hidden="true">💡</span>
                    <span id="coop-tip-text"></span>
                  </div>

                  <!-- Info expandida del jefe (elementos, drops) — sólo si el boss la declara -->
                  <div id="coop-extended-info" class="boss-extended-info-slot" hidden></div>

                  <!-- Condiciones generales (ambos jugadores) -->
                  <div class="conditions">
                    <div class="conditions-title">Condiciones del reto — ambos jugadores</div>
                    <ul id="coop-general-conditions"></ul>
                  </div>

                  <!-- Condiciones individuales -->
                  <div class="coop-individual-section">
                    <div class="conditions-title">Condición individual por jugador</div>
                    <div class="coop-individual-grid">
                      <div class="coop-player-slot">
                        <div class="coop-player-slot-label" id="coop-p1-label">Jugador 1</div>
                        <div class="coop-player-slot-text" id="coop-p1-condition">—</div>
                        <button class="coop-reroll-btn" id="coop-btn-p1-reroll" type="button"
                                aria-label="Re-rollear condición del Jugador 1 (1 uso por intento)">
                          <span class="coop-reroll-icon" aria-hidden="true">🔄</span>
                          <span class="coop-reroll-text">Re-roll disponible</span>
                        </button>
                      </div>
                      <div class="coop-player-slot coop-player-slot-alt">
                        <div class="coop-player-slot-label" id="coop-p2-label">Jugador 2</div>
                        <div class="coop-player-slot-text" id="coop-p2-condition">—</div>
                        <button class="coop-reroll-btn" id="coop-btn-p2-reroll" type="button"
                                aria-label="Re-rollear condición del Jugador 2 (1 uso por intento)">
                          <span class="coop-reroll-icon" aria-hidden="true">🔄</span>
                          <span class="coop-reroll-text">Re-roll disponible</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Cronómetro -->
                  <div class="time-section">
                    <div class="time-limit-box">
                      <div class="time-limit-title">Tiempo límite</div>
                      <div class="time-limit-value" id="coop-time-limit-value">—</div>
                    </div>

                    <div class="timer-box">
                      <div class="timer-label">Tiempo del reto</div>
                      <div class="timer-display" id="coop-timer-display" role="timer" aria-live="off">06:00<small>.0</small></div>
                      <div class="timer-actions">
                        <button class="btn btn-gold" id="coop-btn-start-timer" type="button">Iniciar tiempo</button>
                        <button class="btn btn-ghost" id="coop-btn-reset-timer" type="button">Reiniciar tiempo</button>
                      </div>
                    </div>
                  </div>

                  <!-- Botones de resultado por jugador -->
                  <div class="coop-result-grid" id="coop-result-grid">
                    <div class="coop-result-player">
                      <div class="coop-result-player-name" id="coop-result-p1-name">Jugador 1</div>
                      <div class="coop-result-btns">
                        <button class="btn-win" id="coop-btn-p1-win" type="button">Cumplió</button>
                        <button class="btn-lose" id="coop-btn-p1-lose" type="button">Falló</button>
                      </div>
                      <div class="coop-result-status" id="coop-result-p1-status" aria-live="polite">Pendiente</div>
                    </div>

                    <div class="coop-result-player">
                      <div class="coop-result-player-name" id="coop-result-p2-name">Jugador 2</div>
                      <div class="coop-result-btns">
                        <button class="btn-win" id="coop-btn-p2-win" type="button">Cumplió</button>
                        <button class="btn-lose" id="coop-btn-p2-lose" type="button">Falló</button>
                      </div>
                      <div class="coop-result-status" id="coop-result-p2-status" aria-live="polite">Pendiente</div>
                    </div>
                  </div>

                </div><!-- /coop-boss-info -->
              </div><!-- /card-body -->
            </div><!-- /challenge-card -->
          </div>
        </section>

        <details class="info-accordion">
          <summary class="info-accordion-summary">
            <span class="info-accordion-icon" aria-hidden="true">📜</span>
            <span class="info-accordion-title">Reglas del modo, aviso y atajos</span>
            <span class="info-accordion-chevron" aria-hidden="true">▾</span>
          </summary>
          <div class="info-accordion-body">
            <div class="warning-box">
              <span class="warning-symbol" aria-hidden="true">⚠</span>
              <span>El HP de los jefes escala en co-op · dificultad difícil se trata como extremo · extremo añade condición extra.</span>
            </div>

            <div class="info-accordion-grid">
              <div class="panel-card">
                <div class="panel-title">Reglas del modo cooperativo</div>
                <ul class="global-rules-list">
                  <li>Dos jugadores enfrentan el mismo jefe en cada ronda.</li>
                  <li>Cada jugador recibe una condición individual además de las condiciones compartidas.</li>
                  <li>Ambos deben cumplir su condición para ganar la ronda.</li>
                  <li>Cada jugador tiene un re-roll individual por intento.</li>
                  <li>El intento se completa con dos victorias.</li>
                </ul>
              </div>

              <div class="panel-card">
                <div class="panel-title">Atajos útiles</div>
                <ul class="live-shortcuts-list">
                  <li><kbd>S</kbd> sortear reto</li>
                  <li><kbd>Espacio</kbd> iniciar o pausar tiempo</li>
                  <li><kbd>R</kbd> reiniciar ronda</li>
                  <li><kbd>1</kbd> ciclar resultado de Jugador 1</li>
                  <li><kbd>2</kbd> ciclar resultado de Jugador 2</li>
                </ul>
              </div>
            </div>
          </div>
        </details>

        <div class="progress-dots">
          <div class="dot" id="coop-dot0"></div>
          <div class="dot" id="coop-dot1"></div>
          <div class="dot" id="coop-dot2"></div>
        </div>

        <div class="divider-ornament">Prueba Lunar v4.1.0</div>
        <div class="footer">Prueba Lunar v4.1.0 · Modo Cooperativo</div>

      </main><!-- /coop-game -->
    `;
  }

  // ── Referencias DOM ───────────────────────────────────────────────────
  //
  // Se declaran aquí en el closure pero se asignan en captureDomReferences()
  // después de que initializeCoopApp() inyecte el shell en #app-root.

  let setupScreen, gameScreen, liveRegion;
  let inputP1, inputP2, btnStart;
  let btnShuffle, btnResetRound, btnChangePlayers;
  let rouletteWheelEl, rouletteStatusEl;
  let scoreNums, statusEl, roundBadge;
  let orbIcons = [];
  let orbEls = [];
  let dotEls = [];
  let emptyStateEl, bossInfoEl;
  let typeTagEl, diffTagEl, scaleBadgeEl;
  let enemyIconEl, enemyNameEl, enemyRegionEl;
  let challengeTitleEl, challengeDescEl, tipTextEl;
  let extendedInfoEl;
  let generalCondsEl;
  let p1LabelEl, p2LabelEl, p1CondEl, p2CondEl;
  let timeLimitEl, timerDisplayEl, btnStartTimer, btnResetTimer;
  let resultP1NameEl, resultP2NameEl;
  let btnP1Win, btnP1Lose, btnP2Win, btnP2Lose;
  let btnP1Reroll, btnP2Reroll;
  let btnFriendlyMode;
  let friendlyActiveChip;
  let resultP1StatusEl, resultP2StatusEl;
  let resultBannerEl, bannerIconEl, bannerTitleEl, bannerSubEl;
  let heroP1NameEl, heroP2NameEl;

  function captureDomReferences() {
    setupScreen = document.getElementById('coop-setup');
    gameScreen = document.getElementById('coop-game');
    liveRegion = document.getElementById('coop-live-region');

    // Setup
    inputP1 = document.getElementById('input-player1');
    inputP2 = document.getElementById('input-player2');
    btnStart = document.getElementById('btn-coop-start');

    // Controles de juego
    btnShuffle = document.getElementById('coop-btn-shuffle');
    btnResetRound = document.getElementById('coop-btn-reset-round');
    btnChangePlayers = document.getElementById('coop-btn-change-players');
    rouletteWheelEl = document.getElementById('coop-roulette-wheel');
    rouletteStatusEl = document.getElementById('coop-roulette-status');

    // Marcador
    scoreNums = document.getElementById('coop-score-nums');
    statusEl = document.getElementById('coop-status');
    roundBadge = document.getElementById('coop-round-badge');
    orbIcons = [
      document.getElementById('coop-orb1-icon'),
      document.getElementById('coop-orb2-icon'),
      document.getElementById('coop-orb3-icon')
    ];
    orbEls = [
      document.getElementById('coop-orb1'),
      document.getElementById('coop-orb2'),
      document.getElementById('coop-orb3')
    ];
    dotEls = [
      document.getElementById('coop-dot0'),
      document.getElementById('coop-dot1'),
      document.getElementById('coop-dot2')
    ];

    // Tarjeta de reto
    emptyStateEl = document.getElementById('coop-empty-state');
    bossInfoEl = document.getElementById('coop-boss-info');
    typeTagEl = document.getElementById('coop-type-tag');
    diffTagEl = document.getElementById('coop-diff-tag');
    scaleBadgeEl = document.getElementById('coop-scale-badge');
    enemyIconEl = document.getElementById('coop-enemy-icon');
    enemyNameEl = document.getElementById('coop-enemy-name');
    enemyRegionEl = document.getElementById('coop-enemy-region');
    challengeTitleEl = document.getElementById('coop-challenge-title');
    challengeDescEl = document.getElementById('coop-challenge-desc');
    tipTextEl = document.getElementById('coop-tip-text');
    extendedInfoEl = document.getElementById('coop-extended-info');
    generalCondsEl = document.getElementById('coop-general-conditions');
    p1LabelEl = document.getElementById('coop-p1-label');
    p2LabelEl = document.getElementById('coop-p2-label');
    p1CondEl = document.getElementById('coop-p1-condition');
    p2CondEl = document.getElementById('coop-p2-condition');

    // Cronómetro
    timeLimitEl = document.getElementById('coop-time-limit-value');
    timerDisplayEl = document.getElementById('coop-timer-display');
    btnStartTimer = document.getElementById('coop-btn-start-timer');
    btnResetTimer = document.getElementById('coop-btn-reset-timer');

    // Resultados por jugador
    resultP1NameEl = document.getElementById('coop-result-p1-name');
    resultP2NameEl = document.getElementById('coop-result-p2-name');
    btnP1Win = document.getElementById('coop-btn-p1-win');
    btnP1Lose = document.getElementById('coop-btn-p1-lose');
    btnP2Win = document.getElementById('coop-btn-p2-win');
    btnP2Lose = document.getElementById('coop-btn-p2-lose');
    btnP1Reroll = document.getElementById('coop-btn-p1-reroll');
    btnP2Reroll = document.getElementById('coop-btn-p2-reroll');
    btnFriendlyMode = document.getElementById('btn-friendly-mode-coop');
    friendlyActiveChip = document.getElementById('coop-friendly-active-chip');
    resultP1StatusEl = document.getElementById('coop-result-p1-status');
    resultP2StatusEl = document.getElementById('coop-result-p2-status');

    // Banner
    resultBannerEl = document.getElementById('coop-result-banner');
    bannerIconEl = document.getElementById('coop-banner-icon');
    bannerTitleEl = document.getElementById('coop-banner-title');
    bannerSubEl = document.getElementById('coop-banner-sub');

    // Nombres en Hero
    heroP1NameEl = document.getElementById('coop-hero-p1-name');
    heroP2NameEl = document.getElementById('coop-hero-p2-name');
  }

  // ── Estado activo ─────────────────────────────────────────────────────

  let state = null;
  let timerIntervalId = null;
  let timerRunning = false;
  let roulette = null;

  // ── Anunciador de accesibilidad ───────────────────────────────────────

  function announce(message) {
    if (!liveRegion) return;
    liveRegion.textContent = '';
    globalThis.requestAnimationFrame(() => {
      liveRegion.textContent = message;
    });
  }

  // ── Cronómetro ────────────────────────────────────────────────────────

  function stopTimer() {
    if (timerIntervalId) {
      globalThis.clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
    timerRunning = false;
  }

  function startTimer() {
    if (timerRunning || state.timerRemaining <= 0) return;
    timerRunning = true;
    state.roundStarted = true;
    saveState();
    updateTimerButton();

    timerIntervalId = globalThis.setInterval(() => {
      state.timerRemaining = Math.max(state.timerRemaining - 1, 0);
      renderTimer();
      saveState();

      if (state.timerRemaining <= 0) {
        stopTimer();
        setStatus('Tiempo agotado · registra el resultado', 'var(--warning)');
        announce('El tiempo se agotó. Registra el resultado de cada jugador.');
        updateTimerButton();
      }
    }, 100);
  }

  function toggleTimer() {
    if (timerRunning) {
      stopTimer();
      updateTimerButton();
    } else {
      startTimer();
    }
  }

  function resetTimer() {
    stopTimer();
    if (state.timerInitial > 0) {
      state.timerRemaining = state.timerInitial;
    }
    renderTimer();
    updateTimerButton();
    saveState();
  }

  function updateTimerButton() {
    if (!btnStartTimer) return;
    if (timerRunning) {
      btnStartTimer.textContent = 'Pausar tiempo';
      return;
    }
    const hasProgress = state.timerRemaining > 0 && state.timerRemaining < state.timerInitial;
    btnStartTimer.textContent = hasProgress ? 'Reanudar tiempo' : 'Iniciar tiempo';
  }

  // ── Puntuación ────────────────────────────────────────────────────────

  function getScore() {
    const wins = state.results.filter(r => r === 'win').length;
    const losses = state.results.filter(r => r === 'lose').length;
    return { wins, losses };
  }

  function setStatus(label, color = 'var(--text2)') {
    if (statusEl) {
      statusEl.textContent = label;
      statusEl.style.color = color;
    }
  }

  // ── Condiciones individuales ──────────────────────────────────────────

  function pickTwoDifferentConditions() {
    const pool = dataApi.applyFriendlyFilter
      ? dataApi.applyFriendlyFilter(INDIVIDUAL_CONDITIONS)
      : INDIVIDUAL_CONDITIONS;
    const shuffled = shuffleArray(pool);
    if (!shuffled.length) return { p1: null, p2: null };
    const first = shuffled[0];
    // Si por algún motivo sólo hubiese una condición, devolvemos la misma para
    // ambos jugadores en lugar de un null silencioso.
    const second = shuffled.find(c => c.id !== first.id) ?? first;
    return { p1: first, p2: second };
  }

  /**
   * Re-rolea la condición individual de un jugador específico.
   * Garantiza una condición DISTINTA a la actual y a la del otro jugador,
   * respetando el Modo amable. Devuelve el texto nuevo o null si imposible.
   */
  function rerollConditionForPlayer(playerKey) {
    const pool = dataApi.applyFriendlyFilter
      ? dataApi.applyFriendlyFilter(INDIVIDUAL_CONDITIONS)
      : INDIVIDUAL_CONDITIONS;
    const myCurrent = playerKey === 'p1' ? state.player1Condition : state.player2Condition;
    const otherCurrent = playerKey === 'p1' ? state.player2Condition : state.player1Condition;

    const candidates = shuffleArray(pool)
      .filter(c => c && c.text !== myCurrent && c.text !== otherCurrent);
    if (candidates.length) return candidates[0].text;

    // Fallback: si el pool filtrado dejó cero opciones distintas, aceptamos
    // repetir la del otro jugador con tal de cambiar la propia.
    const fallback = shuffleArray(pool).find(c => c && c.text !== myCurrent);
    return fallback?.text ?? null;
  }

  // ── Escalado de dificultad en co-op ──────────────────────────────────

  function scaledDiffInfo(boss) {
    // 'extreme' → extremo + condición extra compartida
    if (boss.difficulty === 'extreme') {
      return { diffClass: 'diff-extremo', diffLabel: 'EXTREMO', isExtraCondition: true };
    }
    // 'hard' → sube a extremo en co-op
    return { diffClass: 'diff-extremo', diffLabel: 'EXTREMO', isExtraCondition: false };
  }

  // ── Sorteo del reto ───────────────────────────────────────────────────

  function assignBossToRound(boss) {
    if (state.gameOver) return;

    const challenge = dataApi.buildChallengeFromBoss(boss, COOP_CHALLENGE_CONFIG);
    const scaled = scaledDiffInfo(boss);
    const { p1, p2 } = pickTwoDifferentConditions();

    // Condición extra para jefes extremo en co-op.
    let generalConds = [...challenge.conditions];
    if (scaled.isExtraCondition) {
      const medPool = COOP_CHALLENGE_CONFIG.mediumConditions ?? [];
      const extra = shuffleArray(medPool).find(c => !challenge.conditions.includes(c.text));
      if (extra) generalConds = [...generalConds, extra.text];
    }

    stopTimer();

    state.currentBoss = { ...boss, diffClass: scaled.diffClass, diffLabel: scaled.diffLabel };
    state.generalConditions = generalConds;
    state.player1Condition = p1?.text ?? null;
    state.player2Condition = p2?.text ?? null;
    state.player1RoundResult = null;
    state.player2RoundResult = null;
    state.roundStarted = false;
    state.timerInitial = challenge.timeLimit * 600;
    state.timerRemaining = state.timerInitial;
    state.challengeTitle = challenge.title;
    state.challengeDesc = challenge.desc;
    state.challengeTip = challenge.tip;
    state.challengeTag = challenge.tag;
    state.challengeTagClass = challenge.tagClass;
    state.rouletteRotation = roulette?.getRotation?.() || 0;

    clearBanner();
    saveState();
    renderAll();
    announce(`Reto sorteado: ${boss.name}.`);
  }

  function setInteractionLock(locked) {
    const controls = [
      btnShuffle,
      btnResetRound,
      btnChangePlayers,
      btnStartTimer,
      btnResetTimer,
      btnP1Win,
      btnP1Lose,
      btnP2Win,
      btnP2Lose
    ];

    controls.forEach(control => {
      if (!control) return;
      control.disabled = locked;
    });

    if (btnShuffle) {
      if (locked) {
        btnShuffle.setAttribute('aria-busy', 'true');
      } else {
        btnShuffle.removeAttribute('aria-busy');
      }
    }
  }

  async function rerollCurrentChallenge() {
    if (state.gameOver || roulette?.isSpinning?.()) return;

    const pool = dataApi.BASE_BOSS_POOL ?? [];
    if (!pool.length) {
      announce('No hay jefes disponibles.');
      return;
    }

    setInteractionLock(true);

    try {
      const winner = roulette
        ? await roulette.spin({
          pool,
          currentBossId: state.currentBoss?.id
        })
        : pickRandom(pool);

      if (winner) {
        assignBossToRound(winner);
      }
    } finally {
      setInteractionLock(false);
    }
  }

  // ── Resultado por jugador ─────────────────────────────────────────────

  function setPlayerResult(player, newResult) {
    if (!state.currentBoss || state.gameOver || roulette?.isSpinning?.()) return;

    if (player === 1) {
      state.player1RoundResult = newResult;
    } else {
      state.player2RoundResult = newResult;
    }

    renderPlayerResults();
    saveState();

    // Finalizar ronda solo cuando ambos tienen resultado y el nuevo es no-nulo.
    if (newResult !== null
      && state.player1RoundResult !== null
      && state.player2RoundResult !== null) {
      finalizeRound();
    }
  }

  function handleResultButton(player, outcome) {
    const current = player === 1 ? state.player1RoundResult : state.player2RoundResult;
    // Segundo clic en el mismo botón → desmarca.
    setPlayerResult(player, current === outcome ? null : outcome);
  }

  /**
   * Maneja el re-roll de condición individual.
   * Cada jugador tiene 1 uso por intento (sesión hasta game over).
   * El uso se persiste en localStorage para sobrevivir a recargas.
   */
  function handleReroll(playerKey) {
    if (!state?.currentBoss) {
      announce('Sortea un reto antes de re-rollear.');
      return;
    }
    const used = playerKey === 'p1' ? state.player1RerollUsed : state.player2RerollUsed;
    if (used) {
      announce('Re-roll ya utilizado en este intento.');
      return;
    }
    const newText = rerollConditionForPlayer(playerKey);
    if (!newText) {
      announce('No hay condiciones alternativas disponibles.');
      return;
    }
    if (playerKey === 'p1') {
      state.player1Condition = newText;
      state.player1RerollUsed = true;
      announce(`${state.player1Name} re-rolleó su condición.`);
    } else {
      state.player2Condition = newText;
      state.player2RerollUsed = true;
      announce(`${state.player2Name} re-rolleó su condición.`);
    }
    saveState();
    renderAll();
  }

  /**
   * Alterna el Modo amable global. La preferencia es universal (afecta a
   * solo, supervisado y coop) y se persiste en localStorage. Si hay un reto
   * sorteado y la ronda aún no ha comenzado, se regenera en sitio con el
   * filtro nuevo. Si la ronda ya empezó, el cambio aplica al próximo sorteo.
   */
  function toggleFriendlyMode() {
    const next = !dataApi.isFriendlyModeEnabled?.();
    dataApi.setFriendlyModeEnabled?.(next);
    renderFriendlyToggle();

    const hasBoss = !!state?.currentBoss;
    const canRegenerate = hasBoss && !state.gameOver && state.roundStarted !== true;

    if (canRegenerate) {
      // Reutiliza el flujo de asignación con el mismo boss para que las
      // condiciones generales y las individuales se recalculen aplicando
      // (o quitando) el filtro de Modo amable.
      assignBossToRound(state.currentBoss);
      announce(next
        ? 'Modo amable activado. Condiciones del reto actual regeneradas con el filtro.'
        : 'Modo amable desactivado. Condiciones del reto actual regeneradas con el pool completo.');
    } else if (hasBoss) {
      announce(next
        ? 'Modo amable activado. La ronda ya está en marcha; se aplicará en el próximo sorteo.'
        : 'Modo amable desactivado. La ronda ya está en marcha; se aplicará en el próximo sorteo.');
    } else {
      announce(next
        ? 'Modo amable activado. Las condiciones más duras quedan fuera del próximo sorteo.'
        : 'Modo amable desactivado. Pool completo restaurado.');
    }
  }

  function renderFriendlyToggle() {
    const active = dataApi.isFriendlyModeEnabled?.() === true;
    document.body.classList.toggle('friendly-mode-active', active);
    if (btnFriendlyMode) {
      btnFriendlyMode.classList.toggle('is-active', active);
      btnFriendlyMode.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    if (friendlyActiveChip) {
      friendlyActiveChip.hidden = !active;
      friendlyActiveChip.setAttribute('aria-hidden', active ? 'false' : 'true');
    }
  }

  function renderRerollButtons() {
    renderOneRerollButton(btnP1Reroll, state?.player1RerollUsed === true, !!state?.currentBoss);
    renderOneRerollButton(btnP2Reroll, state?.player2RerollUsed === true, !!state?.currentBoss);
  }

  function renderOneRerollButton(btn, used, hasBoss) {
    if (!btn) return;
    btn.classList.toggle('is-used', used);
    btn.disabled = used || !hasBoss;
    const textEl = btn.querySelector('.coop-reroll-text');
    if (textEl) {
      if (used) textEl.textContent = 'Re-roll usado';
      else if (!hasBoss) textEl.textContent = 'Re-roll (sortea primero)';
      else textEl.textContent = 'Re-roll disponible';
    }
  }

  function cyclePlayerResult(player) {
    const current = player === 1 ? state.player1RoundResult : state.player2RoundResult;
    let next;
    if (current === null) next = 'pass';
    else if (current === 'pass') next = 'fail';
    else next = null;
    setPlayerResult(player, next);
  }

  // ── Finalización de ronda ─────────────────────────────────────────────

  function finalizeRound() {
    if (roulette?.isSpinning?.()) return;
    stopTimer();

    const bothPassed = state.player1RoundResult === 'pass' && state.player2RoundResult === 'pass';
    state.results[state.currentRound] = bothPassed ? 'win' : 'lose';

    const { wins, losses } = getScore();
    let roundOver = false;

    if (wins >= WINS_NEEDED) {
      state.gameOver = true;
      roundOver = true;
      showBanner({
        cls: 'win',
        icon: '☾',
        title: '¡Bendición Lunar obtenida!',
        sub: `${state.player1Name} y ${state.player2Name} superaron la Prueba Lunar juntos.`
      });
      setStatus('¡Victoria! Bendición Lunar obtenida.', 'var(--success, #34d399)');
      announce(`Victoria. ${state.player1Name} y ${state.player2Name} superaron la Prueba Lunar.`);

    } else if (losses > ROUND_COUNT - WINS_NEEDED) {
      state.gameOver = true;
      roundOver = true;
      showBanner({
        cls: 'lose',
        icon: '✕',
        title: 'Prueba fallida',
        sub: 'El equipo no alcanzó las 2 victorias necesarias.'
      });
      setStatus('Derrota · el equipo no superó la prueba.', 'var(--error, #f87171)');
      announce('Derrota. El equipo no superó la Prueba Lunar.');

    } else if (bothPassed) {
      showBanner({ cls: 'win', icon: '✓', title: 'Ronda superada', sub: 'Ambos jugadores cumplieron su condición.' });
      announce('Ronda superada. Continuad con el siguiente reto.');
    } else {
      showBanner({ cls: 'lose', icon: '✕', title: 'Ronda perdida', sub: 'Uno o ambos jugadores no cumplieron su condición.' });
      announce('Ronda perdida. Continuad con el siguiente reto.');
    }

    if (!roundOver) {
      state.currentRound = Math.min(state.currentRound + 1, ROUND_COUNT - 1);
      state.currentBoss = null;
      state.generalConditions = [];
      state.player1Condition = null;
      state.player2Condition = null;
      state.player1RoundResult = null;
      state.player2RoundResult = null;
      state.timerRemaining = 0;
      state.timerInitial = 0;
      state.roundStarted = false;
    } else {
      // Aunque la prueba termine, limpiamos los marcadores intermedios para
      // que la UI no muestre "Cumplió/Falló" residual si se vuelve a renderizar.
      state.player1RoundResult = null;
      state.player2RoundResult = null;
    }

    saveState();
    renderAll();
  }

  function resetRound() {
    if (roulette?.isSpinning?.()) return;
    stopTimer();

    // Si la prueba ya terminó, reiniciamos todo (resultados + ronda + flag),
    // conservando los nombres de los jugadores.
    const wasGameOver = state.gameOver;
    if (wasGameOver) {
      state.results = [null, null, null];
      state.currentRound = 0;
      state.gameOver = false;
      // El re-roll se restablece sólo cuando la prueba se reinicia entera,
      // no entre rondas individuales. Cada intento da 1 uso por jugador.
      state.player1RerollUsed = false;
      state.player2RerollUsed = false;
    }

    state.currentBoss = null;
    state.generalConditions = [];
    state.player1Condition = null;
    state.player2Condition = null;
    state.player1RoundResult = null;
    state.player2RoundResult = null;
    state.timerRemaining = 0;
    state.timerInitial = 0;
    state.roundStarted = false;
    clearBanner();
    saveState();
    renderAll();
    announce(wasGameOver
      ? 'Prueba reiniciada. Sortea el primer reto.'
      : 'Ronda reiniciada. Sortea un nuevo reto.');
  }

  // ── Render ────────────────────────────────────────────────────────────

  function renderTimer() {
    if (!timerDisplayEl) return;
    timerDisplayEl.innerHTML = formatTimerMarkup(state.timerRemaining);
    timerDisplayEl.classList.toggle('danger', state.timerRemaining > 0 && state.timerRemaining <= 300);
  }

  function renderScoreboard() {
    const { wins, losses } = getScore();
    if (scoreNums) scoreNums.textContent = `${wins} · ${losses}`;
    if (roundBadge) roundBadge.textContent = String(state.currentRound + 1);

    const labels = ['I', 'II', 'III'];
    orbEls.forEach((orb, i) => {
      if (!orb) return;
      const icon = orbIcons[i];
      orb.className = 'round-orb';
      if (state.results[i] === 'win') {
        orb.classList.add('won');
        if (icon) icon.textContent = '✓';
      } else if (state.results[i] === 'lose') {
        orb.classList.add('lost');
        if (icon) icon.textContent = '✕';
      } else {
        if (icon) icon.textContent = labels[i];
        if (i === state.currentRound && !state.gameOver) orb.classList.add('active');
      }
    });

    dotEls.forEach((dot, i) => {
      if (!dot) return;
      dot.className = 'dot';
      if (state.results[i] === 'win') dot.classList.add('won');
      else if (state.results[i] === 'lose') dot.classList.add('lost');
      else if (i === state.currentRound && !state.gameOver) dot.classList.add('active');
    });
  }

  function renderChallenge() {
    const hasBoss = Boolean(state.currentBoss);
    if (emptyStateEl) emptyStateEl.hidden = hasBoss;
    if (bossInfoEl) bossInfoEl.hidden = !hasBoss;
    if (!hasBoss) {
      // Restablecer los indicadores aria-live aunque el contenedor esté oculto
      // para evitar que reaparezcan con el resultado de la ronda anterior.
      renderPlayerResults();
      return;
    }

    const boss = state.currentBoss;

    if (typeTagEl) {
      typeTagEl.textContent = state.challengeTag ?? boss.tag ?? '-';
      typeTagEl.className = `type-tag ${state.challengeTagClass ?? boss.tagClass ?? ''}`;
    }
    if (diffTagEl) {
      diffTagEl.textContent = boss.diffLabel;
      diffTagEl.className = `diff-badge ${boss.diffClass}`;
    }
    if (scaleBadgeEl) scaleBadgeEl.hidden = false;
    if (enemyIconEl) enemyIconEl.textContent = boss.enemyIcon ?? '👁';
    if (enemyNameEl) enemyNameEl.textContent = boss.name;
    if (enemyRegionEl) enemyRegionEl.textContent = boss.region;
    if (challengeTitleEl) challengeTitleEl.textContent = state.challengeTitle ?? boss.name;
    if (challengeDescEl) challengeDescEl.textContent = state.challengeDesc ?? '';
    if (tipTextEl) tipTextEl.textContent = state.challengeTip ?? boss.baseTip ?? '';

    // Info expandida del jefe (elementos eficaces, resistencias, drops).
    // Sólo se muestra si el boss declara `extendedInfo` en data.local.js.
    if (extendedInfoEl) {
      const markup = dataApi.buildExtendedInfoMarkup?.(boss) ?? '';
      extendedInfoEl.innerHTML = markup;
      extendedInfoEl.hidden = !markup;
    }

    if (generalCondsEl) {
      generalCondsEl.innerHTML = '';
      (state.generalConditions ?? []).forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        generalCondsEl.appendChild(li);
      });
    }

    if (p1LabelEl) p1LabelEl.textContent = state.player1Name;
    if (p2LabelEl) p2LabelEl.textContent = state.player2Name;
    if (p1CondEl) p1CondEl.textContent = state.player1Condition ?? '—';
    if (p2CondEl) p2CondEl.textContent = state.player2Condition ?? '—';

    if (timeLimitEl) {
      const mins = Math.round((state.timerInitial ?? 0) / 600);
      timeLimitEl.textContent = `${mins} minuto${mins === 1 ? '' : 's'}`;
    }

    if (resultP1NameEl) resultP1NameEl.textContent = state.player1Name;
    if (resultP2NameEl) resultP2NameEl.textContent = state.player2Name;

    renderPlayerResults();
  }

  function renderPlayerResults() {
    renderOnePlayerResult(state.player1RoundResult, btnP1Win, btnP1Lose, resultP1StatusEl);
    renderOnePlayerResult(state.player2RoundResult, btnP2Win, btnP2Lose, resultP2StatusEl);
  }

  function renderOnePlayerResult(result, winBtn, loseBtn, statusEl2) {
    if (!winBtn || !loseBtn || !statusEl2) return;
    winBtn.classList.toggle('active-win', result === 'pass');
    loseBtn.classList.toggle('active-lose', result === 'fail');
    if (result === 'pass') {
      statusEl2.textContent = 'Cumplió ✓';
      statusEl2.className = 'coop-result-status coop-result-pass';
    } else if (result === 'fail') {
      statusEl2.textContent = 'Falló ✕';
      statusEl2.className = 'coop-result-status coop-result-fail';
    } else {
      statusEl2.textContent = 'Pendiente';
      statusEl2.className = 'coop-result-status';
    }
  }

  function renderHeroNames() {
    if (heroP1NameEl) heroP1NameEl.textContent = state.player1Name;
    if (heroP2NameEl) heroP2NameEl.textContent = state.player2Name;
  }

  function showBanner({ cls = '', icon = '☾', title = '', sub = '' } = {}) {
    if (!resultBannerEl) return;
    resultBannerEl.className = `result-banner ${cls}`;
    if (bannerIconEl) bannerIconEl.textContent = icon;
    if (bannerTitleEl) bannerTitleEl.textContent = title;
    if (bannerSubEl) bannerSubEl.textContent = sub;
  }

  function clearBanner() {
    if (!resultBannerEl) return;
    resultBannerEl.className = 'result-banner';
    if (bannerTitleEl) bannerTitleEl.textContent = '';
    if (bannerSubEl) bannerSubEl.textContent = '';
  }

  function renderAll() {
    renderFriendlyToggle();
    renderHeroNames();
    renderScoreboard();
    renderChallenge();
    renderRerollButtons();
    renderTimer();
    updateTimerButton();
    if (!state.gameOver) {
      setStatus('En curso...', 'var(--text2)');
    }
  }

  // ── Navegación entre pantallas ────────────────────────────────────────

  function showSetupScreen() {
    if (setupScreen) setupScreen.hidden = false;
    if (gameScreen) gameScreen.hidden = true;
  }

  function showGameScreen() {
    if (setupScreen) setupScreen.hidden = true;
    if (gameScreen) gameScreen.hidden = false;
    renderAll();
  }

  function startCoopSession() {
    const p1 = (inputP1?.value ?? '').trim() || 'Jugador 1';
    const p2 = (inputP2?.value ?? '').trim() || 'Jugador 2';
    state = createInitialState(p1, p2);
    saveState();
    showGameScreen();
    announce(`Modo co-op iniciado. ${p1} y ${p2} listos.`);
  }

  function changePlayers() {
    if (roulette?.isSpinning?.()) return;
    stopTimer();
    if (inputP1) inputP1.value = state?.player1Name ?? '';
    if (inputP2) inputP2.value = state?.player2Name ?? '';
    showSetupScreen();
  }

  // ── Inicialización ────────────────────────────────────────────────────

  function init() {
    // Pinta el toggle de Modo amable desde el primer momento (visible
    // tanto en la pantalla de configuración como en el juego).
    renderFriendlyToggle();

    const saved = loadPersistedState();
    if (saved?.player1Name) {
      state = { ...createInitialState(saved.player1Name, saved.player2Name), ...saved };
      showGameScreen();
    } else {
      showSetupScreen();
    }

    roulette = createRouletteController({
      wheel: rouletteWheelEl,
      status: rouletteStatusEl,
      announce
    });
    roulette.setRotation(state?.rouletteRotation || 0);
    roulette.render(dataApi.BASE_BOSS_POOL ?? [], state?.currentBoss?.id ?? null);
  }

  // ── Eventos ───────────────────────────────────────────────────────────

  function handleKeyboardShortcuts(e) {
    if (!state || !gameScreen || gameScreen.hidden) return;

    const activeTag = document.activeElement?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    switch (e.key) {
      case 's':
      case 'S':
        e.preventDefault();
        rerollCurrentChallenge();
        break;

      case ' ':
        e.preventDefault();
        if (state.currentBoss) toggleTimer();
        break;

      case 'r':
      case 'R':
        e.preventDefault();
        if (roulette?.isSpinning?.()) return;
        resetRound();
        break;

      case '1':
        e.preventDefault();
        if (roulette?.isSpinning?.()) return;
        if (state.currentBoss) cyclePlayerResult(1);
        break;

      case '2':
        e.preventDefault();
        if (roulette?.isSpinning?.()) return;
        if (state.currentBoss) cyclePlayerResult(2);
        break;

      default:
        break;
    }
  }

  function attachEvents() {
    btnStart?.addEventListener('click', startCoopSession);

    inputP1?.addEventListener('keydown', e => {
      if (e.key === 'Enter') inputP2?.focus();
    });
    inputP2?.addEventListener('keydown', e => {
      if (e.key === 'Enter') startCoopSession();
    });

    btnShuffle?.addEventListener('click', rerollCurrentChallenge);
    btnResetRound?.addEventListener('click', resetRound);
    btnChangePlayers?.addEventListener('click', changePlayers);

    btnStartTimer?.addEventListener('click', () => {
      if (state?.currentBoss) toggleTimer();
    });
    btnResetTimer?.addEventListener('click', resetTimer);

    btnP1Win?.addEventListener('click', () => handleResultButton(1, 'pass'));
    btnP1Lose?.addEventListener('click', () => handleResultButton(1, 'fail'));
    btnP2Win?.addEventListener('click', () => handleResultButton(2, 'pass'));
    btnP2Lose?.addEventListener('click', () => handleResultButton(2, 'fail'));

    btnP1Reroll?.addEventListener('click', () => handleReroll('p1'));
    btnP2Reroll?.addEventListener('click', () => handleReroll('p2'));

    btnFriendlyMode?.addEventListener('click', toggleFriendlyMode);

    document.addEventListener('keydown', handleKeyboardShortcuts);
  }

  function initializeCoopApp() {
    const root = document.getElementById('app-root');
    if (!root) {
      console.error('Prueba Lunar: no se encontró #app-root en cooperativo.html');
      return false;
    }
    root.innerHTML = buildCoopShell();
    captureDomReferences();
    return true;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!initializeCoopApp()) return;
    init();
    attachEvents();
  });
})();
