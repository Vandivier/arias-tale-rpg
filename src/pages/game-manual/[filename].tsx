import fs from "fs";
import matter from "gray-matter";
import type { GetStaticPaths, GetStaticProps } from "next";
import path from "path";
import ReactMarkdown from "react-markdown";
import { CustomPage } from "~/components/CustomPage";

interface DocPageProps {
  content: string;
  title: string;
}

const DocPage: React.FC<DocPageProps> = ({ content, title }) => {
  return (
    <CustomPage mainHeading={title}>
      <ReactMarkdown className="flex max-w-full flex-col gap-4">
        {content}
      </ReactMarkdown>
    </CustomPage>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const docsDirectory = path.join(process.cwd(), "docs");
  const filenames = fs.readdirSync(docsDirectory);

  const paths = filenames.map((filename) => ({
    params: { filename: filename.replace(".md", "") },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const filename = context.params?.filename;

  if (!filename) {
    return { notFound: true };
  }

  const markdownFileName = `${
    Array.isArray(filename) ? filename.join("") : filename
  }.md`;
  const markdownFile = path.join(process.cwd(), "docs", markdownFileName);
  const fileContents = fs.readFileSync(markdownFile, "utf8");
  const { content, data } = matter(fileContents);

  return {
    props: {
      content,
      title: (typeof data.title === "string" && data.title) || "No Title",
    },
  };
};

export default DocPage;
