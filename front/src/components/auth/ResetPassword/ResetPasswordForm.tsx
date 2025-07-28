'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

type ResetPasswordFormSchema = {
    password: string
    confirmPassword: string
}

export type OnResetPasswordSubmitPayload = {
    values: ResetPasswordFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
    setResetComplete: (resetComplete: boolean) => void
}

export type OnResetPasswordSubmit = (
    payload: OnResetPasswordSubmitPayload,
) => void

type ResetPasswordFormProps = CommonProps & {
    onResetPasswordSubmit?: OnResetPasswordSubmit
    setMessage: (message: string) => void
    setResetComplete: (resetComplete: boolean) => void
    resetComplete: boolean
    children?: React.ReactNode
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const t = useTranslations('auth.resetPassword')

    const {
        className,
        onResetPasswordSubmit,
        setMessage,
        setResetComplete,
        resetComplete,
        children,
    } = props

    const validationSchema: ZodType<ResetPasswordFormSchema> = z
        .object({
            password: z
                .string({ required_error: t('form.passwordError') })
                .min(1, { message: t('form.passwordError') }),
            confirmPassword: z
                .string({ required_error: t('form.confirmPasswordError') })
                .min(1, { message: t('form.confirmPasswordError') }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('form.passwordMismatch'),
            path: ['confirmPassword'],
        })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onResetPassword = async (values: ResetPasswordFormSchema) => {
        if (onResetPasswordSubmit) {
            onResetPasswordSubmit({
                values,
                setSubmitting,
                setMessage,
                setResetComplete,
            })
        }
    }

    return (
        <div className={className}>
            {!resetComplete ? (
                <Form onSubmit={handleSubmit(onResetPassword)}>
                    <FormItem
                        label={t('form.password')}
                        invalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    placeholder={t('form.passwordPlaceholder')}
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('form.confirmPassword')}
                        invalid={Boolean(errors.confirmPassword)}
                        errorMessage={errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    placeholder={t(
                                        'form.confirmPasswordPlaceholder',
                                    )}
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <Button
                        block
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                    >
                        {isSubmitting ? t('form.submitting') : t('form.submit')}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ResetPasswordForm
