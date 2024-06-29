import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create(data: { winner: string }) {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.4, `${data.winner} Wins!`, {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const restartButton = this.add
      .text(width / 2, height * 0.6, "Play Again", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.start("PlayerSelectScene");
    });
  }
}
