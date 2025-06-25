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
    apiUrl: 'http://localhost:8000',
    apiPrefix: '/api',
    authenticatedEntryPath: '/main/dashboard/',
    unAuthenticatedEntryPath: '/landing',
    signInEntryPath: '/sign-in',
    onboardingPath: '/onboarding',
    locale: 'ru',
    activeNavTranslation: true,
}

export default appConfig
