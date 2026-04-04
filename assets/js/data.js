const BOSS_POOL = [
    {
        id: 1,
        name: 'Vivianne del Lago',
        enemyIcon: '💧',
        region: 'Fontaine · Leyenda Local',
        type: 'pressure',
        difficulty: 'extreme',
        diffClass: 'diff-extremo',
        diffLabel: '☠ EXTREMO',
        tag: 'Combate',
        tagClass: 'tag-combat',
        baseDesc: 'Derrota a Vivianne del Lago. Sus ataques tienen altísimo daño y castigan mucho los errores de posición.',
        baseTip: 'Hydro no funciona bien contra ella. Dendro o Pyro suelen rendir mejor.',
        defaultTimeLimit: 8
    },
    {
        id: 2,
        name: 'Rocky Avildsen',
        enemyIcon: '🥊',
        region: 'Fontaine · Leyenda Local',
        type: 'pressure',
        difficulty: 'extreme',
        diffClass: 'diff-extremo',
        diffLabel: '☠ EXTREMO',
        tag: 'Combate',
        tagClass: 'tag-combat',
        baseDesc: 'Derrota a Rocky Avildsen. Su fase de furia aumenta mucho la presión y castiga errores de lectura.',
        baseTip: 'En fase de furia es mejor priorizar supervivencia que greed de daño.',
        defaultTimeLimit: 7
    },
    {
        id: 3,
        name: 'Liam, el Arcoíris Fugaz',
        enemyIcon: '🎸',
        region: 'Fontaine · Leyenda Local',
        type: 'pressure',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Combate',
        tagClass: 'tag-combat',
        baseDesc: 'Derrota a Liam mientras controlas sus zonas peligrosas y su movilidad constante.',
        baseTip: 'Si el suelo se vuelve peligroso, reposiciónate rápido y evita quedarte encerrado.',
        defaultTimeLimit: 6
    },
    {
        id: 4,
        name: 'Ninianne del Lago',
        enemyIcon: '🌊',
        region: 'Fontaine · Leyenda Local',
        type: 'pressure',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Combate',
        tagClass: 'tag-combat',
        baseDesc: 'Derrota a Ninianne del Lago. Menos opresiva que Vivianne, pero igual exige control y constancia.',
        baseTip: 'Mantén presión constante y evita regalar daño innecesario.',
        defaultTimeLimit: 6
    },
    {
        id: 5,
        name: 'Yseut',
        enemyIcon: '❄️',
        region: 'Fontaine · Leyenda Local',
        type: 'technical',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Técnico',
        tagClass: 'tag-nohit',
        baseDesc: 'Derrota a Yseut controlando bien los errores, porque castiga mucho las fallas de ejecución.',
        baseTip: 'Es un buen jefe para premiar lectura de patrones y disciplina.',
        defaultTimeLimit: 5
    },
    {
        id: 6,
        name: 'Deianeira of Snezhevna',
        enemyIcon: '🌪️',
        region: 'Fontaine · Leyenda Local',
        type: 'technical',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Técnico',
        tagClass: 'tag-nohit',
        baseDesc: 'Derrota a Deianeira manteniendo control del combate y evitando errores acumulativos.',
        baseTip: 'No es solo daño: la constancia importa mucho.',
        defaultTimeLimit: 5
    },
    {
        id: 7,
        name: 'Rilai',
        enemyIcon: '🎵',
        region: 'Natlan · Leyenda Local',
        type: 'technical',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Técnico',
        tagClass: 'tag-nohit',
        baseDesc: 'Derrota a Rilai superando correctamente sus patrones más peligrosos.',
        baseTip: 'Este jefe luce mucho mejor cuando el reto exige ejecución limpia.',
        defaultTimeLimit: 6
    },
    {
        id: 8,
        name: 'Automated Supercomputing Field Generator',
        enemyIcon: '⚙️',
        region: 'Fontaine · Leyenda Local',
        type: 'technical',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Mecánica',
        tagClass: 'tag-speedrun',
        baseDesc: 'Derrota al Field Generator controlando bien su mecánica especial y las ondas del combate.',
        baseTip: 'Aquí la lectura visual del patrón importa muchísimo.',
        defaultTimeLimit: 6
    },
    {
        id: 9,
        name: 'Chassanion',
        enemyIcon: '🫧',
        region: 'Fontaine · Leyenda Local',
        type: 'gimmick',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Mecánica',
        tagClass: 'tag-speedrun',
        baseDesc: 'Derrota a Chassanion gestionando correctamente su gimmick principal.',
        baseTip: 'No todo es DPS: aquí conviene entender la mecánica.',
        defaultTimeLimit: 5
    },
    {
        id: 10,
        name: 'Cineas',
        enemyIcon: '🔷',
        region: 'Sea of Bygone Eras · Leyenda Local',
        type: 'gimmick',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Mecánica',
        tagClass: 'tag-speedrun',
        baseDesc: 'Derrota a Cineas manejando bien el ritmo del combate y su fase especial.',
        baseTip: 'Gestiona bien tus recursos y evita perder control del tempo.',
        defaultTimeLimit: 6
    },
    {
        id: 11,
        name: 'Cocijo',
        enemyIcon: '⚡',
        region: 'Natlan · Leyenda Local',
        type: 'gimmick',
        difficulty: 'extreme',
        diffClass: 'diff-extremo',
        diffLabel: '☠ EXTREMO',
        tag: 'Mecánica',
        tagClass: 'tag-restriction',
        baseDesc: 'Derrota a Cocijo antes de que el combate se descontrole con su mecánica más peligrosa.',
        baseTip: 'Es un jefe ideal para retos de presión y ejecución temprana.',
        defaultTimeLimit: 5
    },
    {
        id: 12,
        name: 'The Peak',
        enemyIcon: '🐂',
        region: 'Natlan · Leyenda Local',
        type: 'gimmick',
        difficulty: 'hard',
        diffClass: 'diff-dificil',
        diffLabel: '⚔ DIFÍCIL',
        tag: 'Mecánica',
        tagClass: 'tag-restriction',
        baseDesc: 'Derrota a The Peak controlando bien su fase potenciada.',
        baseTip: 'Si dejas que imponga su ritmo, el reto se complica mucho.',
        defaultTimeLimit: 6
    }
];

