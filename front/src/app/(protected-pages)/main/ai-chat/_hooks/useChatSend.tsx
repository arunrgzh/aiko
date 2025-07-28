'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
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
    const t = useTranslations('aiChat')

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
                sender: { id: 'me', name: t('userName') },
                content,
                timestamp: dayjs().toDate(),
                type: 'regular',
                isMyMessage: true,
            })
        },
        [pushConversation, t],
    )

    const handleError = useCallback<ErrorHandler>(
        (error) => {
            console.error('ChatSend error:', error)
            toast.push(
                <Notification
                    type="danger"
                    title={t('errors.communicationError')}
                >
                    {(error as Error).message || t('errors.generalError')}
                </Notification>,
                { placement: 'top-end' },
            )
        },
        [t],
    )

    const createMockResponse = useCallback(
        (prompt: string, hasImages: boolean = false): string => {
            // Check if message contains file attachments
            if (
                prompt.includes('📎') ||
                prompt.includes('[Изображение:') ||
                prompt.includes('[Файл:') ||
                hasImages
            ) {
                return t('mockResponses.fileAnalysis')
            }

            // Mock responses based on the type of prompt
            if (
                prompt.includes('резюме') ||
                prompt.toLowerCase().includes('resume')
            ) {
                return t('mockResponses.resumeHelp')
            }

            if (
                prompt.includes('вакансии') ||
                prompt.includes('работу') ||
                prompt.toLowerCase().includes('job') ||
                prompt.toLowerCase().includes('vacancy')
            ) {
                return t('mockResponses.jobSearch')
            }

            if (
                prompt.includes('собеседование') ||
                prompt.toLowerCase().includes('interview')
            ) {
                return t('mockResponses.interviewPrep')
            }

            return t('mockResponses.general')
        },
        [t],
    )

    const sendMessage = useCallback(
        async (id: string, prompt: string, images?: string[]) => {
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
                            images: images,
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
                    reply = createMockResponse(
                        prompt,
                        images && images.length > 0,
                    )
                }

                pushConversation(id, {
                    id: uniqueId('ai-'),
                    sender: {
                        id: 'ai',
                        name: t('aiAssistantName'),
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
            t,
        ],
    )

    const handleSend = useCallback(
        async (prompt: string, attachments?: File[], images?: string[]) => {
            // Allow sending if there's any content (including file descriptions)
            if (!prompt || prompt.trim().length === 0) return

            try {
                if (selectedConversation) {
                    createMyMessage(selectedConversation, prompt)
                    await sendMessage(selectedConversation, prompt, images)
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
                    await sendMessage(newId, prompt, images)
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
