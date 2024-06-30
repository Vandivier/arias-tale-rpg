import Phaser from "phaser";
import {
  playerClasses,
  type Equipment,
  type PlayerCharacter,
  type PlayerClass,
} from "./types";
import { animateText } from "./utils/animateText";
import { createButton } from "./utils/main";

export class CharacterCreationScene extends Phaser.Scene {
  private currentStep: number = 0;
  private continueButton!: Phaser.GameObjects.Text;
  private rejectButton!: Phaser.GameObjects.Text;
  private nameButton!: Phaser.GameObjects.Text;
  private nameInput!: Phaser.GameObjects.DOMElement;
  private classButtons: Phaser.GameObjects.Text[] = [];
  private selectedClass: PlayerClass | null = null;
  private suggestedName: string = "";
  private suggestedClass: PlayerClass | null = null;
  private currentTextAnimation: ReturnType<typeof animateText> | null = null;

  constructor() {
    super("CharacterCreation");
  }

  create() {
    console.log("CharacterCreationScene create started");
    this.createButtons();
    this.nextStep();
  }

  createButtons() {
    const centerX = this.cameras.main.width / 2;

    this.continueButton = createButton(
      this,
      "Continue listening",
      centerX,
      this.cameras.main.height - 70,
      () => this.nextStep(),
    );

    this.rejectButton = createButton(
      this,
      "Hey, that's not me!",
      centerX,
      this.cameras.main.height - 120,
      () => this.rejectSuggestion(),
    );
  }

  nextStep() {
    console.log("nextStep called, currentStep:", this.currentStep);

    this.currentStep++;
    this.clearCurrentText();

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
        console.log("Reached default case in nextStep");
        this.startGame();
    }
  }

  showNarrativeText(text: string) {
    console.log("showNarrativeText called with:", text);

    this.clearCurrentText();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    try {
      this.currentTextAnimation = animateText(
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
          console.log("Text animation complete callback");
          this.continueButton.setVisible(true);
        },
      );
    } catch (error) {
      console.error("Error during text animation:", error);
    }
  }

  clearCurrentText() {
    console.log("Clearing current text");
    if (this.currentTextAnimation) {
      this.currentTextAnimation.destroy();
      this.currentTextAnimation = null;
    }
    this.continueButton?.setVisible(false);
    this.rejectButton?.setVisible(false);
  }

  suggestCharacter() {
    this.clearCurrentText();
    this.suggestedClass =
      playerClasses[Phaser.Math.Between(0, playerClasses.length - 1)] ??
      "warrior";
    this.suggestedName = this.getRandomName();

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.currentTextAnimation = animateText(
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
        if (this.continueButton) this.continueButton.setVisible(true);
        if (this.rejectButton) this.rejectButton.setVisible(true);
      },
    );
  }

  rejectSuggestion() {
    this.clearCurrentText();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2 - 100;

    this.currentTextAnimation = animateText(
      this,
      centerX,
      centerY,
      "Oh, what's your name then?",
      "typing",
      {
        fontSize: "16px",
        color: "#fff",
        wordWrap: { width: 300 },
        align: "center",
      },
      () => {
        this.showNameButton();
      },
    );
  }

  showNameButton() {
    console.log("showNameButton called");
    const centerX = this.cameras.main.width / 2;
    const buttonY = this.cameras.main.height / 2 + 50;

    // this block is needed, although I'm not sure why...
    if (this.nameButton) {
      this.nameButton.destroy();
    }

    this.nameButton = createButton(
      this,
      "My name is...",
      centerX,
      buttonY,
      () => {
        this.showNameInput();
        this.nameButton.destroy();
      },
    );

    this.nameButton.setVisible(true);
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
    console.log("showNameInput called");
    this.clearCurrentText();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2 - 50;

    this.nameInput = this.add
      .dom(centerX, centerY, "input", "width: 200px; height: 30px;")
      .setOrigin(0.5);

    this.classButtons = [];
    playerClasses.forEach((cls, index) => {
      const buttonY = centerY + 50 + index * 50;
      const button = this.createClassButton(cls, centerX, buttonY);
      this.classButtons.push(button);
    });

    const confirmButton = createButton(
      this,
      "Confirm",
      centerX,
      this.cameras.main.height - 70,
      () => this.confirmCustomCharacter(),
    );

    confirmButton.setVisible(true);
  }

  createClassButton(cls: PlayerClass, x: number, y: number) {
    const button = this.add
      .text(x, y, cls, {
        fontSize: "20px",
        color: "#fff",
        backgroundColor: "#333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (this.selectedClass !== cls) {
          button.setStyle({ backgroundColor: "#555" });
        }
      })
      .on("pointerout", () => {
        if (this.selectedClass !== cls) {
          button.setStyle({ backgroundColor: "#333" });
        }
      })
      .on("pointerdown", () => this.selectClass(cls));

    button.setVisible(true);
    return button;
  }

  selectClass(cls: PlayerClass) {
    this.selectedClass = cls;
    this.updateClassButtonStyles();
  }

  updateClassButtonStyles() {
    this.classButtons.forEach((button) => {
      if (button?.scene) {
        if (button.text === this.selectedClass) {
          button.setStyle({ color: "#ff0", backgroundColor: "#555" });
        } else {
          button.setStyle({ color: "#fff", backgroundColor: "#333" });
        }
      }
    });
  }

  confirmCustomCharacter() {
    const name = (this.nameInput.node as HTMLInputElement).value.trim();
    if (!name || !this.selectedClass) {
      this.showErrorMessage("Please enter a name and select a class");
      return;
    }
    this.startGame(name, this.selectedClass);
  }

  showErrorMessage(message: string) {
    const existingError = this.children.getByName("errorMessage");
    if (existingError) {
      existingError.destroy();
    }

    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height - 20,
        message,
        {
          fontSize: "16px",
          color: "#ff0000",
          wordWrap: { width: this.cameras.main.width * 0.8 },
          align: "center",
        },
      )
      .setOrigin(0.5)
      .setName("errorMessage");
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
