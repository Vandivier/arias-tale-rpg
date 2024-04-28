import { signIn, useSession } from "next-auth/react";
import { CustomPage } from "~/components/CustomPage";
import { SubheadingWithDice } from "~/components/SubheadingWithDice";

export default function StorePage() {
  const { data: sessionData } = useSession();

  return (
    <CustomPage mainHeading="Aria's Tale Store">
      <>
        <SubheadingWithDice subheading={`Purchase Aria's Tale TCG Cards`} />
        {sessionData ? (
          <p>nice job being logged in bro</p>
        ) : (
          <AuthButtonIfNeeded />
        )}
      </>
    </CustomPage>
  );
}

const AuthButtonIfNeeded = () => (
  <button
    className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
    onClick={() => void signIn()}
  >
    Sign in or join now to make a purchase!
  </button>
);
