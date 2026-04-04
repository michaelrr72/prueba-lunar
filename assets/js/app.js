const STORAGE_KEY = 'prueba-lunar-state-v2';

const state = {
  assigned: [],
  results: [null, null, null],
  currentRound: 0,
  gameOver: false,
  timerRemaining: 0,
  timerInitial: 0,
  timerRunning: false,
  timerInterval: null
};

const elements = {
  typeFilter: document.getElementById('type-filter'),
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

  timeLimitBox: document.getElementById('time-limit-box'),
  timeLimitValue: document.getElementById('time-limit-value'),
  timerDisplay: document.getElementById('timer-display'),
  btnStartTimer: document.getElementById('btn-start-timer'),
  btnResetTimer: document.getElementById('btn-reset-timer')
};

function getBossPool() {
  return BOSS_POOL;
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildAssignedChallenges(pool) {
  const shuffled = shuffleArray(pool);
  const selected = shuffled.slice(0, 3);
  return selected.map(boss => buildChallengeFromBoss(boss));
}

function saveState() {
  const serializable = {
    assigned: state.assigned,
    results: state.results,
    currentRound: state.currentRound,
    gameOver: state.gameOver,
    timerRemaining: state.timerRemaining,
    timerInitial: state.timerInitial,
    timerRunning: false
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw);
    state.assigned = parsed.assigned || [];
    state.results = parsed.results || [null, null, null];
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

function toggleTimer() {
  if (state.timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function updateTimerButton() {
  elements.btnStartTimer.textContent = state.timerRunning ? 'Pausar tiempo' : 'Iniciar tiempo';
}

function formatTime(totalTenths) {
  const minutes = Math.floor(totalTenths / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}<small>.${tenths}</small>`;
}

function renderTimer() {
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

  const success = window.confirm(
    'Se acabó el tiempo. ¿El participante logró cumplir el reto antes de que terminara?\\n\\nAceptar = Sí, cumplió\\nCancelar = No, falló'
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

function resetTimer() {
  setTimerForCurrentChallenge();
  updateTimerButton();
}

function initNewGame() {
  const pool = getBossPool();

  state.assigned = buildAssignedChallenges(pool);
  state.results = [null, null, null];
  state.currentRound = 0;
  state.gameOver = false;

  clearBanner();
  renderAll();
  setTimerForCurrentChallenge();
  updateTimerButton();
  saveState();
}

function renderOrbs() {
  const labels = ['I', 'II', 'III'];

  for (let i = 0; i < 3; i++) {
    const orb = document.getElementById(`orb${i + 1}`);
    const icon = document.getElementById(`orb${i + 1}-icon`);

    orb.className = 'round-orb';

    if (state.results[i] === 'win') {
      orb.classList.add('won');
      icon.textContent = '✓';
    } else if (state.results[i] === 'lose') {
      orb.classList.add('lost');
      icon.textContent = '✗';
    } else {
      icon.textContent = labels[i];
      if (i === state.currentRound && !state.gameOver) {
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
}

function renderScore() {
  const wins = state.results.filter(result => result === 'win').length;
  const loses = state.results.filter(result => result === 'lose').length;
  elements.scoreNums.textContent = `${wins} · ${loses}`;
}

function renderDots() {
  for (let i = 0; i < 3; i++) {
    const dot = document.getElementById(`dot${i}`);
    dot.className = 'dot';

    if (state.results[i] === 'win') {
      dot.classList.add('won');
    } else if (state.results[i] === 'lose') {
      dot.classList.add('lost');
    } else if (i === state.currentRound && !state.gameOver) {
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
  elements.bannerIcon.textContent = '☾';
  elements.bannerTitle.textContent = '¡Bendición Lunar Obtenida!';
  elements.bannerSub.textContent = 'Ha demostrado valentía y habilidad real frente a las Leyendas de Teyvat. La luna sonríe. ¡Entrega la recompensa merecida!';
  elements.statusLabel.textContent = '¡Victoria!';
  elements.statusLabel.style.color = 'var(--win)';
  elements.resultBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showDefeat() {
  elements.resultBanner.className = 'result-banner defeat show';
  elements.bannerIcon.textContent = '✗';
  elements.bannerTitle.textContent = 'Las Leyendas permanecen invictas';
  elements.bannerSub.textContent = 'Los sellos lunares no han sido rotos. La bendición espera a quien lo intente de nuevo.';
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

function rerollCurrentChallenge() {
  if (state.gameOver) return;

  const currentBossId = state.assigned[state.currentRound]?.bossId;
  const pool = getBossPool().filter(boss => boss.id !== currentBossId);
  const boss = pickRandom(pool.length ? pool : getBossPool());

  state.assigned[state.currentRound] = buildChallengeFromBoss(boss);
  renderChallenge();
  setTimerForCurrentChallenge();
  saveState();
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
  const timeText = conditions.find(text => text.toLowerCase().includes('tiempo límite:'));
  if (!timeText) return fallbackMinutes;

  const match = timeText.match(/(\d+)/);
  return match ? Number(match[1]) : fallbackMinutes;
}

function extractTimeLimitFromConditions(conditions, fallbackMinutes = 6) {
  const timeText = conditions.find(text => text.toLowerCase().includes('tiempo límite:'));
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

  const cleanConditions = conditions.filter(
    item => !item.toLowerCase().includes('tiempo límite:')
  );

  state.assigned[state.currentRound] = {
    ...state.assigned[state.currentRound],
    title,
    desc,
    conditions: cleanConditions,
    timeLimit: newTimeLimit,
    timeText: `Tiempo límite: ${newTimeLimit} minuto${newTimeLimit === 1 ? '' : 's'}`
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
  attachEvents();

  const restored = loadState();

  if (restored && state.assigned.length) {
    renderAll();

    if (state.gameOver) {
      const wins = state.results.filter(value => value === 'win').length;
      const loses = state.results.filter(value => value === 'lose').length;

      if (wins >= 2) showVictory();
      else if (loses >= 2) showDefeat();
    } else if (!state.timerInitial) {
      setTimerForCurrentChallenge();
    } else {
      renderTimer();
    }
  } else {
    initNewGame();
  }
}

bootstrap();