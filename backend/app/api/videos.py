from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func, and_, update
from typing import List, Optional
import logging
from datetime import datetime

from ..database import get_db
from ..models.user import User
from ..models.video import Video, UserVideoHistory
from ..schemas.video import (
    VideoCreate, VideoUpdate, VideoResponse, VideosListResponse,
    UserVideoHistoryResponse, UserVideoHistoryListResponse
)
from ..auth.jwt import get_current_user
from ..services.video_service import YouTubeService

router = APIRouter(prefix="/api/videos", tags=["videos"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=VideosListResponse)
async def get_videos(
    category: Optional[str] = None,
    featured_only: bool = Query(False, description="Show only featured videos"),
    page: int = Query(0, ge=0),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get all videos with optional filtering"""
    try:
        logger.info(f"get_videos called with category={category}, featured_only={featured_only}")
        # Build query
        query = select(Video)
        print(f"Category value: '{category}', type: {type(category)}")
        # Apply filters
        if category:
            if category not in ['employment', 'motion']:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Category must be 'employment' or 'motion'"
                )
            query = query.where(Video.category == category)
        
        if featured_only:
            query = query.where(Video.is_featured == True)
        
        # Count total
        count_query = select(func.count(Video.id))
        if category:
            count_query = count_query.where(Video.category == category)
        if featured_only:
            count_query = count_query.where(Video.is_featured == True)
        
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        query = query.order_by(desc(Video.created_at))
        query = query.offset(page * per_page).limit(per_page)
        
        result = await db.execute(query)
        videos = result.scalars().all()
        
        total_pages = (total + per_page - 1) // per_page
        
        return VideosListResponse(
            videos=[VideoResponse.model_validate(video) for video in videos],
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
        
    except Exception as e:
        logger.error(f"Error fetching videos: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch videos"
        )

@router.get("/employment", response_model=VideosListResponse)
async def get_employment_videos(
    page: int = Query(0, ge=0),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get employment category videos"""
    return await get_videos(category="employment", page=page, per_page=per_page, db=db)

@router.get("/motion", response_model=VideosListResponse)
async def get_motion_videos(
    page: int = Query(0, ge=0),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get motion category videos"""
    return await get_videos(category="motion", page=page, per_page=per_page, db=db)

@router.get("/featured", response_model=VideosListResponse)
async def get_featured_videos(
    page: int = Query(0, ge=0),
    per_page: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get featured videos for dashboard"""
    return await get_videos(featured_only=True, page=page, per_page=per_page, db=db)

@router.get("/debug")
async def debug_videos(db: AsyncSession = Depends(get_db)):
    """Debug endpoint to test video queries"""
    try:
        # Test basic count
        count_query = select(func.count(Video.id))
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        # Test featured videos
        featured_query = select(Video).where(Video.is_featured == True)
        featured_result = await db.execute(featured_query)
        featured_videos = featured_result.scalars().all()
        
        return {
            "total_videos": total,
            "featured_videos": len(featured_videos),
            "featured_titles": [video.title for video in featured_videos]
        }
    except Exception as e:
        logger.error(f"Debug error: {e}")
        return {"error": str(e)}

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific video by ID"""
    try:
        query = select(Video).where(Video.id == video_id)
        result = await db.execute(query)
        video = result.scalar_one_or_none()
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        return VideoResponse.model_validate(video)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching video {video_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch video"
        )

@router.post("/{video_id}/view")
async def track_video_view(
    video_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Track that a user viewed a video"""
    try:
        # Check if video exists
        video_query = select(Video).where(Video.id == video_id)
        video_result = await db.execute(video_query)
        video = video_result.scalar_one_or_none()
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # Check if user already viewed this video
        history_query = select(UserVideoHistory).where(
            and_(
                UserVideoHistory.user_id == current_user.id,
                UserVideoHistory.video_id == video_id
            )
        )
        history_result = await db.execute(history_query)
        existing_history = history_result.scalar_one_or_none()
        
        if not existing_history:
            # Create new history entry
            history = UserVideoHistory(
                user_id=current_user.id,
                video_id=video_id,
                watched_at=datetime.utcnow()
            )
            db.add(history)
            
            # Increment view count
            await db.execute(
                update(Video)
                .where(Video.id == video_id)
                .values(views=Video.views + 1)
            )
        else:
            # Update watched_at timestamp
            await db.execute(
                update(UserVideoHistory)
                .where(UserVideoHistory.id == existing_history.id)
                .values(watched_at=datetime.utcnow())
            )
        
        await db.commit()
        
        return {"message": "Video view tracked successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error tracking video view {video_id}: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to track video view"
        )

@router.get("/user/history", response_model=UserVideoHistoryListResponse)
async def get_user_video_history(
    page: int = Query(0, ge=0),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's video watch history"""
    try:
        # Count total
        count_query = select(func.count(UserVideoHistory.id)).where(
            UserVideoHistory.user_id == current_user.id
        )
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        # Get history with video details
        query = (
            select(UserVideoHistory)
            .join(Video)
            .where(UserVideoHistory.user_id == current_user.id)
            .order_by(desc(UserVideoHistory.watched_at))
            .offset(page * per_page)
            .limit(per_page)
        )
        
        result = await db.execute(query)
        history_items = result.scalars().all()
        
        return UserVideoHistoryListResponse(
            history=[UserVideoHistoryResponse.model_validate(item) for item in history_items],
            total=total
        )
        
    except Exception as e:
        logger.error(f"Error fetching user video history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch video history"
        )

# Admin endpoints
@router.post("/admin/videos", response_model=VideoResponse)
async def create_video(
    video_data: VideoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Admin endpoint: Create a new video"""
    # TODO: Add admin role check when role system is implemented
    try:
        # Extract YouTube video ID
        video_id = YouTubeService.extract_video_id(video_data.youtube_url)
        if not video_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid YouTube URL"
            )
        
        # Generate thumbnail URL
        thumbnail_url = YouTubeService.get_thumbnail_url(video_id)
        
        # Create video
        video = Video(
            title=video_data.title,
            description=video_data.description,
            youtube_url=video_data.youtube_url,
            youtube_video_id=video_id,
            thumbnail_url=thumbnail_url,
            category=video_data.category,
            is_featured=video_data.is_featured
        )
        
        db.add(video)
        await db.commit()
        await db.refresh(video)
        
        return VideoResponse.model_validate(video)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating video: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create video"
        )

@router.put("/admin/videos/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: int,
    video_data: VideoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Admin endpoint: Update a video"""
    # TODO: Add admin role check when role system is implemented
    try:
        # Get existing video
        query = select(Video).where(Video.id == video_id)
        result = await db.execute(query)
        video = result.scalar_one_or_none()
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # Update fields
        update_data = video_data.dict(exclude_unset=True)
        
        # Handle YouTube URL update
        if 'youtube_url' in update_data:
            new_video_id = YouTubeService.extract_video_id(update_data['youtube_url'])
            if not new_video_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid YouTube URL"
                )
            update_data['youtube_video_id'] = new_video_id
            update_data['thumbnail_url'] = YouTubeService.get_thumbnail_url(new_video_id)
        
        # Apply updates
        for field, value in update_data.items():
            setattr(video, field, value)
        
        await db.commit()
        await db.refresh(video)
        
        return VideoResponse.model_validate(video)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating video {video_id}: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update video"
        )

@router.delete("/admin/videos/{video_id}")
async def delete_video(
    video_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Admin endpoint: Delete a video"""
    # TODO: Add admin role check when role system is implemented
    try:
        # Get existing video
        query = select(Video).where(Video.id == video_id)
        result = await db.execute(query)
        video = result.scalar_one_or_none()
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        await db.delete(video)
        await db.commit()
        
        return {"message": "Video deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting video {video_id}: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete video"
        )