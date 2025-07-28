'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useGenerativeChatStore } from '../_store/generativeChatStore'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'

type FormSchema = {
    title: string
}

const ChatHistoryRenameDialog = () => {
    const { renameDialog, setRenameDialog, setChatHistoryName } =
        useGenerativeChatStore()
    const t = useTranslations('aiChat')

    const validationSchema: ZodType<FormSchema> = z.object({
        title: z.string().min(1, 'Please do not leave testing title blank!'),
    })

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            title: renameDialog.title,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (renameDialog.open) {
            reset({
                title: renameDialog.title,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renameDialog.title, renameDialog.open])

    const handleDialogClose = () => {
        setRenameDialog({
            id: '',
            title: '',
            open: false,
        })
    }

    const onFormSubmit = async ({ title }: FormSchema) => {
        setChatHistoryName({
            id: renameDialog.id,
            title,
        })
        handleDialogClose()
    }

    return (
        <Dialog
            isOpen={renameDialog.open}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h5>{t('history.renameChat')}</h5>
            <div className="mt-8">
                <Form onSubmit={handleSubmit(onFormSubmit)}>
                    <FormItem
                        label={t('history.chatTitle')}
                        invalid={Boolean(errors.title)}
                        errorMessage={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input
                                    placeholder={t('history.renamePlaceholder')}
                                    type="text"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={handleDialogClose}>
                            {t('feedback.cancel')}
                        </Button>
                        <Button variant="solid" type="submit">
                            {t('history.rename')}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default ChatHistoryRenameDialog
