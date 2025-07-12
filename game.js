// Main game logic - refactored for DOM-ready initialization and robust module setup

window.addEventListener("DOMContentLoaded", function () {
  // 1. Grab canvas/context after DOM is ready
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // 2. Attach to window for other modules
  window.canvas = canvas;
  window.ctx = ctx;

  // 3. Set up game state container
  const game = window.game = {
    running: false,
    objects: [],
    currentSceneId: null,
    foundClues: [],
  };

  // 4. Initialize Journal UI
  if (window.UI && typeof window.UI.updateJournal === "function") {
    window.UI.updateJournal(game.foundClues);
  }

  // 5. Deferred Scene Manager initialization
  //    scenes.js now exposes a setup function
  if (window.SceneManager && typeof window.SceneManager.setup === "function") {
    window.SceneManager.setup();
    // Set game.objects to [SceneManager] (it will handle draw/update)
    game.objects = [window.SceneManager];
  }

  // 6. Main game loop
  function gameLoop() {
    // Defensive: ensure ctx/canvas exists
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.objects.forEach(obj => {
      if (obj.update) obj.update();
      if (obj.draw) obj.draw(ctx);
    });
    if (game.running) {
      requestAnimationFrame(gameLoop);
    }
  }

  // 7. Start screen integration
  function startGame() {
    game.running = true;
    // Reset state if needed
    if (typeof window.SceneManager?.reset === "function") {
      window.SceneManager.reset();
    }
    gameLoop();
  }

  // 8. Show start screen, hook up button
  if (window.UI && typeof window.UI.showStartScreen === "function") {
    window.UI.showStartScreen(startGame);
  } else {
    // Fallback: start game immediately
    startGame();
  }
});