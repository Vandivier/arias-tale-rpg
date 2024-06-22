const AVATAR_MAX_HEIGHT = 200;
type PlayerClass = "warrior" | "mage" | "archer";
type EnemyRarity = "Common" | "Uncommon" | "Rare";
type EnemyTier =
  | "F"
  | "E"
  | "D"
  | "C"
  | "B"
  | "A"
  | "AA"
  | "AAA"
  | "R"
  | "RR"
  | "RRR"
  | "S"
  | "SS"
  | "SSS";

interface PlayerCharacter {
  name: string;
  class: PlayerClass;
  health: number;
  maxHealth: number;
  level: number;
  experience: number;
  gold: number;
  items: string[];
  score: number;
}

interface Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  maxHealth: number;
  rarity: EnemyRarity;
  tier: EnemyTier;
}

interface LeaderboardEntry {
  name: string;
  level: number;
  score: number;
  victories: number;
}

export default class ColosseumScene extends Phaser.Scene {
  player!: PlayerCharacter;
  playerSprite!: Phaser.Physics.Arcade.Sprite;
  enemy!: Enemy;
  victories!: number;
  healthText!: Phaser.GameObjects.Text;
  levelText!: Phaser.GameObjects.Text;
  victoriesText!: Phaser.GameObjects.Text;
  goldText!: Phaser.GameObjects.Text;
  itemsText!: Phaser.GameObjects.Text;
  scoreText!: Phaser.GameObjects.Text;
  messageText!: Phaser.GameObjects.Text;
  messageTimer: Phaser.Time.TimerEvent | null = null;
  enemyInfoText!: Phaser.GameObjects.Text;
  actionButtons: Phaser.GameObjects.Text[] = [];
  isDefending: boolean = false;
  leaderboard: LeaderboardEntry[] = [];
  nameInput: Phaser.GameObjects.DOMElement | null = null;
  playerClassText!: Phaser.GameObjects.Text;
  classButtons: Phaser.GameObjects.Text[] = [];

  constructor() {
    super("ColosseumScene");
  }

  preload() {
    this.load.image("warrior", "/searchable-images/16-eidolon.png");
    this.load.image("mage", "/searchable-images/16-eidolon.png");
    this.load.image("archer", "/searchable-images/16-eidolon.png");
    this.load.image("enemy", "/searchable-images/16-eidolon.png");
  }

  create() {
    this.createCharacterCreationUI();
  }

