export type AppConfig = {
    apiUrl: string
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    signInEntryPath: string
    onboardingPath: string
    locale: string
    activeNavTranslation: boolean
}

const appConfig: AppConfig = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://ai-komekshi.site/api',
    apiPrefix:
        process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ai-komekshi.site/api',
    authenticatedEntryPath: '/main/dashboard',
    unAuthenticatedEntryPath: '/landing',
    signInEntryPath: '/sign-in',
    onboardingPath: '/onboarding',
    locale: 'ru',
    activeNavTranslation: true,
}

export default appConfig
