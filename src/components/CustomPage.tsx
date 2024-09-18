import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import TopNav from "~/components/TopNav";

interface CustomPageProps {
  children: React.ReactNode;
  contentBeforeTitle?: React.ReactNode;
  innerPageClassName?: string;
  mainHeading: string | React.ReactNode;
  metaDescription?: string;
  title?: string;
}

export const CustomPage = ({
  children,
  contentBeforeTitle,
  innerPageClassName = "container m-auto my-4 flex w-full flex-col items-center gap-6 px-8 py-2 md:w-2/3 md:py-8",
  mainHeading,
  metaDescription = `A Tech-Forward Emergent AI-Assisted TRPG Game and Community!`,
  title = `Aria's Tale`,
}: CustomPageProps) => {
  const [theme, setTheme] = useState("purple");
  const toggleTheme = () => {
    const newTheme = theme === "purple" ? "black-map" : "purple";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") ?? "purple";
    setTheme(savedTheme);
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <style jsx>
        {`
          .background-world-map {
            background-image: url("/searchable-images/maps/map-world-evergreen.jpg");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
            z-index: 1;
          }

          .background-world-map::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              to bottom left,
              rgba(112, 66, 20, 5%),
              black,
              black,
              black
            );
            z-index: -1;
          }
        `}
      </style>

      <main
        className={`${
          theme === "black-map" ? "background-world-map" : ""
        } flex min-h-screen flex-col items-center bg-gradient-to-b from-custom-primary to-custom-primary-dark`}
      >
        <TopNav theme={theme} toggleTheme={toggleTheme} />

        {contentBeforeTitle && contentBeforeTitle}

        <div className={innerPageClassName}>
          {typeof mainHeading === "string" ? (
            <h1 className="text-center text-xl font-extrabold tracking-tight text-white sm:text-[4rem] md:leading-[4rem]">
              {mainHeading}
            </h1>
          ) : (
            mainHeading
          )}

          <div className="text-l flex max-w-full flex-col items-center gap-2 text-white md:text-xl">
            {children}
          </div>
        </div>
      </main>
      <footer className="text-md flex items-center justify-center gap-4 px-8 py-4 text-custom-primary">
        <Link
          href="https://github.com/Vandivier/arias-tale-rpg"
          target="_blank"
        >
          GitHub
        </Link>
        {" | "}
        <Link href="https://ladderly.io" target="_blank">
          Ladderly.io
        </Link>
        {" | "}
        <Link href="https://ariastale.com/privacy-policy" target="_blank">
          Privacy Policy
        </Link>
      </footer>
    </>
  );
};
