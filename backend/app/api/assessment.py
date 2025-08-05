from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional, Dict, Any
import json
from datetime import datetime

from ..database import get_db
from ..models.user import User
from ..models.assessment import AssessmentQuestion, AssessmentResult, ProfileSummary
from ..models.onboarding import OnboardingProfile
from ..schemas.assessment import (
    AssessmentSubmission, 
    AssessmentResultResponse, 
    AssessmentQuestionsResponse,
    AssessmentQuestionResponse,
    ProfileSummaryResponse,
    TakeAssessmentOption,
    AssessmentStrength,
    AssessmentWeakness
)
from ..auth.jwt import get_current_user

router = APIRouter(prefix="/api/assessment", tags=["assessment"])

# Import strength assessment logic from seed script
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
from app.utils.strength_assessment import calculate_profile_scores, STRENGTH_PROFILES

# Temporary non-authenticated endpoint for testing
@router.get("/questions-test", response_model=AssessmentQuestionsResponse)
async def get_assessment_questions_test(
    assessment_type: str = "strength_assessment",
    db: AsyncSession = Depends(get_db)
):
    """Получить вопросы для оценки сильных сторон (тестовая версия без авторизации)"""
    
    # Get questions from database instead of hardcoded sample
    result = await db.execute(
        select(AssessmentQuestion).where(AssessmentQuestion.is_active.is_(True))
    )
    questions = result.scalars().all()
    
    if not questions:
        # Return sample questions if database is empty
        sample_questions = [
            {
                "id": 1,
                "question_text": "Как вы чувствуете себя при общении с новыми людьми?",
                "question_type": "single_choice",
                "assessment_category": "communication",
                "options": [
                    "Легко завожу разговор и чувствую себя комфортно",
                    "Немного стесняюсь, но быстро привыкаю", 
                    "Предпочитаю слушать, а не говорить",
                    "Чувствую себя неуверенно, нужно время"
                ],
                "weight": 1.0
            },
            {
                "id": 2,
                "question_text": "Когда вам нужно объяснить что-то сложное:",
                "question_type": "single_choice",
                "assessment_category": "communication",
                "options": [
                    "Использую примеры и аналогии",
                    "Разбиваю на простые части",
                    "Показываю на практике",
                    "Прошу коллег помочь с объяснением"
                ],
                "weight": 1.0
            },
            {
                "id": 3,
                "question_text": "Как вы планируете свой рабочий день?",
                "question_type": "single_choice",
                "assessment_category": "organization",
                "options": [
                    "Составляю подробный план заранее",
                    "Делаю общий список задач",
                    "Планирую по ходу дня",
                    "Реагирую на ситуации по мере поступления"
                ],
                "weight": 1.0
            }
        ]
        
        return AssessmentQuestionsResponse(
            questions=[
                AssessmentQuestionResponse(**q) for q in sample_questions
            ],
            total_questions=len(sample_questions)
        )
    
    return AssessmentQuestionsResponse(
        questions=[
            AssessmentQuestionResponse(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                assessment_category=q.assessment_category,
                options=q.options,
                weight=q.weight
            ) for q in questions
        ],
        total_questions=len(questions)
    )

