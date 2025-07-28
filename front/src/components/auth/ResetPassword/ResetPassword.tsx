'use client'

import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ResetPasswordForm from './ResetPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { OnResetPasswordSubmit } from './ResetPasswordForm'

type ResetPasswordProps = {
    signInUrl?: string
    onResetPasswordSubmit?: OnResetPasswordSubmit
}

export const ResetPassword = ({
    signInUrl = '/sign-in',
    onResetPasswordSubmit,
}: ResetPasswordProps) => {
    const [resetComplete, setResetComplete] = useState(false)
    const [message, setMessage] = useTimeOutMessage()
    const t = useTranslations('auth.resetPassword')

    const router = useRouter()

    const handleContinue = () => {
        router.push(signInUrl)
    }

    return (
        <div>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                        <h3 className="mb-1">{t('resetComplete.title')}</h3>
                        <p className="font-semibold heading-text">
                            {t('resetComplete.message')}
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">{t('title')}</h3>
                        <p className="font-semibold heading-text">
                            {t('subtitle')}
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <ResetPasswordForm
                resetComplete={resetComplete}
                setMessage={setMessage}
                setResetComplete={setResetComplete}
                onResetPasswordSubmit={onResetPasswordSubmit}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={handleContinue}
                >
                    {t('continue')}
                </Button>
            </ResetPasswordForm>
            <div className="mt-4 text-center">
                <span>Back to </span>
                <ActionLink
                    href={signInUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Sign in
                </ActionLink>
            </div>
        </div>
    )
}

export default ResetPassword
