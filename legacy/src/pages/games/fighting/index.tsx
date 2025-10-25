import React from "react";
import dynamic from "next/dynamic";
import { CustomPage } from "~/components/CustomPage";

const DynamicFightingGame = dynamic(
  () => import("~/components/fighting/FighterGame"),
  { ssr: false },
);

const GameComponent: React.FC = () => {
  return (
    <CustomPage mainHeading="Aria's Tale Colosseum">
      <DynamicFightingGame />
    </CustomPage>
  );
};

export default GameComponent;
