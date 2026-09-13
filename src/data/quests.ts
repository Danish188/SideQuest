import type { Quest } from '@/types';

/**
 * The v1 quest catalogue.
 *
 * House rules for anything added here:
 * - Specific beats generic. "Read a book" is not a quest; "read the last page first,
 *   then decide whether you still want the rest" is.
 * - It has to be finishable in the stated time, using things a person already owns.
 * - `estimatedMinutes` is the realistic ceiling — it is matched against the time the
 *   user says they have, so an optimistic number here becomes a broken promise there.
 * - `compatibleContexts: ['anywhere']` means the quest travels; a request for a
 *   specific place will still match it.
 */
export const QUESTS: Quest[] = [
  // ── Build ───────────────────────────────────────────────────────────────────
  {
    id: 'useless-api',
    title: 'The Useless API',
    description:
      'Build a tiny API that answers exactly one completely unnecessary question. "Is it Wednesday?" "How cold is it in Reykjavik right now, in bananas?" One endpoint, no auth. Ship it to a free host or leave it on localhost. The point is the joke, not the uptime.',
    category: 'build',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'creative'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'one-file-website',
    title: 'One File, No Build Step',
    description:
      'Make a genuinely nice web page that is a single .html file. No bundler, no framework, no node_modules. Just you, one file, and the constraint. Open it straight from your desktop and feel something.',
    category: 'build',
    estimatedMinutes: 45,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'creative'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'compliment-cli',
    title: 'A CLI That Likes You',
    description:
      'Write a command-line tool that prints one oddly specific compliment. Then alias it so it runs every time you open a new terminal. You now have infrastructure for self-esteem.',
    category: 'build',
    estimatedMinutes: 30,
    difficulty: 'easy',
    compatibleMoods: ['productive', 'creative', 'chill'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'the-404',
    title: 'A 404 Worth Getting Lost On',
    description:
      'Design a 404 page so good that people break links on purpose. One idea, executed properly: an animation, a tiny game, a confession. Build it and put it somewhere real.',
    category: 'build',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['creative', 'productive'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'ui-from-memory',
    title: 'From Memory Only',
    description:
      'Pick an interface you use every day: your bank app, your music player, a checkout page. Close it. Rebuild the main screen from memory alone. Then open the real one and count what you got wrong. This is a lesson about design, and about you.',
    category: 'build',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'creative'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'terminal-screensaver',
    title: 'Screensaver for a Terminal',
    description:
      'Build something that animates in a terminal window and serves no purpose whatsoever. Falling characters, a bouncing logo, a slow-growing tree. It runs until you press a key, and it makes you slightly proud.',
    category: 'build',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['creative', 'productive'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'regex-duel',
    title: 'Ten-Minute Regex Duel',
    description:
      'Set a ten-minute timer. Write a regex that validates something genuinely annoying: a postcode, an ISO timestamp, a hex colour with optional alpha. No looking it up until minute seven.',
    category: 'build',
    estimatedMinutes: 10,
    difficulty: 'medium',
    compatibleMoods: ['productive'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'personal-changelog',
    title: 'Ship a Personal Changelog',
    description:
      'Make a page that lists what changed about you this year, formatted like release notes. Added: patience. Fixed: sleep schedule. Deprecated: an opinion you no longer hold. Keep it honest and version it properly.',
    category: 'build',
    estimatedMinutes: 45,
    difficulty: 'medium',
    compatibleMoods: ['creative', 'productive', 'chill'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'aggressively-useless-site',
    title: 'One Aggressively Useless Website',
    description:
      'Build and actually deploy a site that does one stupid thing perfectly. A button that runs away. A page that tells you how long you have been on it. A counter counting nothing. Host it free, then send it to exactly one person.',
    category: 'build',
    estimatedMinutes: 90,
    difficulty: 'unhinged',
    compatibleMoods: ['creative', 'adventurous'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'api-that-lies',
    title: 'The API That Lies',
    description:
      'Build an API that returns confidently wrong answers in a perfectly valid schema. Correct status codes, clean JSON, complete nonsense. Then write the documentation with a completely straight face.',
    category: 'build',
    estimatedMinutes: 60,
    difficulty: 'unhinged',
    compatibleMoods: ['creative', 'adventurous', 'productive'],
    compatibleContexts: ['computer'],
  },

  // ── Learn ───────────────────────────────────────────────────────────────────
  {
    id: 'one-useful-sentence',
    title: 'One Sentence, New Language',
    description:
      'Pick a language you do not speak. Learn one genuinely useful sentence. Not "hello", something like "I think I am lost, could you help me?" Drill the pronunciation until it sounds like a person and not a phrasebook.',
    category: 'learn',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['productive', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'morse-your-name',
    title: 'Tap Out Your Own Name',
    description:
      'Learn the Morse code for your name. Practise it on the table until you can do it without thinking. Completely useless, right up until the one moment it is not.',
    category: 'learn',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'productive'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'shortcut-sprint',
    title: 'Shortcut Sprint',
    description:
      'Open the keyboard shortcut list for the app you use most. Find three you did not know existed. Use each one ten times right now, so your hands learn them rather than your brain.',
    category: 'learn',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['productive'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'first-page-of-a-paper',
    title: 'The First Page Only',
    description:
      'Find an academic paper on something you are curious about. Read only the abstract and the introduction. Then write down, in your own words, what question these people were actually trying to answer. Stop there.',
    category: 'learn',
    estimatedMinutes: 15,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'productive'],
    compatibleContexts: ['computer', 'home'],
  },
  {
    id: 'new-alphabet',
    title: 'Read a New Alphabet',
    description:
      'Learn to read the Greek or Cyrillic alphabet, not the language, just the letters. In about an hour you can be sounding out words, and street signs across half of Europe stop being decoration.',
    category: 'learn',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'one-chess-opening',
    title: 'Learn One Opening Properly',
    description:
      'Pick a single chess opening. Learn the first six moves and, more importantly, why each one is played. Then play three games where you refuse to deviate, even when it hurts.',
    category: 'learn',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'chill'],
    compatibleContexts: ['computer', 'home'],
  },
  {
    id: 'finger-whistle',
    title: 'The Loud Whistle',
    description:
      'Learn to whistle with your fingers in your mouth. You will be terrible at it for nineteen minutes and then suddenly not. Warn anyone nearby before you start.',
    category: 'learn',
    estimatedMinutes: 20,
    difficulty: 'medium',
    compatibleMoods: ['adventurous', 'chill'],
    compatibleContexts: ['home', 'outside'],
  },
  {
    id: 'card-flourish',
    title: 'One Card Flourish',
    description:
      'Take a deck of cards and learn a single flourish or a single trick. Not a routine: one thing, done cleanly. Practise until you can do it while holding a conversation about something else.',
    category: 'learn',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['creative', 'chill', 'social'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'how-does-that-work',
    title: 'How Does That Actually Work',
    description:
      'Choose an object within arm’s reach. Find out how it really works, down to a level where you could explain it to a curious twelve-year-old. Zips, microwaves and locks are all far stranger than you think.',
    category: 'learn',
    estimatedMinutes: 45,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'magic-trick-fool-one',
    title: 'Fool Exactly One Person',
    description:
      'Learn a magic trick to the standard where it fools someone who is paying close attention. That bar is much higher than "I know how it works". Practise in a mirror, perform it once, and never explain it.',
    category: 'learn',
    estimatedMinutes: 60,
    difficulty: 'unhinged',
    compatibleMoods: ['creative', 'social', 'adventurous'],
    compatibleContexts: ['home', 'anywhere'],
  },

  // ── Creative ────────────────────────────────────────────────────────────────
  {
    id: 'six-word-day',
    title: 'Your Day in Six Words',
    description:
      'Write a six-word story about today. Exactly six. The constraint is the entire exercise. You will throw away four versions before one lands, and the one that lands will be true.',
    category: 'creative',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'worst-opening-line',
    title: 'The Worst Opening Line',
    description:
      'Write the worst possible opening sentence to a novel. Commit fully. Then write the best one you can manage. Notice how much easier the first one was, and sit with why.',
    category: 'creative',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'fake-band-cover',
    title: 'Album Art for a Band That Does Not Exist',
    description:
      'Invent a band name and a genre, then design their album cover. Any medium: paper, phone, design tool. The one rule: the artwork has to make the genre obvious without naming it.',
    category: 'creative',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['creative'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'household-object-ad',
    title: 'Sell Me This Spoon',
    description:
      'Pick the most boring object in the room. Write it a luxury advertisement: headline, body copy, tagline. Take it completely seriously. This is genuinely how copywriters practise.',
    category: 'creative',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'playlist-with-a-plot',
    title: 'A Playlist With a Plot',
    description:
      'Build a playlist where the running order tells a story with a beginning, a turn and an ending. Eight tracks maximum. The title has to be a single word.',
    category: 'creative',
    estimatedMinutes: 30,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'childhood-home-from-memory',
    title: 'Draw the House You Grew Up In',
    description:
      'Draw the floor plan of a home you lived in as a child, entirely from memory. Label every room. You will remember a doorway you have not thought about in twenty years.',
    category: 'creative',
    estimatedMinutes: 30,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'invent-a-holiday',
    title: 'Invent a Holiday',
    description:
      'Create a holiday that should exist. Give it a date, one specific food, one ritual, and one thing you are forbidden from doing. Write it up like an encyclopaedia entry.',
    category: 'creative',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'social'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'ten-things-one-colour',
    title: 'Ten Things, One Colour',
    description:
      'Pick a colour. Photograph ten things that are that colour. Ten genuinely different things, not ten angles of the same wall. Your eyes recalibrate somewhere around the sixth photo.',
    category: 'creative',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'letter-to-future-self',
    title: 'Letter to Yourself in Five Years',
    description:
      'Write to yourself five years from now. Not goals. Describe today in enough detail that future you can smell it. What things cost. What you are worried about. What is on the table.',
    category: 'creative',
    estimatedMinutes: 30,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'creative'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'jingle-for-the-mundane',
    title: 'Write a Jingle',
    description:
      'Compose a fifteen-second jingle for something that would never have one. A tax return. A bus timetable. Your fridge. Record it on your phone. It has to be genuinely catchy.',
    category: 'creative',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['creative', 'adventurous'],
    compatibleContexts: ['home'],
  },
  {
    id: 'one-hour-zine',
    title: 'The One-Hour Zine',
    description:
      'Fold one sheet of paper into an eight-page booklet. Fill every page on a single subject: your street, a bad day, a taxonomy of sandwiches. Finished beats good. Do not restart.',
    category: 'creative',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['creative'],
    compatibleContexts: ['home'],
  },
  {
    id: 'recreate-a-painting',
    title: 'Recreate a Painting With What You Own',
    description:
      'Pick a famous painting. Recreate it using only objects, clothing and lighting already in your home, then photograph it. Towels become robes, a lamp becomes the sun. Commit to the composition.',
    category: 'creative',
    estimatedMinutes: 60,
    difficulty: 'unhinged',
    compatibleMoods: ['creative', 'adventurous', 'social'],
    compatibleContexts: ['home'],
  },

  // ── Outside ─────────────────────────────────────────────────────────────────
  {
    id: 'coin-navigation',
    title: 'Let a Coin Navigate',
    description:
      'Walk out of your door and flip a coin at every junction. Heads left, tails right. Twenty flips, then find your way home. You live somewhere you have never been.',
    category: 'outside',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['adventurous', 'chill'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'oldest-thing-on-the-street',
    title: 'Find the Oldest Thing on Your Street',
    description:
      'Go outside and work out what the oldest object within five minutes of your door is. A building, a tree, a boundary stone, a manhole cover with a date on it. Photograph it. Find out its story later.',
    category: 'outside',
    estimatedMinutes: 30,
    difficulty: 'easy',
    compatibleMoods: ['adventurous', 'chill'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'look-up',
    title: 'Look Above the Shopfronts',
    description:
      'Walk a street you know well and look only at the first floor and above. Old signage, carved dates, bricked-up windows, weird little statues. Cities keep their history above eye level.',
    category: 'outside',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'adventurous'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'sunset-interception',
    title: 'Intercept the Sunset',
    description:
      'Look up what time the sun sets today. Find a spot with a clear western view and be standing in it five minutes early. No photos for the first two minutes.',
    category: 'outside',
    estimatedMinutes: 60,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'adventurous'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'door-worth-opening',
    title: 'A Door You Would Like to Open',
    description:
      'Walk until you find a door you find genuinely interesting: colour, age, hardware, whatever it is. Photograph it. Then find two more. You will start seeing doors everywhere for a week.',
    category: 'outside',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'one-stop-too-far',
    title: 'One Stop Too Far',
    description:
      'Get on a bus or train and deliberately get off one stop past where you would normally stop, or at a stop you have never used. Spend twenty minutes there. Then come back.',
    category: 'outside',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['adventurous'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'shop-you-always-pass',
    title: 'Go Into the Shop You Always Walk Past',
    description:
      'There is a shop you have walked past for years and never entered. Go in. Buy the cheapest interesting thing, or nothing at all. Talk to whoever is behind the counter.',
    category: 'outside',
    estimatedMinutes: 20,
    difficulty: 'medium',
    compatibleMoods: ['adventurous', 'social'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'highest-point',
    title: 'Get to the Highest Point Nearby',
    description:
      'Find the highest spot you can legally and safely reach on foot near you: a hill, a public car park roof, a viewing deck. Stand there. Work out which direction your home is in.',
    category: 'outside',
    estimatedMinutes: 90,
    difficulty: 'medium',
    compatibleMoods: ['adventurous'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'straight-line-walk',
    title: 'The Straight Line Walk',
    description:
      'Open a map, draw a straight line from where you are to a point two kilometres away, and walk it as literally as roads and public paths allow. No trespassing, no shortcuts through anything private. You will see the city’s seams.',
    category: 'outside',
    estimatedMinutes: 120,
    difficulty: 'unhinged',
    compatibleMoods: ['adventurous'],
    compatibleContexts: ['outside'],
  },
  {
    id: 'sky-check',
    title: 'Identify What Is Above You',
    description:
      'Go outside and identify the clouds overhead by name, or one constellation if it is dark. Ten minutes. Weather and stars are two things you look at constantly and have never actually read.',
    category: 'outside',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['chill'],
    compatibleContexts: ['outside'],
  },

  // ── Social ──────────────────────────────────────────────────────────────────
  {
    id: 'three-specific-compliments',
    title: 'Three Specific Compliments',
    description:
      'Message three people with a compliment so specific it could only be about them. Not "you are great", but "the way you handled that thing in March changed how I do it". Specificity is the whole quest.',
    category: 'social',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['social', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'the-overdue-thank-you',
    title: 'The Overdue Thank You',
    description:
      'There is someone you owe a thank you and never sent it. Send it now. Do not apologise for the delay for more than one sentence. Go straight to what they did and why it mattered.',
    category: 'social',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['social', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'absurd-group-chat',
    title: 'A Group Chat With One Purpose',
    description:
      'Start a group chat with three people and one absurdly narrow purpose. Photographs of good chairs. Bread reviews. Suspicious pigeons. Name it properly and post the first entry immediately.',
    category: 'social',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['social', 'creative'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'useful-review',
    title: 'Leave a Genuinely Useful Review',
    description:
      'Find a small business you actually like and write the review you would want to read: what it is good for, who it suits, the one thing to know beforehand. Specific, honest, no stars-only.',
    category: 'social',
    estimatedMinutes: 15,
    difficulty: 'easy',
    compatibleMoods: ['social', 'productive'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'the-year-old-call',
    title: 'Call the Person You Have Not Called',
    description:
      'Ring someone you have not spoken to in over a year. Not a text: a call. Open with "I was thinking about you and realised it had been ages." That sentence does all the heavy lifting.',
    category: 'social',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['social'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'listening-party',
    title: 'Twenty-Minute Listening Party',
    description:
      'Get one person to listen to one album side with you, at the same time, doing nothing else. In the same room or on a call. No phones. Talk about it afterwards for as long as you like.',
    category: 'social',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['social', 'chill'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'interview-a-relative',
    title: 'Interview Someone About One Year',
    description:
      'Ask an older relative or friend to tell you about one specific year of their life. Not their whole story, just one year. Record it if they are happy for you to. The detail you get from a narrow question is extraordinary.',
    category: 'social',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['social'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'cook-for-someone',
    title: 'Cook for Someone Unprompted',
    description:
      'Make something for a person who is not expecting it and deliver it. A housemate, a neighbour, someone at work tomorrow. It does not have to be impressive. It has to be unrequested.',
    category: 'social',
    estimatedMinutes: 90,
    difficulty: 'medium',
    compatibleMoods: ['social', 'productive'],
    compatibleContexts: ['home'],
  },
  {
    id: 'haiku-replies',
    title: 'Reply Only in Haiku',
    description:
      'For the next hour, every message you send to friends is a haiku. Five, seven, five. No explaining yourself, no breaking character. Some of them will play along, and those are your people.',
    category: 'social',
    estimatedMinutes: 60,
    difficulty: 'unhinged',
    compatibleMoods: ['social', 'creative', 'adventurous'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'ask-about-their-craft',
    title: 'Ask Someone About Their Craft',
    description:
      'Find a person whose work involves a skill you know nothing about: a barista, a mechanic, a tailor, a colleague in a different team. Ask them one real question about how they do it well. Then shut up and listen.',
    category: 'social',
    estimatedMinutes: 15,
    difficulty: 'medium',
    compatibleMoods: ['social', 'adventurous'],
    compatibleContexts: ['outside', 'anywhere'],
  },

  // ── Fitness ─────────────────────────────────────────────────────────────────
  {
    id: 'hundred-reps',
    title: 'One Hundred Reps, Your Choice',
    description:
      'One hundred repetitions of a single movement, broken into as many sets as you need. Press-ups, squats, lunges, whatever your body allows today. The number is the quest, the route there is yours.',
    category: 'fitness',
    estimatedMinutes: 20,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'adventurous'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'deep-squat-hold',
    title: 'Five Minutes in a Deep Squat',
    description:
      'Accumulate five total minutes sitting in a deep squat, heels down if you can manage it. Hold a doorframe for balance. Most of the world rests like this and your hips have forgotten how.',
    category: 'fitness',
    estimatedMinutes: 10,
    difficulty: 'medium',
    compatibleMoods: ['chill', 'productive'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'shadowbox-a-round',
    title: 'Shadowbox Three Rounds',
    description:
      'Three rounds of three minutes, one minute rest. Move your feet the entire time. You will discover within ninety seconds that this is much harder than it looks from the sofa.',
    category: 'fitness',
    estimatedMinutes: 15,
    difficulty: 'medium',
    compatibleMoods: ['adventurous', 'productive'],
    compatibleContexts: ['home'],
  },
  {
    id: 'stair-repeats',
    title: 'Stair Repeats',
    description:
      'Find a flight of stairs. Up, down, repeat for fifteen minutes at a pace you could just about hold a conversation at. No music for the last five minutes, just you and your breathing.',
    category: 'fitness',
    estimatedMinutes: 20,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'adventurous'],
    compatibleContexts: ['home', 'outside'],
  },
  {
    id: 'mobility-no-floor',
    title: 'Mobility Without Touching the Floor',
    description:
      'Ten minutes of joint mobility done entirely standing: neck, shoulders, spine, hips, ankles. Slow circles, full range. Perfect for when the floor is not an option and your body has been in a chair too long.',
    category: 'fitness',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'productive'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'carry-something-heavy',
    title: 'Carry Something Heavy, Far',
    description:
      'Pick up something genuinely heavy but safe to hold, such as a full rucksack, shopping bags or a water container, and walk with it until your grip complains. Set it down, shake out, go again. Three rounds.',
    category: 'fitness',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['adventurous', 'productive'],
    compatibleContexts: ['outside', 'home'],
  },
  {
    id: 'wall-handstand',
    title: 'Get Upside Down',
    description:
      'Work on a wall handstand for half an hour. Start with your feet walking up the wall behind you. Stop well before your shoulders are done. Being inverted resets something in your head.',
    category: 'fitness',
    estimatedMinutes: 30,
    difficulty: 'unhinged',
    compatibleMoods: ['adventurous'],
    compatibleContexts: ['home'],
  },
  {
    id: 'walk-backwards',
    title: 'Walk Backwards for Five Minutes',
    description:
      'Somewhere flat, empty and safe, walk backwards for five minutes. It is a genuinely good knee and balance drill, it uses a completely different set of muscles, and you will feel ridiculous. All three are the point.',
    category: 'fitness',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['adventurous', 'chill'],
    compatibleContexts: ['outside', 'home'],
  },

  // ── Explore ─────────────────────────────────────────────────────────────────
  {
    id: 'same-latitude',
    title: 'Someone Else at Your Latitude',
    description:
      'Find your exact latitude, then travel along it on a map until you land somewhere completely different. Drop into street view. Spend twenty minutes in a town you will never visit and learn one real thing about it.',
    category: 'explore',
    estimatedMinutes: 30,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'adventurous'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'where-water-comes-from',
    title: 'Find Out Where Your Water Comes From',
    description:
      'Trace your tap water back to its source: the reservoir, the river, the aquifer, the treatment works. Most people drink from the same place for decades and could not name it.',
    category: 'explore',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'chill'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'read-your-own-city',
    title: 'Read Your Own Town’s Wikipedia Page',
    description:
      'Read the full encyclopaedia entry for the place you live, including the history section everyone skips. Find one fact that genuinely surprises you, then go and look at the thing it is about.',
    category: 'explore',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'productive'],
    compatibleContexts: ['computer', 'home'],
  },
  {
    id: 'supply-chain',
    title: 'Trace One Object Backwards',
    description:
      'Take something in front of you and work backwards: where was it assembled, where did the materials come from, how did it reach you. Get as far as you can in forty-five minutes. It is never a short story.',
    category: 'explore',
    estimatedMinutes: 45,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'chill'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'oldest-photo-of-here',
    title: 'Find the Oldest Photo of Where You Are',
    description:
      'Dig through archives until you find the earliest photograph of your street or neighbourhood. Then stand where the photographer stood. The buildings that survived will surprise you more than the ones that did not.',
    category: 'explore',
    estimatedMinutes: 45,
    difficulty: 'medium',
    compatibleMoods: ['chill', 'adventurous'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'map-the-sounds',
    title: 'Map Everything You Can Hear',
    description:
      'Sit still for ten minutes and write down every distinct sound, in the order you notice it. Do not stop at five. The list gets strange and specific around number twelve.',
    category: 'explore',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'radio-elsewhere',
    title: 'Listen to Radio From Somewhere Else',
    description:
      'Find a live radio stream from a country you have never been to and listen for twenty minutes: adverts, traffic reports, the lot. The adverts tell you more about a place than any guidebook.',
    category: 'explore',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'adventurous'],
    compatibleContexts: ['computer', 'anywhere'],
  },

  // ── Digital ─────────────────────────────────────────────────────────────────
  {
    id: 'unsubscribe-sprint',
    title: 'Ten-Minute Unsubscribe Sprint',
    description:
      'Search your inbox for "unsubscribe" and work through it for ten minutes flat. No deciding, no "maybe one day". Timer on, and stop the moment it goes off.',
    category: 'digital',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['productive'],
    compatibleContexts: ['computer', 'anywhere'],
  },
  {
    id: 'change-one-default',
    title: 'Change One Default',
    description:
      'Find one default setting on your phone or computer that you have never questioned and change it deliberately. Notification style, keyboard, home screen, default browser. Live with it for a week.',
    category: 'digital',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['productive', 'adventurous'],
    compatibleContexts: ['computer', 'anywhere'],
  },
  {
    id: 'oldest-file',
    title: 'Digital Archaeology',
    description:
      'Sort a drive by date and find the oldest file you still own. Open it. Work out what you were doing and who you were. Then decide, honestly, whether to keep it.',
    category: 'digital',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'creative'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'screenshot-graveyard',
    title: 'Empty the Screenshot Graveyard',
    description:
      'Open your screenshots folder. For each one: act on it, file it, or delete it. No fourth option. Most of them were a to-do you never wrote down.',
    category: 'digital',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['productive'],
    compatibleContexts: ['computer', 'anywhere'],
  },
  {
    id: 'best-of-camera-roll',
    title: 'Curate Your Own Best Of',
    description:
      'Go through the last year of photos and pick exactly twelve. Not the best twelve moments: the twelve best photographs. Make an album. You will delete far more than you keep, which is the point.',
    category: 'digital',
    estimatedMinutes: 30,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'password-hygiene',
    title: 'Fix Your Three Worst Passwords',
    description:
      'Open your password manager, or your memory, and find the three worst reused passwords you still have. Rotate them and turn on two-factor where it exists. Deeply boring. Genuinely important.',
    category: 'digital',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['productive'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'librarian-your-files',
    title: 'File Like a Librarian',
    description:
      'Take one chaotic folder and impose a naming scheme with actual rules: dates first, no spaces, consistent casing. Write the rules down in a README inside the folder. Future you is a different person and needs instructions.',
    category: 'digital',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['productive'],
    compatibleContexts: ['computer'],
  },
  {
    id: 'phone-in-another-language',
    title: 'Switch Your Phone’s Language',
    description:
      'Change your phone into a language you are learning, or barely know, and leave it that way for the rest of the day. You know where all the buttons are. You will find out whether that is true.',
    category: 'digital',
    estimatedMinutes: 60,
    difficulty: 'unhinged',
    compatibleMoods: ['adventurous', 'productive'],
    compatibleContexts: ['anywhere'],
  },

  // ── Offline ─────────────────────────────────────────────────────────────────
  {
    id: 'handwrite-something',
    title: 'Handwrite Something Real',
    description:
      'Write a full page by hand. A letter, an argument you are having with yourself, a description of the room. No keyboard, no deleting. Cross out and keep going. Your handwriting is worse than you remember.',
    category: 'offline',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'creative'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'take-a-pen-apart',
    title: 'Take a Pen Apart',
    description:
      'Fully disassemble a ballpoint pen and lay the parts out in order. Count them. Then put it back together so it writes. There are more parts than you would guess and every one is doing a job.',
    category: 'offline',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'creative'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'fold-one-thing',
    title: 'Fold One Good Thing',
    description:
      'Learn one piece of origami properly, whether a crane, a box or a jumping frog, and fold it three times. The third one is noticeably better than the first, and that gap is the whole lesson.',
    category: 'offline',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'creative'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'fix-the-broken-thing',
    title: 'Fix the Thing You Keep Walking Past',
    description:
      'There is a broken or half-broken object in your home you have stopped seeing. The wobbling handle, the drawer that sticks, the lamp with the dodgy switch. Fix it properly today.',
    category: 'offline',
    estimatedMinutes: 45,
    difficulty: 'medium',
    compatibleMoods: ['productive'],
    compatibleContexts: ['home'],
  },
  {
    id: 'cook-without-a-recipe',
    title: 'Cook Without a Recipe',
    description:
      'Make dinner using only what is already in the kitchen and no recipe at any point. Taste constantly, season more than feels right. It might be mediocre. You will still learn more than following instructions.',
    category: 'offline',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['creative', 'adventurous'],
    compatibleContexts: ['home'],
  },
  {
    id: 'move-the-furniture',
    title: 'Move One Piece of Furniture',
    description:
      'Rearrange a room around one thing moved somewhere unexpected. Not a tidy: a change. Sit in the new arrangement for ten minutes before you decide whether you hate it.',
    category: 'offline',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['productive', 'creative'],
    compatibleContexts: ['home'],
  },
  {
    id: 'one-lamp-evening',
    title: 'The One-Lamp Evening',
    description:
      'Turn off every light in your home except one lamp, and leave it that way for the evening. Everything slows down about fifteen minutes in. Candles count, if you are careful with them.',
    category: 'offline',
    estimatedMinutes: 60,
    difficulty: 'easy',
    compatibleMoods: ['chill'],
    compatibleContexts: ['home'],
  },
  {
    id: 'airplane-mode-hour',
    title: 'One Hour, Airplane Mode',
    description:
      'Put your phone in airplane mode for a full hour and leave it in a different room. Decide beforehand what you will do with the hour, or you will spend it looking for your phone.',
    category: 'offline',
    estimatedMinutes: 60,
    difficulty: 'medium',
    compatibleMoods: ['chill', 'productive'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'non-dominant-hand',
    title: 'The Wrong Hand',
    description:
      'Do everything with your non-dominant hand for the next hour. Eating, brushing teeth, doors, your phone. It is funny for ten minutes and then quietly fascinating. You will notice exactly how much you run on autopilot.',
    category: 'offline',
    estimatedMinutes: 60,
    difficulty: 'unhinged',
    compatibleMoods: ['adventurous', 'creative'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'sleep-somewhere-else',
    title: 'Sleep in the Wrong Room',
    description:
      'Tonight, sleep somewhere else in your home. The sofa, the floor, the other end of the bed. Your brain maps a familiar space completely differently from an unfamiliar angle, and you dream oddly.',
    category: 'offline',
    estimatedMinutes: 120,
    difficulty: 'unhinged',
    compatibleMoods: ['adventurous', 'chill'],
    compatibleContexts: ['home'],
  },

  // ── Random ──────────────────────────────────────────────────────────────────
  {
    id: 'random-article-three-facts',
    title: 'Random Article, Three Facts',
    description:
      'Open a random encyclopaedia article. Whatever it is, a Bulgarian footballer or a type of moss, find three facts worth repeating. If the first article is unbearable you get exactly one reroll.',
    category: 'random',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'productive'],
    compatibleContexts: ['computer', 'anywhere'],
  },
  {
    id: 'narrate-yourself',
    title: 'Narrate Yourself Like a Documentary',
    description:
      'For ten minutes, narrate everything you do out loud in the voice of a nature documentary. "Here, the subject approaches the fridge for the fourth time this hour." Full commitment or it does not work.',
    category: 'random',
    estimatedMinutes: 10,
    difficulty: 'unhinged',
    compatibleMoods: ['creative', 'adventurous'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'absurd-shelf-system',
    title: 'Reorganise a Shelf by an Absurd System',
    description:
      'Pick one shelf and reorder it by something ridiculous but consistent: colour, height, how much you trust each object, alphabetically by second letter. It has to be a real system you could explain.',
    category: 'random',
    estimatedMinutes: 20,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['home'],
  },
  {
    id: 'dice-dinner',
    title: 'Let Dice Choose Dinner',
    description:
      'Write six options you would genuinely eat, roll, and cook that one. No rerolling, no negotiating with yourself. Decision fatigue is real and this is a legitimate cure.',
    category: 'random',
    estimatedMinutes: 60,
    difficulty: 'easy',
    compatibleMoods: ['chill', 'adventurous'],
    compatibleContexts: ['home'],
  },
  {
    id: 'blind-taste-test',
    title: 'Blind Taste Test',
    description:
      'Get someone to pour you three versions of the same thing, whether teas, waters, biscuits or crisps, and identify them blind. You are almost certainly worse at this than you believe.',
    category: 'random',
    estimatedMinutes: 20,
    difficulty: 'medium',
    compatibleMoods: ['social', 'adventurous'],
    compatibleContexts: ['home'],
  },
  {
    id: 'the-recurring-todo',
    title: 'Do the Thing You Keep Rewriting',
    description:
      'There is one task that has migrated across four to-do lists without ever being done. It is almost certainly smaller than the dread around it. Do it now, badly if necessary.',
    category: 'random',
    estimatedMinutes: 30,
    difficulty: 'medium',
    compatibleMoods: ['productive'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'reverse-the-evening',
    title: 'Run the Evening Backwards',
    description:
      'Do your usual evening routine in reverse order, starting now. Pudding first. Pyjamas early. It scrambles your sense of time in a way that feels unreasonably good on a dull weeknight.',
    category: 'random',
    estimatedMinutes: 60,
    difficulty: 'unhinged',
    compatibleMoods: ['adventurous', 'chill'],
    compatibleContexts: ['home'],
  },
  {
    id: 'last-page-first',
    title: 'Read the Last Page First',
    description:
      'Take an unread book off the shelf and read its final page before anything else. Then decide whether you still want the other three hundred. Sometimes the ending is the best possible advertisement.',
    category: 'random',
    estimatedMinutes: 15,
    difficulty: 'medium',
    compatibleMoods: ['chill', 'adventurous'],
    compatibleContexts: ['home', 'anywhere'],
  },
  {
    id: 'talk-to-an-empty-room',
    title: 'Give a Talk to an Empty Room',
    description:
      'Stand up and deliver a five-minute talk, out loud, on something you know far too much about. No notes, no audience. Record it if you dare. You will find out very quickly whether you actually understand it.',
    category: 'random',
    estimatedMinutes: 20,
    difficulty: 'unhinged',
    compatibleMoods: ['creative', 'adventurous', 'productive'],
    compatibleContexts: ['home'],
  },
  {
    id: 'rename-everything',
    title: 'Rename Your Surroundings',
    description:
      'Give ten objects around you new, better names. Not jokes: names that describe what the thing actually does. Most objects are badly named and you will not fully recover from noticing this.',
    category: 'random',
    estimatedMinutes: 10,
    difficulty: 'easy',
    compatibleMoods: ['creative', 'chill'],
    compatibleContexts: ['anywhere'],
  },
  {
    id: 'two-hard-things',
    title: 'Two Hard Things, Back to Back',
    description:
      'A cold shower, then the message you have been avoiding sending. In that order. The first one is over in ninety seconds and makes the second one feel considerably smaller.',
    category: 'random',
    estimatedMinutes: 20,
    difficulty: 'unhinged',
    compatibleMoods: ['adventurous', 'productive'],
    compatibleContexts: ['home'],
  },
  {
    id: 'one-person-film-festival',
    title: 'Host a One-Person Film Festival',
    description:
      'Choose a theme far too narrow to be sensible: films set over a single night, films with a heist that fails, directors’ first features. Programme two of them and write yourself a short introduction before each.',
    category: 'random',
    estimatedMinutes: 120,
    difficulty: 'medium',
    compatibleMoods: ['chill', 'creative'],
    compatibleContexts: ['home'],
  },
];

const QUEST_BY_ID = new Map(QUESTS.map((quest) => [quest.id, quest]));

export function getQuestById(id: string): Quest | undefined {
  return QUEST_BY_ID.get(id);
}
