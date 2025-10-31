import pytest
import asyncio
from types import SimpleNamespace
from src.utils import create_horse_fact, roll_a_dice
from src.agent import root_agent
import httpx
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner


def make_runner(agent):
    session_service = InMemorySessionService()
    asyncio.run(
        session_service.create_session(
            app_name="test-app", user_id="user", session_id="sess"
        )
    )
    return Runner(agent=agent, app_name="test-app", session_service=session_service)


# Helper to collect async generator results synchronously
def collect(gen):
    return asyncio.run(_collect(gen))


async def _collect(gen):
    items = []
    async for item in gen:
        items.append(item)
    return items


class DummyEvent:
    def __init__(self, content):
        # Simulate an event with .content.parts[0].text
        self.content = SimpleNamespace(parts=[SimpleNamespace(text=content)])


class DummyCtx:
    def __init__(self, text):
        self.content = text
        self.parts = [SimpleNamespace(text=text)]
        self.user_id = "user"
        self.session_id = "sess"

    def model_copy(self, update=None):
        return self

    def __str__(self):
        return self.content


# Tests for utility tools
def test_create_horse_fact():
    fact = create_horse_fact()
    assert fact in [
        "Horses cannot sleep.",
        "Horses have a unique way of communicating with each other through body language.",
        "The fastest recorded speed of a horse is 55 mph (88.5 km/h).",
    ]


def test_roll_a_dice():
    for _ in range(10):
        val = roll_a_dice()
        assert isinstance(val, int)
        assert 1 <= val <= 6


def test_root_agent_has_tools():
    tools = root_agent.tools
    from src.utils import create_horse_fact, roll_a_dice

    assert create_horse_fact in tools
    assert roll_a_dice in tools


# Integration tests invoking the real API (skip on network/quota errors)
@pytest.mark.parametrize(
    "prompt,validate_fn",
    [
        (
            "Tell me something about horses.",
            lambda t: t
            in [
                "Horses cannot sleep.",
                "Horses have a unique way of communicating with each other through body language.",
                "The fastest recorded speed of a horse is 55 mph (88.5 km/h).",
            ],
        ),
        ("Roll a dice for me.", lambda t: any(c.isdigit() for c in t)),
    ],
)
def test_api_integration_custom(prompt, validate_fn):
    """
    This test exercises the root_agent with API calls.
    It will be skipped if a network/connect error or quota exceeded occurs.
    """
    from google.genai.errors import ClientError

    try:
        runner = make_runner(root_agent)
        from google.genai import types

        content = types.Content(role="user", parts=[types.Part(text=prompt)])
        events = collect(
            runner.run_async(user_id="user", session_id="sess", new_message=content)
        )
        # Extract text parts
        texts = [
            part.text
            for ev in events
            for part in ev.content.parts
            if hasattr(part, "text")
        ]
        assert texts, "No text returned from API integration test"
        answer = texts[-1].strip()
        assert validate_fn(
            answer
        ), f"Validation failed for prompt '{prompt}', got '{answer}'"
    except (ClientError, httpx.ConnectError) as e:
        pytest.skip(f"Integration test skipped due to network/quota error: {e}")
