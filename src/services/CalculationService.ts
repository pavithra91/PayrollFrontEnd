import ApiService from './ApiService'

type Response = {
    data: string
}

export async function apiGetCalculations() {
    return ApiService.fetchData<Response>({
        url: '/admin/get-calculations',
        method: 'get',
    })
}
