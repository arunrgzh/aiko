
import ApiService from './ApiService'

export type Config = {
    user: number
    company_name: string
    assistant_name: string

    instructions: Array<{ order: number; text: string }>

    style: string
    fallback_responses: string[]
    purpose: string[]

    instagram_url: string
    website_url: string
}

export async function apiPostConfig<T>(data: Omit<Config, 'user'> & { user: number }) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/bot-config`,
        method: 'post',
        data,
    })
}


export interface UploadDocPayload {
    files: File[]
}

export type UploadDocsResponse = {
    id: number,
    file: string,
    uploaded: string
}[]

export async function apiUploadDocs(id: number, payload: UploadDocPayload) {
    const form = new FormData()

    payload.files.forEach(file =>
        form.append('files', file)
    )
    console.log('api service' ,form.values())

    return ApiService.fetchFormDataWithAxios<UploadDocsResponse>({
        url: `/bot-config/${id}/upload-docs/`,
        method: 'post',
        data: form,
    })
}


export async function apiGetConfig<T>(id: number){
    return ApiService.fetchDataWithAxios<T>({
        url: `/bot-config/${id}`,
        method: 'get',
    })
}

