import { signIn, useSession } from "next-auth/react";
import React from "react";
import { CustomPage } from "~/components/CustomPage";
import { SubheadingWithDice } from "~/components/SubheadingWithDice";
import type { BuyCardResponse } from "~/server/api/routers/stripeRouter";
import { api } from "~/utils/api";

type BuyCardResponseRendererProps = {
  buyCardResponse: BuyCardResponse | undefined;
  isBuyCardDataError: boolean;
  isBuyCardDataLoading: boolean;
  isRendererEnabled: boolean;
};

export default function StorePage() {
  const { data: sessionData } = useSession();

  // TODO
  // 1. call our own buy-a-card service [done]
  // 2. our service calls stripe
  // 3. user pays stripe
  // 4. stripe calls our service back
  // 5. our service calls the game server to give the card to the user
  // 6. our service returns success to the client with card info
  const [isEnabled, setIsEnabled] = React.useState(false);
  const {
    data: buyCardData,
    isLoading: isBuyCardDataLoading,
    isError: isBuyCardDataError,
    refetch,
  } = api.stripe.getStripeCardPurchaseUrl.useQuery(undefined, {
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  });

  const handleBuyCardClick = async () => {
    setIsEnabled(true);
    refetch();
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

        <BuyCardResponseRenderer
          buyCardResponse={buyCardData}
          isBuyCardDataError={isBuyCardDataError}
          isBuyCardDataLoading={isBuyCardDataLoading}
          isRendererEnabled={isEnabled}
        />
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

const BuyCardResponseRenderer = ({
  buyCardResponse,
  isBuyCardDataError,
  isBuyCardDataLoading,
  isRendererEnabled,
}: BuyCardResponseRendererProps) => {
  if (!isRendererEnabled || buyCardResponse === null) return null;

  if (isBuyCardDataLoading) {
    return (
      <div className="mt-4">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (isBuyCardDataError || !buyCardResponse || buyCardResponse.errorMessage) {
    return (
      <span>
        {buyCardResponse?.errorMessage ??
          "An error occurred while purchasing the card."}
      </span>
    );
  }

  return !buyCardResponse.errorMessage ? (
    <div className="mt-4">
      <p className="text-white">Card purchased!</p>
      <p>TODO: now I need to figure out how to forward you to Stripe</p>
      <p>I got this url but it's kinda sus right? {buyCardResponse.url}</p>
    </div>
  ) : (
    <div className="mt-4">
      <p className="text-white">{buyCardResponse.errorMessage}</p>
    </div>
  );
};
