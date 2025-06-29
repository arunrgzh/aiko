'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface Option {
    value: string
    label: string
}

interface PersonalInfoStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
}

const Chip = ({
    selected,
    children,
    ...props
}: {
    selected: boolean
    children: React.ReactNode
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

const PersonalInfoStep = ({
    data,
    onUpdate,
    onNext,
}: PersonalInfoStepProps) => {
    const [formData, setFormData] = useState({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
        disability_type: data.disability_type || [],
        disability_description: data.disability_description || '',
        work_conditions: data.work_conditions || [],
        workplace_preferences: data.workplace_preferences || [],
        workplace_other: data.workplace_other || '',
    })

    const [savedFields, setSavedFields] = useState<Record<string, boolean>>({})

    // Синхронизируем с родительским компонентом через useEffect
    useEffect(() => {
        const timeout = setTimeout(() => {
            onUpdate(formData)
        }, 0)
        return () => clearTimeout(timeout)
    }, [formData])

    const genderOptions: Option[] = useMemo(
        () => [
            { value: 'male', label: 'Мужской' },
            { value: 'female', label: 'Женский' },
            { value: 'other', label: 'Другое' },
            { value: 'prefer_not_to_say', label: 'Предпочитаю не указывать' },
        ],
        [],
    )

    const disabilityTypeOptions = useMemo(
        () => [
            'Нарушение зрения',
            'Нарушение слуха',
            'Нарушение опорно-двигательного аппарата',
            'Нарушение речи',
            'Когнитивные нарушения',
            'Психические расстройства',
            'Хронические заболевания',
            'Другое',
            'Нет инвалидности',
        ],
        [],
    )

    const workConditionOptions = useMemo(
        () => [
            'Могу работать полный день',
            'Могу работать неполный день',
            'Нужен гибкий график',
            'Могу работать удаленно',
            'Нужна помощь на рабочем месте',
            'Нужны специальные условия',
            'Другое',
        ],
        [],
    )

    const workplacePreferenceOptions = useMemo(
        () => [
            'Офис',
            'Удаленная работа',
            'Гибридная работа',
            'Домашняя работа',
            'Специально оборудованное место',
            'Другое',
        ],
        [],
    )

    const handleInputChange = useCallback(
        (field: string, value: string | string[]) => {
            setFormData((prev) => ({ ...prev, [field]: value }))
        },
        [],
    )

    const handleToggleArray = useCallback((field: string, value: string) => {
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
    }, [])

    const handleSaveField = useCallback((fieldName: string) => {
        setSavedFields((prev) => ({ ...prev, [fieldName]: true }))
        setTimeout(() => {
            setSavedFields((prev) => ({ ...prev, [fieldName]: false }))
        }, 2000)
    }, [])

    const handleNext = useCallback(() => {
        onNext()
    }, [onNext])

    const isFormValid = formData.first_name && formData.last_name

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Личная информация
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Расскажите о себе и ваших потребностях
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Основная информация
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormItem label="Имя *">
                                <Input
                                    value={formData.first_name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'first_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Имя"
                                />
                            </FormItem>

                            <FormItem label="Фамилия *">
                                <Input
                                    value={formData.last_name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'last_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Фамилия"
                                />
                            </FormItem>
                        </div>

                        <FormItem label="Телефон">
                            <Input
                                value={formData.phone}
                                onChange={(e) =>
                                    handleInputChange('phone', e.target.value)
                                }
                                placeholder="Телефон"
                            />
                        </FormItem>

                        <FormItem label="Дата рождения">
                            <Input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) =>
                                    handleInputChange(
                                        'date_of_birth',
                                        e.target.value,
                                    )
                                }
                            />
                        </FormItem>

                        <FormItem label="Пол">
                            <Select<Option>
                                value={genderOptions.find(
                                    (option) =>
                                        option.value === formData.gender,
                                )}
                                onChange={(option) =>
                                    handleInputChange(
                                        'gender',
                                        (option as Option)?.value || '',
                                    )
                                }
                                placeholder="Выберите пол"
                                options={genderOptions}
                            />
                        </FormItem>
                    </div>

                    {/* Disability Information */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Информация об инвалидности
                        </h3>

                        <FormItem label="Тип инвалидности (если есть)">
                            {/* Selected disability types */}
                            {formData.disability_type.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Выбранные типы инвалидности
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.disability_type.map(
                                            (type) => (
                                                <div
                                                    key={type}
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                >
                                                    <span>{type}</span>
                                                    <button
                                                        onClick={() =>
                                                            handleToggleArray(
                                                                'disability_type',
                                                                type,
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

                            {/* Available disability types */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Доступные варианты
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {disabilityTypeOptions.map((type) => (
                                        <Chip
                                            key={type}
                                            selected={formData.disability_type.includes(
                                                type,
                                            )}
                                            onClick={() =>
                                                handleToggleArray(
                                                    'disability_type',
                                                    type,
                                                )
                                            }
                                        >
                                            {type}
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                            {formData.disability_type.includes('Другое') && (
                                <div className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            value={
                                                formData.disability_description
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'disability_description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Опишите тип инвалидности"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            savedFields.disability_description
                                                ? 'solid'
                                                : 'default'
                                        }
                                        onClick={() =>
                                            handleSaveField(
                                                'disability_description',
                                            )
                                        }
                                        className="min-w-[80px] mt-0.5"
                                    >
                                        {savedFields.disability_description
                                            ? '✓ Сохранено'
                                            : 'Сохранить'}
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                    </div>

                    {/* Work Conditions */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Условия труда
                        </h3>

                        <FormItem label="Ваши возможности по работе">
                            {/* Selected work conditions */}
                            {formData.work_conditions.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Выбранные условия работы
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.work_conditions.map(
                                            (condition) => (
                                                <div
                                                    key={condition}
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                >
                                                    <span>{condition}</span>
                                                    <button
                                                        onClick={() =>
                                                            handleToggleArray(
                                                                'work_conditions',
                                                                condition,
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

                            {/* Available work conditions */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Доступные варианты
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {workConditionOptions.map((condition) => (
                                        <Chip
                                            key={condition}
                                            selected={formData.work_conditions.includes(
                                                condition,
                                            )}
                                            onClick={() =>
                                                handleToggleArray(
                                                    'work_conditions',
                                                    condition,
                                                )
                                            }
                                        >
                                            {condition}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </FormItem>

                        <FormItem label="Предпочтения по месту работы">
                            {/* Selected workplace preferences */}
                            {formData.workplace_preferences.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Выбранные предпочтения по месту работы
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.workplace_preferences.map(
                                            (preference) => (
                                                <div
                                                    key={preference}
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                >
                                                    <span>{preference}</span>
                                                    <button
                                                        onClick={() =>
                                                            handleToggleArray(
                                                                'workplace_preferences',
                                                                preference,
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

                            {/* Available workplace preferences */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Доступные варианты
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {workplacePreferenceOptions.map(
                                        (preference) => (
                                            <Chip
                                                key={preference}
                                                selected={formData.workplace_preferences.includes(
                                                    preference,
                                                )}
                                                onClick={() =>
                                                    handleToggleArray(
                                                        'workplace_preferences',
                                                        preference,
                                                    )
                                                }
                                            >
                                                {preference}
                                            </Chip>
                                        ),
                                    )}
                                </div>
                            </div>

                            {formData.workplace_preferences.includes(
                                'Другое',
                            ) && (
                                <div className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            value={formData.workplace_other}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'workplace_other',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Укажите другие предпочтения"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            savedFields.workplace_other
                                                ? 'solid'
                                                : 'default'
                                        }
                                        onClick={() =>
                                            handleSaveField('workplace_other')
                                        }
                                        className="min-w-[80px] mt-0.5"
                                    >
                                        {savedFields.workplace_other
                                            ? '✓ Сохранено'
                                            : 'Сохранить'}
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                    </div>
                </Form>

                <div className="flex justify-end mt-8">
                    <Button
                        variant="solid"
                        onClick={handleNext}
                        disabled={false}
                        className="min-w-[120px]"
                    >
                        Далее
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfoStep
