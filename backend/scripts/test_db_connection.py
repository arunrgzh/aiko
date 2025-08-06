#!/usr/bin/env python3
"""
Test database connection and video queries
Run with: python scripts/test_db_connection.py
"""

import asyncio
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text, select
from app.models.video import Video
from app.config import settings

async def test_db_connection():
    """Test database connection and video queries"""
    
    print(f"🔍 Testing database connection to: {settings.database_url}")
    
    # Create engine
    engine = create_async_engine(settings.database_url, echo=True)
    
    try:
        async with engine.begin() as conn:
            print("✅ Database connection successful")
            
            # Test basic query
            result = await conn.execute(text("SELECT COUNT(*) FROM videos"))
            count = result.scalar()
            print(f"📊 Found {count} videos in database")
            
            # Test SQLAlchemy ORM query
            result = await conn.execute(select(Video))
            videos = result.scalars().all()
            print(f"📊 Found {len(videos)} videos using ORM")
            
            for video in videos:
                print(f"  - ID: {video.id}, Title: {video.title}, Category: {video.category}")
            
    except Exception as e:
        print(f"❌ Error testing database: {e}")
        raise
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_db_connection()) 