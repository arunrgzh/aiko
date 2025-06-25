export type SignInCredential = {
    username: string
    password: string
}

export type SignInResponse = {
    id: string
    userName: string
    email: string
    avatar: string
    authority: string[]
    password: string
    accountUserName: string
    accessToken: string
    refreshToken: string //here
}

export type SignUpResponse = {
    status?: string
    message?: string
    error?: string
    detail?: string
}

export type SignUpCredential = {
    username: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    newPassword: string
    confirmPassword: string
    token: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
}

export type Token = {
    accessToken: string
    refreshToken?: string
}

export type RefreshRequest = {
    refreshToken: string
}

export type RefreshResponse = {
    refreshToken: string
    accessToken: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
