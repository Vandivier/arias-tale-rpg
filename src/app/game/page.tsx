// src/app/game/page.tsx
"use client";

import CheckoutButton from "~/components/CheckoutButton";
import { useSession, signIn, signOut } from "next-auth/react";
import { api } from "~/utils/api";

export default function Game() {
  const { data: session } = useSession();
  const helloQuery = api.post.hello.useQuery({ text: "Gamer" });

  return (
    <main>
      <h1>Phaser Gacha Game with Payments</h1>
      <p>{helloQuery.data ? helloQuery.data.greeting : "Loading..."}</p>
      {session ? (
        <>
          <p>Welcome, {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
          <CheckoutButton amount={199} quantity={1} type="one-off" />
          <CheckoutButton amount={1499} quantity={10} type="one-off" />
          <CheckoutButton amount={999} quantity={1} type="subscription" />
        </>
      ) : (
        <>
          <p>You are not signed in.</p>
          <button onClick={() => signIn()}>Sign In</button>
        </>
      )}
    </main>
  );
}
