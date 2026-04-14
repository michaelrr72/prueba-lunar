import { createStorage } from '../core/storage.js';
import { createLiveAnnouncer, isTypingTarget, normalizeName, pickRandom, shuffleArray } from '../core/utils.js';
import { APP_VERSION_LABEL, TOURNAMENT_STORAGE_KEY } from '../data/modes.js';
import { BOSS_POOL } from '../data/bosses.js';

function createInitialState() {
  return {
    players: [],
    rounds: [],
    wonChallenges: {}
  };
}

function createMatch(player1, player2 = null) {
  return {
    player1,
    player2,
    player1Result: null,
    player2Result: null,
    completed: false,
    currentBoss: null
  };
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

function getRoundName(index, total) {
  if (total === 1 || index === total - 1) return 'Final';
  if (index === total - 2) return 'Semifinal';
  if (index === total - 3) return 'Cuartos';
  return `Ronda ${index + 1}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function createTournamentApp() {
  const elements = {
    playerName: document.getElementById('player-name'),
    btnAddPlayer: document.getElementById('btn-add-player'),
    btnClearPlayers: document.getElementById('btn-clear-players'),
    btnGenerateBracket: document.getElementById('btn-generate-bracket'),
    playersList: document.getElementById('players-list'),
    bracketContainer: document.getElementById('bracket-container'),
    participantCount: document.getElementById('participant-count'),
    tournamentStatus: document.getElementById('tournament-status'),
    footerVersion: document.getElementById('footer-version'),
    liveRegion: document.getElementById('tournament-live-region')
  };

  const storage = createStorage(TOURNAMENT_STORAGE_KEY);
  const announce = createLiveAnnouncer(elements.liveRegion);
  const state = {
    ...createInitialState(),
    ...storage.load(createInitialState())
  };

  function saveState() {
    storage.save(state);
  }

  function getChampion() {
    const finalRound = state.rounds[state.rounds.length - 1];
    if (!finalRound || !finalRound.every(isMatchComplete)) return null;

    const survivors = finalRound.flatMap(getMatchSurvivors);
    return survivors.length === 1 ? survivors[0] : null;
  }

  function getVictoriesByPlayer() {
    const victories = Object.fromEntries(state.players.map(player => [player, 0]));

    state.rounds.forEach(round => {
      round.forEach(match => {
        if (match.player1 && match.player1Result === 'pass') {
          victories[match.player1] = (victories[match.player1] || 0) + 1;
        }

        if (match.player2 && match.player2Result === 'pass') {
          victories[match.player2] = (victories[match.player2] || 0) + 1;
        }
      });
    });

    return Object.entries(victories)
      .map(([player, wins]) => ({ player, wins }))
      .sort((left, right) => right.wins - left.wins || left.player.localeCompare(right.player, 'es'));
  }

  function getWinnerChallenges(champion) {
    if (!champion) return [];
    return state.wonChallenges?.[champion] ?? [];
  }

  function assignBossToMatch(roundIndex, matchIndex) {
    const match = state.rounds[roundIndex]?.[matchIndex];
    if (!match || match.completed) return;
    match.currentBoss = pickRandom(BOSS_POOL);
    saveState();
    renderBracket();
    announce(`Jefe asignado: ${match.currentBoss.name}`);
  }

  function restartTournament() {
    if (state.players.length < 2) {
      state.rounds = [];
      state.wonChallenges = {};
      saveState();
      renderBracket();
      announce('No hay participantes suficientes para reiniciar el torneo.');
      return;
    }

    state.wonChallenges = {};
    console.log('[torneo] Estado tras reset de wonChallenges:', JSON.parse(JSON.stringify(state)));
    generateBracket();
    announce('El torneo se reinició con los mismos participantes.');
  }

  function exportWinnerCard(champion) {
    if (!champion) return;

    const payload = {
      winner: champion,
      victories: getVictoriesByPlayer(),
      completedChallenges: getWinnerChallenges(champion),
      exportedAt: new Date().toISOString()
    };

    globalThis.dispatchEvent(new CustomEvent('prueba-lunar:export-winner-card', {
      detail: payload
    }));

    globalThis.alert('La exportación de ficha se habilita en el Punto 6.');
  }

  function createFinalSummaryPanel(champion, finalRoundComplete) {
    if (!finalRoundComplete) return null;

    const summary = document.createElement('section');
    summary.className = 'tournament-summary-box';

    const safeChampion = champion ? escapeHtml(champion) : 'Sin campeón';
    const winnerChallenges = getWinnerChallenges(champion);
    const diffMap = { extremo: 'diff-extremo', dificil: 'diff-dificil', medio: 'diff-medio' };
    const challengeItems = winnerChallenges.length
      ? winnerChallenges.map(boss => {
          if (!boss) return '<li>Enfrentamiento sin jefe registrado</li>';
          const diffClass = boss.difficulty ? (diffMap[boss.difficulty] ?? '') : '';
          const diffBadge = boss.difficulty ? ` <span class="diff-badge ${diffClass}">${escapeHtml(boss.difficulty)}</span>` : '';
          return `<li><span class="match-boss-icon">${escapeHtml(String(boss.icon ?? '\u2694\ufe0f'))}</span> ${escapeHtml(boss.name)}${diffBadge}</li>`;
        }).join('')
      : '<li>No hay retos registrados para el ganador.</li>';

    const victoryRows = getVictoriesByPlayer()
      .map(item => `<li><span>${escapeHtml(item.player)}</span><strong>${item.wins} victoria${item.wins === 1 ? '' : 's'}</strong></li>`)
      .join('');

    summary.innerHTML = `
      <div class="tournament-summary-head">
        <p class="panel-kicker">Resumen final</p>
        <h3 class="champion-title">Resultado del torneo</h3>
        <div class="champion-name">${safeChampion}</div>
      </div>

      <div class="tournament-summary-grid">
        <div class="tournament-summary-card">
          <p class="round-title">Victorias totales</p>
          <ul class="tournament-summary-list">${victoryRows}</ul>
        </div>
        <div class="tournament-summary-card">
          <p class="round-title">Retos superados por el ganador</p>
          <ul class="tournament-summary-list">${challengeItems}</ul>
        </div>
      </div>

      <div class="tournament-summary-actions">
        <button class="btn btn-ghost" type="button" id="btn-restart-tournament">Reiniciar torneo</button>
        <button class="btn btn-gold" type="button" id="btn-export-winner-card" ${champion ? '' : 'disabled'}>Exportar ficha del ganador</button>
      </div>
    `;

    summary.querySelector('#btn-restart-tournament')?.addEventListener('click', restartTournament);
    summary.querySelector('#btn-export-winner-card')?.addEventListener('click', () => exportWinnerCard(champion));
    return summary;
  }

  function renderMeta() {
    if (elements.participantCount) {
      const label = `${state.players.length} participante${state.players.length === 1 ? '' : 's'}`;
      elements.participantCount.textContent = label;
    }

    if (elements.footerVersion) {
      elements.footerVersion.textContent = `${APP_VERSION_LABEL} · Módulo de torneo`;
    }

    if (elements.tournamentStatus) {
      const champion = getChampion();
      if (champion) {
        elements.tournamentStatus.textContent = `Campeón actual: ${champion}`;
      } else if (state.rounds.length) {
        elements.tournamentStatus.textContent = `Bracket generado · ${state.rounds.length} ronda${state.rounds.length === 1 ? '' : 's'}`;
      } else {
        elements.tournamentStatus.textContent = 'Agrega participantes y genera el bracket.';
      }
    }
  }

  function renderPlayers() {
    elements.playersList.innerHTML = '';

    if (!state.players.length) {
      const li = document.createElement('li');
      li.textContent = 'No hay participantes aún.';
      elements.playersList.appendChild(li);
      renderMeta();
      return;
    }

    state.players.forEach((player, index) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = player;

      const btn = document.createElement('button');
      btn.className = 'player-remove';
      btn.type = 'button';
      btn.textContent = '✕';
      btn.setAttribute('aria-label', `Eliminar a ${player}`);
      btn.addEventListener('click', () => removePlayer(index));

      li.append(span, btn);
      elements.playersList.appendChild(li);
    });

    renderMeta();
  }

  function buildNextRoundFromRound(roundIndex) {
    const currentRound = state.rounds[roundIndex];
    if (!currentRound || !currentRound.every(isMatchComplete)) return;

    const survivors = currentRound.flatMap(getMatchSurvivors);
    state.rounds = state.rounds.slice(0, roundIndex + 1);

    if (survivors.length < 2) return;

    const nextRound = [];
    for (let index = 0; index < survivors.length; index += 2) {
      nextRound.push(createMatch(survivors[index], survivors[index + 1] || null));
    }

    state.rounds.push(nextRound);

    const nextRoundIndex = roundIndex + 1;
    if (state.rounds[nextRoundIndex]?.every(isMatchComplete)) {
      buildNextRoundFromRound(nextRoundIndex);
    }
  }

  function renderBracket() {
    elements.bracketContainer.innerHTML = '';

    if (!state.rounds.length) {
      elements.bracketContainer.innerHTML = '<p class="empty-state">Agrega participantes y genera el torneo.</p>';
      renderMeta();
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

        card.appendChild(createPlayerRow(match.player1, roundIndex, matchIndex, 1, !match.player2 && !!match.player1, match.player1Result));

        if (match.player2 !== null) {
          card.appendChild(createPlayerRow(match.player2, roundIndex, matchIndex, 2, false, match.player2Result));
        }

        if (match.player1 && match.player2) {
          const bossSection = document.createElement('div');
          bossSection.className = 'match-boss-section';

          if (match.currentBoss) {
            const diffMap = { extremo: 'diff-extremo', dificil: 'diff-dificil', medio: 'diff-medio' };
            const diffClass = diffMap[match.currentBoss.difficulty] ?? '';
            bossSection.innerHTML = `<span class="match-boss-icon">${escapeHtml(String(match.currentBoss.icon ?? '\u2694\ufe0f'))}</span> <span class="match-boss-name">${escapeHtml(match.currentBoss.name)}</span> <span class="diff-badge ${diffClass}">${escapeHtml(match.currentBoss.difficulty)}</span>`;
          } else if (!match.completed) {
            const rollBtn = document.createElement('button');
            rollBtn.className = 'match-btn';
            rollBtn.type = 'button';
            rollBtn.textContent = 'Sortear jefe';
            rollBtn.addEventListener('click', () => assignBossToMatch(roundIndex, matchIndex));
            bossSection.appendChild(rollBtn);
          }

          card.appendChild(bossSection);

          if (!match.completed) {
            const wrapper = document.createElement('div');
            wrapper.className = 'match-actions match-actions-all';

            const bothBtn = document.createElement('button');
            bothBtn.className = 'match-btn match-btn-dq';
            bothBtn.type = 'button';
            bothBtn.textContent = 'Ambos fallan';
            bothBtn.addEventListener('click', () => disqualifyBoth(roundIndex, matchIndex));

            wrapper.appendChild(bothBtn);
            card.appendChild(wrapper);
          }
        }

        column.appendChild(card);
      });

      elements.bracketContainer.appendChild(column);
    });

    const champion = getChampion();
    const finalRound = state.rounds[state.rounds.length - 1];
    const finalRoundComplete = finalRound?.every(isMatchComplete);

    if (champion) {
      const championBox = document.createElement('div');
      championBox.className = 'champion-box';
      championBox.innerHTML = `
        <div class="champion-crown">♛</div>
        <div class="champion-title">Campeón del Torneo</div>
        <div class="champion-name">${champion}</div>
      `;
      elements.bracketContainer.appendChild(championBox);
    } else if (finalRoundComplete) {
      const championBox = document.createElement('div');
      championBox.className = 'champion-box';
      championBox.innerHTML = `
        <div class="champion-crown">✕</div>
        <div class="champion-title">Torneo sin campeón</div>
        <div class="champion-name">Nadie avanzó</div>
      `;
      elements.bracketContainer.appendChild(championBox);
    }

    const summaryPanel = createFinalSummaryPanel(champion, finalRoundComplete);
    if (summaryPanel) {
      elements.bracketContainer.appendChild(summaryPanel);
    }

    renderMeta();
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
      return row;
    }

    const actions = document.createElement('div');
    actions.className = 'match-actions';

    if (!result) {
      const passBtn = document.createElement('button');
      passBtn.className = 'match-btn';
      passBtn.type = 'button';
      passBtn.textContent = 'Pasa';
      passBtn.addEventListener('click', () => recordResult(roundIndex, matchIndex, slot, true));

      const failBtn = document.createElement('button');
      failBtn.className = 'match-btn match-btn-dq';
      failBtn.type = 'button';
      failBtn.textContent = 'Falla';
      failBtn.addEventListener('click', () => recordResult(roundIndex, matchIndex, slot, false));

      actions.append(passBtn, failBtn);
    } else {
      const status = document.createElement('span');
      status.className = 'match-status';
      status.textContent = isBye && result === 'pass'
        ? 'Pasa (impar)'
        : (result === 'pass' ? 'Pasa' : 'Falla');
      actions.appendChild(status);
    }

    row.appendChild(actions);
    return row;
  }

  function generateBracket() {
    if (state.players.length < 2) {
      globalThis.alert('Necesitas al menos 2 participantes.');
      return;
    }

    const shuffledPlayers = shuffleArray(state.players);
    const firstRound = [];

    for (let index = 0; index < shuffledPlayers.length; index += 2) {
      const player1 = shuffledPlayers[index];
      const player2 = shuffledPlayers[index + 1] || null;
      firstRound.push(createMatch(player1, player2));
    }

    state.rounds = [firstRound];
    buildNextRoundFromRound(0);
    saveState();
    renderBracket();
    announce('Bracket generado correctamente.');
  }

  function recordResult(roundIndex, matchIndex, slot, passed) {
    const match = state.rounds[roundIndex]?.[matchIndex];
    if (!match || match.completed) return;

    const winnerName = slot === 1 ? match.player1 : match.player2;

    if (slot === 1) {
      match.player1Result = passed ? 'pass' : 'fail';
    } else {
      match.player2Result = passed ? 'pass' : 'fail';
    }

    if (passed && winnerName) {
      if (!state.wonChallenges) state.wonChallenges = {};
      if (!Array.isArray(state.wonChallenges[winnerName])) {
        state.wonChallenges[winnerName] = [];
      }
      state.wonChallenges[winnerName].push(
        match.currentBoss ?? { name: 'Sin reto asignado', difficulty: null, icon: '—' }
      );
    }

    if (isMatchComplete(match)) {
      match.completed = true;
      buildNextRoundFromRound(roundIndex);
    }

    saveState();
    renderBracket();

    const champion = getChampion();
    if (champion) {
      announce(`El campeón del torneo es ${champion}.`);
    }
  }

  function disqualifyBoth(roundIndex, matchIndex) {
    const match = state.rounds[roundIndex]?.[matchIndex];
    if (!match || match.completed) return;

    match.player1Result = 'fail';
    match.player2Result = 'fail';
    match.completed = true;

    buildNextRoundFromRound(roundIndex);
    saveState();
    renderBracket();
    announce('Ambos participantes quedaron descalificados en este cruce.');
  }

  function addPlayer() {
    const rawValue = elements.playerName.value.trim();
    if (!rawValue) return;

    const existing = new Set(state.players.map(player => player.toLowerCase()));
    const duplicates = [];
    let added = 0;

    rawValue
      .split('\n')
      .map(normalizeName)
      .filter(Boolean)
      .forEach(name => {
        const key = name.toLowerCase();
        if (existing.has(key)) {
          duplicates.push(name);
          return;
        }

        existing.add(key);
        state.players.push(name);
        added += 1;
      });

    if (duplicates.length) {
      globalThis.alert(`Estos nombres ya estaban registrados: ${duplicates.join(', ')}`);
    }

    if (added > 0) {
      elements.playerName.value = '';
      state.rounds = [];
      saveState();
      renderPlayers();
      renderBracket();
      announce(`Se agregaron ${added} participante${added === 1 ? '' : 's'} al torneo.`);
    }
  }

  function removePlayer(index) {
    const [removedPlayer] = state.players.splice(index, 1);
    state.rounds = [];
    saveState();
    renderPlayers();
    renderBracket();

    if (removedPlayer) {
      announce(`${removedPlayer} fue retirado del torneo.`);
    }
  }

  function clearPlayers() {
    state.players = [];
    state.rounds = [];
    saveState();
    renderPlayers();
    renderBracket();
    announce('La lista de participantes fue reiniciada.');
  }

  function attachEvents() {
    elements.btnAddPlayer?.addEventListener('click', addPlayer);
    elements.btnClearPlayers?.addEventListener('click', clearPlayers);
    elements.btnGenerateBracket?.addEventListener('click', generateBracket);

    elements.playerName?.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        addPlayer();
      }
    });

    document.addEventListener('keydown', event => {
      if (isTypingTarget(document.activeElement)) return;

      if (event.key.toLowerCase() === 'g') {
        event.preventDefault();
        generateBracket();
      }
    });
  }

  attachEvents();
  renderPlayers();
  renderBracket();
}