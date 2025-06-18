import ApiService from './ApiService'

type TAssistant = {
    id: number,
    config_id: number,
    company_name: string,
    assistant_name: string,
    style: string,
    purpose: string[]
}
type TAssistants = TAssistant[]
const PREFIX = '/assistants'

type MessagePayload = {
    participant: string,
    message: string,
    reset?: boolean,

}

type SendMessageSuccessResponse = {
    replies: string[]
}
type SendMessageFailureResponse = {
    error: string
}
type MessageResponse = SendMessageSuccessResponse | SendMessageFailureResponse

export async function apiGetAssistants() {
    return ApiService.fetchDataWithAxios<TAssistants>({
        url: `${PREFIX}`,
        method: 'get',
    })
}

export async function apiGetAssistantById(id: number | string) {
    return ApiService.fetchDataWithAxios<TAssistant>({
        url: `${PREFIX}/${id}`,
        method: 'get',
    })
}


export async function apiSendMessageToAssistant(id: number | string, payload: MessagePayload) {
    return ApiService.fetchDataWithAxios<MessageResponse>({
        url: `${PREFIX}/${id}/chat/`,
        method: 'post',
        data: payload,
    })
}

