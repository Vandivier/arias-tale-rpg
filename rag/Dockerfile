# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Python Backend
FROM python:3.11-slim

# -- Install UV --
# First install curl, then install UV using the standalone installer
RUN apt-get update && apt-get install -y curl && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ENV PATH="/root/.local/bin:$PATH"
# -- End of UV installation --

# -- Copy built frontend from builder stage --
# The app.py expects the frontend build to be at ../frontend/dist relative to its own location.
# If app.py is at /deps/backend/src/agent/app.py, then ../frontend/dist resolves to /deps/frontend/dist.
COPY --from=frontend-builder /app/frontend/dist /deps/frontend/dist
# -- End of copying built frontend --

# -- Adding local package . --
ADD backend/ /deps/backend
# -- End of local package . --

# -- Installing all local dependencies using UV --
RUN cd /deps/backend && \
    PYTHONDONTWRITEBYTECODE=1 UV_SYSTEM_PYTHON=1 uv pip install --system -e . uvicorn
# -- End of local dependencies install --

WORKDIR /deps/backend

EXPOSE 8000

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]