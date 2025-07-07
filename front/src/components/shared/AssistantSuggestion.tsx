'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiSparkles,
    HiXMark,
    HiLightBulb,
    HiChatBubbleLeftRight,
} from 'react-icons/hi2'
import { Button } from '@/components/ui'

interface AssistantSuggestionProps {
    isVisible: boolean
    onTakeAssessment: () => void
    onDismiss: () => void
    uncertaintyReason?: string
}

const AssistantSuggestion = ({
    isVisible,
    onTakeAssessment,
    onDismiss,
    uncertaintyReason = 'Я заметил, что вы затрудняетесь с выбором',
}: AssistantSuggestionProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (isVisible) {
            // Auto-expand after 2 seconds
            const timer = setTimeout(() => {
                setIsExpanded(true)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [isVisible])

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 100, y: 20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="fixed bottom-6 right-6 z-50 max-w-sm"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Assistant Avatar & Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <HiSparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">
                                        AI-Komekshi
                                    </h3>
                                    <p className="text-blue-100 text-xs">
                                        Персональный ассистент
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onDismiss}
                                className="text-white hover:text-blue-200 transition-colors p-1"
                            >
                                <HiXMark className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Animated Chat Bubble */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: isExpanded ? 'auto' : 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4">
                            {/* Chat bubble with suggestion */}
                            <div className="relative">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                                    <div className="flex items-start space-x-2">
                                        <HiChatBubbleLeftRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            <p className="mb-2">
                                                {uncertaintyReason}
                                            </p>
                                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                                                Хотите пройти быстрый тест на
                                                определение сильных и слабых
                                                сторон?
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Benefits list */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <HiLightBulb className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                            Это поможет:
                                        </span>
                                    </div>
                                    <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                                        <li className="flex items-center">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                            Определить ваши сильные стороны
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                            Получить персональные рекомендации
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                            Всего 6 вопросов, 2-3 минуты
                                        </li>
                                    </ul>
                                </div>

                                {/* Action buttons */}
                                <div className="flex justify-center space-x-2">
                                    <Button
                                        onClick={onTakeAssessment}
                                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
                                    >
                                        <HiSparkles className="w-4 h-4" />
                                        <span>Пройти тест</span>
                                    </Button>
                                    <Button
                                        onClick={onDismiss}
                                        variant="plain"
                                        className="px-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    >
                                        Не сейчас
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Collapsed state - just a notification dot */}
                    {!isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4"
                        >
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="w-full text-left"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        У меня есть предложение для вас
                                    </span>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Floating animation for attention */}
                <motion.div
                    animate={{
                        y: [0, -2, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-60"
                />
            </motion.div>
        </AnimatePresence>
    )
}

export default AssistantSuggestion
