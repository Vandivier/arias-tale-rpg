# this file cleans the source.csv file
# source.csv was derived from Open AI Deep Research
# and includes bad stuff like:
# - `[oaicite:0]{index=0}` citation markers
# - grammatical quotes


import re
from pathlib import Path


def main():
    """
    Loads source.csv, removes oaicite expressions, and saves to cleaned_source.csv.
    """
    # Use Path to ensure cross-platform compatibility
    current_dir = Path(__file__).parent
    source_path = current_dir / "source.csv"
    output_path = current_dir / "cleaned_source.csv"

    print(f"Loading from: {source_path}")

    # Regex to find patterns like :contentReference[oaicite:0]{index=0}
    oaicite_pattern = re.compile(r":contentReference\[oaicite:\d+\]\{index=\d+\}")

    try:
        with source_path.open("r", encoding="utf-8") as infile:
            content = infile.read()

        cleaned_content = oaicite_pattern.sub("", content)

        with output_path.open("w", encoding="utf-8") as outfile:
            outfile.write(cleaned_content)

        print(f"Successfully cleaned file and saved to: {output_path}")

    except FileNotFoundError:
        print(f"Error: Could not find the source file at {source_path}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    main()

