import Phaser from "phaser";
import { type PlayerCharacter } from "./types";

interface MapData {
  seed: number;
  playerPosition: {
    x: number;
    y: number;
  };
}

export class EncounterScene extends Phaser.Scene {
  private player!: PlayerCharacter;
  private mapData!: MapData;
  private encounterText!: Phaser.GameObjects.Text;
  private continueButton!: Phaser.GameObjects.Text;

  constructor() {
    super("Encounter");
  }

  init(data: { player: PlayerCharacter; mapData: MapData }) {
    this.player = data.player;
    this.mapData = data.mapData;
  }

  create() {
    this.encounterText = this.add
      .text(this.cameras.main.centerX, 200, "", {
        fontSize: "18px",
        color: "#fff",
        align: "center",
        wordWrap: { width: 300 },
      })
      .setOrigin(0.5);

    this.continueButton = this.add
      .text(this.cameras.main.centerX, 450, "Continue", {
        fontSize: "20px",
        color: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleContinue())
      .on("pointerover", () => this.continueButton.setStyle({ fill: "#ff0" }))
      .on("pointerout", () => this.continueButton.setStyle({ fill: "#fff" }));

    this.randomEncounter();
  }

  randomEncounter() {
    const encounterType = Phaser.Math.Between(1, 10);
    switch (encounterType) {
      case 1:
        this.friendlyCharacter();
        break;
      case 2:
        this.swindler();
        break;
      case 3:
        this.healingRegion();
        break;
      case 4:
        this.poisonousSmog();
        break;
      case 5:
        this.dangerousTrap();
        break;
      default:
        this.scene.start("Store", {
          player: this.player,
          mapData: this.mapData,
        });
        return; // Exit the method to prevent showing the continue button
    }
    this.continueButton.setVisible(true);
  }

  friendlyCharacter() {
    const expGained = Phaser.Math.Between(10, 30);
    this.player.experience += expGained;
    this.encounterText.setText(
      `You encounter a wise sage who imparts knowledge to you. You gain ${expGained} experience!`,
    );
  }

  swindler() {
    const goldLost = Math.min(Phaser.Math.Between(5, 20), this.player.gold);
    this.player.gold -= goldLost;
    this.encounterText.setText(
      `A cunning swindler tricks you and steals ${goldLost} gold!`,
    );
  }

  healingRegion() {
    const healAmount = Math.floor(this.player.maxHealth * 0.3);
    this.player.health = Math.min(
      this.player.health + healAmount,
      this.player.maxHealth,
    );
    this.encounterText.setText(
      `You rest in a peaceful, healing region. You recover ${healAmount} health.`,
    );
  }

  poisonousSmog() {
    this.player.effects = this.player.effects ?? {};
    this.player.effects.poisonedSmog = 3; // lasts for 3 turns
    this.encounterText.setText(
      "You walk through a poisonous smog. You'll take light damage each turn in the next battle.",
    );
  }

  dangerousTrap() {
    const damage = Phaser.Math.Between(1, 20);
    this.player.health -= damage;
    this.encounterText.setText(
      `You stumble into a dangerous trap! You take ${damage} damage.`,
    );
    if (this.player.health <= 0) {
      this.player.health = 1;
      this.encounterText.setText(
        this.encounterText.text + " You barely survive with 1 HP remaining.",
      );
    }
  }

  handleContinue() {
    this.scene.start("LevelMap", {
      player: this.player,
      mapData: this.mapData,
    });
  }
}
