import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { PlayerSelectScene } from "./scenes/PlayerSelectScene";
import { DifficultySelectScene } from "./scenes/DifficultySelectScene";
import { BattleScene } from "./scenes/BattleScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { VictoryScene } from "./scenes/VictoryScene";

const FighterGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 340,
        height: 520,
        parent: gameRef.current,
        scene: [
          PreloadScene,
          PlayerSelectScene,
          DifficultySelectScene,
          BattleScene,
          GameOverScene,
          VictoryScene,
        ],
        physics: {
          default: "arcade",
          arcade: { gravity: { x: 0, y: 300 } },
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
        input: {
          keyboard: true,
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
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "340px",
        maxHeight: "520px",
        margin: "auto",
      }}
    />
  );
};
export default FighterGame;
