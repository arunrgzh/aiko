'use client'

import { ReactNode } from 'react'
import { Progress } from '@/components/ui/Progress'
import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'

interface OnboardingLayoutProps {
    children: ReactNode
    currentStep: number
    totalSteps: number
}

const OnboardingLayout = ({
    children,
    currentStep,
    totalSteps,
}: OnboardingLayoutProps) => {
    const progressPercentage = (currentStep / totalSteps) * 100

    const steps = [
        { number: 1, title: 'Личная информация' },
        { number: 2, title: 'Профессиональный опыт' },
        { number: 3, title: 'Навыки и предпочтения' },
        { number: 4, title: 'Доступность и комфорт' },
        { number: 5, title: 'Завершение' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <Container>
                    <div className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Добро пожаловать в AI-Көмекші
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Давайте настроим ваш профиль
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Шаг {currentStep} из {totalSteps}
                                </div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {steps[currentStep - 1]?.title}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <Progress
                                percent={progressPercentage}
                                className="h-2"
                                //value={progressPercentage}
                            />
                        </div>

                        {/* Step Indicators */}
                        <div className="mt-4 flex justify-between">
                            {steps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className={`flex flex-col items-center ${
                                        index < currentStep - 1
                                            ? 'text-green-600 dark:text-green-400'
                                            : index === currentStep - 1
                                              ? 'text-blue-600 dark:text-blue-400'
                                              : 'text-gray-400 dark:text-gray-500'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                                            index < currentStep - 1
                                                ? 'bg-green-100 border-green-600 dark:bg-green-900 dark:border-green-400'
                                                : index === currentStep - 1
                                                  ? 'bg-blue-100 border-blue-600 dark:bg-blue-900 dark:border-blue-400'
                                                  : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                                        }`}
                                    >
                                        {index < currentStep - 1
                                            ? '✓'
                                            : step.number}
                                    </div>
                                    <span className="text-xs mt-1 hidden sm:block">
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Content */}
            <Container>
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="py-8"
                >
                    {children}
                </motion.div>
            </Container>
        </div>
    )
}

export default OnboardingLayout
