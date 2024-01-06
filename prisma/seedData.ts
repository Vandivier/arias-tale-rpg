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
    imageFileName: "4-guardian-elemental.png",
    tags: ["fire", "elemental", "battler"],
    title: "Guardian Fire Elemental",
  },
];
