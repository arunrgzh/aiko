import { Form } from '@/components/ui'
import { CommonProps } from '@/components/ui/@types/common'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

import Button from '@/components/ui/Button'
import z, { ZodType } from 'zod'
import { useBotConfigStore, useCreationFlowStore } from '../../store/flowCreation'
import { NamingFormValues } from '../../types'

export const validationSchemaForNaming: ZodType<NamingFormValues> = z.object({
    company_name: z
        .string({ required_error: 'Введите названия вашей компаний' })
        .min(1, { message: 'Введите названия вашей компаний' }),
    assistant_name: z
        .string({ required_error: 'Введите имя вашего ассистента' })
        .min(1, { message: 'Введите имя вашего ассистента' }),
})

type NamingFormProps = CommonProps;


export default function NamingForm({...props}: NamingFormProps ){
    const isFirstStep = useCreationFlowStore(state => state.isFirstStep)

    const onPrevious = useCreationFlowStore(state => state.onPrevious)
    const onNext = useCreationFlowStore(state => state.onNext)
    const setter = useBotConfigStore(state => state.setNaming)
    const { className } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<NamingFormValues>({
        resolver: zodResolver(validationSchemaForNaming),
    })
    const handleSubmitForm = async (values: NamingFormValues) => {
        console.log(values);
        setter(values)
        onNext()
    }
    return (
        <div className={className}>
            <h2 className="text-2xl font-semibold mb-2">Уточните пару моментов</h2>
            <p className="mb-6 text-gray-600">
                Советуем назвать ИИ-ассистента именем человека
            </p>
            <Form className={'w-3xl '} onSubmit={handleSubmit(handleSubmitForm)}>
                <FormItem
                    label="Названия Вашей компаний"
                    invalid={Boolean(errors.company_name)}
                    errorMessage={errors.company_name?.message}
                >
                    <Controller
                        name="company_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Имя вашего бота"
                    invalid={Boolean(errors.assistant_name)}
                    errorMessage={errors.assistant_name?.message}>
                    <Controller
                        name="assistant_name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <div className="mt-4 text-center flex gap-1">
                    <Button
                        className="mx-2"
                        onClick={onPrevious}
                        disabled={isFirstStep}
                    >
                        Назад
                    </Button>

                    <Button
                        variant="solid"
                        block
                        type="submit"

                    >
                        Дальше
                    </Button>

                </div>
            </Form>
        </div>
    )
}