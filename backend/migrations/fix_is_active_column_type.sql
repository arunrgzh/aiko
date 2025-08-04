-- Migration: Fix is_active column type in assessment_questions table
-- Date: 2024-01-XX

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

-- Add comment for documentation
COMMENT ON COLUMN assessment_questions.is_active IS 'Whether the question is active and should be shown to users'; 