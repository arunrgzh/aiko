import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import AxiosBase from './AxiosBase'
import { getSession, signOut } from 'next-auth/react'
import { clearTokenCache } from './AxiosRequestInterceptorConfigCallback'

const AxiosResponseInterceptorErrorCallback = async (error: AxiosError) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
        console.log(
            '🚨 Axios Response Error:',
            error.response?.status,
            error.response?.data,
        )
    }

    const originalReq = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
    }

    // Добавляем проверку на существование originalReq
    if (!originalReq) {
        return Promise.reject(error)
    }

    const status = error.response?.status

    if (status === 401 && !originalReq._retry) {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                '🔄 401 error - clearing token cache and attempting refresh...',
            )
        }
        originalReq._retry = true

        // Clear the cached token since it's invalid
        clearTokenCache()

        try {
            // Try to get a fresh session (NextAuth will refresh if needed)
            const session = await getSession()

            if (process.env.NODE_ENV === 'development') {
                console.log(
                    '🔍 Refresh attempt - Session valid:',
                    !!session?.accessToken,
                )
            }

            if (session?.accessToken && !session.error) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Got fresh token, retrying request...')
                }
                // Update the request with the new token
                if (originalReq.headers) {
                    originalReq.headers['Authorization'] =
                        `Bearer ${session.accessToken}`
                }
                // Retry the request
                return AxiosBase(originalReq)
            } else {
                // Session is invalid or refresh failed
                console.error(
                    '❌ Session invalid or refresh failed, signing out...',
                )
                await signOut({ callbackUrl: '/sign-in' })
                return Promise.reject(error)
            }
        } catch (sessionError) {
            console.error('❌ Failed to refresh session:', sessionError)
            await signOut({ callbackUrl: '/sign-in' })
            return Promise.reject(error)
        }
    }

    return Promise.reject(error)
}

export default AxiosResponseInterceptorErrorCallback
