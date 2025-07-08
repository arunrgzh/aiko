'use client'

import { ReactNode, memo } from 'react'
import { Progress } from '@/components/ui/Progress'
import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'

interface OnboardingLayoutProps {
    children: ReactNode
    currentStep: number
    totalSteps: number
    onStepChange?: (step: number) => void
}

const OnboardingLayout = memo(
    ({
        children,
        currentStep,
        totalSteps,
        onStepChange,
    }: OnboardingLayoutProps) => {
        const progressPercentage = (currentStep / totalSteps) * 100

        const steps = [
            { number: 1, title: 'Личная информация' },
            { number: 2, title: 'Профессиональный опыт' },
            { number: 3, title: 'Навыки и предпочтения' },
            { number: 4, title: 'Доступность и комфорт' },
            { number: 5, title: 'Завершение' },
        ]

        const handleStepClick = (stepNumber: number) => {
            if (onStepChange) {
                onStepChange(stepNumber)
            }
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                <Container>
                    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-0 md:p-0 border border-gray-100 dark:border-gray-800 mt-8 mb-8 relative">
                        {/* Step number in top right */}
                        <div className="absolute top-6 right-6 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1 text-gray-700 dark:text-gray-200 text-sm font-semibold shadow-sm">
                            <span>
                                Шаг {currentStep} из {totalSteps}
                            </span>
                        </div>
                        {/* Header */}
                        <div className="px-8 pt-8 pb-2">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                                Добро пожаловать в AI-Komekshi
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                Давайте настроим ваш профиль
                            </p>
                            {/* Progress Bar */}
                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-6">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${progressPercentage}%`,
                                        background:
                                            'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
                                    }}
                                />
                            </div>
                            {/* Steps as buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-2">
                                {steps.map((step, index) => (
                                    <div
                                        key={step.number}
                                        className={`flex flex-col items-center justify-center px-2 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none hover:border-blue-400
                                        ${
                                            index + 1 === currentStep
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 shadow-md'
                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300'
                                        }
                                    `}
                                        style={{ minHeight: 70 }}
                                        onClick={() =>
                                            handleStepClick(index + 1)
                                        }
                                    >
                                        <span className="text-2xl mb-1">
                                            {step.number}
                                        </span>
                                        <span
                                            className={`text-xs font-semibold text-center ${index + 1 === currentStep ? 'text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Content */}
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 md:px-8 pb-10 pt-2"
                        >
                            {children}
                        </motion.div>
                    </div>
                </Container>
            </div>
        )
    },
)

OnboardingLayout.displayName = 'OnboardingLayout'

export default OnboardingLayout
