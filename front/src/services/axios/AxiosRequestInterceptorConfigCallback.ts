import type { InternalAxiosRequestConfig } from 'axios'
import { API_ACCESS_TOKEN_KEY} from '@/constants/app.constant'

const AxiosRequestInterceptorConfigCallback = (
    config: InternalAxiosRequestConfig,
) => {
    const token = localStorage.getItem(API_ACCESS_TOKEN_KEY);
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
}

export default AxiosRequestInterceptorConfigCallback
