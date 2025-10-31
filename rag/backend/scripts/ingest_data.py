import csv
import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client


def main():
    """
    Reads data from cleaned_source.csv and ingests it into the Supabase 'documents' table.
    """
    # Load environment variables from a .env file at the project root
    dotenv_path = Path(__file__).parent.parent / ".env"
    load_dotenv(dotenv_path=dotenv_path)

    # Get Supabase credentials from environment
    supabase_url = os.environ.get("SUPABASE_API_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print(
            "Error: SUPABASE_API_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env file."
        )
        print(f"Attempted to load .env from: {dotenv_path.resolve()}")
        return

    # Initialize Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)
    print(f"Successfully connected to Supabase at {supabase_url}")

    # Define paths
    current_dir = Path(__file__).parent
    source_csv_path = current_dir / "cleaned_source.csv"

    # Read and ingest data
    try:
        with source_csv_path.open("r", encoding="utf-8") as infile:
            reader = csv.DictReader(infile)
            documents_to_insert = []
            for row in reader:
                documents_to_insert.append(
                    {
                        "kind": row["asset_kind"],
                        "name": row["value"],
                        "content": row["notes"],
                    }
                )

            if documents_to_insert:
                print(f"Ingesting {len(documents_to_insert)} documents...")
                data, error = (
                    supabase.table("documents").insert(documents_to_insert).execute()
                )

                # The 'execute' method returns a tuple (data, error)
                if error and error[1]:
                    print(f"Error ingesting data: {error[1]}")
                else:
                    print("Data ingested successfully!")
            else:
                print("No documents to ingest.")

    except FileNotFoundError:
        print(f"Error: Could not find the source file at {source_csv_path}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    main()
