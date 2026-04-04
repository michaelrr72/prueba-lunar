const BASE_BOSS_POOL = [
  {
    id: 1,
    name: 'Vivianne del Lago',
    enemyIcon: '\ud83d\udca7',
    region: 'Fontaine - Leyenda Local',
    type: 'pressure',
    difficulty: 'extreme',
    diffClass: 'diff-extremo',
    diffLabel: 'EXTREMO',
    tag: 'Combate',
    tagClass: 'tag-combat',
    baseDesc: 'Derrota a Vivianne del Lago. Sus ataques tienen altisimo daño y castigan mucho los errores de posicion.',
    baseTip: 'Hydro no funciona bien contra ella. Dendro o Pyro suelen rendir mejor.',
    defaultTimeLimit: 8
  },
  {
    id: 2,
    name: 'Rocky Avildsen',
    enemyIcon: '\ud83e\udd4a',
    region: 'Fontaine - Leyenda Local',
    type: 'pressure',
    difficulty: 'extreme',
    diffClass: 'diff-extremo',
    diffLabel: 'EXTREMO',
    tag: 'Combate',
    tagClass: 'tag-combat',
    baseDesc: 'Derrota a Rocky Avildsen. Su fase de furia aumenta mucho la presion y castiga errores de lectura.',
    baseTip: 'En fase de furia es mejor priorizar supervivencia antes que greed de daño.',
    defaultTimeLimit: 7
  },
  {
    id: 3,
    name: 'Liam, el Arcoiris Fugaz',
    enemyIcon: '\ud83c\udfb8',
    region: 'Fontaine - Leyenda Local',
    type: 'pressure',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Combate',
    tagClass: 'tag-combat',
    baseDesc: 'Derrota a Liam mientras controlas sus zonas peligrosas y su movilidad constante.',
    baseTip: 'Si el suelo se vuelve peligroso, reposicionate rapido y evita quedarte encerrado.',
    defaultTimeLimit: 6
  },
  {
    id: 4,
    name: 'Ninianne del Lago',
    enemyIcon: '\ud83c\udf0a',
    region: 'Fontaine - Leyenda Local',
    type: 'pressure',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Combate',
    tagClass: 'tag-combat',
    baseDesc: 'Derrota a Ninianne del Lago. Menos opresiva que Vivianne, pero igual exige control y constancia.',
    baseTip: 'Manten presion constante y evita regalar daño innecesario.',
    defaultTimeLimit: 6
  },
  {
    id: 5,
    name: 'Yseut',
    enemyIcon: '\u2744\ufe0f',
    region: 'Fontaine - Leyenda Local',
    type: 'technical',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Tecnico',
    tagClass: 'tag-nohit',
    baseDesc: 'Derrota a Yseut controlando bien los errores, porque castiga mucho las fallas de ejecucion.',
    baseTip: 'Es un buen jefe para premiar lectura de patrones y disciplina.',
    defaultTimeLimit: 5
  },
  {
    id: 6,
    name: 'Deianeira of Snezhevna',
    enemyIcon: '\ud83c\udf2a\ufe0f',
    region: 'Fontaine - Leyenda Local',
    type: 'technical',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Tecnico',
    tagClass: 'tag-nohit',
    baseDesc: 'Derrota a Deianeira manteniendo control del combate y evitando errores acumulativos.',
    baseTip: 'No es solo daño: la constancia importa mucho.',
    defaultTimeLimit: 5
  },
  {
    id: 7,
    name: 'Rilai',
    enemyIcon: '\ud83c\udfb5',
    region: 'Natlan - Leyenda Local',
    type: 'technical',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Tecnico',
    tagClass: 'tag-nohit',
    baseDesc: 'Derrota a Rilai superando correctamente sus patrones mas peligrosos.',
    baseTip: 'Este jefe luce mucho mejor cuando el reto exige ejecucion limpia.',
    defaultTimeLimit: 6
  },
  {
    id: 8,
    name: 'Automated Supercomputing Field Generator',
    enemyIcon: '\u2699\ufe0f',
    region: 'Fontaine - Leyenda Local',
    type: 'technical',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Mecanica',
    tagClass: 'tag-speedrun',
    baseDesc: 'Derrota al Field Generator controlando bien su mecanica especial y las ondas del combate.',
    baseTip: 'Aqui la lectura visual del patron importa muchisimo.',
    defaultTimeLimit: 6
  },
  {
    id: 9,
    name: 'Chassanion',
    enemyIcon: '\ud83e\udea7',
    region: 'Fontaine - Leyenda Local',
    type: 'gimmick',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Mecanica',
    tagClass: 'tag-speedrun',
    baseDesc: 'Derrota a Chassanion gestionando correctamente su gimmick principal.',
    baseTip: 'No todo es DPS: aqui conviene entender la mecanica.',
    defaultTimeLimit: 5
  },
  {
    id: 10,
    name: 'Cineas',
    enemyIcon: '\ud83d\udd37',
    region: 'Sea of Bygone Eras - Leyenda Local',
    type: 'gimmick',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Mecanica',
    tagClass: 'tag-speedrun',
    baseDesc: 'Derrota a Cineas manejando bien el ritmo del combate y su fase especial.',
    baseTip: 'Gestiona bien tus recursos y evita perder control del tempo.',
    defaultTimeLimit: 6
  },
  {
    id: 11,
    name: 'Cocijo',
    enemyIcon: '\u26a1',
    region: 'Natlan - Leyenda Local',
    type: 'gimmick',
    difficulty: 'extreme',
    diffClass: 'diff-extremo',
    diffLabel: 'EXTREMO',
    tag: 'Mecanica',
    tagClass: 'tag-restriction',
    baseDesc: 'Derrota a Cocijo antes de que el combate se descontrole con su mecanica mas peligrosa.',
    baseTip: 'Es un jefe ideal para retos de presion y ejecucion temprana.',
    defaultTimeLimit: 5
  },
  {
    id: 12,
    name: 'The Peak',
    enemyIcon: '\ud83d\udc02',
    region: 'Natlan - Leyenda Local',
    type: 'gimmick',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Mecanica',
    tagClass: 'tag-restriction',
    baseDesc: 'Derrota a The Peak controlando bien su fase potenciada.',
    baseTip: 'Si dejas que imponga su ritmo, el reto se complica mucho.',
    defaultTimeLimit: 6
  },
  {
    id: 13,
    name: 'Sappho Amidst the Waves',
    enemyIcon: '\ud83c\udf0a',
    region: 'Fontaine - Leyenda Local',
    type: 'technical',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Tecnico',
    tagClass: 'tag-nohit',
    baseDesc: 'Derrota a Sappho Amidst the Waves controlando las rafagas heladas y los espacios estrechos de la pelea.',
    baseTip: 'Su reto gira alrededor de leer bien Shattering Ice y no regalar golpes por mala posicion.',
    defaultTimeLimit: 6,
    specificConditions: {
      solo: [
        {
          id: 'sappho-no-shattering-ice',
          text: 'No recibir impactos de Shattering Ice en todo el combate',
          conflictsWith: ['tech-max-one-hit']
        },
        {
          id: 'sappho-no-freeze-chain',
          text: 'No quedar atrapado en dos controles seguidos durante su fase helada',
          conflictsWith: []
        }
      ],
      supervisado: [
        {
          id: 'sappho-one-shattering-window',
          text: 'Maximo 1 impacto de Shattering Ice en todo el combate',
          conflictsWith: []
        },
        {
          id: 'sappho-participant-dodges',
          text: 'El participante debe resolver por si mismo las rafagas heladas sin apoyo del juez',
          conflictsWith: []
        }
      ]
    }
  },
  {
    id: 14,
    name: 'Balachko',
    enemyIcon: '\ud83d\udd25',
    region: 'Natlan - Leyenda Local',
    type: 'pressure',
    difficulty: 'extreme',
    diffClass: 'diff-extremo',
    diffLabel: 'EXTREMO',
    tag: 'Combate',
    tagClass: 'tag-combat',
    baseDesc: 'Derrota a Balachko identificando el cuerpo real entre copias y sobreviviendo a su secuencia de tajos encadenados.',
    baseTip: 'Durante Shadowblade Tactics, la lectura correcta importa mas que el daño bruto; el objetivo real se distingue por Pyro.',
    defaultTimeLimit: 6,
    specificConditions: {
      solo: [
        {
          id: 'balachko-real-body',
          text: 'Durante Shadowblade Tactics solo puedes derrotar al cuerpo original',
          conflictsWith: []
        },
        {
          id: 'balachko-three-copies',
          text: 'Debes apagar 3 copias seguidas antes de que Balachko cierre la secuencia',
          conflictsWith: []
        }
      ],
      supervisado: [
        {
          id: 'balachko-real-call',
          text: 'El juez solo observa: el participante debe identificar por si mismo el objetivo real',
          conflictsWith: []
        },
        {
          id: 'balachko-no-double-hit',
          text: 'No recibir dos tajos de sombra seguidos',
          conflictsWith: []
        }
      ]
    }
  },
  {
    id: 15,
    name: 'Hexadecatonic Mandragora',
    enemyIcon: '\ud83c\udf3f',
    region: 'Nod-Krai - Leyenda Local',
    type: 'gimmick',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Mecanica',
    tagClass: 'tag-speedrun',
    baseDesc: 'Derrota a Hexadecatonic Mandragora controlando su barra de Fury y resolviendo bien la fase de Sporebloom.',
    baseTip: 'Pyro, Electro o ataques Lunar-charged ayudan a vaciar Fury; si fallas el control del ritmo, el combate se alarga mucho.',
    defaultTimeLimit: 6,
    specificConditions: {
      solo: [
        {
          id: 'mandragora-no-sporebloom',
          text: 'No permitir que complete una fase de Sporebloom con libertad total',
          conflictsWith: []
        },
        {
          id: 'mandragora-control-fury',
          text: 'Debes vaciar correctamente la barra de Fury en cada ciclo principal',
          conflictsWith: []
        }
      ],
      supervisado: [
        {
          id: 'mandragora-one-clean-spore',
          text: 'Debes resolver al menos una fase de Sporebloom sin perder el control del campo',
          conflictsWith: []
        },
        {
          id: 'mandragora-no-judge-fury',
          text: 'El juez no puede ayudar a vaciar Fury ni a limpiar esporas por el participante',
          conflictsWith: []
        }
      ]
    }
  },
  {
    id: 16,
    name: 'The Homesick Lone Wolf',
    enemyIcon: '\ud83d\udc3a',
    region: 'Nod-Krai - Leyenda Local',
    type: 'technical',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Tecnico',
    tagClass: 'tag-nohit',
    baseDesc: 'Derrota a The Homesick Lone Wolf leyendo bien sus saltos, barridos y respiraciones de Anemo/Cryo.',
    baseTip: 'Sus ataques de area castigan mucho quedarse quieto; el reto luce mejor cuando se juega con disciplina y lectura.',
    defaultTimeLimit: 6,
    specificConditions: {
      solo: [
        {
          id: 'lonewolf-no-plunge-hit',
          text: 'No recibir impactos directos de Plunging Strike en todo el combate',
          conflictsWith: []
        },
        {
          id: 'lonewolf-breath-clean',
          text: 'Debes superar Sweeping Breath sin recibir daño',
          conflictsWith: []
        }
      ],
      supervisado: [
        {
          id: 'lonewolf-one-clean-rotation',
          text: 'Debes superar una rotacion completa de ataques del lobo sin recibir golpes',
          conflictsWith: []
        },
        {
          id: 'lonewolf-no-judge-bodyblock',
          text: 'El juez no puede cebar saltos ni bloquear trayectorias por el participante',
          conflictsWith: []
        }
      ]
    }
  },
  {
    id: 17,
    name: 'Hiljetta',
    enemyIcon: '\ud83d\udd2b',
    region: 'Nod-Krai - Leyenda Local',
    type: 'pressure',
    difficulty: 'hard',
    diffClass: 'diff-dificil',
    diffLabel: 'DIFICIL',
    tag: 'Combate',
    tagClass: 'tag-combat',
    baseDesc: 'Derrota a Hiljetta manteniendo consistencia frente a una duelista de largo alcance con punto debil y presion constante.',
    baseTip: 'Su punto debil permite ventanas claras, pero el reto sigue siendo no regalar daño por codicia.',
    defaultTimeLimit: 5,
    specificConditions: {
      solo: [
        {
          id: 'hiljetta-weakpoint-window',
          text: 'Debes castigar al menos una ventana clara de punto debil durante el combate',
          conflictsWith: []
        },
        {
          id: 'hiljetta-no-free-shot',
          text: 'No recibir dos disparos consecutivos de Hiljetta',
          conflictsWith: []
        }
      ],
      supervisado: [
        {
          id: 'hiljetta-one-clean-burst',
          text: 'Debes completar una ventana ofensiva limpia sin recibir respuesta directa',
          conflictsWith: []
        },
        {
          id: 'hiljetta-no-judge-setup',
          text: 'El juez no puede preparar el punto debil ni distraerla para regalarte apertura',
          conflictsWith: []
        }
      ]
    }
  }
];

