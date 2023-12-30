import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";

const MAX_IMAGE_ID = 100;

export default function GalleryPage() {
  return (
    <CustomPage mainHeading="Random Gallery Image">
      <ul>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/art-roll`}>Art Roll</Link>
        </li>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/characters`}>Character Portraits</Link>
        </li>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/random`}>Random Image</Link>
        </li>
      </ul>
    </CustomPage>
  );
}
