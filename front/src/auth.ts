import NextAuth from 'next-auth'
import appConfig from '@/configs/app.config'
import authConfig from '@/configs/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: appConfig.signInEntryPath,
        error: '/auth/error',
    },

    session: {
        strategy: 'jwt',
    },
    ...authConfig,
})
