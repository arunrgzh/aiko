#!/usr/bin/env python3
"""
Script to apply database migrations
Run with: python scripts/apply_migrations.py
"""

import asyncio
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings

async def apply_migrations():
    """Apply database migrations"""
    
    # Create engine
    engine = create_async_engine(settings.database_url, echo=True)
    
    try:
        async with engine.begin() as conn:
            # Apply strength profile migration
            strength_profile_migration = """
            -- Add new columns for strength profiles if they don't exist
            ALTER TABLE assessment_results 
            ADD COLUMN IF NOT EXISTS strength_profile VARCHAR;
            
            ALTER TABLE assessment_results 
            ADD COLUMN IF NOT EXISTS profile_scores JSONB;
            
            ALTER TABLE assessment_results 
            ADD COLUMN IF NOT EXISTS recommended_spheres JSONB;
            
            -- Update assessment_type default value
            ALTER TABLE assessment_results 
            ALTER COLUMN assessment_type SET DEFAULT 'strength_assessment';
            
            -- Add indexes if they don't exist
            CREATE INDEX IF NOT EXISTS idx_assessment_results_strength_profile 
            ON assessment_results(strength_profile);
            
            CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_type 
            ON assessment_results(assessment_type);
            """
            
            await conn.execute(text(strength_profile_migration))
            print("✅ Successfully applied strength profile migration")
            
            # Apply is_active column type fix
            is_active_fix_migration = """
            -- First, update existing data to convert string values to boolean
            UPDATE assessment_questions 
            SET is_active = CASE 
                WHEN is_active = 'true' OR is_active = '1' OR is_active = 'TRUE' THEN true
                ELSE false
            END;
            
            -- Then change the column type to boolean
            ALTER TABLE assessment_questions 
            ALTER COLUMN is_active TYPE BOOLEAN USING is_active::boolean;
            
            -- Set default value
            ALTER TABLE assessment_questions 
            ALTER COLUMN is_active SET DEFAULT true;
            """
            
            await conn.execute(text(is_active_fix_migration))
            print("✅ Successfully applied is_active column type fix")
            
    except Exception as e:
        print(f"❌ Error applying migration: {e}")
        raise
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(apply_migrations()) 