const SOLO_RULES = [
  'El equipo debe definirse antes de entrar.',
  'Sin cambiar el equipo despues de iniciar.',
  'Sin pausar el juego durante el intento.',
  'Sin bajar el nivel de mundo; el reto se ejecuta en la maxima dificultad disponible.',
  'Solo 1 intento por reto.',
  'Si el jefe se reinicia, el desafio se considera perdido.',
  'El desarrollo del reto debe ejecutarse en directo.',
  'El personaje principal es el primero de izquierda a derecha en el editor de equipos.',
  'No se permite forzar mecanicas de personajes para hacerlos pasar por otra categoria.',
  'No se permite bugear a los jefes.'
];

const SUPERVISADO_RULES = [
  'El participante define 2 personajes antes de entrar y no puede cambiarlos luego.',
  'El supervisor acompaña como juez, pero no ataca ni usa habilidades.',
  'El supervisor no esta obligado a complementar consonancias.',
  'El supervisor no debe interferir directa ni indirectamente con curas, escudos o buffs activos.',
  'Se mantiene un solo intento por reto.',
  'Si el jefe se reinicia, el desafio se considera perdido.',
  'El reto puede validarse sin transmision completa mientras el juez supervise toda la partida.',
  'Los tiempos son mas razonables y el pool esta reducido para este formato.'
];

