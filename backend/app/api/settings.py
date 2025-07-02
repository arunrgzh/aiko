from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..database import get_db
from ..models.user import User
from ..auth.jwt import get_current_user

router = APIRouter(prefix="/setting", tags=["settings"])

# Mock settings data
mock_notification_settings = {
    "desktop": True,
    "unreadMessageBadge": False,
    "email": ["newsAndUpdate", "tipsAndTutorial"],
    "notifymeAbout": "mentionsOnly",
}

@router.get("/notification")
async def get_notification_settings(
    current_user: User = Depends(get_current_user)
):
    """Get notification settings for the current user"""
    return mock_notification_settings

@router.post("/notification")
async def update_notification_settings(
    settings: dict,
    current_user: User = Depends(get_current_user)
):
    """Update notification settings for the current user"""
    # Here you would save to database
    # For now, just return the updated settings
    mock_notification_settings.update(settings)
    return {"message": "Settings updated successfully", "settings": mock_notification_settings} 