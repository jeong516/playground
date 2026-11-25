// High-Detail Layered Pixel-Art Tileset, Character & Monster Sprite Renderer (24x24 & 32x32)
(function (global) {
  'use strict';

  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function flipH(canvas) {
    const c = makeCanvas(canvas.width, canvas.height);
    const ctx = c.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(canvas, 0, 0);
    return c;
  }

  function px(ctx, x, y, w, h, col) {
    ctx.fillStyle = col;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function buildSprites() {
    const sprites = { tiles: {}, heroes: {}, npcs: {}, monsters: {} };

    // =========================================================
    // 1. RICH 24x24 ENVIRONMENT TILES
    // =========================================================
    const makeGrass = (mode) => {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      const base = mode === 'dark' ? '#2c4f31' : '#43783e';
      const mid  = mode === 'dark' ? '#254429' : '#3a6b35';
      const hi   = mode === 'dark' ? '#3a6940' : '#58944c';
      const hi2  = mode === 'dark' ? '#4a7d4e' : '#70ad5c';
      px(ctx, 0, 0, 24, 24, base);
      // Subtle organic dappled patches
      px(ctx, 2, 4, 6, 4, mid);
      px(ctx, 14, 13, 7, 5, mid);
      px(ctx, 11, 2, 5, 3, hi);
      px(ctx, 3, 16, 6, 4, hi);
      // Grass blades
      const blades = [[4,6],[9,11],[17,5],[20,17],[7,20],[15,19]];
      blades.forEach(([bx, by], i) => {
        px(ctx, bx, by, 1, 3, i % 2 === 0 ? hi2 : mid);
        px(ctx, bx + 1, by + 1, 1, 2, hi);
      });
      if (mode === 'flower') {
        // Warm golden & coral wildflowers with stems
        px(ctx, 6, 9, 1, 3, '#2d5c2b');
        px(ctx, 5, 7, 3, 2, '#f6d35e');
        px(ctx, 6, 6, 1, 3, '#fff5c2');
        px(ctx, 17, 15, 1, 3, '#2d5c2b');
        px(ctx, 16, 13, 3, 2, '#f07178');
        px(ctx, 17, 12, 1, 3, '#ffd4d8');
        px(ctx, 12, 4, 2, 2, '#e2f1ff');
      }
      return c;
    };
    sprites.tiles.grass = makeGrass('normal');
    sprites.tiles.flower = makeGrass('flower');
    sprites.tiles.darkGrass = makeGrass('dark');

    // Dirt Path with pebbles & soft warmth
    {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      px(ctx, 0, 0, 24, 24, '#b59260');
      px(ctx, 1, 2, 8, 5, '#a68251');
      px(ctx, 12, 11, 9, 6, '#a68251');
      px(ctx, 5, 16, 6, 4, '#c4a270');
      px(ctx, 15, 3, 5, 4, '#c4a270');
      // Small stones
      px(ctx, 4, 8, 2, 2, '#8c6b42'); px(ctx, 4, 8, 1, 1, '#d6ba8b');
      px(ctx, 18, 18, 2, 2, '#8c6b42'); px(ctx, 18, 18, 1, 1, '#d6ba8b');
      px(ctx, 10, 4, 2, 1, '#8c6b42');
      sprites.tiles.path = c;
    }

    // Refined Town Cobblestone (soft beveled warm flagstones)
    {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      px(ctx, 0, 0, 24, 24, '#696259');
      const stones = [
        [1, 1, 10, 7], [12, 1, 11, 7],
        [1, 9, 6, 6], [8, 9, 9, 6], [18, 9, 5, 6],
        [1, 16, 11, 7], [13, 16, 10, 7]
      ];
      stones.forEach(([x, y, w, h], idx) => {
        const col = idx % 3 === 0 ? '#9e9588' : (idx % 3 === 1 ? '#92897c' : '#a89f91');
        px(ctx, x, y, w, h, col);
        px(ctx, x, y, w, 1, '#bdb4a6');
        px(ctx, x, y + h - 1, w, 1, '#7c7469');
      });
      sprites.tiles.cobble = c;
    }

    // Animated Shimmering Water (2 frames)
    const makeWater = (f) => {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      px(ctx, 0, 0, 24, 24, '#246291');
      px(ctx, 0, 3, 24, 5, '#2d75ab');
      px(ctx, 0, 14, 24, 5, '#2d75ab');
      const o = f ? 6 : 0;
      px(ctx, (3 + o) % 20, 5, 5, 1, '#8fd3fa');
      px(ctx, (13 + o) % 20, 10, 4, 1, '#5caee0');
      px(ctx, (7 + o) % 20, 16, 6, 1, '#b8e8ff');
      px(ctx, (17 + o) % 20, 21, 4, 1, '#5caee0');
      return c;
    };
    sprites.tiles.water0 = makeWater(0);
    sprites.tiles.water1 = makeWater(1);

    // Timber Bridge with railings
    {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      px(ctx, 0, 0, 24, 24, '#59391f');
      for (let y = 1; y < 24; y += 4) {
        px(ctx, 2, y, 20, 3, '#8f6037');
        px(ctx, 2, y, 20, 1, '#ab7849');
      }
      px(ctx, 0, 0, 2, 24, '#472b15');
      px(ctx, 22, 0, 2, 24, '#472b15');
      px(ctx, 0, 2, 2, 4, '#c4945a');
      px(ctx, 22, 2, 2, 4, '#c4945a');
      px(ctx, 0, 16, 2, 4, '#c4945a');
      px(ctx, 22, 16, 2, 4, '#c4945a');
      sprites.tiles.bridge = c;
    }

    // Lush Layered Pine Trees (24x24)
    const makeTree = (dark) => {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      // Soft ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.32)';
      ctx.beginPath(); ctx.ellipse(12, 21, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
      // Trunk
      px(ctx, 10, 16, 4, 6, '#5c3b20');
      px(ctx, 11, 16, 2, 5, '#7a502d');
      // 3 Lush Foliage Tiers
      const cOut = dark ? '#0d1f16' : '#17381f';
      const cMid = dark ? '#1b3e2c' : '#296331';
      const cHi  = dark ? '#2f5e45' : '#458f43';
      const cTop = dark ? '#457a5c' : '#6cb559';
      const drawTier = (y, w, h) => {
        const x = 12 - w / 2;
        px(ctx, x, y + 1, w, h - 1, cOut);
        px(ctx, x + 1, y, w - 2, h - 1, cMid);
        px(ctx, x + 2, y, Math.max(2, w - 5), Math.max(2, h - 3), cHi);
        px(ctx, x + 3, y, Math.max(2, w - 8), 2, cTop);
      };
      drawTier(11, 20, 7);
      drawTier(6, 16, 6);
      drawTier(1, 10, 6);
      return c;
    };
    sprites.tiles.tree = makeTree(false);
    sprites.tiles.darkTree = makeTree(true);

    // Medieval Timber House Roof / Wall / Door (Warm & Cozy!)
    {
      const roof = makeCanvas(24, 24);
      const ctx = roof.getContext('2d');
      px(ctx, 0, 0, 24, 24, '#59231d');
      for (let y = 1; y < 22; y += 4) {
        px(ctx, 0, y, 24, 3, '#8a392d');
        px(ctx, 0, y, 24, 1, '#ab4d3c');
        for (let x = (y % 8 === 1 ? 0 : 3); x < 24; x += 6) {
          px(ctx, x, y + 1, 1, 2, '#692a22');
        }
      }
      px(ctx, 0, 21, 24, 3, '#3d1713');
      sprites.tiles.houseRoof = roof;

      const wall = makeCanvas(24, 24);
      const wctx = wall.getContext('2d');
      px(wctx, 0, 0, 24, 24, '#dfd0b4');
      px(wctx, 0, 0, 24, 3, '#c4b191'); // Roof eave shadow
      // Timber beams
      px(wctx, 0, 0, 3, 24, '#593b22');
      px(wctx, 21, 0, 3, 24, '#593b22');
      px(wctx, 0, 20, 24, 4, '#6b645c'); // Stone foundation
      px(wctx, 0, 20, 24, 1, '#8c847a');
      // Warm Glowing Window with shutters
      px(wctx, 6, 5, 12, 11, '#472c18');
      px(wctx, 7, 6, 10, 9, '#f6cf71');
      px(wctx, 8, 7, 4, 4, '#fff2bd');
      px(wctx, 11, 6, 2, 9, '#472c18');
      px(wctx, 7, 10, 10, 2, '#472c18');
      px(wctx, 5, 16, 14, 2, '#734b2b'); // Window sill
      sprites.tiles.houseWall = wall;

      const door = makeCanvas(24, 24);
      const dctx = door.getContext('2d');
      px(dctx, 0, 0, 24, 24, '#dfd0b4');
      px(dctx, 0, 0, 24, 3, '#c4b191');
      px(dctx, 0, 20, 24, 4, '#6b645c');
      // Arched oak door
      px(dctx, 5, 4, 14, 20, '#3d2412');
      px(dctx, 6, 5, 12, 19, '#734824');
      px(dctx, 7, 6, 10, 17, '#8c5a2e');
      px(dctx, 11, 6, 1, 17, '#5c381b');
      px(dctx, 7, 11, 10, 1, '#472c17');
      px(dctx, 15, 13, 2, 2, '#f2c95c'); // Brass handle
      sprites.tiles.houseDoor = door;
    }

    // Ruins Floor, Glowing Rune, and Carved Stone Wall
    {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      px(ctx, 0, 0, 24, 24, '#353842');
      px(ctx, 1, 1, 10, 10, '#494d59'); px(ctx, 1, 1, 10, 1, '#5d6270');
      px(ctx, 13, 1, 10, 10, '#444854'); px(ctx, 13, 1, 10, 1, '#575c69');
      px(ctx, 1, 13, 10, 10, '#444854'); px(ctx, 1, 13, 10, 1, '#575c69');
      px(ctx, 13, 13, 10, 10, '#494d59'); px(ctx, 13, 13, 10, 1, '#5d6270');
      sprites.tiles.ruinFloor = c;

      const r = makeCanvas(24, 24);
      const rctx = r.getContext('2d');
      rctx.drawImage(c, 0, 0);
      rctx.strokeStyle = '#38bdf8';
      rctx.lineWidth = 1.5;
      rctx.strokeRect(5, 5, 14, 14);
      px(rctx, 10, 10, 4, 4, '#bae6fd');
      sprites.tiles.ruinRune = r;

      const w = makeCanvas(24, 24);
      const wctx = w.getContext('2d');
      px(wctx, 0, 0, 24, 24, '#1f2129');
      px(wctx, 1, 1, 22, 9, '#5d6270'); px(wctx, 1, 1, 22, 2, '#7d8394');
      px(wctx, 1, 12, 10, 11, '#4b4f5c'); px(wctx, 1, 12, 10, 1, '#686e7d');
      px(wctx, 13, 12, 10, 11, '#4b4f5c'); px(wctx, 13, 12, 10, 1, '#686e7d');
      sprites.tiles.wall = w;
    }

    // Crimson Obsidian Boss Altar
    {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      px(ctx, 0, 0, 24, 24, '#24181e');
      px(ctx, 1, 1, 22, 22, '#33222a');
      px(ctx, 2, 2, 20, 1, '#4d313d');
      px(ctx, 11, 11, 2, 2, '#702c3d');
      sprites.tiles.altarFloor = c;

      const w = makeCanvas(24, 24);
      const wctx = w.getContext('2d');
      px(wctx, 0, 0, 24, 24, '#140b0f');
      px(wctx, 1, 1, 22, 9, '#45242e'); px(wctx, 1, 1, 22, 2, '#992d45');
      px(wctx, 1, 12, 10, 11, '#30171f'); px(wctx, 13, 12, 10, 11, '#30171f');
      sprites.tiles.altarWall = w;
    }

    // Animated Crystal Healing Fountain (24x24)
    const makeFountain = (f) => {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.ellipse(12, 20, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
      // Stone basin
      px(ctx, 2, 6, 20, 14, '#5a6270');
      px(ctx, 3, 5, 18, 14, '#9da6b5');
      px(ctx, 4, 7, 16, 10, '#2a82c4');
      px(ctx, 5, 8, 14, 8, f ? '#5ec2f7' : '#3ca2e0');
      // Center crystal spire
      px(ctx, 10, 2, 4, 12, '#cbd5e1');
      px(ctx, 11, 1, 2, 11, '#ffffff');
      // Sparkling droplets
      px(ctx, f ? 6 : 8, f ? 7 : 9, 2, 2, '#e0f7ff');
      px(ctx, f ? 16 : 14, f ? 12 : 10, 2, 2, '#ffffff');
      return c;
    };
    sprites.tiles.fountain0 = makeFountain(0);
    sprites.tiles.fountain1 = makeFountain(1);

    // Ornate Gold-Trimmed Treasure Chests (24x24)
    const makeChest = (open) => {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.ellipse(12, 20, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, 3, open ? 4 : 6, 18, open ? 15 : 13, '#3b210e');
      px(ctx, 4, open ? 5 : 7, 16, open ? 5 : 5, open ? '#593316' : '#9c5d26');
      px(ctx, 4, 12, 16, 6, '#7a471b');
      if (open) px(ctx, 5, 9, 14, 4, '#1c1008');
      // Gold bands & lock
      px(ctx, 4, open ? 5 : 7, 2, 11, '#d9a441');
      px(ctx, 18, open ? 5 : 7, 2, 11, '#d9a441');
      px(ctx, 10, 10, 4, 4, '#f5d061');
      px(ctx, 11, 11, 2, 2, '#fff5b8');
      return c;
    };
    sprites.tiles.chestClosed = makeChest(false);
    sprites.tiles.chestOpen = makeChest(true);

    // =========================================================
    // 2. HIGH-DETAIL 28x28 CHIBI HERO SPRITES (WITH WEAPONS!)
    // =========================================================
    function makeHero(cfg, walkFrame) {
      const c = makeCanvas(28, 28);
      const ctx = c.getContext('2d');
      const bob = walkFrame ? -1 : 0;

      // Flowing Cape behind body
      px(ctx, 7, 13 + bob, 14, 10, cfg.capeDark);
      px(ctx, 8, 13 + bob, 12, 8, cfg.cape);

      // Boots / Legs
      const lY = walkFrame ? 22 : 23;
      const rY = walkFrame ? 24 : 23;
      px(ctx, 9, lY, 4, 4, '#241c17'); px(ctx, 10, lY, 2, 3, cfg.boot);
      px(ctx, 15, rY, 4, 4, '#241c17'); px(ctx, 16, rY, 2, 3, cfg.boot);

      // Torso Armor + Pauldrons + Belt
      px(ctx, 8, 14 + bob, 12, 9, '#1a181c');
      px(ctx, 9, 15 + bob, 10, 7, cfg.armor);
      px(ctx, 10, 15 + bob, 8, 3, cfg.armorHi);
      // Tabard / Emblem center
      px(ctx, 12, 15 + bob, 4, 7, cfg.trim);
      px(ctx, 9, 20 + bob, 10, 2, '#3d2a18');
      px(ctx, 13, 20 + bob, 2, 2, '#f5d061'); // Belt buckle
      // Shoulders
      px(ctx, 6, 14 + bob, 4, 4, '#1a181c'); px(ctx, 7, 15 + bob, 3, 2, cfg.armorHi);
      px(ctx, 18, 14 + bob, 4, 4, '#1a181c'); px(ctx, 18, 15 + bob, 3, 2, cfg.armorHi);

      // Expressive Head (Chibi Heroic proportions)
      px(ctx, 7, 3 + bob, 14, 12, '#1c1816');
      px(ctx, 8, 4 + bob, 12, 10, cfg.hair);
      px(ctx, 9, 4 + bob, 10, 4, cfg.hairHi);
      // Face
      px(ctx, 9, 8 + bob, 10, 6, '#f7d5b0');
      px(ctx, 9, 12 + bob, 10, 2, '#e3b68a');
      // Bangs / Headgear accent
      px(ctx, 8, 6 + bob, 12, 2, cfg.hair);
      px(ctx, 10, 7 + bob, 3, 2, cfg.hairHi);
      if (cfg.headband) px(ctx, 8, 7 + bob, 12, 1, cfg.headband);
      // Crisp RPG Eyes with highlight
      px(ctx, 10, 10 + bob, 2, 3, '#1a1a24'); px(ctx, 10, 10 + bob, 1, 1, '#ffffff');
      px(ctx, 16, 10 + bob, 2, 3, '#1a1a24'); px(ctx, 16, 10 + bob, 1, 1, '#ffffff');

      // Weapon held in Right Hand!
      if (cfg.weapon === 'sword') {
        // Knight Broadsword + Shield
        px(ctx, 4, 15 + bob, 5, 7, '#222630');
        px(ctx, 5, 16 + bob, 3, 5, '#b82c38');
        px(ctx, 6, 17 + bob, 1, 3, '#f5d061'); // Shield emblem
        // Sword upright
        px(ctx, 21, 7 + bob, 3, 12, '#9aa8bd');
        px(ctx, 22, 7 + bob, 1, 11, '#eef4fc');
        px(ctx, 20, 18 + bob, 5, 2, '#d9a441');
        px(ctx, 21, 20 + bob, 2, 2, '#593b20');
      } else if (cfg.weapon === 'dagger') {
        // Dual Twin Daggers
        px(ctx, 3, 14 + bob, 2, 7, '#d1dce8'); px(ctx, 3, 14 + bob, 1, 5, '#ffffff');
        px(ctx, 23, 12 + bob, 2, 8, '#d1dce8'); px(ctx, 23, 12 + bob, 1, 6, '#ffffff');
        px(ctx, 22, 19 + bob, 4, 1, '#d9a441');
      } else {
        // Glowing Runeblade
        px(ctx, 21, 6 + bob, 3, 13, '#38bdf8');
        px(ctx, 22, 6 + bob, 1, 12, '#e0f7ff');
        px(ctx, 20, 18 + bob, 5, 2, '#f0c451');
        px(ctx, 21, 20 + bob, 2, 2, '#3b2c59');
      }
      return c;
    }

    const heroConfigs = {
      knight:    { hair: '#6b3e22', hairHi: '#9c6239', headband: '#c9d6e8', armor: '#7d8a9e', armorHi: '#cad5e6', trim: '#b82c38', cape: '#9e222d', capeDark: '#5e141b', boot: '#4a3525', weapon: 'sword' },
      rogue:     { hair: '#1d3b30', hairHi: '#346954', headband: '#d9a441', armor: '#2e4a3f', armorHi: '#4a7564', trim: '#c99334', cape: '#233b32', capeDark: '#13211c', boot: '#2b241f', weapon: 'dagger' },
      runeblade: { hair: '#2c427a', hairHi: '#5377c9', headband: '#7ce3f5', armor: '#344c8a', armorHi: '#628ae3', trim: '#f0c451', cape: '#283869', capeDark: '#17203d', boot: '#2c2b47', weapon: 'rune' }
    };

    Object.entries(heroConfigs).forEach(([id, cfg]) => {
      const idle = makeHero(cfg, false);
      const walk = makeHero(cfg, true);
      sprites.heroes[id] = { idle, walk, idleLeft: flipH(idle), walkLeft: flipH(walk) };
    });

    // =========================================================
    // 3. DETAILED 28x28 NPC SPRITES
    // =========================================================
    function makeNpc(cfg) {
      const c = makeCanvas(28, 28);
      const ctx = c.getContext('2d');
      // Robe / Outfit
      px(ctx, 8, 14, 12, 11, '#241a14');
      px(ctx, 9, 15, 10, 9, cfg.robe);
      px(ctx, 11, 15, 6, 9, cfg.robeHi);
      px(ctx, 9, 20, 10, 2, cfg.belt);
      // Head
      px(ctx, 8, 4, 12, 11, '#241a14');
      px(ctx, 9, 5, 10, 9, cfg.hair);
      px(ctx, 10, 8, 8, 6, '#f7d5b0');
      px(ctx, 11, 10, 2, 2, '#1a1820');
      px(ctx, 15, 10, 2, 2, '#1a1820');
      if (cfg.beard) {
        px(ctx, 10, 13, 8, 4, '#eef2f7');
        px(ctx, 11, 16, 6, 2, '#cbd5e1');
      }
      if (cfg.prop === 'staff') {
        px(ctx, 21, 7, 2, 18, '#6e4726');
        px(ctx, 20, 5, 4, 3, '#f5d061');
      } else if (cfg.prop === 'hammer') {
        px(ctx, 21, 11, 2, 12, '#6e4726');
        px(ctx, 19, 8, 6, 4, '#8d97a6');
        px(ctx, 19, 8, 6, 1, '#cfd7e3');
      } else if (cfg.prop === 'ribbon') {
        px(ctx, 10, 3, 8, 2, '#e04f5f');
        px(ctx, 13, 2, 2, 3, '#ff9aa5');
      }
      return c;
    }

    sprites.npcs.elder = makeNpc({ hair: '#d8e0eb', robe: '#6e472b', robeHi: '#966541', belt: '#d9a441', beard: true, prop: 'staff' });
    sprites.npcs.shop  = makeNpc({ hair: '#d99838', robe: '#b53c4a', robeHi: '#f5efe6', belt: '#5c2c2c', prop: 'ribbon' });
    sprites.npcs.smith = makeNpc({ hair: '#9e2a2a', robe: '#524b47', robeHi: '#756d67', belt: '#c99334', prop: 'hammer' });

    // =========================================================
    // 4. RICH LAYERED MONSTER & BOSS SPRITES
    // =========================================================
    const makeSlime = (dark, mid, hi, f) => {
      const c = makeCanvas(24, 24);
      const ctx = c.getContext('2d');
      const sy = f ? 2 : 0;
      const w = f ? 18 : 16;
      const x = 12 - w / 2;
      px(ctx, x, 9 + sy, w, 11 - sy, '#152418');
      px(ctx, x + 1, 8 + sy, w - 2, 11 - sy, mid);
      px(ctx, x + 2, 7 + sy, w - 4, 3, mid);
      px(ctx, x + 1, 15, w - 2, 4, dark);
      // Glossy translucent highlight
      px(ctx, x + 3, 9 + sy, 4, 2, hi);
      px(ctx, x + 3, 11 + sy, 2, 1, '#ffffff');
      // Cute retro eyes
      px(ctx, 8, 13 + sy, 2, 3, '#111'); px(ctx, 8, 13 + sy, 1, 1, '#fff');
      px(ctx, 14, 13 + sy, 2, 3, '#111'); px(ctx, 14, 13 + sy, 1, 1, '#fff');
      return c;
    };
    sprites.monsters.slime_green = [makeSlime('#277833', '#49c458', '#b8f7b0', 0), makeSlime('#277833', '#49c458', '#b8f7b0', 1)];
    sprites.monsters.slime_blue  = [makeSlime('#1d568f', '#3b9be8', '#b5e3ff', 0), makeSlime('#1d568f', '#3b9be8', '#b5e3ff', 1)];

    const makeBoar = (f) => {
      const c = makeCanvas(26, 26);
      const ctx = c.getContext('2d');
      const y = f ? 1 : 0;
      px(ctx, 4, 8 + y, 18, 11, '#26170e');
      px(ctx, 5, 9 + y, 16, 9, '#7a4d32');
      px(ctx, 6, 9 + y, 14, 3, '#9c6644');
      px(ctx, 8, 7 + y, 10, 2, '#4a2c1a'); // Bristles
      // Snout & Ivory Tusks
      px(ctx, 9, 13 + y, 8, 4, '#d4907d');
      px(ctx, 11, 14 + y, 1, 2, '#4a251c'); px(ctx, 14, 14 + y, 1, 2, '#4a251c');
      px(ctx, 6, 13 + y, 2, 4, '#fff8e3'); px(ctx, 18, 13 + y, 2, 4, '#fff8e3');
      // Angry eyes
      px(ctx, 8, 11 + y, 2, 2, '#140c0c'); px(ctx, 16, 11 + y, 2, 2, '#140c0c');
      // Hooves
      px(ctx, 6, 19 + (f ? 0 : 1), 3, 3, '#26170e');
      px(ctx, 17, 19 + (f ? 1 : 0), 3, 3, '#26170e');
      return c;
    };
    sprites.monsters.boar = [makeBoar(0), makeBoar(1)];

    const makeGoblin = (shaman, f) => {
      const c = makeCanvas(28, 28);
      const ctx = c.getContext('2d');
      const b = f ? -1 : 0;
      px(ctx, 9, 14 + b, 10, 9, '#1c1814');
      px(ctx, 10, 15 + b, 8, 7, shaman ? '#7d283e' : '#755033');
      // Ears + Head
      px(ctx, 5, 7 + b, 4, 3, '#4c8532'); px(ctx, 19, 7 + b, 4, 3, '#4c8532');
      px(ctx, 8, 5 + b, 12, 10, '#182414');
      px(ctx, 9, 6 + b, 10, 8, '#5ea140');
      if (shaman) {
        px(ctx, 7, 3 + b, 14, 5, '#8f2940');
        px(ctx, 9, 2 + b, 10, 3, '#b83956');
      }
      // Glowing eyes
      px(ctx, 10, 9 + b, 2, 2, shaman ? '#ffe052' : '#ff4747');
      px(ctx, 16, 9 + b, 2, 2, shaman ? '#ffe052' : '#ff4747');
      // Legs
      px(ctx, 10, 22, 3, 4, '#4c8532'); px(ctx, 15, 22 + (f ? -1 : 0), 3, 4, '#4c8532');
      // Weapon
      if (shaman) {
        px(ctx, 21, 9 + b, 2, 14, '#6e4726');
        px(ctx, 20, 6 + b, 4, 4, '#38bdf8'); px(ctx, 21, 7 + b, 2, 2, '#e0f7ff');
      } else {
        px(ctx, 21, 10 + b, 3, 10, '#9aa5b5'); px(ctx, 22, 10 + b, 1, 9, '#e2eaf5');
      }
      return c;
    };
    sprites.monsters.goblin = [makeGoblin(false, 0), makeGoblin(false, 1)];
    sprites.monsters.goblin_shaman = [makeGoblin(true, 0), makeGoblin(true, 1)];

    const makeSkeleton = (f) => {
      const c = makeCanvas(28, 28);
      const ctx = c.getContext('2d');
      const b = f ? -1 : 0;
      px(ctx, 9, 14 + b, 10, 9, '#232630');
      px(ctx, 10, 15 + b, 8, 7, '#585f73');
      px(ctx, 11, 16 + b, 6, 1, '#e6eaf2'); px(ctx, 11, 18 + b, 6, 1, '#e6eaf2'); // Ribs
      // Skull
      px(ctx, 8, 4 + b, 12, 10, '#1e2029');
      px(ctx, 9, 5 + b, 10, 8, '#e8ecf5');
      px(ctx, 10, 8 + b, 2, 3, '#14121a'); px(ctx, 16, 8 + b, 2, 3, '#14121a');
      px(ctx, 11, 9 + b, 1, 1, '#ff4d5a'); px(ctx, 17, 9 + b, 1, 1, '#ff4d5a');
      // Legs & Rusty Sword
      px(ctx, 10, 23, 2, 4, '#cfd6e3'); px(ctx, 16, 23 + (f ? -1 : 0), 2, 4, '#cfd6e3');
      px(ctx, 21, 8 + b, 3, 12, '#8b95a6'); px(ctx, 22, 8 + b, 1, 11, '#dce3f0');
      return c;
    };
    sprites.monsters.skeleton = [makeSkeleton(0), makeSkeleton(1)];

    const makeGolem = (f) => {
      const c = makeCanvas(32, 32);
      const ctx = c.getContext('2d');
      const b = f ? 1 : 0;
      px(ctx, 6, 10 + b, 20, 14, '#24272e');
      px(ctx, 7, 11 + b, 18, 12, '#737a87');
      px(ctx, 8, 11 + b, 16, 3, '#979fad');
      // Head stone
      px(ctx, 10, 4 + b, 12, 8, '#24272e');
      px(ctx, 11, 5 + b, 10, 6, '#848c99');
      px(ctx, 12, 7 + b, 3, 2, '#fbbf24'); px(ctx, 17, 7 + b, 3, 2, '#fbbf24');
      // Glowing Rune Core
      px(ctx, 13, 15 + b, 6, 5, '#2dd4bf');
      px(ctx, 14, 16 + b, 4, 3, '#ccfbf1');
      // Heavy Fists & Legs
      px(ctx, 2, 13 + b, 5, 11, '#585e69'); px(ctx, 25, 13 + b, 5, 11, '#585e69');
      px(ctx, 8, 24, 6, 6, '#484d57'); px(ctx, 18, 24, 6, 6, '#484d57');
      return c;
    };
    sprites.monsters.golem = [makeGolem(0), makeGolem(1)];

    const makeDarkMage = (f) => {
      const c = makeCanvas(28, 28);
      const ctx = c.getContext('2d');
      const b = f ? -1 : 0;
      px(ctx, 7, 12 + b, 14, 13, '#17121f');
      px(ctx, 8, 13 + b, 12, 11, '#2f253d');
      px(ctx, 12, 13 + b, 4, 11, '#c99334');
      // Hood
      px(ctx, 7, 3 + b, 14, 11, '#17121f');
      px(ctx, 8, 4 + b, 12, 9, '#3e3152');
      px(ctx, 10, 7 + b, 8, 5, '#0b0812');
      px(ctx, 11, 9 + b, 2, 2, '#ff3b5c'); px(ctx, 15, 9 + b, 2, 2, '#ff3b5c');
      // Orbiting dark orb
      px(ctx, 22, 9 + (f ? -2 : 1), 4, 4, '#f43f5e');
      px(ctx, 23, 10 + (f ? -2 : 1), 2, 2, '#ffe4e6');
      return c;
    };
    sprites.monsters.dark_mage = [makeDarkMage(0), makeDarkMage(1)];

    // Mini Boss: Goblin Chief (36x36)
    const makeChief = (f) => {
      const c = makeCanvas(36, 36);
      const ctx = c.getContext('2d');
      const b = f ? -1 : 0;
      // Red warlord cape
      px(ctx, 7, 15 + b, 22, 16, '#6e1919');
      px(ctx, 9, 15 + b, 18, 14, '#b82828');
      // Armor & muscular shoulders
      px(ctx, 9, 15 + b, 18, 13, '#211913');
      px(ctx, 10, 16 + b, 16, 11, '#6e4a2e');
      px(ctx, 14, 16 + b, 8, 11, '#d9a441');
      // Horned Helm & Face
      px(ctx, 6, 4 + b, 4, 6, '#f5ebd1'); px(ctx, 26, 4 + b, 4, 6, '#f5ebd1');
      px(ctx, 10, 5 + b, 16, 12, '#1b2416');
      px(ctx, 11, 6 + b, 14, 5, '#687080');
      px(ctx, 11, 10 + b, 14, 6, '#509438');
      px(ctx, 13, 12 + b, 3, 2, '#ff3b3b'); px(ctx, 20, 12 + b, 3, 2, '#ff3b3b');
      // Massive Battle Axe
      px(ctx, 28, 8 + b, 3, 20, '#59391f');
      px(ctx, 26, 7 + b, 8, 9, '#9ba6b8'); px(ctx, 31, 8 + b, 3, 7, '#e6edf7');
      // Boots
      px(ctx, 11, 28, 5, 6, '#382415'); px(ctx, 20, 28 + (f ? -1 : 0), 5, 6, '#382415');
      return c;
    };
    sprites.monsters.goblin_chief = [makeChief(0), makeChief(1)];

    // Final Boss: Abyssal Knight Vargas (40x40)
    const makeVargas = (f) => {
      const c = makeCanvas(40, 40);
      const ctx = c.getContext('2d');
      const b = f ? -1 : 0;
      // Tattered Crimson Mantle
      px(ctx, 6, 14 + b, 28, 20, '#591120');
      px(ctx, 8, 15 + b, 24, 18, '#9e1c36');
      // Obsidian Plate Armor
      px(ctx, 10, 14 + b, 20, 16, '#101118');
      px(ctx, 11, 15 + b, 18, 14, '#323747');
      px(ctx, 12, 15 + b, 16, 4, '#4d546b');
      px(ctx, 16, 16 + b, 8, 12, '#c99334');
      px(ctx, 18, 18 + b, 4, 5, f ? '#ff667a' : '#ff2e4c'); // Abyssal Heart Core
      // Horned Obsidian Crown Helm
      px(ctx, 7, 2 + b, 4, 8, '#d4dce8'); px(ctx, 29, 2 + b, 4, 8, '#d4dce8');
      px(ctx, 11, 4 + b, 18, 12, '#0e0f14');
      px(ctx, 12, 5 + b, 16, 10, '#2a2e3d');
      px(ctx, 14, 9 + b, 12, 3, '#100c14');
      px(ctx, 15, 10 + b, 4, 2, '#ff3352'); px(ctx, 21, 10 + b, 4, 2, '#ff3352');
      // Massive Runed Greatsword
      px(ctx, 32, 4 + b, 4, 24, '#363b4d');
      px(ctx, 33, 5 + b, 2, 22, '#ff4d6a');
      px(ctx, 30, 26 + b, 8, 3, '#e0aa43');
      // Greaves
      px(ctx, 12, 30, 6, 7, '#1d202b'); px(ctx, 22, 30 + (f ? -1 : 0), 6, 7, '#1d202b');
      return c;
    };
    sprites.monsters.vargas = [makeVargas(0), makeVargas(1)];

    return sprites;
  }

  global.buildSprites = buildSprites;
})(window);
