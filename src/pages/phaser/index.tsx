import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

export default function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && gameRef.current && !gameLoaded) {
      class ColosseumScene extends Phaser.Scene {
        player!: Phaser.Physics.Arcade.Sprite;
        enemy!: Phaser.Physics.Arcade.Sprite;
        playerHealth!: number;
        enemyHealth!: number;
        playerLevel!: number;
        victories!: number;
        healthText!: Phaser.GameObjects.Text;
        levelText!: Phaser.GameObjects.Text;
        victoriesText!: Phaser.GameObjects.Text;

        constructor() {
          super("ColosseumScene");
        }

        preload() {
          this.load.image("warrior", "/phaser/warrior.png");
          this.load.image("enemy", "/phaser/enemy.png");
        }

        create() {
          this.player = this.physics.add.sprite(100, 300, "warrior");
          this.enemy = this.physics.add.sprite(700, 300, "enemy");

          this.playerHealth = 100;
          this.enemyHealth = 50;
          this.playerLevel = 1;
          this.victories = 0;

          this.healthText = this.add.text(
            10,
            10,
            `Health: ${this.playerHealth}`,
            { fontSize: "16px", color: "#fff" },
          );
          this.levelText = this.add.text(10, 30, `Level: ${this.playerLevel}`, {
            fontSize: "16px",
            color: "#fff",
          });
          this.victoriesText = this.add.text(
            10,
            50,
            `Victories: ${this.victories}`,
            { fontSize: "16px", color: "#fff" },
          );

          this.input.keyboard!.on("keydown-SPACE", this.attack, this);
        }

        attack = () => {
          const damage = Phaser.Math.Between(5, 15) * this.playerLevel;
          this.enemyHealth -= damage;

          if (this.enemyHealth <= 0) {
            this.victories++;
            this.playerLevel++;
            this.playerHealth = Math.min(this.playerHealth + 20, 100);
            this.enemyHealth = 50 * this.playerLevel;
            this.enemy.setPosition(700, 300);
          } else {
            const enemyDamage = Phaser.Math.Between(3, 10);
            this.playerHealth -= enemyDamage;

            if (this.playerHealth <= 0) {
              this.scene.restart();
            }
          }

          this.updateTexts();
        };

        updateTexts() {
          this.healthText.setText(`Health: ${this.playerHealth}`);
          this.levelText.setText(`Level: ${this.playerLevel}`);
          this.victoriesText.setText(`Victories: ${this.victories}`);
        }
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 0 },
          },
        },
        scene: ColosseumScene,
      };

      const game = new Phaser.Game(config);
      setGameLoaded(true);

      return () => {
        game.destroy(true);
      };
    }
  }, [gameLoaded]);

  return <div ref={gameRef} style={{ width: "800px", height: "600px" }} />;
}
