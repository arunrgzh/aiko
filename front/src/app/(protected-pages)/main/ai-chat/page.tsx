'use client'

import { useEffect, useState } from 'react'
import ChatProvider from './_components/ChatProvider'
import ChatView from './_components/ChatView'
import ChatSideNav from './_components/ChatSideNav'
import ChatHistoryRenameDialog from './_components/ChatHistoryRenameDialog'
import getChatHistory from '@/server/actions/getChatHistory'
import type { ChatHistories } from './types'

// Use a default assistant ID for now
// TODO: In the future, this could come from user preferences or be selectable
const DEFAULT_ASSISTANT_ID = '1'

export default function AiChatPage() {
    const [chatHistory, setChatHistory] = useState<ChatHistories>([])
    const [isLoading, setIsLoading] = useState(false) // Start with no loading since we have empty state

    // Load chat history after component mounts (non-blocking)
    useEffect(() => {
        const loadChatHistory = async () => {
            setIsLoading(true)
            try {
                const history = await getChatHistory(DEFAULT_ASSISTANT_ID)
                setChatHistory(history)
            } catch (error) {
                console.error('Failed to fetch chat history:', error)
                // Continue with empty chat history if the fetch fails
                setChatHistory([])
            } finally {
                setIsLoading(false)
            }
        }

        // Only load if we don't have any data yet
        loadChatHistory()
    }, [])

    return (
        <ChatProvider chatHistory={chatHistory}>
            <div className="h-full">
                <div className="flex flex-auto gap-4 h-full">
                    <ChatView />
                    <ChatSideNav />
                    <ChatHistoryRenameDialog />
                </div>
            </div>
        </ChatProvider>
    )
}
