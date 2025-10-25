import Phaser from "phaser";
import React, { useEffect, useRef } from "react";

import { BattleScene } from "./scenes/BattleScene";
import { CharacterCreationScene } from "./scenes/CharacterCreationScene";
import { EncounterScene } from "./scenes/EncounterScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { InventoryScene } from "./scenes/InventoryScene";
import { LeaderboardScene } from "./scenes/LeaderboardScene";
import { StartGameScene } from "./scenes/StartGameScene";
import { StoreScene } from "./scenes/StoreScene";
import { MapScene } from "./scenes/MapScene";

const ColosseumGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 340,
        height: 520,
        parent: gameRef.current,
        scene: [
          StartGameScene,
          CharacterCreationScene,
          BattleScene,
          MapScene,
          EncounterScene,
          StoreScene,
          InventoryScene,
          GameOverScene,
          LeaderboardScene,
        ],
        physics: {
          default: "arcade",
          arcade: { gravity: { x: 0, y: 0 } },
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 340,
          height: 520,
          min: {
            width: 340,
            height: 520,
          },
          max: {
            width: 1020,
            height: 1560,
          },
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
      style={{ width: "340px", height: "520px", margin: "auto" }}
    />
  );
};

export default ColosseumGame;
