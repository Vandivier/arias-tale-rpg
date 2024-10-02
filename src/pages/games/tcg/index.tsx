// src/pages/games/tcg/index.tsx

import { useState } from "react";

import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";
import { CustomPage } from "~/components/CustomPage";

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
    <CustomPage
      innerPageClassName="my-4"
      metaDescription="Play Aria's Tale TCG Game"
      mainHeading="Create New TCG Session"
      title="Create a New TCG Game Session"
    >
      {/* Deck Selection UI */}
      <div className="mt-4">
        <h2>Select Your Deck</h2>
        {/* Replace with dynamic deck data */}
        <div className="flex space-x-2">
          <Card className="w-32" onClick={() => handleSelectDeck(1)}>
            <Image
              src="/searchable-images/78-cardback-tealstone.png"
              alt="Deck 1"
              className="h-24 w-full object-cover"
              width="200"
              height="200"
            />
            <div className="p-2">
              <h3 className="text-sm font-bold">Deck 1</h3>
            </div>
          </Card>
          <Card className="w-32" onClick={() => handleSelectDeck(2)}>
            <Image
              src="/searchable-images/81-cardback-walled-city.png"
              alt="Deck 2"
              className="h-24 w-full object-cover"
              width="200"
              height="200"
            />
            <div className="p-2">
              <h3 className="text-sm font-bold">Deck 2</h3>
            </div>
          </Card>
        </div>
      </div>

      <Button onClick={handleCreateGame} className="mt-4">
        Create Game Session
      </Button>
    </CustomPage>
  );
};

export default TCGGamePage;
