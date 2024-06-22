import Phaser from "phaser";
import { type PlayerCharacter, type Item, type EquipmentSlot } from "./types";

export class InventoryScene extends Phaser.Scene {
  private player!: PlayerCharacter;
  private inventoryTexts: Phaser.GameObjects.Text[] = [];
  private equipmentTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super("Inventory");
  }

  init(data: { player: PlayerCharacter }) {
    this.player = data.player;
  }

  create() {
    this.add
      .text(400, 50, "Inventory", { fontSize: "32px", color: "#fff" })
      .setOrigin(0.5);

    this.createInventoryDisplay();
    this.createEquipmentDisplay();

    this.add
      .text(400, 550, "Return to Battle", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () =>
        this.scene.start("Battle", { player: this.player }),
      );
  }

  createInventoryDisplay() {
    this.add.text(100, 100, "Inventory:", { fontSize: "24px", color: "#fff" });
    this.player.inventory.forEach((item, index) => {
      const text = this.add
        .text(120, 140 + index * 30, `${item.name} (${item.type})`, {
          fontSize: "18px",
          color: "#fff",
        })
        .setInteractive()
        .on("pointerdown", () => this.equipItem(item));
      this.inventoryTexts.push(text);
    });
  }

  createEquipmentDisplay() {
    this.add.text(500, 100, "Equipment:", { fontSize: "24px", color: "#fff" });
    const slots: EquipmentSlot[] = [
      "weapon",
      "gloves",
      "helm",
      "boots",
      "necklace",
    ];
    slots.forEach((slot, index) => {
      const item = this.player.equipment[slot];
      const text = this.add
        .text(520, 140 + index * 30, `${slot}: ${item ? item.name : "Empty"}`, {
          fontSize: "18px",
          color: "#fff",
        })
        .setInteractive()
        .on("pointerdown", () => this.unequipItem(slot));
      this.equipmentTexts.push(text);
    });
  }

  equipItem(item: Item) {
    if (item.type === "consumable") {
      // Handle consumable use
      return;
    }

    const currentEquipped = this.player.equipment[item.type];
    if (currentEquipped) {
      this.player.inventory.push(currentEquipped);
    }
    this.player.equipment[item.type] = item;
    this.player.inventory = this.player.inventory.filter((i) => i !== item);
    this.updateDisplays();
  }

  unequipItem(slot: EquipmentSlot) {
    const item = this.player.equipment[slot];
    if (item) {
      this.player.inventory.push(item);
      this.player.equipment[slot] = null;
      this.updateDisplays();
    }
  }

  updateDisplays() {
    this.inventoryTexts.forEach((text) => text.destroy());
    this.equipmentTexts.forEach((text) => text.destroy());
    this.inventoryTexts = [];
    this.equipmentTexts = [];
    this.createInventoryDisplay();
    this.createEquipmentDisplay();
  }
}
