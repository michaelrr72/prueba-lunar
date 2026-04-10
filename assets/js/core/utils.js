export function pickRandom(items) {
  if (!Array.isArray(items) || !items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffleArray(items) {
  const copy = Array.isArray(items) ? [...items] : [];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }

  return copy;
}

export function formatTimerMarkup(totalTenths) {
  const safeTime = Math.max(Number(totalTenths) || 0, 0);
  const minutes = Math.floor(safeTime / 600);
  const seconds = Math.floor((safeTime % 600) / 10);
  const tenths = safeTime % 10;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}<small>.${tenths}</small>`;
}

export function formatMinutesLabel(minutes) {
  return `${minutes} minuto${minutes === 1 ? '' : 's'}`;
}

export function isTypingTarget(target) {
  if (!target) return false;
  const tagName = target.tagName?.toLowerCase();
  return ['input', 'textarea', 'select', 'button'].includes(tagName) || target.isContentEditable;
}

export function normalizeName(value) {
  return String(value || '').trim().replaceAll(/\s+/g, ' ');
}

export function createLiveAnnouncer(element) {
  if (!element) {
    return () => {};
  }

  return message => {
    element.textContent = '';
    globalThis.requestAnimationFrame(() => {
      element.textContent = message;
    });
  };
}