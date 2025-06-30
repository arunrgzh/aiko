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
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    apiPrefix: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    authenticatedEntryPath: '/main/dashboard/',
    unAuthenticatedEntryPath: '/landing',
    signInEntryPath: '/sign-in',
    onboardingPath: '/onboarding',
    locale: 'ru',
    activeNavTranslation: true,
}

export default appConfig
