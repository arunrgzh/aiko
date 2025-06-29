from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, func
from sqlalchemy.orm import relationship

from ..database import Base

class OnboardingProfile(Base):
    __tablename__ = "onboarding_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Персональная информация
    disability_type = Column(String, nullable=True)
    disability_description = Column(Text, nullable=True)
    workplace_preferences = Column(Text, nullable=True)
    
    # Профессиональная информация
    profession = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    education_level = Column(String, nullable=True)
    
    # Навыки и предпочтения
    skills = Column(JSON, nullable=True)  # Список навыков
    work_format = Column(JSON, nullable=True)  # Формат работы: remote, office, hybrid
    employment_type = Column(JSON, nullable=True)  # Тип занятости: full-time, part-time, project
    
    # Условия работы
    min_salary = Column(Integer, nullable=True)
    max_salary = Column(Integer, nullable=True)
    currency = Column(String, default="KZT")
    preferred_cities = Column(JSON, nullable=True)  # Предпочитаемые города
    
    # Доступность
    accessibility_adaptations = Column(JSON, nullable=True)  # Необходимые адаптации
    platform_features = Column(JSON, nullable=True)  # Функции платформы
    feedback_preference = Column(String, nullable=True)
    accessibility_notes = Column(Text, nullable=True)
    
    # Завершение
    bio = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связь с пользователем
    user = relationship("User", back_populates="onboarding_profile") 