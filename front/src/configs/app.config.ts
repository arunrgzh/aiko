export type AppConfig = {
    apiUrl: string | undefined
    apiPrefix: string | undefined
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    signInEntryPath: string
    onboardingPath: string
    locale: string
    activeNavTranslation: boolean
}

const appConfig: AppConfig = {
<<<<<<< HEAD
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://ai-komekshi.site/api',
    apiPrefix:
        process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ai-komekshi.site/api',
=======
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    apiPrefix: process.env.NEXT_PUBLIC_API_BASE_URL,
>>>>>>> 3abd56210396aa4ab1007ed780052fdf73c363e5
    authenticatedEntryPath: '/main/dashboard',
    unAuthenticatedEntryPath: '/landing',
    signInEntryPath: '/sign-in',
    onboardingPath: '/onboarding',
    locale: 'ru',
    activeNavTranslation: true,
}

export default appConfig
