import { CustomPage } from "~/components/CustomPage";
import { ImageSearchResultTable } from "~/components/ImageSearchResultTable";
import { api } from "~/utils/api";

export default function ImageSearchPage() {
  const { data, isLoading, isError } = api.image.getRandomImage.useQuery(
    undefined,
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

  return (
    <CustomPage mainHeading="Image Search">
      <ImageSearchResultTable />
    </CustomPage>
  );
}
