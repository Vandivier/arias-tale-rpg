import Phaser from "phaser";

export class DifficultySelectScene extends Phaser.Scene {
  constructor() {
    super("DifficultySelectScene");
  }

  create(data: { character: string }) {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.2, "Select Difficulty", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const difficulties = ["Easy", "Medium", "Hard"];
    difficulties.forEach((difficulty, index) => {
      const button = this.add
        .text(width / 2, height * (0.4 + index * 0.15), difficulty, {
          fontSize: "24px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive();

      button.on("pointerdown", () => {
        this.scene.start("BattleScene", {
          character: data.character,
          difficulty: difficulty.toLowerCase(),
        });
      });
    });
  }
}
