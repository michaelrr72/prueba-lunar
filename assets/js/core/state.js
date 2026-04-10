export const ROUND_COUNT = 3;
export const DEFAULT_RESULTS = Array.from({ length: ROUND_COUNT }, () => null);

export function createDefaultGameState() {
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

export function hydrateGameState(snapshot) {
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

export function serializeGameState(state) {
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

export function getScore(results) {
  const wins = results.filter(result => result === 'win').length;
  const losses = results.filter(result => result === 'lose').length;
  return { wins, losses };
}