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
        try {
            const data = await onSignInWithCredentials(
                values,
                callbackUrl || '',
            )

            if (data?.error) {
                setMessage(data.error as string)
                setSubmitting(false)
                return
            }

            if (data?.success && data?.redirectTo) {
                console.log('🎯 Redirecting to:', data.redirectTo)
                // Use window.location for a hard redirect to ensure session is refreshed
                window.location.href = data.redirectTo
                return
            }

            // Fallback redirect
            console.log('🎯 Fallback redirect to dashboard')
            window.location.href = appConfig.authenticatedEntryPath
        } catch (error) {
            console.error('Sign-in error:', error)
            setMessage('An unexpected error occurred')
            setSubmitting(false)
        }
    }

    const handleOAuthSignIn = async ({ type }: OnOauthSignInPayload) => {
        if (type === 'google') {
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
