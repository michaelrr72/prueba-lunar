const STORAGE_KEY = 'prueba-lunar-state';

const state = {
    assigned: [],
    results: [null, null, null],
    currentRound: 0,
    gameOver: false
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
    btnCloseModal: document.getElementById('btn-close-modal')
};

function getFilteredPool() {
    const type = elements.typeFilter.value;
    return type === 'all' ? POOL : POOL.filter(challenge => challenge.type === type);
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
    if (pool.length === 0) return [];

    const shuffled = shuffleArray(pool);

    if (pool.length >= 3) {
        return shuffled.slice(0, 3);
    }

    const result = [];
    for (let i = 0; i < 3; i++) {
        result.push(shuffled[i % shuffled.length]);
    }
    return result;
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    try {
        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed.assigned) || !Array.isArray(parsed.results)) {
            return false;
        }

        state.assigned = parsed.assigned;
        state.results = parsed.results;
        state.currentRound = parsed.currentRound ?? 0;
        state.gameOver = parsed.gameOver ?? false;

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

function initNewGame() {
    const pool = getFilteredPool();

    if (!pool.length) {
        alert('No hay retos de ese tipo. Prueba con "Todos".');
        return;
    }

    state.assigned = buildAssignedChallenges(pool);
    state.results = [null, null, null];
    state.currentRound = 0;
    state.gameOver = false;

    clearBanner();
    renderAll();
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
    elements.bannerSub.textContent = 'Los sellos lunares no han sido rotos. Las Leyendas de Teyvat han ganado hoy. La Bendición Lunar aguarda a quien tenga el coraje de intentarlo de nuevo.';
    elements.statusLabel.textContent = 'Derrota';
    elements.statusLabel.style.color = 'var(--lose)';
    elements.resultBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function recordResult(result) {
    if (state.gameOver) return;

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
    }

    renderAll();
    saveState();
}

function shuffleCurrentChallenge() {
    if (state.gameOver) return;

    const pool = getFilteredPool();
    if (!pool.length) return;

    const usedTitles = state.assigned.map(challenge => challenge.title);
    const available = pool.filter(challenge => !usedTitles.includes(challenge.title));
    const source = available.length ? available : pool;
    const randomIndex = Math.floor(Math.random() * source.length);

    state.assigned[state.currentRound] = source[randomIndex];

    renderChallenge();
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

function saveModal() {
    const title = elements.modalTitleInput.value.trim();
    const desc = elements.modalDescInput.value.trim();
    const condStr = elements.modalCondsInput.value.trim();

    if (!title) return;

    const conditions = condStr
        ? condStr.split('|').map(item => item.trim()).filter(Boolean)
        : [];

    state.assigned[state.currentRound] = {
        ...state.assigned[state.currentRound],
        title,
        desc,
        conditions
    };

    closeModal();
    renderChallenge();
    saveState();
}

function attachEvents() {
    elements.btnShuffle.addEventListener('click', shuffleCurrentChallenge);
    elements.btnReset.addEventListener('click', initNewGame);
    elements.btnEdit.addEventListener('click', openModal);
    elements.btnWin.addEventListener('click', () => recordResult('win'));
    elements.btnLose.addEventListener('click', () => recordResult('lose'));
    elements.btnSaveModal.addEventListener('click', saveModal);
    elements.btnCloseModal.addEventListener('click', closeModal);

    elements.modalOverlay.addEventListener('click', event => {
        if (event.target === elements.modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    elements.typeFilter.addEventListener('change', () => {
        initNewGame();
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

            if (wins >= 2) {
                showVictory();
            } else if (loses >= 2) {
                showDefeat();
            }
        }
    } else {
        initNewGame();
    }
}

bootstrap();