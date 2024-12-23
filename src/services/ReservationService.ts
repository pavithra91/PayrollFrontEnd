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

export async function apiEditBungalow<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Reservation/update-bungalow/' + data.id,
        method: 'put',
        data,
    })
}

export async function apiGetReservationData<T>() {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-all-reservations',
        method: 'get',
    })
}

export async function apiAddReservation<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Reservation/create-reservation',
        method: 'post',
        data,
    })
}

export async function apiEditReservation<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Reservation/update-reservation/' + data.id,
        method: 'put',
        data,
    })
}
