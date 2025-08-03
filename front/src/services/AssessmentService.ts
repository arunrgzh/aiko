import ApiService from './ApiService'

export interface AssessmentAnswer {
    question_id: number
    answer: string | number | string[]
}

export interface AssessmentQuestion {
    id: number
    question_text: string
    question_type: 'scale' | 'single_choice' | 'multiple_choice'
    assessment_category: string
    options: string[]
    weight: number
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
    strengths_analysis: string
    weaknesses_analysis: string
    improvement_suggestions: string
    overall_score: number
    confidence_level: number
    created_at: string
    updated_at: string
}

export interface ProfileSummary {
    id: number
    user_id: number
    summary_text: string
    generated_from: string
    version: number
    created_at: string
    updated_at: string
}

export interface AssessmentChoiceOption {
    take_assessment: boolean
    skip_onboarding_data?: boolean
}

class AssessmentService {
    static async getQuestions(
        assessmentType: string = 'skills_assessment',
    ): Promise<{
        questions: AssessmentQuestion[]
        total_questions: number
    }> {
        try {
            const response = await ApiService.fetchData<{
                questions: AssessmentQuestion[]
                total_questions: number
            }>({
                url: `/api/assessment/questions?assessment_type=${assessmentType}`,
                method: 'get',
            })
            return response
        } catch (error) {
            console.error('Error fetching assessment questions:', error)
            throw error
        }
    }

    static async submitAssessment(
        answers: AssessmentAnswer[],
        assessmentType: string = 'skills_assessment',
    ): Promise<AssessmentResult> {
        try {
            const response = await ApiService.fetchData<AssessmentResult>({
                url: '/api/assessment/submit',
                method: 'post',
                data: {
                    answers,
                    assessment_type: assessmentType,
                },
            })
            return response
        } catch (error) {
            console.error('Error submitting assessment:', error)
            throw error
        }
    }

    static async getResults(): Promise<AssessmentResult[]> {
        try {
            const response = await ApiService.fetchData<AssessmentResult[]>({
                url: '/api/assessment/results',
                method: 'get',
            })
            return response
        } catch (error) {
            console.error('Error fetching assessment results:', error)
            throw error
        }
    }

    static async getResult(assessmentId: number): Promise<AssessmentResult> {
        try {
            const response = await ApiService.fetchData<AssessmentResult>({
                url: `/api/assessment/results/${assessmentId}`,
                method: 'get',
            })
            return response
        } catch (error) {
            console.error('Error fetching assessment result:', error)
            throw error
        }
    }

    static async getProfileSummary(): Promise<ProfileSummary | null> {
        try {
            const response = await ApiService.fetchData<ProfileSummary | null>({
                url: '/api/assessment/profile-summary',
                method: 'get',
            })
            return response
        } catch (error) {
            console.error('Error fetching profile summary:', error)
            throw error
        }
    }

    static async chooseAssessmentOption(
        option: AssessmentChoiceOption,
    ): Promise<{
        message: string
        action: string
        assessment_url?: string
    }> {
        try {
            const response = await ApiService.fetchData<{
                message: string
                action: string
                assessment_url?: string
            }>({
                url: '/api/onboarding/assessment-option',
                method: 'post',
                data: option as unknown as Record<string, unknown>,
            })
            return response
        } catch (error) {
            console.error('Error choosing assessment option:', error)
            throw error
        }
    }
}

export default AssessmentService
