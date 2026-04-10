import { buildChallengeFromBoss as buildLegacyChallengeFromBoss } from '../data.js';
import { getBossPoolForMode } from '../data/modes.js';
import { pickRandom, shuffleArray } from '../core/utils.js';

export function getFilteredBossPool(modeKey, filterValue = 'all') {
  const pool = getBossPoolForMode(modeKey);
  return filterValue === 'all' ? pool : pool.filter(boss => boss.type === filterValue);
}

export function buildAssignedChallenges(pool, modeConfig, roundCount = 3) {
  const fallbackPool = getBossPoolForMode(modeConfig.key);
  const sourcePool = pool.length >= roundCount ? pool : fallbackPool;
  return shuffleArray(sourcePool)
    .slice(0, roundCount)
    .map(boss => buildLegacyChallengeFromBoss(boss, modeConfig));
}

export function buildChallengeFromBoss(boss, modeConfig) {
  return buildLegacyChallengeFromBoss(boss, modeConfig);
}

export function pickBossForReroll(pool, currentBossId) {
  const eligiblePool = pool.filter(boss => boss.id !== Number(currentBossId));
  return pickRandom(eligiblePool.length ? eligiblePool : pool);
}