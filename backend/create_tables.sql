-- PostgreSQL Table Creation Script for AI-Komek Database
-- Generated from SQLAlchemy models

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS job_feedbacks CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS user_job_preferences CASCADE;
DROP TABLE IF EXISTS job_recommendations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_histories CASCADE;
DROP TABLE IF EXISTS assistants CASCADE;
DROP TABLE IF EXISTS profile_summaries CASCADE;
DROP TABLE IF EXISTS assessment_results CASCADE;
DROP TABLE IF EXISTS assessment_questions CASCADE;
DROP TABLE IF EXISTS onboarding_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE message_role AS ENUM ('user', 'ai', 'system');

-- Users table (base table)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_first_login BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Onboarding profiles table
CREATE TABLE onboarding_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    disability_type VARCHAR,
    disability_description TEXT,
    workplace_preferences TEXT,
    profession VARCHAR,
    experience_level VARCHAR,
    education_level VARCHAR,
    skills JSONB,
    work_format JSONB,
    employment_type JSONB,
    min_salary INTEGER,
    max_salary INTEGER,
    currency VARCHAR DEFAULT 'KZT',
    preferred_cities JSONB,
    accessibility_adaptations JSONB,
    platform_features JSONB,
    feedback_preference VARCHAR,
    accessibility_notes TEXT,
    bio TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for onboarding_profiles
CREATE INDEX idx_onboarding_profiles_user_id ON onboarding_profiles(user_id);
CREATE INDEX idx_onboarding_profiles_is_completed ON onboarding_profiles(is_completed);

-- Assessment questions table
CREATE TABLE assessment_questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR NOT NULL,
    assessment_category VARCHAR NOT NULL,
    options JSONB,
    weight FLOAT DEFAULT 1.0,
    scoring_criteria JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for assessment_questions
CREATE INDEX idx_assessment_questions_category ON assessment_questions(assessment_category);
CREATE INDEX idx_assessment_questions_type ON assessment_questions(question_type);
CREATE INDEX idx_assessment_questions_is_active ON assessment_questions(is_active);

-- Assessment results table
CREATE TABLE assessment_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_type VARCHAR DEFAULT 'skills_assessment',
    version VARCHAR DEFAULT '1.0',
    raw_answers JSONB NOT NULL,
    top_strengths JSONB NOT NULL,
    top_weaknesses JSONB NOT NULL,
    strengths_analysis TEXT,
    weaknesses_analysis TEXT,
    improvement_suggestions TEXT,
    overall_score FLOAT,
    confidence_level FLOAT,
    embedding_id VARCHAR UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for assessment_results
CREATE INDEX idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_embedding_id ON assessment_results(embedding_id);
CREATE INDEX idx_assessment_results_assessment_type ON assessment_results(assessment_type);

-- Profile summaries table
CREATE TABLE profile_summaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    summary_text TEXT NOT NULL,
    embedding_id VARCHAR UNIQUE,
    generated_from VARCHAR,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for profile_summaries
CREATE INDEX idx_profile_summaries_user_id ON profile_summaries(user_id);
CREATE INDEX idx_profile_summaries_embedding_id ON profile_summaries(embedding_id);

-- Assistants table
CREATE TABLE assistants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description TEXT,
    model VARCHAR DEFAULT 'gpt-3.5-turbo',
    system_prompt TEXT,
    temperature VARCHAR DEFAULT '0.7',
    max_tokens INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for assistants
CREATE INDEX idx_assistants_user_id ON assistants(user_id);
CREATE INDEX idx_assistants_is_active ON assistants(is_active);

