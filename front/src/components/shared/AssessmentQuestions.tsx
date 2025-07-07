'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiSparkles,
    HiArrowLeft,
    HiArrowRight,
    HiCheckCircle,
    HiClock,
} from 'react-icons/hi2'
import { Button } from '@/components/ui'
import Card from '@/components/ui/Card'
import { Progress } from '@/components/ui'

interface AssessmentQuestion {
    id: number
    question_text: string
    question_type: 'scale' | 'single_choice' | 'multiple_choice'
    assessment_category: string
    options: string[]
    weight: number
}

interface AssessmentAnswer {
    question_id: number
    answer: string | number | string[]
}

interface AssessmentQuestionsProps {
    questions: AssessmentQuestion[]
    onSubmit: (answers: AssessmentAnswer[]) => void
    loading?: boolean
}

const AssessmentQuestions = ({
    questions,
    onSubmit,
    loading = false,
}: AssessmentQuestionsProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
    const [selectedAnswer, setSelectedAnswer] = useState<
        string | number | string[] | null
    >(null)

    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    // Reset selected answer when question changes
    useEffect(() => {
        const existingAnswer = answers.find(
            (a) => a.question_id === question?.id,
        )
        setSelectedAnswer(existingAnswer?.answer || null)
    }, [currentQuestion, question?.id, answers])

    const handleAnswerSelect = (answer: string | number | string[]) => {
        setSelectedAnswer(answer)
    }

    const handleNext = () => {
        if (selectedAnswer !== null && question) {
            // Update answers array
            const newAnswers = answers.filter(
                (a) => a.question_id !== question.id,
            )
            newAnswers.push({
                question_id: question.id,
                answer: selectedAnswer,
            })
            setAnswers(newAnswers)

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
            } else {
                // Submit assessment
                onSubmit(newAnswers)
            }
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const renderScaleQuestion = () => (
        <div className="space-y-3">
            {question.options.map((option, index) => {
                const value = index + 1
                const isSelected = selectedAnswer === value

                return (
                    <motion.div
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                            isSelected
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                        }`}
                        onClick={() => handleAnswerSelect(value)}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white font-medium">
                                {option}
                            </span>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: isSelected ? 1 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                            >
                                <HiCheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )

    const renderSingleChoiceQuestion = () => (
        <div className="space-y-3">
            {question.options.map((option, index) => {
                const isSelected = selectedAnswer === option

                return (
                    <motion.div
                        key={option}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                            isSelected
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white">
                                {option}
                            </span>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: isSelected ? 1 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                            >
                                <HiCheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )

    const renderMultipleChoiceQuestion = () => {
        const selectedOptions = Array.isArray(selectedAnswer)
            ? selectedAnswer
            : []

        return (
            <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Выберите несколько вариантов, которые подходят вам
                </p>
                {question.options.map((option, index) => {
                    const isSelected = selectedOptions.includes(option)

                    return (
                        <motion.div
                            key={option}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                                isSelected
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                            }`}
                            onClick={() => {
                                const newSelected = isSelected
                                    ? selectedOptions.filter(
                                          (o) => o !== option,
                                      )
                                    : [...selectedOptions, option]
                                handleAnswerSelect(newSelected)
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-900 dark:text-white">
                                    {option}
                                </span>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: isSelected ? 1 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                                >
                                    <HiCheckCircle className="w-3 h-3 text-white" />
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        )
    }

    if (!question) {
        return null
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header with Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <HiSparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Тест навыков
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Вопрос {currentQuestion + 1} из{' '}
                                {questions.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <HiClock className="w-4 h-4 mr-1" />
                        ~5 мин
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <Progress
                        percent={progress}
                        className="h-2 bg-gray-200 dark:bg-gray-700"
                        customColor="bg-gradient-to-r from-indigo-500 to-purple-600"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 bg-gradient-to-r from-indigo-500 to-purple-600 w-4 h-4 rounded-full"
                        style={{ left: `calc(${progress}% - 8px)` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="p-8 mb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                {question.question_text}
                            </h2>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                                    {question.assessment_category}
                                </span>
                            </div>
                        </div>

                        {/* Render appropriate question type */}
                        {question.question_type === 'scale' &&
                            renderScaleQuestion()}
                        {question.question_type === 'single_choice' &&
                            renderSingleChoiceQuestion()}
                        {question.question_type === 'multiple_choice' &&
                            renderMultipleChoiceQuestion()}
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="flex items-center"
                >
                    <HiArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                </Button>

                <div className="flex space-x-2">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                index <= currentQuestion
                                    ? 'bg-indigo-500'
                                    : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        />
                    ))}
                </div>

                <Button
                    onClick={handleNext}
                    disabled={
                        selectedAnswer === null ||
                        (Array.isArray(selectedAnswer) &&
                            selectedAnswer.length === 0)
                    }
                    loading={
                        loading && currentQuestion === questions.length - 1
                    }
                    className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                    {currentQuestion === questions.length - 1 ? (
                        <>
                            <HiSparkles className="w-4 h-4 mr-2" />
                            Завершить тест
                        </>
                    ) : (
                        <>
                            Далее
                            <HiArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default AssessmentQuestions
