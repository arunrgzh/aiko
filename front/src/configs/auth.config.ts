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
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token.refreshToken }),
        cache: 'no-store',
    })

    if (!res.ok) {
        return { ...token, error: 'RefreshAccessTokenError' }
    }

    const data = (await res.json()) as FastAPIAuthResponse
    const decoded = jwtDecode<AccessPayload>(data.access_token)

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

                const res = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    }),
                })

                if (!res.ok) return null
                const data = (await res.json()) as FastAPIAuthResponse
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
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                    id: String(user.id),
                    isFirstLogin: user.isFirstLogin,
                }
            }

            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            return await refreshAccessToken(token)
        },

        async session({ session, token }): Promise<Session> {
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
