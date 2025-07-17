"""
Celery tasks for automated job recommendation processing
"""

import asyncio
import logging
from typing import List, Optional
from datetime import datetime, timedelta
from celery import Celery
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func

from ..database import async_session
from ..models.user import User
from ..models.onboarding import OnboardingProfile
from ..models.job import JobRecommendation
from ..services.enhanced_headhunter_service import EnhancedHeadHunterService

logger = logging.getLogger(__name__)

# Initialize Celery
celery_app = Celery(
    'job_recommendations',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Almaty',
    enable_utc=True,
    beat_schedule={
        'update-job-recommendations': {
            'task': 'app.tasks.job_recommendations.update_all_user_recommendations',
            'schedule': 3600.0,  # Run every hour
        },
        'cleanup-old-recommendations': {
            'task': 'app.tasks.job_recommendations.cleanup_old_recommendations',
            'schedule': 86400.0,  # Run daily
        },
    }
)

enhanced_hh_service = EnhancedHeadHunterService()

@celery_app.task(bind=True, max_retries=3)
def update_user_recommendations(self, user_id: int):
    """
    Update job recommendations for a specific user
    This task runs the async function in a sync context
    """
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        result = loop.run_until_complete(_update_user_recommendations_async(user_id))
        loop.close()
        
        return result
    except Exception as e:
        logger.error(f"Error updating recommendations for user {user_id}: {e}")
        if self.request.retries < self.max_retries:
            # Retry with exponential backoff
            countdown = 2 ** self.request.retries
            raise self.retry(countdown=countdown, exc=e)
        raise

@celery_app.task(bind=True)
def update_all_user_recommendations(self):
    """
    Update job recommendations for all active users
    Runs every hour via Celery Beat
    """
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        result = loop.run_until_complete(_update_all_users_recommendations_async())
        loop.close()
        
        return result
    except Exception as e:
        logger.error(f"Error in batch recommendation update: {e}")
        raise

@celery_app.task
def cleanup_old_recommendations():
    """
    Clean up old job recommendations (older than 30 days)
    Runs daily via Celery Beat
    """
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        result = loop.run_until_complete(_cleanup_old_recommendations_async())
        loop.close()
        
        return result
    except Exception as e:
        logger.error(f"Error cleaning up old recommendations: {e}")
        raise

# Async helper functions

