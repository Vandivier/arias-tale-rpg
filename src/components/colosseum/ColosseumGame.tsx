import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { CharacterCreationScene } from "./scenes/CharacterCreationScene";
import { BattleScene } from "./scenes/BattleScene";
import { InventoryScene } from "./scenes/InventoryScene";
import { StoreScene } from "./scenes/StoreScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { LeaderboardScene } from "./scenes/LeaderboardScene";

const ColosseumGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        scene: [
          CharacterCreationScene,
          BattleScene,
          InventoryScene,
          StoreScene,
          GameOverScene,
          LeaderboardScene,
        ],
        physics: {
          default: "arcade",
          arcade: { gravity: { y: 0 } },
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        dom: {
          createContainer: true,
        },
      };

      const game = new Phaser.Game(config);

      return () => {
        game.destroy(true);
      };
    }
  }, []);

  return (
    <div
      ref={gameRef}
      style={{ width: "800px", height: "600px", margin: "auto" }}
    />
  );
};

export default ColosseumGame;
