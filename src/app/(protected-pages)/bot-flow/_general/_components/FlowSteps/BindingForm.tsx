'use client'

import { Form, FormItem, Input, Button, Upload } from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useBotConfigStore } from '../../store/flowCreation'
import { useRouter } from 'next/navigation'
import appConfig from '@/configs/app.config'
import {
    apiPostConfig, apiUploadDocs
} from '@/services/BotConfigService'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import type { BindingFormValues } from '../../types'
import { wait } from 'next/dist/lib/wait'

const validationSchema = z.object({
    instagram_url: z.string().url('Введите ссылку на Instagram'),
    website_url: z.string().url('Введите корректный URL вебсайта'),
    files: z
        .array(z.instanceof(File))
        .min(1, 'Загрузите хотя бы один файл'),
})

export default function BindingForm() {
    const router = useRouter()
    const { session } = useCurrentSession()

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<BindingFormValues>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            instagram_url: '',
            website_url: '',
            files: [],
        },
    })

    const getInit = useBotConfigStore((s) => s.getConfigForInitialize)

    const onSubmit = async (values: BindingFormValues) => {
        try {
            const init = getInit()
            const configPayload = {
                user: Number(session.user.id),
                company_name: init.company_name,
                assistant_name: init.assistant_name,
                style: init.style,
                fallback_responses: init.fallback_responses,
                purpose: init.purpose,
                instructions: init.instructions,
                instagram_url: values.instagram_url,
                website_url: values.website_url,
            }
            const { id : configId } = await apiPostConfig<{ id: number }>(configPayload)
            console.log('config' ,configId)
            await wait(3000)
            const response = await apiUploadDocs(configId, {
                files: values.files,
            })
            console.log('upload response' ,response)
            router.push(appConfig.authenticatedEntryPath)

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Обучение ИИ-ассистента</h2>
            <p className="mb-6 text-gray-600">
                Без знаний о вашем бизнесе ИИ-ассистент бесполезен. Обучите его
            </p>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label="Instagram"
                    invalid={!!errors.instagram_url}
                    errorMessage={errors.instagram_url?.message}
                >
                    <Controller
                        name="instagram_url"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Никнейм или ссылка на Instagram" />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Вебсайт"
                    invalid={!!errors.website_url}
                    errorMessage={errors.website_url?.message}
                >
                    <Controller
                        name="website_url"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="https://example.com" />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Документы"
                    invalid={!!errors.files}
                    errorMessage={errors.files?.message as string}
                >
                    <Controller
                        name="files"
                        control={control}
                        render={({ field }) => (
                            <Upload
                                multiple
                                onChange={(files: File[]) => field.onChange(files)}
                                className="w-full p-4 border-dashed border-2 rounded cursor-pointer"
                            />
                        )}
                    />
                </FormItem>

                <div className="mt-6 flex justify-between">
                    <Button variant="default" onClick={() => router.back()} type="button">
                        Назад
                    </Button>
                    <Button variant="solid" type="submit">
                        Создать ассистента
                    </Button>
                </div>
            </Form>
        </div>
    )
}
