import re
from typing import Optional

class YouTubeService:
    """Service for handling YouTube video operations"""
    
    @staticmethod
    def extract_video_id(url: str) -> Optional[str]:
        """Extract video ID from YouTube URL"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=)([^&\n?#]+)',
            r'(?:youtu\.be\/)([^&\n?#]+)',
            r'(?:youtube\.com\/embed\/)([^&\n?#]+)',
            r'(?:youtube\.com\/v\/)([^&\n?#]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    @staticmethod
    def get_thumbnail_url(video_id: str, quality: str = 'maxresdefault') -> str:
        """Get thumbnail URL for a YouTube video"""
        # Available qualities: default, mqdefault, hqdefault, sddefault, maxresdefault
        return f"https://img.youtube.com/vi/{video_id}/{quality}.jpg"
    
    @staticmethod
    def get_embed_url(video_id: str) -> str:
        """Get embed URL for a YouTube video"""
        return f"https://www.youtube.com/embed/{video_id}"
    
    @staticmethod
    def get_watch_url(video_id: str) -> str:
        """Get watch URL for a YouTube video"""
        return f"https://www.youtube.com/watch?v={video_id}"