'use client'

import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './SignInForm'
import OauthSignIn from './OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import { useTranslations } from 'next-intl'
import type { OnSignIn } from './SignInForm'
import type { OnOauthSignIn } from './OauthSignIn'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    onSignIn?: OnSignIn
    onOauthSignIn?: OnOauthSignIn
}

const SignIn = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    onSignIn,
    onOauthSignIn,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const t = useTranslations('auth.signIn')
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
            <div className="mb-10">
                <h2 className="mb-2">{t('title')}</h2>
                <p className="font-semibold heading-text">{t('subtitle')}</p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            href={forgetPasswordUrl}
                            className="font-semibold heading-text mt-2 underline"
                            themeColor={false}
                        >
                            {t('forgotPassword')}
                        </ActionLink>
                    </div>
                }
                onSignIn={onSignIn}
            />
            <div className="mt-6">
                <OauthSignIn onOauthSignIn={onOauthSignIn} />
            </div>
            <div>
                <div className="mt-8 text-center">
                    <span>{t('dontHaveAccount')} </span>
                    <ActionLink
                        href={signUpUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        {t('signUp')}
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

export default SignIn
