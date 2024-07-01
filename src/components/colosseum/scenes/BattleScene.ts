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
  battlers,
  scaleSprite,
  calculateDamage,
  calculateEnemyDamage,
  generateLoot,
  createButton,
} from "./utils/main";

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
  private messageLog: string[] = [];
  private messageLogText!: Phaser.GameObjects.Text;

  constructor() {
    super("Battle");
  }

  init(data: { player: PlayerCharacter }) {
    this.player = data.player;
  }

  preload() {
    this.load.audio("defaultAttackSound", "assets/audio/slam.mp3");
  }

  create() {
    if (!this.player) {
      console.error("Player data not initialized");
      return;
    }

    this.loadPlayerSprite();
  }

  loadPlayerSprite() {
    const battler = battlers.find((b) => b.id === this.player.battlerId);
    if (!battler) {
      console.error("No battler found for the player");
      return;
    }

    this.load.image("playerImage", `assets/battlers/${battler.fileName}`);
    this.load.once("complete", () => {
      this.createPlayerSprite();
      this.createEnemy();
      this.createHUD();
      this.createActionButtons();
      this.createMessageLog();
    });
    this.load.start();
  }

  createHUD() {
    const hudY = 10;
    this.playerStatsText = this.add.text(
      10,
      hudY,
      this.getPlayerStatsString(),
      { fontSize: "10px", color: "#fff" },
    );
    this.enemyStatsText = this.add.text(180, hudY, this.getEnemyStatsString(), {
      fontSize: "10px",
      color: "#fff",
    });
  }

  createActionButtons() {
    const actions = ["Attack", "Defend", "Run", "Use Item"];
    const buttonWidth = 155;
    const buttonHeight = 40;
    const startX = this.cameras.main.width / 2 - buttonWidth + 60;
    const startY = 350;

    actions.forEach((action, index) => {
      const x = startX + (index % 2) * (buttonWidth + 20);
      const y = startY + Math.floor(index / 2) * (buttonHeight + 20);
      const button = createButton(this, action, x, y, () =>
        this.handleAction(action),
      );
      button.setVisible(true);
      this.actionButtons.push(button);
    });
  }

  createMessageLog() {
    this.messageLogText = this.add.text(10, 450, "", {
      fontSize: "12px",
      color: "#fff",
      wordWrap: { width: 320 },
      lineSpacing: 5,
    });
  }

  createPlayerSprite() {
    this.playerSprite = this.physics.add.sprite(85, 200, "playerImage");
    scaleSprite(this.playerSprite, AVATAR_MAX_HEIGHT * 0.6);
  }

  createEnemy() {
    const enemyConfig = this.generateEnemyConfig();
    const randomBattler = battlers[Phaser.Math.Between(0, battlers.length - 1)];
    if (!randomBattler) {
      console.error("No random battler found");
      return;
    }
    this.load.image("enemyImage", `assets/battlers/${randomBattler.fileName}`);
    this.load.once("complete", () => {
      this.enemy = {
        ...enemyConfig,
        sprite: this.physics.add.sprite(255, 200, "enemyImage"),
      };
      scaleSprite(this.enemy.sprite, AVATAR_MAX_HEIGHT * 0.6);
      this.updateHUD();
    });
    this.load.start();
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

  showMessage(message: string) {
    this.messageLog.push(message);
    if (this.messageLog.length > 4) {
      // Keep only the 4 most recent messages
      this.messageLog.shift();
    }
    this.updateMessageLog();
  }

  updateMessageLog() {
    this.messageLogText.setText(this.messageLog.join("\n"));
  }

  attack() {
    const damage = calculateDamage(this.player);
    this.enemy.health -= damage;

    this.sound.play("defaultAttackSound");
    this.animateAttack(this.enemy.sprite);

    this.showDamageText(this.enemy.sprite, damage);
    this.showMessage(`You dealt ${damage} damage to the enemy!`);

    if (this.enemy.health <= 0) {
      this.handleVictory();
    } else {
      this.time.delayedCall(1000, () => this.enemyTurn());
    }
    this.updateHUD();
  }

  enemyTurn() {
    const damage = calculateEnemyDamage(this.enemy);
    this.player.health -= damage;

    let message = `The enemy dealt ${damage} damage to you!`;

    // Apply poison damage if effect is active
    if (
      this.player?.effects?.poisonedSmog &&
      this.player?.effects?.poisonedSmog > 0
    ) {
      const poisonDamage = 1;
      this.player.health -= poisonDamage;
      this.player.effects.poisonedSmog--;
      message += ` You also took ${poisonDamage} poison damage!`;
      message += ` Poison Smog will last for ${this.player.effects.poisonedSmog} more turns.`;
    }

    this.showMessage(message);
    this.showDamageText(this.playerSprite, damage);

    this.sound.play("defaultAttackSound");
    this.animateAttack(this.playerSprite);

    if (this.player.health <= 0) {
      this.handleDefeat();
    }
    this.updateHUD();
  }

  animateAttack(sprite: Phaser.Physics.Arcade.Sprite) {
    this.tweens.add({
      targets: sprite,
      x: sprite.x - 10,
      yoyo: true,
      duration: 100,
      repeat: 3,
      onComplete: () => {
        this.flashSprite(sprite);
      },
    });
  }

  flashSprite(sprite: Phaser.Physics.Arcade.Sprite) {
    sprite.setTint(0xffffff);
    this.time.delayedCall(100, () => {
      sprite.clearTint();
    });
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
        .text(170, 200 + index * 30, `${index + 1}. ${item.name}`, {
          fontSize: "14px",
          color: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.useItem(item, index));
      this.itemSelectionTexts.push(itemText);
    });

    // Add cancel option
    const cancelText = this.add
      .text(170, 200 + this.player.inventory.length * 30, "Cancel", {
        fontSize: "14px",
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
      if (item.effect?.health) {
        this.player.health = Math.min(
          this.player.health + item.effect.health,
          this.player.maxHealth,
        );
        effectDescription = `restored ${item.effect.health} health`;
      }
      if (item.effect?.damage) {
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

  handleDefeat() {
    this.showMessage("You have been defeated!");
    this.time.delayedCall(2000, () => {
      this.scene.start("GameOver", {
        player: this.player,
        victories: this.victories,
      });
    });
  }

  showDamageText(target: Phaser.GameObjects.Sprite, damage: number) {
    const damageText = this.add
      .text(target.x, target.y - 20, `-${damage}`, {
        fontSize: "18px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: damageText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => damageText.destroy(),
    });
  }

  getPlayerStatsString(): string {
    return [
      `Name: ${this.player.name}`,
      `Class: ${this.player.class}`,
      `HP: ${this.player.health}/${this.player.maxHealth}`,
      `Level: ${this.player.level}`,
      `XP: ${this.player.experience}`,
      `Score: ${this.player.score}`,
      `Gold: ${this.player.gold}`,
      `Victories: ${this.victories}`,
      `Items: ${this.player.inventory.length}`,
    ].join("\n");
  }

  getEnemyStatsString(): string {
    if (!this.enemy) {
      return "No enemy";
    }
    return [
      `Enemy HP: ${this.enemy.health}/${this.enemy.maxHealth}`,
      `Rarity: ${this.enemy.rarity}`,
      `Tier: ${this.enemy.tier}`,
    ].join("\n");
  }

  updateHUD() {
    this.playerStatsText.setText(this.getPlayerStatsString());
    if (this.enemy) {
      this.enemyStatsText.setText(this.getEnemyStatsString());
    } else {
      this.enemyStatsText.setText("No enemy");
    }
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