const MEDIUM_CONDITIONS = [
    {
        id: 'max-one-death',
        text: 'Máximo 1 personaje caído',
        category: 'survival',
        conflictsWith: []
    },
    {
        id: 'no-food',
        text: 'Sin comida ofensiva durante el combate',
        category: 'resources',
        conflictsWith: []
    },
    {
        id: 'main-dps-survive',
        text: 'Si cae tu personaje principal, el reto se considera fallido',
        category: 'survival',
        conflictsWith: []
    },
    {
        id: 'four-elements',
        text: 'El equipo debe usar 4 elementos distintos',
        category: 'team-comp',
        conflictsWith: ['max-two-same-element', 'mono-element', 'melee-only', 'ranged-only']
    },
    {
        id: 'max-two-same-element',
        text: 'Máximo 2 personajes del mismo elemento',
        category: 'team-comp',
        conflictsWith: ['four-elements', 'mono-element']
    },
    {
        id: 'melee-only',
        text: 'Solo personajes cuerpo a cuerpo',
        category: 'weapon-style',
        conflictsWith: ['ranged-only', 'four-elements']
    },
    {
        id: 'ranged-only',
        text: 'Solo personajes a distancia',
        category: 'weapon-style',
        conflictsWith: ['melee-only', 'four-elements']
    }
];

