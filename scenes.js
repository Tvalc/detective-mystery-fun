// ====== scenes.js ======
// Handles scene rendering, hotspot logic, and interactivity
// Now exposes a setup() method for DOM-ready initialization

(function () {
  // SceneManager will be exported to window
  const SceneManager = {
    setup,
    draw: function(ctx) {
      drawSceneBackground(ctx);
      drawHotspots(ctx);
    },
    update: function() {
      // No animation needed for static scenes
    },
    reset: function() {
      hoveredHotspotId = null;
    }
  };

  // --- All variables that depend on canvas/context are set up in setup() ---
  let canvas, ctx, DATA;
  let hoveredHotspotId = null;

  function setup() {
    canvas = window.canvas;
    ctx = window.ctx;
    DATA = window.DATA;

    // Defensive: don't add twice
    removeEventListeners();
    addEventListeners();

    // Set initial game state if not set
    if (!window.game.currentSceneId) {
      window.game.currentSceneId = DATA.scenes.city_hall_vault.id;
    }
    if (!window.game.foundClues) {
      window.game.foundClues = [];
    }
  }

  // --- 3. Scene/Hotspot helpers ---
  function getCurrentScene() {
    return DATA.scenes[window.game.currentSceneId];
  }

  function getSceneHotspots() {
    // Only show clues not yet found; always show npcs
    const found = window.game.foundClues;
    return getCurrentScene().hotspots
      .map(id => DATA.hotspots.find(h => h.id === id))
      .filter(h => h && (h.type !== 'clue' || !found.includes(h.clueId)));
  }

  function getHotspotAt(x, y) {
    const hs = getSceneHotspots();
    return hs.find(h => {
      const dx = x - h.x, dy = y - h.y;
      return Math.sqrt(dx * dx + dy * dy) <= h.radius;
    }) || null;
  }

  // --- 4. Drawing ---
  function drawSceneBackground(ctx) {
    ctx.fillStyle = '#232a36';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(110, 200, 80, 0, Math.PI * 2);
    ctx.fillStyle = '#202634';
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.fillStyle = '#b7d2ff';
    ctx.font = '700 22px Segoe UI, Arial';
    ctx.fillText(getCurrentScene().name, 22, 38);
  }

  function drawHotspots(ctx) {
    const hsArr = getSceneHotspots();
    hsArr.forEach(h => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fillStyle = (h.id === hoveredHotspotId) ? 'rgba(140,180,227,0.38)' : 'rgba(60,90,130,0.19)';
      ctx.strokeStyle = (h.id === hoveredHotspotId) ? '#8cb4e3' : '#5c759c';
      ctx.lineWidth = (h.id === hoveredHotspotId) ? 4 : 2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.font = 'bold 15px Segoe UI, Arial';
      ctx.fillStyle = (h.id === hoveredHotspotId) ? '#fff' : '#b7d2ff';
      ctx.textAlign = 'center';
      ctx.fillText(h.label, h.x, h.y - h.radius - 12);
      ctx.restore();
    });
  }

  // --- 6. Mouse event handling ---
  function canvasToSceneCoords(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function onMouseMove(evt) {
    const { x, y } = canvasToSceneCoords(evt);
    const hs = getHotspotAt(x, y);
    if (hs) {
      hoveredHotspotId = hs.id;
      canvas.style.cursor = 'pointer';
    } else {
      hoveredHotspotId = null;
      canvas.style.cursor = 'default';
    }
  }

  function onMouseLeave() {
    hoveredHotspotId = null;
    canvas.style.cursor = 'default';
  }

  function onClick(evt) {
    const { x, y } = canvasToSceneCoords(evt);
    const hs = getHotspotAt(x, y);
    if (!hs) return;
    if (hs.type === 'clue') {
      const clue = DATA.clues.find(c => c.id === hs.clueId);
      if (!clue) return;
      window.UI.showCluePopup(clue, function () {
        if (!window.game.foundClues.includes(clue.id)) {
          window.game.foundClues.push(clue.id);
          window.UI.updateJournal(window.game.foundClues);
        }
      });
    } else if (hs.type === 'npc') {
      const tree = DATA.dialogue[hs.npcId];
      if (!tree) return;
      function nextDialogue(nodeKey, clueId) {
        if (clueId && !window.game.foundClues.includes(clueId)) {
          window.UI.revealHiddenClue(clueId, window.game.foundClues);
        }
        if (tree[nodeKey]) {
          window.UI.showDialogue(tree, nodeKey, nextDialogue);
        } else {
          window.UI.hideDialogue();
        }
      }
      window.UI.showDialogue(tree, 'initial', nextDialogue);
    }
  }

  function addEventListeners() {
    if (!canvas) return;
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
  }
  function removeEventListeners() {
    if (!canvas) return;
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseleave', onMouseLeave);
    canvas.removeEventListener('click', onClick);
  }

  // --- 7. Export SceneManager for game.js to use ---
  window.SceneManager = SceneManager;
})();