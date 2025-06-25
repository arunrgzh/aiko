'use client'

import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import SignUp from '@/components/auth/SignUp'
import { apiSignUp } from '@/services/AuthService'
import { useRouter } from 'next/navigation'
import type { OnSignUpPayload } from '@/components/auth/SignUp'

const SignUpClient = () => {
    const router = useRouter()

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
                <Notification title="Account created!" type="success">
                    You can now sign in from our sign in page
                </Notification>,
            )
            router.push('/sign-in')
        } catch (error) {
            console.error('Signup error:', {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : String(error),
            })

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred during sign up'

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
