import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import AxiosBase from './AxiosBase'
import {
    getRefreshing,
    setRefreshing,
    addSubscriber,
    onRefreshed,
    getNewAccessToken,
} from '@/utils/refreshManager'
import {
    API_ACCESS_TOKEN_KEY,
    API_REFRESH_TOKEN_KEY,
} from '@/constants/app.constant'
const AxiosResponseInterceptorErrorCallback = async (error: AxiosError) => {
    const originalReq = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
    }
    const status = error.response?.status
    const url = originalReq.url || ''

    if (url.includes('/api/refresh')) {
        return Promise.reject(error)
    }

    if (status === 401 && !originalReq._retry) {
        originalReq._retry = true

        if (getRefreshing()) {
            return new Promise((resolve) => {
                addSubscriber((token: string) => {
                    if (originalReq.headers) {
                        originalReq.headers['Authorization'] = `Bearer ${token}`
                    }
                    resolve(AxiosBase(originalReq))
                })
            })
        }

        setRefreshing(true)
        try {
            const newToken = await getNewAccessToken()
            onRefreshed(newToken)

            if (originalReq.headers) {
                originalReq.headers['Authorization'] = `Bearer ${newToken}`
            }
            return AxiosBase(originalReq)
        } catch (refreshErr) {
            console.error('Refresh failed:', refreshErr)
            localStorage.removeItem(API_ACCESS_TOKEN_KEY)
            localStorage.removeItem(API_REFRESH_TOKEN_KEY)
            window.location.href = '/sign-in'
            return Promise.reject(refreshErr)
        } finally {
            setRefreshing(false)
        }
    }

    return Promise.reject(error)
}

export default AxiosResponseInterceptorErrorCallback