const MEDIUM_CONDITIONS = [
  {
    id: 'max-one-death',
    text: 'Maximo 1 personaje caido',
    conflictsWith: []
  },
  {
    id: 'no-food',
    text: 'Sin comida ofensiva durante el combate',
    conflictsWith: []
  },
  {
    id: 'main-dps-survive',
    text: 'Si cae tu personaje principal, el reto se considera fallido',
    conflictsWith: []
  },
  {
    id: 'four-elements',
    text: 'El equipo debe usar 4 elementos distintos',
    conflictsWith: ['max-two-same-element', 'mono-element', 'melee-only', 'ranged-only']
  },
  {
    id: 'max-two-same-element',
    text: 'Maximo 2 personajes del mismo elemento',
    conflictsWith: ['four-elements', 'mono-element']
  },
  {
    id: 'melee-only',
    text: 'Solo personajes cuerpo a cuerpo',
    conflictsWith: ['ranged-only', 'four-elements']
  },
  {
    id: 'ranged-only',
    text: 'Solo personajes a distancia',
    conflictsWith: ['melee-only', 'four-elements']
  }
];

const SUPERVISED_MEDIUM_CONDITIONS = [
  {
    id: 'two-elements-max',
    text: 'El equipo puede repetir elemento, pero solo entre los 2 personajes elegidos',
    conflictsWith: []
  },
  {
    id: 'no-food',
    text: 'Sin comida ofensiva durante el combate',
    conflictsWith: []
  },
  {
    id: 'main-dps-survive',
    text: 'Si cae el personaje principal del participante, el reto se considera fallido',
    conflictsWith: []
  },
  {
    id: 'no-double-healer',
    text: 'No se recomienda doble healer entre los 2 personajes elegidos',
    conflictsWith: []
  },
  {
    id: 'melee-or-ranged',
    text: 'Los 2 personajes deben compartir el mismo enfoque: cuerpo a cuerpo o distancia',
    conflictsWith: []
  }
];

