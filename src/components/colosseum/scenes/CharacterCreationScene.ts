import Phaser from "phaser";
import {
  playerClasses,
  type Equipment,
  type PlayerCharacter,
  type PlayerClass,
} from "./types";
import { animateText, createButton } from "./utils";

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
    // render view
    this.createButtons();

    // set up listeners
    this.events.once("sceneReady", this.onSceneReady, this);

    // emit ready
    this.events.emit("sceneReady");
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

  private onSceneReady() {
    console.log("CharacterCreationScene is ready");
    this.nextStep();
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
          console.log("Text animation complete");
          this.continueButton.setVisible(true);
        },
      );
    } catch (error) {
      console.error("Error during text animation:", error);
    }
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

  clearCurrentText() {
    if (this.currentTextAnimation) {
      this.currentTextAnimation.destroy();
      this.currentTextAnimation = null;
    }
    this?.continueButton.setVisible(false);
    this?.rejectButton.setVisible(false);
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

    this.nameButton = createButton(
      this,
      "My name is...",
      centerX,
      buttonY,
      () => {
        this.showNameInput();
        this.nameButton.setVisible(false);
        console.log("got here!");
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
    this.clearCurrentText();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2 - 50;

    this.nameInput = this.add
      .dom(centerX, centerY, "input", "width: 200px; height: 30px;")
      .setOrigin(0.5);

    this.classButtons = [];
    playerClasses.forEach((cls, index) => {
      const buttonY = centerY + 50 + index * 50;
      const button = createButton(this, cls, centerX, buttonY, () =>
        this.selectClass(cls),
      );
      button.setVisible(true);
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

  selectClass(cls: PlayerClass) {
    this.selectedClass = cls;
    this.classButtons.forEach((button) => {
      if (button?.scene) {
        button.setColor(button.text === cls ? "#ff0" : "#fff");
      }
    });
  }

  confirmCustomCharacter() {
    const name = (this.nameInput.node as HTMLInputElement).value.trim();
    if (!name || !this.selectedClass) {
      this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height - 20,
          "Please enter a name and select a class",
          {
            fontSize: "16px",
            color: "#ff0000",
            wordWrap: { width: this.cameras.main.width * 0.8 },
            align: "center",
          },
        )
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
