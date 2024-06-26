export const defaultClass = "warrior" as const;
export const playerClasses = ["warrior", "mage", "archer"] as const;

export type PlayerClass = (typeof playerClasses)[number];
export type EnemyRarity = "Common" | "Uncommon" | "Rare";
export type EnemyTier =
  | "F"
  | "E"
  | "D"
  | "C"
  | "B"
  | "A"
  | "AA"
  | "AAA"
  | "R"
  | "RR"
  | "RRR"
  | "S"
  | "SS"
  | "SSS";
export type EquipmentSlot = "weapon" | "gloves" | "helm" | "boots" | "necklace";

export interface Item {
  name: string;
  type: EquipmentSlot | "consumable";
  value: number;
  effect?: Record<string, number>;
}

export interface Equipment {
  weapon: Item | null;
  gloves: Item | null;
  helm: Item | null;
  boots: Item | null;
  necklace: Item | null;
}

export interface PlayerCharacter {
  battlerId: number;
  class: PlayerClass;
  effects?: {
    poisonedSmog?: number;
  };
  equipment: Equipment;
  experience: number;
  gold: number;
  health: number;
  inventory: Item[];
  level: number;
  maxHealth: number;
  name: string;
  score: number;
}

export interface Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  maxHealth: number;
  rarity: EnemyRarity;
  tier: EnemyTier;
  loot?: Item[];
}
