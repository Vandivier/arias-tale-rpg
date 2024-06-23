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
      jumpForce: 300,
    };
    super(scene, x, y, "tank", data);
    this.createAnimations();
    this.playAnimation("tank-idle");
  }

  private createAnimations() {
    this.scene.anims.create({
      key: "tank-idle",
      frames: this.scene.anims.generateFrameNumbers("tank", { frames: [0] }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "tank-jump",
      frames: this.scene.anims.generateFrameNumbers("tank", { frames: [1] }),
      frameRate: 10,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "tank-attack",
      frames: this.scene.anims.generateFrameNumbers("tank", {
        frames: [2, 3, 4, 5],
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "tank-special",
      frames: this.scene.anims.generateFrameNumbers("tank", {
        frames: [6, 7, 8, 9],
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

    // Update animation based on state
    if (this.isJumping) {
      this.playAnimation("tank-jump");
    } else if (
      !this.sprite.anims.isPlaying ||
      this.sprite.anims.getName() === "tank-jump"
    ) {
      this.playAnimation("tank-idle");
    }
  }

  jump() {
    super.jump();
    if (this.isJumping) {
      this.playAnimation("tank-jump");
    }
  }

  attack(target: Character) {
    if (this.attackCooldown <= 0) {
      super.attack(target);
      this.playAnimation("tank-attack");

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
    }
  }

  specialAttack(target: Character) {
    if (this.specialAttackCooldown <= 0) {
      super.specialAttack(target);
      this.playAnimation("tank-special");

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
    }
  }
}
