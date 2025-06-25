// src/app/(auth-pages)/sign-in/_components/SignInClient.tsx
'use client'

import appConfig from '@/configs/app.config'
import SignIn from '@/components/auth/SignIn'
import { signIn } from '@/auth'
import { useSearchParams } from 'next/navigation'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import type {
    OnSignInPayload,
    OnOauthSignInPayload,
} from '@/components/auth/SignIn'
import Simple from '@/components/layouts/AuthLayout/Simple'
import { onSignInWithCredentials } from '@/server/actions/auth/handleSignIn'

const SignInClient = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get(REDIRECT_URL_KEY)
    const handleSignIn = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignInPayload) => {
        onSignInWithCredentials(values, callbackUrl || '').then((data) => {
            if (data?.error) {
                setMessage(data.error as string)
                setSubmitting(false)
            }
        })


    }

    const handleOAuthSignIn = async ({ type }: OnOauthSignInPayload) => {
        if (type === 'google' || type === 'github') {
            await signIn(type, {
                callbackUrl: callbackUrl || appConfig.authenticatedEntryPath,
            })
        }
    }

    return (
        <Simple>
            <SignIn onSignIn={handleSignIn} onOauthSignIn={handleOAuthSignIn} />
        </Simple>
    )
}

export default SignInClient
