# arias-tale-rag/database

to setup this project, node version 20+ is required

you will also need Docker running

this project uses [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started). You can install it or invoke it through npx in the current `database/` directory:

```bash
npx supabase start
```

When database startup completes, you should see a log which says `Started supabase local development setup.`

The terminal will print several interesting values like `API URL`. Run:

```bash
cp .env.example .env
```

and copy the values output by Supabase into `.env` appropriately.

These variables all get a `SUPABSE_` prefix, so the value printed as `API URL` is saved as `SUPABASE_API_URL`.

Now apply database migrations by resetting the database:

```bash
npx supabase db reset
```

You can now review `backend/README.md` which describes further back end setup including how to load data into the database.
