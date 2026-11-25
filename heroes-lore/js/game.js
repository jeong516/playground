// 영웅서기: 솔티아의 바람 — Polished Action RPG Engine (Zero-Whiff Combat + Retina HUD)
(function (global) {
  'use strict';

  const DATA = global.GAME_DATA;
  const TILE = DATA.TILE_SIZE;
  const SAVE_KEY = 'heroes_lore_soltia_save_v1';

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

  // Crisp inline SVG icon library (zero system emojis in game HUD/controls)
  const SVG = {
    sword:    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/></svg>',
    chat:     '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    chest:    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 12h18"/><path d="M10 12v3h4v-3"/></svg>',
    heal:     '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    cone:     '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/></svg>',
    aoe:      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M21 12a9 9 0 1 1-6.2-8.56"/><polyline points="21 3 21 9 15 9"/></svg>',
    buff_def: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    pillars:  '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><polygon points="12 2 15 9 22 9 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9 9 9 12 2"/></svg>',
    lunge:    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M5 19 19 5"/><polyline points="9 5 19 5 19 15"/></svg>',
    projectile:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
    buff_spd: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    flurry:   '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M4 20 20 4"/><path d="M4 12 12 4"/><path d="M12 20 20 12"/></svg>',
    fireball: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    frost:    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/></svg>',
    meteor:   '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1"><circle cx="9" cy="15" r="5"/><path d="m14 10 7-7"/><path d="m11 6 5-4"/><path d="m18 13 4-5"/></svg>'
  };

  class HeroesLoreGame {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.viewW = 480;
      this.viewH = 360;
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';

      this.audio = new global.RetroAudio();
      this.sprites = global.buildSprites();

      this.state = 'title';
      this.selectedClassId = 'knight';
      this.time = 0;
      this.lastTs = 0;

      this.camX = 0;
      this.camY = 0;
      this.shakeTimer = 0;
      this.shakeMag = 0;
      this.bannerText = '';
      this.bannerSub = '';
      this.bannerTimer = 0;

      // Inputs
      this.keys = {};
      this.virtualDir = { up: false, down: false, left: false, right: false };
      this.stickX = 0;
      this.stickY = 0;
      this.stickPointerId = null;
      this.holdingAttack = false;
      this.padMode = 'joystick';
      this.lastInteractKey = 'attack';

      // World runtime
      this.currentMapId = 'town';
      this.monsters = [];
      this.projectiles = [];
      this.effects = [];
      this.particles = [];
      this.dashGhosts = [];
      this.lastRunStep = -1;
      this.floatTexts = [];
      this.drops = [];
      this.telegraphs = [];
      this.respawnQueue = [];
      this.lockedTarget = null;

      // Dialog & Modal
      this.dialogLines = [];
      this.dialogIdx = 0;
      this.dialogOnDone = null;
      this.modalType = null;
      this.modalTab = null;

      this.hero = null;

      this.cacheDom();
      this.bindInputs();
      this.setPadMode('joystick');
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      this.renderClassCards();
      this.updateTitleButtons();
      this.loop(0);
    }

    resizeCanvas() {
      const wrap = this.canvas.parentElement;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) return;
      const aspect = rect.width / rect.height;
      const mapW = 24 * TILE; // 576
      const mapH = 18 * TILE; // 432
      let targetW, targetH;
      if (aspect < 1) {
        // Portrait modern smartphone (e.g. 19.5:9 / 20:9): fill 100% height up to mapH
        targetH = Math.min(mapH - 4, 412);
        targetW = clamp(Math.round(targetH * aspect), 180, mapW);
      } else {
        // Landscape mobile / tablet / desktop
        targetH = clamp(Math.round(rect.height <= 460 ? 250 : 340), 220, mapH - 4);
        targetW = clamp(Math.round(targetH * aspect), 280, mapW);
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const backW = Math.max(320, Math.round(rect.width * dpr));
      const backH = Math.max(320, Math.round(rect.height * dpr));
      if (this.viewW !== targetW || this.viewH !== targetH || this.canvas.width !== backW || this.canvas.height !== backH) {
        this.viewW = targetW;
        this.viewH = targetH;
        this.canvas.width = backW;
        this.canvas.height = backH;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        if (this.hero) this.updateCamera(true);
      }
    }

    cacheDom() {
      this.el = {
        titleScreen: document.getElementById('titleScreen'),
        selectScreen: document.getElementById('selectScreen'),
        gameoverScreen: document.getElementById('gameoverScreen'),
        victoryScreen: document.getElementById('victoryScreen'),
        btnContinue: document.getElementById('btnContinue'),
        btnNewGame: document.getElementById('btnNewGame'),
        btnStartAdventure: document.getElementById('btnStartAdventure'),
        btnBackTitle: document.getElementById('btnBackTitle'),
        btnRevive: document.getElementById('btnRevive'),
        btnContinueAfterWin: document.getElementById('btnContinueAfterWin'),
        classGrid: document.getElementById('classGrid'),
        dialogBox: document.getElementById('dialogBox'),
        dialogSpeaker: document.getElementById('dialogSpeaker'),
        dialogCounter: document.getElementById('dialogCounter'),
        dialogText: document.getElementById('dialogText'),
        modalBackdrop: document.getElementById('modalBackdrop'),
        modalTabs: document.getElementById('modalTabs'),
        modalBody: document.getElementById('modalBody'),
        modalClose: document.getElementById('modalClose'),
        // HUD
        gameHud: document.getElementById('gameHud'),
        hudPortrait: document.getElementById('hudPortrait'),
        hudLv: document.getElementById('hudLv'),
        hudName: document.getElementById('hudName'),
        hudGold: document.getElementById('hudGold'),
        hudHpFill: document.getElementById('hudHpFill'),
        hudHpText: document.getElementById('hudHpText'),
        hudMpFill: document.getElementById('hudMpFill'),
        hudMpText: document.getElementById('hudMpText'),
        hudExpFill: document.getElementById('hudExpFill'),
        hudMapName: document.getElementById('hudMapName'),
        btnHudFold: document.getElementById('btnHudFold'),
        hudQuestPill: document.getElementById('hudQuestPill'),
        hudQuestText: document.getElementById('hudQuestText'),
        questBriefCard: document.getElementById('questBriefCard'),
        qbBadge: document.getElementById('qbBadge'),
        btnQbClose: document.getElementById('btnQbClose'),
        qbTitle: document.getElementById('qbTitle'),
        qbDesc: document.getElementById('qbDesc'),
        qbMeta: document.getElementById('qbMeta'),
        qbRewards: document.getElementById('qbRewards'),
        btnQbWarp: document.getElementById('btnQbWarp'),
        btnQbChronicle: document.getElementById('btnQbChronicle'),
        hudBossBar: document.getElementById('hudBossBar'),
        hudBossName: document.getElementById('hudBossName'),
        hudBossHpTxt: document.getElementById('hudBossHpTxt'),
        hudBossFill: document.getElementById('hudBossFill'),
        mapBanner: document.getElementById('mapBanner'),
        mapBannerTitle: document.getElementById('mapBannerTitle'),
        mapBannerSub: document.getElementById('mapBannerSub'),
        // Settings popover
        btnSettings: document.getElementById('btnSettings'),
        settingsPopover: document.getElementById('settingsPopover'),
        bgmState: document.getElementById('bgmState'),
        sfxState: document.getElementById('sfxState'),
        btnHudAlpha: document.getElementById('btnHudAlpha'),
        hudAlphaLabel: document.getElementById('hudAlphaLabel'),
        // Controls
        skillSlots: document.getElementById('skillSlots'),
        mobileSkillSlots: document.getElementById('mobileSkillSlots'),
        btnPotHp: document.getElementById('btnPotHp'),
        btnPotMp: document.getElementById('btnPotMp'),
        btnScrollTown: document.getElementById('btnScrollTown'),
        potHpCount: document.getElementById('potHpCount'),
        potMpCount: document.getElementById('potMpCount'),
        scrollCount: document.getElementById('scrollCount'),
        dotStat: document.getElementById('dotStat'),
        dotSkill: document.getElementById('dotSkill'),
        btnBgm: document.getElementById('btnBgm'),
        btnSfx: document.getElementById('btnSfx'),
        btnSave: document.getElementById('btnSave'),
        btnPadMode: document.getElementById('btnPadMode'),
        padModeLabel: document.getElementById('padModeLabel'),
        mobileGamepad: document.getElementById('mobileGamepad'),
        stickZone: document.getElementById('stickZone'),
        stickKnob: document.getElementById('stickKnob'),
        btnMobileDash: document.getElementById('btnMobileDash'),
        btnMobileAttack: document.getElementById('btnMobileAttack'),
        mobileAtkIcon: document.getElementById('mobileAtkIcon'),
        mobileAtkLabel: document.getElementById('mobileAtkLabel'),
        phoneKeypad: document.getElementById('phoneKeypad')
      };
    }

    onArtLoaded(key) {
      if (key === 'title_bg' && this.sprites.art && this.sprites.art.titleBg) {
        const bgEl = document.getElementById('titleBgArt');
        if (bgEl) bgEl.style.backgroundImage = `url("${this.sprites.art.titleBg.src}")`;
      }
      if (key && key.startsWith('portrait_')) {
        this.renderClassCards();
        this.drawHudPortrait();
      }
    }

    renderClassCards() {
      this.el.classGrid.innerHTML = '';
      Object.values(DATA.CLASSES).forEach((cls) => {
        const card = document.createElement('div');
        card.className = 'class-card' + (cls.id === this.selectedClassId ? ' selected' : '');
        card.dataset.classId = cls.id;

        const preview = document.createElement('canvas');
        preview.width = 160;
        preview.height = 160;
        preview.className = 'class-preview';
        const pctx = preview.getContext('2d');
        pctx.imageSmoothingEnabled = true;
        pctx.imageSmoothingQuality = 'high';
        const set = this.sprites.heroes[cls.id];
        pctx.drawImage(set.hdPortrait || set.portrait || set.idle, 0, 0, 160, 160);

        card.innerHTML = `
          <div class="class-head">
            <div class="preview-slot"></div>
            <div>
              <div class="class-name">${cls.name}</div>
              <div class="class-role">${cls.role}</div>
            </div>
          </div>
          <div class="class-desc">${cls.desc}</div>
          <div class="class-stats">
            <span>힘 ${cls.base.str}</span>
            <span>민첩 ${cls.base.agi}</span>
            <span>체력 ${cls.base.vit}</span>
            <span>지능 ${cls.base.int}</span>
          </div>
        `;
        card.querySelector('.preview-slot').appendChild(preview);
        card.addEventListener('click', () => {
          this.audio.playSfx('ui');
          this.selectedClassId = cls.id;
          this.el.classGrid.querySelectorAll('.class-card').forEach((c) => {
            c.classList.toggle('selected', c.dataset.classId === cls.id);
          });
        });
        this.el.classGrid.appendChild(card);
      });
    }

    updateTitleButtons() {
      let hasSave = false;
      try { hasSave = !!localStorage.getItem(SAVE_KEY); } catch (_) {}
      this.el.btnContinue.disabled = !hasSave;
      if (this.sprites.art && this.sprites.art.titleBg) {
        const bgEl = document.getElementById('titleBgArt');
        if (bgEl) bgEl.style.backgroundImage = `url("${this.sprites.art.titleBg.src}")`;
      }
    }

    drawHudPortrait() {
      if (!this.hero || !this.el.hudPortrait) return;
      const w = this.el.hudPortrait.width || 144;
      const h = this.el.hudPortrait.height || 144;
      const pctx = this.el.hudPortrait.getContext('2d');
      pctx.clearRect(0, 0, w, h);
      pctx.imageSmoothingEnabled = true;
      pctx.imageSmoothingQuality = 'high';
      const set = this.sprites.heroes[this.hero.classId];
      const src = set.hdPortrait || set.portrait || set.idle;
      pctx.drawImage(src, 0, 0, w, h);
    }

    // --- HERO & STATS ---
    createNewHero(classId) {
      const cls = DATA.CLASSES[classId];
      const nextUid = () => 'eq_' + Math.random().toString(36).slice(2, 9);
      this.hero = {
        classId, name: cls.name, title: '', lv: 1, exp: 0, expNext: 60, gold: 120,
        statPoints: 0, skillPoints: 1, base: { ...cls.base }, hp: 100, mp: 50,
        x: 11.5 * TILE, y: 11.5 * TILE, vx: 0, vy: 0, dir: 'down', facingX: 0, facingY: 1,
        walkAnim: 0, attackTimer: 0, attackCooldown: 0, comboStep: 0, comboResetTimer: 0,
        dashTimer: 0, dashCd: 0, invulnTimer: 0, buffAtkTimer: 0, buffDefTimer: 0, buffSpdTimer: 0,
        skillLevels: [1, 0, 0, 0, 0, 0, 0, 0], skillCds: [0, 0, 0, 0, 0, 0, 0, 0],
        equippedSkills: [0, 1, 2, 3],
        equip: {
          weapon: { uid: nextUid(), itemId: cls.startWeapon, enh: 0 },
          armor: { uid: nextUid(), itemId: 'ar_leather', enh: 0 },
          helm: null, accessory: null,
        },
        bagEquip: [],
        bagItems: { pot_hp_s: 4, pot_mp_s: 3, scroll_town: 2, mat_enhance: 1 },
        openedChests: {}, questIdx: 0, questState: 'available', questProgress: 0, vargasDefeated: false
      };

      const st = this.getHeroStats();
      this.hero.hp = st.maxHp;
      this.hero.mp = st.maxMp;
      this.loadMap('town', 11.5, 11.5);
      this.drawHudPortrait();
      this.buildSkillSlotUi();
      this.refreshQuickBar();
      this.state = 'playing';
      this.hideAllScreens();
      this.el.gameHud.classList.remove('hidden');
      this.audio.playBgm('town');
      this.openDialog([
        '[솔티아 연대기] 바람의 대륙 솔티아에 불길한 마기가 퍼지기 시작했습니다.',
        `${this.hero.name}: "마을 광장 북쪽의 촌장 엘더님께 먼저 이야기를 들어보자."`
      ]);
      this.saveGame(true);
    }

    getEquipBonus(eqObj) {
      if (!eqObj) return {};
      const def = DATA.ITEMS[eqObj.itemId];
      if (!def) return {};
      const enh = eqObj.enh || 0;
      return {
        atk: (def.atk || 0) + (def.type === 'weapon' ? enh * 3 : 0),
        def: (def.def || 0) + (def.type === 'armor' || def.type === 'helm' ? enh * 2 : 0),
        hp: (def.hp || 0) + (def.type === 'armor' ? enh * 12 : def.type === 'accessory' ? enh * 8 : 0),
        mp: (def.mp || 0) + (def.type === 'helm' || def.type === 'accessory' ? enh * 5 : 0),
        str: def.str || 0, agi: def.agi || 0, vit: def.vit || 0, int: def.int || 0,
        crit: (def.crit || 0) + (def.type === 'weapon' ? Math.floor(enh / 2) : 0),
        lifesteal: def.lifesteal || 0,
        spd: def.spd || 0,
        mpRegen: def.mpRegen || 0,
        skillDmg: def.skillDmg || 0
      };
    }

    getHeroStats() {
      const h = this.hero;
      let str = h.base.str, agi = h.base.agi, vit = h.base.vit, intel = h.base.int;
      let bonusAtk = 0, bonusDef = 0, bonusHp = 0, bonusMp = 0, bonusCrit = 0;
      let lifesteal = 0, bonusSpd = 0, mpRegen = 0, skillDmg = 0;

      Object.values(h.equip).forEach((eq) => {
        if (!eq) return;
        const b = this.getEquipBonus(eq);
        str += b.str; agi += b.agi; vit += b.vit; intel += b.int;
        bonusAtk += b.atk; bonusDef += b.def; bonusHp += b.hp; bonusMp += b.mp; bonusCrit += b.crit;
        lifesteal += b.lifesteal || 0;
        bonusSpd += b.spd || 0;
        mpRegen += b.mpRegen || 0;
        skillDmg += b.skillDmg || 0;
      });

      const maxHp = 70 + vit * 14 + h.lv * 16 + bonusHp;
      const maxMp = 32 + intel * 8 + h.lv * 6 + bonusMp;
      let atk = Math.round(6 + str * 2.1 + agi * 0.5 + intel * 0.4 + h.lv * 2 + bonusAtk);
      let magicAtk = Math.round(6 + intel * 2.4 + str * 0.6 + h.lv * 2 + bonusAtk);
      if (h.buffAtkTimer > 0) { atk = Math.round(atk * 1.35); magicAtk = Math.round(magicAtk * 1.35); }
      let def = Math.round(3 + vit * 1.15 + agi * 0.25 + bonusDef);
      if (h.buffDefTimer > 0) def = Math.round(def * 1.65);

      let crit = clamp(6 + Math.round(agi * 0.85) + bonusCrit, 5, 80);
      if (h.buffSpdTimer > 0) crit = clamp(crit + 25, 5, 95);

      let speed = 108 + Math.min(34, agi * 1.15) + Math.min(44, bonusSpd);
      if (h.buffSpdTimer > 0) speed *= 1.32;

      return { str, agi, vit, int: intel, maxHp, maxMp, atk, magicAtk, def, crit, speed, lifesteal: Math.min(35, lifesteal), mpRegen, skillDmg };
    }

    // --- SAVE / LOAD ---
    saveGame(silent = false) {
      if (!this.hero) return;
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({ hero: this.hero, currentMapId: this.currentMapId }));
        this.updateTitleButtons();
        if (!silent) {
          this.audio.playSfx('ui');
          this.addFloatText(this.hero.x, this.hero.y - 20, '저장 완료', '#fde047');
        }
      } catch (_) {}
    }

    ensureHeroExtras(h) {
      if (!h) return;
      if (typeof h.towerBest !== 'number') h.towerBest = 0;
      if (typeof h.towerFloor !== 'number') h.towerFloor = 1;
      if (typeof h.buffAtkTimer !== 'number') h.buffAtkTimer = 0;
      const cls = DATA.CLASSES[h.classId];
      const skCount = cls ? cls.skills.length : 8;
      if (!Array.isArray(h.skillLevels)) h.skillLevels = [1];
      while (h.skillLevels.length < skCount) h.skillLevels.push(0);
      if (!Array.isArray(h.skillCds)) h.skillCds = [];
      while (h.skillCds.length < skCount) h.skillCds.push(0);
      if (!Array.isArray(h.equippedSkills) || h.equippedSkills.length !== 4) {
        h.equippedSkills = [0, 1, 2, 3];
      }
      if (!h.unlockedMaps) h.unlockedMaps = { town: true, meadow: true };
      h.unlockedMaps.town = true;
      h.unlockedMaps.meadow = true;
      if (!Array.isArray(h.bounties) || h.bounties.length === 0) {
        h.bounties = this.rollBounties(h);
      }
    }

    getStorySeason() {
      if (!this.hero) return 1;
      return clamp(Math.floor((this.hero.questIdx || 0) / 20) + 1, 1, 10);
    }

    rollBounties(h) {
      const pool = DATA.SIDE_BOUNTY_POOL || [];
      if (!pool.length) return [];
      const unlocked = Math.min(pool.length, Math.max(2, Math.floor((h.questIdx || 0) / 3) + 2));
      const picks = [];
      const avail = pool.slice(0, unlocked);
      while (picks.length < Math.min(3, avail.length)) {
        const cand = avail[Math.floor(Math.random() * avail.length)];
        if (!picks.some((p) => p.id === cand.id)) {
          picks.push({ ...cand, progress: 0, uid: 'bn_' + Math.random().toString(36).slice(2, 8) });
        }
      }
      return picks;
    }

    loadGame() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        this.hero = data.hero;
        this.ensureHeroExtras(this.hero);
        this.currentMapId = (data.currentMapId && DATA.MAPS[data.currentMapId]) ? data.currentMapId : 'town';
        if (this.currentMapId === 'tower') this.currentMapId = 'town';
        this.loadMap(this.currentMapId, (this.hero.x || 11.5 * TILE) / TILE, (this.hero.y || 11.5 * TILE) / TILE);
        this.drawHudPortrait();
        this.buildSkillSlotUi();
        this.refreshQuickBar();
        this.hideAllScreens();
        this.el.gameHud.classList.remove('hidden');
        this.state = 'playing';
        this.audio.playBgm(DATA.MAPS[this.currentMapId].bgm);
        this.addFloatText(this.hero.x, this.hero.y - 22, '모험 이어하기', '#fde047');
      } catch (e) {
        console.error('Load failed:', e);
      }
    }

    enterTowerFloor(floor) {
      this.ensureHeroExtras(this.hero);
      const fl = clamp(Math.round(floor || 1), 1, 100);
      this.hero.towerFloor = fl;
      this.towerCleared = false;
      this.loadMap('tower', 11.5, 14.5);
    }

    loadMap(mapId, tx, ty) {
      const map = DATA.MAPS[mapId];
      if (!map) return;
      if (DATA.ensureZoneLayout) DATA.ensureZoneLayout(map);
      this.ensureHeroExtras(this.hero);
      this.currentMapId = mapId;
      if (!map.isTower) this.hero.unlockedMaps[mapId] = true;
      this.hero.x = tx * TILE;
      this.hero.y = ty * TILE;
      this.hero.vx = 0;
      this.hero.vy = 0;

      this.monsters = [];
      this.projectiles = [];
      this.effects = [];
      this.particles = [];
      this.dashGhosts = [];
      this.drops = [];
      this.telegraphs = [];
      this.respawnQueue = [];
      this.lockedTarget = null;

      if (map.isTower) {
        const fl = this.hero.towerFloor || 1;
        this.towerCleared = false;
        const isBossFl = fl % 5 === 0;
        const flScale = 0.72 + fl * 0.11 + Math.pow(1.032, fl) * 0.25;
        if (isBossFl) {
          const bPool = DATA.TOWER_BOSSES || [];
          const bDef = bPool[Math.floor((fl / 5 - 1) % bPool.length)] || { name: '탑의 수호자', sprite: 'vargas' };
          this.spawnMonster(bDef.sprite, 11.5 * TILE, 6.5 * TILE, 0, flScale * 0.9, `[${fl}층 보스] ${bDef.name}`, fl + 4);
        } else {
          const mobPool = ['slime_blue', 'boar', 'coral_crab', 'pirate_skel', 'goblin', 'goblin_shaman', 'wyvern', 'lava_golem', 'skeleton', 'golem', 'dark_mage', 'fallen_knight', 'abyss_assassin'];
          const maxIdx = clamp(Math.floor(fl / 7) + 3, 3, mobPool.length);
          const minIdx = clamp(maxIdx - 5, 0, mobPool.length - 1);
          const pts = [[6.5, 6.5], [16.5, 6.5], [8.5, 9.5], [14.5, 9.5], [11.5, 5.5]];
          const count = fl >= 30 ? 5 : 4;
          for (let i = 0; i < count; i++) {
            const pick = mobPool[randInt(minIdx, maxIdx - 1)];
            this.spawnMonster(pick, pts[i][0] * TILE, pts[i][1] * TILE, i, flScale, null, fl + 2);
          }
        }
        this.bannerText = `심연의 탑 · ${fl}층`;
        this.bannerSub = isBossFl ? `보스전 · ${fl}층 수호자를 격파하세요!` : `몬스터를 모두 처치하면 ${Math.min(100, fl + 1)}층이 열립니다`;
      } else {
        const season = this.getStorySeason();
        const sScale = map.zoneScale ? map.zoneScale : (season > 1 ? Math.pow(1.24, season - 1) : 1);
        map.spawns.forEach((sp, idx) => {
          this.spawnMonster(sp.type, sp.tx * TILE, sp.ty * TILE, idx, sScale, sp.customName || null, sp.customLv || (map.recLv || null));
        });
        this.bannerText = map.zoneNum ? map.name : (season > 1 && !map.safe ? `${map.name} (제${season}부)` : map.name);
        this.bannerSub = map.zoneNum ? map.subtitle : (season > 1 && !map.safe ? `제${season}부 각성 구역 · 강화된 마물 출몰` : map.subtitle);
      }

      // Auto-complete 'explore' story quests upon arriving at the target zone!
      const h = this.hero;
      if (h && h.questState === 'active') {
        const q = DATA.QUESTS[h.questIdx];
        if (q && q.type === 'explore' && q.targetMap === mapId) {
          h.questProgress = 1;
          h.questState = 'ready';
          this.audio.playSfx('quest');
          this.addFloatText(h.x, h.y - 34, '구역 탐사 완료!', '#4ade80', true);
          this.saveGame(true);
        }
      }

      this.bannerTimer = 2.6;
      if (this.el.mapBanner) {
        if (this.el.mapBannerTitle) this.el.mapBannerTitle.textContent = this.bannerText;
        if (this.el.mapBannerSub) this.el.mapBannerSub.textContent = this.bannerSub;
        this.el.mapBanner.classList.add('show');
      }
      if (this.state === 'playing') this.audio.playBgm(map.bgm);
      this.updateCamera(true);
    }

    spawnMonster(typeId, x, y, spawnIdx, scale = 1, customName = null, customLv = null) {
      const def = DATA.MONSTERS[typeId];
      if (!def) return;
      const hp = Math.round(def.hp * scale);
      const atk = Math.round(def.atk * Math.pow(scale, 0.72));
      const mdef = Math.round(def.def * Math.pow(scale, 0.65));
      const exp = Math.round(def.exp * Math.pow(scale, 0.88));
      const goldMult = Math.pow(scale, 0.78);
      this.monsters.push({
        uid: 'm_' + Math.random().toString(36).slice(2, 9),
        typeId, spawnIdx, homeX: x, homeY: y, x, y, vx: 0, vy: 0,
        hp, maxHp: hp, atk, def: mdef, exp,
        goldMin: Math.round(def.gold[0] * goldMult), goldMax: Math.round(def.gold[1] * goldMult),
        customName, customLv: customLv || Math.round(def.lv + (scale > 1 ? (this.getStorySeason() - 1) * 10 : 0)),
        speed: def.speed, size: def.size,
        hitFlash: 0, stunTimer: 0, slowTimer: 0, attackCd: 1.0 + Math.random() * 0.7,
        specialCd: 3.5, wanderTimer: 0, wanderAngle: Math.random() * Math.PI * 2, phase2: false, anim: Math.random() * 10
      });
    }

    // --- INPUTS ---
    bindInputs() {
      window.addEventListener('keydown', (e) => {
        const code = e.code;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) e.preventDefault();
        this.keys[code] = true;
        this.audio.init();

        if (this.state === 'dialog') {
          if (['Space', 'Enter', 'KeyZ', 'KeyF'].includes(code)) this.advanceDialog();
          return;
        }
        if (this.state === 'modal') {
          if (['Escape', 'KeyI', 'KeyC', 'KeyK', 'KeyJ'].includes(code)) this.closeModal();
          return;
        }
        if (this.state !== 'playing') return;

        if (code === 'Space' || code === 'KeyZ') this.handlePrimaryAction();
        else if (code === 'KeyF' || code === 'Enter') this.tryInteract();
        else if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyX') this.triggerDash();
        else if (code === 'Digit1') this.useSkill(0);
        else if (code === 'Digit2') this.useSkill(1);
        else if (code === 'Digit3') this.useSkill(2);
        else if (code === 'Digit4') this.useSkill(3);
        else if (code === 'KeyQ') this.useQuickPotion('hp');
        else if (code === 'KeyE') this.useQuickPotion('mp');
        else if (code === 'KeyR') this.useReturnScroll();
        else if (code === 'KeyC') this.openHeroModal('status');
        else if (code === 'KeyI') this.openHeroModal('bag');
        else if (code === 'KeyK') this.openHeroModal('skills');
        else if (code === 'KeyJ') this.openHeroModal('quest');
        else if (code === 'KeyM') this.openHeroModal('world');
      });

      window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

      this.el.btnNewGame.addEventListener('click', () => {
        this.audio.init(); this.audio.playSfx('ui'); this.audio.playBgm('title');
        this.el.titleScreen.classList.add('hidden');
        this.el.selectScreen.classList.remove('hidden');
        this.state = 'select';
      });
      this.el.btnContinue.addEventListener('click', () => { this.audio.init(); this.audio.playSfx('ui'); this.loadGame(); });
      this.el.btnBackTitle.addEventListener('click', () => {
        this.audio.playSfx('ui');
        this.el.selectScreen.classList.add('hidden');
        this.el.titleScreen.classList.remove('hidden');
        this.state = 'title';
      });
      this.el.btnStartAdventure.addEventListener('click', () => {
        this.audio.init(); this.audio.playSfx('quest');
        this.createNewHero(this.selectedClassId);
      });
      this.el.btnRevive.addEventListener('click', () => {
        this.audio.playSfx('potion');
        const st = this.getHeroStats();
        this.hero.hp = st.maxHp; this.hero.mp = st.maxMp;
        this.hero.gold = Math.max(0, Math.floor(this.hero.gold * 0.9));
        this.loadMap('town', 11.5, 11.5);
        this.hideAllScreens();
        this.state = 'playing';
        this.audio.playBgm('town');
        this.addFloatText(this.hero.x, this.hero.y - 22, '마을에서 부활', '#4ade80');
      });
      this.el.btnContinueAfterWin.addEventListener('click', () => {
        this.audio.playSfx('ui');
        this.hideAllScreens();
        this.state = 'playing';
        this.audio.playBgm(DATA.MAPS[this.currentMapId].bgm);
      });

      this.el.dialogBox.addEventListener('click', () => this.advanceDialog());
      this.el.modalClose.addEventListener('click', () => this.closeModal());
      this.el.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.el.modalBackdrop) this.closeModal();
      });

      const bindTap = (el, fn) => {
        if (!el) return;
        el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.audio.init(); fn(); });
      };
      bindTap(this.el.btnPotHp, () => this.useQuickPotion('hp'));
      bindTap(this.el.btnPotMp, () => this.useQuickPotion('mp'));
      bindTap(this.el.btnScrollTown, () => this.useReturnScroll());

      if (this.el.hudQuestPill) {
        this.el.hudQuestPill.addEventListener('click', () => {
          if (this.state !== 'playing' || !this.hero) return;
          this.audio.init();
          this.audio.playSfx('ui');
          if (this.hero.questState === 'available' || this.hero.questState === 'ready') {
            this.hideQuestBrief();
            this.handleElderQuestDialog();
          } else if (this.hero.questState === 'active') {
            if (this.el.questBriefCard && !this.el.questBriefCard.classList.contains('hidden')) {
              this.hideQuestBrief();
            } else {
              this.showQuestBrief('detail');
            }
          } else {
            this.openHeroModal('quest');
          }
        });
      }

      if (this.el.btnQbClose) {
        this.el.btnQbClose.addEventListener('click', () => {
          this.audio.playSfx('ui');
          this.hideQuestBrief();
        });
      }
      if (this.el.btnQbWarp) {
        this.el.btnQbWarp.addEventListener('click', () => {
          this.audio.playSfx('portal');
          this.warpToQuestTarget();
        });
      }
      if (this.el.btnQbChronicle) {
        this.el.btnQbChronicle.addEventListener('click', () => {
          this.hideQuestBrief();
          this.openHeroModal('quest');
        });
      }

      if (this.el.btnHudFold) {
        this.el.btnHudFold.addEventListener('click', () => {
          this.audio.init();
          this.audio.playSfx('ui');
          this.el.gameHud.classList.toggle('hud-compact');
          if (this.el.settingsPopover) this.el.settingsPopover.classList.add('hidden');
        });
      }

      this.hudAlphaMode = 'semi';
      if (this.el.btnHudAlpha) {
        this.el.btnHudAlpha.addEventListener('click', () => {
          this.audio.playSfx('ui');
          const next = this.hudAlphaMode === 'semi' ? 'minimal' : (this.hudAlphaMode === 'minimal' ? 'solid' : 'semi');
          this.hudAlphaMode = next;
          this.el.gameHud.classList.toggle('alpha-minimal', next === 'minimal');
          this.el.gameHud.classList.toggle('alpha-solid', next === 'solid');
          if (this.el.hudAlphaLabel) {
            this.el.hudAlphaLabel.textContent = next === 'semi' ? '반투명' : (next === 'minimal' ? '미니멀' : '선명');
          }
        });
      }

      document.querySelectorAll('[data-open-menu]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (this.el.settingsPopover) this.el.settingsPopover.classList.add('hidden');
          if (this.state === 'playing') this.openHeroModal(btn.dataset.openMenu);
        });
      });

      if (this.el.btnSettings && this.el.settingsPopover) {
        this.el.btnSettings.addEventListener('click', (e) => {
          e.stopPropagation();
          this.audio.playSfx('ui');
          this.el.settingsPopover.classList.toggle('hidden');
        });
        document.addEventListener('pointerdown', (e) => {
          if (!this.el.settingsPopover.classList.contains('hidden') &&
              !this.el.settingsPopover.contains(e.target) &&
              !this.el.btnSettings.contains(e.target)) {
            this.el.settingsPopover.classList.add('hidden');
          }
        });
      }

      this.el.btnBgm.addEventListener('click', () => {
        this.audio.init();
        const on = this.audio.toggleBgm();
        this.el.btnBgm.classList.toggle('active', on);
        if (this.el.bgmState) this.el.bgmState.textContent = on ? 'ON' : 'OFF';
      });
      this.el.btnSfx.addEventListener('click', () => {
        this.audio.init();
        const on = this.audio.toggleSfx();
        this.el.btnSfx.classList.toggle('active', on);
        if (this.el.sfxState) this.el.sfxState.textContent = on ? 'ON' : 'OFF';
      });
      this.el.btnSave.addEventListener('click', () => {
        if (this.hero) this.saveGame(false);
        if (this.el.settingsPopover) this.el.settingsPopover.classList.add('hidden');
      });
      this.el.btnPadMode.addEventListener('click', () => {
        this.audio.playSfx('ui');
        const next = this.padMode === 'joystick' ? 'keypad' : (this.padMode === 'keypad' ? 'off' : 'joystick');
        this.setPadMode(next);
      });

      this.bindVirtualStick();

      // Mobile Primary Attack / Interact Orb (Hold to auto-combo!)
      if (this.el.btnMobileAttack) {
        const atkBtn = this.el.btnMobileAttack;
        atkBtn.addEventListener('pointerdown', (e) => {
          e.preventDefault(); this.audio.init();
          atkBtn.classList.add('pressed');
          if (this.state === 'dialog') { this.advanceDialog(); return; }
          if (this.state !== 'playing') return;
          if (!this.tryInteract(true)) {
            this.holdingAttack = true;
            this.performBasicAttack();
          }
        });
        const releaseAtk = () => { this.holdingAttack = false; atkBtn.classList.remove('pressed'); };
        atkBtn.addEventListener('pointerup', releaseAtk);
        atkBtn.addEventListener('pointerleave', releaseAtk);
        atkBtn.addEventListener('pointercancel', releaseAtk);
      }

      if (this.el.btnMobileDash) {
        this.el.btnMobileDash.addEventListener('pointerdown', (e) => {
          e.preventDefault(); this.audio.init();
          if (this.state === 'playing') this.triggerDash();
        });
      }

      const bindDir = (id, dir) => {
        const el = document.getElementById(id);
        if (!el) return;
        const set = (v) => { this.virtualDir[dir] = v; el.classList.toggle('pressed', v); };
        el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.audio.init(); set(true); });
        el.addEventListener('pointerup', () => set(false));
        el.addEventListener('pointerleave', () => set(false));
        el.addEventListener('pointercancel', () => set(false));
      };
      bindDir('padUp', 'up'); bindDir('padDown', 'down'); bindDir('padLeft', 'left'); bindDir('padRight', 'right');

      const padOk = document.getElementById('padOk');
      if (padOk) {
        padOk.addEventListener('pointerdown', (e) => {
          e.preventDefault(); this.audio.init();
          if (this.state === 'dialog') this.advanceDialog();
          else if (this.state === 'playing') this.handlePrimaryAction();
        });
      }

      document.querySelectorAll('[data-pad-action]').forEach((btn) => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault(); this.audio.init();
          const act = btn.dataset.padAction;
          if (this.state === 'dialog') { this.advanceDialog(); return; }
          if (this.state !== 'playing') return;
          if (act === 's1') this.useSkill(0);
          else if (act === 's2') this.useSkill(1);
          else if (act === 's3') this.useSkill(2);
          else if (act === 's4') this.useSkill(3);
          else if (act === 'attack') this.handlePrimaryAction();
          else if (act === 'dash') this.triggerDash();
          else if (act === 'hp') this.useQuickPotion('hp');
          else if (act === 'mp') this.useQuickPotion('mp');
          else if (act === 'menu') this.openHeroModal('bag');
        });
      });
    }

    setPadMode(mode) {
      this.padMode = mode;
      this.clearTouchInputs();
      this.el.mobileGamepad.classList.toggle('hidden', mode !== 'joystick');
      this.el.phoneKeypad.classList.toggle('hidden', mode !== 'keypad');
      if (this.el.padModeLabel) {
        this.el.padModeLabel.textContent = mode === 'joystick' ? '조이스틱' : (mode === 'keypad' ? '키패드' : '패드OFF');
      }
      this.el.btnPadMode.classList.toggle('active', mode !== 'off');
      requestAnimationFrame(() => this.resizeCanvas());
    }

    clearTouchInputs() {
      this.stickPointerId = null; this.stickX = 0; this.stickY = 0; this.holdingAttack = false;
      this.virtualDir.up = false; this.virtualDir.down = false; this.virtualDir.left = false; this.virtualDir.right = false;
      if (this.el.stickKnob) this.el.stickKnob.style.transform = 'translate(0px, 0px)';
      if (this.el.stickZone) this.el.stickZone.classList.remove('active');
      if (this.el.btnMobileAttack) this.el.btnMobileAttack.classList.remove('pressed');
    }

    bindVirtualStick() {
      const zone = this.el.stickZone, knob = this.el.stickKnob;
      if (!zone || !knob) return;
      const maxDist = 36;
      const updateStick = (cx0, cy0) => {
        const rect = zone.getBoundingClientRect();
        let dx = cx0 - (rect.left + rect.width / 2), dy = cy0 - (rect.top + rect.height / 2);
        const d = Math.hypot(dx, dy);
        if (d > maxDist) { dx = (dx / d) * maxDist; dy = (dy / d) * maxDist; }
        knob.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        if (d < 7) { this.stickX = 0; this.stickY = 0; } else { this.stickX = dx / maxDist; this.stickY = dy / maxDist; }
      };
      const resetStick = () => {
        this.stickPointerId = null; this.stickX = 0; this.stickY = 0;
        knob.style.transform = 'translate(0px, 0px)'; zone.classList.remove('active');
      };
      zone.addEventListener('pointerdown', (e) => {
        e.preventDefault(); this.audio.init();
        if (this.stickPointerId !== null) return;
        this.stickPointerId = e.pointerId; zone.classList.add('active');
        try { zone.setPointerCapture(e.pointerId); } catch (_) {}
        updateStick(e.clientX, e.clientY);
      });
      zone.addEventListener('pointermove', (e) => { if (e.pointerId !== this.stickPointerId) return; e.preventDefault(); updateStick(e.clientX, e.clientY); });
      zone.addEventListener('pointerup', (e) => { if (e.pointerId === this.stickPointerId) resetStick(); });
      zone.addEventListener('pointercancel', (e) => { if (e.pointerId === this.stickPointerId) resetStick(); });
    }

    hideAllScreens() {
      this.el.titleScreen.classList.add('hidden');
      this.el.selectScreen.classList.add('hidden');
      this.el.gameoverScreen.classList.add('hidden');
      this.el.victoryScreen.classList.add('hidden');
    }

    // --- DIALOG ---
    openDialog(lines, onDone = null) {
      this.clearTouchInputs();
      this.dialogLines = lines; this.dialogIdx = 0; this.dialogOnDone = onDone; this.state = 'dialog';
      if (this.el.gameHud) this.el.gameHud.classList.add('dialog-active');
      this.showDialogLine();
    }

    showDialogLine() {
      const raw = this.dialogLines[this.dialogIdx] || '';
      const sep = raw.indexOf(':');
      if (sep > 0 && sep < 22 && !raw.startsWith('[')) {
        this.el.dialogSpeaker.textContent = raw.slice(0, sep).trim();
        this.el.dialogText.textContent = raw.slice(sep + 1).trim();
      } else {
        this.el.dialogSpeaker.textContent = '솔티아 연대기';
        this.el.dialogText.textContent = raw;
      }
      if (this.el.dialogCounter) {
        this.el.dialogCounter.textContent = this.dialogLines.length > 1
          ? `${this.dialogIdx + 1} / ${this.dialogLines.length} · 터치 ▸`
          : '터치 ▸';
      }
      this.el.dialogBox.classList.remove('hidden');
    }

    advanceDialog() {
      this.audio.playSfx('ui');
      this.dialogIdx++;
      if (this.dialogIdx >= this.dialogLines.length) {
        this.el.dialogBox.classList.add('hidden');
        if (this.el.gameHud) this.el.gameHud.classList.remove('dialog-active');
        this.state = 'playing';
        const cb = this.dialogOnDone; this.dialogOnDone = null;
        if (cb) cb();
      } else {
        this.showDialogLine();
      }
    }

    // --- INTERACT ---
    handlePrimaryAction() {
      if (this.tryInteract(true)) return;
      this.performBasicAttack();
    }

    tryInteract(silentIfNone = false) {
      const map = DATA.MAPS[this.currentMapId], h = this.hero;
      for (const npc of map.npcs || []) {
        if (dist(h.x, h.y, npc.tx * TILE, npc.ty * TILE) < 40) { this.interactNpc(npc); return true; }
      }
      for (const f of map.fountains || []) {
        if (dist(h.x, h.y, f.tx * TILE, f.ty * TILE) < 44) {
          const st = this.getHeroStats();
          h.hp = st.maxHp; h.mp = st.maxMp;
          this.audio.playSfx('potion');
          this.spawnParticles(h.x, h.y, '#60a5fa', 18);
          this.addFloatText(h.x, h.y - 22, 'HP/MP 완전 회복 & 저장', '#93c5fd');
          this.saveGame(true);
          return true;
        }
      }
      for (const ch of map.chests || []) {
        if (h.openedChests[ch.id]) continue;
        const cx = (ch.tx + 0.5) * TILE, cy = (ch.ty + 0.5) * TILE;
        if (dist(h.x, h.y, cx, cy) < 36) {
          h.openedChests[ch.id] = true;
          this.audio.playSfx('quest');
          this.spawnParticles(cx, cy, '#fde047', 22);
          const got = [];
          if (ch.gold) { h.gold += ch.gold; got.push(`${ch.gold}G`); }
          (ch.items || []).forEach((it) => { this.giveItem(it.id, it.qty); got.push(`${DATA.ITEMS[it.id].name} x${it.qty}`); });
          this.addFloatText(cx, cy - 16, '보물상자 획득!', '#fde047');
          this.openDialog([`[보물상자] ${got.join(', ')} 을(를) 획득했습니다!`]);
          this.refreshQuickBar();
          this.saveGame(true);
          return true;
        }
      }
      if (!silentIfNone) this.addFloatText(h.x, h.y - 16, '주변에 상호작용 대상이 없습니다', '#a6998a');
      return false;
    }

    interactNpc(npc) {
      this.audio.playSfx('ui');
      const h = this.hero, q = DATA.QUESTS[h.questIdx];
      if (q && h.questState === 'active' && q.type === 'talk' && q.targetNpc === npc.id) {
        h.questProgress = q.goal;
        h.questState = 'ready';
        this.audio.playSfx('quest');
        this.handleElderQuestDialog();
        return;
      }
      if (npc.role === 'shop') this.openShopModal();
      else if (npc.role === 'smith') this.openSmithModal('enhance');
      else if (npc.role === 'quest') this.handleElderQuestDialog();
      else if (npc.role === 'worldmap') {
        this.worldMapMode = 'overworld';
        this.openHeroModal('world');
      }
      else if (npc.role === 'bard') {
        const st = this.getHeroStats();
        h.hp = st.maxHp; h.mp = st.maxMp;
        this.audio.playSfx('potion');
        this.spawnParticles(h.x, h.y, '#34d399', 18);
        this.addFloatText(h.x, h.y - 20, '아리아의 축복 · 완전 회복!', '#4ade80');
        if (h.questState === 'available' || h.questState === 'ready') {
          this.handleElderQuestDialog();
        } else {
          const actName = q ? `${q.season ? `제${q.season}부 · ` : ''}${q.act}` : '완결 · 영원의 영웅';
          this.openDialog([
            `음유시인 아리아: "바람의 노래로 상처를 치유해 드렸어요. 지금 우리는 [${actName}]의 이야기를 써 내려가고 있답니다."`,
            q ? `음유시인 아리아: "${q.desc}"` : '음유시인 아리아: "영웅님의 10부작 200장 대연대기는 솔티아 대륙에서 영원히 노래될 거예요!"'
          ]);
        }
      } else if (npc.role === 'scout') {
        if (h.questState === 'available' || h.questState === 'ready') {
          this.handleElderQuestDialog();
        } else {
          this.openDialog([
            '정찰병 카일: "해안의 바람이 심상치 않네. 부상을 입으면 언제든 포션이나 귀환 주문서를 쓰게!"',
            q ? `정찰병 카일: "지금 목표는 [${q.title}]일세. ${q.desc}"` : '정찰병 카일: "자네 덕분에 솔티아 성기사단의 명예가 지켜졌네!"'
          ]);
        }
      }
    }

    showQuestBrief(mode = 'accepted') {
      const h = this.hero;
      if (!h || !this.el.questBriefCard) return;
      if (h.questState === 'all_done') { this.hideQuestBrief(); return; }
      const q = DATA.QUESTS[h.questIdx];
      if (!q) return;
      this.checkCollectQuest();

      const targetMapObj = q.targetMap ? DATA.MAPS[q.targetMap] : null;
      const locName = q.targetZoneName || (targetMapObj ? targetMapObj.name : '솔티아 대륙');
      const rewParts = [];
      if (q.reward && q.reward.gold) rewParts.push(`${q.reward.gold.toLocaleString()}G`);
      if (q.reward && q.reward.exp) rewParts.push(`EXP ${q.reward.exp.toLocaleString()}`);
      ((q.reward && q.reward.items) || []).forEach((it) => {
        const def = DATA.ITEMS[it.id];
        if (def) rewParts.push(`${def.name} x${it.qty}`);
      });

      const progTxt = h.questState === 'ready'
        ? '목표 달성! (상단 배지를 눌러 완료 보고)'
        : (q.type === 'talk' ? '대상 NPC와 대화 필요' : `진행도 ${h.questProgress} / ${q.goal}`);

      if (this.el.qbBadge) {
        this.el.qbBadge.textContent = mode === 'accepted'
          ? `✦ 새 퀘스트 수락 · 제${q.season || 1}부`
          : `✦ 진행 중인 퀘스트 · 제${q.season || 1}부`;
      }
      if (this.el.qbTitle) this.el.qbTitle.textContent = q.title;
      if (this.el.qbDesc) this.el.qbDesc.textContent = q.desc;
      if (this.el.qbMeta) this.el.qbMeta.textContent = `목표 지역: ${locName}  ·  ${progTxt}`;
      if (this.el.qbRewards) this.el.qbRewards.textContent = `보상: ${rewParts.join(' · ')}`;
      if (this.el.btnQbWarp) {
        if (q.targetMap && DATA.MAPS[q.targetMap]) {
          this.el.btnQbWarp.style.display = '';
          this.el.btnQbWarp.textContent = q.targetMap === 'tower'
            ? `심연의 탑 ${q.goal}층 도전`
            : `${locName.length > 14 ? '목표 지역' : locName} 바로 이동`;
        } else {
          this.el.btnQbWarp.style.display = 'none';
        }
      }
      this.el.questBriefCard.classList.remove('hidden');
    }

    hideQuestBrief() {
      if (this.el.questBriefCard) this.el.questBriefCard.classList.add('hidden');
    }

    warpToQuestTarget() {
      const h = this.hero;
      if (!h) return;
      const q = DATA.QUESTS[h.questIdx];
      this.hideQuestBrief();
      if (!q || !q.targetMap || !DATA.MAPS[q.targetMap]) return;
      if (q.targetMap === 'tower') {
        const targetFl = Math.min(100, Math.max(1, Math.min(q.goal || 1, (h.towerBest || 0) + 1)));
        this.enterTowerFloor(targetFl);
      } else if (q.targetMap === 'town') {
        this.loadMap('town', 11.5, 11.5);
      } else if (q.targetMap === 'coast') {
        this.loadMap('coast', 20.5, 8.5);
      } else if (q.targetMap === 'forest' || q.targetMap === 'canyon') {
        this.loadMap(q.targetMap, 2.5, 8.5);
      } else {
        this.loadMap(q.targetMap, 11.5, 14.8);
      }
      this.saveGame(true);
    }

    handleElderQuestDialog() {
      const h = this.hero;
      this.hideQuestBrief();
      this.checkCollectQuest();
      if (h.questState === 'all_done') {
        this.openDialog([
          `촌장 엘더: "${h.name}, 솔티아의 영원한 영웅이여! 10부작 200장에 걸친 대서사를 완결하고 대륙에 영원한 바람을 되찾아 주어 고맙네."`,
          '촌장 엘더: "언제든 [월드맵·탑]에서 200개 대륙 구역과 심연의 탑 100층에 도전해 신화·영원 장비를 시험해 볼 수 있다네."'
        ]);
        return;
      }
      const q = DATA.QUESTS[h.questIdx];
      if (!q) return;
      if (h.questState === 'available') {
        this.openDialog(q.dialogStart, () => {
          h.questState = 'active'; h.questProgress = 0; this.checkCollectQuest();
          this.audio.playSfx('quest');
          this.addFloatText(h.x, h.y - 24, `${q.title}`, '#fde047');
          this.saveGame(true);
          this.showQuestBrief('accepted');
        });
      } else if (h.questState === 'active') {
        this.showQuestBrief('detail');
      } else if (h.questState === 'ready') {
        this.openDialog(q.dialogDone || q.dialogComplete || [`${q.title}을(를) 완수했습니다!`], () => this.completeCurrentQuest());
      }
    }

    checkCollectQuest() {
      const h = this.hero;
      if (h.questState !== 'active') return;
      const q = DATA.QUESTS[h.questIdx];
      if (!q) return;
      if (q.type === 'collect') {
        h.questProgress = Math.min(q.goal, h.bagItems[q.targetItem] || 0);
        if (h.questProgress >= q.goal) h.questState = 'ready';
      } else if (q.type === 'tower') {
        h.questProgress = Math.min(q.goal, h.towerBest || 0);
        if (h.questProgress >= q.goal) h.questState = 'ready';
      } else if (q.type === 'explore' && this.currentMapId === q.targetMap) {
        h.questProgress = 1;
        h.questState = 'ready';
      }
    }

    completeCurrentQuest() {
      const h = this.hero, q = DATA.QUESTS[h.questIdx];
      if (!q) return;
      if (q.type === 'collect') h.bagItems[q.targetItem] = Math.max(0, (h.bagItems[q.targetItem] || 0) - q.goal);
      const r = q.reward, rewardsTxt = [];
      if (r.gold) { h.gold += r.gold; rewardsTxt.push(`${r.gold.toLocaleString()}G`); }
      if (r.exp) { this.gainExp(r.exp); rewardsTxt.push(`EXP +${r.exp.toLocaleString()}`); }
      (r.items || []).forEach((it) => { this.giveItem(it.id, it.qty); rewardsTxt.push(`${DATA.ITEMS[it.id].name} x${it.qty}`); });
      if (r.legendWeapon) {
        const legId = DATA.CLASSES[h.classId].legendWeapon;
        this.giveItem(legId, 1);
        rewardsTxt.push(`★${DATA.ITEMS[legId].name}`);
        h.title = h.questIdx >= 199 ? '영원의 솔티아 영웅' : '솔티아의 영웅';
      }
      this.audio.playSfx('levelup');
      this.spawnParticles(h.x, h.y, '#fde047', 30);
      this.addFloatText(h.x, h.y - 24, `${q.chapter || (h.questIdx + 1)}장 완료!`, '#fde047', true);

      h.questIdx++;
      if (h.questIdx >= DATA.QUESTS.length) {
        h.questState = 'all_done';
        this.openDialog([`[200장 대서사시 완결 보상] ${rewardsTxt.join(', ')}`], () => {
          this.state = 'victory'; this.el.victoryScreen.classList.remove('hidden');
        });
      } else {
        h.questState = 'available'; h.questProgress = 0;
        const nextQ = DATA.QUESTS[h.questIdx];
        const seasonBanner = (nextQ && q.season && nextQ.season > q.season)
          ? [`[새로운 부 해금!] ${nextQ.seasonTitle}이(가) 열렸습니다! 대륙의 몬스터들이 각성하며 더 큰 보상을 드롭합니다.`]
          : [];
        this.openDialog([`[퀘스트 보상] ${rewardsTxt.join(', ')}`, ...seasonBanner]);
      }
      this.refreshQuickBar();
      this.saveGame(true);
    }

    giveItem(itemId, qty = 1) {
      const def = DATA.ITEMS[itemId];
      if (!def) return;
      if (['weapon', 'armor', 'helm', 'accessory'].includes(def.type)) {
        for (let i = 0; i < qty; i++) {
          this.hero.bagEquip.push({ uid: 'eq_' + Math.random().toString(36).slice(2, 9), itemId, enh: 0 });
        }
      } else {
        this.hero.bagItems[itemId] = (this.hero.bagItems[itemId] || 0) + qty;
      }
      this.checkCollectQuest();
      this.refreshQuickBar();
    }

    gainExp(amount) {
      const h = this.hero;
      h.exp += amount;
      while (h.exp >= h.expNext) {
        h.exp -= h.expNext;
        h.lv++;
        // Smooth RPG leveling curve supporting Lv.1 through Lv.150+ across 200 chapters & 100 tower floors
        h.expNext = h.lv <= 15
          ? Math.round(60 * Math.pow(1.32, h.lv - 1))
          : Math.round(2900 + (h.lv - 15) * 380 + Math.pow(h.lv - 15, 1.55) * 42);
        h.statPoints += 3;
        h.skillPoints += 1;
        DATA.CLASSES[h.classId].skills.forEach((sk, idx) => {
          if (h.lv >= sk.unlockLv && h.skillLevels[idx] === 0) h.skillLevels[idx] = 1;
        });
        const st = this.getHeroStats();
        h.hp = st.maxHp; h.mp = st.maxMp;
        this.audio.playSfx('levelup');
        this.spawnParticles(h.x, h.y, '#fde047', 34);
        this.effects.push({ type: 'levelup', x: h.x, y: h.y, timer: 0.9, maxTimer: 0.9 });
        this.addFloatText(h.x, h.y - 28, `LEVEL UP! Lv.${h.lv}`, '#fde047', true);
      }
      this.buildSkillSlotUi();
      this.refreshQuickBar();
    }

    // =========================================================
    // ZERO-WHIFF COMBAT: AUTO-AIM + POINT-BLANK + SEPARATION
    // =========================================================
    findNearestMonster(maxRange = 76) {
      let best = null, bestD = maxRange;
      for (const m of this.monsters) {
        if (m.hp <= 0) continue;
        const d = dist(this.hero.x, this.hero.y, m.x, m.y);
        if (d < bestD) { bestD = d; best = m; }
      }
      return best;
    }

    snapAimToNearestTarget(range = 76) {
      const t = this.findNearestMonster(range);
      if (!t) return;
      const dx = t.x - this.hero.x, dy = t.y - this.hero.y;
      const d = Math.hypot(dx, dy);
      if (d > 1) {
        this.hero.facingX = dx / d;
        this.hero.facingY = dy / d;
        if (Math.abs(dx) >= Math.abs(dy)) this.hero.dir = dx < 0 ? 'left' : 'right';
        else this.hero.dir = dy < 0 ? 'up' : 'down';
      }
    }

    getWeaponGlowColor() {
      const enh = this.hero.equip.weapon ? (this.hero.equip.weapon.enh || 0) : 0;
      if (enh >= 20) return '#38bdf8';
      if (enh >= 15) return '#fde047';
      if (enh >= 10) return '#c084fc';
      if (enh >= 7) return '#fb7185';
      if (enh >= 5) return '#fbbf24';
      if (enh >= 3) return '#60a5fa';
      return '#f8fafc';
    }

    performBasicAttack() {
      const h = this.hero;
      if (h.attackCooldown > 0) return;
      const st = this.getHeroStats();

      // Auto-aim toward nearest enemy in melee reach so attacks never whiff awkwardly
      this.snapAimToNearestTarget(72);

      h.comboStep = h.comboResetTimer > 0 ? (h.comboStep + 1) % 3 : 0;
      h.comboResetTimer = 0.72;
      const isFinisher = h.comboStep === 2;
      const speedFactor = clamp(1 - (st.agi * 0.008), 0.72, 1);
      h.attackCooldown = (isFinisher ? 0.33 : 0.23) * speedFactor;
      h.attackTimer = 0.24;
      if (Math.abs(h.facingX) > 0.15) h.lastHorizDir = h.facingX < 0 ? 'left' : 'right';

      this.audio.playSfx(isFinisher ? 'swingHeavy' : 'swing');

      const ang = Math.atan2(h.facingY, h.facingX);
      const reach = isFinisher ? 48 : 40;
      const mult = isFinisher ? 1.4 : (h.comboStep === 1 ? 1.1 : 1.0);
      const color = this.getWeaponGlowColor();

      this.effects.push({
        type: 'slash', x: h.x, y: h.y, angle: ang, radius: reach,
        flip: h.comboStep === 1 ? -1 : 1, heavy: isFinisher, color, timer: 0.16, maxTimer: 0.16
      });

      this.moveEntity(h, h.facingX * (isFinisher ? 6 : 3), h.facingY * (isFinisher ? 6 : 3), 1);
      this.damageMonstersInArc(h.x, h.y, ang, reach + 6, isFinisher ? 1.85 : 1.45, st.atk * mult, isFinisher ? 135 : 85, false);
    }

    triggerDash() {
      const h = this.hero;
      if (h.dashCd > 0) return;
      h.dashTimer = 0.17; h.dashCd = 0.95; h.invulnTimer = Math.max(h.invulnTimer, 0.3);
      this.audio.playSfx('dash');
      this.spawnParticles(h.x, h.y, '#93c5fd', 10);
    }

    useSkill(slotIdx) {
      const h = this.hero;
      this.ensureHeroExtras(h);
      const cls = DATA.CLASSES[h.classId];
      const skillIdx = (h.equippedSkills && typeof h.equippedSkills[slotIdx] === 'number') ? h.equippedSkills[slotIdx] : slotIdx;
      const sk = cls.skills[skillIdx];
      if (!sk) return;
      const skLv = h.skillLevels[skillIdx] || 0;
      if (skLv <= 0) { this.addFloatText(h.x, h.y - 18, `Lv.${sk.unlockLv} 해금`, '#94a3b8'); return; }
      if (h.skillCds[skillIdx] > 0) return;
      if (h.mp < sk.mp) { this.addFloatText(h.x, h.y - 18, 'MP 부족', '#60a5fa'); return; }

      // Auto-aim directional skills cleanly
      if (['cone', 'lunge', 'charge_slash'].includes(sk.type)) this.snapAimToNearestTarget(105);
      else if (['projectile', 'fireball', 'wave_beam', 'fan_knives', 'astral_barrage', 'chain_lightning', 'blink_strike'].includes(sk.type)) this.snapAimToNearestTarget(185);

      const st = this.getHeroStats();
      h.mp -= sk.mp;
      h.castTimer = 0.28;
      if (Math.abs(h.facingX) > 0.15) h.lastHorizDir = h.facingX < 0 ? 'left' : 'right';
      h.skillCds[skillIdx] = Math.max(1.5, sk.cd * (1 - (skLv - 1) * 0.06));
      const lvBoost = (1 + (skLv - 1) * 0.22) * (1 + (st.skillDmg || 0) / 100);
      const basePower = (h.classId === 'runeblade' ? st.magicAtk : st.atk) * sk.mult * lvBoost;
      const ang = Math.atan2(h.facingY, h.facingX);

      // Track 'skill_cast' scenario quest progress!
      if (h.questState === 'active') {
        const q = DATA.QUESTS[h.questIdx];
        if (q && q.type === 'skill_cast') {
          h.questProgress = Math.min(q.goal, h.questProgress + 1);
          if (h.questProgress >= q.goal) {
            h.questState = 'ready';
            this.audio.playSfx('quest');
            this.addFloatText(h.x, h.y - 38, '오의 수련 완료!', '#4ade80', true);
          }
        }
      }

      this.audio.playSfx(h.classId === 'runeblade' ? 'magic' : 'skill');
      this.addFloatText(h.x, h.y - 24, sk.name, sk.color);

      if (sk.type === 'cone') {
        this.shake(0.14, 4);
        this.effects.push({ type: 'slash', x: h.x, y: h.y, angle: ang, radius: sk.range + 10, flip: 1, heavy: true, color: sk.color, timer: 0.24, maxTimer: 0.24 });
        this.damageMonstersInArc(h.x, h.y, ang, sk.range + 12, 2.0, basePower, 165, false, 0.9);
      } else if (sk.type === 'aoe' || sk.type === 'frost' || sk.type === 'poison_nova') {
        this.shake(0.15, 4);
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: sk.radius, color: sk.color, timer: 0.36, maxTimer: 0.36 });
        this.spawnParticles(h.x, h.y, sk.color, 18);
        this.damageMonstersInRadius(h.x, h.y, sk.radius, basePower, 145, sk.type === 'frost' ? 2.5 : (sk.type === 'poison_nova' ? 3.0 : 0));
      } else if (sk.type === 'quake') {
        this.shake(0.24, 6.5);
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: sk.radius, color: sk.color, timer: 0.42, maxTimer: 0.42 });
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: sk.radius * 0.58, color: '#fef08a', timer: 0.3, maxTimer: 0.3 });
        this.spawnParticles(h.x, h.y, '#fb923c', 26);
        this.monsters.forEach((m) => {
          if (dist(h.x, h.y, m.x, m.y) <= sk.radius + m.size * 0.5) {
            this.hitMonster(m, basePower, 210, h.x, h.y, false, 1.4, 0);
          }
        });
      } else if (sk.type === 'buff_def') {
        h.buffDefTimer = sk.duration + (skLv - 1);
        const heal = Math.round(st.maxHp * (0.22 + skLv * 0.04));
        h.hp = Math.min(st.maxHp, h.hp + heal);
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: 38, color: sk.color, timer: 0.35, maxTimer: 0.35 });
        this.addFloatText(h.x, h.y - 12, `+${heal} HP`, '#4ade80');
      } else if (sk.type === 'buff_spd') {
        h.buffSpdTimer = sk.duration + (skLv - 1);
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: 38, color: sk.color, timer: 0.35, maxTimer: 0.35 });
        this.spawnParticles(h.x, h.y, sk.color, 16);
      } else if (sk.type === 'astral_shield') {
        const healHp = Math.round(st.maxHp * 0.28);
        const healMp = Math.round(st.maxMp * 0.34);
        h.hp = Math.min(st.maxHp, h.hp + healHp);
        h.mp = Math.min(st.maxMp, h.mp + healMp);
        h.buffDefTimer = Math.max(h.buffDefTimer, 6);
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: sk.radius, color: sk.color, timer: 0.38, maxTimer: 0.38 });
        this.addFloatText(h.x, h.y - 10, `+${healHp}HP +${healMp}MP`, '#7dd3fc');
        this.damageMonstersInRadius(h.x, h.y, sk.radius, basePower, 200, 1.0);
      } else if (sk.type === 'lunge' || sk.type === 'charge_slash') {
        const distMove = sk.type === 'charge_slash' ? 68 : 42;
        const flipX = (h.lastHorizDir === 'left' || h.dir === 'left') ? -1 : 1;
        this.dashGhosts.push({ x: h.x, y: h.y, flipX, frameIdx: 2, life: 0.22, maxLife: 0.22 });
        this.moveEntity(h, h.facingX * distMove, h.facingY * distMove, 1);
        h.invulnTimer = Math.max(h.invulnTimer, 0.3);
        this.effects.push({ type: 'slash', x: h.x, y: h.y, angle: ang, radius: sk.type === 'charge_slash' ? 64 : 54, flip: 1, heavy: true, color: sk.color, timer: 0.24, maxTimer: 0.24 });
        this.damageMonstersInArc(h.x, h.y, ang, sk.type === 'charge_slash' ? 74 : 60, 1.9, basePower, 145, sk.type === 'lunge', sk.type === 'charge_slash' ? 1.0 : 0);
      } else if (sk.type === 'blink_strike') {
        const tgt = this.findNearestMonster(sk.range || 165);
        const flipX = (h.lastHorizDir === 'left' || h.dir === 'left') ? -1 : 1;
        this.dashGhosts.push({ x: h.x, y: h.y, flipX, frameIdx: 3, life: 0.28, maxLife: 0.28 });
        this.spawnParticles(h.x, h.y, '#2dd4bf', 14);
        if (tgt) {
          const tx = tgt.x + (h.x < tgt.x ? 18 : -18);
          if (this.canStand(tx, tgt.y, 7)) { h.x = tx; h.y = tgt.y; }
          else if (this.canStand(tgt.x, tgt.y + 16, 7)) { h.x = tgt.x; h.y = tgt.y + 16; }
          h.invulnTimer = Math.max(h.invulnTimer, 0.35);
          this.shake(0.18, 5);
          this.effects.push({ type: 'slash', x: tgt.x, y: tgt.y, angle: 0.6, radius: 46, flip: 1, heavy: true, color: '#2dd4bf', timer: 0.24, maxTimer: 0.24 });
          this.effects.push({ type: 'slash', x: tgt.x, y: tgt.y, angle: -0.6, radius: 46, flip: -1, heavy: true, color: '#f43f5e', timer: 0.24, maxTimer: 0.24 });
          this.hitMonster(tgt, basePower, 120, h.x, h.y, true, 0.7, 0);
        } else {
          this.moveEntity(h, h.facingX * 64, h.facingY * 64, 1);
          this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: 44, color: sk.color, timer: 0.28, maxTimer: 0.28 });
        }
      } else if (sk.type === 'projectile' || sk.type === 'fireball') {
        this.projectiles.push({
          from: 'hero', x: h.x + h.facingX * 12, y: h.y + h.facingY * 12,
          vx: h.facingX * 265, vy: h.facingY * 265, radius: sk.type === 'fireball' ? 11 : 10,
          damage: basePower, color: sk.color, pierce: sk.type === 'projectile', explode: sk.type === 'fireball',
          life: 0.85, hitIds: new Set()
        });
      } else if (sk.type === 'wave_beam' || sk.type === 'fan_knives' || sk.type === 'astral_barrage') {
        const count = sk.type === 'wave_beam' ? 3 : 5;
        const spread = sk.type === 'wave_beam' ? 0.28 : 0.2;
        const spd = sk.type === 'fan_knives' ? 310 : 275;
        for (let i = 0; i < count; i++) {
          const offset = (i - (count - 1) / 2) * spread;
          const a = ang + offset;
          this.projectiles.push({
            from: 'hero', x: h.x + Math.cos(a) * 12, y: h.y + Math.sin(a) * 12,
            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
            radius: sk.type === 'wave_beam' ? 11 : 8.5,
            damage: basePower, color: sk.color,
            pierce: sk.type !== 'astral_barrage',
            explode: sk.type === 'astral_barrage',
            life: 0.78, hitIds: new Set()
          });
        }
      } else if (sk.type === 'chain_lightning') {
        const targets = this.monsters
          .filter((m) => m.hp > 0 && dist(h.x, h.y, m.x, m.y) <= (sk.range || 170))
          .sort((a, b) => dist(h.x, h.y, a.x, a.y) - dist(h.x, h.y, b.x, b.y))
          .slice(0, 5);
        this.shake(0.18, 4.5);
        if (targets.length === 0) {
          this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: 72, color: sk.color, timer: 0.3, maxTimer: 0.3 });
        } else {
          targets.forEach((m) => {
            this.effects.push({ type: 'pillar', x: m.x, y: m.y, color: '#60a5fa', timer: 0.34, maxTimer: 0.34 });
            this.spawnParticles(m.x, m.y, '#bae6fd', 12);
            this.hitMonster(m, basePower, 90, h.x, h.y, false, 0.55, 0);
          });
        }
      } else if (sk.type === 'pillars' || sk.type === 'meteor' || sk.type === 'flurry' || sk.type === 'sanctuary' || sk.type === 'eclipse_cross' || sk.type === 'supernova') {
        this.shake(0.28, 7);
        const count = (sk.type === 'sanctuary' || sk.type === 'supernova') ? 8 : (sk.type === 'meteor' ? 5 : 6);
        for (let i = 0; i < count; i++) {
          const a = (Math.PI * 2 * i) / count, r = sk.radius * 0.62;
          const px = h.x + Math.cos(a) * r, py = h.y + Math.sin(a) * r;
          this.effects.push({ type: 'pillar', x: px, y: py, color: sk.color, timer: 0.52, maxTimer: 0.52 });
          this.spawnParticles(px, py, sk.color, 12);
        }
        if (sk.type === 'sanctuary') {
          const heal = Math.round(st.maxHp * 0.3);
          h.hp = Math.min(st.maxHp, h.hp + heal);
          this.addFloatText(h.x, h.y - 14, `+${heal} HP`, '#4ade80');
        }
        if (sk.type === 'eclipse_cross') {
          this.effects.push({ type: 'slash', x: h.x, y: h.y, angle: 0.78, radius: sk.radius * 0.85, flip: 1, heavy: true, color: '#f43f5e', timer: 0.34, maxTimer: 0.34 });
          this.effects.push({ type: 'slash', x: h.x, y: h.y, angle: -0.78, radius: sk.radius * 0.85, flip: -1, heavy: true, color: '#38bdf8', timer: 0.34, maxTimer: 0.34 });
        }
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: sk.radius, color: sk.color, timer: 0.45, maxTimer: 0.45 });
        this.damageMonstersInRadius(h.x, h.y, sk.radius, basePower, 190, 0.7);
      }
      this.refreshQuickBar();
    }

    damageMonstersInArc(ox, oy, dirAng, radius, arcWidth, rawDmg, knock, forceCrit = false, stunSec = 0) {
      this.monsters.forEach((m) => {
        const d = dist(ox, oy, m.x, m.y);
        if (d > radius + m.size * 0.5) return;
        // POINT-BLANK GUARANTEE: overlapping or point-blank enemies ALWAYS get hit!
        if (d <= 24 + m.size * 0.35) {
          this.hitMonster(m, rawDmg, knock, ox, oy, forceCrit, stunSec, 0);
          return;
        }
        let diff = Math.atan2(m.y - oy, m.x - ox) - dirAng;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) <= arcWidth) {
          this.hitMonster(m, rawDmg, knock, ox, oy, forceCrit, stunSec, 0);
        }
      });
    }

    damageMonstersInRadius(ox, oy, radius, rawDmg, knock, slowSec = 0) {
      this.monsters.forEach((m) => {
        if (dist(ox, oy, m.x, m.y) <= radius + m.size * 0.5) {
          this.hitMonster(m, rawDmg, knock, ox, oy, false, slowSec > 0 ? 0.4 : 0, slowSec);
        }
      });
    }

    hitMonster(m, rawDmg, knock, ox, oy, forceCrit = false, stunSec = 0, slowSec = 0) {
      const st = this.getHeroStats();
      const isCrit = forceCrit || Math.random() * 100 < st.crit;
      const dmg = Math.max(2, Math.round((rawDmg * (0.9 + Math.random() * 0.2) - m.def * 0.55) * (isCrit ? 1.65 : 1)));

      m.hp -= dmg; m.hitFlash = 0.14;
      if (stunSec > 0 && !DATA.MONSTERS[m.typeId].isFinalBoss) m.stunTimer = Math.max(m.stunTimer, stunSec);
      if (slowSec > 0) m.slowTimer = Math.max(m.slowTimer, slowSec);

      const dx = m.x - ox, dy = m.y - oy;
      const ang = (Math.hypot(dx, dy) < 1) ? Math.atan2(this.hero.facingY, this.hero.facingX) : Math.atan2(dy, dx);
      const knockMult = DATA.MONSTERS[m.typeId].isBoss ? 0.3 : 1;
      m.vx += Math.cos(ang) * knock * knockMult;
      m.vy += Math.sin(ang) * knock * knockMult;

      this.audio.playSfx(isCrit ? 'crit' : 'hit');
      if (isCrit) this.shake(0.1, 3.5);
      this.spawnParticles(m.x, m.y, isCrit ? '#fde047' : '#f8fafc', isCrit ? 10 : 5);
      this.addFloatText(m.x, m.y - 14, isCrit ? `${dmg}!` : `${dmg}`, isCrit ? '#fde047' : '#ffffff', isCrit);

      // Lifesteal gear passive!
      if (st.lifesteal > 0 && this.hero.hp > 0 && this.hero.hp < st.maxHp) {
        const drain = Math.max(1, Math.round(dmg * (st.lifesteal / 100)));
        this.hero.hp = Math.min(st.maxHp, this.hero.hp + drain);
      }

      if (m.hp <= 0) this.killMonster(m);
    }

    killMonster(m) {
      const def = DATA.MONSTERS[m.typeId];
      const map = DATA.MAPS[this.currentMapId];
      const expGain = m.exp || def.exp;
      const gMin = m.goldMin || def.gold[0];
      const gMax = m.goldMax || def.gold[1];

      this.audio.playSfx('kill');
      this.spawnParticles(m.x, m.y, def.isBoss ? '#f43f5e' : '#fbbf24', def.isBoss ? 38 : 16);
      this.gainExp(expGain);
      this.addFloatText(m.x, m.y - 26, `+${expGain} EXP`, '#fbbf24');

      this.drops.push({ kind: 'gold', amount: randInt(gMin, gMax), x: m.x + randInt(-8, 8), y: m.y + randInt(-8, 8), life: 25 });
      (def.drops || []).forEach((dr) => {
        if (Math.random() <= dr.rate) this.drops.push({ kind: 'item', itemId: dr.id, x: m.x + randInt(-12, 12), y: m.y + randInt(-12, 12), life: 30 });
      });
      // Continent-specific material drops in the 200 World Zones!
      if (map && map.matId && DATA.ITEMS[map.matId] && Math.random() < (def.isBoss ? 0.95 : 0.45)) {
        this.drops.push({ kind: 'item', itemId: map.matId, x: m.x + randInt(-14, 14), y: m.y + randInt(-14, 14), life: 32 });
      }
      if (map && map.bonusMatId && DATA.ITEMS[map.bonusMatId] && Math.random() < (def.isBoss ? 0.9 : 0.35)) {
        this.drops.push({ kind: 'item', itemId: map.bonusMatId, x: m.x + randInt(-14, 14), y: m.y + randInt(-14, 14), life: 32 });
      }

      const h = this.hero;
      // Main 200-chapter story quest kill & boss_hunt tracking
      if (h.questState === 'active') {
        const q = DATA.QUESTS[h.questIdx];
        const isKillMatch = q && q.type === 'kill_any' && ((q.targets && q.targets.includes(m.typeId)) || (q.targetMap && q.targetMap === this.currentMapId));
        const isBossMatch = q && q.type === 'boss_hunt' && (def.isBoss || (q.targets && q.targets.includes(m.typeId)));
        if (isKillMatch || isBossMatch) {
          h.questProgress = Math.min(q.goal, h.questProgress + 1);
          if (h.questProgress >= q.goal) {
            h.questState = 'ready';
            this.audio.playSfx('quest');
            this.addFloatText(h.x, h.y - 32, '퀘스트 목표 달성!', '#4ade80', true);
          }
        }
      }

      // Rotating Guild Bounties kill tracking
      this.ensureHeroExtras(h);
      h.bounties.forEach((bn) => {
        if (bn.progress < bn.goal && bn.targets && bn.targets.includes(m.typeId)) {
          bn.progress = Math.min(bn.goal, bn.progress + 1);
          if (bn.progress === bn.goal) {
            this.addFloatText(h.x, h.y - 42, '서브 의뢰 완료!', '#38bdf8');
          }
        }
      });

      // Abyss Tower Floor Clear Check!
      if (map && map.isTower) {
        const alive = this.monsters.filter((other) => other !== m && other.hp > 0).length;
        if (alive === 0 && !this.towerCleared) {
          this.towerCleared = true;
          const fl = h.towerFloor || 1;
          const firstClear = fl > (h.towerBest || 0);
          if (firstClear) h.towerBest = fl;
          const bonusGold = Math.round((150 + fl * 45) * (fl % 5 === 0 ? 2 : 1));
          const bonusExp = Math.round((180 + fl * 55) * (fl % 5 === 0 ? 2 : 1));
          const enhQty = fl % 5 === 0 ? 3 : 1;
          const starDustQty = fl % 5 === 0 ? (fl >= 50 ? 2 : 1) : 0;
          h.gold += bonusGold;
          this.gainExp(bonusExp);
          this.giveItem('mat_enhance', enhQty);
          if (starDustQty > 0 && DATA.ITEMS.mat_star_dust) {
            this.giveItem('mat_star_dust', starDustQty);
          }
          this.checkCollectQuest();
          this.audio.playSfx('levelup');
          this.saveGame(true);

          const nextFl = fl < 100 ? fl + 1 : 100;
          const starTxt = starDustQty > 0 ? ` · 성좌의 은하수 가루 x${starDustQty}` : '';
          this.openDialog([
            `[심연의 탑 ${fl}층 돌파!] ${firstClear ? '최초 클리어 달성! ' : ''}${bonusGold.toLocaleString()}G · EXP +${bonusExp.toLocaleString()} · 강화석 x${enhQty}${starTxt}`,
            fl < 100
              ? `[안내] 터치하면 즉시 ${nextFl}층으로 올라갑니다! (마을로 돌아가려면 남쪽 포털을 이용하세요)`
              : '[축하합니다!] 심연의 탑 100층을 모두 정복하셨습니다!'
          ], () => {
            if (fl < 100 && this.currentMapId === 'tower') {
              this.enterTowerFloor(nextFl);
            }
          });
        }
        return;
      }

      if (def.isFinalBoss && this.currentMapId === 'altar') {
        h.vargasDefeated = true;
        this.shake(0.4, 8);
        this.openDialog([
          '심연의 기사 바르가스: "크으윽... 솔티아의 바람이 이토록 강할 줄이야...!"',
          '[알림] 바르가스를 격파했습니다! 좌상단 황금 퀘스트 배지를 터치해 이야기를 이어가세요.'
        ]);
        this.saveGame(true);
      } else {
        this.respawnQueue.push({ typeId: m.typeId, spawnIdx: m.spawnIdx, x: m.homeX, y: m.homeY, timer: def.isBoss ? 20 : 10 });
      }
    }

    damageHero(rawDmg, srcX, srcY) {
      const h = this.hero;
      if (h.invulnTimer > 0 || this.state !== 'playing') return;
      const st = this.getHeroStats();
      const dmg = Math.max(1, Math.round(rawDmg * (0.9 + Math.random() * 0.2) - st.def * 0.65));
      h.hp -= dmg; h.invulnTimer = 0.55;
      this.audio.playSfx('hurt'); this.shake(0.14, 4.5);
      this.spawnParticles(h.x, h.y, '#ef4444', 10);
      this.addFloatText(h.x, h.y - 16, `-${dmg}`, '#f87171', true);

      const ang = Math.atan2(h.y - srcY, h.x - srcX);
      this.moveEntity(h, Math.cos(ang) * 14, Math.sin(ang) * 14, 1);

      if (h.hp <= 0) { h.hp = 0; this.state = 'gameover'; this.el.gameoverScreen.classList.remove('hidden'); }
    }

    useQuickPotion(kind) {
      if (!this.hero || this.state !== 'playing') return;
      const h = this.hero, st = this.getHeroStats();
      const order = kind === 'hp'
        ? ['pot_hp_mythic', 'pot_hp_xl', 'pot_hp_l', 'pot_hp_m', 'pot_hp_s']
        : ['pot_mp_mythic', 'pot_mp_xl', 'pot_mp_l', 'pot_mp_s'];
      const chosen = order.find((id) => (h.bagItems[id] || 0) > 0);
      if (!chosen) { this.addFloatText(h.x, h.y - 16, kind === 'hp' ? 'HP 포션 없음' : 'MP 포션 없음', '#94a3b8'); return; }
      const item = DATA.ITEMS[chosen];
      if (kind === 'hp' && h.hp >= st.maxHp) return;
      if (kind === 'mp' && h.mp >= st.maxMp) return;

      h.bagItems[chosen]--;
      if (kind === 'hp') { h.hp = Math.min(st.maxHp, h.hp + item.power); this.addFloatText(h.x, h.y - 16, `+${item.power} HP`, '#4ade80'); }
      else { h.mp = Math.min(st.maxMp, h.mp + item.power); this.addFloatText(h.x, h.y - 16, `+${item.power} MP`, '#60a5fa'); }
      this.audio.playSfx('potion');
      this.spawnParticles(h.x, h.y, kind === 'hp' ? '#4ade80' : '#60a5fa', 12);
      this.refreshQuickBar();
    }

    useReturnScroll() {
      if (!this.hero || this.state !== 'playing') return;
      const curMap = DATA.MAPS[this.currentMapId];
      const targetTown = (curMap && curMap.continentId >= 2 && !curMap.isTown && DATA.MAPS[`town_${curMap.continentId}`])
        ? `town_${curMap.continentId}`
        : 'town';
      if (this.currentMapId === targetTown) {
        this.addFloatText(this.hero.x, this.hero.y - 16, '이미 솔티아 마을입니다', '#cbd5e1');
        return;
      }
      if ((this.hero.bagItems.scroll_town || 0) <= 0) { this.addFloatText(this.hero.x, this.hero.y - 16, '귀환 주문서 없음', '#94a3b8'); return; }
      this.hero.bagItems.scroll_town--;
      this.audio.playSfx('portal');
      this.loadMap(targetTown, 11.5, 11.5);
      this.refreshQuickBar();
      this.saveGame(true);
    }

    // --- COLLISION & SOFT BODY SEPARATION ---
    isTileSolid(tx, ty) {
      const map = DATA.MAPS[this.currentMapId];
      if (ty < 0 || ty >= map.layout.length || tx < 0 || tx >= map.layout[0].length) return true;
      return DATA.SOLID_TILES.has(map.layout[ty][tx]);
    }

    canStand(x, y, half = 7) {
      const pts = [[x - half, y - half], [x + half, y - half], [x - half, y + half], [x + half, y + half]];
      for (const [px, py] of pts) {
        if (this.isTileSolid(Math.floor(px / TILE), Math.floor(py / TILE))) return false;
      }
      return true;
    }

    moveEntity(ent, dx, dy, dt) {
      const nx = ent.x + dx * dt;
      if (this.canStand(nx, ent.y, 7)) ent.x = nx;
      const ny = ent.y + dy * dt;
      if (this.canStand(ent.x, ny, 7)) ent.y = ny;
    }

    resolveEntitySeparation() {
      const h = this.hero;
      // 1. Hero <-> Monster soft body separation (prevents stacking/overlapping; Dash passes through!)
      if (h.dashTimer <= 0) {
        for (const m of this.monsters) {
          if (m.hp <= 0) continue;
          const minSep = 11 + m.size * 0.34;
          let dx = m.x - h.x, dy = m.y - h.y;
          let d = Math.hypot(dx, dy);
          if (d < minSep) {
            if (d < 0.01) { dx = h.facingX || 1; dy = h.facingY || 0; d = 1; }
            const overlap = minSep - d;
            const nx = dx / d, ny = dy / d;
            // Push monster mostly outward, hero gently back (smooth elastic feel, never gets stuck!)
            this.moveEntity(m, nx * overlap * 0.72, ny * overlap * 0.72, 1);
            this.moveEntity(h, -nx * overlap * 0.28, -ny * overlap * 0.28, 1);
          }
        }
      }
      // 2. Monster <-> Monster separation (packs spread naturally)
      for (let i = 0; i < this.monsters.length; i++) {
        const a = this.monsters[i];
        if (a.hp <= 0) continue;
        for (let j = i + 1; j < this.monsters.length; j++) {
          const b = this.monsters[j];
          if (b.hp <= 0) continue;
          const minSep = (a.size + b.size) * 0.34;
          let dx = b.x - a.x, dy = b.y - a.y;
          let d = Math.hypot(dx, dy);
          if (d < minSep) {
            if (d < 0.01) { dx = 1; dy = 0; d = 1; }
            const push = (minSep - d) * 0.45;
            const nx = dx / d, ny = dy / d;
            this.moveEntity(a, -nx * push, -ny * push, 1);
            this.moveEntity(b, nx * push, ny * push, 1);
          }
        }
      }
    }

    // --- UPDATE LOOP ---
    update(dt) {
      this.time += dt;
      if (this.shakeTimer > 0) this.shakeTimer = Math.max(0, this.shakeTimer - dt);
      if (this.bannerTimer > 0) {
        this.bannerTimer = Math.max(0, this.bannerTimer - dt);
        if (this.bannerTimer === 0 && this.el.mapBanner) {
          this.el.mapBanner.classList.remove('show');
        }
      }
      if (!this.hero) return;

      this.syncHtmlHud();
      if (this.state !== 'playing') return;

      const h = this.hero, st = this.getHeroStats(), map = DATA.MAPS[this.currentMapId];
      h.mp = Math.min(st.maxMp, h.mp + ((map.safe ? 8 : 1.8) + (st.mpRegen || 0)) * dt);
      if (map.safe) h.hp = Math.min(st.maxHp, h.hp + 12 * dt);

      if (h.attackTimer > 0) h.attackTimer = Math.max(0, h.attackTimer - dt);
      if (h.castTimer > 0) h.castTimer = Math.max(0, h.castTimer - dt);
      if (h.attackCooldown > 0) h.attackCooldown = Math.max(0, h.attackCooldown - dt);
      if (h.comboResetTimer > 0) h.comboResetTimer = Math.max(0, h.comboResetTimer - dt);
      if (h.invulnTimer > 0) h.invulnTimer = Math.max(0, h.invulnTimer - dt);
      if (h.dashTimer > 0) h.dashTimer = Math.max(0, h.dashTimer - dt);
      if (h.dashCd > 0) h.dashCd = Math.max(0, h.dashCd - dt);
      if (h.buffAtkTimer > 0) h.buffAtkTimer = Math.max(0, h.buffAtkTimer - dt);
      if (h.buffDefTimer > 0) h.buffDefTimer = Math.max(0, h.buffDefTimer - dt);
      if (h.buffSpdTimer > 0) h.buffSpdTimer = Math.max(0, h.buffSpdTimer - dt);
      for (let i = 0; i < (h.skillCds ? h.skillCds.length : 4); i++) {
        if (h.skillCds[i] > 0) h.skillCds[i] = Math.max(0, h.skillCds[i] - dt);
      }

      for (let i = this.dashGhosts.length - 1; i >= 0; i--) {
        this.dashGhosts[i].life -= dt;
        if (this.dashGhosts[i].life <= 0) this.dashGhosts.splice(i, 1);
      }

      let ix = 0, iy = 0;
      if (this.keys.ArrowLeft || this.keys.KeyA || this.virtualDir.left) ix -= 1;
      if (this.keys.ArrowRight || this.keys.KeyD || this.virtualDir.right) ix += 1;
      if (this.keys.ArrowUp || this.keys.KeyW || this.virtualDir.up) iy -= 1;
      if (this.keys.ArrowDown || this.keys.KeyS || this.virtualDir.down) iy += 1;
      if (ix === 0 && iy === 0 && (Math.abs(this.stickX) > 0.1 || Math.abs(this.stickY) > 0.1)) { ix = this.stickX; iy = this.stickY; }

      if (h.dashTimer > 0) {
        this.moveEntity(h, h.facingX * st.speed * 2.55, h.facingY * st.speed * 2.55, dt);
        const flipX = (h.lastHorizDir === 'left' || h.dir === 'left') ? -1 : 1;
        if (this.dashGhosts.length === 0 || dist(h.x, h.y, this.dashGhosts[this.dashGhosts.length - 1].x, this.dashGhosts[this.dashGhosts.length - 1].y) > 9) {
          this.dashGhosts.push({ x: h.x, y: h.y, flipX, frameIdx: 2, life: 0.22, maxLife: 0.22 });
        }
        if (Math.random() < 0.45) this.particles.push({ x: h.x, y: h.y + 8, vx: -h.facingX * 18, vy: -6, color: '#93c5fd', size: 3.5, life: 0.18, maxLife: 0.18 });
      } else if (ix !== 0 || iy !== 0) {
        const len = Math.hypot(ix, iy), mag = Math.min(1, len), nx = ix / len, ny = iy / len;
        h.facingX = nx; h.facingY = ny;
        if (Math.abs(nx) > 0.15) h.lastHorizDir = nx < 0 ? 'left' : 'right';
        if (Math.abs(nx) >= Math.abs(ny)) h.dir = nx < 0 ? 'left' : 'right';
        else h.dir = ny < 0 ? 'up' : 'down';
        h.walkAnim += dt * (4.2 + mag * 2.8);
        const stepBeat = Math.floor(h.walkAnim) % 4;
        if (stepBeat !== this.lastRunStep) {
          this.lastRunStep = stepBeat;
          if (stepBeat === 0 || stepBeat === 2) {
            this.particles.push({
              x: h.x - nx * 4, y: h.y + 11,
              vx: -nx * 14 + (Math.random() - 0.5) * 8,
              vy: -6 - Math.random() * 6,
              color: 'rgba(226, 232, 240, 0.7)',
              size: 3.2, life: 0.24, maxLife: 0.24
            });
          }
        }
        this.moveEntity(h, nx * st.speed * mag, ny * st.speed * mag, dt);
      } else {
        this.lastRunStep = -1;
      }

      if (this.holdingAttack && h.attackCooldown <= 0) this.performBasicAttack();

      for (const p of map.portals || []) {
        if (dist(h.x, h.y, p.tx * TILE, p.ty * TILE) < 16) {
          this.audio.playSfx('portal'); this.loadMap(p.toMap, p.toX, p.toY); this.saveGame(true); return;
        }
      }

      for (let i = this.respawnQueue.length - 1; i >= 0; i--) {
        this.respawnQueue[i].timer -= dt;
        if (this.respawnQueue[i].timer <= 0) {
          const r = this.respawnQueue.splice(i, 1)[0];
          this.spawnMonster(r.typeId, r.x, r.y, r.spawnIdx);
        }
      }

      this.updateMonsters(dt);
      this.resolveEntitySeparation();
      this.lockedTarget = this.findNearestMonster(82);
      this.updateMobileInteractHint();

      for (let i = this.telegraphs.length - 1; i >= 0; i--) {
        const t = this.telegraphs[i];
        t.timer -= dt;
        if (t.timer <= 0) {
          this.telegraphs.splice(i, 1);
          this.shake(0.18, 5); this.audio.playSfx('bossRoar');
          this.effects.push({ type: 'ring', x: t.x, y: t.y, maxRadius: t.radius, color: '#f43f5e', timer: 0.35, maxTimer: 0.35 });
          this.spawnParticles(t.x, t.y, '#f43f5e', 20);
          if (dist(h.x, h.y, t.x, t.y) <= t.radius + 6) this.damageHero(t.damage, t.x, t.y);
        }
      }

      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const pr = this.projectiles[i];
        pr.life -= dt; pr.x += pr.vx * dt; pr.y += pr.vy * dt;
        let remove = pr.life <= 0 || this.isTileSolid(Math.floor(pr.x / TILE), Math.floor(pr.y / TILE));
        if (!remove && pr.from === 'hero') {
          for (const m of this.monsters) {
            if (pr.hitIds.has(m.uid)) continue;
            if (dist(pr.x, pr.y, m.x, m.y) < pr.radius + m.size * 0.48) {
              pr.hitIds.add(m.uid);
              this.hitMonster(m, pr.damage, 85, pr.x, pr.y);
              if (pr.explode) {
                this.effects.push({ type: 'ring', x: pr.x, y: pr.y, maxRadius: 44, color: pr.color, timer: 0.25, maxTimer: 0.25 });
                this.damageMonstersInRadius(pr.x, pr.y, 42, pr.damage * 0.55, 90);
                remove = true; break;
              }
              if (!pr.pierce) { remove = true; break; }
            }
          }
        } else if (!remove && pr.from === 'enemy') {
          if (dist(pr.x, pr.y, h.x, h.y) < pr.radius + 9) { this.damageHero(pr.damage, pr.x, pr.y); remove = true; }
        }
        if (remove) this.projectiles.splice(i, 1);
      }

      for (let i = this.drops.length - 1; i >= 0; i--) {
        const d = this.drops[i];
        d.life -= dt;
        const dd = dist(h.x, h.y, d.x, d.y);
        if (dd < 58) {
          d.x += ((h.x - d.x) / Math.max(1, dd)) * 175 * dt;
          d.y += ((h.y - d.y) / Math.max(1, dd)) * 175 * dt;
        }
        if (dd < 14) {
          if (d.kind === 'gold') {
            h.gold += d.amount; this.audio.playSfx('coin');
            this.addFloatText(h.x, h.y - 16, `+${d.amount}G`, '#fde047');
          } else {
            this.giveItem(d.itemId, 1); this.audio.playSfx('coin');
            const it = DATA.ITEMS[d.itemId];
            this.addFloatText(h.x, h.y - 20, `${it.name}`, DATA.RARITY[it.rarity].color);
          }
          this.drops.splice(i, 1);
        } else if (d.life <= 0) this.drops.splice(i, 1);
      }

      for (let i = this.effects.length - 1; i >= 0; i--) { this.effects[i].timer -= dt; if (this.effects[i].timer <= 0) this.effects.splice(i, 1); }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i]; p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floatTexts.length - 1; i >= 0; i--) {
        const ft = this.floatTexts[i]; ft.life -= dt; ft.y -= 26 * dt;
        if (ft.life <= 0) this.floatTexts.splice(i, 1);
      }

      this.updateCamera(false);
      this.updateQuickSlotCooldowns();
    }

    updateMonsters(dt) {
      const h = this.hero;
      for (let i = this.monsters.length - 1; i >= 0; i--) {
        const m = this.monsters[i];
        if (m.hp <= 0) { this.monsters.splice(i, 1); continue; }
        const def = DATA.MONSTERS[m.typeId];
        m.anim += dt * 4.5;
        if (m.hitFlash > 0) m.hitFlash = Math.max(0, m.hitFlash - dt);
        if (m.stunTimer > 0) m.stunTimer = Math.max(0, m.stunTimer - dt);
        if (m.slowTimer > 0) m.slowTimer = Math.max(0, m.slowTimer - dt);
        if (m.attackCd > 0) m.attackCd = Math.max(0, m.attackCd - dt);
        if (m.specialCd > 0) m.specialCd = Math.max(0, m.specialCd - dt);

        if (Math.hypot(m.vx, m.vy) > 4) {
          this.moveEntity(m, m.vx, m.vy, dt);
          m.vx *= Math.pow(0.05, dt); m.vy *= Math.pow(0.05, dt);
        }
        if (m.stunTimer > 0) continue;

        const dHero = dist(m.x, m.y, h.x, h.y);
        const spd = m.speed * (m.slowTimer > 0 ? 0.5 : 1) * (m.phase2 ? 1.25 : 1);

        if (def.isFinalBoss && !m.phase2 && m.hp < m.maxHp * 0.5) {
          m.phase2 = true; this.audio.playSfx('bossRoar'); this.shake(0.3, 6);
          this.addFloatText(m.x, m.y - 26, '심연의 힘 해방!', '#f43f5e', true);
          this.spawnParticles(m.x, m.y, '#f43f5e', 28);
        }

        if (dHero < def.aggro) {
          const ang = Math.atan2(h.y - m.y, h.x - m.x);
          const stopDist = 11 + m.size * 0.35; // Stop at melee contact range instead of walking directly inside hero
          if (def.ai === 'ranged') {
            if (dHero > 105) this.moveEntity(m, Math.cos(ang) * spd, Math.sin(ang) * spd, dt);
            else if (dHero < 64) this.moveEntity(m, -Math.cos(ang) * spd * 0.7, -Math.sin(ang) * spd * 0.7, dt);
            if (m.attackCd <= 0) {
              m.attackCd = 2.0;
              this.projectiles.push({ from: 'enemy', x: m.x, y: m.y, vx: Math.cos(ang) * 145, vy: Math.sin(ang) * 145, radius: 6, damage: m.atk, color: def.projColor || '#f43f5e', life: 2.0 });
            }
          } else if (def.ai === 'miniboss' || def.ai === 'boss') {
            if (dHero > stopDist) this.moveEntity(m, Math.cos(ang) * spd, Math.sin(ang) * spd, dt);
            if (m.specialCd <= 0) {
              m.specialCd = m.phase2 ? 3.2 : 4.4;
              if (def.isFinalBoss && Math.random() < 0.5) {
                const count = m.phase2 ? 10 : 6;
                for (let k = 0; k < count; k++) {
                  const a = (Math.PI * 2 * k) / count + this.time;
                  this.projectiles.push({ from: 'enemy', x: m.x, y: m.y, vx: Math.cos(a) * 130, vy: Math.sin(a) * 130, radius: 6, damage: m.atk * 0.9, color: '#f43f5e', life: 2.2 });
                }
                this.audio.playSfx('magic');
              } else {
                this.telegraphs.push({ x: h.x, y: h.y, radius: def.isFinalBoss ? 52 : 42, damage: m.atk * 1.35, timer: 0.95, maxTimer: 0.95 });
              }
            }
          } else {
            const chargeMult = (def.ai === 'charger' && dHero < 90) ? 1.35 : 1;
            if (dHero > stopDist) this.moveEntity(m, Math.cos(ang) * spd * chargeMult, Math.sin(ang) * spd * chargeMult, dt);
          }

          if (dHero < stopDist + 7 && m.attackCd <= 0) {
            m.attackCd = def.isBoss ? 0.9 : 1.1;
            this.damageHero(m.atk, m.x, m.y);
          }
        } else {
          m.wanderTimer -= dt;
          if (m.wanderTimer <= 0) {
            m.wanderTimer = 1.6 + Math.random() * 2.0;
            const dHome = dist(m.x, m.y, m.homeX, m.homeY);
            m.wanderAngle = dHome > 60 ? Math.atan2(m.homeY - m.y, m.homeX - m.x) : Math.random() * Math.PI * 2;
          }
          this.moveEntity(m, Math.cos(m.wanderAngle) * spd * 0.35, Math.sin(m.wanderAngle) * spd * 0.35, dt);
        }
      }
    }

    updateCamera(snap = false) {
      const map = DATA.MAPS[this.currentMapId];
      const mapW = map.layout[0].length * TILE, mapH = map.layout.length * TILE;
      const isPortrait = this.viewW < this.viewH;
      const hasPad = this.padMode !== 'off';
      // Keep hero comfortably framed in the unobstructed center zone above bottom controls & below top HUD
      const padTop = isPortrait ? 46 : 26;
      const padBottom = hasPad ? (isPortrait ? 114 : 66) : 26;
      const centerRatioY = hasPad ? (isPortrait ? 0.42 : 0.45) : 0.5;

      const tx = clamp(this.hero.x - this.viewW / 2, 0, Math.max(0, mapW - this.viewW));
      const minY = -padTop;
      const maxY = Math.max(0, mapH - this.viewH) + padBottom;
      const ty = clamp(this.hero.y - this.viewH * centerRatioY, minY, maxY);
      if (snap) { this.camX = tx; this.camY = ty; }
      else { this.camX += (tx - this.camX) * 0.16; this.camY += (ty - this.camY) * 0.16; }
    }

    shake(duration, mag) { this.shakeTimer = Math.max(this.shakeTimer, duration); this.shakeMag = Math.max(this.shakeMag, mag); }

    spawnParticles(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, sp = 24 + Math.random() * 88;
        this.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, color, size: 2 + Math.random() * 2.5, life: 0.25 + Math.random() * 0.32, maxLife: 0.55 });
      }
    }

    addFloatText(x, y, text, color = '#fff', big = false) {
      this.floatTexts.push({ x, y, text, color, big, life: 0.95, maxLife: 0.95 });
    }

    // --- RETINA HTML HUD SYNC ---
    syncHtmlHud() {
      const h = this.hero, st = this.getHeroStats(), map = DATA.MAPS[this.currentMapId];
      this.el.hudLv.textContent = h.lv;
      this.el.hudName.textContent = h.title ? `${h.name} ★` : h.name;
      this.el.hudGold.textContent = `${h.gold.toLocaleString()} G`;
      this.el.hudHpFill.style.width = `${clamp((h.hp / st.maxHp) * 100, 0, 100)}%`;
      this.el.hudHpText.textContent = `${Math.ceil(h.hp)} / ${st.maxHp}`;
      this.el.hudMpFill.style.width = `${clamp((h.mp / st.maxMp) * 100, 0, 100)}%`;
      this.el.hudMpText.textContent = `${Math.ceil(h.mp)} / ${st.maxMp}`;
      this.el.hudExpFill.style.width = `${clamp((h.exp / h.expNext) * 100, 0, 100)}%`;
      this.el.hudMapName.textContent = map.isTower ? `심연의 탑 ${h.towerFloor || 1}층` : map.name;

      let qText = '', isReady = false;
      if (h.questState === 'all_done') qText = '200장 완결 · 영원의 영웅';
      else {
        const q = DATA.QUESTS[h.questIdx];
        if (q) {
          if (h.questState === 'available') { qText = `터치해 시작 · ${q.title}`; isReady = true; }
          else if (h.questState === 'active') qText = q.type === 'talk' ? `${q.title}` : `${q.title} (${h.questProgress}/${q.goal})`;
          else if (h.questState === 'ready') { qText = `완료 보고! · ${q.title}`; isReady = true; }
        }
      }
      this.el.hudQuestText.textContent = qText;
      if (this.el.hudQuestPill) this.el.hudQuestPill.classList.toggle('ready', isReady);

      const boss = this.monsters.find((m) => (DATA.MONSTERS[m.typeId].isBoss || m.customName) && m.hp > 0);
      if (boss) {
        const bdef = DATA.MONSTERS[boss.typeId];
        this.el.hudBossBar.classList.remove('hidden');
        this.el.hudBossName.textContent = `${boss.customName || bdef.name} Lv.${boss.customLv || bdef.lv}`;
        const pct = clamp(Math.round((boss.hp / boss.maxHp) * 100), 0, 100);
        this.el.hudBossHpTxt.textContent = `${pct}%`;
        this.el.hudBossFill.style.width = `${pct}%`;
      } else {
        this.el.hudBossBar.classList.add('hidden');
      }
    }

    // Helper: smooth rounded pill path (zero sharp pixel boxes)
    roundPill(ctx, x, y, w, h, r) {
      const rad = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rad, y);
      ctx.arcTo(x + w, y, x + w, y + h, rad);
      ctx.arcTo(x + w, y + h, x, y + h, rad);
      ctx.arcTo(x, y + h, x, y, rad);
      ctx.arcTo(x, y, x + w, y, rad);
      ctx.closePath();
    }

    // --- CANVAS RENDERING (FULL RETINA HiDPI) ---
    render() {
      const ctx = this.ctx;
      const scaleX = this.canvas.width / this.viewW;
      const scaleY = this.canvas.height / this.viewH;
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.fillStyle = '#0d111a';
      ctx.fillRect(0, 0, this.viewW, this.viewH);

      if (!this.hero) { this.renderTitleBackdrop(ctx); return; }

      const map = DATA.MAPS[this.currentMapId];
      const sx = this.shakeTimer > 0 ? (Math.random() * 2 - 1) * this.shakeMag : 0;
      const sy = this.shakeTimer > 0 ? (Math.random() * 2 - 1) * this.shakeMag : 0;

      ctx.save();
      ctx.translate(-(this.camX + sx), -(this.camY + sy));

      const waterFrame = Math.floor(this.time * 2.5) % 2;
      for (let ty = 0; ty < map.layout.length; ty++) {
        const row = map.layout[ty];
        for (let tx = 0; tx < row.length; tx++) {
          const ch = row[tx], px = tx * TILE, py = ty * TILE;
          let base = this.sprites.tiles.grass;
          if (ch === ';' || ch === 'D') base = this.sprites.tiles.darkGrass;
          else if (ch === 's' || ch === 'P') base = this.sprites.tiles.sand;
          else if (ch === 'r' || ch === 'C' || ch === 'L') base = this.sprites.tiles.redRock;
          else if (ch === 'b' || ch === 'B') base = this.sprites.tiles.citadelFloor;
          else if (ch === '_' || ch === '*' || ch === '#') base = this.sprites.tiles.ruinFloor;
          else if (ch === 'a' || ch === 'X') base = this.sprites.tiles.altarFloor;
          else if (ch === 'c' || ch === 'F') base = this.sprites.tiles.cobble;
          else if (ch === 'n' || ch === 'I') base = this.sprites.tiles.snow;
          else if (ch === 'k' || ch === 'K') base = this.sprites.tiles.skyFloor;
          else if (ch === 'm' || ch === 'M') base = this.sprites.tiles.swamp;
          else if (ch === 'v' || ch === 'V') base = this.sprites.tiles.voidFloor;
          ctx.drawImage(base, px, py, TILE + 0.4, TILE + 0.4);

          const tileMap = {
            ',': this.sprites.tiles.flower, 'p': this.sprites.tiles.path, 'c': this.sprites.tiles.cobble,
            '~': waterFrame ? this.sprites.tiles.water1 : this.sprites.tiles.water0, '=': this.sprites.tiles.bridge,
            'T': this.sprites.tiles.tree, 'D': this.sprites.tiles.darkTree, 'R': this.sprites.tiles.houseRoof,
            'W': this.sprites.tiles.houseWall, 'd': this.sprites.tiles.houseDoor,
            'F': waterFrame ? this.sprites.tiles.fountain1 : this.sprites.tiles.fountain0,
            '#': this.sprites.tiles.wall, '*': this.sprites.tiles.ruinRune, 'X': this.sprites.tiles.altarWall,
            's': this.sprites.tiles.sand, 'P': this.sprites.tiles.palm,
            'r': this.sprites.tiles.redRock, 'C': this.sprites.tiles.canyonWall, 'L': this.sprites.tiles.lava,
            'b': this.sprites.tiles.citadelFloor, 'B': this.sprites.tiles.citadelWall,
            'n': this.sprites.tiles.snow, 'I': this.sprites.tiles.iceWall,
            'k': this.sprites.tiles.skyFloor, 'K': this.sprites.tiles.skyVoid,
            'm': this.sprites.tiles.swamp, 'M': this.sprites.tiles.swampTree,
            'v': this.sprites.tiles.voidFloor, 'V': this.sprites.tiles.voidWall
          };
          if (tileMap[ch]) ctx.drawImage(tileMap[ch], px, py, TILE + 0.4, TILE + 0.4);
        }
      }

      // Portals with luminous arcane ring & sleek glass pill label
      for (const p of map.portals || []) {
        const px = p.tx * TILE, py = p.ty * TILE, pulse = 0.65 + Math.sin(this.time * 4.5) * 0.25;
        ctx.save();
        const pg = ctx.createRadialGradient(px, py, 2, px, py, 14);
        pg.addColorStop(0, `rgba(186, 230, 253, ${pulse * 0.7})`);
        pg.addColorStop(0.6, `rgba(96, 165, 250, ${pulse * 0.35})`);
        pg.addColorStop(1, 'rgba(96, 165, 250, 0)');
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.9)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(px, py, 10 + Math.sin(this.time * 4) * 1.5, 0, Math.PI * 2); ctx.stroke();

        ctx.font = '700 8px -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        const w = ctx.measureText(p.label).width + 10;
        this.roundPill(ctx, px - w / 2, py - 24, w, 12, 6);
        ctx.fillStyle = 'rgba(13, 16, 24, 0.78)'; ctx.fill();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)'; ctx.lineWidth = 0.7; ctx.stroke();
        ctx.fillStyle = '#fef3c7'; ctx.fillText(p.label, px, py - 15.5);
        ctx.restore();
      }

      for (const ch of map.chests || []) {
        ctx.drawImage(this.hero.openedChests[ch.id] ? this.sprites.tiles.chestOpen : this.sprites.tiles.chestClosed, ch.tx * TILE, ch.ty * TILE, TILE, TILE);
      }

      // Target Lock Indicator Ring under nearest enemy in melee reach
      if (this.lockedTarget && this.lockedTarget.hp > 0) {
        const t = this.lockedTarget;
        const r = t.size * 0.48 + Math.sin(this.time * 8) * 1.4;
        ctx.save();
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.9)';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(t.x, t.y + t.size * 0.34, r, r * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }

      for (const t of this.telegraphs) {
        const prog = 1 - t.timer / t.maxTimer;
        ctx.save();
        ctx.fillStyle = `rgba(244, 63, 94, ${0.16 + prog * 0.26})`;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fb7185'; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.34)';
        ctx.beginPath(); ctx.arc(t.x, t.y, t.radius * prog, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Glowing Gold Coins & Faceted Loot Gems
      for (const d of this.drops) {
        const bob = Math.sin(this.time * 6 + d.x) * 2;
        ctx.save();
        if (d.kind === 'gold') {
          ctx.fillStyle = 'rgba(251,191,36,0.32)';
          ctx.beginPath(); ctx.arc(d.x, d.y + bob, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(d.x, d.y + bob, 3.8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(d.x - 1, d.y + bob - 1, 1.4, 0, Math.PI * 2); ctx.fill();
        } else {
          const col = DATA.RARITY[DATA.ITEMS[d.itemId].rarity].color;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y + bob - 5); ctx.lineTo(d.x + 4.5, d.y + bob);
          ctx.lineTo(d.x, d.y + bob + 5); ctx.lineTo(d.x - 4.5, d.y + bob); ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8; ctx.stroke();
        }
        ctx.restore();
      }

      const renderables = [];
      (map.npcs || []).forEach((n) => renderables.push({ kind: 'npc', y: n.ty * TILE, data: n }));
      this.monsters.forEach((m) => renderables.push({ kind: 'monster', y: m.y, data: m }));
      renderables.push({ kind: 'hero', y: this.hero.y, data: this.hero });
      renderables.sort((a, b) => a.y - b.y);
      for (const r of renderables) {
        if (r.kind === 'npc') this.drawNpc(ctx, r.data);
        else if (r.kind === 'monster') this.drawMonster(ctx, r.data);
        else this.drawHero(ctx);
      }

      for (const pr of this.projectiles) {
        ctx.save();
        ctx.shadowColor = pr.color; ctx.shadowBlur = 6;
        ctx.fillStyle = pr.color; ctx.beginPath(); ctx.arc(pr.x, pr.y, pr.radius * 0.78, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(pr.x, pr.y, pr.radius * 0.38, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      this.drawEffects(ctx);

      // Smooth Luminous Circular Particles (Zero Square Pixels)
      for (const p of this.particles) {
        ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.2, p.size * 0.55), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Crisp Outlined Modern Floating Combat Numbers
      for (const ft of this.floatTexts) {
        ctx.save();
        ctx.globalAlpha = clamp(ft.life / ft.maxLife, 0, 1);
        ctx.font = ft.big
          ? '900 11.5px -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif'
          : '800 9.5px -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2.4;
        ctx.strokeStyle = 'rgba(10, 12, 18, 0.88)';
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();

      // Region-themed drifting atmospheric wind motes / fireflies
      ctx.save();
      const moteColor = (map.id === 'canyon' || map.id === 'altar') ? '253,186,116'
        : (map.id === 'tower' || map.id === 'citadel' ? '147,197,253' : '255,242,196');
      for (let i = 0; i < 14; i++) {
        const seed = i * 73.13;
        const speed = 10 + (i % 5) * 4;
        const mx = ((seed * 17 + this.time * speed) % (this.viewW + 40)) - 20;
        const my = ((seed * 29 - this.time * (speed * 0.45) + Math.sin(this.time * 1.4 + i) * 14) % (this.viewH + 40) + this.viewH + 40) % (this.viewH + 40) - 20;
        const alpha = 0.16 + 0.24 * (0.5 + 0.5 * Math.sin(this.time * 2.2 + i * 1.7));
        const rad = 1.4 + (i % 3) * 0.75;
        ctx.fillStyle = `rgba(${moteColor},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(mx, my, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Aspect-safe subtle atmospheric vignette (no oval ring artifact on portrait phones)
      const vigOuter = Math.hypot(this.viewW, this.viewH) * 0.56;
      const vigInner = Math.min(this.viewW, this.viewH) * 0.28;
      const vig = ctx.createRadialGradient(this.viewW / 2, this.viewH / 2, vigInner, this.viewW / 2, this.viewH / 2, vigOuter);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(0.68, 'rgba(0,0,0,0)');
      vig.addColorStop(1, map.id === 'altar' ? 'rgba(35,5,12,0.34)' : (map.id === 'ruins' ? 'rgba(8,14,26,0.3)' : 'rgba(8,10,16,0.18)'));
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    }

    renderTitleBackdrop(ctx) {
      const map = DATA.MAPS.town, waterFrame = Math.floor(this.time * 2.5) % 2;
      const maxOx = Math.max(0, map.layout[0].length * TILE - this.viewW);
      const maxOy = Math.max(0, map.layout.length * TILE - this.viewH);
      const ox = clamp(maxOx * 0.5 + Math.sin(this.time * 0.35) * Math.min(36, maxOx * 0.45), 0, maxOx);
      const oy = clamp(maxOy * 0.5 + Math.cos(this.time * 0.25) * Math.min(20, maxOy * 0.45), 0, maxOy);
      ctx.save(); ctx.translate(-ox, -oy);
      for (let ty = 0; ty < map.layout.length; ty++) {
        const row = map.layout[ty];
        for (let tx = 0; tx < row.length; tx++) {
          const ch = row[tx], px = tx * TILE, py = ty * TILE;
          ctx.drawImage(ch === 'c' || ch === 'F' ? this.sprites.tiles.cobble : this.sprites.tiles.grass, px, py, TILE + 0.4, TILE + 0.4);
          const tileMap = {
            ',': this.sprites.tiles.flower, 'p': this.sprites.tiles.path, 'c': this.sprites.tiles.cobble,
            '~': waterFrame ? this.sprites.tiles.water1 : this.sprites.tiles.water0,
            'T': this.sprites.tiles.tree, 'R': this.sprites.tiles.houseRoof,
            'W': this.sprites.tiles.houseWall, 'd': this.sprites.tiles.houseDoor,
            'F': waterFrame ? this.sprites.tiles.fountain1 : this.sprites.tiles.fountain0
          };
          if (tileMap[ch]) ctx.drawImage(tileMap[ch], px, py, TILE + 0.4, TILE + 0.4);
        }
      }
      ctx.restore();
      // Soft glowing firefly motes
      for (let i = 0; i < 24; i++) {
        const x = (i * 53 + this.time * 14) % this.viewW;
        const y = (i * 29 + Math.sin(this.time + i) * 7) % this.viewH;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(253, 224, 71, 0.52)' : 'rgba(224, 242, 254, 0.38)';
        ctx.beginPath(); ctx.arc(x, y, i % 3 === 0 ? 1.8 : 1.1, 0, Math.PI * 2); ctx.fill();
      }
    }

    drawNpc(ctx, npc) {
      const x = npc.tx * TILE, y = npc.ty * TILE, bob = Math.sin(this.time * 3 + x) * 1.0;
      ctx.fillStyle = 'rgba(0,0,0,0.34)';
      ctx.beginPath(); ctx.ellipse(x, y + 11, 10, 4.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.drawImage(this.sprites.npcs[npc.sprite], x - 16, y - 20 + bob, 32, 32);

      // Sleek frosted rounded nameplate pill
      ctx.save();
      ctx.font = '700 7.5px -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif';
      ctx.textAlign = 'center';
      const nw = ctx.measureText(npc.name).width + 9;
      this.roundPill(ctx, x - nw / 2, y - 30, nw, 11, 5.5);
      ctx.fillStyle = 'rgba(13, 16, 24, 0.76)'; ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)'; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.fillStyle = '#fef3c7'; ctx.fillText(npc.name, x, y - 22);

      const curQ = DATA.QUESTS[this.hero.questIdx];
      const isQuestGiver = npc.role === 'quest' || npc.role === 'scout' || (curQ && curQ.targetNpc === npc.id);
      if (isQuestGiver) {
        let mark = null, col = '#fde047';
        if (curQ && this.hero.questState === 'active' && curQ.type === 'talk' && curQ.targetNpc === npc.id) { mark = '!'; col = '#4ade80'; }
        else if (npc.role === 'quest' || npc.role === 'scout') {
          if (this.hero.questState === 'available') { mark = '!'; col = '#fde047'; }
          else if (this.hero.questState === 'ready') { mark = '?'; col = '#4ade80'; }
        }
        if (mark) {
          const mb = Math.sin(this.time * 6) * 2.2;
          ctx.fillStyle = 'rgba(13, 16, 24, 0.85)';
          ctx.beginPath(); ctx.arc(x, y - 38 + mb, 6.5, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.stroke();
          ctx.font = '900 9.5px -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.fillStyle = col; ctx.fillText(mark, x, y - 34.8 + mb);
        }
      }
      ctx.restore();
    }

    drawHero(ctx) {
      const h = this.hero, set = this.sprites.heroes[h.classId];
      const moving = this.keys.ArrowLeft || this.keys.ArrowRight || this.keys.ArrowUp || this.keys.ArrowDown ||
        this.keys.KeyA || this.keys.KeyD || this.keys.KeyW || this.keys.KeyS ||
        this.virtualDir.left || this.virtualDir.right || this.virtualDir.up || this.virtualDir.down ||
        Math.hypot(this.stickX, this.stickY) > 0.12;
      const walkF = moving && Math.floor(h.walkAnim) % 2 === 1;
      const sheet = set && set.hdSheet;
      const enh = (h.equip && h.equip.weapon && h.equip.weapon.enh) || 0;
      const flipX = (h.dir === 'left' || (h.dir !== 'right' && h.lastHorizDir === 'left')) ? -1 : 1;

      // Ground contact shadow
      ctx.fillStyle = 'rgba(0,0,0,0.44)';
      ctx.beginPath(); ctx.ellipse(h.x, h.y + 12, 13.5, 5.2, 0, 0, Math.PI * 2); ctx.fill();

      // Luminous Rotating Hero Aura Ring beneath feet
      const auraColor = h.classId === 'knight' ? 'rgba(251, 191, 36,'
        : (h.classId === 'rogue' ? 'rgba(56, 189, 248,' : 'rgba(147, 197, 253,');
      const auraAlpha = enh >= 10 ? 0.55 : (enh >= 5 ? 0.42 : 0.3);
      ctx.save();
      ctx.translate(h.x, h.y + 11.5);
      ctx.scale(1, 0.44);
      ctx.rotate(this.time * 0.9);
      ctx.strokeStyle = `${auraColor}${auraAlpha})`;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([7, 5]);
      ctx.beginPath(); ctx.arc(0, 0, 17.5 + Math.sin(this.time * 3) * 0.8, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      if (enh >= 7) {
        ctx.strokeStyle = this.getWeaponGlowColor();
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(0, 0, 21.5, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();

      if (h.buffDefTimer > 0) {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.88)'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(h.x, h.y - 2, 22 + Math.sin(this.time * 8), 0, Math.PI * 2); ctx.stroke();
      }
      if (h.buffSpdTimer > 0) {
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.88)'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(h.x, h.y - 2, 24, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (sheet && sheet.complete && sheet.naturalWidth >= 1024) {
        const fw = Math.floor(sheet.naturalWidth / 4);
        const fh = sheet.naturalHeight;
        const size = 54;

        // Draw dash afterimage trails using actual sprint sprite frame
        for (const g of this.dashGhosts) {
          const ga = clamp(g.life / g.maxLife, 0, 1) * 0.42;
          ctx.save();
          ctx.globalAlpha = ga;
          ctx.translate(g.x, g.y + 12);
          ctx.scale(g.flipX, 1);
          ctx.drawImage(sheet, g.frameIdx * fw, 0, fw, fh, -size / 2, -size + 2, size, size);
          ctx.restore();
        }

        // Authentic 4-frame RPG pose state machine (NO cheesy wobbling or tilting!)
        let frameIdx = 0; // 0: idle, 1: run1, 2: run2, 3: attack/cast
        if (h.attackTimer > 0 || h.castTimer > 0) {
          frameIdx = 3;
        } else if (h.dashTimer > 0) {
          frameIdx = 2;
        } else if (moving) {
          const runCycle = [1, 0, 2, 0];
          frameIdx = runCycle[Math.floor(h.walkAnim) % 4];
        }

        // Crisp forward lunge offset ONLY during actual strike frame; otherwise rock-solid stance
        const lungeX = (frameIdx === 3 && h.attackTimer > 0) ? flipX * (h.attackTimer / 0.16) * 3.5 : 0;
        const strideLift = (frameIdx === 2 && moving) ? -1.4 : 0;

        ctx.translate(h.x + lungeX, h.y + 12 + strideLift);
        ctx.scale(flipX, 1);
        if (h.invulnTimer > 0 && Math.floor(this.time * 24) % 2 === 0) ctx.globalAlpha = 0.5;
        ctx.drawImage(sheet, frameIdx * fw, 0, fw, fh, -size / 2, -size + 2, size, size);
      } else {
        const spr = h.dir === 'left' ? (walkF ? set.walkLeft : set.idleLeft) : (walkF ? set.walk : set.idle);
        const breath = moving ? Math.abs(Math.sin(h.walkAnim * Math.PI)) * -1.2 : Math.sin(this.time * 3.5) * 0.8;
        ctx.translate(h.x, h.y - 2 + breath);
        if (h.attackTimer > 0) {
          const lean = (h.dir === 'left' ? -1 : 1) * (h.attackTimer / 0.16) * 0.18;
          ctx.rotate(lean);
          ctx.scale(1.06, 0.96);
        }
        if (h.invulnTimer > 0 && Math.floor(this.time * 24) % 2 === 0) ctx.globalAlpha = 0.5;
        ctx.drawImage(spr, -18, -21, 36, 36);
      }
      ctx.restore();
    }

    drawMonster(ctx, m) {
      const def = DATA.MONSTERS[m.typeId], frames = this.sprites.monsters[m.typeId];
      const spr = frames[Math.floor(m.anim) % frames.length];
      const drawSize = def.isFinalBoss ? 58 : (def.isBoss ? 46 : Math.max(30, def.size + 8));

      // Boss Ground Magic Seal Circle
      if (def.isBoss) {
        ctx.save();
        ctx.translate(m.x, m.y + drawSize * 0.34);
        ctx.scale(1, 0.44);
        ctx.rotate(-this.time * 0.75);
        ctx.strokeStyle = def.isFinalBoss ? 'rgba(244, 63, 94, 0.65)' : 'rgba(251, 146, 60, 0.55)';
        ctx.lineWidth = 2.2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath(); ctx.arc(0, 0, drawSize * 0.56, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.38)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(0, 0, drawSize * 0.42, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.ellipse(m.x, m.y + drawSize * 0.34, drawSize * 0.32, 4.4, 0, 0, Math.PI * 2); ctx.fill();

      ctx.save();
      if (m.hitFlash > 0) ctx.globalAlpha = 0.7;
      ctx.drawImage(spr, m.x - drawSize / 2, m.y - drawSize / 2 - 3, drawSize, drawSize);
      if (m.hitFlash > 0) {
        ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(m.x, m.y - 2, drawSize * 0.32, 0, Math.PI * 2); ctx.fill();
      } else if (m.slowTimer > 0) {
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(m.x, m.y, drawSize * 0.42, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();

      if (!def.isBoss && m.hp < m.maxHp) {
        const bw = 26, bh = 3.8, bx = m.x - bw / 2, by = m.y - drawSize / 2 - 5;
        this.roundPill(ctx, bx, by, bw, bh, 2);
        ctx.fillStyle = 'rgba(10, 12, 18, 0.82)'; ctx.fill();
        const fw = Math.max(0, (bw - 1.6) * (m.hp / m.maxHp));
        if (fw > 0.5) {
          this.roundPill(ctx, bx + 0.8, by + 0.8, fw, bh - 1.6, 1.5);
          ctx.fillStyle = '#fb7185'; ctx.fill();
        }
      }
      if (m.stunTimer > 0) {
        ctx.fillStyle = '#fde047'; ctx.font = '800 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('★', m.x, m.y - drawSize / 2 - 8);
      }
    }

    drawEffects(ctx) {
      for (const ef of this.effects) {
        const p = 1 - ef.timer / ef.maxTimer;
        ctx.save();
        if (ef.type === 'slash') {
          ctx.translate(ef.x, ef.y); ctx.rotate(ef.angle);
          ctx.globalAlpha = 1 - p;
          ctx.shadowColor = ef.color; ctx.shadowBlur = 8;
          ctx.strokeStyle = ef.color; ctx.lineWidth = ef.heavy ? 7 : 5; ctx.lineCap = 'round';
          const start = -1.15 * ef.flip, end = (-1.15 + 2.3 * Math.min(1, p * 1.45)) * ef.flip;
          ctx.beginPath(); ctx.arc(0, 0, ef.radius * 0.72, Math.min(start, end), Math.max(start, end)); ctx.stroke();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = ef.heavy ? 2.6 : 1.7;
          ctx.beginPath(); ctx.arc(0, 0, ef.radius * 0.74, Math.min(start, end), Math.max(start, end)); ctx.stroke();
        } else if (ef.type === 'ring') {
          ctx.globalAlpha = 1 - p;
          ctx.shadowColor = ef.color; ctx.shadowBlur = 8;
          ctx.strokeStyle = ef.color; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.arc(ef.x, ef.y, ef.maxRadius * (0.25 + p * 0.75), 0, Math.PI * 2); ctx.stroke();
        } else if (ef.type === 'pillar' || ef.type === 'levelup') {
          ctx.globalAlpha = 1 - p;
          const w = ef.type === 'levelup' ? 28 : 16;
          const col = ef.type === 'levelup' ? '#fde047' : ef.color;
          const grad = ctx.createLinearGradient(ef.x - w / 2, 0, ef.x + w / 2, 0);
          grad.addColorStop(0, 'rgba(255,255,255,0)');
          grad.addColorStop(0.35, col);
          grad.addColorStop(0.5, '#ffffff');
          grad.addColorStop(0.65, col);
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(ef.x - w / 2, ef.y - 120, w, 130);
        }
        ctx.restore();
      }
    }

    // --- SKILL SLOTS & QUICK BAR ---
    buildSkillSlotUi() {
      if (!this.hero) return;
      this.ensureHeroExtras(this.hero);
      const cls = DATA.CLASSES[this.hero.classId];
      this.el.skillSlots.innerHTML = '';
      if (this.el.mobileSkillSlots) this.el.mobileSkillSlots.innerHTML = '';

      for (let slot = 0; slot < 4; slot++) {
        const skIdx = this.hero.equippedSkills[slot];
        const sk = cls.skills[skIdx] || cls.skills[slot];
        if (!sk) continue;
        const lv = this.hero.skillLevels[skIdx] || 0;
        const svg = SVG[sk.type] || SVG.cone;

        const btn = document.createElement('button');
        btn.className = 'slot-btn' + (lv <= 0 ? ' locked' : '');
        btn.title = `${sk.name} (MP ${sk.mp}) - ${sk.desc}`;
        btn.innerHTML = `<span class="slot-key">${slot + 1}</span><span class="slot-svg" style="color:${sk.color}">${svg}</span><span class="slot-label">${sk.name}</span><span class="slot-cd hidden" id="skillCd_${slot}"></span>`;
        btn.addEventListener('click', () => this.useSkill(slot));
        this.el.skillSlots.appendChild(btn);

        if (this.el.mobileSkillSlots) {
          const mbtn = document.createElement('button');
          mbtn.type = 'button';
          mbtn.dataset.slot = String(slot);
          mbtn.className = 'arc-skill-btn' + (lv <= 0 ? ' locked' : '');
          mbtn.innerHTML = `<span class="ms-svg" style="color:${sk.color}">${svg}</span><span class="ms-name">${sk.name}</span><span class="slot-cd hidden" id="mSkillCd_${slot}"></span>`;
          mbtn.addEventListener('pointerdown', (e) => {
            e.preventDefault(); this.audio.init();
            if (this.state === 'playing') this.useSkill(slot);
          });
          this.el.mobileSkillSlots.appendChild(mbtn);
        }
      }
    }

    updateQuickSlotCooldowns() {
      if (!this.hero) return;
      const eq = this.hero.equippedSkills || [0, 1, 2, 3];
      for (let i = 0; i < 4; i++) {
        const skIdx = typeof eq[i] === 'number' ? eq[i] : i;
        const cd = this.hero.skillCds[skIdx] || 0;
        for (const id of [`skillCd_${i}`, `mSkillCd_${i}`]) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (cd > 0.05) { el.classList.remove('hidden'); el.textContent = cd.toFixed(1); }
          else el.classList.add('hidden');
        }
      }
    }

    updateMobileInteractHint() {
      if (!this.el.btnMobileAttack || !this.hero) return;
      const map = DATA.MAPS[this.currentMapId], h = this.hero;
      let key = 'attack', label = '공격', svg = SVG.sword, isInteract = false;

      for (const npc of map.npcs || []) {
        if (dist(h.x, h.y, npc.tx * TILE, npc.ty * TILE) < 40) { key = 'chat'; label = '대화'; svg = SVG.chat; isInteract = true; break; }
      }
      if (!isInteract) {
        for (const f of map.fountains || []) {
          if (dist(h.x, h.y, f.tx * TILE, f.ty * TILE) < 44) { key = 'heal'; label = '회복'; svg = SVG.heal; isInteract = true; break; }
        }
      }
      if (!isInteract) {
        for (const ch of map.chests || []) {
          if (!h.openedChests[ch.id] && dist(h.x, h.y, (ch.tx + 0.5) * TILE, (ch.ty + 0.5) * TILE) < 36) { key = 'chest'; label = '열기'; svg = SVG.chest; isInteract = true; break; }
        }
      }

      if (this.lastInteractKey !== key) {
        this.lastInteractKey = key;
        this.el.btnMobileAttack.classList.toggle('interact-mode', isInteract);
        this.el.mobileAtkIcon.innerHTML = svg;
        this.el.mobileAtkLabel.textContent = label;
      }
    }

    refreshQuickBar() {
      if (!this.hero) return;
      const b = this.hero.bagItems;
      const hpCnt = (b.pot_hp_s || 0) + (b.pot_hp_m || 0) + (b.pot_hp_l || 0) + (b.pot_hp_xl || 0) + (b.pot_hp_mythic || 0);
      const mpCnt = (b.pot_mp_s || 0) + (b.pot_mp_l || 0) + (b.pot_mp_xl || 0) + (b.pot_mp_mythic || 0);
      const scCnt = b.scroll_town || 0;
      this.el.potHpCount.textContent = `${hpCnt}`;
      this.el.potMpCount.textContent = `${mpCnt}`;
      this.el.scrollCount.textContent = `${scCnt}`;
      if (this.el.potHpCountDesk) this.el.potHpCountDesk.textContent = `${hpCnt}`;
      if (this.el.potMpCountDesk) this.el.potMpCountDesk.textContent = `${mpCnt}`;
      if (this.el.scrollCountDesk) this.el.scrollCountDesk.textContent = `${scCnt}`;
      this.el.dotStat.style.display = this.hero.statPoints > 0 ? 'block' : 'none';
      this.el.dotSkill.style.display = this.hero.skillPoints > 0 ? 'block' : 'none';
    }

    // --- MODALS ---
    closeModal() {
      this.audio.playSfx('ui');
      this.el.modalBackdrop.classList.add('hidden');
      this.modalType = null;
      if (this.state === 'modal') this.state = 'playing';
      this.refreshQuickBar();
    }

    openHeroModal(tab) {
      this.clearTouchInputs();
      this.hideQuestBrief();
      this.audio.playSfx('ui');
      this.state = 'modal'; this.modalType = 'hero'; this.modalTab = tab;
      this.el.modalBackdrop.classList.remove('hidden');
      this.renderHeroModal();
    }

    renderHeroModal() {
      this.renderModalTabs([
        { id: 'status', label: `상태${this.hero.statPoints > 0 ? ` (+${this.hero.statPoints})` : ''}` },
        { id: 'bag', label: '가방' },
        { id: 'skills', label: `스킬${this.hero.skillPoints > 0 ? ` (+${this.hero.skillPoints})` : ''}` },
        { id: 'quest', label: '연대기' },
        { id: 'world', label: '월드맵·탑' }
      ], (id) => { this.modalTab = id; this.renderHeroModal(); });

      const body = this.el.modalBody;
      body.innerHTML = '';
      if (this.modalTab === 'status') this.renderStatusTab(body);
      else if (this.modalTab === 'bag') this.renderBagTab(body);
      else if (this.modalTab === 'skills') this.renderSkillsTab(body);
      else if (this.modalTab === 'quest') this.renderQuestTab(body);
      else if (this.modalTab === 'world') this.renderWorldTab(body);
    }

    renderModalTabs(tabs, onPick) {
      this.el.modalTabs.innerHTML = '';
      tabs.forEach((t) => {
        const b = document.createElement('button');
        b.className = 'tab-btn' + (t.id === this.modalTab ? ' active' : '');
        b.textContent = t.label;
        b.addEventListener('click', () => { this.audio.playSfx('ui'); onPick(t.id); });
        this.el.modalTabs.appendChild(b);
      });
    }

    formatEquipName(eq) {
      const def = DATA.ITEMS[eq.itemId], rar = DATA.RARITY[def.rarity];
      return `<span style="color:${rar.color}">${eq.enh > 0 ? `+${eq.enh} ` : ''}${def.name}</span>`;
    }

    formatEquipStats(eq) {
      const b = this.getEquipBonus(eq), parts = [];
      if (b.atk) parts.push(`공격 +${b.atk}`);
      if (b.def) parts.push(`방어 +${b.def}`);
      if (b.hp) parts.push(`HP +${b.hp}`);
      if (b.mp) parts.push(`MP +${b.mp}`);
      if (b.str) parts.push(`힘 +${b.str}`);
      if (b.agi) parts.push(`민첩 +${b.agi}`);
      if (b.vit) parts.push(`체력 +${b.vit}`);
      if (b.int) parts.push(`지능 +${b.int}`);
      if (b.crit) parts.push(`치명 +${b.crit}%`);
      if (b.lifesteal) parts.push(`흡혈 +${b.lifesteal}%`);
      if (b.spd) parts.push(`이속 +${b.spd}`);
      if (b.mpRegen) parts.push(`MP회복 +${b.mpRegen}/s`);
      if (b.skillDmg) parts.push(`스킬 +${b.skillDmg}%`);
      return parts.join(' · ');
    }

    renderStatusTab(body) {
      const h = this.hero, st = this.getHeroStats();
      const cls = DATA.CLASSES[h.classId];
      const power = Math.round(st.atk * 14 + st.magicAtk * 10 + st.def * 12 + st.maxHp * 0.9 + st.crit * 25);
      const season = this.getStorySeason();
      const set = this.sprites.heroes[h.classId];
      body.innerHTML = `
        <div class="hero-showcase-banner">
          <div class="hero-showcase-portrait" id="statusPortraitSlot"></div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <strong style="font-size:16px;color:#fff6d2;">${h.name}</strong>
              <span class="badge">Lv.${h.lv}</span>
              ${h.title ? `<span class="badge" style="color:#7dd3fc;border-color:rgba(125,211,252,0.45)">${h.title}</span>` : ''}
            </div>
            <div style="font-size:11.5px;color:#93c5fd;font-weight:700;margin-top:3px;">${cls ? cls.role : ''} · 제${season}부 진행 중</div>
            <div style="margin-top:6px;font-size:12px;font-weight:800;color:#fde68a;">전투력 ${power.toLocaleString()} <span style="color:#94a3b8;font-weight:600;">· 심연의 탑 ${h.towerBest || 0}층</span></div>
          </div>
        </div>
        <div class="stat-layout">
          <div class="panel-card">
            <h3>영웅 능력치 <span class="badge" style="color:#fde047">${h.gold.toLocaleString()} G</span></h3>
            <div class="stat-row"><span>HP</span><strong>${Math.ceil(h.hp)} / ${st.maxHp}</strong></div>
            <div class="stat-row"><span>MP</span><strong>${Math.ceil(h.mp)} / ${st.maxMp}</strong></div>
            <div class="stat-row"><span>공격력 / 마력</span><strong>${st.atk} / ${st.magicAtk}</strong></div>
            <div class="stat-row"><span>방어력</span><strong>${st.def}</strong></div>
            <div class="stat-row"><span>치명타율</span><strong>${st.crit}%</strong></div>
            <div class="stat-row"><span>다음 레벨 EXP</span><strong>${h.exp.toLocaleString()} / ${h.expNext.toLocaleString()}</strong></div>
          </div>
          <div class="panel-card">
            <h3>능력치 분배 <span class="badge">포인트 ${h.statPoints}</span></h3>
            ${['str', 'agi', 'vit', 'int'].map((k) => {
              const names = { str: '힘 (STR)', agi: '민첩 (AGI)', vit: '체력 (VIT)', int: '지능 (INT)' };
              return `<div class="stat-row"><span>${names[k]}</span><span style="display:flex;align-items:center;gap:8px;"><strong>${st[k]}</strong><button class="rpg-btn primary small" data-add-stat="${k}" ${h.statPoints <= 0 ? 'disabled' : ''}>+1</button></span></div>`;
            }).join('')}
          </div>
        </div>
      `;
      const pSlot = body.querySelector('#statusPortraitSlot');
      if (pSlot && set) {
        const pc = document.createElement('canvas');
        pc.width = 160; pc.height = 160;
        const pctx = pc.getContext('2d');
        pctx.imageSmoothingEnabled = true;
        pctx.imageSmoothingQuality = 'high';
        pctx.drawImage(set.hdPortrait || set.portrait || set.idle, 0, 0, 160, 160);
        pSlot.appendChild(pc);
      }
      body.querySelectorAll('[data-add-stat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (h.statPoints <= 0) return;
          this.audio.playSfx('ui'); h.base[btn.dataset.addStat]++; h.statPoints--;
          this.renderHeroModal(); this.refreshQuickBar();
        });
      });
    }

    renderBagTab(body) {
      const h = this.hero, slotNames = { weapon: '무기', armor: '갑옷', helm: '투구', accessory: '장신구' };
      const equipHtml = Object.keys(slotNames).map((slot) => {
        const eq = h.equip[slot];
        return `<div class="item-row"><div class="item-info"><div class="item-title"><span class="badge">${slotNames[slot]}</span> ${eq ? this.formatEquipName(eq) : '<span style="color:#6d6b75">비어 있음</span>'}</div><div class="item-sub">${eq ? this.formatEquipStats(eq) : '장비를 착용하세요.'}</div></div></div>`;
      }).join('');

      const bagEqHtml = h.bagEquip.length === 0
        ? '<div class="item-sub">보유 중인 여분 장비가 없습니다.</div>'
        : h.bagEquip.map((eq, idx) => `<div class="item-row"><div class="item-info"><div class="item-title">${this.formatEquipName(eq)}</div><div class="item-sub">${this.formatEquipStats(eq)}</div></div><div class="item-actions"><button class="rpg-btn primary small" data-equip-idx="${idx}">착용</button></div></div>`).join('');

      const bagItemEntries = Object.entries(h.bagItems).filter(([, qty]) => qty > 0);
      const bagItemHtml = bagItemEntries.length === 0
        ? '<div class="item-sub">보유 중인 소비/재료 아이템이 없습니다.</div>'
        : bagItemEntries.map(([id, qty]) => {
          const it = DATA.ITEMS[id];
          return `<div class="item-row"><div class="item-info"><div class="item-title"><span style="color:${DATA.RARITY[it.rarity].color}">${it.name}</span> <span class="badge">x${qty}</span></div><div class="item-sub">${it.desc}</div></div><div class="item-actions">${it.type === 'consumable' ? `<button class="rpg-btn primary small" data-use-item="${id}">사용</button>` : ''}</div></div>`;
        }).join('');

      body.innerHTML = `
        <div class="panel-card" style="margin-bottom:10px;"><h3>장착 중인 장비</h3><div class="list-grid">${equipHtml}</div></div>
        <div class="panel-card" style="margin-bottom:10px;"><h3>가방 — 장비 (${h.bagEquip.length})</h3><div class="list-grid">${bagEqHtml}</div></div>
        <div class="panel-card"><h3>가방 — 소비 및 재료</h3><div class="list-grid">${bagItemHtml}</div></div>
      `;

      body.querySelectorAll('[data-equip-idx]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = h.bagEquip.splice(Number(btn.dataset.equipIdx), 1)[0];
          if (!item) return;
          const slot = DATA.ITEMS[item.itemId].type;
          if (h.equip[slot]) h.bagEquip.push(h.equip[slot]);
          h.equip[slot] = item; this.audio.playSfx('ui'); this.renderHeroModal();
        });
      });

      body.querySelectorAll('[data-use-item]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.useItem, it = DATA.ITEMS[id];
          if (!it || (h.bagItems[id] || 0) <= 0) return;
          const st = this.getHeroStats();
          if (it.subtype === 'hp') { h.bagItems[id]--; h.hp = Math.min(st.maxHp, h.hp + it.power); this.audio.playSfx('potion'); }
          else if (it.subtype === 'mp') { h.bagItems[id]--; h.mp = Math.min(st.maxMp, h.mp + it.power); this.audio.playSfx('potion'); }
          else if (it.subtype === 'full') { h.bagItems[id]--; h.hp = st.maxHp; h.mp = st.maxMp; this.audio.playSfx('levelup'); this.addFloatText(h.x, h.y - 18, 'HP · MP 완전 회복!', '#4ade80'); }
          else if (it.subtype === 'buff_atk') { h.bagItems[id]--; h.buffAtkTimer = Math.max(h.buffAtkTimer || 0, it.power); this.audio.playSfx('skill'); this.addFloatText(h.x, h.y - 18, '공격력·마력 +35%!', '#f97316'); }
          else if (it.subtype === 'buff_def') { h.bagItems[id]--; h.buffDefTimer = Math.max(h.buffDefTimer || 0, it.power); this.audio.playSfx('skill'); this.addFloatText(h.x, h.y - 18, '방어력 대폭 상승!', '#60a5fa'); }
          else if (it.subtype === 'buff_spd') { h.bagItems[id]--; h.buffSpdTimer = Math.max(h.buffSpdTimer || 0, it.power); this.audio.playSfx('skill'); this.addFloatText(h.x, h.y - 18, '질풍·치명타 상승!', '#34d399'); }
          else if (it.subtype === 'exp') { h.bagItems[id]--; const gain = Math.round(it.power * (1 + h.lv * 0.28)); this.gainExp(gain); this.audio.playSfx('quest'); this.addFloatText(h.x, h.y - 18, `+${gain.toLocaleString()} EXP!`, '#fde047'); }
          else if (it.subtype === 'town') { this.closeModal(); this.useReturnScroll(); return; }
          this.renderHeroModal(); this.refreshQuickBar();
        });
      });
    }

    renderSkillsTab(body) {
      const h = this.hero, cls = DATA.CLASSES[h.classId];
      this.ensureHeroExtras(h);
      const eq = h.equippedSkills;
      const slotSummary = eq.map((skIdx, slot) => {
        const sk = cls.skills[skIdx];
        return `<span class="badge" style="color:${sk ? sk.color : '#fff'}">슬롯${slot + 1}: ${sk ? sk.name : '-'}</span>`;
      }).join(' ');

      body.innerHTML = `
        <div class="panel-card" style="margin-bottom:10px;">
          <h3>전투 슬롯 장착 현황 (총 ${cls.skills.length}종 중 4개 선택)</h3>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">${slotSummary}</div>
        </div>
        <div class="panel-card">
          <h3>${cls.name} 스킬 트리 <span class="badge">포인트 ${h.skillPoints}</span></h3>
          <div class="list-grid">
            ${cls.skills.map((sk, idx) => {
              const lv = h.skillLevels[idx] || 0;
              const canUp = h.lv >= sk.unlockLv && h.skillPoints > 0 && lv < 5;
              const eqSlot = eq.indexOf(idx);
              const slotBtns = lv > 0 ? [0, 1, 2, 3].map((sl) => {
                const isHere = eqSlot === sl;
                return `<button class="rpg-btn ${isHere ? 'primary' : 'secondary'}" style="padding:4px 7px;font-size:10px;" data-equip-skill="${idx}" data-equip-slot="${sl}">${sl + 1}번${isHere ? '✓' : ''}</button>`;
              }).join('') : '';
              return `
                <div class="item-row" style="flex-direction:column;align-items:stretch;gap:7px;${eqSlot >= 0 ? 'border-color:rgba(245,208,122,0.45);' : ''}">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                    <div class="item-info">
                      <div class="item-title"><span style="color:${sk.color}">${sk.name}</span><span class="badge">${lv > 0 ? `Lv.${lv}/5` : `Lv.${sk.unlockLv} 해금`}</span><span style="color:#7dd3fc;font-size:11px;">MP ${sk.mp} · ${sk.cd}s</span></div>
                      <div class="item-sub">${sk.desc}</div>
                    </div>
                    <div class="item-actions">
                      <button class="rpg-btn primary small" data-up-skill="${idx}" ${canUp ? '' : 'disabled'}>${lv >= 5 ? 'MAX' : (lv === 0 ? '습득' : '강화')}</button>
                    </div>
                  </div>
                  ${lv > 0 ? `<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;"><span style="font-size:10.5px;color:#b4bdd6;font-weight:700;">전투 슬롯:</span>${slotBtns}</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
      body.querySelectorAll('[data-up-skill]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.upSkill);
          if (h.skillPoints <= 0 || h.skillLevels[idx] >= 5) return;
          h.skillLevels[idx]++; h.skillPoints--;
          this.audio.playSfx('enhanceOk'); this.buildSkillSlotUi(); this.renderHeroModal(); this.refreshQuickBar(); this.saveGame(true);
        });
      });
      body.querySelectorAll('[data-equip-skill]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const skIdx = Number(btn.dataset.equipSkill);
          const targetSlot = Number(btn.dataset.equipSlot);
          const prevSlot = h.equippedSkills.indexOf(skIdx);
          if (prevSlot >= 0) {
            // Swap cleanly with existing slot so no duplicate skills exist!
            const oldInTarget = h.equippedSkills[targetSlot];
            h.equippedSkills[targetSlot] = skIdx;
            h.equippedSkills[prevSlot] = oldInTarget;
          } else {
            h.equippedSkills[targetSlot] = skIdx;
          }
          this.audio.playSfx('ui');
          this.buildSkillSlotUi();
          this.renderHeroModal();
          this.saveGame(true);
        });
      });
    }

    renderQuestTab(body) {
      const h = this.hero;
      this.ensureHeroExtras(h);
      const doneCount = h.questState === 'all_done' ? DATA.QUESTS.length : h.questIdx;
      const curQ = h.questState === 'all_done' ? null : DATA.QUESTS[h.questIdx];
      const curSeason = this.getStorySeason();
      if (!this.selectedChronicleSeason) this.selectedChronicleSeason = curSeason;
      const selSeason = clamp(this.selectedChronicleSeason, 1, 10);

      // Rotating Guild Side Bounties (infinite bonus quests!)
      const bountyScale = Math.pow(1.22, curSeason - 1);
      const bountyHtml = h.bounties.map((bn, bIdx) => {
        const ready = bn.progress >= bn.goal;
        const gRew = Math.round(bn.gold * bountyScale);
        const eRew = Math.round(bn.exp * bountyScale);
        return `
          <div class="item-row" style="${ready ? 'border-color:rgba(56,189,248,0.65);' : ''}">
            <div class="item-info">
              <div class="item-title">${bn.title} <span class="badge" style="color:${ready ? '#4ade80' : '#60a5fa'}">${bn.progress}/${bn.goal}</span></div>
              <div class="item-sub">${bn.mapHint} · 보상 ${gRew.toLocaleString()}G · EXP ${eRew.toLocaleString()} · 강화석 1</div>
            </div>
            ${ready ? `<div class="item-actions"><button class="rpg-btn primary small" data-claim-bounty="${bIdx}">보상 수령</button></div>` : ''}
          </div>
        `;
      }).join('');

      // 10-Season Filter Pills (1부 ~ 10부 = 200 Chapters!)
      const seasonPills = Array.from({ length: 10 }, (_, i) => {
        const s = i + 1;
        const active = s === selSeason;
        const unlocked = s <= curSeason || h.questState === 'all_done';
        return `<button type="button" class="tab-btn${active ? ' active' : ''}" data-pick-season="${s}" style="padding:5px 9px;font-size:11px;${!unlocked ? 'opacity:0.45;' : ''}">${s}부</button>`;
      }).join('');

      const seasonQuests = DATA.QUESTS.filter((q) => (q.season || 1) === selSeason);
      const seasonTitle = seasonQuests[0] ? seasonQuests[0].seasonTitle : `제${selSeason}부`;
      let lastAct = '';
      const rows = seasonQuests.map((q) => {
        const idx = (q.chapter || 1) - 1;
        let actHeader = '';
        if (q.act && q.act !== lastAct) {
          lastAct = q.act;
          actHeader = `<div style="margin:10px 0 4px;font-size:11px;font-weight:800;letter-spacing:0.05em;color:#f5d07a;">${q.act}</div>`;
        }
        const isDone = idx < h.questIdx || h.questState === 'all_done';
        const isCur = idx === h.questIdx && h.questState !== 'all_done';
        let status = '미개방', col = '#6d6b75';
        if (isDone) { status = '완료'; col = '#4ade80'; }
        else if (isCur) {
          if (h.questState === 'available') { status = '시작 가능'; col = '#fde047'; }
          else if (h.questState === 'active') { status = q.type === 'talk' ? '대화 필요' : `진행 (${h.questProgress}/${q.goal})`; col = '#60a5fa'; }
          else if (h.questState === 'ready') { status = '완료 보고!'; col = '#4ade80'; }
        }
        const locked = !isDone && !isCur;
        const bodyTxt = isDone && q.summary
          ? `<div class="item-sub" style="color:#d6d3df;line-height:1.45;">${q.summary}</div>`
          : (locked ? '<div class="item-sub" style="opacity:0.5;">이전 장을 완료하면 이야기가 이어집니다.</div>' : `<div class="item-sub">${q.desc}</div>`);
        const actionBtn = isCur && (h.questState === 'available' || h.questState === 'ready')
          ? `<div class="item-actions"><button class="rpg-btn primary small" id="btnStoryProceed">${h.questState === 'available' ? '스토리 시작' : '완료 보고'}</button></div>`
          : '';
        return `${actHeader}<div class="item-row" style="${isCur ? 'border-color:rgba(251,191,36,0.55);' : (locked ? 'opacity:0.55;' : '')}"><div class="item-info"><div class="item-title">${q.title} <span class="badge" style="color:${col}">${status}</span></div>${bodyTxt}${!locked ? `<div class="item-sub" style="color:#d4b572">보상: ${q.reward.gold.toLocaleString()}G · EXP ${q.reward.exp.toLocaleString()}</div>` : ''}</div>${actionBtn}</div>`;
      }).join('');

      body.innerHTML = `
        <div class="panel-card" style="margin-bottom:10px;">
          <h3>용병 길드 서브 의뢰 <span class="badge" style="color:#38bdf8">무한 반복</span></h3>
          <div class="list-grid">${bountyHtml}</div>
        </div>
        <div class="panel-card">
          <h3>솔티아 200장 대연대기 <span class="badge" style="color:#fde047">${doneCount} / ${DATA.QUESTS.length}장</span></h3>
          ${curQ ? `<div class="item-sub" style="margin-bottom:8px;color:#cbd5e1;">현재 진행: <strong style="color:#fde047">${curQ.seasonTitle}</strong> · ${curQ.title}</div>` : '<div class="item-sub" style="margin-bottom:8px;color:#4ade80;">모든 10부 200장 대서사시를 완결했습니다!</div>'}
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;">${seasonPills}</div>
          <div style="font-size:12px;font-weight:800;color:#fff;margin-bottom:4px;">${seasonTitle}</div>
          <div class="list-grid">${rows}</div>
        </div>
      `;

      body.querySelectorAll('[data-pick-season]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.audio.playSfx('ui');
          this.selectedChronicleSeason = Number(btn.dataset.pickSeason);
          this.renderHeroModal();
        });
      });

      body.querySelectorAll('[data-claim-bounty]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const bIdx = Number(btn.dataset.claimBounty);
          const bn = h.bounties[bIdx];
          if (!bn || bn.progress < bn.goal) return;
          const gRew = Math.round(bn.gold * bountyScale);
          const eRew = Math.round(bn.exp * bountyScale);
          h.gold += gRew;
          this.gainExp(eRew);
          this.giveItem('mat_enhance', 1);
          this.audio.playSfx('quest');
          // Progress 'bounty_clear' main scenario quest!
          if (h.questState === 'active') {
            const cq = DATA.QUESTS[h.questIdx];
            if (cq && cq.type === 'bounty_clear') {
              h.questProgress = Math.min(cq.goal, h.questProgress + 1);
              if (h.questProgress >= cq.goal) {
                h.questState = 'ready';
                this.addFloatText(h.x, h.y - 34, '길드 의뢰 퀘스트 달성!', '#4ade80', true);
              }
            }
          }
          const pool = DATA.SIDE_BOUNTY_POOL || [];
          const maxPool = Math.min(pool.length, Math.max(2, Math.floor((h.questIdx || 0) / 3) + 2));
          const fresh = pool[Math.floor(Math.random() * maxPool)];
          h.bounties[bIdx] = { ...fresh, progress: 0, uid: 'bn_' + Math.random().toString(36).slice(2, 8) };
          this.saveGame(true);
          this.renderHeroModal();
        });
      });

      const proceedBtn = body.querySelector('#btnStoryProceed');
      if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
          this.closeModal();
          this.handleElderQuestDialog();
        });
      }
    }

    renderWorldTab(body) {
      const h = this.hero;
      this.ensureHeroExtras(h);
      const season = this.getStorySeason();
      const nextFl = Math.min(100, (h.towerBest || 0) + 1);
      const curQ = h.questState !== 'all_done' ? DATA.QUESTS[h.questIdx] : null;
      const qTargetMap = curQ ? curQ.targetMap : null;
      const continents = DATA.CONTINENTS || [];

      const classicSet = new Set(['meadow', 'coast', 'forest', 'canyon', 'ruins', 'citadel', 'altar']);
      const getOverworldKey = (mapId) => {
        if (!mapId) return 'cont_1';
        if (mapId === 'tower') return 'tower';
        if (classicSet.has(mapId)) return 'classic';
        const m = DATA.MAPS[mapId];
        if (m && m.continentId) return `cont_${m.continentId}`;
        return 'cont_1';
      };

      const curOvKey = getOverworldKey(this.currentMapId);
      const questOvKey = qTargetMap ? getOverworldKey(qTargetMap) : null;

      if (!this.worldMapMode) this.worldMapMode = 'overworld';
      if (!this.worldMapSelectedKey) this.worldMapSelectedKey = questOvKey || curOvKey;
      if (this.selectedContinentTab === undefined) {
        const curMapObj = DATA.MAPS[this.currentMapId];
        this.selectedContinentTab = (curMapObj && curMapObj.continentId) ? curMapObj.continentId : 1;
      }

      // Overworld nodes & inter-town road / airship graph
      const ovNodes = {
        classic: {
          key: 'classic', kind: 'field', x: 42, y: 124, r: 11,
          short: '고전 7필드', name: '고전 솔티아 필드 (초원~제단)',
          sub: '바람의 초원 · 물안개 해안 · 속삭이는 숲 · 불꽃 협곡 · 성채 · 제단',
          islandColor: '#1f6f54', accentColor: '#86efac',
          contId: 0, warpMap: 'meadow', wx: 11.5, wy: 15.5, recLv: '1~18'
        },
        tower: {
          key: 'tower', kind: 'tower', x: 196, y: 156, r: 14,
          short: '심연의 탑', name: '심연의 탑 (1~100층)',
          sub: '5층마다 탑 보스 등장 · 클리어 시 성좌의 은하수 가루 & 강화석 확정!',
          islandColor: '#4c1d95', accentColor: '#c084fc',
          contId: null, warpMap: 'tower', wx: 11.5, wy: 14.5, recLv: '1~160+'
        }
      };
      continents.forEach((c) => {
        const startZ = (c.id - 1) * 20 + 1;
        const endZ = c.id * 20;
        const lvA = Math.max(2, Math.round(startZ * 0.78 + 1));
        const lvB = Math.max(2, Math.round(endZ * 0.78 + 1));
        ovNodes[`cont_${c.id}`] = {
          key: `cont_${c.id}`, kind: 'town', x: c.mapX, y: c.mapY, r: c.id === 1 ? 15 : 13,
          short: c.townShort, name: c.townName, contName: c.name,
          sub: c.townSubtitle, islandColor: c.islandColor, accentColor: c.accentColor,
          contId: c.id, warpMap: c.townId, wx: 11.5, wy: 11.5,
          recLv: `${lvA}~${lvB}`, matId: c.matId, bonusMatId: c.bonusMatId || null,
          zoneRange: `${startZ}~${endZ}구역`
        };
      });

      const ovEdges = [
        { a: 'classic', b: 'cont_1', type: 'road' },
        { a: 'cont_1', b: 'cont_2', type: 'road' },
        { a: 'cont_2', b: 'cont_3', type: 'road' },
        { a: 'cont_3', b: 'cont_4', type: 'road' },
        { a: 'cont_4', b: 'cont_5', type: 'road' },
        { a: 'cont_5', b: 'cont_6', type: 'road' },
        { a: 'cont_6', b: 'cont_7', type: 'road' },
        { a: 'cont_7', b: 'cont_8', type: 'road' },
        { a: 'cont_8', b: 'cont_9', type: 'road' },
        { a: 'cont_9', b: 'cont_10', type: 'road' },
        { a: 'cont_1', b: 'tower', type: 'air' },
        { a: 'cont_6', b: 'tower', type: 'air' },
        { a: 'cont_10', b: 'tower', type: 'air' }
      ];

      const findShortestPath = (start, goal) => {
        if (start === goal) return [start];
        const adj = {};
        ovEdges.forEach((e) => {
          (adj[e.a] = adj[e.a] || []).push(e.b);
          (adj[e.b] = adj[e.b] || []).push(e.a);
        });
        const q = [[start]];
        const seen = new Set([start]);
        while (q.length) {
          const path = q.shift();
          const cur = path[path.length - 1];
          for (const nxt of (adj[cur] || [])) {
            if (nxt === goal) return [...path, nxt];
            if (!seen.has(nxt)) {
              seen.add(nxt);
              q.push([...path, nxt]);
            }
          }
        }
        return [start, goal];
      };

      // =========================================================
      // MODE A: OVERWORLD TOWN-TO-TOWN ARCHIPELAGO MAP
      // =========================================================
      if (this.worldMapMode === 'overworld') {
        const selNode = ovNodes[this.worldMapSelectedKey] || ovNodes.cont_1;
        const activePath = findShortestPath(curOvKey, selNode.key);
        const activePairs = new Set();
        for (let i = 0; i < activePath.length - 1; i++) {
          activePairs.add(`${activePath[i]}|${activePath[i + 1]}`);
          activePairs.add(`${activePath[i + 1]}|${activePath[i]}`);
        }

        const islandSvg = Object.values(ovNodes).map((n) => {
          const rx = n.kind === 'tower' ? 24 : (n.kind === 'field' ? 22 : 28);
          const ry = n.kind === 'tower' ? 17 : (n.kind === 'field' ? 15 : 19);
          return `
            <ellipse cx="${n.x}" cy="${n.y + 3}" rx="${rx + 4}" ry="${ry + 3}" fill="rgba(56,189,248,0.12)" />
            <ellipse cx="${n.x}" cy="${n.y}" rx="${rx}" ry="${ry}" fill="${n.islandColor}" stroke="${n.accentColor}" stroke-opacity="0.45" stroke-width="1.2" />
          `;
        }).join('');

        const edgesSvg = ovEdges.map((e) => {
          const na = ovNodes[e.a], nb = ovNodes[e.b];
          if (!na || !nb) return '';
          const mx = (na.x + nb.x) / 2;
          const my = (na.y + nb.y) / 2 - (e.type === 'air' ? 10 : 6);
          const d = `M ${na.x} ${na.y} Q ${mx} ${my} ${nb.x} ${nb.y}`;
          const isAct = activePairs.has(`${e.a}|${e.b}`);
          return `
            <path d="${d}" class="${e.type === 'air' ? 'wmap-route-air' : 'wmap-route-base'}" />
            ${isAct ? `<path d="${d}" class="wmap-route-active" />` : ''}
          `;
        }).join('');

        const nodesSvg = Object.values(ovNodes).map((n) => {
          const isHere = curOvKey === n.key;
          const isQuest = questOvKey === n.key;
          const isSel = selNode.key === n.key;
          const fill = n.kind === 'town' ? '#0284c7' : (n.kind === 'tower' ? '#7e22ce' : '#16a34a');
          const stroke = isSel ? '#fde047' : (isHere ? '#4ade80' : '#f8fafc');
          const sw = isSel ? 2.8 : 1.8;
          const glyph = n.kind === 'town'
            ? `<path d="M ${n.x - 5} ${n.y + 1} L ${n.x} ${n.y - 4.5} L ${n.x + 5} ${n.y + 1} V ${n.y + 5} H ${n.x - 5} Z" fill="#fff8dc" />`
            : (n.kind === 'tower'
              ? `<path d="M ${n.x} ${n.y - 6} L ${n.x + 4} ${n.y + 5} H ${n.x - 4} Z" fill="#f5d0fe" />`
              : `<circle cx="${n.x}" cy="${n.y}" r="3.6" fill="#dcfce7" />`);
          return `
            <g class="wmap-node${isSel ? ' selected' : ''}" data-ov-pick="${n.key}">
              ${isHere ? `<circle cx="${n.x}" cy="${n.y}" r="${n.r + 3}" class="wmap-pulse-ring" stroke="#4ade80" />` : ''}
              ${isSel && !isHere ? `<circle cx="${n.x}" cy="${n.y}" r="${n.r + 3}" class="wmap-pulse-ring" stroke="#fde047" />` : ''}
              <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />
              ${glyph}
              ${isQuest ? `<text x="${n.x + n.r - 1}" y="${n.y - n.r + 4}" font-size="11" text-anchor="middle">⭐</text>` : ''}
              ${isHere ? `<text x="${n.x - n.r + 1}" y="${n.y - n.r + 4}" font-size="10" text-anchor="middle">📍</text>` : ''}
              <text x="${n.x}" y="${n.y + n.r + 11}" class="wmap-label">${n.short}</text>
            </g>
          `;
        }).join('');

        const routeSummary = activePath.length > 1
          ? `경로: ${activePath.map((k) => ovNodes[k]?.short || k).join(' → ')}`
          : '현재 머무르고 있는 지역입니다.';

        const matNames = [];
        if (selNode.matId && DATA.ITEMS[selNode.matId]) matNames.push(DATA.ITEMS[selNode.matId].name);
        if (selNode.bonusMatId && DATA.ITEMS[selNode.bonusMatId]) matNames.push(DATA.ITEMS[selNode.bonusMatId].name);

        let cardActions = '';
        if (selNode.kind === 'tower') {
          cardActions = `
            <button type="button" class="rpg-btn primary" id="btnEnterTowerNext">⚡ 다음 층 도전 (${nextFl}층)</button>
            ${(h.towerBest || 0) >= 5 ? `<button type="button" class="rpg-btn secondary" id="btnEnterTowerBoss">👑 직전 보스층 (${Math.floor((h.towerBest || 5) / 5) * 5}층)</button>` : ''}
          `;
        } else if (selNode.kind === 'town') {
          const isAlreadyInTown = this.currentMapId === selNode.warpMap;
          cardActions = `
            <button type="button" class="rpg-btn primary" data-warp-map="${selNode.warpMap}" data-wx="${selNode.wx}" data-wy="${selNode.wy}" ${isAlreadyInTown ? 'disabled' : ''}>${isAlreadyInTown ? '현재 마을 위치 중' : `✈ ${selNode.short} 마을 이동`}</button>
            <button type="button" class="rpg-btn secondary" data-open-region="${selNode.contId}">🗺 세부 루트 (${selNode.zoneRange.replace('구역', '')})</button>
          `;
        } else {
          cardActions = `
            <button type="button" class="rpg-btn primary" data-open-region="0">🗺 고전 솔티아 루트 지도</button>
            <button type="button" class="rpg-btn secondary" data-warp-map="meadow" data-wx="11.5" data-wy="15.5">⚡ 바람의 초원 이동</button>
          `;
        }

        const kindBadge = selNode.kind === 'town'
          ? '<span class="badge" style="color:#7dd3fc;border-color:rgba(56,189,248,0.5)">🔵 마을 · 안전지대</span>'
          : (selNode.kind === 'tower'
            ? `<span class="badge" style="color:#d8b4fe;border-color:rgba(192,132,252,0.55)">🟣 최고 ${h.towerBest || 0} / 100층</span>`
            : '<span class="badge" style="color:#86efac;border-color:rgba(74,222,128,0.5)">🟢 클래식 8지역</span>');

        body.innerHTML = `
          <div class="wmap-shell">
            <div class="wmap-topbar">
              <div class="wmap-title-group">
                <span class="wmap-title">솔티아 대륙 월드맵</span>
                <span class="badge" style="color:#fde047">10마을 · ${Object.keys(DATA.MAPS).length}맵</span>
              </div>
              <button type="button" class="tab-btn" id="btnJumpCurrentRegion" style="padding:5px 10px;font-size:11px;">현재 대륙 세부지도 ▸</button>
            </div>

            <div class="wmap-stage">
              <svg viewBox="0 0 360 276" class="wmap-svg" role="img" aria-label="솔티아 대륙 월드맵">
                <defs>
                  <radialGradient id="wmOcean" cx="50%" cy="46%" r="65%">
                    <stop offset="0%" stop-color="#173e72" />
                    <stop offset="60%" stop-color="#0b2042" />
                    <stop offset="100%" stop-color="#051024" />
                  </radialGradient>
                </defs>
                <rect width="360" height="276" fill="url(#wmOcean)" />
                <g opacity="0.16" stroke="#7dd3fc" stroke-width="0.6">
                  <line x1="0" y1="69" x2="360" y2="69" />
                  <line x1="0" y1="138" x2="360" y2="138" />
                  <line x1="0" y1="207" x2="360" y2="207" />
                  <line x1="90" y1="0" x2="90" y2="276" />
                  <line x1="180" y1="0" x2="180" y2="276" />
                  <line x1="270" y1="0" x2="270" y2="276" />
                </g>
                <g opacity="0.55" transform="translate(26,252)">
                  <circle cx="0" cy="0" r="13" fill="rgba(6,14,32,0.7)" stroke="#fde68a" stroke-width="1" />
                  <path d="M0 -9 L2.5 -2 L9 0 L2.5 2 L0 9 L-2.5 2 L-9 0 L-2.5 -2 Z" fill="#fde68a" />
                  <text x="0" y="-15" font-size="7" font-weight="900" fill="#fde68a" text-anchor="middle">N</text>
                </g>
                ${islandSvg}
                ${edgesSvg}
                ${nodesSvg}
              </svg>
              <div class="wmap-legend">
                <span><i class="wmap-dot town"></i>마을</span>
                <span><i class="wmap-dot here"></i>현위치</span>
                <span><i class="wmap-dot quest"></i>퀘스트</span>
                <span>━━ 도로</span>
                <span>╌╌ 비공정</span>
              </div>
            </div>

            <div class="wmap-card">
              <div class="wmap-card-head">
                <div class="wmap-card-title">${selNode.name}</div>
                ${kindBadge}
              </div>
              <div class="wmap-card-desc">${selNode.contName ? `<strong style="color:#fde68a">${selNode.contName}</strong> · ` : ''}${selNode.sub}</div>
              <div class="wmap-meta-row">
                <span class="wmap-meta-chip">권장 Lv.${selNode.recLv}</span>
                ${selNode.kind === 'town' ? '<span class="wmap-meta-chip">상점·대장간·치유분수</span>' : ''}
                ${matNames.length ? `<span class="wmap-meta-chip">재료: ${matNames.join(', ')}</span>` : ''}
                <span class="wmap-meta-chip" style="color:#bae6fd">${routeSummary}</span>
              </div>
              <div class="wmap-actions">${cardActions}</div>
            </div>
          </div>
        `;

        body.querySelectorAll('[data-ov-pick]').forEach((el) => {
          el.addEventListener('click', () => {
            this.audio.playSfx('ui');
            this.worldMapSelectedKey = el.getAttribute('data-ov-pick');
            this.renderHeroModal();
          });
        });
        body.querySelectorAll('[data-open-region]').forEach((btn) => {
          btn.addEventListener('click', () => {
            this.audio.playSfx('ui');
            this.selectedContinentTab = Number(btn.dataset.openRegion);
            this.worldMapMode = 'region';
            this.worldMapSelectedZoneId = null;
            this.renderHeroModal();
          });
        });
        const jumpCurBtn = body.querySelector('#btnJumpCurrentRegion');
        if (jumpCurBtn) {
          jumpCurBtn.addEventListener('click', () => {
            this.audio.playSfx('ui');
            const curM = DATA.MAPS[this.currentMapId];
            this.selectedContinentTab = classicSet.has(this.currentMapId) ? 0 : ((curM && curM.continentId) ? curM.continentId : 1);
            this.worldMapMode = 'region';
            this.worldMapSelectedZoneId = this.currentMapId;
            this.renderHeroModal();
          });
        }
        const nextBtn = body.querySelector('#btnEnterTowerNext');
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            this.closeModal();
            this.audio.playSfx('portal');
            this.enterTowerFloor(nextFl);
          });
        }
        const bossBtn = body.querySelector('#btnEnterTowerBoss');
        if (bossBtn) {
          bossBtn.addEventListener('click', () => {
            this.closeModal();
            this.audio.playSfx('portal');
            this.enterTowerFloor(Math.max(5, Math.floor((h.towerBest || 5) / 5) * 5));
          });
        }
        body.querySelectorAll('[data-warp-map]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const mid = btn.dataset.warpMap;
            const wx = Number(btn.dataset.wx), wy = Number(btn.dataset.wy);
            this.closeModal();
            this.audio.playSfx('portal');
            this.loadMap(mid, wx, wy);
            this.saveGame(true);
          });
        });
        return;
      }

      // =========================================================
      // MODE B: REGION ROUTE MAP (TOWN <-> 20 ZONES OR CLASSIC 8)
      // =========================================================
      const selCont = this.selectedContinentTab;
      const cont = selCont > 0 ? continents[selCont - 1] : null;

      let routeNodes = [];
      let routeEdges = [];
      let regionTitle = '클래식 솔티아 루트 지도';
      let bgGradA = '#164e3b', bgGradB = '#071b1a';

      if (selCont === 0) {
        routeNodes = [
          { id: 'town', x: 180, y: 244, wx: 11.5, wy: 11.5, isTown: true, short: '솔티아 마을' },
          { id: 'meadow', x: 180, y: 194, wx: 11.5, wy: 15.5, short: '바람의 초원' },
          { id: 'coast', x: 74, y: 194, wx: 20.5, wy: 8.5, short: '물안개 해안' },
          { id: 'forest', x: 180, y: 142, wx: 2.5, wy: 8.5, short: '속삭이는 숲' },
          { id: 'canyon', x: 286, y: 142, wx: 2.5, wy: 8.5, short: '불꽃 협곡' },
          { id: 'ruins', x: 286, y: 88, wx: 11.5, wy: 15.5, short: '고대 유적' },
          { id: 'citadel', x: 180, y: 88, wx: 11.5, wy: 15.5, short: '심연 성채' },
          { id: 'altar', x: 180, y: 36, wx: 11.5, wy: 15.5, isBoss: true, short: '심연의 제단' }
        ];
        routeEdges = [
          ['town', 'meadow'], ['meadow', 'coast'], ['meadow', 'forest'],
          ['forest', 'canyon'], ['canyon', 'ruins'], ['ruins', 'citadel'], ['citadel', 'altar']
        ];
      } else if (cont) {
        regionTitle = `${cont.name} · 세부 루트`;
        bgGradA = cont.islandColor;
        bgGradB = '#081226';
        const startZ = (selCont - 1) * 20 + 1;
        routeNodes.push({
          id: cont.townId, x: 180, y: 26, wx: 11.5, wy: 11.5, isTown: true, short: cont.townName
        });
        const cols = [44, 112, 180, 248, 316];
        const rowsY = [78, 134, 190, 246];
        for (let idx = 0; idx < 20; idx++) {
          const z = startZ + idx;
          const r = Math.floor(idx / 5);
          const c = (r % 2 === 0) ? (idx % 5) : (4 - (idx % 5));
          const m = DATA.MAPS[`zone_${z}`];
          routeNodes.push({
            id: `zone_${z}`,
            x: cols[c],
            y: rowsY[r],
            wx: 11.5,
            wy: 14.8,
            zoneNum: z,
            isBoss: Boolean(m && m.isBossZone),
            short: `${z}`
          });
        }
        routeEdges.push([cont.townId, `zone_${startZ}`]);
        for (let idx = 0; idx < 19; idx++) {
          routeEdges.push([`zone_${startZ + idx}`, `zone_${startZ + idx + 1}`]);
        }
      }

      const nodeById = {};
      routeNodes.forEach((n) => { nodeById[n.id] = n; });

      if (!this.worldMapSelectedZoneId || !nodeById[this.worldMapSelectedZoneId]) {
        if (nodeById[this.currentMapId]) this.worldMapSelectedZoneId = this.currentMapId;
        else if (qTargetMap && nodeById[qTargetMap]) this.worldMapSelectedZoneId = qTargetMap;
        else this.worldMapSelectedZoneId = routeNodes[0] ? routeNodes[0].id : 'town';
      }
      const selR = nodeById[this.worldMapSelectedZoneId] || routeNodes[0];
      const selMap = DATA.MAPS[selR.id];

      const regEdgesSvg = routeEdges.map(([aId, bId]) => {
        const na = nodeById[aId], nb = nodeById[bId];
        if (!na || !nb) return '';
        return `<line x1="${na.x}" y1="${na.y}" x2="${nb.x}" y2="${nb.y}" class="wmap-route-base" />`;
      }).join('');

      const regNodesSvg = routeNodes.map((n) => {
        const m = DATA.MAPS[n.id];
        if (!m) return '';
        const isHere = this.currentMapId === n.id;
        const isQuest = qTargetMap === n.id;
        const isSel = selR.id === n.id;
        const hasChest = m.chests && m.chests.some((ch) => !h.openedChests[ch.id]);
        const unlocked = selCont !== 0 || !!h.unlockedMaps[n.id] || season >= 2 || n.id === 'town' || n.id === 'meadow';
        const rad = n.isTown ? 15 : (n.isBoss ? 13 : 11);
        const fill = !unlocked ? '#334155' : (n.isTown ? '#0284c7' : (n.isBoss ? '#e11d48' : '#d97706'));
        const stroke = isSel ? '#fde047' : (isHere ? '#4ade80' : '#f8fafc');
        const label = n.isTown
          ? `<text x="${n.x}" y="${n.y + rad + 11}" class="wmap-label">${n.short}</text>`
          : (selCont === 0
            ? `<text x="${n.x}" y="${n.y + rad + 11}" class="wmap-label">${n.short}</text>`
            : `<text x="${n.x}" y="${n.y + 3.5}" font-size="8.5" font-weight="900" fill="#fff" text-anchor="middle" pointer-events="none">${n.short}</text>`);
        return `
          <g class="wmap-node${isSel ? ' selected' : ''}" data-pick-zone="${n.id}" opacity="${unlocked ? 1 : 0.55}">
            ${isHere ? `<circle cx="${n.x}" cy="${n.y}" r="${rad + 3}" class="wmap-pulse-ring" stroke="#4ade80" />` : ''}
            ${isSel && !isHere ? `<circle cx="${n.x}" cy="${n.y}" r="${rad + 3}" class="wmap-pulse-ring" stroke="#fde047" />` : ''}
            <circle cx="${n.x}" cy="${n.y}" r="${rad}" fill="${fill}" stroke="${stroke}" stroke-width="${isSel ? 2.6 : 1.7}" />
            ${n.isTown ? `<path d="M ${n.x - 5} ${n.y + 1} L ${n.x} ${n.y - 4.5} L ${n.x + 5} ${n.y + 1} V ${n.y + 5} H ${n.x - 5} Z" fill="#fff8dc" />` : ''}
            ${n.isBoss ? `<text x="${n.x}" y="${n.y - rad - 2}" font-size="9.5" text-anchor="middle" pointer-events="none">👑</text>` : ''}
            ${hasChest ? `<circle cx="${n.x + rad - 2}" cy="${n.y + rad - 2}" r="3.4" fill="#fde047" stroke="#1e293b" stroke-width="1" />` : ''}
            ${isQuest ? `<text x="${n.x + rad}" y="${n.y - rad + 4}" font-size="10" text-anchor="middle" pointer-events="none">⭐</text>` : ''}
            ${isHere ? `<text x="${n.x - rad}" y="${n.y - rad + 4}" font-size="9.5" text-anchor="middle" pointer-events="none">📍</text>` : ''}
            ${label}
          </g>
        `;
      }).join('');

      const contPills = [
        `<button type="button" class="tab-btn${selCont === 0 ? ' active' : ''}" data-pick-cont="0" style="padding:4px 8px;font-size:10.5px;">고전8</button>`,
        ...continents.map((c) => `<button type="button" class="tab-btn${selCont === c.id ? ' active' : ''}" data-pick-cont="${c.id}" style="padding:4px 8px;font-size:10.5px;">${c.townShort}</button>`)
      ].join('');

      const selUnlocked = selCont !== 0 || !!h.unlockedMaps[selR.id] || season >= 2 || selR.id === 'town' || selR.id === 'meadow';
      const selIsHere = this.currentMapId === selR.id;
      const selHasChest = selMap && selMap.chests && selMap.chests.some((ch) => !h.openedChests[ch.id]);
      const selMats = [];
      if (selMap && selMap.matId && DATA.ITEMS[selMap.matId]) selMats.push(DATA.ITEMS[selMap.matId].name);
      if (selMap && selMap.bonusMatId && DATA.ITEMS[selMap.bonusMatId]) selMats.push(DATA.ITEMS[selMap.bonusMatId].name);

      const quickListHtml = routeNodes.map((n) => {
        const m = DATA.MAPS[n.id];
        if (!m) return '';
        const isHere = this.currentMapId === n.id;
        const isTarget = qTargetMap === n.id;
        const hasChest = m.chests && m.chests.some((ch) => !h.openedChests[ch.id]);
        const unlocked = selCont !== 0 || !!h.unlockedMaps[n.id] || season >= 2 || n.id === 'town' || n.id === 'meadow';
        return `
          <div class="item-row" style="${isHere ? 'border-color:rgba(74,222,128,0.65);' : (isTarget ? 'border-color:rgba(56,189,248,0.65);' : '')}">
            <div class="item-info">
              <div class="item-title">
                ${n.isTown ? '🔵 ' : ''}${m.name}
                ${m.recLv ? `<span class="badge">Lv.${m.recLv}</span>` : ''}
                ${m.isBossZone ? '<span class="badge" style="color:#fb7185">👑</span>' : ''}
                ${hasChest ? '<span class="badge" style="color:#fde047">🎁</span>' : ''}
                ${isHere ? '<span class="badge" style="color:#4ade80">현재</span>' : ''}
                ${isTarget ? '<span class="badge" style="color:#38bdf8">⭐</span>' : ''}
              </div>
              <div class="item-sub">${m.subtitle}</div>
            </div>
            <div class="item-actions">
              <button class="rpg-btn ${isHere ? 'secondary' : 'primary'} small" data-warp-map="${n.id}" data-wx="${n.wx}" data-wy="${n.wy}" ${(!unlocked || isHere) ? 'disabled' : ''}>${unlocked ? (isHere ? '위치 중' : '이동') : '미발견'}</button>
            </div>
          </div>
        `;
      }).join('');

      body.innerHTML = `
        <div class="wmap-shell">
          <div class="wmap-topbar">
            <button type="button" class="rpg-btn secondary small" id="btnBackOverworld" style="padding:6px 10px;">← 전체 월드맵</button>
            <span class="wmap-title" style="font-size:13px;">${regionTitle}</span>
          </div>

          <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none;">${contPills}</div>

          <div class="wmap-stage">
            <svg viewBox="0 0 360 282" class="wmap-svg" role="img" aria-label="${regionTitle}">
              <defs>
                <radialGradient id="wmRegBg" cx="50%" cy="35%" r="75%">
                  <stop offset="0%" stop-color="${bgGradA}" stop-opacity="0.72" />
                  <stop offset="100%" stop-color="${bgGradB}" />
                </radialGradient>
              </defs>
              <rect width="360" height="282" fill="url(#wmRegBg)" />
              ${regEdgesSvg}
              ${regNodesSvg}
            </svg>
            <div class="wmap-legend">
              <span><i class="wmap-dot town"></i>마을</span>
              <span><i class="wmap-dot field"></i>사냥터</span>
              <span><i class="wmap-dot boss"></i>보스</span>
              <span><i class="wmap-dot here"></i>현위치</span>
              <span>🟡 상자</span>
            </div>
          </div>

          <div class="wmap-card">
            <div class="wmap-card-head">
              <div class="wmap-card-title">${selMap ? selMap.name : selR.short}</div>
              ${selR.isTown
                ? '<span class="badge" style="color:#7dd3fc">🔵 안전 마을</span>'
                : (selR.isBoss ? '<span class="badge" style="color:#fb7185">👑 보스 구역</span>' : (selMap && selMap.recLv ? `<span class="badge">권장 Lv.${selMap.recLv}</span>` : ''))}
            </div>
            <div class="wmap-card-desc">${selMap ? selMap.subtitle : ''}</div>
            <div class="wmap-meta-row">
              ${selR.isTown ? '<span class="wmap-meta-chip">상점 · 대장간 · 치유분수 · 비공정</span>' : ''}
              ${selMats.length ? `<span class="wmap-meta-chip">드랍 재료: ${selMats.join(', ')}</span>` : ''}
              ${selHasChest ? '<span class="wmap-meta-chip" style="color:#fde047">🎁 미개봉 보물상자 있음</span>' : ''}
              ${qTargetMap === selR.id ? '<span class="wmap-meta-chip" style="color:#38bdf8">⭐ 현재 퀘스트 목표</span>' : ''}
            </div>
            <div class="wmap-actions">
              <button type="button" class="rpg-btn primary" data-warp-map="${selR.id}" data-wx="${selR.wx}" data-wy="${selR.wy}" ${(!selUnlocked || selIsHere) ? 'disabled' : ''}>${selUnlocked ? (selIsHere ? '현재 위치 중' : '⚡ 여기로 즉시 이동') : '미발견 지역'}</button>
              ${cont && selR.id !== cont.townId ? `<button type="button" class="rpg-btn secondary" data-warp-map="${cont.townId}" data-wx="11.5" data-wy="11.5">🔵 ${cont.townShort} 마을</button>` : ''}
            </div>
          </div>

          <details class="wmap-list-details">
            <summary><span>📋 전체 구역 목록으로 한눈에 보기 (${routeNodes.length}곳)</span><span>▾</span></summary>
            <div class="list-grid">${quickListHtml}</div>
          </details>
        </div>
      `;

      const backBtn = body.querySelector('#btnBackOverworld');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          this.audio.playSfx('ui');
          this.worldMapMode = 'overworld';
          this.worldMapSelectedKey = selCont === 0 ? 'classic' : `cont_${selCont}`;
          this.renderHeroModal();
        });
      }
      body.querySelectorAll('[data-pick-cont]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.audio.playSfx('ui');
          this.selectedContinentTab = Number(btn.dataset.pickCont);
          this.worldMapSelectedZoneId = null;
          this.renderHeroModal();
        });
      });
      body.querySelectorAll('[data-pick-zone]').forEach((el) => {
        el.addEventListener('click', () => {
          this.audio.playSfx('ui');
          this.worldMapSelectedZoneId = el.getAttribute('data-pick-zone');
          this.renderHeroModal();
        });
      });
      body.querySelectorAll('[data-warp-map]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const mid = btn.dataset.warpMap;
          const wx = Number(btn.dataset.wx), wy = Number(btn.dataset.wy);
          this.closeModal();
          this.audio.playSfx('portal');
          this.loadMap(mid, wx, wy);
          this.saveGame(true);
        });
      });
    }

    openShopModal() {
      this.clearTouchInputs();
      this.state = 'modal'; this.modalType = 'shop'; this.modalTab = 'buy';
      this.el.modalBackdrop.classList.remove('hidden');
      this.renderShopModal();
    }

    renderShopModal(feedback = '') {
      this.renderModalTabs([{ id: 'buy', label: '잡화 구매' }, { id: 'sell', label: '아이템 판매' }], (id) => { this.modalTab = id; this.renderShopModal(); });
      const body = this.el.modalBody, h = this.hero;
      if (this.modalTab === 'buy') {
        body.innerHTML = `<div class="panel-card"><h3>잡화상인 미나 · <span style="color:#fde047">${h.gold.toLocaleString()} G</span></h3><div class="list-grid">${DATA.SHOP_GENERAL.map((id) => {
          const it = DATA.ITEMS[id];
          return `<div class="item-row"><div class="item-info"><div class="item-title"><span style="color:${DATA.RARITY[it.rarity].color}">${it.name}</span> <span class="badge">보유 ${h.bagItems[id] || 0}</span></div><div class="item-sub">${it.desc}</div></div><div class="item-actions"><button class="rpg-btn primary small" data-buy="${id}" ${h.gold < it.price ? 'disabled' : ''}>${it.price}G</button></div></div>`;
        }).join('')}</div></div>`;
        body.querySelectorAll('[data-buy]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.buy, it = DATA.ITEMS[id];
            if (h.gold < it.price) return;
            h.gold -= it.price; this.giveItem(id, 1); this.audio.playSfx('coin'); this.saveGame(true); this.renderShopModal();
          });
        });
      } else {
        this.renderSellView(body, feedback, (msg) => this.renderShopModal(msg));
      }
    }

    renderSellView(body, feedback = '', onRerender) {
      const h = this.hero;

      // 1. Group identical spare equipment by (itemId + enh)
      const eqGroups = [];
      const eqMap = new Map();
      h.bagEquip.forEach((eq) => {
        const key = `${eq.itemId}__${eq.enh || 0}`;
        if (!eqMap.has(key)) {
          const it = DATA.ITEMS[eq.itemId];
          if (!it) return;
          const unitPrice = Math.round(it.price * 0.5 + (eq.enh || 0) * 40);
          const grp = { key, itemId: eq.itemId, enh: eq.enh || 0, sample: eq, count: 0, unitPrice, name: it.name };
          eqMap.set(key, grp);
          eqGroups.push(grp);
        }
        eqMap.get(key).count++;
      });

      // 2. Gather stacked materials & consumables
      const itemGroups = Object.entries(h.bagItems)
        .filter(([id, qty]) => qty > 0 && DATA.ITEMS[id])
        .map(([id, qty]) => {
          const it = DATA.ITEMS[id];
          const unitPrice = Math.max(5, Math.round((it.price || 20) * 0.5));
          return { id, item: it, count: qty, unitPrice };
        });

      const buildQtyRow = ({ rowKey, titleHtml, subHtml, count, unitPrice, kind }) => {
        const initQty = 1;
        return `
          <div class="item-row" style="flex-direction:column;align-items:stretch;gap:7px;" data-sell-row="${rowKey}" data-sell-kind="${kind}" data-max="${count}" data-unit="${unitPrice}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div class="item-info">
                <div class="item-title">${titleHtml} <span class="badge">보유 ${count}개</span> <span style="font-size:11px;color:#fde68a;">개당 ${unitPrice.toLocaleString()}G</span></div>
                <div class="item-sub">${subHtml}</div>
              </div>
              ${count === 1 ? `<div class="item-actions"><button class="rpg-btn primary small" data-exec-sell="${rowKey}">판매 (+${unitPrice.toLocaleString()}G)</button></div>` : ''}
            </div>
            ${count > 1 ? `
              <div class="qty-bar">
                <div class="qty-ctrl">
                  <button type="button" class="qty-btn" data-qty-delta="-1" data-for="${rowKey}">−</button>
                  <input type="number" class="qty-input" data-qty-input="${rowKey}" min="1" max="${count}" value="${initQty}" inputmode="numeric" />
                  <button type="button" class="qty-btn" data-qty-delta="1" data-for="${rowKey}">+</button>
                  <button type="button" class="qty-btn" data-qty-max="${rowKey}">최대</button>
                </div>
                <button type="button" class="rpg-btn primary small" data-exec-sell="${rowKey}">${initQty}개 판매 (+${unitPrice.toLocaleString()}G)</button>
              </div>
            ` : ''}
          </div>
        `;
      };

      const eqHtml = eqGroups.length === 0
        ? '<div class="item-sub">판매할 여분 장비가 없습니다.</div>'
        : eqGroups.map((g) => buildQtyRow({
            rowKey: `eq:${g.key}`,
            titleHtml: this.formatEquipName(g.sample),
            subHtml: this.formatEquipStats(g.sample),
            count: g.count,
            unitPrice: g.unitPrice,
            kind: 'equip'
          })).join('');

      const matHtml = itemGroups.length === 0
        ? '<div class="item-sub">판매할 소비/재료 아이템이 없습니다.</div>'
        : itemGroups.map((g) => buildQtyRow({
            rowKey: `it:${g.id}`,
            titleHtml: `<span style="color:${DATA.RARITY[g.item.rarity].color}">${g.item.name}</span>`,
            subHtml: g.item.desc,
            count: g.count,
            unitPrice: g.unitPrice,
            kind: 'item'
          })).join('');

      body.innerHTML = `
        ${feedback ? `<div style="margin-bottom:10px;padding:8px 12px;border-radius:10px;background:rgba(234,185,92,0.16);border:1px solid rgba(245,208,122,0.5);color:#fde68a;font-weight:800;font-size:12px;">${feedback}</div>` : ''}
        <div class="panel-card" style="margin-bottom:10px;">
          <h3>여분 장비 묶음 판매 <span class="badge" style="color:#fde047">${h.gold.toLocaleString()} G</span></h3>
          <div class="item-sub" style="margin-bottom:8px;">같은 종류·강화 수치의 장비는 개수를 지정해 한 번에 판매할 수 있습니다.</div>
          <div class="list-grid">${eqHtml}</div>
        </div>
        <div class="panel-card">
          <h3>재료 · 소비 아이템 수량 판매</h3>
          <div class="list-grid">${matHtml}</div>
        </div>
      `;

      const syncRowBtn = (rowKey, normalize = true) => {
        const row = body.querySelector(`[data-sell-row="${CSS.escape(rowKey)}"]`);
        if (!row) return 1;
        const max = Number(row.dataset.max) || 1;
        const unit = Number(row.dataset.unit) || 0;
        const inp = row.querySelector(`[data-qty-input="${CSS.escape(rowKey)}"]`);
        const btn = row.querySelector(`[data-exec-sell="${CSS.escape(rowKey)}"]`);
        const raw = inp ? inp.value.trim() : '1';
        let q = parseInt(raw, 10);
        if (!Number.isFinite(q) || q < 1) {
          q = 1;
          if (inp && (normalize || raw !== '')) inp.value = String(q);
        } else if (q > max) {
          q = max;
          if (inp) inp.value = String(q);
        } else if (inp && normalize) {
          inp.value = String(q);
        }
        if (btn && max > 1) btn.textContent = `${q}개 판매 (+${(q * unit).toLocaleString()}G)`;
        return q;
      };

      body.querySelectorAll('[data-qty-delta]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const rk = btn.dataset.for;
          const inp = body.querySelector(`[data-qty-input="${CSS.escape(rk)}"]`);
          if (!inp) return;
          inp.value = String((parseInt(inp.value, 10) || 1) + Number(btn.dataset.qtyDelta));
          this.audio.playSfx('ui');
          syncRowBtn(rk, true);
        });
      });

      body.querySelectorAll('[data-qty-max]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const rk = btn.dataset.qtyMax;
          const row = body.querySelector(`[data-sell-row="${CSS.escape(rk)}"]`);
          const inp = body.querySelector(`[data-qty-input="${CSS.escape(rk)}"]`);
          if (!row || !inp) return;
          inp.value = row.dataset.max;
          this.audio.playSfx('ui');
          syncRowBtn(rk, true);
        });
      });

      body.querySelectorAll('[data-qty-input]').forEach((inp) => {
        inp.addEventListener('input', () => syncRowBtn(inp.dataset.qtyInput, false));
        inp.addEventListener('change', () => syncRowBtn(inp.dataset.qtyInput, true));
        inp.addEventListener('blur', () => syncRowBtn(inp.dataset.qtyInput, true));
      });

      body.querySelectorAll('[data-exec-sell]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const rk = btn.dataset.execSell;
          const row = body.querySelector(`[data-sell-row="${CSS.escape(rk)}"]`);
          if (!row) return;
          const qty = syncRowBtn(rk);
          const kind = row.dataset.sellKind;
          const unit = Number(row.dataset.unit) || 0;
          let sold = 0;
          let label = '';

          if (kind === 'equip') {
            const rawKey = rk.slice(3);
            const [itemId, enhStr] = rawKey.split('__');
            const targetEnh = Number(enhStr) || 0;
            for (let i = h.bagEquip.length - 1; i >= 0 && sold < qty; i--) {
              const e = h.bagEquip[i];
              if (e.itemId === itemId && (e.enh || 0) === targetEnh) {
                h.bagEquip.splice(i, 1);
                sold++;
              }
            }
            const it = DATA.ITEMS[itemId];
            label = `${targetEnh > 0 ? `+${targetEnh} ` : ''}${it ? it.name : itemId}`;
          } else {
            const itemId = rk.slice(3);
            const have = h.bagItems[itemId] || 0;
            sold = Math.min(have, qty);
            if (sold > 0) {
              h.bagItems[itemId] = have - sold;
              if (h.bagItems[itemId] <= 0) delete h.bagItems[itemId];
            }
            const it = DATA.ITEMS[itemId];
            label = it ? it.name : itemId;
          }

          if (sold <= 0) return;
          const totalGold = sold * unit;
          h.gold += totalGold;
          this.audio.playSfx('coin');
          this.refreshQuickBar();
          this.saveGame(true);
          onRerender(`${label} ${sold}개 판매 완료! (+${totalGold.toLocaleString()}G)`);
        });
      });
    }

    openSmithModal(tab = 'enhance') {
      this.clearTouchInputs();
      this.state = 'modal'; this.modalType = 'smith'; this.modalTab = tab;
      this.el.modalBackdrop.classList.remove('hidden');
      this.renderSmithModal();
    }

    renderSmithModal(feedback = '') {
      this.renderModalTabs([
        { id: 'enhance', label: '장비 강화' },
        { id: 'craft', label: '장비 조합' },
        { id: 'gear', label: '장비 구매' },
        { id: 'sell', label: '아이템 판매' }
      ], (id) => { this.modalTab = id; this.renderSmithModal(); });
      const body = this.el.modalBody, h = this.hero, stones = h.bagItems.mat_enhance || 0;

      if (this.modalTab === 'sell') {
        this.renderSellView(body, feedback, (msg) => this.renderSmithModal(msg));
        return;
      }

      if (this.modalTab === 'enhance') {
        const MAX_ENH = 25;
        const enhRate = (e) => (e < 3 ? 100 : Math.max(20, 92 - e * 3));
        const enhCost = (e) => 60 + e * 85;
        const rows = ['weapon', 'armor', 'helm', 'accessory'].map((slot) => {
          const eq = h.equip[slot]; if (!eq) return '';
          const enh = eq.enh || 0, maxed = enh >= MAX_ENH, rate = maxed ? 0 : enhRate(enh), costGold = enhCost(enh);
          const canDo = !maxed && stones >= 1 && h.gold >= costGold;
          return `<div class="item-row"><div class="item-info"><div class="item-title">${this.formatEquipName(eq)} ${maxed ? '<span class="badge">MAX</span>' : `<span class="badge">성공 ${rate}%</span>`}</div><div class="item-sub">${this.formatEquipStats(eq)} ${!maxed ? `· ${costGold.toLocaleString()}G + 강화석 1` : ''}</div></div><div class="item-actions"><button class="rpg-btn primary small" data-enh-slot="${slot}" ${canDo ? '' : 'disabled'}>${maxed ? '최대' : `+${enh + 1}`}</button></div></div>`;
        }).join('');
        body.innerHTML = `<div class="panel-card"><h3>대장장이 볼칸 · <span style="color:#fde047">${h.gold.toLocaleString()}G</span> · 강화석 <span style="color:#4ade80">${stones}</span></h3>${feedback ? `<div style="margin-bottom:8px;padding:7px 10px;border-radius:7px;background:rgba(229,188,101,0.12);border:1px solid rgba(229,188,101,0.4);color:#fde047;font-weight:700;">${feedback}</div>` : ''}<div class="item-sub" style="margin-bottom:8px;">최대 +25 초월 강화! 실패해도 장비는 파괴되지 않습니다. +3/+5/+7/+10/+15/+20 무기는 검기 색상이 진화합니다.</div><div class="list-grid">${rows}</div></div>`;

        const markEnhanceQuest = () => {
          if (h.questState === 'active') {
            const cq = DATA.QUESTS[h.questIdx];
            if (cq && cq.type === 'enhance_gear') {
              h.questProgress = Math.min(cq.goal, h.questProgress + 1);
              if (h.questProgress >= cq.goal) h.questState = 'ready';
            }
          }
        };

        body.querySelectorAll('[data-enh-slot]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const eq = h.equip[btn.dataset.enhSlot];
            if (!eq || eq.enh >= MAX_ENH) return;
            const costGold = enhCost(eq.enh);
            if (h.gold < costGold || (h.bagItems.mat_enhance || 0) < 1) return;
            h.gold -= costGold; h.bagItems.mat_enhance--;
            markEnhanceQuest();
            if (Math.random() * 100 < enhRate(eq.enh)) {
              eq.enh++; this.audio.playSfx('enhanceOk');
              this.renderSmithModal(`강화 성공! ${DATA.ITEMS[eq.itemId].name} +${eq.enh}`);
            } else {
              this.audio.playSfx('enhanceFail');
              this.renderSmithModal('강화 실패 — 장비는 유지되었습니다.');
            }
            this.saveGame(true);
          });
        });
      } else if (this.modalTab === 'craft') {
        const rows = DATA.RECIPES.map((rc) => {
          const res = DATA.ITEMS[rc.result];
          const matStatus = rc.materials.map((m) => {
            const have = h.bagItems[m.id] || 0;
            return `<span style="color:${have >= m.qty ? '#4ade80' : '#f87171'}">${DATA.ITEMS[m.id].name} ${have}/${m.qty}</span>`;
          }).join(' · ');
          const canCraft = h.gold >= rc.gold && rc.materials.every((m) => (h.bagItems[m.id] || 0) >= m.qty);
          return `<div class="item-row"><div class="item-info"><div class="item-title"><span style="color:${DATA.RARITY[res.rarity].color}">${res.name}</span> <span class="badge">${rc.gold}G</span></div><div class="item-sub">${this.formatEquipStats({ itemId: rc.result, enh: 0 })}</div><div class="item-sub">재료: ${matStatus}</div></div><div class="item-actions"><button class="rpg-btn primary small" data-craft="${rc.id}" ${canCraft ? '' : 'disabled'}>조합</button></div></div>`;
        }).join('');
        body.innerHTML = `<div class="panel-card"><h3>장비 조합 · <span style="color:#fde047">${h.gold.toLocaleString()} G</span></h3>${feedback ? `<div style="margin-bottom:8px;padding:7px 10px;border-radius:7px;background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.4);color:#4ade80;font-weight:700;">${feedback}</div>` : ''}<div class="list-grid">${rows}</div></div>`;

        body.querySelectorAll('[data-craft]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const rc = DATA.RECIPES.find((r) => r.id === btn.dataset.craft);
            if (!rc || h.gold < rc.gold || !rc.materials.every((m) => (h.bagItems[m.id] || 0) >= m.qty)) return;
            h.gold -= rc.gold;
            rc.materials.forEach((m) => { h.bagItems[m.id] -= m.qty; });
            this.giveItem(rc.result, 1); this.audio.playSfx('enhanceOk');
            if (h.questState === 'active') {
              const cq = DATA.QUESTS[h.questIdx];
              if (cq && cq.type === 'enhance_gear') {
                h.questProgress = Math.min(cq.goal, h.questProgress + 1);
                if (h.questProgress >= cq.goal) h.questState = 'ready';
              }
            }
            this.renderSmithModal(`조합 성공! [${DATA.ITEMS[rc.result].name}] 획득`);
            this.saveGame(true);
          });
        });
      } else {
        body.innerHTML = `<div class="panel-card"><h3>장비 상점 · <span style="color:#fde047">${h.gold.toLocaleString()} G</span></h3><div class="list-grid">${DATA.SHOP_BLACKSMITH.map((id) => {
          const it = DATA.ITEMS[id];
          return `<div class="item-row"><div class="item-info"><div class="item-title"><span style="color:${DATA.RARITY[it.rarity].color}">${it.name}</span></div><div class="item-sub">${this.formatEquipStats({ itemId: id, enh: 0 })}</div></div><div class="item-actions"><button class="rpg-btn primary small" data-buy-gear="${id}" ${h.gold < it.price ? 'disabled' : ''}>${it.price}G</button></div></div>`;
        }).join('')}</div></div>`;
        body.querySelectorAll('[data-buy-gear]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.buyGear, it = DATA.ITEMS[id];
            if (h.gold < it.price) return;
            h.gold -= it.price; this.giveItem(id, 1); this.audio.playSfx('coin'); this.renderSmithModal();
          });
        });
      }
    }

    loop(ts) {
      const dt = Math.min(0.05, (ts - this.lastTs) / 1000 || 0.016);
      this.lastTs = ts;
      try {
        this.update(dt);
        this.render();
      } catch (err) {
        console.error('Frame error:', err);
      }
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  function bootGame() {
    if (global.game) return;
    try { global.game = new HeroesLoreGame(); } catch (err) { console.error('Boot error:', err); }
  }
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', bootGame);
  else bootGame();
})(window);
