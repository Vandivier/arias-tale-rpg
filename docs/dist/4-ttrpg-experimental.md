---
title: "Complex TTRPG Instructions with Embedded Data"
---

TODO: clean up these instructions

## Complex Enemy Encounters

Battle encounters can utilize a number of modes. When starting an encounter, assume Simple Strategic Mode unless otherwise discussed. Based on the setting, declare several things step-by-step:

1. The teams and units for each team. The difficulty of the battle and the narrative will help decide the number of enemies, their kind, and their level distribution.
2. Any initial environment conditions or unit statuses based on the narrative and environment setting.
   1. For example, if a character is ambushed they may be stunned or surprised, and the attacker in an ambush may have advantage or stealth.
   2. Characters may also be at advantage or disadvantage due to morale, hunger, sleepiness, or other factors.
   3. The environment can provide effects such as fire attack bonuses due to heat and other effects which are not strictly an advantage or disadvantage to particular characters but instead impact certain kinds of moves or rolls.
3. If the encounter is strategic, declare the technical map in CSV form and also declare character positions on the map.

Unless otherwise specified, roll d20 on the Battle Encounter Difficulty Table to determine battle setup.
Unit levels are a minimum of level 1. A level disadvantage cannot reduce the unit level below 1.

After each round of unit turns, take a world turn. Declare whether any interesting changes happen in the battle due to this world turn. A world turn can reflect environmental changes and spontaneous bonus challenges and opportunities for players and adversaries. Maybe a new enemy shows up. Maybe a tree falls. Maybe the wind picks up. Maybe nothing of note happens.

## Battle Modes

1. Narrative Mode
   - Description: Focuses on storytelling and role-playing with minimal emphasis on combat mechanics.
   - Gameplay: Players make choices based on narrative options. Combat outcomes are influenced by story needs and character decisions rather than strict combat rules.
   - Objective: Engage players in a story-driven adventure where their choices impact the narrative progression.
2. Classical RPG Combat Mode, also called Simple Mode
   - Description: A traditional RPG combat system with turn-based moves and no complex tactical positioning.
   - Gameplay: Players select actions from a menu for their characters, including attacking, using magic, defending, and using items. The game progresses in turns, with each side making moves sequentially.
   - Objective: Provide a straightforward RPG combat experience focusing on character abilities and strategic choices.
3. Simple Strategic Mode
   - Description: An introductory strategic mode using a square grid to add a basic level of tactical gameplay.
   - Gameplay: Utilizes a square grid for movement and action ranges. Players move characters on the grid and execute actions while considering their spatial positions. Tiles can have elevation, environmental effects, bonuses, dangers, or items ranging from small rocks, berries, and branches to the occasional rarer item.
   - Objective: Introduce players to tactical gameplay elements like positioning and range, offering a simpler version of more complex strategic modes.
4. Complex Strategic Mode, also called Hex Mode
   - Description: A complex tactical combat system with in-depth strategy elements, designed for experienced players.
   - Gameplay: Features a hex grid battle with detailed character stats and abilities. Focuses on strategic planning, positioning, and complex character abilities.
   - Objective: Provide a deep tactical combat experience that challenges players with critical strategic considerations.
5. TCG Mode (Trading Card Game)
   - Description: Mimics the mechanics of a trading card game within the RPG setting.
   - Gameplay: Players use a deck of cards representing abilities, items, or characters. Each turn, players draw cards, manage resources (like mana or energy), and play cards to influence the game state.
     Objective: Blend RPG elements with TCG strategy, focusing on deck building, resource management, and strategic card play.

## Simple Mode Battle

1. **Battle Statistics and Setup**: Unit battle statistics are simplified in simple mode and the usual rarity system is disregarded. Before turns begin, code is written to technically generate each stereotyped battle party and a JSON Battle Report declaring the the initial battle state is made available for download. The initial battle state summarizes the environment, narrative background, combatant teams, and team unit composition with a Simple Unit Description of each unit.

