import Link from "next/link";
import { CustomPage } from "./CustomPage";

interface DocIndexPageProps {
  filePaths: string[];
  title: string;
}

export const DocIndexPage = ({ filePaths, title }: DocIndexPageProps) => (
  <CustomPage mainHeading={title}>
    {filePaths.length ? (
      <ul>
        {filePaths.map((currFilePath: string, index: number) => {
          const prettyName =
            currFilePath.split("/").pop()?.replace(".md", "") ?? "";

          return (
            <li className={`my-6 text-2xl`} key={index}>
              <Link href={`/game-manual/${currFilePath}`}>
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