@router.get("/questions", response_model=AssessmentQuestionsResponse)
async def get_assessment_questions(
    assessment_type: str = "strength_assessment",  # Changed from skills_assessment
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить вопросы для оценки сильных сторон"""
    
    # Handle both old and new assessment types
    if assessment_type == "skills_assessment":
        assessment_type = "strength_assessment"
    
    # Get questions from database instead of hardcoded sample
    result = await db.execute(
        select(AssessmentQuestion).where(AssessmentQuestion.is_active.is_(True))
    )
    questions = result.scalars().all()
    
    if not questions:
        # Return sample questions if database is empty instead of throwing error
        sample_questions = [
            {
                "id": 1,
                "question_text": "Как вы чувствуете себя при общении с новыми людьми?",
                "question_type": "single_choice",
                "assessment_category": "communication",
                "options": [
                    "Легко завожу разговор и чувствую себя комфортно",
                    "Немного стесняюсь, но быстро привыкаю", 
                    "Предпочитаю слушать, а не говорить",
                    "Чувствую себя неуверенно, нужно время"
                ],
                "weight": 1.0
            },
            {
                "id": 2,
                "question_text": "Когда вам нужно объяснить что-то сложное:",
                "question_type": "single_choice",
                "assessment_category": "communication",
                "options": [
                    "Использую примеры и аналогии",
                    "Разбиваю на простые части",
                    "Показываю на практике",
                    "Прошу коллег помочь с объяснением"
                ],
                "weight": 1.0
            },
            {
                "id": 3,
                "question_text": "В групповых дискуссиях вы чаще:",
                "question_type": "single_choice", 
                "assessment_category": "communication",
                "options": [
                    "Активно выражаю свою точку зрения",
                    "Внимательно слушаю других",
                    "Пытаюсь найти компромисс",
                    "Поддерживаю других участников"
                ],
                "weight": 1.0
            },
            {
                "id": 4,
                "question_text": "Как вы планируете свой рабочий день?",
                "question_type": "single_choice",
                "assessment_category": "organization",
                "options": [
                    "Составляю подробный план заранее",
                    "Делаю общий список задач",
                    "Планирую по ходу дня",
                    "Реагирую на ситуации по мере поступления"
                ],
                "weight": 1.0
            },
            {
                "id": 5,
                "question_text": "При работе над проектом вы предпочитаете:",
                "question_type": "single_choice",
                "assessment_category": "organization", 
                "options": [
                    "Четко следовать плану и срокам",
                    "Гибко адаптироваться к изменениям",
                    "Сначала изучить все детали",
                    "Начать с самого интересного"
                ],
                "weight": 1.0
            },
            {
                "id": 6,
                "question_text": "Когда у вас много задач одновременно:",
                "question_type": "single_choice",
                "assessment_category": "organization",
                "options": [
                    "Расставляю приоритеты и выполняю по порядку",
                    "Делаю несколько задач параллельно",
                    "Сначала делаю простые, потом сложные",
                    "Прошу помощи в распределении задач"
                ],
                "weight": 1.0
            }
        ]
        
        return AssessmentQuestionsResponse(
            questions=[
                AssessmentQuestionResponse(**q) for q in sample_questions
            ],
            total_questions=len(sample_questions)
        )
    
    return AssessmentQuestionsResponse(
        questions=[
            AssessmentQuestionResponse(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                assessment_category=q.assessment_category,
                options=q.options,
                weight=q.weight
            ) for q in questions
        ],
        total_questions=len(questions)
    )

@router.post("/submit", response_model=AssessmentResultResponse)
async def submit_assessment(
    submission: AssessmentSubmission,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отправить ответы на оценку сильных сторон и получить результаты"""
    
    # Get questions from database
    result = await db.execute(
        select(AssessmentQuestion).where(AssessmentQuestion.is_active.is_(True))
    )
    questions = result.scalars().all()
    
    if not questions:
        # Use sample questions if database is empty
        sample_questions = [
            {
                "id": 1,
                "question_text": "Как вы чувствуете себя при общении с новыми людьми?",
                "question_type": "single_choice",
                "assessment_category": "communication",
                "options": [
                    "Легко завожу разговор и чувствую себя комфортно",
                    "Немного стесняюсь, но быстро привыкаю", 
                    "Предпочитаю слушать, а не говорить",
                    "Чувствую себя неуверенно, нужно время"
                ],
                "weight": 1.0
            },
            {
                "id": 2,
                "question_text": "Когда вам нужно объяснить что-то сложное:",
                "question_type": "single_choice",
                "assessment_category": "communication",
                "options": [
                    "Использую примеры и аналогии",
                    "Разбиваю на простые части",
                    "Показываю на практике",
                    "Прошу коллег помочь с объяснением"
                ],
                "weight": 1.0
            },
            {
                "id": 3,
                "question_text": "В групповых дискуссиях вы чаще:",
                "question_type": "single_choice", 
                "assessment_category": "communication",
                "options": [
                    "Активно выражаю свою точку зрения",
                    "Внимательно слушаю других",
                    "Пытаюсь найти компромисс",
                    "Поддерживаю других участников"
                ],
                "weight": 1.0
            },
            {
                "id": 4,
                "question_text": "Как вы планируете свой рабочий день?",
                "question_type": "single_choice",
                "assessment_category": "organization",
                "options": [
                    "Составляю подробный план заранее",
                    "Делаю общий список задач",
                    "Планирую по ходу дня",
                    "Реагирую на ситуации по мере поступления"
                ],
                "weight": 1.0
            },
            {
                "id": 5,
                "question_text": "При работе над проектом вы предпочитаете:",
                "question_type": "single_choice",
                "assessment_category": "organization", 
                "options": [
                    "Четко следовать плану и срокам",
                    "Гибко адаптироваться к изменениям",
                    "Сначала изучить все детали",
                    "Начать с самого интересного"
                ],
                "weight": 1.0
            },
            {
                "id": 6,
                "question_text": "Когда у вас много задач одновременно:",
                "question_type": "single_choice",
                "assessment_category": "organization",
                "options": [
                    "Расставляю приоритеты и выполняю по порядку",
                    "Делаю несколько задач параллельно",
                    "Сначала делаю простые, потом сложные",
                    "Прошу помощи в распределении задач"
                ],
                "weight": 1.0
            }
        ]
        
        # Create mock question objects for processing
        class MockQuestion:
            def __init__(self, data):
                self.id = data["id"]
                self.question_text = data["question_text"]
                self.question_type = data["question_type"]
                self.assessment_category = data["assessment_category"]
                self.options = data["options"]
                self.weight = data["weight"]
        
        questions = [MockQuestion(q) for q in sample_questions]

    # Extract answer indices for profile calculation
    answer_indices = []
    for answer in submission.answers:
        question = next((q for q in questions if q.id == answer.question_id), None)
        if question and question.options:
            try:
                # Find the index of the selected answer in options
                answer_index = question.options.index(str(answer.answer))
                answer_indices.append(answer_index)
            except (ValueError, IndexError):
                answer_indices.append(0)  # Default to first option if not found
        else:
            answer_indices.append(0)

    # Calculate profile scores using the new logic
    profile_scores = calculate_profile_scores(answer_indices)
    
    # Find primary strength profile
    primary_profile = max(profile_scores.items(), key=lambda x: x[1])[0]
    profile_data = STRENGTH_PROFILES[primary_profile]
    
    # Convert profile scores to category scores for compatibility
    category_mapping = {
        "communicative_leader": "communication",
        "organizer": "organization", 
        "technical_specialist": "technical",
        "executor": "execution",
        "team_player": "teamwork",
        "independent_worker": "independence"
    }
    
    # Create strengths and weaknesses from profile scores
    strengths = []
    weaknesses = []
    
    for profile, score in profile_scores.items():
        category = category_mapping.get(profile, profile)
        if score >= 25:  # High score threshold
            strengths.append(AssessmentStrength(
                category=category,
                score=min(score / 5, 10.0),  # Normalize to 0-10 scale
                description=STRENGTH_PROFILES[profile]["description"]
            ))
        elif score <= 15:  # Low score threshold
            weaknesses.append(AssessmentWeakness(
                category=category,
                score=min(score / 5, 10.0),  # Normalize to 0-10 scale
                description=f"Область для развития: {STRENGTH_PROFILES[profile]['name']}"
            ))
    
    # Ensure we have at least some strengths and weaknesses
    if not strengths:
        strengths = [AssessmentStrength(
            category=category_mapping[primary_profile],
            score=8.0,
            description=profile_data["description"]
        )]
    
    if not weaknesses:
        # Find lowest scoring profile
        lowest_profile = min(profile_scores.items(), key=lambda x: x[1])[0]
        weaknesses = [AssessmentWeakness(
            category=category_mapping[lowest_profile],
            score=3.0,
            description=f"Область для развития: {STRENGTH_PROFILES[lowest_profile]['name']}"
        )]
    
    # Generate AI analysis
    strengths_analysis = _generate_strengths_analysis(strengths, profile_data)
    weaknesses_analysis = _generate_weaknesses_analysis(weaknesses)
    improvement_suggestions = _generate_improvement_suggestions(weaknesses, profile_data)
    
    # Calculate overall score
    overall_score = sum(profile_scores.values()) / len(profile_scores) / 5  # Normalize to 0-10
    
    # Create assessment result
    assessment_result = AssessmentResult(
        user_id=current_user.id,
        assessment_type=submission.assessment_type,
        version="1.0",
        raw_answers={"answers": [{"question_id": a.question_id, "answer": a.answer} for a in submission.answers]},
        top_strengths=[s.dict() for s in strengths],
        top_weaknesses=[w.dict() for w in weaknesses],
        strengths_analysis=strengths_analysis,
        weaknesses_analysis=weaknesses_analysis,
        improvement_suggestions=improvement_suggestions,
        overall_score=overall_score,
        confidence_level=0.85
        # Temporarily removed new fields until database migration:
        # strength_profile=primary_profile,
        # profile_scores=profile_scores,
        # recommended_spheres=profile_data["recommended_spheres"]
    )
    
    db.add(assessment_result)
    await db.commit()
    await db.refresh(assessment_result)
    
    # Generate and store profile summary based on assessment
    summary_text = _generate_profile_summary_from_assessment(strengths, weaknesses, strengths_analysis, profile_data)
    await _create_or_update_profile_summary(db, current_user.id, summary_text, "assessment")
    
    # Manually create response to avoid database validation issues
    result_data = AssessmentResultResponse(
        id=assessment_result.id,
        user_id=assessment_result.user_id,
        assessment_type=assessment_result.assessment_type,
        version=assessment_result.version,
        top_strengths=strengths,
        top_weaknesses=weaknesses,
        strengths_analysis=assessment_result.strengths_analysis,
        weaknesses_analysis=assessment_result.weaknesses_analysis,
        improvement_suggestions=assessment_result.improvement_suggestions,
        overall_score=assessment_result.overall_score,
        confidence_level=assessment_result.confidence_level,
        # Add the profile data that's not in database yet
        strength_profile=primary_profile,
        profile_scores=profile_scores,
        recommended_spheres=profile_data["recommended_spheres"],
        created_at=assessment_result.created_at,
        updated_at=assessment_result.updated_at
    )
    return result_data

@router.get("/results/{assessment_id}", response_model=AssessmentResultResponse)
async def get_assessment_result(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить результаты конкретной оценки"""
    
    result = await db.execute(
        select(AssessmentResult)
        .where(AssessmentResult.id == assessment_id)
        .where(AssessmentResult.user_id == current_user.id)
    )
    assessment_result = result.scalar_one_or_none()
    
    if not assessment_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment result not found"
        )
    
    # Convert JSON data back to Pydantic models
    strengths = [AssessmentStrength(**s) for s in assessment_result.top_strengths]  # type: ignore
    weaknesses = [AssessmentWeakness(**w) for w in assessment_result.top_weaknesses]  # type: ignore
    
    return AssessmentResultResponse.model_validate(assessment_result)  # type: ignore

@router.get("/results", response_model=List[AssessmentResultResponse])
async def get_user_assessment_results(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все результаты оценок пользователя"""
    
    result = await db.execute(
        select(AssessmentResult)
        .where(AssessmentResult.user_id == current_user.id)
        .order_by(AssessmentResult.created_at.desc())
    )
    assessment_results = result.scalars().all()
    
    return [AssessmentResultResponse.model_validate(ar) for ar in assessment_results]  # type: ignore

@router.get("/profile-summary", response_model=Optional[ProfileSummaryResponse])
async def get_profile_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить сводку профиля пользователя"""
    
    result = await db.execute(
        select(ProfileSummary).where(ProfileSummary.user_id == current_user.id)
    )
    profile_summary = result.scalar_one_or_none()
    
    if not profile_summary:
        return None
    
    return ProfileSummaryResponse.model_validate(profile_summary)  # type: ignore

# Admin endpoints for managing assessment questions
@router.post("/admin/questions", response_model=AssessmentQuestionResponse)
async def create_assessment_question(
    question_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый вопрос для оценки (только для админов)"""
    # TODO: Add admin role check
    # if not current_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Admin access required")
    
    question = AssessmentQuestion(**question_data)
    db.add(question)
    await db.commit()
    await db.refresh(question)
    
    return AssessmentQuestionResponse(
        id=question.id,
        question_text=question.question_text,
        question_type=question.question_type,
        assessment_category=question.assessment_category,
        options=question.options or [],
        weight=question.weight
    )

@router.put("/admin/questions/{question_id}", response_model=AssessmentQuestionResponse)
async def update_assessment_question(
    question_id: int,
    question_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить вопрос для оценки (только для админов)"""
    # TODO: Add admin role check
    
    result = await db.execute(
        select(AssessmentQuestion).where(AssessmentQuestion.id == question_id)
    )
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Update question fields
    for field, value in question_data.items():
        if hasattr(question, field):
            setattr(question, field, value)
    
    await db.commit()
    await db.refresh(question)
    
    return AssessmentQuestionResponse(
        id=question.id,
        question_text=question.question_text,
        question_type=question.question_type,
        assessment_category=question.assessment_category,
        options=question.options or [],
        weight=question.weight
    )

@router.delete("/admin/questions/{question_id}")
async def delete_assessment_question(
    question_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить вопрос для оценки (только для админов)"""
    # TODO: Add admin role check
    
    result = await db.execute(
        select(AssessmentQuestion).where(AssessmentQuestion.id == question_id)
    )
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Soft delete by setting is_active to False
    question.is_active = False
    await db.commit()
    
    return {"message": "Question deleted successfully"}

@router.get("/admin/questions", response_model=List[AssessmentQuestionResponse])
async def get_all_assessment_questions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все вопросы для оценки (включая неактивные) (только для админов)"""
    # TODO: Add admin role check
    
    result = await db.execute(
        select(AssessmentQuestion).order_by(AssessmentQuestion.id)
    )
    questions = result.scalars().all()
    
    return [
        AssessmentQuestionResponse(
            id=q.id,
            question_text=q.question_text,
            question_type=q.question_type,
            assessment_category=q.assessment_category,
            options=q.options or [],
            weight=q.weight
        ) for q in questions
    ]

# Helper functions for assessment analysis

def _analyze_assessment_answers(answers) -> tuple[List[AssessmentStrength], List[AssessmentWeakness], float]:
    """Analyze assessment answers and return strengths, weaknesses, and overall score"""
    
    category_scores = {}
    
    for answer in answers:
        question = next((q for q in SAMPLE_QUESTIONS if q["id"] == answer.question_id), None)
        if not question:
            continue
            
        category = question["assessment_category"]
        weight = question["weight"]
        
        # Calculate score based on answer type
        if question["question_type"] == "scale":
            score = float(str(answer.answer).split(" ")[0]) if isinstance(answer.answer, str) else float(answer.answer)
        elif question["question_type"] in ["single_choice", "multiple_choice"]:
            score = 3.0  # Default middle score for choice questions
        else:
            score = 3.0
            
        if category not in category_scores:
            category_scores[category] = []
        category_scores[category].append(score * weight)
    
    # Calculate average scores per category
    avg_scores = {
        category: sum(scores) / len(scores) 
        for category, scores in category_scores.items()
    }
    
    # Get top 5 strengths (highest scores)
    sorted_strengths = sorted(avg_scores.items(), key=lambda x: x[1], reverse=True)
    strengths = [
        AssessmentStrength(
            category=category,
            score=score,
            description=_get_strength_description(category, score)
        ) for category, score in sorted_strengths[:5] if score >= 3.5
    ]
    
    # Get top 3 weaknesses (lowest scores)
    sorted_weaknesses = sorted(avg_scores.items(), key=lambda x: x[1])
    weaknesses = [
        AssessmentWeakness(
            category=category,
            score=score,
            description=_get_weakness_description(category, score)
        ) for category, score in sorted_weaknesses[:3] if score < 3.5
    ]
    
    # Overall score
    overall_score = sum(avg_scores.values()) / len(avg_scores) if avg_scores else 0
    
    return strengths, weaknesses, overall_score

def _get_strength_description(category: str, score: float) -> str:
    """Generate description for a strength"""
    descriptions = {
        "communication": "Отличные коммуникативные навыки",
        "technical": "Сильные технические компетенции",
        "problem_solving": "Высокие способности к решению проблем",
        "work_style": "Эффективный стиль работы",
        "learning": "Быстрая обучаемость",
        "work_environment": "Хорошая адаптация к рабочей среде"
    }
    return descriptions.get(category, f"Сильные навыки в области {category}")

def _get_weakness_description(category: str, score: float) -> str:
    """Generate description for a weakness"""
    descriptions = {
        "communication": "Потребность в развитии коммуникативных навыков",
        "technical": "Возможность улучшения технических навыков",
        "problem_solving": "Развитие навыков решения проблем",
        "work_style": "Оптимизация стиля работы",
        "learning": "Ускорение процесса обучения",
        "work_environment": "Адаптация к различным рабочим условиям"
    }
    return descriptions.get(category, f"Область для развития: {category}")

def _generate_strengths_analysis(strengths: List[AssessmentStrength], profile_data: Dict[str, Any]) -> str:
    """Generate AI analysis of strengths"""
    if not strengths:
        return "На основе результатов оценки, ваши сильные стороны требуют дополнительного анализа."
    
    profile_name = profile_data.get("name", "Профессионал")
    profile_description = profile_data.get("description", "")
    strength_categories = [s.category for s in strengths]
    
    return f"Ваш профиль: {profile_name}. {profile_description} " \
           f"Ваши основные сильные стороны включают: {', '.join(strength_categories)}. " \
           f"Эти навыки делают вас ценным кандидатом для должностей, требующих данных компетенций."

def _generate_weaknesses_analysis(weaknesses: List[AssessmentWeakness]) -> str:
    """Generate AI analysis of weaknesses"""
    if not weaknesses:
        return "Отлично! На основе результатов оценки не выявлено значительных слабых сторон."
    
    weakness_categories = [w.category for w in weaknesses]
    return f"Области для развития: {', '.join(weakness_categories)}. " \
           f"Рекомендуем сосредоточиться на улучшении этих навыков для расширения карьерных возможностей."

def _generate_improvement_suggestions(weaknesses: List[AssessmentWeakness], profile_data: Dict[str, Any]) -> str:
    """Generate improvement suggestions"""
    if not weaknesses:
        recommended_spheres = profile_data.get("recommended_spheres", [])
        if recommended_spheres:
            return f"Продолжайте развивать свои сильные стороны. " \
                   f"Рекомендуемые сферы деятельности: {', '.join(recommended_spheres)}."
        return "Продолжайте развивать свои сильные стороны и изучать новые навыки для карьерного роста."
    
    suggestions = []
    for weakness in weaknesses:
        if weakness.category == "communication":
            suggestions.append("Пройдите курсы по развитию коммуникативных навыков")
        elif weakness.category == "technical":
            suggestions.append("Изучите новые технические инструменты и программы")
        elif weakness.category == "organization":
            suggestions.append("Освойте методы планирования и организации работы")
        elif weakness.category == "teamwork":
            suggestions.append("Развивайте навыки командной работы и сотрудничества")
        elif weakness.category == "execution":
            suggestions.append("Улучшите навыки выполнения задач и соблюдения сроков")
        elif weakness.category == "independence":
            suggestions.append("Развивайте самостоятельность в принятии решений")
    
    recommended_spheres = profile_data.get("recommended_spheres", [])
    if recommended_spheres:
        suggestions.append(f"Рекомендуемые сферы деятельности: {', '.join(recommended_spheres)}")
    
    return ". ".join(suggestions) + "." if suggestions else "Продолжайте развивать свои навыки."

def _generate_profile_summary_from_assessment(
    strengths: List[AssessmentStrength], 
    weaknesses: List[AssessmentWeakness], 
    analysis: str,
    profile_data: Dict[str, Any]
) -> str:
    """Generate profile summary based on assessment results"""
    profile_name = profile_data.get("name", "Профессионал")
    profile_description = profile_data.get("description", "")
    recommended_spheres = profile_data.get("recommended_spheres", [])
    
    strength_text = ", ".join([s.category for s in strengths]) if strengths else "не выявлены"
    weakness_text = ", ".join([w.category for w in weaknesses]) if weaknesses else "не выявлены"
    
    summary = f"Профиль: {profile_name}. {profile_description} "
    summary += f"Сильные стороны: {strength_text}. "
    summary += f"Области для развития: {weakness_text}. "
    
    if recommended_spheres:
        summary += f"Рекомендуемые сферы деятельности: {', '.join(recommended_spheres)}."
    
    return summary

async def _create_or_update_profile_summary(
    db: AsyncSession, 
    user_id: int, 
    summary_text: str, 
    generated_from: str
):
    """Create or update profile summary"""
    
    # Check if profile summary already exists
    result = await db.execute(
        select(ProfileSummary).where(ProfileSummary.user_id == user_id)
    )
    existing_summary = result.scalar_one_or_none()
    
    if existing_summary:
        # Update existing summary
        existing_summary.summary_text = summary_text  # type: ignore
        existing_summary.generated_from = generated_from  # type: ignore
        existing_summary.version += 1  # type: ignore
        existing_summary.updated_at = datetime.utcnow()  # type: ignore
    else:
        # Create new summary
        new_summary = ProfileSummary(
            user_id=user_id,
            summary_text=summary_text,
            generated_from=generated_from,
            version=1
        )
        db.add(new_summary)
    
    await db.commit() 