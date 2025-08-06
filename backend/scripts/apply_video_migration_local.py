#!/usr/bin/env python3
"""
Apply video migration to local SQLite database
Run with: python scripts/apply_video_migration_local.py
"""

import asyncio
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Use local SQLite database
DATABASE_URL = "sqlite+aiosqlite:///./test_videos.db"

async def apply_video_migration():
    """Apply video table migration and seed initial data"""
    
    # Create engine
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    try:
        async with engine.begin() as conn:
            print("🚀 Applying video tables migration...")
            
            # Create videos table
            create_videos_table = """
            CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                description TEXT,
                youtube_url VARCHAR NOT NULL,
                youtube_video_id VARCHAR NOT NULL,
                thumbnail_url VARCHAR,
                category VARCHAR NOT NULL CHECK (category IN ('employment', 'motion')),
                is_featured BOOLEAN DEFAULT FALSE,
                views INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP
            );
            """
            await conn.execute(text(create_videos_table))
            
            # Create user_video_history table
            create_history_table = """
            CREATE TABLE IF NOT EXISTS user_video_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                video_id INTEGER NOT NULL,
                watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
                UNIQUE(user_id, video_id)
            );
            """
            await conn.execute(text(create_history_table))
            
            # Create indexes one by one
            indexes = [
                "CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);",
                "CREATE INDEX IF NOT EXISTS idx_videos_is_featured ON videos(is_featured);",
                "CREATE INDEX IF NOT EXISTS idx_videos_youtube_video_id ON videos(youtube_video_id);",
                "CREATE INDEX IF NOT EXISTS idx_user_video_history_user_id ON user_video_history(user_id);",
                "CREATE INDEX IF NOT EXISTS idx_user_video_history_video_id ON user_video_history(video_id);",
                "CREATE INDEX IF NOT EXISTS idx_user_video_history_watched_at ON user_video_history(watched_at);"
            ]
            
            for index_sql in indexes:
                await conn.execute(text(index_sql))
            
            print("✅ Successfully applied video tables migration")
            
            # Seed initial video data
            print("🌱 Seeding initial video data...")
            
            # Check if videos already exist
            check_videos = "SELECT COUNT(*) FROM videos"
            result = await conn.execute(text(check_videos))
            video_count = result.scalar()
            
            if video_count == 0:
                # Insert videos using direct SQL
                insert_videos = """
                INSERT INTO videos (title, description, youtube_url, youtube_video_id, thumbnail_url, category, is_featured) VALUES
                ('Как составить резюме: полное руководство', 'Подробное руководство по созданию эффективного резюме для поиска работы', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'employment', 1),
                ('Подготовка к собеседованию: советы HR-специалиста', 'Практические советы по подготовке к собеседованию от опытного HR-специалиста', 'https://www.youtube.com/watch?v=oHg5SJYRHA0', 'oHg5SJYRHA0', 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg', 'employment', 1),
                ('Стратегии поиска работы в 2024 году', 'Современные методы и стратегии эффективного поиска работы', 'https://www.youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'employment', 0),
                ('Развитие карьеры: планирование и достижение целей', 'Как планировать карьерный рост и достигать профессиональных целей', 'https://www.youtube.com/watch?v=YQHsXMglC9A', 'YQHsXMglC9A', 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg', 'employment', 0),
                ('After Effects для начинающих: основы анимации', 'Изучите основы работы с After Effects для создания анимации', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 'fJ9rUzIMcZQ', 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg', 'motion', 1),
                ('Создание моушн-графики: принципы и техники', 'Основные принципы и техники создания эффективной моушн-графики', 'https://www.youtube.com/watch?v=astISOttCQ0', 'astISOttCQ0', 'https://img.youtube.com/vi/astISOttCQ0/maxresdefault.jpg', 'motion', 1),
                ('Анимация персонажей в After Effects', 'Продвинутые техники анимации персонажей и объектов', 'https://www.youtube.com/watch?v=iik25wqIuFo', 'iik25wqIuFo', 'https://img.youtube.com/vi/iik25wqIuFo/maxresdefault.jpg', 'motion', 0);
                """
                
                await conn.execute(text(insert_videos))
                print("✅ Successfully seeded initial video data")
            else:
                print("⚠️ Videos already exist, skipping seed data")
            
            print("🎉 Video migration and seeding completed successfully!")
            
    except Exception as e:
        print(f"❌ Error applying video migration: {e}")
        raise
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(apply_video_migration()) 