from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional

from ..database import get_db
from ..models.user import User
from ..models.onboarding import OnboardingProfile
from ..schemas.onboarding import OnboardingProfileCreate, OnboardingProfileUpdate, OnboardingProfileResponse, OnboardingCompleteRequest
from ..schemas.assessment import TakeAssessmentOption
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

@router.post("/assessment-option")
async def choose_assessment_option(
    option: TakeAssessmentOption,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Выбор пользователя: продолжить онбординг или пройти тест на сильные/слабые стороны"""
    
    if option.take_assessment:
        # Пользователь выбрал пройти тест
        if option.skip_onboarding_data:
            # Не сохраняем данные онбординга, перенаправляем на тест
            return {
                "message": "Перенаправление на тест оценки",
                "action": "redirect_to_assessment",
                "assessment_url": "/api/assessment/questions"
            }
        else:
            # Сохраняем минимальные данные онбординга перед тестом
            return {
                "message": "Данные сохранены, перенаправление на тест оценки",
                "action": "save_and_redirect",
                "assessment_url": "/api/assessment/questions"
            }
    else:
        # Пользователь выбрал продолжить обычный онбординг
        return {
            "message": "Продолжение онбординга",
            "action": "continue_onboarding"
        }

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

@router.get("/progress")
async def get_onboarding_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить прогресс онбординга"""
    
    result = await db.execute(
        select(OnboardingProfile).where(OnboardingProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        return {
            "progress_percentage": 0,
            "completed_steps": 0,
            "total_steps": 5,
            "is_completed": False,
            "can_take_assessment": True,  # User can choose assessment from the start
            "assessment_available": True
        }
    
    # Calculate progress based on filled fields
    total_fields = 10  # Estimate based on key onboarding fields
    filled_fields = 0
    
    if profile.profession is not None:
        filled_fields += 1
    if profile.skills is not None:
        filled_fields += 1
    if profile.experience_level is not None:
        filled_fields += 1
    if profile.min_salary is not None or profile.max_salary is not None:
        filled_fields += 1
    if profile.preferred_cities is not None:
        filled_fields += 1
    if profile.work_format is not None:
        filled_fields += 1
    if profile.employment_type is not None:
        filled_fields += 1
    if profile.accessibility_adaptations is not None:
        filled_fields += 1
    if profile.bio is not None:
        filled_fields += 1
    if profile.disability_type is not None:
        filled_fields += 1
    
    progress_percentage = int((filled_fields / total_fields) * 100)
    
    return {
        "progress_percentage": progress_percentage,
        "completed_steps": filled_fields,
        "total_steps": total_fields,
        "is_completed": profile.is_completed,
        "can_take_assessment": progress_percentage < 50,  # Can take assessment if less than 50% complete
        "assessment_available": True
    } 