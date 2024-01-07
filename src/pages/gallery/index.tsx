import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";

export default function GalleryPage() {
  return (
    <CustomPage mainHeading="Gallery">
      <ul>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/art-roll`}>Art Roll</Link>
        </li>
        {/*
            - TODO: below pages + search by tag & other attributes
            - Episode gallery browser has multiple images per episode

        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/characters`}>Character Portraits</Link>
        </li>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/episodes`}>Episode Gallery</Link>
        </li>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/places`}>Places</Link>
        </li>

        */}
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/random`}>Random Image</Link>
        </li>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/search`}>Search Images</Link>
        </li>
      </ul>
    </CustomPage>
  );
}
