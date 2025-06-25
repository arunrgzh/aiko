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
        url: '/auth/sign-up/',
        method: 'post',
        data,
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/reset-password',
        method: 'post',
        data,
    })
}
