from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, func, update
from typing import List, Optional
import logging
from datetime import datetime, timedelta

from ..database import get_db
from ..models.user import User
from ..models.job import JobRecommendation, SavedJob, JobFeedback, UserJobPreferences
from ..models.onboarding import OnboardingProfile
from ..schemas.job import (
    JobRecommendationListResponse, JobRecommendationResponse,
    SavedJobCreate, SavedJobUpdate, SavedJobResponse,
    JobFeedbackCreate, JobFeedbackResponse,
    UserJobPreferencesCreate, UserJobPreferencesUpdate, UserJobPreferencesResponse,
    PersonalizedJobSearchRequest, HHSearchRequest, JobAnalyticsResponse
)
from ..auth.jwt import get_current_user
from ..services.headhunter_service import HeadHunterService

router = APIRouter(prefix="/api/jobs", tags=["jobs"])
logger = logging.getLogger(__name__)

hh_service = HeadHunterService()

@router.get("/recommendations", response_model=JobRecommendationListResponse)
async def get_job_recommendations(
    page: int = Query(0, ge=0),
    per_page: int = Query(20, ge=1, le=100),
    refresh: bool = Query(False, description="Fetch fresh recommendations from HH API"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get personalized job recommendations for the current user"""
    
    try:
        # If refresh is requested or user has no recent recommendations, fetch new ones
        if refresh or await _should_refresh_recommendations(current_user.id, db): # type: ignore
            logger.info(f"Fetching fresh recommendations for user {current_user.id}")
            
            # Create default search request
            search_request = PersonalizedJobSearchRequest(
                page=page,
                per_page=per_page
            )
            
            # Get fresh recommendations from HH API
            recommendations = await hh_service.get_personalized_recommendations(
                current_user, db, search_request
            )
        else:
            # Get existing recommendations from database
            logger.info(f"Using cached recommendations for user {current_user.id}")
            result = await db.execute(
                select(JobRecommendation)
                .where(JobRecommendation.user_id == current_user.id)
                .where(JobRecommendation.is_active == True)
                .order_by(desc(JobRecommendation.relevance_score))
                .offset(page * per_page)
                .limit(per_page)
            )
            recommendations = result.scalars().all()
        
        # Get total count
        count_result = await db.execute(
            select(func.count(JobRecommendation.id))
            .where(JobRecommendation.user_id == current_user.id)
            .where(JobRecommendation.is_active == True)
        )
        total = count_result.scalar() or 0
        
        # Enrich recommendations with user interaction data
        enriched_recommendations = []
        for rec in recommendations:
            rec_response = JobRecommendationResponse.model_validate(rec)
            
            # Check if job is saved
            saved_result = await db.execute(
                select(SavedJob)
                .where(SavedJob.user_id == current_user.id)
                .where(SavedJob.job_recommendation_id == rec.id)
                .where(SavedJob.is_archived == False)
            )
            rec_response.is_saved = saved_result.scalar_one_or_none() is not None
            
            # Check if user gave feedback
            feedback_result = await db.execute(
                select(JobFeedback)
                .where(JobFeedback.user_id == current_user.id)
                .where(JobFeedback.job_recommendation_id == rec.id)
            )
            feedback = feedback_result.scalar_one_or_none()
            rec_response.user_feedback = feedback.is_relevant if feedback else None # type: ignore
            
            enriched_recommendations.append(rec_response)
        
        total_pages = (total + per_page - 1) // per_page
        
        return JobRecommendationListResponse(
            recommendations=enriched_recommendations,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
        
    except Exception as e:
        logger.error(f"Error getting job recommendations for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job recommendations"
        )

@router.post("/search", response_model=JobRecommendationListResponse)
async def search_personalized_jobs(
    search_request: PersonalizedJobSearchRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search for personalized jobs with custom parameters"""
    
    try:
        # Get personalized recommendations
        recommendations = await hh_service.get_personalized_recommendations(
            current_user, db, search_request
        )
        
        # Update user preferences in background if feedback learning is enabled
        if search_request.use_preferences:
            background_tasks.add_task(
                hh_service.update_preferences_from_feedback,
                current_user.id, # type: ignore
                db
            )
        
        # Convert to response format
        rec_responses = []
        for rec in recommendations:
            rec_response = JobRecommendationResponse.model_validate(rec)
            
            # Check if saved/feedback exists
            saved_result = await db.execute(
                select(SavedJob)
                .where(SavedJob.user_id == current_user.id)
                .where(SavedJob.job_recommendation_id == rec.id)
            )
            rec_response.is_saved = saved_result.scalar_one_or_none() is not None
            
            rec_responses.append(rec_response)
        
        total_pages = 1  # For fresh searches, we only return one page
        
        return JobRecommendationListResponse(
            recommendations=rec_responses,
            total=len(rec_responses),
            page=search_request.page,
            per_page=search_request.per_page,
            total_pages=total_pages
        )
        
    except Exception as e:
        logger.error(f"Error searching personalized jobs for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search personalized jobs"
        )

@router.post("/save", response_model=SavedJobResponse)
async def save_job(
    save_request: SavedJobCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save a job recommendation"""
    
    try:
        # Verify the job recommendation exists and belongs to user
        rec_result = await db.execute(
            select(JobRecommendation)
            .where(JobRecommendation.id == save_request.job_recommendation_id)
            .where(JobRecommendation.user_id == current_user.id)
        )
        recommendation = rec_result.scalar_one_or_none()
        
        if not recommendation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job recommendation not found"
            )
        
        # Check if already saved
        existing_result = await db.execute(
            select(SavedJob)
            .where(SavedJob.user_id == current_user.id)
            .where(SavedJob.job_recommendation_id == save_request.job_recommendation_id)
        )
        existing_saved = existing_result.scalar_one_or_none()
        
        if existing_saved:
            if existing_saved.is_archived: # type: ignore
                # Unarchive existing saved job
                existing_saved.is_archived = False  # type: ignore
                existing_saved.updated_at = datetime.utcnow()  # type: ignore
                await db.commit()
                await db.refresh(existing_saved)
                
                response = SavedJobResponse.model_validate(existing_saved)
                response.job_recommendation = JobRecommendationResponse.model_validate(recommendation)
                return response
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Job already saved"
                )
        
        # Create new saved job
        saved_job = SavedJob(
            user_id=current_user.id,
            **save_request.model_dump()
        )
        
        db.add(saved_job)
        await db.commit()
        await db.refresh(saved_job)
        
        response = SavedJobResponse.model_validate(saved_job)
        response.job_recommendation = JobRecommendationResponse.model_validate(recommendation)
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving job for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save job"
        )

@router.get("/saved", response_model=List[SavedJobResponse])
async def get_saved_jobs(
    include_archived: bool = Query(False),
    application_status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's saved jobs"""
    
    try:
        # Build query
        query = select(SavedJob).where(SavedJob.user_id == current_user.id)
        
        if not include_archived:
            query = query.where(SavedJob.is_archived == False)
        
        if application_status:
            query = query.where(SavedJob.application_status == application_status)
        
        query = query.order_by(desc(SavedJob.created_at))
        
        result = await db.execute(query)
        saved_jobs = result.scalars().all()
        
        # Enrich with job recommendation data
        responses = []
        for saved_job in saved_jobs:
            # Get job recommendation
            rec_result = await db.execute(
                select(JobRecommendation)
                .where(JobRecommendation.id == saved_job.job_recommendation_id)
            )
            recommendation = rec_result.scalar_one_or_none()
            
            if recommendation:
                response = SavedJobResponse.model_validate(saved_job)
                response.job_recommendation = JobRecommendationResponse.model_validate(recommendation)
                responses.append(response)
        
        return responses
        
    except Exception as e:
        logger.error(f"Error getting saved jobs for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get saved jobs"
        )

@router.put("/saved/{saved_job_id}", response_model=SavedJobResponse)
async def update_saved_job(
    saved_job_id: int,
    update_request: SavedJobUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a saved job"""
    
    try:
        # Get saved job
        result = await db.execute(
            select(SavedJob)
            .where(SavedJob.id == saved_job_id)
            .where(SavedJob.user_id == current_user.id)
        )
        saved_job = result.scalar_one_or_none()
        
        if not saved_job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Saved job not found"
            )
        
        # Update fields
        for field, value in update_request.model_dump(exclude_unset=True).items():
            setattr(saved_job, field, value)
        
        saved_job.updated_at = datetime.utcnow()  # type: ignore
        await db.commit()
        await db.refresh(saved_job)
        
        # Get job recommendation
        rec_result = await db.execute(
            select(JobRecommendation)
            .where(JobRecommendation.id == saved_job.job_recommendation_id)
        )
        recommendation = rec_result.scalar_one_or_none()
        
        response = SavedJobResponse.model_validate(saved_job)
        if recommendation:
            response.job_recommendation = JobRecommendationResponse.model_validate(recommendation)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating saved job {saved_job_id} for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update saved job"
        )

@router.post("/feedback", response_model=JobFeedbackResponse)
async def submit_job_feedback(
    feedback_request: JobFeedbackCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit feedback for a job recommendation"""
    
    try:
        # Verify job recommendation exists and belongs to user
        rec_result = await db.execute(
            select(JobRecommendation)
            .where(JobRecommendation.id == feedback_request.job_recommendation_id)
            .where(JobRecommendation.user_id == current_user.id)
        )
        recommendation = rec_result.scalar_one_or_none()
        
        if not recommendation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job recommendation not found"
            )
        
        # Check if feedback already exists
        existing_result = await db.execute(
            select(JobFeedback)
            .where(JobFeedback.user_id == current_user.id)
            .where(JobFeedback.job_recommendation_id == feedback_request.job_recommendation_id)
        )
        existing_feedback = existing_result.scalar_one_or_none()
        
        if existing_feedback:
            # Update existing feedback
            for field, value in feedback_request.model_dump(exclude_unset=True).items():
                if field != "job_recommendation_id":
                    setattr(existing_feedback, field, value)
            
            existing_feedback.updated_at = datetime.utcnow()  # type: ignore
            await db.commit()
            await db.refresh(existing_feedback)
            feedback = existing_feedback
        else:
            # Create new feedback
            feedback = JobFeedback(
                user_id=current_user.id,
                **feedback_request.model_dump()
            )
            db.add(feedback)
            await db.commit()
            await db.refresh(feedback)
        
        # Update user preferences in background based on feedback
        background_tasks.add_task(
            hh_service.update_preferences_from_feedback,
            current_user.id, # type: ignore 
            db
        )
        
        return JobFeedbackResponse.model_validate(feedback)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting feedback for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit feedback"
        )

@router.get("/preferences", response_model=Optional[UserJobPreferencesResponse])
async def get_job_preferences(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's job preferences"""
    
    try:
        result = await db.execute(
            select(UserJobPreferences)
            .where(UserJobPreferences.user_id == current_user.id)
        )
        preferences = result.scalar_one_or_none()
        
        if not preferences:
            return None
        
        return UserJobPreferencesResponse.model_validate(preferences)
        
    except Exception as e:
        logger.error(f"Error getting job preferences for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job preferences"
        )

@router.put("/preferences", response_model=UserJobPreferencesResponse)
async def update_job_preferences(
    preferences_update: UserJobPreferencesUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user's job preferences"""
    
    try:
        # Get or create preferences
        result = await db.execute(
            select(UserJobPreferences)
            .where(UserJobPreferences.user_id == current_user.id)
        )
        preferences = result.scalar_one_or_none()
        
        if not preferences:
            # Create new preferences
            preferences_data = preferences_update.model_dump(exclude_unset=True)
            preferences_data["user_id"] = current_user.id
            preferences = UserJobPreferences(**preferences_data)
            db.add(preferences)
        else:
            # Update existing preferences
            for field, value in preferences_update.model_dump(exclude_unset=True).items():
                setattr(preferences, field, value)
            preferences.updated_at = datetime.utcnow()  # type: ignore
        
        await db.commit()
        await db.refresh(preferences)
        
        return UserJobPreferencesResponse.model_validate(preferences)
        
    except Exception as e:
        logger.error(f"Error updating job preferences for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update job preferences"
        )

@router.get("/analytics", response_model=JobAnalyticsResponse)
async def get_job_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get job analytics for the user"""
    
    try:
        # Get counts
        total_rec_result = await db.execute(
            select(func.count(JobRecommendation.id))
            .where(JobRecommendation.user_id == current_user.id)
        )
        total_recommendations = total_rec_result.scalar() or 0
        
        saved_jobs_result = await db.execute(
            select(func.count(SavedJob.id))
            .where(SavedJob.user_id == current_user.id)
            .where(SavedJob.is_archived == False)
        )
        saved_jobs = saved_jobs_result.scalar() or 0
        
        applied_jobs_result = await db.execute(
            select(func.count(SavedJob.id))
            .where(SavedJob.user_id == current_user.id)
            .where(SavedJob.application_status.in_(["applied", "interview"]))
        )
        applied_jobs = applied_jobs_result.scalar() or 0
        
        # Get top skills from recommendations
        skills_result = await db.execute(
            select(JobRecommendation.key_skills)
            .where(JobRecommendation.user_id == current_user.id)
            .where(JobRecommendation.key_skills.isnot(None))
        )
        
        skill_count = {}
        for row in skills_result.scalars():
            if row:
                for skill in row:
                    skill_count[skill] = skill_count.get(skill, 0) + 1
        
        top_skills = [
            {"skill": skill, "count": count}
            for skill, count in sorted(skill_count.items(), key=lambda x: x[1], reverse=True)[:10]
        ]
        
        # Get salary range
        salary_result = await db.execute(
            select(
                func.avg(JobRecommendation.salary_from),
                func.avg(JobRecommendation.salary_to)
            )
            .where(JobRecommendation.user_id == current_user.id)
            .where(JobRecommendation.salary_from.isnot(None))
        )
        salary_data = salary_result.first()
        
        avg_salary_range = {
            "min": int(salary_data[0]) if salary_data and salary_data[0] else None,
            "max": int(salary_data[1]) if salary_data and salary_data[1] else None,
            "currency": "KZT"
        }
        
        # Get most active areas
        area_result = await db.execute(
            select(
                JobRecommendation.area_name,
                func.count(JobRecommendation.id).label("count")
            )
            .where(JobRecommendation.user_id == current_user.id)
            .where(JobRecommendation.area_name.isnot(None))
            .group_by(JobRecommendation.area_name)
            .order_by(desc("count"))
            .limit(10)
        )
        
        most_active_areas = [
            {"area": row[0], "count": row[1]}
            for row in area_result.all()
        ]
        
        # Calculate recommendation accuracy based on positive feedback
        feedback_result = await db.execute(
            select(
                func.count(JobFeedback.id).label("total"),
                func.count(JobFeedback.id).filter(JobFeedback.is_relevant == True).label("positive")
            )
            .where(JobFeedback.user_id == current_user.id)
        )
        feedback_data = feedback_result.first()
        
        recommendation_accuracy = 0.0
        if feedback_data and feedback_data[0] > 0:
            recommendation_accuracy = feedback_data[1] / feedback_data[0]
        
        return JobAnalyticsResponse(
            total_recommendations=total_recommendations,
            saved_jobs=saved_jobs,
            applied_jobs=applied_jobs,
            top_skills_demanded=top_skills,
            average_salary_range=avg_salary_range,
            most_active_areas=most_active_areas,
            recommendation_accuracy=recommendation_accuracy,
            last_updated=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Error getting job analytics for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job analytics"
        )

@router.get("/debug/skills")
async def debug_user_skills(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Debug endpoint to check user skills and preferences"""
    
    try:
        # Get user preferences
        prefs_result = await db.execute(
            select(UserJobPreferences).where(UserJobPreferences.user_id == current_user.id)
        )
        preferences = prefs_result.scalar_one_or_none()
        
        # Get onboarding profile
        onboarding_result = await db.execute(
            select(OnboardingProfile).where(OnboardingProfile.user_id == current_user.id)
        )
        onboarding_profile = onboarding_result.scalar_one_or_none()
        
        # Get recent recommendations with skills
        rec_result = await db.execute(
            select(JobRecommendation)
            .where(JobRecommendation.user_id == current_user.id)
            .order_by(desc(JobRecommendation.created_at))
            .limit(5)
        )
        recent_recommendations = rec_result.scalars().all()
        
        debug_info = {
            "user_id": current_user.id,
            "onboarding_completed": onboarding_profile.is_completed if onboarding_profile else False,
            "onboarding_skills": getattr(onboarding_profile, 'skills', None) if onboarding_profile else None,
            "preferences_exist": preferences is not None,
            "preferred_skills": getattr(preferences, 'preferred_skills', None) if preferences else None,
            "preferred_job_titles": getattr(preferences, 'preferred_job_titles', None) if preferences else None,
            "preferred_areas": getattr(preferences, 'preferred_areas', None) if preferences else None,
            "recent_recommendations": [
                {
                    "id": rec.id,
                    "title": rec.title,
                    "skills_match_score": rec.skills_match_score,
                    "key_skills": rec.key_skills,
                    "relevance_score": rec.relevance_score
                }
                for rec in recent_recommendations
            ]
        }
        
        return debug_info
        
    except Exception as e:
        logger.error(f"Error in debug skills for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get debug information"
        )

async def _should_refresh_recommendations(user_id: int, db: AsyncSession) -> bool:
    """Check if user's recommendations should be refreshed"""
    
    # Check if user has any recommendations from the last 24 hours
    cutoff_time = datetime.utcnow() - timedelta(hours=24)
    
    result = await db.execute(
        select(func.count(JobRecommendation.id))
        .where(JobRecommendation.user_id == user_id)
        .where(JobRecommendation.created_at >= cutoff_time)
    )
    recent_count = result.scalar() or 0
    
    # Refresh if no recent recommendations
    return recent_count == 0 