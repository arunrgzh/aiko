'use client'

import Button from '@/components/ui/Button'
import { useTranslations } from 'next-intl'

type OauthSignInType = 'google'

export type OnOauthSignInPayload = {
    type: OauthSignInType
    setMessage?: (message: string) => void
}

export type OnOauthSignIn = (payload: OnOauthSignInPayload) => void

type OauthSignInProps = {
    setMessage?: (message: string) => void
    onOauthSignIn?: OnOauthSignIn
}

const OauthSignIn = ({ onOauthSignIn, setMessage }: OauthSignInProps) => {
    const t = useTranslations('auth.signIn')

    const handleGoogleSignIn = async () => {
        onOauthSignIn?.({ type: 'google', setMessage })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]" />
                <p className="font-semibold heading-text text-sm">
                    {t('oauth.or')}
                </p>
                <div className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]" />
            </div>
            <Button
                className="w-full"
                type="button"
                onClick={handleGoogleSignIn}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px]"
                        src="/img/others/google.png"
                        alt="Google sign in"
                    />
                    <span>{t('oauth.google')}</span>
                </div>
            </Button>
        </div>
    )
}

export default OauthSignIn
