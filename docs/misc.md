# Overview: Aria's Tale

A role playing universe, game system, and concrete collection of episodes and campaigns built communally, streamed, with audience participation, and AI assistance.

## Table of Contents

1. Overview
2. Table of Contents
3. Tools and Resources
4. Related ChatGPT Threads
5. Uncodified game system rules and game world data
6. Misc Other Notes, Open Threads, and TODO

## Tools and Resources

1. This repository
2. [Ladderly](https://ladderly.io/) Discord #gaming channel
3. [Aria's Tale YouTube Playlist](https://www.youtube.com/watch?v=_nEaajP78WQ)
4. AI Tool: [arias-tale-roleplay-assistant](https://chat.openai.com/g/g-V5UqBQLKh-arias-tale-roleplay-assistant)
5. [Procgen Arcana](https://watabou.github.io/news.html)
6. [One Page Dungeon](https://watabou.itch.io/one-page-dungeon)
7. [Random quest generator](https://donjon.bin.sh/fantasy/adventure/)
8. [Shop generator](https://donjon.bin.sh/d20/magic/shop.html).
9. [Google Image Generator](https://www.google.com/search/images/)
10. [Leonardo.ai Image Generator](https://leonardo.ai/)
11. Future tools to check
    1. character.ai
    2. AI Dungeon
    3. https://www.fables.gg/features

## Related ChatGPT Threads

These threads are related to plot development, research, gameplay, or toolbuilding.

Gameplay threads are specially noted with an asertisk (\*).

These should not necessarily be taken as canon.

The threads are listed in chronological order, with the first element of the list being the oldest thread, and the most recent thread being at the end of the list.

1. [Anime Plot Summary](https://chat.openai.com/share/6c36dd57-84db-4b27-8fe9-40b7c939f610)
2. [\*Elven Rogue in a Forest](https://chat.openai.com/c/907da6b9-cb2b-49e7-a1c0-1df4a274a9aa)
3. [Another Eden RPG Game](https://chat.openai.com/share/45281eb2-5bca-4a2f-b974-2ba405e46707)
4. [Iron Flame Book Summary](https://chat.openai.com/c/4f6ee9e8-0e99-42af-a5a6-dcd4b1b9fc41)
   i. Init Dragonica region here
5. [Hex Grid RPG Battle Map](https://chat.openai.com/c/e20991cb-de81-42a7-9466-58354c0ed22b)
   7 [Town, Character, and Quest Setup](https://chat.openai.com/share/9bb91cf2-1037-482b-aed6-13964456ac69)

## Uncodified game system rules and game world data

1. Quests receive progression bonuses so you don't have to keep doing mundane quests. Documented in the Iron Flame Book Summary thread.
2. Significant lore and quest food in the `Town, Character, and Quest Setup` thread

## Misc Other Notes, Open Threads, and TODO

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
   6. Aria's Tale and Arya's Tail pun
3. Custom GPT Dev Notes:
   1. If I use the battle assistant, it can't generate characters, towns, quests, or narrative very well. Seems like we may need a collection of GPTs. Maybe we can use Claude bc enormous context window
   2. [A superuser says](https://community.openai.com/t/gpts-knowledge-capacity-limits/492955/14): Size limitations: In Create mode it will tell you that 25mb is the ideal cap to avoid errors, but you can upload up to 50mb. Character limitations: Based on my experimentation you can upload a single doc (.txt) that is less then 1.5mm characters.
   3. Another person says "You’re going to have better luck achieving what you’re trying to accomplish with Assistants, not GPT’s"
   4. In the longer run, a custom app could call the various specialty GPTs when appropriate, or other code or non-gpt tools for deterministic or seeded activity. I could also have a vector store of threads or something for pinecone-like memory if it becomes to much for context. I will compare that vs using Claude as a canon store until we have a funded app (funded by the book series??)
