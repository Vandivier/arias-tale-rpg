import type Phaser from "phaser";

export interface CharacterData {
  name: string;
  health: number;
  damage: number;
  specialDamage: number;
}

export class Character {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  healthBar: Phaser.GameObjects.Rectangle;
  health: number;
  damage: number;
  specialDamage: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    data: CharacterData,
  ) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);

    this.healthBar = scene.add.rectangle(x, y - 50, 100, 10, 0x00ff00);
    this.health = data.health;
    this.damage = data.damage;
    this.specialDamage = data.specialDamage;
  }

  update(_time: number, _delta: number) {
    this.updateHealthBar();
  }

  attack(target: Character) {
    this.applyDamage(target, this.damage);
  }

  specialAttack(target: Character) {
    this.applyDamage(target, this.specialDamage);
  }

  applyDamage(target: Character, amount: number) {
    target.health = Math.max(0, target.health - amount);
    target.updateHealthBar();
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.setPosition(this.sprite.x, this.sprite.y - 50);
    this.healthBar.setSize((this.health / 100) * 100, 10);
  }
}
