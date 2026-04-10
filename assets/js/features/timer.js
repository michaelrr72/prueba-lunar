export function createTimerController({
  onTick,
  onStateChange,
  onFinish,
  onMilestone
} = {}) {
  let intervalId = null;
  let remaining = 0;
  let initial = 0;
  let running = false;
  const announcedMilestones = new Set();

  function emitTick() {
    onTick?.(remaining, initial);
  }

  function emitState() {
    onStateChange?.(running);
  }

  function stopInterval() {
    if (intervalId) {
      globalThis.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function pause() {
    stopInterval();
    running = false;
    emitState();
  }

  function announceMilestones() {
    const secondsLeft = Math.ceil(remaining / 10);
    const milestones = [60, 30, 10];

    milestones.forEach(value => {
      if (secondsLeft === value && !announcedMilestones.has(value)) {
        announcedMilestones.add(value);
        onMilestone?.(value);
      }
    });
  }

  function start() {
    if (running || remaining <= 0) return;

    running = true;
    emitState();

    intervalId = globalThis.setInterval(() => {
      remaining = Math.max(remaining - 1, 0);
      announceMilestones();
      emitTick();

      if (remaining <= 0) {
        pause();
        onFinish?.();
      }
    }, 100);
  }

  function toggle() {
    if (running) {
      pause();
      return;
    }

    start();
  }

  function resetForMinutes(minutes) {
    initial = Math.max(Number(minutes) || 0, 0) * 600;
    remaining = initial;
    announcedMilestones.clear();
    pause();
    emitTick();
  }

  function restore({ remainingTenths = 0, initialTenths = 0 } = {}) {
    remaining = Math.max(Number(remainingTenths) || 0, 0);
    initial = Math.max(Number(initialTenths) || 0, 0);
    announcedMilestones.clear();
    pause();
    emitTick();
  }

  function getSnapshot() {
    return {
      remaining,
      initial,
      running
    };
  }

  return {
    start,
    pause,
    toggle,
    resetForMinutes,
    restore,
    getSnapshot,
    isRunning: () => running
  };
}