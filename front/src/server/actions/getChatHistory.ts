import { apiGetAssistant } from '@/services/AssistantsService'
import { ChatHistory } from '@/app/(protected-pages)/assistants/[id]/main/testing/types'

export default async function getChatHistory(
    assistantId: string,
): Promise<ChatHistory[]> {
    try {
        const assistant = await apiGetAssistant(assistantId)
        // Предполагается, что история чатов приходит в поле `chat_history`
        // или его нужно будет адаптировать под вашу структуру API
        return assistant.chat_history || []
    } catch (error) {
        console.error('Failed to get chat history:', error)
        return []
    }
}
