import ReactMarkdown from "react-markdown";
import { CustomPage } from "./CustomPage";

interface CodeProps {
  node: React.ReactNode;
  inline: boolean;
  className?: string;
  children: React.ReactNode;
}

interface DocContentPageProps {
  content: string;
  title: string;
}

export const DocContentPage = ({ title, content }: DocContentPageProps) => {
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
        <ol className={`flex flex-col ${className}`} {...props}>
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
  };

  return (
    <CustomPage mainHeading={title}>
      <ReactMarkdown
        className="flex max-w-full flex-col gap-4 whitespace-pre-wrap"
        components={components}
      >
        {content}
      </ReactMarkdown>
    </CustomPage>
  );
};
