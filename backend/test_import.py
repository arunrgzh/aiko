#!/usr/bin/env python3

import sys
import traceback

def test_imports():
    """Test importing FastAPI app components"""
    
    print("Testing FastAPI app imports...")
    
    try:
        print("1. Testing basic imports...")
        from fastapi import FastAPI
        from fastapi.middleware.cors import CORSMiddleware
        from dotenv import load_dotenv
        print("   ✓ Basic imports successful")
        
        print("2. Testing database imports...")
        from app.database import engine, Base, async_session
        print("   ✓ Database imports successful")
        
        print("3. Testing model imports...")
        from app.models.assistant import Assistant
        from app.models.user import User
        print("   ✓ Model imports successful")
        
        print("4. Testing config imports...")
        from app.config import settings
        print("   ✓ Config imports successful")
        
        print("5. Testing API router imports...")
        from app.api import auth, onboarding, assistants, notifications, hh_auth, assessment, jobs
        print("   ✓ Basic API router imports successful")
        
        print("6. Testing enhanced_jobs import...")
        from app.api import enhanced_jobs
        print("   ✓ Enhanced jobs import successful")
        
        print("7. Testing settings API import...")
        from app.api import settings as settings_api
        print("   ✓ Settings API import successful")
        
        print("8. Testing main app import...")
        from app.main import app
        print("   ✓ Main app import successful")
        
        print("9. Testing app configuration...")
        print(f"   App title: {app.title}")
        print(f"   Docs URL: {app.docs_url}")
        print(f"   OpenAPI URL: {app.openapi_url}")
        
        print("\n✅ All imports successful!")
        return True
        
    except Exception as e:
        print(f"\n❌ Import error: {e}")
        print("\nFull traceback:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1) 