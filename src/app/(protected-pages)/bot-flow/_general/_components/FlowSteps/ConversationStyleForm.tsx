import { Form, FormItem, Select, Button } from '@/components/ui'
import { CommonProps } from '@/components/ui/@types/common'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodType } from 'zod'

import FormSegment from '../Segment'
import { useBotConfigStore, useCreationFlowStore } from '../../store/flowCreation'
import { CONVERSATION_STYLE ,NOT_FOUND_PHRASE ,PURPOSE , ConversationStyleFormValues } from '../../types'

export const validationSchema: ZodType<ConversationStyleFormValues> = z.object({
    style: z.nativeEnum(CONVERSATION_STYLE, { required_error: 'Введите стиль беседы ассистента' }),
    fallback_responses: z.nativeEnum(NOT_FOUND_PHRASE, { required_error: 'Введите фразу при отсутствии результата' }),
    purpose: z.nativeEnum(PURPOSE, { required_error: 'Выберите тип задачи' }),
})

type ConversationStyleFormProps = CommonProps

interface Option<T extends string> {
    value: T
    label: string
}

const conversationStyleOptions: Option<CONVERSATION_STYLE>[] =
    Object.values(CONVERSATION_STYLE).map((val) => ({ value: val, label: val }))
const notFoundPhraseOptions: Option<NOT_FOUND_PHRASE>[] =
    Object.values(NOT_FOUND_PHRASE).map((val) => ({ value: val, label: val }))

const purposeSelections: { value: PURPOSE; desc: string }[] =
    Object.values(PURPOSE).map((val) => ({ value: val, desc: val }))

export default function ConversationStyleForm({ className }: ConversationStyleFormProps) {
    const onPrevious = useCreationFlowStore((state) => state.onPrevious)
    const onNext = useCreationFlowStore((state) => state.onNext)
    const setter = useBotConfigStore(state => state.setConversationStyle)
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ConversationStyleFormValues>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            style: Object.values(CONVERSATION_STYLE)[0],
            fallback_responses: Object.values(NOT_FOUND_PHRASE)[0] as NOT_FOUND_PHRASE,
            purpose: Object.values(PURPOSE)[0] as PURPOSE,
        },
    })

    const handleSubmitForm = (values: ConversationStyleFormValues) => {
        console.log(values)
        setter(values)
        onNext()
    }

    return (
        <div className={className}>
            <h2 className="text-2xl font-semibold mb-2">Осталось еще чуть-чуть</h2>
            <p className="mb-6 text-gray-600">
                Просто выберите то, что вам подходит
            </p>
            <Form onSubmit={handleSubmit(handleSubmitForm)}>
                <FormItem
                    label="В каком тоне должен разговаривать ИИ-ассистент?"
                    invalid={!!errors.style}
                    errorMessage={errors.style?.message}
                >
                    <Controller
                        name="style"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={conversationStyleOptions}
                                value={conversationStyleOptions.find((o) => o.value === field.value) || null}
                                onChange={(opt) => field.onChange(opt?.value)}
                                placeholder="Выберите стиль бота"
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Если ИИ-ассистент не найдет ответа на вопрос в документах, он должен сказать:"
                    invalid={!!errors.fallback_responses}
                    errorMessage={errors.fallback_responses?.message}
                >
                    <Controller
                        name="fallback_responses"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={notFoundPhraseOptions}
                                value={notFoundPhraseOptions.find((o) => o.value === field.value) || null}
                                onChange={(opt) => field.onChange(opt?.value)}
                                placeholder="Выберите фразу"
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Какую задачу должен выполнять ИИ-ассистент?"
                    invalid={!!errors.purpose}
                    errorMessage={errors.purpose?.message}
                >
                    <Controller
                        name="purpose"
                        control={control}
                        render={({ field }) => (
                            <FormSegment
                                selections={purposeSelections}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </FormItem>

                <div className="mt-4 flex justify-center gap-4">
                    <Button variant="default" onClick={onPrevious} type="button">
                        Назад
                    </Button>
                    <Button variant="solid" block type="submit">
                        Дальше
                    </Button>
                </div>
            </Form>
        </div>
    )
}
