import Phaser from "phaser";

export class PlayerSelectScene extends Phaser.Scene {
  constructor() {
    super("PlayerSelectScene");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.2, "Select Your Character", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const characters = ["Tank", "Eidolon"];
    characters.forEach((char, index) => {
      const button = this.add
        .text(width / 2, height * (0.4 + index * 0.2), char, {
          fontSize: "20px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive();

      button.on("pointerdown", () => {
        this.scene.start("DifficultySelectScene", { character: char });
      });
    });
  }
}
