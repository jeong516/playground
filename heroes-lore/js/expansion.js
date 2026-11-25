// 영웅서기: 솔티아의 바람 v10 — 200개 신규 월드맵(10대륙), 4배 다양해진 시나리오, 85+ 신규 아이템/레시피, 직업별 8스킬(총 24스킬)
(function (global) {
  'use strict';

  const DATA = global.GAME_DATA;
  if (!DATA) return;

  // Register new solid biome tiles (Ice Wall, Sky Void, Swamp Tree, Cosmic Void Pillar)
  ['I', 'K', 'M', 'V'].forEach((t) => DATA.SOLID_TILES.add(t));

  // =========================================================================
  // 1. EXPANDED SKILLS: 4 -> 8 UNIQUE ACTIVE SKILLS PER CLASS (24 TOTAL!)
  // =========================================================================
  DATA.CLASSES.knight.skills.push(
    { id: 'k_charge', name: '돌진 참격', mp: 14, cd: 4.2, unlockLv: 3, icon: '⚡', desc: '전방으로 맹렬히 돌진하며 경로의 적을 베어 넘기고 기절시킵니다.', mult: 2.35, range: 86, type: 'charge_slash', color: '#fbbf24' },
    { id: 'k_quake', name: '대지 분쇄', mp: 22, cd: 6.5, unlockLv: 5, icon: '💥', desc: '대검으로 지면을 강타해 거대한 충격파로 주변 적을 기절·넉백시킵니다.', mult: 2.55, radius: 86, type: 'quake', color: '#f97316' },
    { id: 'k_beam', name: '성광의 검기', mp: 19, cd: 5.0, unlockLv: 8, icon: '🌟', desc: '전방 부채꼴로 3갈래 성스러운 빛의 검기를 발사합니다.', mult: 1.95, range: 195, type: 'wave_beam', color: '#fef08a' },
    { id: 'k_sanctuary', name: '천상의 성역', mp: 42, cd: 14.0, unlockLv: 12, icon: '👑', desc: '[궁극 오의] 황금 성역을 전개해 HP를 30% 회복하고 8개의 빛기둥으로 적을 초토화합니다.', mult: 3.9, radius: 126, type: 'sanctuary', color: '#fde047' }
  );

  DATA.CLASSES.rogue.skills.push(
    { id: 'r_fan', name: '표창 난사', mp: 13, cd: 3.6, unlockLv: 3, icon: '✦', desc: '전방 부채꼴로 5개의 관통 청록 표창을 퍼부어 다수의 적을 꿰뚫습니다.', mult: 1.45, range: 185, type: 'fan_knives', color: '#38bdf8' },
    { id: 'r_blink', name: '암습 순간이동', mp: 18, cd: 5.2, unlockLv: 5, icon: '🌑', desc: '가장 가까운 적 등 뒤로 즉시 순간이동해 확정 치명타 일격을 꽂습니다.', mult: 3.1, range: 165, type: 'blink_strike', color: '#2dd4bf' },
    { id: 'r_venom', name: '독안개 폭풍', mp: 20, cd: 6.2, unlockLv: 8, icon: '☠️', desc: '맹독 회오리를 방출해 주변 적에게 지속 둔화와 치명적 피해를 입힙니다.', mult: 2.45, radius: 92, type: 'poison_nova', color: '#10b981' },
    { id: 'r_eclipse', name: '월영 절멸참', mp: 38, cd: 12.5, unlockLv: 12, icon: '🌙', desc: '[궁극 오의] 차원을 가르는 쌍검 십자참과 연쇄 번개 난무로 주변을 섬멸합니다.', mult: 4.1, radius: 118, type: 'eclipse_cross', color: '#f43f5e' }
  );

  DATA.CLASSES.runeblade.skills.push(
    { id: 'm_chain', name: '체인 라이트닝', mp: 16, cd: 4.2, unlockLv: 3, icon: '⚡', desc: '푸른 번개를 불러내 최대 5마리의 적에게 연쇄 전격 피해를 입힙니다.', mult: 2.35, range: 170, type: 'chain_lightning', color: '#60a5fa' },
    { id: 'm_barrage', name: '성운 광선', mp: 19, cd: 4.8, unlockLv: 5, icon: '🌌', desc: '5발의 성운 마력탄을 전방으로 쏟아부어 넓은 범위를 폭격합니다.', mult: 1.55, range: 195, type: 'astral_barrage', color: '#c084fc' },
    { id: 'm_astral', name: '별빛 장막', mp: 12, cd: 10.5, unlockLv: 8, icon: '💫', desc: '별빛 파동으로 적을 밀어내고 HP와 MP를 동시에 대량 회복합니다.', mult: 1.8, radius: 84, type: 'astral_shield', color: '#7dd3fc' },
    { id: 'm_supernova', name: '초신성 붕괴', mp: 44, cd: 14.0, unlockLv: 12, icon: '☀️', desc: '[궁극 오의] 화면을 뒤덮는 초신성 대폭발과 8개의 성좌 광선을 떨어뜨립니다.', mult: 4.25, radius: 136, type: 'supernova', color: '#f59e0b' }
  );

  // =========================================================================
  // 2. 85+ DIVERSE NEW ITEMS (ELEMENTAL GEAR, SPECIAL PASSIVES, ELIXIRS, MATS)
  // =========================================================================
  Object.assign(DATA.ITEMS, {
    // --- 10 New Continent Materials ---
    mat_coral_shard:    { id: 'mat_coral_shard', name: '심해 산호 조각', type: 'material', rarity: 'uncommon', price: 70, desc: '제2대륙 아틀란티아에서 채취하는 마력 산호.' },
    mat_magma_core:     { id: 'mat_magma_core', name: '흑요석 용암핵', type: 'material', rarity: 'rare', price: 110, desc: '제3대륙 화산령의 뜨거운 마그마 결정.' },
    mat_frost_crystal:  { id: 'mat_frost_crystal', name: '만년 빙하 수정', type: 'material', rarity: 'rare', price: 130, desc: '제4대륙 은빛 설원의 절대영도 수정.' },
    mat_sun_relic:      { id: 'mat_sun_relic', name: '태양 신전 유물편', type: 'material', rarity: 'heroic', price: 165, desc: '제5대륙 황금 사막 피라미드의 고대 유물.' },
    mat_sky_feather:    { id: 'mat_sky_feather', name: '천공 그리핀 깃털', type: 'material', rarity: 'heroic', price: 195, desc: '제6대륙 부유섬 에테리아의 성스러운 깃털.' },
    mat_cursed_spore:   { id: 'mat_cursed_spore', name: '저주받은 늪 포자', type: 'material', rarity: 'heroic', price: 225, desc: '제7대륙 그림자 늪지의 몽환적인 마력 포자.' },
    mat_dragon_scale:   { id: 'mat_dragon_scale', name: '태고의 용비늘', type: 'material', rarity: 'legendary', price: 290, desc: '제8대륙 용의 협곡에서 얻는 단단한 용의 비늘.' },
    mat_void_essence:   { id: 'mat_void_essence', name: '차원 균열 정수', type: 'material', rarity: 'legendary', price: 340, desc: '제9대륙 별의 회랑에서 응축된 시공간의 파편.' },
    mat_star_dust:      { id: 'mat_star_dust', name: '성좌의 은하수 가루', type: 'material', rarity: 'mythic', price: 420, desc: '제9·10대륙(161~200구역)과 심연의 탑 보스층(5층 단위)에서 얻는 최상급 신화 연성 재료.' },
    mat_eternal_petal:  { id: 'mat_eternal_petal', name: '영원의 바람 꽃잎', type: 'material', rarity: 'eternal', price: 580, desc: '제10대륙 솔티아 코어에만 피어나는 영원의 꽃잎.' },

    // --- 22 New Elemental & Build-Defining Weapons ---
    wp_wind_rapier:       { id: 'wp_wind_rapier', name: '질풍의 레이피어', type: 'weapon', rarity: 'uncommon', atk: 18, agi: 4, spd: 12, price: 310, desc: '이동속도가 빨라지는 가벼운 세검.' },
    wp_vampire_fang:      { id: 'wp_vampire_fang', name: '흡혈귀의 붉은 송곳니', type: 'weapon', rarity: 'rare', atk: 29, crit: 8, lifesteal: 7, price: 680, desc: '타격 시 피해의 7%만큼 HP를 흡수하는 요검.' },
    wp_frostbite_blade:   { id: 'wp_frostbite_blade', name: '서리송곳니 빙결검', type: 'weapon', rarity: 'rare', atk: 34, int: 5, skillDmg: 10, price: 790, desc: '스킬 위력을 높이는 혹한의 명검.' },
    wp_storm_twinblade:   { id: 'wp_storm_twinblade', name: '뇌격의 쌍날검', type: 'weapon', rarity: 'heroic', atk: 44, agi: 8, crit: 12, spd: 14, price: 1320, desc: '번개처럼 빠른 기동성과 치명타를 부여.' },
    wp_atlantia_trident:  { id: 'wp_atlantia_trident', name: '아틀란티아 삼지창검', type: 'weapon', rarity: 'heroic', atk: 52, str: 6, int: 6, mpRegen: 3, price: 1850, desc: '심해 제국의 해류가 깃든 왕실 무기.' },
    wp_magma_cleaver:     { id: 'wp_magma_cleaver', name: '용암 분쇄 대도', type: 'weapon', rarity: 'heroic', atk: 64, str: 10, vit: 6, price: 2450, desc: '화산령의 흑요석과 마그마로 주조한 대검.' },
    wp_glacier_scepter:   { id: 'wp_glacier_scepter', name: '빙하 여왕의 수정검', type: 'weapon', rarity: 'legendary', atk: 76, int: 14, skillDmg: 16, mpRegen: 4, price: 3600, desc: '절대영도의 마력이 응축된 전설 마검.' },
    wp_sun_pharaoh_spear: { id: 'wp_sun_pharaoh_spear', name: '태양신 라-솔의 황금창', type: 'weapon', rarity: 'legendary', atk: 88, str: 12, crit: 15, lifesteal: 6, price: 4600, desc: '태양의 불꽃으로 생명력을 흡수하는 신전 성물.' },
    wp_sky_zephyr_edge:   { id: 'wp_sky_zephyr_edge', name: '제피로스의 천공검', type: 'weapon', rarity: 'legendary', atk: 104, agi: 16, crit: 18, spd: 20, price: 5900, desc: '하늘의 바람을 타고 베는 에테리아의 비검.' },
    wp_witchwood_scythe:  { id: 'wp_witchwood_scythe', name: '마녀 모웬의 저주낫', type: 'weapon', rarity: 'mythic', atk: 128, int: 18, crit: 16, lifesteal: 10, price: 7800, desc: '적의 영혼을 거두어 HP를 10% 흡수하는 신화 대낫.' },
    wp_dragon_slayer:     { id: 'wp_dragon_slayer', name: '바하무트 멸룡 대검', type: 'weapon', rarity: 'mythic', atk: 154, str: 24, vit: 14, skillDmg: 22, price: 10400, desc: '태고의 용비늘로 벼려낸 압도적인 멸룡검.' },
    wp_chrono_rift_blade: { id: 'wp_chrono_rift_blade', name: '시간의 틈새 크로노블레이드', type: 'weapon', rarity: 'mythic', atk: 188, agi: 22, int: 22, crit: 22, spd: 22, price: 13800, desc: '시공간을 베어내는 차원의 회랑 신화 무기.' },
    wp_seraphim_claymore: { id: 'wp_seraphim_claymore', name: '세라핌 천사장의 성검', type: 'weapon', rarity: 'mythic', atk: 225, str: 28, vit: 20, lifesteal: 8, skillDmg: 25, price: 18500, desc: '천공의 축복과 성광이 깃든 최상급 성검.' },
    wp_eclipse_twin_fang: { id: 'wp_eclipse_twin_fang', name: '일식의 쌍월아', type: 'weapon', rarity: 'eternal', atk: 248, agi: 36, crit: 32, spd: 26, lifesteal: 9, price: 24000, desc: '치명타와 흡혈을 극한으로 끌어올린 영원의 쌍검.' },
    wp_genesis_scepter:   { id: 'wp_genesis_scepter', name: '창세 성좌의 마도검', type: 'weapon', rarity: 'eternal', atk: 262, int: 42, mpRegen: 8, skillDmg: 35, price: 26500, desc: '모든 스킬 위력을 35% 증폭하는 영원의 마검.' },

    // --- 14 New Diverse Armors ---
    ar_scout_cloak:       { id: 'ar_scout_cloak', name: '바람 정찰자의 외투', type: 'armor', rarity: 'uncommon', def: 11, hp: 65, spd: 10, price: 320, desc: '기동력을 높여주는 가벼운 정찰 망토.' },
    ar_blood_cuirass:     { id: 'ar_blood_cuirass', name: '진홍빛 흡혈 흉갑', type: 'armor', rarity: 'rare', def: 22, hp: 140, lifesteal: 4, price: 780, desc: '전투 중 체력을 흡수하는 붉은 갑옷.' },
    ar_frost_guard:       { id: 'ar_frost_guard', name: '빙하 수호자의 판금', type: 'armor', rarity: 'heroic', def: 38, hp: 250, vit: 8, mpRegen: 2, price: 1650, desc: '서리 마력으로 몸을 보호하는 설원의 갑주.' },
    ar_solar_robe:        { id: 'ar_solar_robe', name: '태양 신관의 황금 로브', type: 'armor', rarity: 'heroic', def: 44, hp: 310, int: 12, skillDmg: 14, price: 2350, desc: '스킬 위력을 대폭 높이는 황금 사막의 법의.' },
    ar_zephyr_brigandine: { id: 'ar_zephyr_brigandine', name: '천공 기사단 경갑', type: 'armor', rarity: 'legendary', def: 62, hp: 460, agi: 12, spd: 16, price: 3900, desc: '바람처럼 가벼운 부유섬 정예 경갑.' },
    ar_witch_shroud:      { id: 'ar_witch_shroud', name: '그림자 마녀의 성의', type: 'armor', rarity: 'legendary', def: 78, hp: 580, int: 16, lifesteal: 6, price: 5400, desc: '저주 늪지의 마력을 흡수해 생명력으로 바꿉니다.' },
    ar_dragon_scale_mail: { id: 'ar_dragon_scale_mail', name: '태고룡 비늘 갑주', type: 'armor', rarity: 'mythic', def: 102, hp: 860, str: 16, vit: 18, price: 8800, desc: '어떤 화염과 물리 공격도 견디는 용비늘 갑옷.' },
    ar_chrono_aegis:      { id: 'ar_chrono_aegis', name: '시공 수호자의 성갑', type: 'armor', rarity: 'mythic', def: 132, hp: 1180, vit: 22, int: 18, mpRegen: 6, price: 13200, desc: '시간의 결계로 마력을 끊임없이 회복시킵니다.' },
    ar_celestial_vestment:{ id: 'ar_celestial_vestment', name: '성좌 대천사의 갑주', type: 'armor', rarity: 'eternal', def: 158, hp: 1480, str: 20, agi: 20, skillDmg: 22, price: 21000, desc: '하늘의 별빛이 수놓아진 영원의 갑주.' },

    // --- 12 New Diverse Helms ---
    hm_wind_bandana:      { id: 'hm_wind_bandana', name: '질풍의 머리띠', type: 'helm', rarity: 'uncommon', def: 6, agi: 3, spd: 8, price: 220, desc: '발걸음을 가볍게 만드는 초원의 머리띠.' },
    hm_coral_tiara:       { id: 'hm_coral_tiara', name: '심해 진주 티아라', type: 'helm', rarity: 'rare', def: 11, int: 5, mp: 45, mpRegen: 2, price: 560, desc: 'MP 회복을 돕는 아름다운 해안 보관.' },
    hm_frost_helm:        { id: 'hm_frost_helm', name: '서리 군주의 투구', type: 'helm', rarity: 'heroic', def: 20, vit: 6, hp: 140, price: 1280, desc: '얼음 결정으로 강화된 설원의 투구.' },
    hm_pharaoh_mask:      { id: 'hm_pharaoh_mask', name: '황금 파라오의 가면', type: 'helm', rarity: 'legendary', def: 28, str: 8, crit: 10, skillDmg: 12, price: 2800, desc: '고대 태양 왕의 권위가 깃든 황금 가면.' },
    hm_valkyrie_wing:     { id: 'hm_valkyrie_wing', name: '발키리 천공 날개관', type: 'helm', rarity: 'legendary', def: 34, agi: 10, spd: 14, crit: 12, price: 4200, desc: '천공의 날개 장식이 달린 명품 투구.' },
    hm_dragon_horned:     { id: 'hm_dragon_horned', name: '멸룡의 쌍뿔 투구', type: 'helm', rarity: 'mythic', def: 52, str: 14, vit: 14, hp: 480, price: 7600, desc: '용의 뿔로 장식된 불굴의 신화 투구.' },
    hm_chrono_diadem:     { id: 'hm_chrono_diadem', name: '영원 시공의 왕관', type: 'helm', rarity: 'eternal', def: 74, int: 24, mp: 260, crit: 16, skillDmg: 20, price: 17500, desc: '시공간의 지혜를 담은 최강의 영원 서클릿.' },

    // --- 14 New Diverse Accessories ---
    ac_vampire_brooch:    { id: 'ac_vampire_brooch', name: '핏빛 흡혈 브로치', type: 'accessory', rarity: 'rare', atk: 6, hp: 60, lifesteal: 6, price: 620, desc: '공격 시 피해의 6%를 HP로 흡수합니다.' },
    ac_swift_anklet:      { id: 'ac_swift_anklet', name: '헤르메스의 질풍 발찌', type: 'accessory', rarity: 'rare', agi: 6, crit: 7, spd: 18, price: 740, desc: '이동속도가 눈에 띄게 빨라지는 성물.' },
    ac_mana_orb:          { id: 'ac_mana_orb', name: '정령의 마나 보주', type: 'accessory', rarity: 'heroic', int: 9, mp: 90, mpRegen: 5, skillDmg: 10, price: 1380, desc: 'MP가 빠르게 자동 회복되는 마력 보주.' },
    ac_glacier_charm:     { id: 'ac_glacier_charm', name: '만년설의 가호 부적', type: 'accessory', rarity: 'heroic', def: 14, hp: 180, vit: 7, price: 1650, desc: '혹한의 땅에서도 꺾이지 않는 수호 부적.' },
    ac_solar_scarab:      { id: 'ac_solar_scarab', name: '태양 황금 풍뎅이', type: 'accessory', rarity: 'legendary', atk: 18, crit: 12, skillDmg: 15, price: 3200, desc: '스킬 위력을 15% 높여주는 사막의 비보.' },
    ac_sky_compass:       { id: 'ac_sky_compass', name: '천공 항해사의 나침반', type: 'accessory', rarity: 'legendary', atk: 20, agi: 12, spd: 20, crit: 14, price: 4600, desc: '바람을 지배하는 천공의 황금 나침반.' },
    ac_dragon_heart:      { id: 'ac_dragon_heart', name: '고룡 바하무트의 심장', type: 'accessory', rarity: 'mythic', atk: 30, def: 24, hp: 460, lifesteal: 8, price: 9400, desc: '고룡의 생명력이 맥동하는 신화 장신구.' },
    ac_void_hourglass:    { id: 'ac_void_hourglass', name: '시공의 모래시계', type: 'accessory', rarity: 'mythic', atk: 34, int: 20, mpRegen: 8, skillDmg: 22, price: 13500, desc: '마력과 오의 위력을 극대화하는 차원의 유물.' },
    ac_eternal_halo:      { id: 'ac_eternal_halo', name: '영원의 솔티아 광륜', type: 'accessory', rarity: 'eternal', atk: 54, def: 44, hp: 820, crit: 22, lifesteal: 10, spd: 22, price: 28000, desc: '200개 구역의 정점을 정복한 영웅의 궁극 광륜.' },

    // --- 7 New Tactical Consumables & Buff Elixirs ---
    pot_hp_mythic:        { id: 'pot_hp_mythic', name: '신화의 생명수 (HP)', type: 'consumable', subtype: 'hp', power: 2800, rarity: 'mythic', price: 850, desc: 'HP를 2,800 즉시 회복합니다.' },
    pot_mp_mythic:        { id: 'pot_mp_mythic', name: '성좌의 마나수 (MP)', type: 'consumable', subtype: 'mp', power: 950, rarity: 'mythic', price: 680, desc: 'MP를 950 즉시 회복합니다.' },
    elx_full:             { id: 'elx_full', name: '만능 회복 엘릭서', type: 'consumable', subtype: 'full', power: 100, rarity: 'legendary', price: 750, desc: 'HP와 MP를 100% 완전히 회복합니다!' },
    elx_berserk:          { id: 'elx_berserk', name: '광전사의 영약', type: 'consumable', subtype: 'buff_atk', power: 30, rarity: 'rare', price: 260, desc: '30초간 공격력과 마력이 35% 대폭 상승합니다.' },
    elx_iron:             { id: 'elx_iron', name: '철벽의 비약', type: 'consumable', subtype: 'buff_def', power: 30, rarity: 'rare', price: 240, desc: '30초간 방어력이 45% 크게 상승합니다.' },
    elx_haste:            { id: 'elx_haste', name: '질풍의 비약', type: 'consumable', subtype: 'buff_spd', power: 30, rarity: 'rare', price: 240, desc: '30초간 이동속도와 치명타율이 크게 상승합니다.' },
    elx_exp:              { id: 'elx_exp', name: '현자의 경험 비약', type: 'consumable', subtype: 'exp', power: 650, rarity: 'heroic', price: 600, desc: '즉시 대량의 경험치(현재 레벨 비례)를 획득합니다.' }
  });

  // Expand shops cleanly
  ['elx_berserk', 'elx_iron', 'elx_haste', 'elx_full', 'elx_exp', 'pot_hp_mythic', 'pot_mp_mythic'].forEach((id) => {
    if (!DATA.SHOP_GENERAL.includes(id)) DATA.SHOP_GENERAL.push(id);
  });
  [
    'wp_wind_rapier', 'wp_vampire_fang', 'wp_frostbite_blade', 'wp_storm_twinblade',
    'wp_magma_cleaver', 'wp_glacier_scepter', 'wp_sky_zephyr_edge', 'wp_dragon_slayer',
    'ar_scout_cloak', 'ar_blood_cuirass', 'ar_frost_guard', 'ar_zephyr_brigandine', 'ar_dragon_scale_mail',
    'hm_wind_bandana', 'hm_coral_tiara', 'hm_frost_helm', 'hm_valkyrie_wing',
    'ac_vampire_brooch', 'ac_swift_anklet', 'ac_mana_orb', 'ac_sky_compass'
  ].forEach((id) => {
    if (!DATA.SHOP_BLACKSMITH.includes(id)) DATA.SHOP_BLACKSMITH.push(id);
  });

  // Add 18 Diverse New Synthesis Recipes
  DATA.RECIPES.push(
    { id: 'rc_vampire_fang', result: 'wp_vampire_fang', gold: 320, materials: [{ id: 'mat_goblin_fang', qty: 4 }, { id: 'mat_boar_hide', qty: 3 }] },
    { id: 'rc_atlantia_trident', result: 'wp_atlantia_trident', gold: 900, materials: [{ id: 'mat_coral_shard', qty: 5 }, { id: 'mat_sea_pearl', qty: 4 }] },
    { id: 'rc_magma_cleaver', result: 'wp_magma_cleaver', gold: 1400, materials: [{ id: 'mat_magma_core', qty: 5 }, { id: 'mat_flame_core', qty: 4 }] },
    { id: 'rc_glacier_scepter', result: 'wp_glacier_scepter', gold: 1950, materials: [{ id: 'mat_frost_crystal', qty: 6 }, { id: 'mat_enhance', qty: 3 }] },
    { id: 'rc_sun_spear', result: 'wp_sun_pharaoh_spear', gold: 2600, materials: [{ id: 'mat_sun_relic', qty: 6 }, { id: 'mat_magma_core', qty: 4 }] },
    { id: 'rc_sky_edge', result: 'wp_sky_zephyr_edge', gold: 3400, materials: [{ id: 'mat_sky_feather', qty: 6 }, { id: 'mat_frost_crystal', qty: 4 }] },
    { id: 'rc_witch_scythe', result: 'wp_witchwood_scythe', gold: 4500, materials: [{ id: 'mat_cursed_spore', qty: 6 }, { id: 'mat_dark_crystal', qty: 5 }] },
    { id: 'rc_dragon_slayer', result: 'wp_dragon_slayer', gold: 6200, materials: [{ id: 'mat_dragon_scale', qty: 7 }, { id: 'mat_magma_core', qty: 5 }, { id: 'mat_enhance', qty: 4 }] },
    { id: 'rc_chrono_blade', result: 'wp_chrono_rift_blade', gold: 8200, materials: [{ id: 'mat_void_essence', qty: 7 }, { id: 'mat_star_dust', qty: 4 }] },
    { id: 'rc_eclipse_fang', result: 'wp_eclipse_twin_fang', gold: 13500, materials: [{ id: 'mat_void_essence', qty: 8 }, { id: 'mat_cursed_spore', qty: 6 }, { id: 'mat_eternal_petal', qty: 4 }] },
    { id: 'rc_genesis_scepter', result: 'wp_genesis_scepter', gold: 14500, materials: [{ id: 'mat_star_dust', qty: 8 }, { id: 'mat_sky_feather', qty: 6 }, { id: 'mat_eternal_petal', qty: 4 }] },
    { id: 'rc_solar_robe', result: 'ar_solar_robe', gold: 1450, materials: [{ id: 'mat_sun_relic', qty: 5 }, { id: 'mat_sea_pearl', qty: 4 }] },
    { id: 'rc_dragon_mail', result: 'ar_dragon_scale_mail', gold: 5400, materials: [{ id: 'mat_dragon_scale', qty: 8 }, { id: 'mat_enhance', qty: 4 }] },
    { id: 'rc_celestial_vest', result: 'ar_celestial_vestment', gold: 12500, materials: [{ id: 'mat_star_dust', qty: 8 }, { id: 'mat_eternal_petal', qty: 5 }] },
    { id: 'rc_pharaoh_mask', result: 'hm_pharaoh_mask', gold: 1650, materials: [{ id: 'mat_sun_relic', qty: 5 }, { id: 'mat_ancient_stone', qty: 3 }] },
    { id: 'rc_chrono_diadem', result: 'hm_chrono_diadem', gold: 10500, materials: [{ id: 'mat_void_essence', qty: 6 }, { id: 'mat_star_dust', qty: 6 }, { id: 'mat_eternal_petal', qty: 3 }] },
    { id: 'rc_dragon_heart', result: 'ac_dragon_heart', gold: 5600, materials: [{ id: 'mat_dragon_scale', qty: 6 }, { id: 'mat_flame_core', qty: 5 }] },
    { id: 'rc_eternal_halo', result: 'ac_eternal_halo', gold: 16000, materials: [{ id: 'mat_eternal_petal', qty: 8 }, { id: 'mat_star_dust', qty: 6 }, { id: 'mat_dragon_scale', qty: 6 }] }
  );

  // =========================================================================
  // 3. 10 GRAND CONTINENTS × 20 DISTINCT ZONES = 200 NEW EXPLORABLE MAPS!
  // =========================================================================
  const CONTINENTS = [
    {
      id: 1, name: '제1대륙 · 솔티아 변방', short: '1대륙·초원', biome: 'meadow',
      townId: 'town', townName: '솔티아 마을', townShort: '솔티아', townSubtitle: '바람이 머무는 솔티아 대륙의 중심 수도',
      mapX: 62, mapY: 186, islandColor: '#2d6a4f', accentColor: '#4ade80',
      floor: '.', accent: ',', path: 'p', wall: 'T', hazard: '~',
      matId: 'mat_slime_core', mobs: ['slime_green', 'boar', 'slime_blue', 'goblin'],
      bosses: ['goblin_chief', 'kraken_guard'],
      cast: ['촌장 엘더', '정찰병 카일', '음유시인 아리아', '대장장이 볼칸'],
      zoneNames: [
        '솔티아 동부 초원', '바람개비 언덕', '이슬꽃 군락지', '옛 목장의 폐허', '은빛 시냇가 나루터',
        '속삭이는 떡갈나무 숲', '초원 감시탑 터', '들꽃 평원 교차로', '안개 낀 방목지', '솔티아 남부 관문',
        '버려진 풍차 마을', '푸른 언덕 능선', '순례자의 돌다리', '바람 정령의 쉼터', '야수의 둥지 협로',
        '고대 경계석 들판', '초원 요새 유적', '황금 억새 평야', '변방 기사단 야영지', '솔티아 변방 대관문'
      ]
    },
    {
      id: 2, name: '제2대륙 · 심해 제국 아틀란티아', short: '2대륙·심해', biome: 'coast',
      townId: 'town_2', townName: '아틀란티아 항구마을', townShort: '아틀란티아', townSubtitle: '산호빛 파도와 진주 상단이 모이는 항구 마을',
      mapX: 132, mapY: 224, islandColor: '#0e7490', accentColor: '#38bdf8',
      floor: 's', accent: 'p', path: 'c', wall: 'P', hazard: '~',
      matId: 'mat_coral_shard', mobs: ['coral_crab', 'pirate_skel', 'slime_blue', 'dark_mage'],
      bosses: ['kraken_guard', 'golem'],
      cast: ['심해 여제 네리사', '정찰병 카일', '해적 선장 드레이크', '음유시인 아리아'],
      zoneNames: [
        '산호초 여울목', '난파선 묘지 입구', '진주빛 백사장', '침몰한 황금 갤리온', '해풍 등대 곶',
        '푸른 소용돌이 해협', '바다 신전 회랑', '거대 조개 암초지대', '유령 함대 정박지', '아틀란티아 외성문',
        '해저 유리 터널', '물거품 정원 터', '산호 기사단 병영', '가라앉은 대도서관', '해신의 삼지창 광장',
        '심해 균열 절벽', '진주 궁전 회랑', '폭풍 조수의 제단', '제독의 검은 갑판', '아틀란티아 심해 왕좌'
      ]
    },
    {
      id: 3, name: '제3대륙 · 작열의 흑요석 화산령', short: '3대륙·화산', biome: 'canyon',
      townId: 'town_3', townName: '흑요석 대장간 마을', townShort: '흑요석마을', townSubtitle: '불꽃 용광로와 대장장이들이 모인 화산 거점',
      mapX: 218, mapY: 228, islandColor: '#9a3412', accentColor: '#fb923c',
      floor: 'r', accent: 'p', path: 'c', wall: 'C', hazard: 'L',
      matId: 'mat_magma_core', mobs: ['wyvern', 'lava_golem', 'goblin_shaman', 'skeleton'],
      bosses: ['ignis_boss', 'golem'],
      cast: ['화염 대장장이 이그니스', '대장장이 볼칸', '용암 감시자 브란', '정찰병 카일'],
      zoneNames: [
        '잿빛 화산재 기슭', '붉은 균열 계곡', '유황 온천 지대', '불타는 현무암 다리', '용암 대장간 외곽',
        '화염 도깨비 소굴', '흑요석 절벽 통로', '마그마 폭포 전망대', '타오르는 고대 가마터', '불꽃 수호자의 성문',
        '작열하는 용맥 회랑', '재가 내리는 분화구', '철갑 골렘의 채석장', '불사조의 둥지 절벽', '화염 교단 의식장',
        '용암 호수 중앙섬', '흑요석 용광로 심층', '적열의 투기장', '불멸의 화염 계단', '화산령 심장 칼데라'
      ]
    },
    {
      id: 4, name: '제4대륙 · 은빛 설원과 빙하 성채', short: '4대륙·설원', biome: 'snow',
      townId: 'town_4', townName: '은빛 설원 마을', townShort: '은빛설원', townSubtitle: '오로라와 따뜻한 화로가 반기는 설원의 쉼터',
      mapX: 296, mapY: 194, islandColor: '#3b82f6', accentColor: '#bae6fd',
      floor: 'n', accent: 'p', path: 'c', wall: 'I', hazard: '~',
      matId: 'mat_frost_crystal', mobs: ['slime_blue', 'skeleton', 'dark_mage', 'fallen_knight'],
      bosses: ['golem', 'cassius_boss'],
      cast: ['빙하 신녀 프레이야', '음유시인 아리아', '설원 사냥꾼 토르', '대장장이 볼칸'],
      zoneNames: [
        '첫눈 내리는 고개', '얼어붙은 호숫가', '은빛 자작나무 설원', '고드름 협곡 입구', '서리 늑대 벌판',
        '수정 빙하 동굴', '눈보라 감시 초소', '얼음 폭포 절벽길', '만년설 순례자의 길', '빙하 성채 외곽 해자',
        '푸른 수정 회랑', '얼어붙은 기사단 묘역', '눈꽃 결정의 정원', '서리 거인의 대교', '겨울 신녀의 성소',
        '극야의 오로라 언덕', '얼음 거울 미궁', '빙결 왕실 무기고', '백은의 얼음 계단', '절대영도 빙하 옥좌'
      ]
    },
    {
      id: 5, name: '제5대륙 · 황금 사막과 태양 신전', short: '5대륙·사막', biome: 'desert',
      townId: 'town_5', townName: '오아시스 교역 마을', townShort: '오아시스', townSubtitle: '황금 사막 한가운데 피어난 푸른 오아시스 교역소',
      mapX: 304, mapY: 126, islandColor: '#b45309', accentColor: '#fcd34d',
      floor: 's', accent: 'r', path: 'c', wall: 'C', hazard: 'L',
      matId: 'mat_sun_relic', mobs: ['skeleton', 'pirate_skel', 'wyvern', 'golem'],
      bosses: ['ignis_boss', 'goblin_chief'],
      cast: ['태양 파라오 라-솔', '고고학자 세라', '정찰병 카일', '음유시인 아리아'],
      zoneNames: [
        '모래폭풍 경계선', '초승달 오아시스', '황금 사구 능선', '묻혀버린 대상로', '스핑크스 석상 광장',
        '신기루의 협곡', '고대 오벨리스크 들판', '전갈 군단의 은신처', '태양 시계 유적지', '피라미드 제1회랑',
        '황금 미라의 석실', '불타는 사막 제단', '모래시계 미궁', '태양왕의 보물창고', '사막 유목민 성소',
        '작열의 태양 광장', '고대 상형문자 전당', '황금 전차 경기장', '태양 신전 대계단', '라-솔의 황금 성소'
      ]
    },
    {
      id: 6, name: '제6대륙 · 천공 부유섬 에테리아', short: '6대륙·천공', biome: 'sky',
      townId: 'town_6', townName: '에테리아 천공 마을', townShort: '에테리아', townSubtitle: '구름 위 비공정이 정박하는 순백의 천공 도시',
      mapX: 232, mapY: 92, islandColor: '#0284c7', accentColor: '#e0f2fe',
      floor: 'k', accent: '*', path: 'c', wall: 'K', hazard: 'K',
      matId: 'mat_sky_feather', mobs: ['wyvern', 'dark_mage', 'abyss_assassin', 'fallen_knight'],
      bosses: ['cassius_boss', 'golem'],
      cast: ['천공 대집정관 제피르', '음유시인 아리아', '날개 기사 실비아', '촌장 엘더'],
      zoneNames: [
        '구름다리 승강장', '하얀 깃털의 섬', '무지개 폭포 정원', '바람개비 천공탑', '에테리아 외곽 회랑',
        '그리핀 비행장', '별빛 유리 온실', '구름 바다 전망대', '천공 기사단 훈련장', '바람의 대성당 광장',
        '부유석 징검다리', '번개 구름 감시탑', '천사의 하프 정원', '하늘 도서관 상층', '성광의 마력로',
        '태풍의 눈 부유섬', '황금 날개의 대교', '천공 의회 대광장', '성좌의 승천 계단', '에테리아 천공 성전'
      ]
    },
    {
      id: 7, name: '제7대륙 · 저주받은 그림자 늪지', short: '7대륙·늪지', biome: 'swamp',
      townId: 'town_7', townName: '월식 늪지 피난처', townShort: '월식늪지', townSubtitle: '보랏빛 등불이 안개를 밝히는 늪지의 안전 피난처',
      mapX: 148, mapY: 120, islandColor: '#5b21b6', accentColor: '#c084fc',
      floor: 'm', accent: ';', path: 'p', wall: 'M', hazard: '~',
      matId: 'mat_cursed_spore', mobs: ['goblin_shaman', 'dark_mage', 'abyss_assassin', 'skeleton'],
      bosses: ['goblin_chief', 'cassius_boss'],
      cast: ['그림자 마녀 모웬', '정찰병 카일', '추방된 성기사 리온', '음유시인 아리아'],
      zoneNames: [
        '독안개 늪지 입구', '썩은 버드나무 숲', '형광 버섯 군락', '가라앉은 마녀의 오두막', '도깨비불 습지대',
        '뼈다귀 나룻배 선착장', '검은 수렁 징검다리', '저주받은 수도원 폐허', '그림자 까마귀 둥지', '월식의 늪지 제단',
        '망령의 지하 납골당', '독극물 연금술 터', '거미줄 어둠 회랑', '핏빛 안개 호수', '마녀 집회 광장',
        '망각의 비석 군락', '심연 뿌리 동굴', '저주 성채 외성벽', '그림자 군주의 회랑', '모웬의 월식 대성전'
      ]
    },
    {
      id: 8, name: '제8대륙 · 태고의 용의 협곡', short: '8대륙·용곡', biome: 'dragon',
      townId: 'town_8', townName: '용기사단 성채 마을', townShort: '용기사단', townSubtitle: '고룡의 협곡을 수호하는 용기사단의 철옹성 마을',
      mapX: 114, mapY: 62, islandColor: '#9f1239', accentColor: '#fb7185',
      floor: 'r', accent: '_', path: 'b', wall: 'C', hazard: 'L',
      matId: 'mat_dragon_scale', mobs: ['lava_golem', 'fallen_knight', 'abyss_assassin', 'wyvern'],
      bosses: ['ignis_boss', 'vargas'],
      cast: ['고룡 군주 바하무트', '대장장이 볼칸', '용기사 카엘', '음유시인 아리아'],
      zoneNames: [
        '용의 발톱 입구', '거대 용골 계곡', '용염이 서린 능선', '비룡의 둥지 절벽', '고대 용언 비석로',
        '불타는 비늘 평원', '멸룡 기사단 옛 요새', '용암 폭포 협곡', '청룡의 수정 동굴', '용의 협곡 대관문',
        '적룡의 화염 회랑', '백룡의 바람 봉우리', '흑룡의 그림자 심연', '고룡 보물 동굴', '용혈의 제단',
        '태고의 용언 도서관', '천룡의 비행 능선', '용왕의 수호 성벽', '불멸룡의 시험장', '바하무트의 천공 둥지'
      ]
    },
    {
      id: 9, name: '제9대륙 · 차원의 틈새와 별의 회랑', short: '9대륙·차원', biome: 'void',
      townId: 'town_9', townName: '별빛 관측소 마을', townShort: '별빛관측소', townSubtitle: '은하수와 시공간을 관측하는 성좌의 거점 마을',
      mapX: 206, mapY: 38, islandColor: '#3730a3', accentColor: '#818cf8',
      floor: 'v', accent: '*', path: 'b', wall: 'V', hazard: 'K',
      matId: 'mat_void_essence', bonusMatId: 'mat_star_dust', mobs: ['fallen_knight', 'abyss_assassin', 'dark_mage', 'lava_golem'],
      bosses: ['cassius_boss', 'vargas'],
      cast: ['시간의 직조자 아이온', '타락한 카시우스', '음유시인 아리아', '촌장 엘더'],
      zoneNames: [
        '찢어진 시공의 문', '부서진 거울 회랑', '역류하는 시간의 강', '별가루 부유 통로', '기억의 파편 광장',
        '평행세계의 솔티아', '무한의 모래시계 방', '어둠의 성좌 관측소', '균열된 차원 교차로', '시공 파수꾼의 성문',
        '은하수 나선 계단', '망각된 영웅들의 전당', '쌍둥이 달의 미궁', '뒤틀린 중력 회랑', '심연 차원의 교각',
        '별의 무덤 성역', '시간 정지 구역', '차원 군주의 결계실', '태초의 빛 회랑', '아이온의 시공 왕좌'
      ]
    },
    {
      id: 10, name: '제10대륙 · 영원의 성역 솔티아 코어', short: '10대륙·영원', biome: 'eternal',
      townId: 'town_10', townName: '영원의 성전 마을', townShort: '영원성전', townSubtitle: '솔티아 최후의 성역을 지키는 황금빛 영원의 도시',
      mapX: 296, mapY: 52, islandColor: '#a16207', accentColor: '#fde047',
      floor: 'a', accent: '*', path: 'k', wall: 'X', hazard: 'V',
      matId: 'mat_eternal_petal', bonusMatId: 'mat_star_dust', mobs: ['fallen_knight', 'abyss_assassin', 'lava_golem', 'dark_mage'],
      bosses: ['vargas', 'cassius_boss'],
      cast: ['각성한 바르가스', '음유시인 아리아', '촌장 엘더', '대장장이 볼칸'],
      zoneNames: [
        '영원의 관문 계단', '최초의 바람 정원', '성기사단 영혼의 길', '빛과 어둠의 경계', '창세의 분수 광장',
        '일곱 별의 공명실', '황금 바람의 대교', '고대 신들의 석상로', '심연 정화의 성소', '솔티아 코어 외성문',
        '천년 연대기의 전당', '영웅의 시련 회랑', '쌍월 융합의 제단', '불멸의 수호자 광장', '바람 여신의 신전',
        '창세수 에르드라 코어', '최후의 결전 대교', '영원한 황혼의 성벽', '신화의 전야 제단', '영원의 바람 · 솔티아 정상'
      ]
    }
  ];

  DATA.CONTINENTS = CONTINENTS;

  // Deterministic PRNG for rock-solid consistent 200 layouts
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Build 12 genuinely distinct 24x18 RPG zone architectures (guaranteed walkable & portal-safe!)
  function buildZoneLayout(zoneNum, cont) {
    const W = 24, H = 18;
    const rng = mulberry32(zoneNum * 9973 + cont.id * 131);
    const fl = cont.floor, ac = cont.accent, pa = cont.path, wa = cont.wall, hz = cont.hazard;
    const g = Array.from({ length: H }, () => Array(W).fill(fl));

    // Outer border walls
    for (let x = 0; x < W; x++) { g[0][x] = wa; g[H - 1][x] = wa; }
    for (let y = 0; y < H; y++) { g[y][0] = wa; g[y][W - 1] = wa; }

    // Sprinkle organic floor accents
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        if (rng() < 0.14) g[y][x] = ac;
      }
    }

    const template = (zoneNum - 1) % 12;
    const fillRect = (x0, y0, x1, y1, ch) => {
      for (let y = Math.max(1, y0); y <= Math.min(H - 2, y1); y++) {
        for (let x = Math.max(1, x0); x <= Math.min(W - 2, x1); x++) g[y][x] = ch;
      }
    };

    if (template === 0) {
      // Open glade with central oasis/hazard lake + side bridges
      fillRect(9, 6, 14, 11, hz);
      fillRect(11, 5, 12, 12, '=');
      fillRect(8, 8, 15, 9, '=');
      fillRect(3, 3, 5, 4, wa); fillRect(18, 13, 20, 14, wa);
    } else if (template === 1) {
      // Grand Crossroad Plaza with 4 corner shrines
      fillRect(10, 1, 13, 16, pa);
      fillRect(1, 7, 22, 10, pa);
      [[4, 3], [19, 3], [4, 14], [19, 14]].forEach(([px, py]) => fillRect(px - 1, py - 1, px + 1, py + 1, wa));
    } else if (template === 2) {
      // Winding River / Magma Channel with dual timber bridges
      for (let x = 1; x < W - 1; x++) {
        const ry = 8 + Math.round(Math.sin(x * 0.45) * 1.4);
        g[ry][x] = hz; g[ry + 1][x] = hz;
      }
      [6, 7, 16, 17].forEach((bx) => { for (let y = 6; y <= 11; y++) g[y][bx] = '='; });
    } else if (template === 3) {
      // Twin-Island Fortress Courtyard
      fillRect(2, 2, 21, 15, hz);
      fillRect(3, 3, 10, 14, fl);
      fillRect(13, 3, 20, 14, fl);
      fillRect(10, 7, 13, 10, '=');
      fillRect(6, 6, 7, 7, wa); fillRect(16, 10, 17, 11, wa);
    } else if (template === 4) {
      // Ancient Labyrinth Corridors (wide 3-tile walkable halls)
      fillRect(5, 2, 6, 11, wa);
      fillRect(11, 6, 12, 15, wa);
      fillRect(17, 2, 18, 11, wa);
      fillRect(2, 13, 21, 14, pa);
    } else if (template === 5) {
      // Colosseum Arena Ring
      fillRect(6, 4, 17, 13, pa);
      [[5, 4], [18, 4], [5, 13], [18, 13], [11, 4], [12, 13]].forEach(([x, y]) => { g[y][x] = wa; });
      fillRect(2, 2, 3, 3, hz); fillRect(20, 2, 21, 3, hz);
      fillRect(2, 14, 3, 15, hz); fillRect(20, 14, 21, 15, hz);
    } else if (template === 6) {
      // Narrow Canyon Pass with staggered cliffs
      fillRect(1, 2, 7, 5, wa); fillRect(16, 2, 22, 5, wa);
      fillRect(1, 12, 6, 15, wa); fillRect(17, 12, 22, 15, wa);
      fillRect(10, 1, 13, 16, pa);
    } else if (template === 7) {
      // Ruin Colonnade (Grand Pillared Temple)
      fillRect(4, 3, 19, 14, pa);
      for (let x = 6; x <= 18; x += 4) { g[5][x] = wa; g[12][x] = wa; }
    } else if (template === 8) {
      // Diagonal Ridge Valley
      for (let i = 0; i < 8; i++) {
        g[3 + i][4 + i] = wa;
        g[14 - i][19 - i] = hz;
      }
      fillRect(10, 1, 13, 16, pa);
    } else if (template === 9) {
      // Concentric Sanctuary (boss/milestone style!)
      fillRect(5, 3, 18, 14, pa);
      fillRect(7, 5, 16, 5, wa); fillRect(7, 12, 16, 12, wa);
      g[5][11] = pa; g[5][12] = pa; g[12][11] = pa; g[12][12] = pa;
    } else if (template === 10) {
      // Cliffside Harbor / Coastal Terraces
      fillRect(1, 1, 5, 16, hz);
      fillRect(6, 2, 7, 15, pa);
      fillRect(15, 4, 19, 6, wa);
      fillRect(14, 11, 18, 13, wa);
    } else {
      // Star Sanctum / Throne Chamber
      fillRect(4, 3, 19, 14, pa);
      [[7, 5], [16, 5], [7, 12], [16, 12]].forEach(([x, y]) => fillRect(x, y, x + 1, y + 1, wa));
      fillRect(10, 7, 13, 10, ac);
    }

    // Guarantee clear walkable safe lanes around South entry (11.5, 15.5), North exit (11.5, 2), and center
    fillRect(10, 1, 13, 4, pa);
    fillRect(10, 13, 13, 16, pa);
    fillRect(10, 7, 13, 10, pa);

    // Guarantee central vertical connector so North <-> South is ALWAYS reachable
    for (let y = 2; y <= 15; y++) {
      if (DATA.SOLID_TILES.has(g[y][11])) g[y][11] = (g[y][11] === hz) ? '=' : pa;
      if (DATA.SOLID_TILES.has(g[y][12])) g[y][12] = (g[y][12] === hz) ? '=' : pa;
    }

    return g.map((row) => row.join(''));
  }

  // Generate all 200 distinct World Zones (zone_1 ~ zone_200)
  const zoneBossPrefixes = [
    '변방 수호군주', '심해 제독', '용암 대군주', '만년설 빙제', '태양 파라오 수호자',
    '천공 폭풍 집정관', '그림자 대마녀', '태고의 용왕', '시공 차원 군주', '영원의 대심판관'
  ];

  const zoneRewardPool = [
    'wp_wind_rapier', 'ar_scout_cloak', 'hm_wind_bandana', 'elx_berserk', 'ac_vampire_brooch',
    'wp_atlantia_trident', 'hm_coral_tiara', 'ac_swift_anklet', 'elx_iron', 'wp_magma_cleaver',
    'ar_frost_guard', 'hm_frost_helm', 'ac_mana_orb', 'elx_haste', 'wp_glacier_scepter',
    'ar_solar_robe', 'hm_pharaoh_mask', 'ac_solar_scarab', 'elx_full', 'wp_sun_pharaoh_spear',
    'wp_sky_zephyr_edge', 'ar_zephyr_brigandine', 'hm_valkyrie_wing', 'ac_sky_compass', 'elx_exp',
    'wp_witchwood_scythe', 'ar_witch_shroud', 'wp_dragon_slayer', 'ar_dragon_scale_mail', 'hm_dragon_horned',
    'ac_dragon_heart', 'wp_chrono_rift_blade', 'ar_chrono_aegis', 'ac_void_hourglass', 'pot_hp_mythic',
    'wp_seraphim_claymore', 'wp_eclipse_twin_fang', 'wp_genesis_scepter', 'hm_chrono_diadem', 'ac_eternal_halo'
  ];

  for (let z = 1; z <= 200; z++) {
    const cIdx = Math.floor((z - 1) / 20);
    const localIdx = (z - 1) % 20;
    const cont = CONTINENTS[cIdx];
    const zoneId = `zone_${z}`;
    const zoneName = cont.zoneNames[localIdx];
    const recLv = Math.max(2, Math.round(z * 0.78 + 1));
    const isBossZone = (z % 5 === 0);
    const rng = mulberry32(z * 7919 + 42);

    const spawns = [];
    const spawnPts = [
      [5.5, 5.5], [18.5, 5.5], [5.5, 11.5], [18.5, 11.5], [11.5, 8.5], [8.5, 6.5], [15.5, 11.5]
    ];
    const mobCount = isBossZone ? 4 : (4 + (z % 3));
    for (let i = 0; i < mobCount; i++) {
      const pt = spawnPts[i % spawnPts.length];
      const mobType = cont.mobs[Math.floor(rng() * cont.mobs.length)];
      spawns.push({ type: mobType, tx: pt[0], ty: pt[1] });
    }
    let zoneBossName = null;
    if (isBossZone) {
      const bSprite = cont.bosses[Math.floor(localIdx / 5) % cont.bosses.length];
      zoneBossName = `[${z}구역 보스] ${zoneBossPrefixes[cIdx]} · ${zoneName.split(' ')[0]}`;
      spawns.push({ type: bSprite, tx: 11.5, ty: 5.5, isZoneBoss: true, customName: zoneBossName, customLv: recLv + 3 });
    }

    const portals = [];
    if (z === 1) {
      portals.push({ tx: 11.5, ty: 16.2, toMap: 'meadow', toX: 21.0, toY: 8.5, label: '바람의 초원 ▼' });
    } else {
      portals.push({ tx: 11.5, ty: 16.2, toMap: `zone_${z - 1}`, toX: 11.5, toY: 3.2, label: `이전 구역 (${z - 1}) ▼` });
    }
    if (z < 200) {
      portals.push({ tx: 11.5, ty: 1.8, toMap: `zone_${z + 1}`, toX: 11.5, toY: 14.8, label: `다음 구역 (${z + 1}) ▲` });
    }
    if (z % 5 === 0 || localIdx === 0) {
      portals.push({ tx: 3.2, ty: 15.2, toMap: cont.townId, toX: 11.5, toY: 11.5, label: `${cont.townName} 귀환` });
    }

    const chests = [];
    if (z % 3 === 0) {
      const useBonusMat = cont.bonusMatId && z % 6 === 3 && ((z - 3) / 6) % 2 === 1;
      const rewardItem = (z % 6 === 0)
        ? zoneRewardPool[Math.floor((z / 6 - 1) % zoneRewardPool.length)]
        : (useBonusMat ? cont.bonusMatId : cont.matId);
      chests.push({
        id: `chest_z${z}`,
        tx: (z % 2 === 0) ? 19 : 4,
        ty: (z % 4 === 0) ? 4 : 13,
        gold: 180 + z * 38,
        itemId: rewardItem,
        qty: (z % 6 === 0) ? 1 : 3
      });
    }

    DATA.MAPS[zoneId] = {
      id: zoneId,
      zoneNum: z,
      continentId: cont.id,
      continentName: cont.name,
      biome: cont.biome,
      recLv,
      isBossZone,
      zoneBossName,
      matId: cont.matId,
      bonusMatId: cont.bonusMatId || null,
      name: `${z}구역 · ${zoneName}`,
      subtitle: `${cont.name} · 권장 Lv.${recLv}${isBossZone ? ' · 👑 보스 출현' : ''}`,
      safe: false,
      bgm: isBossZone ? 'boss' : (cIdx >= 7 ? 'dungeon' : 'field'),
      zoneScale: Math.pow(1.022, z - 1),
      layout: null, // Lazily built via ensureZoneLayout() for instant startup!
      npcs: [],
      portals,
      chests,
      spawns
    };
  }

  // Build cozy biome-themed safe Town Hub layouts for Continents 2..10
  function buildTownLayout(cont) {
    const fl = cont.floor, pa = cont.path, wa = cont.wall, hz = cont.hazard === 'K' ? fl : cont.hazard;
    const raw = [
      'WWWWWWWWWWWppWWWWWWWWWWW',
      'W..RRR.....pp.....RRR..W',
      'W..HHH..cccccccc..HHH..W',
      'W..HdH..c......c..HdH..W',
      'W.......c..cc..c.......W',
      'W......cc.cccc.cc......W',
      'W......c.ccFFcc.c......W',
      'W......c.ccFFcc.c......W',
      'pppppppc.cccccc.cppppppp',
      'pppppppc.cccccc.cppppppp',
      'W......cc.cccc.cc......W',
      'W..RRR..cccccccc..RRR..W',
      'W..HHH....cccc....HHH..W',
      'W..HdH....cccc....HdH..W',
      'W.........cccc.........W',
      'W..~~~....pppp....~~~..W',
      'W..........pp..........W',
      'WWWWWWWWWWWppWWWWWWWWWWW'
    ];
    return raw.map((row) => row.split('').map((ch) => {
      if (ch === 'W') return wa;
      if (ch === '.') return fl;
      if (ch === 'p') return pa;
      if (ch === 'H') return 'W';
      if (ch === '~') return hz;
      return ch;
    }).join(''));
  }

  // Upgrade Soltia Capital Town with Continent 1 metadata, Airship WorldMap Guide, and East Highway Portal
  if (DATA.MAPS.town) {
    DATA.MAPS.town.isTown = true;
    DATA.MAPS.town.continentId = 1;
    DATA.MAPS.town.continentName = CONTINENTS[0].name;
    // Open east gate at rows 11..12 on cols 22..23 (clear of buildings)
    if (Array.isArray(DATA.MAPS.town.layout)) {
      [11, 12].forEach((r) => {
        if (DATA.MAPS.town.layout[r]) {
          DATA.MAPS.town.layout[r] = DATA.MAPS.town.layout[r].slice(0, 22) + 'pp';
        }
      });
    }
    DATA.MAPS.town.npcs.push({
      id: 'airship_1', name: '비공정 안내원 리아', sprite: 'aria', tx: 11.5, ty: 13.8, role: 'worldmap'
    });
    DATA.MAPS.town.portals.push({
      tx: 22.8, ty: 11.5, toMap: 'town_2', toX: 2.2, toY: 8.5, label: '아틀란티아 항구마을 ▶'
    });
  }

  // Generate Safe Hub Towns for Continents 2..10 (interconnected MapleStory / Pokemon style!)
  for (let i = 1; i < CONTINENTS.length; i++) {
    const cont = CONTINENTS[i];
    const prevCont = CONTINENTS[i - 1];
    const nextCont = CONTINENTS[i + 1] || null;
    const entryZone = `zone_${i * 20 + 1}`;
    const prevExitY = prevCont.townId === 'town' ? 11.5 : 8.5;
    const townPortals = [
      { tx: 11.5, ty: 0.9, toMap: entryZone, toX: 11.5, toY: 14.8, label: `${i * 20 + 1}구역 사냥터 ▲` },
      { tx: 1.2, ty: 8.5, toMap: prevCont.townId, toX: 21.5, toY: prevExitY, label: `◀ ${prevCont.townShort}` },
      { tx: 11.5, ty: 16.9, toMap: 'town', toX: 11.5, toY: 11.5, label: '솔티아 본성 귀환 ▼' }
    ];
    if (nextCont) {
      townPortals.push({
        tx: 22.8, ty: 8.5, toMap: nextCont.townId, toX: 2.2, toY: 8.5, label: `${nextCont.townShort} ▶`
      });
    } else {
      townPortals.push({
        tx: 22.8, ty: 8.5, toMap: 'zone_200', toX: 11.5, toY: 14.8, label: '200구역 정상 ▶'
      });
    }

    DATA.MAPS[cont.townId] = {
      id: cont.townId,
      isTown: true,
      continentId: cont.id,
      continentName: cont.name,
      biome: cont.biome,
      name: cont.townName,
      subtitle: `${cont.townSubtitle} · 안전지대`,
      bgm: 'town',
      safe: true,
      layout: null,
      npcs: [
        { id: `elder_${cont.id}`, name: cont.cast[0], sprite: 'elder', tx: 11.5, ty: 4.6, role: 'quest' },
        { id: `aria_${cont.id}`, name: '치유사 아리아', sprite: 'aria', tx: 14.8, ty: 5.5, role: 'bard' },
        { id: `shop_${cont.id}`, name: '잡화상인 미나', sprite: 'shop', tx: 5.5, ty: 14.3, role: 'shop' },
        { id: `smith_${cont.id}`, name: '대장장이 볼칸', sprite: 'smith', tx: 18.5, ty: 14.3, role: 'smith' },
        { id: `airship_${cont.id}`, name: '비공정 안내원 리아', sprite: 'aria', tx: 11.5, ty: 12.2, role: 'worldmap' }
      ],
      fountains: [{ tx: 11.5, ty: 6.5 }],
      chests: [],
      portals: townPortals,
      spawns: []
    };
  }

  // Connect Meadow East border directly into Zone 1 (so players can walk from Town -> Meadow -> 200 Zones seamlessly!)
  if (DATA.MAPS.meadow && DATA.MAPS.meadow.portals) {
    DATA.MAPS.meadow.portals.push({
      tx: 21.8, ty: 8.5, toMap: 'zone_1', toX: 11.5, toY: 14.8, label: '200구역 대륙 원정 ▶'
    });
  }

  DATA.ensureZoneLayout = function (map) {
    if (!map || map.layout) return;
    if (map.isTown && map.continentId) {
      const cont = CONTINENTS[map.continentId - 1];
      map.layout = buildTownLayout(cont);
    } else if (map.zoneNum && map.continentId) {
      const cont = CONTINENTS[map.continentId - 1];
      map.layout = buildZoneLayout(map.zoneNum, cont);
    }
  };

  // =========================================================================
  // 4. 4× MORE VARIED SCENARIOS ACROSS ALL 200 CHAPTERS (8 MISSION TYPES!)
  // =========================================================================
  // Tag Season 1 quests (Ch.1~20) with targetMap & crisp hints
  const s1MapHints = [
    'meadow', 'meadow', 'town', 'meadow', 'coast',
    'coast', 'coast', 'coast', 'forest', 'forest',
    'forest', 'forest', 'canyon', 'canyon', 'canyon',
    'canyon', 'ruins', 'ruins', 'citadel', 'altar'
  ];
  for (let i = 0; i < 20 && i < DATA.QUESTS.length; i++) {
    if (!DATA.QUESTS[i].targetMap) DATA.QUESTS[i].targetMap = s1MapHints[i];
  }

  // Diversify Ch.21 ~ Ch.200 (180 chapters) across 8 distinct gameplay mission types & 180 unique zones!
  // Pattern cycle of 10 unique scenario archetypes (4x more diverse than before!):
  // 0: explore (신규 구역 개척/유적 발견)
  // 1: kill_any (정예 마물 토벌)
  // 2: skill_cast (신규 스킬·오의 실전 연마)
  // 3: collect (대륙 고유 희귀 재료 수집)
  // 4: boss_hunt (5배수 구역 네임드 보스 격파!)
  // 5: explore (전초기지/비밀 통로 정찰)
  // 6: enhance_gear (대장장이 볼칸 장비 단련 시험)
  // 7: bounty_clear (용병 길드 신뢰 구축 의뢰)
  // 8: tower (심연의 탑 층 돌파 시련)
  // 9: boss_hunt (10배수 거대 지역 보스 격파!)
  const MISSION_FLAVORS = [
    'explore', 'kill_any', 'skill_cast', 'collect', 'boss_hunt',
    'explore', 'enhance_gear', 'bounty_clear', 'tower', 'boss_hunt'
  ];

  const STORY_TEMPLATES = {
    explore: (sp1, sp2, zName, cName, title) => ({
      start: [
        `${sp1}: "긴급 전령일세! [${cName}]의 미지 구역인 [${zName}]에서 수상한 마력 파동이 감지되었네."`,
        `${sp2}: "지금 바로 [${zName}]에 직접 발을 디뎌 지형을 정찰하고 고대 표식을 확인해 주세요! (퀘스트 안내창에서 바로 이동 가능)"`
      ],
      done: [
        `${sp1}: "[${zName}]의 지도를 완벽히 확보했군! 덕분에 아군의 진격로가 열렸네."`,
        `${sp2}: "새로운 영토를 개척한 기념으로 보급품을 챙겨 드릴게요!"`
      ]
    }),
    kill_any: (sp1, sp2, zName, cName, title, goal) => ({
      start: [
        `${sp1}: "[${zName}] 일대에 마물 무리가 진을 치고 보급선을 위협하고 있다네."`,
        `${sp2}: "[${zName}]로 출격해 마물 ${goal}마리를 소탕하고 안전을 확보해 주세요!"`
      ],
      done: [
        `${sp1}: "훌륭하군! [${zName}]의 마물들이 자네의 검기 앞에 뿔뿔이 흩어졌네."`,
        `${sp2}: "수고하셨어요! 다음 구역의 단서도 곧바로 정리해 두었답니다."`
      ]
    }),
    skill_cast: (sp1, sp2, zName, cName, title, goal) => ({
      start: [
        `${sp2}: "[${cName}]의 강적들을 상대하려면 단순한 평타만으로는 부족해요. [스킬] 탭에서 새 스킬을 배우고 장착해 보세요!"`,
        `${sp1}: "실전에서 액티브 스킬을 ${goal}회 발동해 새로운 오의 감각을 몸에 익히고 돌아오게!"`
      ],
      done: [
        `${sp2}: "우와, 방금 펼친 스킬 연계는 정말 눈부셨어요! 이제 어떤 강적도 두렵지 않겠네요."`,
        `${sp1}: "진정한 영웅의 검술과 마법이 완성되어 가는군!"`
      ]
    }),
    collect: (sp1, sp2, zName, cName, title, goal, matName) => ({
      start: [
        `${sp2}: "[${cName}]의 결계를 해제하고 신화 장비를 제작하려면 [${matName}] ${goal}개가 꼭 필요해요."`,
        `${sp1}: "[${zName}] 주변 마물들을 쓰러뜨리거나 보물상자를 열어 [${matName}]을 모아 오게!"`
      ],
      done: [
        `${sp2}: "순도가 엄청난 [${matName}]이에요! 이 정도면 결계를 여는 건 식은 죽 먹기겠어요."`,
        `${sp1}: "남은 재료는 대장장이 볼칸에게 가져가 강력한 대륙 장비를 조합해 보게나."`
      ]
    }),
    boss_hunt: (sp1, sp2, zName, cName, title, goal, bossName) => ({
      start: [
        `${sp1}: "마침내 [${zName}]의 지배자, ${bossName || '구역 보스'}가 모습을 드러냈네!"`,
        `${sp2}: "강력한 적이지만 물약과 새 스킬을 준비해 [${zName}]의 보스를 격파하면 큰 보상이 기다리고 있어요!"`
      ],
      done: [
        `${sp1}: "대단하군!! [${zName}]의 거대 보스를 단신으로 쓰러뜨리다니, 전 대륙에 소문이 퍼지겠어!"`,
        `${sp2}: "전리품과 특별 보상을 준비했어요. 다음 이야기가 기다리고 있답니다!"`
      ]
    }),
    enhance_gear: (sp1, sp2, zName, cName) => ({
      start: [
        `대장장이 볼칸: "이봐 영웅! [${cName}]의 몬스터들은 갈수록 단단해진다네. 내 대장간에 들러 장비 강화(또는 조합)를 1회 진행해 보게!"`,
        `${sp2}: "실패해도 장비는 절대 파괴되지 않으니 안심하고 강화를 시도해 보세요!"`
      ],
      done: [
        `대장장이 볼칸: "하하! 무기에서 뿜어져 나오는 빛깔이 달라졌구먼! 이 정도면 다음 보스도 문제없지!"`,
        `${sp1}: "강화석을 추가로 챙겨 두었으니 꾸준히 장비를 단련하게."`
      ]
    }),
    bounty_clear: (sp1, sp2, zName, cName) => ({
      start: [
        `${sp1}: "[${cName}] 원정을 돕는 용병 길드에서 긴급 의뢰가 들어왔네."`,
        `${sp2}: "[연대기] 탭 상단의 용병 길드 서브 의뢰를 1건 완료하고 보상을 수령해 신뢰를 쌓아 주세요!"`
      ],
      done: [
        `${sp1}: "용병 길드가 자네의 실력에 완전히 감탄했더군! 길드 특별 지원금을 받아 왔네."`,
        `${sp2}: "서브 의뢰는 언제든 무한 반복할 수 있으니 파밍에도 적극 활용해 보세요!"`
      ]
    }),
    tower: (sp1, sp2, zName, cName, title, goal) => ({
      start: [
        `${sp2}: "[${cName}]의 깊은 진실에 다가가기 전에 [월드맵·탑]에서 심연의 탑 ${goal}층을 돌파해 한계를 시험해 보세요!"`,
        `${sp1}: "탑의 시련을 넘긴 자만이 다음 차원의 문 앞에 설 자격이 있다네."`
      ],
      done: [
        `${sp1}: "심연의 탑 ${goal}층마저 정복해 냈군! 자네의 성장 속도는 전설 그 자체야."`,
        `${sp2}: "탑에서 얻은 기운이 영웅님의 검기에 강하게 공명하고 있어요!"`
      ]
    })
  };

  for (let idx = 20; idx < DATA.QUESTS.length; idx++) {
    const q = DATA.QUESTS[idx];
    const chNum = idx + 1; // 21 ~ 200
    const zMap = DATA.MAPS[`zone_${chNum}`];
    if (!zMap) continue;
    const cont = CONTINENTS[zMap.continentId - 1];
    const flavor = MISSION_FLAVORS[idx % 10];
    const sp1 = cont.cast[idx % cont.cast.length];
    const sp2 = cont.cast[(idx + 1) % cont.cast.length];
    const matItem = DATA.ITEMS[cont.matId];
    const matName = matItem ? matItem.name : '대륙 마석';
    const scaleMult = Math.pow(1.032, chNum - 20);

    q.targetMap = zMap.id;
    q.targetZoneName = zMap.name;
    q.continentName = cont.name;
    q.missionFlavor = flavor;

    if (flavor === 'explore') {
      q.type = 'explore';
      q.goal = 1;
      q.desc = `[탐사] ${zMap.name}에 도착해 미지 구역을 개척하세요.`;
      const dlg = STORY_TEMPLATES.explore(sp1, sp2, zMap.name, cont.name, q.title);
      q.dialogStart = dlg.start;
      q.dialogDone = dlg.done;
    } else if (flavor === 'kill_any') {
      q.type = 'kill_any';
      q.targets = cont.mobs.slice();
      q.goal = 4 + (idx % 4);
      q.desc = `[토벌] ${zMap.name}에서 출몰하는 마물 ${q.goal}마리를 처치하세요.`;
      const dlg = STORY_TEMPLATES.kill_any(sp1, sp2, zMap.name, cont.name, q.title, q.goal);
      q.dialogStart = dlg.start;
      q.dialogDone = dlg.done;
    } else if (flavor === 'skill_cast') {
      q.type = 'skill_cast';
      q.goal = 4 + (idx % 3);
      q.desc = `[오의 수련] 전투 중 액티브 스킬을 ${q.goal}회 발동하세요. (추천: ${zMap.name})`;
      const dlg = STORY_TEMPLATES.skill_cast(sp1, sp2, zMap.name, cont.name, q.title, q.goal);
      q.dialogStart = dlg.start;
      q.dialogDone = dlg.done;
    } else if (flavor === 'collect') {
      q.type = 'collect';
      q.targetItem = cont.matId;
      q.goal = 2 + (idx % 3);
      q.desc = `[수집] ${zMap.name}에서 [${matName}] ${q.goal}개를 모으세요.`;
      const dlg = STORY_TEMPLATES.collect(sp1, sp2, zMap.name, cont.name, q.title, q.goal, matName);
      q.dialogStart = dlg.start;
      q.dialogDone = dlg.done;
    } else if (flavor === 'boss_hunt') {
      q.type = 'boss_hunt';
      q.targets = cont.bosses.slice();
      q.goal = 1;
      q.desc = `[보스 토벌] ${zMap.name}의 ${zMap.zoneBossName || '구역 보스'}를 격파하세요!`;
      const dlg = STORY_TEMPLATES.boss_hunt(sp1, sp2, zMap.name, cont.name, q.title, 1, zMap.zoneBossName);
      q.dialogStart = dlg.start;
      q.dialogDone = dlg.done;
    } else if (flavor === 'enhance_gear') {
      q.type = 'enhance_gear';
      q.targetMap = 'town';
      q.targetZoneName = '솔티아 마을 (대장간)';
      q.goal = 1;
      q.desc = `[장비 단련] 솔티아 마을 대장장이 볼칸에게 장비 강화 또는 조합을 1회 진행하세요.`;
      const dlg = STORY_TEMPLATES.enhance_gear(sp1, sp2, zMap.name, cont.name);
      q.dialogStart = dlg.start;
      q.dialogDone = dlg.done;
    } else if (flavor === 'bounty_clear') {
      q.type = 'bounty_clear';
      q.goal = 1;
      q.desc = `[길드 의뢰] [연대기] 탭 상단의 용병 길드 서브 의뢰 보상을 1회 수령하세요.`;
      const dlg = STORY_TEMPLATES.bounty_clear(sp1, sp2, zMap.name, cont.name);
      q.dialogStart = dlg.start;
      q.dialogDone = dlg.done;
    } else if (flavor === 'tower') {
      q.type = 'tower';
      q.targetMap = 'tower';
      q.targetZoneName = '심연의 탑';
      q.goal = Math.min(100, Math.max(2, Math.floor((chNum - 15) * 0.52)));
      q.desc = `[탑의 시련] [월드맵·탑]에서 심연의 탑 ${q.goal}층 이상을 돌파하세요.`;
      const dlg = STORY_TEMPLATES.tower(sp1, sp2, zMap.name, cont.name, q.title, q.goal);
      q.dialogStart = dlg.start;
      q.dialogDone = dlg.done;
    }

    // Add diverse milestone gear & tactical elixir rewards!
    if (!q.reward) q.reward = { gold: Math.round(600 * scaleMult), exp: Math.round(700 * scaleMult), items: [] };
    if (!q.reward.items) q.reward.items = [];
    if (chNum % 4 === 0 && q.reward.items.length < 3) {
      const elixirs = ['elx_berserk', 'elx_iron', 'elx_haste', 'elx_full', 'elx_exp'];
      q.reward.items.push({ id: elixirs[(chNum / 4) % elixirs.length], qty: 1 });
    }
    if (flavor === 'boss_hunt' && q.reward.items.length < 3) {
      const gearPick = zoneRewardPool[Math.floor((chNum / 5) % zoneRewardPool.length)];
      if (gearPick && DATA.ITEMS[gearPick]) {
        q.reward.items.push({ id: gearPick, qty: 1 });
      }
    }
  }
})(window);
