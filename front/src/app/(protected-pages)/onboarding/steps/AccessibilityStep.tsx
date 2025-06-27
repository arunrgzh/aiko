'use client'

import { useState, ReactNode } from 'react'
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

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleToggleArray = (field: string, value: string) => {
        setFormData((prev) => {
            const currentArray = prev[field as keyof typeof prev] as string[]
            const updatedArray = currentArray.includes(value)
                ? currentArray.filter((item) => item !== value)
                : [...currentArray, value]
            return { ...prev, [field]: updatedArray }
        })
    }

    const handleNext = () => {
        onUpdate(formData)
        onNext()
    }

    const handlePrevious = () => {
        onUpdate(formData)
        onPrevious()
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

                            {formData.important_adaptations.includes(
                                'Другое',
                            ) && (
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
                            )}
                        </FormItem>
                    </div>

                    {/* Platform Expectations Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Ожидания от платформы
                        </h3>

                        <FormItem label="Желаемые функции платформы">
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

                            {formData.platform_features.includes('Другое') && (
                                <Input
                                    value={formData.platform_features_other}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'platform_features_other',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Укажите другие функции"
                                />
                            )}
                        </FormItem>
                    </div>

                    {/* Accessibility Issues Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Проблемы с доступностью
                        </h3>

                        <FormItem label="Какие проблемы с доступностью у вас есть?">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {accessibilityIssueOptions.map((issue) => (
                                    <Chip
                                        key={issue}
                                        selected={formData.accessibility_issues.includes(
                                            issue,
                                        )}
                                        onClick={() =>
                                            handleToggleArray(
                                                'accessibility_issues',
                                                issue,
                                            )
                                        }
                                    >
                                        {issue}
                                    </Chip>
                                ))}
                            </div>

                            {formData.accessibility_issues.includes(
                                'Другое',
                            ) && (
                                <Input
                                    value={formData.accessibility_issues_other}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'accessibility_issues_other',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Опишите другие проблемы"
                                />
                            )}
                        </FormItem>
                    </div>

                    {/* Feedback Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Обратная связь
                        </h3>

                        <FormItem label="Дополнительные комментарии или предложения">
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
