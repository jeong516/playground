// Game Data: Classes, Skills, Items, Synthesis Recipes, Monsters, Quests, and World Maps
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
    wp_iron_sword:      { id: 'wp_iron_sword', name: '수련용 철검', type: 'weapon', rarity: 'common', atk: 8, price: 80, desc: '솔티아 기사단의 기본 철검.' },
    wp_iron_dagger:     { id: 'wp_iron_dagger', name: '사냥꾼의 단검', type: 'weapon', rarity: 'common', atk: 7, crit: 5, price: 80, desc: '가볍고 예리한 쌍단검.' },
    wp_rune_sword:      { id: 'wp_rune_sword', name: '초급 룬소드', type: 'weapon', rarity: 'common', atk: 7, int: 3, price: 80, desc: '마력이 깃든 입문자용 마검.' },
    wp_meadow_blade:    { id: 'wp_meadow_blade', name: '바람의 강철검', type: 'weapon', rarity: 'uncommon', atk: 15, agi: 2, price: 240, desc: '초원의 바람이 깃든 날렵한 검.' },
    wp_chief_axe:       { id: 'wp_chief_axe', name: '족장의 전투도끼', type: 'weapon', rarity: 'rare', atk: 24, str: 3, price: 480, desc: '고블린 족장이 휘두르던 묵직한 도끼.' },
    wp_ruin_runeblade:  { id: 'wp_ruin_runeblade', name: '고대 유적의 성검', type: 'weapon', rarity: 'heroic', atk: 34, int: 4, crit: 6, price: 950, desc: '잊혀진 유적의 마석이 박힌 명검.' },
    wp_soltia_blade:    { id: 'wp_soltia_blade', name: '솔티아의 성검', type: 'weapon', rarity: 'legendary', atk: 52, str: 6, vit: 5, crit: 10, price: 2500, desc: '전설의 영웅이 남긴 빛의 성검.' },
    wp_shadow_fang:     { id: 'wp_shadow_fang', name: '심연의 쌍아', type: 'weapon', rarity: 'legendary', atk: 48, agi: 9, crit: 18, price: 2500, desc: '그림자조차 베어내는 전설의 쌍검.' },
    wp_starlight_blade: { id: 'wp_starlight_blade', name: '성광의 마검', type: 'weapon', rarity: 'legendary', atk: 50, int: 10, crit: 10, price: 2500, desc: '별빛의 마력이 응축된 전설의 마검.' },

    // Armor
    ar_leather:         { id: 'ar_leather', name: '가죽 갑옷', type: 'armor', rarity: 'common', def: 5, hp: 20, price: 100, desc: '가볍고 튼튼한 모험가용 가죽 갑옷.' },
    ar_forest_mail:     { id: 'ar_forest_mail', name: '숲의 수호갑옷', type: 'armor', rarity: 'uncommon', def: 11, hp: 55, vit: 2, price: 320, desc: '멧돼지 가죽과 송곳니로 보강한 갑옷.' },
    ar_knight_plate:    { id: 'ar_knight_plate', name: '강철 판금갑옷', type: 'armor', rarity: 'rare', def: 18, hp: 95, vit: 3, price: 650, desc: '솔티아 정예 기사용 판금 갑옷.' },
    ar_ancient_plate:   { id: 'ar_ancient_plate', name: '고대 수호자의 갑옷', type: 'armor', rarity: 'heroic', def: 28, hp: 160, vit: 5, int: 3, price: 1200, desc: '고대 마석의 결계가 깃든 영웅 갑옷.' },

    // Helms
    hm_iron_cap:        { id: 'hm_iron_cap', name: '철제 투구', type: 'helm', rarity: 'common', def: 3, hp: 15, price: 90, desc: '머리를 보호하는 기본 철투구.' },
    hm_goblin_helm:     { id: 'hm_goblin_helm', name: '고블린 족장의 투구', type: 'helm', rarity: 'rare', def: 9, str: 3, hp: 45, price: 420, desc: '야성적인 뿔이 달린 전사의 투구.' },
    hm_ruin_crown:      { id: 'hm_ruin_crown', name: '유적의 마력관', type: 'helm', rarity: 'heroic', def: 14, int: 5, mp: 45, crit: 5, price: 850, desc: '고대 왕국의 마력이 서린 서클릿.' },

    // Accessories
    ac_novice_ring:     { id: 'ac_novice_ring', name: '초보자의 반지', type: 'accessory', rarity: 'uncommon', atk: 3, def: 2, hp: 25, price: 160, desc: '솔티아 마을에 숨겨져 있던 행운의 반지.' },
    ac_wind_pendant:    { id: 'ac_wind_pendant', name: '바람의 목걸이', type: 'accessory', rarity: 'rare', agi: 4, crit: 6, mp: 25, price: 450, desc: '솔티아의 바람이 깃든 수호 목걸이.' },
    ac_soltia_ring:     { id: 'ac_soltia_ring', name: '솔티아의 반지', type: 'accessory', rarity: 'heroic', atk: 8, def: 6, hp: 80, mp: 40, crit: 8, price: 1100, desc: '고대 영웅의 축복이 담긴 조합 반지.' },

    // Consumables
    pot_hp_s:           { id: 'pot_hp_s', name: '소형 HP 포션', type: 'consumable', subtype: 'hp', power: 75, rarity: 'common', price: 30, desc: 'HP를 75 회복합니다.' },
    pot_hp_m:           { id: 'pot_hp_m', name: '중형 HP 포션', type: 'consumable', subtype: 'hp', power: 180, rarity: 'uncommon', price: 80, desc: 'HP를 180 회복합니다.' },
    pot_hp_l:           { id: 'pot_hp_l', name: '대형 HP 포션', type: 'consumable', subtype: 'hp', power: 380, rarity: 'rare', price: 180, desc: 'HP를 380 회복합니다.' },
    pot_mp_s:           { id: 'pot_mp_s', name: '소형 MP 포션', type: 'consumable', subtype: 'mp', power: 55, rarity: 'common', price: 35, desc: 'MP를 55 회복합니다.' },
    pot_mp_l:           { id: 'pot_mp_l', name: '대형 MP 포션', type: 'consumable', subtype: 'mp', power: 140, rarity: 'uncommon', price: 95, desc: 'MP를 140 회복합니다.' },
    scroll_town:        { id: 'scroll_town', name: '마을 귀환 주문서', type: 'consumable', subtype: 'town', rarity: 'common', price: 45, desc: '즉시 솔티아 마을로 귀환합니다.' },

    // Materials & Enhance
    mat_enhance:        { id: 'mat_enhance', name: '강화석', type: 'material', rarity: 'uncommon', price: 110, desc: '대장장이에게 장비 강화를 의뢰할 때 사용합니다.' },
    mat_slime_core:     { id: 'mat_slime_core', name: '슬라임 핵', type: 'material', rarity: 'common', price: 25, desc: '슬라임에게서 얻는 영롱한 핵. 조합 재료.' },
    mat_boar_hide:      { id: 'mat_boar_hide', name: '멧돼지 가죽', type: 'material', rarity: 'common', price: 35, desc: '질긴 숲 멧돼지의 가죽. 방어구 조합 재료.' },
    mat_goblin_fang:    { id: 'mat_goblin_fang', name: '고블린 송곳니', type: 'material', rarity: 'uncommon', price: 50, desc: '날카로운 고블린의 송곳니. 조합 재료.' },
    mat_ancient_stone:  { id: 'mat_ancient_stone', name: '고대 마석', type: 'material', rarity: 'rare', price: 95, desc: '유적의 몬스터가 품고 있는 고대 마력석.' },
    mat_dark_crystal:   { id: 'mat_dark_crystal', name: '어둠의 결정', type: 'material', rarity: 'heroic', price: 160, desc: '심연의 기운이 응축된 희귀 결정.' }
  };

  const SHOP_GENERAL = ['pot_hp_s', 'pot_hp_m', 'pot_hp_l', 'pot_mp_s', 'pot_mp_l', 'mat_enhance', 'scroll_town'];
  const SHOP_BLACKSMITH = ['wp_meadow_blade', 'ar_leather', 'hm_iron_cap', 'ar_knight_plate'];

  const RECIPES = [
    {
      id: 'rc_meadow_blade',
      result: 'wp_meadow_blade',
      gold: 100,
      materials: [{ id: 'mat_slime_core', qty: 3 }]
    },
    {
      id: 'rc_forest_mail',
      result: 'ar_forest_mail',
      gold: 180,
      materials: [{ id: 'mat_boar_hide', qty: 3 }, { id: 'mat_goblin_fang', qty: 2 }]
    },
    {
      id: 'rc_goblin_helm',
      result: 'hm_goblin_helm',
      gold: 240,
      materials: [{ id: 'mat_goblin_fang', qty: 4 }]
    },
    {
      id: 'rc_ruin_blade',
      result: 'wp_ruin_runeblade',
      gold: 500,
      materials: [{ id: 'mat_ancient_stone', qty: 3 }, { id: 'mat_enhance', qty: 2 }]
    },
    {
      id: 'rc_ancient_plate',
      result: 'ar_ancient_plate',
      gold: 680,
      materials: [{ id: 'mat_ancient_stone', qty: 4 }, { id: 'mat_dark_crystal', qty: 2 }]
    },
    {
      id: 'rc_soltia_ring',
      result: 'ac_soltia_ring',
      gold: 450,
      materials: [{ id: 'mat_slime_core', qty: 2 }, { id: 'mat_ancient_stone', qty: 2 }, { id: 'mat_dark_crystal', qty: 1 }]
    }
  ];

  const MONSTERS = {
    slime_green: {
      id: 'slime_green', name: '초록 슬라임', lv: 1, hp: 46, atk: 8, def: 2, exp: 18, gold: [10, 18],
      speed: 44, ai: 'melee', aggro: 120, size: 22,
      drops: [{ id: 'mat_slime_core', rate: 0.45 }, { id: 'pot_hp_s', rate: 0.16 }]
    },
    slime_blue: {
      id: 'slime_blue', name: '파랑 슬라임', lv: 2, hp: 68, atk: 11, def: 3, exp: 26, gold: [14, 24],
      speed: 50, ai: 'melee', aggro: 135, size: 22,
      drops: [{ id: 'mat_slime_core', rate: 0.5 }, { id: 'pot_mp_s', rate: 0.18 }, { id: 'mat_enhance', rate: 0.08 }]
    },
    boar: {
      id: 'boar', name: '숲 멧돼지', lv: 3, hp: 96, atk: 15, def: 5, exp: 38, gold: [20, 32],
      speed: 62, ai: 'charger', aggro: 145, size: 24,
      drops: [{ id: 'mat_boar_hide', rate: 0.5 }, { id: 'pot_hp_s', rate: 0.2 }, { id: 'mat_enhance', rate: 0.1 }]
    },
    goblin: {
      id: 'goblin', name: '고블린 전사', lv: 4, hp: 135, atk: 20, def: 7, exp: 56, gold: [30, 48],
      speed: 64, ai: 'melee', aggro: 155, size: 24,
      drops: [{ id: 'mat_goblin_fang', rate: 0.5 }, { id: 'pot_hp_m', rate: 0.15 }, { id: 'mat_enhance', rate: 0.14 }]
    },
    goblin_shaman: {
      id: 'goblin_shaman', name: '고블린 주술사', lv: 5, hp: 120, atk: 24, def: 5, exp: 68, gold: [36, 56],
      speed: 52, ai: 'ranged', aggro: 185, size: 24, projColor: '#38bdf8',
      drops: [{ id: 'mat_goblin_fang', rate: 0.45 }, { id: 'pot_mp_s', rate: 0.25 }, { id: 'mat_enhance', rate: 0.16 }]
    },
    goblin_chief: {
      id: 'goblin_chief', name: '고블린 족장', lv: 6, hp: 460, atk: 32, def: 11, exp: 210, gold: [140, 200],
      speed: 66, ai: 'miniboss', aggro: 195, size: 34, isBoss: true,
      drops: [{ id: 'wp_chief_axe', rate: 0.7 }, { id: 'mat_goblin_fang', rate: 1.0 }, { id: 'mat_enhance', rate: 0.8 }]
    },
    skeleton: {
      id: 'skeleton', name: '스켈레톤 검사', lv: 7, hp: 225, atk: 33, def: 12, exp: 96, gold: [55, 85],
      speed: 68, ai: 'melee', aggro: 165, size: 24,
      drops: [{ id: 'mat_ancient_stone', rate: 0.42 }, { id: 'pot_hp_m', rate: 0.2 }, { id: 'mat_enhance', rate: 0.18 }]
    },
    golem: {
      id: 'golem', name: '유적 골렘', lv: 8, hp: 340, atk: 40, def: 19, exp: 135, gold: [75, 115],
      speed: 44, ai: 'charger', aggro: 150, size: 28,
      drops: [{ id: 'mat_ancient_stone', rate: 0.6 }, { id: 'mat_dark_crystal', rate: 0.25 }, { id: 'mat_enhance', rate: 0.24 }]
    },
    dark_mage: {
      id: 'dark_mage', name: '어둠의 마도사', lv: 9, hp: 260, atk: 44, def: 11, exp: 145, gold: [85, 125],
      speed: 56, ai: 'ranged', aggro: 205, size: 24, projColor: '#f43f5e',
      drops: [{ id: 'mat_dark_crystal', rate: 0.45 }, { id: 'mat_ancient_stone', rate: 0.4 }, { id: 'pot_mp_l', rate: 0.24 }]
    },
    vargas: {
      id: 'vargas', name: '심연의 기사 바르가스', lv: 11, hp: 1350, atk: 54, def: 18, exp: 900, gold: [650, 850],
      speed: 74, ai: 'boss', aggro: 260, size: 38, isBoss: true, isFinalBoss: true,
      drops: [{ id: 'mat_dark_crystal', rate: 1.0 }, { id: 'mat_enhance', rate: 1.0 }]
    }
  };

  const QUESTS = [
    {
      id: 'q1_slimes',
      title: '바람의 초원 정화',
      desc: '마을 북쪽 바람의 초원에 슬라임들이 급증했습니다. 슬라임 5마리를 처치하고 촌장에게 보고하세요.',
      type: 'kill_any',
      targets: ['slime_green', 'slime_blue'],
      goal: 5,
      reward: { gold: 160, exp: 120, items: [{ id: 'mat_enhance', qty: 2 }, { id: 'pot_hp_s', qty: 3 }] },
      dialogStart: [
        '촌장 엘더: "솔티아의 바람이 불길하게 흔들리고 있네... 북쪽 초원에 슬라임들이 들끓고 있어."',
        '촌장 엘더: "자네의 실력을 보여주시게. 바람의 초원에서 슬라임 5마리를 처치하고 돌아오게나!"'
      ],
      dialogProgress: [
        '촌장 엘더: "마을 북쪽 포털로 나가면 바로 바람의 초원이라네. 슬라임 5마리를 처치해 주게."'
      ],
      dialogComplete: [
        '촌장 엘더: "오오, 훌륭하네! 과연 솔티아의 바람이 선택한 영웅답군."',
        '촌장 엘더: "보상으로 강화석과 포션을 받게. 대장장이 볼칸에게 가면 무기를 강화할 수 있다네."'
      ]
    },
    {
      id: 'q2_chief',
      title: '고요한 숲의 약탈자',
      desc: '바람의 초원 동쪽 고요한 숲에서 난동을 부리는 고블린 족장을 처치하세요.',
      type: 'kill_any',
      targets: ['goblin_chief'],
      goal: 1,
      reward: { gold: 420, exp: 340, items: [{ id: 'mat_enhance', qty: 3 }, { id: 'ac_wind_pendant', qty: 1 }] },
      dialogStart: [
        '촌장 엘더: "초원은 잠잠해졌지만, 동쪽 고요한 숲에서 고블린 족장이 무리를 이끌고 있다네."',
        '촌장 엘더: "족장을 쓰러뜨리면 숲 너머 잊혀진 유적으로 가는 길이 안전해질 걸세. 조심하게나!"'
      ],
      dialogProgress: [
        '촌장 엘더: "고블린 족장은 고요한 숲 북동쪽 공터에 있을 걸세. 장비 강화와 포션을 꼭 챙기게."'
      ],
      dialogComplete: [
        '촌장 엘더: "고블린 족장을 쓰러뜨렸단 말인가! 이 바람의 목걸이를 자네에게 맡기겠네."',
        '촌장 엘더: "하지만 진짜 위협은 숲 북쪽, 잊혀진 유적 깊은 곳에서 깨어나고 있다네..."'
      ]
    },
    {
      id: 'q3_stones',
      title: '고대 마석의 흔적',
      desc: '잊혀진 유적의 몬스터들에게서 고대 마석 3개를 모아 촌장에게 가져가세요.',
      type: 'collect',
      targetItem: 'mat_ancient_stone',
      goal: 3,
      reward: { gold: 720, exp: 580, items: [{ id: 'mat_enhance', qty: 4 }, { id: 'pot_hp_l', qty: 3 }] },
      dialogStart: [
        '촌장 엘더: "봉인의 제단을 열기 위해선 유적에 흩어진 고대 마석의 기운을 조사해야 하네."',
        '촌장 엘더: "고요한 숲 북쪽 포털을 통해 잊혀진 유적으로 들어가 고대 마석 3개를 모아오게나!"'
      ],
      dialogProgress: [
        '촌장 엘더: "잊혀진 유적의 스켈레톤과 골렘들이 고대 마석을 품고 있다네. 3개를 모아 돌아오게."'
      ],
      dialogComplete: [
        '촌장 엘더: "이 불길한 파동... 틀림없어! 봉인의 제단에서 심연의 기사 바르가스가 깨어났네!"',
        '촌장 엘더: "이제 마지막 싸움일세. 대장장이에게 최강의 장비를 조합하고 강화해 두게나."'
      ]
    },
    {
      id: 'q4_vargas',
      title: '심연의 기사 토벌',
      desc: '잊혀진 유적 최북단 봉인의 제단에서 심연의 기사 바르가스를 격파하세요!',
      type: 'kill_any',
      targets: ['vargas'],
      goal: 1,
      reward: { gold: 2000, exp: 1200, legendWeapon: true, items: [{ id: 'mat_enhance', qty: 5 }] },
      dialogStart: [
        '촌장 엘더: "잊혀진 유적 가장 북쪽에 봉인의 제단이 있네. 그곳에서 바르가스를 막아주게!"',
        '촌장 엘더: "솔티아의 운명이 자네의 검 끝에 달려 있다네... 무사히 돌아오게, 영웅이여!"'
      ],
      dialogProgress: [
        '촌장 엘더: "바르가스는 강력한 범위 공격을 구사한다네. Shift(회피)와 포션을 아끼지 말게!"'
      ],
      dialogComplete: [
        '촌장 엘더: "해냈군... 드디어 심연의 기사를 물리치고 솔티아에 평화를 되찾아 주었네!"',
        '촌장 엘더: "자네의 이름은 영원히 영웅서기에 기록될 걸세! 전설의 무기를 받게나!"'
      ]
    }
  ];

  // Tile legend:
  // '.' grass, ',' flower, ';' darkGrass, 'p' path, 'c' cobble
  // 'T' tree, 'D' darkTree, '~' water, '=' bridge
  // 'R' houseRoof, 'W' houseWall, 'd' houseDoor, 'F' fountain
  // '#' stoneWall, '_' ruinFloor, '*' ruinRune
  // 'X' altarWall, 'a' altarFloor
  const SOLID_TILES = new Set(['T', 'D', '~', 'R', 'W', 'd', 'F', '#', 'X']);

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
        { id: 'shop', name: '잡화상인 미나', sprite: 'shop', tx: 5.5, ty: 10.6, role: 'shop' },
        { id: 'smith', name: '대장장이 볼칸', sprite: 'smith', tx: 18.5, ty: 10.6, role: 'smith' }
      ],
      fountains: [{ tx: 11.5, ty: 8 }],
      chests: [
        { id: 'ch_town_1', tx: 21, ty: 15, items: [{ id: 'ac_novice_ring', qty: 1 }, { id: 'pot_hp_s', qty: 2 }], gold: 50 }
      ],
      portals: [
        { tx: 11.5, ty: 0.7, toMap: 'meadow', toX: 11.5, toY: 16, label: '바람의 초원 ▲' }
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
        'Tppppppp...~~=~~..ppppp.',
        'T......ppppp===pppp....p',
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
        { id: 'ch_meadow_2', tx: 21, ty: 14, items: [{ id: 'hm_iron_cap', qty: 1 }], gold: 60 }
      ],
      portals: [
        { tx: 11.5, ty: 17.1, toMap: 'town', toX: 11.5, toY: 2.0, label: '솔티아 마을 ▼' },
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

    forest: {
      id: 'forest',
      name: '고요한 숲',
      bgm: 'field',
      safe: false,
      subtitle: 'Lv.4~6 · 고블린 무리와 족장의 은신처',
      layout: [
        'DDDDDDDDDDDppDDDDDDDDDDD',
        'D;;D;;;;;;;pp;;;;;;;D;;D',
        'D;;;;;;;;;;pp;;;;;;;,;;D',
        'D;;;DD;;;;;pp;;;;;DD;;;D',
        'D;;;DD;;;;;pp;;;;;;;;;;D',
        'D;;;;;;;;;;pp;;;;;D;;;;D',
        'D;;;;;D;;;;pp;;;;;;;;;;D',
        'D;;;;;D;;;;ppppp;;;;;;;D',
        'pppppppppppp;;;ppp;;;;;D',
        'D;;;;;;;;;;;;;;;pp;;;;;D',
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
        { id: 'ch_forest_1', tx: 2, ty: 15, items: [{ id: 'pot_hp_m', qty: 2 }, { id: 'mat_enhance', qty: 2 }], gold: 150 },
        { id: 'ch_forest_2', tx: 21, ty: 2, items: [{ id: 'mat_goblin_fang', qty: 3 }, { id: 'pot_mp_l', qty: 2 }], gold: 220 }
      ],
      portals: [
        { tx: 0.9, ty: 8.5, toMap: 'meadow', toX: 21.6, toY: 8.0, label: '◀ 바람의 초원' },
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

    ruins: {
      id: 'ruins',
      name: '잊혀진 유적',
      bgm: 'dungeon',
      safe: false,
      subtitle: 'Lv.7~9 · 고대 마력이 잠든 지하 신전',
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
        { id: 'ch_ruins_1', tx: 3, ty: 2, items: [{ id: 'hm_ruin_crown', qty: 1 }], gold: 300 },
        { id: 'ch_ruins_2', tx: 20, ty: 2, items: [{ id: 'mat_ancient_stone', qty: 2 }, { id: 'mat_dark_crystal', qty: 1 }, { id: 'pot_hp_l', qty: 2 }], gold: 350 }
      ],
      portals: [
        { tx: 11.5, ty: 17.1, toMap: 'forest', toX: 11.5, toY: 2.0, label: '고요한 숲 ▼' },
        { tx: 11.5, ty: 0.7, toMap: 'altar', toX: 11.5, toY: 15.5, label: '봉인의 제단 (BOSS) ▲' }
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
        { tx: 11.5, ty: 17.1, toMap: 'ruins', toX: 11.5, toY: 2.0, label: '잊혀진 유적 ▼' }
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
