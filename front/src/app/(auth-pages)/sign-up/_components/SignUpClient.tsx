'use client'

import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import SignUp from '@/components/auth/SignUp'
import { apiSignUp } from '@/services/AuthService'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { OnSignUpPayload } from '@/components/auth/SignUp'

const SignUpClient = () => {
    const router = useRouter()
    const t = useTranslations('auth.signUp')

    const handleSignUp = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignUpPayload) => {
        try {
            setSubmitting(true)
            console.log('Signup request:', {
                username: values.username,
                email: values.email,
                password: '***', // Don't log actual password
            })

            const res = await apiSignUp({
                username: values.username,
                email: values.email,
                password: values.password,
            })

            console.log('Signup success:', res)
            toast.push(
                <Notification title={t('success.title')} type="success">
                    {t('success.message')}
                </Notification>,
            )
            router.push('/sign-in')
        } catch (error) {
            console.error('Signup error:', error)

            let errorMessage = t('errors.generalError')

            if (error instanceof Error) {
                errorMessage = error.message
            } else if (typeof error === 'string') {
                errorMessage = error
            } else if (error && typeof error === 'object') {
                // Try to extract error message from various possible properties
                const errorObj = error as any
                errorMessage =
                    errorObj.message ||
                    errorObj.error ||
                    errorObj.detail ||
                    JSON.stringify(error)
            }

            console.error('Processed error message:', errorMessage)
            setMessage(errorMessage)
            toast.push(
                <Notification title="Sign Up Failed" type="danger">
                    {errorMessage}
                </Notification>,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return <SignUp onSignUp={handleSignUp} />
}

export default SignUpClient
