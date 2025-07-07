from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, Float, func
from sqlalchemy.orm import relationship

from ..database import Base

class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(String, nullable=False)  # multiple_choice, scale, text
    assessment_category = Column(String, nullable=False)  # communication, technical, problem_solving, etc.
    options = Column(JSON, nullable=True)  # For multiple choice questions
    weight = Column(Float, default=1.0)  # Weight for scoring
    scoring_criteria = Column(JSON, nullable=True)  # How to score this question
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assessment_type = Column(String, default="skills_assessment")
    version = Column(String, default="1.0")
    raw_answers = Column(JSON, nullable=False)  # User's raw answers
    top_strengths = Column(JSON, nullable=False)  # Top 5 strengths
    top_weaknesses = Column(JSON, nullable=False)  # Top 3 weaknesses
    strengths_analysis = Column(Text, nullable=True)  # AI analysis of strengths
    weaknesses_analysis = Column(Text, nullable=True)  # AI analysis of weaknesses
    improvement_suggestions = Column(Text, nullable=True)  # AI suggestions
    overall_score = Column(Float, nullable=True)  # Overall assessment score
    confidence_level = Column(Float, nullable=True)  # AI confidence in results
    embedding_id = Column(String, nullable=True, unique=True)  # ChromaDB embedding ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="assessment_results")

class ProfileSummary(Base):
    __tablename__ = "profile_summaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    summary_text = Column(Text, nullable=False)  # Generated profile summary
    embedding_id = Column(String, nullable=True, unique=True)  # ChromaDB embedding ID
    generated_from = Column(String, nullable=True)  # "onboarding" or "assessment"
    version = Column(Integer, default=1)  # Version for tracking updates
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="profile_summary") 