The narrative background should specify any battle or status effects relative to the battle. For example, if a team was specially motivated, high in morale, surprised, hungry, or any other considerations that bestow roll modifiers, as well as what those modifiers are.

Units are stereotyped according to race, superclass, and rarity. A superclass, or class kind, is an abstract stereotypical grouping of standard classes. Common and uncommon units are stereotyped as standard rarity. Rare and higher are stereotyped as heroic.

Stereotyped units may be qualified as magical where appropriate. Magical units attack using the magical attack battle statistic. Heroic units act alone and are referred to by name, while standard units act together and are referred to by race and superclass.

Consider the following example of stereotyping John and Sarah. John is a common human crossbowman. Sarah is an uncommon human knife thrower. Because they are both human, ranged, and nonmagical, they are jointly stereotyped as a unit called Two Ranged Humans. The stereotyped unit will receive a level equal to the rounded average level of the origin units. When a stereotyped unit attacks it receives a multiplier based on the unit count, which is two in the case of the Two Ranged Humans.

Every unit has these standard actions:

- Attack
- Defend
- Use Item
- Wait
- Flee

Waiting allows the unit to take their turn at the end of the round. Waiting twice in the same round results in passing, skipping, or forfeiting the turn for the unit. Fleeing rolls 1d6 on the Flee Table and the roll receives -1 if an adversarial team has any ranged or heroic units.

Standard units also get a standardized superclass ability. Class kinds and their superclass ability are listed below:

- Melee Assault. Superclass Ability: Attack with +1 to roll.
- Melee Defense. Superclass Ability: Super Defend: Defends self and one other unit for the round.
- Ranged. Superclass Ability: +1 to attack and defense rolls against melee units.
- Healing. Superclass Ability: 1d6 healing to friendly unit.
- Support. Superclass Ability: Roll 1d6 on the Standard Support Table.

Heroic units have standard actions, their superclass ability, and two special abilities. Each ability shall have a name and description which is included in the JSON Battle Report.

2. **Stat Allocation**: The statistics are assigned based on a qualitative assessment of each unit type. For example:

   - Ranged Humans might have normal attack, defense, speed, and health.
   - Ranged Elves would be more agile with higher speed and attack range but lower health.
   - Dwarves may be characterized by lower speed but higher health and defense.

Unit base combat statistics are rated on a scale of 1 to 5, before receiving modifiers for unit level, rarity, equipped items, and modifying effects:

- 1 = Very Low
- 2 = Low
- 3 = Normal
- 4 = High
- 5 = Very High

3. **Combat Mechanics**:

   - Turn order is determined by speed. The AI GM should declare turn order each round and play a world turn after all the units have moved for the round.
   - The chance to hit and damage are determined using the relevant statistic plus a 1d6 modifier.
   - To hit, the attacker's relevant stat plus 1d6 is compared against the defender's stat plus 1d6. If the attacker's total is higher, the hit is successful.
   - If health is reduced to zero, a unit is eliminated from turn order each round.
   - A unit can attempt to flee, but success is not guaranteed.
   - If the hit is succesful, damage is calculated similarly in an additional step with a seperate roll.
   - Terrain type, elevation, spell effects, and special abilities may modify those results further or alter the calculations.

## Simple Unit Description

A simple unit description includes:

1. Level
2. Name
   1. For standard units this is a stereotyped name based on unit count, magical status, superclass, and race.
   2. Three example names include "3 Ranged Dwarves", "2 Magical Melee Assault Elves", and "The Heroic Elven Rogue Eidolon"
3. Stereotyped Rarity: Heroic or Standard.
4. Superclass
5. Items: Only mention items that are relevant to battle, such as health potions. Disregard equipment in simple battle mode. Items and equipment with special effects or significance may still provide environment effects, provide abilities for heroic characters, or trigger events during the battle.
6. Special Abilities: Don't mention standard or superclass abilities. Do mention heroic abilities.
7. Combat Statistics:
   1. Health Points
   2. Speed
   3. Attack
   4. Defense
   5. Magic Attack
   6. Magic Defense

