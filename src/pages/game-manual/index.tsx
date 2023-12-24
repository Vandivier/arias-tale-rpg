import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";

import { api } from "~/utils/api";

export default function GameManualPage() {
  return (
    <CustomPage mainHeading="Game Manual">
      <ul>
        <li>TODO</li>
      </ul>
    </CustomPage>
  );
}
