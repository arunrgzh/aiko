'use client'

import useChatSend from '../_hooks/useChatSend'
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

const promptSuggestion: {
    title: string
    prompt: string
    type: PromptType
}[] = [
    {
        title: 'Помогите мне подготовить резюме с учетом моих особенностей',
        prompt: `Я хочу составить эффективное резюме, которое подчеркнет мои сильные стороны и навыки. Учтите, что у меня есть инвалидность, и я хочу правильно представить свой опыт работодателям.`,
        type: 'writing',
    },
    {
        title: 'Найдите подходящие вакансии для людей с инвалидностью',
        prompt: `Помогите мне найти работодателей и вакансии, которые открыты для найма людей с инвалидностью. Расскажите о программах трудоустройства и квотах.`,
        type: 'guide',
    },
    {
        title: 'Подготовьте меня к собеседованию',
        prompt: `Дайте советы по подготовке к собеседованию. Как рассказать о своих способностях, как обсудить необходимые адаптации рабочего места, и как произвести положительное впечатление.`,
        type: 'idea',
    },
    {
        title: 'Какие профессии подходят для моих навыков?',
        prompt: `Помогите определить карьерные возможности и профессии, которые подходят для людей с различными типами инвалидности. Расскажите о дистанционной работе и гибких вариантах трудоустройства.`,
        type: 'coding',
    },
]

const ChatLandingView = () => {
    const { handleSend } = useChatSend()

    return (
        <div className="max-w-[900px] w-full mx-auto mt-20 mb-16 px-4">
            <div>
                <div className="heading-text text-4xl leading-snug mb-12">
                    <span className="font-semibold bg-linear-to-r from-indigo-500 to-red-400 bg-clip-text text-transparent text-5xl">
                        Привет!
                    </span>
                    <br />
                    <span>Как я могу помочь вам найти работу сегодня?</span>
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
