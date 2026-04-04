const STORAGE_KEY_TOURNAMENT = 'prueba-lunar-torneo';

const state = {
    players: [],
    rounds: []
};

const elements = {
    playerName: document.getElementById('player-name'),
    btnAddPlayer: document.getElementById('btn-add-player'),
    btnClearPlayers: document.getElementById('btn-clear-players'),
    btnGenerateBracket: document.getElementById('btn-generate-bracket'),
    playersList: document.getElementById('players-list'),
    bracketContainer: document.getElementById('bracket-container')
};

function saveState() {
    localStorage.setItem(STORAGE_KEY_TOURNAMENT, JSON.stringify(state));
}

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY_TOURNAMENT);
    if (!raw) return;

    try {
        const parsed = JSON.parse(raw);
        state.players = parsed.players || [];
        state.rounds = parsed.rounds || [];
    } catch {
        state.players = [];
        state.rounds = [];
    }
}

function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function renderPlayers() {
    elements.playersList.innerHTML = '';

    if (!state.players.length) {
        const li = document.createElement('li');
        li.textContent = 'No hay participantes aún.';
        elements.playersList.appendChild(li);
        return;
    }

    state.players.forEach((player, index) => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = player;

        const btn = document.createElement('button');
        btn.className = 'player-remove';
        btn.textContent = '✕';
        btn.addEventListener('click', () => removePlayer(index));

        li.appendChild(span);
        li.appendChild(btn);
        elements.playersList.appendChild(li);
    });
}

function createMatch(player1, player2 = null) {
    return {
        player1,
        player2,
        winner: player2 === null ? player1 : null
    };
}

function generateBracket() {
    if (state.players.length < 2) {
        alert('Necesitas al menos 2 participantes.');
        return;
    }

    const shuffled = shuffleArray(state.players);
    const firstRound = [];

    for (let i = 0; i < shuffled.length; i += 2) {
        const p1 = shuffled[i];
        const p2 = shuffled[i + 1] || null;
        firstRound.push(createMatch(p1, p2));
    }

    state.rounds = [firstRound];
    buildNextRounds();
    saveState();
    renderBracket();
}

function buildNextRounds() {
    let currentRoundIndex = 0;

    while (true) {
        const currentRound = state.rounds[currentRoundIndex];
        if (!currentRound || currentRound.length <= 1) break;

        const nextRoundSize = Math.ceil(currentRound.length / 2);
        const nextRound = [];

        for (let i = 0; i < nextRoundSize; i++) {
            nextRound.push(createMatch(null, null));
        }

        if (!state.rounds[currentRoundIndex + 1]) {
            state.rounds.push(nextRound);
        } else {
            state.rounds[currentRoundIndex + 1] = nextRound;
        }

        currentRoundIndex++;
    }
}

function updateNextRound(roundIndex) {
    const currentRound = state.rounds[roundIndex];
    const nextRound = state.rounds[roundIndex + 1];
    if (!nextRound) return;

    for (let i = 0; i < nextRound.length; i++) {
        const match1 = currentRound[i * 2];
        const match2 = currentRound[i * 2 + 1];

        nextRound[i].player1 = match1?.winner || null;
        nextRound[i].player2 = match2?.winner || null;

        nextRound[i].winner = null;
    }

    updateNextRound(roundIndex + 1);
}

function setWinner(roundIndex, matchIndex, playerSlot) {
    const match = state.rounds[roundIndex][matchIndex];
    const winner = playerSlot === 1 ? match.player1 : match.player2;

    if (!winner) return;

    match.winner = winner;
    updateNextRound(roundIndex);
    saveState();
    renderBracket();
}

function getRoundName(index, total) {
    if (total === 1) return 'Final';
    if (index === total - 1) return 'Final';
    if (index === total - 2) return 'Semifinal';
    if (index === total - 3) return 'Cuartos';
    return `Ronda ${index + 1}`;
}

function renderBracket() {
    elements.bracketContainer.innerHTML = '';

    if (!state.rounds.length) {
        elements.bracketContainer.innerHTML = '<p class="empty-state">Agrega participantes y genera el torneo.</p>';
        return;
    }

    const totalRounds = state.rounds.length;

    state.rounds.forEach((round, roundIndex) => {
        const column = document.createElement('div');
        column.className = 'round-column';

        const title = document.createElement('div');
        title.className = 'round-title';
        title.textContent = getRoundName(roundIndex, totalRounds);

        column.appendChild(title);

        round.forEach((match, matchIndex) => {
            const card = document.createElement('div');
            card.className = 'match-card';

            if (match.winner) {
                card.classList.add('match-complete');
            }

            const player1 = createPlayerRow(match.player1, match.winner === match.player1, roundIndex, matchIndex, 1, !match.player2 && !!match.player1);
            const player2 = createPlayerRow(match.player2, match.winner === match.player2, roundIndex, matchIndex, 2, false);

            card.appendChild(player1);
            if (match.player2 !== null) {
                card.appendChild(player2);
            }

            column.appendChild(card);
        });

        elements.bracketContainer.appendChild(column);
    });

    const finalRound = state.rounds[state.rounds.length - 1];
    const champion = finalRound?.[0]?.winner;

    if (champion) {
        const championBox = document.createElement('div');
        championBox.className = 'champion-box';
        championBox.innerHTML = `
            <div class="champion-crown">♛</div>
            <div class="champion-title">Campeón del Torneo</div>
            <div class="champion-name">${champion}</div>
            `;
        elements.bracketContainer.appendChild(championBox);
    }
}

function createPlayerRow(name, isWinner, roundIndex, matchIndex, slot, isBye = false) {
    const row = document.createElement('div');
    row.className = 'match-player';

    if (isWinner) row.classList.add('winner');
    if (isBye) row.classList.add('bye');

    const span = document.createElement('span');
    span.className = 'match-name';
    span.textContent = name || 'Pendiente';

    row.appendChild(span);
    if (!name) {
        span.classList.add('pending');
    }

    if (name && !isBye) {
        const btn = document.createElement('button');
        btn.className = 'match-btn';
        btn.textContent = 'Gana';
        btn.addEventListener('click', () => setWinner(roundIndex, matchIndex, slot));
        row.appendChild(btn);
    } else if (isBye) {
        const byeText = document.createElement('span');
        byeText.className = 'match-name';
        byeText.textContent = 'Pasa libre';
        row.appendChild(byeText);
    }

    return row;
}

function addPlayer() {
    const name = elements.playerName.value.trim();
    if (!name) return;
    if (state.players.includes(name)) {
        alert('Ese participante ya existe.');
        return;
    }

    state.players.push(name);
    elements.playerName.value = '';
    saveState();
    renderPlayers();
}

function removePlayer(index) {
    state.players.splice(index, 1);
    state.rounds = [];
    saveState();
    renderPlayers();
    renderBracket();
}

function clearPlayers() {
    state.players = [];
    state.rounds = [];
    saveState();
    renderPlayers();
    renderBracket();
}

function attachEvents() {
    elements.btnAddPlayer.addEventListener('click', addPlayer);
    elements.btnClearPlayers.addEventListener('click', clearPlayers);
    elements.btnGenerateBracket.addEventListener('click', generateBracket);

    elements.playerName.addEventListener('keydown', event => {
        if (event.key === 'Enter') addPlayer();
    });
}

function bootstrap() {
    loadState();
    attachEvents();
    renderPlayers();
    renderBracket();
}

bootstrap();