import fs from "fs";
import path from "path";
import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";

interface GameManualPageProps {
  docFiles: string[];
}

export default function GameManualPage({ docFiles }: GameManualPageProps) {
  return (
    <CustomPage mainHeading="Game Manual">
      {docFiles.length ? (
        <ul>
          {docFiles.map((file: string, index: number) => {
            const prettyName = file.replace(".md", "");
            return (
              <li key={index}>
                <Link href={`/game-manual/${prettyName}`}>{prettyName}</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Docs not found.</p>
      )}
    </CustomPage>
  );
}

export async function getStaticProps() {
  const docsDirectory = path.join(process.cwd(), "docs");
  const filenames = fs.readdirSync(docsDirectory);

  return {
    props: {
      docFiles: filenames,
    },
  };
}
