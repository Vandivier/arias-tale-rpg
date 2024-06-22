import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CustomPage } from "~/components/CustomPage";

const PhaserGameComponent: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    let game: Phaser.Game | null = null;

    const initPhaser = async () => {
      if (typeof window !== "undefined") {
        const Phaser = (await import("phaser")).default;
        const { default: ColosseumScene } = await import(
          "~/components/phaser/ColosseumScene"
        );

        if (gameRef.current && !game) {
          game = new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current,
            scene: ColosseumScene,
            physics: {
              default: "arcade",
              arcade: { gravity: { x: 0, y: 0 } },
            },
            dom: {
              createContainer: true,
            },
          });
          setGameLoaded(true);
        }
      }
    };

    initPhaser();

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  return (
    <CustomPage mainHeading="Aria's Tale Colosseum">
      <div
        ref={gameRef}
        style={{ width: "800px", height: "600px", margin: "auto" }}
      />
    </CustomPage>
  );
};

// Use dynamic import with SSR disabled for the PhaserGameComponent
const DynamicPhaserGameComponent = dynamic(
  () => Promise.resolve(PhaserGameComponent),
  {
    ssr: false,
  },
);

export default DynamicPhaserGameComponent;