const HARD_CONDITIONS_BY_TYPE = {
  pressure: [
    {
      id: 'pressure-no-heal',
      text: 'Sin curarse durante el combate',
      conflictsWith: []
    },
    {
      id: 'pressure-no-shield',
      text: 'Sin usar escudos',
      conflictsWith: []
    },
    {
      id: 'pressure-no-leave',
      text: 'No salir del rango de combate',
      conflictsWith: []
    },
    {
      id: 'pressure-same-starter',
      text: 'Debes terminar el combate con el mismo personaje con el que lo iniciaste en campo',
      conflictsWith: []
    }
  ],
  technical: [
    {
      id: 'tech-no-direct-damage',
      text: 'Sin recibir daño directo',
      conflictsWith: ['tech-max-one-hit']
    },
    {
      id: 'tech-max-one-hit',
      text: 'Maximo 1 golpe permitido en todo el combate',
      conflictsWith: ['tech-no-direct-damage']
    },
    {
      id: 'tech-no-shield',
      text: 'Sin usar escudos',
      conflictsWith: []
    },
    {
      id: 'tech-no-heal',
      text: 'Sin curarse durante el combate',
      conflictsWith: []
    },
    {
      id: 'tech-clean-phase',
      text: 'Debes superar la fase mas peligrosa sin recibir golpes',
      conflictsWith: []
    }
  ],
  gimmick: [
    {
      id: 'gimmick-no-special',
      text: 'No permitir que active su mecanica mas peligrosa',
      conflictsWith: []
    },
    {
      id: 'gimmick-phase-clean',
      text: 'Debes superar la fase especial sin bajas',
      conflictsWith: []
    },
    {
      id: 'gimmick-fast-break',
      text: 'Debes romper su estado especial rapido o el reto se considera fallido',
      conflictsWith: []
    },
    {
      id: 'gimmick-no-heal',
      text: 'Sin curarse durante el combate',
      conflictsWith: []
    },
    {
      id: 'gimmick-no-shield',
      text: 'Sin usar escudos',
      conflictsWith: []
    }
  ]
};

