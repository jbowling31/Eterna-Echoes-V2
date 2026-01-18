// Auto-generated from Eterna Echoes V2 Chapter 1.docx
// Cleaned + unlock-timing fixes (Sirenia unlocks after ch01_b01 at start of 1:2; Solen unlock moved to ch01_b07_rewrite_sandbox; optional showRewards hints)
export const CH01 = {
  "id": "ch01",
  "title": "Chapter 1",
  "start": "1:1",
  "completeOnBattleId": "ch01_b10_herald_loopboss",
  "unlocks": {
    "start": [
      "vireon"
    ],
    "battles": {
      "ch01_b01_ember_guardian": [
        "sirenia"
      ],
      "ch01_b02_tidewake_rush": [
        "caelum"
      ],
      "ch01_b03_gale_sweep": [
        "morgrin"
      ],
      "ch01_b04_spore_beast_ambush": [
        "thalor"
      ],
      "ch01_b05_mirror_mimics": [
        "arlen"
      ],
      "ch01_b07_rewrite_sandbox": [
        "solen"
      ]
    }
  },
  "segments": {
    "1:1": {
      "id": "1:1",
      "title": "A Call Through the Ember (Full Cinematic Dialogue)",
      "bg": "bg_obsidian_glyph_hall",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "Cracked obsidian stones glow under your feet. The world is dark, warm, smoldering — like the heart of a dying star. A summoning sigil begins to pulse. A flaming glyph spins in the air as your touch activates it."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "“Summoning Link Stabilized. Heroic Signature Detected: FIRE – SENTINEL.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A blast of red flame explodes from the glyph. Smoke parts as VIREON steps through, molten cracks glowing on his obsidian armor. He stares down at you, sword drawn, then slowly sheathes it.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "\"...A Summoner? No... You’re too young. Too... unscarred.\"",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He plants his tower shield into the ground.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "\"Where is the Keep? Where are my men?\"",
          "portrait": "hero:vireon"
        },
        {
          "t": "choice",
          "id": "ch01_choice_01_greeting",
          "prompt": "How do you greet Vireon?",
          "options": [
            {
              "value": "silent",
              "label": "(Say Nothing)"
            },
            {
              "value": "need_help",
              "label": "“You’re the first one. I need your help.”"
            },
            {
              "value": "late",
              "label": "“You're late. The world's falling apart.”"
            }
          ]
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Regardless of choice, Vireon tilts his helmet slightly, measuring you.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "\"Hmph. I thought your kind were stories told around dying fires. Ghosts of old wars... not some kid with a glowing rock.\"",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He turns, surveying the burning ruins around you.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "\"This battlefield... I've bled here before.\"",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "\"I found the glyph in the ruins. It led me here. I didn’t expect—this.\""
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You gesture at the ashes, the wind, the looming darkness.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "\"You’re not a story. Not anymore.\""
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A screech echoes in the distance. Black, shifting forms crawl out of the smoke.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "\"The Shroud returns.\"",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He lifts his molten sword, flames licking the blade's edge.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "\"Good. I was starting to think this was all a dream.\"",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "\"Can you fight?\""
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "\"Can you watch?\"",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He slams his shield into the ground. Fire pulses outward.)"
        },
        {
          "t": "battle",
          "battleId": "ch01_b01_ember_guardian",
          "label": "⚔️ BATTLE BEGINS: VIREON VS. SHROWDSPAWN x3",
          "showRewards": true,
          "rewardsId": "ch01_b01_ember_guardian",
          "packId": "ch01_b01_ember_guardian"
        }
      ],
      "next": "1:2"
    },
    "1:2": {
      "id": "1:2",
      "title": "The Tide’s Whisper",
      "bg": "bg_ruins_water_garden",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "A sacred spring stirs. A new presence joins the fray, and she remembers… just a little too much."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "The battle just ended. You and Vireon stand at the edge of a glowing pool. Steam rises gently. Strange ripples drift across the surface — but there’s no wind."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "You place your hand over the water. It pulses in response."
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The glyph changed. New energy... calmer than fire. But just as ancient. It’s calling someone else.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "...Will they trust me like Vireon did?",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "“Summoning Link Stabilized. Heroic Signature Detected: WATER – ORACLE.”",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A whirlpool swirls up from the pool’s surface. Mist coils. A figure emerges, walking gently across the water, her cloak drifting like kelp in a slow tide.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“…This place again.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(She blinks slowly, eyes distant, like watching a dream from behind glass.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“You opened the circle. That makes you the Summoner, I assume?”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“She speaks as though she’s seen this.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He grips his shield, uneasy.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Priestess. You know this battlefield?”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Only in dreams that vanish when I wake. But you… all of you... appear often.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(She steps down onto solid ground. A faint ripple follows her feet.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Today, it feels clearer. Like this time, something might change.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“I summoned you because the Shroud is growing. And I can’t face it alone.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You glance toward the horizon — shadowy figures shimmer in the haze.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“If you’ve seen this before, help me stop it from repeating.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A soft smile.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Wise words for a novice. Or perhaps you’ve said them before as well?”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(She raises her coral staff, glowing with waterlight.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Let’s draw back the tide — and see what remains.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Behind you, dark water-borne Shroud creatures rise. Their bodies shift, half-formed, eyes glowing like barnacles.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Shroudspawn, emerging from the shallows. More than before.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He readies his shield.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Priestess — if your dreams have shown you the battle, I trust you know how to win it.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“No battle is ever won in a loop. But this is where we begin.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(She gestures forward. The spring behind her begins to churn.)"
        },
        {
          "t": "battle",
          "battleId": "ch01_b02_tidewake_rush",
          "label": "⚔️ BATTLE BEGINS: TIDAL DEFENSE",
          "showRewards": true,
          "rewardsId": "ch01_b02_tidewake_rush",
          "packId": "ch01_b02_tidewake_rush"
        }
      ],
      "next": "1:3"
    },
    "1:3": {
      "id": "1:3",
      "title": "A Wind That Knows",
      "bg": "bg_forest_wind_trail",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "He arrives mid-spin, mid-sentence, and mid-attitude. But even the breeze remembers... something."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "You, Vireon, and Sirenia stand on a cliffside path overlooking a ruined battlement. Broken towers lie scattered, torn apart by time and wind. The air shifts strangely—there’s a presence riding the gust."
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "This glyph feels… different. Quicker. Sharper. Like it’s already moving before I summon.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Wind doesn’t wait for permission.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "“Summoning Link Stabilized. Heroic Signature Detected: WIND – DUELIST.”",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A sudden gust cuts through the cliffside. Dust and petals whirl violently into a spiral. Then—Caelum drops from midair, landing in a flashy crouch with his blades outstretched.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Annnd I stick the landing. Hello, Summoner. Nailed it on the first try.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He rises with a grin, scarf fluttering.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“So... who do I stab first?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“You appear unarmed in both caution and respect.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Oh no, I packed plenty of both. I just left them in my other pants.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Caelum spins one blade in his fingers as he eyes Sirenia.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“You must be the wave priestess. Gorgeous and mysterious — classic combo. Do I get a prophecy, or just the silent treatment?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“You’ll get a concussion if you keep flirting mid-battle.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(She steps aside.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Though... your face does seem oddly familiar.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Seriously?” (He scratches his head.)",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“I thought I was imagining that. Déjà vu…? Or maybe I’m just that good-looking it loops reality.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“We’ve faced the Shroud here before. I think. At least, the glyph brought us here again.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You point to the swirling glyphstone in the ground, still faintly pulsing with wind energy.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“I don’t know why, but I need you. Now.”"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Well hey, you’re pretty direct for a summoner. I like that.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He flips a blade up and catches it lazily.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Alright. Wind's ready. Let’s dance.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A sudden howling fills the cliffs. Shroud Flyers descend from the ruined battlement, wings snapping like broken banners. Their shrieks cut through the wind.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“They’re airborne. My shield won’t reach that high.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“They strike fast. Too fast for me to redirect.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Then it’s my time to shine.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He steps forward, blades crossed, wind already swirling around him.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Try to keep up, old-timers.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "battle",
          "battleId": "ch01_b03_gale_sweep",
          "label": "⚔️ BATTLE BEGINS: SHROUD FLYERS",
          "showRewards": true,
          "rewardsId": "ch01_b03_gale_sweep",
          "packId": "ch01_b03_gale_sweep"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The final Flyer crashes to the earth, dissolving into smoky feathers. Caelum sheathes both blades in one clean motion.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Well, that was fun. Except for the part where I got bit in the same spot as last time.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He freezes slightly.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“…Wait. What?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“So you felt it too.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Another coincidence? Or another sign?”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "They're starting to notice. The memories are leaking through.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "But I'm still the only one who doesn't remember anything clearly.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "A quieter, lore-driven section. Vireon confronts a mural of himself, and the party reflects on a war that feels like it never ends. The loop will echo more loudly there.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Let me know if you’d like:",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "More jokes or sass from Caelum",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The player to speak more confidently",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Foreshadowing to hit harder",
          "tone": "inner"
        }
      ],
      "next": "1:4"
    },
    "1:4": {
      "id": "1:4",
      "title": "Back at the Keep",
      "bg": "bg_old_keep_gate",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "Cracked stone. A scorched mural. Familiar footsteps echo in halls long ruined."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "The party approaches the Old Keep, a crumbling fortress now buried beneath overgrowth and fog. The battle has paused — no enemies in sight. Just silence, and the occasional flicker of phantom torchlight."
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "This place feels… quieter. Heavier. Like the stone remembers what the people don’t.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "I didn’t plan to bring them here. But it’s where the glyph led.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The group steps into the Keep’s shattered outer hall. Vireon slows his pace as they approach a scorched mural on the far wall.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“…This wasn’t supposed to be here.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He walks up to the mural — a phoenix-shaped shield, cracked down the center. A knight in obsidian armor stands at its center, flanked by fading figures.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“I fought in this Keep. But this painting… it shouldn’t exist. It was destroyed in the fire.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Well, maybe it looped back in. Time loves a good sequel.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He squints at the mural.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Wait… is that you?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“I—yes. But... older. Worn.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He stares into the cracks of the painted face.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“This is the battle I died in.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Yet here you stand. Whole. Speaking to your reflection.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Her voice softens.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Time is folding in on itself again. The echoes grow louder.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Okay, so we’ve got spooky ruins, undead paintings, and a time loop we’re half pretending doesn’t exist. Anyone else thinking we might be the problem?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“I didn’t choose to come here. The glyph... it brought us.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You glance around — the stone hums faintly, like it’s waiting for something.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“It’s like the world wants us to remember.”"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Or wants to remind us that we’ve failed before.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Vireon places his hand on the mural. His gauntlet glows faintly — then the light fades.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Either way, we face the same war. Until we end it, or it ends us.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A faint sound — like distant footsteps — echoes through the empty halls.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "I don’t know why this place feels like it’s watching us.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "But I know one thing — that mural was painted for someone to see.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "And now, we’ve seen it.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "⚔️ NO BATTLE – STORY ONLY SCENE",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "This is a worldbuilding & foreshadowing section, meant to:",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Deepen Vireon’s personal mystery",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Tease that events are repeating differently",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Create tension through an otherwise “peaceful” scene",
          "tone": "inner"
        }
      ],
      "next": "1:5"
    },
    "1:5": {
      "id": "1:5",
      "title": "Spores in the Earth",
      "bg": "bg_fungal_forest_core",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "Not all things that grow are meant to live forever. Some take root in time itself."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "The party moves into the Verdwood Hollow, a dense forest where the trees bend in unnatural spirals and glowing spores drift through the air. The ground pulses beneath your feet like it's breathing."
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "This glyph didn’t lead to fire, or water, or wind… it led underground. Like it’s digging.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The forest is wrong. Too still. And the light doesn’t touch the ground.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(As the group moves deeper into the hollow, moss creeps up Vireon’s shield. Sirenia brushes spores off her robe. Caelum sneezes — loudly.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Ugh, this place is like a nightmare I had after eating too much root stew.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“The air is dense with memory. You feel it too, don’t you?”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“I feel something growing... and watching.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You place your hand over a knotted glyph-stone embedded in the bark of a dead tree. The moss recoils, then twists inward. A massive root lifts from the ground — and from it, MORGRIN rises, wrapped in vines and spores.)"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“...And so the Summoner digs deeper.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(His voice cracks like wood splitting. Mushrooms bloom along his arms.)"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Again.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“You… know me?”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You instinctively take a step back as the ground shifts beneath your boots.)"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Oh yes. I've been summoned by you in cycle after cycle. You always come here. Always too late. Always too hopeful.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He leans in slightly — his bark-covered face expressionless.)"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“I thought you'd learn by now. But you never do.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Okay, nope, I’m out. Creepy root wizard is giving me existential fungus.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He actually starts walking away — Sirenia pulls him back.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“He remembers. Like me. But his memory is buried under decay.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“You speak in riddles, creature. What do you know of the Shroud?”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“The Shroud? A symptom. The loop? A disease. And me? I’m the mold growing in its cracks.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(His staff pulses, roots spreading from its base like fingers.)"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“But if you want my strength, Summoner… I’ll give it. I always do. Even when I don’t want to.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "He’s speaking like we’ve done this exact conversation before. Word for word.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "...Am I the only one who still doesn’t remember it?",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Suddenly, the ground erupts as twisted forest beasts emerge — part vine, part Shroudspawn. Their eyes glow with fungal spores.)"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Ah. Here come the reminders.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "battle",
          "battleId": "ch01_b04_spore_beast_ambush",
          "label": "⚔️ BATTLE BEGINS: SPORE BEAST AMBUSH",
          "showRewards": true,
          "rewardsId": "ch01_b04_spore_beast_ambush",
          "packId": "ch01_b04_spore_beast_ambush"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The battlefield is quiet. The spores begin to settle. Morgrin leans on his staff.)"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Same shapes. Same outcomes. The forest forgets nothing. But you… you forget everything.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Yeah well, maybe I want to forget whatever creepy fungus picnic this was.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Still… we won. That’s something.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“For now.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "He spoke like I always summon him.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "But I don’t remember this forest.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Or him.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "...Or what comes next.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Morgrin to have more lore-drop lines",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The forest to be more visually described",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "A hidden glyph or symbol the player notices mid-battle",
          "tone": "inner"
        }
      ],
      "next": "1:6"
    },
    "1:6": {
      "id": "1:6",
      "title": "Duality in Water",
      "bg": "bg_mirror_lake_temple",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "When you gaze into the reflection, what stares back may not be someone else."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "A mist-covered lake at dusk. The water is so still, the sky above seems trapped beneath your feet. Half-ruined pillars rise from the lake, their reflections perfect despite the age."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "The glyph glows atop a platform at the lake’s center, suspended just above the surface like it’s resting on glass."
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "This glyph doesn’t pulse like the others. It waits.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Like a breath held in a mirror.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Like it’s not summoning someone… it’s calling someone home.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You step onto the platform. A ripple spreads across the lake. A mirrored glyph lights up beneath the surface — and a shimmering knight rises from it.)"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "“Heroic Signature Detected: WATER – MIRROR WARDEN.”",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“You stand where I’ve stood. You speak as I once did.”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(His armor glistens like polished glass, reflecting the faces of the entire party in ghostly fragments.)"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“So tell me, Summoner… are you my creator, or my echo?”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“This one speaks in riddles too.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Please no more creepy time-talk. Can we get just one hero who says ‘Hello, I’m here to stab things’?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“No. He’s different. He isn’t just remembering. He’s… mirroring.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Thalor slowly raises his sword, not at the enemies... but at you.)"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“Step left.”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You instinctively do — and he does, perfectly in time.)"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“Raise your hand.”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You obey again. He mirrors it.)"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“I’ve been watching you… through every cycle. Every choice. You’ve made them all before. Even this one.”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“You know me? You’ve seen me before?”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Your voice cracks a little.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“What are you? What am I?”"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“A reflection sharpened into a blade. And you? You’re not what you think.”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He tilts his head, unnervingly calm.)"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“Let me prove it. Let me fight you. Not to win — but to reveal.”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Suddenly, your glyph pulses violently. From the mirrored lake, enemies rise — twisted, glowing mirror-versions of your past fights: distorted Shroudspawn mimicking your team’s forms.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“They wear our shapes…”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“They're us. Almost.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Okay, nooope. I didn't sign up to fight my face.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Thalor didn’t come to fight beside us.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "He came to hold up the mirror.",
          "tone": "inner"
        },
        {
          "t": "battle",
          "battleId": "ch01_b05_mirror_mimics",
          "label": "⚔️ BATTLE BEGINS: MIRROR MATCH",
          "showRewards": true,
          "rewardsId": "ch01_b05_mirror_mimics",
          "packId": "ch01_b05_mirror_mimics"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(As the final reflection shatters into mist, Thalor steps forward, planting his sword in the ground.)"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“You are not their first Summoner. Nor their last.”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He turns to face you fully — his mirrored visor briefly shows your own face.)"
        },
        {
          "t": "line",
          "speaker": "Thalor",
          "text": "“You are in the loop. You just haven’t looked in the right direction.”",
          "portrait": "hero:thalor"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "That reflection…",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "...That was me.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The lake quiets. The glyph dims. But the surface still holds your image, staring back longer than it should.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "A breather. Banter, bonding, sarcasm, and maybe a few uncomfortable truths come out as the group camps together. We’ll give everyone a moment to process what’s happened — and argue hilariously while doing it.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Let me know if you want:",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "More intense psychological mirroring from Thalor",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The player to speak more during the post-battle moment",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "One of the other heroes to react badly to seeing their mirror form",
          "tone": "inner"
        }
      ],
      "next": "1:7"
    },
    "1:7": {
      "id": "1:7",
      "title": "Campfire Conversations",
      "bg": "bg_forest_campfire_night",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "Rest is rare. Reflection is rarer. But sometimes, all it takes is one night around a fire for things to crack."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "The group finds a clearing just beyond the lake. Night falls unnaturally fast. A fire is lit. Someone — likely Caelum — brought snacks (or \"borrowed\" them from a ruined village). There’s laughter, sarcasm, tension… and silence in between."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Camera pans slowly across the fire. Everyone is seated in a loose circle — weapons nearby, but relaxed. The mood is light, but the shadows flicker just a little too long.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Okay, real question: if we’re supposedly legendary summoned warriors… why does my back hurt like I’ve been sleeping on a tree root for 900 years?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Because you have been sleeping on a tree root.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“…Oh. That explains it. Ow.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Sleep doesn't come easy when time knots itself like an old fisher’s net.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Cool metaphor. Still hurts though.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(From the shadows)",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Pain is just memory you haven’t buried deep enough.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Did… did the forest just say that? Are we sleeping near haunted mulch?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“He’s over there, Caelum. Not in the dirt.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Not helping, stone knight. Not helping.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Everyone chuckles lightly — even Thalor, who leans back silently against a stone pillar, watching the flames dance in his blade’s reflection.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“You’re a strange group. But you work.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You gaze around the fire. Faces illuminated. Some calm. Some wary.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“We’ve fought in sync. Trusted each other without meaning to.”"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“Almost like… we’ve done this before.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Silence. It lands heavier than it should. Even the fire crackles more slowly.)"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Softly)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“Not ‘almost.’ We have.”"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Oh here we go again. Can we not spiral into another cryptic loop rant while I’m trying to toast bread on a stick?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“It’s not ranting if it’s true.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Every loop burns this moment into the bark. I’ve seen this campfire 300 times. You always drop the bread.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Holding the stick)",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“No way. No freaking way—”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(His bread falls into the fire. Everyone stares.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“…Okay what. What the hell?!”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“This is nonsense. The past cannot repeat itself like theatre.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“And yet we play our roles so well.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Sirenia suddenly looks at you.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“You don’t remember, do you?”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Her tone is gentle. Not accusing. Just sad.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Not the first summon. Not the last fight. Nothing.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“No.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Beat.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“But I think I’m starting to feel it.”"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "⚔️ NO BATTLE – STORY ONLY SCENE"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Scene ends with camera pulling up — the fire flickering as embers rise into the night. One ember floats higher than the rest… then freezes mid-air for a fraction too long before flickering out.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "More humor or \"slice-of-life\" moments added to the campfire"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Custom dialogue based on who the player brought to this point"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "A secret interaction (e.g., if only certain characters are present)"
        }
      ],
      "next": "1:8"
    },
    "1:8": {
      "id": "1:8",
      "title": "Assault on the Shroud Nest",
      "bg": "bg_shroud_nest_entry",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "If the world is a script, the Shroud is what happens when someone keeps editing the same sentence into madness."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "The party approaches a vast, cratered ruin. The ground is covered in black veins and twisting rootlike corruption. The glyph pulses wildly, but not from a summoning — it’s reacting to something within the ruin. Something old. Something repeating itself too hard."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The group surveys the entrance to the nest: an open wound in the earth, pulsing with a dull green light.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Shield up. We breach together.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“You can’t shield a concept, knight. This place is rot and metaphor.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“...Okay but hear me out: What if we just don’t go in there and instead pretend we did and go eat something?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He gestures toward a broken supply cart nearby.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“They’ve got apples. And like... slightly cursed bread.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Suddenly, a scroll ignites midair. Sparks swirl. A glowing sigil forms above you. A man in ember-lined robes materializes — ARLEN, floating slightly off the ground, calmly writing midair.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Late again. You always hesitate at the entrance. Caelum cracks a joke. Morgrin waxes fungal. Sirenia pretends not to dread what’s inside.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Ugh. Another creepy one.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Oh, no. I'm worse. I'm accurate.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He adjusts his monocle, quill scribbling on an invisible page.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“I’ve rewritten this assault twelve times. Each time ends in fire, failure, and someone losing a limb they liked. But this time… there’s a glitch.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He points directly at you.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“You didn’t bring the same team this time.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“You know what’s happening here. Like Thalor. Like Morgrin.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You step toward him, firm.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“Tell me what this place is. What it wants.”"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“It doesn’t want anything. It just is. The Nest is what happens when something forgets how to die.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He unrolls a flaming scroll. The air quivers.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“And if we don’t kill it together — again — it learns. It changes.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Then let’s be the ones who change first.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Watch for the brood calls. They sing in triplets. It’s never just one wave.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Oh good. An intelligent swarm. Love that for us.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The Nest lets out a low, humming growl. The very stones vibrate.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Positions. For the Summoner — and for the world.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "They’re remembering more with every fight. And I’m still behind.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "But not for long.",
          "tone": "inner"
        },
        {
          "t": "battle",
          "battleId": "ch01_b06_shroud_nest_core",
          "label": "⚔️ BATTLE BEGINS: THE SHROUD NEST",
          "showRewards": true,
          "rewardsId": "ch01_b06_shroud_nest_core",
          "packId": "ch01_b06_shroud_nest_core"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(As the final broodmother collapses into ash, the Nest begins to crumble. Arlen floats down gently, his scrolls slowly extinguishing.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Well done. That went… marginally better than last time.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“There was a last time?! How many times have I died? Don’t answer that.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“What was that power you used mid-fight? That flame scroll — it rewound our injuries.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“I rewrote the moment. Fire is just another form of editing.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“If you’ve seen this battle over and over… why help us now?”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(smirks)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“Because this is the first time you asked the right question.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He turns and walks into the smoke, leaving faint glowing glyphs in the air behind him. One of them lingers — a symbol you’ve seen before, flickering during your first summon.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "What did I do differently this time?",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Why am I the variable?",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Arlen to be more cryptic and condescending",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The player to start becoming more assertive or disturbed",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Loop rules to start forming more clearly now",
          "tone": "inner"
        }
      ],
      "next": "1:9"
    },
    "1:9": {
      "id": "1:9",
      "title": "Fire That Writes",
      "bg": "bg_red_sky_plateau",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "What if fire wasn’t for destruction — but for revision?"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "After the Shroud Nest collapses, the group regathers atop a scorched ridge. Glyphs still shimmer in the air from Arlen’s exit, but he reappears before them — already mid-sentence, as if he never left."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A scroll unfolds midair with a snap. Arlen steps from behind it like it was a curtain.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Well. That went slightly less tragically than loop 37.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He adjusts a flame-glyph monocle that wasn’t there a moment ago.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Let’s not press our luck.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Okay, someone tell me why the hot librarian is narrating my life?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“You say that as though it isn’t happening.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“You didn’t just fight alongside us. You rewrote events.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“I corrected poor storytelling. That poison debuff was lazy writing.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“You keep talking like this is a story. Like we’re written.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You step forward.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“Then who’s the author?”"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Hmm.” (He smirks.)",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Well it used to be someone else. But lately?”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He points his quill — at you.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Looks like it’s you.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The air behind him begins to shimmer. A minor Shroud breach opens — unstable and dangerous.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“This incursion’s wrong. Out of order. A continuity leak.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He unfurls a scroll. Glyphs spiral around his arm.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Let’s fix the pacing, shall we?”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Enemy forms lurch from the rift — twisted, glitching, repeating movement animations. They stutter. Some enemies appear mid-attack stance.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“They’re… broken.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Worse. They’re remembering the last fight… and trying to redo it.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Cool cool cool, so we’re not just fighting monsters anymore. We’re fighting bad editing.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "And Arlen’s the only one who can correct the script…",
          "tone": "inner"
        },
        {
          "t": "battle",
          "battleId": "ch01_b07_rewrite_sandbox",
          "label": "⚔️ BATTLE BEGINS: THE REWRITE",
          "showRewards": true,
          "rewardsId": "ch01_b07_rewrite_sandbox",
          "packId": "ch01_b07_rewrite_sandbox"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(As the final glitch creature fizzles out, the air stabilizes. Arlen floats slightly off the ground again, scroll glowing dimly.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“There. Better. Continuity stabilized. For now.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He closes the scroll — it burns up midair.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Arlen… how long have you been in this loop?”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Oh, let’s see… how do you count versions that were deleted?”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He taps his chin.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“I’d say long enough to get bored. And yet... this time, I stayed.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Why? What makes this version so special?”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Arlen looks to you. Dead serious.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“The Summoner remembered a different question.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He steps back into the flame-sigil.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“That’s all it takes to start a new draft.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He vanishes again, mid-blink.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "A different question.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "I don’t know what I changed.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "But he’s right.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Something’s writing itself differently now.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Arlen to drop a cryptic reference to the villain",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "More visual glitching in the enemies",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The player to question whether they’re causing the loop",
          "tone": "inner"
        }
      ],
      "next": "1:10"
    },
    "1:10": {
      "id": "1:10",
      "title": "Rising Flame, Falling Shadow",
      "bg": "bg_ashroad_crater_peak",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "When the fire burns brighter than the loop, you get Solen."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "The party marches along a shattered mountain pass — the Ashroad, once a sacred trail, now overrun with Shroud corruption. As they reach the summit, the path ahead collapses from a blast of energy."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "Everything halts. Silence. Then… flame."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A streak of fire shoots across the sky like a meteor. It crashes into the cliffside. The earth trembles. Everyone shields their eyes as a blazing figure emerges from the smoke.)"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "“Heroic Signature Detected: FIRE – EMBER LANCE.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Solen walks through the fire like it’s warm rain — armor glowing from within, spear sizzling against the ash-covered ground.)"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“Hope you weren’t planning to win without me.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He twirls the ember lance over one shoulder with one hand. Casual. Too casual.)"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Okay, nope. Too hot. Too dramatic. We already have one fire guy. Me. I'm the cool one here.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Do you always enter like an angry comet?”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“Only when summoned incorrectly. I was supposed to appear during the final blow of a boss fight, not before it. Very sloppy, Summoner.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“I didn’t summon you. The glyph activated on its own.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You glance back — the glyph is flickering… unstable.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“It’s like the world forced you in.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(His tone shifts just slightly.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“…Interesting.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He tilts his helmet.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“Maybe it knows it needs firepower now more than ever.”"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Or maybe it’s reacting to something it remembers burning here before.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Suddenly, the air twists. A Shroud Elite emerges — this one armored, intelligent, and seemingly unaffected by your team’s elemental strength.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“That’s a Warden-class. We’ve faced it before — but not here.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“It’s adapting... It’s remembering, too.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“Then we burn it in new ways.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He slams his lance into the ground. A fire glyph erupts around him.)"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“I’m not here to participate. I’m here to delete.”",
          "portrait": "hero:solen"
        },
        {
          "t": "battle",
          "battleId": "ch01_b08_shroud_warden_boss",
          "label": "⚔️ BATTLE BEGINS: SHROUD ELITE – FLAME RESISTANT",
          "showRewards": true,
          "rewardsId": "ch01_b08_shroud_warden_boss",
          "packId": "ch01_b08_shroud_warden_boss"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The Elite cracks and crumbles. Solen pulls his lance free with a satisfied snort.)"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“See? Told you. Burned just enough to matter.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Ugh. I hate how cool that was.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“Reckless, but effective.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“The flames changed mid-fight… as if reacting to your intent.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“Why were you summoned early, Solen? What triggered it?”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You look him in the eye. He actually hesitates.)"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“I don’t know. That’s what bothers me.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He turns away, looking back at the glyph stone, now cracked and burned out.)"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“Maybe the world’s skipping pages. Or maybe… someone else is editing now.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Solen walks off ahead, flames still trailing behind him.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The glyphs aren’t just responding to me anymore.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "They're anticipating.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "More fire-flirting between Solen and other party members",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "The player to begin sensing they’re not alone in controlling the glyphs",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "A visible UI flicker or symbol hint during the boss fight",
          "tone": "inner"
        }
      ],
      "next": "1:11"
    },
    "1:11": {
      "id": "1:11",
      "title": "Echoes in the Sky",
      "bg": "bg_skyvein_platforms",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "When the sky forgets how to move, even silence starts to scream."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "After the Shroud Elite’s defeat, the party travels a high ridge known as the Skyvein, a floating trail of islands suspended in midair. The path pulses gently underfoot with glyph energy, drawing the group toward a portal point."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "Clouds stop moving. Wind ceases. Even birds hang mid-flight — not flapping, just frozen."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The group walks across a hovering platform. No sound but boots on stone.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“The wind has stopped. Even my armor feels… heavier.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Nope. Nope nope nope. Clouds are not allowed to be paused. This is glitch horror movie stuff.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“It’s not a pause. It’s a fracture.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(She raises her hand — her water magic pulses once… then ripples outward and disappears like it hit a wall.)"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“The world isn’t still. It’s trying to remember what comes next.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(A sudden pulse hits the screen — and for a full five seconds, everything freezes. UI elements vanish. Even the player cursor disappears.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "What is this? A memory? A malfunction?",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Suddenly — a new UI symbol flashes. Not one you’ve seen before. Just for a moment: ⟳)"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(It flickers. Disappears.)"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“What was that glyph just now?”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(appearing mid-air)",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“Unscheduled recursion. A loop within a loop. This shouldn’t be happening yet.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Did he just say ‘yet’? Don’t say ‘yet!’”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“The ground beneath the loop is crumbling. Every memory repeats faster. The gaps are closing.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The air tears open above the group. A rift reveals dozens of half-formed enemies repeating their spawn animations — but never finishing. They twitch and loop, caught in eternal pre-battle.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“They're not enemies. They're echoes. Leftover scripts with no narrator.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“What happens if we walk away?”"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“…Then we forget this moment. Again.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He gestures toward the rippling rift.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“Or we fight the glitch. Make it remember us.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "battle",
          "battleId": "ch01_b09_memory_fragments",
          "label": "⚔️ BATTLE BEGINS: BROKEN SCRIPT ENCOUNTER",
          "showRewards": true,
          "rewardsId": "ch01_b09_memory_fragments",
          "packId": "ch01_b09_memory_fragments"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The final echo fades — not dying, but being overwritten. The world shakes — then resumes, like nothing happened.)"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“It’s not just memories bleeding through. It’s timelines.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“Good. Maybe the timeline’ll show us who caused this.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“Or who benefits from letting it continue.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Not it. Too handsome to be evil.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“The glyph responded to me. For a second… I saw something. A new symbol.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(You look at your hand — briefly, a faint echo of the ⟳ mark glows, then fades.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“Am I becoming part of the loop?”"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“You were always part of the loop. The question is… how long have you been the cause?”",
          "portrait": "hero:arlen"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Silence. Then a wind finally returns — unnaturally cold.)"
        }
      ],
      "next": "1:12"
    },
    "1:12": {
      "id": "1:12",
      "title": "Loop Zero",
      "bg": "bg_loop_core_throneroom",
      "beats": [
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "The end is the beginning. You just forgot how many times."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "At the peak of the Skyvein, the glyph flares violently. A structure stands ahead — not quite a temple, not quite a throne. Floating stones circle a dark portal. From it steps a humanoid figure cloaked in living shadow: the Shroud Herald."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "Their body flickers, made of fragments. Their voice is wrong — it echoes inside your mind, not your ears."
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The portal crackles. The Herald steps through. The world dims.)"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "“WARNING: Loop Core Proximity Detected.”"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Ah. This one again.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“You’ve seen it before?”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Morgrin",
          "text": "“Not with these eyes. But the roots remember.”",
          "portrait": "hero:morgrin"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The Herald raises one hand — the glyph at your side dims.)"
        },
        {
          "t": "line",
          "speaker": "Shroud Herald",
          "text": "“You brought them again. The same champions. The same questions.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Their head tilts.)"
        },
        {
          "t": "line",
          "speaker": "Shroud Herald",
          "text": "“You never learn, Summoner.”"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“Okay, bad guy just called us recycled content. Rude.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "Sirenia",
          "text": "“No. Not rude. Right.”",
          "portrait": "hero:sirenia"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“You know me?”"
        },
        {
          "t": "line",
          "speaker": "Shroud Herald",
          "text": "“I know the shape of you. The choices you make. The way you hesitate. The guilt you carry.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(They lean forward, and for a flicker, your screen distorts — static over your vision.)"
        },
        {
          "t": "line",
          "speaker": "Shroud Herald",
          "text": "“Last time, you begged. The time before that, you ran. Shall we see what you do this time?”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(Combat stance is assumed. The glyph pulses in reverse — time around it warps visibly.)"
        },
        {
          "t": "line",
          "speaker": "Solen",
          "text": "“This one burns weird. Like it’s made of regret.”",
          "portrait": "hero:solen"
        },
        {
          "t": "line",
          "speaker": "Arlen",
          "text": "“No. It’s made of memory. Yours.”",
          "portrait": "hero:arlen"
        },
        {
          "t": "choice",
          "id": "ch01_choice_02_break_loop",
          "prompt": "What would you do to break the loop?",
          "options": [
            {
              "value": "fight",
              "label": "Fight it head-on."
            },
            {
              "value": "understand",
              "label": "Understand the loop first."
            },
            {
              "value": "control",
              "label": "Control it, even if it costs you."
            }
          ]
        },
        {
          "t": "battle",
          "battleId": "ch01_b10_herald_loopboss",
          "label": "⚔️ BOSS BATTLE BEGINS: SHROUD HERALD – LOOP GUARDIAN",
          "showRewards": true,
          "rewardsId": "ch01_b10_herald_loopboss",
          "packId": "ch01_b10_herald_loopboss"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The Herald stumbles backward, body glitching. They drop to one knee.)"
        },
        {
          "t": "line",
          "speaker": "Shroud Herald",
          "text": "“Even now… you fight like it matters. You still think this is the first time.”"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(They dissolve into black particles, spiraling upward into the portal. A low hum builds in the sky.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“It’s over.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "Caelum",
          "text": "“No… look at the sky.”",
          "portrait": "hero:caelum"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(The clouds begin to rewind. Literally. Time moves backward. Day becomes night. Night becomes morning. Your party turns — but cannot move.)"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "No. Not again.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "Not after all this—",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(WHITE FLASH.)"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "🎬 Soft Reset Cutscene"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "Scene:"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "You awaken again at the start of Chapter 1:1. Standing before the summoning glyph. It pulses softly.",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "VIREON (RE-ENTRY LINE):",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "PLAYER",
          "text": "“You... You're the Summoner? I thought you were a tale—”",
          "tone": "inner"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He hesitates. A long beat.)"
        },
        {
          "t": "line",
          "speaker": "Vireon",
          "text": "“…Strange. I feel like I’ve said this before.”",
          "portrait": "hero:vireon"
        },
        {
          "t": "line",
          "speaker": "NARRATION",
          "text": "(He looks at you. This time… just for a moment… his eyes glow with the ⟳ symbol.)"
        }
      ],
      "next": null
    }
  }
};
