'use client'

import { useRef, useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import ChatBox from '@/components/view/ChatBox'
import ChatLandingView from './ChatLandingView'
import ChatMobileNav from './ChatMobileNav'
import { useGenerativeChatStore } from '../_store/generativeChatStore'
import useChatSend from '../_hooks/useChatSend'
import type { ScrollBarRef } from '@/components/view/ChatBox'

const ChatView = () => {
    const scrollRef = useRef<ScrollBarRef>(null)
    const { selectedConversation, chatHistory, isTyping } =
        useGenerativeChatStore()
    const { handleSend } = useChatSend()

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [selectedConversation, chatHistory])

    const messageList = useMemo(() => {
        const chat = chatHistory.find(
            (chat) => chat.id === selectedConversation,
        )
        return chat?.conversation || []
    }, [selectedConversation, chatHistory])

    const handleInputChange = async ({
        value,
    }: {
        value: string
        attachments?: File[]
    }) => {
        await handleSend(value)
    }

    return (
        <Card className="flex-1 h-full" bodyClass="h-full p-0">
            <ChatMobileNav />
            <ChatBox
                ref={scrollRef}
                messageList={messageList}
                placeholder="Введите ваш вопрос здесь"
                showMessageList={Boolean(selectedConversation)}
                showAvatar={true}
                avatarGap={true}
                containerClass="h-full min-h-[600px]"
                messageListClass="h-[calc(100vh-200px)] min-h-[500px] p-4"
                typing={
                    isTyping
                        ? {
                              id: 'ai',
                              name: 'AI Помощник',
                              avatarImageUrl: '/img/thumbs/ai.jpg',
                          }
                        : false
                }
                onInputChange={handleInputChange}
            >
                {!selectedConversation && <ChatLandingView />}
            </ChatBox>
        </Card>
    )
}

export default ChatView
