#!/usr/bin/env python3
"""
Temporary script to test seeding with SQLite database
"""

import asyncio
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.assessment import AssessmentQuestion
from app.database import Base
from sqlalchemy import select
from app.utils.strength_assessment import calculate_profile_scores, STRENGTH_PROFILES

# Use SQLite for testing
DATABASE_URL = "sqlite+aiosqlite:///./test_assessment.db"

# Strength assessment questions to seed
QUESTIONS = [
    # Блок 1: Коммуникативные навыки
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
        "weight": 1.0
    },
    {
        "question_text": "Когда вам нужно объяснить что-то сложное:",
        "question_type": "single_choice",
        "assessment_category": "communication",
        "options": [
            "Легко нахожу простые слова и примеры",
            "Стараюсь показать на практике",
            "Прошу помочь более опытного коллеги",
            "Записываю информацию для лучшего понимания"
        ],
        "weight": 1.0
    },
    {
        "question_text": "В конфликтной ситуации вы:",
        "question_type": "single_choice",
        "assessment_category": "communication",
        "options": [
            "Стараюсь найти компромисс",
            "Обращаюсь за помощью к руководству",
            "Избегаю конфликтов",
            "Четко отстаиваю свою позицию"
        ],
        "weight": 1.0
    },
    
    # Блок 2: Организационные способности
    {
        "question_text": "Ваше рабочее место обычно:",
        "question_type": "single_choice",
        "assessment_category": "organization",
        "options": [
            "Всегда организовано и убрано",
            "Организовано по своей системе",
            "Иногда бывает беспорядок, но я все нахожу",
            "Мне сложно поддерживать порядок"
        ],
        "weight": 1.0
    },
    {
        "question_text": "При выполнении задач вы:",
        "question_type": "single_choice",
        "assessment_category": "organization",
        "options": [
            "Планирую каждый шаг заранее",
            "Делаю список дел и следую ему",
            "Выполняю по мере поступления",
            "Лучше работаю с четкими инструкциями"
        ],
        "weight": 1.0
    },
    {
        "question_text": "Со сроками выполнения работы:",
        "question_type": "single_choice",
        "assessment_category": "organization",
        "options": [
            "Всегда сдаю раньше времени",
            "Укладываюсь точно в срок",
            "Иногда нужно дополнительное время",
            "Работаю лучше без жестких дедлайнов"
        ],
        "weight": 1.0
    },
    
    # Блок 3: Технические и практические навыки
    {
        "question_text": "При работе с техникой/оборудованием:",
        "question_type": "single_choice",
        "assessment_category": "technical",
        "options": [
            "Быстро разбираюсь в новых устройствах",
            "Изучаю инструкцию перед использованием",
            "Прошу показать, как пользоваться",
            "Предпочитаю работать с привычными инструментами"
        ],
        "weight": 1.2
    },
    {
        "question_text": "Ваше отношение к повторяющимся задачам:",
        "question_type": "single_choice",
        "assessment_category": "technical",
        "options": [
            "Выполняю их быстро и точно",
            "Нахожу способы оптимизации процесса",
            "Справляюсь, но предпочитаю разнообразие",
            "Они помогают мне сосредоточиться"
        ],
        "weight": 1.0
    },
    {
        "question_text": "При работе руками:",
        "question_type": "single_choice",
        "assessment_category": "technical",
        "options": [
            "У меня отличная мелкая моторика",
            "Хорошо работаю с инструментами",
            "Лучше работаю с крупными предметами",
            "Предпочитаю умственную работу"
        ],
        "weight": 1.0
    },
    
    # Блок 4: Работа в команде и самостоятельность
    {
        "question_text": "В рабочем коллективе вы:",
        "question_type": "single_choice",
        "assessment_category": "teamwork",
        "options": [
            "Легко вписываюсь в любую команду",
            "Нужно время, чтобы привыкнуть",
            "Лучше работаю с постоянными коллегами",
            "Предпочитаю работать самостоятельно"
        ],
        "weight": 1.0
    },
    {
        "question_text": "При получении нового задания:",
        "question_type": "single_choice",
        "assessment_category": "teamwork",
        "options": [
            "Сразу начинаю выполнять",
            "Задаю уточняющие вопросы",
            "Изучаю все детали перед началом",
            "Прошу показать пример выполнения"
        ],
        "weight": 1.0
    },
    {
        "question_text": "Ваша реакция на изменения в работе:",
        "question_type": "single_choice",
        "assessment_category": "teamwork",
        "options": [
            "Легко адаптируюсь к новому",
            "Нужно время для привыкания",
            "Предпочитаю стабильность",
            "Справляюсь с поддержкой коллег"
        ],
        "weight": 1.0
    },
    
    # Блок 5: Мотивация и цели
    {
        "question_text": "Что вас больше всего мотивирует в работе?",
        "question_type": "single_choice",
        "assessment_category": "motivation",
        "options": [
            "Возможность помогать людям",
            "Стабильный доход и безопасность",
            "Признание результатов труда",
            "Возможность учиться новому"
        ],
        "weight": 1.0
    },
    {
        "question_text": "Ваша главная цель в трудоустройстве:",
        "question_type": "single_choice",
        "assessment_category": "motivation",
        "options": [
            "Найти работу, где смогу полностью раскрыться",
            "Получить стабильное место работы",
            "Влиться в коллектив и быть полезным",
            "Развиваться профессионально"
        ],
        "weight": 1.0
    },
    {
        "question_text": "При выборе работы для вас важнее всего:",
        "question_type": "single_choice",
        "assessment_category": "motivation",
        "options": [
            "Интересные задачи и творческий подход",
            "Четкий график и понятные обязанности",
            "Дружелюбный коллектив",
            "Возможность работать в своем темпе"
        ],
        "weight": 1.0
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
                response = input("Do you want to replace them with strength assessment questions? (y/N): ")
                if response.lower() != 'y':
                    print("❌ Seeding cancelled")
                    return
                
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
            print("   - 3 Technical skills questions")
            print("   - 3 Teamwork questions")
            print("   - 3 Motivation questions")
            print("🎯 Assessment will identify 6 strength profiles:")
            for profile_key, profile_data in STRENGTH_PROFILES.items():
                print(f"   - {profile_data['name']}")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error seeding questions: {e}")
            raise
        finally:
            await session.close()
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_questions()) 