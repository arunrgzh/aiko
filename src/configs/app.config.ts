export type AppConfig = {
    apiUrl: string
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    signInEntryPath: string
    locale: string
    activeNavTranslation: boolean
}

const appConfig: AppConfig = {
    apiUrl: 'http://46.226.123.179:8081',
    apiPrefix: '/api',
    authenticatedEntryPath: '/main/dashboard/',
    unAuthenticatedEntryPath: '/landing',
    signInEntryPath: '/sign-in',
    locale: 'ru',
    activeNavTranslation: true,
}

export default appConfig
