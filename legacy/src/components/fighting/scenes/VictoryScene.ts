export class VictoryScene extends Phaser.Scene {
  constructor() {
    super("VictoryScene");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 50, "Victory!", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const playAgainButton = this.add
      .text(width / 2, height / 2 + 50, "Play Again", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    playAgainButton.on("pointerdown", () => {
      this.scene.start("PlayerSelectScene");
    });
  }
}
