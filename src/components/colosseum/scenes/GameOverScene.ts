import Phaser from "phaser";
import { type PlayerCharacter } from "./types";

export class GameOverScene extends Phaser.Scene {
  private player!: PlayerCharacter;
  private victories!: number;

  constructor() {
    super("GameOver");
  }

  init(data: { player: PlayerCharacter; victories: number }) {
    this.player = data.player;
    this.victories = data.victories;
  }

  create() {
    // Game Over title
    this.add
      .text(170, 50, "Game Over", { fontSize: "32px", color: "#ff0000" })
      .setOrigin(0.5);

    // Player stats
    const statsStyle = { fontSize: "16px", color: "#ffffff" };
    const statsX = 20;
    let statsY = 100;
    const lineHeight = 25;

    this.add.text(statsX, statsY, `Name: ${this.player.name}`, statsStyle);
    statsY += lineHeight;
    this.add.text(statsX, statsY, `Class: ${this.player.class}`, statsStyle);
    statsY += lineHeight;
    this.add.text(statsX, statsY, `Level: ${this.player.level}`, statsStyle);
    statsY += lineHeight;
    this.add.text(
      statsX,
      statsY,
      `Final Score: ${this.player.score}`,
      statsStyle,
    );
    statsY += lineHeight;
    this.add.text(statsX, statsY, `Victories: ${this.victories}`, statsStyle);
    statsY += lineHeight;
    this.add.text(statsX, statsY, `Gold: ${this.player.gold}`, statsStyle);
    statsY += lineHeight;
    this.add.text(
      statsX,
      statsY,
      `Experience: ${this.player.experience}`,
      statsStyle,
    );

    // Buttons
    const buttonStyle = {
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#333333",
      padding: { x: 10, y: 5 },
    };

    this.add
      .text(170, 400, "View Leaderboard", buttonStyle)
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () =>
        this.scene.start("Leaderboard", {
          name: this.player.name,
          score: this.player.score,
          victories: this.victories,
          level: this.player.level,
        }),
      );

    this.add
      .text(170, 450, "Play Again", buttonStyle)
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CharacterCreation"));
  }
}
