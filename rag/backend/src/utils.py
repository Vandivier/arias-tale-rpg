import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from supabase import create_client, Client

# --- RAG Tool Configuration ---
MATCH_THRESHOLD = 0.75
MAX_RESULTS = 5


def arias_tale_rag_tool(query: str) -> str:
    """
    Searches the Aria's Tale lore database to find information
    relevant to the user's query.
    """
    # Load environment variables
    dotenv_path = Path(__file__).parent.parent / ".env"
    load_dotenv(dotenv_path=dotenv_path)

    # Initialize clients
    if not os.environ.get("GOOGLE_API_KEY"):
        return "Error: GOOGLE_API_KEY is not set."
    client = genai.Client()

    supabase_url = os.environ.get("SUPABASE_API_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        return "Error: Supabase credentials are not set."
    supabase: Client = create_client(supabase_url, supabase_key)

    try:
        # 1. Generate an embedding for the user's query
        query_embedding_response = client.models.embed_content(
            model="models/text-embedding-004", contents=query
        )
        # The response contains a list of embeddings. We need the 'values' from the first element.
        query_embedding = query_embedding_response.embeddings[0].values

        # 2. Call the database function to find matching documents
        response = supabase.rpc(
            "match_documents",
            {
                "query_embedding": query_embedding,
                "match_threshold": MATCH_THRESHOLD,
            },
        ).execute()

        # 3. Format and return the results
        results = response.data
        if not results:
            return "No relevant information found in the Aria's Tale lore database."

        # Limit the results and format them
        formatted_results = []
        for i, result in enumerate(results[:MAX_RESULTS]):
            formatted_results.append(f"Source {i+1}: {result['content']}")

        return "\\n".join(formatted_results)

    except Exception as e:
        return f"An error occurred while searching the lore database: {e}"


def roll_a_dice() -> int:
    """
    Simulate rolling a six-sided dice.
    """
    import random

    return random.randint(1, 6)
