const DEFAULT_RESULTS = [null, null, null];
const ROUND_COUNT = 3;
const ACTIVE_MODE = document.body.dataset.mode || 'solo';
const MODE_CONFIG = getModeConfig(ACTIVE_MODE);
const STORAGE_KEY = MODE_CONFIG.storageKey;

const state = {
  assigned: [],
  results: [...DEFAULT_RESULTS],
  currentRound: 0,
  gameOver: false,
  timerRemaining: 0,
  timerInitial: 0,
  timerRunning: false,
  timerInterval: null,
  rouletteSpinning: false,
  rouletteRotation: 0
};

const elements = {
  pageTitle: document.getElementById('page-title'),
  headerKana: document.getElementById('header-kana'),
  headerSubtitle: document.getElementById('header-subtitle'),
  prizeLabel: document.getElementById('prize-label'),
  warningText: document.getElementById('warning-text'),
  rulesTitle: document.getElementById('rules-title'),
  rulesList: document.getElementById('rules-list'),
  footerVersion: document.getElementById('footer-version'),
  modeBadge: document.getElementById('mode-badge'),
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
  cName: document.getElementById('c-name'),
  cDesc: document.getElementById('c-desc'),
  cTip: document.getElementById('c-tip'),
  cTipText: document.getElementById('c-tip-text'),
  cConditions: document.getElementById('c-conditions'),
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

function applyModeContent() {
  document.title = MODE_CONFIG.versionLabel;

  if (elements.pageTitle) elements.pageTitle.textContent = 'Prueba Lunar';
  if (elements.headerKana) elements.headerKana.textContent = `Genshin Impact · ${MODE_CONFIG.label}`;
  if (elements.headerSubtitle) elements.headerSubtitle.textContent = MODE_CONFIG.challengeSubtitle;
  if (elements.prizeLabel) elements.prizeLabel.textContent = MODE_CONFIG.prizeLabel;
  if (elements.warningText) elements.warningText.textContent = MODE_CONFIG.warningText;
  if (elements.rulesTitle) elements.rulesTitle.textContent = MODE_CONFIG.modeRuleTitle;
  if (elements.modeBadge) elements.modeBadge.textContent = MODE_CONFIG.modeBadge;
  if (elements.footerVersion) elements.footerVersion.textContent = MODE_CONFIG.versionLabel;

  if (elements.rulesList) {
    elements.rulesList.innerHTML = '';
    MODE_CONFIG.rules.forEach(rule => {
      const li = document.createElement('li');
      li.textContent = rule;
      elements.rulesList.appendChild(li);
    });
  }

  if (elements.typeFilter) {
    elements.typeFilter.innerHTML = '';
    MODE_CONFIG.typeFilterOptions.forEach(option => {
      const node = document.createElement('option');
      node.value = option.value;
      node.textContent = option.label;
      elements.typeFilter.appendChild(node);
    });
  }
}

function getBossPool() {
  const filter = elements.typeFilter?.value || 'all';
  const pool = getBossPoolForMode(ACTIVE_MODE);
  return filter === 'all' ? pool : pool.filter(boss => boss.type === filter);
}

function getRouletteColor(boss) {
  const bossColors = {
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
    17: 'rgba(145, 120, 180, 0.56)'
  };

  return bossColors[boss.id] || 'rgba(196, 163, 90, 0.45)';
}

function refreshRoulette(selectedBossId = null) {
  if (!elements.rouletteWheel) return;

  const pool = getBossPool();
  const wheel = elements.rouletteWheel;
  const safePool = pool.length ? pool : getBossPoolForMode(ACTIVE_MODE);

  wheel.classList.remove('is-celebrating');
  wheel.style.transition = 'none';
  wheel.innerHTML = '<div class="roulette-center">☾</div>';

  if (!safePool.length) {
    if (elements.rouletteStatus) {
      elements.rouletteStatus.textContent = 'No hay jefes disponibles para el filtro actual.';
    }
    return;
  }

  const step = 360 / safePool.length;
  const startAngle = -90 - (step / 2);
  const gradient = safePool
    .map((boss, index) => `${getRouletteColor(boss)} ${index * step}deg ${(index + 1) * step}deg`)
    .join(', ');

  wheel.style.background = `radial-gradient(circle at center, rgba(10, 12, 16, 0.85) 0 18%, transparent 18%), conic-gradient(from ${startAngle}deg, ${gradient})`;
  wheel.style.transform = `rotate(${state.rouletteRotation}deg)`;

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

  if (elements.rouletteStatus && !state.rouletteSpinning) {
    elements.rouletteStatus.textContent = selectedBossId
      ? 'La rueda señala al jefe actual del reto.'
      : `La rueda contiene ${safePool.length} leyendas disponibles.`;
  }
}

let rouletteAudioContext = null;

function getRouletteAudioContext() {
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
  const audioContext = getRouletteAudioContext();
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

function playRouletteStartSound() {
  [0, 0.11, 0.22, 0.34, 0.46].forEach((delay, index) => {
    playTone(520 + (index * 35), 0.05, 'triangle', 0.018, delay);
  });
}

function playRouletteWinSound() {
  playTone(660, 0.08, 'sine', 0.03, 0);
  playTone(880, 0.1, 'sine', 0.04, 0.08);
  playTone(1040, 0.16, 'triangle', 0.05, 0.18);
}

function highlightRouletteWinner(boss) {
  if (!elements.rouletteWheel || !boss) return;

  const center = elements.rouletteWheel.querySelector('.roulette-center');
  if (!center) return;

  center.textContent = boss.enemyIcon;
  center.classList.add('winner-reveal');

  globalThis.setTimeout(() => {
    center.textContent = '☾';
    center.classList.remove('winner-reveal');
  }, 1800);
}

function buildAssignedChallenges(pool) {
  const sourcePool = pool.length >= ROUND_COUNT ? pool : getBossPoolForMode(ACTIVE_MODE);
  const shuffled = shuffleArray(sourcePool).slice(0, ROUND_COUNT);
  return shuffled.map(boss => buildChallengeFromBoss(boss, MODE_CONFIG));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    assigned: state.assigned,
    results: state.results,
    currentRound: state.currentRound,
    gameOver: state.gameOver,
    timerRemaining: state.timerRemaining,
    timerInitial: state.timerInitial,
    timerRunning: false
  }));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw);
    state.assigned = parsed.assigned || [];
    state.results = parsed.results || [...DEFAULT_RESULTS];
    state.currentRound = parsed.currentRound ?? 0;
    state.gameOver = parsed.gameOver ?? false;
    state.timerRemaining = parsed.timerRemaining ?? 0;
    state.timerInitial = parsed.timerInitial ?? 0;
    state.timerRunning = false;
    state.timerInterval = null;
    updateTimerButton();
    return true;
  } catch {
    return false;
  }
}

