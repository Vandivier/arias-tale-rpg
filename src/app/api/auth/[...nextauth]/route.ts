import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

export const { GET, POST } = NextAuth(authOptions);
