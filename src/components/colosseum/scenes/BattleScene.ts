import Phaser from "phaser";
import {
  type PlayerCharacter,
  type Enemy,
  type EnemyRarity,
  type EnemyTier,
  type Item,
} from "./types";
import {
  AVATAR_MAX_HEIGHT,
  scaleSprite,
  calculateDamage,
  calculateEnemyDamage,
  generateLoot,
} from "./utils";

export class BattleScene extends Phaser.Scene {
  private player!: PlayerCharacter;
  private enemy!: Enemy;
  private playerSprite!: Phaser.Physics.Arcade.Sprite;
  private actionButtons: Phaser.GameObjects.Text[] = [];
  private messageText!: Phaser.GameObjects.Text;
  private playerStatsText!: Phaser.GameObjects.Text;
  private enemyStatsText!: Phaser.GameObjects.Text;
  private victories: number = 0;
  private itemSelectionTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super("Battle");
  }

  init(data: { player: PlayerCharacter }) {
    this.player = data.player;
  }

  preload() {
    this.load.image("warrior", "searchable-images/16-eidolon.png");
    this.load.image("mage", "searchable-images/16-eidolon.png");
    this.load.image("archer", "searchable-images/16-eidolon.png");
    this.load.image("enemy", "searchable-images/16-eidolon.png");
  }

  create() {
    if (!this.player) {
      console.error("Player data not initialized");
      return;
    }

    this.createPlayerSprite();
    this.createEnemy();
    this.createHUD();
    this.createActionButtons();
  }

  createPlayerSprite() {
    this.playerSprite = this.physics.add.sprite(200, 300, this.player.class);
    scaleSprite(this.playerSprite, AVATAR_MAX_HEIGHT);
  }

  createEnemy() {
    const enemyConfig = this.generateEnemyConfig();
    this.enemy = {
      ...enemyConfig,
      sprite: this.physics.add.sprite(600, 300, "enemy"),
    };
    scaleSprite(this.enemy.sprite, AVATAR_MAX_HEIGHT);
  }

  createHUD() {
    const hudY = 50;
    this.playerStatsText = this.add.text(
      10,
      hudY,
      this.getPlayerStatsString(),
      { fontSize: "16px", color: "#fff" },
    );
    this.enemyStatsText = this.add.text(590, hudY, this.getEnemyStatsString(), {
      fontSize: "16px",
      color: "#fff",
    });
    this.messageText = this.add
      .text(400, 550, "", { fontSize: "18px", color: "#fff" })
      .setOrigin(0.5);
  }

  createActionButtons() {
    const actions = ["Attack", "Defend", "Run", "Use Item"];
    actions.forEach((action, index) => {
      const button = this.add
        .text(200 + index * 150, 500, action, {
          fontSize: "20px",
          color: "#fff",
        })
        .setInteractive()
        .on("pointerdown", () => this.handleAction(action));
      this.actionButtons.push(button);
    });
  }

  handleAction(action: string) {
    switch (action) {
      case "Attack":
        this.attack();
        break;
      case "Defend":
        this.defend();
        break;
      case "Run":
        this.run();
        break;
      case "Use Item":
        this.showItemSelection();
        break;
    }
  }

  attack() {
    const damage = calculateDamage(this.player);
    this.enemy.health -= damage;
    this.showDamageText(this.enemy.sprite, damage);
    this.showMessage(`You dealt ${damage} damage to the enemy!`);

    if (this.enemy.health <= 0) {
      this.handleVictory();
    } else {
      this.enemyTurn();
    }
    this.updateHUD();
  }

  defend() {
    this.showMessage("You're defending against the next attack!");
    this.enemyTurn();
  }

  run() {
    if (Math.random() < 0.5) {
      this.showMessage("You successfully fled!");
      this.createEnemy();
    } else {
      this.showMessage("You failed to run away!");
      this.enemyTurn();
    }
    this.updateHUD();
  }

  showItemSelection() {
    if (this.player.inventory.length === 0) {
      this.showMessage("You don't have any items!");
      return;
    }

    // Hide action buttons
    this.actionButtons.forEach((button) => button.setVisible(false));

    // Show item selection
    this.player.inventory.forEach((item, index) => {
      const itemText = this.add
        .text(400, 200 + index * 40, `${index + 1}. ${item.name}`, {
          fontSize: "18px",
          color: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.useItem(item, index));
      this.itemSelectionTexts.push(itemText);
    });

    // Add cancel option
    const cancelText = this.add
      .text(400, 200 + this.player.inventory.length * 40, "Cancel", {
        fontSize: "18px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.hideItemSelection());
    this.itemSelectionTexts.push(cancelText);
  }

  hideItemSelection() {
    // Remove item selection texts
    this.itemSelectionTexts.forEach((text) => text.destroy());
    this.itemSelectionTexts = [];

    // Show action buttons
    this.actionButtons.forEach((button) => button.setVisible(true));
  }

  useItem(item: Item, index: number) {
    this.hideItemSelection();

    let effectDescription = "";

    if (item.type === "consumable") {
      if (item.effect.health) {
        this.player.health = Math.min(
          this.player.health + item.effect.health,
          this.player.maxHealth,
        );
        effectDescription = `restored ${item.effect.health} health`;
      }
      if (item.effect.damage) {
        this.enemy.health -= item.effect.damage;
        effectDescription += `${effectDescription ? " and " : ""}dealt ${
          item.effect.damage
        } damage to the enemy`;
      }
      // Remove the used item from inventory
      this.player.inventory.splice(index, 1);
    } else {
      this.showMessage(`You can't use ${item.name} in battle!`);
      return;
    }

    this.showMessage(`You used ${item.name} and ${effectDescription}!`);
    this.updateHUD();

    if (this.enemy.health <= 0) {
      this.handleVictory();
    } else {
      this.enemyTurn();
    }
  }

  enemyTurn() {
    const damage = calculateEnemyDamage(this.enemy);
    this.player.health -= damage;
    this.showDamageText(this.playerSprite, damage);
    this.showMessage(`The enemy dealt ${damage} damage to you!`);

    if (this.player.health <= 0) {
      this.handleDefeat();
    }
    this.updateHUD();
  }

  handleDefeat() {
    this.showMessage("You have been defeated!");
    this.time.delayedCall(2000, () => {
      this.scene.start("GameOver", {
        name: this.player.name,
        score: this.player.score,
        victories: this.victories,
        level: this.player.level,
      });
    });
  }

  showMessage(message: string) {
    this.messageText.setText(message);
    this.messageText.setVisible(true);
    this.time.delayedCall(3000, () => {
      this.messageText.setVisible(false);
    });
  }

  showDamageText(target: Phaser.GameObjects.Sprite, damage: number) {
    const damageText = this.add
      .text(target.x, target.y - 20, `-${damage}`, {
        fontSize: "24px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: damageText.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => damageText.destroy(),
    });
  }

  getPlayerStatsString(): string {
    return [
      `HP: ${this.player.health}/${this.player.maxHealth}`,
      `Class: ${this.player.class}`,
      `Level: ${this.player.level}`,
      `XP: ${this.player.experience}`,
      `Score: ${this.player.score}`,
      `Gold: ${this.player.gold}`,
      `Victories: ${this.victories}`,
      `Items: ${this.player.inventory.length}`,
    ].join("\n");
  }

  getEnemyStatsString(): string {
    return [
      `Enemy HP: ${this.enemy.health}/${this.enemy.maxHealth}`,
      `Rarity: ${this.enemy.rarity}`,
      `Tier: ${this.enemy.tier}`,
    ].join("\n");
  }

  updateHUD() {
    this.playerStatsText.setText(this.getPlayerStatsString());
    this.enemyStatsText.setText(this.getEnemyStatsString());
  }

  handleVictory() {
    this.victories++;

    const rarityMultiplier = this.getRarityMultiplier(this.enemy.rarity);

    const expGained = Math.floor(Phaser.Math.Between(8, 12) * rarityMultiplier);
    const goldGained = Math.floor(Phaser.Math.Between(4, 6) * rarityMultiplier);
    const scoreGained = Math.floor(100 * rarityMultiplier);

    this.player.experience += expGained;
    this.player.gold += goldGained;
    this.player.score += scoreGained;

    const loot = generateLoot(this.enemy);
    if (loot.length > 0) {
      this.player.inventory.push(...loot);
      this.showMessage(
        `Victory! Gained ${expGained} XP, ${goldGained} gold, ${scoreGained} score, and found: ${loot
          .map((item) => item.name)
          .join(", ")}!`,
      );
    } else {
      this.showMessage(
        `Victory! Gained ${expGained} XP, ${goldGained} gold, and ${scoreGained} score!`,
      );
    }

    this.updateHUD();

    this.time.delayedCall(2000, () => {
      if (Math.random() < 0.05) {
        this.scene.start("Store", { player: this.player });
      } else {
        this.createEnemy();
        this.updateHUD();
      }
    });
  }

  getRarityMultiplier(rarity: EnemyRarity): number {
    switch (rarity) {
      case "Common":
        return 1;
      case "Uncommon":
        return 1.5;
      case "Rare":
        return 2;
      default:
        return 1;
    }
  }

  generateEnemyConfig(): Omit<Enemy, "sprite"> {
    const rarityRoll = Math.random();
    let rarity: EnemyRarity, tier: EnemyTier;

    if (rarityRoll < 0.6) {
      rarity = "Common";
      tier = ["F", "E", "D", "C", "B"][
        Math.floor(Math.random() * 5)
      ] as EnemyTier;
    } else if (rarityRoll < 0.9) {
      rarity = "Uncommon";
      tier = ["A", "AA", "AAA"][Math.floor(Math.random() * 3)] as EnemyTier;
    } else {
      rarity = "Rare";
      tier = ["R", "RR", "RRR", "S", "SS", "SSS"][
        Math.floor(Math.random() * 6)
      ] as EnemyTier;
    }

    const baseHealth = 50 + this.player.level * 10;
    const healthMultiplier =
      rarity === "Common" ? 1 : rarity === "Uncommon" ? 1.5 : 2;
    const maxHealth = Math.floor(baseHealth * healthMultiplier);

    return {
      health: maxHealth,
      maxHealth,
      rarity,
      tier,
    };
  }
}
