#!/usr/bin/env python3
"""Custom server that properly handles CORS while using Google ADK agent."""

import sys
import os

# Add the current directory to Python path for imports
sys.path.append(os.path.dirname(__file__))

import uvicorn
from app import app

if __name__ == "__main__":
    uvicorn.run("agent.app:app", host="0.0.0.0", port=8000, reload=True)
