import type { OnboardingData } from '@/app/(protected-pages)/onboarding/page'

// Backend API interface
export interface OnboardingProfileData {
    // Персональная информация
    disability_type?: string
    disability_description?: string
    workplace_preferences?: string

    // Профессиональная информация
    profession?: string
    experience_level?: string
    education_level?: string

    // Навыки и предпочтения
    skills?: string[]
    work_format?: string[]
    employment_type?: string[]

    // Условия работы
    min_salary?: number
    max_salary?: number
    currency?: string
    preferred_cities?: string[]

    // Доступность
    accessibility_adaptations?: string[]
    platform_features?: string[]
    feedback_preference?: string
    accessibility_notes?: string

    // Завершение
    bio?: string
}

// Преобразование из frontend формата в backend формат
export function mapToBackendFormat(
    frontendData: OnboardingData,
): OnboardingProfileData {
    return {
        // Персональная информация
        disability_type: frontendData.disability_type?.join(', '),
        disability_description: frontendData.disability_description,
        workplace_preferences:
            frontendData.workplace_preferences?.join(', ') ||
            frontendData.workplace_other,

        // Профессиональная информация
        profession:
            frontendData.desired_field ||
            frontendData.desired_field_other ||
            frontendData.current_position,
        experience_level: frontendData.years_of_experience
            ? frontendData.years_of_experience > 6
                ? 'Более 6 лет'
                : frontendData.years_of_experience > 3
                  ? '3-6 лет'
                  : frontendData.years_of_experience > 1
                    ? '1-3 года'
                    : 'Без опыта'
            : undefined,
        education_level: frontendData.education_status,

        // Навыки и предпочтения
        skills: [
            ...(frontendData.skills || []),
            ...(frontendData.skills_other ? [frontendData.skills_other] : []),
            ...(frontendData.extra_skills ? [frontendData.extra_skills] : []),
        ].filter(Boolean),

        work_format: mapWorkFormat(frontendData.work_conditions),
        employment_type: frontendData.employment_type
            ? [frontendData.employment_type]
            : undefined,

        // Условия работы - пока оставляем пустыми, можно добавить позже
        preferred_cities: frontendData.preferred_locations,

        // Доступность
        accessibility_adaptations: [
            ...(frontendData.important_adaptations || []),
            ...(frontendData.adaptations_other
                ? [frontendData.adaptations_other]
                : []),
        ].filter(Boolean),

        platform_features: [
            ...(frontendData.platform_features || []),
            ...(frontendData.platform_features_other
                ? [frontendData.platform_features_other]
                : []),
        ].filter(Boolean),

        feedback_preference: frontendData.feedback,
        accessibility_notes: [
            ...(frontendData.accessibility_issues || []),
            ...(frontendData.accessibility_issues_other
                ? [frontendData.accessibility_issues_other]
                : []),
        ]
            .filter(Boolean)
            .join(', '),

        // Завершение
        bio: frontendData.bio,
    }
}

// Преобразование из backend формата в frontend формат
export function mapToFrontendFormat(
    backendData: OnboardingProfileData,
): Partial<OnboardingData> {
    return {
        // Персональная информация
        disability_type: backendData.disability_type
            ?.split(', ')
            .filter(Boolean),
        disability_description: backendData.disability_description,
        workplace_preferences: backendData.workplace_preferences
            ?.split(', ')
            .filter(Boolean),

        // Профессиональная информация
        desired_field: backendData.profession,
        education_status: backendData.education_level,

        // Навыки
        skills: backendData.skills,

        // Условия работы
        work_conditions: mapBackendWorkFormat(backendData.work_format),
        employment_type: backendData.employment_type?.[0],
        preferred_locations: backendData.preferred_cities,

        // Доступность
        important_adaptations: backendData.accessibility_adaptations,
        platform_features: backendData.platform_features,
        feedback: backendData.feedback_preference,

        // Завершение
        bio: backendData.bio,
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
