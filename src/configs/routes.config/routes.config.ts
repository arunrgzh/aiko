import mainRoute from './mainRoute'
import authRoute from './authRoute'
import botRoute from './botRoute'

import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    ...botRoute,
    ...mainRoute,
}

export const publicRoutes = {
    '/': true,
    '/landing': true, // Add this
}

export const authRoutes = authRoute
