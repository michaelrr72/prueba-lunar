const POOL = [
    // ── COMBATE ──────────────────────────────────────────────────────────────
    {
        type: 'combat', tag: 'Combate', tagClass: 'tag-combat',
        diff: 'extremo', diffClass: 'diff-extremo', diffLabel: '☠ EXTREMO',
        enemy: 'Vivianne del Lago', enemyIcon: '💧', region: 'Fontaine · Leyenda Local',
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
        type: 'combat', tag: 'Combate', tagClass: 'tag-combat',
        diff: 'extremo', diffClass: 'diff-extremo', diffLabel: '☠ EXTREMO',
        enemy: 'Rocky Avildsen', enemyIcon: '🥊', region: 'Fontaine · Leyenda Local',
        title: 'El Último Round',
        desc: 'Derrota a Rocky Avildsen. No tiene elemento, así que no hay debilidad fácil que explotar. En su fase de furia, sus puñetazos pueden eliminar personajes al instante y se vuelve mucho más agresivo.',
        tip: 'Paciencia. Sus ataques telegrafían bien. En fase furiosa, prioriza esquivar sobre atacar. Sin debilidad elemental, el DPS puro es tu única herramienta.',
        conditions: [
            'Sin comida durante el combate',
            'El equipo debe elegirse antes de entrar — sin cambios después',
            'Si un personaje cae en la fase de furia, el reto se considera fallido'
        ]
    },
    {
        type: 'combat', tag: 'Combate', tagClass: 'tag-combat',
        diff: 'dificil', diffClass: 'diff-dificil', diffLabel: '⚔ DIFÍCIL',
        enemy: 'Liam, el Arcoíris Fugaz', enemyIcon: '🎸', region: 'Fontaine · Leyenda Local',
        title: 'La Balada del Caos',
        desc: 'Derrota a Liam. Controla el campo de batalla con molotovs y pociones que generan reacciones Overloaded devastadoras en el suelo. Su movilidad lo hace muy difícil de fijar.',
        tip: 'Empapa el suelo con Hydro antes de que lance sus pociones para neutralizar el Overloaded. Si un personaje está infligido con Pyro o Electro, cámbialo inmediatamente.',
        conditions: [
            'Sin usar Anemo en sus skills para dispersar sus áreas de daño',
            'El combate no puede interrumpirse — sin salir del rango de combate',
            'Máximo 1 personaje caído permitido en todo el intento'
        ]
    },
    {
        type: 'combat', tag: 'Combate', tagClass: 'tag-combat',
        diff: 'extremo', diffClass: 'diff-extremo', diffLabel: '☠ EXTREMO',
        enemy: 'Polychrome Tri-Stars', enemyIcon: '🔺', region: 'Natlan · Leyenda Local',
        title: 'Los Tres Agentes Fatui',
        desc: 'Derrota a los tres Agentes Fatui simultáneamente. Cada uno tiene un escudo elemental distinto (Sidorenko = Cryo, Vasily = Pyro, Nomokonov = Electro). Sin los elementos correctos, el combate se convierte en algo casi interminable.',
        tip: 'Necesitas al menos 3 elementos para romper los 3 escudos. Un equipo de 4 elementos mixtos es lo ideal. Enfócate en uno a la vez.',
        conditions: [
            'Debes derrotar a los tres en un único intento sin morir',
            'Sin pociones de daño ni comida ofensiva durante el combate',
            'Si caen 2 personajes, el reto se da por fallido aunque ganes'
        ]
    },
    {
        type: 'combat', tag: 'Combate', tagClass: 'tag-combat',
        diff: 'extremo', diffClass: 'diff-extremo', diffLabel: '☠ EXTREMO',
        enemy: 'Cocijo', enemyIcon: '⚡', region: 'Natlan · Leyenda Local',
        title: 'Antes del Sello de Trueno',
        desc: 'Derrota a Cocijo antes de que active su escudo Thunderthorn Ward. Solo acepta 34 instancias de daño antes de activarlo — si no lo eliminas rápido, la pelea se vuelve casi imposible.',
        tip: 'Burst de daño en los primeros segundos. Pyro rompe sus escudos rápido. Usa reacciones como Melt o Vaporize. Come y toma pociones ANTES de entrar.',
        conditions: [
            'Debes derrotarlo antes de que active el escudo por primera vez — si lo activa, reto fallido',
            'Sin bajar nivel de mundo',
            'Screenshot del intento para verificar que el escudo nunca se activó'
        ]
    },
    {
        type: 'combat', tag: 'Combate', tagClass: 'tag-combat',
        diff: 'dificil', diffClass: 'diff-dificil', diffLabel: '⚔ DIFÍCIL',
        enemy: '"He Never Dies"', enemyIcon: '🐾', region: 'Natlan · Prueba de la Noche',
        title: 'El Capibara de la Muerte',
        desc: 'Derrota al capibara He Never Dies. Parece inofensivo, pero si lo dejas acumular suficiente energía desata una técnica definitiva devastadora. Es una Leyenda Local de Natlan dentro del modo Prueba de la Noche.',
        tip: 'Equipos de crowd control (aturdimiento) funcionan bien. Reacciones Overloaded y ataques de caída son efectivos. No lo subestimes.',
        conditions: [
            'Si el capibara activa su técnica definitiva en algún momento, reto fallido automáticamente',
            'Las reglas del modo Prueba de la Noche aplican durante el combate',
            'Ningún personaje puede caer durante el intento'
        ]
    },

    // ── SIN DAÑO ─────────────────────────────────────────────────────────────
    {
        type: 'nohit', tag: 'Sin daño', tagClass: 'tag-nohit',
        diff: 'extremo', diffClass: 'diff-extremo', diffLabel: '☠ EXTREMO',
        enemy: 'Vivianne del Lago', enemyIcon: '💧', region: 'Fontaine · Leyenda Local',
        title: 'Danza Sobre el Agua',
        desc: 'Derrota a Vivianne del Lago sin que ningún personaje reciba daño directo. Sus cañones hacen tracking activo y su rayo es casi instantáneo — tienes que esquivar todo el tiempo.',
        tip: 'Zhongli escudo + Geo equipo = cristalizar cada golpe sin recibir daño. Sin curación porque si necesitas curar, algo ya salió muy mal.',
        conditions: [
            'La barra de vida de todos los personajes debe terminar intacta (al 100%)',
            'Escudos permitidos — curarse NO',
            'Grabación obligatoria para verificar el resultado'
        ]
    },
    {
        type: 'nohit', tag: 'Sin daño', tagClass: 'tag-nohit',
        diff: 'extremo', diffClass: 'diff-extremo', diffLabel: '☠ EXTREMO',
        enemy: 'Rocky Avildsen', enemyIcon: '🥊', region: 'Fontaine · Leyenda Local',
        title: 'Cero Golpes, Cero Excusas',
        desc: 'Derrota a Rocky Avildsen sin recibir ningún golpe — incluyendo toda su fase de furia. Sus puñetazos tienen hitbox grandes y erráticas. Es probablemente el reto de no-hit más difícil del overworld.',
        tip: 'Este reto requiere memorizar sus patrones. Sus ataques tienen wind-up claro. Aprende a leerlos antes de intentarlo en serio.',
        conditions: [
            'Ningún golpe directo permitido en ningún momento',
            'Sin curarse en ningún momento del combate',
            'Un solo intento válido — si recibes daño, se declara fallido'
        ]
    },
    {
        type: 'nohit', tag: 'Sin daño', tagClass: 'tag-nohit',
        diff: 'dificil', diffClass: 'diff-dificil', diffLabel: '⚔ DIFÍCIL',
        enemy: 'Rilai', enemyIcon: '🎵', region: 'Natlan · Leyenda Local',
        title: 'Sin Toque de Fusion Nova',
        desc: 'Derrota a Rilai sin ser golpeado por ninguno de sus ataques Fusion Nova. No puedes usar escudos ni I-frames para absorberlos — si el ataque toca a un personaje de cualquier forma, se cuenta como impacto.',
        tip: 'Esta es exactamente la condición del segundo logro de Rilai en el juego. Estudia el patrón de sus Fusion Novas y aprende cuándo esquivar.',
        conditions: [
            'Ningún ataque Fusion Nova puede impactar a ningún personaje del equipo',
            'Escudos e I-frames NO cuentan como evasión — el ataque no debe tocar al personaje',
            'Grabación para verificar cada ataque esquivado'
        ]
    },

    // ── RESTRICCIÓN ──────────────────────────────────────────────────────────
    {
        type: 'restriction', tag: 'Restricción', tagClass: 'tag-restriction',
        diff: 'dificil', diffClass: 'diff-dificil', diffLabel: '⚔ DIFÍCIL',
        enemy: 'Polychrome Tri-Stars', enemyIcon: '🔺', region: 'Natlan · Leyenda Local',
        title: 'Mono Elemento Contra Tres Escudos',
        desc: 'Derrota a los Polychrome Tri-Stars usando solo personajes de un único elemento. Con un solo elemento, tienes que gestionar creativamente cómo romper los tres escudos distintos.',
        tip: 'Pyro es la opción más versátil: rompe Cryo directamente, reacciona con Electro (Overloaded). Geo ignora escudos pero es lento.',
        conditions: [
            'Anuncia el elemento antes de empezar — sin cambiar',
            'Los 4 personajes deben ser del mismo elemento',
            'Ningún personaje puede caer durante el combate'
        ]
    },
    {
        type: 'restriction', tag: 'Restricción', tagClass: 'tag-restriction',
        diff: 'dificil', diffClass: 'diff-dificil', diffLabel: '⚔ DIFÍCIL',
        enemy: 'Liam, el Arcoíris Fugaz', enemyIcon: '🎸', region: 'Fontaine · Leyenda Local',
        title: 'El Guerrero Solitario',
        desc: 'Derrota a Liam con un solo personaje activo durante todo el combate. No puedes cambiar de personaje — el elegido debe terminar solo lo que empieza, frente a uno de los Leyendas más difíciles de Fontaine.',
        tip: 'Noelle (auto-cura en burst, escudo) o Hu Tao (burst damage extremo) son buenas opciones. Planea antes de entrar.',
        conditions: [
            'Anuncia el personaje elegido antes de entrar — sin cambios posibles',
            'Si el personaje único cae, reto fallido',
            'Sin comida ni pociones durante el combate'
        ]
    },
    {
        type: 'restriction', tag: 'Restricción', tagClass: 'tag-restriction',
        diff: 'medio', diffClass: 'diff-medio', diffLabel: '★ MEDIO',
        enemy: 'Cocijo', enemyIcon: '⚡', region: 'Natlan · Leyenda Local',
        title: 'Sin el Favor del Rayo',
        desc: 'Derrota a Cocijo sin usar ningún personaje Electro ni Pyro. Esos son los elementos más efectivos contra él — sin ellos, tienes que encontrar otra forma de hacer el daño suficiente antes del escudo.',
        tip: 'Hydro + Cryo para Freeze, o Dendro para Bloom. Geo puro también funciona aunque es más lento. El tiempo es tu enemigo.',
        conditions: [
            'Cero personajes Electro o Pyro en el equipo',
            'Sin bajar el nivel de mundo',
            'El escudo no puede activarse — si lo hace, reto fallido'
        ]
    },

    // ── SPEEDRUN ─────────────────────────────────────────────────────────────
    {
        type: 'speedrun', tag: 'Speedrun', tagClass: 'tag-speedrun',
        diff: 'dificil', diffClass: 'diff-dificil', diffLabel: '⚔ DIFÍCIL',
        enemy: 'Ninianne + Vivianne del Lago', enemyIcon: '⏱', region: 'Fontaine · Dos Leyendas Locales',
        title: 'Las Dos Pesadillas',
        desc: 'Derrota a Ninianne del Lago y luego a Vivianne del Lago en menos de 12 minutos totales, sin cerrar el juego entre las dos peleas. Pelear a dos Leyendas seguidas agota recursos rápido.',
        tip: 'Empieza por Ninianne — es la más fácil de las dos. Conserva curaciones y pociones para Vivianne. Dendro o Pyro para ambas.',
        conditions: [
            'Tiempo desde el primer ataque a Ninianne hasta la caída de Vivianne: máximo 12 min',
            'Sin cerrar el juego ni visitar una Estatua de los Siete entre peleas',
            'Screenshot del reloj al inicio y al final para validar'
        ]
    },
    {
        type: 'speedrun', tag: 'Speedrun', tagClass: 'tag-speedrun',
        diff: 'extremo', diffClass: 'diff-extremo', diffLabel: '☠ EXTREMO',
        enemy: 'Rocky Avildsen', enemyIcon: '🥊', region: 'Fontaine · Leyenda Local',
        title: 'Nocaut en 3 Minutos',
        desc: 'Derrota a Rocky Avildsen incluyendo su fase de furia en menos de 3 minutos. Su barra de vida es enorme y sin debilidad elemental, esto es un test de DPS puro bajo presión extrema.',
        tip: 'Necesitas el equipo de mayor burst del juego. Melt, Vaporize o Hyperbloom. No hay tiempo para errores ni para curarse.',
        conditions: [
            'Temporizador visible durante todo el combate (reloj del sistema o app externa)',
            'Sin pausar el juego durante el intento',
            'La fase de furia debe activarse Y superarse dentro del tiempo límite'
        ]
    }
];
