import Phaser from "phaser";
import { PlayerCharacter, Enemy, Item, EquipmentSlot } from "./types";

export const AVATAR_MAX_HEIGHT = 200;

export function scaleSprite(
  sprite: Phaser.Physics.Arcade.Sprite,
  targetHeight: number,
) {
  const scale = targetHeight / sprite.height;
  sprite.setScale(scale);
}

export function calculateDamage(player: PlayerCharacter): number {
  const baseDamage = Phaser.Math.Between(5, 15);
  const classMultiplier =
    player.class === "warrior" ? 1.2 : player.class === "mage" ? 1.5 : 1.3;
  return Math.round(baseDamage * classMultiplier);
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

  loot.push({
    name: `${enemy.rarity} ${itemType}`,
    type: itemType,
    value: itemValue,
    effect: {
      [itemType === "weapon" ? "damage" : "defense"]: Math.floor(itemValue / 2),
    },
  });

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
    } else {
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
