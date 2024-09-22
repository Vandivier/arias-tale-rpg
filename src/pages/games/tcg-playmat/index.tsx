// pages/games/tcg-playmat/index.tsx

import Image from "next/image";
import React, { useState } from "react";
import { CustomPage } from "~/components/CustomPage";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";

interface CardType {
  id: number;
  name: string;
  slug: string;
}

const cards: CardType[] = [
  { id: 157, name: "Atlantean Guardian", slug: "atlantean-guardian.jpeg" },
  { id: 158, name: "Quantum Voyagers", slug: "quantum-voyagers.jpeg" },
  { id: 159, name: "Synthetic Enforcer", slug: "synthetic-enforcer.jpeg" },
  { id: 160, name: "Forgotten Warrior", slug: "forgotten-warrior.jpeg" },
  { id: 161, name: "Temporal Anomaly", slug: "temporal-anomaly.jpeg" },
  { id: 162, name: "Quantum Sovereign", slug: "quantum-sovereign.jpeg" },
  { id: 163, name: "Angel Dogs", slug: "angel-dogs.jpeg" },
];

const ZoomedCard = ({
  card,
  onClose,
  onPlay,
}: {
  card: CardType;
  onClose: () => void;
  onPlay: () => void;
}) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{card.name}</DialogTitle>
        <DialogDescription>
          <Image
            src={`/searchable-images/${card.id}-${card.slug}`}
            alt={card.name}
            width={820}
            height={614}
            className="rounded-lg"
          />
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onPlay}>
          {/* Conditional text based on whether the card is already on the playmat */}
          {`Play`}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const TcgPlaymat: React.FC = () => {
  const [cardsOnPlaymat, setCardsOnPlaymat] = useState<CardType[]>([]);
  const [zoomedCard, setZoomedCard] = useState<CardType | null>(null);

  const handleCardClick = (card: CardType) => {
    setZoomedCard(card);
  };

  const handleCardKeyUp = (
    event: React.KeyboardEvent<HTMLDivElement>,
    card: CardType,
  ) => {
    if (event.key === "Enter") {
      setZoomedCard(card);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    card: CardType,
  ) => {
    event.dataTransfer.setData("text/plain", card.id.toString());
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const cardIdNumber = parseInt(cardId, 10);
    const card = cards.find((card) => card.id === cardIdNumber);
    if (card && !cardsOnPlaymat.some((c) => c.id === card.id)) {
      setCardsOnPlaymat((prev) => [...prev, card]);
    }
  };

  const handleRemoveCard = (card: CardType) => {
    setCardsOnPlaymat((prev) => prev.filter((c) => c.id !== card.id));
  };

  return (
    <CustomPage
      innerPageClassName="my-4"
      metaDescription="Play with your TCG cards on this virtual playmat."
      mainHeading="Card Game Playmat"
      title="TCG Playmat - Aria's Tale"
    >
      <div className="mx-auto max-w-7xl p-5 text-center">
        {/* Card Selection Area */}
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {cards.map((card) => (
            <Card
              key={card.id}
              className="cursor-pointer border-2 border-dashed border-gray-300 p-2"
              onDragStart={(e) => handleDragStart(e, card)}
              onClick={() => handleCardClick(card)}
              onKeyUp={(e) => handleCardKeyUp(e, card)}
              tabIndex={0}
              draggable
            >
              <Image
                src={`/searchable-images/${card.id}-${card.slug}`}
                alt={card.name}
                width={200}
                height={280}
                className="rounded-lg"
              />
            </Card>
          ))}
        </div>

        {/* Playmat Area */}
        <div
          className="flex min-h-[300px] flex-wrap items-center justify-center gap-2 border-4 border-gray-800 bg-green-800 p-5"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {cardsOnPlaymat.map((card) => (
            <Card
              key={card.id}
              className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
              onClick={() => handleRemoveCard(card)}
            >
              <Image
                src={`/searchable-images/${card.id}-${card.slug}`}
                alt={card.name}
                width={200}
                height={280}
                className="rounded-lg"
              />
            </Card>
          ))}
        </div>

        {/* Zoomed Card Modal */}
        {zoomedCard && (
          <ZoomedCard
            card={zoomedCard}
            onClose={() => setZoomedCard(null)}
            onPlay={
              cardsOnPlaymat.some((c) => c.id === zoomedCard.id)
                ? () => handleRemoveCard(zoomedCard)
                : () => setCardsOnPlaymat((prev) => [...prev, zoomedCard])
            }
          />
        )}
      </div>
    </CustomPage>
  );
};

export default TcgPlaymat;
