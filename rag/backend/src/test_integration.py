from datetime import date
import pytest
import httpx
import json
import re

# The address of the running Uvicorn server
BASE_URL = "http://localhost:8000"
INVOKE_URL = f"{BASE_URL}/invoke"

# from `create_horse_fact` in `src/utils.py`
HORSE_FACTS_SET = {
    "Horses cannot sleep.",
    "Horses have a unique way of communicating with each other through body language.",
    "The fastest recorded speed of a horse is 55 mph (88.5 km/h).",
}


TEST_CASES = [
    ("what is today's date? use YYYY-MM-DD format", date.today().strftime("%Y-%m-%d")),
    ("how many legs does a horse have?", "HORSE_FACT"),
    ("how many horses exist today?", "HORSE_FACT"),
    (
        "how many lines in a shakespearean sonnet? reply with only an integer answer.",
        "14",
    ),
    ("what python version was released on June 11, 2025?", "3.13.5"),
    ("how many horses exist today?", "HORSE_FACT"),
    ("could you roll 2d20?", "I cannot"),
    ("roll a die", "ROLL_DIE"),
]


@pytest.mark.parametrize("prompt, expected_answer", TEST_CASES)
def test_invoke_endpoint(prompt, expected_answer):
    """
    Sends a prompt to the /invoke endpoint and checks if the response
    contains the expected answer.

    This test requires the Uvicorn server to be running separately.
    """
    print(f"\n--- Testing prompt: '{prompt}' ---")
    try:
        # Use the legacy format for the request
        payload = {"query": prompt}
        headers = {"Content-Type": "application/json"}

        with httpx.Client() as client:
            response = client.post(INVOKE_URL, json=payload, headers=headers)

            # Check if the request was successful
            assert response.status_code == 200

            # Parse and print the JSON response
            response_data = response.json()
            print(f"Server response: {json.dumps(response_data, indent=2)}")

            response_text = response_data["response"].strip()

            # Basic validation on the response
            assert "response" in response_data
            assert isinstance(response_text, str)
            assert len(response_text) > 0

            # If an expected answer is provided, perform validation
            if expected_answer:
                if expected_answer == "HORSE_FACT":
                    print("Checking for membership in HORSE_FACTS_SET")
                    assert response_text in HORSE_FACTS_SET
                elif expected_answer == "ROLL_DIE":
                    print("Checking for a valid die roll (1-6)")
                    roll = None
                    # 1. Try to parse as a raw number
                    try:
                        roll = int(response_text)
                    except ValueError:
                        # 2. If that fails, try regex matching "You rolled a X."
                        match = re.search(
                            r"you rolled a (\d+)\.", response_text, re.IGNORECASE
                        )
                        if match:
                            roll = int(match.group(1))

                    if roll is not None:
                        assert 1 <= roll <= 6
                    else:
                        pytest.fail(
                            f"Expected a die roll between 1 and 6, but got '{response_text}'"
                        )
                else:
                    print(f"Checking for substring: '{expected_answer}'")
                    assert expected_answer.lower() in response_text.lower()

    except httpx.ConnectError:
        pytest.fail(
            f"Connection to {INVOKE_URL} failed. "
            "Please ensure the Uvicorn server is running in the background."
        )
    except Exception as e:
        pytest.fail(f"An unexpected error occurred: {e}")
