import Phaser from "phaser";
import {
  type PlayerCharacter,
  type Enemy,
  type EnemyTier,
  type EnemyRarity,
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
  private enemySprite!: Phaser.Physics.Arcade.Sprite;
  private actionButtons: Phaser.GameObjects.Text[] = [];
  private messageText!: Phaser.GameObjects.Text;
  private playerHealthText!: Phaser.GameObjects.Text;
  private enemyHealthText!: Phaser.GameObjects.Text;
  private victories: number = 0;

  constructor() {
    super("Battle");
  }

  init(data: { player: PlayerCharacter }) {
    this.player = data.player;
  }

  create() {
    this.createPlayerSprite();
    this.createEnemy();
    this.createUI();
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

  createUI() {
    this.playerHealthText = this.add.text(
      10,
      10,
      `Player HP: ${this.player.health}/${this.player.maxHealth}`,
      { fontSize: "16px", color: "#fff" },
    );
    this.enemyHealthText = this.add.text(
      590,
      10,
      `Enemy HP: ${this.enemy.health}/${this.enemy.maxHealth}`,
      { fontSize: "16px", color: "#fff" },
    );
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
        this.useItem();
        break;
    }
  }

  attack() {
    const damage = calculateDamage(this.player);
    this.enemy.health -= damage;
    this.showMessage(`You dealt ${damage} damage to the enemy!`);
    this.updateHealthTexts();

    if (this.enemy.health <= 0) {
      this.handleVictory();
    } else {
      this.enemyTurn();
    }
  }

  defend() {
    // Implement defend logic
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
  }

  useItem() {
    // Implement item usage logic
    this.showMessage("You used an item!");
    this.enemyTurn();
  }

  enemyTurn() {
    const damage = calculateEnemyDamage(this.enemy);
    this.player.health -= damage;
    this.showMessage(`The enemy dealt ${damage} damage to you!`);
    this.updateHealthTexts();

    if (this.player.health <= 0) {
      this.handleDefeat();
    }
  }

  handleVictory() {
    this.victories++;
    this.player.experience += 10;
    this.player.gold += 5;

    const loot = generateLoot(this.enemy);
    if (loot.length > 0) {
      this.player.inventory.push(...loot);
      this.showMessage(
        `You defeated the enemy and found: ${loot
          .map((item) => item.name)
          .join(", ")}!`,
      );
    } else {
      this.showMessage("You defeated the enemy!");
    }

    this.time.delayedCall(2000, () => {
      if (Math.random() < 0.05) {
        this.scene.start("Store", { player: this.player });
      } else {
        this.createEnemy();
        this.updateHealthTexts();
      }
    });
  }

  handleDefeat() {
    this.showMessage("You have been defeated!");
    this.time.delayedCall(2000, () => {
      this.scene.start("GameOver", {
        score: this.player.score,
        victories: this.victories,
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

  updateHealthTexts() {
    this.playerHealthText.setText(
      `Player HP: ${this.player.health}/${this.player.maxHealth}`,
    );
    this.enemyHealthText.setText(
      `Enemy HP: ${this.enemy.health}/${this.enemy.maxHealth}`,
    );
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
