import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from Aria's Tale!" });

  return (
    <CustomPage mainHeading="Embark on an Epic Journey with Aria's Tale!">
      <>
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

        <div className="my-4 flex flex-col gap-8 text-2xl text-white">
          <p>
            Join our vibrant community of adventurers and shape the story. Your
            quest begins here!
          </p>
          <p>
            This site is in Early Alpha. Sign up now to join the waiting list!
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
            You can also check out some of the early YouTube gaming videos and
            streams{" "}
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
        {sessionData ? "Sign out" : "Sign in or join now with Discord!"}
      </button>
    </div>
  );
}
