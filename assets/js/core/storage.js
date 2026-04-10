export function createStorage(storageKey) {
  return {
    load(fallbackValue) {
      try {
        const raw = globalThis.localStorage?.getItem(storageKey);
        if (!raw) return fallbackValue;
        return JSON.parse(raw);
      } catch {
        return fallbackValue;
      }
    },

    save(value) {
      try {
        globalThis.localStorage?.setItem(storageKey, JSON.stringify(value));
      } catch {
        // Ignorar errores de persistencia para no romper la experiencia en vivo.
      }
    },

    clear() {
      try {
        globalThis.localStorage?.removeItem(storageKey);
      } catch {
        // Sin acción adicional.
      }
    }
  };
}