const SUPERVISED_HARD_CONDITIONS_BY_TYPE = {
  pressure: [
    {
      id: 'pressure-participant-carries',
      text: 'El supervisor no puede absorber mecanicas para facilitar la pelea',
      conflictsWith: []
    },
    {
      id: 'pressure-no-heal',
      text: 'Sin curarse durante el combate',
      conflictsWith: []
    },
    {
      id: 'pressure-no-reset',
      text: 'Si el participante pierde el control del ritmo, no se reinicia el intento',
      conflictsWith: []
    }
  ],
  technical: [
    {
      id: 'tech-clean-phase',
      text: 'Debes superar la fase mas peligrosa sin recibir golpes',
      conflictsWith: []
    },
    {
      id: 'tech-max-one-hit',
      text: 'Maximo 1 golpe permitido en todo el combate',
      conflictsWith: []
    },
    {
      id: 'tech-no-shield',
      text: 'Sin usar escudos',
      conflictsWith: []
    }
  ],
  gimmick: [
    {
      id: 'gimmick-participant-break',
      text: 'El participante debe resolver por si mismo la mecanica principal',
      conflictsWith: []
    },
    {
      id: 'gimmick-phase-clean',
      text: 'Debes superar la fase especial sin bajas',
      conflictsWith: []
    },
    {
      id: 'gimmick-no-heal',
      text: 'Sin curarse durante el combate',
      conflictsWith: []
    }
  ]
};

const TITLE_BY_TYPE = {
  pressure: ['Prueba de Presion', 'El Sello de la Fortaleza', 'Desafio del Acero'],
  technical: ['Danza de Precision', 'El Juicio del Reflejo', 'Sello de la Ejecucion'],
  gimmick: ['Prueba del Mecanismo', 'Ritual del Engranaje', 'Sello de la Fase']
};

