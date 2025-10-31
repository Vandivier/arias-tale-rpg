# arias-tale-rag

a simple rag acting as an encyclopedia for [Aria's Tale](https://www.ariastale.com/)

## usage

First, set up the database as described in `database/README.md`
Second, set up the back end as described in `backend/README.md`, then, in this top-level folder:

Now you can optionally:

1. Interact with the agent via `adk web` as described in `backend/README.md`
2. Install and run the front end dev server as described in `frontend/README.md`
    1. This vite dev server UI should be located at: <http://localhost:5173/app/>
3. Build and run the app in full stack production mode with a static UI build as described below

## full stack build

In this directory, run:

```bash
docker build -t arias-tale-rag .
docker run -p 8000:8000 arias-tale-rag
```

The static UI should be visible at <http://localhost:8000/app/> or <http://0.0.0.0:8000/app/>

## troubleshooting

If you are accessing the UI through Docker, you might need to clear your browser cache to view updates.