  createCharacterCreationUI() {
    const namePrompt = this.add
      .text(400, 200, "Enter your name:", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5);
    this.nameInput = this.add.dom(
      400,
      250,
      "input",
      "width: 200px; height: 30px;",
    );
    const classPrompt = this.add
      .text(400, 300, "Choose your class:", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5);

    const classes: PlayerClass[] = ["warrior", "mage", "archer"];
    this.classButtons = classes.map((c, i) => {
      return this.add
        .text(300 + i * 100, 350, c, { fontSize: "20px", color: "#fff" })
        .setInteractive()
        .on("pointerdown", () => this.confirmCharacter(c));
    });

    if (this.nameInput.node) {
      this.nameInput.addListener("keydown");
      this.nameInput.on("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          this.confirmCharacter("warrior");
        }
      });
    }
  }

  createPlayer(name: string, playerClass: PlayerClass): PlayerCharacter {
    return {
      name,
      class: playerClass,
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      gold: 0,
      items: [],
      score: 0,
    };
  }

  startGame() {
    // Ensure the character creation UI is fully cleaned up
    this.cleanupCharacterCreationUI();

    this.playerSprite = this.physics.add.sprite(100, 300, this.player.class);
    this.enemy = this.createEnemy();

    const targetHeight = 200;
    this.scaleSprite(this.playerSprite, targetHeight);
    this.scaleSprite(this.enemy.sprite, targetHeight);

    this.victories = 0;

    this.healthText = this.add.text(
      10,
      10,
      `Health: ${this.player.health}/${this.player.maxHealth}`,
      { fontSize: "16px", color: "#fff" },
    );
    this.levelText = this.add.text(
      10,
      30,
      `Level: ${this.player.level} (XP: ${this.player.experience})`,
      { fontSize: "16px", color: "#fff" },
    );
    this.victoriesText = this.add.text(10, 50, `Victories: ${this.victories}`, {
      fontSize: "16px",
      color: "#fff",
    });
    this.goldText = this.add.text(10, 70, `Gold: ${this.player.gold}`, {
      fontSize: "16px",
      color: "#fff",
    });
    this.itemsText = this.add.text(
      10,
      90,
      `Items: ${this.player.items.join(", ") ?? ""}`,
      { fontSize: "16px", color: "#fff" },
    );
    this.scoreText = this.add.text(10, 110, `Score: ${this.player.score}`, {
      fontSize: "16px",
      color: "#fff",
    });
    this.playerClassText = this.add.text(
      10,
      130,
      `Class: ${this.capitalizeFirstLetter(this.player.class)}`,
      { fontSize: "16px", color: "#fff" },
    );

    this.messageText = this.add
      .text(400, 550, "", { fontSize: "18px", color: "#fff" })
      .setOrigin(0.5);
    this.enemyInfoText = this.add.text(600, 10, this.getEnemyInfoText(), {
      fontSize: "16px",
      color: "#fff",
    });

    this.createActionButtons();
  }

  createActionButtons() {
    const actions = ["Attack", "Defend", "Run", "Use Item"];
    actions.forEach((action, index) => {
      const button = this.add
        .text(200 + index * 150, 500, action, {
          fontSize: "20px",
          color: "#fff",
          backgroundColor: "#333",
          padding: { x: 10, y: 5 },
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.handleAction(action))
        .on("pointerover", () => button.setStyle({ backgroundColor: "#555" }))
        .on("pointerout", () => button.setStyle({ backgroundColor: "#333" }));
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

  scaleSprite(sprite: Phaser.Physics.Arcade.Sprite, targetHeight: number) {
    const scale = targetHeight / sprite.height;
    sprite.setScale(scale);
  }

  createEnemy(): Enemy {
    const rarityRoll = Phaser.Math.Between(1, 20);
    let rarity: EnemyRarity, tier: EnemyTier;

    if (rarityRoll <= 12) {
      rarity = "Common";
      tier = ["F", "E", "D", "C", "B"][Phaser.Math.Between(0, 4)] as EnemyTier;
    } else if (rarityRoll <= 18) {
      rarity = "Uncommon";
      tier = ["A", "AA", "AAA"][Phaser.Math.Between(0, 2)] as EnemyTier;
    } else {
      rarity = "Rare";
      tier = ["R", "RR", "RRR", "S", "SS", "SSS"][
        Phaser.Math.Between(0, 5)
      ] as EnemyTier;
    }

    const baseHealth = 50 + this.player.level * 10;
    const healthMultiplier =
      rarity === "Common" ? 1 : rarity === "Uncommon" ? 1.5 : 2;
    const maxHealth = Math.floor(baseHealth * healthMultiplier);
    const sprite = this.physics.add.sprite(700, 300, "enemy");
    this.scaleSprite(sprite, AVATAR_MAX_HEIGHT);

    return {
      sprite,
      health: maxHealth,
      maxHealth: maxHealth,
      rarity,
      tier,
    };
  }

  attack() {
    const damage = Math.round(this.calculateDamage());
    this.enemy.health -= damage;

    let message = `You attack the enemy for ${damage} damage!`;

    if (this.enemy.health <= 0) {
      message += " The enemy is defeated!";
      this.handleVictory();
    } else {
      const enemyDamage = Math.round(this.calculateEnemyDamage());
      this.player.health = Math.max(0, this.player.health - enemyDamage);
      message += ` The enemy counterattacks for ${enemyDamage} damage!`;

      if (this.player.health <= 0) {
        this.handleDefeat();
      }
    }

    this.showMessage(message);
    this.updateTexts();
  }

  defend() {
    this.isDefending = true;
    this.showMessage("You're defending against the next attack!");
    this.enemyAttack();
  }

  run() {
    if (Math.random() < 0.5) {
      this.enemy = this.createEnemy();
      this.enemy.sprite.setPosition(700, 300);
      this.showMessage("You successfully fled! A new enemy appears.");
    } else {
      this.showMessage("You failed to run away!");
      this.enemyAttack();
    }
    this.updateTexts();
  }

  useItem() {
    if (this.player.items.length === 0) {
      this.showMessage("You don't have any items!");
      return;
    }

    const item = this.player.items.pop()!;
    switch (item) {
      case "Health Potion":
        this.player.health = Math.min(
          this.player.health + 50,
          this.player.maxHealth,
        );
        this.showMessage("You used a Health Potion and recovered 50 HP!");
        break;
      case "Strength Elixir":
        this.player.score += 100;
        this.showMessage("You used a Strength Elixir and gained 100 points!");
        break;
      case "Magic Scroll":
        this.enemy.health -= 30;
        this.showMessage(
          "You used a Magic Scroll and dealt 30 damage to the enemy!",
        );
        if (this.enemy.health <= 0) {
          this.handleVictory();
        }
        break;
      case "Lucky Charm":
        this.player.gold += 50;
        this.showMessage("You used a Lucky Charm and gained 50 gold!");
        break;
    }
    this.updateTexts();
  }

  enemyAttack() {
    const enemyDamage = this.calculateEnemyDamage();
    const finalDamage = this.isDefending
      ? Math.floor(enemyDamage / 2)
      : enemyDamage;
    this.player.health -= finalDamage;
    this.isDefending = false;

    if (this.player.health <= 0) {
      this.handleDefeat();
    }
  }

  calculateDamage(): number {
    const baseDamage = Phaser.Math.Between(5, 15);
    switch (this.player.class) {
      case "warrior":
        return Math.round(baseDamage * 1.2);
      case "mage":
        return Math.round(baseDamage * 1.5);
      case "archer":
        return Math.round(baseDamage * 1.3);
      default:
        return Math.round(baseDamage);
    }
  }

  calculateEnemyDamage(): number {
    const baseDamage = Phaser.Math.Between(3, 10);
    const rarityMultiplier =
      this.enemy.rarity === "Common"
        ? 1
        : this.enemy.rarity === "Uncommon"
          ? 1.3
          : 1.6;
    return Math.round(baseDamage * rarityMultiplier);
  }

  handleVictory() {
    this.victories++;
    const expGained = Math.round(this.calculateExpGain());
    const goldEarned = Math.round(this.calculateGoldEarned());
    const pointsEarned = Math.round(this.calculatePointsEarned());
    this.player.experience += expGained;
    this.player.gold += goldEarned;
    this.player.score += pointsEarned;

    let message = `Victory! You earned ${goldEarned} gold, ${expGained} XP, and ${pointsEarned} points.`;

    if (Phaser.Math.Between(1, 10) === 1) {
      const newItem = this.getRandomItem();
      this.player.items.push(newItem);
      message += ` You found a ${newItem}!`;
    }

    this.showMessage(message);

    if (this.player.experience >= this.player.level * 20) {
      this.levelUp();
    }

    this.enemy.sprite.destroy();
    this.enemy = this.createEnemy();
    this.enemy.sprite.setPosition(700, 300);
    this.updateTexts();
  }

  calculateExpGain(): number {
    const baseExp = 10;
    const rarityMultiplier =
      this.enemy.rarity === "Common"
        ? 1
        : this.enemy.rarity === "Uncommon"
          ? 1.5
          : 2;
    return Math.floor(baseExp * rarityMultiplier);
  }

  calculateGoldEarned(): number {
    const baseGold = Phaser.Math.Between(5, 20);
    const rarityMultiplier =
      this.enemy.rarity === "Common"
        ? 1
        : this.enemy.rarity === "Uncommon"
          ? 1.5
          : 2;
    return Math.floor(baseGold * rarityMultiplier);
  }

  calculatePointsEarned(): number {
    const basePoints = 100;
    const rarityMultiplier =
      this.enemy.rarity === "Common"
        ? 1
        : this.enemy.rarity === "Uncommon"
          ? 2
          : 3;
    return Math.floor(basePoints * rarityMultiplier);
  }

  confirmCharacter(playerClass: PlayerClass) {
    let name = "";
    if (this.nameInput && this.nameInput.node) {
      name = (this.nameInput.node as HTMLInputElement).value;
    }

    if (!name) {
      if (playerClass) {
        this.showMessage("Please enter a name.");
      }
      return;
    }
    this.player = this.createPlayer(name, playerClass);
    this.cleanupCharacterCreationUI();
    this.startGame();
  }

  cleanupCharacterCreationUI() {
    // Remove all text objects
    this.children.list.forEach((child) => {
      if (child instanceof Phaser.GameObjects.Text) {
        child.destroy();
      }
    });

    // Remove the name input
    if (this.nameInput) {
      this.nameInput.destroy();
      this.nameInput = null;
    }

    // Remove class buttons
    this.classButtons.forEach((button) => button.destroy());
    this.classButtons = [];

    // Clear any remaining game objects that are not needed in the battle scene
    this.children.list.forEach((child) => {
      if (!(child instanceof Phaser.GameObjects.Sprite)) {
        child.destroy();
      }
    });

    if (this.messageText) {
      this.messageText.destroy();
    }
    if (this.messageTimer) {
      this.messageTimer.remove();
      this.messageTimer = null;
    }
  }

  handleDefeat() {
    this.showMessage("You have been defeated! Game over.");
    this.updateLeaderboard();

    // Use a local variable for the delay to avoid issues if the scene is destroyed
    const scene = this;
    this.time.delayedCall(2000, () => {
      if (!scene.scene.isActive("ColosseumScene")) return;
      scene.showLeaderboard();
    });
  }

  cleanupGameUI() {
    this.children.list.forEach((child) => {
      if (
        child instanceof Phaser.GameObjects.Text ||
        child instanceof Phaser.GameObjects.Sprite ||
        child instanceof Phaser.GameObjects.DOMElement
      ) {
        child.destroy();
      }
    });
  }

  updateLeaderboard() {
    const entry: LeaderboardEntry = {
      name: this.player.name,
      level: this.player.level,
      score: this.player.score,
      victories: this.victories,
    };

    this.leaderboard.push(entry);
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10); // Keep only top 10
  }

  showLeaderboard() {
    this.children.removeAll();

    const title = this.add
      .text(400, 50, "Leaderboard", { fontSize: "32px", color: "#fff" })
      .setOrigin(0.5);

    this.leaderboard.forEach((entry, index) => {
      const text = this.add.text(
        100,
        100 + index * 40,
        `${index + 1}. ${entry.name} - Level: ${entry.level}, Score: ${
          entry.score
        }, Victories: ${entry.victories}`,
        { fontSize: "16px", color: "#fff" },
      );
    });

    const restartButton = this.add
      .text(400, 550, "Restart Game", { fontSize: "24px", color: "#fff" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.restart());
  }

  levelUp() {
    this.player.level++;
    this.player.experience = 0;
    this.player.maxHealth += 20;
    this.player.health = this.player.maxHealth;
    this.showMessage(
      `Congratulations! You've reached level ${this.player.level}!`,
    );
  }

  getRandomItem(): string {
    const items = [
      "Health Potion",
      "Strength Elixir",
      "Magic Scroll",
      "Lucky Charm",
    ];
    return items[Phaser.Math.Between(0, items.length - 1)] ?? "";
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  updateTexts() {
    this.healthText.setText(
      `Health: ${Math.round(this.player.health)}/${this.player.maxHealth}`,
    );
    this.levelText.setText(
      `Level: ${this.player.level} (XP: ${this.player.experience})`,
    );
    this.victoriesText.setText(`Victories: ${this.victories}`);
    this.goldText.setText(`Gold: ${this.player.gold}`);
    this.itemsText.setText(`Items: ${this.player.items.join(", ") ?? ""}`);
    this.scoreText.setText(`Score: ${this.player.score}`);
    this.playerClassText.setText(
      `Class: ${this.capitalizeFirstLetter(this.player.class)}`,
    );
    this.enemyInfoText.setText(this.getEnemyInfoText());
  }

  getEnemyInfoText(): string {
    return `Enemy: ${this.enemy.rarity} (${
      this.enemy.tier
    })\nHealth: ${Math.round(this.enemy.health)}/${this.enemy.maxHealth}`;
  }

  showMessage(message: string) {
    // Clear any existing message timer
    if (this.messageTimer) {
      this.messageTimer.remove();
      this.messageTimer = null;
    }

    // Create a new message text if it doesn't exist
    if (!this.messageText || this.messageText.destroyed) {
      this.messageText = this.add
        .text(400, 550, "", { fontSize: "18px", color: "#fff" })
        .setOrigin(0.5);
    }

    this.messageText.setText(message);

    // Set a new timer to clear the message
    this.messageTimer = this.time.delayedCall(3000, () => {
      if (this.messageText && !this.messageText.destroyed) {
        this.messageText.setText("");
      }
    });
  }
}