const MODE_CONFIGS = {
  solo: {
    key: 'solo',
    storageKey: 'prueba-lunar-state-v3-solo',
    versionLabel: 'Prueba Lunar v3.0 - Modo Solo',
    label: 'Modo Solo',
    modeRuleTitle: 'Reglas del Modo Solo',
    modeBadge: 'Pool completo - 4 personajes',
    challengeSubtitle: 'Tres sellos. Dos victorias. Una sola recompensa.',
    prizeLabel: 'Premio: Bendicion Lunar',
    warningText: 'Los retos involucran Leyendas Locales, con daño alto, mucha vida y mecanicas unicas. No es una pelea normal.',
    rules: SOLO_RULES,
    typeFilterOptions: [
      { value: 'all', label: 'Todos los tipos de reto' },
      { value: 'pressure', label: 'Combate de presion' },
      { value: 'technical', label: 'Precision y no-hit' },
      { value: 'gimmick', label: 'Mecanica especial' }
    ],
    mediumConditions: MEDIUM_CONDITIONS,
    hardConditionsByType: HARD_CONDITIONS_BY_TYPE,
    bossIds: BASE_BOSS_POOL.map(boss => boss.id),
    timeModifier: 0
  },
  supervisado: {
    key: 'supervisado',
    storageKey: 'prueba-lunar-state-v3-supervisado',
    versionLabel: 'Prueba Lunar v3.0 - Modo Supervisado',
    label: 'Modo Supervisado',
    modeRuleTitle: 'Reglas del Modo Supervisado',
    modeBadge: 'Pool reducido - 2 personajes + juez',
    challengeSubtitle: 'El participante juega. El supervisor valida. La luna observa.',
    prizeLabel: 'Validacion supervisada',
    warningText: 'Este formato esta pensado para participantes con limitaciones de transmision o juego en celular. El juez acompaña, pero no interviene.',
    rules: SUPERVISADO_RULES,
    typeFilterOptions: [
      { value: 'all', label: 'Todos los retos supervisados' },
      { value: 'pressure', label: 'Combate controlado' },
      { value: 'technical', label: 'Ejecucion limpia' },
      { value: 'gimmick', label: 'Mecanica guiada' }
    ],
    mediumConditions: SUPERVISED_MEDIUM_CONDITIONS,
    hardConditionsByType: SUPERVISED_HARD_CONDITIONS_BY_TYPE,
    bossIds: [3, 4, 5, 6, 8, 9, 10, 12, 13, 14, 15, 16, 17],
    timeModifier: 1
  }
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function areConditionsCompatible(selected, candidate) {
  if (!candidate) return false;

  for (const condition of selected) {
    const candidateConflicts = candidate.conflictsWith || [];
    const selectedConflicts = condition.conflictsWith || [];

    if (candidateConflicts.includes(condition.id) || selectedConflicts.includes(candidate.id)) {
      return false;
    }
  }

  return true;
}

function pickCompatibleConditions(pool, count) {
  const shuffled = shuffleArray(pool);
  const selected = [];

  for (const candidate of shuffled) {
    if (selected.length >= count) break;

    if (areConditionsCompatible(selected, candidate)) {
      selected.push(candidate);
    }
  }

  return selected;
}

function getBossSpecificConditions(boss, modeKey) {
  if (!boss?.specificConditions) return [];
  return boss.specificConditions[modeKey] || [];
}

function buildChallengeFromBoss(boss, modeConfig) {
  const mediumConditions = pickCompatibleConditions(modeConfig.mediumConditions, 2);
  const hardPool = modeConfig.hardConditionsByType[boss.type] || [];
  const bossSpecificPool = getBossSpecificConditions(boss, modeConfig.key);
  const compatibleHardPool = hardPool.filter(candidate => areConditionsCompatible(mediumConditions, candidate));
  const compatibleBossPool = bossSpecificPool.filter(candidate => areConditionsCompatible(mediumConditions, candidate));
  const selectedPool = compatibleBossPool.length
    ? compatibleBossPool
    : (compatibleHardPool.length ? compatibleHardPool : hardPool);
  const hardCondition = selectedPool.length ? pickRandom(selectedPool) : null;
  const titleBase = pickRandom(TITLE_BY_TYPE[boss.type] || ['Prueba Especial']);
  const timeLimit = (boss.defaultTimeLimit || 6) + (modeConfig.timeModifier || 0);

  return {
    bossId: boss.id,
    type: boss.type,
    tag: boss.tag,
    tagClass: boss.tagClass,
    diff: boss.difficulty,
    diffClass: boss.diffClass,
    diffLabel: boss.diffLabel,
    enemy: boss.name,
    enemyIcon: boss.enemyIcon,
    region: boss.region,
    title: `${titleBase}: ${boss.name}`,
    desc: boss.baseDesc,
    tip: boss.baseTip,
    timeLimit,
    conditions: [
      ...mediumConditions.map(item => item.text),
      hardCondition ? hardCondition.text : 'Cumple las reglas del modo'
    ]
  };
}

function getModeConfig(modeKey) {
  return MODE_CONFIGS[modeKey] || MODE_CONFIGS.solo;
}

function getBossPoolForMode(modeKey) {
  const config = getModeConfig(modeKey);
  return BASE_BOSS_POOL.filter(boss => config.bossIds.includes(boss.id));
}
