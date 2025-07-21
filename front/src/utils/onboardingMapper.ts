import type { OnboardingData } from '@/app/(protected-pages)/onboarding/page'

// Backend API interface
export interface OnboardingProfileData {
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
}

// Преобразование из frontend формата в backend формат
export function mapToBackendFormat(
    frontendData: OnboardingData,
): OnboardingProfileData {
    return {
        // Персональная информация
        first_name: frontendData.first_name,
        last_name: frontendData.last_name,
        phone: frontendData.phone,
        date_of_birth: frontendData.date_of_birth,
        gender: frontendData.gender,
        disability_type: frontendData.disability_type,
        disability_description: frontendData.disability_description,

        // Условия работы и предпочтения рабочего места
        work_conditions: frontendData.work_conditions,
        workplace_preferences: frontendData.workplace_preferences,
        workplace_other: frontendData.workplace_other,

        // Навыки и опыт
        skills: frontendData.skills,
        skills_other: frontendData.skills_other,
        desired_field: frontendData.desired_field,
        desired_field_other: frontendData.desired_field_other,
        extra_skills: frontendData.extra_skills,
        certifications: frontendData.certifications,

        // Образование и обучение
        education_status: frontendData.education_status,
        education_level: frontendData.education_status, // Map education_status to education_level
        wants_courses: frontendData.wants_courses,
        learning_topics: frontendData.learning_topics,
        learning_topics_other: frontendData.learning_topics_other,

        // Профессиональная информация
        profession: frontendData.desired_field || frontendData.desired_field_other || frontendData.current_position,
        current_position: frontendData.current_position,
        years_of_experience: frontendData.years_of_experience,
        experience_level: frontendData.years_of_experience
            ? frontendData.years_of_experience > 6
                ? 'Более 6 лет'
                : frontendData.years_of_experience > 3
                  ? '3-6 лет'
                  : frontendData.years_of_experience > 1
                    ? '1-3 года'
                    : 'Без опыта'
            : undefined,
        industry: frontendData.industry,

        // Рабочие предпочтения
        preferred_work_time: frontendData.preferred_work_time,
        work_format: mapWorkFormat(frontendData.work_conditions),
        employment_type: frontendData.employment_type ? [frontendData.employment_type] : undefined,
        preferred_job_types: frontendData.preferred_job_types,

        // Условия работы и зарплата
        preferred_locations: frontendData.preferred_locations,

        // Адаптации и доступность
        important_adaptations: frontendData.important_adaptations,
        adaptations_other: frontendData.adaptations_other,
        accessibility_adaptations: [
            ...(frontendData.important_adaptations || []),
            ...(frontendData.adaptations_other ? [frontendData.adaptations_other] : []),
        ].filter(Boolean),
        accessibility_issues: frontendData.accessibility_issues,
        accessibility_issues_other: frontendData.accessibility_issues_other,
        accessibility_notes: [
            ...(frontendData.accessibility_issues || []),
            ...(frontendData.accessibility_issues_other ? [frontendData.accessibility_issues_other] : []),
        ].filter(Boolean).join(', ') || undefined,

        // Ожидания от платформы
        platform_features: frontendData.platform_features,
        platform_features_other: frontendData.platform_features_other,
        feedback_preference: frontendData.feedback,
        feedback: frontendData.feedback,

        // Категории работы и особенности
        suitable_job_categories: frontendData.suitable_job_categories,
        job_features: frontendData.job_features,

        // Личная информация и ссылки
        bio: frontendData.bio,
        linkedin_url: frontendData.linkedin_url,
        portfolio_url: frontendData.portfolio_url,
    }
}

// Преобразование из backend формата в frontend формат
export function mapToFrontendFormat(
    backendData: OnboardingProfileData,
): Partial<OnboardingData> {
    return {
        // Персональная информация
        first_name: backendData.first_name,
        last_name: backendData.last_name,
        phone: backendData.phone,
        date_of_birth: backendData.date_of_birth,
        gender: backendData.gender,
        disability_type: backendData.disability_type,
        disability_description: backendData.disability_description,

        // Условия работы и предпочтения рабочего места
        work_conditions: backendData.work_conditions,
        workplace_preferences: backendData.workplace_preferences,
        workplace_other: backendData.workplace_other,

        // Навыки и опыт
        skills: backendData.skills,
        skills_other: backendData.skills_other,
        desired_field: backendData.desired_field,
        desired_field_other: backendData.desired_field_other,
        extra_skills: backendData.extra_skills,
        certifications: backendData.certifications,

        // Образование и обучение
        education_status: backendData.education_status,
        wants_courses: backendData.wants_courses,
        learning_topics: backendData.learning_topics,
        learning_topics_other: backendData.learning_topics_other,

        // Профессиональная информация
        current_position: backendData.current_position,
        years_of_experience: backendData.years_of_experience,
        industry: backendData.industry,

        // Рабочие предпочтения
        preferred_work_time: backendData.preferred_work_time,
        employment_type: backendData.employment_type?.[0],
        preferred_job_types: backendData.preferred_job_types,

        // Условия работы и зарплата
        preferred_locations: backendData.preferred_locations,

        // Адаптации и доступность
        important_adaptations: backendData.important_adaptations,
        adaptations_other: backendData.adaptations_other,
        accessibility_issues: backendData.accessibility_issues,
        accessibility_issues_other: backendData.accessibility_issues_other,

        // Ожидания от платформы
        platform_features: backendData.platform_features,
        platform_features_other: backendData.platform_features_other,
        feedback: backendData.feedback,

        // Категории работы и особенности
        suitable_job_categories: backendData.suitable_job_categories,
        job_features: backendData.job_features,

        // Личная информация и ссылки
        bio: backendData.bio,
        linkedin_url: backendData.linkedin_url,
        portfolio_url: backendData.portfolio_url,
    }
}

// Вспомогательные функции для маппинга
function mapWorkFormat(workConditions?: string[]): string[] | undefined {
    if (!workConditions) return undefined

    const mapping: Record<string, string> = {
        'Удаленная работа': 'remote',
        'Офисная работа': 'office',
        'Гибридный формат': 'hybrid',
        'Частичная занятость': 'part-time',
        'Полная занятость': 'full-time',
        'Проектная работа': 'project',
    }

    return workConditions
        .map((condition) => mapping[condition] || condition)
        .filter(Boolean)
}

function mapBackendWorkFormat(workFormat?: string[]): string[] | undefined {
    if (!workFormat) return undefined

    const mapping: Record<string, string> = {
        remote: 'Удаленная работа',
        office: 'Офисная работа',
        hybrid: 'Гибридный формат',
        'part-time': 'Частичная занятость',
        'full-time': 'Полная занятость',
        project: 'Проектная работа',
    }

    return workFormat.map((format) => mapping[format] || format).filter(Boolean)
}
