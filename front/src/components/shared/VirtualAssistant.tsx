'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    HiSparkles,
    HiXMark,
    HiChatBubbleLeftRight,
    HiQuestionMarkCircle,
    HiArrowRight,
    HiUser,
    HiBriefcase,
    HiCog6Tooth,
} from 'react-icons/hi2'
import { Button } from '@/components/ui'

interface VirtualAssistantProps {
    isVisible?: boolean
    onDismiss?: () => void
    initialMessage?: string
    showQuickActions?: boolean
    autoShow?: boolean
    autoShowDelay?: number
}

const VirtualAssistant = ({
    isVisible = true,
    onDismiss,
    initialMessage = 'Привет! Я ваш персональный ассистент. Чем могу помочь?',
    showQuickActions = true,
    autoShow = false,
    autoShowDelay = 3000,
}: VirtualAssistantProps) => {
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState(false)
    const [isMinimized, setIsMinimized] = useState(!autoShow)
    const [currentMessage, setCurrentMessage] = useState(initialMessage)

    useEffect(() => {
        if (autoShow && isVisible) {
            const timer = setTimeout(() => {
                setIsMinimized(false)
                setIsExpanded(true)
            }, autoShowDelay)
            return () => clearTimeout(timer)
        }
    }, [isVisible, autoShow, autoShowDelay])

    const handleStartChat = () => {
        router.push('/main/ai-chat')
    }

    const handleQuickAction = (action: string, message: string) => {
        setCurrentMessage(message)
        setIsExpanded(true)

        // Auto-navigate to chat after showing message
        setTimeout(() => {
            router.push('/main/ai-chat')
        }, 2000)
    }

    const handleMinimize = () => {
        setIsExpanded(false)
        setIsMinimized(true)
    }

    const handleExpand = () => {
        setIsMinimized(false)
        setIsExpanded(true)
    }

    const handleClose = () => {
        setIsMinimized(true)
        onDismiss?.()
    }

    if (!isVisible) return null

    // Minimized floating button
    if (isMinimized) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <motion.button
                    onClick={handleExpand}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
                >
                    <HiSparkles className="w-6 h-6" />
                </motion.button>

                {/* Notification pulse */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
                />
            </motion.div>
        )
    }

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
                    {/* Assistant Header */}
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
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={handleMinimize}
                                    className="text-white hover:text-blue-200 transition-colors p-1"
                                    title="Свернуть"
                                >
                                    <div className="w-3 h-0.5 bg-white rounded"></div>
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="text-white hover:text-blue-200 transition-colors p-1"
                                    title="Закрыть"
                                >
                                    <HiXMark className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: isExpanded ? 'auto' : 'auto' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4">
                            {/* Chat bubble with message */}
                            <div className="relative mb-4">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <div className="flex items-start space-x-2">
                                        <HiChatBubbleLeftRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            <p>{currentMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            {showQuickActions && (
                                <div className="space-y-3 mb-4">
                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Быстрые действия
                                    </h4>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() =>
                                                handleQuickAction(
                                                    'profile',
                                                    'Помогу вам с настройками профиля и персональными данными',
                                                )
                                            }
                                            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                        >
                                            <HiUser className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                Профиль и настройки
                                            </span>
                                            <HiArrowRight className="w-3 h-3 text-gray-400 ml-auto" />
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleQuickAction(
                                                    'jobs',
                                                    'Расскажу как найти подходящие вакансии и улучшить поиск работы',
                                                )
                                            }
                                            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                        >
                                            <HiBriefcase className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                Поиск работы
                                            </span>
                                            <HiArrowRight className="w-3 h-3 text-gray-400 ml-auto" />
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleQuickAction(
                                                    'platform',
                                                    'Отвечу на вопросы о функциях платформы и как ими пользоваться',
                                                )
                                            }
                                            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                        >
                                            <HiCog6Tooth className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                Помощь с платформой
                                            </span>
                                            <HiArrowRight className="w-3 h-3 text-gray-400 ml-auto" />
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleQuickAction(
                                                    'general',
                                                    'Задавайте любые вопросы - постараюсь помочь!',
                                                )
                                            }
                                            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                        >
                                            <HiQuestionMarkCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                Другие вопросы
                                            </span>
                                            <HiArrowRight className="w-3 h-3 text-gray-400 ml-auto" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Main Chat Button */}
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleStartChat}
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 w-full"
                                >
                                    <HiChatBubbleLeftRight className="w-4 h-4" />
                                    <span>Открыть чат</span>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
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
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-60"
                />
            </motion.div>
        </AnimatePresence>
    )
}

export default VirtualAssistant
