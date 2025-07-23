"""add_onboarding_profile_fields

Revision ID: 4a757ff897d2
Revises: c316a31ab208
Create Date: 2025-07-23 10:58:26.904934

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4a757ff897d2'
down_revision: Union[str, Sequence[str], None] = 'c316a31ab208'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('onboarding_profiles', sa.Column('last_name', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('phone', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('date_of_birth', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('gender', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('work_conditions', sa.JSON(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('workplace_other', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('skills_other', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('desired_field', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('desired_field_other', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('extra_skills', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('certifications', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('education_status', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('wants_courses', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('learning_topics', sa.JSON(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('learning_topics_other', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('current_position', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('years_of_experience', sa.Integer(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('industry', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('preferred_work_time', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('preferred_job_types', sa.JSON(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('preferred_locations', sa.JSON(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('important_adaptations', sa.JSON(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('adaptations_other', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('accessibility_issues', sa.JSON(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('accessibility_issues_other', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('platform_features_other', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('feedback', sa.Text(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('suitable_job_categories', sa.JSON(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('job_features', sa.JSON(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('linkedin_url', sa.String(), nullable=True))
    op.add_column('onboarding_profiles', sa.Column('portfolio_url', sa.String(), nullable=True))
    op.alter_column('onboarding_profiles', 'disability_type',
               existing_type=sa.VARCHAR(),
               type_=sa.JSON(),
               postgresql_using="to_jsonb(array[disability_type])",
               existing_nullable=True)
    op.alter_column('onboarding_profiles', 'workplace_preferences',
               existing_type=sa.TEXT(),
               type_=sa.JSON(),
               postgresql_using="to_jsonb(string_to_array(workplace_preferences, ','))",
               existing_nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('onboarding_profiles', 'workplace_preferences',
               existing_type=sa.JSON(),
               type_=sa.TEXT(),
               postgresql_using='workplace_preferences::text',
               existing_nullable=True)
    op.alter_column('onboarding_profiles', 'disability_type',
               existing_type=sa.JSON(),
               type_=sa.VARCHAR(),
               postgresql_using='disability_type::varchar',
               existing_nullable=True)
    op.drop_column('onboarding_profiles', 'portfolio_url')
    op.drop_column('onboarding_profiles', 'linkedin_url')
    op.drop_column('onboarding_profiles', 'job_features')
    op.drop_column('onboarding_profiles', 'suitable_job_categories')
    op.drop_column('onboarding_profiles', 'feedback')
    op.drop_column('onboarding_profiles', 'platform_features_other')
    op.drop_column('onboarding_profiles', 'accessibility_issues_other')
    op.drop_column('onboarding_profiles', 'accessibility_issues')
    op.drop_column('onboarding_profiles', 'adaptations_other')
    op.drop_column('onboarding_profiles', 'important_adaptations')
    op.drop_column('onboarding_profiles', 'preferred_locations')
    op.drop_column('onboarding_profiles', 'preferred_job_types')
    op.drop_column('onboarding_profiles', 'preferred_work_time')
    op.drop_column('onboarding_profiles', 'industry')
    op.drop_column('onboarding_profiles', 'years_of_experience')
    op.drop_column('onboarding_profiles', 'current_position')
    op.drop_column('onboarding_profiles', 'learning_topics_other')
    op.drop_column('onboarding_profiles', 'learning_topics')
    op.drop_column('onboarding_profiles', 'wants_courses')
    op.drop_column('onboarding_profiles', 'education_status')
    op.drop_column('onboarding_profiles', 'certifications')
    op.drop_column('onboarding_profiles', 'extra_skills')
    op.drop_column('onboarding_profiles', 'desired_field_other')
    op.drop_column('onboarding_profiles', 'desired_field')
    op.drop_column('onboarding_profiles', 'skills_other')
    op.drop_column('onboarding_profiles', 'workplace_other')
    op.drop_column('onboarding_profiles', 'work_conditions')
    op.drop_column('onboarding_profiles', 'gender')
    op.drop_column('onboarding_profiles', 'date_of_birth')
    op.drop_column('onboarding_profiles', 'phone')
    op.drop_column('onboarding_profiles', 'last_name')
