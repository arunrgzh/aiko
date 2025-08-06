// services/ApiService.ts
import AxiosBase from './axios/AxiosBase'
import type {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    Method,
} from 'axios'

export interface FetchDataOptions<
    Response = unknown,
    Request = Record<string, unknown>,
> extends Omit<AxiosRequestConfig<Request>, 'headers'> {
    url: string
    method?: Method
    data?: Request
    headers?: Record<string, string> | AxiosRequestConfig['headers']
}

// Helper function to ensure proper URL construction
const constructUrl = (url: string): string => {
    // If it's already a full URL, return as is
    if (url.startsWith('http')) {
        return url
    }

    // Remove leading slash to avoid double slashes
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url

    // Get base URL from environment
    const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        (typeof window !== 'undefined'
            ? `${window.location.protocol}//${window.location.hostname}:8000/api`
            : 'http://localhost:8000/api')

    // Construct full URL
    const fullUrl = `${baseUrl}/${cleanUrl}`
    console.log('🔗 Constructing URL:', {
        original: url,
        base: baseUrl,
        full: fullUrl,
    })

    return fullUrl
}

const ApiService = {
    /**
     * Main JSON request method
     */
    fetchDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
        options: FetchDataOptions<Response, Request>,
    ): Promise<Response> {
        // Ensure URL is properly constructed
        const fullUrl = constructUrl(options.url)

        const requestConfig: AxiosRequestConfig<Request> = {
            ...options,
            url: fullUrl,
            method: options.method || 'GET',
        }

        console.log('📡 ApiService: Making request', {
            method: requestConfig.method,
            url: requestConfig.url,
            data: requestConfig.data,
        })

        return new Promise<Response>((resolve, reject) => {
            AxiosBase(requestConfig)
                .then((response: AxiosResponse<Response>) => {
                    console.log(
                        '✅ ApiService: Request successful',
                        response.status,
                        response.data,
                    )
                    resolve(response.data)
                })
                .catch((error: AxiosError) => {
                    console.error('❌ ApiService: Request failed', {
                        status: error.response?.status,
                        message: error.message,
                        url: error.config?.url,
                        data: error.response?.data,
                    })
                    reject(error)
                })
        })
    },

    /**
     * Alias for fetchDataWithAxios
     */
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        options: FetchDataOptions<Response, Request>,
    ): Promise<Response> {
        return this.fetchDataWithAxios<Response, Request>(options)
    },

    /**
     * FormData request method
     */
    fetchFormDataWithAxios<T = unknown>(
        options: Omit<AxiosRequestConfig<FormData>, 'data'> & {
            url: string
            method?: Method
            data: FormData
            headers?: Record<string, string>
        },
    ): Promise<T> {
        const { url, method = 'post', data, headers = {}, ...rest } = options

        const fullUrl = constructUrl(url)

        const requestConfig: AxiosRequestConfig<FormData> = {
            url: fullUrl,
            method,
            data,
            headers: {
                ...headers,
                // Let Axios set Content-Type for FormData
            },
            ...rest,
        }

        console.log('📡 ApiService: Making FormData request', {
            method: requestConfig.method,
            url: requestConfig.url,
        })

        return new Promise<T>((resolve, reject) => {
            AxiosBase<T>(requestConfig)
                .then((response: AxiosResponse<T>) => {
                    console.log(
                        '✅ ApiService: FormData request successful',
                        response.status,
                    )
                    resolve(response.data)
                })
                .catch((error: AxiosError) => {
                    console.error('❌ ApiService: FormData request failed', {
                        status: error.response?.status,
                        message: error.message,
                        url: error.config?.url,
                    })
                    reject(error)
                })
        })
    },

    /**
     * Quick method for common HTTP methods
     */
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.fetchDataWithAxios<T>({ ...config, url, method: 'GET' })
    },

    post<T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.fetchDataWithAxios<T, D>({
            ...config,
            url,
            method: 'POST',
            data,
        })
    },

    put<T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.fetchDataWithAxios<T, D>({
            ...config,
            url,
            method: 'PUT',
            data,
        })
    },

    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.fetchDataWithAxios<T>({ ...config, url, method: 'DELETE' })
    },
}

export default ApiService
