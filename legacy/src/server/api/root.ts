import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { artRouter } from "./routers/artRouter";
import { searchableImageRouter } from "./routers/searchableImageRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  art: artRouter,
  image: searchableImageRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
