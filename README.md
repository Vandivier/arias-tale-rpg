# arias-tale-rpg

an emergent narrative universe created and communicated over multiple modalities with a focus on generative ai and community

see this [Aria's Tale YouTube Playlist](https://www.youtube.com/playlist?list=PL4hsXTgWARMwAaXEEQkGbD6JImaBrCTpM) for some development sessions and play sessions

## Table of Contents

1. Setup, Install, and Run
2. Built With
3. Deployment

## Setup, Install, and Run

1. `cp .env.example .env`
   1. Then, populate your local file appropriately. You will need a postgres db and Discord API credentials
2. `npm i && npm run db:migrate && npm run db:seed`
3. `npm run dev`

## Developer Notes

Aria's Tale is maintained by the [ladderly.io](https://ladderly.io) community. Please join the [ladderly.io Discord](https://discord.gg/fAg6Xa4uxc) for contributor discussion or technical help.

## Built With

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`. The [T3 Stack Discord](https://t3.gg/discord)is a useful place to ask for help.

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

Feedback and contributions are welcome in the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app).

Aria's Tale is also built with the following libraries and their associated official documentation:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [react-markdown](https://remarkjs.github.io/react-markdown/)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

## Deployment

Aria's Tale is deployed over Vercel. You may need to request permission to view a Vercel preview enviroment for your pull requet.

If you are running your own deployment, consult the official T3 Stack deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
