import { db } from "~/server/db";
import { searchableImages, tags } from "./seedData";

async function main() {
  console.log("Seeding Tags");
  await db.tag.createMany({
    data: tags,
    // skip if already exists
    skipDuplicates: true,
  });

  console.log("Seeding Searchable Images");
  for (const currImage of searchableImages) {
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
