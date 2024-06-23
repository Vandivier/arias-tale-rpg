import { Character, type CharacterData } from "./Character";

export class Tank extends Character {
  private attackCooldown: number = 0;
  private specialAttackCooldown: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const data: CharacterData = {
      name: "Tank",
      health: 150,
      damage: 15,
      specialDamage: 25,
    };
    super(scene, x, y, "tank", data);
    this.createAnimations();
    this.sprite.setFrame(0);
  }

  private createAnimations() {
    this.scene.anims.create({
      key: "tank-idle",
      frames: [{ key: "tank", frame: 0 }],
      frameRate: 10,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "tank-attack",
      frames: this.scene.anims.generateFrameNumbers("tank", {
        frames: [1, 2, 3, 4],
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "tank-special",
      frames: this.scene.anims.generateFrameNumbers("tank", {
        frames: [5, 6, 7, 8],
      }),
      frameRate: 10,
      repeat: 0,
    });
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }

    if (this.specialAttackCooldown > 0) {
      this.specialAttackCooldown -= delta;
    }
  }

  attack(target: Character) {
    if (this.attackCooldown <= 0) {
      super.attack(target);
      this.sprite.play("tank-attack");

      // Create spear thrust effect
      const spear = this.scene.add.rectangle(
        this.sprite.x + (this.sprite.flipX ? -50 : 50),
        this.sprite.y,
        40,
        5,
        0x8b4513,
      );

      this.scene.tweens.add({
        targets: spear,
        scaleX: 1.5,
        duration: 100,
        yoyo: true,
        onComplete: () => spear.destroy(),
      });

      // Apply damage after a short delay
      this.scene.time.delayedCall(250, () => {
        const distance = Phaser.Math.Distance.Between(
          this.sprite.x,
          this.sprite.y,
          target.sprite.x,
          target.sprite.y,
        );
        if (distance < 100) {
          // Only apply damage if target is close enough
          target.takeDamage(this.damage);
        }
      });

      // Set cooldown
      this.attackCooldown = 1000; // 1 second cooldown

      // Return to idle after attack animation
      this.scene.time.delayedCall(400, () => this.idle());
    }
  }

  specialAttack(target: Character) {
    if (this.specialAttackCooldown <= 0) {
      super.specialAttack(target);
      this.sprite.play("tank-special");

      // Create spinning spear attack effect
      const spear = this.scene.add.rectangle(
        this.sprite.x,
        this.sprite.y,
        50,
        5,
        0x8b4513,
      );

      this.scene.tweens.add({
        targets: spear,
        angle: 360,
        scale: 1.5,
        duration: 500,
        onComplete: () => spear.destroy(),
      });

      // Apply damage after a short delay
      this.scene.time.delayedCall(250, () => {
        const distance = Phaser.Math.Distance.Between(
          this.sprite.x,
          this.sprite.y,
          target.sprite.x,
          target.sprite.y,
        );
        if (distance < 150) {
          // Larger range for special attack
          target.takeDamage(this.specialDamage);
        }
      });

      // Set cooldown
      this.specialAttackCooldown = 5000; // 5 seconds cooldown

      // Return to idle after special attack animation
      this.scene.time.delayedCall(500, () => this.idle());
    }
  }

  idle() {
    this.sprite.play("tank-idle");
  }

  takeDamage(amount: number) {
    super.takeDamage(amount);

    // Flash red when taking damage
    this.scene.tweens.add({
      targets: this.sprite,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
    });
  }
}
