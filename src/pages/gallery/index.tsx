import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";

export default function GalleryPage() {
  return (
    <CustomPage mainHeading="Gallery">
      <ul>
        <li className={`my-6 text-2xl`}>
          <Link href={`/gallery/art-roll`}>Art Roll</Link>
        </li>
      </ul>
    </CustomPage>
  );
}
