// Modern HD 2D Fantasy Vector & Cel-Shaded Illustration Renderer (Zero Pixel Art)
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
    ctx.imageSmoothingEnabled = true;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(canvas, 0, 0);
    return c;
  }

  function rrect(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  function linGrad(ctx, x0, y0, x1, y1, stops) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  }

  function radGrad(ctx, x0, y0, r0, x1, y1, r1, stops) {
    const g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  }

  function buildSprites() {
    const sprites = { tiles: {}, heroes: {}, npcs: {}, monsters: {} };
    const TS = 96; // High-resolution 96x96 smooth painted tiles

    // =========================================================
    // 1. SMOOTH PAINTED SEAMLESS HD ENVIRONMENT TILES (96x96)
    // =========================================================
    const makeGrass = (mode) => {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      const isDark = mode === 'dark';
      // Uniform edge-seamless base color so adjacent tiles blend with zero grid seams
      ctx.fillStyle = isDark ? '#28492e' : '#4a8443';
      ctx.fillRect(0, 0, TS, TS);

      // Soft interior organic dappled light & shade
      const patches = [
        [28, 28, 20, 12, isDark ? 'rgba(66,118,74,0.18)' : 'rgba(130,198,100,0.17)'],
        [66, 62, 22, 13, isDark ? 'rgba(18,36,22,0.18)' : 'rgba(42,84,38,0.13)'],
        [66, 26, 15, 10, isDark ? 'rgba(66,118,74,0.14)' : 'rgba(155,214,116,0.14)']
      ];
      patches.forEach(([x, y, rx, ry, col]) => {
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0.25, 0, Math.PI * 2); ctx.fill();
      });

      // Subtle delicate grass blades (spaced organically, not noisy)
      const tufts = [[22, 34], [58, 22], [72, 66], [34, 74]];
      tufts.forEach(([bx, by], i) => {
        ctx.strokeStyle = i % 2 === 0
          ? (isDark ? 'rgba(92,148,99,0.42)' : 'rgba(146,214,114,0.48)')
          : (isDark ? 'rgba(20,42,25,0.38)' : 'rgba(43,88,38,0.34)');
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx, by + 5); ctx.quadraticCurveTo(bx - 2.5, by, bx - 4.5, by - 3.5);
        ctx.moveTo(bx + 2, by + 5); ctx.quadraticCurveTo(bx + 3.5, by, bx + 5, by - 2.5);
        ctx.stroke();
      });

      if (mode === 'flower') {
        const flowers = [
          [26, 32, '#fde047', '#fffbeb'],
          [68, 58, '#fb7185', '#ffe4e6'],
          [54, 24, '#93c5fd', '#eff6ff'],
          [34, 72, '#fcd34d', '#ffffff']
        ];
        flowers.forEach(([fx, fy, petal, core]) => {
          ctx.fillStyle = 'rgba(0,0,0,0.14)';
          ctx.beginPath(); ctx.ellipse(fx, fy + 5, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = petal;
          for (let a = 0; a < 5; a++) {
            const ang = (a / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(fx + Math.cos(ang) * 4, fy + Math.sin(ang) * 3.2, 3.2, 2.4, ang, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = core;
          ctx.beginPath(); ctx.arc(fx, fy, 2.4, 0, Math.PI * 2); ctx.fill();
        });
      }
      return c;
    };
    sprites.tiles.grass = makeGrass('normal');
    sprites.tiles.flower = makeGrass('flower');
    sprites.tiles.darkGrass = makeGrass('dark');

    // Warm Sunlit Dirt Path (Edge-Seamless)
    {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#bd9966';
      ctx.fillRect(0, 0, TS, TS);
      [[26, 30, 20, 11, 'rgba(232,206,162,0.28)'], [66, 64, 22, 12, 'rgba(138,102,58,0.18)'], [68, 26, 16, 9, 'rgba(232,206,162,0.22)']]
        .forEach(([x, y, rx, ry, col]) => {
          ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.2, 0, Math.PI * 2); ctx.fill();
        });
      [[22, 44, 4, 2.6], [70, 70, 4.8, 3], [46, 22, 3.5, 2.2]].forEach(([px, py, rx, ry]) => {
        ctx.fillStyle = 'rgba(72,50,28,0.32)';
        ctx.beginPath(); ctx.ellipse(px + 1, py + 1.5, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#d6bc92';
        ctx.beginPath(); ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
      });
      sprites.tiles.path = c;
    }

    // Smooth Beveled Medieval Flagstone Cobblestone
    {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#5e5a54';
      ctx.fillRect(0, 0, TS, TS);
      const stones = [
        [3, 3, 42, 27, '#a8a095'], [49, 3, 44, 27, '#9c9488'],
        [3, 34, 26, 27, '#999186'], [33, 34, 36, 27, '#afa79b'], [73, 34, 20, 27, '#9e968b'],
        [3, 65, 46, 28, '#a39b90'], [53, 65, 40, 28, '#aba397']
      ];
      stones.forEach(([x, y, w, h, col]) => {
        rrect(ctx, x, y, w, h, 7);
        ctx.fillStyle = linGrad(ctx, x, y, x, y + h, [[0, '#c2bab0'], [0.22, col], [1, '#827a70']]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,250,242,0.22)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      sprites.tiles.cobble = c;
    }

    // Crystal Clear Shimmering Water (2 frames)
    const makeWater = (f) => {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, TS, [[0, '#1f6ba3'], [0.5, '#2980bd'], [1, '#1c5f94']]);
      ctx.fillRect(0, 0, TS, TS);
      const shift = f ? 24 : 0;
      ctx.strokeStyle = 'rgba(186, 236, 255, 0.55)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const wy = 14 + i * 24;
        const wx = ((i * 29 + shift) % 68) + 6;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.quadraticCurveTo(wx + 12, wy - 4, wx + 24, wy);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(224, 247, 255, 0.35)';
      ctx.beginPath(); ctx.ellipse(f ? 62 : 34, f ? 30 : 62, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
      return c;
    };
    sprites.tiles.water0 = makeWater(0);
    sprites.tiles.water1 = makeWater(1);

    // Crafted Timber Bridge
    {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#4a2e18';
      ctx.fillRect(0, 0, TS, TS);
      for (let y = 4; y < TS; y += 16) {
        rrect(ctx, 8, y, TS - 16, 13, 3);
        ctx.fillStyle = linGrad(ctx, 0, y, 0, y + 13, [[0, '#b5804e'], [0.4, '#946337'], [1, '#754b27']]);
        ctx.fill();
        ctx.fillStyle = '#3b2412';
        ctx.beginPath(); ctx.arc(14, y + 6.5, 1.8, 0, Math.PI * 2); ctx.arc(TS - 14, y + 6.5, 1.8, 0, Math.PI * 2); ctx.fill();
      }
      // Side rails
      [0, TS - 9].forEach((rx) => {
        ctx.fillStyle = linGrad(ctx, rx, 0, rx + 9, 0, [[0, '#694121'], [0.5, '#8c5a30'], [1, '#4a2c15']]);
        ctx.fillRect(rx, 0, 9, TS);
        [10, 62].forEach((py) => {
          rrect(ctx, rx - 1, py, 11, 14, 3);
          ctx.fillStyle = '#d4a166'; ctx.fill();
          ctx.strokeStyle = '#523217'; ctx.lineWidth = 1.5; ctx.stroke();
        });
      });
      sprites.tiles.bridge = c;
    }

    // Lush Stylized Painted Pine Tree (96x96)
    const makeTree = (dark) => {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath(); ctx.ellipse(48, 84, 34, 11, 0, 0, Math.PI * 2); ctx.fill();

      // Trunk
      rrect(ctx, 40, 62, 16, 25, 4);
      ctx.fillStyle = linGrad(ctx, 40, 0, 56, 0, [[0, '#4f321b'], [0.45, '#7c512f'], [1, '#422814']]);
      ctx.fill();

      const cTop = dark ? '#3f7357' : '#73c260';
      const cMid = dark ? '#244d38' : '#3a843d';
      const cBot = dark ? '#12291e' : '#1d4d25';

      const drawCanopy = (cy, rx, ry) => {
        ctx.beginPath();
        ctx.moveTo(48, cy - ry);
        ctx.bezierCurveTo(48 + rx * 0.65, cy - ry * 0.35, 48 + rx, cy + ry * 0.25, 48 + rx * 0.85, cy + ry * 0.72);
        ctx.quadraticCurveTo(48, cy + ry * 1.05, 48 - rx * 0.85, cy + ry * 0.72);
        ctx.bezierCurveTo(48 - rx, cy + ry * 0.25, 48 - rx * 0.65, cy - ry * 0.35, 48, cy - ry);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 48 - rx * 0.4, cy - ry, 48 + rx * 0.4, cy + ry, [[0, cTop], [0.52, cMid], [1, cBot]]);
        ctx.fill();
        ctx.strokeStyle = dark ? 'rgba(8,20,14,0.6)' : 'rgba(18,46,22,0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();
      };
      drawCanopy(58, 40, 20);
      drawCanopy(40, 33, 19);
      drawCanopy(22, 23, 18);
      // Soft sunlight glint
      ctx.fillStyle = dark ? 'rgba(140,210,165,0.16)' : 'rgba(218,255,170,0.28)';
      ctx.beginPath(); ctx.ellipse(42, 18, 9, 6, -0.4, 0, Math.PI * 2); ctx.fill();
      return c;
    };
    sprites.tiles.tree = makeTree(false);
    sprites.tiles.darkTree = makeTree(true);

    // Medieval Fantasy Cottage Roof / Wall / Door
    {
      const roof = makeCanvas(TS, TS);
      const ctx = roof.getContext('2d');
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, TS, [[0, '#a84436'], [0.85, '#7a2d23'], [1, '#4d1a14']]);
      ctx.fillRect(0, 0, TS, TS);
      for (let y = 4; y < TS - 12; y += 18) {
        const off = (Math.floor(y / 18) % 2) * 12;
        for (let x = -12 + off; x < TS + 12; x += 24) {
          rrect(ctx, x + 1, y, 22, 16, 6);
          ctx.fillStyle = linGrad(ctx, x, y, x, y + 16, [[0, '#c45847'], [0.4, '#943a2e'], [1, '#69241c']]);
          ctx.fill();
          ctx.strokeStyle = 'rgba(48,14,10,0.5)'; ctx.lineWidth = 1.4; ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(20,8,6,0.48)'; ctx.fillRect(0, TS - 10, TS, 10);
      sprites.tiles.houseRoof = roof;

      const wall = makeCanvas(TS, TS);
      const wctx = wall.getContext('2d');
      wctx.fillStyle = linGrad(wctx, 0, 0, 0, TS, [[0, '#d9cab0'], [0.2, '#efe3cc'], [0.82, '#e2d3b8'], [1, '#cbb99a']]);
      wctx.fillRect(0, 0, TS, TS);
      wctx.fillStyle = 'rgba(40,26,16,0.22)'; wctx.fillRect(0, 0, TS, 11);
      // Timber framing
      wctx.fillStyle = '#5c3c22'; wctx.fillRect(0, 0, 10, TS); wctx.fillRect(TS - 10, 0, 10, TS);
      // Stone base
      wctx.fillStyle = linGrad(wctx, 0, TS - 18, 0, TS, [[0, '#8d857b'], [1, '#635d56']]);
      wctx.fillRect(0, TS - 18, TS, 18);
      // Warm Glowing Window
      rrect(wctx, 24, 20, 48, 42, 8);
      wctx.fillStyle = '#472c18'; wctx.fill();
      rrect(wctx, 29, 25, 38, 32, 5);
      wctx.fillStyle = radGrad(wctx, 46, 36, 3, 48, 42, 26, [[0, '#fff9d6'], [0.55, '#fcd368'], [1, '#d98c2b']]);
      wctx.fill();
      wctx.strokeStyle = '#472c18'; wctx.lineWidth = 4;
      wctx.beginPath(); wctx.moveTo(48, 24); wctx.lineTo(48, 58); wctx.moveTo(28, 41); wctx.lineTo(68, 41); wctx.stroke();
      rrect(wctx, 20, 61, 56, 8, 3); wctx.fillStyle = '#754c29'; wctx.fill();
      sprites.tiles.houseWall = wall;

      const door = makeCanvas(TS, TS);
      const dctx = door.getContext('2d');
      dctx.fillStyle = '#ebe0ca'; dctx.fillRect(0, 0, TS, TS);
      dctx.fillStyle = 'rgba(40,26,16,0.2)'; dctx.fillRect(0, 0, TS, 11);
      dctx.fillStyle = '#756e66'; dctx.fillRect(0, TS - 18, TS, 18);
      // Arched Oak Door
      dctx.beginPath();
      dctx.moveTo(20, TS); dctx.lineTo(20, 38);
      dctx.arc(48, 38, 28, Math.PI, 0);
      dctx.lineTo(76, TS); dctx.closePath();
      dctx.fillStyle = '#3d2412'; dctx.fill();
      dctx.beginPath();
      dctx.moveTo(25, TS); dctx.lineTo(25, 40);
      dctx.arc(48, 40, 23, Math.PI, 0);
      dctx.lineTo(71, TS); dctx.closePath();
      dctx.fillStyle = linGrad(dctx, 25, 20, 71, TS, [[0, '#9c6636'], [1, '#6b421f']]); dctx.fill();
      dctx.strokeStyle = '#4a2b13'; dctx.lineWidth = 2.5;
      dctx.beginPath(); dctx.moveTo(48, 18); dctx.lineTo(48, TS); dctx.stroke();
      dctx.fillStyle = '#fbbf24'; dctx.beginPath(); dctx.arc(62, 56, 4.5, 0, Math.PI * 2); dctx.fill();
      sprites.tiles.houseDoor = door;
    }

    // Ancient Ruins Slate Floor, Luminous Arcane Rune, Carved Stone Wall
    {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#2c303b'; ctx.fillRect(0, 0, TS, TS);
      [[3, 3, 43, 43, '#464b59'], [50, 3, 43, 43, '#3f4452'], [3, 50, 43, 43, '#414654'], [50, 50, 43, 43, '#4a4f5e']]
        .forEach(([x, y, w, h, col]) => {
          rrect(ctx, x, y, w, h, 5);
          ctx.fillStyle = linGrad(ctx, x, y, x, y + h, [[0, '#5a6072'], [0.2, col], [1, '#343844']]);
          ctx.fill();
        });
      sprites.tiles.ruinFloor = c;

      const r = makeCanvas(TS, TS);
      const rctx = r.getContext('2d');
      rctx.drawImage(c, 0, 0);
      rctx.fillStyle = radGrad(rctx, 48, 48, 4, 48, 48, 36, [[0, 'rgba(56,189,248,0.48)'], [1, 'rgba(56,189,248,0)']]);
      rctx.fillRect(0, 0, TS, TS);
      rctx.strokeStyle = '#7dd3fc'; rctx.lineWidth = 3;
      rctx.beginPath(); rctx.arc(48, 48, 24, 0, Math.PI * 2); rctx.stroke();
      rctx.beginPath();
      rctx.moveTo(48, 24); rctx.lineTo(70, 48); rctx.lineTo(48, 72); rctx.lineTo(26, 48); rctx.closePath();
      rctx.stroke();
      rctx.fillStyle = '#e0f2fe'; rctx.beginPath(); rctx.arc(48, 48, 7, 0, Math.PI * 2); rctx.fill();
      sprites.tiles.ruinRune = r;

      const w = makeCanvas(TS, TS);
      const wctx = w.getContext('2d');
      wctx.fillStyle = '#1d2028'; wctx.fillRect(0, 0, TS, TS);
      rrect(wctx, 4, 4, 88, 38, 6);
      wctx.fillStyle = linGrad(wctx, 0, 4, 0, 42, [[0, '#7c8396'], [0.3, '#5d6375'], [1, '#444957']]); wctx.fill();
      rrect(wctx, 4, 48, 42, 44, 6);
      wctx.fillStyle = linGrad(wctx, 0, 48, 0, 92, [[0, '#696f82'], [1, '#3d414f']]); wctx.fill();
      rrect(wctx, 50, 48, 42, 44, 6);
      wctx.fillStyle = linGrad(wctx, 0, 48, 0, 92, [[0, '#696f82'], [1, '#3d414f']]); wctx.fill();
      sprites.tiles.wall = w;
    }

    // Crimson Obsidian Boss Altar
    {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#1b1117'; ctx.fillRect(0, 0, TS, TS);
      rrect(ctx, 4, 4, 88, 88, 8);
      ctx.fillStyle = linGrad(ctx, 0, 4, 0, 92, [[0, '#3e2531'], [0.5, '#2d1a23'], [1, '#211319']]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(244,63,94,0.22)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = radGrad(ctx, 48, 48, 1, 48, 48, 14, [[0, 'rgba(244,63,94,0.45)'], [1, 'rgba(244,63,94,0)']]);
      ctx.beginPath(); ctx.arc(48, 48, 14, 0, Math.PI * 2); ctx.fill();
      sprites.tiles.altarFloor = c;

      const w = makeCanvas(TS, TS);
      const wctx = w.getContext('2d');
      wctx.fillStyle = '#12080d'; wctx.fillRect(0, 0, TS, TS);
      rrect(wctx, 4, 4, 88, 40, 6);
      wctx.fillStyle = linGrad(wctx, 0, 4, 0, 44, [[0, '#88273e'], [0.22, '#4d1f2d'], [1, '#2b121a']]); wctx.fill();
      rrect(wctx, 4, 50, 42, 42, 6); wctx.fillStyle = '#361722'; wctx.fill();
      rrect(wctx, 50, 50, 42, 42, 6); wctx.fillStyle = '#361722'; wctx.fill();
      sprites.tiles.altarWall = w;
    }

    // Glowing Crystal Healing Fountain (96x96)
    const makeFountain = (f) => {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0.32)';
      ctx.beginPath(); ctx.ellipse(48, 80, 40, 14, 0, 0, Math.PI * 2); ctx.fill();
      // Stone outer basin
      ctx.fillStyle = linGrad(ctx, 0, 24, 0, 82, [[0, '#cbd5e1'], [0.5, '#94a3b8'], [1, '#475569']]);
      ctx.beginPath(); ctx.ellipse(48, 56, 38, 24, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.5; ctx.stroke();
      // Luminous healing water pool
      ctx.fillStyle = radGrad(ctx, 48, 52, 4, 48, 54, 32, [[0, f ? '#bae6fd' : '#7dd3fc'], [0.6, '#38bdf8'], [1, '#0284c7']]);
      ctx.beginPath(); ctx.ellipse(48, 54, 31, 17, 0, 0, Math.PI * 2); ctx.fill();
      // Center crystal spire
      ctx.beginPath();
      ctx.moveTo(48, 8); ctx.lineTo(58, 36); ctx.lineTo(54, 54); ctx.lineTo(42, 54); ctx.lineTo(38, 36); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 38, 8, 58, 54, [[0, '#ffffff'], [0.45, '#bae6fd'], [1, '#38bdf8']]);
      ctx.fill();
      ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 1.5; ctx.stroke();
      // Water arcs
      ctx.strokeStyle = 'rgba(224,247,255,0.85)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      const arcR = f ? 20 : 17;
      ctx.beginPath(); ctx.moveTo(48, 22); ctx.quadraticCurveTo(48 - arcR, 26, 48 - arcR, 52); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(48, 22); ctx.quadraticCurveTo(48 + arcR, 26, 48 + arcR, 52); ctx.stroke();
      return c;
    };
    sprites.tiles.fountain0 = makeFountain(0);
    sprites.tiles.fountain1 = makeFountain(1);

    // Ornate Gilded Treasure Chest (96x96)
    const makeChest = (open) => {
      const c = makeCanvas(TS, TS);
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0.34)';
      ctx.beginPath(); ctx.ellipse(48, 80, 34, 11, 0, 0, Math.PI * 2); ctx.fill();
      rrect(ctx, 14, open ? 20 : 28, 68, open ? 56 : 48, 10);
      ctx.fillStyle = linGrad(ctx, 0, 22, 0, 76, [[0, '#b86d2e'], [0.5, '#8c4e1c'], [1, '#542d0e']]);
      ctx.fill();
      ctx.strokeStyle = '#381d08'; ctx.lineWidth = 3; ctx.stroke();
      if (open) {
        rrect(ctx, 20, 38, 56, 18, 4);
        ctx.fillStyle = radGrad(ctx, 48, 46, 2, 48, 46, 30, [[0, '#fef08a'], [0.6, '#f59e0b'], [1, '#1e1007']]);
        ctx.fill();
      }
      // Gold straps & clasp
      ctx.fillStyle = linGrad(ctx, 0, 24, 0, 76, [[0, '#fde68a'], [0.5, '#eab308'], [1, '#a16207']]);
      ctx.fillRect(22, open ? 20 : 28, 9, open ? 56 : 48);
      ctx.fillRect(65, open ? 20 : 28, 9, open ? 56 : 48);
      rrect(ctx, 40, 44, 16, 16, 4); ctx.fill();
      ctx.strokeStyle = '#713f12'; ctx.lineWidth = 2; ctx.stroke();
      return c;
    };
    sprites.tiles.chestClosed = makeChest(false);
    sprites.tiles.chestOpen = makeChest(true);

    // Coastal Golden Sand & Palm Tree (for Blue Mist Coast)
    {
      const s = makeCanvas(TS, TS);
      const ctx = s.getContext('2d');
      ctx.fillStyle = '#e5cf9c';
      ctx.fillRect(0, 0, TS, TS);
      [[26, 26, 20, 10, 'rgba(255,248,224,0.34)'], [68, 66, 22, 11, 'rgba(189,154,96,0.22)']].forEach(([x, y, rx, ry, col]) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = '#fda4af'; ctx.beginPath(); ctx.arc(72, 26, 4.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.arc(28, 72, 3.5, 0, Math.PI * 2); ctx.fill();
      sprites.tiles.sand = s;

      const p = makeCanvas(TS, TS);
      const pctx = p.getContext('2d');
      pctx.fillStyle = 'rgba(0,0,0,0.24)';
      pctx.beginPath(); pctx.ellipse(48, 84, 30, 10, 0, 0, Math.PI * 2); pctx.fill();
      pctx.strokeStyle = '#7c4d25'; pctx.lineWidth = 12; pctx.lineCap = 'round';
      pctx.beginPath(); pctx.moveTo(46, 84); pctx.quadraticCurveTo(54, 58, 48, 34); pctx.stroke();
      pctx.strokeStyle = '#9c6634'; pctx.lineWidth = 6;
      pctx.beginPath(); pctx.moveTo(45, 80); pctx.quadraticCurveTo(52, 58, 47, 36); pctx.stroke();
      const fronds = [-2.5, -1.6, -0.7, 0.2, 1.0, 2.2];
      fronds.forEach((ang) => {
        pctx.save(); pctx.translate(48, 34); pctx.rotate(ang);
        pctx.beginPath(); pctx.moveTo(0, 0); pctx.quadraticCurveTo(18, -14, 34, 4); pctx.quadraticCurveTo(16, 4, 0, 0); pctx.closePath();
        pctx.fillStyle = linGrad(pctx, 0, -10, 34, 6, [[0, '#4ade80'], [1, '#15803d']]); pctx.fill();
        pctx.strokeStyle = '#14532d'; pctx.lineWidth = 1.4; pctx.stroke();
        pctx.restore();
      });
      sprites.tiles.palm = p;
    }

    // Crimson Canyon Sandstone, Cliff Wall & Glowing Magma (for Red Wind Canyon)
    {
      const r = makeCanvas(TS, TS);
      const ctx = r.getContext('2d');
      ctx.fillStyle = '#9e5a3c';
      ctx.fillRect(0, 0, TS, TS);
      [[28, 30, 22, 11, 'rgba(224,142,99,0.22)'], [68, 66, 20, 11, 'rgba(92,41,22,0.24)']].forEach(([x, y, rx, ry, col]) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.15, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = 'rgba(72,28,16,0.28)'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(18, 60); ctx.lineTo(34, 56); ctx.lineTo(42, 64); ctx.stroke();
      sprites.tiles.redRock = r;

      const cw = makeCanvas(TS, TS);
      const wctx = cw.getContext('2d');
      wctx.fillStyle = '#471f14'; wctx.fillRect(0, 0, TS, TS);
      rrect(wctx, 4, 4, 88, 42, 7);
      wctx.fillStyle = linGrad(wctx, 0, 4, 0, 46, [[0, '#c26d47'], [0.4, '#8c4428'], [1, '#5c2817']]); wctx.fill();
      rrect(wctx, 4, 50, 42, 42, 6); wctx.fillStyle = '#6e321e'; wctx.fill();
      rrect(wctx, 50, 50, 42, 42, 6); wctx.fillStyle = '#632c1a'; wctx.fill();
      sprites.tiles.canyonWall = cw;

      const lv = makeCanvas(TS, TS);
      const lctx = lv.getContext('2d');
      lctx.fillStyle = linGrad(lctx, 0, 0, TS, TS, [[0, '#b91c1c'], [0.5, '#ea580c'], [1, '#991b1b']]);
      lctx.fillRect(0, 0, TS, TS);
      lctx.fillStyle = radGrad(lctx, 34, 38, 4, 34, 38, 28, [[0, '#fef08a'], [0.55, '#fb923c'], [1, 'rgba(234,88,12,0)']]);
      lctx.beginPath(); lctx.arc(34, 38, 28, 0, Math.PI * 2); lctx.fill();
      lctx.fillStyle = radGrad(lctx, 70, 70, 3, 70, 70, 22, [[0, '#fde047'], [0.55, '#f97316'], [1, 'rgba(234,88,12,0)']]);
      lctx.beginPath(); lctx.arc(70, 70, 22, 0, Math.PI * 2); lctx.fill();
      sprites.tiles.lava = lv;
    }

    // Obsidian Fortress Floor & Gothic Citadel Wall (for Silent Obsidian Citadel)
    {
      const bf = makeCanvas(TS, TS);
      const ctx = bf.getContext('2d');
      ctx.fillStyle = '#1d1f2e'; ctx.fillRect(0, 0, TS, TS);
      rrect(ctx, 3, 3, 43, 43, 5); ctx.fillStyle = '#2a2e42'; ctx.fill();
      rrect(ctx, 50, 3, 43, 43, 5); ctx.fillStyle = '#262a3d'; ctx.fill();
      rrect(ctx, 3, 50, 43, 43, 5); ctx.fillStyle = '#262a3d'; ctx.fill();
      rrect(ctx, 50, 50, 43, 43, 5); ctx.fillStyle = '#2e334a'; ctx.fill();
      ctx.strokeStyle = 'rgba(139,92,246,0.22)'; ctx.lineWidth = 1.5;
      ctx.strokeRect(4, 4, 88, 88);
      sprites.tiles.citadelFloor = bf;

      const bw = makeCanvas(TS, TS);
      const wctx = bw.getContext('2d');
      wctx.fillStyle = '#0e0f18'; wctx.fillRect(0, 0, TS, TS);
      rrect(wctx, 4, 4, 88, 40, 6);
      wctx.fillStyle = linGrad(wctx, 0, 4, 0, 44, [[0, '#5b21b6'], [0.22, '#2d2945'], [1, '#181829']]); wctx.fill();
      rrect(wctx, 4, 50, 42, 42, 6); wctx.fillStyle = '#202136'; wctx.fill();
      rrect(wctx, 50, 50, 42, 42, 6); wctx.fillStyle = '#1c1d30'; wctx.fill();
      sprites.tiles.citadelWall = bw;
    }

    // Alpine Snow & Crystal Glacier Wall (Continent 4)
    {
      const sn = makeCanvas(TS, TS);
      const ctx = sn.getContext('2d');
      ctx.fillStyle = '#dbeafe'; ctx.fillRect(0, 0, TS, TS);
      [[26, 30, 22, 12, 'rgba(255,255,255,0.65)'], [68, 66, 20, 12, 'rgba(147,197,253,0.32)'], [64, 24, 15, 9, 'rgba(255,255,255,0.55)']]
        .forEach(([x, y, rx, ry, col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2); ctx.fill(); });
      [[24, 58], [72, 34], [48, 76]].forEach(([sx, sy]) => {
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, Math.PI * 2); ctx.fill();
      });
      sprites.tiles.snow = sn;

      const iw = makeCanvas(TS, TS);
      const wctx = iw.getContext('2d');
      wctx.fillStyle = '#1e3a8a'; wctx.fillRect(0, 0, TS, TS);
      rrect(wctx, 4, 4, 88, 42, 8);
      wctx.fillStyle = linGrad(wctx, 0, 4, 0, 46, [[0, '#e0f2fe'], [0.4, '#60a5fa'], [1, '#1d4ed8']]); wctx.fill();
      rrect(wctx, 4, 50, 42, 42, 7); wctx.fillStyle = linGrad(wctx, 4, 50, 46, 92, [[0, '#93c5fd'], [1, '#1e40af']]); wctx.fill();
      rrect(wctx, 50, 50, 42, 42, 7); wctx.fillStyle = linGrad(wctx, 50, 50, 92, 92, [[0, '#bae6fd'], [1, '#1d4ed8']]); wctx.fill();
      wctx.strokeStyle = 'rgba(255,255,255,0.6)'; wctx.lineWidth = 1.6;
      wctx.beginPath(); wctx.moveTo(14, 12); wctx.lineTo(38, 12); wctx.stroke();
      sprites.tiles.iceWall = iw;
    }

    // Celestial Floating Marble & Starry Sky Abyss (Continent 6)
    {
      const sf = makeCanvas(TS, TS);
      const ctx = sf.getContext('2d');
      ctx.fillStyle = '#e6eef8'; ctx.fillRect(0, 0, TS, TS);
      rrect(ctx, 3, 3, 43, 43, 6); ctx.fillStyle = linGrad(ctx, 3, 3, 46, 46, [[0, '#ffffff'], [1, '#d7e3f4']]); ctx.fill();
      rrect(ctx, 50, 3, 43, 43, 6); ctx.fillStyle = linGrad(ctx, 50, 3, 93, 46, [[0, '#f8fbff'], [1, '#cedcf0']]); ctx.fill();
      rrect(ctx, 3, 50, 43, 43, 6); ctx.fillStyle = linGrad(ctx, 3, 50, 46, 93, [[0, '#f8fbff'], [1, '#cedcf0']]); ctx.fill();
      rrect(ctx, 50, 50, 43, 43, 6); ctx.fillStyle = linGrad(ctx, 50, 50, 93, 93, [[0, '#ffffff'], [1, '#d7e3f4']]); ctx.fill();
      ctx.strokeStyle = 'rgba(234,179,8,0.42)'; ctx.lineWidth = 1.6;
      ctx.strokeRect(4, 4, 88, 88);
      sprites.tiles.skyFloor = sf;

      const sv = makeCanvas(TS, TS);
      const vctx = sv.getContext('2d');
      vctx.fillStyle = linGrad(vctx, 0, 0, 0, TS, [[0, '#0f2854'], [0.55, '#1d4f8a'], [1, '#3b82c4']]);
      vctx.fillRect(0, 0, TS, TS);
      vctx.fillStyle = 'rgba(255,255,255,0.22)';
      vctx.beginPath(); vctx.ellipse(32, 62, 24, 11, 0, 0, Math.PI * 2); vctx.ellipse(66, 54, 22, 10, 0, 0, Math.PI * 2); vctx.fill();
      [[20, 22], [74, 28], [48, 16]].forEach(([x, y]) => {
        vctx.fillStyle = '#fef08a'; vctx.beginPath(); vctx.arc(x, y, 1.8, 0, Math.PI * 2); vctx.fill();
      });
      sprites.tiles.skyVoid = sv;
    }

    // Cursed Witchwood Swamp & Glowing Mushroom Tree (Continent 7)
    {
      const sw = makeCanvas(TS, TS);
      const ctx = sw.getContext('2d');
      ctx.fillStyle = '#243c35'; ctx.fillRect(0, 0, TS, TS);
      [[30, 32, 22, 12, 'rgba(52,211,153,0.14)'], [66, 68, 22, 13, 'rgba(15,23,42,0.34)']]
        .forEach(([x, y, rx, ry, col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.2, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = 'rgba(167,139,250,0.45)';
      ctx.beginPath(); ctx.arc(28, 66, 3.2, 0, Math.PI * 2); ctx.arc(70, 28, 2.5, 0, Math.PI * 2); ctx.fill();
      sprites.tiles.swamp = sw;

      const st = makeCanvas(TS, TS);
      const tctx = st.getContext('2d');
      tctx.fillStyle = 'rgba(0,0,0,0.32)';
      tctx.beginPath(); tctx.ellipse(48, 84, 34, 11, 0, 0, Math.PI * 2); tctx.fill();
      rrect(tctx, 40, 56, 16, 30, 5);
      tctx.fillStyle = linGrad(tctx, 40, 56, 56, 86, [[0, '#312e45'], [0.5, '#4b4464'], [1, '#1e1b2e']]); tctx.fill();
      tctx.beginPath(); tctx.arc(48, 42, 34, Math.PI, Math.PI * 2); tctx.quadraticCurveTo(48, 56, 14, 42); tctx.closePath();
      tctx.fillStyle = linGrad(tctx, 18, 12, 78, 56, [[0, '#34d399'], [0.45, '#115e59'], [1, '#1e1b4b']]); tctx.fill();
      tctx.strokeStyle = '#0f172a'; tctx.lineWidth = 2; tctx.stroke();
      [[34, 30, 5], [58, 26, 4], [48, 40, 3.5]].forEach(([mx, my, mr]) => {
        tctx.fillStyle = '#a7f3d0'; tctx.beginPath(); tctx.arc(mx, my, mr, 0, Math.PI * 2); tctx.fill();
      });
      sprites.tiles.swampTree = st;
    }

    // Cosmic Rift Floor & Dimensional Pillar Wall (Continents 9 & 10)
    {
      const vf = makeCanvas(TS, TS);
      const ctx = vf.getContext('2d');
      ctx.fillStyle = '#14122b'; ctx.fillRect(0, 0, TS, TS);
      rrect(ctx, 4, 4, 88, 88, 8);
      ctx.fillStyle = linGrad(ctx, 4, 4, 92, 92, [[0, '#221d47'], [0.5, '#1a1638'], [1, '#110e26']]); ctx.fill();
      ctx.strokeStyle = 'rgba(56,189,248,0.28)'; ctx.lineWidth = 1.6; ctx.stroke();
      [[24, 24], [72, 30], [44, 68], [76, 74]].forEach(([x, y]) => {
        ctx.fillStyle = 'rgba(253,224,71,0.55)'; ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
      });
      sprites.tiles.voidFloor = vf;

      const vw = makeCanvas(TS, TS);
      const wctx = vw.getContext('2d');
      wctx.fillStyle = '#080614'; wctx.fillRect(0, 0, TS, TS);
      rrect(wctx, 6, 6, 84, 84, 10);
      wctx.fillStyle = linGrad(wctx, 6, 6, 90, 90, [[0, '#38bdf8'], [0.22, '#312e81'], [0.78, '#1e1b4b'], [1, '#09071a']]);
      wctx.fill();
      wctx.strokeStyle = '#fde047'; wctx.lineWidth = 2; wctx.stroke();
      wctx.fillStyle = '#7dd3fc';
      wctx.beginPath(); wctx.moveTo(48, 22); wctx.lineTo(64, 48); wctx.lineTo(48, 74); wctx.lineTo(32, 48); wctx.closePath(); wctx.fill();
      sprites.tiles.voidWall = vw;
    }

    // =========================================================
    // 2. EPIC SLEEK ANIME-FANTASY HD HEROES (160x160 + PORTRAITS)
    // =========================================================
    function drawStylizedEye(ctx, x, y, w, h, irisTop, irisBot, side, fierce) {
      // Eye white
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(x, y, w, h * 0.92, 0, 0, Math.PI * 2); ctx.fill();
      // Rich luminous iris
      ctx.fillStyle = linGrad(ctx, x, y - h, x, y + h, [[0, irisTop], [0.55, irisBot], [1, '#090d16']]);
      ctx.beginPath(); ctx.ellipse(x, y + 0.5, w * 0.72, h * 0.84, 0, 0, Math.PI * 2); ctx.fill();
      // Crisp dark pupil
      ctx.fillStyle = '#070a12';
      ctx.beginPath(); ctx.ellipse(x, y + 0.8, w * 0.34, h * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      // Bright lower iris bounce light
      ctx.fillStyle = irisTop;
      ctx.globalAlpha = 0.65;
      ctx.beginPath(); ctx.ellipse(x, y + h * 0.42, w * 0.42, h * 0.18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      // Dual anime specular sparkles
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x - w * 0.28, y - h * 0.28, w * 0.26, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + w * 0.25, y + h * 0.28, w * 0.13, 0, Math.PI * 2); ctx.fill();
      // Sleek upper lash
      ctx.strokeStyle = '#111018';
      ctx.lineWidth = fierce ? 2.8 : 2.3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - w - 1, y - h * (fierce && side < 0 ? 0.55 : 0.3));
      ctx.quadraticCurveTo(x, y - h * 1.15, x + w + 1, y - h * (fierce && side > 0 ? 0.55 : 0.3));
      ctx.stroke();
      // Determined angled eyebrow
      ctx.strokeStyle = '#1a151c';
      ctx.lineWidth = fierce ? 2.2 : 1.7;
      ctx.beginPath();
      ctx.moveTo(x - w * 0.9, y - h * (fierce ? (side < 0 ? 1.55 : 1.1) : 1.35));
      ctx.lineTo(x + w * 0.9, y - h * (fierce ? (side < 0 ? 1.1 : 1.55) : 1.35));
      ctx.stroke();
    }

    function makeHeroHD(classId, walkFrame) {
      const S = 160;
      const c = makeCanvas(S, S);
      const ctx = c.getContext('2d');
      const bob = walkFrame ? -3 : 0;
      const sway = walkFrame ? 6 : 0;

      // Dramatic heroic ground aura glow
      const auraCol = classId === 'knight' ? 'rgba(251,191,36,0.18)'
        : (classId === 'rogue' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.24)');
      ctx.fillStyle = radGrad(ctx, 80, 92, 8, 80, 92, 66, [[0, auraCol], [1, 'rgba(0,0,0,0)']]);
      ctx.beginPath(); ctx.arc(80, 92, 66, 0, Math.PI * 2); ctx.fill();

      // --- 1. BILLOWING ASYMMETRIC HERO CAPE / SCARF (behind everything) ---
      ctx.save();
      if (classId === 'knight') {
        // Sweeping royal crimson knight cape billowing dramatically left
        ctx.beginPath();
        ctx.moveTo(54, 68 + bob);
        ctx.bezierCurveTo(26 - sway, 92 + bob, 14 - sway, 124 + bob, 26 - sway, 142 + bob);
        ctx.quadraticCurveTo(64, 148 + bob, 114 + sway * 0.4, 138 + bob);
        ctx.bezierCurveTo(122 + sway * 0.4, 116 + bob, 114, 90 + bob, 106, 68 + bob);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 24, 68, 112, 146, [[0, '#ef4444'], [0.55, '#991b1b'], [1, '#450a0a']]);
        ctx.fill();
        ctx.strokeStyle = '#1f080a'; ctx.lineWidth = 2.4; ctx.stroke();
        // Gold cape filigree hem
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(28 - sway, 138 + bob); ctx.quadraticCurveTo(66, 144 + bob, 112 + sway * 0.4, 134 + bob); ctx.stroke();
      } else if (classId === 'rogue') {
        // Dramatic windswept assassin scarf tails streaming left!
        ctx.beginPath();
        ctx.moveTo(64, 66 + bob);
        ctx.bezierCurveTo(36 - sway, 66 + bob, 14 - sway, 84 + bob, 10 - sway, 106 + bob);
        ctx.lineTo(28 - sway, 98 + bob);
        ctx.lineTo(22 - sway, 122 + bob);
        ctx.bezierCurveTo(44, 110 + bob, 60, 88 + bob, 72, 74 + bob);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 10, 66, 72, 122, [[0, '#10b981'], [0.45, '#0f4c45'], [1, '#051f20']]);
        ctx.fill();
        ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.8; ctx.stroke();
        // Sleek dark coat tails behind legs
        ctx.beginPath();
        ctx.moveTo(56, 86 + bob); ctx.lineTo(44 - sway * 0.4, 142 + bob); ctx.lineTo(74, 134 + bob);
        ctx.lineTo(86, 134 + bob); ctx.lineTo(116 + sway * 0.4, 142 + bob); ctx.lineTo(104, 86 + bob); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 44, 86, 116, 142, [[0, '#1e3a38'], [1, '#071214']]);
        ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.2; ctx.stroke();
      } else {
        // Luna's flowing translucent astral cape + LUSH LONG SILVER-VIOLET BACK HAIR (strictly BEHIND armor!)
        ctx.beginPath();
        ctx.moveTo(54, 68 + bob);
        ctx.bezierCurveTo(32 - sway, 98 + bob, 26 - sway, 126 + bob, 36 - sway, 142 + bob);
        ctx.quadraticCurveTo(80, 148 + bob, 124 + sway * 0.5, 142 + bob);
        ctx.bezierCurveTo(132 + sway * 0.4, 122 + bob, 124, 96 + bob, 106, 68 + bob);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 32, 68, 124, 146, [[0, '#4f46e5'], [0.6, '#312e81'], [1, '#1e1b4b']]);
        ctx.fill();
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2; ctx.stroke();

        // Flowing long silver-lavender back hair behind shoulders
        ctx.beginPath();
        ctx.moveTo(50, 36 + bob);
        ctx.bezierCurveTo(36 - sway * 0.5, 68 + bob, 36 - sway * 0.5, 104 + bob, 48 - sway * 0.3, 122 + bob);
        ctx.quadraticCurveTo(80, 128 + bob, 112 + sway * 0.3, 122 + bob);
        ctx.bezierCurveTo(124 + sway * 0.5, 104 + bob, 124 + sway * 0.5, 68 + bob, 110, 36 + bob);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 42, 36, 118, 126, [[0, '#ede9fe'], [0.45, '#c4b5fd'], [1, '#6d28d9']]);
        ctx.fill();
        ctx.strokeStyle = '#1e1b4b'; ctx.lineWidth = 2.4; ctx.stroke();
      }
      ctx.restore();

      // --- 2. TALLER ARMORED LEGS & GREAVES ---
      const lFootY = walkFrame ? 131 : 135;
      const rFootY = walkFrame ? 138 : 135;
      const drawGreave = (bx, by) => {
        // Thigh + armored greave
        rrect(ctx, bx - 9.5, by - 22, 19, 32, 7);
        ctx.fillStyle = linGrad(ctx, bx - 10, by - 22, bx + 10, by + 10,
          classId === 'knight' ? [[0, '#e2e8f0'], [0.5, '#64748b'], [1, '#1e293b']]
          : classId === 'rogue' ? [[0, '#334155'], [0.55, '#1e293b'], [1, '#090d16']]
          : [[0, '#f8fafc'], [0.45, '#6366f1'], [1, '#1e1b4b']]);
        ctx.fill();
        ctx.strokeStyle = '#0f121a'; ctx.lineWidth = 2.3; ctx.stroke();
        // Metallic knee crest
        ctx.fillStyle = classId === 'rogue' ? '#34d399' : '#fbbf24';
        ctx.beginPath(); ctx.moveTo(bx, by - 14); ctx.lineTo(bx + 5, by - 9); ctx.lineTo(bx, by - 4); ctx.lineTo(bx - 5, by - 9); ctx.closePath(); ctx.fill();
      };
      drawGreave(66, lFootY);
      drawGreave(94, rFootY);

      // --- 3. SCULPTED HERO TORSO ARMOR, WAIST & PAULDRONS ---
      ctx.save();
      // Tapered athletic torso silhouette
      ctx.beginPath();
      ctx.moveTo(52, 68 + bob);
      ctx.lineTo(108, 68 + bob);
      ctx.lineTo(99, 118 + bob);
      ctx.lineTo(61, 118 + bob);
      ctx.closePath();
      if (classId === 'knight') {
        ctx.fillStyle = linGrad(ctx, 52, 68, 108, 118, [[0, '#ffffff'], [0.4, '#cbd5e1'], [0.75, '#64748b'], [1, '#334155']]);
      } else if (classId === 'rogue') {
        ctx.fillStyle = linGrad(ctx, 52, 68, 108, 118, [[0, '#2a544e'], [0.5, '#152c2b'], [1, '#091416']]);
      } else {
        ctx.fillStyle = linGrad(ctx, 52, 68, 108, 118, [[0, '#6366f1'], [0.45, '#3730a3'], [1, '#1e1b4b']]);
      }
      ctx.fill();
      ctx.strokeStyle = '#0f121a'; ctx.lineWidth = 2.6; ctx.stroke();

      // Class Chestplate / Royal Tabard / Battle Bodice
      if (classId === 'knight') {
        // Golden V-breastplate highlight
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(56, 72 + bob); ctx.lineTo(80, 92 + bob); ctx.lineTo(104, 72 + bob); ctx.stroke();
        // Crimson royal tabard hanging below belt
        rrect(ctx, 71, 74 + bob, 18, 49, 4);
        ctx.fillStyle = linGrad(ctx, 71, 74, 89, 123, [[0, '#ef4444'], [1, '#991b1b']]); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.8; ctx.stroke();
        // Radiant Paladin Cross Emblem
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(78, 80 + bob, 4, 15); ctx.fillRect(74, 85 + bob, 12, 4);
      } else if (classId === 'rogue') {
        // Crossed Tactical Assassin Straps + Glowing Jade Core Clasp
        ctx.strokeStyle = '#4a3525'; ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(57, 71 + bob); ctx.lineTo(99, 108 + bob); ctx.stroke();
        ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(57, 71 + bob); ctx.lineTo(99, 108 + bob); ctx.stroke();
        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath(); ctx.arc(80, 88 + bob, 4.2, 0, Math.PI * 2); ctx.fill();
      } else {
        // Luna's Sleek White-Gold Armored Corset & Astral Pleated Battle Skirt!
        ctx.beginPath();
        ctx.moveTo(64, 70 + bob); ctx.lineTo(96, 70 + bob); ctx.lineTo(88, 105 + bob); ctx.lineTo(72, 105 + bob); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 64, 70, 96, 105, [[0, '#ffffff'], [0.6, '#e2e8f0'], [1, '#cbd5e1']]);
        ctx.fill(); ctx.strokeStyle = '#eab308'; ctx.lineWidth = 1.8; ctx.stroke();
        // Glowing Sapphire-Cyan Chest Crystal
        ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 8;
        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath(); ctx.moveTo(80, 76 + bob); ctx.lineTo(86, 85 + bob); ctx.lineTo(80, 94 + bob); ctx.lineTo(74, 85 + bob); ctx.closePath();
        ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5; ctx.stroke();
        // Layered Indigo-Gold Battle Skirt
        ctx.beginPath();
        ctx.moveTo(60, 105 + bob); ctx.lineTo(100, 105 + bob); ctx.lineTo(110, 125 + bob);
        ctx.quadraticCurveTo(80, 130 + bob, 50, 125 + bob); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 50, 105, 110, 128, [[0, '#4f46e5'], [1, '#1e1b4b']]);
        ctx.fill(); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
      }

      // Armored Belt & Gold Buckle
      rrect(ctx, 58, 102 + bob, 44, 9, 4);
      ctx.fillStyle = '#2d1c12'; ctx.fill();
      ctx.strokeStyle = '#0f121a'; ctx.lineWidth = 2; ctx.stroke();
      rrect(ctx, 73, 101 + bob, 14, 11, 3);
      ctx.fillStyle = linGrad(ctx, 73, 101, 87, 112, [[0, '#fef08a'], [1, '#d97706']]); ctx.fill();

      // Sculpted Winged Metallic Pauldrons (Shoulders)
      const drawPauldron = (sx, flip) => {
        ctx.save();
        ctx.translate(sx, 76 + bob);
        ctx.scale(flip, 1);
        ctx.beginPath();
        ctx.moveTo(-20, 4);
        ctx.quadraticCurveTo(-22, -13, -2, -15);
        ctx.quadraticCurveTo(15, -11, 13, 8);
        ctx.quadraticCurveTo(-2, 13, -20, 4);
        ctx.closePath();
        ctx.fillStyle = classId === 'knight'
          ? linGrad(ctx, -20, -14, 14, 10, [[0, '#ffffff'], [0.4, '#cbd5e1'], [1, '#475569']])
          : classId === 'rogue'
          ? linGrad(ctx, -20, -14, 14, 10, [[0, '#34d399'], [0.32, '#1f3a37'], [1, '#091416']])
          : linGrad(ctx, -20, -14, 14, 10, [[0, '#fef08a'], [0.42, '#6366f1'], [1, '#312e81']]);
        ctx.fill();
        ctx.strokeStyle = classId === 'rogue' ? '#10b981' : '#eab308';
        ctx.lineWidth = 2.4; ctx.stroke();
        ctx.restore();
      };
      drawPauldron(49, 1);
      drawPauldron(111, -1);
      ctx.restore();

      // --- 4. SLEEK HEROIC ANIME HEAD, EXPRESSIVE EYES & LAYERED HAIR ---
      ctx.save();
      const hy = 41 + bob;

      // Neck & Rogue High Shadow Collar
      ctx.fillStyle = '#eac096';
      ctx.fillRect(74, hy + 20, 12, 10);
      if (classId === 'rogue') {
        ctx.fillStyle = '#0c2625';
        ctx.beginPath(); ctx.ellipse(80, hy + 26, 25, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.stroke();
      }

      // Slim sculpted anime face contour
      ctx.beginPath();
      ctx.moveTo(57, hy - 5);
      ctx.bezierCurveTo(56, hy + 14, 65, hy + 24, 80, hy + 26);
      ctx.bezierCurveTo(95, hy + 24, 104, hy + 14, 103, hy - 5);
      ctx.quadraticCurveTo(80, hy - 21, 57, hy - 5);
      ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 80, hy - 12, 80, hy + 26, [[0, '#fff1e0'], [0.7, '#fed7aa'], [1, '#eeb07c']]);
      ctx.fill();
      ctx.strokeStyle = '#291c18'; ctx.lineWidth = 2.3; ctx.stroke();

      // Eyes & Expression
      if (classId === 'knight') {
        drawStylizedEye(ctx, 69, hy + 7, 5.6, 6.2, '#38bdf8', '#1d4ed8', -1, true);
        drawStylizedEye(ctx, 91, hy + 7, 5.6, 6.2, '#38bdf8', '#1d4ed8', 1, true);
        ctx.strokeStyle = '#7c4a32'; ctx.lineWidth = 1.9; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(76, hy + 18); ctx.quadraticCurveTo(80, hy + 20, 85, hy + 17.5); ctx.stroke();
      } else if (classId === 'rogue') {
        drawStylizedEye(ctx, 69, hy + 7, 5.8, 5.2, '#6ee7b7', '#059669', -1, true);
        drawStylizedEye(ctx, 91, hy + 7, 5.8, 5.2, '#6ee7b7', '#059669', 1, true);
        // Sleek obsidian stealth lower-face mask
        ctx.beginPath();
        ctx.moveTo(57, hy + 12); ctx.quadraticCurveTo(80, hy + 17, 103, hy + 12);
        ctx.bezierCurveTo(101, hy + 23, 92, hy + 27, 80, hy + 28);
        ctx.bezierCurveTo(68, hy + 27, 59, hy + 23, 57, hy + 12);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 57, hy + 12, 103, hy + 28, [[0, '#1e3a38'], [1, '#081214']]);
        ctx.fill(); ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.6; ctx.stroke();
      } else {
        drawStylizedEye(ctx, 69, hy + 8, 5.9, 6.6, '#f0abfc', '#4f46e5', -1, false);
        drawStylizedEye(ctx, 91, hy + 8, 5.9, 6.6, '#f0abfc', '#4f46e5', 1, false);
        ctx.strokeStyle = '#8b4e4e'; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(77, hy + 19); ctx.quadraticCurveTo(80, hy + 20.5, 83, hy + 19); ctx.stroke();
      }

      // Dynamic Swept Anime Hair + Bangs
      ctx.beginPath();
      if (classId === 'knight') {
        ctx.moveTo(51, hy + 4);
        ctx.lineTo(45, hy - 13); ctx.lineTo(55, hy - 22); ctx.lineTo(59, hy - 34);
        ctx.lineTo(73, hy - 27); ctx.lineTo(84, hy - 38); ctx.lineTo(95, hy - 26);
        ctx.lineTo(109, hy - 31); ctx.lineTo(115, hy - 12); ctx.lineTo(109, hy + 4);
        ctx.lineTo(101, hy - 5); ctx.lineTo(95, hy + 4); ctx.lineTo(89, hy - 7);
        ctx.lineTo(80, hy + 5); ctx.lineTo(72, hy - 7); ctx.lineTo(64, hy + 4); ctx.lineTo(58, hy - 5);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 48, hy - 36, 112, hy + 6, [[0, '#d48b4e'], [0.45, '#8a4f26'], [1, '#47230e']]);
      } else if (classId === 'rogue') {
        ctx.moveTo(49, hy + 7);
        ctx.lineTo(43, hy - 12); ctx.lineTo(56, hy - 28); ctx.lineTo(76, hy - 34);
        ctx.lineTo(98, hy - 32); ctx.lineTo(114, hy - 18); ctx.lineTo(117, hy + 2);
        ctx.lineTo(108, hy + 9); ctx.lineTo(102, hy - 4); ctx.lineTo(94, hy + 7);
        ctx.lineTo(84, hy - 6); ctx.lineTo(71, hy + 9); ctx.lineTo(64, hy - 5); ctx.lineTo(55, hy + 5);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 44, hy - 34, 116, hy + 9, [[0, '#46736e'], [0.45, '#193234'], [1, '#091215']]);
      } else {
        // Luna's sleek silver-lavender bangs + elegant side locks framing jaw
        ctx.moveTo(49, hy + 20);
        ctx.quadraticCurveTo(46, hy - 20, 66, hy - 31);
        ctx.quadraticCurveTo(80, hy - 36, 94, hy - 31);
        ctx.quadraticCurveTo(114, hy - 20, 111, hy + 20);
        ctx.lineTo(104, hy + 26); ctx.lineTo(102, hy - 2); ctx.lineTo(94, hy + 4);
        ctx.lineTo(85, hy - 8); ctx.lineTo(78, hy + 5); ctx.lineTo(70, hy - 7);
        ctx.lineTo(61, hy + 4); ctx.lineTo(58, hy - 2); ctx.lineTo(56, hy + 26);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 48, hy - 34, 112, hy + 24, [[0, '#ffffff'], [0.42, '#ddd6fe'], [1, '#8b5cf6']]);
      }
      ctx.fill();
      ctx.strokeStyle = '#14121d'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.stroke();

      // Anime Hair Gloss Rim Halo
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(80, hy - 14, 19, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();

      // Signature Heroic Headgear / Winged Circlet
      if (classId === 'knight') {
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.6;
        ctx.beginPath(); ctx.arc(80, hy - 5, 24, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        // Winged silver crest sides
        [-1, 1].forEach((dir) => {
          ctx.beginPath();
          ctx.moveTo(80 + dir * 22, hy - 12); ctx.lineTo(80 + dir * 34, hy - 24); ctx.lineTo(80 + dir * 28, hy - 6); ctx.closePath();
          ctx.fillStyle = '#f8fafc'; ctx.fill(); ctx.strokeStyle = '#eab308'; ctx.lineWidth = 1.5; ctx.stroke();
        });
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(80, hy - 26); ctx.lineTo(85, hy - 19); ctx.lineTo(80, hy - 13); ctx.lineTo(75, hy - 19); ctx.closePath();
        ctx.fill(); ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.6; ctx.stroke();
      } else if (classId === 'rogue') {
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.arc(80, hy - 6, 24, Math.PI * 1.18, Math.PI * 1.82); ctx.stroke();
        ctx.fillStyle = '#34d399';
        ctx.beginPath(); ctx.arc(80, hy - 20, 4, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(58, hy - 13); ctx.quadraticCurveTo(80, hy - 25, 102, hy - 13); ctx.stroke();
        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath(); ctx.moveTo(80, hy - 31); ctx.lineTo(85, hy - 20); ctx.lineTo(80, hy - 14); ctx.lineTo(75, hy - 20); ctx.closePath();
        ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.restore();

      // --- 5. EPIC GLOWING HERO WEAPONS & SHIELDS ---
      ctx.save();
      if (classId === 'knight') {
        // Ornate Kite Shield (Left Arm)
        ctx.save();
        ctx.translate(34, 98 + bob);
        ctx.beginPath();
        ctx.moveTo(-14, -18); ctx.lineTo(14, -18); ctx.lineTo(14, 4);
        ctx.quadraticCurveTo(10, 21, 0, 27); ctx.quadraticCurveTo(-10, 21, -14, 4);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, -14, -18, 14, 25, [[0, '#ef4444'], [0.55, '#991b1b'], [1, '#450a0a']]);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.6; ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-2.4, -11, 4.8, 22); ctx.fillRect(-8, -4, 16, 4.8);
        ctx.restore();

        // Radiant Excalibur-Style Holy Greatsword
        ctx.save();
        ctx.translate(128, 92 + bob);
        ctx.rotate(0.16);
        ctx.shadowColor = 'rgba(125, 211, 252, 0.85)';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(0, -80); ctx.lineTo(10, -60); ctx.lineTo(7.5, 4); ctx.lineTo(-7.5, 4); ctx.lineTo(-10, -60); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, -10, -80, 10, 4, [[0, '#ffffff'], [0.46, '#e2e8f0'], [0.54, '#94a3b8'], [1, '#475569']]);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(0, -68); ctx.lineTo(0, -4); ctx.stroke();
        // Winged Golden Crossguard
        ctx.beginPath();
        ctx.moveTo(-19, 1); ctx.lineTo(-9, 10); ctx.lineTo(9, 10); ctx.lineTo(19, 1); ctx.lineTo(8, 0); ctx.lineTo(-8, 0); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, -18, 1, 18, 10, [[0, '#fef08a'], [0.5, '#f59e0b'], [1, '#b45309']]);
        ctx.fill(); ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6; ctx.stroke();
        rrect(ctx, -3.5, 10, 7, 15, 3); ctx.fillStyle = '#5c2b16'; ctx.fill();
        ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(0, 27, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();

      } else if (classId === 'rogue') {
        // Twin Curved Glowing Jade-Edge Assassin Blades!
        const drawDagger = (dx, dy, rot) => {
          ctx.save();
          ctx.translate(dx, dy);
          ctx.rotate(rot);
          ctx.shadowColor = 'rgba(52, 211, 153, 0.9)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(0, -56);
          ctx.quadraticCurveTo(12, -28, 5.5, 4);
          ctx.lineTo(-5.5, 4);
          ctx.quadraticCurveTo(-4, -24, 0, -56);
          ctx.closePath();
          ctx.fillStyle = linGrad(ctx, -5, -56, 10, 4, [[0, '#ecfdf5'], [0.38, '#34d399'], [1, '#0f172a']]);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#064e3b'; ctx.lineWidth = 1.8; ctx.stroke();
          rrect(ctx, -10, 2, 20, 5, 2); ctx.fillStyle = '#f59e0b'; ctx.fill();
          rrect(ctx, -3, 7, 6, 13, 2); ctx.fillStyle = '#1e293b'; ctx.fill();
          ctx.restore();
        };
        drawDagger(28, 94 + bob, -0.48);
        drawDagger(132, 90 + bob, 0.42);

      } else {
        // Radiant Floating Crystal Runeblade + Orbiting Mana Shards!
        ctx.save();
        ctx.translate(129, 90 + bob);
        ctx.rotate(0.18);
        ctx.shadowColor = 'rgba(56, 189, 248, 0.95)';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(0, -82); ctx.lineTo(11, -58); ctx.lineTo(6.5, 4); ctx.lineTo(-6.5, 4); ctx.lineTo(-11, -58); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, -11, -82, 11, 4, [[0, '#ffffff'], [0.35, '#7dd3fc'], [0.7, '#818cf8'], [1, '#4f46e5']]);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 1.8; ctx.stroke();
        // Ornate Golden Crescent Guard
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, 0, 14, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
        rrect(ctx, -3, 8, 6, 14, 2); ctx.fillStyle = '#312e81'; ctx.fill();
        ctx.restore();

        // Orbiting Luminous Crystal Shards
        const drawShard = (cx, cy, r) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.moveTo(0, -r * 1.45); ctx.lineTo(r * 0.82, 0); ctx.lineTo(0, r * 1.45); ctx.lineTo(-r * 0.82, 0); ctx.closePath();
          ctx.fillStyle = linGrad(ctx, 0, -r, 0, r, [[0, '#ffffff'], [0.45, '#38bdf8'], [1, '#9333ea']]);
          ctx.fill();
          ctx.restore();
        };
        drawShard(26, 68 + bob, 9.5);
        drawShard(20, 96 + bob, 6.5);
        drawShard(34, 114 + bob, 5.5);
      }
      ctx.restore();

      return c;
    }

    function makePortraitHD(classId, fullSprite) {
      const P = 144;
      const c = makeCanvas(P, P);
      const ctx = c.getContext('2d');
      const bgStops = classId === 'knight'
        ? [[0, '#591e23'], [0.65, '#1e1929'], [1, '#0e1018']]
        : classId === 'rogue'
        ? [[0, '#10453c'], [0.65, '#111f28'], [1, '#0b1016']]
        : [[0, '#3a2875'], [0.65, '#171a36'], [1, '#0c0e1a']];
      ctx.fillStyle = radGrad(ctx, P / 2, P * 0.36, 8, P / 2, P / 2, P * 0.72, bgStops);
      ctx.fillRect(0, 0, P, P);
      ctx.fillStyle = classId === 'knight' ? 'rgba(251,191,36,0.2)'
        : (classId === 'rogue' ? 'rgba(52,211,153,0.2)' : 'rgba(167,139,250,0.24)');
      ctx.beginPath(); ctx.arc(P / 2, P * 0.4, 50, 0, Math.PI * 2); ctx.fill();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(fullSprite, 12, 0, 136, 136, 0, 2, P, P);
      return c;
    }

    ['knight', 'rogue', 'runeblade'].forEach((id) => {
      const idle = makeHeroHD(id, false);
      const walk = makeHeroHD(id, true);
      const portrait = makePortraitHD(id, idle);
      sprites.heroes[id] = { idle, walk, idleLeft: flipH(idle), walkLeft: flipH(walk), portrait };
    });

    // =========================================================
    // 3. HD ILLUSTRATED NPCs (140x140)
    // =========================================================
    function makeNpcHD(kind) {
      const S = 140;
      const c = makeCanvas(S, S);
      const ctx = c.getContext('2d');
      const cx = 70;

      // Flowing back hair for Aria
      if (kind === 'aria') {
        ctx.beginPath();
        ctx.moveTo(44, 38); ctx.bezierCurveTo(36, 70, 38, 102, 48, 114);
        ctx.lineTo(92, 114); ctx.bezierCurveTo(102, 102, 104, 70, 96, 38); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 40, 38, 100, 114, [[0, '#c2410c'], [1, '#7c2d12']]);
        ctx.fill(); ctx.strokeStyle = '#29150c'; ctx.lineWidth = 2.2; ctx.stroke();
      }

      // Robe / Outfit
      ctx.beginPath();
      ctx.moveTo(46, 66); ctx.lineTo(94, 66); ctx.lineTo(102, 124); ctx.lineTo(38, 124); ctx.closePath();
      ctx.fillStyle = kind === 'elder'
        ? linGrad(ctx, 40, 66, 100, 124, [[0, '#8c5e3a'], [1, '#4a2f1a']])
        : kind === 'shop'
        ? linGrad(ctx, 40, 66, 100, 124, [[0, '#e11d48'], [1, '#881337']])
        : kind === 'aria'
        ? linGrad(ctx, 40, 66, 100, 124, [[0, '#10b981'], [1, '#065f46']])
        : kind === 'kyle'
        ? linGrad(ctx, 40, 66, 100, 124, [[0, '#2563eb'], [1, '#1e3a8a']])
        : linGrad(ctx, 40, 66, 100, 124, [[0, '#57534e'], [1, '#292524']]);
      ctx.fill();
      ctx.strokeStyle = '#181414'; ctx.lineWidth = 2.6; ctx.stroke();

      // Center Apron / Stole / Armor Vest
      rrect(ctx, 56, 68, 28, 54, 6);
      ctx.fillStyle = kind === 'elder' ? '#d9a441'
        : kind === 'shop' ? '#fff7ed'
        : kind === 'aria' ? '#fef3c7'
        : kind === 'kyle' ? '#cbd5e1'
        : '#78350f';
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(cx, 44, 24, 0, Math.PI * 2);
      ctx.fillStyle = linGrad(ctx, cx, 20, cx, 68, [[0, '#ffedd5'], [1, '#f3ba88']]);
      ctx.fill(); ctx.strokeStyle = '#291c18'; ctx.lineWidth = 2.5; ctx.stroke();

      // Hair
      ctx.beginPath();
      ctx.arc(cx, 38, 25, Math.PI * 0.95, Math.PI * 2.05);
      ctx.lineTo(94, 46); ctx.quadraticCurveTo(cx, 34, 46, 46); ctx.closePath();
      ctx.fillStyle = kind === 'elder' ? '#e2e8f0'
        : kind === 'shop' ? '#f59e0b'
        : kind === 'aria' ? '#ea580c'
        : kind === 'kyle' ? '#334155'
        : '#b91c1c';
      ctx.fill(); ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 2.4; ctx.stroke();

      // Eyes
      const eyeHi = kind === 'shop' ? '#fb7185' : (kind === 'aria' ? '#34d399' : (kind === 'kyle' ? '#38bdf8' : '#64748b'));
      drawStylizedEye(ctx, 60, 48, 4.8, 5.2, eyeHi, '#1e293b', -1, kind === 'kyle');
      drawStylizedEye(ctx, 80, 48, 4.8, 5.2, eyeHi, '#1e293b', 1, kind === 'kyle');

      if (kind === 'elder') {
        ctx.beginPath();
        ctx.moveTo(52, 56); ctx.quadraticCurveTo(cx, 88, 88, 56); ctx.quadraticCurveTo(cx, 62, 52, 56); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, cx, 56, cx, 84, [[0, '#f8fafc'], [1, '#cbd5e1']]); ctx.fill();
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(108, 34); ctx.lineTo(108, 122); ctx.stroke();
        ctx.fillStyle = radGrad(ctx, 108, 28, 2, 108, 28, 13, [[0, '#fffbeb'], [0.5, '#fbbf24'], [1, '#b45309']]);
        ctx.beginPath(); ctx.arc(108, 28, 10, 0, Math.PI * 2); ctx.fill();
      } else if (kind === 'shop') {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.ellipse(58, 17, 10, 5, -0.35, 0, Math.PI * 2); ctx.ellipse(82, 17, 10, 5, 0.35, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fda4af'; ctx.beginPath(); ctx.arc(cx, 18, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = radGrad(ctx, 108, 88, 2, 108, 90, 12, [[0, '#fda4af'], [0.6, '#e11d48'], [1, '#881337']]);
        ctx.beginPath(); ctx.arc(108, 90, 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fecdd3'; ctx.lineWidth = 1.8; ctx.stroke();
      } else if (kind === 'aria') {
        // Golden Minstrel Harp
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(102, 66); ctx.quadraticCurveTo(126, 62, 118, 102); ctx.lineTo(100, 98); ctx.closePath(); ctx.stroke();
        ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = 1.3;
        [106, 110, 114].forEach((sx) => { ctx.beginPath(); ctx.moveTo(sx, 68); ctx.lineTo(sx - 2, 98); ctx.stroke(); });
        // Emerald feather beret
        ctx.fillStyle = '#059669'; ctx.beginPath(); ctx.ellipse(cx, 18, 20, 7, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.6; ctx.stroke();
      } else if (kind === 'kyle') {
        // Knight Order Scout Bandana & Short Sword
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, 38, 23, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(110, 44); ctx.lineTo(115, 56); ctx.lineTo(113, 104); ctx.lineTo(107, 104); ctx.lineTo(105, 56); ctx.closePath();
        ctx.fillStyle = '#e2e8f0'; ctx.fill(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6; ctx.stroke();
        rrect(ctx, 101, 102, 18, 5, 2); ctx.fillStyle = '#eab308'; ctx.fill();
      } else {
        ctx.strokeStyle = '#713f12'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(108, 54); ctx.lineTo(108, 118); ctx.stroke();
        rrect(ctx, 92, 40, 32, 18, 5);
        ctx.fillStyle = linGrad(ctx, 92, 40, 124, 58, [[0, '#cbd5e1'], [0.5, '#64748b'], [1, '#1e293b']]);
        ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.stroke();
      }
      return c;
    }

    sprites.npcs.elder = makeNpcHD('elder');
    sprites.npcs.shop  = makeNpcHD('shop');
    sprites.npcs.smith = makeNpcHD('smith');
    sprites.npcs.aria  = makeNpcHD('aria');
    sprites.npcs.kyle  = makeNpcHD('kyle');

    // =========================================================
    // 4. HD ILLUSTRATED MONSTERS & EPIC BOSSES (128px ~ 200px)
    // =========================================================
    const makeSlimeHD = (hi, mid, dark, f) => {
      const S = 128, c = makeCanvas(S, S), ctx = c.getContext('2d');
      const sq = f ? 6 : 0;
      ctx.beginPath();
      ctx.moveTo(22 - sq, 92);
      ctx.bezierCurveTo(18 - sq, 46 + sq, 40, 26 + sq, 64, 26 + sq);
      ctx.bezierCurveTo(88, 26 + sq, 110 + sq, 46 + sq, 106 + sq, 92);
      ctx.quadraticCurveTo(64, 108, 22 - sq, 92);
      ctx.closePath();
      ctx.fillStyle = radGrad(ctx, 50, 48 + sq, 8, 64, 72, 54, [[0, hi], [0.55, mid], [1, dark]]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 25, 18, 0.72)'; ctx.lineWidth = 3.2; ctx.stroke();
      // Glossy specular bubble
      ctx.fillStyle = 'rgba(255,255,255,0.62)';
      ctx.beginPath(); ctx.ellipse(46, 48 + sq, 13, 7, -0.45, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(36, 62 + sq, 4, 0, Math.PI * 2); ctx.fill();
      // Glossy Eyes
      [48, 80].forEach((ex) => {
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.ellipse(ex, 68 + sq * 0.6, 5.5, 7.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(ex - 2, 65 + sq * 0.6, 2.3, 0, Math.PI * 2); ctx.fill();
      });
      return c;
    };
    sprites.monsters.slime_green = [makeSlimeHD('#bbf7d0', '#22c55e', '#14532d', 0), makeSlimeHD('#bbf7d0', '#22c55e', '#14532d', 1)];
    sprites.monsters.slime_blue  = [makeSlimeHD('#bae6fd', '#38bdf8', '#0c4a6e', 0), makeSlimeHD('#bae6fd', '#38bdf8', '#0c4a6e', 1)];

    const makeBoarHD = (f) => {
      const S = 128, c = makeCanvas(S, S), ctx = c.getContext('2d');
      const b = f ? 4 : 0;
      // Muscular fur body
      ctx.beginPath(); ctx.ellipse(64, 68 + b, 44, 30, 0, 0, Math.PI * 2);
      ctx.fillStyle = linGrad(ctx, 24, 38, 104, 98, [[0, '#a1623b'], [0.55, '#6b3e24'], [1, '#3b2012']]);
      ctx.fill(); ctx.strokeStyle = '#1f1008'; ctx.lineWidth = 3; ctx.stroke();
      // Spiky dark mane crest
      ctx.fillStyle = '#3b2012';
      ctx.beginPath(); ctx.moveTo(40, 42 + b); ctx.lineTo(52, 24 + b); ctx.lineTo(64, 36 + b); ctx.lineTo(76, 24 + b); ctx.lineTo(88, 42 + b); ctx.closePath(); ctx.fill();
      // Snout
      ctx.fillStyle = '#e5a493'; ctx.beginPath(); ctx.ellipse(64, 76 + b, 17, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#4a251c'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#3b1812'; ctx.beginPath(); ctx.ellipse(58, 76 + b, 2.8, 4, 0, 0, Math.PI * 2); ctx.ellipse(70, 76 + b, 2.8, 4, 0, 0, Math.PI * 2); ctx.fill();
      // Curved Ivory Tusks
      [-1, 1].forEach((dir) => {
        ctx.beginPath(); ctx.moveTo(64 + dir * 18, 80 + b); ctx.quadraticCurveTo(64 + dir * 32, 74 + b, 64 + dir * 28, 56 + b);
        ctx.quadraticCurveTo(64 + dir * 22, 68 + b, 64 + dir * 14, 72 + b); ctx.closePath();
        ctx.fillStyle = '#fffbeb'; ctx.fill(); ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.8; ctx.stroke();
      });
      // Fierce red-amber eyes
      [46, 82].forEach((ex) => {
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(ex, 58 + b, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(ex - 1, 57 + b, 1.8, 0, Math.PI * 2); ctx.fill();
      });
      return c;
    };
    sprites.monsters.boar = [makeBoarHD(0), makeBoarHD(1)];

    const makeGoblinHD = (shaman, f) => {
      const S = 136, c = makeCanvas(S, S), ctx = c.getContext('2d');
      const b = f ? -4 : 0;
      // Torso armor/cloak
      rrect(ctx, 44, 66 + b, 48, 42, 12);
      ctx.fillStyle = shaman
        ? linGrad(ctx, 44, 66, 92, 108, [[0, '#9f1239'], [1, '#4c0519']])
        : linGrad(ctx, 44, 66, 92, 108, [[0, '#85583a'], [1, '#422818']]);
      ctx.fill(); ctx.strokeStyle = '#181414'; ctx.lineWidth = 2.8; ctx.stroke();
      // Pointed Goblin Ears
      [-1, 1].forEach((dir) => {
        ctx.beginPath(); ctx.moveTo(68 + dir * 20, 40 + b); ctx.lineTo(68 + dir * 44, 30 + b); ctx.lineTo(68 + dir * 22, 52 + b); ctx.closePath();
        ctx.fillStyle = '#4d8b31'; ctx.fill(); ctx.strokeStyle = '#182414'; ctx.lineWidth = 2.2; ctx.stroke();
      });
      // Head
      ctx.beginPath(); ctx.ellipse(68, 46 + b, 24, 21, 0, 0, Math.PI * 2);
      ctx.fillStyle = linGrad(ctx, 68, 25, 68, 67, [[0, '#84cc16'], [0.6, '#4d8b31'], [1, '#2f591c']]);
      ctx.fill(); ctx.strokeStyle = '#182414'; ctx.lineWidth = 2.6; ctx.stroke();
      if (shaman) {
        ctx.beginPath(); ctx.moveTo(40, 40 + b); ctx.quadraticCurveTo(68, 8 + b, 96, 40 + b); ctx.closePath();
        ctx.fillStyle = '#9f1239'; ctx.fill(); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
      }
      // Glowing eyes
      [58, 78].forEach((ex) => {
        ctx.fillStyle = shaman ? '#fde047' : '#ef4444';
        ctx.beginPath(); ctx.ellipse(ex, 46 + b, 5, 3.6, 0, 0, Math.PI * 2); ctx.fill();
      });
      // Weapon
      if (shaman) {
        ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(106, 36 + b); ctx.lineTo(106, 114 + b); ctx.stroke();
        ctx.fillStyle = radGrad(ctx, 106, 28 + b, 2, 106, 28 + b, 14, [[0, '#e0f2fe'], [0.5, '#38bdf8'], [1, '#0284c7']]);
        ctx.beginPath(); ctx.arc(106, 28 + b, 11, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.moveTo(104, 88 + b); ctx.quadraticCurveTo(122, 54 + b, 106, 28 + b); ctx.lineTo(98, 44 + b); ctx.lineTo(98, 88 + b); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 98, 28, 120, 88, [[0, '#f1f5f9'], [1, '#64748b']]); ctx.fill();
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.stroke();
      }
      return c;
    };
    sprites.monsters.goblin = [makeGoblinHD(false, 0), makeGoblinHD(false, 1)];
    sprites.monsters.goblin_shaman = [makeGoblinHD(true, 0), makeGoblinHD(true, 1)];

    const makeSkeletonHD = (f) => {
      const S = 136, c = makeCanvas(S, S), ctx = c.getContext('2d');
      const b = f ? -4 : 0;
      rrect(ctx, 46, 66 + b, 44, 44, 10);
      ctx.fillStyle = linGrad(ctx, 46, 66, 90, 110, [[0, '#475569'], [1, '#1e293b']]);
      ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.6; ctx.stroke();
      // Ribcage stripes
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3.5;
      [76, 84, 92].forEach((ry) => { ctx.beginPath(); ctx.moveTo(54, ry + b); ctx.lineTo(82, ry + b); ctx.stroke(); });
      // Skull
      ctx.beginPath(); ctx.arc(68, 42 + b, 23, 0, Math.PI * 2);
      ctx.fillStyle = linGrad(ctx, 68, 19, 68, 65, [[0, '#f8fafc'], [1, '#cbd5e1']]);
      ctx.fill(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.8; ctx.stroke();
      [58, 78].forEach((ex) => {
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.ellipse(ex, 44 + b, 6, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fb7185'; ctx.beginPath(); ctx.arc(ex, 44 + b, 2.6, 0, Math.PI * 2); ctx.fill();
      });
      // Cursed Broadsword
      ctx.beginPath(); ctx.moveTo(108, 22 + b); ctx.lineTo(116, 36 + b); ctx.lineTo(113, 96 + b); ctx.lineTo(103, 96 + b); ctx.lineTo(100, 36 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 100, 22, 116, 96, [[0, '#e2e8f0'], [1, '#475569']]); ctx.fill();
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.stroke();
      return c;
    };
    sprites.monsters.skeleton = [makeSkeletonHD(0), makeSkeletonHD(1)];

    const makeGolemHD = (f) => {
      const S = 152, c = makeCanvas(S, S), ctx = c.getContext('2d');
      const b = f ? 3 : 0;
      // Massive sculpted stone shoulders & torso
      ctx.beginPath();
      ctx.moveTo(30, 50 + b); ctx.lineTo(122, 50 + b); ctx.lineTo(108, 116 + b); ctx.lineTo(44, 116 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 30, 50, 122, 116, [[0, '#94a3b8'], [0.5, '#64748b'], [1, '#334155']]);
      ctx.fill(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3.5; ctx.stroke();
      // Heavy Floating Fists
      [20, 132].forEach((fx) => {
        rrect(ctx, fx - 14, 68 + b, 28, 42, 10);
        ctx.fillStyle = linGrad(ctx, fx - 14, 68, fx + 14, 110, [[0, '#94a3b8'], [1, '#334155']]);
        ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3; ctx.stroke();
      });
      // Monolith Head
      rrect(ctx, 50, 18 + b, 52, 36, 10);
      ctx.fillStyle = linGrad(ctx, 50, 18, 102, 54, [[0, '#cbd5e1'], [1, '#475569']]);
      ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3; ctx.stroke();
      // Amber Rune Eyes
      ctx.fillStyle = '#fbbf24';
      rrect(ctx, 58, 30 + b, 13, 6, 3); ctx.fill();
      rrect(ctx, 81, 30 + b, 13, 6, 3); ctx.fill();
      // Glowing Turquoise Core
      ctx.shadowColor = '#2dd4bf'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(76, 62 + b); ctx.lineTo(92, 82 + b); ctx.lineTo(76, 102 + b); ctx.lineTo(60, 82 + b); ctx.closePath();
      ctx.fillStyle = radGrad(ctx, 76, 82 + b, 2, 76, 82 + b, 20, [[0, '#ffffff'], [0.4, '#5eead4'], [1, '#0d9488']]);
      ctx.fill(); ctx.shadowBlur = 0;
      return c;
    };
    sprites.monsters.golem = [makeGolemHD(0), makeGolemHD(1)];

    const makeDarkMageHD = (f) => {
      const S = 136, c = makeCanvas(S, S), ctx = c.getContext('2d');
      const b = f ? -4 : 0;
      // Midnight Violet Cultist Robes
      ctx.beginPath(); ctx.moveTo(44, 60 + b); ctx.lineTo(92, 60 + b); ctx.lineTo(106, 122 + b); ctx.lineTo(30, 122 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 40, 60, 96, 122, [[0, '#4c1d95'], [0.6, '#2e1065'], [1, '#0f0720']]);
      ctx.fill(); ctx.strokeStyle = '#090514'; ctx.lineWidth = 2.8; ctx.stroke();
      // Gold Rune Stole
      rrect(ctx, 60, 64 + b, 16, 54, 4); ctx.fillStyle = '#d97706'; ctx.fill();
      // Deep Shadow Hood
      ctx.beginPath(); ctx.moveTo(38, 56 + b); ctx.quadraticCurveTo(68, 4 + b, 98, 56 + b); ctx.quadraticCurveTo(68, 72 + b, 38, 56 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 40, 14, 96, 66, [[0, '#5b21b6'], [1, '#1e0a3c']]);
      ctx.fill(); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#090412'; ctx.beginPath(); ctx.ellipse(68, 46 + b, 17, 13, 0, 0, Math.PI * 2); ctx.fill();
      // Burning Crimson Eyes
      ctx.shadowColor = '#f43f5e'; ctx.shadowBlur = 8;
      ctx.fillStyle = '#fb7185';
      ctx.beginPath(); ctx.arc(60, 46 + b, 4, 0, Math.PI * 2); ctx.arc(76, 46 + b, 4, 0, Math.PI * 2); ctx.fill();
      // Orbiting Crimson Dark Orb
      ctx.fillStyle = radGrad(ctx, 112, 54 + (f ? -6 : 4), 2, 112, 54 + (f ? -6 : 4), 14, [[0, '#fff1f2'], [0.45, '#f43f5e'], [1, '#881337']]);
      ctx.beginPath(); ctx.arc(112, 54 + (f ? -6 : 4), 11, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      return c;
    };
    sprites.monsters.dark_mage = [makeDarkMageHD(0), makeDarkMageHD(1)];

    // Mini Boss: Horned Goblin Warlord Chief (176x176)
    const makeChiefHD = (f) => {
      const S = 176, c = makeCanvas(S, S), ctx = c.getContext('2d');
      const b = f ? -5 : 0;
      // Crimson Warlord Cape
      ctx.beginPath(); ctx.moveTo(44, 72 + b); ctx.lineTo(24, 152 + b); ctx.lineTo(152, 152 + b); ctx.lineTo(132, 72 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 30, 72, 146, 152, [[0, '#dc2626'], [1, '#450a0a']]); ctx.fill();
      // Broad Armored Torso
      rrect(ctx, 48, 74 + b, 80, 64, 16);
      ctx.fillStyle = linGrad(ctx, 48, 74, 128, 138, [[0, '#784e30'], [1, '#362112']]);
      ctx.fill(); ctx.strokeStyle = '#140c08'; ctx.lineWidth = 3.5; ctx.stroke();
      rrect(ctx, 74, 76 + b, 28, 60, 6); ctx.fillStyle = '#eab308'; ctx.fill();
      // Horned War Helm & Face
      [-1, 1].forEach((dir) => {
        ctx.beginPath(); ctx.moveTo(88 + dir * 24, 38 + b); ctx.quadraticCurveTo(88 + dir * 56, 30 + b, 88 + dir * 48, 10 + b);
        ctx.quadraticCurveTo(88 + dir * 38, 22 + b, 88 + dir * 22, 26 + b); ctx.closePath();
        ctx.fillStyle = '#fef3c7'; ctx.fill(); ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2.5; ctx.stroke();
      });
      ctx.beginPath(); ctx.ellipse(88, 52 + b, 30, 26, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#4d8b31'; ctx.fill(); ctx.strokeStyle = '#182414'; ctx.lineWidth = 3; ctx.stroke();
      // Iron Helm Dome
      ctx.beginPath(); ctx.arc(88, 46 + b, 31, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 57, 15, 119, 46, [[0, '#cbd5e1'], [1, '#475569']]); ctx.fill(); ctx.stroke();
      [74, 102].forEach((ex) => { ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(ex, 56 + b, 5, 0, Math.PI * 2); ctx.fill(); });
      // Giant Crescent Battleaxe
      ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(142, 34 + b); ctx.lineTo(142, 142 + b); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(140, 32 + b); ctx.bezierCurveTo(172, 24 + b, 174, 78 + b, 140, 74 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 140, 30, 170, 74, [[0, '#f8fafc'], [0.6, '#94a3b8'], [1, '#334155']]); ctx.fill();
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.5; ctx.stroke();
      return c;
    };
    sprites.monsters.goblin_chief = [makeChiefHD(0), makeChiefHD(1)];

    // FINAL BOSS: Abyssal Knight Vargas (200x200 — Epic Winged Dark Sovereign!)
    const makeVargasHD = (f) => {
      const S = 200, c = makeCanvas(S, S), ctx = c.getContext('2d');
      const b = f ? -5 : 0;

      // Dark Abyssal Aura Halo
      ctx.fillStyle = radGrad(ctx, 100, 100, 14, 100, 100, 94, [[0, 'rgba(225,29,72,0.36)'], [0.58, 'rgba(88,28,135,0.18)'], [1, 'rgba(0,0,0,0)']]);
      ctx.beginPath(); ctx.arc(100, 100, 94, 0, Math.PI * 2); ctx.fill();

      // Sweeping Layered Shadow-Crimson Wings
      [-1, 1].forEach((dir) => {
        ctx.beginPath();
        ctx.moveTo(100 + dir * 22, 74 + b);
        ctx.bezierCurveTo(100 + dir * 72, 26 + b, 100 + dir * 98, 52 + b, 100 + dir * 88, 114 + b);
        ctx.lineTo(100 + dir * 68, 98 + b);
        ctx.lineTo(100 + dir * 60, 132 + b);
        ctx.lineTo(100 + dir * 42, 108 + b);
        ctx.lineTo(100 + dir * 28, 124 + b);
        ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 100, 32, 100 + dir * 92, 132, [[0, '#7f1d1d'], [0.5, '#1e1b4b'], [1, '#09090b']]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(251,113,133,0.72)'; ctx.lineWidth = 2.2; ctx.stroke();
      });

      // Jagged Tattered Crimson War-Mantle
      ctx.beginPath();
      ctx.moveTo(58, 76 + b);
      ctx.bezierCurveTo(38, 116 + b, 32, 150 + b, 38, 174 + b);
      ctx.lineTo(58, 162 + b); ctx.lineTo(76, 178 + b); ctx.lineTo(100, 164 + b);
      ctx.lineTo(124, 178 + b); ctx.lineTo(142, 162 + b); ctx.lineTo(162, 174 + b);
      ctx.bezierCurveTo(168, 150 + b, 162, 116 + b, 142, 76 + b);
      ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 40, 76, 160, 178, [[0, '#be123c'], [0.55, '#881337'], [1, '#260510']]);
      ctx.fill(); ctx.strokeStyle = '#18050b'; ctx.lineWidth = 2.4; ctx.stroke();

      // Armored Obsidian Greaves
      [78, 122].forEach((lx) => {
        rrect(ctx, lx - 12, 140 + b, 24, 34, 6);
        ctx.fillStyle = linGrad(ctx, lx - 12, 140, lx + 12, 174, [[0, '#475569'], [0.5, '#1e293b'], [1, '#090b12']]);
        ctx.fill(); ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 1.8; ctx.stroke();
      });

      // Sculpted Tapered Obsidian Breastplate
      ctx.beginPath();
      ctx.moveTo(54, 74 + b); ctx.lineTo(146, 74 + b); ctx.lineTo(132, 144 + b); ctx.lineTo(100, 154 + b); ctx.lineTo(68, 144 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 54, 74, 146, 154, [[0, '#64748b'], [0.42, '#1e293b'], [1, '#090b12']]);
      ctx.fill(); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.2; ctx.stroke();
      // Ribbed dark gold chest lines
      ctx.strokeStyle = 'rgba(251,191,36,0.55)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(64, 86 + b); ctx.lineTo(100, 102 + b); ctx.lineTo(136, 86 + b); ctx.stroke();

      // Spiked Abyssal Shoulder Pauldrons
      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(100 + dir * 48, 80 + b);
        ctx.scale(dir, 1);
        ctx.beginPath();
        ctx.moveTo(-16, 12); ctx.lineTo(-10, -14); ctx.lineTo(18, -22); ctx.lineTo(28, -4); ctx.lineTo(16, 16); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, -14, -20, 26, 16, [[0, '#94a3b8'], [0.45, '#1e293b'], [1, '#090b12']]);
        ctx.fill(); ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2.4; ctx.stroke();
        ctx.restore();
      });

      // Pulsing Crimson Abyssal Heart Core
      ctx.shadowColor = '#f43f5e'; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.moveTo(100, 92 + b); ctx.lineTo(114, 110 + b); ctx.lineTo(100, 128 + b); ctx.lineTo(86, 110 + b); ctx.closePath();
      ctx.fillStyle = radGrad(ctx, 100, 110 + b, 2, 100, 110 + b, 18, [[0, '#ffffff'], [0.4, f ? '#fda4af' : '#fb7185'], [1, '#be123c']]);
      ctx.fill(); ctx.shadowBlur = 0;

      // Horned Obsidian Sovereign Crown Helm
      [-1, 1].forEach((dir) => {
        ctx.beginPath(); ctx.moveTo(100 + dir * 20, 42 + b); ctx.quadraticCurveTo(100 + dir * 56, 30 + b, 100 + dir * 48, 6 + b);
        ctx.quadraticCurveTo(100 + dir * 36, 22 + b, 100 + dir * 18, 26 + b); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 100, 6, 100 + dir * 50, 42, [[0, '#f8fafc'], [1, '#64748b']]);
        ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.4; ctx.stroke();
      });
      ctx.beginPath();
      ctx.moveTo(72, 32 + b); ctx.quadraticCurveTo(100, 12 + b, 128, 32 + b);
      ctx.lineTo(123, 66 + b); ctx.lineTo(100, 78 + b); ctx.lineTo(77, 66 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 72, 16, 128, 76, [[0, '#64748b'], [0.45, '#1e293b'], [1, '#090b12']]);
      ctx.fill(); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4; ctx.stroke();
      // Visor Slit & Burning Crimson Eyes
      ctx.beginPath(); ctx.moveTo(80, 46 + b); ctx.lineTo(120, 46 + b); ctx.lineTo(116, 56 + b); ctx.lineTo(84, 56 + b); ctx.closePath();
      ctx.fillStyle = '#07040a'; ctx.fill();
      ctx.shadowColor = '#f43f5e'; ctx.shadowBlur = 12; ctx.fillStyle = '#ff2e55';
      ctx.beginPath(); ctx.ellipse(90, 51 + b, 6.5, 2.8, 0.2, 0, Math.PI * 2); ctx.ellipse(110, 51 + b, 6.5, 2.8, -0.2, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Colossal Flaming Runed Abyssal Greatsword
      ctx.save();
      ctx.translate(166, 104 + b);
      ctx.rotate(0.12);
      ctx.shadowColor = '#f43f5e'; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.moveTo(0, -98); ctx.lineTo(14, -70); ctx.lineTo(10, 26); ctx.lineTo(-10, 26); ctx.lineTo(-14, -70); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, -14, -98, 14, 26, [[0, '#fff1f2'], [0.35, '#fb7185'], [0.68, '#334155'], [1, '#0f172a']]);
      ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fda4af'; ctx.lineWidth = 2; ctx.stroke();
      // Winged Abyssal Crossguard
      ctx.beginPath(); ctx.moveTo(-26, 20); ctx.lineTo(-10, 30); ctx.lineTo(10, 30); ctx.lineTo(26, 20); ctx.lineTo(10, 21); ctx.lineTo(-10, 21); ctx.closePath();
      ctx.fillStyle = '#eab308'; ctx.fill();
      rrect(ctx, -5, 30, 10, 22, 3); ctx.fillStyle = '#4c0519'; ctx.fill();
      ctx.restore();

      return c;
    };
    sprites.monsters.vargas = [makeVargasHD(0), makeVargasHD(1)];

    // --- EXPANSION MONSTERS & MID-BOSSES (COAST, CANYON, CITADEL) ---
    const makeCoralCrab = (f) => {
      const S = 128, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? 4 : 0;
      [-1, 1].forEach((dir) => {
        ctx.beginPath(); ctx.arc(64 + dir * 36, 46 - b, 15, 0, Math.PI * 2);
        ctx.fillStyle = linGrad(ctx, 40, 30, 88, 60, [[0, '#fb7185'], [1, '#9f1239']]); ctx.fill();
        ctx.strokeStyle = '#4c0519'; ctx.lineWidth = 2.4; ctx.stroke();
      });
      ctx.beginPath(); ctx.ellipse(64, 72 + b * 0.5, 40, 26, 0, 0, Math.PI * 2);
      ctx.fillStyle = linGrad(ctx, 28, 46, 100, 98, [[0, '#fda4af'], [0.45, '#e11d48'], [1, '#881337']]);
      ctx.fill(); ctx.strokeStyle = '#3b0718'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(64, 62 + b * 0.5, 8, 0, Math.PI * 2); ctx.fill();
      [50, 78].forEach((ex) => { ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(ex, 64 + b * 0.5, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex - 1.5, 62.5 + b * 0.5, 1.8, 0, Math.PI * 2); ctx.fill(); });
      return c;
    };
    sprites.monsters.coral_crab = [makeCoralCrab(0), makeCoralCrab(1)];

    const makePirateSkel = (f) => {
      const S = 136, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? -4 : 0;
      rrect(ctx, 46, 66 + b, 44, 44, 10);
      ctx.fillStyle = linGrad(ctx, 46, 66, 90, 110, [[0, '#1e3a8a'], [1, '#0f172a']]); ctx.fill();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(68, 44 + b, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#e2e8f0'; ctx.fill(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.4; ctx.stroke();
      // Tricorn Corsair Hat
      ctx.beginPath(); ctx.moveTo(34, 34 + b); ctx.quadraticCurveTo(68, 6 + b, 102, 34 + b); ctx.quadraticCurveTo(68, 42 + b, 34, 34 + b); ctx.closePath();
      ctx.fillStyle = '#1e1b2e'; ctx.fill(); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
      [58, 78].forEach((ex) => { ctx.fillStyle = '#2dd4bf'; ctx.beginPath(); ctx.arc(ex, 45 + b, 4.2, 0, Math.PI * 2); ctx.fill(); });
      // Cutlass
      ctx.beginPath(); ctx.moveTo(106, 86 + b); ctx.quadraticCurveTo(126, 52 + b, 110, 24 + b); ctx.lineTo(100, 42 + b); ctx.lineTo(100, 86 + b); ctx.closePath();
      ctx.fillStyle = '#cbd5e1'; ctx.fill(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.stroke();
      return c;
    };
    sprites.monsters.pirate_skel = [makePirateSkel(0), makePirateSkel(1)];

    const makeKrakenGuard = (f) => {
      const S = 176, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? -5 : 0;
      ctx.fillStyle = radGrad(ctx, 88, 92, 12, 88, 92, 82, [[0, 'rgba(56,189,248,0.34)'], [1, 'rgba(0,0,0,0)']]);
      ctx.beginPath(); ctx.arc(88, 92, 82, 0, Math.PI * 2); ctx.fill();
      // Tentacles
      for (let i = -2; i <= 2; i++) {
        ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 11; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(88 + i * 16, 102 + b); ctx.quadraticCurveTo(88 + i * 28, 134, 88 + i * 22 + (f ? 6 : -6), 156); ctx.stroke();
      }
      // Deep-Sea Armored Dome Head & Crown
      ctx.beginPath(); ctx.ellipse(88, 66 + b, 44, 48, 0, 0, Math.PI * 2);
      ctx.fillStyle = linGrad(ctx, 44, 18, 132, 114, [[0, '#38bdf8'], [0.5, '#0284c7'], [1, '#082f49']]);
      ctx.fill(); ctx.strokeStyle = '#bae6fd'; ctx.lineWidth = 2.6; ctx.stroke();
      [70, 106].forEach((ex) => { ctx.shadowColor = '#fde047'; ctx.shadowBlur = 10; ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.ellipse(ex, 68 + b, 7, 4.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; });
      // Sapphire Trident
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(148, 28 + b); ctx.lineTo(148, 146 + b); ctx.stroke();
      ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(134, 34 + b); ctx.lineTo(134, 52 + b); ctx.lineTo(162, 52 + b); ctx.lineTo(162, 34 + b); ctx.moveTo(148, 18 + b); ctx.lineTo(148, 52 + b); ctx.stroke();
      return c;
    };
    sprites.monsters.kraken_guard = [makeKrakenGuard(0), makeKrakenGuard(1)];

    const makeWyvern = (f) => {
      const S = 144, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? -6 : 2;
      [-1, 1].forEach((dir) => {
        ctx.beginPath(); ctx.moveTo(72 + dir * 14, 62 + b); ctx.quadraticCurveTo(72 + dir * 64, 18 - b, 72 + dir * 56, 78 + b); ctx.lineTo(72 + dir * 24, 78 + b); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 72, 24, 72 + dir * 60, 78, [[0, '#f97316'], [1, '#7f1d1d']]); ctx.fill();
        ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 2.4; ctx.stroke();
      });
      ctx.beginPath(); ctx.ellipse(72, 72 + b, 24, 30, 0, 0, Math.PI * 2);
      ctx.fillStyle = linGrad(ctx, 48, 42, 96, 102, [[0, '#ef4444'], [0.6, '#b91c1c'], [1, '#450a0a']]);
      ctx.fill(); ctx.strokeStyle = '#290707'; ctx.lineWidth = 2.6; ctx.stroke();
      ctx.fillStyle = '#fde047';
      [62, 82].forEach((ex) => { ctx.beginPath(); ctx.arc(ex, 58 + b, 4.2, 0, Math.PI * 2); ctx.fill(); });
      return c;
    };
    sprites.monsters.wyvern = [makeWyvern(0), makeWyvern(1)];

    const makeLavaGolem = (f) => {
      const S = 152, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? 3 : 0;
      ctx.beginPath(); ctx.moveTo(30, 50 + b); ctx.lineTo(122, 50 + b); ctx.lineTo(108, 116 + b); ctx.lineTo(44, 116 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 30, 50, 122, 116, [[0, '#57534e'], [0.5, '#292524'], [1, '#1c1917']]);
      ctx.fill(); ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 3; ctx.stroke();
      [20, 132].forEach((fx) => { rrect(ctx, fx - 14, 68 + b, 28, 42, 10); ctx.fillStyle = '#292524'; ctx.fill(); ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.4; ctx.stroke(); });
      rrect(ctx, 50, 18 + b, 52, 36, 10); ctx.fillStyle = '#3f3b39'; ctx.fill(); ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.fillStyle = '#fef08a'; rrect(ctx, 58, 30 + b, 13, 6, 3); ctx.fill(); rrect(ctx, 81, 30 + b, 13, 6, 3); ctx.fill();
      ctx.shadowColor = '#f97316'; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.moveTo(76, 60 + b); ctx.lineTo(94, 82 + b); ctx.lineTo(76, 104 + b); ctx.lineTo(58, 82 + b); ctx.closePath();
      ctx.fillStyle = radGrad(ctx, 76, 82 + b, 2, 76, 82 + b, 20, [[0, '#ffffff'], [0.45, '#fde047'], [1, '#ea580c']]); ctx.fill(); ctx.shadowBlur = 0;
      return c;
    };
    sprites.monsters.lava_golem = [makeLavaGolem(0), makeLavaGolem(1)];

    const makeIgnisBoss = (f) => {
      const S = 184, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? -5 : 0;
      ctx.fillStyle = radGrad(ctx, 92, 92, 14, 92, 92, 86, [[0, 'rgba(249,115,22,0.38)'], [1, 'rgba(0,0,0,0)']]);
      ctx.beginPath(); ctx.arc(92, 92, 86, 0, Math.PI * 2); ctx.fill();
      // Flame Wing Mantle
      [-1, 1].forEach((dir) => {
        ctx.beginPath(); ctx.moveTo(92 + dir * 20, 72 + b); ctx.bezierCurveTo(92 + dir * 74, 24 + b, 92 + dir * 88, 66 + b, 92 + dir * 72, 126 + b); ctx.lineTo(92 + dir * 28, 108 + b); ctx.closePath();
        ctx.fillStyle = linGrad(ctx, 92, 30, 92 + dir * 80, 126, [[0, '#fef08a'], [0.45, '#f97316'], [1, '#991b1b']]); ctx.fill();
      });
      // Solar Armored Torso & Helm
      ctx.beginPath(); ctx.moveTo(52, 72 + b); ctx.lineTo(132, 72 + b); ctx.lineTo(122, 144 + b); ctx.lineTo(62, 144 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 52, 72, 132, 144, [[0, '#fbbf24'], [0.45, '#b45309'], [1, '#451a03']]);
      ctx.fill(); ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(92, 46 + b, 26, 0, Math.PI * 2);
      ctx.fillStyle = linGrad(ctx, 66, 20, 118, 72, [[0, '#fde047'], [0.5, '#ea580c'], [1, '#7c2d12']]); ctx.fill(); ctx.stroke();
      rrect(ctx, 74, 42 + b, 36, 10, 4); ctx.fillStyle = '#1c0a04'; ctx.fill();
      ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(83, 47 + b, 4, 0, Math.PI * 2); ctx.arc(101, 47 + b, 4, 0, Math.PI * 2); ctx.fill();
      // Solar Flame Halberd
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(150, 22 + b); ctx.lineTo(150, 152 + b); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(150, 18 + b); ctx.bezierCurveTo(180, 32 + b, 178, 76 + b, 150, 74 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 148, 18, 178, 74, [[0, '#ffffff'], [0.4, '#fde047'], [1, '#ea580c']]); ctx.fill();
      return c;
    };
    sprites.monsters.ignis_boss = [makeIgnisBoss(0), makeIgnisBoss(1)];

    const makeFallenKnight = (f) => {
      const S = 140, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? -4 : 0;
      ctx.beginPath(); ctx.moveTo(44, 62 + b); ctx.lineTo(96, 62 + b); ctx.lineTo(90, 118 + b); ctx.lineTo(50, 118 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 44, 62, 96, 118, [[0, '#64748b'], [0.5, '#1e1b4b'], [1, '#09090b']]);
      ctx.fill(); ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.beginPath(); ctx.arc(70, 42 + b, 21, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b'; ctx.fill(); ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2.2; ctx.stroke();
      rrect(ctx, 56, 38 + b, 28, 8, 3); ctx.fillStyle = '#090512'; ctx.fill();
      ctx.fillStyle = '#d8b4fe'; ctx.beginPath(); ctx.arc(63, 42 + b, 3.2, 0, Math.PI * 2); ctx.arc(77, 42 + b, 3.2, 0, Math.PI * 2); ctx.fill();
      // Cursed Lance
      ctx.beginPath(); ctx.moveTo(112, 16 + b); ctx.lineTo(120, 46 + b); ctx.lineTo(114, 116 + b); ctx.lineTo(108, 116 + b); ctx.lineTo(104, 46 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 104, 16, 120, 116, [[0, '#e9d5ff'], [0.4, '#9333ea'], [1, '#1e1b4b']]); ctx.fill();
      return c;
    };
    sprites.monsters.fallen_knight = [makeFallenKnight(0), makeFallenKnight(1)];

    const makeAbyssAssassin = (f) => {
      const S = 136, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? -5 : 0;
      ctx.beginPath(); ctx.moveTo(46, 62 + b); ctx.lineTo(90, 62 + b); ctx.lineTo(98, 116 + b); ctx.lineTo(38, 116 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 40, 62, 96, 116, [[0, '#312e81'], [1, '#09090b']]); ctx.fill(); ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(42, 54 + b); ctx.quadraticCurveTo(68, 12 + b, 94, 54 + b); ctx.closePath();
      ctx.fillStyle = '#1e1b4b'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fb7185'; ctx.beginPath(); ctx.arc(60, 44 + b, 3.5, 0, Math.PI * 2); ctx.arc(76, 44 + b, 3.5, 0, Math.PI * 2); ctx.fill();
      // Twin Crimson Energy Sickles
      [-1, 1].forEach((dir) => {
        ctx.strokeStyle = '#fb7185'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(68 + dir * 36, 76 + b, 18, dir < 0 ? 1.2 : -0.6, dir < 0 ? 3.8 : 2.0); ctx.stroke();
      });
      return c;
    };
    sprites.monsters.abyss_assassin = [makeAbyssAssassin(0), makeAbyssAssassin(1)];

    // PLOT TWIST MID-BOSS: Traitor Grand Commander Cassius (188x188)
    const makeCassiusBoss = (f) => {
      const S = 188, c = makeCanvas(S, S), ctx = c.getContext('2d'), b = f ? -5 : 0;
      ctx.fillStyle = radGrad(ctx, 94, 94, 14, 94, 94, 88, [[0, 'rgba(168,85,247,0.36)'], [0.6, 'rgba(234,179,8,0.16)'], [1, 'rgba(0,0,0,0)']]);
      ctx.beginPath(); ctx.arc(94, 94, 88, 0, Math.PI * 2); ctx.fill();
      // Grand Commander Royal Violet-Gold Cape
      ctx.beginPath(); ctx.moveTo(52, 72 + b); ctx.lineTo(30, 166 + b); ctx.lineTo(94, 154 + b); ctx.lineTo(158, 166 + b); ctx.lineTo(136, 72 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 32, 72, 156, 166, [[0, '#7e22ce'], [0.6, '#3b0764'], [1, '#12031f']]); ctx.fill();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4; ctx.stroke();
      // Tarnished Gold & Obsidian Paladin Armor
      ctx.beginPath(); ctx.moveTo(54, 70 + b); ctx.lineTo(134, 70 + b); ctx.lineTo(122, 144 + b); ctx.lineTo(66, 144 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 54, 70, 134, 144, [[0, '#fde047'], [0.35, '#475569'], [1, '#0f172a']]);
      ctx.fill(); ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.4; ctx.stroke();
      // Sculpted Pauldrons
      [-1, 1].forEach((dir) => {
        ctx.beginPath(); ctx.ellipse(94 + dir * 44, 78 + b, 20, 14, dir * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = linGrad(ctx, 74, 64, 114, 92, [[0, '#fef08a'], [0.5, '#a855f7'], [1, '#1e1b4b']]); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4; ctx.stroke();
      });
      // Unmasked Cold Noble Commander Head & Crowned Silver Hair
      ctx.beginPath(); ctx.arc(94, 44 + b, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#fde4cf'; ctx.fill(); ctx.strokeStyle = '#1e1b4b'; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(94, 36 + b, 26, Math.PI * 0.9, Math.PI * 2.1); ctx.lineTo(116, 46 + b); ctx.quadraticCurveTo(94, 30 + b, 72, 46 + b); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, 68, 12, 120, 46, [[0, '#f8fafc'], [1, '#64748b']]); ctx.fill(); ctx.stroke();
      drawStylizedEye(ctx, 84, 48 + b, 5, 4.5, '#c084fc', '#581c87', -1, true);
      drawStylizedEye(ctx, 104, 48 + b, 5, 4.5, '#c084fc', '#581c87', 1, true);
      // Black-Violet Runed Greatsword
      ctx.save(); ctx.translate(154, 98 + b); ctx.rotate(0.14);
      ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.moveTo(0, -86); ctx.lineTo(12, -62); ctx.lineTo(8, 22); ctx.lineTo(-8, 22); ctx.lineTo(-12, -62); ctx.closePath();
      ctx.fillStyle = linGrad(ctx, -12, -86, 12, 22, [[0, '#f3e8ff'], [0.4, '#a855f7'], [1, '#0f172a']]); ctx.fill(); ctx.shadowBlur = 0;
      rrect(ctx, -20, 18, 40, 8, 3); ctx.fillStyle = '#fbbf24'; ctx.fill();
      ctx.restore();
      return c;
    };
    sprites.monsters.cassius_boss = [makeCassiusBoss(0), makeCassiusBoss(1)];

    // =========================================================
    // 5. AAA ILLUSTRATED SD HERO SPRITES & ANIME PORTRAITS
    // =========================================================
    const artData = global.HERO_ART_DATA || {};
    sprites.art = { titleBg: null };
    const loadImg = (key, fallbackUrl, onLoad) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        onLoad(img);
        if (global.game && typeof global.game.onArtLoaded === 'function') {
          global.game.onArtLoaded(key);
        }
      };
      img.src = artData[key] || fallbackUrl;
    };

    [
      { cid: 'knight', file: 'knight' },
      { cid: 'rogue', file: 'rogue' },
      { cid: 'runeblade', file: 'mage' }
    ].forEach(({ cid, file }) => {
      const set = sprites.heroes[cid];
      if (!set) return;
      loadImg(`sheet_${file}`, `assets/sheet_${file}.webp?v=9`, (img) => {
        set.hdSheet = img;
      });
      loadImg(`portrait_${file}`, `assets/portrait_${file}.webp?v=9`, (img) => {
        set.hdPortrait = img;
        set.portrait = img;
      });
    });

    loadImg('title_bg', 'assets/title_bg.webp?v=9', (img) => {
      sprites.art.titleBg = img;
    });

    return sprites;
  }

  global.buildSprites = buildSprites;
})(window);
