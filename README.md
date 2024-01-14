# arias-tale-rpg

An emergent social story, game, and experiment in generative artificial intelligence!

## Table of Contents

1. Technical User Notes

   1. Gameplay Streams and Behind the Scenes
   2. Game Tools
   3. Other Notes and TODO
   4. Thread Backlog
   5. Narrative Influences

2. Developer Notes

   1. Built With
   2. Deployment

## Technical User Notes

The user guide is located [here](https://ariastale.com/game-manual). The user guide is ideal for the typical player and these technical notes build further with items of interest for superusers, technical writers, those seeking to run their own game, and diehard fans that have an interest in a look behind the scenes.

### Gameplay Streams and Behind the Scenes

See this [Aria's Tale YouTube Playlist](https://www.youtube.com/playlist?list=PL4hsXTgWARMwAaXEEQkGbD6JImaBrCTpM).

### Game Tools

1. Game-Native Tooling
   1. The [Aria's Tale Website](https://arias-tale-rpg.vercel.app/) and [Repo](https://github.com/Vandivier/arias-tale-rpg)
   2. Custom GPT: [arias-tale-roleplay-assistant](https://chat.openai.com/g/g-V5UqBQLKh-arias-tale-roleplay-assistant)
   3. Social channels:
      1. [TikTok](https://www.tiktok.com/@arias.tale.game)
      2. Ladderly Discord
      3. YouTube, Twitter, Reddit
2. Worldbuilding
   1. [Procgen Arcana](https://watabou.github.io/news.html)
   2. [One Page Dungeon](https://watabou.itch.io/one-page-dungeon)
   3. [Random quest generator](https://donjon.bin.sh/fantasy/adventure/)
   4. [Shop generator](https://donjon.bin.sh/d20/magic/shop.html)
   5. [Inkarnate Pro](https://inkarnate.com/) with Commercial License
3. Image Generators
   1. DALL-E, as built into GPT-4
   2. [Leonardo.ai Image Generator](https://leonardo.ai/)
   3. [Google Image Generator](https://www.google.com/search/images/)
   4. [Pixlr Magic Eraser](https://pixlr.com/express/?tool=paint)
4. Video Generators
   1. [Decohere](https://app.decohere.ai/turbo)
   2. [Runway ML](app.runwayml.com) for text to video
   3. [Pika Labs](https://pika.art/) for image to video
5. Future tools to check
   1. [character.ai](https://beta.character.ai/)
   2. [AI Dungeon](https://aidungeon.com/)
   3. [Friends & Fables](https://www.fables.gg/features)

### Other Notes and TODO

1. TODO: Watch "The Peripheral" Prime Video series which apparently has related themes. Players are seemingly locked in a game world, but it turns out they are actually transported into another time-space location in the real world.
2. Misc tropes and plot concepts
   1. Mathlete Class and [the Inverse Algorithmic Cosine Rule](https://www.youtube.com/watch?v=J5DgMm14ioc)
   2. aria illusions to programming (ie blindness, accessibility stuff)
   3. more math tropes + cs tropes:
      1. even/odd
      2. prime
      3. letter-number or letter-symbol interactions
      4. rational v irrational (pi, e...)
      5. infinities and set theory
      6. uniqueness of one and math ops (multiply, divide...it's 1)
      7. programming error tropes: out of range, out of memory, stack overflow, recursion (ground hog's day), potentially intersect w irrational numbers and/or infinites and set theory
      8. negatives and zero
      9. sequences: fib, geo, fractal...
      10. logarithms (cs base 2 vs base e vs base 10)
      11. 42 and the meaning of life, 420
      12. geometrica or religious numerology (6, 7, 36, 49...)
      13. b64 encoding/decoding
      14. statistical tropes (estimate 2, find 1 and 3...) - economist class?
      15. python as a "language" and possibly other accidental code references leading to bugs, wormholes, loopholes, migraines, and plot twists
   4. Dad jokes as game mechanics (eg "spring water" improving jump ability)
   5. Everything is a mimick, everything is a cake, the cake is a mimick

### Thread Backlog

These are game sessions that haven't been written up and formalized into canon. They are reported by ChatGPT thread name. These all occur after Oct 2023.

1. Eldorin's Arc

   - Generate Game Character: Races

2. Ulraker's Arc, the Bearkin Arc

   - Druid Transformation Image

3. Strategic Mode Development

   - Gridless RPG Battles Possible
   - RPG Battlemap in CSV

4. Worldbuilding

   - Anime Plot Summary
   - Quests receive progression bonuses so you don't have to keep doing mundane quests. Documented in the Iron Flame Book Summary thread.
   - Discord since 11/22/23

### Narrative Influences

- Sword Art Online
- .hack//Sign
- The Matrix
- Black Clover
- Lord of the Rings
- Final Fantasy
- Another Eden: The Cat Beyond Time and Space
- The Age of Em
- The Hunger Games
- Harry Potter
- A Court of Thorns and Roses
- The Empyrean Series
- Baldur's Gate
- The Age of Em
- Artificial intelligence
- Astroengineering
- Brain-machine interface technology like the Neurolink
- The Metaverse
- Philosophy and Religion

## Developer Notes

Aria's Tale is maintained by the [ladderly.io](https://ladderly.io) community. Please join the [ladderly.io Discord](https://discord.gg/fAg6Xa4uxc) for contributor discussion or technical help.

### Built With

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`. The [T3 Stack Discord](https://t3.gg/discord)is a useful place to ask for help.

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

Feedback and contributions are welcome in the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app).

Aria's Tale is also built with the following libraries and their associated official documentation:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [react-markdown](https://remarkjs.github.io/react-markdown/)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

### Deployment

Aria's Tale is deployed over Vercel. You may need to request permission to view a Vercel preview enviroment for your pull requet.

If you are running your own deployment, consult the official T3 Stack deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
