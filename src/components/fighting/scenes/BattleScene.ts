import Phaser from "phaser";
import { type Character } from "../characters/Character";
import { Tank } from "../characters/Tank";

export class BattleScene extends Phaser.Scene {
  private player1!: Character;
  private player2!: Character;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private attackKey!: Phaser.Input.Keyboard.Key;
  private specialKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("BattleScene");
  }

  create(data: { character: string; difficulty: string }) {
    const { width, height } = this.scale;

    // Add background
    const background = this.add
      .image(width / 2, height / 2, "background")
      .setDepth(-1);

    // Scale the background to cover the entire canvas
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    // Create ground
    const ground = this.add.rectangle(
      width / 2,
      height - 20,
      width,
      40,
      0x00ff00,
    );
    this.physics.add.existing(ground, true);

    // Create players
    this.player1 = this.createCharacter(
      data.character,
      width * 0.25,
      height * 0.7,
    );
    this.player2 = this.createCharacter(
      this.getRandomCharacter(),
      width * 0.75,
      height * 0.7,
    );

    // Set up collisions
    this.physics.add.collider(this.player1.sprite, ground);
    this.physics.add.collider(this.player2.sprite, ground);
    this.physics.add.collider(this.player1.sprite, this.player2.sprite);

    // Set up input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.jumpKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );
      this.attackKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A,
      );
      this.specialKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S,
      );
    } else {
      throw new Error("Keyboard input is not available");
    }

    // Set up AI based on difficulty
    this.setupAI(data.difficulty);
  }

  createCharacter(type: string, x: number, y: number): Character {
    switch (type) {
      case "Eidolon":
        return new Tank(this, x, y);
      case "Tank":
        return new Tank(this, x, y);
      default:
        throw new Error(`Unknown character type: ${type}`);
    }
  }

  getRandomCharacter(): string {
    return "Tank"; // For now, always return Tank
  }

  setupAI(difficulty: string) {
    let aiUpdateInterval: number;
    switch (difficulty) {
      case "easy":
        aiUpdateInterval = 2000;
        break;
      case "medium":
        aiUpdateInterval = 1000;
        break;
      case "hard":
        aiUpdateInterval = 500;
        break;
      default:
        aiUpdateInterval = 1000;
    }

    this.time.addEvent({
      delay: aiUpdateInterval,
      callback: this.updateAI,
      callbackScope: this,
      loop: true,
    });
  }

  updateAI() {
    const distance = Phaser.Math.Distance.Between(
      this.player1.sprite.x,
      this.player1.sprite.y,
      this.player2.sprite.x,
      this.player2.sprite.y,
    );

    if (distance < 100) {
      if (Math.random() < 0.7) {
        this.player2.attack(this.player1);
      } else {
        this.player2.specialAttack(this.player1);
      }
    } else {
      this.player2.sprite.setVelocityX(
        this.player1.sprite.x < this.player2.sprite.x ? -160 : 160,
      );

      if (Math.random() < 0.1 && this.player2.sprite.body?.touching.down) {
        this.player2.sprite.setVelocityY(-330);
      }
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.player1.update(time, delta);
    this.player2.update(time, delta);

    if (this.player2.isDefeated()) {
      this.scene.start("VictoryScene");
    } else if (this.player1.isDefeated()) {
      this.scene.start("GameOverScene");
    }

    if (this.cursors.left.isDown) {
      this.player1.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player1.moveRight();
    } else {
      this.player1.stopHorizontalMovement();
    }

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.player1.jump();
    }

    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.player1.attack(this.player2);
    }

    if (Phaser.Input.Keyboard.JustDown(this.specialKey)) {
      this.player1.specialAttack(this.player2);
    }

    this.updateAI();
  }
}
