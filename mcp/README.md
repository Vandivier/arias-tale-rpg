# Arias Tale MCP Server

MCP server for local AI-assisted tabletop roleplay in the Aria's Tale fantasy universe.

## Requirements

This project `requires-python = ">=3.11,<4.0"`

## Installation

Install and run using [uv](https://docs.astral.sh/uv/getting-started/installation/):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv
source .venv/bin/activate
# or, `source .venv/Scripts/activate` on Windows
uv pip install -e .
```

## Configuration

Copy the environment variable file and populate as needed:

```bash
cp .env.example .env
```

## Running the MCP Server

Run the MCP server:

```bash
python src/server.py
```

Or using uv:

```bash
uv run python src/server.py
```

## MCP Tools

The server provides the following tools for tabletop roleplay:

### 1. Launch New Campaign
Creates a new campaign with specified setting and difficulty.

### 2. Character Generation
Generates a new character with randomized ability scores, hit points, and class.

### 3. Random Encounters and Events
Generates random encounters (combat, social, exploration, puzzle) appropriate for the campaign difficulty.

### 4. Die Rolling
Rolls dice for ability checks, attacks, and other game mechanics. Supports various die types (d4, d6, d8, d10, d12, d20, d100) and modifiers.

## Testing

Run unit tests:

```bash
uv run pytest tests/
```

## Integration with MCP Clients

This server follows the Model Context Protocol (MCP) specification and can be used with MCP-compatible clients like:

- Cursor
- Claude Desktop
- Other MCP clients

Configure the client to point to this server's executable or use stdio transport.

