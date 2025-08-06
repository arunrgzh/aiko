#!/usr/bin/env python3
"""
Script to check video data in the database
Run with: python scripts/check_video_data.py
"""

import asyncio
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings

async def check_video_data():
    """Check what video data exists in the database"""
    
    # Create engine
    engine = create_async_engine(settings.database_url, echo=False)
    
    try:
        async with engine.begin() as conn:
            print("🔍 Checking video data in database...")
            
            # Check if videos table exists
            check_table = """
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'videos'
            );
            """
            result = await conn.execute(text(check_table))
            table_exists = result.scalar()
            
            if not table_exists:
                print("❌ Videos table does not exist!")
                return
            
            # Get all videos with their categories
            get_videos = """
            SELECT id, title, category, is_featured, created_at 
            FROM videos 
            ORDER BY created_at DESC;
            """
            result = await conn.execute(text(get_videos))
            videos = result.fetchall()
            
            print(f"📊 Found {len(videos)} videos in database:")
            print("-" * 80)
            
            for video in videos:
                print(f"ID: {video[0]}")
                print(f"Title: {video[1]}")
                print(f"Category: '{video[2]}'")
                print(f"Featured: {video[3]}")
                print(f"Created: {video[4]}")
                print("-" * 40)
            
            # Check for invalid categories
            invalid_categories = [v for v in videos if v[2] not in ['employment', 'motion']]
            if invalid_categories:
                print(f"⚠️ Found {len(invalid_categories)} videos with invalid categories:")
                for video in invalid_categories:
                    print(f"  - ID {video[0]}: '{video[2]}' (should be 'employment' or 'motion')")
            else:
                print("✅ All videos have valid categories")
            
            # Check featured videos specifically
            featured_videos = [v for v in videos if v[3]]
            print(f"🎯 Found {len(featured_videos)} featured videos")
            
    except Exception as e:
        print(f"❌ Error checking video data: {e}")
        raise
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_video_data()) 