from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
import re

class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    youtube_url: str
    category: str  # 'employment' | 'motion'
    is_featured: bool = False

    @validator('category')
    def validate_category(cls, v):
        if v not in ['employment', 'motion']:
            raise ValueError('Category must be either "employment" or "motion"')
        return v

    @validator('youtube_url')
    def validate_youtube_url(cls, v):
        # Basic YouTube URL validation
        youtube_pattern = r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)'
        if not re.search(youtube_pattern, v):
            raise ValueError('Invalid YouTube URL format')
        return v

class VideoCreate(VideoBase):
    pass

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    youtube_url: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None

    @validator('category')
    def validate_category(cls, v):
        if v is not None and v not in ['employment', 'motion']:
            raise ValueError('Category must be either "employment" or "motion"')
        return v

    @validator('youtube_url')
    def validate_youtube_url(cls, v):
        if v is not None:
            youtube_pattern = r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)'
            if not re.search(youtube_pattern, v):
                raise ValueError('Invalid YouTube URL format')
        return v

class VideoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    youtube_url: str
    youtube_video_id: str
    thumbnail_url: Optional[str]
    category: str
    is_featured: bool
    views: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class VideosListResponse(BaseModel):
    videos: List[VideoResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

class UserVideoHistoryResponse(BaseModel):
    id: int
    video_id: int
    watched_at: datetime
    video: VideoResponse

    class Config:
        from_attributes = True

class UserVideoHistoryListResponse(BaseModel):
    history: List[UserVideoHistoryResponse]
    total: int