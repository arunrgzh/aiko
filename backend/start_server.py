#!/usr/bin/env python3
"""
Simple startup script for AI-Komek FastAPI application

Run this script to start the development server:
python start_server.py

Or use uvicorn directly:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    ) 