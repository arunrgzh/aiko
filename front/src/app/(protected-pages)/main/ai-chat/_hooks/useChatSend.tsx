'use client'

import { useCallback } from 'react'
import { useGenerativeChatStore } from '../_store/generativeChatStore'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
import { apiSendMessageToAssistant } from '@/services/AssistantsService'
import { toast } from '@/components/ui/toast'
import { Notification } from '@/components/ui/Notification'
import { useParticipant } from '../_store/participant'

type ErrorHandler = (error: unknown) => void

// For now, we'll use a default assistant ID
// TODO: In the future, this could come from user preferences or be selectable
const DEFAULT_ASSISTANT_ID = '1' // Replace with your default assistant ID

const useChatSend = () => {
    const {
        selectedConversation,
        setSelectedConversation,
        pushChatHistory,
        pushConversation,
        setIsTyping,
    } = useGenerativeChatStore()
    const [participant, setParticipant] = useParticipant()

    const initParticipant = useCallback(() => {
        const partId = `user_${DEFAULT_ASSISTANT_ID}_${crypto.randomUUID()}`
        if (!participant) {
            setParticipant(partId)
            return partId
        }
        return participant
    }, [participant, setParticipant])

    const createMyMessage = useCallback(
        (id: string, content: string) => {
            pushConversation(id, {
                id: uniqueId('me-'),
                sender: { id: 'me', name: 'Вы' },
                content,
                timestamp: dayjs().toDate(),
                type: 'regular',
                isMyMessage: true,
            })
        },
        [pushConversation],
    )

    const handleError = useCallback<ErrorHandler>((error) => {
        console.error('ChatSend error:', error)
        toast.push(
            <Notification type="danger" title="Ошибка общения">
                {(error as Error).message ||
                    'Что-то пошло не так. Попробуйте позже.'}
            </Notification>,
            { placement: 'top-end' },
        )
    }, [])

    const createMockResponse = useCallback((prompt: string): string => {
        // Mock responses based on the type of prompt
        if (prompt.includes('резюме')) {
            return `Конечно, я помогу вам составить эффективное резюме! Вот основные рекомендации:

1. **Структура резюме:**
   - Личная информация
   - Профессиональная цель
   - Образование
   - Опыт работы
   - Навыки и компетенции
   - Дополнительная информация

2. **Советы по составлению:**
   - Делайте акцент на ваших достижениях и навыках
   - Используйте четкие формулировки
   - Указывайте конкретные результаты

Хотите, чтобы я помог составить резюме для конкретной вакансии?`
        }

        if (prompt.includes('вакансии') || prompt.includes('работу')) {
            return `Я помогу вам найти подходящие вакансии! Вот где стоит искать работу:

1. **Специализированные сайты для людей с инвалидностью:**
   - Особые люди (osobie-lyudi.ru)
   - Diswork.ru
   - Работа для всех

2. **Квоты для трудоустройства:**
   - Компании с 100+ сотрудниками обязаны иметь 3% квоту
   - Государственные организации - 4% квоту

3. **Поддержка:**
   - Центры занятости
   - НКО по поддержке людей с инвалидностью

Какая сфера деятельности вас интересует?`
        }

        if (prompt.includes('собеседование')) {
            return `Отличный вопрос! Вот советы по подготовке к собеседованию:

1. **Подготовка:**
   - Изучите компанию и вакансию
   - Подготовьте примеры своих достижений
   - Продумайте вопросы работодателю

2. **Обсуждение особенностей:**
   - Будьте честны о своих потребностях
   - Объясните, как ваши навыки помогут компании
   - Обсудите необходимые адаптации рабочего места

3. **Уверенность:**
   - Фокусируйтесь на своих сильных сторонах
   - Покажите энтузиазм и мотивацию

Есть конкретная вакансия, к которой готовитесь?`
        }

        return `Спасибо за ваш вопрос! Я готов помочь вам с поиском работы. 

Как ваш AI-помощник по трудоустройству, я могу:
- Помочь составить резюме
- Найти подходящие вакансии
- Подготовить к собеседованию
- Дать советы по карьерному развитию

Чем конкретно могу помочь? Расскажите подробнее о вашей ситуации.`
    }, [])

    const sendMessage = useCallback(
        async (id: string, prompt: string) => {
            setIsTyping(true)
            try {
                const part = initParticipant()
                let reply = ''

                try {
                    const resp = await apiSendMessageToAssistant(
                        DEFAULT_ASSISTANT_ID,
                        {
                            participant: part,
                            message: prompt,
                        },
                    )

                    if ('error' in resp) {
                        throw new Error(resp.error || 'Server error')
                    }

                    reply = resp.replies[0]
                } catch (apiError) {
                    console.warn(
                        'API unavailable, using mock response:',
                        apiError,
                    )
                    // Use mock response when API is not available
                    reply = createMockResponse(prompt)
                }

                pushConversation(id, {
                    id: uniqueId('ai-'),
                    sender: {
                        id: 'ai',
                        name: 'AI Помощник',
                        avatarImageUrl: '/img/thumbs/ai.jpg',
                    },
                    content: reply,
                    timestamp: dayjs().toDate(),
                    type: 'regular',
                    isMyMessage: false,
                    fresh: false,
                })
            } catch (err) {
                handleError(err)
            } finally {
                setIsTyping(false)
            }
        },
        [
            setIsTyping,
            initParticipant,
            pushConversation,
            handleError,
            createMockResponse,
        ],
    )

    const handleSend = useCallback(
        async (prompt: string) => {
            if (!prompt.trim()) return

            try {
                if (selectedConversation) {
                    createMyMessage(selectedConversation, prompt)
                    await sendMessage(selectedConversation, prompt)
                } else {
                    const newId = uniqueId('chat-')
                    // Create a shorter title from the prompt
                    const title =
                        prompt.length > 50
                            ? prompt.substring(0, 50) + '...'
                            : prompt

                    pushChatHistory({
                        id: newId,
                        title,
                        lastConversation: prompt,
                        createdTime: dayjs().unix(),
                        updatedTime: dayjs().unix(),
                        enable: true,
                    })
                    createMyMessage(newId, prompt)
                    setSelectedConversation(newId)
                    await sendMessage(newId, prompt)
                }
            } catch (err) {
                handleError(err)
            }
        },
        [
            selectedConversation,
            pushChatHistory,
            setSelectedConversation,
            createMyMessage,
            sendMessage,
            handleError,
        ],
    )

    return { handleSend }
}

export default useChatSend
