import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import TopNav from "~/components/TopNav";

import { api } from "~/utils/api";

interface CustomPageProps {
  title?: string;
  metaDescription?: string;
  mainHeading: string;
  children: React.ReactNode;
}

export const CustomPage = ({
  title = `Aria's Tale`,
  metaDescription = `A Tech-Forward Emergent AI-Assisted TRPG Game and Community!`,
  mainHeading,
  children,
}: CustomPageProps) => {
  const hello = api.post.hello.useQuery({ text: "from Aria's Tale!" });

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

      <style>
        {`
          .dice-logo {
            cursor: pointer;
            max-width: 60px;
            transition: transform 0.3s ease;
          }

          .dice-logo:hover {
            transform: rotate(360deg);
          }
      `}
      </style>

      <main className="from-custom-primary to-custom-primary-dark flex min-h-screen flex-col items-center bg-gradient-to-b">
        <TopNav />

        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <h1 className="text-3xl font-extrabold leading-[4rem] tracking-tight text-white sm:text-[4rem]">
            {mainHeading}
          </h1>

          <div className="flex flex-col items-center gap-2 text-2xl text-white">
            {children}
          </div>
        </div>
      </main>
      <footer className="text-custom-primary flex items-center justify-center gap-4 py-4 text-2xl">
        <Link
          href="https://github.com/Vandivier/arias-tale-rpg"
          target="_blank"
        >
          GitHub
        </Link>
        {" | "}
        <Link href="https://ladderly.io" target="_blank">
          ladderly.io
        </Link>
      </footer>
    </>
  );
};
