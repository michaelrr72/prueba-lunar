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
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderPlayers() {
  elements.playersList.innerHTML = '';

  if (!state.players.length) {
    const li = document.createElement('li');
    li.textContent = 'No hay participantes aun.';
    elements.playersList.appendChild(li);
    return;
  }

  state.players.forEach((player, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = player;

    const btn = document.createElement('button');
    btn.className = 'player-remove';
    btn.textContent = '\u2715';
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
    player1Result: null,
    player2Result: null,
    completed: false
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
  saveState();
  renderBracket();
}

function isMatchComplete(match) {
  if (!match.player1 && !match.player2) return true;
  if (match.player2 === null) return match.player1Result !== null;
  return match.player1Result !== null && match.player2Result !== null;
}

function getMatchSurvivors(match) {
  const survivors = [];
  if (match.player1 && match.player1Result === 'pass') survivors.push(match.player1);
  if (match.player2 && match.player2Result === 'pass') survivors.push(match.player2);
  return survivors;
}

function buildNextRoundFromRound(roundIndex) {
  const currentRound = state.rounds[roundIndex];
  if (!currentRound || !currentRound.every(isMatchComplete)) return;

  const survivors = currentRound.flatMap(getMatchSurvivors);
  state.rounds = state.rounds.slice(0, roundIndex + 1);

  if (survivors.length < 2) return;

  const nextRound = [];
  for (let i = 0; i < survivors.length; i += 2) {
    nextRound.push(createMatch(survivors[i], survivors[i + 1] || null));
  }

  state.rounds.push(nextRound);
}

function getChampion() {
  const finalRound = state.rounds[state.rounds.length - 1];
  if (!finalRound || !finalRound.every(isMatchComplete)) return null;

  const survivors = finalRound.flatMap(getMatchSurvivors);
  return survivors.length === 1 ? survivors[0] : null;
}

function recordResult(roundIndex, matchIndex, slot, passed) {
  const match = state.rounds[roundIndex][matchIndex];
  if (match.completed) return;

  if (slot === 1) {
    match.player1Result = passed ? 'pass' : 'fail';
  } else {
    match.player2Result = passed ? 'pass' : 'fail';
  }

  if (isMatchComplete(match)) {
    match.completed = true;
    buildNextRoundFromRound(roundIndex);
  }

  saveState();
  renderBracket();
}

function disqualifyBoth(roundIndex, matchIndex) {
  const match = state.rounds[roundIndex][matchIndex];
  if (match.completed) return;

  match.player1Result = 'fail';
  match.player2Result = 'fail';
  match.completed = true;

  buildNextRoundFromRound(roundIndex);
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

      if (match.completed) {
        card.classList.add('match-complete');
      }

      const player1 = createPlayerRow(match.player1, roundIndex, matchIndex, 1, !match.player2 && !!match.player1, match.player1Result);
      const player2 = createPlayerRow(match.player2, roundIndex, matchIndex, 2, false, match.player2Result);

      card.appendChild(player1);
      if (match.player2 !== null) {
        card.appendChild(player2);
      }

      if (match.player1 && match.player2 && !match.completed) {
        const bothDisq = document.createElement('div');
        bothDisq.className = 'match-actions match-actions-all';

        const bothBtn = document.createElement('button');
        bothBtn.className = 'match-btn match-btn-dq';
        bothBtn.textContent = 'Ambos fallan';
        bothBtn.addEventListener('click', () => disqualifyBoth(roundIndex, matchIndex));

        bothDisq.appendChild(bothBtn);
        card.appendChild(bothDisq);
      }

      column.appendChild(card);
    });

    elements.bracketContainer.appendChild(column);
  });

  const finalRound = state.rounds[state.rounds.length - 1];
  const champion = getChampion();
  const finalRoundComplete = finalRound?.every(isMatchComplete);

  if (champion) {
    const championBox = document.createElement('div');
    championBox.className = 'champion-box';
    championBox.innerHTML = `
      <div class="champion-crown">\u265B</div>
      <div class="champion-title">Campeon del Torneo</div>
      <div class="champion-name">${champion}</div>
    `;
    elements.bracketContainer.appendChild(championBox);
  } else if (finalRoundComplete) {
    const championBox = document.createElement('div');
    championBox.className = 'champion-box';
    championBox.innerHTML = `
      <div class="champion-crown">\u2716</div>
      <div class="champion-title">Torneo sin campeon</div>
      <div class="champion-name">Nadie avanzo</div>
    `;
    elements.bracketContainer.appendChild(championBox);
  }
}

function createPlayerRow(name, roundIndex, matchIndex, slot, isBye = false, result = null) {
  const row = document.createElement('div');
  row.className = 'match-player';
  if (isBye) row.classList.add('bye');

  const span = document.createElement('span');
  span.className = 'match-name';
  span.textContent = name || 'Pendiente';
  row.appendChild(span);

  if (!name) {
    span.classList.add('pending');
  }

  if (name) {
    const actions = document.createElement('div');
    actions.className = 'match-actions';

    if (!result) {
      const passBtn = document.createElement('button');
      passBtn.className = 'match-btn';
      passBtn.textContent = 'Pasa';
      passBtn.addEventListener('click', () => recordResult(roundIndex, matchIndex, slot, true));
      actions.appendChild(passBtn);

      const failBtn = document.createElement('button');
      failBtn.className = 'match-btn match-btn-dq';
      failBtn.textContent = 'Falla';
      failBtn.addEventListener('click', () => recordResult(roundIndex, matchIndex, slot, false));
      actions.appendChild(failBtn);
    } else {
      const status = document.createElement('span');
      status.className = 'match-status';
      status.textContent = isBye
        ? (result === 'pass' ? 'Pasa (bye)' : 'Falla (bye)')
        : (result === 'pass' ? 'Pasa' : 'Falla');

      if (result === 'pass') {
        status.style.color = '#7ed7a6';
      }

      actions.appendChild(status);
    }

    row.appendChild(actions);
  }

  return row;
}

function addPlayer() {
  const text = elements.playerName.value.trim();
  if (!text) return;

  const names = text.split('\n').map(name => name.trim()).filter(Boolean);
  if (!names.length) return;

  let added = 0;
  const duplicates = [];

  names.forEach(name => {
    if (state.players.includes(name)) {
      duplicates.push(name);
    } else {
      state.players.push(name);
      added += 1;
    }
  });

  if (duplicates.length) {
    alert(`Algunos nombres ya existen: ${duplicates.join(', ')}`);
  }

  if (added > 0) {
    elements.playerName.value = '';
    saveState();
    renderPlayers();
  }
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
    if (event.key === 'Enter' && event.ctrlKey) addPlayer();
  });
}

function bootstrap() {
  loadState();
  attachEvents();
  renderPlayers();
  renderBracket();
}

bootstrap();
