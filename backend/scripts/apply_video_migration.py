#!/usr/bin/env python3
"""
Script to apply video table migration and seed initial video data
Run with: python scripts/apply_video_migration.py
"""

import asyncio
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings

async def apply_video_migration():
    """Apply video table migration and seed initial data"""
    
    # Create engine
    engine = create_async_engine(settings.database_url, echo=True)
    
    try:
        async with engine.begin() as conn:
            print("🚀 Applying video tables migration...")
            
            # Create videos table
            videos_migration = """
            -- Create videos table
            CREATE TABLE IF NOT EXISTS videos (
                id SERIAL PRIMARY KEY,
                title VARCHAR NOT NULL,
                description TEXT,
                youtube_url VARCHAR NOT NULL,
                youtube_video_id VARCHAR NOT NULL,
                thumbnail_url VARCHAR,
                category VARCHAR NOT NULL CHECK (category IN ('employment', 'motion')),
                is_featured BOOLEAN DEFAULT FALSE,
                views INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE
            );

            -- Create user_video_history table
            CREATE TABLE IF NOT EXISTS user_video_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
                watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, video_id)
            );

            -- Create indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
            CREATE INDEX IF NOT EXISTS idx_videos_is_featured ON videos(is_featured);
            CREATE INDEX IF NOT EXISTS idx_videos_youtube_video_id ON videos(youtube_video_id);
            CREATE INDEX IF NOT EXISTS idx_user_video_history_user_id ON user_video_history(user_id);
            CREATE INDEX IF NOT EXISTS idx_user_video_history_video_id ON user_video_history(video_id);
            CREATE INDEX IF NOT EXISTS idx_user_video_history_watched_at ON user_video_history(watched_at);
            """
            
            await conn.execute(text(videos_migration))
            print("✅ Successfully applied video tables migration")
            
            # Seed initial video data
            print("🌱 Seeding initial video data...")
            
            # Check if videos already exist
            check_videos = "SELECT COUNT(*) FROM videos"
            result = await conn.execute(text(check_videos))
            video_count = result.scalar()
            
            if video_count == 0:
                seed_videos = """
                INSERT INTO videos (title, description, youtube_url, youtube_video_id, thumbnail_url, category, is_featured) VALUES
                -- Employment videos
                ('Как составить резюме: полное руководство', 'Подробное руководство по созданию эффективного резюме для поиска работы', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'employment', true),
                ('Подготовка к собеседованию: советы HR-специалиста', 'Практические советы по подготовке к собеседованию от опытного HR-специалиста', 'https://www.youtube.com/watch?v=oHg5SJYRHA0', 'oHg5SJYRHA0', 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg', 'employment', true),
                ('Стратегии поиска работы в 2024 году', 'Современные методы и стратегии эффективного поиска работы', 'https://www.youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'employment', false),
                ('Развитие карьеры: планирование и достижение целей', 'Как планировать карьерный рост и достигать профессиональных целей', 'https://www.youtube.com/watch?v=YQHsXMglC9A', 'YQHsXMglC9A', 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg', 'employment', false),
                
                -- Motion design videos
                ('After Effects для начинающих: основы анимации', 'Изучите основы работы с After Effects для создания анимации', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 'fJ9rUzIMcZQ', 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg', 'motion', true),
                ('Создание моушн-графики: принципы и техники', 'Основные принципы и техники создания эффективной моушн-графики', 'https://www.youtube.com/watch?v=astISOttCQ0', 'astISOttCQ0', 'https://img.youtube.com/vi/astISOttCQ0/maxresdefault.jpg', 'motion', true),
                ('Анимация персонажей в After Effects', 'Продвинутые техники анимации персонажей и объектов', 'https://www.youtube.com/watch?v=iik25wqIuFo', 'iik25wqIuFo', 'https://img.youtube.com/vi/iik25wqIuFo/maxresdefault.jpg', 'motion', false)
                """
                
                await conn.execute(text(seed_videos))
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