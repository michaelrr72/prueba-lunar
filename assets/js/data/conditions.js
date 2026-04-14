export {
  SOLO_RULES,
  SUPERVISADO_RULES,
  MEDIUM_CONDITIONS,
  SUPERVISED_MEDIUM_CONDITIONS,
  HARD_CONDITIONS_BY_TYPE,
  SUPERVISED_HARD_CONDITIONS_BY_TYPE,
  TITLE_BY_TYPE,
  areConditionsCompatible,
  pickCompatibleConditions,
  getBossSpecificConditions
} from '../data.js';

export const INDIVIDUAL_CONDITIONS = [
  { id: 'ind-no-skill', text: 'Solo puedes usar ataques normales (sin habilidades E ni Ultimates)' },
  { id: 'ind-no-burst', text: 'No puedes usar tu Ultimate durante el combate' },
  { id: 'ind-one-char', text: 'Solo puedes usar un personaje durante toda la ronda' },
  { id: 'ind-no-heal', text: 'Tus personajes no pueden curar durante el combate' },
  { id: 'ind-no-shield', text: 'Tus personajes no pueden usar escudos' },
  { id: 'ind-no-food', text: 'Sin consumibles de curacion o buff durante el combate' },
  { id: 'ind-no-swap', text: 'No puedes cambiar de personaje una vez iniciado el combate' },
  { id: 'ind-survive-first', text: 'Debes sobrevivir la primera fase del jefe sin perder ningun personaje' },
  { id: 'ind-max-switches', text: 'Maximo 10 cambios de personaje en toda la ronda' },
  { id: 'ind-no-same-element', text: 'Tus personajes del equipo no pueden repetir elemento' },
  { id: 'ind-finish-starter', text: 'Debes terminar el combate con el mismo personaje con el que entraste' },
  { id: 'ind-no-dash', text: 'Sin usar esquiva durante los primeros 30 segundos de combate' }
];