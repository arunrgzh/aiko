import type { InternalAxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'

const AxiosRequestInterceptorConfigCallback = async (
    config: InternalAxiosRequestConfig,
) => {
    console.log('🔍 Axios Request Interceptor: Getting session...')
    const session = await getSession()
    console.log('🔍 Session:', session)

    if (session?.accessToken && config.headers) {
        console.log(
            '✅ Adding authorization header with token:',
            session.accessToken.substring(0, 20) + '...',
        )
        config.headers['Authorization'] = `Bearer ${session.accessToken}`
    } else {
        console.log('❌ No access token found in session')
    }
    return config
}

export default AxiosRequestInterceptorConfigCallback
