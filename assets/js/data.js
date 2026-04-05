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
    baseDesc: 'Derrota a Vivianne del Lago. Sus ataques tienen altísimo daño y castigan mucho los errores de posición.',
    baseTip: 'Prioriza Dendro/Pyro para romper su barra de estasis rápido. Sus ataques castigan errores de posición; evita acercamientos directos. Mantén escudo activo durante oleadas iniciales.',
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
    baseDesc: 'Derrota a Rocky Avildsen. Su fase de furia aumenta mucho la presión y castiga errores de lectura.',
    baseTip: 'En Rage Mode (rojo), sus combos son predecibles: 3 golpes + pausa de 2-3 seg. Concentra daño SOLO en esas pausas. Si no tienes 60% HP, espera sin atacar.',
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
    baseTip: 'Genera zonas peligrosas cada 8-10 seg en patrón predecible. Mantén máxima movilidad. Sus saltos son lentos; responde con burst durante su ascenso para resetear su posición.',
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
    baseTip: 'Su barra energética crece lentamente; dispara ataque especial cada 15-18 seg. Después de disparar hay 5-7 seg de ventana segura. Acumula burst para esas ventanas ofensivas.',
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
    baseDesc: 'Derrota a Yseut controlando bien los errores, porque castiga mucho las fallas de ejecución.',
    baseTip: 'Ciclo fijo: Salto > Barrido > Explosión Congelante. Los dos primeros ataques te advierten del tercero. Esquiva en secuencia o recibe todo el daño. Un error = reset total.',
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
    baseTip: 'Sus ciclos de ataque escalan en velocidad: primeros 30 seg son lentos (70% HP), últimos son caóticos (30% final). Aprende patrones en el primer minuto. Muy indulgente al inicio, brutal al final.',
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
    baseDesc: 'Derrota a Rilai superando correctamente sus patrones más peligrosos.',
    baseTip: 'Sus ataques de fuego tienen AoE pequeño pero daño alto puntual. Si esquivas el primer ataque, tienes 2-3 seg para aplicar buff o sacar daño. Requiere timing exacto.',
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
    tag: 'Mecánica',
    tagClass: 'tag-speedrun',
    baseDesc: 'Derrota al Field Generator controlando bien su mecánica especial y las ondas del combate.',
    baseTip: 'Patrón de ondas es cíclico: 3 ondas rápidas > pausa > 2 ondas lentas > pausa. Desactiva torres en orden (derecha > izquierda) o falla mecánica = 40% HP. Necesita precisión 99%.',
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
    tag: 'Mecánica',
    tagClass: 'tag-speedrun',
    baseDesc: 'Derrota a Chassanion gestionando correctamente su gimmick principal.',
    baseTip: 'Cada 20 seg abre 3 portales dimensionales. Solo uno es el real (tiene efecto elemental brillante). Destruye el real o castigo de 30% HP total. Verifica brillo antes de atacar.',
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
    tag: 'Mecánica',
    tagClass: 'tag-speedrun',
    baseDesc: 'Derrota a Cineas manejando bien el ritmo del combate y su fase especial.',
    baseTip: 'Fases: 50-75% normal (fácil) > 25-50% transición (creciente caos) > 0-25% especial (rompe si no haces daño). El tempo se acelera exponencialmente. Guarda burst completo para fase final.',
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
    tag: 'Mecánica',
    tagClass: 'tag-restriction',
    baseDesc: 'Derrota a Cocijo antes de que el combate se descontrole con su mecánica más peligrosa.',
    baseTip: 'Relámpago cambia polaridad cada 10 seg: atracción ↔ repulsión. Afecta tu movimiento. Calcula posicionamiento según polaridad actual. Ambición de daño temprana en fase 1 = muerte garantizada.',
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
    tag: 'Mecánica',
    tagClass: 'tag-restriction',
    baseDesc: 'Derrota a The Peak controlando bien su fase potenciada.',
    baseTip: 'Cada 15 seg marca territorio de poder que reduce tu ataque 20% (acumulable). Destrúyela en máx 5 seg o castigo se multiplica. Control de ritmo desde el inicio es crítico.',
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
    baseTip: 'Shattering Ice cae cada 10-12 seg. Esquiva en diagonal HACIA AFUERA, nunca hacia dentro. Las ráfagas congelan 2 seg; si recibes 2 castigos seguidos = inmovilizado = derrota. Espacios estrechos = trampa visual.',
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
          text: 'Debes superar una rafaga helada completa sin recibir congelacion ni control seguido',
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
    baseTip: 'Shadowblade Tactics = 6 copias + original real. Original tiene brillo Pyro distintivo. Enfoca SOLO al real o vuelves al inicio del ciclo (6 tajos más). Sus combos encadenados tienen iframes específicos; requiere ejecución de fase.',
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
          text: 'Debes identificar y golpear al cuerpo real en el primer intento de Shadowblade Tactics',
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
    tag: 'Mecánica',
    tagClass: 'tag-speedrun',
    baseDesc: 'Derrota a Hexadecatonic Mandragora controlando su barra de Fury y resolviendo bien la fase de Sporebloom.',
    baseTip: 'Fury bar crece constantemente. Pyro/Electro/Lunar reducen rápido (10 seg). Sporebloom ocurre cada 20 seg; debes estar listo. Fallar mecánica = extensión 15 seg + caos acumulativo. Control del ritmo = todo.',
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
          text: 'Debes vaciar la barra de Fury antes de que cierre su primer ciclo principal',
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
    baseTip: 'Plunging Strike cada 12 seg (esquiva saltando rápido). Sweeping Breath parece completo pero solo últimos 2 golpes despliegan área de daño. Aprende a predecir; error = daño severo pero evitable.',
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
          text: 'Debes esquivar un Plunging Strike y un Sweeping Breath en la misma rotacion sin recibir daño',
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
    baseDesc: 'Derrota a Hiljetta manteniendo consistencia frente a una duelista de largo alcance con punto débil y presión constante.',
    baseTip: 'Punto débil cada 15-20 seg, dura exactamente 5 seg. Sus disparos tienen 3 fases (rápido > lento > explosión final). Aprende a interrumpir ANTES de explosión con escudo o inversión de ataque. Timing = todo.',
    defaultTimeLimit: 5,
    specificConditions: {
      solo: [
        {
          id: 'hiljetta-weakpoint-window',
          text: 'Debes castigar al menos una ventana clara de punto débil durante el combate',
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
          text: 'Debes castigar al menos una apertura de punto debil con el personaje principal',
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
  'El supervisor no está obligado a complementar consonancia.',
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
    conflictsWith: ['max-two-same-element', 'mono-element', 'mono-damage', 'sword-only', 'claymore-only', 'polearm-only', 'bow-only', 'catalyst-only', 'melee-any', 'ranged-any', 'bow-catalyst', 'sword-claymore', 'sword-polearm', 'claymore-polearm', 'no-catalyst']
  },
  {
    id: 'max-two-same-element',
    text: 'Maximo 2 personajes del mismo elemento',
    conflictsWith: ['four-elements', 'mono-element']
  },
  {
    id: 'sword-only',
    text: 'Solo Espada Ligera en el equipo (todos los personajes)',
    conflictsWith: ['claymore-only', 'polearm-only', 'bow-only', 'catalyst-only', 'melee-any', 'ranged-any', 'bow-catalyst', 'sword-claymore', 'sword-polearm', 'claymore-polearm', 'four-elements', 'mono-element', 'no-catalyst']
  },
  {
    id: 'claymore-only',
    text: 'Solo Mandoble en el equipo (todos los personajes)',
    conflictsWith: ['sword-only', 'polearm-only', 'bow-only', 'catalyst-only', 'melee-any', 'ranged-any', 'bow-catalyst', 'sword-claymore', 'sword-polearm', 'claymore-polearm', 'four-elements', 'mono-element', 'no-catalyst']
  },
  {
    id: 'polearm-only',
    text: 'Solo Lanza en el equipo (todos los personajes)',
    conflictsWith: ['sword-only', 'claymore-only', 'bow-only', 'catalyst-only', 'melee-any', 'ranged-any', 'bow-catalyst', 'sword-claymore', 'sword-polearm', 'claymore-polearm', 'four-elements', 'mono-element', 'no-catalyst']
  },
  {
    id: 'bow-only',
    text: 'Solo Arco en el equipo (todos los personajes)',
    conflictsWith: ['sword-only', 'claymore-only', 'polearm-only', 'catalyst-only', 'melee-any', 'sword-claymore', 'sword-polearm', 'claymore-polearm', 'ranged-any', 'bow-catalyst', 'no-bow', 'four-elements', 'mono-element', 'no-catalyst']
  },
  {
    id: 'catalyst-only',
    text: 'Solo Catalizador en el equipo (todos los personajes)',
    conflictsWith: ['sword-only', 'claymore-only', 'polearm-only', 'bow-only', 'melee-any', 'sword-claymore', 'sword-polearm', 'claymore-polearm', 'ranged-any', 'bow-catalyst', 'no-catalyst', 'four-elements', 'mono-element']
  },
  {
    id: 'sword-claymore',
    text: 'Solo Espada Ligera y Mandoble permitidos (sin Lanza, Arco, Catalizador)',
    conflictsWith: ['polearm-only', 'bow-only', 'catalyst-only', 'ranged-any', 'bow-catalyst', 'melee-any', 'no-catalyst', 'four-elements', 'mono-element']
  },
  {
    id: 'sword-polearm',
    text: 'Solo Espada Ligera y Lanza permitidas (sin Mandoble, Arco, Catalizador)',
    conflictsWith: ['claymore-only', 'bow-only', 'catalyst-only', 'ranged-any', 'bow-catalyst', 'melee-any', 'no-catalyst', 'four-elements', 'mono-element']
  },
  {
    id: 'claymore-polearm',
    text: 'Solo Mandoble y Lanza permitidas (sin Espada, Arco, Catalizador)',
    conflictsWith: ['sword-only', 'bow-only', 'catalyst-only', 'ranged-any', 'bow-catalyst', 'melee-any', 'no-catalyst', 'four-elements', 'mono-element']
  },
  {
    id: 'melee-any',
    text: 'Solo personajes cuerpo a cuerpo (Espada, Mandoble, Lanza)',
    conflictsWith: ['bow-only', 'catalyst-only', 'ranged-any', 'bow-catalyst', 'no-catalyst', 'four-elements', 'mono-element', 'sword-only', 'claymore-only', 'polearm-only', 'sword-claymore', 'sword-polearm', 'claymore-polearm']
  },
  {
    id: 'bow-catalyst',
    text: 'Solo Arco y Catalizador permitidos (sin Espada, Mandoble, Lanza)',
    conflictsWith: ['sword-only', 'claymore-only', 'polearm-only', 'melee-any', 'sword-claymore', 'sword-polearm', 'claymore-polearm', 'no-bow', 'no-catalyst', 'four-elements', 'mono-element']
  },
  {
    id: 'ranged-any',
    text: 'Solo personajes a distancia (Arco, Catalizador)',
    conflictsWith: ['sword-only', 'claymore-only', 'polearm-only', 'melee-any', 'sword-claymore', 'sword-polearm', 'claymore-polearm', 'four-elements', 'mono-element', 'bow-only', 'catalyst-only', 'bow-catalyst']
  },
  {
    id: 'no-catalyst',
    text: 'Sin Catalizador permitido en el equipo',
    conflictsWith: ['catalyst-only', 'ranged-any', 'bow-catalyst', 'four-elements']
  },
  {
    id: 'no-bow',
    text: 'Sin Arco permitido en el equipo',
    conflictsWith: ['bow-only', 'ranged-any', 'bow-catalyst']
  },
  {
    id: 'energy-chain',
    text: 'Debes usar al menos 3 Ultimates durante el combate',
    conflictsWith: ['no-bursts']
  },
  {
    id: 'no-bursts',
    text: 'Maximo 1 Ultimate por personaje durante todo el combate',
    conflictsWith: ['energy-chain']
  },
  {
    id: 'switch-limit-3',
    text: 'Maximo 16 cambios de personaje en todo el combate',
    conflictsWith: []
  },
  {
    id: 'mono-element',
    text: 'Todo el equipo debe usar el mismo elemento',
    conflictsWith: ['four-elements', 'max-two-same-element', 'mono-damage', 'no-catalyst']
  },
  {
    id: 'mono-damage',
    text: 'El daño principal debe recaer en un solo personaje; el resto del equipo entra solo a apoyar',
    conflictsWith: ['four-elements', 'mono-element']
  },
  {
    id: 'no-reactions',
    text: 'No puedes depender de Bloom, Hyperbloom, Burgeon o Sobrecargado como fuente principal de daño',
    conflictsWith: ['energy-chain']
  }
];

const SUPERVISED_MEDIUM_CONDITIONS = [
  {
    id: 'different-elements-supervised',
    text: 'Los 2 personajes deben ser de elementos distintos',
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
    text: 'Maximo 1 personaje con rol principal de curacion entre los 2 elegidos',
    conflictsWith: []
  },
  {
    id: 'melee-only-supervised',
    text: 'Los 2 personajes deben ser cuerpo a cuerpo (Espada, Mandoble o Lanza)',
    conflictsWith: ['ranged-only-supervised', 'bow-catalyst-supervised']
  },
  {
    id: 'ranged-only-supervised',
    text: 'Los 2 personajes deben ser a distancia (Arco o Catalizador)',
    conflictsWith: ['melee-only-supervised']
  },
  {
    id: 'bow-catalyst-supervised',
    text: 'Debes llevar exactamente 1 Arco y 1 Catalizador',
    conflictsWith: ['melee-only-supervised', 'no-bow-supervised', 'no-catalyst-supervised']
  },
  {
    id: 'no-catalyst-supervised',
    text: 'Sin Catalizador permitido entre los 2 personajes',
    conflictsWith: ['ranged-only-supervised', 'bow-catalyst-supervised']
  },
  {
    id: 'no-bow-supervised',
    text: 'Sin Arco permitido entre los 2 personajes',
    conflictsWith: ['ranged-only-supervised', 'bow-catalyst-supervised']
  },
  {
    id: 'switch-limit-2-supervised',
    text: 'Maximo 30 cambios de personaje en todo el combate',
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
      id: 'pressure-open-clean',
      text: 'No puedes usar tu primer Ultimate hasta superar la primera rotacion agresiva del jefe',
      conflictsWith: ['energy-chain']
    },
    {
      id: 'pressure-same-starter',
      text: 'Debes terminar el combate con el mismo personaje con el que lo iniciaste en campo',
      conflictsWith: []
    },
    {
      id: 'pressure-cycle-match',
      text: 'Debes sobrevivir la primera rotacion del jefe con tu personaje principal en campo',
      conflictsWith: []
    },
    {
      id: 'pressure-no-burst',
      text: 'Sin usar Ultimates durante el combate (solo ataques e habilidades E)',
      conflictsWith: ['energy-chain', 'no-bursts']
    },
    {
      id: 'pressure-low-hp',
      text: 'Debes terminar el combate con el personaje principal en campo y por debajo del 50% de vida',
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
    },
    {
      id: 'tech-perfect-dodge',
      text: 'Debes esquivar perfectamente 3 ataques seguidos del jefe sin escudos ni bursts',
      conflictsWith: ['tech-no-shield']
    },
    {
      id: 'tech-no-burst',
      text: 'Sin usar Ultimates (solo ataques normales y habilidades E)',
      conflictsWith: ['energy-chain', 'no-bursts']
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
      text: 'Debes superar la fase especial sin bajas (sin personajes caídos)',
      conflictsWith: []
    },
    {
      id: 'gimmick-fast-break',
      text: 'Debes romper su estado especial en el primer ciclo disponible o el reto se considera fallido',
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
    },
    {
      id: 'gimmick-timed-solve',
      text: 'Debes resolver la mecanica principal dentro de 25 segundos',
      conflictsWith: []
    },
    {
      id: 'gimmick-no-burst-phase',
      text: 'Durante la mecanica especial no puedes usar Ultimates',
      conflictsWith: ['energy-chain', 'no-bursts']
    }
  ]
};

