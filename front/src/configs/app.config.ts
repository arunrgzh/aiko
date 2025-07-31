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
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    apiPrefix: process.env.NEXT_PUBLIC_API_BASE_URL,
    authenticatedEntryPath: '/main/dashboard',
    unAuthenticatedEntryPath: '/landing',
    signInEntryPath: '/sign-in',
    onboardingPath: '/onboarding',
    locale: 'ru',
    activeNavTranslation: true,
}

export default appConfig
