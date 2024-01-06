import Image from "next/image";
import { CustomPage } from "~/components/CustomPage";
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

  // Update the imageUrl to use local path
  const imageUrl = data?.imageFileName
    ? `/searchable-images/${data.imageFileName}`
    : "";

  return (
    <CustomPage mainHeading="Gallery">
      <button
        onClick={handleRollClick}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      >
        Reroll!
      </button>

      <div>
        <h2 className={`py-2 text-2xl`}>Art Roll Result</h2>

        {data && imageUrl ? (
          <>
            <h3>{data.title}</h3>
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
          <h3>Image not found</h3>
        )}
      </div>
    </CustomPage>
  );
}
