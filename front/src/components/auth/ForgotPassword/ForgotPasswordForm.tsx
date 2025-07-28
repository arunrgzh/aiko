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

type ForgotPasswordFormSchema = {
    email: string
}

export type OnForgotPasswordSubmitPayload = {
    values: ForgotPasswordFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
    setEmailSent: (emailSent: boolean) => void
}

export type OnForgotPasswordSubmit = (
    payload: OnForgotPasswordSubmitPayload,
) => void

type ForgotPasswordFormProps = CommonProps & {
    onForgotPasswordSubmit?: OnForgotPasswordSubmit
    setMessage: (message: string) => void
    setEmailSent: (emailSent: boolean) => void
    emailSent: boolean
    children?: React.ReactNode
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const t = useTranslations('auth.forgotPassword')

    const {
        className,
        onForgotPasswordSubmit,
        setMessage,
        setEmailSent,
        emailSent,
        children,
    } = props

    const validationSchema: ZodType<ForgotPasswordFormSchema> = z.object({
        email: z
            .string()
            .email({ message: t('form.emailError') })
            .min(5),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
        if (onForgotPasswordSubmit) {
            onForgotPasswordSubmit({
                values,
                setSubmitting,
                setMessage,
                setEmailSent,
            })
        }
    }

    return (
        <div className={className}>
            {!emailSent ? (
                <Form onSubmit={handleSubmit(onForgotPassword)}>
                    <FormItem
                        label={t('form.email')}
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder={t('form.emailPlaceholder')}
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

export default ForgotPasswordForm
