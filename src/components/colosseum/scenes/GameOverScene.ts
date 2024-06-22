import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  private victories: number = 0;

  constructor() {
    super("GameOver");
  }

  init(data: { score: number; victories: number }) {
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
          score: this.score,
          victories: this.victories,
        }),
      );
  }
}
