import httpx
import logging
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, update
from datetime import datetime, timedelta
import asyncio
from collections import defaultdict
import json

from ..models.user import User
from ..models.onboarding import OnboardingProfile
from ..models.assessment import AssessmentResult
from ..models.job import JobRecommendation, UserJobPreferences, SavedJob, JobFeedback
from ..schemas.job import (
    JobRecommendationCreate, HHSearchRequest, PersonalizedJobSearchRequest,
    UserJobPreferencesCreate
)

logger = logging.getLogger(__name__)

class HeadHunterService:
    """Service for HeadHunter API integration and personalized job recommendations"""
    
    def __init__(self):
        self.base_url = "https://api.hh.kz"
        self.headers = {
            "User-Agent": "AI-Komekshi Job Platform Parser",
            "Accept": "application/json"
        }
        self.timeout = 30.0
        
        # Kazakhstan area mapping (can be expanded)
        self.area_mapping = {
            "almaty": "160",
            "nur-sultan": "159", 
            "astana": "159",
            "shymkent": "161",
            "atyrau": "153",
            "aktobe": "145",
            "karaganda": "156",
            "pavlodar": "158",
            "ust-kamenogorsk": "162",
            "taraz": "155",
            "kazakhstan": "40"  # All Kazakhstan
        }
        
        # Employment type mapping
        self.employment_mapping = {
            "full_time": "full",
            "part_time": "part", 
            "project": "project",
            "volunteer": "volunteer",
            "probation": "probation"
        }
        
        # Experience level mapping
        self.experience_mapping = {
            "no_experience": "noExperience",
            "between1And3": "between1And3",
            "between3And6": "between3And6",
            "moreThan6": "moreThan6"
        }

        # Stop words for professions that shouldn't be used as job titles
        self.profession_stop_words = [
            "безработный", "unemployed", "без работы",
            "студент", "student", "учащийся",
            "школьник", "schoolboy", "schoolgirl",
            "временно не работаю", "temporarily not working"
        ]

    async def get_personalized_recommendations(
        self,
        user: User,
        db: AsyncSession,
        request: PersonalizedJobSearchRequest
    ) -> List[JobRecommendation]:
        """Get personalized job recommendations for a user"""
        
        logger.info(f"Getting personalized recommendations for user {user.id}")
        
        # Get or create user job preferences
        user_preferences = await self._get_or_create_user_preferences(user, db)
        
        # Build search parameters from user data
        search_params = await self._build_search_params_from_user_data(
            user, user_preferences, db, request
        )
        
        # Search HeadHunter API
        hh_vacancies = await self._search_hh_api(search_params)
        
        if not hh_vacancies:
            logger.warning(f"No vacancies found for user {user.id}")
            return []
        
        # Process and score vacancies
        recommendations = []
        for vacancy in hh_vacancies:
            try:
                # Score the vacancy against user profile
                scores = await self._calculate_recommendation_scores(
                    vacancy, user, user_preferences, db
                )
                
                # Create recommendation object
                recommendation_data = await self._create_recommendation_from_vacancy(
                    vacancy, user.id, scores  # type: ignore
                )
                
                # Check if we already have this recommendation
                existing = await db.execute(
                    select(JobRecommendation).where(
                        and_(
                            JobRecommendation.user_id == user.id,
                            JobRecommendation.hh_vacancy_id == vacancy["id"]
                        )
                    )
                )
                existing_rec = existing.scalar_one_or_none()
                
                if existing_rec:
                    # Update existing recommendation
                    for key, value in recommendation_data.items():
                        if key not in ["user_id", "hh_vacancy_id"]:
                            setattr(existing_rec, key, value)
                    existing_rec.updated_at = datetime.utcnow()  # type: ignore
                    recommendations.append(existing_rec)
                else:
                    # Create new recommendation
                    new_recommendation = JobRecommendation(**recommendation_data)
                    db.add(new_recommendation)
                    recommendations.append(new_recommendation)
                    
            except Exception as e:
                logger.error(f"Error processing vacancy {vacancy.get('id', 'unknown')}: {e}")
                continue
        
        await db.commit()
        
        # Sort by relevance score
        recommendations.sort(key=lambda x: x.relevance_score, reverse=True)
        
        logger.info(f"Created {len(recommendations)} recommendations for user {user.id}")
        return recommendations

    async def _get_or_create_user_preferences(
        self, user: User, db: AsyncSession
    ) -> UserJobPreferences:
        """Get existing user preferences or create from onboarding data"""
        
        # Try to get existing preferences
        result = await db.execute(
            select(UserJobPreferences).where(UserJobPreferences.user_id == user.id)
        )
        preferences = result.scalar_one_or_none()
        
        if preferences:
            return preferences
        
        # Create preferences from onboarding data
        logger.info(f"Creating job preferences from onboarding data for user {user.id}")
        
        # Get onboarding profile
        onboarding_result = await db.execute(
            select(OnboardingProfile).where(OnboardingProfile.user_id == user.id)
        )
        onboarding_profile = onboarding_result.scalar_one_or_none()
        
        # Initialize preferences
        preferences_data = {
            "user_id": user.id,
            "auto_update_from_feedback": True
        }
        
        if onboarding_profile:
            # Map onboarding data to preferences
            if onboarding_profile.skills is not None:
                preferences_data["preferred_skills"] = onboarding_profile.skills
            
            if onboarding_profile.work_format is not None:
                preferences_data["employment_types"] = onboarding_profile.work_format
            
            if onboarding_profile.preferred_cities is not None:
                # Map city names to HH area IDs
                area_ids = []
                for city in onboarding_profile.preferred_cities:
                    city_lower = city.lower().replace("-", "_")
                    if city_lower in self.area_mapping:
                        area_ids.append(self.area_mapping[city_lower])
                preferences_data["preferred_areas"] = area_ids
            
            if onboarding_profile.min_salary is not None:
                preferences_data["preferred_salary_min"] = onboarding_profile.min_salary
            if onboarding_profile.max_salary is not None:
                preferences_data["preferred_salary_max"] = onboarding_profile.max_salary
            
            if onboarding_profile.currency is not None:
                preferences_data["salary_currency"] = onboarding_profile.currency
            
            if onboarding_profile.current_position is not None:
                # Don't use stop words as a job title - use skills instead
                if onboarding_profile.current_position.lower() not in self.profession_stop_words:
                    preferences_data["preferred_job_titles"] = [onboarding_profile.current_position]
        
        # Create and save preferences
        preferences = UserJobPreferences(**preferences_data)
        db.add(preferences)
        await db.commit()
        await db.refresh(preferences)
        
        return preferences

    async def _build_search_params_from_user_data(
        self,
        user: User,
        preferences: UserJobPreferences,
        db: AsyncSession,
        request: PersonalizedJobSearchRequest
    ) -> Dict[str, Any]:
        """Build HeadHunter API search parameters from user data"""
        
        params = {
            "page": request.page,
            "per_page": min(request.per_page, 100),
            "order_by": "relevance"
        }
        
        # Skills-based search text
        search_terms = []
        
        # Handle override skills and user preferences intelligently
        if request.override_skills is not None:
            # Add override skills (search query)
            search_terms.extend(request.override_skills[:3])  # Limit search query terms
            
            # Also include some user preferred skills for personalization
            user_skills = getattr(preferences, 'preferred_skills', None)
            if user_skills is not None and isinstance(user_skills, list) and len(user_skills) > 0:
                # Add top user skills to maintain personalization
                search_terms.extend(user_skills[:2])
        else:
            # Use only user preferences when no override
            user_skills = getattr(preferences, 'preferred_skills', None)
            if user_skills is not None and isinstance(user_skills, list) and len(user_skills) > 0:
                search_terms.extend(user_skills[:5])
        
        # Job titles
        job_titles = getattr(preferences, 'preferred_job_titles', None)
        if job_titles is not None and isinstance(job_titles, list) and len(job_titles) > 0:
            search_terms.extend(job_titles[:2])  # Reduced to make room for other terms
        
        # If no search terms, create a basic search based on skills
        if not search_terms and user_skills is not None and isinstance(user_skills, list) and len(user_skills) > 0:
            # Use top skills for basic search
            search_terms.extend(user_skills[:3])
        
        if search_terms:
            params["text"] = " OR ".join(search_terms)
        else:
            # Fallback: search for entry-level jobs in Kazakhstan
            params["text"] = "стажер OR начинающий OR junior OR entry level OR без опыта"
        
        # Location
        location = request.override_location
        if location:
            if location.lower() in self.area_mapping:
                params["area"] = self.area_mapping[location.lower()]
        else:
            # Use user's preferred areas if available
            preferred_areas = getattr(preferences, 'preferred_areas', None)
            if preferred_areas is not None and len(preferred_areas) > 0:
                # Use first preferred area or combine multiple areas
                params["area"] = preferred_areas[0]
            else:
                # Default to all Kazakhstan only if user has no location preferences
                params["area"] = "40"
        
        # Employment type
        employment_types = getattr(preferences, 'employment_types', None)
        if employment_types is not None:
            # Map to HH employment types
            hh_employment = []
            for emp_type in employment_types:
                if emp_type in self.employment_mapping:
                    hh_employment.append(self.employment_mapping[emp_type])
            if hh_employment:
                params["employment"] = ",".join(hh_employment)
        
        # Salary
        preferred_salary_min = getattr(preferences, 'preferred_salary_min', None)
        salary_min = request.override_salary_min or preferred_salary_min
        if salary_min is not None:
            params["salary_from"] = salary_min
        
        # Remote work
        remote_work_preference = getattr(preferences, 'remote_work_preference', 'any')
        if request.include_remote or (remote_work_preference in ["only", "prefer"]):
            # Add search for remote work
            if "text" in params:
                params["text"] += " OR удаленная работа OR remote"
            else:
                params["text"] = "удаленная работа OR remote"
        
        # Exclude archived vacancies
        params["archived"] = "false"
        
        # Only active vacancies
        params["only_with_salary"] = "false"  # Allow jobs without salary info
        
        logger.info(f"Built search params for user {user.id}: {params}")
        return params

    async def _search_hh_api(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search HeadHunter API with given parameters"""
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/vacancies",
                    params=params,
                    headers=self.headers,
                    timeout=self.timeout
                )
                
                if response.status_code == 200:
                    data = response.json()
                    vacancies = data.get("items", [])
                    logger.info(f"HH API returned {len(vacancies)} vacancies")
                    return vacancies
                else:
                    logger.error(f"HH API error: {response.status_code} - {response.text}")
                    return []
                    
        except httpx.RequestError as e:
            logger.error(f"Network error calling HH API: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error calling HH API: {e}")
            return []

    async def _calculate_recommendation_scores(
        self,
        vacancy: Dict[str, Any],
        user: User,
        preferences: UserJobPreferences,
        db: AsyncSession
    ) -> Dict[str, float]:
        """Calculate recommendation scores for a vacancy"""
        
        scores = {
            "skills_match_score": 0.0,
            "location_match_score": 0.0,
            "salary_match_score": 0.0,
            "relevance_score": 0.0
        }
        
        # Skills matching - improved algorithm
        preferred_skills = getattr(preferences, 'preferred_skills', None)
        if preferred_skills is not None:
            vacancy_text = (
                vacancy.get("name", "") + " " + 
                (vacancy.get("snippet", {}).get("responsibility", "") or "") + " " +
                (vacancy.get("snippet", {}).get("requirement", "") or "")
            ).lower()
            
            skill_matches = 0
            total_skill_weight = 0
            
            for skill in preferred_skills:
                skill_weight = await self._calculate_skill_match_weight(skill.lower(), vacancy_text)
                skill_matches += skill_weight
                total_skill_weight += 1
            
            if len(preferred_skills) > 0:
                scores["skills_match_score"] = min(skill_matches / total_skill_weight, 1.0)
        
        # Location matching
        vacancy_area = vacancy.get("area", {})
        if vacancy_area:
            area_id = str(vacancy_area.get("id", ""))
            area_name = vacancy_area.get("name", "").lower()
            
            preferred_areas = getattr(preferences, 'preferred_areas', None)
            remote_work_preference = getattr(preferences, 'remote_work_preference', 'any')
            
            if preferred_areas is not None and area_id in preferred_areas:
                scores["location_match_score"] = 1.0
            elif remote_work_preference == "only":
                # Check if it's a remote job
                if any(word in vacancy.get("name", "").lower() for word in ["удаленн", "remote", "дистанц"]):
                    scores["location_match_score"] = 1.0
                else:
                    scores["location_match_score"] = 0.2
            else:
                scores["location_match_score"] = 0.5  # Neutral if no specific preference
        
        # Salary matching
        vacancy_salary = vacancy.get("salary")
        preferred_salary_min = getattr(preferences, 'preferred_salary_min', None)
        if vacancy_salary and preferred_salary_min is not None:
            salary_from = vacancy_salary.get("from")
            salary_to = vacancy_salary.get("to")
            
            if salary_from or salary_to:
                user_min = preferred_salary_min
                user_max = getattr(preferences, 'preferred_salary_max', None)
                
                if salary_from and salary_from >= user_min:
                    scores["salary_match_score"] = 0.8
                    if user_max is not None and salary_from <= user_max:
                        scores["salary_match_score"] = 1.0
                elif salary_to and salary_to >= user_min:
                    scores["salary_match_score"] = 0.6
                else:
                    scores["salary_match_score"] = 0.3
        
        # Overall relevance score (weighted average)
        weights = {
            "skills_match_score": 0.4,
            "location_match_score": 0.3,
            "salary_match_score": 0.3
        }
        
        scores["relevance_score"] = sum(
            scores[key] * weight for key, weight in weights.items()
        )
        
        return scores

    async def _create_recommendation_from_vacancy(
        self,
        vacancy: Dict[str, Any],
        user_id: int,
        scores: Dict[str, float]
    ) -> Dict[str, Any]:
        """Create a JobRecommendation object from HH vacancy data"""
        
        # Extract salary info
        salary_info = vacancy.get("salary", {})
        salary_from = salary_info.get("from") if salary_info else None
        salary_to = salary_info.get("to") if salary_info else None
        currency = salary_info.get("currency", "KZT") if salary_info else "KZT"
        
        # Extract location
        area_info = vacancy.get("area", {})
        area_name = area_info.get("name") if area_info else None
        
        # Extract employer
        employer_info = vacancy.get("employer", {})
        company_name = employer_info.get("name") if employer_info else None
        
        # Extract employment type
        employment_info = vacancy.get("employment", {})
        employment_type = employment_info.get("name") if employment_info else None
        
        # Extract experience requirement
        experience_info = vacancy.get("experience", {})
        experience_required = experience_info.get("name") if experience_info else None
        
        # Extract skills from snippet
        snippet = vacancy.get("snippet", {})
        responsibility = snippet.get("responsibility", "") if snippet else ""
        requirement = snippet.get("requirement", "") if snippet else ""
        description = f"{responsibility}\n{requirement}".strip()
        
        # Extract key skills (basic keyword extraction)
        key_skills = await self._extract_skills_from_text(description)
        
        return {
            "user_id": user_id,
            "hh_vacancy_id": vacancy["id"],
            "title": vacancy.get("name", ""),
            "company_name": company_name,
            "salary_from": salary_from,
            "salary_to": salary_to,
            "currency": currency,
            "area_name": area_name,
            "employment_type": employment_type,
            "experience_required": experience_required,
            "description": description[:1000] if description else None,  # Limit length
            "key_skills": key_skills,
            "relevance_score": scores["relevance_score"],
            "skills_match_score": scores["skills_match_score"],
            "location_match_score": scores["location_match_score"],
            "salary_match_score": scores["salary_match_score"],
            "raw_data": vacancy,
            "is_active": True
        }

    async def _extract_skills_from_text(self, text: str) -> List[str]:
        """Extract skills from job description text"""
        
        if not text:
            return []
        
        # Comprehensive skills and technologies dictionary
        skill_keywords = [
            # Programming Languages
            "python", "java", "javascript", "typescript", "c#", "c++", "php", "ruby", "go", "rust",
            "swift", "kotlin", "scala", "r", "matlab", "perl", "bash", "powershell",
            
            # Web Technologies
            "html", "css", "react", "angular", "vue", "node.js", "express", "django", "flask",
            "laravel", "spring", "asp.net", "jquery", "bootstrap", "sass", "less",
            
            # Databases
            "sql", "mysql", "postgresql", "oracle", "mongodb", "redis", "elasticsearch",
            "sqlite", "cassandra", "firebase",
            
            # Cloud & DevOps
            "aws", "azure", "google cloud", "docker", "kubernetes", "jenkins", "gitlab",
            "terraform", "ansible", "chef", "puppet", "vagrant",
            
            # Tools & Frameworks
            "git", "svn", "jira", "confluence", "slack", "teams", "zoom", "figma", "sketch",
            "photoshop", "illustrator", "after effects", "premiere", "indesign",
            
            # Operating Systems
            "linux", "windows", "macos", "ubuntu", "centos", "redhat",
            
            # Office & Business
            "excel", "powerpoint", "word", "outlook", "sharepoint", "visio", "project",
            "1c", "sap", "crm", "erp", "salesforce", "hubspot",
            
            # Russian Skills
            "программирование", "разработка", "тестирование", "администрирование",
            "маркетинг", "продажи", "менеджмент", "аналитика", "дизайн", "копирайтинг",
            "переводы", "преподавание", "консультирование", "проектирование",
            "бухгалтерия", "логистика", "рекрутинг", "hr", "пиар", "реклама",
            "фотография", "видеомонтаж", "графический дизайн", "веб-дизайн",
            "контент-менеджмент", "smm", "seo", "контекстная реклама",
            
            # Soft Skills (Russian)
            "коммуникация", "лидерство", "работа в команде", "организация",
            "планирование", "координация", "переговоры", "презентации",
            "решение проблем", "креативность", "инновации", "адаптивность",
            
            # Industry-specific
            "медицина", "образование", "финансы", "банки", "страхование",
            "недвижимость", "строительство", "производство", "логистика",
            "торговля", "ритейл", "гостиничный бизнес", "туризм", "ресторанный бизнес",
            
            # Technical Skills (Russian)
            "системное администрирование", "сетевое администрирование",
            "информационная безопасность", "кибербезопасность",
            "техническая поддержка", "helpdesk", "it поддержка",
            "обслуживание техники", "ремонт компьютеров", "настройка оборудования",
            
            # Creative & Design
            "ui/ux", "user experience", "user interface", "прототипирование",
            "wireframing", "брендинг", "типографика", "композиция", "цветоведение",
            
            # Data & Analytics
            "data science", "machine learning", "искусственный интеллект",
            "big data", "tableau", "power bi", "google analytics", "яндекс метрика",
            "статистика", "математическое моделирование",
            
            # Languages
            "английский", "немецкий", "французский", "китайский", "корейский",
            "японский", "испанский", "итальянский", "казахский", "узбекский",
            
            # Quality Assurance
            "manual testing", "automation testing", "selenium", "cypress",
            "postman", "jmeter", "test planning", "bug tracking",
            
            # Project Management
            "agile", "scrum", "kanban", "waterfall", "pmp", "prince2",
            "управление проектами", "координация проектов",
        ]
        
        text_lower = text.lower()
        found_skills = []
        
        # Look for exact matches and partial matches
        for skill in skill_keywords:
            skill_lower = skill.lower()
            if skill_lower in text_lower:
                found_skills.append(skill)
            # Also check for skills as part of compound words
            elif any(word in text_lower for word in skill_lower.split() if len(word) > 2):
                found_skills.append(skill)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_skills = []
        for skill in found_skills:
            if skill.lower() not in seen:
                seen.add(skill.lower())
                unique_skills.append(skill)
        
        return unique_skills[:15]  # Increased limit to capture more skills

    async def _calculate_skill_match_weight(self, user_skill: str, vacancy_text: str) -> float:
        """Calculate how well a user skill matches the vacancy text"""
        
        # Skill synonyms and translations for better matching
        skill_synonyms = {
            # Programming
            "программирование": ["программирование", "разработка", "coding", "development", "programming", "python", "java", "javascript", "c++", "c#"],
            "веб-разработка": ["веб-разработка", "web development", "frontend", "backend", "html", "css", "javascript", "react", "angular", "vue"],
            "разработка": ["разработка", "development", "программирование", "coding", "programming"],
            "тестирование по": ["тестирование", "testing", "qa", "quality assurance", "автотестирование", "manual testing"],
            "тестирование": ["тестирование", "testing", "qa", "quality assurance"],
            
            # Design
            "графический дизайн": ["дизайн", "design", "графический", "graphic", "photoshop", "illustrator", "figma", "sketch"],
            "дизайн": ["дизайн", "design", "ui", "ux", "graphic", "web design", "graphic design"],
            "фотография": ["фотография", "photography", "photo", "фото"],
            
            # Data & Analytics
            "аналитика данных": ["аналитика", "analytics", "data analysis", "sql", "python", "excel", "bi"],
            "аналитика": ["аналитика", "analytics", "analysis", "data", "sql", "excel"],
            "работа с базами данных": ["база данных", "database", "sql", "mysql", "postgresql", "oracle"],
            
            # Office & Admin
            "работа с документами": ["документы", "documents", "word", "excel", "office", "делопроизводство"],
            "бухгалтерия": ["бухгалтерия", "accounting", "финансы", "finance", "1c"],
            "ввод данных": ["ввод данных", "data entry", "excel", "обработка данных"],
            
            # Sales & Marketing
            "продажи": ["продажи", "sales", "менеджер по продажам", "торговый представитель"],
            "маркетинг": ["маркетинг", "marketing", "smm", "реклама", "promotion"],
            "интернет-маркетинг": ["интернет-маркетинг", "digital marketing", "smm", "seo", "контекстная реклама"],
            "smm": ["smm", "social media", "социальные сети", "instagram", "facebook", "маркетинг"],
            
            # Education
            "преподавание": ["преподавание", "teaching", "образование", "education", "репетитор", "tutor"],
            "репетиторство": ["репетиторство", "tutoring", "преподавание", "обучение"],
            
            # Service
            "кулинария": ["кулинария", "cooking", "повар", "chef", "кухня"],
            "уборка": ["уборка", "cleaning", "клининг", "санитария"],
            "обслуживание клиентов": ["клиенты", "customer service", "обслуживание", "support"],
            "работа с клиентами": ["клиенты", "customer", "обслуживание", "support", "менеджер"],
            
            # Languages & Communication
            "коммуникация": ["коммуникация", "communication", "общение", "переговоры"],
            "английский язык": ["английский", "english", "язык", "language"],
            "иностранные языки": ["язык", "language", "английский", "немецкий", "китайский"],
            
            # Soft skills
            "работа в команде": ["команда", "team", "teamwork", "collaboration"],
            "лидерство": ["лидерство", "leadership", "управление", "management"],
            "организаторские способности": ["организация", "organization", "планирование", "координация"],
            "стрессоустойчивость": ["стресс", "stress", "устойчивость", "pressure"],
            
            # Technical
            "администрирование систем": ["администрирование", "admin", "системы", "linux", "windows", "сервер"],
            "техническая поддержка": ["техподдержка", "technical support", "support", "помощь"],
            "ремонт техники": ["ремонт", "repair", "техника", "оборудование"],
        }
        
        # Direct match gets full weight
        if user_skill in vacancy_text:
            return 1.0
        
        # Check synonyms
        synonyms = skill_synonyms.get(user_skill, [user_skill])
        max_weight = 0.0
        
        for synonym in synonyms:
            if synonym.lower() in vacancy_text:
                # Give higher weight for exact synonym matches
                if synonym == user_skill:
                    max_weight = max(max_weight, 1.0)
                else:
                    max_weight = max(max_weight, 0.8)
        
        # Partial word matching for compound skills
        words = user_skill.split()
        if len(words) > 1:
            word_matches = 0
            for word in words:
                if len(word) > 2 and word in vacancy_text:  # Skip short words
                    word_matches += 1
            
            if word_matches > 0:
                partial_weight = (word_matches / len(words)) * 0.6
                max_weight = max(max_weight, partial_weight)
        
        return max_weight

    async def update_preferences_from_feedback(
        self, user_id: int, db: AsyncSession
    ) -> UserJobPreferences:
        """Update user preferences based on job feedback"""
        
        logger.info(f"Updating preferences from feedback for user {user_id}")
        
        # Get user preferences
        prefs_result = await db.execute(
            select(UserJobPreferences).where(UserJobPreferences.user_id == user_id)
        )
        preferences = prefs_result.scalar_one_or_none()
        
        if not preferences or not preferences.auto_update_from_feedback:  # type: ignore
            return preferences
        
        # Get feedback data from last 30 days
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        feedback_result = await db.execute(
            select(JobFeedback, JobRecommendation)
            .join(JobRecommendation)
            .where(
                and_(
                    JobFeedback.user_id == user_id,
                    JobFeedback.created_at >= cutoff_date
                )
            )
        )
        feedbacks = feedback_result.all()
        
        if not feedbacks:
            return preferences
        
        # Analyze feedback patterns
        positive_keywords = []
        negative_keywords = []
        
        for feedback, recommendation in feedbacks:
            if feedback.is_relevant and feedback.is_interested:
                # Positive feedback - extract keywords
                if recommendation.key_skills:
                    positive_keywords.extend(recommendation.key_skills)
                if recommendation.title:
                    positive_keywords.extend(recommendation.title.lower().split())
            elif feedback.is_relevant is False or feedback.is_interested is False:
                # Negative feedback - extract keywords to avoid
                if recommendation.key_skills:
                    negative_keywords.extend(recommendation.key_skills)
        
        # Update preferences
        if positive_keywords:
            # Count frequency and take top keywords
            keyword_count = defaultdict(int)
            for keyword in positive_keywords:
                keyword_count[keyword] += 1
            
            top_positive = [
                keyword for keyword, count in 
                sorted(keyword_count.items(), key=lambda x: x[1], reverse=True)[:20]
            ]
            preferences.positive_keywords = top_positive  # type: ignore
        
        if negative_keywords:
            keyword_count = defaultdict(int)
            for keyword in negative_keywords:
                keyword_count[keyword] += 1
            
            top_negative = [
                keyword for keyword, count in 
                sorted(keyword_count.items(), key=lambda x: x[1], reverse=True)[:10]
            ]
            preferences.negative_keywords = top_negative  # type: ignore
        
        preferences.last_feedback_analysis = datetime.utcnow()  # type: ignore
        await db.commit()
        
        logger.info(f"Updated preferences for user {user_id} based on {len(feedbacks)} feedback items")
        return preferences 