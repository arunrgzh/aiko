import authRoute from './authRoute'
import botRoute from './botRoute'
import mainRoute from './mainRoute'
import type { Routes } from '@/@types/routes'

const routes: Routes = {
    ...authRoute,
    ...botRoute,
    ...mainRoute,
    '/onboarding': {
        key: 'onboarding',
        authority: [],
    },
}

export const protectedRoutes: Routes = {
    ...botRoute,
    ...mainRoute,
}

export const publicRoutes = {
    '/': true,
    '/landing': true,
}

export const authRoutes = authRoute

export default routes
