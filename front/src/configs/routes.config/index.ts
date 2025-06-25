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

export default routes
