"""
Migration script to add new onboarding fields to the existing onboarding_profiles table.
This script adds all the missing fields that were identified during the analysis.
"""

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

async def add_onboarding_fields():
    """Add new fields to onboarding_profiles table"""
    
    # SQL statements to add new columns
    migration_sql = [
        # Personal information fields
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS first_name VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS last_name VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS gender VARCHAR;",
        
        # Update disability_type to JSON (if not already)
        "ALTER TABLE onboarding_profiles ALTER COLUMN disability_type TYPE JSON USING disability_type::JSON;",
        
        # Work conditions and preferences
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS work_conditions JSON;",
        "ALTER TABLE onboarding_profiles ALTER COLUMN workplace_preferences TYPE JSON USING workplace_preferences::JSON;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS workplace_other TEXT;",
        
        # Skills and experience
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS skills_other TEXT;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS desired_field VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS desired_field_other TEXT;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS extra_skills TEXT;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS certifications TEXT;",
        
        # Education and learning
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS education_status VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS wants_courses VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS learning_topics JSON;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS learning_topics_other TEXT;",
        
        # Professional information
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS current_position VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS years_of_experience INTEGER;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS industry VARCHAR;",
        
        # Work preferences
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS preferred_work_time VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS preferred_job_types JSON;",
        
        # Work conditions and salary
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS preferred_locations JSON;",
        
        # Adaptations and accessibility
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS important_adaptations JSON;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS adaptations_other TEXT;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS accessibility_issues JSON;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS accessibility_issues_other TEXT;",
        
        # Platform expectations
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS platform_features_other TEXT;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS feedback TEXT;",
        
        # Job categories and features
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS suitable_job_categories JSON;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS job_features JSON;",
        
        # Personal information and links
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR;",
        "ALTER TABLE onboarding_profiles ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR;",
    ]
    
    async for db in get_db():
        try:
            for sql in migration_sql:
                await db.execute(text(sql))
            await db.commit()
            print("Migration completed successfully!")
        except Exception as e:
            await db.rollback()
            print(f"Migration failed: {e}")
            raise
        finally:
            await db.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(add_onboarding_fields())
