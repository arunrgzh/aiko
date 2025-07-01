import ApiService from './ApiService'
import {
    PostAiChatResponse,
    Conversation,
} from '@/app/(protected-pages)/assistants/[id]/main/testing/types'
import { ChatHistory } from '@/app/(protected-pages)/assistants/[id]/main/testing/types'

type TAssistant = {
    id: number
    config_id: number
    company_name: string
    assistant_name: string
    style: string
    purpose: string[]
}
type TAssistants = TAssistant[]
const PREFIX = '/assistants'

type MessagePayload = {
    participant: string
    message: string
    reset?: boolean
}

type SendMessageSuccessResponse = {
    replies: string[]
}
type SendMessageFailureResponse = {
    error: string
}
type MessageResponse = SendMessageSuccessResponse | SendMessageFailureResponse

type GetAssistantsRequest = {
    pageIndex?: number
    pageSize?: number
    sortKey?: string
    order?: 'asc' | 'desc' | ''
    query?: string
}

type GetAssistantsResponse = {
    data: {
        id: string
        name: string
        description: string
        model: string
        lastEdited: number
    }[]
    total: number
}

type SendMessageRequest = {
    participant: string
    message: string
}

type SendMessageResponse = {
    replies: string[]
}

export async function apiGetAssistants(
    data: GetAssistantsRequest,
): Promise<GetAssistantsResponse> {
    return ApiService.fetchDataWithAxios({
        url: '/assistants',
        method: 'get',
        data,
    })
}

export async function apiGetAssistant(
    assistantId: string,
): Promise<{ chat_history: ChatHistory[] }> {
    return ApiService.fetchDataWithAxios({
        url: `/assistants/${assistantId}`,
        method: 'get',
    })
}

export async function apiSendMessageToAssistant(
    assistantId: string,
    data: SendMessageRequest,
): Promise<SendMessageResponse | { error: string }> {
    console.log('🚀 AssistantsService: Sending message to assistant', {
        assistantId,
        data,
        url: `/assistants/${assistantId}/chat`,
    })

    try {
        const result = await ApiService.fetchDataWithAxios<
            SendMessageResponse | { error: string }
        >({
            url: `/assistants/${assistantId}/chat`,
            method: 'post',
            data,
        })
        console.log('✅ AssistantsService: Message sent successfully', result)
        return result
    } catch (error) {
        console.error('❌ AssistantsService: Message sending failed', error)
        throw error
    }
}
