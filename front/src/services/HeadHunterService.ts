interface HHSearchParams {
    text?: string
    salary?: number
    area?: string[]
    schedule?: string[]
    employment?: string[]
    experience?: string
}

interface OnboardingProfile {
    profession?: string
    min_salary?: number
    preferred_cities?: string[]
    work_format?: string[]
    employment_type?: string[]
    experience_level?: string
    skills?: string[]
}

export class HeadHunterService {
    static async searchVacancies(profile: OnboardingProfile) {
        const params = this.buildSearchParams(profile)

        try {
            const response = await fetch('/api/headhunter/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ params }),
            })

            if (!response.ok) {
                throw new Error('Failed to search vacancies')
            }

            return await response.json()
        } catch (error) {
            console.error('Error searching vacancies:', error)
            throw error
        }
    }

    private static buildSearchParams(
        profile: OnboardingProfile,
    ): HHSearchParams {
        const params: HHSearchParams = {}

        // Профессия/ключевые слова
        if (profile.profession) {
            params.text = profile.profession
        }

        // Добавляем навыки к поисковому запросу
        if (profile.skills?.length) {
            const skillsText = profile.skills.join(' ')
            params.text = params.text
                ? `${params.text} ${skillsText}`
                : skillsText
        }

        // Зарплата
        if (profile.min_salary) {
            params.salary = profile.min_salary
        }

        // Города (нужно маппить на ID HeadHunter)
        if (profile.preferred_cities?.length) {
            params.area = this.mapCitiesToHHIds(profile.preferred_cities)
        }

        // Формат работы
        if (profile.work_format?.length) {
            params.schedule = this.mapWorkFormatToHH(profile.work_format)
        }

        // Тип занятости
        if (profile.employment_type?.length) {
            params.employment = this.mapEmploymentTypeToHH(
                profile.employment_type,
            )
        }

        // Опыт работы
        if (profile.experience_level) {
            params.experience = this.mapExperienceToHH(profile.experience_level)
        }

        return params
    }

    private static mapCitiesToHHIds(cities: string[]): string[] {
        const cityMapping: Record<string, string> = {
            Алматы: '160',
            Астана: '162',
            'Нур-Султан': '162',
            Шымкент: '164',
            Караганда: '165',
            Актобе: '166',
            Тараз: '167',
            Павлодар: '168',
            'Усть-Каменогорск': '169',
            Семей: '170',
            Атырау: '171',
            Костанай: '172',
            Кызылорда: '173',
            Уральск: '174',
            Петропавловск: '175',
            Актау: '176',
            Темиртау: '177',
            Туркестан: '178',
            Кокшетау: '179',
            Талдыкорган: '180',
        }

        return cities
            .map((city) => cityMapping[city])
            .filter((id) => id !== undefined)
    }

    private static mapWorkFormatToHH(formats: string[]): string[] {
        const formatMapping: Record<string, string> = {
            remote: 'remote',
            office: 'fullDay',
            hybrid: 'flexible',
        }

        return formats
            .map((format) => formatMapping[format])
            .filter((mapped) => mapped !== undefined)
    }

    private static mapEmploymentTypeToHH(types: string[]): string[] {
        const typeMapping: Record<string, string> = {
            'full-time': 'full',
            'part-time': 'part',
            project: 'project',
            internship: 'probation',
        }

        return types
            .map((type) => typeMapping[type])
            .filter((mapped) => mapped !== undefined)
    }

    private static mapExperienceToHH(experience: string): string {
        const experienceMapping: Record<string, string> = {
            'Без опыта': 'noExperience',
            '1-3 года': 'between1And3',
            '3-6 лет': 'between3And6',
            'Более 6 лет': 'moreThan6',
        }

        return experienceMapping[experience] || 'noExperience'
    }
}
