import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { CustomPage } from "~/components/CustomPage";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from Aria's Tale!" });

  return (
    <CustomPage mainHeading="Embark on an Epic Journey with Aria's Tale!">
      <>
        <div className="flex items-center">
          <Image
            alt="Aria's Tale Dice Logo"
            className="dice-logo mr-2"
            height={50}
            width={50}
            src="/arias-tale-d20-logo.png"
          />
          <p>{hello.data ? hello.data.greeting : "Loading..."}</p>
          <Image
            alt="Aria's Tale Dice Logo"
            className="dice-logo ml-2"
            height={50}
            width={50}
            src="/arias-tale-d20-logo.png"
          />
        </div>

        <AuthShowcase />

        <div className="text-l my-4 flex flex-col gap-8 text-white">
          <p>Join our vibrant community of adventurers and shape the story!</p>
          <p>
            Read the living narrative of Aria's Tale{" "}
            <a
              className="underline"
              href="https://www.ariastale.com/game-manual/narrative"
            >
              here
            </a>
            , get started playing now with the{" "}
            <a
              className="underline"
              href="https://www.ariastale.com/game-manual/quick-start"
            >
              Quick Start Guide
            </a>
            , or dive into the technical details with the{" "}
            <a
              className="underline"
              href="https://www.ariastale.com/game-manual/metagame"
            >
              Game Manual
            </a>
            .
          </p>
          <p>
            This website is in development. In the future, you will be able to
            play Aria's Tale through this website. For now, Aria's Tale is
            played over social media and during periodic streams, as mentioned
            in the{" "}
            <a
              className="underline"
              href="https://www.ariastale.com/game-manual/quick-start"
            >
              Quick Start Guide
            </a>
            .
          </p>
          <p>
            Join the waitlist to be notified when the game is ready to play
            through this site, and to indicate whether you are interested in
            joining a live stream!
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
