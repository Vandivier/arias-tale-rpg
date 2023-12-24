import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>Aria's Tale | Game Manual</title>
        <meta
          name="description"
          content="A Tech-Forward Emergent AI-Assisted TRPG Game and Community!"
        />
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

      <main className="from-custom-primary to-custom-primary-dark flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            Game Manual
          </h1>
          <div className="flex flex-col items-center gap-2 text-2xl text-white">
            <div className="flex items-center">
              <img
                src="/arias-tale-d20-logo.png"
                alt="Aria's Tale Dice Logo"
                className="dice-logo mr-2"
              />

              <img
                src="/arias-tale-d20-logo.png"
                alt="Aria's Tale Dice Logo"
                className="dice-logo ml-2"
              />
            </div>

            <ul>
              <li>TODO: each markdown file title</li>
            </ul>
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
}
