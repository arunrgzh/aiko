#!/usr/bin/env python3
"""
AI-Komek FastAPI Application Runner

This script runs the FastAPI application using uvicorn with proper configuration.
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"],
        log_level="info"
    ) 