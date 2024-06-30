import Phaser from "phaser";
import {
  playerClasses,
  type Equipment,
  type PlayerCharacter,
  type PlayerClass,
} from "./types";
import { animateText } from "./utils";

export class CharacterCreationScene extends Phaser.Scene {
  private currentStep: number = 0;
  private narrativeText!: Phaser.GameObjects.Text;
  private continueButton!: Phaser.GameObjects.Text;
  private rejectButton!: Phaser.GameObjects.Text;
  private nameInput!: Phaser.GameObjects.DOMElement;
  private classButtons: Phaser.GameObjects.Text[] = [];
  private selectedClass: PlayerClass | null = null;
  private suggestedName: string = "";
  private suggestedClass: PlayerClass | null = null;
  private currentTextObject: Phaser.GameObjects.Text | null = null;

  constructor() {
    super("CharacterCreation");
  }

  create() {
    this.narrativeText = this.add
      .text(170, 100, "", {
        fontSize: "16px",
        color: "#fff",
        wordWrap: { width: 300 },
      })
      .setOrigin(0.5);

    this.continueButton = this.add
      .text(170, 450, "Continue listening", {
        fontSize: "20px",
        color: "#fff",
        backgroundColor: "#333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.nextStep())
      .setVisible(false);

    this.rejectButton = this.add
      .text(170, 500, "Shout: 'Hey, that's not me!'", {
        fontSize: "20px",
        color: "#fff",
        backgroundColor: "#333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.rejectSuggestion())
      .setVisible(false);

    this.nextStep();
  }

  nextStep() {
    this.currentStep++;
    switch (this.currentStep) {
      case 1:
        this.showNarrativeText(
          "Anyone who speaks to The Great Dreamer in their mind has exited their plane, because The Great Dreamer lives outside of the planes.",
        );
        break;
      case 2:
        this.showNarrativeText(
          'The Dreamer wonders "What is it like outside of the planes, where I am? Are there plants and towns and people here too?"',
        );
        break;
      case 3:
        this.showNarrativeText(
          "The Dreamer thinks of many such things that could be outside of the planes, and so they begin to appear...",
        );
        break;
      case 4:
        this.suggestCharacter();
        break;
      default:
        this.startGame();
    }
  }

  showNarrativeText(text: string) {
    if (this.currentTextObject) {
      this.currentTextObject.destroy();
    }

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.currentTextObject = animateText(
      this,
      centerX,
      centerY,
      text,
      "typing",
      {
        fontSize: "16px",
        color: "#fff",
        wordWrap: { width: 300 },
        align: "center",
      },
      () => {
        this.continueButton.setVisible(true);
        this.rejectButton.setVisible(false);
      },
    );
  }

  suggestCharacter() {
    this.suggestedClass =
      playerClasses[Phaser.Math.Between(0, playerClasses.length - 1)] ??
      "warrior";
    this.suggestedName = this.getRandomName();

    if (this.narrativeText) {
      this.narrativeText.destroy();
    }

    if (this.currentTextObject) {
      this.currentTextObject.destroy();
    }

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.currentTextObject = animateText(
      this,
      centerX,
      centerY,
      `He thinks of you, ${this.suggestedClass === "archer" ? "an" : "a"} ${
        this.suggestedClass
      } called ${this.suggestedName}...`,
      "typing",
      {
        fontSize: "16px",
        color: "#fff",
        wordWrap: { width: 300 },
        align: "center",
      },
      () => {
        this.continueButton.setVisible(true);
        this.rejectButton.setVisible(true);
      },
    );
  }

  rejectSuggestion() {
    if (this.currentTextObject) {
      this.currentTextObject.destroy();
    }

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.currentTextObject = animateText(
      this,
      centerX,
      centerY,
      "Oh, what is your name then?",
      "typing",
      {
        fontSize: "16px",
        color: "#fff",
        wordWrap: { width: 300 },
        align: "center",
      },
      () => {
        this.showNameInput();
      },
    );

    this.continueButton.setVisible(false);
    this.rejectButton.setVisible(false);
  }

  getRandomName(): string {
    const defaultName = "Aria";
    const names = [
      defaultName,
      "Gabriel",
      "Zephyr",
      "Luna",
      "Orion",
      "Nova",
      "Caspian",
      "Lyra",
    ];
    return names[Phaser.Math.Between(0, names.length - 1)] ?? defaultName;
  }

  showNameInput() {
    this.nameInput = this.add
      .dom(170, 250, "input", "width: 200px; height: 30px;")
      .setOrigin(0.5);

    playerClasses.forEach((cls, index) => {
      const button = this.add
        .text(170, 300 + index * 50, cls, { fontSize: "20px", color: "#fff" })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectClass(cls));
      this.classButtons.push(button);
    });

    this.add
      .text(170, 500, "Confirm", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.confirmCustomCharacter());
  }

  selectClass(cls: PlayerClass) {
    this.selectedClass = cls;
    this.classButtons.forEach((button) => {
      if (button && this.children.exists(button)) {
        button.setColor(button.text === cls ? "#ff0" : "#fff");
      }
    });
  }

  confirmCustomCharacter() {
    const name = (this.nameInput.node as HTMLInputElement).value.trim();
    if (!name || !this.selectedClass) {
      this.add
        .text(170, 550, "Please enter a name and select a class", {
          fontSize: "16px",
          color: "#ff0000",
        })
        .setOrigin(0.5);
      return;
    }
    this.startGame(name, this.selectedClass);
  }

  startGame(name?: string, playerClass?: PlayerClass) {
    const finalName = name ?? this.suggestedName;
    const finalClass = playerClass ?? this.suggestedClass;

    if (!finalName || !finalClass) {
      console.error("Name or class is undefined");
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
      name: finalName,
      class: finalClass,
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
