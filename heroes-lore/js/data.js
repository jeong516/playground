// Game Data: Classes, Skills, Items, Synthesis Recipes, 19 Monsters & 5 Bosses, 5-Act 20-Chapter Epic Story, and 8 World Maps
(function (global) {
  'use strict';

  const TILE_SIZE = 24;

  const RARITY = {
    common:    { name: '일반', color: '#e2e8f0' },
    uncommon:  { name: '고급', color: '#4ade80' },
    rare:      { name: '희귀', color: '#60a5fa' },
    heroic:    { name: '영웅', color: '#f59e0b' },
    legendary: { name: '전설', color: '#f43f5e' }
  };

  const CLASSES = {
    knight: {
      id: 'knight',
      name: '기사 케인',
      role: '검과 방패의 수호기사',
      desc: '높은 체력과 방어력으로 전선을 돌파하는 정통 전사. 넓은 검기와 강력한 광역 베기를 구사합니다.',
      base: { str: 10, agi: 6, vit: 11, int: 5 },
      startWeapon: 'wp_iron_sword',
      legendWeapon: 'wp_soltia_blade',
      skills: [
        { id: 'k_strike', name: '강타', mp: 10, cd: 3.5, unlockLv: 1, icon: '⚔️', desc: '전방에 강력한 내려치기로 큰 피해와 기절을 줍니다.', mult: 2.1, range: 48, type: 'cone', color: '#f59e0b' },
        { id: 'k_whirl', name: '회전베기', mp: 16, cd: 5.5, unlockLv: 2, icon: '🌀', desc: '주위 모든 적을 검풍으로 베어 넘깁니다.', mult: 1.85, radius: 66, type: 'aoe', color: '#fbbf24' },
        { id: 'k_aegis', name: '수호의 방패', mp: 20, cd: 12.0, unlockLv: 4, icon: '🛡️', desc: '8초간 방어력이 대폭 상승하고 체력을 회복합니다.', mult: 0, duration: 8, type: 'buff_def', color: '#60a5fa' },
        { id: 'k_judgment', name: '성검의 심판', mp: 32, cd: 10.0, unlockLv: 6, icon: '✨', desc: '성스러운 빛의 기둥을 내려 주위 적을 심판합니다.', mult: 3.2, radius: 98, type: 'pillars', color: '#fde047' }
      ]
    },
    rogue: {
      id: 'rogue',
      name: '도적 레온',
      role: '바람을 가르는 쌍검객',
      desc: '압도적인 기동성과 치명타율로 적의 급소를 찌릅니다. 빠른 연타와 원거리 검풍에 특화되어 있습니다.',
      base: { str: 8, agi: 13, vit: 7, int: 4 },
      startWeapon: 'wp_iron_dagger',
      legendWeapon: 'wp_shadow_fang',
      skills: [
        { id: 'r_stab', name: '급소 찌르기', mp: 9, cd: 2.8, unlockLv: 1, icon: '🗡️', desc: '전방으로 빠르게 돌진하며 높은 치명타 피해를 입힙니다.', mult: 2.2, range: 64, type: 'lunge', color: '#34d399' },
        { id: 'r_gale', name: '질풍참', mp: 15, cd: 4.5, unlockLv: 2, icon: '💨', desc: '적을 관통하는 날카로운 바람 검기를 발사합니다.', mult: 1.9, range: 170, type: 'projectile', color: '#6ee7b7' },
        { id: 'r_shadow', name: '그림자 보법', mp: 18, cd: 11.0, unlockLv: 4, icon: '👤', desc: '8초간 이동속도와 치명타율이 크게 증가합니다.', mult: 0, duration: 8, type: 'buff_spd', color: '#2dd4bf' },
        { id: 'r_flurry', name: '환영 난무', mp: 28, cd: 9.0, unlockLv: 6, icon: '⚡', desc: '주위 적들에게 번개 같은 연속 참격을 퍼붓습니다.', mult: 3.0, radius: 88, type: 'flurry', color: '#a7f3d0' }
      ]
    },
    runeblade: {
      id: 'runeblade',
      name: '마검사 루나',
      role: '정령과 검의 계승자',
      desc: '검술에 화염과 빙결 마법을 결합한 마검사. 강력한 속성 원거리 공격과 광역 마법을 다룹니다.',
      base: { str: 7, agi: 7, vit: 7, int: 12 },
      startWeapon: 'wp_rune_sword',
      legendWeapon: 'wp_starlight_blade',
      skills: [
        { id: 'm_flame', name: '화염검기', mp: 11, cd: 3.0, unlockLv: 1, icon: '🔥', desc: '폭발하는 화염 검기를 전방으로 날립니다.', mult: 2.15, range: 175, type: 'fireball', color: '#fb7185' },
        { id: 'm_frost', name: '빙결파', mp: 17, cd: 5.5, unlockLv: 2, icon: '❄️', desc: '주변에 혹한의 파동을 퍼뜨려 적을 얼리고 둔화시킵니다.', mult: 1.95, radius: 78, type: 'frost', color: '#38bdf8' },
        { id: 'm_shield', name: '마력 보호막', mp: 16, cd: 11.5, unlockLv: 4, icon: '🔮', desc: '8초간 피해를 흡수하는 보호막을 두르고 체력을 회복합니다.', mult: 0, duration: 8, type: 'buff_def', color: '#38bdf8' },
        { id: 'm_meteor', name: '유성 낙하', mp: 34, cd: 10.5, unlockLv: 6, icon: '☄️', desc: '하늘에서 거대한 운석을 연달아 떨어뜨립니다.', mult: 3.4, radius: 112, type: 'meteor', color: '#f97316' }
      ]
    }
  };

  const ITEMS = {
    // Weapons
    wp_iron_sword:       { id: 'wp_iron_sword', name: '수련용 철검', type: 'weapon', rarity: 'common', atk: 8, price: 80, desc: '솔티아 기사단의 기본 철검.' },
    wp_iron_dagger:      { id: 'wp_iron_dagger', name: '사냥꾼의 단검', type: 'weapon', rarity: 'common', atk: 7, crit: 5, price: 80, desc: '가볍고 예리한 쌍단검.' },
    wp_rune_sword:       { id: 'wp_rune_sword', name: '초급 룬소드', type: 'weapon', rarity: 'common', atk: 7, int: 3, price: 80, desc: '마력이 깃든 입문자용 마검.' },
    wp_meadow_blade:     { id: 'wp_meadow_blade', name: '바람의 강철검', type: 'weapon', rarity: 'uncommon', atk: 15, agi: 2, price: 240, desc: '초원의 바람이 깃든 날렵한 검.' },
    wp_coral_saber:      { id: 'wp_coral_saber', name: '산호빛 해적검', type: 'weapon', rarity: 'rare', atk: 21, agi: 3, crit: 5, price: 390, desc: '푸른 물안개 해안의 해풍이 서린 곡도.' },
    wp_chief_axe:        { id: 'wp_chief_axe', name: '족장의 전투도끼', type: 'weapon', rarity: 'rare', atk: 26, str: 3, price: 480, desc: '고블린 족장이 휘두르던 묵직한 도끼.' },
    wp_flame_greatsword: { id: 'wp_flame_greatsword', name: '이그니스의 화염검', type: 'weapon', rarity: 'heroic', atk: 33, str: 4, int: 3, price: 820, desc: '붉은 바람 협곡의 불꽃을 벼려낸 대검.' },
    wp_ruin_runeblade:   { id: 'wp_ruin_runeblade', name: '고대 유적의 성검', type: 'weapon', rarity: 'heroic', atk: 39, int: 5, crit: 7, price: 1050, desc: '잊혀진 유적의 마석이 박힌 명검.' },
    wp_cassius_blade:    { id: 'wp_cassius_blade', name: '카시우스의 흑광검', type: 'weapon', rarity: 'heroic', atk: 46, str: 5, agi: 4, crit: 9, price: 1550, desc: '타락한 대장군이 쥐었던 흑요석 마검.' },
    wp_soltia_blade:     { id: 'wp_soltia_blade', name: '솔티아의 성검', type: 'weapon', rarity: 'legendary', atk: 62, str: 8, vit: 6, crit: 12, price: 3200, desc: '전설의 영웅이 남긴 빛의 성검.' },
    wp_shadow_fang:      { id: 'wp_shadow_fang', name: '심연의 쌍아', type: 'weapon', rarity: 'legendary', atk: 58, agi: 11, crit: 22, price: 3200, desc: '그림자조차 베어내는 전설의 쌍검.' },
    wp_starlight_blade:  { id: 'wp_starlight_blade', name: '성광의 마검', type: 'weapon', rarity: 'legendary', atk: 60, int: 12, crit: 12, price: 3200, desc: '별빛의 마력이 응축된 전설의 마검.' },

    // Armor
    ar_leather:          { id: 'ar_leather', name: '가죽 갑옷', type: 'armor', rarity: 'common', def: 5, hp: 20, price: 100, desc: '가볍고 튼튼한 모험가용 가죽 갑옷.' },
    ar_coast_vest:       { id: 'ar_coast_vest', name: '해풍의 수호갑', type: 'armor', rarity: 'uncommon', def: 10, hp: 50, agi: 2, price: 280, desc: '산호 비늘을 엮어 만든 가벼운 해안 갑옷.' },
    ar_forest_mail:      { id: 'ar_forest_mail', name: '숲의 수호갑옷', type: 'armor', rarity: 'uncommon', def: 13, hp: 70, vit: 2, price: 360, desc: '멧돼지 가죽과 송곳니로 보강한 갑옷.' },
    ar_knight_plate:     { id: 'ar_knight_plate', name: '강철 판금갑옷', type: 'armor', rarity: 'rare', def: 20, hp: 110, vit: 3, price: 650, desc: '솔티아 정예 기사용 판금 갑옷.' },
    ar_flame_mail:       { id: 'ar_flame_mail', name: '홍련의 판금갑', type: 'armor', rarity: 'heroic', def: 26, hp: 155, str: 3, vit: 4, price: 1050, desc: '화염의 심장석으로 단련한 붉은 판금.' },
    ar_ancient_plate:    { id: 'ar_ancient_plate', name: '고대 수호자의 갑옷', type: 'armor', rarity: 'heroic', def: 32, hp: 195, vit: 5, int: 4, price: 1380, desc: '고대 마석의 결계가 깃든 영웅 갑옷.' },
    ar_abyss_aegis:      { id: 'ar_abyss_aegis', name: '흑요석 성채갑옷', type: 'armor', rarity: 'legendary', def: 40, hp: 260, vit: 7, str: 4, price: 2200, desc: '심연의 기운마저 튕겨내는 성채의 갑주.' },

    // Helms
    hm_iron_cap:         { id: 'hm_iron_cap', name: '철제 투구', type: 'helm', rarity: 'common', def: 3, hp: 15, price: 90, desc: '머리를 보호하는 기본 철투구.' },
    hm_goblin_helm:      { id: 'hm_goblin_helm', name: '고블린 족장의 투구', type: 'helm', rarity: 'rare', def: 9, str: 3, hp: 45, price: 420, desc: '야성적인 뿔이 달린 전사의 투구.' },
    hm_canyon_helm:      { id: 'hm_canyon_helm', name: '화염 기사의 투구', type: 'helm', rarity: 'heroic', def: 13, str: 4, vit: 3, hp: 75, price: 760, desc: '불꽃 문양이 새겨진 협곡 수호자의 투구.' },
    hm_ruin_crown:       { id: 'hm_ruin_crown', name: '유적의 마력관', type: 'helm', rarity: 'heroic', def: 17, int: 6, mp: 55, crit: 6, price: 980, desc: '고대 왕국의 마력이 서린 서클릿.' },

    // Accessories
    ac_novice_ring:      { id: 'ac_novice_ring', name: '초보자의 반지', type: 'accessory', rarity: 'uncommon', atk: 3, def: 2, hp: 25, price: 160, desc: '솔티아 마을에 숨겨져 있던 행운의 반지.' },
    ac_tide_pearl:       { id: 'ac_tide_pearl', name: '해풍의 진주 목걸이', type: 'accessory', rarity: 'rare', atk: 5, def: 4, mp: 30, hp: 45, price: 420, desc: '크라켄 수호자가 지키던 푸른 파도의 성물.' },
    ac_wind_pendant:     { id: 'ac_wind_pendant', name: '바람의 목걸이', type: 'accessory', rarity: 'rare', agi: 4, crit: 6, mp: 25, price: 480, desc: '솔티아의 바람이 깃든 수호 목걸이.' },
    ac_ember_ring:       { id: 'ac_ember_ring', name: '홍련의 불꽃 반지', type: 'accessory', rarity: 'heroic', atk: 9, str: 4, crit: 7, hp: 60, price: 860, desc: '이그니스의 불꽃이 맥동하는 수호 반지.' },
    ac_soltia_ring:      { id: 'ac_soltia_ring', name: '솔티아의 반지', type: 'accessory', rarity: 'heroic', atk: 10, def: 8, hp: 95, mp: 45, crit: 9, price: 1200, desc: '고대 영웅의 축복이 담긴 조합 반지.' },
    ac_oath_emblem:      { id: 'ac_oath_emblem', name: '성기사단의 맹세 휘장', type: 'accessory', rarity: 'legendary', atk: 14, def: 11, hp: 140, mp: 60, crit: 12, price: 2100, desc: '10년 전 영웅 바르가스가 남긴 진정한 기사단의 증표.' },

    // Consumables
    pot_hp_s:            { id: 'pot_hp_s', name: '소형 HP 포션', type: 'consumable', subtype: 'hp', power: 80, rarity: 'common', price: 30, desc: 'HP를 80 회복합니다.' },
    pot_hp_m:            { id: 'pot_hp_m', name: '중형 HP 포션', type: 'consumable', subtype: 'hp', power: 200, rarity: 'uncommon', price: 80, desc: 'HP를 200 회복합니다.' },
    pot_hp_l:            { id: 'pot_hp_l', name: '대형 HP 포션', type: 'consumable', subtype: 'hp', power: 440, rarity: 'rare', price: 170, desc: 'HP를 440 회복합니다.' },
    pot_mp_s:            { id: 'pot_mp_s', name: '소형 MP 포션', type: 'consumable', subtype: 'mp', power: 55, rarity: 'common', price: 35, desc: 'MP를 55 회복합니다.' },
    pot_mp_l:            { id: 'pot_mp_l', name: '대형 MP 포션', type: 'consumable', subtype: 'mp', power: 150, rarity: 'uncommon', price: 95, desc: 'MP를 150 회복합니다.' },
    scroll_town:         { id: 'scroll_town', name: '마을 귀환 주문서', type: 'consumable', subtype: 'town', rarity: 'common', price: 45, desc: '즉시 솔티아 마을로 귀환합니다.' },

    // Materials & Enhance
    mat_enhance:         { id: 'mat_enhance', name: '강화석', type: 'material', rarity: 'uncommon', price: 110, desc: '대장장이에게 장비 강화를 의뢰할 때 사용합니다.' },
    mat_slime_core:      { id: 'mat_slime_core', name: '슬라임 핵', type: 'material', rarity: 'common', price: 25, desc: '슬라임에게서 얻는 영롱한 핵. 조합 재료.' },
    mat_boar_hide:       { id: 'mat_boar_hide', name: '멧돼지 가죽', type: 'material', rarity: 'common', price: 35, desc: '질긴 숲 멧돼지의 가죽. 방어구 조합 재료.' },
    mat_sea_pearl:       { id: 'mat_sea_pearl', name: '푸른 해풍 진주', type: 'material', rarity: 'uncommon', price: 60, desc: '푸른 물안개 해안에서 채취하는 맑은 진주.' },
    mat_goblin_fang:     { id: 'mat_goblin_fang', name: '고블린 송곳니', type: 'material', rarity: 'uncommon', price: 55, desc: '날카로운 고블린의 송곳니. 조합 재료.' },
    mat_flame_core:      { id: 'mat_flame_core', name: '화염의 심장석', type: 'material', rarity: 'rare', price: 85, desc: '붉은 바람 협곡의 용암 마물이 품은 뜨거운 마석.' },
    mat_ancient_stone:   { id: 'mat_ancient_stone', name: '고대 마석', type: 'material', rarity: 'rare', price: 100, desc: '유적의 몬스터가 품고 있는 고대 마력석.' },
    mat_dark_crystal:    { id: 'mat_dark_crystal', name: '어둠의 결정', type: 'material', rarity: 'heroic', price: 165, desc: '심연의 기운이 응축된 희귀 결정.' }
  };

  const SHOP_GENERAL = ['pot_hp_s', 'pot_hp_m', 'pot_hp_l', 'pot_mp_s', 'pot_mp_l', 'mat_enhance', 'scroll_town'];
  const SHOP_BLACKSMITH = ['wp_meadow_blade', 'ar_leather', 'hm_iron_cap', 'wp_coral_saber', 'ar_knight_plate', 'hm_canyon_helm'];

  const RECIPES = [
    { id: 'rc_meadow_blade', result: 'wp_meadow_blade', gold: 100, materials: [{ id: 'mat_slime_core', qty: 3 }] },
    { id: 'rc_coast_vest', result: 'ar_coast_vest', gold: 150, materials: [{ id: 'mat_sea_pearl', qty: 3 }] },
    { id: 'rc_forest_mail', result: 'ar_forest_mail', gold: 180, materials: [{ id: 'mat_boar_hide', qty: 3 }, { id: 'mat_goblin_fang', qty: 2 }] },
    { id: 'rc_goblin_helm', result: 'hm_goblin_helm', gold: 240, materials: [{ id: 'mat_goblin_fang', qty: 4 }] },
    { id: 'rc_flame_sword', result: 'wp_flame_greatsword', gold: 420, materials: [{ id: 'mat_flame_core', qty: 3 }, { id: 'mat_enhance', qty: 1 }] },
    { id: 'rc_flame_mail', result: 'ar_flame_mail', gold: 480, materials: [{ id: 'mat_flame_core', qty: 4 }] },
    { id: 'rc_ruin_blade', result: 'wp_ruin_runeblade', gold: 560, materials: [{ id: 'mat_ancient_stone', qty: 3 }, { id: 'mat_enhance', qty: 2 }] },
    { id: 'rc_ancient_plate', result: 'ar_ancient_plate', gold: 700, materials: [{ id: 'mat_ancient_stone', qty: 4 }, { id: 'mat_dark_crystal', qty: 2 }] },
    { id: 'rc_soltia_ring', result: 'ac_soltia_ring', gold: 520, materials: [{ id: 'mat_sea_pearl', qty: 2 }, { id: 'mat_flame_core', qty: 2 }, { id: 'mat_ancient_stone', qty: 2 }] },
    { id: 'rc_abyss_aegis', result: 'ar_abyss_aegis', gold: 1100, materials: [{ id: 'mat_dark_crystal', qty: 4 }, { id: 'mat_ancient_stone', qty: 3 }] }
  ];

  const MONSTERS = {
    slime_green:    { id: 'slime_green', name: '초록 슬라임', lv: 1, hp: 46, atk: 8, def: 2, exp: 20, gold: [12, 20], speed: 44, ai: 'melee', aggro: 120, size: 22, drops: [{ id: 'mat_slime_core', rate: 0.6 }, { id: 'pot_hp_s', rate: 0.18 }] },
    slime_blue:     { id: 'slime_blue', name: '파랑 슬라임', lv: 2, hp: 68, atk: 11, def: 3, exp: 28, gold: [16, 26], speed: 50, ai: 'melee', aggro: 135, size: 22, drops: [{ id: 'mat_slime_core', rate: 0.6 }, { id: 'pot_mp_s', rate: 0.2 }, { id: 'mat_enhance', rate: 0.09 }] },
    boar:           { id: 'boar', name: '숲 멧돼지', lv: 3, hp: 96, atk: 15, def: 5, exp: 42, gold: [22, 36], speed: 62, ai: 'charger', aggro: 145, size: 24, drops: [{ id: 'mat_boar_hide', rate: 0.55 }, { id: 'pot_hp_s', rate: 0.22 }, { id: 'mat_enhance', rate: 0.12 }] },
    coral_crab:     { id: 'coral_crab', name: '산호 수호게', lv: 4, hp: 125, atk: 18, def: 8, exp: 52, gold: [28, 44], speed: 54, ai: 'melee', aggro: 145, size: 24, drops: [{ id: 'mat_sea_pearl', rate: 0.6 }, { id: 'pot_hp_s', rate: 0.22 }, { id: 'mat_enhance', rate: 0.14 }] },
    pirate_skel:    { id: 'pirate_skel', name: '유령 해적', lv: 5, hp: 148, atk: 22, def: 7, exp: 64, gold: [35, 54], speed: 65, ai: 'melee', aggro: 165, size: 24, drops: [{ id: 'mat_sea_pearl', rate: 0.55 }, { id: 'pot_hp_m', rate: 0.18 }, { id: 'mat_enhance', rate: 0.16 }] },
    kraken_guard:   { id: 'kraken_guard', name: '심해의 크라켄 수호자', lv: 6, hp: 430, atk: 29, def: 10, exp: 220, gold: [160, 220], speed: 58, ai: 'miniboss', aggro: 195, size: 34, isBoss: true, drops: [{ id: 'wp_coral_saber', rate: 0.75 }, { id: 'mat_sea_pearl', rate: 1.0 }, { id: 'mat_enhance', rate: 0.85 }] },
    goblin:         { id: 'goblin', name: '고블린 전사', lv: 6, hp: 165, atk: 24, def: 9, exp: 72, gold: [38, 58], speed: 64, ai: 'melee', aggro: 155, size: 24, drops: [{ id: 'mat_goblin_fang', rate: 0.55 }, { id: 'pot_hp_m', rate: 0.18 }, { id: 'mat_enhance', rate: 0.15 }] },
    goblin_shaman:  { id: 'goblin_shaman', name: '고블린 주술사', lv: 7, hp: 155, atk: 27, def: 7, exp: 84, gold: [44, 66], speed: 52, ai: 'ranged', aggro: 185, size: 24, projColor: '#38bdf8', drops: [{ id: 'mat_goblin_fang', rate: 0.5 }, { id: 'pot_mp_s', rate: 0.28 }, { id: 'mat_enhance', rate: 0.18 }] },
    goblin_chief:   { id: 'goblin_chief', name: '고블린 족장', lv: 8, hp: 560, atk: 35, def: 12, exp: 290, gold: [200, 280], speed: 66, ai: 'miniboss', aggro: 195, size: 34, isBoss: true, drops: [{ id: 'wp_chief_axe', rate: 0.75 }, { id: 'mat_goblin_fang', rate: 1.0 }, { id: 'mat_enhance', rate: 0.9 }] },
    wyvern:         { id: 'wyvern', name: '붉은 와이번', lv: 8, hp: 220, atk: 34, def: 11, exp: 108, gold: [58, 86], speed: 70, ai: 'ranged', aggro: 190, size: 26, projColor: '#f97316', drops: [{ id: 'mat_flame_core', rate: 0.58 }, { id: 'pot_hp_m', rate: 0.22 }, { id: 'mat_enhance', rate: 0.2 }] },
    lava_golem:     { id: 'lava_golem', name: '용암 골렘', lv: 9, hp: 310, atk: 38, def: 16, exp: 132, gold: [70, 102], speed: 46, ai: 'charger', aggro: 155, size: 28, drops: [{ id: 'mat_flame_core', rate: 0.65 }, { id: 'pot_hp_m', rate: 0.22 }, { id: 'mat_enhance', rate: 0.24 }] },
    ignis_boss:     { id: 'ignis_boss', name: '화염의 수호자 이그니스', lv: 10, hp: 820, atk: 44, def: 15, exp: 420, gold: [300, 410], speed: 68, ai: 'miniboss', aggro: 210, size: 36, isBoss: true, drops: [{ id: 'wp_flame_greatsword', rate: 0.8 }, { id: 'mat_flame_core', rate: 1.0 }, { id: 'mat_enhance', rate: 1.0 }] },
    skeleton:       { id: 'skeleton', name: '스켈레톤 검사', lv: 10, hp: 285, atk: 40, def: 14, exp: 138, gold: [72, 108], speed: 68, ai: 'melee', aggro: 170, size: 24, drops: [{ id: 'mat_ancient_stone', rate: 0.55 }, { id: 'pot_hp_m', rate: 0.22 }, { id: 'mat_enhance', rate: 0.2 }] },
    golem:          { id: 'golem', name: '유적 골렘', lv: 11, hp: 410, atk: 46, def: 20, exp: 175, gold: [92, 136], speed: 45, ai: 'charger', aggro: 155, size: 28, drops: [{ id: 'mat_ancient_stone', rate: 0.65 }, { id: 'mat_dark_crystal', rate: 0.3 }, { id: 'mat_enhance', rate: 0.26 }] },
    dark_mage:      { id: 'dark_mage', name: '어둠의 마도사', lv: 11, hp: 315, atk: 50, def: 13, exp: 185, gold: [98, 145], speed: 56, ai: 'ranged', aggro: 205, size: 24, projColor: '#f43f5e', drops: [{ id: 'mat_dark_crystal', rate: 0.5 }, { id: 'mat_ancient_stone', rate: 0.5 }, { id: 'pot_mp_l', rate: 0.25 }] },
    fallen_knight:  { id: 'fallen_knight', name: '타락한 성기사', lv: 12, hp: 420, atk: 52, def: 18, exp: 225, gold: [120, 175], speed: 68, ai: 'charger', aggro: 185, size: 26, drops: [{ id: 'mat_dark_crystal', rate: 0.58 }, { id: 'pot_hp_l', rate: 0.24 }, { id: 'mat_enhance', rate: 0.28 }] },
    abyss_assassin: { id: 'abyss_assassin', name: '심연의 암살자', lv: 13, hp: 365, atk: 56, def: 15, exp: 240, gold: [130, 190], speed: 78, ai: 'melee', aggro: 200, size: 24, drops: [{ id: 'mat_dark_crystal', rate: 0.62 }, { id: 'pot_mp_l', rate: 0.25 }, { id: 'mat_enhance', rate: 0.3 }] },
    cassius_boss:   { id: 'cassius_boss', name: '배신자 대장군 카시우스', lv: 14, hp: 1280, atk: 60, def: 20, exp: 720, gold: [520, 680], speed: 74, ai: 'boss', aggro: 240, size: 36, isBoss: true, drops: [{ id: 'wp_cassius_blade', rate: 0.85 }, { id: 'mat_dark_crystal', rate: 1.0 }, { id: 'mat_enhance', rate: 1.0 }] },
    vargas:         { id: 'vargas', name: '심연의 기사 바르가스', lv: 15, hp: 1850, atk: 68, def: 22, exp: 1400, gold: [950, 1200], speed: 76, ai: 'boss', aggro: 265, size: 38, isBoss: true, isFinalBoss: true, drops: [{ id: 'mat_dark_crystal', rate: 1.0 }, { id: 'mat_enhance', rate: 1.0 }] }
  };

  // =========================================================================
  // 5-ACT, 20-CHAPTER EPIC STORY CHRONICLE (영웅서기: 솔티아의 바람 완전판)
  // =========================================================================
  const QUESTS = [
    // ---------- 제1막: 바람이 멈춘 날 ----------
    {
      id: 'ch01', act: '제1막 · 바람이 멈춘 날', chapter: 1,
      title: '1장. 불길한 바람의 징조',
      desc: '마을 북쪽 바람의 초원에서 난폭해진 슬라임 4마리를 처치하세요.',
      summary: '솔티아 마을을 감싸던 온화한 바람이 멎은 날, 촌장 엘더와 음유시인 아리아의 부탁으로 초원의 슬라임들을 토벌하며 영웅의 여정이 시작되었다.',
      type: 'kill_any', targets: ['slime_green', 'slime_blue'], goal: 4,
      reward: { gold: 140, exp: 110, items: [{ id: 'mat_enhance', qty: 1 }, { id: 'pot_hp_s', qty: 3 }] },
      dialogStart: [
        '촌장 엘더: "자네도 느꼈겠지...? 백 년 동안 한 번도 멎은 적 없던 솔티아의 바람이 오늘 새벽 멈췄네."',
        '음유시인 아리아: "바람의 노래가 끊긴 뒤, 북쪽 초원의 슬라임들까지 검붉은 기운에 취해 여행자들을 공격하고 있어요."',
        '촌장 엘더: "이건 단순한 자연 현상이 아닐세. 자네, 바람의 초원으로 나가 슬라임 4마리를 진정시키고 상태를 살펴봐 주게."',
        '음유시인 아리아: "조심하세요! 부상을 입으면 마을 중앙의 치유 분수나 저에게 돌아오면 된답니다."'
      ],
      dialogProgress: [
        '촌장 엘더: "마을 북쪽 포털로 나가면 바로 바람의 초원이라네. 슬라임 4마리를 처치해 주게."'
      ],
      dialogComplete: [
        '음유시인 아리아: "무사히 돌아오셨군요! 그런데... 방금 슬라임들에게서 흩어진 빛, 보셨나요?"',
        '촌장 엘더: "검은 마기가 섞여 있었군... 십 년 전, 대륙을 공포로 몰아넣었던 심연의 틈이 다시 열리기 시작한 걸지도 모르네."',
        '음유시인 아리아: "서둘러야 해요. 초원 깊숙한 곳에서 야수들마저 광기에 휩싸이고 있다는 소식이 들어왔어요!"'
      ]
    },
    {
      id: 'ch02', act: '제1막 · 바람이 멈춘 날', chapter: 2,
      title: '2장. 초원을 뒤덮은 광기',
      desc: '바람의 초원에서 난폭해진 숲 멧돼지 3마리를 처치하고 이상 현상을 조사하세요.',
      summary: '초원의 숲 멧돼지들을 제압한 끝에, 깨어진 솔티아 성기사단의 은빛 문장을 발견했다. 기사단에게 무슨 일이 벌어졌다는 첫 단서였다.',
      type: 'kill_any', targets: ['boar'], goal: 3,
      reward: { gold: 200, exp: 170, items: [{ id: 'mat_enhance', qty: 2 }, { id: 'pot_mp_s', qty: 2 }] },
      dialogStart: [
        '잡화상인 미나: "큰일이에요! 상단 마차가 바람의 초원에서 멧돼지 떼에게 습격당했어요!"',
        '촌장 엘더: "원래 사람을 피하던 멧돼지들이 저렇게 날뛸 리 없는데... 틀림없이 누군가 초원에 마기를 흘려보낸 걸세."',
        '촌장 엘더: "바람의 초원에 있는 숲 멧돼지 3마리를 제압하고, 녀석들이 무엇에 자극받았는지 확인해 주게."'
      ],
      dialogProgress: [
        '잡화상인 미나: "숲 멧돼지들은 돌진 공격을 하니 옆으로 살짝 피하면서 공격해 보세요!"'
      ],
      dialogComplete: [
        '음유시인 아리아: "잠깐만요, 멧돼지가 물고 있던 이 금속 조각은... 솔티아 성기사단의 은빛 문장이에요!"',
        '촌장 엘더: "성기사단 정찰대가 초원 서쪽 해안으로 파견되었다가 행방불명되었다던데... 설마 그들에게 변고가 생긴 건가?"',
        '대장장이 볼칸: "흥, 어쩐지 최근 들어 대장간 불꽃이 자꾸 검붉게 타오르더라니. 이리 와 보게, 자네에게 해줄 얘기가 있네."'
      ]
    },
    {
      id: 'ch03', act: '제1막 · 바람이 멈춘 날', chapter: 3,
      title: '3장. 대장장이의 오래된 기억',
      desc: '슬라임 핵 3개를 모아 대장장이 볼칸의 검 정화 의식을 도우세요.',
      summary: '볼칸에게 슬라임 핵을 건네며 10년 전 전설의 성기사 바르가스가 심연의 틈을 몸소 봉인하고 사라졌던 비극적인 과거를 들었다.',
      type: 'collect', targetItem: 'mat_slime_core', goal: 3,
      reward: { gold: 240, exp: 210, items: [{ id: 'wp_meadow_blade', qty: 1 }, { id: 'mat_enhance', qty: 2 }] },
      dialogStart: [
        '대장장이 볼칸: "십 년 전 솔티아 봉인 전쟁 때, 난 성기사단장 바르가스의 검을 직접 벼렸던 놈일세."',
        '대장장이 볼칸: "바르가스는 누구보다 고결한 영웅이었지. 심연의 문이 열렸을 때, 부하들을 살리고 혼자 어둠 속으로 뛰어들어 문을 닫았어."',
        '대장장이 볼칸: "그런데 지금 느껴지는 마기는... 그때 그 심연의 기운과 똑같네. 자네 무기를 강화할 마력 촉매가 필요하니 슬라임 핵 3개를 구해오게!"'
      ],
      dialogProgress: [
        '대장장이 볼칸: "초원의 슬라임들을 잡으면 슬라임 핵이 나온다네. 3개만 모아오면 쓸 만한 검을 하나 쥐여주지."'
      ],
      dialogComplete: [
        '대장장이 볼칸: "좋아, 이 정도면 훌륭해! 자, 내가 벼려둔 바람의 강철검을 받게. 가방에서 바로 장착할 수 있네."',
        '음유시인 아리아: "바르가스 단장님이 영웅이었다면... 대체 누가 10년 만에 심연의 봉인을 흔들고 있는 걸까요?"',
        '잡화상인 미나: "방금 서쪽 푸른 물안개 해안 쪽에서 파란 신호탄이 올라왔어요! 실종된 기사단 정찰병일지도 몰라요!"'
      ]
    },
    {
      id: 'ch04', act: '제1막 · 바람이 멈춘 날', chapter: 4,
      title: '4장. 해안에서 온 구조 신호',
      desc: '바람의 초원 서쪽 포털을 통해 [푸른 물안개 해안]으로 이동해 정찰병 카일을 찾으세요.',
      summary: '푸른 물안개 해안에서 부상당한 성기사단 정찰병 카일과 조우했다. 그는 정체불명의 검은 함대가 대륙의 세 바람 성물을 노린다고 경고했다.',
      type: 'talk', targetNpc: 'kyle', targetMap: 'coast', goal: 1,
      reward: { gold: 260, exp: 240, items: [{ id: 'pot_hp_m', qty: 3 }, { id: 'scroll_town', qty: 2 }] },
      dialogStart: [
        '촌장 엘더: "바람의 초원 서쪽 끝으로 가면 푸른 물안개 해안으로 이어지는 길이 있네."',
        '음유시인 아리아: "파란 신호탄은 솔티아 성기사단의 긴급 구조 신호예요. 어서 해안으로 가서 생존자를 찾아주세요!"',
        '촌장 엘더: "해안의 마물들은 초원보다 한결 사나울 걸세. 물약과 장비를 점검하고 출발하게나."'
      ],
      dialogProgress: [
        '음유시인 아리아: "바람의 초원 서쪽(왼쪽) 포털로 들어가면 푸른 물안개 해안이에요. 그곳에 있는 정찰병 카일에게 말을 걸어주세요!"'
      ],
      dialogComplete: [
        '정찰병 카일: "크윽... 마을에서 온 지원군인가? 정말 다행이군! 난 성기사단 정찰병 카일일세."',
        '정찰병 카일: "검은 깃발을 단 정체불명의 자들이 해안으로 상륙해, 대륙의 결계를 떠받치는 세 개의 [바람의 성물] 중 첫 번째를 노리고 있네!"',
        '정찰병 카일: "내 동료들은 모두 흩어졌어... 부탁하네! 이 해안의 성물이 빼앗기면 솔티아의 결계가 무너지고 말아!"'
      ]
    },

    // ---------- 제2막: 파도에 잠긴 서약 ----------
    {
      id: 'ch05', act: '제2막 · 파도에 잠긴 서약', chapter: 5,
      title: '5장. 붉은 산호와 해안의 격전',
      desc: '푸른 물안개 해안에서 산호 수호게 4마리를 처치해 해안 교두보를 확보하세요.',
      summary: '검은 마기에 물든 산호 수호게들을 물리치고 해안 방어선을 되찾았다. 해수면 아래에서 기괴한 진동이 울리기 시작했다.',
      type: 'kill_any', targets: ['coral_crab'], goal: 4,
      reward: { gold: 320, exp: 290, items: [{ id: 'mat_enhance', qty: 2 }, { id: 'ar_coast_vest', qty: 1 }] },
      dialogStart: [
        '정찰병 카일: "해안 북쪽 제단으로 가려면 먼저 모래사장을 점거한 산호 수호게들을 뚫어야 하네."',
        '정찰병 카일: "녀석들의 껍질은 원래 푸른빛이었지만, 어둠의 마력에 물들어 붉게 변해 버렸어."',
        '정찰병 카일: "산호 수호게 4마리를 처치해 길을 열어주게. 나도 여기서 후방을 엄호하겠네!"'
      ],
      dialogProgress: [
        '정찰병 카일: "푸른 물안개 해안 곳곳에 있는 산호 수호게 4마리를 처치해 주게."'
      ],
      dialogComplete: [
        '정찰병 카일: "대단한 검술이군! 정예 기사단원 못지않아. 이 해풍의 수호갑을 걸치게, 해안 전투에 큰 도움이 될 걸세."',
        '정찰병 카일: "그런데 저기 난파선 잔해 쪽을 보게... 죽은 해적들이 검은 안개 속에서 일어나고 있어!"'
      ]
    },
    {
      id: 'ch06', act: '제2막 · 파도에 잠긴 서약', chapter: 6,
      title: '6장. 유령 해적단의 저주',
      desc: '푸른 물안개 해안의 유령 해적 4마리를 처치하고 지령서를 회수하세요.',
      summary: '유령 해적들을 토벌하고 얻은 밀서에는 "대장군의 명령에 따라 세 성물을 파괴하라"는 충격적인 문구가 적혀 있었다.',
      type: 'kill_any', targets: ['pirate_skel'], goal: 4,
      reward: { gold: 380, exp: 340, items: [{ id: 'mat_enhance', qty: 2 }, { id: 'pot_hp_m', qty: 3 }] },
      dialogStart: [
        '정찰병 카일: "백 년 전 침몰한 검은 돛 해적단이 사령술로 되살아났군! 누군가 의도적으로 우리 발을 묶으려는 수작이야."',
        '정찰병 카일: "유령 해적 4마리를 쓰러뜨리고, 녀석들을 조종하는 배후의 단서를 찾아내 주게!"'
      ],
      dialogProgress: [
        '정찰병 카일: "유령 해적들은 빠르고 날카롭게 베어 들어오니 스킬과 회피를 적극 활용하게!"'
      ],
      dialogComplete: [
        '정찰병 카일: "이건... 유령 해적의 품에서 나온 밀서인가? 어디 보자... \'대장군의 명에 따라 해풍의 성물을 파괴하라\'?!"',
        '정찰병 카일: "말도 안 돼...! 우리 성기사단의 대장군 카시우스 님께서 어째서 이런 명령을...? 아니, 누군가 이름을 사칭한 걸 거야!"',
        '음유시인 아리아: "(전령의 바람을 타고 들려오는 목소리) 조심하세요! 해안 가장 안쪽에서 거대한 수호수가 폭주하고 있어요!"'
      ]
    },
    {
      id: 'ch07', act: '제2막 · 파도에 잠긴 서약', chapter: 7,
      title: '7장. 푸른 진주의 정화',
      desc: '푸른 해풍 진주 3개를 모아 해안 성물의 결계를 안정화하세요.',
      summary: '푸른 해풍 진주를 모아 해안의 폭주를 억제하는 정화석을 완성했다. 이제 심해의 크라켄 수호자와 맞설 준비가 끝났다.',
      type: 'collect', targetItem: 'mat_sea_pearl', goal: 3,
      reward: { gold: 430, exp: 390, items: [{ id: 'mat_enhance', qty: 3 }, { id: 'pot_mp_l', qty: 2 }] },
      dialogStart: [
        '정찰병 카일: "해풍의 성물을 지키던 심해의 크라켄 수호자마저 검은 마기에 폭주해 버렸네."',
        '정찰병 카일: "그대로 싸우면 수호자의 폭주한 파도에 휩쓸리고 말아. 먼저 해안 몬스터들에게서 푸른 해풍 진주 3개를 모아오게."',
        '정찰병 카일: "진주의 맑은 기운으로 자네 무기에 해풍의 축복을 불어넣어 주겠네!"'
      ],
      dialogProgress: [
        '정찰병 카일: "산호 수호게와 유령 해적을 잡으면 푸른 해풍 진주를 얻을 수 있네. 3개를 모아오게!"'
      ],
      dialogComplete: [
        '정찰병 카일: "좋아, 진주의 빛이 공명하고 있어! 이제 해안 북서쪽 암초에 도사린 크라켄 수호자에게 다가갈 수 있네."',
        '정찰병 카일: "녀석을 쓰러뜨리고 첫 번째 바람의 성물 [해풍의 진주]를 되찾아 주게!"'
      ]
    },
    {
      id: 'ch08', act: '제2막 · 파도에 잠긴 서약', chapter: 8,
      title: '8장. [보스] 심해의 크라켄 수호자',
      desc: '푸른 물안개 해안의 중간 보스 [심해의 크라켄 수호자]를 격파하세요!',
      summary: '격전 끝에 심해의 크라켄 수호자를 정화하고 첫 번째 바람의 성물 [해풍의 진주 목걸이]를 회수했다. 해안의 안개가 걷히며 새로운 여정이 열렸다.',
      type: 'kill_any', targets: ['kraken_guard'], goal: 1,
      reward: { gold: 600, exp: 520, items: [{ id: 'ac_tide_pearl', qty: 1 }, { id: 'mat_enhance', qty: 3 }] },
      dialogStart: [
        '정찰병 카일: "드디어 크라켄 수호자가 모습을 드러냈군! 거대한 삼지창과 파동 공격을 조심하게!"',
        '정찰병 카일: "붉은 예고 원이 바닥에 뜨면 즉시 회피 버튼으로 벗어나고, 빈틈이 생겼을 때 스킬을 쏟아붓게나!"'
      ],
      dialogProgress: [
        '정찰병 카일: "심해의 크라켄 수호자는 푸른 물안개 해안 서쪽 깊은 곳에 있다네. 포션을 넉넉히 챙기게!"'
      ],
      dialogComplete: [
        '정찰병 카일: "해냈군!! 크라켄 수호자를 잠재우고 첫 번째 바람의 성물을 지켜냈어!"',
        '음유시인 아리아: "해안의 바람이 다시 불기 시작했어요! 정말 멋져요! 이 [해풍의 진주 목걸이]를 꼭 착용하세요."',
        '정찰병 카일: "난 왕도로 돌아가 밀서의 진위를 확인하겠네. 자네는 바람의 초원 동쪽 [고요한 숲]으로 향해 주게! 고블린 군단이 이상하게 움직이고 있어!"'
      ]
    },

    // ---------- 제3막: 녹색 그림자와 붉은 협곡 ----------
    {
      id: 'ch09', act: '제3막 · 녹색 그림자와 붉은 협곡', chapter: 9,
      title: '9장. 고요한 숲의 침입자',
      desc: '바람의 초원 동쪽 [고요한 숲]에서 고블린 전사 5마리를 처치하세요.',
      summary: '고요한 숲에 진입해 조직적으로 무장한 고블린 전사들을 격파했다. 고블린들의 무기에 새겨진 검은 각인이 심상치 않았다.',
      type: 'kill_any', targets: ['goblin'], goal: 5,
      reward: { gold: 520, exp: 480, items: [{ id: 'mat_enhance', qty: 2 }, { id: 'pot_hp_m', qty: 3 }] },
      dialogStart: [
        '촌장 엘더: "해안을 구해줘서 정말 고맙네! 하지만 쉴 틈이 없군... 동쪽 고요한 숲의 고블린들이 갑자기 군대처럼 행군하기 시작했어."',
        '음유시인 아리아: "원래 고블린들은 서로 다투기만 하던 무리였어요. 누군가 강력한 힘으로 녀석들을 하나로 묶은 게 틀림없어요."',
        '촌장 엘더: "바람의 초원 동쪽 포털을 지나 고요한 숲으로 들어가 고블린 전사 5마리를 제압해 주게."'
      ],
      dialogProgress: [
        '촌장 엘더: "바람의 초원 동쪽(오른쪽) 끝 포털로 들어가면 고요한 숲이라네. 고블린 전사 5마리를 처치하게."'
      ],
      dialogComplete: [
        '대장장이 볼칸: "이 고블린 놈들이 들고 있던 칼 좀 보게... 이건 고블린 따위가 만든 게 아니야! 인간 대장장이의 솜씨에 어둠의 룬을 새겼어."',
        '음유시인 아리아: "누군가 고블린들에게 무기를 대주고 숲을 봉쇄하게 만든 거군요... 숲 안쪽 주술사들을 추격해 봐요!"'
      ]
    },
    {
      id: 'ch10', act: '제3막 · 녹색 그림자와 붉은 협곡', chapter: 10,
      title: '10장. 숲의 주술과 검은 인장',
      desc: '고요한 숲에서 고블린 주술사 4마리를 처치해 숲의 흑마법을 끊으세요.',
      summary: '고블린 주술사들을 물리치며 숲의 결계를 회복시켰다. 주술사들의 지팡이에서 붉은 협곡의 화염 마력이 감지되었다.',
      type: 'kill_any', targets: ['goblin_shaman'], goal: 4,
      reward: { gold: 600, exp: 560, items: [{ id: 'mat_enhance', qty: 3 }, { id: 'pot_mp_l', qty: 2 }] },
      dialogStart: [
        '음유시인 아리아: "숲의 나무들이 시들어가고 있어요. 고블린 주술사들이 숲 곳곳에 검은 인장을 세워 바람의 맥을 끊고 있기 때문이에요!"',
        '촌장 엘더: "주술사 4마리를 처치해 검은 의식을 중단시켜 주게. 원거리 마법탄을 날리니 빠르게 파고들어 쓰러뜨리게나!"'
      ],
      dialogProgress: [
        '음유시인 아리아: "고요한 숲 중앙과 동쪽에 있는 고블린 주술사 4마리를 처치해 주세요!"'
      ],
      dialogComplete: [
        '음유시인 아리아: "검은 안개가 걷히고 있어요! 이제 숲 북동쪽 공터에 숨어 있는 고블린 족장의 진영이 드러났어요."',
        '촌장 엘더: "족장이 숲의 패권을 쥐고 뒤에서 모든 약탈을 지휘하고 있네. 단숨에 숨통을 끊어놓아야 하네!"'
      ]
    },
    {
      id: 'ch11', act: '제3막 · 녹색 그림자와 붉은 협곡', chapter: 11,
      title: '11장. [보스] 숲의 패왕',
      desc: '고요한 숲 북동쪽의 [고블린 족장]을 격파하고 배후를 밝혀내세요!',
      summary: '고블린 족장을 쓰러뜨린 순간, 족장은 "은발의 인간 대장군이 붉은 협곡에서 우리에게 검은 힘을 내렸다"는 충격적인 유언을 남겼다.',
      type: 'kill_any', targets: ['goblin_chief'], goal: 1,
      reward: { gold: 820, exp: 740, items: [{ id: 'ac_wind_pendant', qty: 1 }, { id: 'mat_enhance', qty: 3 }] },
      dialogStart: [
        '고블린 족장: "(멀리서 울려 퍼지는 포효) 크아아악! 감히 내 부하들을 건드리다니, 뼈도 못 추리게 해주마!"',
        '촌장 엘더: "고블린 족장이 직접 나섰군! 저 거대한 도끼 공격에 맞으면 치명타를 입으니 타이밍을 잘 재게나!"'
      ],
      dialogProgress: [
        '촌장 엘더: "고블린 족장은 고요한 숲 북동쪽 공터에 있네. 장비 강화와 포션을 꼭 확인하게."'
      ],
      dialogComplete: [
        '고블린 족장: "크헉... 네놈이... 그 은발의 대장군보다 강할 줄이야... 붉은 바람 협곡의 화염이... 네놈들을 모두 태워버릴 것이다..."',
        '음유시인 아리아: "은발의... 대장군?! 설마 정말로 성기사단 대장군 카시우스가 이 모든 일의 배후라는 걸까요?!"',
        '촌장 엘더: "고요한 숲 동쪽 끝 [붉은 바람 협곡]에 두 번째 바람의 성물이 봉인되어 있네. 서둘러 협곡으로 가서 진실을 확인해야 하네!"'
      ]
    },
    {
      id: 'ch12', act: '제3막 · 녹색 그림자와 붉은 협곡', chapter: 12,
      title: '12장. 불타는 협곡으로',
      desc: '고요한 숲 동쪽 [붉은 바람 협곡]에서 붉은 와이번과 용암 골렘을 합쳐 5마리 처치하세요.',
      summary: '작열하는 붉은 바람 협곡에 발을 들여 와이번과 용암 골렘들을 돌파했다. 협곡 중심부의 고대 봉인석이 붉게 달아오르고 있었다.',
      type: 'kill_any', targets: ['wyvern', 'lava_golem'], goal: 5,
      reward: { gold: 780, exp: 760, items: [{ id: 'mat_enhance', qty: 3 }, { id: 'pot_hp_l', qty: 2 }] },
      dialogStart: [
        '음유시인 아리아: "고요한 숲 오른쪽 포털을 지나면 붉은 바람 협곡이에요. 예전엔 따뜻한 산바람이 불던 곳인데 지금은 용암이 들끓고 있어요!"',
        '대장장이 볼칸: "협곡의 붉은 와이번과 용암 골렘들은 불꽃을 두르고 있어 맷집이 단단하네. 녀석들 5마리를 먼저 정리하고 안으로 들어가게!"'
      ],
      dialogProgress: [
        '대장장이 볼칸: "고요한 숲 동쪽(오른쪽) 포털을 통해 붉은 바람 협곡으로 들어가 와이번과 용암 골렘 5마리를 처치하게!"'
      ],
      dialogComplete: [
        '음유시인 아리아: "협곡 안쪽에서 거대한 마력의 소용돌이가 느껴져요. 두 번째 성물 [진홍빛 불꽃의 조각]이 고통스러워하고 있어요!"',
        '대장장이 볼칸: "이 열기를 견디려면 화염의 심장석으로 방어 결계를 둘러야 하네. 협곡 마물들에게서 심장석을 모아오게!"'
      ]
    },
    {
      id: 'ch13', act: '제3막 · 녹색 그림자와 붉은 협곡', chapter: 13,
      title: '13장. 타오르는 고대 봉인석',
      desc: '붉은 바람 협곡에서 화염의 심장석 3개를 수집하세요.',
      summary: '화염의 심장석 3개를 모아 결계를 안정시켰다. 그 속에서 카시우스가 바르가스를 질투하고 증오해 온 10년 전의 비밀이 떠올랐다.',
      type: 'collect', targetItem: 'mat_flame_core', goal: 3,
      reward: { gold: 880, exp: 840, items: [{ id: 'hm_canyon_helm', qty: 1 }, { id: 'mat_enhance', qty: 3 }] },
      dialogStart: [
        '음유시인 아리아: "고대 연대기를 해독하다가 충격적인 기록을 찾았어요... 10년 전 바르가스 단장님이 심연으로 뛰어들던 날, 부단장이었던 카시우스가 곁에 있었대요."',
        '음유시인 아리아: "모든 영광이 바르가스에게 돌아간 뒤, 카시우스는 깊은 원한을 품고 금지된 심연의 힘을 연구하기 시작했다는 소문이 있었어요..."',
        '대장장이 볼칸: "우선 눈앞의 불꽃부터 꺼야 하네! 붉은 바람 협곡에서 화염의 심장석 3개를 모아오게나."'
      ],
      dialogProgress: [
        '대장장이 볼칸: "붉은 와이번과 용암 골렘을 처치하면 화염의 심장석이 떨어지네. 3개를 모아오게!"'
      ],
      dialogComplete: [
        '대장장이 볼칸: "훌륭하군! 이 화염 기사의 투구를 쓰게. 이제 협곡 최심부의 화염 수호자 이그니스와 맞설 수 있을 걸세!"',
        '음유시인 아리아: "이그니스는 원래 협곡의 성물을 지키는 선한 정령이었어요. 검은 마기를 베어내어 그를 해방시켜 주세요!"'
      ]
    },
    {
      id: 'ch14', act: '제3막 · 녹색 그림자와 붉은 협곡', chapter: 14,
      title: '14장. [보스] 화염의 수호자 이그니스',
      desc: '붉은 바람 협곡의 보스 [화염의 수호자 이그니스]를 격파하세요!',
      summary: '화염의 수호자 이그니스를 해방시키고 두 번째 바람의 성물 [홍련의 불꽃 반지]를 얻었다. 이그니스는 잊혀진 유적 너머 흑요석 성채에 진범이 있다고 알려주었다.',
      type: 'kill_any', targets: ['ignis_boss'], goal: 1,
      reward: { gold: 1150, exp: 1050, items: [{ id: 'ac_ember_ring', qty: 1 }, { id: 'mat_enhance', qty: 4 }] },
      dialogStart: [
        '화염의 수호자 이그니스: "누구냐... 감히 꺼지지 않는 심연의 불꽃에 도전하는 필멸자여! 불타 재가 되어라!"',
        '음유시인 아리아: "이그니스가 완전히 폭주했어요! 넓은 화염 파동을 회피로 피하면서 성물을 되찾아 주세요!"'
      ],
      dialogProgress: [
        '음유시인 아리아: "화염의 수호자 이그니스는 붉은 바람 협곡 동쪽 용암 제단에 있어요!"'
      ],
      dialogComplete: [
        '화염의 수호자 이그니스: "...아아, 맑은 솔티아의 바람이 돌아왔구나. 고맙다, 젊은 영웅이여."',
        '화염의 수호자 이그니스: "은발의 인간 대장군이 내게 심연의 쐐기를 박고, 세 번째 성물이 잠든 [잊혀진 유적] 너머 흑요석 성채로 향했다."',
        '화염의 수호자 이그니스: "내 축복이 깃든 [홍련의 불꽃 반지]를 받아라. 이제 고요한 숲 북쪽 [잊혀진 유적]으로 향해 그 배신자를 막아다오!"'
      ]
    },

    // ---------- 제4막: 배신과 흑요석 성채 ----------
    {
      id: 'ch15', act: '제4막 · 배신과 흑요석 성채', chapter: 15,
      title: '15장. 잊혀진 유적의 망령들',
      desc: '고요한 숲 북쪽 [잊혀진 유적]에서 스켈레톤 검사 5마리를 처치하세요.',
      summary: '잊혀진 유적에 진입해 깨어난 스켈레톤 검사들을 쓰러뜨렸다. 유적 벽면에는 10년 전 바르가스가 스스로 심연의 사슬을 걸었던 마지막 기록이 남아 있었다.',
      type: 'kill_any', targets: ['skeleton'], goal: 5,
      reward: { gold: 1050, exp: 1020, items: [{ id: 'mat_enhance', qty: 3 }, { id: 'pot_hp_l', qty: 3 }] },
      dialogStart: [
        '촌장 엘더: "이제 세 번째 바람의 성물과 모든 진실이 잠든 [잊혀진 유적]으로 갈 차례네."',
        '음유시인 아리아: "고요한 숲 북쪽 포털을 지나면 고대 신전이 나와요. 먼저 입구를 막고 있는 스켈레톤 검사 5마리를 처치하고 안쪽 비문을 살펴봐요!"'
      ],
      dialogProgress: [
        '음유시인 아리아: "고요한 숲 북쪽 포털로 이동해 잊혀진 유적의 스켈레톤 검사 5마리를 쓰러뜨려 주세요."'
      ],
      dialogComplete: [
        '음유시인 아리아: "이 벽면의 비문 좀 보세요... \'나는 영원히 어둠 속에 남아 심연의 문을 안에서 잠그겠다 — 솔티아 성기사단장 바르가스\'..."',
        '음유시인 아리아: "바르가스 단장님은 타락한 게 아니었어요! 대륙을 지키려고 스스로 심연의 감옥에 갇혀 계셨던 거예요!"',
        '정찰병 카일: "(급히 도착하며) 큰일 났네! 왕도에서 확인했어! 카시우스 대장군이 흑마법 교단과 결탁해 유적 깊숙한 곳에 흑요석 성채를 열었네!"'
      ]
    },
    {
      id: 'ch16', act: '제4막 · 배신과 흑요석 성채', chapter: 16,
      title: '16장. 어둠의 교단과 봉인의 진실',
      desc: '잊혀진 유적에서 어둠의 마도사 4마리를 처치해 심연 소환 의식을 저지하세요.',
      summary: '어둠의 마도사들을 격파해 흑마법 의식을 멈췄다. 카시우스가 바르가스의 정신을 잠식시켜 대륙을 정복하려 한다는 전모가 완전히 드러났다.',
      type: 'kill_any', targets: ['dark_mage'], goal: 4,
      reward: { gold: 1200, exp: 1180, items: [{ id: 'mat_enhance', qty: 4 }, { id: 'pot_mp_l', qty: 3 }] },
      dialogStart: [
        '정찰병 카일: "카시우스의 목적은 단순한 복수가 아니었어. 심연의 틈을 강제로 열어 바르가스 단장님의 육신을 심연의 왕으로 폭주시키고, 그 힘으로 대륙 전체를 지배하려는 거야!"',
        '음유시인 아리아: "유적 곳곳의 어둠의 마도사들이 봉인을 깨는 주문을 외우고 있어요! 어둠의 마도사 4마리를 처치해 주세요!"'
      ],
      dialogProgress: [
        '정찰병 카일: "어둠의 마도사들은 강력한 붉은 암흑탄을 쏘네. 회피로 탄환을 피하며 접근하게!"'
      ],
      dialogComplete: [
        '정찰병 카일: "의식의 마력이 약해졌어! 하지만 카시우스는 이미 유적 북쪽 너머 [침묵의 흑요석 성채]로 몸을 숨겼군."',
        '음유시인 아리아: "성채로 가는 차원문을 열려면 유적의 고대 마석이 필요해요. 유적 골렘들을 쓰러뜨리고 마석을 모아주세요!"'
      ]
    },
    {
      id: 'ch17', act: '제4막 · 배신과 흑요석 성채', chapter: 17,
      title: '17장. 유적의 거인과 고대 마석',
      desc: '잊혀진 유적에서 고대 마석 3개를 모아 흑요석 성채의 관문을 여세요.',
      summary: '유적 골렘들과 격전을 치러 고대 마석 3개를 모았다. 유적 북쪽 관문이 보랏빛으로 열리며 침묵의 흑요석 성채가 모습을 드러냈다.',
      type: 'collect', targetItem: 'mat_ancient_stone', goal: 3,
      reward: { gold: 1350, exp: 1300, items: [{ id: 'wp_ruin_runeblade', qty: 1 }, { id: 'mat_enhance', qty: 4 }] },
      dialogStart: [
        '촌장 엘더: "고대 마석 3개가 모이면 유적 북쪽의 봉인문을 통과해 카시우스가 숨은 흑요석 성채로 진입할 수 있네."',
        '대장장이 볼칸: "유적 골렘과 스켈레톤들이 고대 마석을 품고 있으니 3개를 모아오게. 내가 그 마석으로 유적의 성검을 깨워주겠네!"'
      ],
      dialogProgress: [
        '대장장이 볼칸: "잊혀진 유적의 몬스터들에게서 고대 마석 3개를 모아오게나!"'
      ],
      dialogComplete: [
        '대장장이 볼칸: "으하하! 드디어 완성됐군! [고대 유적의 성검]을 받게. 이제 어떤 어둠도 베어낼 수 있을 걸세!"',
        '정찰병 카일: "유적 북쪽 포털이 완전히 열렸네! 저 너머가 바로 배신자 카시우스의 아지트, [침묵의 흑요석 성채]야!"'
      ]
    },
    {
      id: 'ch18', act: '제4막 · 배신과 흑요석 성채', chapter: 18,
      title: '18장. 침묵의 흑요석 성채 돌파',
      desc: '잊혀진 유적 북쪽 [침묵의 흑요석 성채]에서 타락한 성기사와 심연의 암살자를 합쳐 5마리 처치하세요.',
      summary: '어둠에 삼켜진 옛 성기사들과 심연의 암살자들을 뚫고 성채 최상층 알현실 앞에 도달했다. 이제 배신자 카시우스와의 일전이 눈앞이다.',
      type: 'kill_any', targets: ['fallen_knight', 'abyss_assassin'], goal: 5,
      reward: { gold: 1550, exp: 1500, items: [{ id: 'ar_ancient_plate', qty: 1 }, { id: 'pot_hp_l', qty: 4 }] },
      dialogStart: [
        '정찰병 카일: "이럴 수가... 성채 안의 저 기사들은... 십 년 전 행방불명되었던 내 옛 전우들이야! 카시우스가 저들마저 심연의 꼭두각시로 만들었어!"',
        '음유시인 아리아: "괴롭지만 저분들에게 안식을 돌려드릴 수 있는 건 영웅님의 검뿐이에요. 타락한 성기사와 심연의 암살자 5마리를 해방시켜 주세요!"'
      ],
      dialogProgress: [
        '정찰병 카일: "잊혀진 유적 북쪽 포털로 들어가면 침묵의 흑요석 성채네. 타락한 성기사와 심연의 암살자 5마리를 처치하게!"'
      ],
      dialogComplete: [
        '정찰병 카일: "편히 잠드소서, 전우들이여... 이제 저 앞 알현실에 카시우스 놈이 기다리고 있네!"',
        '배신자 대장군 카시우스: "(차갑게 울려 퍼지는 목소리) 호오... 애송이 하나가 내 정예 병력을 전부 뚫고 여기까지 왔단 말인가? 좋다, 직접 상대해 주마!"'
      ]
    },
    {
      id: 'ch19', act: '제4막 · 배신과 흑요석 성채', chapter: 19,
      title: '19장. [대반전 보스] 배신자 대장군 카시우스',
      desc: '침묵의 흑요석 성채의 지배자 [배신자 대장군 카시우스]를 격파하세요!',
      summary: '숙명의 결전 끝에 배신자 대장군 카시우스를 쓰러뜨렸다. 그러나 이미 깨져버린 봉인 너머, 폭주한 바르가스가 봉인의 제단에서 깨어나고 있었다.',
      type: 'kill_any', targets: ['cassius_boss'], goal: 1,
      reward: { gold: 2100, exp: 1950, items: [{ id: 'ac_oath_emblem', qty: 1 }, { id: 'mat_enhance', qty: 5 }, { id: 'pot_hp_l', qty: 4 }] },
      dialogStart: [
        '배신자 대장군 카시우스: "바르가스... 바르가스... 온 세상이 그 이름만 찬양했지! 피 흘려 기사단을 지탱한 건 나였는데도!"',
        '배신자 대장군 카시우스: "그러니 내가 심연의 문을 열었다! 영웅의 허울을 벗겨내고, 내가 진정한 솔티아의 왕이 되리라! 덤벼라, 애송이!"',
        '음유시인 아리아: "카시우스의 흑광검은 치명적인 광역 참격을 뿜어내요! 모든 스킬과 강화 장비를 총동원해 주세요!"'
      ],
      dialogProgress: [
        '정찰병 카일: "배신자 대장군 카시우스는 흑요석 성채 북쪽 알현실에 있네. 절대 물러서지 말게!"'
      ],
      dialogComplete: [
        '배신자 대장군 카시우스: "크아악... 불가능해... 내 십 년의 계획이... 이런 무명의 검사에게 무너지다니..."',
        '배신자 대장군 카시우스: "하하하... 하지만 늦었다! 이미 제단의 마지막 사슬은 끊어졌어! 이성을 잃고 심연에 삼켜진 바르가스가 곧 대륙을 집어삼킬 거다...!"',
        '정찰병 카일: "카시우스가 떨어뜨린 이 [성기사단의 맹세 휘장]을 받게! 바르가스 단장님의 진정한 유품이야. 이걸 지니고 성채 북쪽 [봉인의 제단]으로 올라가 단장님을 구원해 주게!"'
      ]
    },

    // ---------- 제5막: 솔티아의 바람 ----------
    {
      id: 'ch20', act: '제5막 · 솔티아의 바람', chapter: 20,
      title: '20장. [최종 결전] 심연의 기사 바르가스',
      desc: '침묵의 흑요석 성채 북쪽 [봉인의 제단]에서 최종 보스 [심연의 기사 바르가스]를 격파하세요!',
      summary: '세 바람의 성물과 동료들의 염원을 담아 심연의 기사 바르가스를 해방시켰다. 멈췄던 솔티아의 바람이 대륙 전역에 다시 불어오며 새로운 전설이 완성되었다.',
      type: 'kill_any', targets: ['vargas'], goal: 1,
      reward: { gold: 3500, exp: 3000, legendWeapon: true, items: [{ id: 'mat_enhance', qty: 8 }] },
      dialogStart: [
        '심연의 기사 바르가스: "......오랜 침묵 끝에... 다시 빛의 바람을 품은 자가 찾아왔구나..."',
        '심연의 기사 바르가스: "내 의지는 이미 심연의 불길에 타들어가고 있다... 솔티아의 후계자여, 네 검으로 나를 베어 이 저주를 끝내다오!"',
        '음유시인 아리아: "세 개의 바람 성물이 모두 영웅님의 곁에서 빛나고 있어요! 솔티아의 모든 이들이 영웅님을 응원하고 있습니다!"',
        '촌장 엘더: "솔티아의 운명이 자네의 검 끝에 달려 있다네... 반드시 살아 돌아오게, 영웅이여!"'
      ],
      dialogProgress: [
        '음유시인 아리아: "흑요석 성채 북쪽 끝 포털이 [봉인의 제단]이에요! 바르가스는 체력이 절반 이하가 되면 2페이즈로 각성하니 회피와 대형 포션을 아끼지 마세요!"'
      ],
      dialogComplete: [
        '심연의 기사 바르가스: "...훌륭하다... 그 맑은 바람의 검기... 이제야... 편히 눈을 감을 수 있겠군..."',
        '심연의 기사 바르가스: "솔티아의 바람은... 결코 멈추지 않는다... 나의 뒤를 이어... 이 대륙을 지켜다오, 진정한 영웅이여..."',
        '음유시인 아리아: "보세요...! 검은 먹구름이 갈라지고 솔티아 전역에 상쾌한 아침 바람이 불어오고 있어요!"',
        '촌장 엘더: "해냈군... 20장에 걸친 기나긴 사투 끝에 대륙에 진정한 평화를 되찾아 주었네! 전설의 무기와 [솔티아의 영웅] 칭호를 받게나!"'
      ]
    }
  ];

  // Tile legend:
  // Walkable: '.' grass, ',' flower, ';' darkGrass, 'p' path, 'c' cobble, '=' bridge,
  //           '_' ruinFloor, '*' ruinRune, 'a' altarFloor, 's' sand, 'r' redRock, 'b' citadelFloor
  // Solid:    'T' tree, 'D' darkTree, '~' water, 'R' houseRoof, 'W' houseWall, 'd' houseDoor,
  //           'F' fountain, '#' stoneWall, 'X' altarWall, 'P' palm, 'C' canyonWall, 'L' lava, 'B' citadelWall
  const SOLID_TILES = new Set(['T', 'D', '~', 'R', 'W', 'd', 'F', '#', 'X', 'P', 'C', 'L', 'B']);

  const MAPS = {
    town: {
      id: 'town',
      name: '솔티아 마을',
      bgm: 'town',
      safe: true,
      subtitle: '바람이 머무는 평화로운 시작의 마을',
      layout: [
        'TTTTTTTTTTTppTTTTTTTTTTT',
        'T..RRR.....pp.....RRR..T',
        'T..WWW..cccccccc..WWW..T',
        'T..WdW..c......c..WdW..T',
        'T.......c..cc..c.......T',
        'T.,....cc.cccc.cc....,.T',
        'T......c.cccccc.c......T',
        'T..RRR.c.ccFFcc.c.RRR..T',
        'T..WWW.c.ccFFcc.c.WWW..T',
        'T..WdW.c.cccccc.c.WdW..T',
        'T......cc.cccc.cc......T',
        'T.,.....cccccccc.....,.T',
        'T.........cccc.........T',
        'T..~~~....cccc....~~~..T',
        'T..~~~~...cccc...~~~~..T',
        'T...~~....,,,,....~~...T',
        'T......................T',
        'TTTTTTTTTTTTTTTTTTTTTTTT'
      ],
      npcs: [
        { id: 'elder', name: '촌장 엘더', sprite: 'elder', tx: 11.5, ty: 5.2, role: 'quest' },
        { id: 'aria', name: '음유시인 아리아', sprite: 'aria', tx: 14.5, ty: 6.2, role: 'bard' },
        { id: 'shop', name: '잡화상인 미나', sprite: 'shop', tx: 5.5, ty: 10.6, role: 'shop' },
        { id: 'smith', name: '대장장이 볼칸', sprite: 'smith', tx: 18.5, ty: 10.6, role: 'smith' }
      ],
      fountains: [{ tx: 11.5, ty: 8 }],
      chests: [
        { id: 'ch_town_1', tx: 21, ty: 15, items: [{ id: 'ac_novice_ring', qty: 1 }, { id: 'pot_hp_s', qty: 2 }], gold: 60 }
      ],
      portals: [
        { tx: 11.5, ty: 0.7, toMap: 'meadow', toX: 11.5, toY: 16.0, label: '바람의 초원 ▲' }
      ],
      spawns: []
    },

    meadow: {
      id: 'meadow',
      name: '바람의 초원',
      bgm: 'field',
      safe: false,
      subtitle: 'Lv.1~3 · 슬라임과 멧돼지가 서식하는 초원',
      layout: [
        'TTTTTTTTTTTTTTTTTTTTTTTT',
        'T..,....T.....,........T',
        'T.......T.........,,...T',
        'T..TT.......~~~........T',
        'T..........~~~~~.......T',
        'T.....,....~~~~~..TT...T',
        'T..........~~=~~.......T',
        'pppppppp...~~=~~..ppppp.',
        'p......ppppp===pppp....p',
        'T..,.......~~=~~.......T',
        'T..........~~~~~...,,..T',
        'T..TT......~~~~~.......T',
        'T...........~~~....TT..T',
        'T......,....p..........T',
        'T...........p.....,....T',
        'T..,.......pp..........T',
        'T..........pp..........T',
        'TTTTTTTTTTppTTTTTTTTTTTT'
      ],
      npcs: [],
      chests: [
        { id: 'ch_meadow_1', tx: 2, ty: 2, items: [{ id: 'mat_enhance', qty: 2 }, { id: 'pot_hp_s', qty: 2 }], gold: 80 },
        { id: 'ch_meadow_2', tx: 21, ty: 14, items: [{ id: 'hm_iron_cap', qty: 1 }], gold: 70 }
      ],
      portals: [
        { tx: 11.5, ty: 17.1, toMap: 'town', toX: 11.5, toY: 2.0, label: '솔티아 마을 ▼' },
        { tx: 0.9, ty: 7.5, toMap: 'coast', toX: 21.8, toY: 8.5, label: '◀ 푸른 물안개 해안' },
        { tx: 23.1, ty: 8.0, toMap: 'forest', toX: 1.8, toY: 8.5, label: '고요한 숲 ▶' }
      ],
      spawns: [
        { type: 'slime_green', tx: 6, ty: 4 },
        { type: 'slime_green', tx: 5, ty: 12 },
        { type: 'slime_green', tx: 16, ty: 13 },
        { type: 'slime_blue', tx: 16, ty: 4 },
        { type: 'slime_blue', tx: 19, ty: 11 },
        { type: 'boar', tx: 19, ty: 3 },
        { type: 'boar', tx: 8, ty: 14 }
      ]
    },

    coast: {
      id: 'coast',
      name: '푸른 물안개 해안',
      bgm: 'field',
      safe: false,
      subtitle: 'Lv.4~6 · 은빛 모래사장과 심해 수호자의 암초',
      layout: [
        '~~~~~~~~~~~~~~~~~~~~~~~~',
        '~~~~~ssssssssssssssPPPPP',
        '~~~ssssssssssssssssss..P',
        '~~sssssPPsssss~~~~sss..P',
        '~~sssssPPssss~~~~~~ss..P',
        '~~sssssssssss~~==~~ss..P',
        '~~sssssssssss~~==~~ss..P',
        '~~sssPsssssss~~~~~~sspp.',
        '~~ssssssssssss~~~~sssppp',
        '~~ssssssssssssssssssss.P',
        '~~sssss~~~ssssssssPsss.P',
        '~~ssss~~~~~sssssssPsss.P',
        '~~sssss~~~ssssssssssss.P',
        '~~ssssssssssPPssssssss.P',
        '~~~sssssssssPPssssssssPP',
        '~~~~sssssssssssssssssPPP',
        '~~~~~~sssssssssssssPPPPP',
        '~~~~~~~~~~~~~~~~~~~~~~~~'
      ],
      npcs: [
        { id: 'kyle', name: '정찰병 카일', sprite: 'kyle', tx: 19.5, ty: 7.5, role: 'scout' }
      ],
      chests: [
        { id: 'ch_coast_1', tx: 16, ty: 15, items: [{ id: 'mat_sea_pearl', qty: 2 }, { id: 'pot_hp_m', qty: 2 }], gold: 160 }
      ],
      portals: [
        { tx: 23.1, ty: 8.5, toMap: 'meadow', toX: 2.2, toY: 7.5, label: '바람의 초원 ▶' }
      ],
      spawns: [
        { type: 'coral_crab', tx: 15.5, ty: 11.5 },
        { type: 'coral_crab', tx: 11.5, ty: 8.5 },
        { type: 'coral_crab', tx: 15.5, ty: 2.5 },
        { type: 'pirate_skel', tx: 8.5, ty: 14.5 },
        { type: 'pirate_skel', tx: 6.5, ty: 9.5 },
        { type: 'pirate_skel', tx: 9.5, ty: 5.5 },
        { type: 'kraken_guard', tx: 4.5, ty: 5.5 }
      ]
    },

    forest: {
      id: 'forest',
      name: '고요한 숲',
      bgm: 'field',
      safe: false,
      subtitle: 'Lv.6~8 · 고블린 군단과 족장의 은신처',
      layout: [
        'DDDDDDDDDDDppDDDDDDDDDDD',
        'D;;D;;;;;;;pp;;;;;;;D;;D',
        'D;;;;;;;;;;pp;;;;;;;,;;D',
        'D;;;DD;;;;;pp;;;;;DD;;;D',
        'D;;;DD;;;;;pp;;;;;;;;;;D',
        'D;;;;;;;;;;pp;;;;;D;;;;D',
        'D;;;;;D;;;;pp;;;;;;;;;;D',
        'D;;;;;D;;;;ppppp;;;;;;;D',
        'pppppppppppp;;;ppppppppp',
        'D;;;;;;;;;;;;;;;pp;;;;;p',
        'D;;DD;;;;;;;;;;;pp;;D;;D',
        'D;;;;;;;;D;;;;;;pp;;D;;D',
        'D;;;;;;;;D;;;;;;pp;;;;;D',
        'D;;;;;,;;D;;;;;;pp;;;;;D',
        'D;;;DD;;;;;;;;;;pp;;D;;D',
        'D;;;;;;;;;;;;;;;;;;;;;;D',
        'D;;;;;;;;;;;D;;;;;;;;;;D',
        'DDDDDDDDDDDDDDDDDDDDDDDD'
      ],
      npcs: [],
      chests: [
        { id: 'ch_forest_1', tx: 2, ty: 15, items: [{ id: 'pot_hp_m', qty: 2 }, { id: 'mat_enhance', qty: 2 }], gold: 180 },
        { id: 'ch_forest_2', tx: 21, ty: 2, items: [{ id: 'mat_goblin_fang', qty: 3 }, { id: 'pot_mp_l', qty: 2 }], gold: 240 }
      ],
      portals: [
        { tx: 0.9, ty: 8.5, toMap: 'meadow', toX: 21.6, toY: 8.0, label: '◀ 바람의 초원' },
        { tx: 23.1, ty: 8.5, toMap: 'canyon', toX: 1.8, toY: 8.5, label: '붉은 바람 협곡 ▶' },
        { tx: 11.5, ty: 0.7, toMap: 'ruins', toX: 11.5, toY: 16.0, label: '잊혀진 유적 ▲' }
      ],
      spawns: [
        { type: 'goblin', tx: 6.5, ty: 4.5 },
        { type: 'goblin', tx: 6.5, ty: 13.5 },
        { type: 'goblin', tx: 15.5, ty: 14.5 },
        { type: 'goblin_shaman', tx: 13.5, ty: 11.5 },
        { type: 'goblin_shaman', tx: 18.5, ty: 7.5 },
        { type: 'goblin_chief', tx: 19.5, ty: 4.5 }
      ]
    },

    canyon: {
      id: 'canyon',
      name: '붉은 바람 협곡',
      bgm: 'dungeon',
      safe: false,
      subtitle: 'Lv.8~10 · 작열하는 용암과 화염 수호자의 협곡',
      layout: [
        'CCCCCCCCCCCCCCCCCCCCCCCC',
        'CrrrrrrCCrrrrrrLLrrrrrrC',
        'CrrrrrrCCrrrrrLLLLrrrrrC',
        'CrrCCrrrrrrrrrrLLrrrrrrC',
        'CrrCCrrrrrLLrrrrrrrrrrrC',
        'CrrrrrrrrLLLLrrrrrrCCrrC',
        'CrrrrrrrrrLLrrrrrrrCCrrC',
        'rrrrrrrrrrrrrrrrrrrrrrrC',
        'rrrrrrCCrrrrrrCCrrrrrrrC',
        'CrrrrrCCrrrrrrCCrrrrrrrC',
        'CrrrrrrrrrrrrrrrrrrrrrrC',
        'CrrrLLrrrrrrrrrCCrrrrrrC',
        'CrrLLLLrrrrrrrrCCrrrrrrC',
        'CrrrLLrrrrrCCrrrrrrLLrrC',
        'CrrrrrrrrrrCCrrrrrLLLLrC',
        'CrrrrrrCrrrrrrrrrrrLLrrC',
        'CrrrrrrCrrrrrrrrrrrrrrrC',
        'CCCCCCCCCCCCCCCCCCCCCCCC'
      ],
      npcs: [],
      chests: [
        { id: 'ch_canyon_1', tx: 11, ty: 2, items: [{ id: 'mat_flame_core', qty: 2 }, { id: 'pot_hp_l', qty: 2 }], gold: 320 }
      ],
      portals: [
        { tx: 0.9, ty: 8.5, toMap: 'forest', toX: 21.6, toY: 8.5, label: '◀ 고요한 숲' }
      ],
      spawns: [
        { type: 'wyvern', tx: 5.5, ty: 5.5 },
        { type: 'wyvern', tx: 13.5, ty: 4.5 },
        { type: 'wyvern', tx: 10.5, ty: 10.5 },
        { type: 'lava_golem', tx: 7.5, ty: 14.5 },
        { type: 'lava_golem', tx: 14.5, ty: 15.5 },
        { type: 'ignis_boss', tx: 20.5, ty: 8.5 }
      ]
    },

    ruins: {
      id: 'ruins',
      name: '잊혀진 유적',
      bgm: 'dungeon',
      safe: false,
      subtitle: 'Lv.10~12 · 10년 전 성기사단의 기록이 잠든 신전',
      layout: [
        '###########__###########',
        '#_____#____**____#_____#',
        '#__*__#__________#__*__#',
        '#_____#___#__#___#_____#',
        '#___#######__#######___#',
        '#______________________#',
        '#___##____________##___#',
        '#___##____****____##___#',
        '#_________****_________#',
        '#___##____****____##___#',
        '#___##____________##___#',
        '#______________________#',
        '#___#######__#######___#',
        '#_____#___#__#___#_____#',
        '#__*__#__________#__*__#',
        '#_____#____**____#_____#',
        '#__________**__________#',
        '###########__###########'
      ],
      npcs: [],
      chests: [
        { id: 'ch_ruins_1', tx: 3, ty: 2, items: [{ id: 'hm_ruin_crown', qty: 1 }], gold: 340 },
        { id: 'ch_ruins_2', tx: 20, ty: 2, items: [{ id: 'mat_ancient_stone', qty: 2 }, { id: 'mat_dark_crystal', qty: 1 }, { id: 'pot_hp_l', qty: 2 }], gold: 380 }
      ],
      portals: [
        { tx: 11.5, ty: 17.1, toMap: 'forest', toX: 11.5, toY: 2.0, label: '고요한 숲 ▼' },
        { tx: 11.5, ty: 0.7, toMap: 'citadel', toX: 11.5, toY: 16.0, label: '흑요석 성채 ▲' }
      ],
      spawns: [
        { type: 'skeleton', tx: 7.5, ty: 6.5 },
        { type: 'skeleton', tx: 16.5, ty: 6.5 },
        { type: 'skeleton', tx: 8.5, ty: 14.5 },
        { type: 'golem', tx: 11.5, ty: 8.5 },
        { type: 'golem', tx: 15.5, ty: 14.5 },
        { type: 'dark_mage', tx: 4.5, ty: 11.5 },
        { type: 'dark_mage', tx: 19.5, ty: 11.5 }
      ]
    },

    citadel: {
      id: 'citadel',
      name: '침묵의 흑요석 성채',
      bgm: 'dungeon',
      safe: false,
      subtitle: 'Lv.12~14 · 배신자 대장군 카시우스의 아지트',
      layout: [
        'BBBBBBBBBBBbbBBBBBBBBBBB',
        'Bbbbbbbbbbb**bbbbbbbbbbB',
        'BbbBBbbbbbbbbbbbbbbBBbbB',
        'BbbBBbbbbbb**bbbbbbBBbbB',
        'Bbbbbbbbbbb**bbbbbbbbbbB',
        'BbbbbbbbbbbbbbbbbbbbbbbB',
        'BbbbbBBbbbbbbbbbbBBbbbbB',
        'BbbbbBBbbbb**bbbbBBbbbbB',
        'Bbbbbbbbbbb**bbbbbbbbbbB',
        'BbbbbBBbbbb**bbbbBBbbbbB',
        'BbbbbBBbbbbbbbbbbBBbbbbB',
        'BbbbbbbbbbbbbbbbbbbbbbbB',
        'BbbBBbbbbbb**bbbbbbBBbbB',
        'BbbBBbbbbbbbbbbbbbbBBbbB',
        'Bbbbbbbbbbb**bbbbbbbbbbB',
        'Bbbbbbbbbbb**bbbbbbbbbbB',
        'Bbbbbbbbbbb**bbbbbbbbbbB',
        'BBBBBBBBBBBbbBBBBBBBBBBB'
      ],
      npcs: [],
      chests: [
        { id: 'ch_citadel_1', tx: 2, ty: 8, items: [{ id: 'mat_dark_crystal', qty: 3 }, { id: 'pot_hp_l', qty: 3 }], gold: 480 }
      ],
      portals: [
        { tx: 11.5, ty: 17.1, toMap: 'ruins', toX: 11.5, toY: 2.0, label: '잊혀진 유적 ▼' },
        { tx: 11.5, ty: 0.7, toMap: 'altar', toX: 11.5, toY: 15.5, label: '봉인의 제단 (최종 BOSS) ▲' }
      ],
      spawns: [
        { type: 'fallen_knight', tx: 6.5, ty: 13.5 },
        { type: 'fallen_knight', tx: 16.5, ty: 13.5 },
        { type: 'abyss_assassin', tx: 5.5, ty: 8.5 },
        { type: 'abyss_assassin', tx: 17.5, ty: 8.5 },
        { type: 'fallen_knight', tx: 8.5, ty: 5.5 },
        { type: 'cassius_boss', tx: 11.5, ty: 4.5 }
      ]
    },

    altar: {
      id: 'altar',
      name: '봉인의 제단',
      bgm: 'boss',
      safe: false,
      subtitle: '최종 결전 · 심연의 기사 바르가스',
      layout: [
        'XXXXXXXXXXXXXXXXXXXXXXXX',
        'XaaaaaaaaaaaaaaaaaaaaaaX',
        'XaaXXaaaaaaaaaaaaaaXXaaX',
        'XaaXXaaaaaaaaaaaaaaXXaaX',
        'XaaaaaaaaaaaaaaaaaaaaaaX',
        'Xaaaaaaa********aaaaaaaX',
        'Xaaaaaa*aaaaaaaa*aaaaaaX',
        'Xaaaaaa*aaa**aaa*aaaaaaX',
        'Xaaaaaa*aaa**aaa*aaaaaaX',
        'Xaaaaaa*aaaaaaaa*aaaaaaX',
        'Xaaaaaaa********aaaaaaaX',
        'XaaaaaaaaaaaaaaaaaaaaaaX',
        'XaaXXaaaaaaaaaaaaaaXXaaX',
        'XaaXXaaaaaaaaaaaaaaXXaaX',
        'XaaaaaaaaaaaaaaaaaaaaaaX',
        'Xaaaaaaaaaa**aaaaaaaaaaX',
        'Xaaaaaaaaaa**aaaaaaaaaaX',
        'XXXXXXXXXXXaaXXXXXXXXXXX'
      ],
      npcs: [],
      chests: [],
      portals: [
        { tx: 11.5, ty: 17.1, toMap: 'citadel', toX: 11.5, toY: 2.0, label: '흑요석 성채 ▼' }
      ],
      spawns: [
        { type: 'vargas', tx: 11.5, ty: 6.5 }
      ]
    }
  };

  global.GAME_DATA = {
    TILE_SIZE,
    RARITY,
    CLASSES,
    ITEMS,
    SHOP_GENERAL,
    SHOP_BLACKSMITH,
    RECIPES,
    MONSTERS,
    QUESTS,
    SOLID_TILES,
    MAPS
  };
})(window);
