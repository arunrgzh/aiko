from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class OnboardingProfileBase(BaseModel):
    # Персональная информация
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    disability_type: Optional[List[str]] = None
    disability_description: Optional[str] = None
    
    # Условия работы и предпочтения рабочего места
    work_conditions: Optional[List[str]] = None
    workplace_preferences: Optional[List[str]] = None
    workplace_other: Optional[str] = None
    
    # Навыки и опыт
    skills: Optional[List[str]] = None
    skills_other: Optional[str] = None
    desired_field: Optional[str] = None
    desired_field_other: Optional[str] = None
    extra_skills: Optional[str] = None
    certifications: Optional[str] = None
    
    # Образование и обучение
    education_status: Optional[str] = None
    education_level: Optional[str] = None
    wants_courses: Optional[str] = None
    learning_topics: Optional[List[str]] = None
    learning_topics_other: Optional[str] = None
    
    # Профессиональная информация
    profession: Optional[str] = None
    current_position: Optional[str] = None
    years_of_experience: Optional[int] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    
    # Рабочие предпочтения
    preferred_work_time: Optional[str] = None
    work_format: Optional[List[str]] = None
    employment_type: Optional[List[str]] = None
    preferred_job_types: Optional[List[str]] = None
    
    # Условия работы и зарплата
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: str = "KZT"
    preferred_cities: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    
    # Адаптации и доступность
    important_adaptations: Optional[List[str]] = None
    adaptations_other: Optional[str] = None
    accessibility_adaptations: Optional[List[str]] = None
    accessibility_issues: Optional[List[str]] = None
    accessibility_issues_other: Optional[str] = None
    accessibility_notes: Optional[str] = None
    
    # Ожидания от платформы
    platform_features: Optional[List[str]] = None
    platform_features_other: Optional[str] = None
    feedback_preference: Optional[str] = None
    feedback: Optional[str] = None
    
    # Категории работы и особенности
    suitable_job_categories: Optional[List[str]] = None
    job_features: Optional[List[str]] = None
    
    # Личная информация и ссылки
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

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