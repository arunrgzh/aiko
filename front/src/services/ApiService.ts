// services/ApiService.ts
import AxiosBase from './axios/AxiosBase'
import type {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    Method,
} from 'axios'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FetchDataOptions<
    Response = unknown,
    Request = Record<string, unknown>,
> extends AxiosRequestConfig<Request> {
    url: string
    method?: Method
    data?: Request
    headers?: Record<string, string>
}

const ApiService = {
    /**
     * Обычный JSON‑запрос
     */
    fetchDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
        options: FetchDataOptions<Response, Request>,
    ): Promise<Response> {
        console.log('📡 ApiService: Making request', options)
        return new Promise<Response>((resolve, reject) => {
            AxiosBase(options)
                .then((response: AxiosResponse<Response>) => {
                    console.log(
                        '✅ ApiService: Request successful',
                        response.status,
                        response.data,
                    )
                    resolve(response.data)
                })
                .catch((error: AxiosError) => {
                    console.error(
                        '❌ ApiService: Request failed',
                        error.response?.status,
                        error.message,
                    )
                    reject(error)
                })
        })
    },

    /**
     * Alias для fetchDataWithAxios для совместимости
     */
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        options: FetchDataOptions<Response, Request>,
    ): Promise<Response> {
        return this.fetchDataWithAxios<Response, Request>(options)
    },

    /**
     * multipart/form-data запрос
     * @template T - тип данных, который придёт в ответе
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

        return new Promise<T>((resolve, reject) => {
            // тут мы явно передаём T - чтобы ESLint «увидел» использование дженерика
            AxiosBase<T>({
                url,
                method,
                data,
                headers: {
                    ...headers,
                    // не нужно руками прописывать Content-Type - Axios это сделает
                },
                ...rest,
            })
                .then((response: AxiosResponse<T>) => resolve(response.data))
                .catch((error: AxiosError) => reject(error))
        })
    },
}

export default ApiService
