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

        const response = await ApiService.fetchData<DualRecommendationResponse>(
            {
                url: `/enhanced-jobs/dual-recommendations?${searchParams.toString()}`,
                method: 'GET',
            },
        )

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
            url: `/jobs/recommendations?${searchParams.toString()}`,
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
            url: '/jobs/search',
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
            url: '/headhunter/search',
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
            url: `/enhanced-jobs/vacancy/${vacancyId}`,
            method: 'GET',
        })

        return response
    }

    /**
     * Save a job recommendation
     */
    async saveJobRecommendation(jobId: number, saved: boolean): Promise<void> {
        await ApiService.fetchData<void>({
            url: `/jobs/recommendations/${jobId}/save`,
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
            url: `/jobs/recommendations/${jobId}/apply`,
            method: 'POST',
            data: applicationData || {},
        })
    }

    /**
     * Get job recommendation details
     */
    async getJobDetails(jobId: number): Promise<JobRecommendation> {
        const response = await ApiService.fetchData<JobRecommendation>({
            url: `/jobs/recommendations/${jobId}`,
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
            url: `/jobs/recommendations/${jobId}/feedback`,
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
            url: `/jobs/saved?${searchParams.toString()}`,
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
}

export default new VacancyService()
