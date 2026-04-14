export const BOSS_POOL = [
	{
		id: 'vivianne-del-lago',
		name: 'Vivianne del Lago',
		region: 'Fontaine · Leyenda Local',
		element: 'Hydro',
		difficulty: 'extremo',
		icon: '💧',
		tip: 'Evita intercambios largos frente a frente.\nAprovecha ventanas cortas con ráfagas de daño y reposiciona.',
		conditions: [
			{ text: 'No usar consumibles de curación durante el combate', type: 'regla' },
			{ text: 'Recibir 3 golpes directos cuenta como derrota de ronda', type: 'penalizacion' },
			{ text: 'Validar victoria solo al aparecer la pantalla de recompensa', type: 'validacion' }
		]
	},
	{
		id: 'rocky-avildsen',
		name: 'Rocky Avildsen',
		region: 'Fontaine · Leyenda Local',
		element: 'Hydro',
		difficulty: 'extremo',
		icon: '🥊',
		tip: 'Cuando entra en furia, prioriza esquivar y castigar al final del combo.\nNo gastes habilidades clave fuera de ventana segura.',
		conditions: [
			{ text: 'Solo se permite burst durante ventanas de castigo claras', type: 'regla' },
			{ text: 'Si fallas una ventana y quedas expuesto, resta 1 punto de ronda', type: 'penalizacion' },
			{ text: 'El juez confirma que no hubo reinicio de combate', type: 'validacion' }
		]
	},
	{
		id: 'liam-arcoiris-fugaz',
		name: 'Liam, el Arcoíris Fugaz',
		region: 'Fontaine · Leyenda Local',
		element: 'Hydro',
		difficulty: 'dificil',
		icon: '🎸',
		tip: 'Mantén movilidad constante para evitar sus zonas de control.\nAtaca durante sus desplazamientos largos.',
		conditions: [
			{ text: 'No permanecer más de 3 segundos seguidos en la misma zona', type: 'regla' },
			{ text: 'Cada atrapada en zona peligrosa suma 5 segundos al tiempo final', type: 'penalizacion' },
			{ text: 'Registrar clear con cronómetro visible', type: 'validacion' }
		]
	},
	{
		id: 'polychrome-tri-stars',
		name: 'Polychrome Tri-Stars',
		region: 'Natlan · Leyenda Local',
		element: null,
		difficulty: 'extremo',
		icon: '🌈',
		tip: 'Identifica rápido el objetivo prioritario y evita sobreextenderte.\nControlar el foco de daño es más importante que el DPS bruto.',
		conditions: [
			{ text: 'Eliminar primero al objetivo marcado por sorteo', type: 'regla' },
			{ text: 'Cambiar objetivo antes de tiempo invalida el intento', type: 'penalizacion' },
			{ text: 'Confirmar orden de bajas al finalizar la ronda', type: 'validacion' }
		]
	},
	{
		id: 'cocijo',
		name: 'Cocijo',
		region: 'Natlan · Leyenda Local',
		element: 'Electro',
		difficulty: 'extremo',
		icon: '⚡',
		tip: 'Juega alrededor de cambios de polaridad y conserva stamina.\nSi pierdes posicionamiento, prioriza sobrevivir antes que forzar daño.',
		conditions: [
			{ text: 'No usar revive ni comida de resurrección', type: 'regla' },
			{ text: 'Morir una vez cierra automáticamente la ronda', type: 'penalizacion' },
			{ text: 'El combate debe iniciar y terminar sin teletransporte', type: 'validacion' }
		]
	},
	{
		id: 'he-never-dies',
		name: 'He Never Dies',
		region: 'Natlan · Leyenda Local',
		element: 'Pyro',
		difficulty: 'dificil',
		icon: '🔥',
		tip: 'Gestiona recursos para sus fases de aguante y no aceleres de más.\nEl control del ritmo evita errores acumulados.',
		conditions: [
			{ text: 'Mantener al menos 1 habilidad defensiva para fase final', type: 'regla' },
			{ text: 'Entrar en fase final sin recurso defensivo suma penalización de tiempo', type: 'penalizacion' },
			{ text: 'Verificar clear completo, sin abandonar zona de combate', type: 'validacion' }
		]
	},
	{
		id: 'rilai',
		name: 'Rilai',
		region: 'Natlan · Leyenda Local',
		element: 'Cryo',
		difficulty: 'dificil',
		icon: '🎵',
		tip: 'Sus patrones castigan errores de timing.\nJuega seguro en sus primeros ciclos y acelera solo cuando leas el patrón.',
		conditions: [
			{ text: 'No recibir control consecutivo de habilidades de área', type: 'regla' },
			{ text: 'Dos controles seguidos implican derrota de intento', type: 'penalizacion' },
			{ text: 'Validar intento con evidencia de inicio limpio del combate', type: 'validacion' }
		]
	},
	{
		id: 'ninianne-del-lago',
		name: 'Ninianne del Lago',
		region: 'Fontaine · Leyenda Local',
		element: 'Hydro',
		difficulty: 'dificil',
		icon: '🌊',
		tip: 'Castiga poco al inicio y mucho en ventana especial.\nGuarda daño para su fase vulnerable.',
		conditions: [
			{ text: 'Usar ultimate principal solo en ventana vulnerable', type: 'regla' },
			{ text: 'Gastar ultimate fuera de ventana añade 10 segundos', type: 'penalizacion' },
			{ text: 'Confirmar tiempo final con captura o juez', type: 'validacion' }
		]
	},
	{
		id: 'yseut',
		name: 'Yseut',
		region: 'Fontaine · Leyenda Local',
		element: 'Cryo',
		difficulty: 'dificil',
		icon: '❄️',
		tip: 'Aprende su secuencia completa y evita improvisar en cadena.\nUn error suele abrir la puerta al siguiente.',
		conditions: [
			{ text: 'No fallar esquiva en su secuencia final', type: 'regla' },
			{ text: 'Fallar la secuencia final invalida la ronda', type: 'penalizacion' },
			{ text: 'El juez verifica que no hubo pausa del juego', type: 'validacion' }
		]
	},
	{
		id: 'automated-field-generator',
		name: 'Automated Supercomputing Field Generator',
		region: 'Fontaine · Leyenda Local',
		element: null,
		difficulty: 'medio',
		icon: '⚙️',
		tip: 'Prioriza la mecánica del campo antes del daño al objetivo.\nResolver bien la secuencia reduce mucho la presión.',
		conditions: [
			{ text: 'Resolver al menos una secuencia de campo sin errores', type: 'regla' },
			{ text: 'Cada error de secuencia agrega una penalización de 5 segundos', type: 'penalizacion' },
			{ text: 'Anotar en acta cuántas secuencias se completaron', type: 'validacion' }
		]
	}
];