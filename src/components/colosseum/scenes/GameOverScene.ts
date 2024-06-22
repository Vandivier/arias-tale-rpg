import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
  private level: number = 1;
  private name: string = "";
  private score: number = 0;
  private victories: number = 0;

  constructor() {
    super("GameOver");
  }

  init(data: {
    level: number;
    name: string;
    score: number;
    victories: number;
  }) {
    this.level = data.level;
    this.name = data.name;
    this.score = data.score;
    this.victories = data.victories;
  }

  create() {
    this.add
      .text(400, 100, "Game Over", { fontSize: "48px", color: "#ff0000" })
      .setOrigin(0.5);
    this.add
      .text(400, 200, `Final Score: ${this.score}`, {
        fontSize: "24px",
        color: "#fff",
      })
      .setOrigin(0.5);
    this.add
      .text(400, 250, `Victories: ${this.victories}`, {
        fontSize: "24px",
        color: "#fff",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 350, "Restart Game", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CharacterCreation"));

    this.add
      .text(400, 400, "View Leaderboard", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () =>
        this.scene.start("Leaderboard", {
          name: this.name,
          score: this.score,
          victories: this.victories,
          level: this.level,
        }),
      );
  }
}
