'use client'

import useChatSend from '../_hooks/useChatSend'
import { useTranslations } from 'next-intl'
import {
    PiLightbulbDuotone,
    PiBookOpenTextDuotone,
    PiCompassDuotone,
    PiCodeDuotone,
} from 'react-icons/pi'
import type { ReactNode } from 'react'

type PromptType = 'idea' | 'guide' | 'writing' | 'coding'

const suggeustionIcon: Record<PromptType, ReactNode> = {
    idea: <PiLightbulbDuotone className="text-blue-500" />,
    guide: <PiCompassDuotone className="text-emerald-500" />,
    writing: <PiBookOpenTextDuotone className="text-amber-500" />,
    coding: <PiCodeDuotone className="text-indigo-500" />,
}

const ChatLandingView = () => {
    const { handleSend } = useChatSend()
    const t = useTranslations('aiChat')

    const promptSuggestion: {
        title: string
        prompt: string
        type: PromptType
    }[] = [
        {
            title: t('suggestions.resume.title'),
            prompt: t('suggestions.resume.prompt'),
            type: 'writing',
        },
        {
            title: t('suggestions.vacancies.title'),
            prompt: t('suggestions.vacancies.prompt'),
            type: 'guide',
        },
        {
            title: t('suggestions.interview.title'),
            prompt: t('suggestions.interview.prompt'),
            type: 'idea',
        },
        {
            title: t('suggestions.careers.title'),
            prompt: t('suggestions.careers.prompt'),
            type: 'coding',
        },
    ]

    return (
        <div className="max-w-[900px] w-full mx-auto mt-20 mb-16 px-4">
            <div>
                <div className="heading-text text-4xl leading-snug mb-12">
                    <span className="font-semibold bg-linear-to-r from-indigo-500 to-red-400 bg-clip-text text-transparent text-5xl">
                        {t('greeting')}
                    </span>
                    <br />
                    <span>{t('subtitle')}</span>
                </div>
                <div className="mt-8 mb-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {promptSuggestion.map((suggestion) => (
                        <div
                            key={suggestion.title}
                            className="flex flex-col gap-4 justify-between rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-6 min-h-44 2xl:min-h-64 cursor-pointer transition-all duration-200 hover:shadow-lg"
                            role="button"
                            onClick={() => handleSend(suggestion.prompt)}
                        >
                            <h6 className="font-normal text-sm leading-relaxed">
                                {suggestion.title}
                            </h6>
                            <div>
                                <div className="bg-white dark:bg-gray-800 rounded-full p-2 inline-flex">
                                    <span className="text-2xl">
                                        {suggeustionIcon[suggestion.type]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChatLandingView
