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

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined'
        ? window.location.hostname === 'ai-komekshi.site'
            ? 'https://ai-komekshi.site/api'
            : `${window.location.protocol}//${window.location.hostname}:8000/api`
        : 'http://localhost:8000/api')

async function refreshAccessToken(token: JWT): Promise<JWT> {
    const res = await fetch(`${API_URL}/auth/refresh`, {
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

                try {
                    console.log(
                        '🔐 Attempting login to:',
                        `${API_URL}/auth/login`,
                    )
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    })

                    console.log('🔐 Response status:', res.status)

                    if (!res.ok) {
                        const errorText = await res.text()
                        console.error('🔐 Login failed:', res.status, errorText)
                        return null
                    }

                    const data = (await res.json()) as FastAPIAuthResponse
                    const payload = jwtDecode<AccessPayload>(data.access_token)

                    console.log('🔐 Login successful for user:', payload.sub)

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
                } catch (error) {
                    console.error('🔐 Login error:', error)
                    return null
                }
            },
        }),
    ],

    session: { strategy: 'jwt' },

    callbacks: {
        async jwt({ token, user }): Promise<JWT> {
            // Debug logging
            if (process.env.NODE_ENV === 'development') {
                console.log('🔍 NextAuth JWT Callback:', {
                    isNewUser: !!user,
                    hasStoredToken: !!token.accessToken,
                    tokenExpires: token.accessTokenExpires,
                    now: Date.now(),
                })
            }

            if (user) {
                // New login - store user data
                const newToken = {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                    id: String(user.id),
                    isFirstLogin: user.isFirstLogin,
                }

                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Storing new JWT token:', {
                        accessToken: user.accessToken?.slice(0, 20) + '...',
                        expires: user.accessTokenExpires
                            ? new Date(user.accessTokenExpires)
                            : undefined,
                    })
                }

                return newToken
            }

            // Check if token is still valid
            if (
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires
            ) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        '✅ Token still valid, returning existing token',
                    )
                }
                return token
            }

            // Token expired, try to refresh
            if (process.env.NODE_ENV === 'development') {
                console.log('🔄 Token expired, attempting refresh...')
            }
            return await refreshAccessToken(token)
        },

        async session({ session, token }): Promise<Session> {
            // Ensure session.user exists with required properties
            if (!session.user) {
                session.user = {
                    id: '',
                    email: '',
                    emailVerified: null,
                    accessTokenExpires: 0,
                    authority: [],
                    isFirstLogin: false,
                }
            }

            // Safely assign properties with null checks
            if (token.id) {
                session.user.id = String(token.id)
            }

            // This is critical - ensure accessToken is set
            session.accessToken = token.accessToken
            session.error = token.error
            session.user.accessTokenExpires = token.accessTokenExpires
            session.user.authority = token.authority || []

            // FOR TESTING: Force isFirstLogin to always be true
            session.user.isFirstLogin = true // token.isFirstLogin

            // Debug logging
            if (process.env.NODE_ENV === 'development') {
                console.log(
                    '🔍 NextAuth Session Callback (with isFirstLogin):',
                    {
                        hasAccessToken: !!token.accessToken,
                        hasSessionAccessToken: !!session.accessToken,
                        tokenExpires: token.accessTokenExpires,
                        error: token.error,
                        isFirstLogin: true, // Always true for testing
                        userId: session.user.id,
                    },
                )
            }

            return session
        },
    },

    pages: {
        signIn: '/sign-in',
        // Removed error page since /auth/error doesn't exist
        // NextAuth will use its default error handling
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

    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
}

export default authOptions
