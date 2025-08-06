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