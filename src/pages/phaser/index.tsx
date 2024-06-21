import React, { useEffect, useRef } from "react";

type PlayerClass = "warrior" | "mage" | "archer";

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

const PhaserGameComponent: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: Phaser.Game;

    const initPhaser = async () => {
      const Phaser = await import("phaser");

      class ColosseumScene extends Phaser.Scene {
        player!: PlayerCharacter;
        enemy!: Phaser.Physics.Arcade.Sprite;
        enemyHealth!: number;
        victories!: number;
        healthText!: Phaser.GameObjects.Text;
        levelText!: Phaser.GameObjects.Text;
        victoriesText!: Phaser.GameObjects.Text;
        goldText!: Phaser.GameObjects.Text;
        itemsText!: Phaser.GameObjects.Text;
        messageText!: Phaser.GameObjects.Text;

        constructor() {
          super("ColosseumScene");
        }

        preload() {
          this.load.image("warrior", "/phaser/warrior.png");
          this.load.image("mage", "/phaser/mage.png");
          this.load.image("archer", "/phaser/archer.png");
          this.load.image("enemy", "/phaser/enemy.png");
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
          this.children.removeAll(); // Clear the character creation UI
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
          const playerSprite = this.physics.add.sprite(
            100,
            300,
            this.player.class,
          );
          this.enemy = this.physics.add.sprite(700, 300, "enemy");

          this.enemyHealth = 50;
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

          this.input.keyboard!.on("keydown-SPACE", this.attack, this);
        }

        attack = () => {
          const damage = this.calculateDamage();
          this.enemyHealth -= damage;

          if (this.enemyHealth <= 0) {
            this.handleVictory();
          } else {
            const enemyDamage = Phaser.Math.Between(3, 10);
            this.player.health -= enemyDamage;

            if (this.player.health <= 0) {
              this.handleDefeat();
            }
          }

          this.updateTexts();
        };

        calculateDamage(): number {
          let baseDamage = Phaser.Math.Between(5, 15);
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

        handleVictory() {
          this.victories++;
          this.player.experience += 10;
          const goldEarned = Phaser.Math.Between(5, 20);
          this.player.gold += goldEarned;

          if (Phaser.Math.Between(1, 10) === 1) {
            const newItem = this.getRandomItem();
            this.player.items.push(newItem);
            this.showMessage(
              `Victory! You earned ${goldEarned} gold, 10 XP, and found a ${newItem}!`,
            );
          } else {
            this.showMessage(
              `Victory! You earned ${goldEarned} gold and 10 XP.`,
            );
          }

          if (this.player.experience >= this.player.level * 20) {
            this.levelUp();
          }

          this.enemyHealth = 50 + this.player.level * 10;
          this.enemy.setPosition(700, 300);
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
          return items[Phaser.Math.Between(0, items.length - 1)];
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

      game = new Phaser.Game(config);
    };

    initPhaser();

    return () => {
      game?.destroy(true);
    };
  }, []);

  return <div ref={gameRef} style={{ width: "800px", height: "600px" }} />;
};

export default PhaserGameComponent;
