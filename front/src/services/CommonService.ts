import ApiService from './ApiService'

export async function apiGetSearchResult() {
    return ApiService.fetchDataWithAxios<{
        query: string
        category: string
        title: string
        content: string
        url: string
    }>({
        url: '/search',
        method: 'get',
    })
}
