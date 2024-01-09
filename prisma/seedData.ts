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
    description: "Can strike two opponents at once with a lightning bolt.",
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
];
