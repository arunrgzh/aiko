import ApiService from './ApiService'

export interface OnboardingProfile {
    id: number
    user_id: number
    disability_type?: string
    disability_description?: string
    workplace_preferences?: string
    profession?: string
    experience_level?: string
    education_level?: string
    skills?: string[]
    work_format?: string[]
    employment_type?: string[]
    min_salary?: number
    max_salary?: number
    currency?: string
    preferred_cities?: string[]
    accessibility_adaptations?: string[]
    platform_features?: string[]
    feedback_preference?: string
    accessibility_notes?: string
    bio?: string
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
