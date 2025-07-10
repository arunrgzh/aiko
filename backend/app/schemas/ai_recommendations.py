from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UserPreferences(BaseModel):
    """Предпочтения пользователя по работе."""
    work_format: Optional[List[str]] = Field(None, description="Желаемый формат работы (remote, office, hybrid)")
    needs_support: Optional[List[str]] = Field(None, description="Какие условия поддержки важны (гибкий график, доступная инфраструктура)")
    values: Optional[List[str]] = Field(None, description="Что пользователь ценит в работе (стабильность, развитие, коллектив)")

class UserPersonality(BaseModel):
    """Результаты личностного теста."""
    teamwork_aptitude: Optional[str] = Field(None, description="Склонность к командной работе (low, medium, high)")
    monotony_tolerance: Optional[str] = Field(None, description="Толерантность к монотонной работе (low, medium, high)")
    self_learning_aptitude: Optional[str] = Field(None, description="Способность к самообучению (low, medium, high)")
    motivation_type: Optional[str] = Field(None, description="Основной тип мотивации (достижения, стабильность, интерес)")

class UserProfileForAI(BaseModel):
    """Полный профиль пользователя для анализа ИИ."""
    user_id: int
    region: Optional[str] = Field(None, description="Регион проживания пользователя")
    skills: Optional[List[str]] = Field(None, description="Список подтвержденных навыков")
    disability_info: Optional[Dict[str, Any]] = Field(None, description="Информация об ограничениях и потребностях")
    preferences: UserPreferences
    personality: UserPersonality
    assessment_summary: Optional[str] = Field(None, description="Общее резюме по результатам теста")

class AIRecommendation(BaseModel):
    """Одна вакансия, рекомендованная ИИ."""
    title: str = Field(..., description="Название вакансии")
    company: Optional[str] = Field(None, description="Название компании")
    url: str = Field(..., description="Ссылка на вакансию")
    reason: str = Field(..., description="Объяснение, почему эта вакансия подходит пользователю")

class AIRecommendationsResponse(BaseModel):
    """Итоговый ответ с AI-рекомендациями."""
    recommendations: List[AIRecommendation]
    ai_summary: str = Field(..., description="Общий вывод ИИ о карьерном треке пользователя") 