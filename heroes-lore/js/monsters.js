// =============================================================================
// 영웅서기: 솔티아의 바람 — 210 UNIQUE BIOME MONSTERS & HD SPRITE ENGINE (v19)
// 200 Continent Species (20 per Continent) + 10 Continent Apex Bosses = 210 New!
// =============================================================================
(function (global) {
  'use strict';

  const DATA = global.GAME_DATA;
  if (!DATA || !DATA.MONSTERS || !DATA.CONTINENTS) return;

  // 20 visually distinct monster species per continent (200 regular/elite + 10 apex bosses)
  // Tuple: [name, shape, ai, bodyCol, accentCol, eyeCol, auraCol]
  const CONT_SPECIES = {
    1: [
      ['이슬빛 왕관 슬라임', 'slime', 'melee', '#4ade80', '#bbf7d0', '#14532d', '#86efac'],
      ['바람갈기 들멧돼지', 'beast', 'charger', '#92400e', '#f59e0b', '#fef08a', '#fbbf24'],
      ['도토리 수호 고블린', 'goblin', 'melee', '#65a30d', '#fde047', '#ef4444', '#a3e635'],
      ['들꽃 뿔사슴 야수', 'centaur', 'charger', '#a16207', '#fde68a', '#4ade80', '#86efac'],
      ['풀잎 정령 위습', 'elemental', 'ranged', '#22c55e', '#d9f99d', '#ffffff', '#4ade80'],
      ['떡갈나무 유목 엔트', 'treant', 'melee', '#713f12', '#4ade80', '#fef08a', '#22c55e'],
      ['황금빛 들꽃 독거미', 'spider', 'melee', '#3f6212', '#facc15', '#fb7185', '#fde047'],
      ['은빛 시냇가 집게게', 'crab', 'melee', '#0d9488', '#99f6e4', '#fef08a', '#5eead4'],
      ['초원 늑대 우두머리', 'beast', 'charger', '#64748b', '#e2e8f0', '#38bdf8', '#94a3b8'],
      ['돌다리 가고일 척후', 'gargoyle', 'ranged', '#475569', '#cbd5e1', '#fbbf24', '#94a3b8'],
      ['풍차 언덕 허수아비', 'mage', 'ranged', '#b45309', '#fde68a', '#f97316', '#fbbf24'],
      ['이슬버섯 숲지기', 'mushroom', 'melee', '#16a34a', '#fef08a', '#1e293b', '#86efac'],
      ['억새밭 암살 표범', 'assassin', 'charger', '#ca8a04', '#fef9c3', '#f43f5e', '#facc15'],
      ['바람 정령 궁수', 'mage', 'ranged', '#059669', '#a7f3d0', '#e0f2fe', '#34d399'],
      ['고대 경계석 골렘', 'golem', 'charger', '#57534e', '#a8a29e', '#4ade80', '#86efac'],
      ['초원 요새 해골병', 'skeleton', 'melee', '#cbd5e1', '#64748b', '#22c55e', '#94a3b8'],
      ['변방 기병 켄타우로스', 'centaur', 'charger', '#7c2d12', '#fbbf24', '#fef08a', '#f59e0b'],
      ['초원 비룡 새끼', 'wyvern', 'ranged', '#15803d', '#86efac', '#fde047', '#4ade80'],
      ['풀숲 보물 미믹', 'mimic', 'melee', '#854d0e', '#facc15', '#ef4444', '#fde047'],
      ['초원 수호 성기사', 'knight', 'charger', '#166534', '#fde047', '#ffffff', '#4ade80']
    ],
    2: [
      ['산호집게 심해 전사', 'crab', 'melee', '#f43f5e', '#fda4af', '#fef08a', '#fb7185'],
      ['진주 조개 미믹', 'mimic', 'melee', '#0284c7', '#fbcfe8', '#fde047', '#7dd3fc'],
      ['해풍 유령 해적병', 'skeleton', 'melee', '#94a3b8', '#38bdf8', '#22d3ee', '#7dd3fc'],
      ['푸른 소용돌이 해파리', 'jelly', 'ranged', '#06b6d4', '#cffafe', '#ffffff', '#38bdf8'],
      ['심해 산호 골렘', 'golem', 'charger', '#0f766e', '#fb7185', '#fde047', '#2dd4bf'],
      ['난파선 저주 선장', 'knight', 'charger', '#1e3a8a', '#fbbf24', '#38bdf8', '#60a5fa'],
      ['번개 뱀장어 서펀트', 'serpent', 'charger', '#0369a1', '#fef08a', '#ffffff', '#38bdf8'],
      ['심해 세이렌 마녀', 'mage', 'ranged', '#0891b2', '#f472b6', '#e0f2fe', '#67e8f9'],
      ['산호기사단 창병', 'knight', 'melee', '#0e7490', '#fda4af', '#fef08a', '#38bdf8'],
      ['폭풍 갈매기 가고일', 'gargoyle', 'ranged', '#334155', '#bae6fd', '#fde047', '#7dd3fc'],
      ['심해 수정 슬라임', 'slime', 'melee', '#0284c7', '#bae6fd', '#ffffff', '#38bdf8'],
      ['바다신전 수호석상', 'golem', 'charger', '#155e75', '#67e8f9', '#fef08a', '#22d3ee'],
      ['진주빛 물정령', 'elemental', 'ranged', '#38bdf8', '#e0f2fe', '#ffffff', '#7dd3fc'],
      ['유령함대 해적 고블린', 'goblin', 'ranged', '#164e63', '#fbbf24', '#38bdf8', '#22d3ee'],
      ['심연 바다거미', 'spider', 'melee', '#0c4a6e', '#67e8f9', '#f43f5e', '#38bdf8'],
      ['해저 발광 버섯령', 'mushroom', 'ranged', '#0d9488', '#a5f3fc', '#fef08a', '#2dd4bf'],
      ['삼지창 심해 켄타우로스', 'centaur', 'charger', '#0369a1', '#fde047', '#e0f2fe', '#38bdf8'],
      ['심해 산호 와이번', 'wyvern', 'ranged', '#0284c7', '#fb7185', '#fef08a', '#38bdf8'],
      ['검은 갑판 암살자', 'assassin', 'charger', '#0f172a', '#38bdf8', '#f43f5e', '#22d3ee'],
      ['폭풍 조수 해신병', 'knight', 'charger', '#1d4ed8', '#93c5fd', '#ffffff', '#60a5fa']
    ],
    3: [
      ['유황 불꽃 슬라임', 'slime', 'melee', '#ea580c', '#fde047', '#7c2d12', '#fb923c'],
      ['흑요석 뿔도마뱀', 'beast', 'charger', '#991b1b', '#f97316', '#fef08a', '#ef4444'],
      ['용암 도깨비 화염술사', 'goblin', 'ranged', '#b91c1c', '#fbbf24', '#fef08a', '#f97316'],
      ['화산재 불사조 새끼', 'wyvern', 'ranged', '#dc2626', '#fde047', '#ffffff', '#fb923c'],
      ['적열 철갑 골렘', 'golem', 'charger', '#451a03', '#f97316', '#fef08a', '#ea580c'],
      ['마그마 화염 정령', 'elemental', 'ranged', '#f97316', '#fef08a', '#ffffff', '#fb923c'],
      ['현무암 화산 거미', 'spider', 'melee', '#292524', '#ef4444', '#fde047', '#f97316'],
      ['불꽃 수호 해골기사', 'skeleton', 'melee', '#7f1d1d', '#fb923c', '#fef08a', '#ef4444'],
      ['화염 교단 대사제', 'mage', 'ranged', '#9a3412', '#fde047', '#ffffff', '#f97316'],
      ['작열 용맥 와이번', 'wyvern', 'charger', '#b91c1c', '#fb923c', '#fef08a', '#ef4444'],
      ['용광로 화염 미믹', 'mimic', 'melee', '#78350f', '#fb923c', '#fef08a', '#f97316'],
      ['잿빛 분화구 가고일', 'gargoyle', 'ranged', '#44403c', '#f97316', '#fde047', '#ea580c'],
      ['불멸의 용암 서펀트', 'serpent', 'charger', '#dc2626', '#fde047', '#ffffff', '#f97316'],
      ['흑요석 집게 전갈', 'crab', 'melee', '#3f1d1d', '#f97316', '#fef08a', '#ef4444'],
      ['흑요석 대검 기사', 'knight', 'charger', '#450a0a', '#fb923c', '#fde047', '#ef4444'],
      ['화염 폭풍 어쌔신', 'assassin', 'charger', '#7c2d12', '#fde047', '#ffffff', '#f97316'],
      ['유황 포자 불버섯', 'mushroom', 'ranged', '#b45309', '#fde047', '#ef4444', '#fb923c'],
      ['칼데라 화염 해파리', 'jelly', 'ranged', '#ea580c', '#fef08a', '#ffffff', '#fb923c'],
      ['적열 투기장 켄타우로스', 'centaur', 'charger', '#991b1b', '#fbbf24', '#fef08a', '#ef4444'],
      ['타오르는 화염 엔트', 'treant', 'melee', '#572013', '#f97316', '#fde047', '#ea580c']
    ],
    4: [
      ['서리 결정 슬라임', 'slime', 'melee', '#60a5fa', '#e0f2fe', '#1e3a8a', '#93c5fd'],
      ['백은 설원 늑대', 'beast', 'charger', '#cbd5e1', '#e0f2fe', '#38bdf8', '#bae6fd'],
      ['고드름 얼음 고블린', 'goblin', 'melee', '#2563eb', '#bae6fd', '#ffffff', '#60a5fa'],
      ['수정 빙하 골렘', 'golem', 'charger', '#1d4ed8', '#bae6fd', '#ffffff', '#38bdf8'],
      ['눈보라 서리 마녀', 'mage', 'ranged', '#3b82f6', '#e0f2fe', '#ffffff', '#93c5fd'],
      ['동결 기사단 해골병', 'skeleton', 'melee', '#93c5fd', '#1e3a8a', '#38bdf8', '#bae6fd'],
      ['만년설 설인 야수', 'beast', 'charger', '#e2e8f0', '#60a5fa', '#2563eb', '#93c5fd'],
      ['빙결 수정 거미', 'spider', 'melee', '#1e40af', '#bae6fd', '#ffffff', '#60a5fa'],
      ['극야 오로라 정령', 'elemental', 'ranged', '#38bdf8', '#a7f3d0', '#ffffff', '#67e8f9'],
      ['설원 빙룡 와이번', 'wyvern', 'ranged', '#0284c7', '#e0f2fe', '#fde047', '#7dd3fc'],
      ['얼음 거울 암살자', 'assassin', 'charger', '#1e3a8a', '#7dd3fc', '#ffffff', '#38bdf8'],
      ['눈꽃 결정 버섯', 'mushroom', 'ranged', '#60a5fa', '#ffffff', '#1e40af', '#bae6fd'],
      ['빙하 왕실 성기사', 'knight', 'charger', '#1d4ed8', '#e0f2fe', '#fef08a', '#60a5fa'],
      ['서리 뿔 켄타우로스', 'centaur', 'charger', '#3b82f6', '#e0f2fe', '#ffffff', '#93c5fd'],
      ['빙결 보물 미믹', 'mimic', 'melee', '#1e40af', '#93c5fd', '#fde047', '#60a5fa'],
      ['설산 빙결 가고일', 'gargoyle', 'ranged', '#475569', '#bae6fd', '#38bdf8', '#93c5fd'],
      ['얼음 호수 빙어 뱀', 'serpent', 'charger', '#0284c7', '#e0f2fe', '#ffffff', '#38bdf8'],
      ['오로라 빙하 해파리', 'jelly', 'ranged', '#67e8f9', '#c4b5fd', '#ffffff', '#7dd3fc'],
      ['백은 자작나무 엔트', 'treant', 'melee', '#cbd5e1', '#7dd3fc', '#1d4ed8', '#bae6fd'],
      ['절대영도 빙하 집게', 'crab', 'melee', '#2563eb', '#e0f2fe', '#fef08a', '#60a5fa']
    ],
    5: [
      ['모래폭풍 사구 슬라임', 'slime', 'melee', '#eab308', '#fef08a', '#713f12', '#fde047'],
      ['황금 전갈 수호자', 'crab', 'charger', '#ca8a04', '#fef08a', '#ef4444', '#facc15'],
      ['피라미드 붕대 미라', 'skeleton', 'melee', '#d6b474', '#fef3c7', '#f59e0b', '#fcd34d'],
      ['태양 신전 스핑크스', 'beast', 'charger', '#b45309', '#fde047', '#38bdf8', '#fbbf24'],
      ['신기루 모래 정령', 'elemental', 'ranged', '#f59e0b', '#fef3c7', '#ffffff', '#fde047'],
      ['사막 도적 자칼', 'goblin', 'charger', '#a16207', '#fcd34d', '#ef4444', '#f59e0b'],
      ['오벨리스크 사암 골렘', 'golem', 'charger', '#92400e', '#fde68a', '#38bdf8', '#fbbf24'],
      ['황금 풍뎅이 거미', 'spider', 'melee', '#854d0e', '#fde047', '#ef4444', '#facc15'],
      ['파라오 저주 마도사', 'mage', 'ranged', '#b45309', '#38bdf8', '#fef08a', '#fbbf24'],
      ['사구 거대 모래벌레', 'serpent', 'charger', '#a16207', '#fde68a', '#f97316', '#f59e0b'],
      ['태양 전차 켄타우로스', 'centaur', 'charger', '#d97706', '#fef08a', '#ffffff', '#fbbf24'],
      ['황금 석관 미믹', 'mimic', 'melee', '#ca8a04', '#fef08a', '#38bdf8', '#fde047'],
      ['오아시스 야자 엔트', 'treant', 'melee', '#78350f', '#4ade80', '#fde047', '#86efac'],
      ['불타는 사막 와이번', 'wyvern', 'ranged', '#d97706', '#fef08a', '#ef4444', '#fbbf24'],
      ['피라미드 황금 성기사', 'knight', 'charger', '#b45309', '#fef08a', '#38bdf8', '#fde047'],
      ['모래시계 그림자 암살자', 'assassin', 'charger', '#713f12', '#fde047', '#f43f5e', '#f59e0b'],
      ['사막 신전 가고일', 'gargoyle', 'ranged', '#92400e', '#fcd34d', '#fef08a', '#fbbf24'],
      ['태양광선 사막 해파리', 'jelly', 'ranged', '#facc15', '#fef9c3', '#ffffff', '#fde047'],
      ['황금 선인장 버섯', 'mushroom', 'ranged', '#65a30d', '#fde047', '#713f12', '#a3e635'],
      ['태양신전 근위 장군', 'knight', 'charger', '#ca8a04', '#ffffff', '#ef4444', '#fde047']
    ],
    6: [
      ['구름 솜사탕 슬라임', 'slime', 'melee', '#bae6fd', '#ffffff', '#0284c7', '#e0f2fe'],
      ['백익 천공 그리핀', 'wyvern', 'charger', '#f8fafc', '#fde047', '#38bdf8', '#e0f2fe'],
      ['바람개비 질풍 정령', 'elemental', 'ranged', '#38bdf8', '#ffffff', '#fef08a', '#bae6fd'],
      ['천공 기사단 발키리', 'knight', 'charger', '#e0f2fe', '#facc15', '#0284c7', '#fde047'],
      ['번개구름 뇌전 마도사', 'mage', 'ranged', '#0284c7', '#fef08a', '#ffffff', '#7dd3fc'],
      ['하늘 도서관 가고일', 'gargoyle', 'ranged', '#cbd5e1', '#fde047', '#38bdf8', '#e0f2fe'],
      ['무지개 폭포 해파리', 'jelly', 'ranged', '#7dd3fc', '#f9a8d4', '#ffffff', '#bae6fd'],
      ['별빛 유리 골렘', 'golem', 'charger', '#93c5fd', '#fef08a', '#ffffff', '#bae6fd'],
      ['부유석 천공 비룡', 'wyvern', 'ranged', '#0ea5e9', '#e0f2fe', '#fde047', '#7dd3fc'],
      ['날개 천공 켄타우로스', 'centaur', 'charger', '#e2e8f0', '#fbbf24', '#0284c7', '#bae6fd'],
      ['천사의 하프 정령', 'elemental', 'ranged', '#fef08a', '#ffffff', '#38bdf8', '#fde68a'],
      ['성광의 천공 성기사', 'knight', 'charger', '#38bdf8', '#fef08a', '#ffffff', '#fde047'],
      ['태풍의 눈 암살자', 'assassin', 'charger', '#0369a1', '#e0f2fe', '#fde047', '#7dd3fc'],
      ['황금 깃털 매수인', 'beast', 'charger', '#f59e0b', '#ffffff', '#0284c7', '#fde047'],
      ['구름다리 천공 거미', 'spider', 'melee', '#60a5fa', '#ffffff', '#fde047', '#bae6fd'],
      ['성좌 계단 보물 미믹', 'mimic', 'melee', '#0284c7', '#fde047', '#ffffff', '#7dd3fc'],
      ['천공 성전 백사 서펀트', 'serpent', 'charger', '#e0f2fe', '#38bdf8', '#fde047', '#bae6fd'],
      ['빛의 구름 버섯요정', 'mushroom', 'ranged', '#93c5fd', '#fef08a', '#0284c7', '#e0f2fe'],
      ['에테리아 창공 엔트', 'treant', 'melee', '#cbd5e1', '#fef08a', '#38bdf8', '#e0f2fe'],
      ['천공 의회 심판관', 'mage', 'ranged', '#1d4ed8', '#fde047', '#ffffff', '#7dd3fc']
    ],
    7: [
      ['독안개 맹독 슬라임', 'slime', 'melee', '#10b981', '#a7f3d0', '#4c1d95', '#34d399'],
      ['형광 포자 버섯군주', 'mushroom', 'ranged', '#7c3aed', '#6ee7b7', '#fef08a', '#a78bfa'],
      ['썩은 버드나무 엔트', 'treant', 'melee', '#14532d', '#a855f7', '#4ade80', '#34d399'],
      ['도깨비불 늪지 정령', 'elemental', 'ranged', '#a855f7', '#6ee7b7', '#ffffff', '#c084fc'],
      ['늪지 독거미 여왕', 'spider', 'charger', '#3b0764', '#34d399', '#f43f5e', '#a855f7'],
      ['뼈다귀 나룻배 해골', 'skeleton', 'melee', '#64748b', '#34d399', '#a855f7', '#6ee7b7'],
      ['그림자 까마귀 가고일', 'gargoyle', 'ranged', '#1e1b4b', '#c084fc', '#4ade80', '#a855f7'],
      ['저주 수도원 흑마녀', 'mage', 'ranged', '#581c87', '#34d399', '#fde047', '#c084fc'],
      ['검은 수렁 수호 골렘', 'golem', 'charger', '#1f2937', '#10b981', '#c084fc', '#34d399'],
      ['월식의 늪지 암살자', 'assassin', 'charger', '#312e81', '#34d399', '#f43f5e', '#a855f7'],
      ['망령 납골당 흑기사', 'knight', 'charger', '#1e1b4b', '#a855f7', '#34d399', '#c084fc'],
      ['핏빛 안개 늪지 뱀', 'serpent', 'charger', '#4c1d95', '#f43f5e', '#34d399', '#a855f7'],
      ['마녀 집회 늪 고블린', 'goblin', 'ranged', '#065f46', '#c084fc', '#fde047', '#34d399'],
      ['독극물 연금 미믹', 'mimic', 'melee', '#4c1d95', '#34d399', '#fde047', '#a855f7'],
      ['심연 뿌리 늪지 야수', 'beast', 'charger', '#064e3b', '#c084fc', '#f43f5e', '#34d399'],
      ['저주 성채 켄타우로스', 'centaur', 'charger', '#3b0764', '#6ee7b7', '#fde047', '#a855f7'],
      ['보랏빛 늪지 해파리', 'jelly', 'ranged', '#9333ea', '#6ee7b7', '#ffffff', '#c084fc'],
      ['그림자 늪지 와이번', 'wyvern', 'ranged', '#4c1d95', '#34d399', '#f43f5e', '#a855f7'],
      ['늪지 집게 거대게', 'crab', 'melee', '#115e59', '#c084fc', '#fde047', '#34d399'],
      ['월식 성전 사신기사', 'knight', 'charger', '#0f172a', '#c084fc', '#34d399', '#a855f7']
    ],
    8: [
      ['용혈 마력 슬라임', 'slime', 'melee', '#be123c', '#fda4af', '#fef08a', '#fb7185'],
      ['적룡 화염 비룡', 'wyvern', 'ranged', '#dc2626', '#fbbf24', '#fef08a', '#f97316'],
      ['청룡 수정 와이번', 'wyvern', 'ranged', '#0284c7', '#7dd3fc', '#fef08a', '#38bdf8'],
      ['백룡 질풍 용기사', 'knight', 'charger', '#f1f5f9', '#fb7185', '#fde047', '#e2e8f0'],
      ['흑룡 심연 암살자', 'assassin', 'charger', '#18181b', '#f43f5e', '#fde047', '#fb7185'],
      ['용골 협곡 해골용병', 'skeleton', 'melee', '#d6d3d1', '#dc2626', '#fb923c', '#fda4af'],
      ['멸룡 요새 철갑 골렘', 'golem', 'charger', '#7f1d1d', '#fbbf24', '#fef08a', '#ef4444'],
      ['용염 뿔 야수왕', 'beast', 'charger', '#9f1239', '#fb923c', '#fef08a', '#f43f5e'],
      ['고대 용언 대마도사', 'mage', 'ranged', '#881337', '#fde047', '#ffffff', '#fb7185'],
      ['천룡 날개 가고일', 'gargoyle', 'ranged', '#450a0a', '#fbbf24', '#f43f5e', '#fb923c'],
      ['용혈 제단 수호기사', 'knight', 'charger', '#b91c1c', '#fde047', '#ffffff', '#f43f5e'],
      ['화산 용암 용서펀트', 'serpent', 'charger', '#e11d48', '#fbbf24', '#fef08a', '#fb7185'],
      ['고룡 보물상자 미믹', 'mimic', 'melee', '#991b1b', '#fde047', '#ffffff', '#fbbf24'],
      ['용비늘 거대 거미', 'spider', 'melee', '#4c0519', '#fb7185', '#fde047', '#f43f5e'],
      ['태고 용기 켄타우로스', 'centaur', 'charger', '#9f1239', '#fde047', '#ffffff', '#fb7185'],
      ['용의 숲 불타는 엔트', 'treant', 'melee', '#450a0a', '#f97316', '#fde047', '#ef4444'],
      ['용암 포자 용버섯', 'mushroom', 'ranged', '#be123c', '#fde047', '#ffffff', '#fb7185'],
      ['성광 용염 정령', 'elemental', 'ranged', '#f43f5e', '#fde047', '#ffffff', '#fb923c'],
      ['심연 용혈 해파리', 'jelly', 'ranged', '#e11d48', '#fda4af', '#fef08a', '#fb7185'],
      ['불멸룡 근위대장', 'knight', 'charger', '#7f1d1d', '#fef08a', '#f43f5e', '#fbbf24']
    ],
    9: [
      ['별가루 시공 슬라임', 'slime', 'melee', '#6366f1', '#c7d2fe', '#fde047', '#818cf8'],
      ['부서진 거울 암살자', 'assassin', 'charger', '#312e81', '#38bdf8', '#fde047', '#818cf8'],
      ['역류 시간의 정령', 'elemental', 'ranged', '#38bdf8', '#c4b5fd', '#fde047', '#818cf8'],
      ['시공 파수꾼 성기사', 'knight', 'charger', '#1e1b4b', '#7dd3fc', '#fde047', '#6366f1'],
      ['어둠의 성좌 마도사', 'mage', 'ranged', '#4338ca', '#fde047', '#38bdf8', '#818cf8'],
      ['은하수 성운 해파리', 'jelly', 'ranged', '#818cf8', '#f0abfc', '#ffffff', '#c084fc'],
      ['평행세계 타락 기사', 'knight', 'charger', '#3730a3', '#f472b6', '#fde047', '#818cf8'],
      ['무한 모래시계 골렘', 'golem', 'charger', '#1e1b4b', '#fde047', '#38bdf8', '#818cf8'],
      ['균열 차원 성좌룡', 'wyvern', 'ranged', '#4f46e5', '#7dd3fc', '#fde047', '#a5b4fc'],
      ['쌍둥이 달 가고일', 'gargoyle', 'ranged', '#312e81', '#e879f9', '#fde047', '#818cf8'],
      ['중력 회랑 차원 거미', 'spider', 'melee', '#1e1b4b', '#38bdf8', '#f472b6', '#818cf8'],
      ['망각 영웅 해골군주', 'skeleton', 'charger', '#6366f1', '#fde047', '#38bdf8', '#a5b4fc'],
      ['차원 교각 은하 서펀트', 'serpent', 'charger', '#4338ca', '#7dd3fc', '#fde047', '#818cf8'],
      ['성좌 관측소 미믹', 'mimic', 'melee', '#312e81', '#fde047', '#38bdf8', '#818cf8'],
      ['별의 무덤 성운 야수', 'beast', 'charger', '#4f46e5', '#f0abfc', '#fde047', '#818cf8'],
      ['시간정지 켄타우로스', 'centaur', 'charger', '#3730a3', '#7dd3fc', '#fde047', '#a5b4fc'],
      ['별빛 우주수 엔트', 'treant', 'melee', '#1e1b4b', '#818cf8', '#fde047', '#38bdf8'],
      ['우주 포자 성좌버섯', 'mushroom', 'ranged', '#6366f1', '#f0abfc', '#fde047', '#818cf8'],
      ['차원 균열 성좌 집게', 'crab', 'melee', '#4338ca', '#38bdf8', '#fde047', '#818cf8'],
      ['태초빛 차원 심판관', 'mage', 'ranged', '#1e1b4b', '#fde047', '#ffffff', '#7dd3fc']
    ],
    10: [
      ['창세빛 영원 슬라임', 'slime', 'melee', '#f59e0b', '#fef9c3', '#78350f', '#fde047'],
      ['최초의 바람 정령', 'elemental', 'ranged', '#fef08a', '#bae6fd', '#ffffff', '#fde047'],
      ['성기사단 영혼 대장', 'knight', 'charger', '#d97706', '#ffffff', '#38bdf8', '#fde047'],
      ['빛과 어둠의 쌍검귀', 'assassin', 'charger', '#1e1b4b', '#fde047', '#f43f5e', '#facc15'],
      ['창세 분수 성광 골렘', 'golem', 'charger', '#b45309', '#fef9c3', '#38bdf8', '#fde047'],
      ['일곱 별 성좌 대마도사', 'mage', 'ranged', '#ca8a04', '#e0f2fe', '#ffffff', '#fde047'],
      ['황금 바람 창세룡', 'wyvern', 'ranged', '#eab308', '#ffffff', '#38bdf8', '#fef08a'],
      ['고대 신전 석상 가고일', 'gargoyle', 'ranged', '#92400e', '#fef08a', '#38bdf8', '#fbbf24'],
      ['심연 정화 대발키리', 'knight', 'charger', '#f8fafc', '#f59e0b', '#38bdf8', '#fde047'],
      ['천년 연대기 해골성왕', 'skeleton', 'charger', '#fef3c7', '#d97706', '#38bdf8', '#fde047'],
      ['쌍월 융합 영원 서펀트', 'serpent', 'charger', '#d97706', '#c084fc', '#fef08a', '#fde047'],
      ['불멸 수호 켄타우로스', 'centaur', 'charger', '#b45309', '#fef08a', '#ffffff', '#fbbf24'],
      ['바람 여신 신전 미믹', 'mimic', 'melee', '#ca8a04', '#ffffff', '#38bdf8', '#fde047'],
      ['창세수 에르드라 엔트', 'treant', 'melee', '#78350f', '#fef08a', '#38bdf8', '#fde047'],
      ['영원 황혼의 그림자귀', 'assassin', 'charger', '#4c1d95', '#fde047', '#ffffff', '#c084fc'],
      ['신화 전야 황금 대거미', 'spider', 'melee', '#854d0e', '#fef08a', '#38bdf8', '#fbbf24'],
      ['영원의 빛 성광 해파리', 'jelly', 'ranged', '#fde047', '#ffffff', '#38bdf8', '#fef08a'],
      ['황금 꽃잎 영원 버섯령', 'mushroom', 'ranged', '#d97706', '#fef9c3', '#4ade80', '#fde047'],
      ['성역 수호 황금 야수왕', 'beast', 'charger', '#b45309', '#fef08a', '#ef4444', '#fbbf24'],
      ['솔티아 코어 대천사', 'knight', 'charger', '#fef08a', '#38bdf8', '#ffffff', '#fde047']
    ]
  };

  // 10 Unique Continent Apex Bosses (1 per Continent)
  const APEX_BOSSES = [
    { cid: 1, id: 'apex_c1', name: '초원 대군주 그로토스', shape: 'titan', body: '#15803d', accent: '#fde047', eye: '#ef4444', aura: '#4ade80' },
    { cid: 2, id: 'apex_c2', name: '심해 황제 레비아탄', shape: 'serpent', body: '#0369a1', accent: '#67e8f9', eye: '#fde047', aura: '#38bdf8' },
    { cid: 3, id: 'apex_c3', name: '칼데라 화염신 불카누스', shape: 'titan', body: '#991b1b', accent: '#fb923c', eye: '#fef08a', aura: '#f97316' },
    { cid: 4, id: 'apex_c4', name: '절대영도 빙제 글라키에스', shape: 'titan', body: '#1d4ed8', accent: '#e0f2fe', eye: '#ffffff', aura: '#7dd3fc' },
    { cid: 5, id: 'apex_c5', name: '태양신 대리자 아누비스-라', shape: 'titan', body: '#b45309', accent: '#fef08a', eye: '#38bdf8', aura: '#fbbf24' },
    { cid: 6, id: 'apex_c6', name: '천공 대집정관 세라피엘', shape: 'wyvern', body: '#e0f2fe', accent: '#facc15', eye: '#0284c7', aura: '#fde047' },
    { cid: 7, id: 'apex_c7', name: '월식 대마녀 모르가나', shape: 'mage', body: '#4c1d95', accent: '#34d399', eye: '#fde047', aura: '#c084fc' },
    { cid: 8, id: 'apex_c8', name: '태고룡 황제 바하무트-렉스', shape: 'wyvern', body: '#9f1239', accent: '#fde047', eye: '#ffffff', aura: '#fb7185' },
    { cid: 9, id: 'apex_c9', name: '시공 직조군주 크로노스', shape: 'titan', body: '#312e81', accent: '#7dd3fc', eye: '#fde047', aura: '#818cf8' },
    { cid: 10, id: 'apex_c10', name: '영원의 창세신 솔티아-프라임', shape: 'titan', body: '#ca8a04', accent: '#ffffff', eye: '#38bdf8', aura: '#fde047' }
  ];

  // Register all 200 regular/elite species + 10 apex bosses into DATA.MONSTERS
  const contMobIds = {};
  for (let cid = 1; cid <= 10; cid++) {
    const cont = DATA.CONTINENTS[cid - 1];
    const list = CONT_SPECIES[cid] || [];
    contMobIds[cid] = [];
    list.forEach((entry, idx) => {
      const [name, shape, ai, body, accent, eye, aura] = entry;
      const id = `m_c${cid}_${idx + 1}`;
      const baseLv = Math.max(2, (cid - 1) * 14 + Math.floor(idx * 0.75) + 2);
      const hp = Math.round(70 + baseLv * 24 + (shape === 'golem' || shape === 'treant' ? 40 : 0));
      const atk = Math.round(10 + baseLv * 2.1 + (shape === 'assassin' || shape === 'wyvern' ? 4 : 0));
      const def = Math.round(2 + baseLv * 0.65 + (shape === 'knight' || shape === 'golem' ? 4 : 0));
      const exp = Math.round(30 + baseLv * 11);
      const gMin = Math.round(14 + baseLv * 5.2);
      const gMax = Math.round(gMin * 1.45);
      const speed = ai === 'charger' ? 70 : (ai === 'ranged' ? 54 : 62);
      const drops = [
        { id: cont.matId, rate: 0.42 },
        { id: idx % 3 === 0 ? 'mat_enhance' : (idx % 2 === 0 ? 'pot_hp_m' : 'pot_mp_m'), rate: 0.2 }
      ];
      if (cont.bonusMatId && idx >= 12) drops.push({ id: cont.bonusMatId, rate: 0.25 });

      DATA.MONSTERS[id] = {
        id, name, lv: baseLv, hp, atk, def, exp, gold: [gMin, gMax],
        speed, ai, aggro: ai === 'ranged' ? 200 : 175,
        size: (shape === 'golem' || shape === 'wyvern' || shape === 'treant' || shape === 'centaur') ? 28 : 24,
        projColor: aura,
        drops,
        visual: { shape, body, accent, eye, aura, isBoss: false }
      };
      contMobIds[cid].push(id);
    });
  }

  APEX_BOSSES.forEach((b) => {
    const cont = DATA.CONTINENTS[b.cid - 1];
    const baseLv = b.cid * 15;
    const drops = [
      { id: cont.matId, rate: 1.0 },
      { id: 'mat_enhance', rate: 1.0 }
    ];
    if (cont.bonusMatId) drops.push({ id: cont.bonusMatId, rate: 0.9 });
    DATA.MONSTERS[b.id] = {
      id: b.id, name: b.name, lv: baseLv,
      hp: Math.round(920 + b.cid * 260),
      atk: Math.round(38 + b.cid * 10),
      def: Math.round(14 + b.cid * 3.5),
      exp: Math.round(450 + b.cid * 180),
      gold: [Math.round(320 + b.cid * 120), Math.round(480 + b.cid * 160)],
      speed: 72, ai: 'boss', aggro: 245, size: 36, isBoss: true,
      projColor: b.aura,
      drops,
      visual: { shape: b.shape, body: b.body, accent: b.accent, eye: b.eye, aura: b.aura, isBoss: true }
    };
  });

  // Wire all 200 new species + 10 apex bosses into Continents and Zones (zone_1 ~ zone_200)!
  for (let cid = 1; cid <= 10; cid++) {
    const cont = DATA.CONTINENTS[cid - 1];
    const apex = APEX_BOSSES[cid - 1];
    cont.mobs = contMobIds[cid].slice();
    cont.bosses = [apex.id, ...(cont.bosses || [])];
  }

  // Re-populate each zone's spawns with sliding windows of its continent's 20 unique monsters
  // so every single zone feels fresh and distinct!
  for (let z = 1; z <= 200; z++) {
    const m = DATA.MAPS[`zone_${z}`];
    if (!m || !m.continentId) continue;
    const cid = m.continentId;
    const localIdx = (z - 1) % 20;
    const speciesList = contMobIds[cid];
    const apex = APEX_BOSSES[cid - 1];
    if (!speciesList || speciesList.length < 20) continue;

    const spawnPts = [
      [5.5, 5.5], [18.5, 5.5], [5.5, 11.5], [18.5, 11.5], [11.5, 8.5], [8.5, 6.5], [15.5, 11.5]
    ];
    const mobCount = m.isBossZone ? 4 : (4 + (z % 3));
    const newSpawns = [];
    for (let i = 0; i < mobCount; i++) {
      const pt = spawnPts[i % spawnPts.length];
      // Each zone showcases its signature species + neighbors so all 200 monsters appear naturally!
      const spIdx = (localIdx + i * 3) % 20;
      newSpawns.push({ type: speciesList[spIdx], tx: pt[0], ty: pt[1] });
    }
    if (m.isBossZone) {
      const bossType = (localIdx % 10 === 9) ? apex.id : ((localIdx % 10 === 4) ? apex.id : DATA.CONTINENTS[cid - 1].bosses[0]);
      newSpawns.push({
        type: bossType,
        tx: 11.5, ty: 5.5,
        isZoneBoss: true,
        customName: m.zoneBossName,
        customLv: m.recLv + 3
      });
    }
    m.spawns = newSpawns;
  }

  // Also update Ch.21..200 kill_any quest targets to accept the continent's new 20 species
  for (let idx = 20; idx < (DATA.QUESTS || []).length; idx++) {
    const q = DATA.QUESTS[idx];
    if (!q || !q.targetMap) continue;
    const zMap = DATA.MAPS[q.targetMap];
    if (!zMap || !zMap.continentId) continue;
    if (q.type === 'kill_any') {
      q.targets = contMobIds[zMap.continentId].slice();
    } else if (q.type === 'boss_hunt') {
      q.targets = DATA.CONTINENTS[zMap.continentId - 1].bosses.slice();
    }
  }

  // Enrich classic starter maps with 2-3 biome-matched new species on verified walkable tiles
  const classicBonus = {
    meadow: ['m_c1_1', 'm_c1_5', 'm_c1_12'],
    coast: ['m_c2_1', 'm_c2_4', 'm_c2_9'],
    forest: ['m_c1_6', 'm_c1_7', 'm_c7_3'],
    ruins: ['m_c5_3', 'm_c5_8', 'm_c5_12'],
    volcano: ['m_c3_1', 'm_c3_4', 'm_c3_9'],
    citadel: ['m_c9_1', 'm_c9_5', 'm_c9_11']
  };
  const WALK_CHARS = new Set(['.', ',', ';', 's', 'p', 'c', 'f']);
  Object.entries(classicBonus).forEach(([mapId, extraIds]) => {
    const cm = DATA.MAPS[mapId];
    if (!cm || !cm.layout || !cm.spawns) return;
    const candidates = [[12, 4], [14, 13], [7, 10], [17, 8], [10, 12], [15, 5]];
    let added = 0;
    for (let i = 0; i < candidates.length && added < extraIds.length; i++) {
      const [cx, cy] = candidates[i];
      const ch = cm.layout[cy] && cm.layout[cy][cx];
      if (!WALK_CHARS.has(ch)) continue;
      if (cm.spawns.some((s) => Math.hypot(s.tx - (cx + 0.5), s.ty - (cy + 0.5)) < 2.2)) continue;
      const mid = extraIds[added];
      if (DATA.MONSTERS[mid]) {
        cm.spawns.push({ type: mid, tx: cx + 0.5, ty: cy + 0.5 });
        added++;
      }
    }
  });

  // ===========================================================================
  // HD PAINTED PROCEDURAL MONSTER SPRITE GENERATOR (LAZY-CACHED, 96x96 × 2F)
  // ===========================================================================
  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  function mixHex(hex, targetHex, t) {
    const parse = (h) => {
      const s = (h || '#888888').replace('#', '');
      return [parseInt(s.slice(0, 2), 16) || 0, parseInt(s.slice(2, 4), 16) || 0, parseInt(s.slice(4, 6), 16) || 0];
    };
    const a = parse(hex), b = parse(targetHex);
    const r = Math.round(a[0] + (b[0] - a[0]) * t);
    const g = Math.round(a[1] + (b[1] - a[1]) * t);
    const bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return `rgb(${r},${g},${bl})`;
  }

  function renderMonsterFrame(v, f) {
    const S = 96;
    const c = makeCanvas(S, S);
    const ctx = c.getContext('2d');
    const bob = f ? -3.2 : 0;
    const wingY = f ? -8 : 4;
    const stride = f ? 4.2 : -4.2;
    const { shape, body, accent, eye, aura, isBoss } = v;

    const hi = mixHex(body, '#ffffff', 0.36);
    const lo = mixHex(body, '#090d1a', 0.48);
    const accHi = mixHex(accent, '#ffffff', 0.38);
    const accLo = mixHex(accent, '#090d1a', 0.42);
    const outline = mixHex(body, '#050814', 0.78);

    const lin3 = (x0, y0, x1, y1, c0, c1, c2) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, c0); g.addColorStop(0.5, c1); g.addColorStop(1, c2);
      return g;
    };
    const rad3 = (x, y, r, c0, c1, c2) => {
      const g = ctx.createRadialGradient(x - r * 0.28, y - r * 0.28, r * 0.08, x, y, r);
      g.addColorStop(0, c0); g.addColorStop(0.55, c1); g.addColorStop(1, c2);
      return g;
    };

    // Soft ambient mystical aura behind bosses & magical archetypes
    if (isBoss || shape === 'elemental' || shape === 'jelly' || shape === 'mage' || shape === 'titan') {
      const ag = ctx.createRadialGradient(48, 50 + bob, 5, 48, 50 + bob, isBoss ? 44 : 36);
      ag.addColorStop(0, aura + '66');
      ag.addColorStop(0.6, aura + '22');
      ag.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ag;
      ctx.beginPath(); ctx.arc(48, 50 + bob, isBoss ? 44 : 36, 0, Math.PI * 2); ctx.fill();
    }

    // Soft layered ground shadow
    ctx.fillStyle = 'rgba(5, 8, 18, 0.42)';
    ctx.beginPath(); ctx.ellipse(48, 84, isBoss ? 30 : 22, 7.5, 0, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.translate(0, bob);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.0;

    const drawEyes = (lx, rx, ey, r = 3.2, fierce = false) => {
      ctx.save();
      ctx.shadowColor = eye; ctx.shadowBlur = 6;
      if (fierce) {
        // Sharp glowing predator/warrior eyes
        ctx.fillStyle = eye;
        ctx.beginPath(); ctx.moveTo(lx - r * 1.4, ey - r * 0.6); ctx.lineTo(lx + r * 1.1, ey + r * 0.2); ctx.lineTo(lx - r * 0.4, ey + r * 0.8); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(rx + r * 1.4, ey - r * 0.6); ctx.lineTo(rx - r * 1.1, ey + r * 0.2); ctx.lineTo(rx + r * 0.4, ey + r * 0.8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(lx, ey, r * 0.36, 0, Math.PI * 2); ctx.arc(rx, ey, r * 0.36, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = '#070a14';
        ctx.beginPath(); ctx.arc(lx, ey, r + 1.1, 0, Math.PI * 2); ctx.arc(rx, ey, r + 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = eye;
        ctx.beginPath(); ctx.arc(lx, ey, r, 0, Math.PI * 2); ctx.arc(rx, ey, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(lx - 1.0, ey - 1.1, r * 0.4, 0, Math.PI * 2); ctx.arc(rx - 1.0, ey - 1.1, r * 0.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    };

    const drawCrown = (cy) => {
      ctx.save();
      ctx.fillStyle = lin3(34, cy - 16, 62, cy, '#fef9c3', '#f59e0b', '#92400e');
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(35, cy); ctx.lineTo(37, cy - 12); ctx.lineTo(43, cy - 5);
      ctx.lineTo(48, cy - 15); ctx.lineTo(53, cy - 5); ctx.lineTo(59, cy - 12);
      ctx.lineTo(61, cy); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(48, cy - 4, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    if (shape === 'slime') {
      // Translucent jewel-like RPG slime with inner core & glossy highlight
      ctx.fillStyle = rad3(48, 54, 34, accHi, body, lo);
      ctx.beginPath();
      ctx.moveTo(16, 74);
      ctx.bezierCurveTo(13, 44, 28, 25, 48, 25);
      ctx.bezierCurveTo(68, 25, 83, 44, 80, 74);
      ctx.quadraticCurveTo(48, 84, 16, 74);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Inner luminous nucleus
      ctx.fillStyle = aura + '55';
      ctx.beginPath(); ctx.ellipse(48, 58, 16, 11, 0, 0, Math.PI * 2); ctx.fill();
      // Glossy specular crescent
      ctx.fillStyle = 'rgba(255,255,255,0.58)';
      ctx.beginPath(); ctx.ellipse(34, 39, 9.5, 4.6, -0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(27, 48, 2.4, 0, Math.PI * 2); ctx.fill();
      drawEyes(39, 57, 56, 3.5);
    } else if (shape === 'beast') {
      // Dynamic predatory wolf/boar/sphinx quadruped with shaggy mane & fangs
      // Sweeping tail
      ctx.strokeStyle = lo; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(70, 56); ctx.quadraticCurveTo(86, 44 + wingY * 0.4, 80, 32); ctx.stroke();
      ctx.strokeStyle = outline; ctx.lineWidth = 2.0;
      // Muscular shaded legs
      ctx.fillStyle = lin3(26, 56, 26, 80, body, lo, '#090d1a');
      ctx.beginPath(); ctx.roundRect(25 + stride * 0.5, 60, 11, 20, 5); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(60 - stride * 0.5, 60, 11, 20, 5); ctx.fill(); ctx.stroke();
      // Torso
      ctx.fillStyle = rad3(48, 56, 28, hi, body, lo);
      ctx.beginPath(); ctx.ellipse(48, 57, 27, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // Layered spiked mane
      ctx.fillStyle = lin3(48, 28, 48, 62, accHi, accent, accLo);
      ctx.beginPath();
      ctx.moveTo(22, 46); ctx.lineTo(28, 30); ctx.lineTo(38, 36); ctx.lineTo(48, 24);
      ctx.lineTo(58, 36); ctx.lineTo(68, 30); ctx.lineTo(74, 46);
      ctx.quadraticCurveTo(48, 66, 22, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Swept curved horns / pointed ears
      ctx.fillStyle = lin3(20, 16, 36, 36, '#fffbeb', accent, lo);
      ctx.beginPath(); ctx.moveTo(32, 37); ctx.quadraticCurveTo(18, 26, 22, 14); ctx.lineTo(38, 31); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(64, 37); ctx.quadraticCurveTo(78, 26, 74, 14); ctx.lineTo(58, 31); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Sculpted beast snout & head
      ctx.fillStyle = rad3(48, 46, 18, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(32, 44); ctx.quadraticCurveTo(48, 28, 64, 44); ctx.lineTo(58, 60); ctx.quadraticCurveTo(48, 65, 38, 60); ctx.closePath(); ctx.fill(); ctx.stroke();
      drawEyes(41, 55, 45, 3.2, true);
      // Gleaming fangs
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(40, 56); ctx.lineTo(42.5, 63); ctx.lineTo(45, 56); ctx.fill();
      ctx.beginPath(); ctx.moveTo(51, 56); ctx.lineTo(53.5, 63); ctx.lineTo(56, 56); ctx.fill();
    } else if (shape === 'wyvern') {
      // Sculpted winged dragon / sky griffin with shaded wing membranes & armored chest
      const wingGradL = lin3(8, 22, 46, 58, accHi, accent, lo);
      const wingGradR = lin3(88, 22, 50, 58, accHi, accent, lo);
      ctx.fillStyle = wingGradL;
      ctx.beginPath();
      ctx.moveTo(44, 48); ctx.quadraticCurveTo(24, 16 + wingY, 6, 30 + wingY);
      ctx.quadraticCurveTo(14, 46 + wingY * 0.5, 22, 56 + wingY * 0.4);
      ctx.quadraticCurveTo(32, 50, 42, 58); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = wingGradR;
      ctx.beginPath();
      ctx.moveTo(52, 48); ctx.quadraticCurveTo(72, 16 + wingY, 90, 30 + wingY);
      ctx.quadraticCurveTo(82, 46 + wingY * 0.5, 74, 56 + wingY * 0.4);
      ctx.quadraticCurveTo(64, 50, 54, 58); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Spiked tail
      ctx.strokeStyle = lo; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(48, 68); ctx.quadraticCurveTo(68, 76, 78, 68); ctx.stroke();
      ctx.strokeStyle = outline; ctx.lineWidth = 2.0;
      // Scaled torso + belly plates
      ctx.fillStyle = rad3(48, 56, 20, hi, body, lo);
      ctx.beginPath(); ctx.ellipse(48, 56, 15, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accHi;
      ctx.beginPath(); ctx.ellipse(48, 58, 7.5, 12, 0, 0, Math.PI * 2); ctx.fill();
      // Swept dragon horns + armored crest head
      ctx.fillStyle = lin3(30, 12, 44, 28, '#fef3c7', accent, lo);
      ctx.beginPath(); ctx.moveTo(39, 30); ctx.lineTo(28, 12); ctx.lineTo(44, 25); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(57, 30); ctx.lineTo(68, 12); ctx.lineTo(52, 25); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rad3(48, 34, 15, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(34, 33); ctx.quadraticCurveTo(48, 19, 62, 33); ctx.lineTo(54, 46); ctx.lineTo(42, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
      drawEyes(42, 54, 33, 3.1, true);
    } else if (shape === 'golem' || shape === 'titan') {
      // Faceted crystalline / armored Fantasy Colossus with jagged pauldrons & floating rune shards!
      const sc = shape === 'titan' ? 1.08 : 1.0;
      ctx.save(); ctx.translate(48, 52); ctx.scale(sc, sc); ctx.translate(-48, -52);
      // Floating shoulder rune crystals
      ctx.fillStyle = lin3(16, 16, 24, 32, '#ffffff', aura, body);
      ctx.beginPath(); ctx.moveTo(18, 16 + wingY * 0.4); ctx.lineTo(24, 25 + wingY * 0.4); ctx.lineTo(18, 34 + wingY * 0.4); ctx.lineTo(12, 25 + wingY * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(78, 16 - wingY * 0.4); ctx.lineTo(84, 25 - wingY * 0.4); ctx.lineTo(78, 34 - wingY * 0.4); ctx.lineTo(72, 25 - wingY * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Heavy armored legs
      ctx.fillStyle = lin3(30, 62, 30, 82, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(30, 64); ctx.lineTo(42, 64); ctx.lineTo(40, 81); ctx.lineTo(27, 81); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(54, 64); ctx.lineTo(66, 64); ctx.lineTo(69, 81); ctx.lineTo(56, 81); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Tapered V-shaped faceted colossus torso
      ctx.fillStyle = lin3(24, 32, 72, 68, hi, body, lo);
      ctx.beginPath();
      ctx.moveTo(22, 36); ctx.lineTo(48, 28); ctx.lineTo(74, 36);
      ctx.lineTo(64, 68); ctx.lineTo(48, 72); ctx.lineTo(32, 68);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Jagged sculpted shoulder pauldrons & tapered gauntlets
      ctx.fillStyle = lin3(10, 32, 28, 66, accHi, accent, lo);
      ctx.beginPath();
      ctx.moveTo(26, 36); ctx.lineTo(10, 30 + stride * 0.4); ctx.lineTo(8, 56 + stride * 0.5);
      ctx.lineTo(18, 68 + stride * 0.5); ctx.lineTo(26, 56 + stride * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(70, 36); ctx.lineTo(86, 30 - stride * 0.4); ctx.lineTo(88, 56 - stride * 0.5);
      ctx.lineTo(78, 68 - stride * 0.5); ctx.lineTo(70, 56 - stride * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Glowing runic energy core & chest fissures
      ctx.save();
      ctx.shadowColor = aura; ctx.shadowBlur = 10;
      ctx.fillStyle = rad3(48, 50, 12, '#ffffff', aura, accent);
      ctx.beginPath(); ctx.moveTo(48, 39); ctx.lineTo(56, 50); ctx.lineTo(48, 61); ctx.lineTo(40, 50); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = aura; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(40, 50); ctx.lineTo(30, 44); ctx.moveTo(56, 50); ctx.lineTo(66, 44); ctx.stroke();
      ctx.restore();
      // Horned crystalline visor helm
      ctx.fillStyle = lin3(34, 16, 62, 38, hi, body, lo);
      ctx.beginPath();
      ctx.moveTo(35, 34); ctx.lineTo(33, 21); ctx.lineTo(48, 14); ctx.lineTo(63, 21); ctx.lineTo(61, 34); ctx.lineTo(48, 38);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Dark visor slit + glowing eyes
      ctx.fillStyle = '#070a14';
      ctx.beginPath(); ctx.roundRect(38, 24, 20, 6.5, 3); ctx.fill();
      drawEyes(43, 53, 27.2, 2.5, true);
      ctx.restore();
    } else if (shape === 'crab') {
      // Armored sea/crystal crab with gleaming pincers & faceted shell
      ctx.strokeStyle = lo; ctx.lineWidth = 3.2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.moveTo(32, 58 + i * 6); ctx.lineTo(14, 66 + i * 6 + stride * 0.4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(64, 58 + i * 6); ctx.lineTo(82, 66 + i * 6 - stride * 0.4); ctx.stroke();
      }
      ctx.strokeStyle = outline; ctx.lineWidth = 2.0;
      ctx.fillStyle = rad3(20, 38, 14, accHi, accent, lo);
      ctx.beginPath(); ctx.arc(20, 38 + wingY * 0.4, 12.5, 0.35, Math.PI * 1.85); ctx.lineTo(20, 38 + wingY * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rad3(76, 38, 14, accHi, accent, lo);
      ctx.beginPath(); ctx.arc(76, 38 + wingY * 0.4, 12.5, -0.35, Math.PI * 1.4, true); ctx.lineTo(76, 38 + wingY * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rad3(48, 55, 26, hi, body, lo);
      ctx.beginPath(); ctx.ellipse(48, 56, 24, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath(); ctx.ellipse(40, 48, 9, 4.5, -0.35, 0, Math.PI * 2); ctx.fill();
      drawEyes(40, 56, 48, 3.2);
    } else if (shape === 'spider') {
      ctx.strokeStyle = lo; ctx.lineWidth = 3.0;
      for (let i = 0; i < 4; i++) {
        const dy = -12 + i * 9;
        const wiggle = (i % 2 === 0 ? stride : -stride) * 0.6;
        ctx.beginPath(); ctx.moveTo(36, 52 + dy * 0.5); ctx.lineTo(17, 42 + dy + wiggle); ctx.lineTo(9, 62 + dy + wiggle); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(60, 52 + dy * 0.5); ctx.lineTo(79, 42 + dy - wiggle); ctx.lineTo(87, 62 + dy - wiggle); ctx.stroke();
      }
      ctx.strokeStyle = outline; ctx.lineWidth = 2.0;
      ctx.fillStyle = rad3(48, 42, 19, hi, body, lo);
      ctx.beginPath(); ctx.ellipse(48, 43, 18, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = aura;
      ctx.beginPath(); ctx.moveTo(48, 32); ctx.lineTo(54, 41); ctx.lineTo(48, 50); ctx.lineTo(42, 41); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rad3(48, 60, 14, hi, body, lo);
      ctx.beginPath(); ctx.arc(48, 60, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawEyes(42, 54, 60, 2.9, true);
      ctx.fillStyle = eye; ctx.beginPath(); ctx.arc(48, 56, 2.0, 0, Math.PI * 2); ctx.fill();
    } else if (shape === 'mushroom') {
      ctx.fillStyle = lin3(34, 48, 62, 78, '#fffdf7', '#e7dfd0', '#a89f91');
      ctx.beginPath(); ctx.roundRect(35, 48, 26, 30, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rad3(44, 34, 34, accHi, body, lo);
      ctx.beginPath(); ctx.arc(48, 48, 32, Math.PI, Math.PI * 2); ctx.quadraticCurveTo(48, 57, 16, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accHi;
      [[33, 34, 5.2], [59, 30, 6], [48, 22, 4.2]].forEach(([sx, sy, sr]) => { ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); });
      drawEyes(42, 54, 61, 2.9);
    } else if (shape === 'elemental') {
      // Radiant arcane elemental with orbiting crystal shards & swirling energy ring
      ctx.save();
      ctx.strokeStyle = aura + '99'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(48, 54, 30, 10, f ? 0.15 : -0.15, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i + (f ? 0.45 : 0);
        const sx = 48 + Math.cos(a) * 29, sy = 50 + Math.sin(a) * 18;
        ctx.fillStyle = lin3(sx, sy - 8, sx, sy + 8, '#ffffff', aura, body);
        ctx.beginPath(); ctx.moveTo(sx, sy - 8); ctx.lineTo(sx + 5, sy); ctx.lineTo(sx, sy + 8); ctx.lineTo(sx - 5, sy); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = rad3(48, 48, 23, '#ffffff', accent, body);
      ctx.beginPath(); ctx.moveTo(48, 22); ctx.quadraticCurveTo(72, 34, 68, 56); ctx.quadraticCurveTo(48, 76, 28, 56); ctx.quadraticCurveTo(24, 34, 48, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
      drawEyes(41, 55, 48, 3.2, true);
    } else if (shape === 'jelly') {
      ctx.strokeStyle = accHi; ctx.lineWidth = 3.2;
      for (let i = -2; i <= 2; i++) {
        const tx = 48 + i * 8.5;
        ctx.beginPath(); ctx.moveTo(tx, 52); ctx.quadraticCurveTo(tx + (i % 2 ? stride : -stride), 66, tx, 81); ctx.stroke();
      }
      ctx.strokeStyle = outline; ctx.lineWidth = 2.0;
      ctx.fillStyle = rad3(46, 36, 28, '#ffffff', accHi, body);
      ctx.beginPath(); ctx.arc(48, 48, 25, Math.PI, Math.PI * 2); ctx.quadraticCurveTo(48, 59, 23, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
      drawEyes(40, 56, 42, 3.0);
    } else if (shape === 'serpent') {
      ctx.strokeStyle = outline; ctx.lineWidth = 17;
      ctx.beginPath(); ctx.moveTo(22, 74); ctx.bezierCurveTo(20, 54, 76, 62, 68, 42); ctx.bezierCurveTo(64, 28, 40, 24, 46, 36); ctx.stroke();
      ctx.strokeStyle = lin3(22, 74, 68, 28, lo, body, hi); ctx.lineWidth = 13; ctx.stroke();
      ctx.strokeStyle = accHi; ctx.lineWidth = 3.6; ctx.setLineDash([5, 6]); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = outline; ctx.lineWidth = 2.0;
      ctx.fillStyle = rad3(46, 34, 16, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(31, 33); ctx.quadraticCurveTo(46, 18, 62, 33); ctx.lineTo(54, 46); ctx.lineTo(38, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
      drawEyes(40, 52, 32, 3.1, true);
    } else if (shape === 'treant') {
      ctx.fillStyle = lin3(30, 44, 66, 80, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(30, 81); ctx.lineTo(36, 44); ctx.lineTo(60, 44); ctx.lineTo(66, 81); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = lo; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(36, 52); ctx.lineTo(14, 38 + stride); ctx.moveTo(60, 52); ctx.lineTo(82, 38 - stride); ctx.stroke();
      ctx.strokeStyle = outline; ctx.lineWidth = 2.0;
      ctx.fillStyle = rad3(48, 26, 26, accHi, accent, accLo);
      ctx.beginPath(); ctx.arc(33, 34, 16, 0, Math.PI * 2); ctx.arc(63, 34, 16, 0, Math.PI * 2); ctx.arc(48, 23, 20, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = accLo; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(48, 28, 24, Math.PI * 0.9, Math.PI * 2.1); ctx.stroke();
      drawEyes(42, 54, 56, 3.1, true);
    } else if (shape === 'mimic') {
      ctx.fillStyle = lin3(22, 46, 74, 78, hi, body, lo);
      ctx.beginPath(); ctx.roundRect(22, 46, 52, 32, 6); ctx.fill(); ctx.stroke();
      // Gold chest straps
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(30, 46, 6, 32); ctx.fillRect(60, 46, 6, 32);
      ctx.fillStyle = lin3(20, 22, 76, 44, accHi, accent, accLo);
      ctx.beginPath(); ctx.roundRect(20, 24 + (f ? -4 : 2), 56, 20, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      for (let tx = 28; tx <= 64; tx += 9) {
        ctx.beginPath(); ctx.moveTo(tx, 46); ctx.lineTo(tx + 4, 53); ctx.lineTo(tx + 8, 46); ctx.fill();
      }
      ctx.fillStyle = '#fb7185';
      ctx.beginPath(); ctx.ellipse(48, 60 + (f ? 3 : 0), 10, 6, 0, 0, Math.PI * 2); ctx.fill();
      drawEyes(38, 58, 35, 3.1, true);
    } else if (shape === 'gargoyle') {
      ctx.fillStyle = lin3(10, 20, 46, 56, accHi, accent, lo);
      ctx.beginPath(); ctx.moveTo(46, 46); ctx.lineTo(8, 22 + wingY); ctx.lineTo(18, 56); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(50, 46); ctx.lineTo(88, 22 + wingY); ctx.lineTo(78, 56); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lin3(34, 40, 62, 76, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(34, 42); ctx.lineTo(62, 42); ctx.lineTo(56, 74); ctx.lineTo(40, 74); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rad3(48, 31, 14, hi, body, lo);
      ctx.beginPath(); ctx.arc(48, 31, 13.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // Gargoyle horns
      ctx.fillStyle = accHi;
      ctx.beginPath(); ctx.moveTo(38, 24); ctx.lineTo(31, 11); ctx.lineTo(44, 21); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(58, 24); ctx.lineTo(65, 11); ctx.lineTo(52, 21); ctx.closePath(); ctx.fill(); ctx.stroke();
      drawEyes(42, 54, 31, 3.0, true);
    } else if (shape === 'centaur') {
      ctx.fillStyle = lin3(28, 60, 28, 82, hi, body, lo);
      ctx.beginPath(); ctx.roundRect(27 + stride * 0.5, 62, 8, 19, 3); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(59 - stride * 0.5, 62, 8, 19, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rad3(48, 57, 24, hi, body, lo);
      ctx.beginPath(); ctx.ellipse(48, 58, 24, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lin3(36, 30, 60, 54, accHi, accent, accLo);
      ctx.beginPath(); ctx.moveTo(36, 31); ctx.lineTo(60, 31); ctx.lineTo(55, 53); ctx.lineTo(41, 53); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Gleaming halberd / spear
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(72, 74); ctx.lineTo(78, 18); ctx.stroke();
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath(); ctx.moveTo(78, 8); ctx.lineTo(84, 22); ctx.lineTo(73, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rad3(48, 23, 12, hi, body, lo);
      ctx.beginPath(); ctx.arc(48, 23, 11.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawEyes(43, 53, 23, 2.7, true);
    } else if (shape === 'assassin') {
      // Dynamic Shadow-Cloaked Assassin / Predator Stalker with twin curved daggers & scarf!
      // Billowing tattered shadow cloak
      ctx.fillStyle = lin3(24, 36, 76, 80, body, lo, '#060812');
      ctx.beginPath();
      ctx.moveTo(34, 38); ctx.lineTo(16, 76 + stride * 0.4); ctx.lineTo(34, 70);
      ctx.lineTo(48, 79); ctx.lineTo(62, 70); ctx.lineTo(80, 76 - stride * 0.4); ctx.lineTo(62, 38);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Flowing scarf
      ctx.fillStyle = lin3(52, 36, 86, 46, accHi, accent, accLo);
      ctx.beginPath(); ctx.moveTo(52, 38); ctx.quadraticCurveTo(72, 32 + wingY * 0.5, 86, 42 + wingY * 0.6);
      ctx.quadraticCurveTo(72, 48 + wingY * 0.4, 52, 44); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Agile armored vest
      ctx.fillStyle = lin3(36, 40, 60, 68, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(35, 40); ctx.lineTo(61, 40); ctx.lineTo(56, 68); ctx.lineTo(40, 68); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Twin gleaming curved daggers + slash glint
      ctx.save();
      ctx.strokeStyle = aura; ctx.lineWidth = 2.6; ctx.shadowColor = aura; ctx.shadowBlur = 7;
      ctx.beginPath(); ctx.moveTo(30, 56); ctx.quadraticCurveTo(14, 48 + stride, 18, 32 + stride); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(66, 56); ctx.quadraticCurveTo(82, 48 - stride, 78, 32 - stride); ctx.stroke();
      ctx.restore();
      // Pointed assassin hood with shadowed face & glowing predator eyes
      ctx.fillStyle = lin3(32, 14, 64, 42, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(30, 38); ctx.quadraticCurveTo(34, 16, 48, 12); ctx.quadraticCurveTo(62, 16, 66, 38); ctx.quadraticCurveTo(48, 44, 30, 38); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#070a14';
      ctx.beginPath(); ctx.ellipse(48, 31, 11, 8.5, 0, 0, Math.PI * 2); ctx.fill();
      drawEyes(43, 53, 31, 2.9, true);
    } else if (shape === 'knight') {
      // Sculpted Fantasy Paladin / Dark Knight with winged helm, shield & glowing runeblade
      // Flowing royal cape
      ctx.fillStyle = lin3(24, 38, 72, 80, accHi, accent, accLo);
      ctx.beginPath(); ctx.moveTo(32, 40); ctx.lineTo(18, 78); ctx.lineTo(78, 78); ctx.lineTo(64, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Greaves
      ctx.fillStyle = lo;
      ctx.beginPath(); ctx.roundRect(36, 66, 9, 15, 3); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(51, 66, 9, 15, 3); ctx.fill(); ctx.stroke();
      // V-tapered plate cuirass + pauldrons
      ctx.fillStyle = lin3(32, 38, 64, 68, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(30, 40); ctx.lineTo(66, 40); ctx.lineTo(58, 68); ctx.lineTo(38, 68); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Kite shield (left)
      ctx.fillStyle = lin3(16, 44, 34, 70, accHi, accent, lo);
      ctx.beginPath(); ctx.moveTo(16, 44); ctx.lineTo(34, 44); ctx.lineTo(32, 62); ctx.lineTo(25, 72); ctx.lineTo(18, 62); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Enchanted broadsword (right)
      ctx.save();
      ctx.strokeStyle = aura; ctx.lineWidth = 4.2; ctx.shadowColor = aura; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(70, 58); ctx.lineTo(80, 18 + stride * 0.6); ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(70, 58); ctx.lineTo(80, 18 + stride * 0.6); ctx.stroke();
      ctx.restore();
      // Winged crested knight helm
      ctx.fillStyle = lin3(34, 16, 62, 38, hi, body, lo);
      ctx.beginPath(); ctx.arc(48, 29, 13.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accHi;
      ctx.beginPath(); ctx.moveTo(45, 16); ctx.lineTo(48, 6); ctx.lineTo(55, 16); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#070a14'; ctx.fillRect(38, 26, 20, 5);
      drawEyes(43, 53, 28.5, 2.4, true);
    } else if (shape === 'mage') {
      // Flowing Archmage / Spirit Caster with pointed hat, crystal staff & orbiting spell orb
      ctx.fillStyle = lin3(26, 40, 70, 80, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(34, 40); ctx.lineTo(20, 79); ctx.lineTo(76, 79); ctx.lineTo(62, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Gold/accent arcane stole
      ctx.fillStyle = lin3(42, 40, 54, 78, accHi, accent, accLo);
      ctx.beginPath(); ctx.moveTo(43, 40); ctx.lineTo(53, 40); ctx.lineTo(56, 78); ctx.lineTo(40, 78); ctx.closePath(); ctx.fill();
      // Arcane staff + glowing orb
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.moveTo(72, 74); ctx.lineTo(78, 24 + stride * 0.5); ctx.stroke();
      ctx.save(); ctx.shadowColor = aura; ctx.shadowBlur = 10;
      ctx.fillStyle = rad3(78, 20 + stride * 0.5, 8, '#ffffff', aura, accent);
      ctx.beginPath(); ctx.arc(78, 20 + stride * 0.5, 6.8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      // Shadowed face under brimmed witch/wizard hat
      ctx.fillStyle = '#090d1a';
      ctx.beginPath(); ctx.arc(48, 32, 11.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lin3(26, 8, 70, 28, accHi, accent, lo);
      ctx.beginPath(); ctx.ellipse(48, 26, 22, 5.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(33, 25); ctx.quadraticCurveTo(46, 4, 54, 6); ctx.lineTo(63, 25); ctx.closePath(); ctx.fill(); ctx.stroke();
      drawEyes(43, 53, 33, 2.8, true);
    } else {
      // Skeleton & Goblin detailed silhouettes
      ctx.fillStyle = lin3(32, 42, 64, 76, hi, body, lo);
      ctx.beginPath(); ctx.moveTo(34, 42); ctx.lineTo(62, 42); ctx.lineTo(57, 74); ctx.lineTo(39, 74); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (shape === 'skeleton') {
        // Ribcage bars
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.4;
        [49, 55, 61].forEach((ry) => { ctx.beginPath(); ctx.moveTo(41, ry); ctx.lineTo(55, ry); ctx.stroke(); });
        ctx.strokeStyle = outline; ctx.lineWidth = 2.0;
      }
      // Jagged blade
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3.8;
      ctx.beginPath(); ctx.moveTo(68, 60); ctx.lineTo(79, 26 + stride); ctx.stroke();
      if (shape === 'goblin') {
        ctx.fillStyle = lin3(16, 22, 34, 36, hi, body, lo);
        ctx.beginPath(); ctx.moveTo(34, 29); ctx.lineTo(14, 20); ctx.lineTo(34, 37); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(62, 29); ctx.lineTo(82, 20); ctx.lineTo(62, 37); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = shape === 'skeleton' ? rad3(48, 29, 14, '#ffffff', '#e2e8f0', '#94a3b8') : rad3(48, 30, 14, hi, body, lo);
      ctx.beginPath(); ctx.arc(48, 29, 13.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawEyes(43, 53, 29, 3.0, true);
    }

    if (isBoss) drawCrown(shape === 'golem' || shape === 'titan' ? 16 : 15);
    ctx.restore();
    return c;
  }

  // Expose lazy HD sprite cache helper for all 210+ procedural monsters
  global.HEROES_LORE_MONSTER_ART = {
    cache: {},
    getFrames(typeId) {
      if (this.cache[typeId]) return this.cache[typeId];
      const def = DATA.MONSTERS[typeId];
      if (!def || !def.visual) return null;
      const frames = [renderMonsterFrame(def.visual, 0), renderMonsterFrame(def.visual, 1)];
      this.cache[typeId] = frames;
      return frames;
    }
  };
})(window);
