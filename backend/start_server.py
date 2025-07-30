#!/usr/bin/env python3
"""
Startup script for AI-Komekshi Backend Server
This script properly handles imports and starts the FastAPI application
"""

import sys
import os
import uvicorn

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

def main():
    """Start the FastAPI server"""
    print("🚀 Starting AI-Komekshi Backend Server...")
    print("📍 https://ai-komekshi.site/api")
    print("📖 API Docs: https://ai-komekshi.site/api/docs")
    print("🔄 Auto-reload enabled for development")
    print("-" * 50)
    
    # Start the server using uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"],
        log_level="info"
    )

if __name__ == "__main__":
    main() 