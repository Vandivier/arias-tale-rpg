// src/pages/games/tcg/[id].tsx

import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { Button, Card } from "@shadcn/ui";
import React, { useEffect } from "react";

const GameSessionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const gameSessionId = id as string;

  const {
    data: gameSession,
    isLoading,
    isError,
  } = trpc.gameSession.getById.useQuery(
    { id: gameSessionId },
    { enabled: !!gameSessionId },
  );

  const performBattle = trpc.gameSession.performBattle.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      // Optionally, refetch the game session to update the state
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleBattle = () => {
    if (!gameSession) return;

    // Example: Selecting the first battler from the current player and opponent
    const currentPlayerId = gameSession.gameState.turn;
    const currentPlayer = gameSession.players.find(
      (p) => p.id === currentPlayerId,
    );
    const opponent = gameSession.players.find((p) => p.id !== currentPlayerId);

    if (!currentPlayer || !opponent) {
      alert("Players not found.");
      return;
    }

    const playerBattler = gameSession.gameState.battlers[currentPlayerId]?.[0];
    const opponentBattler = gameSession.gameState.battlers[opponent.id]?.[0];

    if (!playerBattler || !opponentBattler) {
      alert("Both players must have at least one battler.");
      return;
    }

    performBattle.mutate({
      gameSessionId: gameSessionId,
      playerId: currentPlayerId,
      playerCardId: playerBattler.id,
      opponentCardId: opponentBattler.id,
    });
  };

  if (isLoading) return <div>Loading game session...</div>;
  if (isError || !gameSession) return <div>Error loading game session.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Game Session: {gameSession.id}</h1>
      <h2 className="mt-4 text-xl">Players:</h2>
      <div className="flex space-x-4">
        {gameSession.players.map((player) => (
          <div key={player.id}>
            <h3>
              {player.playerType === "HUMAN"
                ? player.user?.name || "You"
                : "Computer"}
            </h3>
            <div className="flex space-x-2">
              {gameSession.gameState.battlers[player.id]?.map((card) => (
                <Card key={card.id} className="w-32">
                  <img
                    src={card.image.imageFileName}
                    alt={card.title}
                    className="h-24 w-full object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-sm font-bold">{card.title}</h4>
                    <p className="text-xs">Power: {card.powerLevel}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleBattle} className="mt-4">
        Perform Battle
      </Button>

      {/* Display Battle History */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Battle History</h2>
        <ul>
          {gameSession.gameState.battleHistory.map((battle, index) => (
            <li key={index}>
              {battle.playerCard.title} vs {battle.opponentCard.title} -{" "}
              {formatResult(battle.result)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameSessionPage;

// Helper function to format battle results
function formatResult(result: "PLAYER_WIN" | "OPPONENT_WIN" | "TIE"): string {
  switch (result) {
    case "PLAYER_WIN":
      return "You Win";
    case "OPPONENT_WIN":
      return "Opponent Wins";
    case "TIE":
      return "Tie";
    default:
      return "";
  }
}
