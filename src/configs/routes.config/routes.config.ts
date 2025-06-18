import mainRoute from './mainRoute'
import authRoute from './authRoute'
import botRoute from './botRoute'

import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
<<<<<<< HEAD
    ...dashboardsRoute,
    ...uiComponentsRoute,
    ...authDemoRoute,
    ...conceptsRoute,
    ...guideRoute,
    ...botRoute,
=======
    ...botRoute,
    ...mainRoute
>>>>>>> d950f28c931be89f3fee03853c040e2c28d78559
}

export const publicRoutes = {
    '/': true,
    '/landing': true, // Add this
}

export const authRoutes = authRoute
