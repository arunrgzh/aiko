from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, func
from sqlalchemy.orm import relationship

from ..database import Base

class OnboardingProfile(Base):
    __tablename__ = "onboarding_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Персональная информация
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)  # Stored as string for flexibility
    gender = Column(String, nullable=True)
    disability_type = Column(JSON, nullable=True)  # Changed to JSON for multiple values
    disability_description = Column(Text, nullable=True)
    
    # Условия работы и предпочтения рабочего места
    work_conditions = Column(JSON, nullable=True)  # Detailed work conditions
    workplace_preferences = Column(JSON, nullable=True)  # Changed to JSON for multiple values
    workplace_other = Column(Text, nullable=True)  # Custom workplace preferences
    
    # Навыки и опыт
    skills = Column(JSON, nullable=True)  # Primary skills
    skills_other = Column(Text, nullable=True)  # Custom skills
    desired_field = Column(String, nullable=True)  # Desired work field
    desired_field_other = Column(Text, nullable=True)  # Custom desired field
    extra_skills = Column(Text, nullable=True)  # Additional skills
    certifications = Column(Text, nullable=True)  # Certifications
    
    # Образование и обучение
    education_status = Column(String, nullable=True)  # Current education status
    education_level = Column(String, nullable=True)  # Education level (mapped from status)
    wants_courses = Column(String, nullable=True)  # Interest in courses
    learning_topics = Column(JSON, nullable=True)  # Topics of interest
    learning_topics_other = Column(Text, nullable=True)  # Custom learning topics
    
    # Профессиональная информация
    profession = Column(String, nullable=True)  # Current/desired profession
    current_position = Column(String, nullable=True)  # Current job position
    years_of_experience = Column(Integer, nullable=True)  # Years of experience
    experience_level = Column(String, nullable=True)  # Mapped experience level
    industry = Column(String, nullable=True)  # Industry
    
    # Рабочие предпочтения
    preferred_work_time = Column(String, nullable=True)  # Preferred working hours
    work_format = Column(JSON, nullable=True)  # Format: remote, office, hybrid
    employment_type = Column(JSON, nullable=True)  # Type: full-time, part-time, project
    preferred_job_types = Column(JSON, nullable=True)  # Preferred job types
    
    # Условия работы и зарплата
    min_salary = Column(Integer, nullable=True)
    max_salary = Column(Integer, nullable=True)
    currency = Column(String, default="KZT")
    preferred_cities = Column(JSON, nullable=True)  # Preferred cities
    preferred_locations = Column(JSON, nullable=True)  # Preferred locations
    
    # Адаптации и доступность
    important_adaptations = Column(JSON, nullable=True)  # Important workplace adaptations
    adaptations_other = Column(Text, nullable=True)  # Custom adaptations
    accessibility_adaptations = Column(JSON, nullable=True)  # Accessibility adaptations
    accessibility_issues = Column(JSON, nullable=True)  # Accessibility issues
    accessibility_issues_other = Column(Text, nullable=True)  # Custom accessibility issues
    accessibility_notes = Column(Text, nullable=True)  # Additional accessibility notes
    
    # Ожидания от платформы
    platform_features = Column(JSON, nullable=True)  # Expected platform features
    platform_features_other = Column(Text, nullable=True)  # Custom platform features
    feedback_preference = Column(String, nullable=True)  # Feedback preferences
    feedback = Column(Text, nullable=True)  # General feedback
    
    # Категории работы и особенности
    suitable_job_categories = Column(JSON, nullable=True)  # Suitable job categories
    job_features = Column(JSON, nullable=True)  # Important job features
    
    # Личная информация и ссылки
    bio = Column(Text, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    
    # Статус завершения
    is_completed = Column(Boolean, default=False)
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связь с пользователем
    user = relationship("User", back_populates="onboarding_profile") 