async def _update_user_recommendations_async(user_id: int) -> dict:
    """Async function to update recommendations for a single user"""
    
    async with async_session() as db:
        try:
            # Get user
            user_result = await db.execute(select(User).where(User.id == user_id))
            user = user_result.scalar_one_or_none()
            
            if not user:
                logger.warning(f"User {user_id} not found")
                return {"success": False, "error": "User not found"}
            
            # Check if user has completed onboarding
            onboarding_result = await db.execute(
                select(OnboardingProfile).where(OnboardingProfile.user_id == user_id)
            )
            onboarding_profile = onboarding_result.scalar_one_or_none()
            
            if not onboarding_profile or not onboarding_profile.is_completed:
                logger.info(f"User {user_id} has not completed onboarding, skipping")
                return {"success": True, "message": "User has not completed onboarding"}
            
            # Check if user needs fresh recommendations (no recommendations in last 6 hours)
            cutoff_time = datetime.utcnow() - timedelta(hours=6)
            recent_recs_result = await db.execute(
                select(func.count(JobRecommendation.id))
                .where(JobRecommendation.user_id == user_id)
                .where(JobRecommendation.created_at >= cutoff_time)
                .where(JobRecommendation.is_active.is_(True))
            )
            recent_count = recent_recs_result.scalar() or 0
            
            if recent_count > 0:
                logger.info(f"User {user_id} has recent recommendations ({recent_count}), skipping")
                return {"success": True, "message": f"User has {recent_count} recent recommendations"}
            
            # Get dual recommendations
            logger.info(f"Updating recommendations for user {user_id}")
            dual_recommendations = await enhanced_hh_service.get_dual_recommendations(
                user, db, page=0, per_page=20, disable_filters=False
            )
            
            # Deactivate old recommendations
            await db.execute(
                JobRecommendation.__table__.update()
                .where(JobRecommendation.user_id == user_id)
                .values(is_active=False)
            )
            
            # Store new recommendations
            total_stored = 0
            all_recommendations = (
                dual_recommendations["personal"] + 
                dual_recommendations["assessment"]
            )
            
            for enhanced_rec in all_recommendations:
                try:
                    vacancy = enhanced_rec.vacancy
                    scores = enhanced_rec.scores
                    
                    # Extract job details
                    salary_info = vacancy.get("salary", {}) or {}
                    area_info = vacancy.get("area", {}) or {}
                    employer_info = vacancy.get("employer", {}) or {}
                    employment_info = vacancy.get("employment", {}) or {}
                    experience_info = vacancy.get("experience", {}) or {}
                    
                    # Create recommendation
                    recommendation = JobRecommendation(
                        user_id=user_id,
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
                    total_stored += 1
                    
                except Exception as e:
                    logger.error(f"Error storing recommendation for user {user_id}: {e}")
                    continue
            
            await db.commit()
            
            logger.info(f"Successfully updated {total_stored} recommendations for user {user_id}")
            return {
                "success": True, 
                "user_id": user_id,
                "recommendations_stored": total_stored,
                "personal_count": len(dual_recommendations["personal"]),
                "assessment_count": len(dual_recommendations["assessment"])
            }
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error updating recommendations for user {user_id}: {e}")
            raise

async def _update_all_users_recommendations_async() -> dict:
    """Async function to update recommendations for all active users"""
    
    async with async_session() as db:
        try:
            # Get all users who have completed onboarding
            users_result = await db.execute(
                select(User.id)
                .join(OnboardingProfile)
                .where(OnboardingProfile.is_completed.is_(True))
                .where(User.is_active.is_(True))
            )
            user_ids = [row[0] for row in users_result.all()]
            
            logger.info(f"Found {len(user_ids)} users for recommendation update")
            
            # Process users in batches to avoid overwhelming the system
            batch_size = 10
            total_processed = 0
            total_errors = 0
            
            for i in range(0, len(user_ids), batch_size):
                batch = user_ids[i:i + batch_size]
                
                # Process batch
                for user_id in batch:
                    try:
                        result = await _update_user_recommendations_async(user_id)
                        if result["success"]:
                            total_processed += 1
                        else:
                            total_errors += 1
                            
                    except Exception as e:
                        logger.error(f"Error processing user {user_id}: {e}")
                        total_errors += 1
                
                # Small delay between batches
                await asyncio.sleep(2)
            
            logger.info(f"Batch update completed: {total_processed} successful, {total_errors} errors")
            return {
                "success": True,
                "total_users": len(user_ids),
                "processed": total_processed,
                "errors": total_errors
            }
            
        except Exception as e:
            logger.error(f"Error in batch recommendation update: {e}")
            raise

async def _cleanup_old_recommendations_async() -> dict:
    """Async function to clean up old recommendations"""
    
    async with async_session() as db:
        try:
            # Delete recommendations older than 30 days
            cutoff_date = datetime.utcnow() - timedelta(days=30)
            
            result = await db.execute(
                select(func.count(JobRecommendation.id))
                .where(JobRecommendation.created_at < cutoff_date)
            )
            old_count = result.scalar() or 0
            
            if old_count > 0:
                # Delete old recommendations
                await db.execute(
                    JobRecommendation.__table__.delete()
                    .where(JobRecommendation.created_at < cutoff_date)
                )
                
                await db.commit()
                logger.info(f"Cleaned up {old_count} old recommendations")
            
            return {
                "success": True,
                "cleaned_up": old_count,
                "cutoff_date": cutoff_date.isoformat()
            }
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error cleaning up old recommendations: {e}")
            raise

# Helper functions

def _extract_description(vacancy: dict) -> Optional[str]:
    """Extract job description from vacancy"""
    description_parts = []
    
    if vacancy.get("description"):
        description_parts.append(vacancy["description"])
    
    snippet = vacancy.get("snippet", {})
    if snippet:
        if snippet.get("responsibility"):
            description_parts.append("Обязанности: " + snippet["responsibility"])
        if snippet.get("requirement"):
            description_parts.append("Требования: " + snippet["requirement"])
    
    full_description = "\n\n".join(description_parts)
    return full_description[:1000] if full_description else None

def _extract_skills(vacancy: dict) -> Optional[List[str]]:
    """Extract skills from vacancy"""
    skills = []
    
    key_skills = vacancy.get("key_skills", [])
    if key_skills:
        for skill in key_skills:
            if isinstance(skill, dict) and skill.get("name"):
                skills.append(skill["name"])
            elif isinstance(skill, str):
                skills.append(skill)
    
    return skills[:10] if skills else None

# Manual task triggers (for testing or manual updates)

@celery_app.task
def trigger_user_update(user_id: int):
    """Manually trigger recommendation update for a specific user"""
    return update_user_recommendations.delay(user_id)

@celery_app.task
def trigger_batch_update():
    """Manually trigger batch update for all users"""
    return update_all_user_recommendations.delay() 