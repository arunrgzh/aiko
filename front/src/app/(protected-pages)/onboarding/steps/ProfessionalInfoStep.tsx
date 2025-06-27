'use client'

import { useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface ProfessionalInfoStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onPrevious: () => void
}

const industryOptions = [
    'Технологии',
    'Здравоохранение',
    'Финансы',
    'Образование',
    'Производство',
    'Розничная торговля',
    'Консалтинг',
    'Маркетинг',
    'Продажи',
    'Другое',
]

const educationStatusOptions = [
    'Среднее образование',
    'Среднее специальное',
    'Неоконченное высшее',
    'Высшее образование',
    'Магистратура',
    'Докторантура',
    'Курсы и сертификаты',
    'Самообразование',
    'Другое',
]

const learningTopicOptions = [
    'Программирование',
    'Дизайн',
    'Маркетинг',
    'Управление проектами',
    'Иностранные языки',
    'Бухгалтерия',
    'Менеджмент',
    'Продажи',
    'Кулинария',
    'Ремесла',
    'Другое',
]

const ProfessionalInfoStep = ({
    data,
    onUpdate,
    onNext,
    onPrevious,
}: ProfessionalInfoStepProps) => {
    const [formData, setFormData] = useState({
        current_position: data.current_position || '',
        years_of_experience: data.years_of_experience || 0,
        industry: data.industry || '',
        education_status: data.education_status || '',
        wants_courses: data.wants_courses || '',
        learning_topics: data.learning_topics || [],
        learning_topics_other: data.learning_topics_other || '',
    })

    const experienceOptions = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20,
    ]

    const handleInputChange = (field: string, value: string | number) => {
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
                    Профессиональный опыт
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Расскажите о вашем опыте работы и образовании
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    {/* Work Experience Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Опыт работы
                        </h3>

                        <FormItem label="Текущая должность или статус">
                            <Input
                                value={formData.current_position}
                                onChange={(e) =>
                                    handleInputChange(
                                        'current_position',
                                        e.target.value,
                                    )
                                }
                                placeholder="Например: студент, безработный, кассир, волонтёр"
                            />
                        </FormItem>

                        <FormItem label="Годы опыта работы">
                            <Select
                                value={formData.years_of_experience.toString()}
                                onChange={(value) =>
                                    handleInputChange(
                                        'years_of_experience',
                                        parseInt(value || '0'),
                                    )
                                }
                                placeholder="Выберите количество лет опыта"
                                options={experienceOptions.map((exp) =>
                                    exp.toString(),
                                )}
                            />
                        </FormItem>

                        <FormItem label="Отрасль (если есть)">
                            <Select
                                value={formData.industry}
                                onChange={(value) =>
                                    handleInputChange('industry', value || '')
                                }
                                placeholder="Выберите отрасль"
                                options={industryOptions}
                            />
                        </FormItem>
                    </div>

                    {/* Education Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Образование и обучение
                        </h3>

                        <FormItem label="Уровень образования">
                            <Select
                                value={formData.education_status}
                                onChange={(value) =>
                                    handleInputChange(
                                        'education_status',
                                        value || '',
                                    )
                                }
                                placeholder="Выберите уровень образования"
                                options={educationStatusOptions}
                            />
                        </FormItem>

                        <FormItem label="Хотите ли вы проходить курсы?">
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="wants_courses"
                                        value="yes"
                                        checked={
                                            formData.wants_courses === 'yes'
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'wants_courses',
                                                e.target.value,
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    Да
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="wants_courses"
                                        value="no"
                                        checked={
                                            formData.wants_courses === 'no'
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'wants_courses',
                                                e.target.value,
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    Нет
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="wants_courses"
                                        value="maybe"
                                        checked={
                                            formData.wants_courses === 'maybe'
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'wants_courses',
                                                e.target.value,
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    Возможно
                                </label>
                            </div>
                        </FormItem>

                        {formData.wants_courses !== 'no' && (
                            <FormItem label="Интересующие темы для обучения">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {learningTopicOptions.map((topic) => (
                                        <Button
                                            key={topic}
                                            size="sm"
                                            variant={
                                                formData.learning_topics.includes(
                                                    topic,
                                                )
                                                    ? 'solid'
                                                    : 'default'
                                            }
                                            onClick={() =>
                                                handleToggleArray(
                                                    'learning_topics',
                                                    topic,
                                                )
                                            }
                                        >
                                            {topic}
                                        </Button>
                                    ))}
                                </div>

                                {formData.learning_topics.includes(
                                    'Другое',
                                ) && (
                                    <Input
                                        value={formData.learning_topics_other}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'learning_topics_other',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Укажите другие темы для обучения"
                                    />
                                )}
                            </FormItem>
                        )}
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

export default ProfessionalInfoStep
