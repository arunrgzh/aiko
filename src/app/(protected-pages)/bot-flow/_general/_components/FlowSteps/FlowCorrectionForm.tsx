import { Form, FormItem, Button } from '@/components/ui'
import { CommonProps } from '@/components/ui/@types/common'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodType } from 'zod'

import InstructionsInput from '../InstructionsInput'
import { useBotConfigStore, useCreationFlowStore } from '../../store/flowCreation'
import { FlowCorrectionFormValues , Instruction} from '../../types'



const defaultInstruction: Instruction[] = [
    {order: 1 , text: 'Поздоровайся и спроси, чем можешь помочь клиенту'},
    {order: 2 , text: 'Уточни детали проблемы клиента'},
    {order: 3 , text: 'Найди ответ на вопрос клиента, уточни при необходимости дополнительную информацию. Если запрос клиента уникальный и ответа нет в базе знаний, переведи клиента на менеджера. Укажи, что менеджер ответит как только сможет.'},
    {order: 4 , text: 'Убедись, что проблема клиента решена. Попроси оценить уровень поддержки от 1 до 10.'}
]


export const validationSchema: ZodType<FlowCorrectionFormValues> = z.object({
       instructions: z.array(
        z.object({
            order: z.number().int().positive(),
            text: z.string().min(1, 'Текст шага не может быть пустым'),
        })
    ).min(1, 'Добавьте хотя бы один шаг'),
})

type ConversationStyleFormProps = CommonProps

export default function FlowCorrectionForm({ className }: ConversationStyleFormProps) {
    const onPrevious = useCreationFlowStore((state) => state.onPrevious)
    const onNext = useCreationFlowStore((state) => state.onNext)
    const setter = useBotConfigStore(state => state.setFlowCorrection)
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FlowCorrectionFormValues>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            instructions: defaultInstruction,
        },
    })

    const handleSubmitForm = (values: FlowCorrectionFormValues) => {
        console.log('Form values:', values)
        setter(values)
        onNext()
    }

    return (
        <div className={className}>
            <h2 className="text-2xl font-semibold mb-2">Как ассистент должен развивать диалог?</h2>
            <p className="mb-6 text-gray-600">
                Посмотрите пример ниже. Это не четкий скрипт, а примерный план идеального диалога, которого ИИ-ассистент будет стараться придерживаться
            </p>
            <Form className="" onSubmit={handleSubmit(handleSubmitForm)}>
                <FormItem

                    invalid={!!errors.instructions}
                    errorMessage={errors.instructions?.message as string}
                >
                    <Controller
                        name="instructions"
                        control={control}
                        render={({ field }) => (
                            <InstructionsInput
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
