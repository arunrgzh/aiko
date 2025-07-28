// src/app/(auth-pages)/sign-in/_components/SignInClient.tsx
'use client'

import appConfig from '@/configs/app.config'
import SignIn from '@/components/auth/SignIn'
import { signIn } from '@/auth'
import { useSearchParams } from 'next/navigation'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useTranslations } from 'next-intl'
import type {
    OnSignInPayload,
    OnOauthSignInPayload,
} from '@/components/auth/SignIn'
import Simple from '@/components/layouts/AuthLayout/Simple'
import { onSignInWithCredentials } from '@/server/actions/auth/handleSignIn'

const SignInClient = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get(REDIRECT_URL_KEY)
    const t = useTranslations('auth.signIn')

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

            // Check if this is a first-time login to redirect to onboarding
            // Note: We need to check the session after sign-in to get the isFirstLogin flag
            // For now, redirect to root page which will handle the routing logic
            console.log('🎯 Redirecting to root for smart routing')
            window.location.href = '/'
        } catch (error) {
            console.error('Sign-in error:', error)
            setMessage(t('errors.unexpectedError'))
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
