import ApiService from './ApiService'

type Response = {
    data: string
}

export async function apiGetUsers() {
    return ApiService.fetchData<Response>({
        url: '/User/GetUsers',
        method: 'get',
    })
}
