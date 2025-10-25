import Phaser from "phaser";

export class StartGameScene extends Phaser.Scene {
  constructor() {
    super("StartGameScene");
  }

  preload() {
    this.load.audio("typingSound1", "/assets/audio/typing_1.mp3");
    this.load.audio("typingSound2", "/assets/audio/typing_2.mp3");
    this.load.audio("typingSound3", "/assets/audio/typing_3.mp3");
    this.load.audio("typingSound4", "/assets/audio/typing_4.mp3");
    this.load.audio("dialogSound1", "/assets/audio/dialogue_1.mp3");
    this.load.audio("dialogSound2", "/assets/audio/dialogue_2.mp3");
    this.load.audio("dialogSound3", "/assets/audio/dialogue_3.mp3");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 3, "Evergreen", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

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

    this.add
      .text(width / 2, (height * 2) / 3, "Click to enable sound", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.input.on("pointerdown", () => {
      if (this.sound instanceof Phaser.Sound.WebAudioSoundManager) {
        if (this.sound.context.state === "suspended") {
          this.sound.context.resume();
        }
      }
    });
  }

  startGame() {
    this.scene.start("CharacterCreation");
  }
}
