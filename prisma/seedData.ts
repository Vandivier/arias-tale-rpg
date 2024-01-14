import { CardRarityEnum } from "@prisma/client";

type TagSeed = {
  isPrintedTag: boolean;
  name: string;
};

// TODO: seed notable non_battler tags including techniques, items, environments, and events
export const tags: TagSeed[] = [
  {
    isPrintedTag: false,
    name: "caelum",
  },
  {
    isPrintedTag: true,
    name: "battler",
  },
  {
    isPrintedTag: true,
    name: "troll",
  },
  {
    isPrintedTag: true,
    name: "celestial",
  },
  {
    isPrintedTag: true,
    name: "fire",
  },
  {
    isPrintedTag: true,
    name: "elemental",
  },
  { isPrintedTag: true, name: "thunder" },
  { isPrintedTag: true, name: "magic" },
  { isPrintedTag: true, name: "ranged" },
  { isPrintedTag: false, name: "arc-caelum-ch-1" },
  { isPrintedTag: true, name: "bug" },
  { isPrintedTag: true, name: "monster" },
  { isPrintedTag: false, name: "lyra" },
  { isPrintedTag: true, name: "melee" },
  { isPrintedTag: true, name: "dual-wield" },
  { isPrintedTag: false, name: "arc-aria-ch-3" },
  { isPrintedTag: false, name: "arc-aria-ch-4" },
  { isPrintedTag: false, name: "elara" },
  // Note: "Tank" refers to a character name, not a unit class
  { isPrintedTag: false, name: "tank" },
  { isPrintedTag: true, name: "healing" },
];

type SearchableImageSeed = {
  description: string;
  id: number;
  imageFileName: string;
  tags: string[];
  title: string;
};

type GameCardSeed = {
  id: number;
  name?: string;
  description?: string;

  isGeneric: boolean;
  rarity: CardRarityEnum;

  battlerPower?: number;
  battlerHealth?: number;
  imageTitle: string;
};

export const searchableImageSeeds: SearchableImageSeed[] = [
  {
    description: "Archmage Caelum holding a moonstaff.",
    id: 1,
    imageFileName: "1-caelum-archmage-moonstaff.png",
    tags: ["caelum", "battler", "celestial", "magic"],
    title: "Archmage Caelum with a Moonstaff",
  },
  {
    description: "Archmage Caelum holding the Timesight Wand.",
    id: 2,
    imageFileName: "2-caelum-archmage-timesight-wand.png",
    tags: ["caelum", "battler", "celestial", "magic"],
    title: "Archmage Caelum with the Timesight Wand",
  },
  {
    description: "A troll strikes an opponent with a spiked mace.",
    id: 3,
    imageFileName: "3-mace-troll.png",
    tags: ["battler", "troll", "melee"],
    title: "Mace Troll",
  },
  {
    description:
      "A fire elemental with the ability to create a massive fire shield.",
    id: 4,
    imageFileName: "4-guardian-fire-elemental.png",
    tags: ["fire", "elemental", "battler"],
    title: "Guardian Fire Elemental",
  },
  {
    description:
      "A thunder mage can strike two opponents at once with a lightning bolt.",
    id: 5,
    imageFileName: "5-thunder-mage.png",
    tags: ["thunder", "magic", "ranged", "battler"],
    title: "Thunder Mage",
  },
  {
    description:
      "Caelum, surrounded by vibrant crystals, is exhausted after his battle.",
    id: 6,
    imageFileName: "6-vibrant-anime-caelum-exhausted.png",
    tags: ["celestial", "ranged", "battler", "arc-caelum-ch-1"],
    title: "Vibrant Exhausted Caelum",
  },
  {
    description:
      "A crystal spider feeds on magical energy and has sharp claws.",
    id: 7,
    imageFileName: "7-crystal-spider.png",
    tags: ["bug", "monster", "arc-caelum-ch-1", "battler"],
    title: "Crystal Spider",
  },
  {
    description:
      "Caelum, with his Stardust Bow drawn, is ready to fire an arrow.",
    id: 8,
    imageFileName: "8-caelum-mystic-archer-adrenaline.png",
    tags: ["arc-caelum-ch-1", "caelum", "battler", "celestial", "ranged"],
    title: "Adrenaline Rush Caelum",
  },
  {
    description: "A pack of crystal spiders attacking Caelum.",
    id: 9,
    imageFileName: "9-pack-of-crystal-spiders.png",
    tags: ["bug", "monster", "arc-caelum-ch-1", "battler", "caelum"],
    title: "Pack of Crystal Spiders",
  },
  {
    description: "Caelum, the mystic archer, standing calm.",
    id: 10,
    imageFileName: "10-caelum-mystic-archer-calm.png",
    tags: ["arc-caelum-ch-1", "caelum", "battler", "celestial", "ranged"],
    title: "Caelum the Mystic Archer",
  },
  {
    description:
      "Young Caelum appears shocked, stressed, confused, or embarrassed in an anime art style.",
    id: 11,
    imageFileName: "11-caelum-young-shocked.png",
    tags: ["caelum"],
    title: "Young Caelum is Shocked",
  },
  {
    description:
      "Lyra prepares to fight a lizard monster at the Lake of Whispers.",
    id: 12,
    imageFileName: "12-lyra-twin-swords.png",
    tags: ["lyra", "melee", "dual-wield", "arc-aria-ch-3"],
    title: "Lyra with Twin Swords at the Lake of Whispers",
  },
  {
    description:
      "The Shield Bearers in their signature phalanx, with Elara adding magical shielding to the physical shields of the melee members.",
    id: 13,
    imageFileName: "13-shield-bearers-in-phalanx.png",
    tags: ["arc-aria-ch-4", "elara", "battler", "melee"],
    title: "Shield Bearers in Phalanx",
  },
  {
    description:
      "Elara revives Tank after his death at the hands of the water and metal elemental during initiation into the Shield Bearers.",
    id: 14,
    imageFileName: "14-elara-can-minor-revive.png",
    tags: ["arc-aria-ch-3", "elara", "tank", "healing"],
    title: "Elara the Reviver in Stained Glass",
  },
];

export const gameCardSeeds: GameCardSeed[] = [
  {
    id: 1,
    isGeneric: false,
    rarity: CardRarityEnum.UNIQUE,
    battlerPower: 2400,
    battlerHealth: 4,
    imageTitle: "Archmage Caelum with a Moonstaff",
  },
  {
    id: 2,
    description:
      "Once per turn, declare a battler. If it is an ally, let them attack twice. If it is an opponent, they cannot neither attack nor activate effects on their next turn.",
    isGeneric: false,
    rarity: CardRarityEnum.UNIQUE,
    battlerPower: 1200,
    battlerHealth: 4,
    imageTitle: "Archmage Caelum with the Timesight Wand",
  },
  {
    id: 3,
    isGeneric: false,
    rarity: CardRarityEnum.UNCOMMON,
    battlerPower: 600,
    battlerHealth: 3,
    imageTitle: "Mace Troll",
  },
  {
    id: 4,
    name: "Oh No!",
    description:
      "Select an opposing battler and roll 2d6. Apply one of the following effects: 2: (Surprising Backfire) One of your own battlers is stunned this turn. 3-5: (Surprised) They are stunned for a turn. 6-8: (Confused) They are confused and must attack an ally battler if any are on the field. 9-11: (Embarrassed) They take double damage this turn. 12: (Critically Confused) They attack each ally once and cannot attack on their turn.",
    isGeneric: true,
    rarity: CardRarityEnum.RARE,
    imageTitle: "Young Caelum is Shocked",
  },
];
