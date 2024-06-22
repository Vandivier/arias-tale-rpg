import Phaser from "phaser";
import {
  type PlayerClass,
  type PlayerCharacter,
  type Equipment,
} from "./types";

export class CharacterCreationScene extends Phaser.Scene {
  private nameInput!: Phaser.GameObjects.DOMElement;
  private classButtons: Phaser.GameObjects.Text[] = [];
  private selectedClass: PlayerClass | null = null;

  constructor() {
    super("CharacterCreation");
  }

  create() {
    this.add
      .text(170, 50, "Create Your Character", {
        fontSize: "24px",
        color: "#fff",
      })
      .setOrigin(0.5);

    this.nameInput = this.add
      .dom(170, 120, "input", "width: 200px; height: 30px;")
      .setOrigin(0.5);

    const classes: PlayerClass[] = ["warrior", "mage", "archer"];
    classes.forEach((cls, index) => {
      const button = this.add
        .text(170, 200 + index * 50, cls, { fontSize: "20px", color: "#fff" })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectClass(cls));
      this.classButtons.push(button);

      // Add sprite preview
      this.add
        .image(170, 225 + index * 50, cls)
        .setScale(0.4)
        .setOrigin(0.5);
    });

    this.add
      .text(170, 450, "Start Game", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.startGame());
  }

  selectClass(cls: PlayerClass) {
    this.selectedClass = cls;
    this.classButtons.forEach((button) => {
      if (button && this.children.exists(button)) {
        button.setColor(button.text === cls ? "#ff0" : "#fff");
      }
    });
  }

  startGame() {
    const name = (this.nameInput.node as HTMLInputElement).value.trim();
    if (!name || !this.selectedClass) {
      this.add
        .text(400, 500, "Please enter a name and select a class", {
          fontSize: "20px",
          color: "#ff0000",
        })
        .setOrigin(0.5);
      return;
    }

    const initialEquipment: Equipment = {
      weapon: null,
      gloves: null,
      helm: null,
      boots: null,
      necklace: null,
    };

    const player: PlayerCharacter = {
      name,
      class: this.selectedClass,
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      gold: 0,
      inventory: [],
      equipment: initialEquipment,
      score: 0,
    };

    this.scene.start("Battle", { player });
  }
}