function clearBanner() {
  elements.resultBanner.className = 'result-banner';
  elements.statusLabel.textContent = 'En curso...';
  elements.statusLabel.style.color = 'var(--text2)';
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }

  state.timerRunning = false;
  updateTimerButton();
}

function pauseTimer() {
  stopTimer();
  saveState();
}

function updateTimerButton() {
  if (elements.btnStartTimer) {
    elements.btnStartTimer.textContent = state.timerRunning ? 'Pausar tiempo' : 'Iniciar tiempo';
  }
}

function formatTime(totalTenths) {
  const safeTime = Math.max(totalTenths, 0);
  const minutes = Math.floor(safeTime / 600);
  const seconds = Math.floor((safeTime % 600) / 10);
  const tenths = safeTime % 10;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}<small>.${tenths}</small>`;
}

function renderTimer() {
  if (!elements.timerDisplay) return;

  elements.timerDisplay.innerHTML = formatTime(state.timerRemaining);

  if (state.timerRemaining <= 300) {
    elements.timerDisplay.classList.add('danger');
  } else {
    elements.timerDisplay.classList.remove('danger');
  }
}

function setTimerForCurrentChallenge() {
  const current = state.assigned[state.currentRound];
  const minutes = current?.timeLimit ?? 6;
  state.timerInitial = minutes * 60 * 10;
  state.timerRemaining = state.timerInitial;
  stopTimer();
  renderTimer();
  saveState();
}

function onTimerFinished() {
  stopTimer();
  renderTimer();

  const success = globalThis.confirm(
    'Se acabo el tiempo. Aceptar = el participante cumplio el reto antes del limite. Cancelar = el reto se considera fallido.'
  );

  recordResult(success ? 'win' : 'lose');
}

function startTimer() {
  if (state.gameOver || state.timerRunning) return;
  if (state.timerRemaining <= 0) setTimerForCurrentChallenge();

  state.timerRunning = true;
  updateTimerButton();

  state.timerInterval = setInterval(() => {
    state.timerRemaining -= 1;
    renderTimer();

    if (state.timerRemaining <= 0) {
      state.timerRemaining = 0;
      renderTimer();
      saveState();
      onTimerFinished();
      return;
    }

    saveState();
  }, 100);
}

function toggleTimer() {
  if (state.timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function resetTimer() {
  setTimerForCurrentChallenge();
  updateTimerButton();
}

function initNewGame() {
  state.assigned = buildAssignedChallenges(getBossPool());
  state.results = [...DEFAULT_RESULTS];
  state.currentRound = 0;
  state.gameOver = false;
  state.rouletteSpinning = false;
  state.rouletteRotation = 0;

  clearBanner();
  renderAll();
  setTimerForCurrentChallenge();
  updateTimerButton();
  saveState();
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
      icon.textContent = '\u2713';
    } else if (state.results[index] === 'lose') {
      orb.classList.add('lost');
      icon.textContent = '\u2717';
    } else {
      icon.textContent = labels[index];
      if (index === state.currentRound && !state.gameOver) {
        orb.classList.add('active');
      }
    }
  }
}

function renderConditions(conditions) {
  elements.cConditions.innerHTML = '';

  conditions.forEach(condition => {
    const li = document.createElement('li');
    li.textContent = condition;
    elements.cConditions.appendChild(li);
  });
}

function renderChallenge() {
  const current = state.assigned[state.currentRound];
  if (!current) return;

  elements.roundBadge.textContent = String(state.currentRound + 1);
  elements.typeTag.textContent = current.tag;
  elements.typeTag.className = `type-tag ${current.tagClass}`;
  elements.diffTag.textContent = current.diffLabel;
  elements.diffTag.className = `diff-badge ${current.diffClass}`;
  elements.enemyIcon.textContent = current.enemyIcon;
  elements.enemyName.textContent = current.enemy;
  elements.enemyRegion.textContent = current.region;
  elements.cName.textContent = current.title;
  elements.cDesc.textContent = current.desc;

  if (current.tip) {
    elements.cTip.style.display = 'flex';
    elements.cTipText.textContent = current.tip;
  } else {
    elements.cTip.style.display = 'none';
    elements.cTipText.textContent = '';
  }

  elements.timeLimitValue.textContent = `${current.timeLimit} minuto${current.timeLimit === 1 ? '' : 's'}`;
  renderConditions(current.conditions || []);
  elements.btnWin.disabled = state.gameOver;
  elements.btnLose.disabled = state.gameOver;

  if (!state.rouletteSpinning) {
    refreshRoulette(current.bossId);
  }
}

function renderScore() {
  const wins = state.results.filter(result => result === 'win').length;
  const loses = state.results.filter(result => result === 'lose').length;
  elements.scoreNums.textContent = `${wins} · ${loses}`;
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

function renderAll() {
  renderOrbs();
  renderChallenge();
  renderScore();
  renderDots();
  renderTimer();
}

function showVictory() {
  elements.resultBanner.className = 'result-banner victory show';
  elements.bannerIcon.textContent = '\u263E';
  elements.bannerTitle.textContent = 'Bendicion Lunar Obtenida';
  elements.bannerSub.textContent = ACTIVE_MODE === 'supervisado'
    ? 'El participante superó la validación y el juez confirma el cumplimiento del reto.'
    : 'La valentía y la ejecución fueron suficientes para reclamar la recompensa.';
  elements.statusLabel.textContent = 'Victoria';
  elements.statusLabel.style.color = 'var(--win)';
  elements.resultBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showDefeat() {
  elements.resultBanner.className = 'result-banner defeat show';
  elements.bannerIcon.textContent = '\u2717';
  elements.bannerTitle.textContent = 'Las Leyendas permanecen invictas';
  elements.bannerSub.textContent = ACTIVE_MODE === 'supervisado'
    ? 'La supervision confirma que no se cumplieron las condiciones del sello.'
    : 'Los sellos lunares no han sido rotos. La bendicion espera un nuevo intento.';
  elements.statusLabel.textContent = 'Derrota';
  elements.statusLabel.style.color = 'var(--lose)';
  elements.resultBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function moveToNextRoundIfNeeded() {
  if (!state.gameOver) {
    setTimerForCurrentChallenge();
  }
}

function recordResult(result) {
  if (state.gameOver) return;

  stopTimer();
  state.results[state.currentRound] = result;

  const wins = state.results.filter(value => value === 'win').length;
  const loses = state.results.filter(value => value === 'lose').length;

  if (wins >= 2) {
    state.gameOver = true;
    showVictory();
  } else if (loses >= 2) {
    state.gameOver = true;
    showDefeat();
  } else {
    state.currentRound += 1;
    moveToNextRoundIfNeeded();
  }

  renderAll();
  saveState();
}

function assignBossToCurrentChallenge(boss) {
  state.assigned[state.currentRound] = buildChallengeFromBoss(boss, MODE_CONFIG);
  renderChallenge();
  setTimerForCurrentChallenge();
  saveState();
}

function rerollCurrentChallenge() {
  if (state.gameOver || state.rouletteSpinning) return;

  const displayPool = getBossPool();
  const currentBossId = state.assigned[state.currentRound]?.bossId;
  const eligiblePool = displayPool.filter(boss => boss.id !== Number(currentBossId));

  let fallbackPool = eligiblePool;
  if (!fallbackPool.length) {
    fallbackPool = displayPool.length ? displayPool : getBossPoolForMode(ACTIVE_MODE);
  }

  const boss = pickRandom(fallbackPool);

  if (!boss || !elements.rouletteWheel) {
    if (boss) assignBossToCurrentChallenge(boss);
    return;
  }

  const wheel = elements.rouletteWheel;
  const wheelPool = displayPool.length ? displayPool : fallbackPool;
  const bossIndex = wheelPool.findIndex(item => item.id === boss.id);
  const step = 360 / wheelPool.length;
  const centerAngle = bossIndex * step;
  const extraSpins = 5 + Math.floor(Math.random() * 3);
  const targetRotation = state.rouletteRotation + (extraSpins * 360) + (360 - centerAngle);

  state.rouletteSpinning = true;
  elements.btnShuffle.disabled = true;
  elements.btnReset.disabled = true;
  if (elements.typeFilter) elements.typeFilter.disabled = true;
  elements.btnShuffle.textContent = 'Girando...';

  if (elements.rouletteStatus) {
    elements.rouletteStatus.textContent = 'La ruleta está girando...';
  }

  playRouletteStartSound();
  refreshRoulette();
  wheel.style.transition = 'none';
  wheel.style.transform = `rotate(${state.rouletteRotation}deg)`;
  wheel.getBoundingClientRect();
  wheel.style.transition = 'transform 4.6s cubic-bezier(0.12, 0.8, 0.18, 1)';

  requestAnimationFrame(() => {
    wheel.style.transform = `rotate(${targetRotation}deg)`;
  });

  let spinFinished = false;
  const onSpinEnd = () => {
    if (spinFinished) return;
    spinFinished = true;

    wheel.removeEventListener('transitionend', onSpinEnd);
    state.rouletteSpinning = false;
    state.rouletteRotation = targetRotation;
    elements.btnShuffle.disabled = false;
    elements.btnReset.disabled = false;
    if (elements.typeFilter) elements.typeFilter.disabled = false;
    elements.btnShuffle.textContent = 'Sortear reto';

    const normalizedRotation = ((state.rouletteRotation % 360) + 360) % 360;
    const winningAngle = (360 - normalizedRotation) % 360;
    const winningIndex = Math.round(winningAngle / step) % wheelPool.length;
    const winningBoss = wheelPool[winningIndex] || boss;

    assignBossToCurrentChallenge(winningBoss);
    wheel.classList.add('is-celebrating');
    highlightRouletteWinner(winningBoss);
    playRouletteWinSound();
    setTimeout(() => wheel.classList.remove('is-celebrating'), 1500);

    if (elements.rouletteStatus) {
      elements.rouletteStatus.textContent = `La ruleta eligió: ${winningBoss.enemyIcon} ${winningBoss.name}`;
    }
  };

  wheel.addEventListener('transitionend', onSpinEnd, { once: true });
  setTimeout(onSpinEnd, 4800);
}

function openModal() {
  const current = state.assigned[state.currentRound];
  if (!current) return;

  elements.modalTitleInput.value = current.title;
  elements.modalDescInput.value = current.desc;
  elements.modalCondsInput.value = (current.conditions || []).join(' | ');
  elements.modalOverlay.classList.add('open');
}

function closeModal() {
  elements.modalOverlay.classList.remove('open');
}

function extractTimeLimitFromConditions(conditions, fallbackMinutes = 6) {
  const timeText = conditions.find(text => text.toLowerCase().includes('tiempo limite:'));
  if (!timeText) return fallbackMinutes;

  const match = timeText.match(/(\d+)/);
  return match ? Number(match[1]) : fallbackMinutes;
}

function saveModal() {
  const title = elements.modalTitleInput.value.trim();
  const desc = elements.modalDescInput.value.trim();
  const condStr = elements.modalCondsInput.value.trim();

  if (!title) return;

  const conditions = condStr
    ? condStr.split('|').map(item => item.trim()).filter(Boolean)
    : [];

  const newTimeLimit = extractTimeLimitFromConditions(
    conditions,
    state.assigned[state.currentRound]?.timeLimit ?? 6
  );

  const cleanConditions = conditions.filter(item => !item.toLowerCase().includes('tiempo limite:'));

  state.assigned[state.currentRound] = {
    ...state.assigned[state.currentRound],
    title,
    desc,
    conditions: cleanConditions,
    timeLimit: newTimeLimit
  };

  closeModal();
  renderChallenge();
  setTimerForCurrentChallenge();
  saveState();
}

function attachEvents() {
  elements.btnShuffle.addEventListener('click', rerollCurrentChallenge);
  elements.btnReset.addEventListener('click', initNewGame);
  elements.btnEdit.addEventListener('click', openModal);
  elements.btnWin.addEventListener('click', () => recordResult('win'));
  elements.btnLose.addEventListener('click', () => recordResult('lose'));
  elements.btnSaveModal.addEventListener('click', saveModal);
  elements.btnCloseModal.addEventListener('click', closeModal);
  elements.btnStartTimer.addEventListener('click', toggleTimer);
  elements.btnResetTimer.addEventListener('click', resetTimer);

  if (elements.typeFilter) {
    elements.typeFilter.addEventListener('change', initNewGame);
  }

  elements.modalOverlay.addEventListener('click', event => {
    if (event.target === elements.modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });
}

function bootstrap() {
  applyModeContent();
  attachEvents();

  const restored = loadState();

  if (restored && state.assigned.length) {
    renderAll();

    if (state.gameOver) {
      const wins = state.results.filter(value => value === 'win').length;
      const loses = state.results.filter(value => value === 'lose').length;

      if (wins >= 2) showVictory();
      if (loses >= 2) showDefeat();
    } else if (state.timerInitial <= 0) {
      setTimerForCurrentChallenge();
    } else {
      renderTimer();
    }
  } else {
    initNewGame();
  }
}

bootstrap();
