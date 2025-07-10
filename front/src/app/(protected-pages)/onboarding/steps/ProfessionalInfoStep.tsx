'use client'

import { useState, ReactNode, useMemo, useCallback, useEffect } from 'react'
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

interface ProfessionalInfoStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onPrevious: () => void
}

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
    })

    const [employmentStatus, setEmploymentStatus] = useState<
        'employed' | 'student' | 'unemployed' | ''
    >('')
    const [jobTitle, setJobTitle] = useState('')

    const professionStopWords = useMemo(
        () => ['student', 'unemployed', 'безработный', 'студент'],
        [],
    )

    useEffect(() => {
        const currentPosition = formData.current_position || ''
        if (professionStopWords.includes(currentPosition.toLowerCase())) {
            setEmploymentStatus(
                currentPosition.toLowerCase().startsWith('student') ||
                    currentPosition.toLowerCase().startsWith('студент')
                    ? 'student'
                    : 'unemployed',
            )
            setJobTitle('')
        } else if (currentPosition) {
            setEmploymentStatus('employed')
            setJobTitle(currentPosition)
        }
    }, [])

    const handleEmploymentStatusChange = (option: unknown) => {
        const status =
            (option as { value: 'employed' | 'student' | 'unemployed' })
                ?.value || ''
        setEmploymentStatus(status)
        if (status === 'student' || status === 'unemployed') {
            setJobTitle('')
            onUpdate({ current_position: status })
        } else if (status === 'employed') {
            onUpdate({ current_position: jobTitle })
        } else {
            onUpdate({ current_position: '' })
        }
    }

    const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newJobTitle = e.target.value
        setJobTitle(newJobTitle)
        onUpdate({ current_position: newJobTitle })
    }

    // Синхронизируем с родительским компонентом через useEffect
    useEffect(() => {
        const timeout = setTimeout(() => {
            onUpdate(formData)
        }, 0)
        return () => clearTimeout(timeout)
    }, [formData])

    const experienceOptions = useMemo(
        () => [
            { value: 0, label: 'Нет опыта' },
            { value: 1, label: 'Менее 1 года' },
            { value: 2, label: '1-2 года' },
            { value: 3, label: '3-5 лет' },
            { value: 5, label: '5-10 лет' },
            { value: 10, label: 'Более 10 лет' },
        ],
        [],
    )

    const educationOptions = useMemo(
        () => [
            { value: 'none', label: 'Нет образования' },
            { value: 'primary', label: 'Начальное образование' },
            { value: 'secondary', label: 'Среднее образование' },
            { value: 'vocational', label: 'Профессиональное образование' },
            { value: 'bachelor', label: 'Бакалавриат' },
            { value: 'master', label: 'Магистратура' },
            { value: 'phd', label: 'Докторантура' },
        ],
        [],
    )

    const industryOptions = useMemo(
        () => [
            { value: 'it', label: 'IT и технологии' },
            { value: 'education', label: 'Образование' },
            { value: 'healthcare', label: 'Здравоохранение' },
            { value: 'retail', label: 'Торговля' },
            { value: 'manufacturing', label: 'Производство' },
            { value: 'construction', label: 'Строительство' },
            { value: 'transport', label: 'Транспорт' },
            { value: 'finance', label: 'Финансы' },
            { value: 'tourism', label: 'Туризм' },
            { value: 'government', label: 'Государственная служба' },
            { value: 'ngo', label: 'НКО и благотворительность' },
            { value: 'media', label: 'Медиа и реклама' },
            { value: 'arts', label: 'Искусство и развлечения' },
            { value: 'agriculture', label: 'Сельское хозяйство' },
            { value: 'energy', label: 'Энергетика' },
            { value: 'other', label: 'Другое' },
        ],
        [],
    )

    const employmentStatusOptions = useMemo(
        () => [
            { value: 'employed', label: 'Работаю' },
            { value: 'student', label: 'Студент / Учащийся' },
            {
                value: 'unemployed',
                label: 'Безработный / Временно не работаю',
            },
        ],
        [],
    )

    const handleInputChange = useCallback(
        (field: string, value: string | number) => {
            setFormData((prev) => ({ ...prev, [field]: value }))
        },
        [],
    )

    const handleNext = () => {
        onNext()
    }

    const handlePrevious = () => {
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

                        <FormItem label="Текущий статус">
                            <Select
                                value={employmentStatusOptions.find(
                                    (option) =>
                                        option.value === employmentStatus,
                                )}
                                onChange={handleEmploymentStatusChange}
                                placeholder="Выберите ваш текущий статус"
                                options={employmentStatusOptions}
                            />
                        </FormItem>

                        {employmentStatus === 'employed' && (
                            <FormItem label="Текущая должность">
                                <Input
                                    value={jobTitle}
                                    onChange={handleJobTitleChange}
                                    placeholder="Например: кассир, разработчик, менеджер"
                                />
                            </FormItem>
                        )}

                        <FormItem label="Годы опыта работы">
                            <Select<{ value: number; label: string }>
                                value={experienceOptions.find(
                                    (option) =>
                                        option.value ===
                                        formData.years_of_experience,
                                )}
                                onChange={(option) =>
                                    handleInputChange(
                                        'years_of_experience',
                                        (
                                            option as {
                                                value: number
                                                label: string
                                            }
                                        )?.value || 0,
                                    )
                                }
                                placeholder="Выберите количество лет опыта"
                                options={experienceOptions}
                            />
                        </FormItem>

                        <FormItem label="Отрасль (если есть)">
                            <Select<{ value: string; label: string }>
                                value={industryOptions.find(
                                    (option) =>
                                        option.value === formData.industry,
                                )}
                                onChange={(option) =>
                                    handleInputChange(
                                        'industry',
                                        (
                                            option as {
                                                value: string
                                                label: string
                                            }
                                        )?.value || '',
                                    )
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
                            <Select<{ value: string; label: string }>
                                value={educationOptions.find(
                                    (option) =>
                                        option.value ===
                                        formData.education_status,
                                )}
                                onChange={(option) =>
                                    handleInputChange(
                                        'education_status',
                                        (
                                            option as {
                                                value: string
                                                label: string
                                            }
                                        )?.value || '',
                                    )
                                }
                                placeholder="Выберите уровень образования"
                                options={educationOptions}
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

export default ProfessionalInfoStep
