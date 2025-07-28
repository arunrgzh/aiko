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

type SignUpFormSchema = {
    username: string
    password: string
    email: string
    confirmPassword: string
}

export type OnSignUpPayload = {
    values: SignUpFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
}

export type OnSignUp = (payload: OnSignUpPayload) => void

type SignUpFormProps = CommonProps & {
    onSignUp?: OnSignUp
    setMessage: (message: string) => void
}

const SignUpForm = (props: SignUpFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const t = useTranslations('auth.signUp')

    const { className, onSignUp, setMessage } = props

    const validationSchema: ZodType<SignUpFormSchema> = z
        .object({
            username: z
                .string({ required_error: t('form.usernameError') })
                .min(1, { message: t('form.usernameError') }),
            email: z
                .string({ required_error: t('form.emailError') })
                .email({ message: t('form.emailError') }),
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
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const handleSignUp = async (values: SignUpFormSchema) => {
        if (onSignUp) {
            onSignUp({ values, setSubmitting, setMessage })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignUp)}>
                <FormItem
                    label={t('form.username')}
                    invalid={Boolean(errors.username)}
                    errorMessage={errors.username?.message}
                >
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder={t('form.usernamePlaceholder')}
                                autoComplete="off"
                                disabled={isSubmitting}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
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
                                disabled={isSubmitting}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                    {t('form.signUpButton')}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
