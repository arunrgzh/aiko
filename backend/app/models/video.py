from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import relationship

from ..database import Base

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    youtube_url = Column(String, nullable=False)
    youtube_video_id = Column(String, nullable=False, index=True)
    thumbnail_url = Column(String, nullable=True)
    category = Column(String, nullable=False)  # 'employment' | 'motion'
    is_featured = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user_video_history = relationship("UserVideoHistory", back_populates="video", cascade="all, delete-orphan")

class UserVideoHistory(Base):
    __tablename__ = "user_video_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    watched_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="video_history")
    video = relationship("Video", back_populates="user_video_history")