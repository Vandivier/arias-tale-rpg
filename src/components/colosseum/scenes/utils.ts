import Phaser from "phaser";
import {
  type Enemy,
  type EquipmentSlot,
  type Item,
  type PlayerCharacter,
} from "./types";
type TextType = "typing" | "dialogue";

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

export const animateText = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  textType: TextType = "typing",
  style: Phaser.Types.GameObjects.Text.TextStyle = {},
  onComplete?: () => void,
) => {
  let index = 0;
  let displayedText = "";
  const typingSounds = [
    scene.sound.add("typingSound1"),
    scene.sound.add("typingSound2"),
    scene.sound.add("typingSound3"),
    scene.sound.add("typingSound4"),
  ];
  const dialogueSounds = [
    scene.sound.add("dialogSound1"),
    scene.sound.add("dialogSound2"),
    scene.sound.add("dialogSound3"),
  ];

  const textObject = scene.add.text(x, y, "", style).setOrigin(0.5);
  const baseDelay = 50;

  const playSound = () => {
    const soundArray = textType === "typing" ? typingSounds : dialogueSounds;
    const randomSound = Phaser.Math.RND.pick(soundArray);
    randomSound.play({ volume: 0.5 });
  };

  const timer = scene.time.addEvent({
    delay: baseDelay,
    callback: () => {
      if (index < text.length) {
        if (text[index] !== " ") {
          playSound();
        }
        displayedText += text[index];
        textObject.setText(displayedText);
        index++;

        // Randomize the delay for the next character
        timer.delay = baseDelay + Math.random() * 30 - 15;

        // If this is the last character, call onComplete
        if (index === text.length && onComplete) {
          onComplete();
        }
      } else {
        timer.remove();
      }
    },
    repeat: text.length - 1,
  });

  const skipAnimation = () => {
    timer.remove();
    textObject.setText(text);
    if (onComplete) onComplete();
    scene.input.off("pointerdown", skipAnimation); // Remove the listener
  };

  scene.input.on("pointerdown", skipAnimation);

  return textObject;
};
