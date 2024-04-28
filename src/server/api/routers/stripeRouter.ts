import { createTRPCRouter, publicProcedure } from "../trpc";

export type BuyCardResponse = {
  url?: string;
  errorMessage?: string;
};

const createStripeCardPurchaseUrl = async (): Promise<BuyCardResponse> => {
  // TODO: get a real URL from Stripe
  return Promise.resolve({ url: "https://stripe.com" });
};

export const stripeRouter = createTRPCRouter({
  getStripeCardPurchaseUrl: publicProcedure.query(() => {
    return createStripeCardPurchaseUrl();
  }),
});
