'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useTranslations } from 'next-intl'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import { signIn } from 'next-auth/react'

export type OnSignInPayload = {
    values: SignInFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
}

export type OnSignIn = (payload: OnSignInPayload) => void

interface SignInFormProps extends CommonProps {
    passwordHint?: string | ReactNode
    setMessage: (message: string) => void
    onSignIn?: OnSignIn
}

type SignInFormSchema = {
    username: string
    password: string
}

const validationSchema: ZodType<SignInFormSchema> = z.object({
    username: z
        .string({ required_error: 'Please enter your username' })
        .min(1, { message: 'Please enter your username' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(1, { message: 'Please enter your password' }),
})

const SignInForm = (props: SignInFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const t = useTranslations('auth.signIn')

    const { className, setMessage, onSignIn, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const handleSignIn = async (values: SignInFormSchema) => {
        try {
            setSubmitting(true)
            const result = await signIn('credentials', {
                username: values.username,
                password: values.password,
                redirect: false,
            })

            if (result?.error) {
                // Map error codes to user-friendly messages
                const errorMessages: { [key: string]: string } = {
                    CredentialsSignin: t('errors.invalidCredentials'),
                    default: t('errors.generalError'),
                }

                setMessage(errorMessages[result.error] || errorMessages.default)
                return
            }

            if (onSignIn) {
                onSignIn({ values, setSubmitting, setMessage })
            }
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : t('errors.generalError'),
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignIn)}>
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
                    label={t('form.password')}
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password?.message ? 'mb-8' : '',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PasswordInput
                                type="text"
                                placeholder={t('form.passwordPlaceholder')}
                                autoComplete="off"
                                disabled={isSubmitting}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {t('form.signInButton')}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
