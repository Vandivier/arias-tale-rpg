// ./characters/Eidolon.ts
import { Character, type CharacterData } from "./Character";

export class Eidolon extends Character {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const data: CharacterData = {
      name: "Eidolon",
      health: 100,
      damage: 12,
      specialDamage: 22,
      jumpForce: 450,
    };
    super(scene, x, y, "eidolon", data);
    this.createAnimations();
  }

  private createAnimations() {
    this.scene.anims.create({
      key: "eidolon-attack",
      frames: this.scene.anims.generateFrameNumbers("eidolon", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "eidolon-special",
      frames: this.scene.anims.generateFrameNumbers("eidolon", {
        start: 4,
        end: 7,
      }),
      frameRate: 10,
      repeat: 0,
    });
  }

  attack(target: Character) {
    super.attack(target);
    this.sprite.play("eidolon-attack");
    this.shootArrow(target);
  }

  specialAttack(target: Character) {
    super.specialAttack(target);
    this.sprite.play("eidolon-special");
    // Shoot multiple arrows
    for (let i = 0; i < 3; i++) {
      this.scene.time.delayedCall(i * 100, () =>
        this.shootArrow(target, 20 - i * 10),
      );
    }
  }

  private shootArrow(target: Character, yOffset: number = 0) {
    const arrow = this.scene.add.line(
      this.sprite.x + 20,
      this.sprite.y - 10 + yOffset,
      0,
      0,
      20,
      0,
      0x8b4513,
    );
    const arrowTip = this.scene.add.triangle(
      this.sprite.x + 40,
      this.sprite.y - 10 + yOffset,
      0,
      -2,
      5,
      0,
      0,
      2,
      0x8b4513,
    );

    this.scene.tweens.add({
      targets: [arrow, arrowTip],
      x: target.sprite.x,
      duration: 500,
      onComplete: () => {
        arrow.destroy();
        arrowTip.destroy();
      },
    });
  }
}