const HARD_CONDITIONS_BY_TYPE = {
    pressure: [
        {
            id: 'pressure-no-heal',
            text: 'Sin curarse durante el combate',
            category: 'resources',
            conflictsWith: []
        },
        {
            id: 'pressure-no-shield',
            text: 'Sin usar escudos',
            category: 'defense',
            conflictsWith: []
        },
        {
            id: 'pressure-no-leave',
            text: 'No salir del rango de combate',
            category: 'positioning',
            conflictsWith: []
        },
        {
            id: 'pressure-same-starter',
            text: 'Debes terminar el combate con el mismo personaje con el que lo iniciaste en campo',
            category: 'character-lock',
            conflictsWith: []
        }
    ],
    technical: [
        {
            id: 'tech-no-direct-damage',
            text: 'Sin recibir daño directo',
            category: 'no-hit',
            conflictsWith: ['tech-max-one-hit']
        },
        {
            id: 'tech-max-one-hit',
            text: 'Máximo 1 golpe permitido en todo el combate',
            category: 'no-hit',
            conflictsWith: ['tech-no-direct-damage']
        },
        {
            id: 'tech-no-shield',
            text: 'Sin usar escudos',
            category: 'defense',
            conflictsWith: []
        },
        {
            id: 'tech-no-heal',
            text: 'Sin curarse durante el combate',
            category: 'resources',
            conflictsWith: []
        },
        {
            id: 'tech-clean-phase',
            text: 'Debes superar la fase más peligrosa sin recibir golpes',
            category: 'phase',
            conflictsWith: []
        }
    ],
    gimmick: [
        {
            id: 'gimmick-no-special',
            text: 'No permitir que active su mecánica más peligrosa',
            category: 'boss-mechanic',
            conflictsWith: []
        },
        {
            id: 'gimmick-phase-clean',
            text: 'Debes superar la fase especial sin bajas',
            category: 'phase',
            conflictsWith: []
        },
        {
            id: 'gimmick-fast-break',
            text: 'Debes romper su estado especial rápidamente o el reto se considera fallido',
            category: 'boss-mechanic',
            conflictsWith: []
        },
        {
            id: 'gimmick-no-heal',
            text: 'Sin curarse durante el combate',
            category: 'resources',
            conflictsWith: []
        },
        {
            id: 'gimmick-no-shield',
            text: 'Sin usar escudos',
            category: 'defense',
            conflictsWith: []
        }
    ]
};

const TITLE_BY_TYPE = {
    pressure: [
        'Prueba de Presión',
        'El Sello de la Fortaleza',
        'Desafío del Acero'
    ],
    technical: [
        'Danza de Precisión',
        'El Juicio del Reflejo',
        'Sello de la Ejecución'
    ],
    gimmick: [
        'Prueba del Mecanismo',
        'Ritual del Engranaje',
        'Sello de la Fase'
    ]
};

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickUnique(arr, usedIds = []) {
    const filtered = arr.filter(item => !usedIds.includes(item.id));
    const source = filtered.length ? filtered : arr;
    return pickRandom(source);
}

function buildTimeCondition(minutes) {
    return {
        id: `time-${minutes}`,
        text: `Tiempo límite: ${minutes} minuto${minutes === 1 ? '' : 's'}`,
        minutes
    };
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickManyUnique(arr, count, excludedIds = []) {
    const filtered = arr.filter(item => !excludedIds.includes(item.id));
    const source = filtered.length >= count ? filtered : arr;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function buildTimeCondition(minutes) {
    return {
        id: `time-${minutes}`,
        text: `Tiempo límite: ${minutes} minuto${minutes === 1 ? '' : 's'}`,
        minutes
    };
}

function buildChallengeFromBoss(boss) {
    const mediumConditions = pickCompatibleConditions(MEDIUM_CONDITIONS, 2);

    const hardPool = HARD_CONDITIONS_BY_TYPE[boss.type] || [];
    const compatibleHardPool = hardPool.filter(candidate =>
        areConditionsCompatible(mediumConditions, candidate)
    );

    const hardCondition = compatibleHardPool.length
        ? pickRandom(compatibleHardPool)
        : pickRandom(hardPool);

    const timeLimit = boss.defaultTimeLimit || 6;
    const timeCondition = buildTimeCondition(timeLimit);

    const titleBase = pickRandom(TITLE_BY_TYPE[boss.type] || ['Prueba Especial']);

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
        mediumConditions: mediumConditions.map(item => item.text),
        hardCondition: hardCondition.text,
        conditions: [
            ...mediumConditions.map(item => item.text),
            hardCondition.text
        ],
        timeText: timeCondition.text
    };
}

function areConditionsCompatible(selected, candidate) {
    if (!candidate) return false;

    for (const condition of selected) {
        const conflictA = condition.conflictsWith || [];
        const conflictB = candidate.conflictsWith || [];

        if (conflictA.includes(candidate.id) || conflictB.includes(condition.id)) {
            return false;
        }
    }

    return true;
}

function pickCompatibleConditions(pool, count) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = [];

    for (const candidate of shuffled) {
        if (selected.length >= count) break;

        if (areConditionsCompatible(selected, candidate)) {
            selected.push(candidate);
        }
    }

    return selected;
}