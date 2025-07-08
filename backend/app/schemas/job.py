from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Enums for validation
class ApplicationStatus(str, Enum):
    SAVED = "saved"
    APPLIED = "applied"
    INTERVIEW = "interview"
    REJECTED = "rejected"
    HIRED = "hired"

class RemoteWorkPreference(str, Enum):
    ONLY = "only"
    PREFER = "prefer"
    AVOID = "avoid"
    ANY = "any"

class FeedbackRating(str, Enum):
    GOOD = "good"
    PARTIAL = "partial"
    POOR = "poor"
    ACCEPTABLE = "acceptable"
    LOW = "low"
    HIGH = "high"

# Job Recommendation Schemas
class JobRecommendationBase(BaseModel):
    title: str
    company_name: Optional[str] = None
    salary_from: Optional[int] = None
    salary_to: Optional[int] = None
    currency: str = "KZT"
    area_name: Optional[str] = None
    employment_type: Optional[str] = None
    experience_required: Optional[str] = None
    description: Optional[str] = None
    key_skills: Optional[List[str]] = None

class JobRecommendationCreate(JobRecommendationBase):
    hh_vacancy_id: str
    relevance_score: Optional[float] = 0.0
    skills_match_score: Optional[float] = 0.0
    location_match_score: Optional[float] = 0.0
    salary_match_score: Optional[float] = 0.0
    raw_data: Optional[Dict[str, Any]] = None

class JobRecommendationResponse(JobRecommendationBase):
    id: int
    hh_vacancy_id: str
    relevance_score: float
    skills_match_score: float
    location_match_score: float
    salary_match_score: float
    is_saved: Optional[bool] = False  # Will be populated by service
    user_feedback: Optional[bool] = None  # Will be populated by service
    created_at: datetime
    
    class Config:
        from_attributes = True

