import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
    interface User {
        id?: string
        accessToken?: string
        refreshToken?: string
        accessTokenExpires?: number
        authority?: string[]
        isFirstLogin?: boolean
    }

    interface Session {
        user: {
            id?: string
            name?: string | null
            email?: string | null
            image?: string | null
            authority?: string[]
            isFirstLogin?: boolean
            accessTokenExpires?: number
        }
        accessToken?: string
        error?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string
        accessToken?: string
        refreshToken?: string
        accessTokenExpires?: number
        authority?: string[]
        error?: string
        isFirstLogin?: boolean
    }
}
