import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

const getSearchableImage = async (id: number) =>
  await db.searchableImage.findUnique({
    where: { id },
  });

async function getRandomSearchableImage() {
  const searchableImages = await db.searchableImage.findMany();
  const randomIndex = Math.floor(Math.random() * searchableImages.length);
  const randomImage = searchableImages[randomIndex];
  return randomImage;
}

export const searchableImageRouter = createTRPCRouter({
  getImage: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ input }) => getSearchableImage(input.id)),
  getRandomImage: publicProcedure.query(() => {
    return getRandomSearchableImage();
  }),
});
