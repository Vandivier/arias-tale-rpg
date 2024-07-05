import Phaser from "phaser";
import {
  type Battler,
  type CharacterClassType,
  type Enemy,
  type EquipmentSlot,
  type GenderTypes,
  type Item,
  type PlayerCharacter,
} from "../types";

export const AVATAR_MAX_HEIGHT = 200;

export function scaleSprite(
  sprite: Phaser.Physics.Arcade.Sprite,
  targetHeight: number,
) {
  const scale = targetHeight / sprite.height;
  sprite.setScale(scale);
}

export function calculateDamage(_player: PlayerCharacter): number {
  return Phaser.Math.Between(1, 20);
}

export function calculateEnemyDamage(enemy: Enemy): number {
  const baseDamage = Phaser.Math.Between(3, 10);
  const rarityMultiplier =
    enemy.rarity === "Common" ? 1 : enemy.rarity === "Uncommon" ? 1.3 : 1.6;
  return Math.round(baseDamage * rarityMultiplier);
}

export function generateLoot(enemy: Enemy): Item[] {
  const lootChance =
    enemy.rarity === "Common" ? 0.3 : enemy.rarity === "Uncommon" ? 0.5 : 0.7;
  if (Math.random() > lootChance) return [];

  const loot: Item[] = [];
  const itemTypes: EquipmentSlot[] = [
    "weapon",
    "gloves",
    "helm",
    "boots",
    "necklace",
  ];
  const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  const itemValue =
    enemy.rarity === "Common"
      ? Phaser.Math.Between(5, 15)
      : enemy.rarity === "Uncommon"
        ? Phaser.Math.Between(15, 30)
        : Phaser.Math.Between(30, 50);

  if (itemType) {
    loot.push({
      name: `${enemy.rarity} ${itemType}`,
      type: itemType,
      value: itemValue,
      effect: {
        [itemType === "weapon" ? "damage" : "defense"]: Math.floor(
          itemValue / 2,
        ),
      },
    });
  }

  return loot;
}

export function generateStoreItems(): Item[] {
  const items: Item[] = [];
  const itemTypes: (EquipmentSlot | "consumable")[] = [
    "weapon",
    "gloves",
    "helm",
    "boots",
    "necklace",
    "consumable",
  ];

  for (let i = 0; i < 5; i++) {
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const itemValue = Phaser.Math.Between(10, 100);

    if (itemType === "consumable") {
      items.push({
        name: "Health Potion",
        type: "consumable",
        value: itemValue,
        effect: { health: Math.floor(itemValue / 2) },
      });
    } else if (itemType) {
      items.push({
        name: `Store ${itemType}`,
        type: itemType,
        value: itemValue,
        effect: {
          [itemType === "weapon" ? "damage" : "defense"]: Math.floor(
            itemValue / 3,
          ),
        },
      });
    }
  }

  return items;
}

export const createButton = (
  scene: Phaser.Scene,
  text: string,
  x: number,
  y: number,
  callback: () => void,
): Phaser.GameObjects.Text => {
  const button = scene.add
    .text(x, y, text, {
      fontSize: "20px",
      color: "#fff",
      backgroundColor: "#333",
      padding: { x: 10, y: 5 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerover", () => {
      button.setStyle({ backgroundColor: "#555" });
    })
    .on("pointerout", () => {
      button.setStyle({ backgroundColor: "#333" });
    })
    .on("pointerdown", callback)
    .setVisible(false);

  return button;
};

type Sprite = {
  spriteFile: string;
  spriteStartHorizontal: number;
  spriteStartVertical: number;
};

const defaultSprite: Sprite = {
  spriteFile: "spritesheet-1.png",
  spriteStartHorizontal: 0,
  spriteStartVertical: 0,
};

export const spriteMap: {
  [GenderType in GenderTypes]: { [ClassType in CharacterClassType]?: Sprite };
} = {
  female: {},
  male: {
    warrior: defaultSprite,
  },
};

export const getSprite = (battler: Battler): Sprite =>
  spriteMap[battler.gender]?.[battler.class] ?? defaultSprite;

export const defaultBattler: Battler = {
  id: 2,
  class: "archer",
  eyeColor: "black",
  hairColor: "black",
  gender: "female",
  fileName: "female-archer-black-hair.webp",
};

export const battlers: Battler[] = [
  defaultBattler,
  {
    id: 3,
    class: "mage",
    eyeColor: "black",
    hairColor: "black",
    gender: "female",
    fileName: "female-black-holy-mage.webp",
  },
  {
    id: 4,
    class: "archer",
    eyeColor: "brown",
    hairColor: "brown",
    gender: "male",
    fileName: "male-archer-brown-hair.webp",
  },
  {
    id: 5,
    class: "archer",
    eyeColor: "blue",
    hairColor: "blonde",
    gender: "male",
    fileName: "male-blonde-archer.webp",
  },
  {
    id: 6,
    class: "mage",
    eyeColor: "gray",
    hairColor: "gray",
    gender: "male",
    fileName: "male-mage-gray-hair.webp",
  },
  {
    id: 7,
    class: "mage",
    eyeColor: "red",
    hairColor: "red",
    gender: "male",
    fileName: "male-red-mage.webp",
  },
  {
    id: 8,
    class: "warrior",
    eyeColor: "black",
    hairColor: "black",
    gender: "male",
    fileName: "swordsman-black-hair.webp",
  },
  {
    id: 9,
    class: "warrior",
    eyeColor: "brown",
    hairColor: "brown",
    gender: "male",
    fileName: "swordsman-brown-hair.webp",
  },
  {
    id: 10,
    class: "warrior",
    eyeColor: "gray",
    hairColor: "gray",
    gender: "male",
    fileName: "swordsman-gray-hair.webp",
  },
  {
    id: 11,
    class: "warrior",
    eyeColor: "blue",
    hairColor: "blonde",
    gender: "female",
    fileName: "swordswoman-blonde.webp",
  },
  {
    id: 12,
    class: "warrior",
    eyeColor: "brown",
    hairColor: "two-color",
    gender: "female",
    fileName: "swordswoman-two-color-hair.webp",
  },
];
