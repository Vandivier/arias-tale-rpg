import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ColosseumGame = dynamic(
  () => import("~/components/colosseum/ColosseumGame"),
  { ssr: false },
);

const GameComponent: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      new ColosseumGame(gameRef.current.id);
    }
  }, []);

  return (
    <div
      id="colosseum-game-container"
      ref={gameRef}
      style={{ width: "800px", height: "600px" }}
    />
  );
};

export default GameComponent;
