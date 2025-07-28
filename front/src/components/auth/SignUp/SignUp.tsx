'use client'

import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignUpForm from './SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import { useTranslations } from 'next-intl'
import type { OnSignUp } from './SignUpForm'

type SignUpProps = {
    signInUrl?: string
    onSignUp?: OnSignUp
}

export const SignUp = ({ onSignUp, signInUrl = '/sign-in' }: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const t = useTranslations('auth.signUp')

    const mode = useTheme((state) => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    logoWidth={140}
                    logoHeight={80}
                />
            </div>
            <div className="mb-8">
                <h3 className="mb-1">{t('title')}</h3>
                <p className="font-semibold heading-text">{t('subtitle')}</p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignUpForm onSignUp={onSignUp} setMessage={setMessage} />
            <div>
                <div className="mt-6 text-center">
                    <span>{t('alreadyHaveAccount')} </span>
                    <ActionLink
                        href={signInUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        {t('signIn')}
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

export default SignUp
