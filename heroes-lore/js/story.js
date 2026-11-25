// 영웅서기: 솔티아의 바람 — 10부작 200장 대서사시 연대기 + 서브 의뢰 + 심연의 탑 100층
(function (global) {
  'use strict';

  const DATA = global.GAME_DATA;
  if (!DATA) return;

  // =========================================================================
  // 1. MYTHIC GEAR TIER (Lv.16 ~ Lv.130) & EXPANDED ENHANCEMENT SUPPORT
  // =========================================================================
  DATA.RARITY.mythic = { name: '신화', color: '#c084fc' };
  DATA.RARITY.eternal = { name: '영원', color: '#38bdf8' };

  Object.assign(DATA.ITEMS, {
    wp_tidal_sovereign:   { id: 'wp_tidal_sovereign', name: '해왕의 파도검', type: 'weapon', rarity: 'heroic', atk: 56, agi: 6, crit: 9, price: 2400, desc: '제2부 심해 제국의 파도를 가르는 성검.' },
    wp_sylph_blade:       { id: 'wp_sylph_blade', name: '정령왕의 바람검', type: 'weapon', rarity: 'legendary', atk: 74, agi: 10, int: 8, crit: 12, price: 3800, desc: '제3부 정령수 에르드라의 축복이 깃든 명검.' },
    wp_phoenix_edge:      { id: 'wp_phoenix_edge', name: '불사조의 홍련검', type: 'weapon', rarity: 'legendary', atk: 96, str: 14, vit: 8, crit: 14, price: 5400, desc: '제4부 화산 용맥의 불꽃으로 벼려낸 신검.' },
    wp_imperial_relic:    { id: 'wp_imperial_relic', name: '초대 황제의 성검', type: 'weapon', rarity: 'mythic', atk: 124, str: 16, int: 14, crit: 16, price: 7800, desc: '제5부 천년 솔티아 제국의 유산.' },
    wp_eclipse_breaker:   { id: 'wp_eclipse_breaker', name: '흑요석 파멸검', type: 'weapon', rarity: 'mythic', atk: 158, str: 20, agi: 14, crit: 18, price: 10500, desc: '제6부 그림자 기사단을 무너뜨린 패왕의 검.' },
    wp_astral_chronicle:  { id: 'wp_astral_chronicle', name: '성좌의 연대기검', type: 'weapon', rarity: 'mythic', atk: 205, str: 24, agi: 20, int: 22, crit: 22, price: 15000, desc: '제8부 일곱 별의 성물이 융합된 신화 무기.' },
    wp_eternal_soltia:    { id: 'wp_eternal_soltia', name: '영원의 바람 · 진 솔티아', type: 'weapon', rarity: 'eternal', atk: 280, str: 36, agi: 30, vit: 28, int: 32, crit: 28, price: 30000, desc: '제10부 200장의 대서사시를 완결한 영원의 신기.' },

    ar_tidal_plate:       { id: 'ar_tidal_plate', name: '심해 수호자의 갑주', type: 'armor', rarity: 'heroic', def: 48, hp: 340, vit: 8, price: 2400, desc: '거친 해일마저 막아내는 푸른 비늘 판금.' },
    ar_phoenix_mail:      { id: 'ar_phoenix_mail', name: '불사조의 성갑', type: 'armor', rarity: 'legendary', def: 72, hp: 560, str: 10, vit: 14, price: 5200, desc: '불멸의 불꽃이 상처를 치유하는 전설 갑옷.' },
    ar_imperial_aegis:    { id: 'ar_imperial_aegis', name: '천년 제국의 황금갑', type: 'armor', rarity: 'mythic', def: 108, hp: 920, vit: 20, int: 12, price: 9600, desc: '솔티아 초대 황제가 입었던 신화 갑주.' },
    ar_eternal_mantle:    { id: 'ar_eternal_mantle', name: '영원한 바람의 성의', type: 'armor', rarity: 'eternal', def: 165, hp: 1600, str: 22, agi: 22, vit: 28, int: 22, price: 26000, desc: '200장의 전설이 깃든 최강의 영원 갑주.' },

    hm_astral_crown:      { id: 'hm_astral_crown', name: '일곱 별의 왕관', type: 'helm', rarity: 'mythic', def: 46, hp: 420, mp: 180, int: 18, crit: 12, price: 8200, desc: '하늘의 일곱 별빛이 깃든 신화 서클릿.' },
    ac_genesis_heart:     { id: 'ac_genesis_heart', name: '창세의 바람 심장', type: 'accessory', rarity: 'eternal', atk: 42, def: 36, hp: 650, mp: 240, crit: 18, price: 22000, desc: '심연과 빛을 넘어선 영웅의 궁극 성물.' },

    pot_hp_xl:            { id: 'pot_hp_xl', name: '영웅의 비약 (HP)', type: 'consumable', subtype: 'hp', power: 1100, rarity: 'heroic', price: 380, desc: 'HP를 1100 회복합니다.' },
    pot_mp_xl:            { id: 'pot_mp_xl', name: '정령의 비약 (MP)', type: 'consumable', subtype: 'mp', power: 420, rarity: 'heroic', price: 320, desc: 'MP를 420 회복합니다.' }
  });

  if (!DATA.SHOP_GENERAL.includes('pot_hp_xl')) DATA.SHOP_GENERAL.push('pot_hp_xl', 'pot_mp_xl');
  DATA.SHOP_BLACKSMITH.push('wp_tidal_sovereign', 'ar_tidal_plate', 'wp_sylph_blade', 'ar_phoenix_mail');

  DATA.RECIPES.push(
    { id: 'rc_phoenix_edge', result: 'wp_phoenix_edge', gold: 2200, materials: [{ id: 'mat_flame_core', qty: 6 }, { id: 'mat_dark_crystal', qty: 4 }, { id: 'mat_enhance', qty: 3 }] },
    { id: 'rc_imperial_relic', result: 'wp_imperial_relic', gold: 3800, materials: [{ id: 'mat_ancient_stone', qty: 8 }, { id: 'mat_dark_crystal', qty: 6 }, { id: 'mat_enhance', qty: 5 }] },
    { id: 'rc_imperial_aegis', result: 'ar_imperial_aegis', gold: 4200, materials: [{ id: 'mat_ancient_stone', qty: 6 }, { id: 'mat_flame_core', qty: 6 }, { id: 'mat_dark_crystal', qty: 6 }] },
    { id: 'rc_astral_crown', result: 'hm_astral_crown', gold: 3400, materials: [{ id: 'mat_sea_pearl', qty: 6 }, { id: 'mat_ancient_stone', qty: 6 }, { id: 'mat_enhance', qty: 4 }] },
    { id: 'rc_genesis_heart', result: 'ac_genesis_heart', gold: 6500, materials: [{ id: 'mat_sea_pearl', qty: 5 }, { id: 'mat_flame_core', qty: 5 }, { id: 'mat_ancient_stone', qty: 5 }, { id: 'mat_dark_crystal', qty: 8 }] }
  );

  // =========================================================================
  // 2. 10-SEASON, 200-CHAPTER EPIC STORY CHRONICLE BUILDER
  // =========================================================================
  // Season 1 (Chapters 1~20) already lives hand-crafted in DATA.QUESTS.
  // Tag Season 1 chapters cleanly with season=1.
  DATA.QUESTS.forEach((q, idx) => {
    q.season = 1;
    q.seasonTitle = '제1부 · 바람이 멈춘 대륙';
    q.chapter = idx + 1;
  });

  // Seasons 2 ~ 10 (Chapters 21 ~ 200): 9 full epic seasons × 20 richly authored chapters each!
  const SEASONS = [
    {
      season: 2,
      seasonTitle: '제2부 · 붉은 달과 심해 제국',
      themeLoc: '푸른 물안개 해안',
      mapId: 'coast',
      speakerMain: '정찰병 카일',
      speakerSub: '음유시인 아리아',
      villain: '심해 제독 벨라토르',
      bossTarget: 'kraken_guard',
      mobsA: ['coral_crab', 'slime_blue'],
      mobsB: ['pirate_skel', 'coral_crab'],
      mobsC: ['pirate_skel', 'dark_mage'],
      matId: 'mat_sea_pearl',
      matName: '푸른 해풍 진주',
      milestoneReward: 'wp_tidal_sovereign',
      finaleReward: 'ar_tidal_plate',
      acts: ['2부 1막 · 붉은 달의 조수', '2부 2막 · 난파선 함대의 습격', '2부 3막 · 가라앉은 성전', '2부 4막 · 심해 제독의 몰락'],
      chapters: [
        ['붉은 달이 뜬 밤', '평화가 찾아온 솔티아 해안에 붉은 월식이 드리우며 검은 함대가 나타났다.'],
        ['파도에 떠밀려온 암호문', '해안에서 발견된 고대 해군 암호문이 가라앉은 심해 제국의 부활을 예고했다.'],
        ['산호 방벽의 균열', '검붉은 조수에 미쳐 날뛰는 산호 수호게 무리를 제압하고 방어선을 세웠다.'],
        ['유령 함대의 선봉대', '불타는 돛을 단 유령 해적 선봉대가 상륙을 시도했으나 영웅의 검에 가로막혔다.'],
        ['심연의 진주 공명', '바닷속 마력 진주를 모아 심해 제국의 항해 결계를 역추적하는 데 성공했다.'],
        ['카일의 옛 전우', '유령 함대의 부관 속에서 10년 전 실종된 기사단 해군 대장의 흔적을 발견했다.'],
        ['밀물의 포위망 돌파', '해안 양쪽에서 몰려드는 산호 군단과 해적들을 뚫고 등대 유적에 도달했다.'],
        ['바다 밑의 속삭임', '음유시인 아리아가 바닷바람 속에서 고대 해신의 비탄 어린 노래를 읽어냈다.'],
        ['심해의 관문 시험', '심연의 탑 초기 층에서 밀려나오는 바다 망령들을 격파하며 힘을 증명했다.'],
        ['[중간 보스] 파도의 첨병', '심해 제독이 파견한 거대 크라켄 첨병을 해안 암초에서 격파하고 교두보를 탈환했다.'],
        ['가라앉은 도시 아틀란티아', '바닷물이 갈라지며 고대 솔티아 해안 제국의 유적 좌표가 지도 위에 떠올랐다.'],
        ['저주받은 선장의 나침반', '유령 해적 장교들에게서 심해 신전으로 향하는 황금 나침반을 탈취했다.'],
        ['볼칸의 해풍 단조', '대장장이 볼칸이 바닷소금과 해풍 진주로 심해 전용 무기를 새롭게 단련했다.'],
        ['검은 소용돌이의 교단', '어둠의 마도사들이 해안 제단에서 해일을 소환하려는 의식을 막아냈다.'],
        ['피빛 산호의 장벽', '폭주한 산호 수호게 대군을 돌파하며 해신의 성소 외곽까지 진격했다.'],
        ['카일의 맹세', '정찰병 카일이 옛 동료들의 원한을 갚기 위해 최전선 돌격을 결심했다.'],
        ['해신의 눈물 수집', '성소 봉인을 풀기 위해 해안 곳곳에서 응축된 해풍 진주를 모아 결계를 열었다.'],
        ['심연 함대의 최후 저항', '붉은 달 아래 몰려든 정예 해적 군단과 수호수들을 모조리 베어 넘겼다.'],
        ['탑 너머의 심해 시련', '심연의 탑에서 각성한 심해 파수꾼을 제압하며 최종 결전 준비를 마쳤다.'],
        ['[2부 완결 보스] 심해 제독 격파', '심해의 크라켄 군주와 융합한 제독 벨라토르를 물리치고 붉은 달의 저주를 끊었다!']
      ]
    },
    {
      season: 3,
      seasonTitle: '제3부 · 숲의 현자와 정령왕',
      themeLoc: '고요한 숲',
      mapId: 'forest',
      speakerMain: '음유시인 아리아',
      speakerSub: '촌장 엘더',
      villain: '검은 뿌리 대주술사 말로크',
      bossTarget: 'goblin_chief',
      mobsA: ['goblin', 'boar'],
      mobsB: ['goblin_shaman', 'goblin'],
      mobsC: ['goblin_shaman', 'dark_mage'],
      matId: 'mat_goblin_fang',
      matName: '고블린 송곳니',
      milestoneReward: 'wp_sylph_blade',
      finaleReward: 'hm_goblin_helm',
      acts: ['3부 1막 · 시들어가는 세계수', '3부 2막 · 검은 뿌리 결사단', '3부 3막 · 정령왕의 시련', '3부 4막 · 녹빛 바람의 부활'],
      chapters: [
        ['시들어가는 에르드라', '고요한 숲 중앙의 고대 정령수 잎사귀가 하룻밤 새 잿빛으로 변하기 시작했다.'],
        ['광기에 물든 숲의 짐승', '검은 수액을 마신 멧돼지와 고블린 정찰대가 마을 외곽까지 밀려왔다.'],
        ['아리아의 정령 하프', '아리아의 하프 선율에 반응해 숲의 정령 실피드가 희미한 구조 신호를 보내왔다.'],
        ['검은 뿌리 결사단의 표식', '고블린 전사들의 갑옷에서 심연 교단의 비밀 분파 [검은 뿌리]의 낙인을 발견했다.'],
        ['독안개 토템 파괴', '고블린 주술사들이 숲의 수맥에 세워둔 독안개 토템을 모두 베어 없앴다.'],
        ['송곳니 정화 의식', '대장장이 볼칸이 저주받은 고블린 송곳니를 녹여 정령수 해독 촉매를 만들었다.'],
        ['은신처의 매복전', '안개 낀 고요한 숲 협곡에서 기습한 고블린 암습 부대를 역으로 섬멸했다.'],
        ['엘더의 오래된 양피지', '촌장 엘더가 300년 전 정령왕과 솔티아 왕국이 맺었던 수호 협정서를 꺼내 보였다.'],
        ['심연의 탑 숲의 환영', '심연의 탑에 깃든 타락한 숲의 환영을 돌파하며 정령의 신뢰를 얻었다.'],
        ['[중간 보스] 강철 엄니 족장', '검은 뿌리의 힘을 주입받아 부활한 강철 엄니 고블린 군주를 격파했다.'],
        ['정령왕 실피드의 각성', '약해진 정령왕 실피드가 영웅의 검에 깃든 맑은 바람을 느끼고 진실을 전했다.'],
        ['말로크의 흑주술 진영', '대주술사 말로크가 정령수의 뿌리를 심연과 연결하려 한다는 사실이 드러났다.'],
        ['어둠 마도사의 난입', '숲 깊숙한 제단에 파견된 흑마법 지원 부대를 격퇴하고 마력선을 차단했다.'],
        ['고대의 수액 정화', '오염된 송곳니와 마력 파편을 모아 정령수의 대지를 정화하는 비약을 완성했다.'],
        ['주술사 군단의 총공세', '말로크의 명령으로 숲 전역의 고블린 주술사들이 일제히 마법 포격을 퍼부었다.'],
        ['바람의 수호자들', '마을 주민들과 아리아의 노래가 울려 퍼지며 영웅의 몸에 찬란한 녹빛 바람이 감돌았다.'],
        ['검은 뿌리의 심장부', '숲 가장 깊은 성역의 결계를 부수고 대주술사의 제단 앞까지 돌파했다.'],
        ['친위대 섬멸전', '말로크를 호위하는 광전사 고블린 정예 부대를 단숨에 제압했다.'],
        ['탑의 정령 시험', '심연의 탑 상층의 시련을 넘어 정령왕의 진정한 축복을 각성시켰다.'],
        ['[3부 완결 보스] 대주술사 말로크 토벌', '검은 뿌리의 화신이 된 고블린 대군주 말로크를 격파하고 정령수 에르드라를 되살렸다!']
      ]
    },
    {
      season: 4,
      seasonTitle: '제4부 · 화염의 용맥과 불사조',
      themeLoc: '붉은 바람 협곡',
      mapId: 'canyon',
      speakerMain: '대장장이 볼칸',
      speakerSub: '정찰병 카일',
      villain: '잿빛 화염군주 파이로스',
      bossTarget: 'ignis_boss',
      mobsA: ['wyvern', 'boar'],
      mobsB: ['lava_golem', 'wyvern'],
      mobsC: ['lava_golem', 'dark_mage'],
      matId: 'mat_flame_core',
      matName: '화염의 심장석',
      milestoneReward: 'wp_phoenix_edge',
      finaleReward: 'ar_phoenix_mail',
      acts: ['4부 1막 · 대지의 포효', '4부 2막 · 신화 대장간의 비밀', '4부 3막 · 용암 군단의 행진', '4부 4막 · 불사조의 비상'],
      chapters: [
        ['붉게 타오르는 하늘', '붉은 바람 협곡의 화산이 격렬히 진동하며 솔티아 하늘을 화산재로 물들였다.'],
        ['볼칸의 고향 이야기', '대장장이 볼칸이 사실 협곡 신화 대장간의 마지막 후계자였다는 비밀을 털어놓았다.'],
        ['화염 와이번의 습격', '용맥 폭주로 흥분한 붉은 와이번 무리를 하늘에서 끌어내려 제압했다.'],
        ['움직이는 용암 바위', '고대 대장간 입구를 가로막은 용암 골렘들을 부수고 지하 통로를 확보했다.'],
        ['불꽃의 심장 채굴', '신화 용광로를 다시 지피기 위해 순도 높은 화염의 심장석을 수집했다.'],
        ['스승의 유언 비석', '무너진 대장간에서 볼칸의 스승이 남긴 신검 제작 비법과 경고문을 발견했다.'],
        ['파이로스의 화염 사도', '화산 깊은 곳에서 깨어난 화염군주 파이로스가 대륙을 불바다로 만들겠다고 선언했다.'],
        ['용맥 밸브 봉쇄전', '폭주하는 와이번과 골렘을 물리치며 마그마가 마을로 흐르는 수로를 닫았다.'],
        ['심연의 탑 불꽃 시련', '심연의 탑 화염 구역을 돌파하며 극한의 열기를 견딜 내성을 길렀다.'],
        ['[중간 보스] 분노한 용암 수호자', '파이로스의 힘에 잠식된 이그니스의 분신을 격파하고 첫 번째 화산 인장을 되찾았다.'],
        ['불사조의 깃털 전설', '음유시인 아리아가 협곡 정상에 잠든 불사조의 전설과 신검 각성법을 전했다.'],
        ['용암 골렘 대대 격파', '협곡 중앙 다리를 점거한 초대형 용암 골렘 부대를 정면 돌파했다.'],
        ['흑마법 화염 교단', '파이로스와 손을 잡은 어둠의 마도사들이 마그마에 심연의 독을 섞는 것을 저지했다.'],
        ['볼칸의 영혼 단조', '화염의 심장석을 용광로에 쏟아부어 영웅을 위한 불사조의 홍련검을 벼려냈다.'],
        ['화산 분화구 강행군', '끊임없이 날아드는 와이번 편대를 뚫고 분화구 최심부로 진격했다.'],
        ['카일의 화염 방패진', '정찰병 카일과 기사단 지원병들이 후방 용암 틈을 막아내며 길을 열어주었다.'],
        ['불멸의 재 수집', '불사조의 축복을 깨우기 위해 순수한 화염의 심장석을 제단에 바쳤다.'],
        ['파이로스 친위대 격멸', '화산 왕좌 앞을 지키는 최정예 용암 골렘과 와이번을 모두 쓰러뜨렸다.'],
        ['탑 최심부의 화염 각성', '심연의 탑에서 불꽃의 시련을 완수하고 영웅의 검기에 태양의 빛을 더했다.'],
        ['[4부 완결 보스] 화염군주 파이로스 격파', '태양의 창을 휘두르는 화염군주 파이로스를 쓰러뜨리고 협곡의 용맥을 영원히 잠재웠다!']
      ]
    },
    {
      season: 5,
      seasonTitle: '제5부 · 천년 솔티아 제국의 진실',
      themeLoc: '잊혀진 유적',
      mapId: 'ruins',
      speakerMain: '촌장 엘더',
      speakerSub: '음유시인 아리아',
      villain: '망령 대현자 솔론',
      bossTarget: 'cassius_boss',
      mobsA: ['skeleton', 'golem'],
      mobsB: ['dark_mage', 'skeleton'],
      mobsC: ['golem', 'dark_mage'],
      matId: 'mat_ancient_stone',
      matName: '고대 마석',
      milestoneReward: 'wp_imperial_relic',
      finaleReward: 'ar_imperial_aegis',
      acts: ['5부 1막 · 봉인된 지하 서고', '5부 2막 · 천년 전의 계약', '5부 3막 · 망령 제국의 부활', '5부 4막 · 초대 황제의 유산'],
      chapters: [
        ['유적 지하의 비밀 계단', '잊혀진 유적 중앙 룬이 공명하며 천 년 동안 닫혀 있던 지하 대도서관이 열렸다.'],
        ['깨어난 제국 근위병', '고대 왕국의 서고를 지키던 스켈레톤 근위 검사들과 치열한 검투를 벌였다.'],
        ['천년 전의 첫 번째 석판', '솔티아 대륙이 원래 심연의 바다 위에 세워진 인공 낙원이었다는 충격 기록을 발견했다.'],
        ['유적 골렘의 보안 결계', '서고의 고대 방어 장치인 유적 골렘들이 침입자를 향해 일제히 기동했다.'],
        ['고대 마석 열쇠 복원', '흩어진 고대 마석을 모아 봉인된 황실 기록실의 암호 장치를 해독했다.'],
        ['망령 대현자 솔론의 등장', '천 년 전 계약을 집필했던 대현자 솔론의 망령이 어둠 속에서 모습을 드러냈다.'],
        ['일곱 성기사의 희생', '아리아가 초대 일곱 성기사가 바람의 성물을 만들며 치른 숭고한 대가를 밝혀냈다.'],
        ['어둠 마도사들의 약탈', '황실 기록을 빼돌리려는 어둠의 마도사 부대를 서고 회랑에서 모두 섬멸했다.'],
        ['심연의 탑 고대 기록층', '심연의 탑에 복제된 천년 전 전쟁의 기억을 돌파하며 고대 검술을 체득했다.'],
        ['[중간 보스] 제국 수호기사 환영', '초대 성기사단장의 힘을 품은 망령 수호기사를 쓰러뜨리고 황실 인장을 계승했다.'],
        ['바르가스의 혈통 비밀', '바르가스가 초대 황제의 마지막 직계 후손이자 봉인의 계승자였음이 밝혀졌다.'],
        ['고대 골렘 군단 격파', '대현자 솔론이 깨운 거대 석상 군단을 부수며 제국의 옥좌실로 전진했다.'],
        ['마도사 결계 파괴', '서고 사방에 펼쳐진 시간 정지 결계를 어둠 마도사들을 쓰러뜨려 해제했다.'],
        ['황실 마석 동력원', '고대 마석을 모아 천년 제국의 성검을 잠에서 깨울 제단을 복구했다.'],
        ['스켈레톤 백전노장', '천 년 전 최강이라 불리던 불사의 검사 부대를 정면 승부로 압도했다.'],
        ['엘더의 눈물', '촌장 엘더가 솔티아 마을 자체가 초대 기사단의 후손들이 지은 수호 마을임을 고백했다.'],
        ['제국의 마지막 인장', '고대 마석을 옥좌에 끼워 넣자 천 년의 먼지가 걷히며 황금빛 문이 열렸다.'],
        ['솔론의 어둠 수호대', '옥좌 앞을 가로막는 대현자의 최정예 골렘과 마도사들을 격파했다.'],
        ['탑 너머의 제국 시련', '심연의 탑에서 고대 황제의 마지막 시험을 통과해 진정한 계승자로 인정받았다.'],
        ['[5부 완결 보스] 망령 대현자 솔론 해방', '천 년의 집착에 갇혔던 대현자 솔론을 해방시키고 초대 황제의 성검과 황금갑을 계승했다!']
      ]
    },
    {
      season: 6,
      seasonTitle: '제6부 · 흑요석 성채와 그림자 기사단',
      themeLoc: '침묵의 흑요석 성채',
      mapId: 'citadel',
      speakerMain: '정찰병 카일',
      speakerSub: '대장장이 볼칸',
      villain: '그림자 단장 녹턴',
      bossTarget: 'cassius_boss',
      mobsA: ['fallen_knight', 'abyss_assassin'],
      mobsB: ['abyss_assassin', 'dark_mage'],
      mobsC: ['fallen_knight', 'golem'],
      matId: 'mat_dark_crystal',
      matName: '어둠의 결정',
      milestoneReward: 'wp_eclipse_breaker',
      finaleReward: 'ar_abyss_aegis',
      acts: ['6부 1막 · 재건된 흑요석 성채', '6부 2막 · 솔티아 마을 방어전', '6부 3막 · 그림자 요새 잠입', '6부 4막 · 어둠의 단장 결전'],
      chapters: [
        ['검은 깃발의 귀환', '무너졌던 침묵의 흑요석 성채에 보랏빛 결계가 솟아오르며 그림자 기사단이 집결했다.'],
        ['마을을 노리는 암살자', '솔티아 마을을 기습하려던 심연의 암살자들을 성채 외곽에서 미리 차단했다.'],
        ['타락한 기사단의 행군', '카시우스의 유산을 이어받은 그림자 단장 녹턴이 타락한 성기사 군단을 이끌고 나섰다.'],
        ['미나의 보급선 사수', '잡화상인 미나의 보급 마차를 습격한 암살자 부대를 격퇴하고 물자를 지켜냈다.'],
        ['어둠의 결정 역이용', '볼칸이 심연의 어둠의 결정을 정화해 성채 방벽을 뚫는 파쇄 룬을 제작했다.'],
        ['성채 외벽 돌파전', '치열한 화살과 암흑탄이 쏟아지는 흑요석 성벽을 정면 돌파했다.'],
        ['그림자 암살단 소굴', '성채 지하 감옥에 숨어 있던 심연의 암살자 정예 조를 모두 제압했다.'],
        ['포로 구출 작전', '성채에 붙잡혀 있던 솔티아 정찰대원들을 구출하고 카일과 감격의 재회를 이루었다.'],
        ['심연의 탑 그림자 구역', '심연의 탑에서 그림자 기사단의 훈련장을 파괴하며 적의 전력을 약화시켰다.'],
        ['[중간 보스] 그림자 부단장 제로스', '성채 중앙 홀을 지키는 그림자 부단장을 일기토로 쓰러뜨렸다.'],
        ['녹턴의 도발', '그림자 단장 녹턴이 "바르가스도 카시우스도 약했다, 진정한 심연의 힘은 내 것"이라며 조롱했다.'],
        ['타락한 중장갑 기사단', '거대한 창을 든 타락한 성기사 방진을 스킬 콤보로 산산조각 냈다.'],
        ['흑마법 포탑 파괴', '성채 상층에서 어둠 마법을 쏘아대던 어둠의 마도사 포대를 침묵시켰다.'],
        ['어둠의 결정 정화', '성채 핵심 동력로에서 어둠의 결정을 회수해 보랏빛 보호막을 완전히 꺼뜨렸다.'],
        ['내성 혈투', '타락한 기사와 암살자의 협공을 뚫고 흑요석 첨탑 꼭대기까지 올라섰다.'],
        ['볼칸과 카일의 합동 지원', '볼칸의 강화 망치와 카일의 기습 작전으로 첨탑의 강철 대문이 마침내 열렸다.'],
        ['심연의 열쇠 조합', '어둠의 결정으로 봉인된 첨탑 알현실의 자물쇠를 부수고 안으로 들어섰다.'],
        ['그림자 친위대 섬멸', '녹턴을 호위하는 최후의 흑요석 기사단을 완벽히 격파했다.'],
        ['탑 상층 그림자 시련', '심연의 탑에서 자신의 그림자 환영을 이겨내며 한 단계 더 각성했다.'],
        ['[6부 완결 보스] 그림자 단장 녹턴 격파', '그림자 기사단의 수장 녹턴을 쓰러뜨리고 흑요석 성채를 완전히 해방시켰다!']
      ]
    },
    {
      season: 7,
      seasonTitle: '제7부 · 차원의 균열과 거울 세계',
      themeLoc: '봉인의 제단',
      mapId: 'altar',
      speakerMain: '음유시인 아리아',
      speakerSub: '심연의 기사 바르가스(영혼)',
      villain: '거울의 심판자 미라주',
      bossTarget: 'vargas',
      mobsA: ['fallen_knight', 'dark_mage'],
      mobsB: ['abyss_assassin', 'golem'],
      mobsC: ['wyvern', 'fallen_knight'],
      matId: 'mat_dark_crystal',
      matName: '어둠의 결정',
      milestoneReward: 'hm_astral_crown',
      finaleReward: 'ac_oath_emblem',
      acts: ['7부 1막 · 갈라진 하늘의 거울', '7부 2막 · 뒤틀린 시간선', '7부 3막 · 또 다른 나의 그림자', '7부 4막 · 차원 균열 봉합'],
      chapters: [
        ['갈라진 하늘의 균열', '봉인의 제단 상공에 은빛 균열이 생기며 또 다른 차원의 솔티아가 비치기 시작했다.'],
        ['바르가스의 영혼 강림', '해방되었던 바르가스의 순수한 영혼이 나타나 "심연의 진정한 군주가 차원을 찢고 있다"고 경고했다.'],
        ['거울 속의 기사들', '균열에서 쏟아져 나온 뒤틀린 차원의 타락한 성기사들을 막아냈다.'],
        ['시간을 먹는 마도사', '대륙의 시간을 역행시키려는 차원 마도사들을 유적과 성채에서 토벌했다.'],
        ['차원 파편 수집', '균열의 좌표를 고정하기 위해 어둠의 결정을 모아 차원 나침반을 완성했다.'],
        ['멸망한 시간선의 기억', '거울 세계 너머, 영웅이 패배해 폐허가 된 끔찍한 솔티아의 환영을 목격했다.'],
        ['심연의 암살자 군단', '영웅의 존재 자체를 지우려 파견된 차원 암살자들을 완벽히 역습했다.'],
        ['아리아의 차원 자장가', '아리아가 고대의 노래로 흔들리는 차원의 틈을 일시적으로 안정시켰다.'],
        ['심연의 탑 거울의 방', '심연의 탑에서 끝없이 복제되는 차원 수호자들을 뚫고 나아갔다.'],
        ['[중간 보스] 타락한 차원의 바르가스', '빛을 잃어버린 다른 시간선의 바르가스 환영을 격파하고 영혼을 위로했다.'],
        ['거울의 심판자 미라주', '차원 틈의 지배자 미라주가 나타나 영웅의 신념을 시험하겠다고 선언했다.'],
        ['유적 골렘의 차원 변이', '시공간 마력을 머금은 변이 골렘 부대를 파괴하고 제단 외곽을 탈환했다.'],
        ['불타는 차원의 와이번', '협곡의 균열을 뚫고 날아든 차원 화염 와이번들을 격추했다.'],
        ['차원의 쐐기 복원', '어둠의 결정을 빛으로 정화해 차원 균열을 꿰맬 은빛 쐐기를 완성했다.'],
        ['끝없는 환영의 회랑', '타락한 기사와 어둠 마도사가 뒤섞인 차원의 회랑을 거침없이 돌파했다.'],
        ['동료들의 믿음', '엘더, 아리아, 볼칸, 미나, 카일이 모두 모여 영웅의 이름을 부르며 힘을 보탰다.'],
        ['균열의 핵 확보', '어둠의 결정으로 만든 마지막 공명석을 봉인의 제단 중앙에 설치했다.'],
        ['미라주의 차원 친위대', '제단 앞을 에워싼 최정예 차원 수호병들을 단숨에 궤멸시켰다.'],
        ['탑 심층 차원 돌파', '심연의 탑 고층에서 시공간의 압력을 이겨내며 영웅의 경지를 끌어올렸다.'],
        ['[7부 완결 보스] 거울의 심판자 격파', '차원의 심판자 미라주를 쓰러뜨리고 일그러진 거울 세계의 균열을 닫아냈다!']
      ]
    },
    {
      season: 8,
      seasonTitle: '제8부 · 일곱 별의 성물과 천공의 맹세',
      themeLoc: '솔티아 전역',
      mapId: 'canyon',
      speakerMain: '촌장 엘더',
      speakerSub: '음유시인 아리아',
      villain: '별빛 찬탈자 아스트라',
      bossTarget: 'ignis_boss',
      mobsA: ['coral_crab', 'goblin_shaman'],
      mobsB: ['wyvern', 'lava_golem'],
      mobsC: ['fallen_knight', 'abyss_assassin'],
      matId: 'mat_flame_core',
      matName: '화염의 심장석',
      milestoneReward: 'wp_astral_chronicle',
      finaleReward: 'hm_astral_crown',
      acts: ['8부 1막 · 밤하늘의 일곱 별', '8부 2막 · 4대 원소 재각성', '8부 3막 · 별빛을 훔친 자', '8부 4막 · 성좌의 축복'],
      chapters: [
        ['떨어지는 일곱 유성', '심연의 근원을 봉인할 유일한 열쇠, 일곱 별의 성물이 솔티아 전역에 유성처럼 쏟아졌다.'],
        ['첫 번째 별 · 초원의 숨결', '바람의 초원과 해안의 마물들을 물리치고 첫 번째 별빛 조각을 회수했다.'],
        ['두 번째 별 · 파도의 심장', '푸른 물안개 해안에서 산호 군단을 뚫고 두 번째 별빛 조각을 손에 넣었다.'],
        ['세 번째 별 · 숲의 속삭임', '고요한 숲의 주술사 무리를 제압하고 세 번째 별빛 조각을 되찾았다.'],
        ['별빛 촉매 정련', '화염의 심장석으로 별빛 성물들을 하나로 묶을 황금 고리를 벼려냈다.'],
        ['별빛 찬탈자 아스트라', '타락한 천공의 사도 아스트라가 일곱 별을 빼앗기 위해 강림했다.'],
        ['네 번째 별 · 협곡의 태양', '붉은 바람 협곡의 와이번 편대를 격추하고 네 번째 별빛 조각을 회수했다.'],
        ['다섯 번째 별 · 용암의 의지', '용암 골렘 대군을 격파하고 다섯 번째 별빛 조각을 봉인에서 꺼냈다.'],
        ['심연의 탑 별빛 층 돌파', '심연의 탑에 떨어진 여섯 번째 별빛의 수호자들을 돌파했다.'],
        ['[중간 보스] 각성 화염 수호자', '별빛의 힘으로 폭주한 진각성 화염 수호자를 제압하고 성물을 정화했다.'],
        ['여섯 번째 별 · 유적의 지혜', '잊혀진 유적의 고대 문양을 밝혀 여섯 번째 별빛 성물을 완성했다.'],
        ['일곱 번째 별의 행방', '마지막 일곱 번째 별이 아스트라의 손에 들어가 흑요석 성채로 옮겨졌음을 알아냈다.'],
        ['성채 탈환 기습전', '타락한 성기사와 심연의 암살자들을 뚫고 아스트라의 추격로를 봉쇄했다.'],
        ['태양의 심장 공명', '화염의 심장석을 바쳐 여섯 개의 별빛 성물을 찬란한 성좌의 검으로 융합시켰다.'],
        ['아스트라의 유성 폭격', '협곡과 성채에 쏟아지는 적의 마법 공세를 돌파하며 전진했다.'],
        ['아리아의 성좌 연주', '아리아의 하프가 일곱 별과 공명하며 대륙 전체에 황금빛 오로라가 펼쳐졌다.'],
        ['마지막 별빛 추적', '붉은 협곡의 화염 심장석을 통해 아스트라가 숨은 천공 제단을 특정했다.'],
        ['천공 사도 친위대', '별빛 갑옷을 두른 타락 사도 부대를 압도적인 검기로 베어 넘겼다.'],
        ['탑 고층 성좌의 시험', '심연의 탑 상층에서 일곱 별의 진정한 주인임을 증명했다.'],
        ['[8부 완결 보스] 별빛 찬탈자 아스트라 격파', '아스트라를 쓰러뜨리고 일곱 별의 성물을 모두 완성해 성좌의 연대기검을 각성시켰다!']
      ]
    },
    {
      season: 9,
      seasonTitle: '제9부 · 심연의 왕좌 총력전',
      themeLoc: '침묵의 흑요석 성채',
      mapId: 'citadel',
      speakerMain: '정찰병 카일',
      speakerSub: '심연의 기사 바르가스(영혼)',
      villain: '심연의 대원수 말가니스',
      bossTarget: 'cassius_boss',
      mobsA: ['fallen_knight', 'dark_mage'],
      mobsB: ['abyss_assassin', 'fallen_knight'],
      mobsC: ['golem', 'abyss_assassin'],
      matId: 'mat_ancient_stone',
      matName: '고대 마석',
      milestoneReward: 'ar_imperial_aegis',
      finaleReward: 'wp_eclipse_breaker',
      acts: ['9부 1막 · 대륙 연합군 출정', '9부 2막 · 4대 전선 돌파', '9부 3막 · 심연 대원수의 강림', '9부 4막 · 마지막 성문 개방'],
      chapters: [
        ['솔티아 대륙 연합군', '마을 주민, 성기사단, 숲의 정령, 협곡 대장장이들이 모두 모여 최후의 출정을 선포했다.'],
        ['제1전선 · 초원 방어', '심연의 군단이 총공세를 개시하자 선봉에 서서 적의 전위 부대를 궤멸시켰다.'],
        ['제2전선 · 해안 함대 격침', '바다로 우회하려던 심연 지원군을 정찰병 카일과 함께 완벽히 격퇴했다.'],
        ['제3전선 · 성채 외곽 포위', '흑요석 성채를 지키는 타락한 성기사 군단을 정면에서 돌파했다.'],
        ['고대 마석 공성포', '유적에서 모은 고대 마석으로 성채의 3중 심연 방벽을 부술 마력포를 가동했다.'],
        ['심연의 대원수 말가니스', '창세신 아비스의 오른팔, 대원수 말가니스가 대군을 이끌고 전장에 강림했다.'],
        ['암살자 군단의 야습', '연합군 본진을 노린 심연의 암살자 떼를 영웅 혼자 막아내며 사기를 드높였다.'],
        ['바르가스의 검술 전수', '바르가스의 영혼이 영웅에게 성기사단 비전의 오의를 직접 전수해 주었다.'],
        ['심연의 탑 총력 돌파', '심연의 탑에서 끊임없이 병력을 쏟아내는 차원 생성기를 파괴했다.'],
        ['[중간 보스] 심연의 선봉장', '말가니스의 선봉장을 흑요석 광장에서 격파하고 내성 진입로를 확보했다.'],
        ['성채 제1관문 함락', '타락한 기사와 어둠 마도사 연합 부대를 격파하며 성채 절반을 장악했다.'],
        ['거대 석상 공성전', '성채 내벽을 지키는 고대 골렘과 암살자들을 뚫고 왕좌 계단에 도달했다.'],
        ['볼칸의 최후 병기', '대장장이 볼칸이 밤새 완성한 신화 강화석을 연합군 전원에게 지급했다.'],
        ['봉인 해제 마석 수집', '대원수의 왕좌실 결계를 깨기 위해 순수한 고대 마석을 모아 의식을 마쳤다.'],
        ['혈전의 흑요석 회랑', '끝없이 쏟아지는 타락한 기사들을 베어 넘기며 피의 회랑을 돌파했다.'],
        ['아리아와 미나의 헌신', '전선 뒤에서 부상병을 돌보는 아리아와 미나의 응원이 영웅의 검에 빛을 더했다.'],
        ['최후의 열쇠 완성', '고대 마석의 빛이 하나로 모이며 말가니스의 흑요석 대문이 산산이 부서졌다.'],
        ['대원수 친위기사단', '심연 최강의 친위대마저 영웅의 빛나는 검기 앞에 무릎을 꿇었다.'],
        ['탑 최상층 전초전', '심연의 탑 고층을 정복하며 창세신과 맞설 최종 자격을 갖추었다.'],
        ['[9부 완결 보스] 심연 대원수 말가니스 격파', '심연 군단의 총사령관 말가니스를 쓰러뜨리고 봉인의 제단 최심부로 향하는 문을 열었다!']
      ]
    },
    {
      season: 10,
      seasonTitle: '제10부 · 영원의 바람, 영웅서기 완결',
      themeLoc: '봉인의 제단',
      mapId: 'altar',
      speakerMain: '심연의 기사 바르가스(영혼)',
      speakerSub: '음유시인 아리아',
      villain: '심연의 창세신 아비스',
      bossTarget: 'vargas',
      mobsA: ['fallen_knight', 'abyss_assassin'],
      mobsB: ['dark_mage', 'golem'],
      mobsC: ['fallen_knight', 'dark_mage'],
      matId: 'mat_dark_crystal',
      matName: '어둠의 결정',
      milestoneReward: 'ar_eternal_mantle',
      finaleReward: 'wp_eternal_soltia',
      acts: ['10부 1막 · 심연의 근원으로', '10부 2막 · 일곱 별과 영웅들의 합창', '10부 3막 · 창세신 강림', '10부 4막 · 영원의 솔티아'],
      chapters: [
        ['최후의 여명', '봉인의 제단 하늘이 보랏빛과 황금빛으로 갈라지며 최후의 결전이 막을 올렸다.'],
        ['바르가스와의 동행', '이제 바르가스의 영혼이 영웅의 검 곁에서 함께 싸우며 길을 비추기 시작했다.'],
        ['심연의 사도들', '창세신 아비스가 직접 빚어낸 타락한 기사들과 암살자들이 제단 앞을 막아섰다.'],
        ['혼돈의 마도사 군단', '세상의 모든 바람을 지우려는 심연 마도사들의 대주문을 베어 끊었다.'],
        ['심연의 근원 결정', '어둠의 결정을 일곱 별빛으로 정화해 창세신의 불멸 결계를 깨뜨릴 빛을 빚었다.'],
        ['창세신 아비스의 목소리', '"바람도, 빛도, 시간도 결국 공허로 돌아간다"며 거대한 심연의 의지가 대륙을 뒤흔들었다.'],
        ['전 대륙의 염원', '솔티아 마을부터 푸른 해안, 고요한 숲, 붉은 협곡의 모든 생명이 영웅에게 빛을 보냈다.'],
        ['고대 수호자들의 가호', '정화된 크라켄, 정령왕 실피드, 화염의 이그니스가 영웅의 방패가 되어 주었다.'],
        ['심연의 탑 정상 도전', '심연의 탑 최상층을 돌파하며 신화의 벽을 넘어 영원의 경지에 도달했다.'],
        ['[중간 보스] 공허의 사신', '창세신의 분신인 공허의 사신을 제단 입구에서 격파하고 [영원한 바람의 성의]를 얻었다.'],
        ['끝없는 어둠의 파도', '마지막 발악처럼 밀려드는 타락한 성기사 대군을 바람의 검기로 쓸어버렸다.'],
        ['시간의 끝자락', '어둠의 마도사와 고대 골렘이 지키는 심연의 왕좌 계단을 한 걸음씩 올라섰다.'],
        ['카시우스의 속죄', '사라지기 직전의 카시우스가 마지막 남은 기사단의 힘으로 영웅의 상처를 치유하고 눈을 감았다.'],
        ['영원의 성물 완성', '어둠의 결정과 일곱 별을 융합해 [창세의 바람 심장]의 빛을 완전히 깨웠다.'],
        ['아비스의 최종 방벽', '제단 가장 안쪽의 정예 심연 수호자들을 모두 쓰러뜨리고 마지막 관문을 열었다.'],
        ['아리아의 마지막 노래', '음유시인 아리아가 "이 싸움이 끝나면 영웅님의 이름으로 새 시대의 노래를 부를게요"라며 미소 지었다.'],
        ['모든 동료와의 작별 인사', '엘더, 볼칸, 미나, 카일, 아리아, 그리고 바르가스의 축복을 가슴에 품고 제단 중앙에 섰다.'],
        ['신화의 전야', '심연의 최정예 수호군을 단 일격의 필살기로 돌파하며 창세신 앞에 마주 섰다.'],
        ['영원의 각성', '심연의 탑 시련마저 완전히 초월한 영웅의 검이 태양보다 밝게 타올랐다.'],
        ['[대단원 200장] 영원의 바람 · 솔티아', '심연의 창세신과 융합한 진각성 바르가스를 마침내 정화하고, 200장의 대서사시를 완결하며 영원의 영웅이 되었다!']
      ]
    }
  ];

  // Build Chapters 21 ~ 200 with varied mechanics, rich multi-speaker cutscenes, and scaled progression!
  SEASONS.forEach((s) => {
    s.chapters.forEach(([chTitle, chSummary], idx) => {
      const chNum = (s.season - 1) * 20 + idx + 1;
      const actIdx = Math.floor(idx / 5);
      const actName = s.acts[actIdx];
      const isMidBoss = idx === 9;
      const isFinalBoss = idx === 19;
      const isCollect = idx === 4 || idx === 13 || idx === 16;
      const isTower = idx === 8 || idx === 18;

      let type = 'kill_any';
      let targets = idx < 6 ? s.mobsA : (idx < 14 ? s.mobsB : s.mobsC);
      let targetItem = null;
      let goal = 4 + (idx % 3);
      let desc = '';

      if (isFinalBoss) {
        type = 'kill_any';
        targets = [s.bossTarget];
        goal = 1;
        desc = `[${s.themeLoc}]에서 ${s.seasonTitle}의 최종 보스(${s.villain})를 격파하세요!`;
      } else if (isMidBoss) {
        type = 'kill_any';
        targets = [s.bossTarget];
        goal = 1;
        desc = `[${s.themeLoc}]에서 강력한 중간 보스를 처치하고 다음 막의 열쇠를 확보하세요!`;
      } else if (isCollect) {
        type = 'collect';
        targetItem = s.matId;
        goal = 3 + Math.min(4, Math.floor(s.season / 2));
        desc = `[${s.themeLoc}]에서 ${s.matName} ${goal}개를 모아 의식을 완료하세요.`;
      } else if (isTower) {
        type = 'tower';
        const reqFloor = Math.min(100, (s.season - 1) * 10 + (idx === 8 ? 5 : 10));
        goal = reqFloor;
        desc = `메뉴의 [월드맵 / 심연의 탑]에서 심연의 탑 ${reqFloor}층 이상을 돌파하세요!`;
      } else {
        const mobNames = targets.map((t) => DATA.MONSTERS[t] ? DATA.MONSTERS[t].name : t).join('·');
        desc = `[${s.themeLoc}]에서 강화된 ${mobNames} ${goal}마리를 처치하세요.`;
      }

      const scale = Math.pow(1.24, s.season - 1);
      const gold = Math.round((360 + idx * 55) * scale * (isFinalBoss ? 2.2 : (isMidBoss ? 1.5 : 1)));
      const exp = Math.round((420 + idx * 65) * scale * (isFinalBoss ? 2.4 : (isMidBoss ? 1.6 : 1)));
      const items = [{ id: 'mat_enhance', qty: isFinalBoss ? 6 : (isMidBoss ? 4 : 2) }];
      if (idx % 4 === 1) items.push({ id: s.season >= 5 ? 'pot_hp_xl' : 'pot_hp_l', qty: 3 });
      if (isMidBoss && s.milestoneReward) items.push({ id: s.milestoneReward, qty: 1 });
      if (isFinalBoss && s.finaleReward) items.push({ id: s.finaleReward, qty: 1 });
      if (chNum === 200) items.push({ id: 'ac_genesis_heart', qty: 1 });

      const dialogStart = [
        `${s.speakerMain}: "${chSummary}"`,
        `${s.speakerSub}: "${isFinalBoss
          ? `드디어 ${s.villain}와의 최종 결전이에요! 지금껏 모아온 모든 힘을 검에 담아주세요!`
          : isMidBoss
          ? `강력한 적장이 앞을 가로막고 있어요. 장비 강화와 비약을 확인하고 돌파해 주세요!`
          : isTower
          ? `심연의 탑으로 들어가 더 높은 층의 시련을 돌파해야 해요. 상단 메뉴에서 바로 입장할 수 있답니다!`
          : isCollect
          ? `${s.themeLoc}의 마물들에게서 ${s.matName} ${goal}개를 모아오면 돌파구가 열릴 거예요.`
          : `${s.themeLoc}의 적들이 ${s.season}부의 마기로 더욱 강해졌어요. 방심하지 말고 목표를 완수해 주세요!`}"`,
        `${s.speakerMain}: "${isFinalBoss
          ? `솔티아의 모든 이들이 자네를 지켜보고 있네. ${s.seasonTitle}의 대미를 장식해 주게!`
          : `준비가 되었다면 출발하세! [${chNum}장 · ${chTitle}]을(를) 시작하네.`}"`
      ];

      const dialogProgress = [
        `${s.speakerMain}: "${desc}"`,
        `${s.speakerSub}: "월드맵 메뉴를 열면 해금된 지역과 심연의 탑으로 즉시 이동할 수 있어요!"`
      ];

      const dialogComplete = isFinalBoss ? [
        `${s.villain}: "크아아악... 불가능하다...! 고작 인간의 의지가 이 거대한 심연을 베어내다니...!"`,
        `${s.speakerSub}: "해냈어요!! ${s.seasonTitle}의 위협이 완전히 물러나고 솔티아에 새로운 바람이 불어와요!"`,
        `${s.speakerMain}: "${chNum === 200
          ? '200장에 걸친 영웅서기의 대서사시가 마침내 완결되었군... 자네는 영원히 기억될 솔티아의 진정한 전설일세!'
          : `정말 훌륭하네! 하지만 아직 끝이 아니야... 곧 제${s.season + 1}부의 새로운 이야기가 열릴 걸세!`}"`
      ] : [
        `${s.speakerSub}: "대단해요! [${chNum}장 · ${chTitle}]을(를) 무사히 완수하셨군요!"`,
        `${s.speakerMain}: "${chSummary} 자, 보상을 챙기고 곧바로 다음 장으로 나아가세!"`
      ];

      DATA.QUESTS.push({
        id: `ch${String(chNum).padStart(3, '0')}`,
        season: s.season,
        seasonTitle: s.seasonTitle,
        act: actName,
        chapter: chNum,
        title: `${chNum}장. ${chTitle}`,
        desc,
        summary: chSummary,
        type,
        targets,
        targetItem,
        targetMap: s.mapId,
        goal,
        reward: { gold, exp, items, legendWeapon: chNum === 200 },
        dialogStart,
        dialogProgress,
        dialogComplete
      });
    });
  });

  // =========================================================================
  // 3. ABYSS TOWER (1~100층) & ROTATING GUILD BOUNTIES (무한 서브 의뢰)
  // =========================================================================
  DATA.TOWER_BOSSES = [
    { name: '탑의 문지기 고블린 군주', sprite: 'goblin_chief' },
    { name: '심해의 탑 수호자 크라켄', sprite: 'kraken_guard' },
    { name: '홍련의 화염 수호자 이그니스', sprite: 'ignis_boss' },
    { name: '그림자 대장군 카시우스', sprite: 'cassius_boss' },
    { name: '심연의 창세신 바르가스 · 각성', sprite: 'vargas' }
  ];

  DATA.SIDE_BOUNTY_POOL = [
    { id: 'sb_slime', title: '[의뢰] 초원의 마력 슬라임 토벌', targets: ['slime_green', 'slime_blue'], goal: 6, mapHint: '바람의 초원', gold: 180, exp: 160 },
    { id: 'sb_boar', title: '[의뢰] 난폭한 멧돼지 무리 제압', targets: ['boar'], goal: 5, mapHint: '바람의 초원', gold: 240, exp: 210 },
    { id: 'sb_coast', title: '[의뢰] 해안 산호게·유령해적 소탕', targets: ['coral_crab', 'pirate_skel'], goal: 6, mapHint: '푸른 물안개 해안', gold: 380, exp: 340 },
    { id: 'sb_forest', title: '[의뢰] 고블린 약탈단 토벌', targets: ['goblin', 'goblin_shaman'], goal: 6, mapHint: '고요한 숲', gold: 520, exp: 480 },
    { id: 'sb_canyon', title: '[의뢰] 협곡 와이번·용암골렘 격퇴', targets: ['wyvern', 'lava_golem'], goal: 6, mapHint: '붉은 바람 협곡', gold: 760, exp: 720 },
    { id: 'sb_ruins', title: '[의뢰] 잊혀진 유적 언데드 정화', targets: ['skeleton', 'golem', 'dark_mage'], goal: 6, mapHint: '잊혀진 유적', gold: 1050, exp: 980 },
    { id: 'sb_citadel', title: '[의뢰] 흑요석 성채 정예군 소탕', targets: ['fallen_knight', 'abyss_assassin'], goal: 6, mapHint: '침묵의 흑요석 성채', gold: 1450, exp: 1380 },
    { id: 'sb_boss', title: '[현상수배] 대륙의 보스 몬스터 격파', targets: ['kraken_guard', 'goblin_chief', 'ignis_boss', 'cassius_boss', 'vargas'], goal: 1, mapHint: '각 지역 보스', gold: 2000, exp: 1900 }
  ];

  // Add the dedicated Abyss Tower Arena map (24x18)
  DATA.MAPS.tower = {
    id: 'tower',
    name: '심연의 탑',
    bgm: 'boss',
    safe: false,
    isTower: true,
    subtitle: '끝없는 도전 · 1층 ~ 100층 시련의 탑',
    layout: [
      'BBBBBBBBBBBBBBBBBBBBBBBB',
      'BbbbbbbbbbbbbbbbbbbbbbbB',
      'BbbBBbbbbbbbbbbbbbbBBbbB',
      'BbbBBbbbbbbbbbbbbbbBBbbB',
      'BbbbbbbbbbbbbbbbbbbbbbbB',
      'Bbbbbbbb********bbbbbbbB',
      'Bbbbbbb*bbbbbbbb*bbbbbbB',
      'Bbbbbbb*bbb**bbb*bbbbbbB',
      'Bbbbbbb*bbb**bbb*bbbbbbB',
      'Bbbbbbb*bbbbbbbb*bbbbbbB',
      'Bbbbbbbb********bbbbbbbB',
      'BbbbbbbbbbbbbbbbbbbbbbbB',
      'BbbBBbbbbbbbbbbbbbbBBbbB',
      'BbbBBbbbbbbbbbbbbbbBBbbB',
      'BbbbbbbbbbbbbbbbbbbbbbbB',
      'Bbbbbbbbbbb**bbbbbbbbbbB',
      'Bbbbbbbbbbb**bbbbbbbbbbB',
      'BBBBBBBBBBBbbBBBBBBBBBBB'
    ],
    npcs: [],
    chests: [],
    portals: [
      { tx: 11.5, ty: 17.1, toMap: 'town', toX: 11.5, toY: 11.5, label: '솔티아 마을 귀환 ▼' }
    ],
    spawns: []
  };
})(window);
