import { useRouter } from "next/router";
import Image from "next/image";
import { CustomPage } from "~/components/CustomPage";
import { api } from "~/utils/api";
import Link from "next/link";

export default function SearchableImagePage() {
  const router = useRouter();
  const { searchableImageId } = router.query;
  const sId = Array.isArray(searchableImageId)
    ? searchableImageId[0]
    : searchableImageId;
  const id = parseInt(sId ?? "", 10);
  const { data, isLoading, isError } = api.image.getImage.useQuery(
    { id },
    {
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) return <span>Loading...</span>;
  if (isError) {
    return (
      <span>😭 An error occured while trying to obtain the image. 😭</span>
    );
  }

  const imageUrl = data?.imageFileName
    ? `/searchable-images/${data.imageFileName}`
    : "";

  return (
    <CustomPage mainHeading="Image Details">
      <div>
        <Link
          className={`mx-2 ${id < 2 ? "disabled-link" : ""}`}
          href={`/gallery/${id - 1}`}
        >
          {`< Back`}
        </Link>
        <Link className={`mx-2`} href={`/gallery/${id + 1}`}>
          {`Next >`}
        </Link>
      </div>

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
