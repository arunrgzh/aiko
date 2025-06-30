'use client'

import { useCallback } from 'react'
import { useGenerativeChatStore } from '../_store/generativeChatStore'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
import { apiSendMessageToAssistant } from '@/services/AssistantsService'
import { useParams } from 'next/navigation'
import { toast } from '@/components/ui/toast'
import { Notification } from '@/components/ui/Notification'
import { useParticipant } from '../_store/participant'

type ErrorHandler = (error: unknown) => void

const useChatSend = () => {
    const {
        selectedConversation,
        setSelectedConversation,
        pushChatHistory,
        pushConversation,
        setIsTyping,
    } = useGenerativeChatStore()
    const [participant, setParticipant] = useParticipant()
    const params = useParams<{ id: string }>()

    const initParticipant = useCallback(() => {
        const partId = `user_${params.id}_${crypto.randomUUID()}`
        if (!participant) {
            setParticipant(partId)
            return partId
        }
        return participant
    }, [participant, params.id, setParticipant])

    const createMyMessage = useCallback(
        (id: string, content: string) => {
            pushConversation(id, {
                id: uniqueId('me-'),
                sender: { id: 'me', name: 'You' },
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

    const sendMessage = useCallback(
        async (id: string, prompt: string) => {
            setIsTyping(true)
            try {
                const part = initParticipant()
                const resp = await apiSendMessageToAssistant(params.id, {
                    participant: part,
                    message: prompt,
                })

                if ('error' in resp) {
                    throw new Error(resp.error || 'Server error')
                }

                const reply = resp.replies[0]
                pushConversation(id, {
                    id: uniqueId('ai-'),
                    sender: {
                        id: 'ai',
                        name: 'Chat AI',
                        avatarImageUrl: '/img/thumbs/ai.jpg',
                    },
                    content: reply,
                    timestamp: dayjs().toDate(),
                    type: 'regular',
                    isMyMessage: false,
                    fresh: true,
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
            params.id,
            pushConversation,
            handleError,
        ],
    )

    const handleSend = useCallback(
        async (prompt: string) => {
            setIsTyping(true)
            try {
                if (selectedConversation) {
                    createMyMessage(selectedConversation, prompt)
                    await sendMessage(selectedConversation, prompt)
                } else {
                    const newId = uniqueId('chat-')
                    pushChatHistory({
                        id: newId,
                        title: prompt,
                        lastConversation: '',
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
            } finally {
                setIsTyping(false)
            }
        },
        [
            selectedConversation,
            pushChatHistory,
            setSelectedConversation,
            createMyMessage,
            sendMessage,
            handleError,
            setIsTyping,
        ],
    )

    return { handleSend }
}

export default useChatSend
