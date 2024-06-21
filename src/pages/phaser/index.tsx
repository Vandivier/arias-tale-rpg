import React, { useEffect, useRef } from "react";

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
}

interface Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  maxHealth: number;
  rarity: EnemyRarity;
  tier: EnemyTier;
}

const PhaserGameComponent: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const initPhaser = async () => {
      if (gameInstanceRef.current) return;

      const Phaser = await import("phaser");

      class ColosseumScene extends Phaser.Scene {
        player!: PlayerCharacter;
        playerSprite!: Phaser.Physics.Arcade.Sprite;
        enemy!: Enemy;
        victories!: number;
        healthText!: Phaser.GameObjects.Text;
        levelText!: Phaser.GameObjects.Text;
        victoriesText!: Phaser.GameObjects.Text;
        goldText!: Phaser.GameObjects.Text;
        itemsText!: Phaser.GameObjects.Text;
        messageText!: Phaser.GameObjects.Text;
        enemyInfoText!: Phaser.GameObjects.Text;

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
            .text(400, 200, "Enter your name:", {
              fontSize: "24px",
              color: "#fff",
            })
            .setOrigin(0.5);
          const nameInput = this.add.dom(
            400,
            250,
            "input",
            "width: 200px; height: 30px;",
          );
          const classPrompt = this.add
            .text(400, 300, "Choose your class:", {
              fontSize: "24px",
              color: "#fff",
            })
            .setOrigin(0.5);

          const classes: PlayerClass[] = ["warrior", "mage", "archer"];
          const classButtons = classes.map((c, i) => {
            return this.add
              .text(300 + i * 100, 350, c, { fontSize: "20px", color: "#fff" })
              .setInteractive()
              .on("pointerdown", () =>
                this.confirmCharacter(nameInput.node.value, c),
              );
          });

          nameInput.addListener("keydown");
          nameInput.on("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
              this.confirmCharacter(nameInput.node.value, "warrior");
            }
          });
        }

        confirmCharacter(name: string, playerClass: PlayerClass) {
          if (!name) {
            this.showMessage("Please enter a name.");
            return;
          }
          this.player = this.createPlayer(name, playerClass);
          this.children.removeAll();
          this.startGame();
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
          };
        }

        startGame() {
          this.playerSprite = this.physics.add.sprite(
            100,
            300,
            this.player.class,
          );
          this.enemy = this.createEnemy();

          // Scale sprites to a consistent height
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
          this.victoriesText = this.add.text(
            10,
            50,
            `Victories: ${this.victories}`,
            { fontSize: "16px", color: "#fff" },
          );
          this.goldText = this.add.text(10, 70, `Gold: ${this.player.gold}`, {
            fontSize: "16px",
            color: "#fff",
          });
          this.itemsText = this.add.text(
            10,
            90,
            `Items: ${this.player.items.join(", ")}`,
            { fontSize: "16px", color: "#fff" },
          );

          this.messageText = this.add
            .text(400, 550, "", { fontSize: "18px", color: "#fff" })
            .setOrigin(0.5);
          this.enemyInfoText = this.add.text(600, 10, this.getEnemyInfoText(), {
            fontSize: "16px",
            color: "#fff",
          });

          this.input.keyboard!.on("keydown-SPACE", this.attack, this);
        }

        scaleSprite(
          sprite: Phaser.Physics.Arcade.Sprite,
          targetHeight: number,
        ) {
          const scale = targetHeight / sprite.height;
          sprite.setScale(scale);
        }

        createEnemy(): Enemy {
          const rarityRoll = Phaser.Math.Between(1, 20);
          let rarity: EnemyRarity, tier: EnemyTier;

          if (rarityRoll <= 12) {
            rarity = "Common";
            tier = ["F", "E", "D", "C", "B"][
              Phaser.Math.Between(0, 4)
            ] as EnemyTier;
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

          return {
            sprite: this.physics.add.sprite(700, 300, "enemy"),
            health: maxHealth,
            maxHealth: maxHealth,
            rarity,
            tier,
          };
        }

        getEnemyInfoText(): string {
          return `Enemy: ${this.enemy.rarity} (${this.enemy.tier})\nHealth: ${this.enemy.health}/${this.enemy.maxHealth}`;
        }

        attack = () => {
          const damage = this.calculateDamage();
          this.enemy.health -= damage;

          if (this.enemy.health <= 0) {
            this.handleVictory();
          } else {
            const enemyDamage = this.calculateEnemyDamage();
            this.player.health -= enemyDamage;

            if (this.player.health <= 0) {
              this.handleDefeat();
            }
          }

          this.updateTexts();
        };

        calculateDamage(): number {
          const baseDamage = Phaser.Math.Between(5, 15);
          switch (this.player.class) {
            case "warrior":
              return baseDamage * 1.2;
            case "mage":
              return baseDamage * 1.5;
            case "archer":
              return baseDamage * 1.3;
            default:
              return baseDamage;
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
          return Math.floor(baseDamage * rarityMultiplier);
        }

        handleVictory() {
          this.victories++;
          const expGained = this.calculateExpGain();
          const goldEarned = this.calculateGoldEarned();
          this.player.experience += expGained;
          this.player.gold += goldEarned;

          if (Phaser.Math.Between(1, 10) === 1) {
            const newItem = this.getRandomItem();
            this.player.items.push(newItem);
            this.showMessage(
              `Victory! You earned ${goldEarned} gold, ${expGained} XP, and found a ${newItem}!`,
            );
          } else {
            this.showMessage(
              `Victory! You earned ${goldEarned} gold and ${expGained} XP.`,
            );
          }

          if (this.player.experience >= this.player.level * 20) {
            this.levelUp();
          }

          this.enemy = this.createEnemy();
          this.enemy.sprite.setPosition(700, 300);
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

        handleDefeat() {
          this.showMessage("You have been defeated! Game over.");
          this.time.delayedCall(2000, () => this.scene.restart());
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

        updateTexts() {
          this.healthText.setText(
            `Health: ${this.player.health}/${this.player.maxHealth}`,
          );
          this.levelText.setText(
            `Level: ${this.player.level} (XP: ${this.player.experience})`,
          );
          this.victoriesText.setText(`Victories: ${this.victories}`);
          this.goldText.setText(`Gold: ${this.player.gold}`);
          this.itemsText.setText(`Items: ${this.player.items.join(", ")}`);
          this.enemyInfoText.setText(this.getEnemyInfoText());
        }

        showMessage(message: string) {
          this.messageText.setText(message);
          this.time.delayedCall(3000, () => this.messageText.setText(""));
        }
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current ?? undefined,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 0 },
          },
        },
        scene: ColosseumScene,
        dom: {
          createContainer: true,
        },
      };

      gameInstanceRef.current = new Phaser.Game(config);
    };

    if (gameRef.current && !gameInstanceRef.current) {
      initPhaser();
    }

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={gameRef}
      style={{ margin: "auto", width: "800px", height: "600px" }}
    />
  );
};

export default PhaserGameComponent;
