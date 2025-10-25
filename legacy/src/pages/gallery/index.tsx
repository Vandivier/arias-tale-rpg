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
          <Link
            href="https://suno.com/playlist/1d9534bc-ed44-493d-8e02-71ef60b37707"
            target="_blank"
          >
            Music
          </Link>
        </li>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/random`}>Random Image</Link>
        </li>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/search`}>Search Cards and Images</Link>
        </li>
      </ul>
    </CustomPage>
  );
}
