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
        company_size: data.company_size || '',
    })

    const industryOptions = [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Manufacturing',
        'Retail',
        'Consulting',
        'Marketing',
        'Sales',
        'Other',
    ]

    const companySizeOptions = [
        '1-10 employees',
        '11-50 employees',
        '51-200 employees',
        '201-1000 employees',
        '1000+ employees',
    ]

    const experienceOptions = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20,
    ]

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
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
                    Professional Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Tell us about your work experience
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    <FormItem label="Current Position">
                        <Input
                            value={formData.current_position}
                            onChange={(e) =>
                                handleInputChange(
                                    'current_position',
                                    e.target.value,
                                )
                            }
                            placeholder="e.g., Software Engineer, Marketing Manager"
                        />
                    </FormItem>

                    <FormItem label="Years of Experience">
                        <Select
                            value={formData.years_of_experience.toString()}
                            onChange={(value) =>
                                handleInputChange(
                                    'years_of_experience',
                                    parseInt(value || '0'),
                                )
                            }
                            placeholder="Select years of experience"
                            options={experienceOptions.map((exp) =>
                                exp.toString(),
                            )}
                        />
                    </FormItem>

                    <FormItem label="Industry">
                        <Select
                            value={formData.industry}
                            onChange={(value) =>
                                handleInputChange('industry', value || '')
                            }
                            placeholder="Select your industry"
                            options={industryOptions}
                        />
                    </FormItem>

                    <FormItem label="Company Size">
                        <Select
                            value={formData.company_size}
                            onChange={(value) =>
                                handleInputChange('company_size', value || '')
                            }
                            placeholder="Select company size"
                            options={companySizeOptions}
                        />
                    </FormItem>
                </Form>

                <div className="flex justify-between mt-8">
                    <Button
                        variant="default"
                        onClick={handlePrevious}
                        className="min-w-[120px]"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleNext}
                        className="min-w-[120px]"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProfessionalInfoStep
