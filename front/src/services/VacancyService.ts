import ApiService from './ApiService'
import {
    DualRecommendationResponse,
    JobRecommendation,
    VacancySearchParams,
    HeadHunterVacancy,
    JobSearchResponse,
} from '@/app/(protected-pages)/main/vacancies/types'

class VacancyService {
    /**
     * Get dual recommendations (personal + assessment-based)
     */
    async getDualRecommendations(params?: {
        page?: number
        per_page?: number
        refresh?: boolean
    }): Promise<DualRecommendationResponse> {
        const searchParams = new URLSearchParams()

        if (params?.page !== undefined) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.per_page !== undefined) {
            searchParams.append('per_page', params.per_page.toString())
        }
        if (params?.refresh !== undefined) {
            searchParams.append('refresh', params.refresh.toString())
        }

        console.log(
            '🔍 Requesting personal recommendations with params:',
            params,
        )

        const response = await ApiService.fetchData<DualRecommendationResponse>(
            {
                url: `/api/enhanced-jobs/dual-recommendations?${searchParams.toString()}`,
                method: 'GET',
            },
        )

        console.log('✅ Personal recommendations response:', {
            totalRecommendations: response.total_recommendations,
            personalCount:
                response.personal_block?.recommendations?.length || 0,
        })

        // If no recommendations found, try without strict filters
        if (response.total_recommendations === 0) {
            console.log(
                '🔄 No recommendations found, trying without strict filters...',
            )
            searchParams.append('disable_filters', 'true')

            const fallbackResponse =
                await ApiService.fetchData<DualRecommendationResponse>({
                    url: `/api/enhanced-jobs/dual-recommendations?${searchParams.toString()}`,
                    method: 'GET',
                })

            console.log('🔄 Fallback response:', {
                totalRecommendations: fallbackResponse.total_recommendations,
                personalCount:
                    fallbackResponse.personal_block?.recommendations?.length ||
                    0,
            })

            return fallbackResponse
        }

