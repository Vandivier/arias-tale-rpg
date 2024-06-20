// src/server/api/routers/stripe.ts
import Stripe from "stripe";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export type BuyCardResponse = {
  url?: string;
  errorMessage?: string;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const createStripeCardPurchaseUrl = async (): Promise<BuyCardResponse> => {
  // TODO: get a real URL from Stripe
  return Promise.resolve({ url: "https://stripe.com" });
};

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ input }) => {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Gacha Pull",
              },
              unit_amount: input.amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      });

      return { sessionId: session.id };
    }),
  getStripeCardPurchaseUrl: publicProcedure.query(() => {
    return createStripeCardPurchaseUrl();
  }),
});
