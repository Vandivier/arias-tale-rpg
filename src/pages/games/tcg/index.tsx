// src/pages/games/tcg/index.tsx

import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";

const TCGGamePage = () => {
  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>([]);
  const createGameSession = api.gameSession.create.useMutation({
    onSuccess: (data) => {
      // Redirect to the game session page or update UI accordingly
      console.log("Game session created:", data);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSelectDeck = (deckId: number) => {
    setSelectedDeckIds((prev) => [...prev, deckId]);
  };

  const handleCreateGame = () => {
    if (selectedDeckIds.length === 0) {
      alert("Please select at least one deck.");
      return;
    }

    createGameSession.mutate({ deckIds: selectedDeckIds });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create a New Game Session</h1>
      {/* Deck Selection UI */}
      <div className="mt-4">
        <h2>Select Your Deck</h2>
        {/* Replace with dynamic deck data */}
        <div className="flex space-x-2">
          <Card className="w-32" onClick={() => handleSelectDeck(1)}>
            <img
              src="/deck1.jpg"
              alt="Deck 1"
              className="h-24 w-full object-cover"
            />
            <div className="p-2">
              <h3 className="text-sm font-bold">Deck 1</h3>
            </div>
          </Card>
          <Card className="w-32" onClick={() => handleSelectDeck(2)}>
            <img
              src="/deck2.jpg"
              alt="Deck 2"
              className="h-24 w-full object-cover"
            />
            <div className="p-2">
              <h3 className="text-sm font-bold">Deck 2</h3>
            </div>
          </Card>
          {/* Add more decks as needed */}
        </div>
      </div>

      <Button onClick={handleCreateGame} className="mt-4">
        Create Game Session
      </Button>
    </div>
  );
};

export default TCGGamePage;
