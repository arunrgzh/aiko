'use client'

import { useState } from 'react'
import classNames from '@/utils/classNames'
import {
    TbApps,
    TbFileText,
    TbBriefcase,
    TbMessageCircle,
    TbUser,
    TbHeart,
    TbVideo,
    TbSettings,
} from 'react-icons/tb'

type Tab = {
    id: string
    label: string
    icon?: React.ReactNode
    count?: number
}

type VerticalTabsProps = {
    activeTab: string
    onTabChange: (tabId: string) => void
    className?: string
}

const tabs: Tab[] = [
    { id: 'all', label: 'All', icon: <TbApps className="w-4 h-4" /> },
    {
        id: 'questionnaire',
        label: 'Анкета',
        icon: <TbFileText className="w-4 h-4" />,
    },
    {
        id: 'vacancies',
        label: 'Вакансии',
        icon: <TbBriefcase className="w-4 h-4" />,
    },
    {
        id: 'ai-chat',
        label: 'Чат с ИИ',
        icon: <TbMessageCircle className="w-4 h-4" />,
    },
    { id: 'profile', label: 'Профиль', icon: <TbUser className="w-4 h-4" /> },
    {
        id: 'responses',
        label: 'Мои отклики',
        icon: <TbHeart className="w-4 h-4" />,
    },
    {
        id: 'interviews',
        label: 'Пробные собеседования',
        icon: <TbVideo className="w-4 h-4" />,
    },
    {
        id: 'settings',
        label: 'Настройки профиля',
        icon: <TbSettings className="w-4 h-4" />,
    },
]

const VerticalTabs = ({
    activeTab,
    onTabChange,
    className,
}: VerticalTabsProps) => {
    return (
        <div
            className={classNames(
                'w-full bg-white dark:bg-gray-800',
                className,
            )}
        >
            <div className="flex flex-col space-y-1 p-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={classNames(
                            'flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700',
                            activeTab === tab.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100',
                        )}
                    >
                        {tab.icon && (
                            <span
                                className={classNames(
                                    activeTab === tab.id
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500 dark:text-gray-400',
                                )}
                            >
                                {tab.icon}
                            </span>
                        )}
                        <span className="flex-1">{tab.label}</span>
                        {tab.count !== undefined && (
                            <span
                                className={classNames(
                                    'px-2 py-1 text-xs rounded-full',
                                    activeTab === tab.id
                                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400',
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default VerticalTabs
