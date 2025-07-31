import ApiService from './ApiService'

export interface OnboardingProfile {
    id: number
    user_id: number

    // Персональная информация
    first_name?: string
    last_name?: string
    phone?: string
    date_of_birth?: string
    gender?: string
    disability_type?: string[]
    disability_description?: string

    // Условия работы и предпочтения рабочего места
    work_conditions?: string[]
    workplace_preferences?: string[]
    workplace_other?: string

    // Навыки и опыт
    skills?: string[]
    skills_other?: string
    desired_field?: string
    desired_field_other?: string
    extra_skills?: string
    certifications?: string

    // Образование и обучение
    education_status?: string
    education_level?: string
    wants_courses?: string
    learning_topics?: string[]
    learning_topics_other?: string

    // Профессиональная информация
    profession?: string
    current_position?: string
    years_of_experience?: number
    experience_level?: string
    industry?: string

    // Рабочие предпочтения
    preferred_work_time?: string
    work_format?: string[]
    employment_type?: string[]
    preferred_job_types?: string[]

    // Условия работы и зарплата
    min_salary?: number
    max_salary?: number
    currency?: string
    preferred_cities?: string[]
    preferred_locations?: string[]

    // Адаптации и доступность
    important_adaptations?: string[]
    adaptations_other?: string
    accessibility_adaptations?: string[]
    accessibility_issues?: string[]
    accessibility_issues_other?: string
    accessibility_notes?: string

    // Ожидания от платформы
    platform_features?: string[]
    platform_features_other?: string
    feedback_preference?: string
    feedback?: string

    // Категории работы и особенности
    suitable_job_categories?: string[]
    job_features?: string[]

    // Личная информация и ссылки
    bio?: string
    linkedin_url?: string
    portfolio_url?: string

    // Статус
    is_completed: boolean
    created_at: string
    updated_at?: string
}

export interface AssessmentStrength {
    category: string
    score: number
    description: string
}

export interface AssessmentWeakness {
    category: string
    score: number
    description: string
}

export interface AssessmentResult {
    id: number
    user_id: number
    assessment_type: string
    version: string
    top_strengths: AssessmentStrength[]
    top_weaknesses: AssessmentWeakness[]
    strengths_analysis?: string
    weaknesses_analysis?: string
    improvement_suggestions?: string
    overall_score?: number
    confidence_level?: number
    created_at: string
    updated_at?: string
}

export interface ProfileSummary {
    id: number
    user_id: number
    summary_text: string
    generated_from?: string
    version: number
    created_at: string
    updated_at?: string
}

export interface FullUserProfile {
    onboarding_profile?: OnboardingProfile
    assessment_results: AssessmentResult[]
    profile_summary?: ProfileSummary
}

class ProfileService {
    async getOnboardingProfile(): Promise<OnboardingProfile | null> {
        try {
            return await ApiService.fetchDataWithAxios<OnboardingProfile>({
                url: '/onboarding/profile',
                method: 'get',
            })
        } catch (error) {
            console.error('Error fetching onboarding profile:', error)
            return null
        }
    }

    async getAssessmentResults(): Promise<AssessmentResult[]> {
        try {
            return await ApiService.fetchDataWithAxios<AssessmentResult[]>({
                url: '/assessment/results',
                method: 'get',
            })
        } catch (error) {
            console.error('Error fetching assessment results:', error)
            return []
        }
    }

    async getProfileSummary(): Promise<ProfileSummary | null> {
        try {
            return await ApiService.fetchDataWithAxios<ProfileSummary>({
                url: '/assessment/profile-summary',
                method: 'get',
            })
        } catch (error) {
            console.error('Error fetching profile summary:', error)
            return null
        }
    }

    async getFullProfile(): Promise<FullUserProfile> {
        const [onboarding_profile, assessment_results, profile_summary] =
            await Promise.allSettled([
                this.getOnboardingProfile(),
                this.getAssessmentResults(),
                this.getProfileSummary(),
            ])

        return {
            onboarding_profile:
                onboarding_profile.status === 'fulfilled'
                    ? onboarding_profile.value || undefined
                    : undefined,
            assessment_results:
                assessment_results.status === 'fulfilled'
                    ? assessment_results.value
                    : [],
            profile_summary:
                profile_summary.status === 'fulfilled'
                    ? profile_summary.value || undefined
                    : undefined,
        }
    }
}

export default new ProfileService()
