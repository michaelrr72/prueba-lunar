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

  // ── Referencias DOM ───────────────────────────────────────────────────

  const setupScreen  = document.getElementById('coop-setup');
  const gameScreen   = document.getElementById('coop-game');
  const liveRegion   = document.getElementById('coop-live-region');

  // Setup
  const inputP1      = document.getElementById('input-player1');
  const inputP2      = document.getElementById('input-player2');
  const btnStart     = document.getElementById('btn-coop-start');

  // Controles de juego
  const btnShuffle        = document.getElementById('coop-btn-shuffle');
  const btnResetRound     = document.getElementById('coop-btn-reset-round');
  const btnChangePlayers  = document.getElementById('coop-btn-change-players');
  const rouletteWheelEl   = document.getElementById('coop-roulette-wheel');
  const rouletteStatusEl  = document.getElementById('coop-roulette-status');

  // Marcador
  const scoreNums  = document.getElementById('coop-score-nums');
  const statusEl   = document.getElementById('coop-status');
  const roundBadge = document.getElementById('coop-round-badge');
  const orbIcons   = [
    document.getElementById('coop-orb1-icon'),
    document.getElementById('coop-orb2-icon'),
    document.getElementById('coop-orb3-icon')
  ];
  const orbEls = [
    document.getElementById('coop-orb1'),
    document.getElementById('coop-orb2'),
    document.getElementById('coop-orb3')
  ];
  const dotEls = [
    document.getElementById('coop-dot0'),
    document.getElementById('coop-dot1'),
    document.getElementById('coop-dot2')
  ];

  // Tarjeta de reto
  const emptyStateEl   = document.getElementById('coop-empty-state');
  const bossInfoEl     = document.getElementById('coop-boss-info');
  const typeTagEl      = document.getElementById('coop-type-tag');
  const diffTagEl      = document.getElementById('coop-diff-tag');
  const scaleBadgeEl   = document.getElementById('coop-scale-badge');
  const enemyIconEl    = document.getElementById('coop-enemy-icon');
  const enemyNameEl    = document.getElementById('coop-enemy-name');
  const enemyRegionEl  = document.getElementById('coop-enemy-region');
  const challengeTitleEl = document.getElementById('coop-challenge-title');
  const challengeDescEl  = document.getElementById('coop-challenge-desc');
  const tipTextEl        = document.getElementById('coop-tip-text');
  const generalCondsEl   = document.getElementById('coop-general-conditions');
  const p1LabelEl        = document.getElementById('coop-p1-label');
  const p2LabelEl        = document.getElementById('coop-p2-label');
  const p1CondEl         = document.getElementById('coop-p1-condition');
  const p2CondEl         = document.getElementById('coop-p2-condition');

  // Cronómetro
  const timeLimitEl    = document.getElementById('coop-time-limit-value');
  const timerDisplayEl = document.getElementById('coop-timer-display');
  const btnStartTimer  = document.getElementById('coop-btn-start-timer');
  const btnResetTimer  = document.getElementById('coop-btn-reset-timer');

  // Resultados por jugador
  const resultP1NameEl   = document.getElementById('coop-result-p1-name');
  const resultP2NameEl   = document.getElementById('coop-result-p2-name');
  const btnP1Win  = document.getElementById('coop-btn-p1-win');
  const btnP1Lose = document.getElementById('coop-btn-p1-lose');
  const btnP2Win  = document.getElementById('coop-btn-p2-win');
  const btnP2Lose = document.getElementById('coop-btn-p2-lose');
  const resultP1StatusEl = document.getElementById('coop-result-p1-status');
  const resultP2StatusEl = document.getElementById('coop-result-p2-status');

  // Banner
  const resultBannerEl = document.getElementById('coop-result-banner');
  const bannerIconEl   = document.getElementById('coop-banner-icon');
  const bannerTitleEl  = document.getElementById('coop-banner-title');
  const bannerSubEl    = document.getElementById('coop-banner-sub');

  // Nombres en Hero
  const heroP1NameEl = document.getElementById('coop-hero-p1-name');
  const heroP2NameEl = document.getElementById('coop-hero-p2-name');

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
    const wins   = state.results.filter(r => r === 'win').length;
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
    const shuffled = shuffleArray(INDIVIDUAL_CONDITIONS);
    const first  = shuffled[0] ?? null;
    const second = shuffled.find(c => c.id !== first?.id) ?? null;
    return { p1: first, p2: second };
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
    const scaled    = scaledDiffInfo(boss);
    const { p1, p2 } = pickTwoDifferentConditions();

    // Condición extra para jefes extremo en co-op.
    let generalConds = [...challenge.conditions];
    if (scaled.isExtraCondition) {
      const medPool = COOP_CHALLENGE_CONFIG.mediumConditions ?? [];
      const extra   = shuffleArray(medPool).find(c => !challenge.conditions.includes(c.text));
      if (extra) generalConds = [...generalConds, extra.text];
    }

    stopTimer();

    state.currentBoss         = { ...boss, diffClass: scaled.diffClass, diffLabel: scaled.diffLabel };
    state.generalConditions   = generalConds;
    state.player1Condition    = p1?.text ?? null;
    state.player2Condition    = p2?.text ?? null;
    state.player1RoundResult  = null;
    state.player2RoundResult  = null;
    state.roundStarted        = false;
    state.timerInitial        = challenge.timeLimit * 600;
    state.timerRemaining      = state.timerInitial;
    state.challengeTitle      = challenge.title;
    state.challengeDesc       = challenge.desc;
    state.challengeTip        = challenge.tip;
    state.challengeTag        = challenge.tag;
    state.challengeTagClass   = challenge.tagClass;
    state.rouletteRotation    = roulette?.getRotation?.() || 0;

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

  function cyclePlayerResult(player) {
    const current = player === 1 ? state.player1RoundResult : state.player2RoundResult;
    let next;
    if (current === null)    next = 'pass';
    else if (current === 'pass') next = 'fail';
    else                         next = null;
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
      state.currentRound       = Math.min(state.currentRound + 1, ROUND_COUNT - 1);
      state.currentBoss        = null;
      state.generalConditions  = [];
      state.player1Condition   = null;
      state.player2Condition   = null;
      state.player1RoundResult = null;
      state.player2RoundResult = null;
      state.timerRemaining     = 0;
      state.timerInitial       = 0;
      state.roundStarted       = false;
    }

    saveState();
    renderAll();
  }

  function resetRound() {
    if (roulette?.isSpinning?.()) return;
    stopTimer();
    state.currentBoss        = null;
    state.generalConditions  = [];
    state.player1Condition   = null;
    state.player2Condition   = null;
    state.player1RoundResult = null;
    state.player2RoundResult = null;
    state.timerRemaining     = 0;
    state.timerInitial       = 0;
    state.roundStarted       = false;
    clearBanner();
    saveState();
    renderAll();
    announce('Ronda reiniciada. Sortea un nuevo reto.');
  }

  // ── Render ────────────────────────────────────────────────────────────

  function renderTimer() {
    if (!timerDisplayEl) return;
    timerDisplayEl.innerHTML = formatTimerMarkup(state.timerRemaining);
    timerDisplayEl.classList.toggle('danger', state.timerRemaining > 0 && state.timerRemaining <= 300);
  }

  function renderScoreboard() {
    const { wins, losses } = getScore();
    if (scoreNums)  scoreNums.textContent  = `${wins} · ${losses}`;
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
      if (state.results[i] === 'win')        dot.classList.add('won');
      else if (state.results[i] === 'lose')  dot.classList.add('lost');
      else if (i === state.currentRound && !state.gameOver) dot.classList.add('active');
    });
  }

  function renderChallenge() {
    const hasBoss = Boolean(state.currentBoss);
    if (emptyStateEl) emptyStateEl.hidden = hasBoss;
    if (bossInfoEl)   bossInfoEl.hidden   = !hasBoss;
    if (!hasBoss) return;

    const boss = state.currentBoss;

    if (typeTagEl) {
      typeTagEl.textContent = state.challengeTag ?? boss.tag ?? '-';
      typeTagEl.className   = `type-tag ${state.challengeTagClass ?? boss.tagClass ?? ''}`;
    }
    if (diffTagEl) {
      diffTagEl.textContent = boss.diffLabel;
      diffTagEl.className   = `diff-badge ${boss.diffClass}`;
    }
    if (scaleBadgeEl) scaleBadgeEl.hidden = false;
    if (enemyIconEl)   enemyIconEl.textContent  = boss.enemyIcon  ?? '👁';
    if (enemyNameEl)   enemyNameEl.textContent   = boss.name;
    if (enemyRegionEl) enemyRegionEl.textContent = boss.region;
    if (challengeTitleEl) challengeTitleEl.textContent = state.challengeTitle ?? boss.name;
    if (challengeDescEl)  challengeDescEl.textContent  = state.challengeDesc  ?? '';
    if (tipTextEl)        tipTextEl.textContent         = state.challengeTip   ?? boss.baseTip ?? '';

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
    if (p1CondEl)  p1CondEl.textContent  = state.player1Condition ?? '—';
    if (p2CondEl)  p2CondEl.textContent  = state.player2Condition ?? '—';

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
    winBtn.classList.toggle('active-win',   result === 'pass');
    loseBtn.classList.toggle('active-lose', result === 'fail');
    if (result === 'pass') {
      statusEl2.textContent = 'Cumplió ✓';
      statusEl2.className   = 'coop-result-status coop-result-pass';
    } else if (result === 'fail') {
      statusEl2.textContent = 'Falló ✕';
      statusEl2.className   = 'coop-result-status coop-result-fail';
    } else {
      statusEl2.textContent = 'Pendiente';
      statusEl2.className   = 'coop-result-status';
    }
  }

  function renderHeroNames() {
    if (heroP1NameEl) heroP1NameEl.textContent = state.player1Name;
    if (heroP2NameEl) heroP2NameEl.textContent = state.player2Name;
  }

  function showBanner({ cls = '', icon = '☾', title = '', sub = '' } = {}) {
    if (!resultBannerEl) return;
    resultBannerEl.className = `result-banner ${cls}`;
    if (bannerIconEl)  bannerIconEl.textContent  = icon;
    if (bannerTitleEl) bannerTitleEl.textContent = title;
    if (bannerSubEl)   bannerSubEl.textContent   = sub;
  }

  function clearBanner() {
    if (!resultBannerEl) return;
    resultBannerEl.className = 'result-banner';
    if (bannerTitleEl) bannerTitleEl.textContent = '';
    if (bannerSubEl)   bannerSubEl.textContent   = '';
  }

  function renderAll() {
    renderHeroNames();
    renderScoreboard();
    renderChallenge();
    renderTimer();
    updateTimerButton();
    if (!state.gameOver) {
      setStatus('En curso...', 'var(--text2)');
    }
  }

  // ── Navegación entre pantallas ────────────────────────────────────────

  function showSetupScreen() {
    if (setupScreen) setupScreen.hidden = false;
    if (gameScreen)  gameScreen.hidden  = true;
  }

  function showGameScreen() {
    if (setupScreen) setupScreen.hidden = true;
    if (gameScreen)  gameScreen.hidden  = false;
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

    btnP1Win?.addEventListener('click',  () => handleResultButton(1, 'pass'));
    btnP1Lose?.addEventListener('click', () => handleResultButton(1, 'fail'));
    btnP2Win?.addEventListener('click',  () => handleResultButton(2, 'pass'));
    btnP2Lose?.addEventListener('click', () => handleResultButton(2, 'fail'));

    document.addEventListener('keydown', handleKeyboardShortcuts);
  }

  document.addEventListener('DOMContentLoaded', () => {
    init();
    attachEvents();
  });
})();
