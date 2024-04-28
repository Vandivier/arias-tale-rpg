import Image from "next/image";

export const SubheadingWithDice = ({ subheading }: { subheading: string }) => (
  <div className="flex items-center">
    <Image
      alt="Aria's Tale Dice Logo"
      className="dice-logo mr-2"
      height={50}
      width={50}
      src="/arias-tale-d20-logo.png"
    />
    <p>{subheading}</p>
    <Image
      alt="Aria's Tale Dice Logo"
      className="dice-logo ml-2"
      height={50}
      width={50}
      src="/arias-tale-d20-logo.png"
    />
  </div>
);
