#!/usr/bin/env python3
"""
Standalone script to seed strength assessment questions in the database
"""

import asyncio
import sys
import os

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.assessment import AssessmentQuestion
from app.database import Base

# Database URL
DATABASE_URL = "postgresql+asyncpg://komek_user:aikomek2025n!@20.67.232.168:5432/ai_komek"

# Strength assessment questions
QUESTIONS = [
    # Communication questions
    {
        "question_text": "Как вы чувствуете себя при общении с новыми людьми?",
        "question_type": "single_choice",
        "assessment_category": "communication",
        "options": [
            "Легко завожу разговор и чувствую себя комфортно",
            "Немного стесняюсь, но быстро привыкаю", 
            "Предпочитаю слушать, а не говорить",
            "Чувствую себя неуверенно, нужно время"
        ],
        "weight": 1.0,
        "is_active": "true"
    },
    {
        "question_text": "Когда вам нужно объяснить что-то сложное:",
        "question_type": "single_choice",
        "assessment_category": "communication",
        "options": [
            "Использую примеры и аналогии",
            "Разбиваю на простые части",
            "Показываю на практике",
            "Прошу коллег помочь с объяснением"
        ],
        "weight": 1.0,
        "is_active": "true"
    },
    {
        "question_text": "В групповых дискуссиях вы чаще:",
        "question_type": "single_choice", 
        "assessment_category": "communication",
        "options": [
            "Активно выражаю свою точку зрения",
            "Внимательно слушаю других",
            "Пытаюсь найти компромисс",
            "Поддерживаю других участников"
        ],
        "weight": 1.0,
        "is_active": "true"
    },
    # Organization questions
    {
        "question_text": "Как вы планируете свой рабочий день?",
        "question_type": "single_choice",
        "assessment_category": "organization",
        "options": [
            "Составляю подробный план заранее",
            "Делаю общий список задач",
            "Планирую по ходу дня",
            "Реагирую на ситуации по мере поступления"
        ],
        "weight": 1.0,
        "is_active": "true"
    },
    {
        "question_text": "При работе над проектом вы предпочитаете:",
        "question_type": "single_choice",
        "assessment_category": "organization", 
        "options": [
            "Четко следовать плану и срокам",
            "Гибко адаптироваться к изменениям",
            "Сначала изучить все детали",
            "Начать с самого интересного"
        ],
        "weight": 1.0,
        "is_active": "true"
    },
    {
        "question_text": "Когда у вас много задач одновременно:",
        "question_type": "single_choice",
        "assessment_category": "organization",
        "options": [
            "Расставляю приоритеты и выполняю по порядку",
            "Делаю несколько задач параллельно",
            "Сначала делаю простые, потом сложные",
            "Прошу помощи в распределении задач"
        ],
        "weight": 1.0,
        "is_active": "true"
    }
]

async def seed_questions():
    """Seed strength assessment questions into the database"""
    
    # Create engine
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    # Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    Session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with Session() as session:
        try:
            # Check if questions already exist
            existing_count = await session.execute(
                select(AssessmentQuestion).where(AssessmentQuestion.is_active.is_(True))
            )
            existing_questions = existing_count.scalars().all()
            
            if existing_questions:
                print(f"⚠️  Found {len(existing_questions)} existing questions in database")
                print("Deactivating existing questions...")
                
                # Deactivate existing questions
                for question in existing_questions:
                    question.is_active = 'false'
                await session.commit()
                print("✅ Deactivated existing questions")
            
            # Add new strength assessment questions
            for question_data in QUESTIONS:
                question = AssessmentQuestion(**question_data)
                session.add(question)
            
            await session.commit()
            print(f"✅ Successfully seeded {len(QUESTIONS)} strength assessment questions")
            print("📊 Assessment includes:")
            print("   - 3 Communication questions")
            print("   - 3 Organization questions")
            
        except Exception as e:
            print(f"❌ Error seeding questions: {e}")
            await session.rollback()
            raise
        finally:
            await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_questions()) 