import ApiService from './ApiService'

export async function apiGetBungalowData<T>() {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-all-bungalows',
        method: 'get',
    })
}

export async function apiAddBungalow<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Reservation/create-bungalow',
        method: 'post',
        data,
    })
}
