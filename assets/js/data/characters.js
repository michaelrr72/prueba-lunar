/**
 * Prueba Lunar — Dataset de personajes jugables de Genshin Impact
 * ===================================================================
 * Actualizado hasta Version 6.6 "Luna VII" (lanzada 20-may-2026).
 *
 * IMPORTANTE: los roles primario/secundario son una aproximación
 * basada en consenso comunitario y están pensados para alimentar al
 * generador de equipos balanceados. Algunos personajes (Yelan,
 * Furina, Bennett) son intencionalmente flexibles — si una asignación
 * concreta no te encaja, edítala directamente en este archivo.
 *
 * Estructura de cada entrada:
 *   id          – slug único (lowercase, sin espacios)
 *   name        – nombre canónico en inglés
 *   nameEs      – nombre como aparece en HoYoLAB en español (sirve
 *                 para el matching del texto pegado por el usuario)
 *   element     – pyro | hydro | anemo | electro | dendro | cryo | geo
 *   weapon      – sword | claymore | polearm | bow | catalyst
 *   rarity      – 4 | 5
 *   region      – mondstadt | liyue | inazuma | sumeru | fontaine 
 *                 | natlan | nod-krai | snezhnaya | other
 *   version     – versión de salida ("1.0", "6.6", etc.)
 *   roles       – { primary, secondary }
 *                 dps | sub-dps | support | healer
 *   iconSlug    – slug para construir la URL del retrato en jmp.blue
 *                 (null cuando aún no está en el CDN público)
 */

