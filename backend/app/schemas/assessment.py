from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class AssessmentAnswer(BaseModel):
    """Schema for individual assessment answer"""
    question_id: int
    answer: Any  # Can be string, int, list, etc.

class AssessmentSubmission(BaseModel):
    """Schema for submitting assessment answers"""
    assessment_type: str = Field(default="skills_assessment")
    answers: List[AssessmentAnswer] = Field(..., min_length=1)

class AssessmentStrength(BaseModel):
    """Schema for individual strength"""
    category: str
    score: float = Field(..., ge=0, le=10)
    description: str

class AssessmentWeakness(BaseModel):
    """Schema for individual weakness"""
    category: str
    score: float = Field(..., ge=0, le=10)
    description: str

class AssessmentResultCreate(BaseModel):
    """Schema for creating assessment result"""
    user_id: int
    assessment_type: str = Field(default="skills_assessment")
    version: str = Field(default="1.0")
    raw_answers: Dict[str, Any]
    top_strengths: List[AssessmentStrength]
    top_weaknesses: List[AssessmentWeakness]
    strengths_analysis: Optional[str] = None
    weaknesses_analysis: Optional[str] = None
    improvement_suggestions: Optional[str] = None
    overall_score: Optional[float] = Field(None, ge=0, le=10)
    confidence_level: Optional[float] = Field(None, ge=0, le=1)

class AssessmentResultResponse(BaseModel):
    """Schema for assessment result response"""
    id: int
    user_id: int
    assessment_type: str
    version: str
    top_strengths: List[AssessmentStrength]
    top_weaknesses: List[AssessmentWeakness]
    strengths_analysis: Optional[str] = None
    weaknesses_analysis: Optional[str] = None
    improvement_suggestions: Optional[str] = None
    overall_score: Optional[float] = None
    confidence_level: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AssessmentQuestionResponse(BaseModel):
    """Schema for assessment question response"""
    id: int
    question_text: str
    question_type: str
    assessment_category: str
    options: Optional[List[str]] = None
    weight: float
    
    class Config:
        from_attributes = True

class AssessmentQuestionsResponse(BaseModel):
    """Schema for list of assessment questions"""
    questions: List[AssessmentQuestionResponse]
    total_questions: int

class AssessmentAnalysisRequest(BaseModel):
    """Schema for requesting AI analysis of assessment"""
    assessment_id: int

class ProfileSummaryCreate(BaseModel):
    """Schema for creating profile summary"""
    user_id: int
    summary_text: str
    generated_from: str = Field(..., pattern="^(onboarding|assessment)$")
    version: int = 1

class ProfileSummaryResponse(BaseModel):
    """Schema for profile summary response"""
    id: int
    user_id: int
    summary_text: str
    generated_from: str
    version: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class TakeAssessmentOption(BaseModel):
    """Schema for onboarding assessment option"""
    take_assessment: bool = Field(..., description="Whether user wants to take assessment instead of continuing onboarding")
    skip_onboarding_data: bool = Field(default=True, description="Whether to skip storing onboarding data if taking assessment") 