import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { artRouter } from "./routers/artRouter";
import { gachaRouter } from "./routers/gachaRouter";
import { searchableImageRouter } from "./routers/searchableImageRouter";
import { stripeRouter } from "./routers/stripeRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  art: artRouter,
  gacha: gachaRouter,
  image: searchableImageRouter,
  post: postRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
