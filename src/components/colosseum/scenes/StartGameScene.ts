import Phaser from "phaser";

export class StartGameScene extends Phaser.Scene {
  constructor() {
    super("StartGameScene");
  }

  preload() {
    this.load.audio("typingSound", "assets/audio/typing.wav");
    this.load.audio("dialogSound", "assets/audio/dialogue.wav");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 3, "Evergreen", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Add start button
    this.add
      .text(width / 2, height / 2, "Start Game", {
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.startGame());

    // Add text to inform about sound
    // TODO: SettingsScene w toggle to enable/disable sound
    this.add
      .text(width / 2, (height * 2) / 3, "Click to enable sound", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Attempt to resume audio context on any interaction
    this.input.on("pointerdown", () => {
      if (this.sound.context.state === "suspended") {
        this.sound.context.resume();
      }
    });
  }

  startGame() {
    this.sound.play("typingSound");
    this.scene.start("CharacterCreation");
  }
}
