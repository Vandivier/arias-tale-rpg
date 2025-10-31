# mypy: disable - error - code = "no-untyped-def,misc"
import pathlib
from fastapi import FastAPI, Response, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from agent import root_agent
import json
from contextlib import asynccontextmanager

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

# --- ADK Setup ---
# This follows the modern programmatic pattern for running an ADK agent.
APP_NAME = "adk-quickstart-app"
USER_ID = "default_user"
SESSION_ID = "default_session"

# 1. Set up session management
session_service = InMemorySessionService()

# 2. Create a Runner for the agent
runner = Runner(agent=root_agent, app_name=APP_NAME, session_service=session_service)
# --- End ADK Setup ---


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create the default session on startup
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )
    yield
    # No cleanup needed for in-memory session service


# Define the FastAPI app
app = FastAPI(lifespan=lifespan)


# Add CORS middleware for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],  # Frontend dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/invoke")
async def invoke(request: Request):
    """
    Invokes the agent with a user query. Supports both legacy format and AI SDK format.

    Args:
        request: The request object, containing the user query in the body.

    Returns:
        The agent's response (JSON for legacy, streaming for AI SDK).
    """
    body = await request.json()
    print(f"DEBUG: Received body: {json.dumps(body, indent=2)}")

    # Check if this is an AI SDK request (has 'messages' field)
    if "messages" in body:
        # AI SDK format - extract latest user message
        messages = body.get("messages", [])
        print(f"DEBUG: Messages array: {messages}")
        user_message = ""
        for message in reversed(messages):
            if message.get("role") == "user":
                user_message = message.get("content", "")
                print(f"DEBUG: Found user message: '{user_message}'")
                break

        if not user_message:
            # No user message found, return error
            def generate_error_stream():
                yield '0:"No user message found in request"\n'
                yield 'd:{"finishReason":"stop"}\n'

            return StreamingResponse(
                generate_error_stream(),
                media_type="text/plain",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "x-vercel-ai-data-stream": "v1",
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            )

        # Stream the agent response in AI SDK data stream format
        async def generate_data_stream():
            try:
                user_content = types.Content(
                    role="user", parts=[types.Part(text=user_message)]
                )
                response_text = ""
                async for event in runner.run_async(
                    user_id=USER_ID, session_id=SESSION_ID, new_message=user_content
                ):
                    if event.is_final_response() and event.content:
                        response_text = event.content.parts[0].text

                print(f"DEBUG: Response text: {response_text}")

                # Stream the response word by word for a nice typing effect
                words = response_text.split()
                if not words:
                    # Handle empty response
                    yield 'd:{"finishReason":"stop"}\n'
                    return

                for word in words:
                    # Text parts format: 0:"content"\n
                    yield f'0:"{word} "\n'

                # Finish message part
                yield 'd:{"finishReason":"stop"}\n'

            except Exception as e:
                print(f"ERROR: Agent invocation failed: {e}")
                # Stream error message
                yield f'0:"Sorry, I encountered an error while processing your request: {str(e)}"\n'
                yield 'd:{"finishReason":"stop"}\n'

        return StreamingResponse(
            generate_data_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "x-vercel-ai-data-stream": "v1",  # Required for AI SDK data stream
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "*",
            },
        )
    else:
        # Legacy format - direct query
        query = body.get("query")

        if not query:
            return Response(
                content=json.dumps({"error": "No query provided"}),
                media_type="application/json",
                status_code=400,
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            )

        try:
            user_content = types.Content(role="user", parts=[types.Part(text=query)])
            response_text = ""

            async for event in runner.run_async(
                user_id=USER_ID, session_id=SESSION_ID, new_message=user_content
            ):
                if event.is_final_response() and event.content:
                    response_text = event.content.parts[0].text

            print(f"DEBUG: Final response text: {response_text}")

            return Response(
                content=json.dumps({"response": response_text}),
                media_type="application/json",
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            )
        except Exception as e:
            print(f"ERROR: Agent invocation failed: {e}")
            return Response(
                content=json.dumps({"error": f"Agent invocation failed: {str(e)}"}),
                media_type="application/json",
                status_code=500,
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            )


@app.options("/invoke")
async def invoke_options():
    """Handle preflight CORS requests for /invoke endpoint."""
    return Response(
        content="",
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    )


def create_frontend_router(build_dir="../frontend/dist"):
    """Creates a router to serve the React frontend.

    Args:
        build_dir: Path to the React build directory relative to this file.

    Returns:
        A Starlette application serving the frontend.
    """
    build_path = pathlib.Path(__file__).parent.parent.parent / build_dir

    if not build_path.is_dir() or not (build_path / "index.html").is_file():
        print(
            f"WARN: Frontend build directory not found or incomplete at {build_path}. Serving frontend will likely fail."
        )
        # Return a dummy router if build isn't ready
        from starlette.routing import Route

        async def dummy_frontend(request):
            return Response(
                "Frontend not built. Run 'npm run build' in the frontend directory.",
                media_type="text/plain",
                status_code=503,
            )

        return Route("/{path:path}", endpoint=dummy_frontend)

    return StaticFiles(directory=build_path, html=True)


# Mount the frontend under /app to not conflict with the LangGraph API routes
app.mount(
    "/app",
    create_frontend_router(),
    name="frontend",
)
