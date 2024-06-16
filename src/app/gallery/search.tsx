import { CustomPage } from "~/components/CustomPage";
import { ImageSearchResultTable } from "~/components/ImageSearchResultTable";

export default function ImageSearchPage() {
  return (
    <CustomPage mainHeading="Card and Image Search">
      <ImageSearchResultTable />
    </CustomPage>
  );
}
