'use client'

import { useState, ReactNode, useEffect } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

const Chip = ({
    selected,
    children,
    ...props
}: {
    selected: boolean
    children: ReactNode
    [key: string]: any
}) => (
    <button
        type="button"
        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
            active:scale-95 active:shadow-sm transform
            ${
                selected
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md hover:bg-blue-600 hover:border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
            }
        `}
        aria-pressed={selected}
        {...props}
    >
        {children}
    </button>
)

interface Option {
    value: string
    label: string
}

interface AccessibilityStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onPrevious: () => void
}

const workTimeOptions: Option[] = [
    { value: 'flexible', label: 'Гибкий график' },
    { value: '9to5', label: '9:00 - 18:00' },
    { value: 'evening', label: 'Вечерние смены' },
    { value: 'night', label: 'Ночные смены' },
    { value: 'weekends', label: 'Выходные дни' },
    { value: 'any', label: 'Любое время' },
]

const adaptationOptions = [
    'Эргономичная мебель',
    'Специальное освещение',
    'Программы чтения с экрана',
    'Увеличение шрифта',
    'Альтернативные устройства ввода',
    'Переводчик жестового языка',
    'Помощник на рабочем месте',
    'Гибкий график работы',
    'Удаленная работа',
    'Другое',
]

const platformFeatureOptions = [
    'Поиск работы по навыкам',
    'Рекомендации вакансий',
    'Обучение и курсы',
    'Сообщество и поддержка',
    'Инструменты для трудоустройства',
    'Консультации специалистов',
    'Доступные интерфейсы',
    'Мобильное приложение',
    'Другое',
]

const accessibilityIssueOptions = [
    'Проблемы со зрением',
    'Проблемы со слухом',
    'Проблемы с мобильностью',
    'Когнитивные трудности',
    'Проблемы с речью',
    'Психическое здоровье',
    'Хронические заболевания',
    'Другое',
]

const AccessibilityStep = ({
    data,
    onUpdate,
    onNext,
    onPrevious,
}: AccessibilityStepProps) => {
    const [formData, setFormData] = useState({
        preferred_work_time: data.preferred_work_time || '',
        important_adaptations: data.important_adaptations || [],
        adaptations_other: data.adaptations_other || '',
        platform_features: data.platform_features || [],
        platform_features_other: data.platform_features_other || '',
        accessibility_issues: data.accessibility_issues || [],
        accessibility_issues_other: data.accessibility_issues_other || '',
        feedback: data.feedback || '',
    })

    const [savedFields, setSavedFields] = useState<Record<string, boolean>>({})

    // Синхронизируем с родительским компонентом через useEffect
    useEffect(() => {
        const timeout = setTimeout(() => {
            onUpdate(formData)
        }, 0)
        return () => clearTimeout(timeout)
    }, [formData])

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleToggleArray = (field: string, value: string) => {
        setFormData((prev) => {
            const fieldKey = field as keyof typeof prev
            const currentArray = Array.isArray(prev[fieldKey])
                ? (prev[fieldKey] as string[])
                : []

            const updatedArray = currentArray.includes(value)
                ? currentArray.filter((item) => item !== value)
                : [...currentArray, value]

            return { ...prev, [field]: updatedArray }
        })
    }

    const handleNext = () => {
        onNext()
    }

    const handlePrevious = () => {
        onPrevious()
    }

    const handleSaveField = (fieldName: string) => {
        setSavedFields((prev) => ({ ...prev, [fieldName]: true }))
        setTimeout(() => {
            setSavedFields((prev) => ({ ...prev, [fieldName]: false }))
        }, 2000)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Доступность и комфорт
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Расскажите о ваших потребностях в доступности и ожиданиях от
                    платформы
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    {/* Work Comfort Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Комфорт на работе
                        </h3>

                        <FormItem label="Предпочитаемое рабочее время">
                            <Select<Option>
                                value={workTimeOptions.find(
                                    (option) =>
                                        option.value ===
                                        formData.preferred_work_time,
                                )}
                                onChange={(option) =>
                                    handleInputChange(
                                        'preferred_work_time',
                                        (option as Option)?.value || '',
                                    )
                                }
                                placeholder="Выберите предпочитаемое время работы"
                                options={workTimeOptions}
                            />
                        </FormItem>

                        <FormItem label="Важные адаптации на рабочем месте">
                            {/* Selected adaptations */}
                            {formData.important_adaptations.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Выбранные адаптации
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.important_adaptations.map(
                                            (adaptation) => (
                                                <div
                                                    key={adaptation}
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                >
                                                    <span>{adaptation}</span>
                                                    <button
                                                        onClick={() =>
                                                            handleToggleArray(
                                                                'important_adaptations',
                                                                adaptation,
                                                            )
                                                        }
                                                        className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Available adaptations */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Популярные адаптации
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {adaptationOptions.map((adaptation) => (
                                        <Chip
                                            key={adaptation}
                                            selected={formData.important_adaptations.includes(
                                                adaptation,
                                            )}
                                            onClick={() =>
                                                handleToggleArray(
                                                    'important_adaptations',
                                                    adaptation,
                                                )
                                            }
                                        >
                                            {adaptation}
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                            {formData.important_adaptations.includes(
                                'Другое',
                            ) && (
                                <div className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            value={formData.adaptations_other}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'adaptations_other',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Укажите другие адаптации"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            savedFields.adaptations_other
                                                ? 'solid'
                                                : 'default'
                                        }
                                        onClick={() =>
                                            handleSaveField('adaptations_other')
                                        }
                                        className="min-w-[80px] mt-0.5"
                                    >
                                        {savedFields.adaptations_other
                                            ? '✓ Сохранено'
                                            : 'Сохранить'}
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                    </div>

                    {/* Platform Expectations Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Ожидания от платформы
                        </h3>

                        <FormItem label="Желаемые функции платформы">
                            {/* Selected platform features */}
                            {formData.platform_features.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Выбранные функции платформы
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.platform_features.map(
                                            (feature) => (
                                                <div
                                                    key={feature}
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                >
                                                    <span>{feature}</span>
                                                    <button
                                                        onClick={() =>
                                                            handleToggleArray(
                                                                'platform_features',
                                                                feature,
                                                            )
                                                        }
                                                        className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Available platform features */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Популярные функции платформы
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {platformFeatureOptions.map((feature) => (
                                        <Chip
                                            key={feature}
                                            selected={formData.platform_features.includes(
                                                feature,
                                            )}
                                            onClick={() =>
                                                handleToggleArray(
                                                    'platform_features',
                                                    feature,
                                                )
                                            }
                                        >
                                            {feature}
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                            {formData.platform_features.includes('Другое') && (
                                <div className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            value={
                                                formData.platform_features_other
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'platform_features_other',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Укажите другие функции"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            savedFields.platform_features_other
                                                ? 'solid'
                                                : 'default'
                                        }
                                        onClick={() =>
                                            handleSaveField(
                                                'platform_features_other',
                                            )
                                        }
                                        className="min-w-[80px] mt-0.5"
                                    >
                                        {savedFields.platform_features_other
                                            ? '✓ Сохранено'
                                            : 'Сохранить'}
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                    </div>

                    {/* Feedback Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Обратная связь
                        </h3>

                        <FormItem label="Дополнительные комментарии или предложения">
                            <div className="space-y-2">
                                <textarea
                                    rows={4}
                                    value={formData.feedback}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'feedback',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Расскажите о любых дополнительных потребностях или предложениях..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            savedFields.feedback
                                                ? 'solid'
                                                : 'default'
                                        }
                                        onClick={() =>
                                            handleSaveField('feedback')
                                        }
                                        className="min-w-[80px]"
                                    >
                                        {savedFields.feedback
                                            ? '✓ Сохранено'
                                            : 'Сохранить'}
                                    </Button>
                                </div>
                            </div>
                        </FormItem>
                    </div>
                </Form>

                <div className="flex justify-between mt-8">
                    <Button
                        variant="default"
                        onClick={handlePrevious}
                        className="min-w-[120px]"
                    >
                        Назад
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleNext}
                        className="min-w-[120px]"
                    >
                        Далее
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AccessibilityStep
