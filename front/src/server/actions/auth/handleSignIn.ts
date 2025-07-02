'use server'

import { signIn } from '@/auth'
import appConfig from '@/configs/app.config'
import { AuthError } from 'next-auth'
import type { SignInCredential } from '@/@types/auth'

export const onSignInWithCredentials = async (
    { username, password }: SignInCredential,
    callbackUrl?: string,
) => {
    try {
        const redirectUrl = callbackUrl || appConfig.authenticatedEntryPath
        console.log('🔐 Attempting sign-in with redirect to:', redirectUrl)
        console.log(
            '🔐 Full appConfig.authenticatedEntryPath:',
            appConfig.authenticatedEntryPath,
        )

        const result = await signIn('credentials', {
            username,
            password,
            redirect: false, // Let's handle redirect manually
        })

        console.log('🔐 Sign-in result:', result)

        if (result?.error) {
            console.error('❌ Sign-in failed:', result.error)
            return { error: 'Invalid credentials!' }
        }

        console.log(
            '✅ Sign-in completed successfully, should redirect to:',
            redirectUrl,
        )

        // Return success with redirect URL so client can handle it
        return { success: true, redirectTo: redirectUrl }
    } catch (error) {
        console.error('❌ Sign-in error:', error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials!' }
                default:
                    return { error: 'Something went wrong!' }
            }
        }
        throw error
    }
}
