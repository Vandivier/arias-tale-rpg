import type { GameCard, SearchableImage } from "@prisma/client";
import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export type SearchableImageWithGameCard = SearchableImage & {
  gameCard: GameCard | null;
  tags: string[];
};

const getSearchableImage = async (id: number) =>
  await db.searchableImage.findUnique({
    where: { id },
  });

const getSearchableImages = async (
  filter: string,
): Promise<SearchableImageWithGameCard[]> => {
  const lowerCaseFilterValue = filter.toLowerCase();
  console.log({ lowerCaseFilterValue });
  const imageResults = await db.searchableImage.findMany({
    where: {
      OR: [
        {
          title: {
            contains: lowerCaseFilterValue,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: lowerCaseFilterValue,
            mode: "insensitive",
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: lowerCaseFilterValue,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
    include: {
      gameCard: true,
      tags: true,
    },
    take: 999,
  });

  const reducedTags = imageResults.map((ir) => ({
    ...ir,
    tags: ir.tags.map((t) => t.name),
  }));

  return reducedTags;
};

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
  getImages: publicProcedure
    .input(
      z.object({
        filter: z.string(),
      }),
    )
    .query(({ input }) => getSearchableImages(input.filter)),
  getRandomImage: publicProcedure.query(() => {
    return getRandomSearchableImage();
  }),
});
