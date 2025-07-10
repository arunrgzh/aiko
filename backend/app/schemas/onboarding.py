from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class OnboardingProfileBase(BaseModel):
    # Персональная информация
    disability_type: Optional[str] = None
    disability_description: Optional[str] = None
    workplace_preferences: Optional[str] = None
    
    # Профессиональная информация
    current_position: Optional[str] = None
    experience_level: Optional[str] = None
    education_level: Optional[str] = None
    
    # Навыки и предпочтения
    skills: Optional[List[str]] = None
    work_format: Optional[List[str]] = None
    employment_type: Optional[List[str]] = None
    
    # Условия работы
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: str = "KZT"
    preferred_cities: Optional[List[str]] = None
    
    # Доступность
    accessibility_adaptations: Optional[List[str]] = None
    platform_features: Optional[List[str]] = None
    feedback_preference: Optional[str] = None
    accessibility_notes: Optional[str] = None
    
    # Завершение
    bio: Optional[str] = None

class OnboardingProfileCreate(OnboardingProfileBase):
    pass

class OnboardingProfileUpdate(OnboardingProfileBase):
    pass

class OnboardingProfileResponse(OnboardingProfileBase):
    id: int
    user_id: int
    is_completed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class OnboardingCompleteRequest(BaseModel):
    mark_as_completed: bool = True 