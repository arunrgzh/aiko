-- Migration to add new profile columns to assessment_results table
-- Run this when you want to store strength profile data permanently

ALTER TABLE assessment_results 
ADD COLUMN IF NOT EXISTS strength_profile VARCHAR,
ADD COLUMN IF NOT EXISTS profile_scores JSON,
ADD COLUMN IF NOT EXISTS recommended_spheres JSON;

-- Add comment for documentation
COMMENT ON COLUMN assessment_results.strength_profile IS 'Primary strength profile (e.g., communicative_leader)';
COMMENT ON COLUMN assessment_results.profile_scores IS 'Scores for all 6 strength profiles';
COMMENT ON COLUMN assessment_results.recommended_spheres IS 'Recommended work spheres based on profile'; 