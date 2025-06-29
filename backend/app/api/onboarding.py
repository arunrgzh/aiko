from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional

from ..database import get_db
from ..models.user import User
from ..models.onboarding import OnboardingProfile
from ..schemas.onboarding import OnboardingProfileCreate, OnboardingProfileUpdate, OnboardingProfileResponse, OnboardingCompleteRequest
from ..auth.jwt import get_current_user

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])

@router.post("/profile", response_model=OnboardingProfileResponse)
async def create_or_update_profile(
    profile_data: OnboardingProfileCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать или обновить профиль онбординга"""
    
    # Проверяем, существует ли профиль
    result = await db.execute(
        select(OnboardingProfile).where(OnboardingProfile.user_id == current_user.id)
    )
    existing_profile = result.scalar_one_or_none()
    
    if existing_profile:
        # Обновляем существующий профиль
        for field, value in profile_data.model_dump(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        
        await db.commit()
        await db.refresh(existing_profile)
        return existing_profile
    else:
        # Создаем новый профиль
        new_profile = OnboardingProfile(
            user_id=current_user.id,
            **profile_data.model_dump(exclude_unset=True)
        )
        
        db.add(new_profile)
        await db.commit()
        await db.refresh(new_profile)
        return new_profile

@router.get("/profile", response_model=Optional[OnboardingProfileResponse])
async def get_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить профиль онбординга текущего пользователя"""
    
    result = await db.execute(
        select(OnboardingProfile).where(OnboardingProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    return profile

@router.post("/complete")
async def complete_onboarding(
    request: OnboardingCompleteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Завершить онбординг"""
    
    # Обновляем профиль онбординга
    await db.execute(
        update(OnboardingProfile)
        .where(OnboardingProfile.user_id == current_user.id)
        .values(is_completed=request.mark_as_completed)
    )
    
    # Обновляем флаг первого входа пользователя
    await db.execute(
        update(User)
        .where(User.id == current_user.id)
        .values(is_first_login=False)
    )
    
    await db.commit()
    
    return {"message": "Onboarding completed successfully"} 