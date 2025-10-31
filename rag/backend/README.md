# google-adk backend

this backend `requires-python = ">=3.11,<4.0"`

first, spin up the local supabase postgres database in database/

Once the pg docker container is setup succesfully, you will be able to get the needed environment variables for python communication to the database instance.

Next, copy the backend/ environment variable file and populate appropriately:

```bash
cp .env.example .env
```

then, install and run the app using [uv](https://docs.astral.sh/uv/getting-started/installation/):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv
source .venv/bin/activate
# or, `source .venv/Scripts/activate` on Windows
uv pip install -r pyproject.toml
```

now you can load the csv data into the pg database and compile vector embeddings:

```bash
python scripts/ingest_data.py
python scripts/create_embeddings.py
```

now you can run the app via the adk cli

```bash
adk web
```

In the Agent Development Kit playground, select the `src/` directory in the dropdown to activate `arias_tale_rag_agent`

## unit testing

```bash
uv run pytest src/test_unit.py
```

## eval and integration testing

We estimate accuracy as the percentage of passed test cases in src/integration_tests.py

Run the server with Docker as mentioned in the top-level README.md:

```bash
docker build -t arias-tale-rag .
docker run -p 8000:8000 arias-tale-rag
```

Now you can validate that the server is running properly with a curl command:

```bash
curl -X POST http://localhost:8000/invoke \
-H "Content-Type: application/json" \
-d '{"query": "Hello, what can you do?"}'
```

Once the server is working properly, run the integration test:

```bash
uv run pytest src/test_integration.py
```
