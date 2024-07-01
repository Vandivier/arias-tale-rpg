import Phaser from "phaser";
import {
  playerClasses,
  type Equipment,
  type PlayerCharacter,
  type PlayerClass,
} from "./types";
import { battlers, createButton } from "./utils/main";
import { TextAnimationManager } from "./services/TextAnimationManager";

export class CharacterCreationScene extends Phaser.Scene {
  private battlerImage!: Phaser.GameObjects.Image;
  private classButtons: Phaser.GameObjects.Text[] = [];
  private continueButton!: Phaser.GameObjects.Text;
  private currentBattlerIndex: number = 0;
  private currentStep: number = 0;
  private nameButton!: Phaser.GameObjects.Text;
  private nameInput!: Phaser.GameObjects.DOMElement;
  private rejectButton!: Phaser.GameObjects.Text;
  private rejectImageButton!: Phaser.GameObjects.Text; // New button for rejecting image
  private selectedBattlerId: number = 0; // Store the selected battler ID
  private selectedClass: PlayerClass | null = null;
  private skipButton!: Phaser.GameObjects.Text;
  private suggestedName: string = "";
  private textAnimationManager!: TextAnimationManager;

  constructor() {
    super("CharacterCreation");
  }

  create() {
    console.log("CharacterCreationScene create started");
    this.textAnimationManager = new TextAnimationManager(this);
    this.createButtons();
    this.nextStep();
  }

  private createButtons() {
    const centerX = this.cameras.main.width / 2;

    this.continueButton = createButton(
      this,
      "Continue listening",
      centerX,
      this.cameras.main.height - 70,
      () => {
        console.log("Continue button clicked");
        if (this.textAnimationManager.isComplete()) {
          this.nextStep();
        } else {
          this.textAnimationManager.completeCurrentAnimation();
        }
      },
    );

    this.rejectButton = createButton(
      this,
      "Hey, that's not me!",
      centerX,
      this.cameras.main.height - 120,
      () => {
        console.log("Reject button clicked");
        this.rejectSuggestion();
      },
    );

    this.rejectImageButton = createButton(
      this,
      "That's not me",
      centerX,
      this.cameras.main.height - 170,
      () => {
        console.log("Reject image button clicked");
        this.nextBattlerImage();
      },
    );

    this.skipButton = createButton(
      this,
      "Skip Text",
      this.cameras.main.width - 70,
      30,
      () => {
        console.log("Skip button clicked");
        this.textAnimationManager.skipCurrentAnimation();
      },
    );

    this.rejectButton.setVisible(false);
    this.rejectImageButton.setVisible(false); // Hide by default
    this.skipButton.setVisible(false);
  }

  nextStep() {
    console.log("nextStep called, currentStep:", this.currentStep);
    this.currentStep++;
    this.continueButton.setVisible(true);
    this.rejectButton.setVisible(false);
    this.rejectImageButton.setVisible(false); // Hide image rejection button initially
    this.skipButton.setVisible(true);

    switch (this.currentStep) {
      case 1:
        this.textAnimationManager.showNarrativeText(
          "Anyone who speaks to The Great Dreamer in their mind has exited their plane, because The Great Dreamer lives outside of the planes.",
          () => {
            console.log("Animation complete, showing continue button");
            this.continueButton.setVisible(true);
            this.skipButton.setVisible(false);
          },
        );
        break;
      case 2:
        this.textAnimationManager.showNarrativeText(
          'The Dreamer wonders "What is it like outside of the planes, where I am? Are there plants and towns and people here too?"',
          () => {
            console.log("Animation complete, showing continue button");
            this.continueButton.setVisible(true);
            this.skipButton.setVisible(false);
          },
        );
        break;
      case 3:
        this.textAnimationManager.showNarrativeText(
          "The Dreamer thinks of many such things that could be outside of the planes, and so they begin to appear...",
          () => {
            console.log("Animation complete, showing continue button");
            this.continueButton.setVisible(true);
            this.skipButton.setVisible(false);
          },
        );
        break;
      case 4:
        this.suggestCharacter();
        break;
      case 5:
        this.showBattlerImageConfirmation();
        break;
      default:
        console.log("Reached default case in nextStep");
        this.startGame();
    }
  }

  rejectSuggestion() {
    this.continueButton.setVisible(false);
    this.rejectButton.setVisible(false);

    this.textAnimationManager.showNarrativeText(
      "Oh, what's your name then?",
      () => {
        this.showNameButton();
      },
    );
  }

  suggestCharacter() {
    this.selectedClass =
      playerClasses[Phaser.Math.Between(0, playerClasses.length - 1)] ??
      "warrior";
    this.suggestedName = this.getRandomName();

    this.textAnimationManager.showNarrativeText(
      `He thinks of you, ${this.selectedClass === "archer" ? "an" : "a"} ${
        this.selectedClass
      } called ${this.suggestedName}...`,
      () => {
        this.continueButton.setVisible(true);
        this.rejectButton.setVisible(true);
      },
    );
  }

  showNameButton() {
    console.log("showNameButton called");
    const centerX = this.cameras.main.width / 2;
    const buttonY = this.cameras.main.height / 2 + 50;

    if (this.nameButton) {
      this.nameButton.destroy();
    }

    this.nameButton = createButton(
      this,
      "My name is...",
      centerX,
      buttonY,
      () => {
        console.log("Name button clicked");
        this.nameButton.destroy();
        this.showNameInput();
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
    this.textAnimationManager.clearCurrentText();
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
      () => {
        this.confirmCustomCharacter();
        confirmButton.destroy();
      },
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
      this.textAnimationManager.showErrorText(
        "Please enter a name and select a class",
      );
      return;
    }
    this.nameInput.destroy();
    this.classButtons.forEach((button) => button.destroy());
    this.currentBattlerIndex = 0;
    this.showBattlerImageConfirmation();
  }

  showBattlerImageConfirmation() {
    const battlersForClass = battlers.filter(
      (battler) => battler.class === this.selectedClass,
    );

    if (battlersForClass.length === 0) {
      console.error("No battlers found for the selected class");
      return;
    }

    const battler = battlersForClass[this.currentBattlerIndex];
    if (!battler) {
      console.error("Battler not found");
      return;
    }
    const battlerImageKey = `battler-${battler.id}`;

    if (this.battlerImage) {
      this.battlerImage.destroy();
    }

    this.load.image(battlerImageKey, `assets/battlers/${battler.fileName}`);
    this.load.once("complete", () => {
      this.battlerImage = this.add
        .image(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 - 50,
          battlerImageKey,
        )
        .setScale(0.25);

      this.continueButton.setText("Right, that's me!");
      this.rejectImageButton.setVisible(true);
      this.continueButton.setVisible(true);
      this.selectedBattlerId = battler.id;
    });
    this.load.start();
  }

  nextBattlerImage() {
    const battlersForClass = battlers.filter(
      (battler) => battler.class === this.selectedClass,
    );

    this.currentBattlerIndex =
      (this.currentBattlerIndex + 1) % battlersForClass.length;
    this.showBattlerImageConfirmation();
  }

  startGame(name?: string, playerClass?: PlayerClass) {
    const finalName = name ?? this.suggestedName;
    const finalClass = playerClass ?? this.selectedClass;

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
      battlerId: this.selectedBattlerId,
    };

    this.scene.start("Battle", { player });
  }
}
