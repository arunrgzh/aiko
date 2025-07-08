from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..database import get_db
from ..models.user import User
from ..auth.jwt import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])

# Mock notification data (you can replace this with actual database models later)
mock_notifications = [
    {
        "id": "e55adc24-1803-4ffd-b653-09be273f8df5",
        "target": "AI-Komekshi",
        "description": "Welcome to AI-Komekshi! Your account has been created successfully.",
        "date": "2 minutes ago",
        "image": "",
        "type": 1,
        "location": "",
        "locationLabel": "",
        "status": "succeed",
        "readed": False,
    },
    {
        "id": "b06ca3f5-8fb0-4979-a016-30dfe63e8fd6",
        "target": "AI Assistant",
        "description": "Your AI assistant is ready to help you find jobs.",
        "date": "10 minutes ago",
        "image": "",
        "type": 1,
        "location": "",
        "locationLabel": "",
        "status": "",
        "readed": False,
    },
    {
        "id": "f644235d-dffc-4f17-883f-1ada117ff2c9",
        "target": "",
        "description": "Complete your profile to get better job recommendations.",
        "date": "1 hour ago",
        "image": "",
        "type": 2,
        "location": "",
        "locationLabel": "",
        "status": "",
        "readed": True,
    }
]

@router.get("/count")
async def get_notification_count(
    current_user: User = Depends(get_current_user)
):
    """Get unread notification count"""
    unread_count = sum(1 for notif in mock_notifications if not notif["readed"])
    return {"count": unread_count}

@router.get("/")
async def get_notifications(
    current_user: User = Depends(get_current_user)
):
    """Get all notifications for the current user"""
    return mock_notifications 