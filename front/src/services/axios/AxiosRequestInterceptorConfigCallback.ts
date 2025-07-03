import type { InternalAxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'

// Cache for session token to avoid excessive getSession calls
let cachedToken: string | null = null
let tokenExpiry: number = 0
let isRefreshing = false

const AxiosRequestInterceptorConfigCallback = async (
    config: InternalAxiosRequestConfig,
) => {
    // Only fetch session if we don't have a cached token or it's expired
    const now = Date.now()

    if (!cachedToken || now >= tokenExpiry) {
        // Avoid multiple simultaneous session fetches
        if (!isRefreshing) {
            isRefreshing = true
            try {
                // Only log in development for debugging
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔍 Fetching fresh session token...')
                }
                const session = await getSession()

                if (process.env.NODE_ENV === 'development') {
                    console.log('📡 Session data:', {
                        hasSession: !!session,
                        hasAccessToken: !!session?.accessToken,
                        hasUser: !!session?.user,
                        sessionKeys: session ? Object.keys(session) : [],
                        userKeys: session?.user
                            ? Object.keys(session.user)
                            : [],
                    })
                }

                if (session?.accessToken) {
                    cachedToken = session.accessToken
                    // Cache token for 10 minutes or use token expiry
                    tokenExpiry = session.user?.accessTokenExpires
                        ? session.user.accessTokenExpires - 60000 // 1 minute before expiry
                        : now + 10 * 60 * 1000 // 10 minutes fallback

                    if (process.env.NODE_ENV === 'development') {
                        console.log(
                            '✅ Token cached until:',
                            new Date(tokenExpiry),
                            'Token preview:',
                            session.accessToken.slice(0, 20) + '...',
                        )
                    }
                } else {
                    cachedToken = null
                    tokenExpiry = 0
                    if (process.env.NODE_ENV === 'development') {
                        console.log('❌ No access token in session')
                        console.log(
                            'Session content:',
                            JSON.stringify(session, null, 2),
                        )
                    }
                }
            } finally {
                isRefreshing = false
            }
        }
    }

    // Add cached token to request
    if (cachedToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${cachedToken}`
    }

    return config
}

// Export function to clear cache when needed
export const clearTokenCache = () => {
    cachedToken = null
    tokenExpiry = 0
}

export default AxiosRequestInterceptorConfigCallback
