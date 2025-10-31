import os
import time
from pathlib import Path

from google import genai
from dotenv import load_dotenv
from supabase import create_client, Client

# Rate limit for the embeddings API
API_CALLS_PER_MINUTE = 50
SECONDS_PER_MINUTE = 60
DELAY_BETWEEN_CALLS = SECONDS_PER_MINUTE / API_CALLS_PER_MINUTE
RECORD_LIMIT = 10  # set to 0 to process all documents


def main():
    """
    Generates and updates embeddings for documents in the Supabase table.
    """
    # Load environment variables
    dotenv_path = Path(__file__).parent.parent / ".env"
    load_dotenv(dotenv_path=dotenv_path)

    if not os.environ.get("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY must be set in your .env file.")
        return

    # Initialize the clients
    client = genai.Client()
    supabase_url = os.environ.get("SUPABASE_API_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_API_URL and SUPABASE_SERVICE_ROLE_KEY must be set.")
        return
    supabase: Client = create_client(supabase_url, supabase_key)

    # Fetch documents that need embeddings
    print("Fetching documents without embeddings...")
    response = (
        supabase.table("documents")
        .select("id, content")
        .filter("embedding", "is", "null")
        .execute()
    )

    documents = response.data
    if not documents:
        print("No documents found that need embeddings. All set!")
        return

    print(f"Found {len(documents)} documents to process.")
    documents_to_process = documents[:RECORD_LIMIT] if RECORD_LIMIT else documents
    print(f"Processing {len(documents_to_process)} documents...")
    for doc in documents_to_process:
        doc_id = doc["id"]
        content = doc["content"]

        if not content:
            print(f"Skipping document {doc_id} due to empty content.")
            continue

        try:
            print(f"Generating embedding for document {doc_id}...")
            result = client.models.embed_content(
                model="models/text-embedding-004",
                contents=content,
            )

            # The response contains a list of embeddings. We need the 'values' from the first element.
            embedding = result.embeddings[0].values

            # Update the document in Supabase
            supabase.table("documents").update({"embedding": embedding}).eq(
                "id", doc_id
            ).execute()
            print(f"Successfully updated document {doc_id}.")

        except Exception as e:
            print(f"An error occurred processing document {doc_id}: {e}")

        # Respect the rate limit
        time.sleep(DELAY_BETWEEN_CALLS)


if __name__ == "__main__":
    main()
