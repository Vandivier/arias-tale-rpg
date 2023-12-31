import Link from "next/link";
import { CustomPage } from "./CustomPage";

interface DocIndexPageProps {
  filenames: string[];
  title: string;
}

export const DocIndexPage = ({ filenames, title }: DocIndexPageProps) => (
  <CustomPage mainHeading={title}>
    {filenames.length ? (
      <ul>
        {filenames.map((file: string, index: number) => {
          const prettyName = file.replace(".md", "");
          return (
            <li className={`my-6 text-2xl`} key={index}>
              <Link href={`/game-manual/${prettyName}`}>
                {prettyName.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    ) : (
      <p>Docs not found.</p>
    )}
  </CustomPage>
);
