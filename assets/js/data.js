const POOL = [
    {
        type: 'combat',
        tag: 'Combate',
        tagClass: 'tag-combat',
        diff: 'extremo',
        diffClass: 'diff-extremo',
        diffLabel: '☠ EXTREMO',
        enemy: 'Vivianne del Lago',
        enemyIcon: '💧',
        region: 'Fontaine · Leyenda Local',
        title: 'La Pesadilla del Lago',
        desc: 'Derrota a Vivianne del Lago. Su rayo de agua y sus cañones pueden eliminar personajes de un solo golpe. Tiene una de las barras de vida más grandes entre todas las Leyendas Locales del juego.',
        tip: 'Hydro no funciona — es inmune. Dendro o Pyro son las mejores opciones. Un escudo Zhongli es casi obligatorio. Ten curaciones de reserva.',
        conditions: [
            'Sin usar pociones de daño ni comida de ataque durante el combate',
            'El combate debe grabarse o documentarse con screenshots del inicio y el fin',
            'No se permite bajar el nivel de mundo para facilitar la pelea'
        ]
    },

    {
        type: 'combat',
        tag: 'Combate',
        tagClass: 'tag-combat',
        diff: 'extremo',
        diffClass: 'diff-extremo',
        diffLabel: '☠ EXTREMO',
        enemy: 'Rocky Avildsen',
        enemyIcon: '🥊',
        region: 'Fontaine · Leyenda Local',
        title: 'El Último Round',
        desc: 'Derrota a Rocky Avildsen. No tiene elemento, así que no hay debilidad fácil que explotar. En su fase de furia, sus puñetazos pueden eliminar personajes al instante y se vuelve mucho más agresivo.',
        tip: 'Paciencia. Sus ataques telegrafían bien. En fase furiosa, prioriza esquivar sobre atacar. Sin debilidad elemental, el DPS puro es tu única herramienta.',
        conditions: [
            'Sin comida durante el combate',
            'El equipo debe elegirse antes de entrar — sin cambios después',
            'Si un personaje cae en la fase de furia, el reto se considera fallido'
        ]
    }

    /* Pega aquí el resto completo de tus retos */
];