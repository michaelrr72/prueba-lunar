import { MODE_CONFIGS, getModeConfig as getLegacyModeConfig, getBossPoolForMode as getLegacyBossPoolForMode } from '../data.js';

export const APP_VERSION = 'v4.1.0';
export const APP_VERSION_LABEL = `Prueba Lunar ${APP_VERSION}`;
export const TOURNAMENT_STORAGE_KEY = `prueba-lunar-torneo-${APP_VERSION}`;

const MODE_STORAGE_KEYS = {
  solo: `prueba-lunar-state-${APP_VERSION}-solo`,
  supervisado: `prueba-lunar-state-${APP_VERSION}-supervisado`
};

export function getModeConfig(modeKey) {
  const legacyConfig = getLegacyModeConfig(modeKey);

  return {
    ...legacyConfig,
    storageKey: MODE_STORAGE_KEYS[legacyConfig.key] || legacyConfig.storageKey,
    versionLabel: `${APP_VERSION_LABEL} · ${legacyConfig.label}`
  };
}

export function getBossPoolForMode(modeKey) {
  return getLegacyBossPoolForMode(modeKey);
}

export { MODE_CONFIGS };