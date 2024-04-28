import { signIn, useSession } from "next-auth/react";
import React from "react";
import { CustomPage } from "~/components/CustomPage";
import { SubheadingWithDice } from "~/components/SubheadingWithDice";

export default function StorePage() {
  const { data: sessionData } = useSession();
  // TODO: don't use any type
  const [buyCardResponse, setBuyCardResponse] = React.useState<any>(null);

  const handleBuyCardClick = async () => {
    // 1. call our own buy-a-card service
    // 2. our service calls stripe
    // 3. user pays stripe
    // 4. stripe calls our service back
    // 5. our service calls the game server to give the card to the user
    // 6. our service returns success to the client with card info
    // const response = await fetch("/api/buy-card", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ cardId: "1" }),
    // });

    // const responseBody = await response.json();
    setBuyCardResponse({
      errorMessage: "Error: Card purchase not yet implemented.",
    });
  };

  return (
    <CustomPage mainHeading="Aria's Tale Store">
      <>
        <SubheadingWithDice subheading={`Purchase Aria's Tale TCG Cards`} />
        {sessionData ? (
          <BuyCardButton handleBuyCardClick={handleBuyCardClick} />
        ) : (
          <AuthButtonIfNeeded />
        )}

        <BuyCardResponseRenderer buyCardResponse={buyCardResponse} />
      </>
    </CustomPage>
  );
}

const AuthButtonIfNeeded = () => (
  <button
    className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
    onClick={() => void signIn()}
  >
    Sign in or join now to make a purchase!
  </button>
);

const BuyCardButton = ({
  handleBuyCardClick,
}: {
  handleBuyCardClick: () => void;
}) => {
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={handleBuyCardClick}
    >
      Buy a Card for $1
    </button>
  );
};

const BuyCardResponseRenderer = ({ buyCardResponse }) => {
  if (!buyCardResponse) return null;

  return !buyCardResponse.errorMessage ? (
    <div className="mt-4">
      <p className="text-white">Card purchased!</p>
      <p className="text-white">Card name: {buyCardResponse.name}</p>
      <p className="text-white">
        Card description: {buyCardResponse.description}
      </p>
    </div>
  ) : (
    <div className="mt-4">
      <p className="text-white">{buyCardResponse.errorMessage}</p>
    </div>
  );
};
