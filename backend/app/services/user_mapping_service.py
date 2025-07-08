import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from ..models.user import User
from ..models.onboarding import OnboardingProfile
from ..models.assessment import AssessmentResult
from ..models.job import UserJobPreferences
from ..schemas.job import UserJobPreferencesCreate

logger = logging.getLogger(__name__)

class UserMappingService:
    """Service for mapping user onboarding and assessment data to job preferences"""
    
    def __init__(self):
        # Skill mapping from general categories to specific skills
        self.skill_mapping = {
            "programming": [
                "Python", "Java", "JavaScript", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
                "React", "Vue.js", "Angular", "Node.js", "Django", "Flask", "Spring",
                "HTML", "CSS", "SQL", "MongoDB", "PostgreSQL", "MySQL"
            ],
            "design": [
                "Photoshop", "Illustrator", "Figma", "Sketch", "InDesign", "After Effects",
                "UI/UX Design", "Graphic Design", "Web Design", "Adobe Creative Suite",
                "Canva", "Blender", "3D Design", "Animation"
            ],
            "marketing": [
                "Digital Marketing", "SEO", "SEM", "Social Media Marketing", "Content Marketing",
                "Email Marketing", "Google Analytics", "Facebook Ads", "Google Ads",
                "Marketing Analytics", "Brand Management", "PR"
            ],
            "data_analysis": [
                "Excel", "Power BI", "Tableau", "SQL", "Python", "R", "SPSS", "SAS",
                "Data Visualization", "Statistics", "Machine Learning", "Data Mining",
                "Business Intelligence", "Analytics"
            ],
            "management": [
                "Project Management", "Team Leadership", "Agile", "Scrum", "Kanban",
                "Risk Management", "Budget Management", "Strategic Planning",
                "Business Analysis", "Process Optimization"
            ],
            "sales": [
                "Customer Relations", "CRM", "Sales Management", "Lead Generation",
                "Negotiation", "B2B Sales", "B2C Sales", "Account Management",
                "Cold Calling", "Sales Analytics"
            ],
            "finance": [
                "Accounting", "Financial Analysis", "Excel", "QuickBooks", "SAP",
                "Bookkeeping", "Tax Preparation", "Budget Planning", "Financial Reporting",
                "Investment Analysis", "Risk Assessment"
            ],
            "education": [
                "Teaching", "Curriculum Development", "Educational Technology",
                "Classroom Management", "Assessment", "Training", "Mentoring",
                "Online Learning", "Educational Research"
            ]
        }
        
        # Job title mapping from professions to specific job titles
        self.job_title_mapping = {
            "программист": [
                "Software Developer", "Web Developer", "Full Stack Developer", 
                "Backend Developer", "Frontend Developer", "Mobile Developer",
                "Python Developer", "Java Developer", "JavaScript Developer"
            ],
            "дизайнер": [
                "UI/UX Designer", "Graphic Designer", "Web Designer", 
                "Product Designer", "Visual Designer", "Motion Designer",
                "Brand Designer", "Creative Director"
            ],
            "маркетолог": [
                "Digital Marketer", "Marketing Manager", "SMM Manager",
                "Content Manager", "SEO Specialist", "Marketing Analyst",
                "Brand Manager", "Product Marketing Manager"
            ],
            "аналитик": [
                "Data Analyst", "Business Analyst", "System Analyst",
                "Financial Analyst", "Marketing Analyst", "Product Analyst",
                "Data Scientist", "Research Analyst"
            ],
            "менеджер": [
                "Project Manager", "Product Manager", "Sales Manager",
                "Account Manager", "Office Manager", "Operations Manager",
                "Team Lead", "Department Manager"
            ],
            "учитель": [
                "Teacher", "Instructor", "Trainer", "Tutor", "Coach",
                "Educational Specialist", "Curriculum Developer"
            ],
            "врач": [
                "Doctor", "Nurse", "Medical Assistant", "Specialist",
                "Healthcare Worker", "Medical Technician"
            ],
            "инженер": [
                "Software Engineer", "System Engineer", "Network Engineer",
                "DevOps Engineer", "Quality Engineer", "Technical Engineer"
            ]
        }
        
        # Location mapping to HeadHunter area IDs
        self.location_mapping = {
            "алматы": "160",
            "нур-султан": "159",
            "астана": "159", 
            "шымкент": "161",
            "атырау": "153",
            "актобе": "145",
            "караганда": "156",
            "павлодар": "158",
            "усть-каменогорск": "162",
            "тараз": "155",
            "уральск": "154",
            "петропавловск": "157",
            "семей": "164",
            "костанай": "149",
            "кызылорда": "163"
        }

    async def create_preferences_from_onboarding(
        self, 
        user: User, 
        db: AsyncSession
    ) -> UserJobPreferences:
        """Create job preferences from user's onboarding data"""
        
        logger.info(f"Creating job preferences from onboarding for user {user.id}")
        
        # Get onboarding profile
        onboarding_result = await db.execute(
            select(OnboardingProfile).where(OnboardingProfile.user_id == user.id)
        )
        onboarding_profile = onboarding_result.scalar_one_or_none()
        
        # Get assessment results
        assessment_result = await db.execute(
            select(AssessmentResult)
            .where(AssessmentResult.user_id == user.id)
            .order_by(AssessmentResult.created_at.desc())
            .limit(1)
        )
        assessment = assessment_result.scalar_one_or_none()
        
        # Build preferences
        preferences_data = {
            "user_id": user.id,
            "auto_update_from_feedback": True
        }
        
        if onboarding_profile:
            preferences_data.update(
                await self._extract_from_onboarding(onboarding_profile)
            )
        
        if assessment:
            assessment_prefs = await self._extract_from_assessment(assessment)
            # Merge assessment preferences with onboarding (assessment takes priority)
            for key, value in assessment_prefs.items():
                if value is not None:
                    if key in preferences_data and preferences_data[key] and isinstance(preferences_data[key], list):
                        # Combine lists and remove duplicates
                        combined = list(set(preferences_data[key] + value))
                        preferences_data[key] = combined
                    else:
                        preferences_data[key] = value
        
        # Create and return preferences
        preferences = UserJobPreferences(**preferences_data)
        return preferences

    async def _extract_from_onboarding(
        self, 
        profile: OnboardingProfile
    ) -> Dict[str, Any]:
        """Extract preferences from onboarding profile"""
        
        preferences = {}
        
        # Extract skills
        if profile.skills is not None:  # type: ignore
            expanded_skills = []
            for skill_category in profile.skills:  # type: ignore
                # Map general skills to specific technologies
                if skill_category.lower() in self.skill_mapping:
                    expanded_skills.extend(self.skill_mapping[skill_category.lower()][:5])  # Top 5 per category
                else:
                    expanded_skills.append(skill_category)
            
            preferences["preferred_skills"] = list(set(expanded_skills))[:20]  # Limit to 20 skills
        
        # Extract job titles from profession
        if profile.profession is not None:  # type: ignore
            profession_lower = profile.profession.lower()  # type: ignore
            job_titles = []
            
            # Direct mapping
            if profession_lower in self.job_title_mapping:
                job_titles.extend(self.job_title_mapping[profession_lower][:5])
            
            # Special handling for students
            if "студент" in profession_lower:
                job_titles.extend(["Стажер", "Ассистент", "Начинающий специалист", "Intern", "Assistant", "Junior"])

            # Add the profession itself
            job_titles.append(profile.profession)  # type: ignore
            
            preferences["preferred_job_titles"] = list(set(job_titles))
        
        # Extract location preferences
        if profile.preferred_cities is not None:  # type: ignore
            area_ids = []
            for city in profile.preferred_cities:  # type: ignore
                city_lower = city.lower().replace("-", "").replace("_", "")
                if city_lower in self.location_mapping:
                    area_ids.append(self.location_mapping[city_lower])
            
            if area_ids:
                preferences["preferred_areas"] = area_ids
        
        # Extract employment types
        if profile.work_format is not None:  # type: ignore
            employment_mapping = {
                "office": ["full_time"],
                "remote": ["full_time", "part_time"],
                "hybrid": ["full_time"],
                "flexible": ["part_time", "project"]
            }
            
            employment_types = []
            for work_format in profile.work_format:  # type: ignore
                if work_format.lower() in employment_mapping:
                    employment_types.extend(employment_mapping[work_format.lower()])
            
            if employment_types:
                preferences["employment_types"] = list(set(employment_types))
        
        if profile.employment_type is not None:  # type: ignore
            emp_type_mapping = {
                "full-time": "full_time",
                "part-time": "part_time", 
                "project": "project",
                "freelance": "project"
            }
            
            mapped_types = []
            for emp_type in profile.employment_type:  # type: ignore
                mapped = emp_type_mapping.get(emp_type.lower(), emp_type)
                mapped_types.append(mapped)
            
            preferences["employment_types"] = mapped_types
        
        # Extract salary preferences
        if profile.min_salary is not None:  # type: ignore
            preferences["preferred_salary_min"] = profile.min_salary  # type: ignore
        if profile.max_salary is not None:  # type: ignore
            preferences["preferred_salary_max"] = profile.max_salary  # type: ignore
        if profile.currency is not None:  # type: ignore
            preferences["salary_currency"] = profile.currency  # type: ignore
        
        # Extract remote work preference
        if profile.work_format is not None:  # type: ignore
            if "remote" in [wf.lower() for wf in profile.work_format]:  # type: ignore
                preferences["remote_work_preference"] = "prefer"
            elif "office" in [wf.lower() for wf in profile.work_format]:  # type: ignore
                preferences["remote_work_preference"] = "avoid"
            else:
                preferences["remote_work_preference"] = "any"
        
        return preferences

    async def _extract_from_assessment(
        self, 
        assessment: AssessmentResult
    ) -> Dict[str, Any]:
        """Extract preferences from assessment results"""
        
        preferences = {}
        
        # Extract skills from strengths
        if assessment.top_strengths is not None:  # type: ignore
            strength_skills = []
            
            for strength_data in assessment.top_strengths:  # type: ignore
                if isinstance(strength_data, dict):
                    category = strength_data.get("category", "")
                else:
                    # Handle if it's already an AssessmentStrength object
                    category = getattr(strength_data, "category", "")
                
                # Map assessment categories to skills
                if category == "technical":
                    strength_skills.extend(self.skill_mapping.get("programming", [])[:3])
                elif category == "communication":
                    strength_skills.extend(["Communication", "Presentation", "Writing", "Public Speaking"])
                elif category == "problem_solving":
                    strength_skills.extend(["Problem Solving", "Critical Thinking", "Analysis", "Research"])
                elif category == "learning":
                    strength_skills.extend(["Learning", "Adaptability", "Training", "Development"])
                elif category == "work_style":
                    strength_skills.extend(["Teamwork", "Leadership", "Independence", "Collaboration"])
            
            if strength_skills:
                preferences["preferred_skills"] = list(set(strength_skills))[:15]
        
        # Extract areas to avoid from weaknesses
        if assessment.top_weaknesses is not None:  # type: ignore
            avoided_skills = []
            
            for weakness_data in assessment.top_weaknesses:  # type: ignore
                if isinstance(weakness_data, dict):
                    category = weakness_data.get("category", "")
                else:
                    category = getattr(weakness_data, "category", "")
                
                # Map weakness categories to skills to avoid
                if category == "technical" and "technical" not in [s.get("category", "") for s in assessment.top_strengths]:  # type: ignore
                    avoided_skills.extend(["Advanced Programming", "System Administration", "Database Management"])
                elif category == "communication":
                    avoided_skills.extend(["Public Speaking", "Presentation"])
            
            if avoided_skills:
                preferences["avoided_skills"] = list(set(avoided_skills))[:10]
        
        return preferences

    async def update_preferences_from_onboarding_changes(
        self,
        user_id: int,
        updated_profile: OnboardingProfile,
        db: AsyncSession
    ) -> Optional[UserJobPreferences]:
        """Update existing preferences when onboarding data changes"""
        
        logger.info(f"Updating job preferences from onboarding changes for user {user_id}")
        
        # Get existing preferences
        prefs_result = await db.execute(
            select(UserJobPreferences).where(UserJobPreferences.user_id == user_id)
        )
        existing_prefs = prefs_result.scalar_one_or_none()
        
        if not existing_prefs:
            return None
        
        # Extract new preferences from updated profile
        new_prefs = await self._extract_from_onboarding(updated_profile)
        
        # Update existing preferences with new data
        for key, value in new_prefs.items():
            if value is not None:
                setattr(existing_prefs, key, value)
        
        existing_prefs.updated_at = datetime.utcnow()  # type: ignore
        
        return existing_prefs

    def extract_skills_from_text(self, text: str) -> List[str]:
        """Extract skills from free text (like bio or job descriptions)"""
        
        if not text:
            return []
        
        text_lower = text.lower()
        found_skills = []
        
        # Check all skill categories
        for category, skills in self.skill_mapping.items():
            for skill in skills:
                if skill.lower() in text_lower:
                    found_skills.append(skill)
        
        # Remove duplicates and limit
        return list(set(found_skills))[:15]

    def suggest_job_titles_from_skills(self, skills: List[str]) -> List[str]:
        """Suggest job titles based on user skills"""
        
        if not skills:
            return []
        
        skills_lower = [skill.lower() for skill in skills]
        suggested_titles = []
        
        # Programming skills -> Developer roles
        programming_skills = ["python", "java", "javascript", "react", "node.js", "html", "css"]
        if any(skill in skills_lower for skill in programming_skills):
            suggested_titles.extend([
                "Software Developer", "Web Developer", "Frontend Developer", 
                "Backend Developer", "Full Stack Developer"
            ])
        
        # Design skills -> Designer roles
        design_skills = ["photoshop", "figma", "sketch", "illustrator", "ui/ux"]
        if any(skill in skills_lower for skill in design_skills):
            suggested_titles.extend([
                "UI/UX Designer", "Graphic Designer", "Web Designer", "Product Designer"
            ])
        
        # Marketing skills -> Marketing roles
        marketing_skills = ["seo", "social media", "marketing", "analytics", "content"]
        if any(skill in skills_lower for skill in marketing_skills):
            suggested_titles.extend([
                "Digital Marketer", "Marketing Manager", "Content Manager", "SEO Specialist"
            ])
        
        # Data skills -> Analyst roles
        data_skills = ["excel", "sql", "analytics", "data", "statistics", "tableau", "power bi"]
        if any(skill in skills_lower for skill in data_skills):
            suggested_titles.extend([
                "Data Analyst", "Business Analyst", "Marketing Analyst", "Financial Analyst"
            ])
        
        return list(set(suggested_titles))[:10] 