        return response
    }

    /**
     * Get personalized job recommendations (legacy endpoint)
     */
    async getPersonalizedRecommendations(params?: {
        page?: number
        per_page?: number
        refresh?: boolean
    }): Promise<{ recommendations: JobRecommendation[]; total: number }> {
        const searchParams = new URLSearchParams()

        if (params?.page !== undefined) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.per_page !== undefined) {
            searchParams.append('per_page', params.per_page.toString())
        }
        if (params?.refresh !== undefined) {
            searchParams.append('refresh', params.refresh.toString())
        }

        const response = await ApiService.fetchData<{
            recommendations: JobRecommendation[]
            total: number
        }>({
            url: `/api/jobs/recommendations?${searchParams.toString()}`,
            method: 'GET',
        })

        return response
    }

    /**
     * Search vacancies with custom parameters
     */
    async searchVacancies(
        searchParams: VacancySearchParams,
    ): Promise<JobSearchResponse> {
        const response = await ApiService.fetchData<JobSearchResponse>({
            url: '/api/jobs/search',
            method: 'POST',
            data: {
                page: searchParams.page || 0,
                per_page: searchParams.per_page || 20,
                override_skills: searchParams.text
                    ? [searchParams.text]
                    : undefined,
                override_location: searchParams.area,
                use_preferences: true,
            },
        })

        return response
    }

    /**
     * Search HeadHunter API directly
     */
    async searchHeadHunter(params: VacancySearchParams): Promise<{
        items: HeadHunterVacancy[]
        found: number
        pages: number
        page: number
        per_page: number
    }> {
        const response = await ApiService.fetchData<{
            items: HeadHunterVacancy[]
            found: number
            pages: number
            page: number
            per_page: number
        }>({
            url: '/api/hh/search',
            method: 'POST',
            data: { params },
        })

        return response
    }

    /**
     * Get vacancy details from HeadHunter
     */
    async getVacancyDetails(vacancyId: string): Promise<{
        success: boolean
        vacancy: HeadHunterVacancy
        alternate_url: string
        has_contacts: boolean
    }> {
        const response = await ApiService.fetchData<{
            success: boolean
            vacancy: HeadHunterVacancy
            alternate_url: string
            has_contacts: boolean
        }>({
            url: `/api/hh/vacancy/${vacancyId}`,
            method: 'GET',
        })

        return response
    }

    /**
     * Save a job recommendation
     */
    async saveJobRecommendation(jobId: number, saved: boolean): Promise<void> {
        await ApiService.fetchData<void>({
            url: `/api/jobs/recommendations/${jobId}/save`,
            method: 'POST',
            data: { saved },
        })
    }

    /**
     * Apply to a job
     */
    async applyToJob(
        jobId: number,
        applicationData?: {
            cover_letter?: string
            resume_url?: string
        },
    ): Promise<void> {
        await ApiService.fetchData<void>({
            url: `/api/jobs/recommendations/${jobId}/apply`,
            method: 'POST',
            data: applicationData || {},
        })
    }

    /**
     * Get job recommendation details
     */
    async getJobDetails(jobId: number): Promise<JobRecommendation> {
        const response = await ApiService.fetchData<JobRecommendation>({
            url: `/api/jobs/recommendations/${jobId}`,
            method: 'GET',
        })

        return response
    }

    /**
     * Provide feedback on a job recommendation
     */
    async provideFeedback(
        jobId: number,
        feedback: {
            is_relevant: boolean
            feedback_type?:
                | 'skills'
                | 'location'
                | 'salary'
                | 'company'
                | 'other'
            feedback_text?: string
        },
    ): Promise<void> {
        await ApiService.fetchData<void>({
            url: `/api/jobs/recommendations/${jobId}/feedback`,
            method: 'POST',
            data: feedback,
        })
    }

    /**
     * Get saved jobs
     */
    async getSavedJobs(params?: {
        page?: number
        per_page?: number
        status?: string
    }): Promise<{
        saved_jobs: JobRecommendation[]
        total: number
        page: number
        per_page: number
    }> {
        const searchParams = new URLSearchParams()

        if (params?.page !== undefined) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.per_page !== undefined) {
            searchParams.append('per_page', params.per_page.toString())
        }
        if (params?.status) {
            searchParams.append('status', params.status)
        }

        const response = await ApiService.fetchData<{
            saved_jobs: JobRecommendation[]
            total: number
            page: number
            per_page: number
        }>({
            url: `/api/jobs/saved?${searchParams.toString()}`,
            method: 'GET',
        })

        return response
    }

    /**
     * Update job application status
     */
    async updateApplicationStatus(
        jobId: number,
        status:
            | 'saved'
            | 'applied'
            | 'interview_scheduled'
            | 'interviewed'
            | 'offer_received'
            | 'hired'
            | 'rejected',
    ): Promise<void> {
        await ApiService.fetchData<void>({
            url: `/jobs/saved/${jobId}/status`,
            method: 'PATCH',
            data: { status },
        })
    }

    /**
     * Get job analytics/statistics
     */
    async getJobAnalytics(): Promise<{
        total_recommendations: number
        total_saved: number
        total_applied: number
        avg_relevance_score: number
        top_skills: string[]
        application_success_rate: number
    }> {
        const response = await ApiService.fetchData<{
            total_recommendations: number
            total_saved: number
            total_applied: number
            avg_relevance_score: number
            top_skills: string[]
            application_success_rate: number
        }>({
            url: '/jobs/analytics',
            method: 'GET',
        })

        return response
    }

    /**
     * Trigger recommendation update
     */
    async triggerRecommendationUpdate(): Promise<{
        success: boolean
        message: string
        task_id: string
        user_id: number
    }> {
        const response = await ApiService.fetchData<{
            success: boolean
            message: string
            task_id: string
            user_id: number
        }>({
            url: '/enhanced-jobs/trigger-update',
            method: 'POST',
        })

        return response
    }

    /**
     * Debug user skills and preferences
     */
    async debugUserSkills(): Promise<{
        user_id: number
        onboarding_completed: boolean
        onboarding_skills: string[] | null
        preferences_exist: boolean
        preferred_skills: string[] | null
        preferred_job_titles: string[] | null
        preferred_areas: string[] | null
        recent_recommendations: Array<{
            id: number
            title: string
            skills_match_score: number
            key_skills: string[] | null
            relevance_score: number
        }>
    }> {
        const response = await ApiService.fetchData<{
            user_id: number
            onboarding_completed: boolean
            onboarding_skills: string[] | null
            preferences_exist: boolean
            preferred_skills: string[] | null
            preferred_job_titles: string[] | null
            preferred_areas: string[] | null
            recent_recommendations: Array<{
                id: number
                title: string
                skills_match_score: number
                key_skills: string[] | null
                relevance_score: number
            }>
        }>({
            url: '/jobs/debug/skills',
            method: 'GET',
        })

        return response
    }
}

export default new VacancyService()
