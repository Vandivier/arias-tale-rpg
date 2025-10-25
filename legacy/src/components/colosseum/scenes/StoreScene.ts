import Phaser from "phaser";
import { type Item, type MapData, type PlayerCharacter } from "./types";
import { generateStoreItems } from "./utils/main";

export class StoreScene extends Phaser.Scene {
  private player!: PlayerCharacter;
  private storeItems: Item[] = [];
  private itemTexts: Phaser.GameObjects.Text[] = [];
  private goldText!: Phaser.GameObjects.Text;
  private mapData!: MapData;

  constructor() {
    super("Store");
  }

  init(data: { player: PlayerCharacter; mapData: MapData }) {
    this.mapData = data.mapData;
    this.player = data.player;
    this.storeItems = generateStoreItems();
  }

  create() {
    this.add
      .text(170, 30, "Store", { fontSize: "28px", color: "#fff" })
      .setOrigin(0.5);

    this.goldText = this.add
      .text(170, 70, `Gold: ${this.player.gold}`, {
        fontSize: "18px",
        color: "#fff",
      })
      .setOrigin(0.5);

    this.createItemDisplay();

    this.add
      .text(170, 490, "Leave Store", { fontSize: "20px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () =>
        this.scene.start("LevelMap", {
          player: this.player,
          returnPosition: this.mapData.playerPosition,
          seed: this.mapData.seed,
        }),
      );
  }

  createItemDisplay() {
    this.storeItems.forEach((item, index) => {
      const text = this.add
        .text(
          20,
          110 + index * 40,
          `${item.name} (${item.type}) - ${item.value} gold`,
          { fontSize: "14px", color: "#fff", wordWrap: { width: 300 } },
        )
        .setInteractive()
        .on("pointerdown", () => this.buyItem(item));
      this.itemTexts.push(text);
    });
  }

  buyItem(item: Item) {
    if (this.player.gold >= item.value) {
      this.player.gold -= item.value;
      this.player.inventory.push(item);
      this.goldText.setText(`Gold: ${this.player.gold}`);
      this.storeItems = this.storeItems.filter((i) => i !== item);
      this.updateItemDisplay();
    } else {
      this.add
        .text(400, 500, "Not enough gold!", {
          fontSize: "24px",
          color: "#ff0000",
        })
        .setOrigin(0.5);
    }
  }

  updateItemDisplay() {
    this.itemTexts.forEach((text) => text.destroy());
    this.itemTexts = [];
    this.createItemDisplay();
  }
}
