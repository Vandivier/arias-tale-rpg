import Image from "next/image";
import { CustomPage } from "~/components/CustomPage";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function RandomGalleryImagePage() {
  const { data, isLoading, isError, refetch } =
    api.image.getRandomImage.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  if (isLoading) return <span>Loading...</span>;
  if (isError) {
    return (
      <span>😭 An error occured while trying to obtain a random image. 😭</span>
    );
  }

  const handleRollClick = async () => {
    await refetch();
  };

  const imageUrl = data?.imageFileName
    ? `/searchable-images/${data.imageFileName}`
    : "";

  return (
    <CustomPage mainHeading="Random Image">
      <Button onClick={handleRollClick} size={"lg"} variant="secondary">
        Reroll!
      </Button>

      <div>
        {data && imageUrl ? (
          <>
            <h2 className={`py-2 text-2xl`}>{data.title}</h2>
            <Image
              src={imageUrl}
              alt={data.title}
              width={300}
              height={300}
              layout="responsive"
            />
            <p>{data.description}</p>
          </>
        ) : (
          <h2 className={`py-2 text-2xl`}>Image Not Found</h2>
        )}
      </div>
    </CustomPage>
  );
}
