/**
 * This file handles the game manual pages.
 * Basically, we recursively map docs/ to the route for the markdown files under docs/
 * We also handle directory listing with DocIndexPage.
 */

import fs from "fs";
import matter from "gray-matter";
import type { GetStaticPaths, GetStaticProps } from "next";
import path from "path";
import { DocContentPage } from "~/components/DocContentPage";
import { DocIndexPage } from "~/components/DocIndexPage";

const GitHubRawRoot =
  "https://raw.githubusercontent.com/Vandivier/arias-tale-rpg/main/docs/";

interface DocPageProps {
  content?: string;
  filePaths?: string[];
  rawMarkdownUrl?: string;
  title: string;
}

const DocPage: React.FC<DocPageProps> = ({
  content,
  filePaths,
  rawMarkdownUrl,
  title,
}) =>
  filePaths ? (
    <DocIndexPage filePaths={filePaths} title={title} />
  ) : (
    <DocContentPage
      content={content ?? ""}
      rawMarkdownUrl={rawMarkdownUrl}
      title={title}
    />
  );

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : [res];
    }),
  );

  const flattened: string[] = [];
  files.forEach((file) => {
    if (Array.isArray(file)) {
      flattened.push(...file);
    } else {
      flattened.push(file);
    }
  });

  return flattened;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const docsDirectory = path.join(process.cwd(), "docs");
  const files = await getFiles(docsDirectory);

  const paths = files.map((filePath) => {
    const relativePath = path.relative(docsDirectory, filePath);
    const isDir = fs.statSync(filePath).isDirectory();

    // remove markdown extension if it's a file
    const pathParts = relativePath.split(path.sep);
    if (!isDir) {
      const lastPart = pathParts[pathParts.length - 1];

      if (!lastPart) {
        throw new Error("lastPart of file path is unexpectedly undefined");
      }

      pathParts[pathParts.length - 1] = lastPart.replace(/\.md$/, "");
    }

    return {
      params: { filename: pathParts },
    };
  });

  // include directory paths
  const dirPaths = fs
    .readdirSync(docsDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({
      params: { filename: [dirent.name] },
    }));

  paths.push({
    params: { filename: [""] },
  });

  return { paths: paths.concat(dirPaths), fallback: false };
};

async function isDirectory(path: string) {
  try {
    const stat = await fs.promises.stat(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const filename = context.params?.filename ?? [];
  const filePath = path.join(process.cwd(), "docs", ...filename);

  if (await isDirectory(filePath)) {
    const fileNameWithExtension = await fs.promises.readdir(filePath);
    const filePaths = fileNameWithExtension.map((file) =>
      path.join(...filename, file).replace(/\.md$/, ""),
    );

    return {
      props: {
        filePaths,
        title: "Game Manual",
      },
    };
  }

  const markdownFileName = `${
    Array.isArray(filename) ? filename.join("/") : filename
  }.md`;
  const markdownFile = path.join(process.cwd(), "docs", markdownFileName);
  const fileContents = fs.readFileSync(markdownFile, "utf8");
  const { content, data } = matter(fileContents);

  // strip markdown comments
  const removeMarkdownComments = (text: string) => {
    return text.replace(/<!--[\s\S]*?-->/g, "");
  };

  const cleanedContent = removeMarkdownComments(content);

  return {
    props: {
      content: cleanedContent,
      rawMarkdownUrl: `${GitHubRawRoot}${markdownFileName}`,
      title: (typeof data.title === "string" && data.title) || "No Title",
    },
  };
};

export default DocPage;
