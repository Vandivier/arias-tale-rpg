export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.spritesheet(
      "tank",
      "assets/fighting-sprites/tank_spritesheet.webp",
      {
        frameWidth: 100,
        frameHeight: 100,
      },
    );
    this.load.spritesheet(
      "eidolon",
      "assets/fighting-sprites/eidolon_spritesheet.webp",
      {
        frameWidth: 100,
        frameHeight: 100,
      },
    );
    this.load.image(
      "background",
      "assets/fighting-sprites/battle_background.webp",
    );
  }

  create() {
    this.scene.start("PlayerSelectScene");
  }
}
