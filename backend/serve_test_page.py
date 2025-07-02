#!/usr/bin/env python3
"""
Simple static file server to serve the test HTML page for debugging frontend chat
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

# Create a simple app to serve static files
static_app = FastAPI(title="AI-Komek Test Server")

# Serve the test HTML file
@static_app.get("/test")
async def serve_test_page():
    return FileResponse("test_frontend_chat.html")

@static_app.get("/")
async def root():
    return {"message": "AI-Komek Test Server - Go to /test for chat testing"}

if __name__ == "__main__":
    print("🧪 Starting test server on http://localhost:8001")
    print("📄 Test page: http://localhost:8001/test")
    print("🔗 Main API: http://localhost:8000")
    uvicorn.run(static_app, host="0.0.0.0", port=8001) 