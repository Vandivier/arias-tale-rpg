import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CustomPage } from "./CustomPage";
import Link from "next/link";

interface CodeProps {
  node: React.ReactNode;
  inline: boolean;
  className?: string;
  children: React.ReactNode;
}

interface DocContentPageProps {
  content: string;
  rawMarkdownUrl?: string;
  title: string;
}

export const DocContentPage = ({
  content,
  rawMarkdownUrl,
  title,
}: DocContentPageProps) => {
  const [copyMessage, setCopyMessage] = useState<string>("");

  const handleCopyToClipboard = () => {
    if (content) {
      navigator.clipboard.writeText(content).then(
        () => {
          setCopyMessage("Copied!");
          setTimeout(() => setCopyMessage(""), 2000);
        },
        (err) => {
          setCopyMessage("Failed to copy!");
          setTimeout(() => setCopyMessage(""), 2000);
          console.error("Failed to copy!", err);
        },
      );
    } else {
      setCopyMessage("Failed to copy!");
      setTimeout(() => setCopyMessage(""), 2000);
    }
  };

  const components: Record<string, React.ElementType> = {
    code({ className, children, ...props }: CodeProps) {
      return (
        <code className={`whitespace-pre-wrap ${className}`} {...props}>
          {children}
        </code>
      );
    },
    ol({ className, children, ...props }: CodeProps) {
      return (
        <ol
          className={`flex list-decimal flex-col pl-6 ${className}`}
          {...props}
        >
          {children}
        </ol>
      );
    },
    ul({ className, children, ...props }: CodeProps) {
      return (
        <ol className={`flex list-disc flex-col pl-6 ${className}`} {...props}>
          {children}
        </ol>
      );
    },
    a({ className, children, ...props }) {
      return (
        <a className={`underline ${className}`} {...props}>
          {children}
        </a>
      );
    },
    h1: ({ ...props }) => <h1 className="text-3xl font-bold" {...props} />,
    h2: ({ ...props }) => <h2 className="text-2xl font-bold" {...props} />,
    h3: ({ ...props }) => <h3 className="text-xl font-bold" {...props} />,
    h4: ({ ...props }) => <h4 className="text-lg font-bold" {...props} />,
  };

  return (
    <CustomPage
      mainHeading={title}
      contentBeforeTitle={
        rawMarkdownUrl && (
          <div className="flex w-full flex-col items-center justify-center bg-white align-middle">
            <button
              className="ml-4 cursor-pointer p-2"
              onClick={handleCopyToClipboard}
            >
              Copy Content to Clipboard
            </button>
            {copyMessage && (
              <div
                className={`ml-2 ${
                  copyMessage === "Copied!" ? "text-green-500" : "text-red-500"
                }`}
                style={{ alignSelf: "center" }}
              >
                {copyMessage}
              </div>
            )}
            <Link
              className="p-2"
              href={rawMarkdownUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Raw Markdown
            </Link>
          </div>
        )
      }
    >
      <ReactMarkdown
        className="flex max-w-full flex-col gap-4 whitespace-pre-wrap"
        components={components}
      >
        {content}
      </ReactMarkdown>
    </CustomPage>
  );
};
