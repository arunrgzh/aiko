from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, func
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime, timedelta

from ..database import get_db
from ..models.user import User
from ..models.job import JobRecommendation
from ..schemas.job import (
    DualRecommendationResponse, 
    DualRecommendationBlock,
    EnhancedJobRecommendationResponse,
    JobRecommendationResponse
)
from ..auth.jwt import get_current_user
from ..services.enhanced_headhunter_service import EnhancedHeadHunterService, EnhancedRecommendation

router = APIRouter(prefix="/api/enhanced-jobs", tags=["enhanced-jobs"])
logger = logging.getLogger(__name__)

enhanced_hh_service = EnhancedHeadHunterService()

@router.get("/dual-recommendations", response_model=DualRecommendationResponse)
async def get_dual_recommendations(
    page: int = Query(0, ge=0),
    per_page: int = Query(20, ge=1, le=50),
    refresh: bool = Query(False, description="Fetch fresh recommendations from HH API"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dual job recommendations: personal (onboarding-based) + assessment-based
    
    Returns two blocks:
    1. Personal recommendations based on onboarding profile
    2. Assessment-based recommendations (if user has completed assessment)
    """
    
    try:
        logger.info(f"Getting dual recommendations for user {current_user.id}")
        
        # Get dual recommendations from enhanced service
        dual_recommendations = await enhanced_hh_service.get_dual_recommendations(
            current_user, db, page, per_page
        )
        
        # Convert to response format
        personal_recommendations = []
        assessment_recommendations = []
        
        # Process personal recommendations
        for enhanced_rec in dual_recommendations["personal"]:
            job_response = await _convert_to_job_response(enhanced_rec, current_user, db)
            personal_recommendations.append(job_response)
        
        # Process assessment recommendations
        for enhanced_rec in dual_recommendations["assessment"]:
            job_response = await _convert_to_job_response(enhanced_rec, current_user, db)
            assessment_recommendations.append(job_response)
        
        # Create personal block
        personal_block = DualRecommendationBlock(
            source="onboarding",
            title="Персональные рекомендации",
            description="Вакансии, подобранные на основе ваших предпочтений и опыта из анкеты",
            recommendations=personal_recommendations,
            total_found=len(personal_recommendations)
        )
        
        # Create assessment block if available
        assessment_block = None
        user_has_assessment = len(assessment_recommendations) > 0
        
        if user_has_assessment:
            assessment_block = DualRecommendationBlock(
                source="assessment",
                title="Рекомендации на основе тестирования",
                description="Дополнительные вакансии, подобранные на основе результатов вашего профессионального тестирования",
                recommendations=assessment_recommendations,
                total_found=len(assessment_recommendations)
            )
        
        # Create final response
        response = DualRecommendationResponse(
            personal_block=personal_block,
            assessment_block=assessment_block,
            user_has_assessment=user_has_assessment,
            total_recommendations=len(personal_recommendations) + len(assessment_recommendations),
            generated_at=datetime.utcnow()
        )
        
        # Store recommendations in database for future reference
        await _store_recommendations_batch(dual_recommendations, current_user, db)
        
        logger.info(f"Successfully generated dual recommendations for user {current_user.id}: {response.total_recommendations} total")
        
        return response
        
    except Exception as e:
        logger.error(f"Error getting dual recommendations for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get dual recommendations"
        )

@router.get("/vacancy/{vacancy_id}")
async def get_vacancy_details(
    vacancy_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed vacancy information from HeadHunter API
    Can be used to show full job details in modal or separate page
    """
    
    try:
        import httpx
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.hh.kz/vacancies/{vacancy_id}",
                headers={
                    "User-Agent": "AI-Komekshi Job Platform Parser",
                    "Accept": "application/json"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                vacancy_data = response.json()
                
                # Add additional processing here if needed
                # e.g., track that user viewed this vacancy
                
                return {
                    "success": True,
                    "vacancy": vacancy_data,
                    "alternate_url": vacancy_data.get("alternate_url"),  # Link to hh.ru
                    "has_contacts": "contacts" in vacancy_data and vacancy_data["contacts"]
                }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to fetch vacancy details from HeadHunter"
                )
                
    except httpx.RequestError as e:
        logger.error(f"Network error fetching vacancy {vacancy_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Network error while fetching vacancy details"
        )
    except Exception as e:
        logger.error(f"Error fetching vacancy {vacancy_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch vacancy details"
        )

@router.post("/trigger-update")
async def trigger_recommendation_update(
    current_user: User = Depends(get_current_user)
):
    """
    Manually trigger recommendation update for current user
    Useful for immediate updates after profile changes
    """
    
    try:
        from ..tasks.job_recommendations import trigger_user_update
        
        # Trigger async task
        task = trigger_user_update.delay(current_user.id)
        
        logger.info(f"Triggered recommendation update for user {current_user.id}, task ID: {task.id}")
        
        return {
            "success": True,
            "message": "Recommendation update triggered",
            "task_id": task.id,
            "user_id": current_user.id
        }
        
    except Exception as e:
        logger.error(f"Error triggering recommendation update for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to trigger recommendation update"
        )

@router.post("/admin/trigger-batch-update")
async def trigger_batch_recommendation_update(
    current_user: User = Depends(get_current_user)
):
    """
    Manually trigger batch recommendation update for all users
    Admin endpoint - requires admin privileges
    """
    
    # TODO: Add admin role check
    # if not current_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        from ..tasks.job_recommendations import trigger_batch_update
        
        # Trigger async batch task
        task = trigger_batch_update.delay()
        
        logger.info(f"Triggered batch recommendation update by user {current_user.id}, task ID: {task.id}")
        
        return {
            "success": True,
            "message": "Batch recommendation update triggered",
            "task_id": task.id,
            "triggered_by": current_user.id
        }
        
    except Exception as e:
        logger.error(f"Error triggering batch recommendation update: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to trigger batch recommendation update"
        )

@router.get("/task-status/{task_id}")
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get status of a recommendation update task
    """
    
    try:
        from ..tasks.job_recommendations import celery_app
        
        # Get task result
        task_result = celery_app.AsyncResult(task_id)
        
        response = {
            "task_id": task_id,
            "status": task_result.status,
            "ready": task_result.ready(),
        }
        
        if task_result.ready():
            if task_result.successful():
                response["result"] = task_result.result
            else:
                response["error"] = str(task_result.info)
        
        return response
        
    except Exception as e:
        logger.error(f"Error getting task status for {task_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get task status"
        )

# Helper functions

async def _convert_to_job_response(
    enhanced_rec: EnhancedRecommendation,
    current_user: User,
    db: AsyncSession
) -> EnhancedJobRecommendationResponse:
    """Convert enhanced recommendation to API response format"""
    
    vacancy = enhanced_rec.vacancy
    scores = enhanced_rec.scores
    
    # Extract job details
    salary_info = vacancy.get("salary", {}) or {}
    area_info = vacancy.get("area", {}) or {}
    employer_info = vacancy.get("employer", {}) or {}
    employment_info = vacancy.get("employment", {}) or {}
    experience_info = vacancy.get("experience", {}) or {}
    
    # Create base job recommendation response
    job_response = EnhancedJobRecommendationResponse(
        id=0,  # This will be set if stored in DB
        hh_vacancy_id=vacancy["id"],
        title=vacancy.get("name", ""),
        company_name=employer_info.get("name"),
        salary_from=salary_info.get("from"),
        salary_to=salary_info.get("to"),
        currency=salary_info.get("currency", "KZT"),
        area_name=area_info.get("name"),
        employment_type=employment_info.get("name"),
        experience_required=experience_info.get("name"),
        description=_extract_description(vacancy),
        key_skills=_extract_skills(vacancy),
        accept_handicapped_filter=enhanced_rec.accept_handicapped_filter,  # Add accessibility filter indicator
        relevance_score=scores.get("relevance_score", 0.0),
        skills_match_score=scores.get("skills_match_score", 0.0),
        location_match_score=scores.get("location_match_score", 0.0),
        salary_match_score=scores.get("salary_match_score", 0.0),
        is_saved=False,  # TODO: Check if user saved this job
        user_feedback=None,  # TODO: Check if user gave feedback
        created_at=datetime.utcnow(),
        
        # Enhanced fields
        recommendation_source=enhanced_rec.source,
        source_explanation=_get_source_explanation(enhanced_rec.source, scores),
        detailed_scores=scores
    )
    
    return job_response

def _extract_description(vacancy: Dict[str, Any]) -> Optional[str]:
    """Extracts the full description from a vacancy"""
    snippet = vacancy.get("snippet", {}) or {}
    return (snippet.get("requirement") or "") + "\n" + (snippet.get("responsibility") or "")

def _extract_skills(vacancy: Dict[str, Any]) -> Optional[List[str]]:
    """Extract key skills from vacancy data, handling the correct format."""
    key_skills_raw = vacancy.get("key_skills", [])
    if isinstance(key_skills_raw, list) and key_skills_raw:
        # Check if the list contains dictionaries with a "name" key
        if isinstance(key_skills_raw[0], dict) and "name" in key_skills_raw[0]:
            return [skill["name"] for skill in key_skills_raw if "name" in skill]
        # Fallback for a simple list of strings, although less common
        elif isinstance(key_skills_raw[0], str):
            return key_skills_raw
    return None

def _get_source_explanation(source: str, scores: Dict[str, float]) -> str:
    """Generate explanation for why this job was recommended"""
    
    if source == "onboarding":
        explanations = []
        
        if scores.get("skills_match_score", 0) > 0.7:
            explanations.append("высокое совпадение навыков")
        if scores.get("location_match_score", 0) > 0.8:
            explanations.append("подходящее местоположение")
        if scores.get("salary_match_score", 0) > 0.7:
            explanations.append("соответствует зарплатным ожиданиям")
        
        if explanations:
            return f"Рекомендовано на основе анкеты: {', '.join(explanations)}"
        else:
            return "Рекомендовано на основе вашей анкеты"
    
    elif source == "assessment":
        explanations = []
        
        if scores.get("strength_match_score", 0) > 0.7:
            explanations.append("соответствует вашим сильным сторонам")
        if scores.get("job_fit_score", 0) > 0.7:
            explanations.append("подходит вашему уровню")
        if scores.get("growth_potential_score", 0) > 0.5:
            explanations.append("хорошие возможности для развития")
        
        if explanations:
            return f"Рекомендовано на основе тестирования: {', '.join(explanations)}"
        else:
            return "Рекомендовано на основе результатов тестирования"
    
    return "Персональная рекомендация"

async def _store_recommendations_batch(
    dual_recommendations: Dict[str, List[EnhancedRecommendation]],
    current_user: User,
    db: AsyncSession
):
    """Store batch of recommendations in database for future reference"""
    
    try:
        all_recommendations = dual_recommendations["personal"] + dual_recommendations["assessment"]
        
        for enhanced_rec in all_recommendations:
            # Check if already exists
            existing = await db.execute(
                select(JobRecommendation).where(
                    and_(
                        JobRecommendation.user_id == current_user.id,
                        JobRecommendation.hh_vacancy_id == enhanced_rec.hh_vacancy_id
                    )
                )
            )
            
            if not existing.scalar_one_or_none():
                # Create new recommendation
                vacancy = enhanced_rec.vacancy
                scores = enhanced_rec.scores
                
                salary_info = vacancy.get("salary", {}) or {}
                area_info = vacancy.get("area", {}) or {}
                employer_info = vacancy.get("employer", {}) or {}
                employment_info = vacancy.get("employment", {}) or {}
                experience_info = vacancy.get("experience", {}) or {}
                
                recommendation = JobRecommendation(
                    user_id=current_user.id,
                    hh_vacancy_id=vacancy["id"],
                    title=vacancy.get("name", ""),
                    company_name=employer_info.get("name"),
                    salary_from=salary_info.get("from"),
                    salary_to=salary_info.get("to"),
                    currency=salary_info.get("currency", "KZT"),
                    area_name=area_info.get("name"),
                    employment_type=employment_info.get("name"),
                    experience_required=experience_info.get("name"),
                    description=_extract_description(vacancy),
                    key_skills=_extract_skills(vacancy),
                    relevance_score=scores.get("relevance_score", 0.0),
                    skills_match_score=scores.get("skills_match_score", 0.0),
                    location_match_score=scores.get("location_match_score", 0.0),
                    salary_match_score=scores.get("salary_match_score", 0.0),
                    raw_data=vacancy,
                    is_active=True
                )
                
                db.add(recommendation)
        
        await db.commit()
        logger.info(f"Stored {len(all_recommendations)} recommendations for user {current_user.id}")
        
    except Exception as e:
        logger.error(f"Error storing recommendations batch: {e}")
        await db.rollback() 