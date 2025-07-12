// ====== ui.js ======
// Handles UI rendering: journal, dialogue, start screen, and overlays

(function() {
  // Utility to get DOM elements
  function $(id) { return document.getElementById(id); }

  // --- Journal UI ---
  window.UI = {
    updateJournal: function(clueIds) {
      const journal = DATA.clues.filter(cl=>clueIds.includes(cl.id) && !cl.hidden);
      const list = $("journal-list");
      list.innerHTML = '';
      journal.forEach(clue => {
        const li = document.createElement('li');
        const t = document.createElement('div');
        t.className = 'clue-title';
        t.textContent = clue.title;
        li.appendChild(t);
        const d = document.createElement('div');
        d.textContent = clue.description;
        li.appendChild(d);
        list.appendChild(li);
      });
    },

    revealHiddenClue: function(clueId, clueIds) {
      // Used to make hidden clues visible in the journal when found
      let clue = DATA.clues.find(c => c.id === clueId);
      if (clue && clue.hidden) {
        delete clue.hidden;
        if (!clueIds.includes(clueId)) clueIds.push(clueId);
        this.updateJournal(clueIds);
      }
    },

    // --- Dialogue UI ---
    showDialogue: function(dialogueTree, nodeKey, onOption) {
      const overlay = $("dialogue-overlay");
      overlay.innerHTML = '';
      overlay.classList.remove('hidden');

      const node = dialogueTree[nodeKey];
      if (!node) {
        overlay.classList.add('hidden');
        return;
      }
      // Build dialogue box
      const box = document.createElement('div');
      box.className = 'dialogue-box';

      if (node.speaker) {
        const speaker = document.createElement('span');
        speaker.className = 'dialogue-speaker';
        speaker.textContent = node.speaker;
        box.appendChild(speaker);
      }
      const text = document.createElement('div');
      text.className = 'dialogue-text';
      text.textContent = node.text;
      box.appendChild(text);

      // Dialogue options
      if (node.options && node.options.length) {
        const opts = document.createElement('div');
        opts.className = 'dialogue-options';
        node.options.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'dialogue-option-btn';
          btn.textContent = opt.text;
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            onOption(opt.next, node.clue || null);
          });
          opts.appendChild(btn);
        });
        box.appendChild(opts);
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dialogue-option-btn';
        btn.textContent = "Close";
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          overlay.classList.add('hidden');
        });
        box.appendChild(btn);
      }
      overlay.appendChild(box);
    },

    hideDialogue: function() {
      $("dialogue-overlay").classList.add('hidden');
      $("dialogue-overlay").innerHTML = '';
    },

    // --- Start Screen ---
    showStartScreen: function(onStart) {
      const screen = $("start-screen");
      screen.style.display = '';
      $("start-btn").onclick = function() {
        screen.style.display = 'none';
        onStart();
      };
    },

    hideStartScreen: function() {
      $("start-screen").style.display = 'none';
    },

    showCluePopup: function(clue, cb) {
      // Show a temporary overlay with clue info
      const overlay = $("dialogue-overlay");
      overlay.innerHTML = '';
      overlay.classList.remove('hidden');
      // Reuse dialogue box style
      const box = document.createElement('div');
      box.className = 'dialogue-box';
      const title = document.createElement('span');
      title.className = 'dialogue-speaker';
      title.textContent = clue.title;
      box.appendChild(title);
      const desc = document.createElement('div');
      desc.className = 'dialogue-text';
      desc.textContent = clue.description;
      box.appendChild(desc);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dialogue-option-btn';
      btn.textContent = 'Add to Journal';
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        overlay.classList.add('hidden');
        if (cb) cb();
      });
      box.appendChild(btn);
      overlay.appendChild(box);
    }
  };
})();