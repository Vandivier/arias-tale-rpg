// pages/games/tcg-playmat/index.tsx

import React, { useState, type DragEvent } from "react";
import Head from "next/head";
import Image from "next/image";

// Define types for our cards
interface Card {
  id: number;
  name: string;
  slug: string;
}

// List of cards we've discussed and for which images have been generated
const cards: Card[] = [
  { id: 157, name: "Atlantean Guardian", slug: "atlantean-guardian" },
  { id: 158, name: "Quantum Voyagers", slug: "quantum-voyagers" },
  { id: 159, name: "Synthetic Enforcer", slug: "synthetic-enforcer" },
  { id: 160, name: "Forgotten Warrior", slug: "forgotten-warrior" },
  { id: 161, name: "Temporal Anomaly", slug: "temporal-anomaly" },
  { id: 162, name: "Quantum Sovereign", slug: "quantum-sovereign" },
];

const TcgPlaymat: React.FC = () => {
  const [cardsOnPlaymat, setCardsOnPlaymat] = useState<Card[]>([]);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const cardIdNumber = parseInt(cardId, 10);
    const card = cards.find((card) => card.id === cardIdNumber);
    if (card && !cardsOnPlaymat.some((c) => c.id === card.id)) {
      setCardsOnPlaymat((prev) => [...prev, card]);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    card: Card,
  ) => {
    event.dataTransfer.setData("text/plain", card.id.toString());
  };

  return (
    <div
      className="p-5 text-center"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Head>
        <title>TCG Playmat - Aria's Tale</title>
        <meta
          name="description"
          content="Play with your TCG cards on this virtual playmat."
        />
      </Head>

      <main className="mx-auto max-w-7xl">
        <h1 className="mb-5 text-4xl font-bold">Card Game Playmat</h1>

        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {cards.map((card) => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
              className="cursor-move border-2 border-dashed border-gray-300 p-2"
            >
              <Image
                src={`/searchable-images/${card.id}-${card.slug}.jpg`}
                alt={card.name}
                width={100}
                height={140}
                className="rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="flex min-h-[300px] flex-wrap items-center justify-center gap-2 border-4 border-gray-800 bg-green-800 p-5">
          {cardsOnPlaymat.map((card) => (
            <div
              key={card.id}
              className="transition-transform duration-300 ease-in-out hover:scale-110"
            >
              <Image
                src={`/searchable-images/${card.id}-${card.slug}.jpg`}
                alt={card.name}
                width={100}
                height={140}
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TcgPlaymat;