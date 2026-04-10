import { pickBossForReroll } from './challenge-generator.js';

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

export function createRouletteController({ wheel, status, announce } = {}) {
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