class JobRecommendationListResponse(BaseModel):
    recommendations: List[JobRecommendationResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

# Saved Job Schemas
class SavedJobCreate(BaseModel):
    job_recommendation_id: int
    notes: Optional[str] = None
    application_status: ApplicationStatus = ApplicationStatus.SAVED
    application_date: Optional[datetime] = None
    reminder_date: Optional[datetime] = None

class SavedJobUpdate(BaseModel):
    notes: Optional[str] = None
    application_status: Optional[ApplicationStatus] = None
    application_date: Optional[datetime] = None
    reminder_date: Optional[datetime] = None
    is_archived: Optional[bool] = None

class SavedJobResponse(BaseModel):
    id: int
    job_recommendation: JobRecommendationResponse
    notes: Optional[str] = None
    application_status: ApplicationStatus
    application_date: Optional[datetime] = None
    reminder_date: Optional[datetime] = None
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Job Feedback Schemas
class JobFeedbackCreate(BaseModel):
    job_recommendation_id: int
    is_relevant: Optional[bool] = None
    is_interested: Optional[bool] = None
    relevance_score: Optional[int] = Field(None, ge=1, le=5)
    feedback_notes: Optional[str] = None
    skill_match_feedback: Optional[FeedbackRating] = None
    location_feedback: Optional[FeedbackRating] = None
    salary_feedback: Optional[FeedbackRating] = None

class JobFeedbackResponse(BaseModel):
    id: int
    job_recommendation_id: int
    is_relevant: Optional[bool] = None
    is_interested: Optional[bool] = None
    relevance_score: Optional[int] = None
    feedback_notes: Optional[str] = None
    skill_match_feedback: Optional[FeedbackRating] = None
    location_feedback: Optional[FeedbackRating] = None
    salary_feedback: Optional[FeedbackRating] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# User Job Preferences Schemas
class UserJobPreferencesCreate(BaseModel):
    preferred_skills: Optional[List[str]] = None
    avoided_skills: Optional[List[str]] = None
    preferred_job_titles: Optional[List[str]] = None
    avoided_job_titles: Optional[List[str]] = None
    preferred_areas: Optional[List[str]] = None  # HeadHunter area IDs
    remote_work_preference: RemoteWorkPreference = RemoteWorkPreference.ANY
    employment_types: Optional[List[str]] = None
    preferred_salary_min: Optional[int] = None
    preferred_salary_max: Optional[int] = None
    salary_currency: str = "KZT"
    preferred_company_types: Optional[List[str]] = None
    company_size_preference: Optional[List[str]] = None
    auto_update_from_feedback: bool = True

class UserJobPreferencesUpdate(BaseModel):
    preferred_skills: Optional[List[str]] = None
    avoided_skills: Optional[List[str]] = None
    preferred_job_titles: Optional[List[str]] = None
    avoided_job_titles: Optional[List[str]] = None
    preferred_areas: Optional[List[str]] = None
    remote_work_preference: Optional[RemoteWorkPreference] = None
    employment_types: Optional[List[str]] = None
    preferred_salary_min: Optional[int] = None
    preferred_salary_max: Optional[int] = None
    salary_currency: Optional[str] = None
    preferred_company_types: Optional[List[str]] = None
    company_size_preference: Optional[List[str]] = None
    auto_update_from_feedback: Optional[bool] = None

class UserJobPreferencesResponse(BaseModel):
    id: int
    preferred_skills: Optional[List[str]] = None
    avoided_skills: Optional[List[str]] = None
    preferred_job_titles: Optional[List[str]] = None
    avoided_job_titles: Optional[List[str]] = None
    preferred_areas: Optional[List[str]] = None
    remote_work_preference: RemoteWorkPreference
    employment_types: Optional[List[str]] = None
    preferred_salary_min: Optional[int] = None
    preferred_salary_max: Optional[int] = None
    salary_currency: str
    preferred_company_types: Optional[List[str]] = None
    company_size_preference: Optional[List[str]] = None
    positive_keywords: Optional[List[str]] = None
    negative_keywords: Optional[List[str]] = None
    auto_update_from_feedback: bool
    last_feedback_analysis: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# HeadHunter API Integration Schemas
class HHSearchRequest(BaseModel):
    text: Optional[str] = None  # Search query
    area: Optional[str] = "40"  # Default to Kazakhstan
    specialization: Optional[str] = None
    experience: Optional[str] = None
    employment: Optional[str] = None
    salary: Optional[int] = None
    page: int = 0
    per_page: int = 20
    order_by: str = "relevance"  # relevance, publication_time, salary_desc
    
class PersonalizedJobSearchRequest(BaseModel):
    use_preferences: bool = True  # Use saved user preferences
    override_skills: Optional[List[str]] = None  # Override user skills
    override_location: Optional[str] = None  # Override location preference
    override_salary_min: Optional[int] = None  # Override salary preference
    include_remote: Optional[bool] = None  # Include remote jobs
    page: int = 0
    per_page: int = 20
    exclude_applied: bool = True  # Exclude jobs user already applied to

class HHVacancyResponse(BaseModel):
    id: str
    name: str
    area: Optional[Dict[str, Any]] = None
    salary: Optional[Dict[str, Any]] = None
    type: Optional[Dict[str, str]] = None
    address: Optional[Dict[str, Any]] = None
    response_letter_required: Optional[bool] = None
    published_at: Optional[str] = None
    created_at: Optional[str] = None
    archived: Optional[bool] = None
    apply_alternate_url: Optional[str] = None
    insider_interview: Optional[Dict[str, Any]] = None
    url: Optional[str] = None
    alternate_url: Optional[str] = None
    employer: Optional[Dict[str, Any]] = None
    snippet: Optional[Dict[str, Any]] = None
    contacts: Optional[Dict[str, Any]] = None
    schedule: Optional[Dict[str, str]] = None
    working_days: Optional[List[Dict[str, str]]] = None
    working_time_intervals: Optional[List[Dict[str, str]]] = None
    working_time_modes: Optional[List[Dict[str, str]]] = None
    accept_temporary: Optional[bool] = None
    professional_roles: Optional[List[Dict[str, Any]]] = None
    accept_incomplete_resumes: Optional[bool] = None
    experience: Optional[Dict[str, str]] = None
    employment: Optional[Dict[str, str]] = None
    department: Optional[Dict[str, str]] = None
    adv_response_url: Optional[str] = None
    premium: Optional[bool] = None
    has_test: Optional[bool] = None
    response_url: Optional[str] = None

# Job Analytics Schemas
class JobAnalyticsResponse(BaseModel):
    total_recommendations: int
    saved_jobs: int
    applied_jobs: int
    top_skills_demanded: List[Dict[str, Any]]  # skill name and count
    average_salary_range: Dict[str, Optional[int]]  # min, max, currency
    most_active_areas: List[Dict[str, Any]]  # area name and count
    recommendation_accuracy: float  # Based on user feedback
    last_updated: datetime

# Enhanced Dual Recommendation Schemas
class DualRecommendationBlock(BaseModel):
    """Single recommendation block (personal or assessment-based)"""
    source: str  # "onboarding" or "assessment"
    title: str
    description: str
    recommendations: List[JobRecommendationResponse]
    total_found: int

class DualRecommendationResponse(BaseModel):
    """Response containing both recommendation blocks"""
    personal_block: DualRecommendationBlock
    assessment_block: Optional[DualRecommendationBlock] = None
    user_has_assessment: bool
    total_recommendations: int
    generated_at: datetime

# Enhanced Job Recommendation with source
class EnhancedJobRecommendationResponse(JobRecommendationResponse):
    recommendation_source: str  # "onboarding" or "assessment"
    source_explanation: Optional[str] = None  # Why this job was recommended
    detailed_scores: Optional[Dict[str, float]] = None  # Detailed scoring breakdown 