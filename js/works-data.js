/* =====================================================================
   works-data.js
   ---------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT TO ADD WORK.

   Structure:  SECTIONS  ->  entries  ->  media

   - A SECTION is a big band on the page (Projects, Videos, Art, and
     later Music, Tools, Writing... just add another object).
   - An ENTRY is one showcase block inside that section. Entries stack
     vertically, so adding a second game is one more object in `entries`.
   - MEDIA is what the carousel cycles through inside an entry.

   Media types:
     { type:'image',   src:'path.png', alt:'...' }
     { type:'youtube', id:'VIDEO_ID',  alt:'...', thumb:'path.png' }
        -> thumb is optional; YouTube's own thumbnail is used if absent.
        -> the video only loads once clicked, so the page stays fast.

   Image paths are relative to the site root. Drop files in
   "works-assets/Projects/<slug>/". Anything missing shows a labelled
   placeholder instead of a broken image, so the page never looks broken
   while you're still gathering assets.
   ===================================================================== */

const SECTIONS = [

  /* =================================================================
     01 — PROJECTS
     ================================================================= */
  {
    id: 'projects',
    num: '01',
    title: 'Projects',
    blurb: 'Games, prototypes and interactive experiences.',
    entries: [
      {
        title: 'Puzzle-Metroidvania Game',
        titleAccent: '',
        tags: ['Unity', 'C#', 'Game Design', 'Level Design', 'Worldbuilding', 'Blender', 'Modeling', 'Character Sculpting', 'Texture Painting', 'Photoshop', 'Character Design', 'Concept Art'],
        description:
          'This is one of my most ambitious projects. It\'s an adventure-puzzle game with Metroidvania elements.\n\n' +

          'The game is set in an isolated underground world whose people believe the outside is ' +
          'just a myth. It\'s said that anyone who searches for it will meet the cruelest fate. Everyone ' +
          'is given a necklace at birth that grants a unique power, shaped by their deepest desire.\n\n' +

          'You play as the main character, who wants the truth and sets out to find it.\n ' +
          'Along the way you uncover the world\'s secrets, make friends and enemies, and gain new powers.\n '+

          'To progress you manipulate the objects around you. You mark an object with a power, then meet that power\'s conditions to activate it.\n ' +
          'Three powers so far: \n' +
          '[yellow]Teleportation[/]: mark two objects to instantly swap their places.\n' +
          '[red]Rebellion[/]: mark two objects and make them touch to trigger an explosion that opens doors, clears paths, or kills enemies\n' +
          '[violet]Sacrifice[/]: transfer the powers marked on one object to another that\'s out of reach\n\n' +

          'The project is currently on hold. I realised mid-development that it needs years of work ' +
          'and more skills than I have alone to reach the vision I had for it. '+ 
          'But finishing it is still the plan, once I have more resources or a team :)',

        meta: [
          ['My Role', 'Gameplay Programmer'],
          ['Engine',  'Unity'],
          ['Year',    '2025']
        ],
        cta:  { label: 'Play Demo', href: 'https://kissama.itch.io/unnamed-puzzle-game' },
        note: 'Try it\nout!',
        media: [
          { type:'youtube', id:'p8-qSDq9iXQ', alt:'Game Footage' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/image-1.jpg',
            alt:'Puzzle & Metroidvania game' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/image-2.jpg',
            alt:'Puzzle & Metroidvania game' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/image-3.jpg',
            alt:'Puzzle & Metroidvania game' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/image-4.jpg',
            alt:'Puzzle & Metroidvania game' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/image-5.jpg',
            alt:'Puzzle & Metroidvania game' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/image-6.jpg',
            alt:'Puzzle & Metroidvania game' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/image-7.jpg',
            alt:'Puzzle & Metroidvania game' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/image-8.jpg',
            alt:'Puzzle & Metroidvania game' },
          { type:'image', src:'works-assets/Projects/puzzle-metroidvania/main-character-design.png',
            alt:'Main character design' },
        ]
      },
      {
        /* TODO: the card game still needs a name — it's the flagship
           project here and the thing people would search for later. */
        title: 'Card Roguelike',
        titleAccent: '',
        tags: ['Unity', 'C#', 'Game Design', 'Blender', 'Texture Painting', 'Photoshop', 'Concept Art' ],
        description:
          'This is the game I\'m currently developing, a card game inspired by Balatro.\n\n ' +
          'You still form poker hands, but you build them by placing cards on a graph, ' +
          'a single card can make several combos at once depending on its position \n\n' +

          'Between rounds you build your deck,' +
          'collect jokers that change how scoring and combos work on the graph, ' +
          'and enhance your cards with tarot and level-up cards.',

        meta: [
          ['My Role', 'Solo Developer'],
          ['Engine',  'Unity 6, URP'],
          ['Year',    '2026']
        ],
        cta:  { label: '', href: '#' },
        note: 'In development',
        media: [
          { type:'youtube', id:'-q3O6mWJZJ8', alt:'Card Game Footage Video' },
        ]
      },
      {
        title: 'WHA Magic System',
        titleAccent: '',
        tags: ['Unity', 'C#', 'VR', 'Hand Tracking', 'Shaders'],
        description:
          'I love magic systems, especially the ones that require critical thinking and creativity. ' +
          'This prototype was inspired by the anime Witch Hat Atelier, and I tried to capture what ' +
          'captivated me most about how its magic works. \n\n' +

          'You draw spells in the air or onto objects. Primary elements can be ' +
          'combined to form new elements and new techniques, and seals can nest ' +
          'inside other seals to build compound spells.\n\n' +

          'I built it in Unity for VR with hand tracking. Shapes are recognised by ' +
          'detecting their features, like corners and angles. A good amount of time ' +
          'went into making the drawing feel natural: fixing a plane to draw on, ' +
          'snapping strokes to clean shapes... ' + 
          'So the magic feels like something alive in the world, not a precision test',
          
        meta: [
          ['My Role', 'Solo Developer'],
          ['Engine',  'Unity, Meta Quest'],
          ['Year',    '2026']
        ],
        cta:  { label: 'Watch Video', href: 'https://www.youtube.com/watch?v=cVQODuAykRA' },
        note: 'On\nYoutube',
        media: [
          { type:'youtube', id:'cVQODuAykRA', alt:'WHA Prototype Video' },
        ]
      },
      {
        title: 'Lazer Blocks',
        titleAccent: '',
        tags: ['Unity', 'C#', '2D', 'Level Design', 'Puzzle Design', 'UI', 'Mobile'],
        description:
          'I made this game in my third year of college. It\'s a grid-based mobile ' +
          'puzzle game, and one of the most polished and original things I built at  ' +
          'that time. I was really happy with it, and it got me some attention.\n\n' +
          
          'There are two types of blocks, each a different color. Blocks slide from ' +
          'corner to corner unless something is in the way. Place blocks of one type ' +
          'on the white squares and they form a laser, then move the other type ' +
          'through it to destroy them. \n\n' +

          'You win when only one type of block is left, and all of them are sitting ' +
          'inside the squares.',
        meta: [
          ['My Role', 'Solo Developer'],
          ['Engine',  'Unity, Meta Quest'],
          ['Year',    '2022']
        ],
        cta:  { label: 'Play Game', href: '#' },
        note: 'On\nPlay Store',
        media: [
          { type:'youtube', id:'a_QPN5snLUg', alt:'lazer blocks video' },
          ]
      },
      {
        title: 'First VR Prototype',
        titleAccent: '',
        tags: ['Unity','VR', 'C#', 'Blender'],
        description:
          'This was my first VR project, a small prototype I made the first time I got my hands on VR.\n\n' +
          'It\'s a shooting game: you hit targets with two guns to build up your score.',
        meta: [
          ['My Role', 'Solo Developer'],
          ['Engine',  'Unity, Meta Quest'],
          ['Year',    '2024']
        ],
        cta:  { label: 'Watch Video', href: 'https://www.youtube.com/watch?v=71-c-3YYhvQ' },
        note: 'On\nYoutube',
        media: [
          { type:'youtube', id:'71-c-3YYhvQ', alt:'First VR prototype' }
        ]
      },
      {
        title: 'Shatter Hit',
        titleAccent: '',
        tags: ['Unity', 'C#', 'Mobile', 'Blender'],
        description:
          'A mobile game inspired by one of my favourite arcade mobile games, Knife Hit.\n\n' +
          'You shoot at the rotating core while avoiding obstacles, and every fifth level you fight a ' +
          'boss with its own attack pattern. You collect gems to buy upgrades and unlock new abilities.',
        meta: [
          ['My Role', 'Solo Developer'],
          ['Engine',  'Unity, Meta Quest'],
          ['Year',    '2023']
        ],
        cta:  { label: '', href: '#' },
        note: 'On\nPlay Store',
        media: [
          { type:'youtube', id:'orPZPgl0-k8', alt:'Game Footage' },
          { type:'image', src:'works-assets/Projects/shatter-hit/SH1.jpeg',
          alt:'Image 1' },
          { type:'image', src:'works-assets/Projects/shatter-hit/SH2.jpeg',
          alt:'Image 2' },
          { type:'image', src:'works-assets/Projects/shatter-hit/SH3.jpeg',
          alt:'Image 3' },
        ]
      },
      {
        title: 'Tower Defenders',
        titleAccent: '',
        tags: ['Unity', 'C#', 'Mobile', 'Blender'],
        description:
          'This is me trying the hyper-casual trend. ' +
          'It\'s a tower defense game where soldiers on top of a tower shoot at enemies trying to climb it.\n\n' +
          'You earn coins by killing enemies and spend them on new soldiers, cannons, more tower ' +
          'space, or increasing attack speed. You can also merge three soldiers ' +
          'of the same type into a higher-level one.',
        meta: [
          ['My Role', 'Solo Developer'],
          ['Engine',  'Unity, Meta Quest'],
          ['Year',    '2023']
        ],
        cta:  { label: '', href: '#' },
        note: 'On\nPlay Store',
        media: [
            { type:'youtube', id:'9oSgedGWg7M', alt:'Tower Defenders gameplay' },
            { type:'image', src:'works-assets/Projects/tower-defenders/image-1.png',
            alt:'Image 1' },
            { type:'image', src:'works-assets/Projects/tower-defenders/image-2.png',
            alt:'Image 2' },
        ]
      }
    ]
  },

  /* =================================================================
     02 — VIDEOS
     ================================================================= */
  {
    id: 'videos',
    num: '02',
    title: 'Videos',
    blurb: 'Tutorials, devlogs and coding experiments.',
    entries: [
      {
        title: 'Math in Game Dev',
        titleAccent: '',
        tags: ['Tutorials', 'Unity', 'Programming', 'Animation', 'Editing', 'DaVinci Resolve'],
        description:
        'I make animated videos about the maths used in game development. ' +
        'I try to simplify the explanations as much as possible through animations ' +
        'and show practical examples of each concept.\n\n' +
        
        'I also try to demonstrate how maths can be art. A huge amount of time ' +
        'goes into working out how to arrange and present each concept that way.\n\n' +
        
        'I make the animations in Unity with C#. I know, it\'s an unusual way to make ' +
        'videos, but I do it that way for that mathematical accuracy. It also means every ' +
        'animation is built using the concept it explains, so each animation ' +
        'is a use case in itself.',
        meta: [
          ['Platform', 'YouTube'],
          ['Topics',   'Math, Unity, Shaders, Tools'],
          ['Since',    '2025']
        ],
        cta:  { label: 'Watch on YouTube', href: 'https://www.youtube.com/@MahmoudElMansariEN-ze5fo/videos' },
        note: 'All Videos',
        media: [
          { type:'youtube', id:'_0wWcwX3ls8', alt:'Math in Game Dev' },
          { type:'youtube', id:'dfSm7Afray4', alt:'Math in Game Dev' },
          { type:'youtube', id:'xnQr_7vHIJU', alt:'Math in Game Dev' },
          { type:'youtube', id:'9A7C97aS_28', alt:'Math in Game Dev' }
          /* to add another: copy a line above and swap the id — it's the
             part of the URL after v=, before any & */
        ]
      }
    ]
  },

  /* =================================================================
     03 — ART
     ================================================================= */
  {
    id: 'art',
    num: '03',
    title: 'Art',
    blurb: 'Characters, environments and visual explorations.',
    entries: [
      {
        title: 'Characters',
        titleAccent: '',
        tags: ['Photoshop', 'Painting', 'Digital Art', 'Character Design'],
        description:
          'One of my favorite parts of drawing is making and designing new characters. \n\n' +
          'This is a collection of some of the characters I\'ve made over the years. \n\n' +
          'Some were for personal projects, some for practicing and experimenting, and some were fan art of shows I love.',
        meta: [
          ['Type',  'Concept Art'],
          ['Tools', 'Photoshop, Blender'],
          ['Focus', 'Characters, Creatures']
        ],
        cta:  { label: 'View Gallery', href: 'https://www.instagram.com/mahmoudlmansari/' },
        note: 'On \n Instagram',
        media: [
          { type:'image', src:'works-assets/Art/Characters/main-character-design.png',
            alt:'Main character design' },
          { type:'image', src:'works-assets/Art/Characters/Faputa_Sosu.png',
            alt:'Faputa study' },
          { type:'image', src:'works-assets/Art/Characters/Powder_Finished.png',
            alt:'Powder' },
          { type:'image', src:'works-assets/Art/Characters/Portrait_3.png',
            alt:'Portrait study' },
          { type:'image', src:'works-assets/Art/Characters/Protrait_studey_3_finished.png',
            alt:'Portrait study, finished' },
          { type:'image', src:'works-assets/Art/Characters/Practice_1_Finished.png',
            alt:'Practice piece' }
        ]
      }
    ]
  }

];