(function attachCharacters(global) {
  'use strict';

  const ELEMENTS = ['pyro', 'hydro', 'anemo', 'electro', 'dendro', 'cryo', 'geo'];
  const WEAPONS = ['sword', 'claymore', 'polearm', 'bow', 'catalyst'];
  const REGIONS = ['mondstadt', 'liyue', 'inazuma', 'sumeru', 'fontaine', 'natlan', 'nod-krai', 'snezhnaya', 'other'];
  const ROLES = ['dps', 'sub-dps', 'support', 'healer'];

  // Etiquetas en español para la UI.
  const ELEMENT_LABELS = {
    pyro: 'Pyro', hydro: 'Hydro', anemo: 'Anemo', electro: 'Electro',
    dendro: 'Dendro', cryo: 'Cryo', geo: 'Geo'
  };
  const ELEMENT_COLORS = {
    pyro: '#ef7637', hydro: '#3fb1e3', anemo: '#74c2a8', electro: '#af8ec1',
    dendro: '#7cbb3a', cryo: '#9fd7df', geo: '#f7a72c'
  };
  // Símbolos compactos por elemento (usados como fallback cuando el
  // retrato del CDN no carga). No son los iconos oficiales del juego;
  // son glifos universales en negro/blanco que se ven bien sobre
  // cualquier fondo.
  const ELEMENT_GLYPHS = {
    pyro: '✦', hydro: '❍', anemo: '✺', electro: '✧',
    dendro: '✿', cryo: '❄', geo: '◆'
  };
  const WEAPON_LABELS = {
    sword: 'Espada', claymore: 'Mandoble', polearm: 'Lanza',
    bow: 'Arco', catalyst: 'Catalizador'
  };
  const REGION_LABELS = {
    mondstadt: 'Mondstadt', liyue: 'Liyue', inazuma: 'Inazuma',
    sumeru: 'Sumeru', fontaine: 'Fontaine', natlan: 'Natlan',
    'nod-krai': 'Nod-Krai', 'snezhnaya': 'Snezhnaya', other: 'Otros'
  };
  const ROLE_LABELS = {
    dps: 'DPS principal', 'sub-dps': 'Sub-DPS',
    support: 'Support', healer: 'Sanador'
  };

  // Mini-helper para construir entradas de forma compacta. Mantiene
  // legibilidad sin tener que escribir un objeto enorme por personaje.
  //
  // groupId: agrupa variantes que ocupan el mismo "slot" en el equipo
  // (en la práctica, las 7 formas del Trotamundos). Si dos personajes
  // comparten groupId, el generador no los meterá juntos en el mismo
  // equipo.
  //
  // iconSlug: undefined → usa el id. null explícito → no intenta
  // cargar imagen (va directo al fallback). String → slug custom.
  function ch(id, name, nameEs, element, weapon, rarity, region, version, primary, secondary, iconSlug, groupId, enkaName) {
    return {
      id, name, nameEs,
      element, weapon, rarity, region, version,
      roles: { primary, secondary: secondary || null },
      iconSlug: iconSlug === undefined ? id : iconSlug,
      groupId: groupId || null,
      enkaName: enkaName || null
    };
  }

  // -------------------------------------------------------------------
  // Roster oficial (114 personajes a fecha de 6.6).
  // -------------------------------------------------------------------
  const CHARACTERS = [
    // ── Mondstadt (1.0+) ──────────────────────────────────────────────
    ch('amber', 'Amber', 'Amber', 'pyro', 'bow', 4, 'mondstadt', '1.0', 'sub-dps', 'support'),
    ch('barbara', 'Barbara', 'Barbara', 'hydro', 'catalyst', 4, 'mondstadt', '1.0', 'healer', 'support'),
    ch('kaeya', 'Kaeya', 'Kaeya', 'cryo', 'sword', 4, 'mondstadt', '1.0', 'sub-dps', 'support'),
    ch('lisa', 'Lisa', 'Lisa', 'electro', 'catalyst', 4, 'mondstadt', '1.0', 'sub-dps', 'support'),
    ch('jean', 'Jean', 'Jean', 'anemo', 'sword', 5, 'mondstadt', '1.0', 'healer', 'support'),
    ch('diluc', 'Diluc', 'Diluc', 'pyro', 'claymore', 5, 'mondstadt', '1.0', 'dps', 'sub-dps'),
    ch('venti', 'Venti', 'Venti', 'anemo', 'bow', 5, 'mondstadt', '1.0', 'support', 'sub-dps'),
    ch('klee', 'Klee', 'Klee', 'pyro', 'catalyst', 5, 'mondstadt', '1.0', 'dps', 'sub-dps'),
    ch('mona', 'Mona', 'Mona', 'hydro', 'catalyst', 5, 'mondstadt', '1.0', 'sub-dps', 'support'),
    ch('fischl', 'Fischl', 'Fischl', 'electro', 'bow', 4, 'mondstadt', '1.0', 'sub-dps', 'support'),
    ch('noelle', 'Noelle', 'Noelle', 'geo', 'claymore', 4, 'mondstadt', '1.0', 'dps', 'healer'),
    ch('razor', 'Razor', 'Razor', 'electro', 'claymore', 4, 'mondstadt', '1.0', 'dps', 'sub-dps'),
    ch('sucrose', 'Sucrose', 'Sacarosa', 'anemo', 'catalyst', 4, 'mondstadt', '1.0', 'support', 'sub-dps'),
    ch('bennett', 'Bennett', 'Bennett', 'pyro', 'sword', 4, 'mondstadt', '1.0', 'support', 'sub-dps'),
    ch('diona', 'Diona', 'Diona', 'cryo', 'bow', 4, 'mondstadt', '1.1', 'healer', 'support'),
    ch('albedo', 'Albedo', 'Albedo', 'geo', 'sword', 5, 'mondstadt', '1.2', 'sub-dps', 'support'),
    ch('rosaria', 'Rosaria', 'Rosaria', 'cryo', 'polearm', 4, 'mondstadt', '1.4', 'sub-dps', 'support'),
    ch('eula', 'Eula', 'Eula', 'cryo', 'claymore', 5, 'mondstadt', '1.5', 'dps', null),
    ch('kazuha', 'Kaedehara Kazuha', 'Kaedehara Kazuha', 'anemo', 'sword', 5, 'mondstadt', '1.6', 'support', 'sub-dps', 'kazuha'),
    ch('mika', 'Mika', 'Mika', 'cryo', 'polearm', 4, 'mondstadt', '3.5', 'support', null),

    // ── Liyue (1.0+) ──────────────────────────────────────────────────
    ch('xiangling', 'Xiangling', 'Xiangling', 'pyro', 'polearm', 4, 'liyue', '1.0', 'sub-dps', 'dps'),
    ch('xingqiu', 'Xingqiu', 'Xingqiu', 'hydro', 'sword', 4, 'liyue', '1.0', 'sub-dps', 'support'),
    ch('beidou', 'Beidou', 'Beidou', 'electro', 'claymore', 4, 'liyue', '1.0', 'sub-dps', 'dps'),
    ch('ningguang', 'Ningguang', 'Ningguang', 'geo', 'catalyst', 4, 'liyue', '1.0', 'sub-dps', 'dps'),
    ch('chongyun', 'Chongyun', 'Chongyun', 'cryo', 'claymore', 4, 'liyue', '1.0', 'sub-dps', 'support'),
    ch('qiqi', 'Qiqi', 'Qiqi', 'cryo', 'sword', 5, 'liyue', '1.0', 'healer', null),
    ch('keqing', 'Keqing', 'Keqing', 'electro', 'sword', 5, 'liyue', '1.0', 'dps', 'sub-dps'),
    ch('tartaglia', 'Tartaglia', 'Tartaglia', 'hydro', 'bow', 5, 'snezhnaya', '1.1', 'dps', 'sub-dps'),
    ch('zhongli', 'Zhongli', 'Zhongli', 'geo', 'polearm', 5, 'liyue', '1.1', 'support', 'sub-dps'),
    ch('xinyan', 'Xinyan', 'Xinyan', 'pyro', 'claymore', 4, 'liyue', '1.1', 'support', 'sub-dps'),
    ch('ganyu', 'Ganyu', 'Ganyu', 'cryo', 'bow', 5, 'liyue', '1.2', 'dps', 'sub-dps'),
    ch('xiao', 'Xiao', 'Xiao', 'anemo', 'polearm', 5, 'liyue', '1.3', 'dps', null),
    ch('hutao', 'Hu Tao', 'Hu Tao', 'pyro', 'polearm', 5, 'liyue', '1.3', 'dps', null, 'hu-tao'),
    ch('yanfei', 'Yanfei', 'Yanfei', 'pyro', 'catalyst', 4, 'liyue', '1.5', 'dps', 'sub-dps'),
    ch('yunjin', 'Yun Jin', 'Yun Jin', 'geo', 'polearm', 4, 'liyue', '2.4', 'support', 'sub-dps', 'yun-jin'),
    ch('shenhe', 'Shenhe', 'Shenhe', 'cryo', 'polearm', 5, 'liyue', '2.4', 'support', 'sub-dps'),
    ch('yelan', 'Yelan', 'Yelan', 'hydro', 'bow', 5, 'liyue', '2.7', 'sub-dps', 'support'),
    ch('yaoyao', 'Yaoyao', 'Yaoyao', 'dendro', 'polearm', 4, 'liyue', '3.4', 'healer', 'support'),
    ch('baizhu', 'Baizhu', 'Baizhu', 'dendro', 'catalyst', 5, 'liyue', '3.6', 'healer', 'support'),
    ch('gaming', 'Gaming', 'Gaming', 'pyro', 'claymore', 4, 'liyue', '4.4', 'dps', 'sub-dps'),
    ch('xianyun', 'Xianyun', 'Xianyun', 'anemo', 'catalyst', 5, 'liyue', '4.4', 'healer', 'support'),
    ch('chiori', 'Chiori', 'Chiori', 'geo', 'sword', 5, 'inazuma', '4.5', 'sub-dps', 'dps'),

    // ── Inazuma (2.0+) ────────────────────────────────────────────────
    ch('ayaka', 'Kamisato Ayaka', 'Kamisato Ayaka', 'cryo', 'sword', 5, 'inazuma', '2.0', 'dps', null, 'ayaka'),
    ch('sayu', 'Sayu', 'Sayu', 'anemo', 'claymore', 4, 'inazuma', '2.0', 'support', 'healer'),
    ch('yoimiya', 'Yoimiya', 'Yoimiya', 'pyro', 'bow', 5, 'inazuma', '2.0', 'dps', null),
    ch('aloy', 'Aloy', 'Aloy', 'cryo', 'bow', 5, 'other', '2.1', 'dps', 'sub-dps'),
    ch('raidenshogun', 'Raiden Shogun', 'Shogun Raiden', 'electro', 'polearm', 5, 'inazuma', '2.1', 'sub-dps', 'dps', 'raiden', null, 'Shougun'),
    ch('kujousara', 'Kujou Sara', 'Kujou Sara', 'electro', 'bow', 4, 'inazuma', '2.1', 'support', 'sub-dps', 'sara'),
    ch('kokomi', 'Sangonomiya Kokomi', 'Kokomi', 'hydro', 'catalyst', 5, 'inazuma', '2.1', 'healer', 'sub-dps', 'kokomi'),
    ch('thoma', 'Thoma', 'Thoma', 'pyro', 'polearm', 4, 'inazuma', '2.2', 'support', 'sub-dps'),
    ch('itto', 'Arataki Itto', 'Arataki Itto', 'geo', 'claymore', 5, 'inazuma', '2.3', 'dps', null, 'arataki-itto'),
    ch('gorou', 'Gorou', 'Gorou', 'geo', 'bow', 4, 'inazuma', '2.3', 'support', null),
    ch('yaemiko', 'Yae Miko', 'Yae Miko', 'electro', 'catalyst', 5, 'inazuma', '2.5', 'sub-dps', 'dps', 'yae-miko'),
    ch('ayato', 'Kamisato Ayato', 'Kamisato Ayato', 'hydro', 'sword', 5, 'inazuma', '2.6', 'dps', 'sub-dps', 'ayato'),
    ch('kukishinobu', 'Kuki Shinobu', 'Kuki Shinobu', 'electro', 'sword', 4, 'inazuma', '2.7', 'sub-dps', 'healer', 'kuki-shinobu'),
    ch('heizou', 'Shikanoin Heizou', 'Shikanoin Heizou', 'anemo', 'catalyst', 4, 'inazuma', '2.8', 'dps', 'sub-dps', 'shikanoin-heizou'),
    ch('wanderer', 'Wanderer', 'Errante', 'anemo', 'catalyst', 5, 'sumeru', '3.3', 'dps', null),
    ch('kirara', 'Kirara', 'Kirara', 'dendro', 'sword', 4, 'inazuma', '3.7', 'support', 'kirara'),
    ch('yumemizukimizuki', 'Yumemizuki Mizuki', 'Yumemizuki Mizuki', 'anemo', 'catalyst', 5, 'inazuma', '5.4', 'support', 'sub-dps', null, null, 'Mizuki'),

    // ── Sumeru (3.0+) ─────────────────────────────────────────────────
    ch('tighnari', 'Tighnari', 'Tighnari', 'dendro', 'bow', 5, 'sumeru', '3.0', 'dps', 'sub-dps'),
    ch('collei', 'Collei', 'Collei', 'dendro', 'bow', 4, 'sumeru', '3.0', 'sub-dps', 'support'),
    ch('dori', 'Dori', 'Dori', 'electro', 'claymore', 4, 'sumeru', '3.0', 'support', 'healer'),
    ch('cyno', 'Cyno', 'Cyno', 'electro', 'polearm', 5, 'sumeru', '3.1', 'dps', null),
    ch('candace', 'Candace', 'Candace', 'hydro', 'polearm', 4, 'sumeru', '3.1', 'support', 'sub-dps'),
    ch('nilou', 'Nilou', 'Nilou', 'hydro', 'sword', 5, 'sumeru', '3.1', 'sub-dps', 'support'),
    ch('nahida', 'Nahida', 'Nahida', 'dendro', 'catalyst', 5, 'sumeru', '3.2', 'sub-dps', 'support'),
    ch('layla', 'Layla', 'Layla', 'cryo', 'sword', 4, 'sumeru', '3.2', 'support', 'sub-dps'),
    ch('faruzan', 'Faruzan', 'Faruzan', 'anemo', 'bow', 4, 'sumeru', '3.3', 'support', 'sub-dps'),
    ch('alhaitham', 'Alhaitham', 'Alhaitham', 'dendro', 'sword', 5, 'sumeru', '3.4', 'dps', 'sub-dps'),
    ch('dehya', 'Dehya', 'Dehya', 'pyro', 'claymore', 5, 'sumeru', '3.5', 'sub-dps', 'support'),
    ch('kaveh', 'Kaveh', 'Kaveh', 'dendro', 'claymore', 4, 'sumeru', '3.6', 'sub-dps', 'support'),
    ch('sethos', 'Sethos', 'Sethos', 'electro', 'bow', 4, 'sumeru', '4.7', 'sub-dps', 'dps'),

    // ── Fontaine (4.0+) ───────────────────────────────────────────────
    ch('lyney', 'Lyney', 'Lyney', 'pyro', 'bow', 5, 'fontaine', '4.0', 'dps', null),
    ch('lynette', 'Lynette', 'Lynette', 'anemo', 'sword', 4, 'fontaine', '4.0', 'support', 'sub-dps'),
    ch('freminet', 'Freminet', 'Freminet', 'cryo', 'claymore', 4, 'fontaine', '4.0', 'sub-dps', 'dps'),
    ch('neuvillette', 'Neuvillette', 'Neuvillette', 'hydro', 'catalyst', 5, 'fontaine', '4.1', 'dps', null),
    ch('wriothesley', 'Wriothesley', 'Wriothesley', 'cryo', 'catalyst', 5, 'fontaine', '4.1', 'dps', null),
    ch('furina', 'Furina', 'Furina', 'hydro', 'sword', 5, 'fontaine', '4.2', 'support', 'sub-dps'),
    ch('charlotte', 'Charlotte', 'Charlotte', 'cryo', 'catalyst', 4, 'fontaine', '4.2', 'sub-dps', 'support'),
    ch('navia', 'Navia', 'Navia', 'geo', 'claymore', 5, 'fontaine', '4.3', 'dps', null),
    ch('chevreuse', 'Chevreuse', 'Chevreuse', 'pyro', 'polearm', 4, 'fontaine', '4.3', 'support', 'sub-dps'),
    ch('clorinde', 'Clorinde', 'Clorinde', 'electro', 'sword', 5, 'fontaine', '4.7', 'dps', null),
    ch('arlecchino', 'Arlecchino', 'Arlecchino', 'pyro', 'polearm', 5, 'snezhnaya', '4.6', 'dps', null),
    ch('sigewinne', 'Sigewinne', 'Sigewinne', 'hydro', 'bow', 5, 'fontaine', '4.7', 'healer', 'support'),
    ch('emilie', 'Emilie', 'Emilie', 'dendro', 'polearm', 5, 'fontaine', '4.8', 'sub-dps', 'support'),

    // ── Natlan (5.0+) ─────────────────────────────────────────────────
    ch('kachina', 'Kachina', 'Kachina', 'geo', 'polearm', 4, 'natlan', '5.0', 'sub-dps', 'support'),
    ch('mualani', 'Mualani', 'Mualani', 'hydro', 'catalyst', 5, 'natlan', '5.0', 'dps', null),
    ch('kinich', 'Kinich', 'Kinich', 'dendro', 'claymore', 5, 'natlan', '5.0', 'dps', null),
    ch('xilonen', 'Xilonen', 'Xilonen', 'geo', 'sword', 5, 'natlan', '5.1', 'support', 'healer'),
    ch('chasca', 'Chasca', 'Chasca', 'anemo', 'bow', 5, 'natlan', '5.2', 'dps', 'sub-dps'),
    ch('ororon', 'Ororon', 'Ororón', 'electro', 'bow', 4, 'natlan', '5.2', 'sub-dps', 'support', null, null, 'Olorun'),
    ch('mavuika', 'Mavuika', 'Mavuika', 'pyro', 'claymore', 5, 'natlan', '5.3', 'dps', 'sub-dps'),
    ch('citlali', 'Citlali', 'Citlali', 'cryo', 'catalyst', 5, 'natlan', '5.3', 'support', 'sub-dps'),
    ch('lanyan', 'Lan Yan', 'Lan Yan', 'anemo', 'catalyst', 4, 'liyue', '5.3', 'support', 'sub-dps', null, null, 'Lanyan'),
    ch('iansan', 'Iansan', 'Iansan', 'electro', 'polearm', 4, 'natlan', '5.5', 'support', 'sub-dps', null),
    ch('varesa', 'Varesa', 'Varesa', 'electro', 'catalyst', 5, 'natlan', '5.5', 'dps', null, null),
    ch('ifa', 'Ifa', 'Ifa', 'anemo', 'catalyst', 4, 'natlan', '5.6', 'sub-dps', 'support', null),
    ch('escoffier', 'Escoffier', 'Escoffier', 'cryo', 'sword', 5, 'fontaine', '5.6', 'sub-dps', 'support', null),
    ch('dahlia', 'Dahlia', 'Dahlia', 'hydro', 'sword', 4, 'mondstadt', '5.7', 'support', 'sub-dps', null),
    ch('skirk', 'Skirk', 'Skirk', 'cryo', 'sword', 5, 'other', '5.7', 'dps', 'sub-dps', null, null, 'SkirkNew'),

    // ── Nod-Krai (6.0+) ───────────────────────────────────────────────
    ch('aino', 'Aino', 'Aino', 'hydro', 'claymore', 4, 'nod-krai', '6.0', 'sub-dps', 'dps', null),
    ch('lauma', 'Lauma', 'Lauma', 'dendro', 'catalyst', 5, 'nod-krai', '6.0', 'sub-dps', 'support', null),
    ch('flins', 'Flins', 'Flins', 'electro', 'polearm', 5, 'nod-krai', '6.0', 'dps', 'sub-dps', null),
    ch('nefer', 'Nefer', 'Nefer', 'dendro', 'catalyst', 5, 'nod-krai', '6.1', 'dps', 'sub-dps', null),
    ch('durin', 'Durin', 'Durin', 'pyro', 'sword', 5, 'mondstadt', '6.2', 'dps', 'sub-dps', null),
    ch('jahoda', 'Jahoda', 'Jahoda', 'anemo', 'bow', 4, 'nod-krai', '6.2', 'support', 'sub-dps', null),
    ch('columbina', 'Columbina', 'Colombina', 'hydro', 'catalyst', 5, 'nod-krai', '6.3', 'sub-dps', 'support', null),
    ch('illuga', 'Illuga', 'Illuga', 'geo', 'polearm', 4, 'nod-krai', '6.3', 'sub-dps', 'support', null),
    ch('zibai', 'Zibai', 'Zibai', 'geo', 'sword', 5, 'liyue', '6.3', 'dps', null, null),
    ch('ineffa', 'Ineffa', 'Ineffa', 'electro', 'polearm', 5, 'nod-krai', '6.3', 'sub-dps', 'support', null),
    ch('varka', 'Varka', 'Varka', 'anemo', 'claymore', 5, 'mondstadt', '6.4', 'dps', 'sub-dps', null),
    ch('linnea', 'Linnea', 'Linnea', 'geo', 'bow', 5, 'nod-krai', '6.5', 'sub-dps', 'support', null),
    ch('nicole', 'Nicole', 'Nicole', 'pyro', 'catalyst', 5, 'other', '6.6', 'sub-dps', 'support', null),
    ch('lohen', 'Lohen', 'Lohen', 'cryo', 'polearm', 5, 'mondstadt', '6.6', 'dps', 'sub-dps', null),
    ch('prune', 'Prune', 'Prune', 'anemo', 'catalyst', 4, 'mondstadt', '6.6', 'support', 'sub-dps', null),

    // ── Viajero (Traveler) y Manequíes ────────────────────────────
    ch('traveler-anemo', 'Aether/Lumine (Anemo)', 'Viajero (Anemo)', 'anemo', 'sword', 5, 'other', '1.0', 'support', 'sub-dps', 'traveler-anemo', 'traveler'),
    ch('traveler-geo', 'Aether/Lumine (Geo)', 'Viajero (Geo)', 'geo', 'sword', 5, 'other', '1.0', 'sub-dps', 'support', 'traveler-anemo', 'traveler'),
    ch('traveler-electro', 'Aether/Lumine (Electro)', 'Viajero (Electro)', 'electro', 'sword', 5, 'other', '2.0', 'sub-dps', 'support', 'traveler-anemo', 'traveler'),
    ch('traveler-dendro', 'Aether/Lumine (Dendro)', 'Viajero (Dendro)', 'dendro', 'sword', 5, 'other', '3.0', 'support', 'sub-dps', 'traveler-anemo', 'traveler'),
    ch('traveler-hydro', 'Aether/Lumine (Hydro)', 'Viajero (Hydro)', 'hydro', 'sword', 5, 'other', '4.0', 'support', 'healer', 'traveler-anemo', 'traveler'),
    ch('traveler-pyro', 'Aether/Lumine (Pyro)', 'Viajero (Pyro)', 'pyro', 'sword', 5, 'other', '5.0', 'dps', 'sub-dps', 'traveler-anemo', 'traveler'),
    //ch('traveler-cryo', 'Aether/Lumine (Cryo)', 'Viajero (Cryo)', 'cryo', 'sword', 5, 'other', '6.0', 'support', 'sub-dps', 'traveler-anemo', 'traveler'),
  ];

  // -------------------------------------------------------------------
  // Helpers de búsqueda + normalización
  // -------------------------------------------------------------------

  /**
   * Normaliza un string para comparación robusta: minúsculas, sin
   * tildes, sin signos de puntuación, sin espacios extras.
   */
  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')   // quita acentos
      .replace(/[^a-z0-9]+/g, ' ')       // quita puntuación
      .trim();
  }

  // Índice precomputado para acelerar findByName.
  const NAME_INDEX = new Map();
  CHARACTERS.forEach(c => {
    NAME_INDEX.set(normalize(c.id), c);
    NAME_INDEX.set(normalize(c.name), c);
    NAME_INDEX.set(normalize(c.nameEs), c);
  });
  // Aliases comunes (en HoYoLAB en español o en uso popular).
  const ALIASES = {
    'hutao': 'hutao', 'hu tao': 'hutao',
    'tartaglia': 'tartaglia', 'childe': 'tartaglia',
    'wanderer': 'wanderer', 'scaramouche': 'wanderer', 'errante': 'wanderer',
    'shogun raiden': 'raidenshogun', 'raiden': 'raidenshogun',
    'sangonomiya kokomi': 'kokomi',
    'arataki itto': 'itto',
    'kamisato ayaka': 'ayaka', 'ayaka': 'ayaka',
    'kamisato ayato': 'ayato',
    'kaedehara kazuha': 'kazuha',
    'shikanoin heizou': 'heizou',
    'sacarosa': 'sucrose',
    'colombina': 'columbina',
    'ororon': 'ororon',
    'trotamundos': 'traveler-anemo',
    'viajero': 'traveler-anemo',
    'aether': 'traveler-anemo',
    'lumine': 'traveler-anemo'
  };
  Object.entries(ALIASES).forEach(([alias, id]) => {
    const target = CHARACTERS.find(c => c.id === id);
    if (target) NAME_INDEX.set(normalize(alias), target);
  });

  /**
   * Devuelve el personaje cuyo nombre coincide (exacto o por alias)
   * con el input dado. null si no encuentra nada.
   */
  function findByName(input) {
    const key = normalize(input);
    if (!key) return null;
    return NAME_INDEX.get(key) || null;
  }

  /**
   * Parsea un bloque de texto pegado por el usuario y devuelve
   * { matched: [Char], unmatched: [string] }.
   * Acepta separadores: salto de línea, coma, punto y coma, pipe, tab.
   */
  function parseRosterText(text) {
    if (!text || typeof text !== 'string') return { matched: [], unmatched: [] };
    const tokens = text
      .split(/[\r\n,;|\t]+/)
      .map(t => t.trim())
      .filter(t => t.length);

    const matched = [];
    const unmatched = [];
    const seen = new Set();

    tokens.forEach(token => {
      // Quitar "Nv. 90" / "Lv. 80" / "Rango X" del final si los hay.
      const cleaned = token.replace(/\s*(nv|lv|niv|nivel)\.?\s*\d+.*$/i, '').trim();
      const found = findByName(cleaned);
      if (found && !seen.has(found.id)) {
        seen.add(found.id);
        matched.push(found);
      } else if (!found) {
        unmatched.push(token);
      }
    });

    return { matched, unmatched };
  }

  /**
   * Devuelve un array ORDENADO de URLs candidatas al retrato del
   * personaje. La UI intenta la primera y, si falla (404 o red), pasa
   * a la siguiente. Si se agotan todas, muestra el glifo del elemento.
   *
   * Fuentes:
   *   1. genshin.jmp.blue — API comunitaria principal. Cobertura
   *      sólida para personajes clásicos. Usa kebab-case (`iconSlug`).
   *   2. enka.network    — CDN oficial-comunitario, mejor para los
   *      personajes recientes. Convención: el nombre del personaje
   *      sin espacios ni signos, con mayúscula inicial de cada parte.
   *      Ej.: "Hu Tao" → UI_AvatarIcon_Hutao.png,
   *           "Raiden Shogun" → UI_AvatarIcon_Shougun.png (caso raro).
   *
   * Reglas:
   *   - Si iconSlug es null, se salta jmp.blue.
   *   - enka.network siempre se intenta como segunda opción.
   *   - Si un personaje tiene `enkaName` explícito, se respeta (para
   *     casos como Raiden Shogun → "Shougun" o el Trotamundos).
   *   - Si ambos fallan en runtime, la UI muestra el glifo del elemento.
   */
  function deriveEnkaName(character) {
    if (character.enkaName) return character.enkaName;
    // El Trotamundos en enka tiene su propio formato (PlayerBoy/PlayerGirl),
    // pero no hay una sola imagen genérica. Lo evitamos y dejamos que
    // caiga al glifo si tampoco está en jmp.blue.
    if (character.groupId === 'traveler') return null;
    // Para el resto: tomamos el nombre canónico inglés, eliminamos
    // espacios y signos, conservamos solo letras.
    return character.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z]/g, '');
  }

  function getIconUrls(character) {
    if (!character) return [];
    const urls = [];
    if (character.iconSlug) {
      urls.push(`https://genshin.jmp.blue/characters/${character.iconSlug}/icon-big`);
    }
    const enkaName = deriveEnkaName(character);
    if (enkaName) {
      urls.push(`https://enka.network/ui/UI_AvatarIcon_${enkaName}.png`);
    }
    return urls;
  }

  /**
   * Compatibilidad hacia atrás. Devuelve la primera URL candidata o
   * null si no hay ninguna.
   */
  function getIconUrl(character) {
    const urls = getIconUrls(character);
    return urls[0] || null;
  }

  // -------------------------------------------------------------------
  // Persistencia del roster del usuario en localStorage
  // -------------------------------------------------------------------

  const ROSTER_STORAGE_KEY = 'prueba-lunar-roster';

  function getRoster() {
    try {
      const raw = global.localStorage?.getItem(ROSTER_STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.filter(id => CHARACTERS.some(c => c.id === id));
    } catch (e) {
      return [];
    }
  }

  function setRoster(ids) {
    try {
      const clean = Array.isArray(ids)
        ? Array.from(new Set(ids)).filter(id => CHARACTERS.some(c => c.id === id))
        : [];
      global.localStorage?.setItem(ROSTER_STORAGE_KEY, JSON.stringify(clean));
      return clean;
    } catch (e) {
      return [];
    }
  }

  function toggleInRoster(id) {
    const roster = getRoster();
    const idx = roster.indexOf(id);
    if (idx === -1) roster.push(id);
    else roster.splice(idx, 1);
    return setRoster(roster);
  }

  function clearRoster() {
    return setRoster([]);
  }

  // -------------------------------------------------------------------
  // Export
  // -------------------------------------------------------------------
  global.PruebaLunarCharacters = {
    CHARACTERS,
    ELEMENTS, WEAPONS, REGIONS, ROLES,
    ELEMENT_LABELS, ELEMENT_COLORS, ELEMENT_GLYPHS, WEAPON_LABELS, REGION_LABELS, ROLE_LABELS,
    findByName,
    parseRosterText,
    getIconUrl,
    getIconUrls,
    normalize,
    ROSTER_STORAGE_KEY,
    getRoster,
    setRoster,
    toggleInRoster,
    clearRoster
  };
})(typeof window !== 'undefined' ? window : globalThis);
