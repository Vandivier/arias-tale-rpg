import Phaser from "phaser";
import { CharacterCreationScene } from "./scenes/CharacterCreationScene";
import { BattleScene } from "./scenes/BattleScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { LeaderboardScene } from "./scenes/LeaderboardScene";

export default class ColosseumGame extends Phaser.Game {
  constructor(containerId: string) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerId,
      scene: [
        CharacterCreationScene,
        BattleScene,
        GameOverScene,
        LeaderboardScene,
      ],
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 0 } },
      },
      dom: {
        createContainer: true,
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    super(config);
  }
}
