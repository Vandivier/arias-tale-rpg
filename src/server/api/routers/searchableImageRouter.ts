import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

async function getRandomSearchableImage() {
  const searchableImages = await db.searchableImage.findMany();
  const randomIndex = Math.floor(Math.random() * searchableImages.length);
  const randomImage = searchableImages[randomIndex];
  return randomImage;
}

export const searchableImageRouter = createTRPCRouter({
  getRandomImage: publicProcedure.query(() => {
    return getRandomSearchableImage();
  }),
});
