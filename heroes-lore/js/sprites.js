// Procedural Pixel-Art Tileset & Character Sprite Renderer (16x16 & 24x24)
(function (global) {
  'use strict';

  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function drawGrid(grid, palette, scale = 1) {
    const h = grid.length;
    const w = grid[0].length;
    const c = makeCanvas(w * scale, h * scale);
    const ctx = c.getContext('2d');
    for (let y = 0; y < h; y++) {
      const row = grid[y];
      for (let x = 0; x < w; x++) {
        const ch = row[x];
        if (ch === '.' || ch === ' ') continue;
        const color = palette[ch];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
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

  function buildSprites() {
    const sprites = {};

    // --- TILES (16x16) ---
    sprites.tiles = {};

    const createGrass = (variant) => {
      const c = makeCanvas(16, 16);
      const ctx = c.getContext('2d');
      ctx.fillStyle = variant === 2 ? '#315d34' : '#3e733b';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = variant === 2 ? '#294e2c' : '#356633';
      ctx.fillRect(2, 3, 2, 1);
      ctx.fillRect(10, 8, 2, 1);
      ctx.fillRect(5, 13, 2, 1);
      ctx.fillStyle = variant === 2 ? '#427844' : '#508c46';
      ctx.fillRect(3, 2, 1, 2);
      ctx.fillRect(12, 6, 1, 2);
      ctx.fillRect(7, 11, 1, 2);
      if (variant === 1) {
        // Wildflowers
        ctx.fillStyle = '#f4d35e';
        ctx.fillRect(4, 5, 2, 2);
        ctx.fillStyle = '#fff5cc';
        ctx.fillRect(4, 5, 1, 1);
        ctx.fillStyle = '#ee6c78';
        ctx.fillRect(11, 11, 2, 2);
        ctx.fillStyle = '#ffd1d6';
        ctx.fillRect(11, 11, 1, 1);
      }
      return c;
    };

    sprites.tiles.grass = createGrass(0);
    sprites.tiles.flower = createGrass(1);
    sprites.tiles.darkGrass = createGrass(2);

    // Dirt Path
    {
      const c = makeCanvas(16, 16);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#a88454';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#926f43';
      ctx.fillRect(2, 2, 3, 2);
      ctx.fillRect(10, 9, 3, 2);
      ctx.fillRect(4, 12, 2, 2);
      ctx.fillStyle = '#be9b6b';
      ctx.fillRect(7, 4, 2, 1);
      ctx.fillRect(12, 13, 2, 1);
      sprites.tiles.path = c;
    }

    // Cobblestone (Town)
    {
      const c = makeCanvas(16, 16);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#736c63';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#948b7e';
      ctx.fillRect(1, 1, 6, 6);
      ctx.fillRect(8, 1, 7, 6);
      ctx.fillRect(1, 8, 8, 7);
      ctx.fillRect(10, 8, 5, 7);
      ctx.fillStyle = '#a89f91';
      ctx.fillRect(1, 1, 6, 1);
      ctx.fillRect(8, 1, 7, 1);
      ctx.fillRect(1, 8, 8, 1);
      ctx.fillRect(10, 8, 5, 1);
      sprites.tiles.cobble = c;
    }

    // Water (2 frames)
    const createWater = (frame) => {
      const c = makeCanvas(16, 16);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#255c8a';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#3274aa';
      ctx.fillRect(0, 3, 16, 3);
      ctx.fillRect(0, 11, 16, 3);
      ctx.fillStyle = '#7ec4ef';
      const off = frame ? 4 : 0;
      ctx.fillRect((2 + off) % 14, 4, 4, 1);
      ctx.fillRect((9 + off) % 14, 12, 4, 1);
      return c;
    };
    sprites.tiles.water0 = createWater(0);
    sprites.tiles.water1 = createWater(1);

    // Bridge
    {
      const c = makeCanvas(16, 16);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#6b4728';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#8b5e34';
      for (let y = 1; y < 16; y += 4) {
        ctx.fillRect(1, y, 14, 3);
      }
      ctx.fillStyle = '#4e331b';
      ctx.fillRect(0, 0, 1, 16);
      ctx.fillRect(15, 0, 1, 16);
      sprites.tiles.bridge = c;
    }

    // Pine Tree
    sprites.tiles.tree = drawGrid([
      '......gggg......',
      '.....gGGGGg.....',
      '....gGGLLGGg....',
      '...gGGGGGGGGg...',
      '....gGddddGg....',
      '...gGGGGGGGGg...',
      '..gGGLLGGGGGGg..',
      '.gGGGGGGGGGGGGg.',
      '..gGGddddddGGg..',
      '.gGGGGGGGGGGGGg.',
      'gGGLLGGGGGGGGGGg',
      'gGGGGGGGGGGGGGGg',
      '.ggddddddddddgg.',
      '......bBBb......',
      '......bBBb......',
      '.....sbbbbS.....'
    ], {
      g: '#1a3b22', G: '#295c30', L: '#428342', d: '#16301b',
      b: '#4d321c', B: '#6e4a2a', s: 'rgba(0,0,0,0.35)', S: 'rgba(0,0,0,0.35)'
    });

    // Dark Forest Tree
    sprites.tiles.darkTree = drawGrid([
      '......gggg......',
      '.....gGGGGg.....',
      '....gGGLLGGg....',
      '...gGGGGGGGGg...',
      '....gGddddGg....',
      '...gGGGGGGGGg...',
      '..gGGLLGGGGGGg..',
      '.gGGGGGGGGGGGGg.',
      '..gGGddddddGGg..',
      '.gGGGGGGGGGGGGg.',
      'gGGLLGGGGGGGGGGg',
      'gGGGGGGGGGGGGGGg',
      '.ggddddddddddgg.',
      '......bBBb......',
      '......bBBb......',
      '.....sbbbbS.....'
    ], {
      g: '#10241b', G: '#1b3d2d', L: '#2d5c45', d: '#0d1c15',
      b: '#3b2517', B: '#573824', s: 'rgba(0,0,0,0.4)', S: 'rgba(0,0,0,0.4)'
    });

    // Ruin Floor & Rune Floor
    {
      const c = makeCanvas(16, 16);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#3c3e47';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#4c4f5a';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#31333b';
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(7, 0, 1, 16);
      ctx.fillStyle = '#5a5e6b';
      ctx.fillRect(2, 2, 4, 1);
      ctx.fillRect(9, 9, 4, 1);
      sprites.tiles.ruinFloor = c;

      const r = makeCanvas(16, 16);
      const rctx = r.getContext('2d');
      rctx.drawImage(c, 0, 0);
      rctx.fillStyle = '#40b8c9';
      rctx.fillRect(5, 5, 6, 1);
      rctx.fillRect(5, 10, 6, 1);
      rctx.fillRect(5, 5, 1, 6);
      rctx.fillRect(10, 5, 1, 6);
      rctx.fillStyle = '#9cf0fa';
      rctx.fillRect(7, 7, 2, 2);
      sprites.tiles.ruinRune = r;
    }

    // Ruin Stone Wall
    {
      const c = makeCanvas(16, 16);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#24252c';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#5a5e6b';
      ctx.fillRect(1, 1, 14, 6);
      ctx.fillStyle = '#484b56';
      ctx.fillRect(1, 8, 6, 7);
      ctx.fillRect(8, 8, 7, 7);
      ctx.fillStyle = '#737887';
      ctx.fillRect(1, 1, 14, 1);
      ctx.fillRect(1, 8, 6, 1);
      ctx.fillRect(8, 8, 7, 1);
      sprites.tiles.wall = c;
    }

    // Altar Floor & Wall (Boss Room)
    {
      const c = makeCanvas(16, 16);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#251a1f';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#332329';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#4a262d';
      ctx.fillRect(2, 2, 12, 1);
      ctx.fillRect(7, 7, 2, 2);
      sprites.tiles.altarFloor = c;

      const w = makeCanvas(16, 16);
      const wctx = w.getContext('2d');
      wctx.fillStyle = '#140c10';
      wctx.fillRect(0, 0, 16, 16);
      wctx.fillStyle = '#3e2329';
      wctx.fillRect(1, 1, 14, 6);
      wctx.fillStyle = '#2e181d';
      wctx.fillRect(1, 8, 6, 7);
      wctx.fillRect(8, 8, 7, 7);
      wctx.fillStyle = '#8b2938';
      wctx.fillRect(1, 1, 14, 1);
      sprites.tiles.altarWall = w;
    }

    // House Roof / Wall / Door
    {
      const roof = makeCanvas(16, 16);
      const rctx = roof.getContext('2d');
      rctx.fillStyle = '#6e2c24';
      rctx.fillRect(0, 0, 16, 16);
      rctx.fillStyle = '#8f3b2e';
      for (let y = 0; y < 16; y += 4) {
        rctx.fillRect(0, y, 16, 2);
      }
      rctx.fillStyle = '#4f1d17';
      rctx.fillRect(0, 14, 16, 2);
      sprites.tiles.houseRoof = roof;

      const wall = makeCanvas(16, 16);
      const wctx = wall.getContext('2d');
      wctx.fillStyle = '#d4c3a3';
      wctx.fillRect(0, 0, 16, 16);
      wctx.fillStyle = '#5e4028';
      wctx.fillRect(0, 0, 2, 16);
      wctx.fillRect(14, 0, 2, 16);
      wctx.fillRect(0, 13, 16, 3);
      wctx.fillStyle = '#5897bd';
      wctx.fillRect(5, 4, 6, 6);
      wctx.fillStyle = '#3b2514';
      wctx.fillRect(4, 3, 8, 1);
      wctx.fillRect(4, 10, 8, 1);
      wctx.fillRect(7, 4, 2, 6);
      sprites.tiles.houseWall = wall;

      const door = makeCanvas(16, 16);
      const dctx = door.getContext('2d');
      dctx.fillStyle = '#d4c3a3';
      dctx.fillRect(0, 0, 16, 16);
      dctx.fillStyle = '#5e3b1f';
      dctx.fillRect(3, 2, 10, 14);
      dctx.fillStyle = '#7c502c';
      dctx.fillRect(4, 3, 8, 12);
      dctx.fillStyle = '#e5bc5b';
      dctx.fillRect(10, 9, 2, 2);
      sprites.tiles.houseDoor = door;
    }

    // Healing Fountain (2 frames)
    const createFountain = (frame) => drawGrid([
      '....ssssssss....',
      '..ssLLLLLLLLss..',
      '.sLLwwwwwwwwLLs.',
      '.sLwWWwwwwWWwLs.',
      'sLwwWssCCssWwwLs',
      'sLwwsCBBBBswwLs.',
      'sLwwsBWWWWBswwLs',
      'sLwwsBWWWWBswwLs',
      'sLwwwssCCsswwwLs',
      '.sLwWWwwwwWWwLs.',
      '.sLLwwwwwwwwLLs.',
      '..ssLLLLLLLLss..',
      '...sdddddddds...',
      '....ssssssss....',
      '................',
      '................'
    ], {
      s: '#4f5561', L: '#9aa2b0', d: '#6c7380',
      w: '#2e86c1', W: frame ? '#a9e6ff' : '#5dade2',
      C: '#c0c8d4', B: frame ? '#ffffff' : '#85d6ff'
    });
    sprites.tiles.fountain0 = createFountain(0);
    sprites.tiles.fountain1 = createFountain(1);

    // Chests
    sprites.tiles.chestClosed = drawGrid([
      '................',
      '................',
      '..bbbbbbbbbbbb..',
      '.bBBBBBBBBBBBBb.',
      '.bBggggggggggBb.',
      '.bBBBBBBBBBBBBb.',
      '.bbbbggGGggbbbb.',
      '.bBBBggGGggBBBb.',
      '.bBBBBBBBBBBBBb.',
      '.bBddddddddddBb.',
      '.bBBBBBBBBBBBBb.',
      '..bbbbbbbbbbbb..',
      '...ssssssssss...',
      '................',
      '................',
      '................'
    ], {
      b: '#3b200e', B: '#8c5323', d: '#693c18',
      g: '#c79a34', G: '#ffe17a', s: 'rgba(0,0,0,0.35)'
    });

    sprites.tiles.chestOpen = drawGrid([
      '................',
      '..bbbbbbbbbbbb..',
      '.bddddddddddddb.',
      '.bBddddddddddBb.',
      '.bbbbbbbbbbbbbb.',
      '.bBkkkkkkkkkkBb.',
      '.bbbbggGGggbbbb.',
      '.bBBBggGGggBBBb.',
      '.bBBBBBBBBBBBBb.',
      '.bBddddddddddBb.',
      '.bBBBBBBBBBBBBb.',
      '..bbbbbbbbbbbb..',
      '...ssssssssss...',
      '................',
      '................',
      '................'
    ], {
      b: '#3b200e', B: '#8c5323', d: '#542f13', k: '#1c1008',
      g: '#c79a34', G: '#ffe17a', s: 'rgba(0,0,0,0.35)'
    });

    // --- HERO SPRITES (16x16) ---
    function makeHeroSprites(pal) {
      const idle = drawGrid([
        '....hhhhhhhh....',
        '...hHHHHHHHHh...',
        '...hHssssssHh...',
        '...hsseSseSsh...',
        '...hsssssssssh..',
        '....oaaaaaaao...',
        '...oaAAccAAao...',
        '..oaaAAccAAaao..',
        '..osaaAAAAaaso..',
        '..os.aBBBBa.so..',
        '.....aAAAAa.....',
        '....oaa..aao....',
        '....obb..bbo....',
        '....obb..bbo....',
        '...s........s...',
        '................'
      ], pal);

      const walk = drawGrid([
        '....hhhhhhhh....',
        '...hHHHHHHHHh...',
        '...hHssssssHh...',
        '...hsseSseSsh...',
        '...hsssssssssh..',
        '....oaaaaaaao...',
        '...oaAAccAAao...',
        '..oaaAAccAAaao..',
        '...saaAAAAaas...',
        '.....aBBBBa.....',
        '....oaa..aao....',
        '...obb....bbo...',
        '...obb....bbo...',
        '................',
        '...s........s...',
        '................'
      ], pal);

      return { idle, walk, idleLeft: flipH(idle), walkLeft: flipH(walk) };
    }

    sprites.heroes = {
      knight: makeHeroSprites({
        h: '#3d2817', H: '#7a4b2a', s: '#f5cfa6', S: '#d9a777', e: '#1d1c24',
        o: '#222630', a: '#7b8799', A: '#c4d0e0', c: '#b82832', B: '#d9a441', b: '#4a3525'
      }),
      rogue: makeHeroSprites({
        h: '#162922', H: '#285241', s: '#f5cfa6', S: '#d9a777', e: '#1d1c24',
        o: '#141a18', a: '#2e453b', A: '#496e5e', c: '#d9a441', B: '#8c6239', b: '#26201c'
      }),
      runeblade: makeHeroSprites({
        h: '#1f2847', H: '#3c5496', s: '#fae0c8', S: '#deb692', e: '#1d1c24',
        o: '#1a1e33', a: '#2e4378', A: '#547ad1', c: '#f0c451', B: '#72d8e8', b: '#2a2a40'
      })
    };

    // --- NPC SPRITES (16x16) ---
    sprites.npcs = {
      elder: drawGrid([
        '....wwwwwwww....',
        '...wWWWWWWWWw...',
        '...wWssssssWw...',
        '...wseSsseSsw...',
        '...wsWWWWWWsw...',
        '...o.WWWWWW.o...',
        '..orrrWWWWrrro..',
        '..orRRrWWrrRRo..',
        '..osrRRRRRrrso..',
        '....rRBBBBrr....',
        '....rRRRRRrr....',
        '....rRRRRRrr....',
        '....orrrrrro....',
        '....obb..bbo....',
        '................',
        '................'
      ], {
        w: '#8a919e', W: '#e6ebf5', s: '#f0c49a', S: '#d49d6e', e: '#1f1e24',
        o: '#2e2018', r: '#69442c', R: '#946342', B: '#d9a441', b: '#3d281a'
      }),
      shop: drawGrid([
        '....gggggggg....',
        '...gGGGGGGGGg...',
        '...gGssssssGg...',
        '...gseSsseSsg...',
        '...gssssssssg...',
        '....oaawwaao....',
        '...oaAAwwAAao...',
        '..oaaAAwwAAaao..',
        '..osaaAAAAaaso..',
        '....aAWWWWaa....',
        '....aAWWWWaa....',
        '....oaa..aao....',
        '....obb..bbo....',
        '................',
        '................',
        '................'
      ], {
        g: '#8f591c', G: '#e09d36', s: '#f7d6b5', S: '#dba87d', e: '#1f1e24',
        o: '#331c1e', a: '#a63744', A: '#d45360', w: '#f5efe6', W: '#ffffff', b: '#523424'
      }),
      smith: drawGrid([
        '....rrrrrrrr....',
        '...rRRRRRRRRr...',
        '...osssssssso...',
        '...oseSsseSso...',
        '...osbbbbbbso...',
        '...oaaBBBBaao...',
        '..osaaBBBBaaso..',
        '..osaaBBBBaaso..',
        '...oaaBBBBaao...',
        '....aABBBBaa....',
        '....aABBBBaa....',
        '....oaa..aao....',
        '....okk..kko....',
        '................',
        '................',
        '................'
      ], {
        r: '#5e1a1a', R: '#a62c2c', s: '#e0ab82', S: '#bd855b', e: '#1a181c',
        o: '#241b16', b: '#3b271a', a: '#8c5d3c', A: '#694228', B: '#4a4f59', k: '#292b30'
      })
    };

    // --- MONSTERS ---
    const makeSlime = (cDark, cMid, cLight) => [
      drawGrid([
        '................',
        '................',
        '................',
        '.....oooooo.....',
        '...ooMMMMMMoo...',
        '..oMLLMMMMMMMo..',
        '.oMLLMMMMMMMMMo.',
        '.oMMMMMMMMMMMMo.',
        'oMMMkWMMMMkWMMMo',
        'oMMMkkMMMMkkMMMo',
        'oMMMMMMMMMMMMMMo',
        'oMDDDDDDDDDDDDMo',
        '.oDDDDDDDDDDDDo.',
        '..oooooooooooo..',
        '................',
        '................'
      ], { o: '#162418', D: cDark, M: cMid, L: cLight, k: '#111116', W: '#ffffff' }),
      drawGrid([
        '................',
        '................',
        '................',
        '................',
        '................',
        '....oooooooo....',
        '..ooMMMMMMMMoo..',
        '.oMLLMMMMMMMMMo.',
        'oMLLMMMMMMMMMMMo',
        'oMMkWMMMMMMkWMMo',
        'oMMkkMMMMMMkkMMo',
        'oMDDDDDDDDDDDDMo',
        'oDDDDDDDDDDDDDDo',
        '.oooooooooooooo.',
        '................',
        '................'
      ], { o: '#162418', D: cDark, M: cMid, L: cLight, k: '#111116', W: '#ffffff' })
    ];

    sprites.monsters = {};
    sprites.monsters.slime_green = makeSlime('#2a7a36', '#4ec45a', '#a3f09b');
    sprites.monsters.slime_blue = makeSlime('#1f5994', '#3d9ae8', '#a3dcff');

    sprites.monsters.boar = [
      drawGrid([
        '................',
        '................',
        '....oooooooo....',
        '..ooBBBBBBBBoo..',
        '.oBBbbbbbbbbBBo.',
        'oBBbBbbbbbbBbBBo',
        'oBbeBBBBBBBBebBo',
        'oBBBBBnnnnBBBBBo',
        'oWBBBnNNNNnBBBW.',
        '.oWBBnnnnnnBBWo.',
        '..oBBBBBBBBBBo..',
        '..ooBBooooBBoo..',
        '...oBo....oBo...',
        '...oo......oo...',
        '................',
        '................'
      ], { o: '#21140d', b: '#4f301e', B: '#7a4d32', n: '#a86b59', N: '#d4907d', e: '#141010', W: '#f5f0dc' }),
      drawGrid([
        '................',
        '................',
        '................',
        '....oooooooo....',
        '..ooBBBBBBBBoo..',
        '.oBBbbbbbbbbBBo.',
        'oBbeBBBBBBBBebBo',
        'oBBBBBnnnnBBBBBo',
        'oWBBBnNNNNnBBBW.',
        '.oWBBnnnnnnBBWo.',
        '..oBBBBBBBBBBo..',
        '..oBBo....oBBo..',
        '..oo........oo..',
        '................',
        '................',
        '................'
      ], { o: '#21140d', b: '#4f301e', B: '#7a4d32', n: '#a86b59', N: '#d4907d', e: '#141010', W: '#f5f0dc' })
    ];

    sprites.monsters.goblin = [
      drawGrid([
        '................',
        '....oooooooo....',
        '..ooGGGGGGGGoo..',
        'ooGGgGGGGGGgGGoo',
        '.ooGGeRGGReGGoo.',
        '...oGGGGGGGGoo..',
        '...oGGwwwwGGo...',
        '....oaaaaaaao...',
        '...oaAAbbAAao.s.',
        '..oGaAAbbAAaGsS.',
        '..oG.aAAAAa.GsS.',
        '.....aAAAAa..s..',
        '....oGG..GGo....',
        '....obb..bbo....',
        '................',
        '................'
      ], { o: '#162112', g: '#3b6629', G: '#5c9640', e: '#1a1010', R: '#e84343', w: '#f0ecd8', a: '#634329', A: '#8c613e', b: '#3b2717', s: '#8a95a6', S: '#cfd8e6' }),
      drawGrid([
        '................',
        '....oooooooo....',
        '..ooGGGGGGGGoo..',
        'ooGGgGGGGGGgGGoo',
        '.ooGGeRGGReGGoo.',
        '...oGGGGGGGGoo..',
        '...oGGwwwwGGo...',
        '....oaaaaaaao.s.',
        '...oaAAbbAAaosS.',
        '..oGaAAbbAAaGs..',
        '....oaAAAAao....',
        '...oGG....GGo...',
        '...obb....bbo...',
        '................',
        '................',
        '................'
      ], { o: '#162112', g: '#3b6629', G: '#5c9640', e: '#1a1010', R: '#e84343', w: '#f0ecd8', a: '#634329', A: '#8c613e', b: '#3b2717', s: '#8a95a6', S: '#cfd8e6' })
    ];

    sprites.monsters.goblin_shaman = [
      drawGrid([
        '.....oooooo.....',
        '....oRRRRRRo....',
        '...oRrrrrrrRo...',
        '..oRrGGGGGGrrO..',
        '..oRGeYGGYeGRo..',
        '...oGGGGGGGGo.m.',
        '....orrrrrro.mMm',
        '...orRRRRRRro.b.',
        '..oGrRRRRRRrG.b.',
        '..oG.rRRRRr...b.',
        '.....rRRRRr...b.',
        '....orrrrrro....',
        '....oGG..GGo....',
        '................',
        '................',
        '................'
      ], { o: '#1d1221', O: '#1d1221', r: '#592030', R: '#943248', G: '#5c9640', e: '#111', Y: '#ffe052', m: '#57d4e8', M: '#c9fbff', b: '#6e492c' }),
      drawGrid([
        '.....oooooo.....',
        '....oRRRRRRo....',
        '...oRrrrrrrRo...',
        '..oRrGGGGGGrrO..',
        '..oRGeYGGYeGRo.m',
        '...oGGGGGGGGomMm',
        '....orrrrrro..b.',
        '...orRRRRRRro.b.',
        '..oGrRRRRRRrG.b.',
        '.....rRRRRr...b.',
        '....orrrrrro....',
        '...oGG....GGo...',
        '................',
        '................',
        '................',
        '................'
      ], { o: '#1d1221', O: '#1d1221', r: '#592030', R: '#943248', G: '#5c9640', e: '#111', Y: '#ffe052', m: '#57d4e8', M: '#c9fbff', b: '#6e492c' })
    ];

    sprites.monsters.skeleton = [
      drawGrid([
        '....oooooooo....',
        '...oWWWWWWWWo...',
        '...oWWwwwwWWo...',
        '...oWkWwwWkWo...',
        '...oWWWWWWWWo...',
        '....oWkWkWko....',
        '....oaaaaaaao...',
        '...oaAWWWWAao.s.',
        '..oWaAWWWWAaWsS.',
        '..oW.aAAAAa.WsS.',
        '.....aAAAAa..s..',
        '....oWW..WWo....',
        '....oWW..WWo....',
        '....okk..kko....',
        '................',
        '................'
      ], { o: '#1a1b24', W: '#e6e8f0', w: '#b4b8c7', k: '#1c1824', a: '#4f5466', A: '#788099', s: '#9aa4b5', S: '#dce3f0' }),
      drawGrid([
        '....oooooooo....',
        '...oWWWWWWWWo...',
        '...oWWwwwwWWo...',
        '...oWkWwwWkWo...',
        '...oWWWWWWWWo...',
        '....oWkWkWko....',
        '....oaaaaaaao.s.',
        '...oaAWWWWAaosS.',
        '..oWaAWWWWAaWs..',
        '.....aAAAAa.....',
        '....oWW..WWo....',
        '...oWW....WWo...',
        '...okk....kko...',
        '................',
        '................',
        '................'
      ], { o: '#1a1b24', W: '#e6e8f0', w: '#b4b8c7', k: '#1c1824', a: '#4f5466', A: '#788099', s: '#9aa4b5', S: '#dce3f0' })
    ];

    sprites.monsters.golem = [
      drawGrid([
        '....oooooooo....',
        '...oSSSSSSSSo...',
        '..oSSddddddSSo..',
        '..oSdEEddEEdSo..',
        '..oSSSSSSSSSSo..',
        '.ooSSsGGGGsSSoo.',
        'oSSSSsGGGGsSSSSo',
        'oSSdSSssssSSdSSo',
        'oSSdSSSSSSSSdSSo',
        'oSSdSSddddSSdSSo',
        '.ooSSSSSSSSSSoo.',
        '..oSSSSooSSSSo..',
        '..oSSSo..oSSSo..',
        '..oSSSo..oSSSo..',
        '..ooooo..ooooo..',
        '................'
      ], { o: '#1f2126', S: '#747a87', s: '#525763', d: '#3c404a', E: '#ffbb33', G: '#4fc9b0' }),
      drawGrid([
        '................',
        '....oooooooo....',
        '...oSSSSSSSSo...',
        '..oSSddddddSSo..',
        '..oSdEEddEEdSo..',
        '..oSSSSSSSSSSo..',
        '.ooSSsGGGGsSSoo.',
        'oSSSSsGGGGsSSSSo',
        'oSSdSSssssSSdSSo',
        'oSSdSSSSSSSSdSSo',
        '.ooSSSSSSSSSSoo.',
        '..oSSSo..oSSSo..',
        '..oSSSo..oSSSo..',
        '..ooooo..ooooo..',
        '................',
        '................'
      ], { o: '#1f2126', S: '#747a87', s: '#525763', d: '#3c404a', E: '#ffbb33', G: '#4fc9b0' })
    ];

    sprites.monsters.dark_mage = [
      drawGrid([
        '.....oooooo.....',
        '....oDDDDDDo....',
        '...oDddddddDo...',
        '..oDdkkkkkkdDo..',
        '..oDdkRkkRkdDo..',
        '...oDkkkkkkDo...',
        '...oDDDDDDDDo...',
        '..oDDdGGGGdDDo..',
        '.oDDDdGGGGdDDDo.',
        '.oDD.dDDDDd.DDo.',
        '....oDDDDDDo....',
        '....oDDddDDo....',
        '...oDDd..dDDo...',
        '...ooo....ooo...',
        '................',
        '................'
      ], { o: '#120f17', D: '#2a2433', d: '#41384f', k: '#0c0910', R: '#ff425b', G: '#d9a441' }),
      drawGrid([
        '................',
        '.....oooooo.....',
        '....oDDDDDDo....',
        '...oDddddddDo...',
        '..oDdkkkkkkdDo..',
        '..oDdkRkkRkdDo..',
        '...oDkkkkkkDo...',
        '...oDDDDDDDDo...',
        '..oDDdGGGGdDDo..',
        '.oDDDdGGGGdDDDo.',
        '....oDDDDDDo....',
        '...oDDd..dDDo...',
        '...ooo....ooo...',
        '................',
        '................',
        '................'
      ], { o: '#120f17', D: '#2a2433', d: '#41384f', k: '#0c0910', R: '#ff425b', G: '#d9a441' })
    ];

    // Mini Boss: Goblin Chief (24x24)
    const chiefGrid = [
      '....WW............WW....',
      '....oWo..oooooo..oWo....',
      '.....oWooHHHHHHooWo.....',
      '......oHHHHHHHHHHo......',
      '.....oHHGGGGGGGGHHo.....',
      '....ooGGeRGGGGeRGGoo....',
      '....oGGGGGGGGGGGGGGoo...',
      '.....oGGGWWWWWWGGGo.....',
      '....orrrAAAAAAAAarrro...',
      '...orRRRAAggggAARRRro...',
      '..oGGrRRAAggggAARRrGGo..',
      '..oGGrRRAAAAAAAARRrGGo..',
      '..oGG.rRAAAAAAAArr.GGo..',
      '..oGG.rRAAbbbbAArr.GGo..',
      '......rRAAAAAAAArr......',
      '......orrAAAAAAro.......',
      '......oGGGo..oGGGo......',
      '......oGGGo..oGGGo......',
      '......obbbo..obbbo......',
      '......ooooo..ooooo......',
      '........................',
      '........................',
      '........................',
      '........................'
    ];
    sprites.monsters.goblin_chief = [
      drawGrid(chiefGrid, {
        o: '#161b12', W: '#f2ead0', H: '#5e6573', G: '#4d8a35', e: '#140c0c',
        R: '#d93838', r: '#7d1e1e', A: '#5e4028', g: '#d9a441', b: '#3b2616'
      }),
      drawGrid(chiefGrid, {
        o: '#161b12', W: '#fff6de', H: '#747d8f', G: '#589c3d', e: '#140c0c',
        R: '#ff4a4a', r: '#8f2222', A: '#6e4b30', g: '#f0bc54', b: '#3b2616'
      })
    ];

    // Final Boss: Abyssal Knight Vargas (24x24)
    const vargasGrid = [
      '...oo..............oo...',
      '...oHo...oooooo...oHo...',
      '....oHooKKKKKKKKooHo....',
      '.....oKKKkkkkkkKKKo.....',
      '.....oKKkRRRRRRkKKo.....',
      '.....oKKkRkkkkRkKKo.....',
      '......oKKkkkkkkKKo......',
      '....orrrKKKKKKKKrrro....',
      '...orRRRKKggggKKRRRro...',
      '..oKKrRRKKgGGgKKRRrKKo..',
      '..oKKrRRKKggggKKRRrKKo..',
      '.oKKKrRRKKKKKKKKRRrKKKo.',
      '.oKKK.rRKKggggKKrr.KKKo.',
      '.oKK..rRKKKKKKKKrr..KKo.',
      '..oo..rRKKrrrrKKrr..oo..',
      '......rRKKKKKKKKrr......',
      '.....orrrKKooKKrrro.....',
      '.....orKKKo..oKKKro.....',
      '.....orKKKo..oKKKro.....',
      '......oKKKo..oKKKo......',
      '......ooooo..ooooo......',
      '........................',
      '........................',
      '........................'
    ];
    sprites.monsters.vargas = [
      drawGrid(vargasGrid, {
        o: '#0c0a0f', H: '#c4cdd9', K: '#323645', k: '#171821',
        R: '#ff364d', r: '#871c2b', g: '#c99334', G: '#ffdf78'
      }),
      drawGrid(vargasGrid, {
        o: '#0c0a0f', H: '#e3ebf5', K: '#404559', k: '#1c1d29',
        R: '#ff6678', r: '#a82235', g: '#e0a943', G: '#fff0a6'
      })
    ];

    return sprites;
  }

  global.buildSprites = buildSprites;
})(window);
