import Phaser from "phaser";

export class StartGameScene extends Phaser.Scene {
  constructor() {
    super("StartGameScene");
  }

  preload() {
    // Preload assets here
    this.load.audio("typingSound", "assets/audio/typing.wav");
    this.load.audio("dialogSound", "assets/audio/dialogue.wav");
    // Add any other assets you want to preload
  }

  create() {
    const { width, height } = this.scale;

    // Add a title
    this.add
      .text(width / 2, height / 3, "Evergreen", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Add start button
    const startButton = this.add
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
    // Play a sound to ensure audio is working
    this.sound.play("typingSound");

    // Transition to the character creation scene
    this.scene.start("CharacterCreation");
  }
}
