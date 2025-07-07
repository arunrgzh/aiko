from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship

from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_first_login = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    onboarding_profile = relationship("OnboardingProfile", back_populates="user", uselist=False)
    assistants = relationship("Assistant", back_populates="user", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    assessment_results = relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    profile_summary = relationship("ProfileSummary", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    # Job-related relationships
    job_recommendations = relationship("JobRecommendation", back_populates="user", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    job_feedbacks = relationship("JobFeedback", back_populates="user", cascade="all, delete-orphan")
    job_preferences = relationship("UserJobPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan") 