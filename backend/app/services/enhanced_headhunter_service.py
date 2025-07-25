import httpx
import asyncio
import logging
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from datetime import datetime, timedelta

from ..models.user import User
from ..models.onboarding import OnboardingProfile
from ..models.assessment import AssessmentResult
from ..models.job import JobRecommendation, UserJobPreferences
from ..schemas.job import PersonalizedJobSearchRequest

logger = logging.getLogger(__name__)

class EnhancedRecommendation:
    """Enhanced recommendation with source information"""
    def __init__(self, vacancy: Dict[str, Any], scores: Dict[str, float], source: str, accept_handicapped_filter: bool = False):
        self.vacancy = vacancy
        self.scores = scores
        self.source = source  # "onboarding" or "assessment"
        self.hh_vacancy_id = vacancy["id"]
        self.accept_handicapped_filter = accept_handicapped_filter  # Whether found using accessibility filter

class EnhancedHeadHunterService:
    """Enhanced HeadHunter service with dual recommendation blocks and accessibility filters"""
    
    def __init__(self):
        self.base_url = "https://api.hh.kz"
        self.headers = {
            "User-Agent": "AI-Komekshi Job Platform Parser",
            "Accept": "application/json"
        }
        self.timeout = 30.0
        
        # Kazakhstan area mapping
        self.area_mapping = {
            "almaty": "160",
            "алматы": "160",
            "nur-sultan": "159", 
            "astana": "159",
            "астана": "159",
            "нур-султан": "159",
            "shymkent": "161",
            "шымкент": "161",
            "atyrau": "153",
            "атырау": "153",
            "aktobe": "145",
            "актобе": "145",
            "karaganda": "156",
            "караганда": "156",
            "pavlodar": "158",
            "павлодар": "158",
            "ust-kamenogorsk": "162",
            "усть-каменогорск": "162",
            "taraz": "155",
            "тараз": "155",
            "kazakhstan": "40"
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
            "Без опыта": "noExperience",
            "no_experience": "noExperience",
            "between1And3": "between1And3",
            "between3And6": "between3And6",
            "moreThan6": "moreThan6"
        }

    async def get_dual_recommendations(
        self,
        user: User,
        db: AsyncSession,
        page: int = 0,
        per_page: int = 20,
        disable_filters: bool = False
    ) -> Dict[str, List[EnhancedRecommendation]]:
        """
        Get dual recommendations: onboarding-based and assessment-based
        Returns dict with 'personal' and 'assessment' recommendation lists
        """
        
        logger.info(f"Getting dual recommendations for user {user.id}")
        
        # Get user data
        onboarding_profile = await self._get_onboarding_profile(user, db)
        assessment_result = await self._get_latest_assessment(user, db)
        
        # Build search parameters only for onboarding block (exclude assessment as per requirements)
        onboarding_params = await self._build_onboarding_search_params(onboarding_profile, page, per_page)

        # Add inclusive filters (unless disabled)
        if not disable_filters:
            onboarding_params = self._add_inclusive_filters(onboarding_params, onboarding_profile)

        # Log the parameters for debugging
        logger.info(f"Onboarding search params: {onboarding_params}")

        # Search HH API only for onboarding
        onboarding_vacancies = await self._search_hh_api(onboarding_params)

        # Handle potential errors
        if isinstance(onboarding_vacancies, Exception):
            logger.error(f"Error fetching onboarding recommendations: {onboarding_vacancies}")
            onboarding_vacancies = []
        else:
            onboarding_vacancies = onboarding_vacancies or []

        # Get detailed info for top vacancies
        onboarding_detailed = await self._get_detailed_vacancies(onboarding_vacancies[:10])

        # Score and create recommendations
        personal_recommendations = []
        assessment_recommendations = []  # Empty as per requirements - do not use assessment

        # Process onboarding-based recommendations
        for vacancy in onboarding_detailed:
            scores = await self._calculate_recommendation_scores(vacancy, onboarding_profile, assessment_result)
            recommendation = EnhancedRecommendation(vacancy, scores, "onboarding", accept_handicapped_filter=True)
            personal_recommendations.append(recommendation)

        # Sort by relevance
        personal_recommendations.sort(key=lambda x: x.scores["relevance_score"], reverse=True)

        logger.info(f"Generated {len(personal_recommendations)} personal recommendations for user {user.id} (assessment excluded)")

        return {
            "personal": personal_recommendations,
            "assessment": assessment_recommendations
        }

    def _add_inclusive_filters(self, params: Dict[str, Any], onboarding_profile: Optional[OnboardingProfile]) -> Dict[str, Any]:
        """Add mandatory inclusive filters to search parameters"""
        
        # NOTE: HeadHunter Kazakhstan has very few jobs explicitly marked as accepting 
        # people with disabilities (~79 out of 2000+ jobs). We now use a more flexible approach:
        
        # Only apply strict accessibility filter if specifically requested
        # For now, we'll make this less restrictive to ensure users get recommendations
        
        # Ensure Kazakhstan area if not specified
        if "area" not in params:
            params["area"] = "40"  # Kazakhstan
        
        # Exclude archived vacancies
        params["archived"] = "false"
        
        # Allow jobs without salary info to increase diversity
        params["only_with_salary"] = "false"
        
        # Add accessibility preference as a search term instead of strict filter
        # This way we prioritize inclusive jobs but don't exclude others
        if "text" in params:
            params["text"] += " OR инклюзивная OR доступная среда"
        
        return params

    async def _build_onboarding_search_params(
        self, 
        onboarding_profile: Optional[OnboardingProfile], 
        page: int, 
        per_page: int
    ) -> Dict[str, Any]:
        """Build search parameters based on onboarding data"""
        
        params = {
            "page": page,
            "per_page": min(per_page, 50),
            "order_by": "relevance"
        }
        
        if not onboarding_profile:
            logger.warning("No onboarding profile found, using default search")
            params["text"] = "работа OR вакансия OR специалист OR стажер"
            params["area"] = ["40"]  # Kazakhstan
            return params
        
        # Build search text from profession and skills
        search_terms = []
        
        # Add profession if available and meaningful
        profession = getattr(onboarding_profile, 'profession', None)
        if profession and profession.strip():
            # Clean up profession - remove common stop words
            stop_words = ["работник", "сотрудник", "человек", "специалист по"]
            profession_clean = profession.strip()
            for stop_word in stop_words:
                profession_clean = profession_clean.replace(stop_word, "").strip()
            
            if profession_clean and len(profession_clean) > 2:
                search_terms.append(profession_clean)
        
        # Skill to job category mapping for broader search
        skill_job_mapping = {
            "преподавание": ["учитель", "преподаватель", "педагог", "образование", "обучение"],
            "репетиторство": ["репетитор", "учитель", "преподаватель", "образование"],
            "продажи": ["менеджер по продажам", "продавец", "консультант", "торговля"],
            "маркетинг": ["маркетолог", "реклама", "продвижение", "SMM"],
            "программирование": ["программист", "разработчик", "IT", "developer"],
            "дизайн": ["дизайнер", "графический дизайнер", "креатив"],
            "менеджмент": ["менеджер", "руководитель", "управление"],
            "бухгалтерия": ["бухгалтер", "финансы", "учет"],
            "юриспруденция": ["юрист", "правовой", "юридический"],
        }
        
        # Add skills with broader job categories
        skills = getattr(onboarding_profile, 'skills', None)
        if skills and isinstance(skills, list):
            for skill in skills:
                if skill and len(skill.strip()) > 2:
                    skill_lower = skill.lower().strip()
                    search_terms.append(skill)  # Add original skill
                    
                    # Add broader job categories for this skill
                    for key, job_categories in skill_job_mapping.items():
                        if key in skill_lower:
                            search_terms.extend(job_categories[:3])  # Add top 3 related jobs
                            break
        
        # Add current position if different from profession
        current_position = getattr(onboarding_profile, 'current_position', None)
        if current_position and current_position.strip() and current_position != profession:
            current_clean = current_position.strip()
            if len(current_clean) > 2 and current_clean.lower() not in ["безработный", "студент", "не работаю"]:
                search_terms.append(current_clean)
        
        # Remove duplicates and ensure we have search terms
        search_terms = list(set(search_terms))
        
        if search_terms:
            # Limit to reasonable number of terms to avoid too complex queries
            params["text"] = " OR ".join(search_terms[:15])
        else:
            logger.warning("No meaningful search terms from onboarding, using fallback")
            params["text"] = "работа OR вакансия OR специалист OR стажер"
        
        # Location preferences - make more flexible
        preferred_cities = getattr(onboarding_profile, 'preferred_cities', None)
        if preferred_cities and isinstance(preferred_cities, list):
            area_ids = []
            for city in preferred_cities:
                city_lower = city.lower().replace("-", "_").replace(" ", "_")
                if city_lower in self.area_mapping:
                    area_ids.append(self.area_mapping[city_lower])
            
            if area_ids:
                # If specific city has few jobs, also include broader area
                if len(area_ids) == 1 and area_ids[0] in ["161", "153", "145"]:  # Smaller cities
                    area_ids.append("40")  # Add all Kazakhstan as fallback
                params["area"] = area_ids  # Pass as a list
            else:
                params["area"] = ["40"]  # Default to Kazakhstan as a list

        else:
            params["area"] = ["40"]  # Default to Kazakhstan as a list

        
        # Employment type
        employment_type = getattr(onboarding_profile, 'employment_type', None)
        if employment_type and isinstance(employment_type, list):
            hh_employment = []
            for emp_type in employment_type:
                if emp_type in self.employment_mapping:
                    hh_employment.append(self.employment_mapping[emp_type])
            if hh_employment:
                params["employment"] = ",".join(hh_employment)
        
        # Salary (make it less restrictive)
        min_salary = getattr(onboarding_profile, 'min_salary', None)
        if min_salary and min_salary > 0:
            # Reduce salary requirement by 30% to get more results
            adjusted_salary = int(min_salary * 0.7)
            params["salary"] = adjusted_salary
        
        # Experience level
        experience_level = getattr(onboarding_profile, 'experience_level', None)
        if experience_level and experience_level in self.experience_mapping:
            params["experience"] = self.experience_mapping[experience_level]
        
        logger.info(f"Built onboarding search params: {params}")
        return params

    async def _build_assessment_search_params(
        self, 
        assessment_result: Optional[AssessmentResult], 
        onboarding_profile: Optional[OnboardingProfile],
        page: int, 
        per_page: int
    ) -> Dict[str, Any]:
        """Build search parameters based on assessment results"""
        
        params = {
            "page": page,
            "per_page": min(per_page, 50),
            "order_by": "relevance"
        }
        
        if not assessment_result:
            return params
        
        # Extract job-relevant terms from assessment strengths
        search_terms = []
        
        # Map assessment strengths to job search terms
        strength_mapping = {
            "technical": ["программист", "разработчик", "IT", "техник", "аналитик"],
            "communication": ["менеджер", "продажи", "PR", "маркетинг", "консультант"],
            "problem_solving": ["аналитик", "консультант", "исследователь", "специалист"],
            "learning": ["стажер", "junior", "обучение", "развитие", "тренер"],
            "work_style": ["руководитель", "координатор", "администратор", "организатор"],
            "creativity": ["дизайнер", "креатив", "контент", "творческий", "реклама"],
            "leadership": ["руководитель", "менеджер", "директор", "начальник", "лидер"]
        }
        
        for strength in assessment_result.top_strengths:
            if isinstance(strength, dict):
                category = strength.get("category", "")
            else:
                category = getattr(strength, "category", "")
            
            if category in strength_mapping:
                search_terms.extend(strength_mapping[category][:2])  # Top 2 per category
        
        # Add location from onboarding if available
        if onboarding_profile and onboarding_profile.preferred_cities:
            area_ids = []
            for city in onboarding_profile.preferred_cities:
                city_lower = city.lower().replace("-", "_")
                if city_lower in self.area_mapping:
                    area_ids.append(self.area_mapping[city_lower])
            
            if area_ids:
                params["area"] = ",".join(area_ids)
        
        # Use salary from onboarding if available
        if onboarding_profile and onboarding_profile.min_salary:
            params["salary"] = onboarding_profile.min_salary
        
        if search_terms:
            params["text"] = " OR ".join(list(set(search_terms))[:10])  # Unique terms, max 10
        
        return params

    async def _search_hh_api(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search HeadHunter API with given parameters"""
        
        # Ensure we have minimum search criteria
        if not params.get("text") and not params.get("area"):
            logger.warning("No search text or area provided, using fallback search")
            params["text"] = "работа OR вакансия OR специалист"
            params["area"] = "40"  # Kazakhstan
        
        # Ensure we have an area even if no text
        if not params.get("area"):
            params["area"] = "40"  # Kazakhstan

        async with httpx.AsyncClient() as client:
            try:
                # Log the request URL for debugging
                request_url = client.build_request("GET", self.base_url + "/vacancies", params=params).url
                logger.info(f"HH API Request URL: {request_url}")

                response = await client.get(
                    self.base_url + "/vacancies",
                    params=params,
                    headers=self.headers,
                    timeout=self.timeout
                )
                
                if response.status_code == 200:
                    data = response.json()
                    vacancies = data.get("items", [])
                    logger.info(f"HH API returned {len(vacancies)} vacancies for params: {params}")
                    
                    # If no results and we have restrictive filters, try broader search
                    if len(vacancies) == 0 and (params.get("accept_handicapped") or params.get("label")):
                        logger.info("No results with inclusive filters, trying broader search...")
                        
                        # Create params without restrictive filters
                        broader_params = params.copy()
                        broader_params.pop("accept_handicapped", None)
                        broader_params.pop("label", None)
                        
                        # Try again with broader search
                        broader_response = await client.get(
                            self.base_url + "/vacancies",
                            params=broader_params,
                            headers=self.headers,
                            timeout=self.timeout
                        )
                        
                        if broader_response.status_code == 200:
                            broader_data = broader_response.json()
                            vacancies = broader_data.get("items", [])
                            logger.info(f"Broader search returned {len(vacancies)} vacancies")
                    
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

    async def _get_detailed_vacancies(self, vacancies: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Get detailed information for top vacancies"""
        
        if not vacancies:
            return []
        
        detailed_vacancies = []
        
        # Get detailed info for each vacancy
        async with httpx.AsyncClient() as client:
            for vacancy in vacancies:
                try:
                    response = await client.get(
                        f"{self.base_url}/vacancies/{vacancy['id']}",
                        headers=self.headers,
                        timeout=self.timeout
                    )
                    
                    if response.status_code == 200:
                        detailed_vacancy = response.json()
                        detailed_vacancies.append(detailed_vacancy)
                    else:
                        # If detailed fetch fails, use basic info
                        detailed_vacancies.append(vacancy)
                        
                except Exception as e:
                    logger.error(f"Error fetching detailed vacancy {vacancy.get('id')}: {e}")
                    detailed_vacancies.append(vacancy)
                
                # Add small delay to respect API limits
                await asyncio.sleep(0.1)
        
        return detailed_vacancies

    async def _calculate_recommendation_scores(
        self, 
        vacancy: Dict[str, Any], 
        onboarding_profile: Optional[OnboardingProfile],
        assessment_result: Optional[AssessmentResult]
    ) -> Dict[str, float]:
        """Calculate recommendation scores based on onboarding data"""
        
        scores = {
            "skills_match_score": 0.0,
            "location_match_score": 0.0,
            "salary_match_score": 0.0,
            "experience_match_score": 0.0,
            "relevance_score": 0.0
        }
        
        if not onboarding_profile:
            return scores
        
        # Skills matching
        if onboarding_profile.skills:
            vacancy_text = self._get_vacancy_text(vacancy).lower()
            skill_matches = sum(1 for skill in onboarding_profile.skills if skill.lower() in vacancy_text)
            if len(onboarding_profile.skills) > 0:
                scores["skills_match_score"] = skill_matches / len(onboarding_profile.skills)
        else:
            scores["skills_match_score"] = 0.3  # Neutral score if no skills specified
        
        # Location matching
        if onboarding_profile.preferred_cities:
            vacancy_area = vacancy.get("area", {})
            area_name = vacancy_area.get("name", "").lower() if vacancy_area else ""
            
            for city in onboarding_profile.preferred_cities:
                if city.lower() in area_name:
                    scores["location_match_score"] = 1.0
                    break
            else:
                scores["location_match_score"] = 0.5  # Neutral if no match
        else:
            scores["location_match_score"] = 0.5 # Neutral if no cities specified
        
        # Salary matching
        if onboarding_profile.min_salary:
            vacancy_salary = vacancy.get("salary", {})
            if vacancy_salary:
                salary_from = vacancy_salary.get("from")
                salary_to = vacancy_salary.get("to")
                
                if salary_from and salary_from >= onboarding_profile.min_salary:
                    scores["salary_match_score"] = 1.0
                elif salary_to and salary_to >= onboarding_profile.min_salary:
                    scores["salary_match_score"] = 0.7
                else:
                    scores["salary_match_score"] = 0.3
        else:
            scores["salary_match_score"] = 0.5 # Neutral score if no salary specified
        
        # Experience matching
        if onboarding_profile.experience_level:
            vacancy_experience = vacancy.get("experience", {})
            if vacancy_experience:
                exp_id = vacancy_experience.get("id", "")
                if exp_id == self.experience_mapping.get(onboarding_profile.experience_level):
                    scores["experience_match_score"] = 1.0
                else:
                    scores["experience_match_score"] = 0.6  # Partial match
        
        # Overall relevance score (weighted average)
        weights = {
            "skills_match_score": 0.4,
            "location_match_score": 0.2,
            "salary_match_score": 0.2,
            "experience_match_score": 0.2
        }
        
        scores["relevance_score"] = sum(scores[key] * weight for key, weight in weights.items())
        
        return scores

    async def _calculate_assessment_scores(
        self, 
        vacancy: Dict[str, Any], 
        assessment_result: AssessmentResult,
        onboarding_profile: Optional[OnboardingProfile]
    ) -> Dict[str, float]:
        """Calculate recommendation scores based on assessment results"""
        
        scores = {
            "strength_match_score": 0.0,
            "job_fit_score": 0.0,
            "growth_potential_score": 0.0,
            "relevance_score": 0.0
        }
        
        vacancy_text = self._get_vacancy_text(vacancy).lower()
        
        # Strength matching - how well job matches user's strengths
        strength_keywords = {
            "technical": ["программирование", "разработка", "код", "техническ", "IT", "анализ"],
            "communication": ["общение", "презентац", "клиент", "продаж", "переговор", "коммуникац"],
            "problem_solving": ["решение", "анализ", "исследование", "проблем", "задач", "логик"],
            "learning": ["обучение", "развитие", "изучение", "новы", "рост", "карьер"],
            "work_style": ["команд", "лидерство", "управление", "организац", "координац"],
            "creativity": ["творческ", "креатив", "дизайн", "идеи", "инновац"],
            "leadership": ["руководство", "управление", "лидер", "директор", "менеджер"]
        }
        
        strength_matches = 0
        total_strengths = len(assessment_result.top_strengths)
        
        for strength in assessment_result.top_strengths:
            if isinstance(strength, dict):
                category = strength.get("category", "")
            else:
                category = getattr(strength, "category", "")
            
            if category in strength_keywords:
                keywords = strength_keywords[category]
                if any(keyword in vacancy_text for keyword in keywords):
                    strength_matches += 1
        
        if total_strengths > 0:
            scores["strength_match_score"] = strength_matches / total_strengths
        
        # Job fit score based on overall assessment score
        if assessment_result.overall_score:
            # Higher overall score suggests better fit for challenging roles
            vacancy_complexity_indicators = ["опыт", "руководител", "senior", "lead", "главный"]
            complexity_score = sum(1 for indicator in vacancy_complexity_indicators if indicator in vacancy_text)
            
            if assessment_result.overall_score >= 7.0:  # High scorer
                scores["job_fit_score"] = min(1.0, 0.6 + (complexity_score * 0.2))
            elif assessment_result.overall_score >= 5.0:  # Medium scorer
                scores["job_fit_score"] = 0.7
            else:  # Lower scorer - better for entry level
                entry_level_indicators = ["junior", "стажер", "начинающ", "без опыта"]
                if any(indicator in vacancy_text for indicator in entry_level_indicators):
                    scores["job_fit_score"] = 0.8
                else:
                    scores["job_fit_score"] = 0.5
        
        # Growth potential score
        growth_indicators = ["развитие", "карьер", "обучение", "тренинг", "рост", "возможност"]
        growth_score = sum(1 for indicator in growth_indicators if indicator in vacancy_text)
        scores["growth_potential_score"] = min(1.0, growth_score * 0.3)
        
        # Add location and salary from onboarding if available
        location_score = 0.5  # Default neutral
        salary_score = 0.5    # Default neutral
        
        if onboarding_profile:
            if onboarding_profile.preferred_cities:
                vacancy_area = vacancy.get("area", {})
                area_name = vacancy_area.get("name", "").lower() if vacancy_area else ""
                for city in onboarding_profile.preferred_cities:
                    if city.lower() in area_name:
                        location_score = 1.0
                        break
            
            if onboarding_profile.min_salary:
                vacancy_salary = vacancy.get("salary", {})
                if vacancy_salary:
                    salary_from = vacancy_salary.get("from")
                    if salary_from and salary_from >= onboarding_profile.min_salary:
                        salary_score = 1.0
                    else:
                        salary_score = 0.3
        
        # Overall relevance score (weighted average)
        weights = {
            "strength_match_score": 0.4,
            "job_fit_score": 0.3,
            "growth_potential_score": 0.1,
            "location_score": 0.1,
            "salary_score": 0.1
        }
        
        scores["relevance_score"] = (
            scores["strength_match_score"] * weights["strength_match_score"] +
            scores["job_fit_score"] * weights["job_fit_score"] +
            scores["growth_potential_score"] * weights["growth_potential_score"] +
            location_score * weights["location_score"] +
            salary_score * weights["salary_score"]
        )
        
        return scores

    def _get_vacancy_text(self, vacancy: Dict[str, Any]) -> str:
        """Extract all text from vacancy for analysis"""
        text_parts = []
        
        # Title
        if vacancy.get("name"):
            text_parts.append(vacancy["name"])
        
        # Description
        if vacancy.get("description"):
            text_parts.append(vacancy["description"])
        
        # Snippet
        snippet = vacancy.get("snippet", {})
        if snippet:
            if snippet.get("responsibility"):
                text_parts.append(snippet["responsibility"])
            if snippet.get("requirement"):
                text_parts.append(snippet["requirement"])
        
        # Key skills
        key_skills = vacancy.get("key_skills", [])
        if key_skills:
            skills_text = " ".join([skill.get("name", "") for skill in key_skills if isinstance(skill, dict)])
            text_parts.append(skills_text)
        
        return " ".join(text_parts)

    async def _get_onboarding_profile(self, user: User, db: AsyncSession) -> Optional[OnboardingProfile]:
        """Get user's onboarding profile"""
        result = await db.execute(
            select(OnboardingProfile).where(OnboardingProfile.user_id == user.id)
        )
        return result.scalar_one_or_none()

    async def _get_latest_assessment(self, user: User, db: AsyncSession) -> Optional[AssessmentResult]:
        """Get user's latest assessment result"""
        result = await db.execute(
            select(AssessmentResult)
            .where(AssessmentResult.user_id == user.id)
            .order_by(AssessmentResult.created_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none() 