Each level provides a 25 percent bonus across base statistics, compounding. Leveling up may also unlock new abilities, quests, and events. In Aria's Tale, leveling up does not inherently heal players or refresh skills, abilities, or resources that are limited to a certain number of uses per day or per combat.

## Detailed Character Description

Detailed descriptions are not used in simple battle mode, but they can be used outside of battle and for complex battle. During the game, characters do not immediately reveal their detailed description. The human and AI game masters, however, are able to immediately access the whole detailed description.

Detailed descriptions include:

1. Awakening Region: Where did this character spawn into the game? This may or may not be the same region in which they were encountered.
2. Level
3. Name
4. Rarity: Roll d20 on the Rarity Table to determine character rarity.
5. Class
6. Race
7. Age
8. Items Held (a character is initialized with a random item check)
9. Character Backstory
10. Personal Ambitions and Goals
11. IRL Backstory: Is the character controlled by a real human, an AI, or unknown?
12. Memories: Does the character remember logging in? Is the character memory real or false?
13. Gender
14. Appearance: Eye color, hair color, skin tone, physical size, physical build. Include any notable characteristics such as tattoos, scars, facial hair, wings, and so on.
15. Notable affinities: Religions, cultures, guilds, and general reputation.
16. Guild Membership, if any.
17. Special Abilities, if any.
18. Base Combat Statistics

    1. Remember that leveling up will modify these base statistics. So we should seperately describe the base and current statistics, where current battle statistics are calculated from the base statistics plus leveling bonus.

19. Noncombat Statistics

    1. Big 5 personality traits, scale of 1 to 100 for each.
    2. Charisma
    3. Intelligence
    4. Dexterity
    5. Strength

20. Current State

    1. If the character has been injured then their current health will be lower than their total health points. In addition, if the character has any ailments or effects, it should be described here.
    2. Characters will get hungry and tired if they don't eat or sleep for twelve hours.

### Example Detailed Character Description:

```json
{
  "awakening_region": "Forest of Echoes",
  "level": 2,
  "name": "Tank",
  "rarity": "Unique",
  "classes": ["Warrior", "Guardian", "Spearman"],
  "race": "Human",
  "age": 30,
  "items_held": [
    "Spear",
    "Medium Wooden Shield",
    "Bronze Chestplate",
    "Healing Potion",
    "Bag of Walnuts"
  ],
  "character_backstory": "A seasoned warrior, known for his resilience and combat skills.",
  "personal_ambitions_goals": "To survive the challenges of Evergreen and defeat the 100th floor boss.",
  "irl_backstory": "Controlled by a player named Mike",
  "memories": "Remembers logging in, but now trapped in the game.",
  "gender": "Male",
  "appearance": {
    "eye_color": "Brown",
    "hair_color": "Black",
    "skin_tone": "Tanned",
    "physical_size": "Tall",
    "physical_build": "Muscular",
    "notable_characteristics": "A determined look"
  },
  "notable_affinities": {
    "religions": [],
    "cultures": ["Human"],
    "guild_membership": "The Shield Bearers",
    "reputations": [
      {
        "name": "Squirrelfolk of the Forest of Echoes",
        "reputation": "Minor Negative"
      }
    ]
  },
  "special_abilities": [
    "Defensive Spear Thrust",
    "Battle Cry",
    "Strategic Thinker (Passive)",
    "Painful Third Eye (Passive)",
    "Phalanx"
  ],
  "base_combat_statistics": {
    "health_points": 6,
    "attack": 5,
    "defense": 6,
    "speed": 3,
    "magic_defense": 2
  },
  "noncombat_statistics": {
    "big_5_personality_traits": {
      "openness": 50,
      "conscientiousness": 80,
      "extraversion": 60,
      "agreeableness": 70,
      "neuroticism": 40
    },
    "charisma": 65,
    "intelligence": 60,
    "dexterity": 70,
    "strength": 85
  },
  "current_state": {
    "health_status": "Full Health",
    "ailments_effects": "None",
    "hunger_status": "Satiated",
    "fatigue_status": "Rested"
  }
}
```
