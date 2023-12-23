import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from Aria's Tale!" });

  return (
    <>
      <Head>
        <title>Aria's Tale</title>
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

      <main className="from-custom-primary to-custom-primary-dark flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            Embark on an Epic Journey with Aria's Tale!
          </h1>
          <div className="flex flex-col items-center gap-2 text-2xl text-white">
            <div className="flex items-center">
              <img
                src="/arias-tale-d20-logo.png"
                alt="Aria's Tale Dice Logo"
                className="dice-logo mr-2"
              />
              <p>{hello.data ? hello.data.greeting : "Loading..."}</p>
              <img
                src="/arias-tale-d20-logo.png"
                alt="Aria's Tale Dice Logo"
                className="dice-logo ml-2"
              />
            </div>

            <AuthShowcase />

            <div className="my-4 flex max-w-[300px] flex-col gap-8 text-2xl text-white">
              <p>
                Join our vibrant community of adventurers and shape the story.
                Your quest begins here!
              </p>
              <p>
                This Official Aria's Tale Site is in Early Alpha. Sign up now to
                join the waiting list! A limitted number of waitlist signups
                will get free prizes!
              </p>
              <p>
                Aria's Tale is Open Source and maintained by{" "}
                <Link
                  className="underline"
                  target="_blank"
                  href="https://ladderly.io/"
                >
                  ladderly.io
                </Link>
                ! Consider supporting the maintainers with a tip.
              </p>
              <p>
                You can also check out some of the early YouTube gaming videos
                and streams{" "}
                <Link
                  className="underline"
                  target="_blank"
                  href="https://www.youtube.com/watch?v=7e-mB8pYoQs"
                >
                  here on YouTube
                </Link>
                !
              </p>
            </div>
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

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in or join now with Discord!"}
      </button>
    </div>
  );
}