-- Chat histories table
CREATE TABLE chat_histories (
    id SERIAL PRIMARY KEY,
    assistant_id INTEGER NOT NULL REFERENCES assistants(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    last_conversation TEXT,
    enable BOOLEAN DEFAULT TRUE,
    created_time INTEGER NOT NULL,
    updated_time INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for chat_histories
CREATE INDEX idx_chat_histories_assistant_id ON chat_histories(assistant_id);
CREATE INDEX idx_chat_histories_user_id ON chat_histories(user_id);
CREATE INDEX idx_chat_histories_enable ON chat_histories(enable);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_history_id INTEGER NOT NULL REFERENCES chat_histories(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role message_role NOT NULL,
    sender_id VARCHAR NOT NULL,
    sender_name VARCHAR NOT NULL,
    avatar_image_url VARCHAR,
    is_my_message BOOLEAN DEFAULT FALSE,
    fresh BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for messages
CREATE INDEX idx_messages_chat_history_id ON messages(chat_history_id);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Job recommendations table
CREATE TABLE job_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hh_vacancy_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    company_name VARCHAR,
    salary_from INTEGER,
    salary_to INTEGER,
    currency VARCHAR DEFAULT 'KZT',
    area_name VARCHAR,
    employment_type VARCHAR,
    experience_required VARCHAR,
    description TEXT,
    key_skills JSONB,
    relevance_score FLOAT DEFAULT 0.0,
    skills_match_score FLOAT DEFAULT 0.0,
    location_match_score FLOAT DEFAULT 0.0,
    salary_match_score FLOAT DEFAULT 0.0,
    raw_data JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_user_vacancy UNIQUE (user_id, hh_vacancy_id)
);

-- Create indexes for job_recommendations
CREATE INDEX idx_job_recommendations_user_id ON job_recommendations(user_id);
CREATE INDEX idx_job_recommendations_hh_vacancy_id ON job_recommendations(hh_vacancy_id);
CREATE INDEX idx_job_recommendations_relevance_score ON job_recommendations(relevance_score);
CREATE INDEX idx_job_recommendations_is_active ON job_recommendations(is_active);

-- User job preferences table
CREATE TABLE user_job_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferred_skills JSONB,
    avoided_skills JSONB,
    preferred_job_titles JSONB,
    avoided_job_titles JSONB,
    preferred_areas JSONB,
    remote_work_preference VARCHAR DEFAULT 'any',
    employment_types JSONB,
    preferred_salary_min INTEGER,
    preferred_salary_max INTEGER,
    salary_currency VARCHAR DEFAULT 'KZT',
    preferred_company_types JSONB,
    company_size_preference JSONB,
    positive_keywords JSONB,
    negative_keywords JSONB,
    auto_update_from_feedback BOOLEAN DEFAULT TRUE,
    last_feedback_analysis TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for user_job_preferences
CREATE INDEX idx_user_job_preferences_user_id ON user_job_preferences(user_id);

-- Saved jobs table
CREATE TABLE saved_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_recommendation_id INTEGER NOT NULL REFERENCES job_recommendations(id) ON DELETE CASCADE,
    notes TEXT,
    application_status VARCHAR DEFAULT 'saved',
    application_date TIMESTAMP WITH TIME ZONE,
    reminder_date TIMESTAMP WITH TIME ZONE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_user_saved_job UNIQUE (user_id, job_recommendation_id)
);

-- Create indexes for saved_jobs
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_recommendation_id ON saved_jobs(job_recommendation_id);
CREATE INDEX idx_saved_jobs_application_status ON saved_jobs(application_status);
CREATE INDEX idx_saved_jobs_is_archived ON saved_jobs(is_archived);

-- Job feedbacks table
CREATE TABLE job_feedbacks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_recommendation_id INTEGER NOT NULL REFERENCES job_recommendations(id) ON DELETE CASCADE,
    is_relevant BOOLEAN,
    is_interested BOOLEAN,
    relevance_score INTEGER,
    feedback_notes TEXT,
    skill_match_feedback VARCHAR,
    location_feedback VARCHAR,
    salary_feedback VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_user_job_feedback UNIQUE (user_id, job_recommendation_id)
);

-- Create indexes for job_feedbacks
CREATE INDEX idx_job_feedbacks_user_id ON job_feedbacks(user_id);
CREATE INDEX idx_job_feedbacks_job_recommendation_id ON job_feedbacks(job_recommendation_id);
CREATE INDEX idx_job_feedbacks_is_relevant ON job_feedbacks(is_relevant);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_profiles_updated_at BEFORE UPDATE ON onboarding_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_questions_updated_at BEFORE UPDATE ON assessment_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_results_updated_at BEFORE UPDATE ON assessment_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_summaries_updated_at BEFORE UPDATE ON profile_summaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assistants_updated_at BEFORE UPDATE ON assistants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_histories_updated_at BEFORE UPDATE ON chat_histories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_recommendations_updated_at BEFORE UPDATE ON job_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_job_preferences_updated_at BEFORE UPDATE ON user_job_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_jobs_updated_at BEFORE UPDATE ON saved_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_feedbacks_updated_at BEFORE UPDATE ON job_feedbacks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add some helpful comments
COMMENT ON TABLE users IS 'Main users table with authentication data';
COMMENT ON TABLE onboarding_profiles IS 'User onboarding data including disability info and preferences';
COMMENT ON TABLE assessment_questions IS 'Questions used in skills assessments';
COMMENT ON TABLE assessment_results IS 'Results from user skill assessments';
COMMENT ON TABLE profile_summaries IS 'AI-generated user profile summaries';
COMMENT ON TABLE assistants IS 'AI assistant configurations for users';
COMMENT ON TABLE chat_histories IS 'Chat session histories between users and assistants';
COMMENT ON TABLE messages IS 'Individual messages within chat sessions';
COMMENT ON TABLE job_recommendations IS 'Job recommendations from HeadHunter API';
COMMENT ON TABLE user_job_preferences IS 'User job preferences derived from onboarding and feedback';
COMMENT ON TABLE saved_jobs IS 'Jobs saved by users for later reference';
COMMENT ON TABLE job_feedbacks IS 'User feedback on job recommendations for ML improvement';

-- Insert some sample data (optional)
-- You can uncomment and modify these if you want sample data

/*
-- Sample user
INSERT INTO users (username, email, hashed_password) VALUES 
('testuser', 'test@example.com', '$2b$12$example_hashed_password');

-- Sample assessment questions
INSERT INTO assessment_questions (question_text, question_type, assessment_category, options) VALUES 
('How would you rate your communication skills?', 'scale', 'communication', '{"scale": {"min": 1, "max": 5}}'),
('Which programming languages do you know?', 'multiple_choice', 'technical', '{"options": ["Python", "JavaScript", "Java", "C++", "Other"]}');
*/

COMMIT; 