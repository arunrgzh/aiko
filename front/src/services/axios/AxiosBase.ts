import axios from 'axios'
import AxiosResponseInterceptorErrorCallback from './AxiosResponseInterceptorErrorCallback'
import AxiosRequestInterceptorConfigCallback from './AxiosRequestInterceptorConfigCallback'
import appConfig from '@/configs/app.config'
import type { AxiosError } from 'axios'

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: `${appConfig.apiPrefix}`,
    withCredentials: true,
})

AxiosBase.interceptors.request.use(
    async (config) => {
        return await AxiosRequestInterceptorConfigCallback(config)
    },
    (error) => {
        return Promise.reject(error)
    },
)

AxiosBase.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        await AxiosResponseInterceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

export default AxiosBase
