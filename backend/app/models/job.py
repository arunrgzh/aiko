from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, Float, func, UniqueConstraint
from sqlalchemy.orm import relationship

from ..database import Base

class JobRecommendation(Base):
    __tablename__ = "job_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hh_vacancy_id = Column(String, nullable=False)  # HeadHunter vacancy ID
    
    # Job details from HH API
    title = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    salary_from = Column(Integer, nullable=True)
    salary_to = Column(Integer, nullable=True)
    currency = Column(String, default="KZT")
    area_name = Column(String, nullable=True)  # Location
    employment_type = Column(String, nullable=True)  # full_time, part_time, etc.
    experience_required = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    key_skills = Column(JSON, nullable=True)  # List of required skills
    
    # Recommendation scoring
    relevance_score = Column(Float, default=0.0)  # How well it matches user profile
    skills_match_score = Column(Float, default=0.0)  # Skills matching percentage
    location_match_score = Column(Float, default=0.0)  # Location preference match
    salary_match_score = Column(Float, default=0.0)  # Salary expectation match
    
    # HH API response data
    raw_data = Column(JSON, nullable=True)  # Store full API response
    
    # Status and metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="job_recommendations")
    saved_jobs = relationship("SavedJob", back_populates="job_recommendation", cascade="all, delete-orphan")
    job_feedbacks = relationship("JobFeedback", back_populates="job_recommendation", cascade="all, delete-orphan")
    
    # Ensure unique recommendations per user
    __table_args__ = (UniqueConstraint('user_id', 'hh_vacancy_id', name='uq_user_vacancy'),)

class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_recommendation_id = Column(Integer, ForeignKey("job_recommendations.id"), nullable=False)
    
    # Save metadata
    notes = Column(Text, nullable=True)  # User's personal notes
    application_status = Column(String, default="saved")  # saved, applied, interview, rejected, hired
    application_date = Column(DateTime(timezone=True), nullable=True)
    reminder_date = Column(DateTime(timezone=True), nullable=True)
    
    # Status
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="saved_jobs")
    job_recommendation = relationship("JobRecommendation", back_populates="saved_jobs")
    
    # Ensure user can't save the same job twice
    __table_args__ = (UniqueConstraint('user_id', 'job_recommendation_id', name='uq_user_saved_job'),)

class JobFeedback(Base):
    __tablename__ = "job_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_recommendation_id = Column(Integer, ForeignKey("job_recommendations.id"), nullable=False)
    
    # Feedback data
    is_relevant = Column(Boolean, nullable=True)  # User thinks this job is relevant
    is_interested = Column(Boolean, nullable=True)  # User is interested in this type of job
    relevance_score = Column(Integer, nullable=True)  # 1-5 rating
    feedback_notes = Column(Text, nullable=True)
    
    # Feedback categories
    skill_match_feedback = Column(String, nullable=True)  # "good", "partial", "poor"
    location_feedback = Column(String, nullable=True)  # "good", "acceptable", "poor"
    salary_feedback = Column(String, nullable=True)  # "good", "low", "high"
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="job_feedbacks")
    job_recommendation = relationship("JobRecommendation", back_populates="job_feedbacks")
    
    # Ensure user can't give feedback twice for the same job
    __table_args__ = (UniqueConstraint('user_id', 'job_recommendation_id', name='uq_user_job_feedback'),)

class UserJobPreferences(Base):
    __tablename__ = "user_job_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Derived from onboarding and feedback
    preferred_skills = Column(JSON, nullable=True)  # Skills user wants to use
    avoided_skills = Column(JSON, nullable=True)  # Skills user wants to avoid
    preferred_job_titles = Column(JSON, nullable=True)  # Job titles user prefers
    avoided_job_titles = Column(JSON, nullable=True)  # Job titles user doesn't want
    
    # Location preferences
    preferred_areas = Column(JSON, nullable=True)  # HeadHunter area IDs
    remote_work_preference = Column(String, default="any")  # "only", "prefer", "avoid", "any"
    
    # Employment preferences
    employment_types = Column(JSON, nullable=True)  # ["full_time", "part_time", etc.]
    
    # Salary preferences (derived from feedback)
    preferred_salary_min = Column(Integer, nullable=True)
    preferred_salary_max = Column(Integer, nullable=True)
    salary_currency = Column(String, default="KZT")
    
    # Company preferences
    preferred_company_types = Column(JSON, nullable=True)  # startup, enterprise, etc.
    company_size_preference = Column(JSON, nullable=True)  # small, medium, large
    
    # Learning from feedback
    positive_keywords = Column(JSON, nullable=True)  # Keywords from jobs user liked
    negative_keywords = Column(JSON, nullable=True)  # Keywords from jobs user disliked
    
    # Auto-update settings
    auto_update_from_feedback = Column(Boolean, default=True)
    last_feedback_analysis = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="job_preferences") 