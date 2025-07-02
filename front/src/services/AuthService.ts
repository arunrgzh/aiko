import ApiService from './ApiService'

import type {
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignUpResponse,
    /*SignInCredential,
    SignInResponse,*/
} from '@/@types/auth'

/*export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: '/auth/token/',
        method: 'post',
        data : {
            username: data.username,
            password: data.password,
        },
    })*/

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: '/api/auth/register',
        method: 'post',
        data,
    }).catch((error) => {
        console.error('Auth service error:', error)
        console.error('Auth service error response:', error.response?.data)

        const errorData = error.response?.data
        if (errorData) {
            // Handle different error formats
            const errorMessage =
                typeof errorData === 'string'
                    ? errorData
                    : errorData.error ||
                      errorData.detail ||
                      errorData.message ||
                      JSON.stringify(errorData)
            throw new Error(errorMessage)
        }

        // Handle network errors or other issues
        if (error.message) {
            throw new Error(error.message)
        }

        throw new Error('Failed to sign up')
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/auth/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/auth/reset-password',
        method: 'post',
        data,
    })
}
