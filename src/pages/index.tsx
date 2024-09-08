import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from Aria's Tale!" });

  return (
    <CustomPage
      mainHeading={
        <h1 className="font-extrabold tracking-tight text-white sm:text-[2rem]">
          Embark on an Epic Journey with Aria's Tale!
        </h1>
      }
    >
      <>
        <div className="flex items-center">
          <style jsx>{`
            .dice-logo-wrapper {
              cursor: pointer;
              display: inline-block;
              transition: transform 0.3s ease;
            }

            .dice-logo-wrapper:hover {
              transform: rotate(360deg);
            }
          `}</style>

          <div className="dice-logo-wrapper mr-2">
            <Image
              alt="Aria's Tale Dice Logo"
              height={50}
              width={50}
              src="/arias-tale-d20-logo.png"
            />
          </div>
          <p>{hello.data ? hello.data.greeting : "Loading..."}</p>
          <div className="dice-logo-wrapper ml-2">
            <Image
              alt="Aria's Tale Dice Logo"
              height={50}
              width={50}
              src="/arias-tale-d20-logo.png"
            />
          </div>
        </div>

        <AuthShowcase />

        <div className="text-l my-4 flex flex-col gap-8 text-white">
          <p>
            Aria's Tale is an emergent narrative world drawing on elements of
            fantasy, science fiction, and isekai.
          </p>
          <p>
            Experience the Aria's Tale universe through{" "}
            <Link className="underline" href="/game-manual/narrative">
              novels
            </Link>
            ,{" "}
            <Link className="underline" href="/game-manual/quick-start">
              games
            </Link>
            ,{" "}
            <Link className="underline" href="/gallery">
              art
            </Link>
            , and{" "}
            <Link
              className="underline"
              href="https://www.tiktok.com/@arias.tale.game"
              target="_blank"
            >
              dialogue
            </Link>
            .
          </p>
          <p>
            Aria's Tale is an{" "}
            <Link
              className="underline"
              href="https://github.com/Vandivier/arias-tale-rpg"
              target="_blank"
            >
              open source
            </Link>{" "}
            experiment in gaming, social media, and generative artificial
            intelligence that is maintained by the{" "}
            <Link
              className="underline"
              href="https://www.ladderly.io/"
              target="_blank"
            >
              Ladderly.io
            </Link>{" "}
            community.{" "}
          </p>
          <p>
            <Link
              className="underline"
              href="https://www.ladderly.io/blog/2023-12-25-arias-tale"
              target="_blank"
            >
              Learn more about Aria's Tale here
            </Link>
            !
          </p>
        </div>
      </>
    </CustomPage>
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
        {sessionData ? "Sign out" : "Sign in or join now!"}
      </button>
    </div>
  );
}
