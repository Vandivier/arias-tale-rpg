import Phaser from "phaser";
import { type PlayerCharacter, type Item } from "./types";
import { generateStoreItems } from "./utils";

export class StoreScene extends Phaser.Scene {
  private player!: PlayerCharacter;
  private storeItems: Item[] = [];
  private itemTexts: Phaser.GameObjects.Text[] = [];
  private goldText!: Phaser.GameObjects.Text;

  constructor() {
    super("Store");
  }

  init(data: { player: PlayerCharacter }) {
    this.player = data.player;
    this.storeItems = generateStoreItems();
  }

  create() {
    this.add
      .text(400, 50, "Store", { fontSize: "32px", color: "#fff" })
      .setOrigin(0.5);

    this.goldText = this.add
      .text(400, 100, `Gold: ${this.player.gold}`, {
        fontSize: "24px",
        color: "#fff",
      })
      .setOrigin(0.5);

    this.createItemDisplay();

    this.add
      .text(400, 550, "Return to Battle", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () =>
        this.scene.start("Battle", { player: this.player }),
      );
  }

  createItemDisplay() {
    this.storeItems.forEach((item, index) => {
      const text = this.add
        .text(
          100,
          150 + index * 30,
          `${item.name} (${item.type}) - ${item.value} gold`,
          { fontSize: "18px", color: "#fff" },
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