const SUPERVISED_HARD_CONDITIONS_BY_TYPE = {
  pressure: [
    {
      id: 'pressure-open-clean-supervised',
      text: 'Debes superar la primera rotacion agresiva con el personaje principal en campo',
      conflictsWith: []
    },
    {
      id: 'pressure-no-heal',
      text: 'Sin curarse durante el combate',
      conflictsWith: []
    },
    {
      id: 'pressure-same-starter-supervised',
      text: 'El personaje principal debe abrir y cerrar el combate',
      conflictsWith: []
    },
    {
      id: 'pressure-no-burst',
      text: 'Sin usar Ultimates durante el combate',
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
    },
    {
      id: 'tech-no-burst',
      text: 'Sin usar Ultimates (solo ataques normales)',
      conflictsWith: []
    }
  ],
  gimmick: [
    {
      id: 'gimmick-main-field',
      text: 'La primera mecanica especial debe resolverse con el personaje principal en campo',
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
    },
    {
      id: 'gimmick-timed-solve',
      text: 'Debes resolver la mecanica principal dentro de 30 segundos',
      conflictsWith: []
    }
  ]
};

const TITLE_BY_TYPE = {
  pressure: ['Prueba de Presión', 'El Sello de la Fortaleza', 'Desafío del Acero'],
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
      { value: 'pressure', label: 'Combate de presión' },
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

  let selectedPool = compatibleBossPool;
  if (!selectedPool.length) {
    selectedPool = compatibleHardPool.length ? compatibleHardPool : hardPool;
  }

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
