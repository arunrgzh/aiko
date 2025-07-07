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

# Sample assessment questions - you can move these to database later
SAMPLE_QUESTIONS = [
    {
        "id": 1,
        "question_text": "Как вы оцениваете свои навыки коммуникации?",
        "question_type": "scale",
        "assessment_category": "communication",
        "options": ["1 - Очень слабые", "2 - Слабые", "3 - Средние", "4 - Хорошие", "5 - Отличные"],
        "weight": 1.0
    },
    {
        "id": 2,
        "question_text": "Какие из перечисленных технических навыков вы считаете своими сильными сторонами?",
        "question_type": "multiple_choice",
        "assessment_category": "technical",
        "options": [
            "Программирование", "Анализ данных", "Работа с компьютером", 
            "Интернет и соцсети", "Дизайн", "Техническая поддержка"
        ],
        "weight": 1.2
    },
    {
        "id": 3,
        "question_text": "Как вы справляетесь с решением сложных проблем?",
        "question_type": "scale",
        "assessment_category": "problem_solving",
        "options": ["1 - Очень плохо", "2 - Плохо", "3 - Средне", "4 - Хорошо", "5 - Отлично"],
        "weight": 1.1
    },
    {
        "id": 4,
        "question_text": "Какой стиль работы вам больше подходит?",
        "question_type": "single_choice",
        "assessment_category": "work_style",
        "options": [
            "Работа в команде", "Самостоятельная работа", 
            "Руководство другими", "Выполнение четких инструкций"
        ],
        "weight": 1.0
    },
    {
        "id": 5,
        "question_text": "Как вы оцениваете свою способность к обучению новому?",
        "question_type": "scale",
        "assessment_category": "learning",
        "options": ["1 - Очень медленно", "2 - Медленно", "3 - Средне", "4 - Быстро", "5 - Очень быстро"],
        "weight": 1.0
    },
    {
        "id": 6,
        "question_text": "В каких ситуациях вы чувствуете себя наиболее комфортно?",
        "question_type": "multiple_choice",
        "assessment_category": "work_environment",
        "options": [
            "Рутинные задачи", "Творческие задачи", "Аналитическая работа",
            "Работа с людьми", "Работа с документами", "Практическая работа"
        ],
        "weight": 1.0
    }
]

@router.get("/questions", response_model=AssessmentQuestionsResponse)
async def get_assessment_questions(
    assessment_type: str = "skills_assessment",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить вопросы для оценки"""
    
    questions = [
        AssessmentQuestionResponse(
            id=q["id"],
            question_text=q["question_text"],
            question_type=q["question_type"],
            assessment_category=q["assessment_category"],
            options=q.get("options", []),
            weight=q["weight"]
        ) for q in SAMPLE_QUESTIONS
    ]
    
    return AssessmentQuestionsResponse(
        questions=questions,
        total_questions=len(questions)
    )

@router.post("/submit", response_model=AssessmentResultResponse)
async def submit_assessment(
    submission: AssessmentSubmission,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отправить ответы на оценку и получить результаты"""
    
    # Analyze answers and generate results
    strengths, weaknesses, overall_score = _analyze_assessment_answers(submission.answers)
    
    # Generate AI analysis
    strengths_analysis = _generate_strengths_analysis(strengths)
    weaknesses_analysis = _generate_weaknesses_analysis(weaknesses)
    improvement_suggestions = _generate_improvement_suggestions(weaknesses)
    
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
        confidence_level=0.85  # AI confidence level
    )
    
    db.add(assessment_result)
    await db.commit()
    await db.refresh(assessment_result)
    
    # Generate and store profile summary based on assessment
    summary_text = _generate_profile_summary_from_assessment(strengths, weaknesses, strengths_analysis)
    await _create_or_update_profile_summary(db, current_user.id, summary_text, "assessment")  # type: ignore
    
    result_data = AssessmentResultResponse.model_validate(assessment_result)
    result_data.top_strengths = strengths
    result_data.top_weaknesses = weaknesses
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

def _generate_strengths_analysis(strengths: List[AssessmentStrength]) -> str:
    """Generate AI analysis of strengths"""
    if not strengths:
        return "На основе результатов оценки, ваши сильные стороны требуют дополнительного анализа."
    
    strength_categories = [s.category for s in strengths]
    return f"Ваши основные сильные стороны включают: {', '.join(strength_categories)}. " \
           f"Эти навыки делают вас ценным кандидатом для должностей, требующих данных компетенций."

def _generate_weaknesses_analysis(weaknesses: List[AssessmentWeakness]) -> str:
    """Generate AI analysis of weaknesses"""
    if not weaknesses:
        return "Отлично! На основе результатов оценки не выявлено значительных слабых сторон."
    
    weakness_categories = [w.category for w in weaknesses]
    return f"Области для развития: {', '.join(weakness_categories)}. " \
           f"Рекомендуем сосредоточиться на улучшении этих навыков для расширения карьерных возможностей."

def _generate_improvement_suggestions(weaknesses: List[AssessmentWeakness]) -> str:
    """Generate improvement suggestions"""
    if not weaknesses:
        return "Продолжайте развивать свои сильные стороны и изучать новые навыки для карьерного роста."
    
    suggestions = []
    for weakness in weaknesses:
        if weakness.category == "communication":
            suggestions.append("Пройдите курсы по развитию коммуникативных навыков")
        elif weakness.category == "technical":
            suggestions.append("Изучите новые технические инструменты и программы")
        elif weakness.category == "problem_solving":
            suggestions.append("Практикуйтесь в решении сложных задач и кейсов")
    
    return ". ".join(suggestions) + "." if suggestions else "Продолжайте развивать свои навыки."

def _generate_profile_summary_from_assessment(
    strengths: List[AssessmentStrength], 
    weaknesses: List[AssessmentWeakness], 
    analysis: str
) -> str:
    """Generate profile summary based on assessment results"""
    
    strength_text = ", ".join([s.category for s in strengths[:3]]) if strengths else "различные навыки"
    weakness_text = ", ".join([w.category for w in weaknesses[:2]]) if weaknesses else "без значительных слабостей"
    
    return f"Кандидат с сильными навыками в областях: {strength_text}. " \
           f"Области для развития: {weakness_text}. " \
           f"Результаты оценки показывают потенциал для роста и развития в выбранной сфере деятельности."

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