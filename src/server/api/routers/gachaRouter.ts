// src/server/api/routers/gacha.ts
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const gachaRouter = createTRPCRouter({
  draw: protectedProcedure.mutation(async ({}) => {
    const drawResult = Math.random() > 0.5 ? "Rare" : "Common";
    return {
      result: drawResult,
    };
  }),
});
