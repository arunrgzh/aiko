'use client'

import { useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface PersonalInfoStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
}

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
    })

    const genderOptions = ['male', 'female', 'other', 'prefer_not_to_say']

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        onUpdate(formData)
        onNext()
    }

    const isFormValid = formData.first_name && formData.last_name

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Tell us about yourself
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Let's start with your basic information
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="First Name *">
                            <Input
                                value={formData.first_name}
                                onChange={(e) =>
                                    handleInputChange(
                                        'first_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Enter your first name"
                            />
                        </FormItem>

                        <FormItem label="Last Name *">
                            <Input
                                value={formData.last_name}
                                onChange={(e) =>
                                    handleInputChange(
                                        'last_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Enter your last name"
                            />
                        </FormItem>
                    </div>

                    <FormItem label="Phone Number">
                        <Input
                            value={formData.phone}
                            onChange={(e) =>
                                handleInputChange('phone', e.target.value)
                            }
                            placeholder="Enter your phone number"
                        />
                    </FormItem>

                    <FormItem label="Date of Birth">
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

                    <FormItem label="Gender">
                        <Select
                            value={formData.gender}
                            onChange={(value) =>
                                handleInputChange('gender', value || '')
                            }
                            placeholder="Select your gender"
                            options={genderOptions}
                        />
                    </FormItem>
                </Form>

                <div className="flex justify-end mt-8">
                    <Button
                        variant="solid"
                        onClick={handleNext}
                        disabled={!isFormValid}
                        className="min-w-[120px]"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfoStep
