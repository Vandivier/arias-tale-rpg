import dynamic from "next/dynamic";
import React from "react";
import { CustomPage } from "~/components/CustomPage";

const DynamicColosseumGame = dynamic(
  () => import("~/components/colosseum/ColosseumGame"),
  { ssr: false },
);

const GameComponent: React.FC = () => {
  return (
    <CustomPage innerPageClassName="my-4" mainHeading="Aria's Tale Colosseum">
      <div className="my-4">
        <DynamicColosseumGame />
      </div>
    </CustomPage>
  );
};

export default GameComponent;
