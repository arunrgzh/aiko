'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import {
    TbFileText,
    TbBriefcase,
    TbMessageCircle,
    TbUser,
    TbHeart,
    TbVideo,
    TbSettings,
    TbTrendingUp,
    TbSparkles,
    TbRocket,
    TbTarget,
    TbClock,
    TbBrain,
    TbStar,
    TbChevronRight,
    TbBell,
    TbCalendar,
    TbAward,
    TbEye,
} from 'react-icons/tb'

// Floating particles component
const FloatingParticles = () => {
    const particles = Array.from({ length: 20 }, (_, i) => i)

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle}
                    className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    )
}

// Time-based greeting
const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12)
        return {
            text: 'Доброе утро',
            emoji: '🌅',
            color: 'from-yellow-400 to-orange-500',
        }
    if (hour < 17)
        return {
            text: 'Добрый день',
            emoji: '☀️',
            color: 'from-blue-400 to-cyan-500',
        }
    return {
        text: 'Добрый вечер',
        emoji: '🌙',
        color: 'from-purple-400 to-pink-500',
    }
}

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false)
    const [greeting, setGreeting] = useState(getGreeting())

    useEffect(() => {
        setMounted(true)
        setGreeting(getGreeting())
    }, [])

    const quickStats = [
        {
            label: 'Активные анкеты',
            value: '2',
            change: '+1 за неделю',
            trend: 'up',
            icon: TbFileText,
            color: 'from-gray-600 to-gray-700',
            bgColor:
                'from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50',
        },
        {
            label: 'Новые вакансии',
            value: '15',
            change: '+5 сегодня',
            trend: 'up',
            icon: TbBriefcase,
            color: 'from-slate-600 to-slate-700',
            bgColor:
                'from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50',
        },
        {
            label: 'Активные отклики',
            value: '3',
            change: '2 просмотрено',
            trend: 'neutral',
            icon: TbHeart,
            color: 'from-zinc-600 to-zinc-700',
            bgColor:
                'from-zinc-50 to-zinc-100 dark:from-zinc-800/50 dark:to-zinc-700/50',
        },
        {
            label: 'Рейтинг профиля',
            value: '92%',
            change: '+8% за месяц',
            trend: 'up',
            icon: TbStar,
            color: 'from-stone-600 to-stone-700',
            bgColor:
                'from-stone-50 to-stone-100 dark:from-stone-800/50 dark:to-stone-700/50',
        },
    ]

    const services = [
        {
            title: 'Вакансии',
            description: 'Персонализированный поиск с умными рекомендациями',
            href: '/main/vacancies',
            icon: TbBriefcase,
            stats: '15 новых',
            gradient: 'from-gray-600 to-gray-700',
            features: ['ИИ-подбор', 'Автосохранение', 'Уведомления'],
            badge: '5 новых',
        },
        {
            title: 'ИИ Помощник',
            description:
                'Персональный консультант по карьере и трудоустройству',
            href: '/main/ai-chat',
            icon: TbBrain,
            stats: 'Онлайн',
            gradient: 'from-slate-600 to-slate-700',
            features: ['24/7 доступен', 'Умные советы', 'История чатов'],
            badge: 'Новое',
        },
        {
            title: 'Профиль',
            description: 'Настройка аккаунта и персональных предпочтений',
            href: '/main/profile',
            icon: TbUser,
            stats: '92% заполнен',
            gradient: 'from-zinc-600 to-zinc-700',
            features: ['Безопасность', 'Настройки', 'Статистика'],
        },
        {
            title: 'Собеседования',
            description: 'Подготовка и проведение виртуальных собеседований',
            href: '/main/interviews',
            icon: TbVideo,
            stats: '2 запланировано',
            gradient: 'from-stone-600 to-stone-700',
            features: ['ИИ-тренер', 'Запись сессий', 'Обратная связь'],
        },
    ]

    const recentActivity = [
        {
            type: 'application',
            title: 'Отклик на вакансию "Frontend Developer"',
            time: '2 часа назад',
            icon: TbBriefcase,
            color: 'text-gray-600',
        },
        {
            type: 'ai_chat',
            title: 'Консультация с ИИ по резюме',
            time: '5 часов назад',
            icon: TbBrain,
            color: 'text-gray-600',
        },
        {
            type: 'profile',
            title: 'Обновление профиля',
            time: '1 день назад',
            icon: TbUser,
            color: 'text-gray-600',
        },
    ]

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-gray-900/95 dark:to-indigo-950/50 relative overflow-hidden">
            <FloatingParticles />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-indigo-600/10 backdrop-blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-6 py-12 lg:px-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-xl mb-6"
                        >
                            <span className="text-2xl">{greeting.emoji}</span>
                            <span
                                className={`font-semibold bg-gradient-to-r ${greeting.color} bg-clip-text text-transparent`}
                            >
                                {greeting.text}!
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4"
                        >
                            Добро пожаловать в{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AI-Komekshi
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            Ваш персональный ИИ-помощник готов помочь найти
                            идеальную работу
                        </motion.p>
                    </div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    >
                        {quickStats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.6 + index * 0.1,
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    className="group"
                                >
                                    <div
                                        className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                            >
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            {stat.trend === 'up' && (
                                                <TbTrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            )}
                                        </div>

                                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {stat.label}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {stat.change}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Services */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-5 pt-20">
                        Выберите нужный сервис
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Комплексные инструменты для успешного поиска работы
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {services.map((service, index) => {
                        const Icon = service.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 1.0 + index * 0.1,
                                }}
                                whileHover={{ y: -8 }}
                                className="group h-full"
                            >
                                <Link
                                    href={service.href}
                                    className="block h-full"
                                >
                                    <div className="relative h-full p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                        {/* Gradient overlay */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                        />

                                        {/* Badge */}
                                        {service.badge && (
                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gray-600 text-white text-xs font-bold">
                                                {service.badge}
                                            </div>
                                        )}

                                        <div className="relative z-10">
                                            {/* Icon and title */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div
                                                    className={`p-4 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                                                >
                                                    <Icon className="w-8 h-8 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all duration-300">
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        {service.stats}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                                                {service.description}
                                            </p>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {service.features?.map(
                                                    (feature, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full group-hover:bg-gray-200 dark:group-hover:bg-gray-600 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-all duration-300"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ),
                                                )}
                                            </div>

                                            {/* Action button */}
                                            <Button
                                                size="sm"
                                                className="w-full group-hover:bg-gray-700 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                Открыть
                                                <TbChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="mt-16"
                >
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            Последняя активность
                        </h3>

                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => {
                                const Icon = activity.icon
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 1.6 + index * 0.1,
                                        }}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                                    >
                                        <div
                                            className={`p-2 rounded-xl ${activity.color} bg-opacity-10`}
                                        >
                                            <Icon
                                                className={`w-5 h-5 ${activity.color}`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {activity.title}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {activity.time}
                                            </p>
                                        </div>
                                        <TbEye className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-300" />
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
