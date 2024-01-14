import { db } from "~/server/db";
import { gameCardSeeds, searchableImageSeeds, tags } from "./seedData";

async function main() {
  console.log("Seeding Tags");
  await db.tag.createMany({
    data: tags,
    // skip if already exists
    skipDuplicates: true,
  });

  console.log("Seeding Searchable Images");
  for (const currImage of searchableImageSeeds) {
    const tags = await db.tag.findMany({
      where: {
        name: {
          in: currImage.tags,
        },
      },
    });

    const resolvedImage = {
      ...currImage,
      tags: {
        connect: tags.map((tag) => ({
          id: tag.id,
        })),
      },
    };

    await db.searchableImage.upsert({
      where: {
        id: currImage.id,
      },
      update: resolvedImage,
      create: resolvedImage,
    });
  }

  console.log("Seeding Game Cards");
  for (const currGameCard of gameCardSeeds) {
    const { id, imageTitle, ...otherCardData } = currGameCard;
    const associatedImage = searchableImageSeeds.find(
      (sis) => sis.title === imageTitle,
    );
    if (!associatedImage)
      throw new Error(`Image not found for game card ID ${id}`);

    const resolvedGameCard = {
      ...otherCardData,
      name: otherCardData.name ?? associatedImage.title,
      description: otherCardData.description ?? associatedImage.description,
      image: {
        connect: { id: associatedImage.id },
      },
    };

    await db.gameCard.upsert({
      where: {
        id,
      },
      update: resolvedGameCard,
      create: resolvedGameCard,
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
