import type { NextAuthConfig, Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { jwtDecode } from 'jwt-decode'

type FastAPIAuthResponse = {
    access_token: string
    refresh_token: string
    is_first_login: boolean
}
type AccessPayload = { sub: string; exp: number }

const API_URL = process.env.API_URL!

async function refreshAccessToken(token: JWT): Promise<JWT> {
    console.log('🔄 NextAuth: Attempting to refresh token...')
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token.refreshToken }),
        cache: 'no-store',
    })

    if (!res.ok) {
        console.error(
            '❌ NextAuth: Token refresh failed:',
            res.status,
            res.statusText,
        )
        return { ...token, error: 'RefreshAccessTokenError' }
    }

    const data = (await res.json()) as FastAPIAuthResponse
    const decoded = jwtDecode<AccessPayload>(data.access_token)

    console.log('✅ NextAuth: Token refreshed successfully')
    return {
        ...token,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accessTokenExpires: decoded.exp * 1000,
        error: undefined,
    }
}

export const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials) return null

                console.log('credentials', credentials)
                console.log('path', `${API_URL}/api/auth/login`)
                const res = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    }),
                })
                console.log('response', res)
                if (!res.ok) return null
                const data = (await res.json()) as FastAPIAuthResponse
                console.log('response data', data)
                const payload = jwtDecode<AccessPayload>(data.access_token)

                return {
                    id: payload.sub,
                    name: payload.sub,
                    email: payload.sub,
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    accessTokenExpires: payload.exp * 1000,
                    authority: [],
                    isFirstLogin: data.is_first_login,
                }
            },
        }),
    ],

    session: { strategy: 'jwt' },

    callbacks: {
        async jwt({ token, user }): Promise<JWT> {
            if (user) {
                console.log('🔑 NextAuth: New user login, storing tokens...')
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                    id: String(user.id),
                    isFirstLogin: user.isFirstLogin,
                }
            }

            console.log('🔍 NextAuth: Checking token expiry...', {
                expires: new Date(token.accessTokenExpires),
                now: new Date(Date.now()),
                isExpired: Date.now() >= token.accessTokenExpires,
            })

            if (Date.now() < token.accessTokenExpires) {
                console.log('✅ NextAuth: Token still valid')
                return token
            }

            console.log('⏰ NextAuth: Token expired, refreshing...')
            return await refreshAccessToken(token)
        },

        async session({ session, token }): Promise<Session> {
            console.log('🔗 NextAuth: Creating session...', {
                hasAccessToken: !!token.accessToken,
                hasError: !!token.error,
                tokenError: token.error,
            })

            session.user.id = String(token.id)
            session.accessToken = token.accessToken
            session.error = token.error
            session.user.isFirstLogin = token.isFirstLogin
            return session
        },
    },

    pages: {
        signIn: '/auth/sign-in',
    },
    logger: {
        error(code, ...message) {
            console.error(code, message)
        },
        warn(code, ...message) {
            console.warn(code, message)
        },
        debug(code, ...message) {
            console.debug(code, message)
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions
