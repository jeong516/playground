// 영웅서기: 솔티아의 바람 — Core Action RPG Engine
(function (global) {
  'use strict';

  const DATA = global.GAME_DATA;
  const TILE = DATA.TILE_SIZE;
  const VIEW_W = 480;
  const VIEW_H = 360;
  const SAVE_KEY = 'heroes_lore_soltia_save_v1';

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

  class HeroesLoreGame {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;

      this.audio = new global.RetroAudio();
      this.sprites = global.buildSprites();

      this.state = 'title'; // 'title', 'select', 'playing', 'dialog', 'modal', 'gameover', 'victory'
      this.selectedClassId = 'knight';
      this.time = 0;
      this.lastTs = 0;

      // Camera & juice
      this.camX = 0;
      this.camY = 0;
      this.shakeTimer = 0;
      this.shakeMag = 0;
      this.bannerText = '';
      this.bannerSub = '';
      this.bannerTimer = 0;

      // Input state
      this.keys = {};
      this.virtualDir = { up: false, down: false, left: false, right: false };
      this.stickX = 0;
      this.stickY = 0;
      this.stickPointerId = null;
      this.holdingAttack = false;
      this.padMode = 'joystick'; // 'joystick' | 'keypad' | 'off'

      // World runtime
      this.currentMapId = 'town';
      this.monsters = [];
      this.projectiles = [];
      this.effects = [];
      this.particles = [];
      this.floatTexts = [];
      this.drops = [];
      this.telegraphs = [];
      this.respawnQueue = [];

      // Dialog & Modal
      this.dialogLines = [];
      this.dialogIdx = 0;
      this.dialogOnDone = null;
      this.modalType = null;
      this.modalTab = null;

      // Hero state
      this.hero = null;

      this.cacheDom();
      this.bindInputs();
      this.setPadMode('joystick');
      this.renderClassCards();
      this.updateTitleButtons();
      this.loop(0);
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
        dialogText: document.getElementById('dialogText'),
        modalBackdrop: document.getElementById('modalBackdrop'),
        modalTabs: document.getElementById('modalTabs'),
        modalBody: document.getElementById('modalBody'),
        modalClose: document.getElementById('modalClose'),
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

    renderClassCards() {
      this.el.classGrid.innerHTML = '';
      Object.values(DATA.CLASSES).forEach((cls) => {
        const card = document.createElement('div');
        card.className = 'class-card' + (cls.id === this.selectedClassId ? ' selected' : '');
        card.dataset.classId = cls.id;

        const preview = document.createElement('canvas');
        preview.width = 16;
        preview.height = 16;
        preview.className = 'class-preview';
        const pctx = preview.getContext('2d');
        pctx.imageSmoothingEnabled = false;
        pctx.drawImage(this.sprites.heroes[cls.id].idle, 0, 0);

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
      try {
        hasSave = !!localStorage.getItem(SAVE_KEY);
      } catch (e) {}
      this.el.btnContinue.disabled = !hasSave;
    }

    // --- HERO INITIALIZATION & STATS ---
    createNewHero(classId) {
      const cls = DATA.CLASSES[classId];
      const nextUid = () => 'eq_' + Math.random().toString(36).slice(2, 9);
      const startWp = { uid: nextUid(), itemId: cls.startWeapon, enh: 0 };
      const startAr = { uid: nextUid(), itemId: 'ar_leather', enh: 0 };

      this.hero = {
        classId,
        name: cls.name,
        title: '',
        lv: 1,
        exp: 0,
        expNext: 60,
        gold: 120,
        statPoints: 0,
        skillPoints: 1,
        base: { ...cls.base },
        hp: 100,
        mp: 50,
        x: 11.5 * TILE,
        y: 11.5 * TILE,
        vx: 0,
        vy: 0,
        dir: 'down',
        facingX: 0,
        facingY: 1,
        walkAnim: 0,
        attackTimer: 0,
        attackCooldown: 0,
        comboStep: 0,
        comboResetTimer: 0,
        dashTimer: 0,
        dashCd: 0,
        invulnTimer: 0,
        buffDefTimer: 0,
        buffSpdTimer: 0,
        skillLevels: [1, 0, 0, 0],
        skillCds: [0, 0, 0, 0],
        equip: {
          weapon: startWp,
          armor: startAr,
          helm: null,
          accessory: null
        },
        bagEquip: [],
        bagItems: {
          pot_hp_s: 4,
          pot_mp_s: 3,
          scroll_town: 2,
          mat_enhance: 1
        },
        openedChests: {},
        questIdx: 0,
        questState: 'available', // 'available', 'active', 'ready', 'all_done'
        questProgress: 0,
        vargasDefeated: false
      };

      const st = this.getHeroStats();
      this.hero.hp = st.maxHp;
      this.hero.mp = st.maxMp;
      this.loadMap('town', 11.5, 11.5);
      this.buildSkillSlotUi();
      this.refreshQuickBar();
      this.state = 'playing';
      this.hideAllScreens();
      this.audio.playBgm('town');
      this.openDialog([
        `[솔티아 연대기] 바람의 대륙 솔티아에 불길한 마기가 퍼지기 시작했습니다.`,
        `${this.hero.name}: "먼저 마을 광장 북쪽에 계신 촌장 엘더님께 이야기를 들어보자."`,
        `[도움말] 이동: 방향키/WASD · 공격/대화: Space/Z/F · 스킬: 1~4 · 회피: Shift`
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
        str: def.str || 0,
        agi: def.agi || 0,
        vit: def.vit || 0,
        int: def.int || 0,
        crit: (def.crit || 0) + (def.type === 'weapon' ? Math.floor(enh / 2) : 0)
      };
    }

    getHeroStats() {
      const h = this.hero;
      let str = h.base.str;
      let agi = h.base.agi;
      let vit = h.base.vit;
      let intel = h.base.int;
      let bonusAtk = 0, bonusDef = 0, bonusHp = 0, bonusMp = 0, bonusCrit = 0;

      Object.values(h.equip).forEach((eq) => {
        if (!eq) return;
        const b = this.getEquipBonus(eq);
        str += b.str; agi += b.agi; vit += b.vit; intel += b.int;
        bonusAtk += b.atk; bonusDef += b.def; bonusHp += b.hp; bonusMp += b.mp; bonusCrit += b.crit;
      });

      const maxHp = 70 + vit * 14 + h.lv * 16 + bonusHp;
      const maxMp = 32 + intel * 8 + h.lv * 6 + bonusMp;
      const atk = Math.round(6 + str * 2.1 + agi * 0.5 + intel * 0.4 + h.lv * 2 + bonusAtk);
      const magicAtk = Math.round(6 + intel * 2.4 + str * 0.6 + h.lv * 2 + bonusAtk);
      let def = Math.round(3 + vit * 1.15 + agi * 0.25 + bonusDef);
      if (h.buffDefTimer > 0) def = Math.round(def * 1.75);

      let crit = clamp(6 + Math.round(agi * 0.85) + bonusCrit, 5, 75);
      if (h.buffSpdTimer > 0) crit = clamp(crit + 30, 5, 92);

      let speed = 104 + Math.min(34, agi * 1.15);
      if (h.buffSpdTimer > 0) speed *= 1.32;

      return { str, agi, vit, int: intel, maxHp, maxMp, atk, magicAtk, def, crit, speed };
    }

    // --- SAVE / LOAD ---
    saveGame(silent = false) {
      if (!this.hero) return;
      try {
        const payload = {
          hero: this.hero,
          currentMapId: this.currentMapId
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
        this.updateTitleButtons();
        if (!silent) {
          this.audio.playSfx('ui');
          this.addFloatText(this.hero.x, this.hero.y - 18, '저장 완료!', '#fde047');
        }
      } catch (e) {
        console.warn('Save failed:', e);
      }
    }

    loadGame() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        this.hero = data.hero;
        this.currentMapId = data.currentMapId || 'town';
        const tx = (this.hero.x || 11.5 * TILE) / TILE;
        const ty = (this.hero.y || 11.5 * TILE) / TILE;
        this.loadMap(this.currentMapId, tx, ty);
        this.buildSkillSlotUi();
        this.refreshQuickBar();
        this.hideAllScreens();
        this.state = 'playing';
        this.audio.playBgm(DATA.MAPS[this.currentMapId].bgm);
        this.addFloatText(this.hero.x, this.hero.y - 20, '모험 이어하기!', '#fde047');
      } catch (e) {
        console.error('Load failed:', e);
      }
    }

    // --- MAP LOADING ---
    loadMap(mapId, tx, ty) {
      const map = DATA.MAPS[mapId];
      if (!map) return;
      this.currentMapId = mapId;
      this.hero.x = tx * TILE;
      this.hero.y = ty * TILE;
      this.hero.vx = 0;
      this.hero.vy = 0;

      this.monsters = [];
      this.projectiles = [];
      this.effects = [];
      this.particles = [];
      this.drops = [];
      this.telegraphs = [];
      this.respawnQueue = [];

      map.spawns.forEach((sp, idx) => {
        if (sp.type === 'vargas' && this.hero.vargasDefeated && this.hero.questState === 'all_done') {
          // Allow boss rematch! Still spawn Vargas so player can refight him
        }
        this.spawnMonster(sp.type, sp.tx * TILE, sp.ty * TILE, idx);
      });

      this.bannerText = map.name;
      this.bannerSub = map.subtitle;
      this.bannerTimer = 2.6;

      if (this.state === 'playing') {
        this.audio.playBgm(map.bgm);
      }
      this.updateCamera(true);
    }

    spawnMonster(typeId, x, y, spawnIdx) {
      const def = DATA.MONSTERS[typeId];
      if (!def) return;
      this.monsters.push({
        uid: 'm_' + Math.random().toString(36).slice(2, 9),
        typeId,
        spawnIdx,
        homeX: x,
        homeY: y,
        x,
        y,
        vx: 0,
        vy: 0,
        hp: def.hp,
        maxHp: def.hp,
        atk: def.atk,
        def: def.def,
        speed: def.speed,
        size: def.size,
        hitFlash: 0,
        stunTimer: 0,
        slowTimer: 0,
        attackCd: 1.0 + Math.random() * 0.8,
        specialCd: 3.5,
        wanderTimer: 0,
        wanderAngle: Math.random() * Math.PI * 2,
        phase2: false,
        anim: Math.random() * 10
      });
    }

    // --- INPUTS ---
    bindInputs() {
      window.addEventListener('keydown', (e) => {
        const code = e.code;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
          e.preventDefault();
        }
        this.keys[code] = true;
        this.audio.init();

        if (this.state === 'dialog') {
          if (code === 'Space' || code === 'Enter' || code === 'KeyZ' || code === 'KeyF') {
            this.advanceDialog();
          }
          return;
        }
        if (this.state === 'modal') {
          if (code === 'Escape' || code === 'KeyI' || code === 'KeyC' || code === 'KeyK' || code === 'KeyJ') {
            this.closeModal();
          }
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
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
      });

      // UI Buttons
      this.el.btnNewGame.addEventListener('click', () => {
        this.audio.init();
        this.audio.playSfx('ui');
        this.audio.playBgm('title');
        this.el.titleScreen.classList.add('hidden');
        this.el.selectScreen.classList.remove('hidden');
        this.state = 'select';
      });

      this.el.btnContinue.addEventListener('click', () => {
        this.audio.init();
        this.audio.playSfx('ui');
        this.loadGame();
      });

      this.el.btnBackTitle.addEventListener('click', () => {
        this.audio.playSfx('ui');
        this.el.selectScreen.classList.add('hidden');
        this.el.titleScreen.classList.remove('hidden');
        this.state = 'title';
      });

      this.el.btnStartAdventure.addEventListener('click', () => {
        this.audio.init();
        this.audio.playSfx('quest');
        this.createNewHero(this.selectedClassId);
      });

      this.el.btnRevive.addEventListener('click', () => {
        this.audio.playSfx('potion');
        const st = this.getHeroStats();
        this.hero.hp = st.maxHp;
        this.hero.mp = st.maxMp;
        this.hero.gold = Math.max(0, Math.floor(this.hero.gold * 0.9));
        this.loadMap('town', 11.5, 11.5);
        this.hideAllScreens();
        this.state = 'playing';
        this.audio.playBgm('town');
        this.addFloatText(this.hero.x, this.hero.y - 22, '솔티아 마을에서 부활!', '#4ade80');
      });

      this.el.btnContinueAfterWin.addEventListener('click', () => {
        this.audio.playSfx('ui');
        this.hideAllScreens();
        this.state = 'playing';
        this.audio.playBgm(DATA.MAPS[this.currentMapId].bgm);
      });

      this.el.dialogBox.addEventListener('click', () => this.advanceDialog());
      this.el.modalClose.addEventListener('click', () => this.closeModal());

      this.el.btnPotHp.addEventListener('click', () => this.useQuickPotion('hp'));
      this.el.btnPotMp.addEventListener('click', () => this.useQuickPotion('mp'));
      this.el.btnScrollTown.addEventListener('click', () => this.useReturnScroll());

      document.querySelectorAll('[data-open-menu]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (this.state === 'playing') this.openHeroModal(btn.dataset.openMenu);
        });
      });

      this.el.btnBgm.addEventListener('click', () => {
        this.audio.init();
        const on = this.audio.toggleBgm();
        this.el.btnBgm.textContent = on ? '🎵 BGM' : '🔇 BGM';
        this.el.btnBgm.classList.toggle('active', on);
      });

      this.el.btnSfx.addEventListener('click', () => {
        this.audio.init();
        const on = this.audio.toggleSfx();
        this.el.btnSfx.textContent = on ? '🔊 효과' : '🔇 효과';
        this.el.btnSfx.classList.toggle('active', on);
      });

      this.el.btnSave.addEventListener('click', () => {
        if (this.hero) this.saveGame(false);
      });

      this.el.btnPadMode.addEventListener('click', () => {
        this.audio.playSfx('ui');
        const next = this.padMode === 'joystick' ? 'keypad' : (this.padMode === 'keypad' ? 'off' : 'joystick');
        this.setPadMode(next);
      });

      // Multi-touch Virtual Analog Joystick
      this.bindVirtualStick();

      // Mobile Right-Hand Action Buttons (Zero-latency pointerdown + Hold-to-Combo)
      if (this.el.btnMobileAttack) {
        const atkBtn = this.el.btnMobileAttack;
        atkBtn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.audio.init();
          atkBtn.classList.add('pressed');
          if (this.state === 'dialog') {
            this.advanceDialog();
            return;
          }
          if (this.state !== 'playing') return;
          if (!this.tryInteract(true)) {
            this.holdingAttack = true;
            this.performBasicAttack();
          }
        });
        const releaseAtk = () => {
          this.holdingAttack = false;
          atkBtn.classList.remove('pressed');
        };
        atkBtn.addEventListener('pointerup', releaseAtk);
        atkBtn.addEventListener('pointerleave', releaseAtk);
        atkBtn.addEventListener('pointercancel', releaseAtk);
      }

      if (this.el.btnMobileDash) {
        this.el.btnMobileDash.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.audio.init();
          if (this.state === 'playing') this.triggerDash();
        });
      }

      // Virtual Feature-Phone Keypad bindings
      const bindDir = (id, dir) => {
        const el = document.getElementById(id);
        if (!el) return;
        const set = (v) => {
          this.virtualDir[dir] = v;
          el.classList.toggle('pressed', v);
        };
        el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.audio.init(); set(true); });
        el.addEventListener('pointerup', () => set(false));
        el.addEventListener('pointerleave', () => set(false));
        el.addEventListener('pointercancel', () => set(false));
      };
      bindDir('padUp', 'up');
      bindDir('padDown', 'down');
      bindDir('padLeft', 'left');
      bindDir('padRight', 'right');

      const padOk = document.getElementById('padOk');
      if (padOk) {
        padOk.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.audio.init();
          if (this.state === 'dialog') this.advanceDialog();
          else if (this.state === 'playing') this.handlePrimaryAction();
        });
      }

      document.querySelectorAll('[data-pad-action]').forEach((btn) => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.audio.init();
          const act = btn.dataset.padAction;
          if (this.state === 'dialog') {
            this.advanceDialog();
            return;
          }
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
      this.stickX = 0;
      this.stickY = 0;
      this.holdingAttack = false;
      this.el.mobileGamepad.classList.toggle('hidden', mode !== 'joystick');
      this.el.phoneKeypad.classList.toggle('hidden', mode !== 'keypad');
      if (mode === 'joystick') {
        this.el.btnPadMode.textContent = '🕹️ 조이스틱';
        this.el.btnPadMode.classList.add('active');
      } else if (mode === 'keypad') {
        this.el.btnPadMode.textContent = '📱 키패드';
        this.el.btnPadMode.classList.add('active');
      } else {
        this.el.btnPadMode.textContent = '⌨️ 패드OFF';
        this.el.btnPadMode.classList.remove('active');
      }
    }

    bindVirtualStick() {
      const zone = this.el.stickZone;
      const knob = this.el.stickKnob;
      if (!zone || !knob) return;
      const maxDist = 36;

      const updateStick = (clientX, clientY) => {
        const rect = zone.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = clientX - cx;
        let dy = clientY - cy;
        const d = Math.hypot(dx, dy);
        if (d > maxDist) {
          dx = (dx / d) * maxDist;
          dy = (dy / d) * maxDist;
        }
        knob.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        if (d < 8) {
          this.stickX = 0;
          this.stickY = 0;
        } else {
          this.stickX = dx / maxDist;
          this.stickY = dy / maxDist;
        }
      };

      const resetStick = () => {
        this.stickPointerId = null;
        this.stickX = 0;
        this.stickY = 0;
        knob.style.transform = 'translate(0px, 0px)';
        zone.classList.remove('active');
      };

      zone.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.audio.init();
        if (this.stickPointerId !== null) return;
        this.stickPointerId = e.pointerId;
        zone.classList.add('active');
        try { zone.setPointerCapture(e.pointerId); } catch (_) {}
        updateStick(e.clientX, e.clientY);
      });

      zone.addEventListener('pointermove', (e) => {
        if (e.pointerId !== this.stickPointerId) return;
        e.preventDefault();
        updateStick(e.clientX, e.clientY);
      });

      zone.addEventListener('pointerup', (e) => {
        if (e.pointerId !== this.stickPointerId) return;
        resetStick();
      });

      zone.addEventListener('pointercancel', (e) => {
        if (e.pointerId !== this.stickPointerId) return;
        resetStick();
      });
    }

    hideAllScreens() {
      this.el.titleScreen.classList.add('hidden');
      this.el.selectScreen.classList.add('hidden');
      this.el.gameoverScreen.classList.add('hidden');
      this.el.victoryScreen.classList.add('hidden');
    }

    clearTouchInputs() {
      this.stickPointerId = null;
      this.stickX = 0;
      this.stickY = 0;
      this.holdingAttack = false;
      this.virtualDir.up = false;
      this.virtualDir.down = false;
      this.virtualDir.left = false;
      this.virtualDir.right = false;
      if (this.el.stickKnob) this.el.stickKnob.style.transform = 'translate(0px, 0px)';
      if (this.el.stickZone) this.el.stickZone.classList.remove('active');
      if (this.el.btnMobileAttack) this.el.btnMobileAttack.classList.remove('pressed');
    }

    // --- DIALOG ---
    openDialog(lines, onDone = null) {
      this.clearTouchInputs();
      this.dialogLines = lines;
      this.dialogIdx = 0;
      this.dialogOnDone = onDone;
      this.state = 'dialog';
      this.showDialogLine();
    }

    showDialogLine() {
      const raw = this.dialogLines[this.dialogIdx] || '';
      const sep = raw.indexOf(':');
      if (sep > 0 && sep < 18 && !raw.startsWith('[')) {
        this.el.dialogSpeaker.textContent = raw.slice(0, sep).trim();
        this.el.dialogText.textContent = raw.slice(sep + 1).trim();
      } else {
        this.el.dialogSpeaker.textContent = '안내';
        this.el.dialogText.textContent = raw;
      }
      this.el.dialogBox.classList.remove('hidden');
    }

    advanceDialog() {
      this.audio.playSfx('ui');
      this.dialogIdx++;
      if (this.dialogIdx >= this.dialogLines.length) {
        this.el.dialogBox.classList.add('hidden');
        this.state = 'playing';
        const cb = this.dialogOnDone;
        this.dialogOnDone = null;
        if (cb) cb();
      } else {
        this.showDialogLine();
      }
    }

    // --- INTERACTION (NPC / CHEST / FOUNTAIN) ---
    handlePrimaryAction() {
      if (this.tryInteract(true)) return;
      this.performBasicAttack();
    }

    tryInteract(silentIfNone = false) {
      const map = DATA.MAPS[this.currentMapId];
      const h = this.hero;

      // 1. NPCs
      for (const npc of map.npcs || []) {
        const nx = npc.tx * TILE;
        const ny = npc.ty * TILE;
        if (dist(h.x, h.y, nx, ny) < 38) {
          this.interactNpc(npc);
          return true;
        }
      }

      // 2. Healing Fountains
      for (const f of map.fountains || []) {
        const fx = f.tx * TILE;
        const fy = f.ty * TILE;
        if (dist(h.x, h.y, fx, fy) < 42) {
          const st = this.getHeroStats();
          h.hp = st.maxHp;
          h.mp = st.maxMp;
          this.audio.playSfx('potion');
          this.spawnParticles(h.x, h.y, '#60a5fa', 18);
          this.addFloatText(h.x, h.y - 20, 'HP/MP 완전 회복 & 자동저장!', '#93c5fd');
          this.saveGame(true);
          return true;
        }
      }

      // 3. Treasure Chests
      for (const ch of map.chests || []) {
        if (h.openedChests[ch.id]) continue;
        const cx = (ch.tx + 0.5) * TILE;
        const cy = (ch.ty + 0.5) * TILE;
        if (dist(h.x, h.y, cx, cy) < 34) {
          h.openedChests[ch.id] = true;
          this.audio.playSfx('quest');
          this.spawnParticles(cx, cy, '#fde047', 22);
          const got = [];
          if (ch.gold) {
            h.gold += ch.gold;
            got.push(`${ch.gold}G`);
          }
          (ch.items || []).forEach((it) => {
            this.giveItem(it.id, it.qty);
            got.push(`${DATA.ITEMS[it.id].name} x${it.qty}`);
          });
          this.addFloatText(cx, cy - 16, '보물상자 발견!', '#fde047');
          this.openDialog([`[보물상자] ${got.join(', ')} 을(를) 획득했습니다!`]);
          this.refreshQuickBar();
          this.saveGame(true);
          return true;
        }
      }

      if (!silentIfNone) {
        this.addFloatText(h.x, h.y - 16, '주변에 상호작용할 대상이 없습니다', '#a6998a');
      }
      return false;
    }

    interactNpc(npc) {
      this.audio.playSfx('ui');
      if (npc.role === 'shop') {
        this.openShopModal();
      } else if (npc.role === 'smith') {
        this.openSmithModal('enhance');
      } else if (npc.role === 'quest') {
        this.handleElderQuestDialog();
      }
    }

    handleElderQuestDialog() {
      const h = this.hero;
      this.checkCollectQuest();

      if (h.questState === 'all_done') {
        this.openDialog([
          `촌장 엘더: "${h.name}, 솔티아의 영웅이여! 마을은 자네 덕분에 평화를 되찾았다네."`,
          `촌장 엘더: "언제든 봉인의 제단에 다시 도전해 전설의 장비를 시험해 볼 수도 있다네!"`
        ]);
        return;
      }

      const q = DATA.QUESTS[h.questIdx];
      if (!q) return;

      if (h.questState === 'available') {
        this.openDialog(q.dialogStart, () => {
          h.questState = 'active';
          h.questProgress = 0;
          this.checkCollectQuest();
          this.audio.playSfx('quest');
          this.addFloatText(h.x, h.y - 22, `퀘스트 수락: ${q.title}`, '#fde047');
          this.saveGame(true);
        });
      } else if (h.questState === 'active') {
        this.openDialog(q.dialogProgress);
      } else if (h.questState === 'ready') {
        this.openDialog(q.dialogComplete, () => {
          this.completeCurrentQuest();
        });
      }
    }

    checkCollectQuest() {
      const h = this.hero;
      if (h.questState !== 'active') return;
      const q = DATA.QUESTS[h.questIdx];
      if (!q || q.type !== 'collect') return;
      const have = h.bagItems[q.targetItem] || 0;
      h.questProgress = Math.min(q.goal, have);
      if (h.questProgress >= q.goal) {
        h.questState = 'ready';
      }
    }

    completeCurrentQuest() {
      const h = this.hero;
      const q = DATA.QUESTS[h.questIdx];
      if (!q) return;

      if (q.type === 'collect') {
        h.bagItems[q.targetItem] = Math.max(0, (h.bagItems[q.targetItem] || 0) - q.goal);
      }

      const r = q.reward;
      const rewardsTxt = [];
      if (r.gold) { h.gold += r.gold; rewardsTxt.push(`${r.gold}G`); }
      if (r.exp) { this.gainExp(r.exp); rewardsTxt.push(`EXP +${r.exp}`); }
      (r.items || []).forEach((it) => {
        this.giveItem(it.id, it.qty);
        rewardsTxt.push(`${DATA.ITEMS[it.id].name} x${it.qty}`);
      });
      if (r.legendWeapon) {
        const legId = DATA.CLASSES[h.classId].legendWeapon;
        this.giveItem(legId, 1);
        rewardsTxt.push(`★${DATA.ITEMS[legId].name}`);
        h.title = '솔티아의 영웅';
      }

      this.audio.playSfx('levelup');
      this.spawnParticles(h.x, h.y, '#fde047', 30);
      this.addFloatText(h.x, h.y - 24, `퀘스트 완료!`, '#fde047');

      h.questIdx++;
      if (h.questIdx >= DATA.QUESTS.length) {
        h.questState = 'all_done';
        this.openDialog([`[퀘스트 보상] ${rewardsTxt.join(', ')} 을(를) 획득했습니다!`], () => {
          this.state = 'victory';
          this.el.victoryScreen.classList.remove('hidden');
        });
      } else {
        h.questState = 'available';
        h.questProgress = 0;
        this.openDialog([`[퀘스트 보상] ${rewardsTxt.join(', ')} 을(를) 획득했습니다!`]);
      }
      this.refreshQuickBar();
      this.saveGame(true);
    }

    // --- INVENTORY & EXP ---
    giveItem(itemId, qty = 1) {
      const def = DATA.ITEMS[itemId];
      if (!def) return;
      if (['weapon', 'armor', 'helm', 'accessory'].includes(def.type)) {
        for (let i = 0; i < qty; i++) {
          this.hero.bagEquip.push({
            uid: 'eq_' + Math.random().toString(36).slice(2, 9),
            itemId,
            enh: 0
          });
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
        h.expNext = Math.round(60 * Math.pow(1.42, h.lv - 1));
        h.statPoints += 3;
        h.skillPoints += 1;
        // Auto-unlock skills at threshold levels
        const clsSkills = DATA.CLASSES[h.classId].skills;
        clsSkills.forEach((sk, idx) => {
          if (h.lv >= sk.unlockLv && h.skillLevels[idx] === 0) {
            h.skillLevels[idx] = 1;
          }
        });
        const st = this.getHeroStats();
        h.hp = st.maxHp;
        h.mp = st.maxMp;
        this.audio.playSfx('levelup');
        this.spawnParticles(h.x, h.y, '#fde047', 34);
        this.effects.push({ type: 'levelup', x: h.x, y: h.y, timer: 0.9, maxTimer: 0.9 });
        this.addFloatText(h.x, h.y - 28, `LEVEL UP! Lv.${h.lv}`, '#fde047', true);
      }
      this.buildSkillSlotUi();
      this.refreshQuickBar();
    }

    // --- COMBAT: BASIC ATTACK, DASH, SKILLS ---
    getWeaponGlowColor() {
      const enh = this.hero.equip.weapon ? (this.hero.equip.weapon.enh || 0) : 0;
      if (enh >= 7) return '#fb7185';
      if (enh >= 5) return '#fbbf24';
      if (enh >= 3) return '#60a5fa';
      return '#f8fafc';
    }

    performBasicAttack() {
      const h = this.hero;
      if (h.attackCooldown > 0) return;
      const st = this.getHeroStats();

      h.comboStep = h.comboResetTimer > 0 ? (h.comboStep + 1) % 3 : 0;
      h.comboResetTimer = 0.72;
      const isFinisher = h.comboStep === 2;
      const speedFactor = clamp(1 - (st.agi * 0.008), 0.72, 1);
      h.attackCooldown = (isFinisher ? 0.34 : 0.24) * speedFactor;
      h.attackTimer = 0.16;

      this.audio.playSfx(isFinisher ? 'swingHeavy' : 'swing');

      const ang = Math.atan2(h.facingY, h.facingX);
      const reach = isFinisher ? 44 : 36;
      const mult = isFinisher ? 1.4 : (h.comboStep === 1 ? 1.1 : 1.0);
      const color = this.getWeaponGlowColor();

      this.effects.push({
        type: 'slash',
        x: h.x,
        y: h.y,
        angle: ang,
        radius: reach,
        flip: h.comboStep === 1 ? -1 : 1,
        heavy: isFinisher,
        color,
        timer: 0.16,
        maxTimer: 0.16
      });

      // Slight lunge forward
      this.moveEntity(h, h.facingX * (isFinisher ? 8 : 4), h.facingY * (isFinisher ? 8 : 4), 1);

      this.damageMonstersInArc(h.x, h.y, ang, reach + 6, isFinisher ? 1.7 : 1.3, st.atk * mult, isFinisher ? 130 : 75, false);
    }

    triggerDash() {
      const h = this.hero;
      if (h.dashCd > 0) return;
      h.dashTimer = 0.16;
      h.dashCd = 1.05;
      h.invulnTimer = Math.max(h.invulnTimer, 0.28);
      this.audio.playSfx('dash');
      this.spawnParticles(h.x, h.y, '#cbd5e1', 8);
    }

    useSkill(slotIdx) {
      const h = this.hero;
      const cls = DATA.CLASSES[h.classId];
      const sk = cls.skills[slotIdx];
      if (!sk) return;

      const skLv = h.skillLevels[slotIdx] || 0;
      if (skLv <= 0) {
        this.addFloatText(h.x, h.y - 18, `Lv.${sk.unlockLv} 해금`, '#94a3b8');
        return;
      }
      if (h.skillCds[slotIdx] > 0) return;
      if (h.mp < sk.mp) {
        this.addFloatText(h.x, h.y - 18, 'MP 부족!', '#60a5fa');
        return;
      }

      const st = this.getHeroStats();
      h.mp -= sk.mp;
      h.skillCds[slotIdx] = Math.max(1.5, sk.cd * (1 - (skLv - 1) * 0.06));
      const lvBoost = 1 + (skLv - 1) * 0.22;
      const basePower = (h.classId === 'runeblade' ? st.magicAtk : st.atk) * sk.mult * lvBoost;
      const ang = Math.atan2(h.facingY, h.facingX);

      this.audio.playSfx(h.classId === 'runeblade' ? 'magic' : 'skill');
      this.addFloatText(h.x, h.y - 24, sk.name + '!', sk.color);

      if (sk.type === 'cone') {
        this.shake(0.14, 4);
        this.effects.push({ type: 'slash', x: h.x, y: h.y, angle: ang, radius: sk.range + 8, flip: 1, heavy: true, color: sk.color, timer: 0.24, maxTimer: 0.24 });
        this.damageMonstersInArc(h.x, h.y, ang, sk.range + 10, 1.9, basePower, 160, false, 0.9);
      } else if (sk.type === 'aoe' || sk.type === 'frost') {
        this.shake(0.15, 4);
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: sk.radius, color: sk.color, timer: 0.34, maxTimer: 0.34 });
        this.damageMonstersInRadius(h.x, h.y, sk.radius, basePower, 140, sk.type === 'frost' ? 2.5 : 0);
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
      } else if (sk.type === 'lunge') {
        this.moveEntity(h, h.facingX * 44, h.facingY * 44, 1);
        h.invulnTimer = Math.max(h.invulnTimer, 0.25);
        this.effects.push({ type: 'slash', x: h.x, y: h.y, angle: ang, radius: 52, flip: 1, heavy: true, color: sk.color, timer: 0.2, maxTimer: 0.2 });
        this.damageMonstersInArc(h.x, h.y, ang, 58, 1.6, basePower, 110, true);
      } else if (sk.type === 'projectile' || sk.type === 'fireball') {
        this.projectiles.push({
          from: 'hero',
          x: h.x + h.facingX * 12,
          y: h.y + h.facingY * 12,
          vx: h.facingX * 260,
          vy: h.facingY * 260,
          radius: sk.type === 'fireball' ? 11 : 10,
          damage: basePower,
          color: sk.color,
          pierce: sk.type === 'projectile',
          explode: sk.type === 'fireball',
          life: 0.8,
          hitIds: new Set()
        });
      } else if (sk.type === 'pillars' || sk.type === 'meteor' || sk.type === 'flurry') {
        this.shake(0.25, 6);
        const count = sk.type === 'meteor' ? 5 : 6;
        for (let i = 0; i < count; i++) {
          const a = (Math.PI * 2 * i) / count;
          const r = sk.radius * 0.62;
          const px = h.x + Math.cos(a) * r;
          const py = h.y + Math.sin(a) * r;
          this.effects.push({ type: 'pillar', x: px, y: py, color: sk.color, timer: 0.48, maxTimer: 0.48 });
          this.spawnParticles(px, py, sk.color, 10);
        }
        this.effects.push({ type: 'ring', x: h.x, y: h.y, maxRadius: sk.radius, color: sk.color, timer: 0.42, maxTimer: 0.42 });
        this.damageMonstersInRadius(h.x, h.y, sk.radius, basePower, 175, 0.5);
      }

      this.refreshQuickBar();
    }

    damageMonstersInArc(ox, oy, dirAng, radius, arcWidth, rawDmg, knock, forceCrit = false, stunSec = 0) {
      this.monsters.forEach((m) => {
        const d = dist(ox, oy, m.x, m.y);
        if (d > radius + m.size * 0.45) return;
        const angToM = Math.atan2(m.y - oy, m.x - ox);
        let diff = angToM - dirAng;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) <= arcWidth) {
          this.hitMonster(m, rawDmg, knock, ox, oy, forceCrit, stunSec, 0);
        }
      });
    }

    damageMonstersInRadius(ox, oy, radius, rawDmg, knock, slowSec = 0) {
      this.monsters.forEach((m) => {
        if (dist(ox, oy, m.x, m.y) <= radius + m.size * 0.45) {
          this.hitMonster(m, rawDmg, knock, ox, oy, false, slowSec > 0 ? 0.4 : 0, slowSec);
        }
      });
    }

    hitMonster(m, rawDmg, knock, ox, oy, forceCrit = false, stunSec = 0, slowSec = 0) {
      const st = this.getHeroStats();
      const isCrit = forceCrit || Math.random() * 100 < st.crit;
      const variance = 0.9 + Math.random() * 0.2;
      let dmg = Math.max(2, Math.round((rawDmg * variance - m.def * 0.55) * (isCrit ? 1.65 : 1)));

      m.hp -= dmg;
      m.hitFlash = 0.14;
      if (stunSec > 0 && !DATA.MONSTERS[m.typeId].isFinalBoss) {
        m.stunTimer = Math.max(m.stunTimer, stunSec);
      }
      if (slowSec > 0) {
        m.slowTimer = Math.max(m.slowTimer, slowSec);
      }

      const ang = Math.atan2(m.y - oy, m.x - ox);
      const knockMult = DATA.MONSTERS[m.typeId].isBoss ? 0.25 : 1;
      m.vx += Math.cos(ang) * knock * knockMult;
      m.vy += Math.sin(ang) * knock * knockMult;

      this.audio.playSfx(isCrit ? 'crit' : 'hit');
      if (isCrit) this.shake(0.1, 3.5);
      this.spawnParticles(m.x, m.y, isCrit ? '#fde047' : '#f8fafc', isCrit ? 10 : 5);
      this.addFloatText(m.x, m.y - 12, isCrit ? `${dmg}!` : `${dmg}`, isCrit ? '#fde047' : '#ffffff', isCrit);

      if (m.hp <= 0) {
        this.killMonster(m);
      }
    }

    killMonster(m) {
      const def = DATA.MONSTERS[m.typeId];
      this.audio.playSfx('kill');
      this.spawnParticles(m.x, m.y, def.isBoss ? '#f43f5e' : '#fbbf24', def.isBoss ? 38 : 16);

      // EXP
      this.gainExp(def.exp);
      this.addFloatText(m.x, m.y - 24, `+${def.exp} EXP`, '#fbbf24');

      // Drops: Gold + Items
      const goldAmt = randInt(def.gold[0], def.gold[1]);
      this.drops.push({ kind: 'gold', amount: goldAmt, x: m.x + randInt(-8, 8), y: m.y + randInt(-8, 8), life: 25 });

      (def.drops || []).forEach((dr) => {
        if (Math.random() <= dr.rate) {
          this.drops.push({ kind: 'item', itemId: dr.id, x: m.x + randInt(-12, 12), y: m.y + randInt(-12, 12), life: 30 });
        }
      });

      // Quest progress
      const h = this.hero;
      if (h.questState === 'active') {
        const q = DATA.QUESTS[h.questIdx];
        if (q && q.type === 'kill_any' && q.targets.includes(m.typeId)) {
          h.questProgress = Math.min(q.goal, h.questProgress + 1);
          if (h.questProgress >= q.goal) {
            h.questState = 'ready';
            this.audio.playSfx('quest');
            this.addFloatText(h.x, h.y - 32, '퀘스트 목표 달성! 촌장에게 보고!', '#4ade80', true);
          }
        }
      }

      if (def.isFinalBoss) {
        h.vargasDefeated = true;
        this.shake(0.4, 8);
        this.openDialog([
          '심연의 기사 바르가스: "크으윽... 솔티아의 바람이 이토록 강할 줄이야...!"',
          '[알림] 심연의 기사 바르가스를 격파했습니다! 마을의 촌장 엘더에게 돌아가 보고하세요!'
        ]);
        this.saveGame(true);
      } else {
        // Queue respawn
        this.respawnQueue.push({
          typeId: m.typeId,
          spawnIdx: m.spawnIdx,
          x: m.homeX,
          y: m.homeY,
          timer: def.isBoss ? 22 : 11
        });
      }
    }

    damageHero(rawDmg, srcX, srcY) {
      const h = this.hero;
      if (h.invulnTimer > 0 || this.state !== 'playing') return;
      const st = this.getHeroStats();
      let dmg = Math.max(1, Math.round(rawDmg * (0.9 + Math.random() * 0.2) - st.def * 0.65));
      h.hp -= dmg;
      h.invulnTimer = 0.55;
      this.audio.playSfx('hurt');
      this.shake(0.14, 4.5);
      this.spawnParticles(h.x, h.y, '#ef4444', 10);
      this.addFloatText(h.x, h.y - 16, `-${dmg}`, '#f87171', true);

      const ang = Math.atan2(h.y - srcY, h.x - srcX);
      this.moveEntity(h, Math.cos(ang) * 14, Math.sin(ang) * 14, 1);

      if (h.hp <= 0) {
        h.hp = 0;
        this.state = 'gameover';
        this.el.gameoverScreen.classList.remove('hidden');
      }
    }

    // --- CONSUMABLES ---
    useQuickPotion(kind) {
      if (!this.hero || this.state !== 'playing') return;
      const h = this.hero;
      const st = this.getHeroStats();
      const order = kind === 'hp' ? ['pot_hp_l', 'pot_hp_m', 'pot_hp_s'] : ['pot_mp_l', 'pot_mp_s'];
      const chosen = order.find((id) => (h.bagItems[id] || 0) > 0);
      if (!chosen) {
        this.addFloatText(h.x, h.y - 16, kind === 'hp' ? 'HP 포션 없음!' : 'MP 포션 없음!', '#94a3b8');
        return;
      }
      const item = DATA.ITEMS[chosen];
      if (kind === 'hp' && h.hp >= st.maxHp) return;
      if (kind === 'mp' && h.mp >= st.maxMp) return;

      h.bagItems[chosen]--;
      if (kind === 'hp') {
        h.hp = Math.min(st.maxHp, h.hp + item.power);
        this.addFloatText(h.x, h.y - 16, `+${item.power} HP`, '#4ade80');
      } else {
        h.mp = Math.min(st.maxMp, h.mp + item.power);
        this.addFloatText(h.x, h.y - 16, `+${item.power} MP`, '#60a5fa');
      }
      this.audio.playSfx('potion');
      this.spawnParticles(h.x, h.y, kind === 'hp' ? '#4ade80' : '#60a5fa', 12);
      this.refreshQuickBar();
    }

    useReturnScroll() {
      if (!this.hero || this.state !== 'playing') return;
      if (this.currentMapId === 'town') {
        this.addFloatText(this.hero.x, this.hero.y - 16, '이미 솔티아 마을입니다', '#cbd5e1');
        return;
      }
      if ((this.hero.bagItems.scroll_town || 0) <= 0) {
        this.addFloatText(this.hero.x, this.hero.y - 16, '귀환 주문서 없음!', '#94a3b8');
        return;
      }
      this.hero.bagItems.scroll_town--;
      this.audio.playSfx('portal');
      this.loadMap('town', 11.5, 11.5);
      this.refreshQuickBar();
      this.saveGame(true);
    }

    // --- COLLISION & MOVEMENT ---
    isTileSolid(tx, ty) {
      const map = DATA.MAPS[this.currentMapId];
      if (ty < 0 || ty >= map.layout.length || tx < 0 || tx >= map.layout[0].length) return true;
      const ch = map.layout[ty][tx];
      return DATA.SOLID_TILES.has(ch);
    }

    canStand(x, y, half = 7) {
      const pts = [
        [x - half, y - half],
        [x + half, y - half],
        [x - half, y + half],
        [x + half, y + half]
      ];
      for (const [px, py] of pts) {
        if (this.isTileSolid(Math.floor(px / TILE), Math.floor(py / TILE))) return false;
      }
      return true;
    }

    moveEntity(ent, dx, dy, dt) {
      const nx = ent.x + dx * dt;
      if (this.canStand(nx, ent.y, 7)) {
        ent.x = nx;
      }
      const ny = ent.y + dy * dt;
      if (this.canStand(ent.x, ny, 7)) {
        ent.y = ny;
      }
    }

    // --- MAIN UPDATE LOOP ---
    update(dt) {
      this.time += dt;
      if (this.shakeTimer > 0) this.shakeTimer = Math.max(0, this.shakeTimer - dt);
      if (this.bannerTimer > 0) this.bannerTimer = Math.max(0, this.bannerTimer - dt);

      if (this.state !== 'playing' || !this.hero) return;

      const h = this.hero;
      const st = this.getHeroStats();

      // Passive regen (faster in safe town)
      const map = DATA.MAPS[this.currentMapId];
      h.mp = Math.min(st.maxMp, h.mp + (map.safe ? 8 : 1.6) * dt);
      if (map.safe) h.hp = Math.min(st.maxHp, h.hp + 10 * dt);

      // Timers
      if (h.attackTimer > 0) h.attackTimer = Math.max(0, h.attackTimer - dt);
      if (h.attackCooldown > 0) h.attackCooldown = Math.max(0, h.attackCooldown - dt);
      if (h.comboResetTimer > 0) h.comboResetTimer = Math.max(0, h.comboResetTimer - dt);
      if (h.invulnTimer > 0) h.invulnTimer = Math.max(0, h.invulnTimer - dt);
      if (h.dashTimer > 0) h.dashTimer = Math.max(0, h.dashTimer - dt);
      if (h.dashCd > 0) h.dashCd = Math.max(0, h.dashCd - dt);
      if (h.buffDefTimer > 0) h.buffDefTimer = Math.max(0, h.buffDefTimer - dt);
      if (h.buffSpdTimer > 0) h.buffSpdTimer = Math.max(0, h.buffSpdTimer - dt);
      for (let i = 0; i < 4; i++) {
        if (h.skillCds[i] > 0) h.skillCds[i] = Math.max(0, h.skillCds[i] - dt);
      }

      // Movement (Keyboard + D-pad + Multi-Touch Analog Joystick)
      let ix = 0, iy = 0;
      if (this.keys.ArrowLeft || this.keys.KeyA || this.virtualDir.left) ix -= 1;
      if (this.keys.ArrowRight || this.keys.KeyD || this.virtualDir.right) ix += 1;
      if (this.keys.ArrowUp || this.keys.KeyW || this.virtualDir.up) iy -= 1;
      if (this.keys.ArrowDown || this.keys.KeyS || this.virtualDir.down) iy += 1;
      if (ix === 0 && iy === 0 && (Math.abs(this.stickX) > 0.1 || Math.abs(this.stickY) > 0.1)) {
        ix = this.stickX;
        iy = this.stickY;
      }

      if (h.dashTimer > 0) {
        this.moveEntity(h, h.facingX * st.speed * 2.55, h.facingY * st.speed * 2.55, dt);
        if (Math.random() < 0.6) {
          this.particles.push({ x: h.x, y: h.y, vx: 0, vy: 0, color: '#93c5fd', size: 4, life: 0.16, maxLife: 0.16 });
        }
      } else if (ix !== 0 || iy !== 0) {
        const len = Math.hypot(ix, iy);
        const mag = Math.min(1, len);
        const nx = ix / len;
        const ny = iy / len;
        h.facingX = nx;
        h.facingY = ny;
        if (Math.abs(nx) >= Math.abs(ny)) h.dir = nx < 0 ? 'left' : 'right';
        else h.dir = ny < 0 ? 'up' : 'down';
        h.walkAnim += dt * (6 + mag * 4);
        this.moveEntity(h, nx * st.speed * mag, ny * st.speed * mag, dt);
      }

      // Hold-to-combo on mobile attack button
      if (this.holdingAttack && h.attackCooldown <= 0) {
        this.performBasicAttack();
      }
      this.updateMobileInteractHint();

      // Check portals
      for (const p of map.portals || []) {
        const px = p.tx * TILE;
        const py = p.ty * TILE;
        if (dist(h.x, h.y, px, py) < 16) {
          this.audio.playSfx('portal');
          this.loadMap(p.toMap, p.toX, p.toY);
          this.saveGame(true);
          return;
        }
      }

      // Respawns
      for (let i = this.respawnQueue.length - 1; i >= 0; i--) {
        this.respawnQueue[i].timer -= dt;
        if (this.respawnQueue[i].timer <= 0) {
          const r = this.respawnQueue.splice(i, 1)[0];
          this.spawnMonster(r.typeId, r.x, r.y, r.spawnIdx);
        }
      }

      // Monsters AI
      this.updateMonsters(dt);

      // Telegraphs (Boss AoE warnings)
      for (let i = this.telegraphs.length - 1; i >= 0; i--) {
        const t = this.telegraphs[i];
        t.timer -= dt;
        if (t.timer <= 0) {
          this.telegraphs.splice(i, 1);
          this.shake(0.18, 5);
          this.audio.playSfx('bossRoar');
          this.effects.push({ type: 'ring', x: t.x, y: t.y, maxRadius: t.radius, color: '#f43f5e', timer: 0.35, maxTimer: 0.35 });
          this.spawnParticles(t.x, t.y, '#f43f5e', 20);
          if (dist(h.x, h.y, t.x, t.y) <= t.radius + 6) {
            this.damageHero(t.damage, t.x, t.y);
          }
        }
      }

      // Projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const pr = this.projectiles[i];
        pr.life -= dt;
        pr.x += pr.vx * dt;
        pr.y += pr.vy * dt;

        let remove = pr.life <= 0 || this.isTileSolid(Math.floor(pr.x / TILE), Math.floor(pr.y / TILE));

        if (!remove && pr.from === 'hero') {
          for (const m of this.monsters) {
            if (pr.hitIds.has(m.uid)) continue;
            if (dist(pr.x, pr.y, m.x, m.y) < pr.radius + m.size * 0.45) {
              pr.hitIds.add(m.uid);
              this.hitMonster(m, pr.damage, 85, pr.x, pr.y);
              if (pr.explode) {
                this.effects.push({ type: 'ring', x: pr.x, y: pr.y, maxRadius: 42, color: pr.color, timer: 0.25, maxTimer: 0.25 });
                this.damageMonstersInRadius(pr.x, pr.y, 40, pr.damage * 0.55, 90);
                remove = true;
                break;
              }
              if (!pr.pierce) {
                remove = true;
                break;
              }
            }
          }
        } else if (!remove && pr.from === 'enemy') {
          if (dist(pr.x, pr.y, h.x, h.y) < pr.radius + 9) {
            this.damageHero(pr.damage, pr.x, pr.y);
            remove = true;
          }
        }

        if (remove) this.projectiles.splice(i, 1);
      }

      // Loot Drops (magnetize near hero)
      for (let i = this.drops.length - 1; i >= 0; i--) {
        const d = this.drops[i];
        d.life -= dt;
        const dd = dist(h.x, h.y, d.x, d.y);
        if (dd < 54) {
          d.x += ((h.x - d.x) / Math.max(1, dd)) * 165 * dt;
          d.y += ((h.y - d.y) / Math.max(1, dd)) * 165 * dt;
        }
        if (dd < 14) {
          if (d.kind === 'gold') {
            h.gold += d.amount;
            this.audio.playSfx('coin');
            this.addFloatText(h.x, h.y - 16, `+${d.amount}G`, '#fde047');
          } else {
            this.giveItem(d.itemId, 1);
            this.audio.playSfx('coin');
            const it = DATA.ITEMS[d.itemId];
            this.addFloatText(h.x, h.y - 20, `${it.name} 획득`, DATA.RARITY[it.rarity].color);
          }
          this.drops.splice(i, 1);
        } else if (d.life <= 0) {
          this.drops.splice(i, 1);
        }
      }

      // Visual Effects & Particles
      for (let i = this.effects.length - 1; i >= 0; i--) {
        this.effects[i].timer -= dt;
        if (this.effects[i].timer <= 0) this.effects.splice(i, 1);
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floatTexts.length - 1; i >= 0; i--) {
        const ft = this.floatTexts[i];
        ft.life -= dt;
        ft.y -= 26 * dt;
        if (ft.life <= 0) this.floatTexts.splice(i, 1);
      }

      this.updateCamera(false);
      this.updateQuickSlotCooldowns();
    }

    updateMonsters(dt) {
      const h = this.hero;
      for (let i = this.monsters.length - 1; i >= 0; i--) {
        const m = this.monsters[i];
        if (m.hp <= 0) {
          this.monsters.splice(i, 1);
          continue;
        }
        const def = DATA.MONSTERS[m.typeId];
        m.anim += dt * 4.5;
        if (m.hitFlash > 0) m.hitFlash = Math.max(0, m.hitFlash - dt);
        if (m.stunTimer > 0) m.stunTimer = Math.max(0, m.stunTimer - dt);
        if (m.slowTimer > 0) m.slowTimer = Math.max(0, m.slowTimer - dt);
        if (m.attackCd > 0) m.attackCd = Math.max(0, m.attackCd - dt);
        if (m.specialCd > 0) m.specialCd = Math.max(0, m.specialCd - dt);

        // Apply knockback decay
        if (Math.hypot(m.vx, m.vy) > 4) {
          this.moveEntity(m, m.vx, m.vy, dt);
          m.vx *= Math.pow(0.05, dt);
          m.vy *= Math.pow(0.05, dt);
        }

        if (m.stunTimer > 0) continue;

        const dHero = dist(m.x, m.y, h.x, h.y);
        const spd = m.speed * (m.slowTimer > 0 ? 0.5 : 1) * (m.phase2 ? 1.25 : 1);

        // Boss Phase 2 transition
        if (def.isFinalBoss && !m.phase2 && m.hp < m.maxHp * 0.5) {
          m.phase2 = true;
          this.audio.playSfx('bossRoar');
          this.shake(0.3, 6);
          this.addFloatText(m.x, m.y - 26, '심연의 힘 해방!', '#f43f5e', true);
          this.spawnParticles(m.x, m.y, '#f43f5e', 28);
        }

        if (dHero < def.aggro) {
          const ang = Math.atan2(h.y - m.y, h.x - m.x);

          if (def.ai === 'ranged') {
            if (dHero > 105) {
              this.moveEntity(m, Math.cos(ang) * spd, Math.sin(ang) * spd, dt);
            } else if (dHero < 64) {
              this.moveEntity(m, -Math.cos(ang) * spd * 0.7, -Math.sin(ang) * spd * 0.7, dt);
            }
            if (m.attackCd <= 0) {
              m.attackCd = 2.0;
              this.projectiles.push({
                from: 'enemy',
                x: m.x, y: m.y,
                vx: Math.cos(ang) * 145, vy: Math.sin(ang) * 145,
                radius: 6, damage: m.atk, color: def.projColor || '#f43f5e', life: 2.0
              });
            }
          } else if (def.ai === 'miniboss' || def.ai === 'boss') {
            this.moveEntity(m, Math.cos(ang) * spd, Math.sin(ang) * spd, dt);
            if (m.specialCd <= 0) {
              m.specialCd = m.phase2 ? 3.2 : 4.4;
              if (def.isFinalBoss && Math.random() < 0.5) {
                // 8-way dark orb nova
                const count = m.phase2 ? 10 : 6;
                for (let k = 0; k < count; k++) {
                  const a = (Math.PI * 2 * k) / count + this.time;
                  this.projectiles.push({
                    from: 'enemy', x: m.x, y: m.y,
                    vx: Math.cos(a) * 130, vy: Math.sin(a) * 130,
                    radius: 6, damage: m.atk * 0.9, color: '#f43f5e', life: 2.2
                  });
                }
                this.audio.playSfx('magic');
              } else {
                // Telegraphed AoE Slam at Hero's position
                this.telegraphs.push({
                  x: h.x, y: h.y,
                  radius: def.isFinalBoss ? 52 : 42,
                  damage: m.atk * 1.35,
                  timer: 0.95,
                  maxTimer: 0.95
                });
              }
            }
          } else {
            // melee / charger
            const chargeMult = (def.ai === 'charger' && dHero < 90) ? 1.35 : 1;
            this.moveEntity(m, Math.cos(ang) * spd * chargeMult, Math.sin(ang) * spd * chargeMult, dt);
          }

          // Contact damage
          if (dHero < m.size * 0.52 + 8 && m.attackCd <= 0) {
            m.attackCd = def.isBoss ? 0.85 : 1.05;
            this.damageHero(m.atk, m.x, m.y);
          }
        } else {
          // Gentle wander around home
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
      const mapW = map.layout[0].length * TILE;
      const mapH = map.layout.length * TILE;
      const targetX = clamp(this.hero.x - VIEW_W / 2, 0, Math.max(0, mapW - VIEW_W));
      const targetY = clamp(this.hero.y - VIEW_H / 2, 0, Math.max(0, mapH - VIEW_H));
      if (snap) {
        this.camX = targetX;
        this.camY = targetY;
      } else {
        this.camX += (targetX - this.camX) * 0.14;
        this.camY += (targetY - this.camY) * 0.14;
      }
    }

    shake(duration, mag) {
      this.shakeTimer = Math.max(this.shakeTimer, duration);
      this.shakeMag = Math.max(this.shakeMag, mag);
    }

    spawnParticles(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 24 + Math.random() * 88;
        this.particles.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          color,
          size: 2 + Math.random() * 2.5,
          life: 0.25 + Math.random() * 0.32,
          maxLife: 0.55
        });
      }
    }

    addFloatText(x, y, text, color = '#fff', big = false) {
      this.floatTexts.push({ x, y, text, color, big, life: 1.0, maxLife: 1.0 });
    }

    // --- RENDERING ---
    render() {
      const ctx = this.ctx;
      ctx.fillStyle = '#0d0c0b';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      if (!this.hero) {
        this.renderTitleBackdrop(ctx);
        return;
      }

      const map = DATA.MAPS[this.currentMapId];
      const sx = this.shakeTimer > 0 ? (Math.random() * 2 - 1) * this.shakeMag : 0;
      const sy = this.shakeTimer > 0 ? (Math.random() * 2 - 1) * this.shakeMag : 0;

      ctx.save();
      ctx.translate(-Math.round(this.camX + sx), -Math.round(this.camY + sy));

      // 1. Tiles
      const waterFrame = Math.floor(this.time * 2.5) % 2;
      for (let ty = 0; ty < map.layout.length; ty++) {
        const row = map.layout[ty];
        for (let tx = 0; tx < row.length; tx++) {
          const ch = row[tx];
          const px = tx * TILE;
          const py = ty * TILE;
          // Base ground under obstacles
          let base = this.sprites.tiles.grass;
          if (ch === ';' || ch === 'D') base = this.sprites.tiles.darkGrass;
          else if (ch === '_' || ch === '*' || ch === '#') base = this.sprites.tiles.ruinFloor;
          else if (ch === 'a' || ch === 'X') base = this.sprites.tiles.altarFloor;
          else if (ch === 'c' || ch === 'F') base = this.sprites.tiles.cobble;
          ctx.drawImage(base, px, py, TILE, TILE);

          const tileMap = {
            ',': this.sprites.tiles.flower,
            'p': this.sprites.tiles.path,
            'c': this.sprites.tiles.cobble,
            '~': waterFrame ? this.sprites.tiles.water1 : this.sprites.tiles.water0,
            '=': this.sprites.tiles.bridge,
            'T': this.sprites.tiles.tree,
            'D': this.sprites.tiles.darkTree,
            'R': this.sprites.tiles.houseRoof,
            'W': this.sprites.tiles.houseWall,
            'd': this.sprites.tiles.houseDoor,
            'F': waterFrame ? this.sprites.tiles.fountain1 : this.sprites.tiles.fountain0,
            '#': this.sprites.tiles.wall,
            '*': this.sprites.tiles.ruinRune,
            'X': this.sprites.tiles.altarWall
          };
          if (tileMap[ch]) {
            ctx.drawImage(tileMap[ch], px, py, TILE, TILE);
          }
        }
      }

      // 2. Portals
      for (const p of map.portals || []) {
        const px = p.tx * TILE;
        const py = p.ty * TILE;
        const pulse = 0.65 + Math.sin(this.time * 5) * 0.25;
        ctx.save();
        ctx.fillStyle = `rgba(96, 165, 250, ${pulse * 0.45})`;
        ctx.beginPath();
        ctx.arc(px, py, 12 + Math.sin(this.time * 4) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(15,12,10,0.75)';
        const w = ctx.measureText(p.label).width + 8;
        ctx.fillRect(px - w / 2, py - 24, w, 13);
        ctx.fillStyle = '#fde047';
        ctx.fillText(p.label, px, py - 14);
        ctx.restore();
      }

      // 3. Chests
      for (const ch of map.chests || []) {
        const opened = !!this.hero.openedChests[ch.id];
        ctx.drawImage(
          opened ? this.sprites.tiles.chestOpen : this.sprites.tiles.chestClosed,
          ch.tx * TILE, ch.ty * TILE, TILE, TILE
        );
      }

      // 4. Telegraphs
      for (const t of this.telegraphs) {
        const prog = 1 - t.timer / t.maxTimer;
        ctx.save();
        ctx.fillStyle = `rgba(244, 63, 94, ${0.18 + prog * 0.28})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fb7185';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * prog, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Loot Drops
      for (const d of this.drops) {
        const bob = Math.sin(this.time * 6 + d.x) * 2;
        if (d.kind === 'gold') {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(d.x, d.y + bob, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(d.x - 1, d.y + bob - 2, 2, 2);
        } else {
          const it = DATA.ITEMS[d.itemId];
          const col = DATA.RARITY[it.rarity].color;
          ctx.fillStyle = col;
          ctx.fillRect(d.x - 4, d.y + bob - 4, 8, 8);
          ctx.strokeStyle = '#181411';
          ctx.lineWidth = 1;
          ctx.strokeRect(d.x - 4, d.y + bob - 4, 8, 8);
        }
      }

      // 6. Y-Sorted Entities (NPCs, Monsters, Hero)
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

      // 7. Projectiles
      for (const pr of this.projectiles) {
        ctx.save();
        ctx.fillStyle = pr.color;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 8. Combat Effects
      this.drawEffects(ctx);

      // 9. Particles
      for (const p of this.particles) {
        ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      // 10. Floating Texts
      for (const ft of this.floatTexts) {
        ctx.save();
        ctx.globalAlpha = clamp(ft.life / ft.maxLife, 0, 1);
        ctx.font = ft.big ? 'bold 12px sans-serif' : 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      // Fountain interact hint in town
      for (const f of map.fountains || []) {
        if (dist(this.hero.x, this.hero.y, f.tx * TILE, f.ty * TILE) < 46) {
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = 'rgba(15,12,10,0.8)';
          ctx.fillRect(f.tx * TILE - 38, f.ty * TILE - 28, 76, 13);
          ctx.fillStyle = '#93c5fd';
          ctx.fillText('[F/Space] 치유의 샘', f.tx * TILE, f.ty * TILE - 18);
        }
      }

      ctx.restore();

      // 11. Screen-space RPG HUD
      this.drawHud(ctx);
    }

    renderTitleBackdrop(ctx) {
      const map = DATA.MAPS.town;
      const waterFrame = Math.floor(this.time * 2.5) % 2;
      const ox = Math.round(Math.sin(this.time * 0.35) * 32 + 48);
      const oy = Math.round(Math.cos(this.time * 0.25) * 20 + 36);
      ctx.save();
      ctx.translate(-ox, -oy);
      for (let ty = 0; ty < map.layout.length; ty++) {
        const row = map.layout[ty];
        for (let tx = 0; tx < row.length; tx++) {
          const ch = row[tx], px = tx * TILE, py = ty * TILE;
          ctx.drawImage(ch === 'c' || ch === 'F' ? this.sprites.tiles.cobble : this.sprites.tiles.grass, px, py, TILE, TILE);
          const tileMap = {
            ',': this.sprites.tiles.flower, 'p': this.sprites.tiles.path, 'c': this.sprites.tiles.cobble,
            '~': waterFrame ? this.sprites.tiles.water1 : this.sprites.tiles.water0,
            'T': this.sprites.tiles.tree, 'R': this.sprites.tiles.houseRoof,
            'W': this.sprites.tiles.houseWall, 'd': this.sprites.tiles.houseDoor,
            'F': waterFrame ? this.sprites.tiles.fountain1 : this.sprites.tiles.fountain0
          };
          if (tileMap[ch]) ctx.drawImage(tileMap[ch], px, py, TILE, TILE);
        }
      }
      ctx.restore();
      for (let i = 0; i < 24; i++) {
        const x = (i * 53 + this.time * 16) % VIEW_W;
        const y = (i * 29 + Math.sin(this.time + i) * 6) % VIEW_H;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(253, 224, 71, 0.55)' : 'rgba(255,255,255,0.35)';
        ctx.fillRect(x, y, 2, 2);
      }
    }

    drawNpc(ctx, npc) {
      const x = npc.tx * TILE;
      const y = npc.ty * TILE;
      const bob = Math.sin(this.time * 3 + x) * 1.2;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(x, y + 9, 8, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      const spr = this.sprites.npcs[npc.sprite];
      ctx.drawImage(spr, x - 12, y - 14 + bob, 24, 24);

      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(npc.name, x + 1, y - 15);
      ctx.fillStyle = '#fef3c7';
      ctx.fillText(npc.name, x, y - 16);

      // Quest indicator over Elder
      if (npc.role === 'quest') {
        let mark = null;
        let col = '#fde047';
        if (this.hero.questState === 'available') { mark = '!'; col = '#fde047'; }
        else if (this.hero.questState === 'ready') { mark = '?'; col = '#4ade80'; }
        if (mark) {
          const mb = Math.sin(this.time * 6) * 2.5;
          ctx.font = 'bold 14px sans-serif';
          ctx.fillStyle = '#000';
          ctx.fillText(mark, x + 1, y - 26 + mb);
          ctx.fillStyle = col;
          ctx.fillText(mark, x, y - 27 + mb);
        }
      }
    }

    drawHero(ctx) {
      const h = this.hero;
      const set = this.sprites.heroes[h.classId];
      const moving = this.keys.ArrowLeft || this.keys.ArrowRight || this.keys.ArrowUp || this.keys.ArrowDown ||
        this.keys.KeyA || this.keys.KeyD || this.keys.KeyW || this.keys.KeyS ||
        this.virtualDir.left || this.virtualDir.right || this.virtualDir.up || this.virtualDir.down ||
        Math.hypot(this.stickX, this.stickY) > 0.12;
      const walkF = moving && Math.floor(h.walkAnim) % 2 === 1;
      const spr = h.dir === 'left'
        ? (walkF ? set.walkLeft : set.idleLeft)
        : (walkF ? set.walk : set.idle);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y + 9, 8, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Buff Auras
      if (h.buffDefTimer > 0) {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 14 + Math.sin(this.time * 8), 0, Math.PI * 2);
        ctx.stroke();
      }
      if (h.buffSpdTimer > 0) {
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 16, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (h.invulnTimer > 0 && Math.floor(this.time * 24) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }
      ctx.drawImage(spr, h.x - 12, h.y - 14, 24, 24);
      ctx.globalAlpha = 1;
    }

    drawMonster(ctx, m) {
      const def = DATA.MONSTERS[m.typeId];
      const frames = this.sprites.monsters[m.typeId];
      const spr = frames[Math.floor(m.anim) % frames.length];
      const drawSize = def.size;

      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(m.x, m.y + drawSize * 0.38, drawSize * 0.36, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      if (m.hitFlash > 0) {
        ctx.globalAlpha = 0.65;
      }
      ctx.drawImage(spr, m.x - drawSize / 2, m.y - drawSize / 2 - 2, drawSize, drawSize);
      if (m.hitFlash > 0) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x, m.y - 2, drawSize * 0.34, 0, Math.PI * 2);
        ctx.fill();
      } else if (m.slowTimer > 0) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(m.x, m.y, drawSize * 0.45, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Overhead mini HP bar for non-boss damaged monsters
      if (!def.isBoss && m.hp < m.maxHp) {
        const bw = 22;
        ctx.fillStyle = '#14110f';
        ctx.fillRect(m.x - bw / 2, m.y - drawSize / 2 - 7, bw, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(m.x - bw / 2 + 1, m.y - drawSize / 2 - 6, Math.max(0, (bw - 2) * (m.hp / m.maxHp)), 2);
      }

      if (m.stunTimer > 0) {
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', m.x, m.y - drawSize / 2 - 9);
      }
    }

    drawEffects(ctx) {
      for (const ef of this.effects) {
        const p = 1 - ef.timer / ef.maxTimer;
        ctx.save();
        if (ef.type === 'slash') {
          ctx.translate(ef.x, ef.y);
          ctx.rotate(ef.angle);
          ctx.globalAlpha = 1 - p;
          ctx.strokeStyle = ef.color;
          ctx.lineWidth = ef.heavy ? 6 : 4;
          ctx.lineCap = 'round';
          const start = -1.05 * ef.flip;
          const end = (-1.05 + 2.1 * Math.min(1, p * 1.4)) * ef.flip;
          ctx.beginPath();
          ctx.arc(0, 0, ef.radius * 0.72, Math.min(start, end), Math.max(start, end));
          ctx.stroke();
        } else if (ef.type === 'ring') {
          ctx.globalAlpha = 1 - p;
          ctx.strokeStyle = ef.color;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(ef.x, ef.y, ef.maxRadius * (0.25 + p * 0.75), 0, Math.PI * 2);
          ctx.stroke();
        } else if (ef.type === 'pillar' || ef.type === 'levelup') {
          ctx.globalAlpha = 1 - p;
          const w = ef.type === 'levelup' ? 28 : 16;
          ctx.fillStyle = ef.type === 'levelup' ? '#fde047' : ef.color;
          ctx.fillRect(ef.x - w / 2, ef.y - 120, w, 130);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ef.x - w / 4, ef.y - 120, w / 2, 130);
        }
        ctx.restore();
      }
    }

    drawHud(ctx) {
      const h = this.hero;
      const st = this.getHeroStats();
      const map = DATA.MAPS[this.currentMapId];

      // Top-left Hero Status Panel
      ctx.save();
      ctx.fillStyle = 'rgba(18, 14, 11, 0.82)';
      ctx.strokeStyle = '#8c6d3b';
      ctx.lineWidth = 1;
      ctx.fillRect(8, 8, 166, 56);
      ctx.strokeRect(8.5, 8.5, 165, 55);

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText(`Lv.${h.lv}`, 14, 21);
      ctx.fillStyle = '#f3ece1';
      ctx.fillText(h.title ? `${h.name} ★` : h.name, 46, 21);

      const drawBar = (x, y, w, bh, cur, max, col, label) => {
        ctx.fillStyle = '#120f0d';
        ctx.fillRect(x, y, w, bh);
        ctx.fillStyle = col;
        ctx.fillRect(x + 1, y + 1, Math.max(0, (w - 2) * clamp(cur / max, 0, 1)), bh - 2);
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'right';
        ctx.fillText(`${label} ${Math.ceil(cur)}/${max}`, x + w - 3, y + bh - 1.5);
        ctx.textAlign = 'left';
      };

      drawBar(14, 26, 152, 10, h.hp, st.maxHp, '#dc3545', 'HP');
      drawBar(14, 38, 152, 10, h.mp, st.maxMp, '#2b82d9', 'MP');
      drawBar(14, 51, 152, 7, h.exp, h.expNext, '#e0a82e', 'EXP');

      // Quest Tracker Snippet (below Hero Panel)
      let qText = '';
      let qColor = '#fde68a';
      if (h.questState === 'all_done') {
        qText = '★ 솔티아의 영웅 칭호 획득!';
        qColor = '#4ade80';
      } else {
        const q = DATA.QUESTS[h.questIdx];
        if (q) {
          if (h.questState === 'available') qText = `[!] 촌장 엘더와 대화하세요`;
          else if (h.questState === 'active') qText = `[진행] ${q.title} (${h.questProgress}/${q.goal})`;
          else if (h.questState === 'ready') { qText = `[완료] 촌장에게 보고하세요!`; qColor = '#4ade80'; }
        }
      }
      if (qText) {
        ctx.fillStyle = 'rgba(18, 14, 11, 0.72)';
        ctx.fillRect(8, 68, 166, 16);
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = qColor;
        ctx.fillText(qText, 13, 79);
      }

      // Top-right Map & Gold + Minimap
      ctx.fillStyle = 'rgba(18, 14, 11, 0.82)';
      ctx.fillRect(VIEW_W - 122, 8, 114, 58);
      ctx.strokeStyle = '#8c6d3b';
      ctx.strokeRect(VIEW_W - 121.5, 8.5, 113, 57);

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#f3ece1';
      ctx.textAlign = 'right';
      ctx.fillText(map.name, VIEW_W - 14, 21);
      ctx.fillStyle = '#fde047';
      ctx.fillText(`${h.gold.toLocaleString()} G`, VIEW_W - 14, 34);
      ctx.textAlign = 'left';

      // Mini-radar
      const rx = VIEW_W - 116, ry = 38, rw = 102, rh = 23;
      const mw = map.layout[0].length * TILE;
      const mh = map.layout.length * TILE;
      ctx.fillStyle = '#12100e';
      ctx.fillRect(rx, ry, rw, rh);
      (map.portals || []).forEach((p) => {
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(rx + (p.tx * TILE / mw) * rw - 1.5, ry + (p.ty * TILE / mh) * rh - 1.5, 3, 3);
      });
      (map.npcs || []).forEach((n) => {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(rx + (n.tx * TILE / mw) * rw - 1.5, ry + (n.ty * TILE / mh) * rh - 1.5, 3, 3);
      });
      this.monsters.forEach((m) => {
        ctx.fillStyle = DATA.MONSTERS[m.typeId].isBoss ? '#f43f5e' : '#ef4444';
        ctx.fillRect(rx + (m.x / mw) * rw - 1, ry + (m.y / mh) * rh - 1, 2.5, 2.5);
      });
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(rx + (h.x / mw) * rw - 2, ry + (h.y / mh) * rh - 2, 4, 4);

      // Boss HP Bar
      const boss = this.monsters.find((m) => DATA.MONSTERS[m.typeId].isBoss);
      if (boss) {
        const bdef = DATA.MONSTERS[boss.typeId];
        const bx = 110, by = VIEW_H - 34, bw = VIEW_W - 220;
        ctx.fillStyle = 'rgba(18, 12, 14, 0.88)';
        ctx.fillRect(bx - 4, by - 14, bw + 8, 28);
        ctx.strokeStyle = '#e11d48';
        ctx.strokeRect(bx - 3.5, by - 13.5, bw + 7, 27);
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#fda4af';
        ctx.textAlign = 'center';
        ctx.fillText(`☠ ${bdef.name} (Lv.${bdef.lv})`, VIEW_W / 2, by - 3);
        ctx.fillStyle = '#1f1215';
        ctx.fillRect(bx, by + 1, bw, 9);
        ctx.fillStyle = boss.phase2 ? '#f43f5e' : '#dc2626';
        ctx.fillRect(bx + 1, by + 2, Math.max(0, (bw - 2) * (boss.hp / boss.maxHp)), 7);
        ctx.textAlign = 'left';
      }

      // Map transition banner
      if (this.bannerTimer > 0) {
        const alpha = Math.min(1, this.bannerTimer, (2.6 - this.bannerTimer) * 3);
        ctx.globalAlpha = clamp(alpha, 0, 1);
        ctx.fillStyle = 'rgba(15, 12, 10, 0.78)';
        ctx.fillRect(VIEW_W / 2 - 120, 96, 240, 38);
        ctx.strokeStyle = '#c9973b';
        ctx.strokeRect(VIEW_W / 2 - 119.5, 96.5, 239, 37);
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.fillText(`— ${this.bannerText} —`, VIEW_W / 2, 114);
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#d6c8b6';
        ctx.fillText(this.bannerSub, VIEW_W / 2, 128);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    }

    // --- QUICK BAR & MOBILE SKILL UI ---
    buildSkillSlotUi() {
      if (!this.hero) return;
      const cls = DATA.CLASSES[this.hero.classId];
      this.el.skillSlots.innerHTML = '';
      if (this.el.mobileSkillSlots) this.el.mobileSkillSlots.innerHTML = '';

      cls.skills.forEach((sk, idx) => {
        const lv = this.hero.skillLevels[idx] || 0;
        const btn = document.createElement('button');
        btn.className = 'slot-btn' + (lv <= 0 ? ' locked' : '');
        btn.title = `${sk.name} (MP ${sk.mp}) - ${sk.desc}`;
        btn.innerHTML = `
          <span class="slot-key">${idx + 1}</span>
          <span class="slot-icon">${sk.icon}</span>
          <span class="slot-label">${sk.name}</span>
          <span class="slot-cd hidden" id="skillCd_${idx}"></span>
        `;
        btn.addEventListener('click', () => this.useSkill(idx));
        this.el.skillSlots.appendChild(btn);

        if (this.el.mobileSkillSlots) {
          const mbtn = document.createElement('button');
          mbtn.type = 'button';
          mbtn.className = 'm-skill-btn' + (lv <= 0 ? ' locked' : '');
          mbtn.innerHTML = `
            <span class="ms-icon">${sk.icon}</span>
            <span class="ms-name">${sk.name}</span>
            <span class="slot-cd hidden" id="mSkillCd_${idx}"></span>
          `;
          mbtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.audio.init();
            if (this.state === 'playing') this.useSkill(idx);
          });
          this.el.mobileSkillSlots.appendChild(mbtn);
        }
      });
    }

    updateQuickSlotCooldowns() {
      if (!this.hero) return;
      for (let i = 0; i < 4; i++) {
        const cd = this.hero.skillCds[i];
        for (const id of [`skillCd_${i}`, `mSkillCd_${i}`]) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (cd > 0.05) {
            el.classList.remove('hidden');
            el.textContent = cd.toFixed(1);
          } else {
            el.classList.add('hidden');
          }
        }
      }
    }

    updateMobileInteractHint() {
      if (!this.el.btnMobileAttack || !this.hero) return;
      const map = DATA.MAPS[this.currentMapId];
      const h = this.hero;
      let icon = '⚔️';
      let label = '공격';
      let isInteract = false;

      for (const npc of map.npcs || []) {
        if (dist(h.x, h.y, npc.tx * TILE, npc.ty * TILE) < 38) {
          icon = '💬'; label = '대화'; isInteract = true; break;
        }
      }
      if (!isInteract) {
        for (const f of map.fountains || []) {
          if (dist(h.x, h.y, f.tx * TILE, f.ty * TILE) < 42) {
            icon = '💧'; label = '회복'; isInteract = true; break;
          }
        }
      }
      if (!isInteract) {
        for (const ch of map.chests || []) {
          if (!h.openedChests[ch.id] && dist(h.x, h.y, (ch.tx + 0.5) * TILE, (ch.ty + 0.5) * TILE) < 34) {
            icon = '📦'; label = '열기'; isInteract = true; break;
          }
        }
      }

      this.el.btnMobileAttack.classList.toggle('interact-mode', isInteract);
      if (this.el.mobileAtkIcon.textContent !== icon) this.el.mobileAtkIcon.textContent = icon;
      if (this.el.mobileAtkLabel.textContent !== label) this.el.mobileAtkLabel.textContent = label;
    }

    refreshQuickBar() {
      if (!this.hero) return;
      const b = this.hero.bagItems;
      const hpCnt = (b.pot_hp_s || 0) + (b.pot_hp_m || 0) + (b.pot_hp_l || 0);
      const mpCnt = (b.pot_mp_s || 0) + (b.pot_mp_l || 0);
      this.el.potHpCount.textContent = `x${hpCnt}`;
      this.el.potMpCount.textContent = `x${mpCnt}`;
      this.el.scrollCount.textContent = `x${b.scroll_town || 0}`;
      this.el.dotStat.style.display = this.hero.statPoints > 0 ? 'block' : 'none';
      this.el.dotSkill.style.display = this.hero.skillPoints > 0 ? 'block' : 'none';
    }

    // --- MODALS: HERO MENU / SHOP / BLACKSMITH ---
    closeModal() {
      this.audio.playSfx('ui');
      this.el.modalBackdrop.classList.add('hidden');
      this.modalType = null;
      if (this.state === 'modal') this.state = 'playing';
      this.refreshQuickBar();
    }

    openHeroModal(tab) {
      this.clearTouchInputs();
      this.audio.playSfx('ui');
      this.state = 'modal';
      this.modalType = 'hero';
      this.modalTab = tab;
      this.el.modalBackdrop.classList.remove('hidden');
      this.renderHeroModal();
    }

    renderHeroModal() {
      const tabs = [
        { id: 'status', label: `상태/스탯${this.hero.statPoints > 0 ? ` (+${this.hero.statPoints})` : ''}` },
        { id: 'bag', label: '장비/가방' },
        { id: 'skills', label: `스킬${this.hero.skillPoints > 0 ? ` (+${this.hero.skillPoints})` : ''}` },
        { id: 'quest', label: '퀘스트' }
      ];
      this.renderModalTabs(tabs, (id) => {
        this.modalTab = id;
        this.renderHeroModal();
      });

      const body = this.el.modalBody;
      body.innerHTML = '';

      if (this.modalTab === 'status') this.renderStatusTab(body);
      else if (this.modalTab === 'bag') this.renderBagTab(body);
      else if (this.modalTab === 'skills') this.renderSkillsTab(body);
      else if (this.modalTab === 'quest') this.renderQuestTab(body);
    }

    renderModalTabs(tabs, onPick) {
      this.el.modalTabs.innerHTML = '';
      tabs.forEach((t) => {
        const b = document.createElement('button');
        b.className = 'tab-btn' + (t.id === this.modalTab ? ' active' : '');
        b.textContent = t.label;
        b.addEventListener('click', () => {
          this.audio.playSfx('ui');
          onPick(t.id);
        });
        this.el.modalTabs.appendChild(b);
      });
    }

    formatEquipName(eq) {
      const def = DATA.ITEMS[eq.itemId];
      const rar = DATA.RARITY[def.rarity];
      const plus = eq.enh > 0 ? `+${eq.enh} ` : '';
      return `<span style="color:${rar.color}">${plus}${def.name}</span>`;
    }

    formatEquipStats(eq) {
      const b = this.getEquipBonus(eq);
      const parts = [];
      if (b.atk) parts.push(`공격 +${b.atk}`);
      if (b.def) parts.push(`방어 +${b.def}`);
      if (b.hp) parts.push(`HP +${b.hp}`);
      if (b.mp) parts.push(`MP +${b.mp}`);
      if (b.str) parts.push(`힘 +${b.str}`);
      if (b.agi) parts.push(`민첩 +${b.agi}`);
      if (b.vit) parts.push(`체력 +${b.vit}`);
      if (b.int) parts.push(`지능 +${b.int}`);
      if (b.crit) parts.push(`치명 +${b.crit}%`);
      return parts.join(' · ');
    }

    renderStatusTab(body) {
      const h = this.hero;
      const st = this.getHeroStats();
      body.innerHTML = `
        <div class="stat-layout">
          <div class="panel-card">
            <h3>${h.name} · Lv.${h.lv} ${h.title ? `<span class="badge">${h.title}</span>` : ''}</h3>
            <div class="stat-row"><span>HP</span><strong>${Math.ceil(h.hp)} / ${st.maxHp}</strong></div>
            <div class="stat-row"><span>MP</span><strong>${Math.ceil(h.mp)} / ${st.maxMp}</strong></div>
            <div class="stat-row"><span>공격력 / 마력</span><strong>${st.atk} / ${st.magicAtk}</strong></div>
            <div class="stat-row"><span>방어력</span><strong>${st.def}</strong></div>
            <div class="stat-row"><span>치명타율</span><strong>${st.crit}%</strong></div>
            <div class="stat-row"><span>보유 골드</span><strong style="color:#fde047">${h.gold.toLocaleString()} G</strong></div>
          </div>
          <div class="panel-card">
            <h3>능력치 분배 (남은 포인트: <span style="color:#fde047">${h.statPoints}</span>)</h3>
            ${['str', 'agi', 'vit', 'int'].map((k) => {
              const names = { str: '힘 (STR) · 공격력', agi: '민첩 (AGI) · 치명/이속', vit: '체력 (VIT) · HP/방어', int: '지능 (INT) · MP/마력' };
              return `
                <div class="stat-row">
                  <span>${names[k]}</span>
                  <span style="display:flex;align-items:center;gap:6px;">
                    <strong>${st[k]}</strong>
                    <button class="rpg-btn small" data-add-stat="${k}" ${h.statPoints <= 0 ? 'disabled' : ''}>+1</button>
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      body.querySelectorAll('[data-add-stat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (h.statPoints <= 0) return;
          this.audio.playSfx('ui');
          h.base[btn.dataset.addStat]++;
          h.statPoints--;
          this.renderHeroModal();
          this.refreshQuickBar();
        });
      });
    }

    renderBagTab(body) {
      const h = this.hero;
      const slotNames = { weapon: '무기', armor: '갑옷', helm: '투구', accessory: '장신구' };
      const equipHtml = Object.keys(slotNames).map((slot) => {
        const eq = h.equip[slot];
        return `
          <div class="item-row">
            <div class="item-info">
              <div class="item-title"><span class="badge">${slotNames[slot]}</span> ${eq ? this.formatEquipName(eq) : '<span style="color:#786c60">비어 있음</span>'}</div>
              <div class="item-sub">${eq ? this.formatEquipStats(eq) : '장비를 착용해 능력을 높이세요.'}</div>
            </div>
          </div>
        `;
      }).join('');

      const bagEqHtml = h.bagEquip.length === 0
        ? '<div class="item-sub">보유 중인 여분 장비가 없습니다.</div>'
        : h.bagEquip.map((eq, idx) => `
          <div class="item-row">
            <div class="item-info">
              <div class="item-title">${this.formatEquipName(eq)}</div>
              <div class="item-sub">${this.formatEquipStats(eq)}</div>
            </div>
            <div class="item-actions">
              <button class="rpg-btn small" data-equip-idx="${idx}">착용</button>
            </div>
          </div>
        `).join('');

      const bagItemEntries = Object.entries(h.bagItems).filter(([, qty]) => qty > 0);
      const bagItemHtml = bagItemEntries.length === 0
        ? '<div class="item-sub">보유 중인 소비/재료 아이템이 없습니다.</div>'
        : bagItemEntries.map(([id, qty]) => {
          const it = DATA.ITEMS[id];
          const canUse = it.type === 'consumable';
          return `
            <div class="item-row">
              <div class="item-info">
                <div class="item-title"><span style="color:${DATA.RARITY[it.rarity].color}">${it.name}</span> <span class="badge">x${qty}</span></div>
                <div class="item-sub">${it.desc}</div>
              </div>
              <div class="item-actions">
                ${canUse ? `<button class="rpg-btn small" data-use-item="${id}">사용</button>` : ''}
              </div>
            </div>
          `;
        }).join('');

      body.innerHTML = `
        <div class="panel-card" style="margin-bottom:10px;">
          <h3>장착 중인 장비</h3>
          <div class="list-grid">${equipHtml}</div>
        </div>
        <div class="panel-card" style="margin-bottom:10px;">
          <h3>가방 — 장비 (${h.bagEquip.length})</h3>
          <div class="list-grid">${bagEqHtml}</div>
        </div>
        <div class="panel-card">
          <h3>가방 — 소비 및 조합 재료</h3>
          <div class="list-grid">${bagItemHtml}</div>
        </div>
      `;

      body.querySelectorAll('[data-equip-idx]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.equipIdx);
          const item = h.bagEquip.splice(idx, 1)[0];
          if (!item) return;
          const slot = DATA.ITEMS[item.itemId].type;
          if (h.equip[slot]) h.bagEquip.push(h.equip[slot]);
          h.equip[slot] = item;
          this.audio.playSfx('ui');
          this.renderHeroModal();
        });
      });

      body.querySelectorAll('[data-use-item]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.useItem;
          const it = DATA.ITEMS[id];
          if (!it || (h.bagItems[id] || 0) <= 0) return;
          const st = this.getHeroStats();
          if (it.subtype === 'hp') {
            h.bagItems[id]--;
            h.hp = Math.min(st.maxHp, h.hp + it.power);
            this.audio.playSfx('potion');
          } else if (it.subtype === 'mp') {
            h.bagItems[id]--;
            h.mp = Math.min(st.maxMp, h.mp + it.power);
            this.audio.playSfx('potion');
          } else if (it.subtype === 'town') {
            this.closeModal();
            this.useReturnScroll();
            return;
          }
          this.renderHeroModal();
          this.refreshQuickBar();
        });
      });
    }

    renderSkillsTab(body) {
      const h = this.hero;
      const cls = DATA.CLASSES[h.classId];
      body.innerHTML = `
        <div class="panel-card">
          <h3>${cls.name} 스킬 트리 (스킬 포인트: <span style="color:#fde047">${h.skillPoints}</span>)</h3>
          <div class="list-grid">
            ${cls.skills.map((sk, idx) => {
              const lv = h.skillLevels[idx] || 0;
              const unlocked = h.lv >= sk.unlockLv;
              const canUp = unlocked && h.skillPoints > 0 && lv < 5;
              return `
                <div class="item-row">
                  <div class="item-info">
                    <div class="item-title">
                      <span>${sk.icon} [${idx + 1}] ${sk.name}</span>
                      <span class="badge">${lv > 0 ? `Lv.${lv} / 5` : `Lv.${sk.unlockLv} 해금`}</span>
                      <span style="color:#60a5fa;font-size:11px;">MP ${sk.mp} · 쿨 ${sk.cd}s</span>
                    </div>
                    <div class="item-sub">${sk.desc}</div>
                  </div>
                  <div class="item-actions">
                    <button class="rpg-btn small" data-up-skill="${idx}" ${canUp ? '' : 'disabled'}>${lv >= 5 ? 'MAX' : '강화'}</button>
                  </div>
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
          h.skillLevels[idx]++;
          h.skillPoints--;
          this.audio.playSfx('enhanceOk');
          this.buildSkillSlotUi();
          this.renderHeroModal();
          this.refreshQuickBar();
        });
      });
    }

    renderQuestTab(body) {
      const h = this.hero;
      body.innerHTML = `
        <div class="panel-card">
          <h3>솔티아 연대기 퀘스트</h3>
          <div class="list-grid">
            ${DATA.QUESTS.map((q, idx) => {
              let status = '미개방';
              let col = '#786c60';
              if (idx < h.questIdx || h.questState === 'all_done') { status = '완료'; col = '#4ade80'; }
              else if (idx === h.questIdx) {
                if (h.questState === 'available') { status = '촌장에게 수락 가능'; col = '#fde047'; }
                else if (h.questState === 'active') { status = `진행 중 (${h.questProgress}/${q.goal})`; col = '#60a5fa'; }
                else if (h.questState === 'ready') { status = '보고 가능!'; col = '#4ade80'; }
              }
              return `
                <div class="item-row">
                  <div class="item-info">
                    <div class="item-title">Chapter ${idx + 1}. ${q.title} <span class="badge" style="color:${col}">${status}</span></div>
                    <div class="item-sub">${q.desc}</div>
                    <div class="item-sub" style="color:#d4b572">보상: ${q.reward.gold}G · EXP ${q.reward.exp}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // --- ITEM SHOP ---
    openShopModal() {
      this.clearTouchInputs();
      this.state = 'modal';
      this.modalType = 'shop';
      this.modalTab = 'buy';
      this.el.modalBackdrop.classList.remove('hidden');
      this.renderShopModal();
    }

    renderShopModal() {
      this.renderModalTabs([
        { id: 'buy', label: '잡화 구매 (미나)' },
        { id: 'sell', label: '아이템 판매' }
      ], (id) => { this.modalTab = id; this.renderShopModal(); });

      const body = this.el.modalBody;
      const h = this.hero;

      if (this.modalTab === 'buy') {
        body.innerHTML = `
          <div class="panel-card">
            <h3>잡화상인 미나 · 보유 골드: <span style="color:#fde047">${h.gold.toLocaleString()} G</span></h3>
            <div class="list-grid">
              ${DATA.SHOP_GENERAL.map((id) => {
                const it = DATA.ITEMS[id];
                const owned = h.bagItems[id] || 0;
                return `
                  <div class="item-row">
                    <div class="item-info">
                      <div class="item-title"><span style="color:${DATA.RARITY[it.rarity].color}">${it.name}</span> <span class="badge">보유 ${owned}</span></div>
                      <div class="item-sub">${it.desc}</div>
                    </div>
                    <div class="item-actions">
                      <button class="rpg-btn small" data-buy="${id}" ${h.gold < it.price ? 'disabled' : ''}>${it.price}G 구매</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
        body.querySelectorAll('[data-buy]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.buy;
            const it = DATA.ITEMS[id];
            if (h.gold < it.price) return;
            h.gold -= it.price;
            this.giveItem(id, 1);
            this.audio.playSfx('coin');
            this.renderShopModal();
          });
        });
      } else {
        const sellEq = h.bagEquip.map((eq, idx) => {
          const it = DATA.ITEMS[eq.itemId];
          const price = Math.round(it.price * 0.5 + (eq.enh || 0) * 40);
          return `
            <div class="item-row">
              <div class="item-info">
                <div class="item-title">${this.formatEquipName(eq)}</div>
                <div class="item-sub">${this.formatEquipStats(eq)}</div>
              </div>
              <div class="item-actions">
                <button class="rpg-btn small secondary" data-sell-eq="${idx}">+${price}G 판매</button>
              </div>
            </div>
          `;
        }).join('');
        body.innerHTML = `
          <div class="panel-card">
            <h3>여분 장비 판매 · 보유 골드: <span style="color:#fde047">${h.gold.toLocaleString()} G</span></h3>
            <div class="list-grid">${sellEq || '<div class="item-sub">판매할 여분 장비가 없습니다.</div>'}</div>
          </div>
        `;
        body.querySelectorAll('[data-sell-eq]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.sellEq);
            const eq = h.bagEquip.splice(idx, 1)[0];
            if (!eq) return;
            const it = DATA.ITEMS[eq.itemId];
            h.gold += Math.round(it.price * 0.5 + (eq.enh || 0) * 40);
            this.audio.playSfx('coin');
            this.renderShopModal();
          });
        });
      }
    }

    // --- BLACKSMITH: ENHANCE (+1~+9) + SYNTHESIS + BUY ---
    openSmithModal(tab = 'enhance') {
      this.clearTouchInputs();
      this.state = 'modal';
      this.modalType = 'smith';
      this.modalTab = tab;
      this.el.modalBackdrop.classList.remove('hidden');
      this.renderSmithModal();
    }

    renderSmithModal(feedback = '') {
      this.renderModalTabs([
        { id: 'enhance', label: '🔥 장비 강화' },
        { id: 'craft', label: '⚒️ 장비 조합' },
        { id: 'gear', label: '🛡️ 장비 상점' }
      ], (id) => { this.modalTab = id; this.renderSmithModal(); });

      const body = this.el.modalBody;
      const h = this.hero;
      const stones = h.bagItems.mat_enhance || 0;

      if (this.modalTab === 'enhance') {
        const rates = [100, 100, 100, 80, 70, 60, 45, 35, 25];
        const slots = ['weapon', 'armor', 'helm', 'accessory'];
        const rows = slots.map((slot) => {
          const eq = h.equip[slot];
          if (!eq) return '';
          const enh = eq.enh || 0;
          const maxed = enh >= 9;
          const rate = maxed ? 0 : rates[enh];
          const costGold = 60 + enh * 75;
          const canDo = !maxed && stones >= 1 && h.gold >= costGold;
          return `
            <div class="item-row">
              <div class="item-info">
                <div class="item-title">${this.formatEquipName(eq)} ${maxed ? '<span class="badge">MAX</span>' : `<span class="badge">성공률 ${rate}%</span>`}</div>
                <div class="item-sub">${this.formatEquipStats(eq)} ${!maxed ? `· 비용: ${costGold}G + 강화석 1개` : ''}</div>
              </div>
              <div class="item-actions">
                <button class="rpg-btn small" data-enh-slot="${slot}" ${canDo ? '' : 'disabled'}>${maxed ? '최대' : `+${enh + 1} 강화`}</button>
              </div>
            </div>
          `;
        }).join('');

        body.innerHTML = `
          <div class="panel-card">
            <h3>대장장이 볼칸의 강화소 · 골드 <span style="color:#fde047">${h.gold.toLocaleString()}G</span> · 강화석 <span style="color:#4ade80">${stones}개</span></h3>
            ${feedback ? `<div style="margin-bottom:8px;padding:6px 10px;border-radius:6px;background:#2a2219;border:1px solid #8c6d3b;color:#fde047;font-weight:700;">${feedback}</div>` : ''}
            <div class="item-sub" style="margin-bottom:8px;">※ 실패해도 장비는 파괴되지 않습니다! +3/+5/+7 이상 무기는 검기 색상이 화려하게 변화합니다.</div>
            <div class="list-grid">${rows}</div>
          </div>
        `;

        body.querySelectorAll('[data-enh-slot]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const slot = btn.dataset.enhSlot;
            const eq = h.equip[slot];
            if (!eq || eq.enh >= 9) return;
            const costGold = 60 + eq.enh * 75;
            if (h.gold < costGold || (h.bagItems.mat_enhance || 0) < 1) return;
            const rate = rates[eq.enh];
            h.gold -= costGold;
            h.bagItems.mat_enhance--;
            if (Math.random() * 100 < rate) {
              eq.enh++;
              this.audio.playSfx('enhanceOk');
              this.renderSmithModal(`✨ 강화 성공! ${DATA.ITEMS[eq.itemId].name}이(가) +${eq.enh} 이 되었습니다!`);
            } else {
              this.audio.playSfx('enhanceFail');
              this.renderSmithModal(`💨 강화 실패... 장비는 무사하지만 강화석과 골드가 소모되었습니다.`);
            }
            this.saveGame(true);
          });
        });
      } else if (this.modalTab === 'craft') {
        const rows = DATA.RECIPES.map((rc) => {
          const res = DATA.ITEMS[rc.result];
          const matStatus = rc.materials.map((m) => {
            const have = h.bagItems[m.id] || 0;
            const ok = have >= m.qty;
            return `<span style="color:${ok ? '#4ade80' : '#f87171'}">${DATA.ITEMS[m.id].name} ${have}/${m.qty}</span>`;
          }).join(' · ');
          const canCraft = h.gold >= rc.gold && rc.materials.every((m) => (h.bagItems[m.id] || 0) >= m.qty);
          return `
            <div class="item-row">
              <div class="item-info">
                <div class="item-title"><span style="color:${DATA.RARITY[res.rarity].color}">${res.name}</span> <span class="badge">${rc.gold}G</span></div>
                <div class="item-sub">${this.formatEquipStats({ itemId: rc.result, enh: 0 })}</div>
                <div class="item-sub">재료: ${matStatus}</div>
              </div>
              <div class="item-actions">
                <button class="rpg-btn small" data-craft="${rc.id}" ${canCraft ? '' : 'disabled'}>조합</button>
              </div>
            </div>
          `;
        }).join('');

        body.innerHTML = `
          <div class="panel-card">
            <h3>영웅서기 장비 조합 · 보유 골드: <span style="color:#fde047">${h.gold.toLocaleString()} G</span></h3>
            ${feedback ? `<div style="margin-bottom:8px;padding:6px 10px;border-radius:6px;background:#2a2219;border:1px solid #8c6d3b;color:#4ade80;font-weight:700;">${feedback}</div>` : ''}
            <div class="list-grid">${rows}</div>
          </div>
        `;

        body.querySelectorAll('[data-craft]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const rc = DATA.RECIPES.find((r) => r.id === btn.dataset.craft);
            if (!rc) return;
            if (h.gold < rc.gold || !rc.materials.every((m) => (h.bagItems[m.id] || 0) >= m.qty)) return;
            h.gold -= rc.gold;
            rc.materials.forEach((m) => { h.bagItems[m.id] -= m.qty; });
            this.giveItem(rc.result, 1);
            this.audio.playSfx('enhanceOk');
            this.renderSmithModal(`⚒️ 조합 성공! [${DATA.ITEMS[rc.result].name}] 이(가) 가방에 추가되었습니다!`);
            this.saveGame(true);
          });
        });
      } else {
        body.innerHTML = `
          <div class="panel-card">
            <h3>대장장이 장비 상점 · 보유 골드: <span style="color:#fde047">${h.gold.toLocaleString()} G</span></h3>
            <div class="list-grid">
              ${DATA.SHOP_BLACKSMITH.map((id) => {
                const it = DATA.ITEMS[id];
                return `
                  <div class="item-row">
                    <div class="item-info">
                      <div class="item-title"><span style="color:${DATA.RARITY[it.rarity].color}">${it.name}</span></div>
                      <div class="item-sub">${this.formatEquipStats({ itemId: id, enh: 0 })} — ${it.desc}</div>
                    </div>
                    <div class="item-actions">
                      <button class="rpg-btn small" data-buy-gear="${id}" ${h.gold < it.price ? 'disabled' : ''}>${it.price}G</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
        body.querySelectorAll('[data-buy-gear]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.buyGear;
            const it = DATA.ITEMS[id];
            if (h.gold < it.price) return;
            h.gold -= it.price;
            this.giveItem(id, 1);
            this.audio.playSfx('coin');
            this.renderSmithModal();
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
    try {
      global.game = new HeroesLoreGame();
    } catch (err) {
      console.error('Boot error:', err);
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootGame);
  } else {
    bootGame();
  }
})(window);
