// ====== data.js ======
// Game data: clues, dialogue, scene hotspots, etc.
// All data is accessible via window.DATA

window.DATA = {
  // Clue definitions
  clues: [
    {
      id: 'fabric',
      title: 'Scrap of Fabric',
      description: 'A torn piece of dark blue fabric, caught on the vault door. It smells faintly of expensive cologne.',
    },
    {
      id: 'keytag',
      title: 'Ceremonial Key Tag',
      description: 'A brass key tag inscribed: "Vault Ceremony, May 1947." Smudged fingerprint on the back.',
    },
    {
      id: 'footprint',
      title: 'Strange Footprint',
      description: 'A muddy footprint, unusually narrow with a pronounced heel. Not from any guard\'s shoe.',
    },
    {
      id: 'nervousness_clue',
      title: 'Guard\'s Nervousness',
      description: 'The night guard was visibly anxious when questioned—a sign he may be hiding something.',
      hidden: true, // Only appears if revealed in dialogue
    }
  ],

  // Scene Hotspots (for City Hall Vault)
  hotspots: [
    {
      id: 'fabric',
      x: 155, y: 240, radius: 32,
      label: 'Scrap of Fabric',
      clueId: 'fabric',
      type: 'clue'
    },
    {
      id: 'keytag',
      x: 425, y: 110, radius: 28,
      label: 'Ceremonial Key Tag',
      clueId: 'keytag',
      type: 'clue'
    },
    {
      id: 'footprint',
      x: 320, y: 320, radius: 30,
      label: 'Strange Footprint',
      clueId: 'footprint',
      type: 'clue'
    },
    {
      id: 'guard',
      x: 530, y: 355, radius: 38,
      label: 'Talk to Night Guard',
      type: 'npc',
      npcId: 'night_guard'
    }
  ],

  // Dialogue trees for NPCs
  dialogue: {
    night_guard: {
      initial: {
        speaker: "Night Guard",
        text: "Evening, Detective. I already gave my statement, but... if there's anything else?",
        options: [
          {
            text: "Ask about last night",
            next: "ask_night"
          },
          {
            text: "Confront about nervousness",
            next: "confront"
          },
          {
            text: "Leave",
            next: "end"
          }
        ]
      },
      ask_night: {
        speaker: "Night Guard",
        text: "I was making my rounds when I heard a noise from the vault. By the time I got here, the door was ajar. I didn't see anyone.",
        options: [
          { text: "Confront about nervousness", next: "confront" },
          { text: "Leave", next: "end" }
        ]
      },
      confront: {
        speaker: "Detective Alex",
        text: "You seem nervous, guard. Anything you want to tell me?",
        options: [
          { text: "Continue", next: "guard_confesses" }
        ]
      },
      guard_confesses: {
        speaker: "Night Guard",
        text: "Alright, alright! I... I took a nap, okay? I woke up when I heard the noise. Please, don't tell the chief.",
        clue: 'nervousness_clue',
        options: [
          { text: "Assure him", next: "end" }
        ]
      },
      end: {
        speaker: "Night Guard",
        text: "If you need anything else, Detective, I'll be right here.",
        options: []
      }
    }
  },

  // Starting scene
  scenes: {
    city_hall_vault: {
      id: 'city_hall_vault',
      name: 'City Hall Vault',
      background: 'vault', // used for drawing
      hotspots: ['fabric', 'keytag', 'footprint', 'guard']
    }
  }
};