type TagSeed = {
  isPrintedTag: boolean;
  name: string;
};

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
];

type SearchableImageSeed = {
  description: string;
  id: number;
  imageFileName: string;
  tags: string[];
  title: string;
};

export const searchableImages: SearchableImageSeed[] = [
  {
    description: "Archmage Caelum holding a moonstaff.",
    id: 1,
    imageFileName: "1-caelum-archmage-moonstaff.png",
    tags: ["caelum", "battler", "celestial"],
    title: "Archmage Caelum with a Moonstaff",
  },
  {
    description: "Archmage Caelum holding the Timesight Wand.",
    id: 2,
    imageFileName: "2-caelum-archmage-timesight-wand.png",
    tags: ["caelum", "battler", "celestial"],
    title: "Archmage Caelum with the Timesight Wand",
  },
  {
    description: "A troll strikes an opponent with a spiked mace.",
    id: 3,
    imageFileName: "3-mace-troll.png",
    tags: ["battler", "troll"],
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
