-- Migration: Add strength profile fields to assessment_results table
-- Date: 2024-01-XX

-- Add new columns for strength profiles
ALTER TABLE assessment_results 
ADD COLUMN strength_profile VARCHAR,
ADD COLUMN profile_scores JSONB,
ADD COLUMN recommended_spheres JSONB;

-- Update assessment_type default value
ALTER TABLE assessment_results 
ALTER COLUMN assessment_type SET DEFAULT 'strength_assessment';

-- Add indexes for better performance
CREATE INDEX idx_assessment_results_strength_profile ON assessment_results(strength_profile);
CREATE INDEX idx_assessment_results_assessment_type ON assessment_results(assessment_type);

-- Add comments for documentation
COMMENT ON COLUMN assessment_results.strength_profile IS 'Primary strength profile (e.g., communicative_leader, organizer, etc.)';
COMMENT ON COLUMN assessment_results.profile_scores IS 'JSON object with scores for all 6 strength profiles';
COMMENT ON COLUMN assessment_results.recommended_spheres IS 'Array of recommended work spheres based on strength profile'; 