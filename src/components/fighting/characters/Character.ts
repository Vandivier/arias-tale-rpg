import Phaser from "phaser";

export interface CharacterData {
  name: string;
  health: number;
  damage: number;
  specialDamage: number;
  jumpForce: number;
}

export class Character {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  healthBar: Phaser.GameObjects.Rectangle;
  health: number;
  damage: number;
  specialDamage: number;
  jumpForce: number;
  isJumping: boolean = false;

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
    this.jumpForce = data.jumpForce;

    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0.2);

    // Ensure the body exists and is a dynamic body before setting gravity
    if (
      this.sprite.body &&
      this.sprite.body instanceof Phaser.Physics.Arcade.Body
    ) {
      this.sprite.body.setGravityY(300);
    }
  }

  jump() {
    if (
      this.sprite.body &&
      this.sprite.body instanceof Phaser.Physics.Arcade.Body &&
      this.sprite.body.touching.down
    ) {
      this.sprite.setVelocityY(-this.jumpForce);
    }
  }

  update(_time: number, _delta: number) {
    this.updateHealthBar();
  }

  isDefeated(): boolean {
    return this.health <= 0;
  }

  updateJumpState() {
    if (this.sprite.body.touching.down) {
      this.isJumping = false;
    }
  }

  moveLeft() {
    this.sprite.setVelocityX(-160);
    this.sprite.flipX = true;
  }

  moveRight() {
    this.sprite.setVelocityX(160);
    this.sprite.flipX = false;
  }

  stopHorizontalMovement() {
    this.sprite.setVelocityX(0);
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

  playAnimation(key: string) {
    if (!this.sprite.anims.isPlaying || this.sprite.anims.getName() !== key) {
      this.sprite.play(key);
    }
  }
}
