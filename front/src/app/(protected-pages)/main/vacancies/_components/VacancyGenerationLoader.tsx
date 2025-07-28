'use client'

import { useEffect, useState } from 'react'
import { useTranslations, TFunction } from 'next-intl';
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { TbBrain, TbSearch, TbTarget, TbUserCheck } from 'react-icons/tb'

export default function VacancyGenerationLoader() {
    const { t }: { t: any } = useTranslations();
    const [currentStep, setCurrentStep] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)

    const steps = [
        {
            icon: <TbUserCheck className="text-2xl" />,
            title: t('vacancies.loader.steps.analyzeProfile.title'),
            description: t('vacancies.loader.steps.analyzeProfile.description'),
            duration: 2000,
        },
        {
            icon: <TbBrain className="text-2xl" />,
            title: t('vacancies.loader.steps.applyAI.title'),
            description: t('vacancies.loader.steps.applyAI.description'),
            duration: 3000,
        },
        {
            icon: <TbSearch className="text-2xl" />,
            title: t('vacancies.loader.steps.searchVacancies.title'),
            description: t('vacancies.loader.steps.searchVacancies.description'),
            duration: 2500,
        },
        {
            icon: <TbTarget className="text-2xl" />,
            title: t('vacancies.loader.steps.personalizeResults.title'),
            description: t('vacancies.loader.steps.personalizeResults.description'),
            duration: 2000,
        },
    ]

    useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => {
                if (currentStep === steps.length - 1) {
                    setIsCompleted(true)
                } else {
                    setCurrentStep(currentStep + 1)
                }
            }, steps[currentStep].duration)

            return () => clearTimeout(timer)
        }
    }, [currentStep])

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Card className="max-w-2xl w-full p-8">
                <div className="text-center mb-8">
                    <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-20"></div>
                        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full">
                            <TbBrain className="text-4xl" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {t('vacancies.loader.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('vacancies.loader.subtitle')}
                    </p>
                </div>

                <div className="space-y-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                                index === currentStep
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                    : index < currentStep
                                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                      : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                                    index === currentStep
                                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                        : index < currentStep
                                          ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                }`}
                            >
                                {index === currentStep ? (
                                    <Spinner
                                        size="24"
                                        className="text-blue-600 dark:text-blue-400"
                                    />
                                ) : index < currentStep ? (
                                    <div className="text-green-600 dark:text-green-400">
                                        ✓
                                    </div>
                                ) : (
                                    step.icon
                                )}
                            </div>
                            <div className="flex-1">
                                <h3
                                    className={`font-semibold transition-colors duration-500 ${
                                        index === currentStep
                                            ? 'text-blue-900 dark:text-blue-100'
                                            : index < currentStep
                                              ? 'text-green-900 dark:text-green-100'
                                              : 'text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    className={`text-sm transition-colors duration-500 ${
                                        index === currentStep
                                            ? 'text-blue-700 dark:text-blue-300'
                                            : index < currentStep
                                              ? 'text-green-700 dark:text-green-300'
                                              : 'text-gray-500 dark:text-gray-500'
                                    }`}
                                >
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {isCompleted && (
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full mb-4">
                            <div className="text-2xl">✓</div>
                        </div>
                        <p className="text-green-700 dark:text-green-300 font-medium">
                            {t('vacancies.loader.completed')}
                        </p>
                    </div>
                )}

                <div className="mt-8">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>{t('vacancies.loader.progress')}</span>
                        <span>
                            {Math.round(
                                ((currentStep + 1) / steps.length) * 100,
                            )}
                            %
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${((currentStep + 1) / steps.length) * 100}%`,
                            }}
                        ></div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
