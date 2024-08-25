import React from "react";
import dynamic from "next/dynamic";
import { CustomPage } from "~/components/CustomPage";

const DynamicColosseumGame = dynamic(
  () => import("~/components/colosseum/ColosseumGame"),
  { ssr: false },
);

const GameComponent: React.FC = () => {
  return (
    <CustomPage mainHeading="Aria's Tale Colosseum">
      <DynamicColosseumGame />
    </CustomPage>
  );
};

export default GameComponent;
