export type VacancySalary = {
    from?: number
    to?: number
    currency: string
    gross?: boolean
}

export type VacancyArea = {
    id: string
    name: string
    url?: string
}

export type VacancyEmployer = {
    id?: string
    name: string
    url?: string
    logo_urls?: {
        original?: string
        '90'?: string
        '240'?: string
    }
    trusted?: boolean
}

export type VacancyEmployment = {
    id: string
    name: string
}

export type VacancyExperience = {
    id: string
    name: string
}

export type VacancySnippet = {
    requirement?: string
    responsibility?: string
}

export type HeadHunterVacancy = {
    id: string
    name: string
    area: VacancyArea
    salary?: VacancySalary
    employer: VacancyEmployer
    published_at: string
    created_at: string
    archived: boolean
    snippet?: VacancySnippet
    employment?: VacancyEmployment
    experience?: VacancyExperience
    url: string
    alternate_url: string
    apply_alternate_url?: string
    relations?: string[]
    schedule?: {
        id: string
        name: string
    }
    working_days?: {
        id: string
        name: string
    }
    working_time_intervals?: {
        id: string
        name: string
    }
    working_time_modes?: {
        id: string
        name: string
    }
    accept_temporary?: boolean
    professional_roles?: Array<{
        id: string
        name: string
    }>
    accept_incomplete_resumes?: boolean
    branded_description?: string
    contacts?: {
        name?: string
        email?: string
        phones?: Array<{
            country: string
            city: string
            number: string
            comment?: string
        }>
    }
}

export type JobRecommendation = {
    id: number
    hh_vacancy_id: string
    title: string
    company_name?: string
    salary_from?: number
    salary_to?: number
    currency: string
    area_name?: string
    employment_type?: string
    experience_required?: string
    description?: string
    key_skills?: string[]
    relevance_score: number
    skills_match_score: number
    location_match_score: number
    salary_match_score: number
    is_saved?: boolean
    user_feedback?: boolean
    created_at: string
    raw_data?: HeadHunterVacancy
    recommendation_source?: string
    source_explanation?: string
    detailed_scores?: Record<string, number>
}

export type DualRecommendationBlock = {
    source: string
    title: string
    description: string
    recommendations: JobRecommendation[]
    total_found: number
}

export type DualRecommendationResponse = {
    personal_block: DualRecommendationBlock
    assessment_block?: DualRecommendationBlock
    user_has_assessment: boolean
    total_recommendations: number
    generated_at: string
}

export type PersonalizedVacanciesResponse = {
    personal: JobRecommendation[]
    assessment: JobRecommendation[]
}

export type VacancySearchParams = {
    text?: string
    area?: string
    salary_from?: number
    salary_to?: number
    employment?: string[]
    experience?: string
    page?: number
    per_page?: number
}

export type VacancyGenerationState = 'loading' | 'generated' | 'error'

export type VacancyFilters = {
    salaryRange: [number, number]
    area: string
    employment: string[]
    experience: string
    company: string
    datePosted: 'any' | 'week' | 'month'
}

export type ApiResponse<T> = {
    success: boolean
    data?: T
    message?: string
    error?: string
}

export type JobSearchResponse = {
    recommendations: JobRecommendation[]
    total: number
    page: number
    per_page: number
    total_pages: number
}
