import logging
from typing import List, Dict, Any
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..config import get_settings
from ..database import get_db
from ..models.user import User
from ..models.onboarding import OnboardingProfile
from ..models.assessment import AssessmentResult
from ..schemas.ai_recommendations import UserProfileForAI, AIRecommendationsResponse, AIRecommendation, UserPreferences, UserPersonality
from .headhunter_service import HeadHunterService

# LangChain imports - to be added once dependencies are installed
# from langchain_openai import ChatOpenAI
# from langchain.prompts import ChatPromptTemplate
# from langchain.output_parsers import PydanticOutputParser

logger = logging.getLogger(__name__)
settings = get_settings()

class AIRecommendationService:
    """
    Сервис для генерации персональных рекомендаций вакансий с использованием ИИ.
    """
    def __init__(self, db: AsyncSession):
        self.db = db
        self.hh_service = HeadHunterService()
        # self.llm = ChatOpenAI(model="gpt-4-turbo", openai_api_key=settings.openai_api_key, temperature=0)

    async def get_ai_powered_recommendations(self, user_id: int) -> AIRecommendationsResponse:
        """
        Основной метод для получения AI-рекомендаций.
        1. Получает профиль пользователя.
        2. Находит подходящие вакансии.
        3. Использует LLM для выбора и объяснения лучших вариантов.
        """
        logger.info(f"Начало генерации AI-рекомендаций для пользователя {user_id}")

        # 1. Получение полного профиля пользователя
        user_profile = await self._get_user_profile(user_id)
        if not user_profile:
            logger.warning(f"Не удалось создать профиль для пользователя {user_id}.")
            # TODO: Улучшить обработку ошибок
            return AIRecommendationsResponse(recommendations=[], ai_summary="Профиль пользователя не найден или не полон.")

        # 2. Получение списка вакансий-кандидатов
        # TODO: Реализовать логику получения вакансий
        potential_vacancies = await self._get_potential_vacancies(user_profile)
        if not potential_vacancies:
            logger.warning(f"Не найдено вакансий-кандидатов для пользователя {user_id}")
            return AIRecommendationsResponse(recommendations=[], ai_summary="Подходящие вакансии не найдены.")
        
        # 3. Вызов LLM для анализа и выбора
        # TODO: Реализовать вызов LangChain
        ai_response = await self._invoke_llm_chain(user_profile, potential_vacancies)
        
        logger.info(f"AI-рекомендации для пользователя {user_id} успешно сгенерированы.")
        return ai_response

    async def _get_user_profile(self, user_id: int) -> UserProfileForAI | None:
        """
        Извлекает данные из анкеты (OnboardingProfile) и теста (AssessmentResult)
        и объединяет их в единый профиль UserProfileForAI.
        """
        # TODO: Заменить на реальные запросы к БД
        logger.info(f"Извлечение данных для профиля пользователя {user_id}")
        
        # Примерные данные-заглушки
        return UserProfileForAI(
            user_id=user_id,
            region="Алматы",
            skills=["Python", "SQL", "Коммуникация"],
            disability_info={"type": "Нарушение опорно-двигательного аппарата", "needs": "Доступная среда, гибкий график"},
            preferences=UserPreferences(
                work_format=["remote", "hybrid"],
                needs_support=["гибкий график", "понимание со стороны руководства"],
                values=["развитие", "стабильность"]
            ),
            personality=UserPersonality(
                teamwork_aptitude="high",
                monotony_tolerance="low",
                self_learning_aptitude="high",
                motivation_type="достижения"
            ),
            assessment_summary="Пользователь показал высокие аналитические способности и ориентацию на результат. "
                             "Предпочитает командную работу в гибкой среде."
        )

    async def _get_potential_vacancies(self, user_profile: UserProfileForAI) -> List[Dict[str, Any]]:
        """
        Использует HeadHunterService для поиска широкого списка вакансий (20-30),
        которые затем будут отфильтрованы с помощью LLM.
        """
        # TODO: Реализовать вызов hh_service на основе профиля
        logger.info(f"Поиск вакансий для пользователя {user_profile.user_id}")
        
        # Примерные данные-заглушки
        return [
            {"title": "Data Analyst", "company": "Tech Corp", "url": "hh.kz/vacancy/1", "description": "Analyzing data for our new project..."},
            {"title": "Python Developer", "company": "Innovate LLC", "url": "hh.kz/vacancy/2", "description": "Developing backend services..."},
            {"title": "Project Manager", "company": "Startup Inc.", "url": "hh.kz/vacancy/3", "description": "Managing a team of developers..."},
        ]

    async def _invoke_llm_chain(self, user_profile: UserProfileForAI, vacancies: List[Dict[str, Any]]) -> AIRecommendationsResponse:
        """
        Формирует промпт, вызывает LangChain и парсит ответ от LLM.
        """
        # TODO: Сформировать промпт и настроить LangChain
        logger.info(f"Вызов LLM для анализа {len(vacancies)} вакансий для пользователя {user_profile.user_id}")

        # Примерные данные-заглушки
        return AIRecommendationsResponse(
            recommendations=[
                AIRecommendation(
                    title="Data Analyst",
                    company="Tech Corp",
                    url="hh.kz/vacancy/1",
                    reason="Эта вакансия отлично подходит, так как требует навыков Python и SQL. "
                           "Компания предлагает гибридный формат работы, что соответствует вашим предпочтениям."
                )
            ],
            ai_summary="Вы — аналитик с сильной мотивацией к развитию. Вам подходят роли, где вы сможете применять свои технические навыки в гибкой среде."
        )

async def get_ai_recommendation_service(db: AsyncSession = Depends(get_db)) -> AIRecommendationService:
    return AIRecommendationService(db) 