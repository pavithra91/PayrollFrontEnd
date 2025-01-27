import ApiService from './ApiService'

export async function apiGetBungalowData<T>() {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-all-bungalows',
        method: 'get',
    })
}

export async function apiGetBungalowDataById<T>(id: number) {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-bungalow/' + id,
        method: 'get',
    })
}

export async function apiGetCategoryData<T>() {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-all-categories',
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

export async function apiUpdateBungalowRates<
    T,
    U extends Record<string, unknown>
>(data: U) {
    console.log(data)
    return ApiService.fetchData<T>({
        url: '/Reservation/update-bungalow-rates/' + data.bungalowId,
        method: 'put',
        data,
    })
}

export async function apiGetReservationData<T>(epf: string) {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-my-reservations/' + epf,
        method: 'get',
    })
}

export async function apiGetReservationById<T>(id: number) {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-reservation/' + id,
        method: 'get',
    })
}

export async function apiGetRestrictedDates<T>() {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-disabledates',
        method: 'get',
    })
}

export async function apiGetRestrictedDatesById<T>(id: number) {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-disabledatesbyId/' + id,
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

export async function apiConfirmReservation<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/Reservation/confirm-reservation',
        method: 'post',
        data,
    })
}

export async function apiCancelReservation<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/Reservation/cancel-reservation',
        method: 'post',
        data,
    })
}

export async function apiGetRaffleDrawData<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-raffle-draw-details',
        method: 'post',
        data,
    })
}

export async function apiGetPaymentData<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Reservation/get-all-payments',
        method: 'post',
        data,
    })
}

// export async function apiGetRaffleDrawData<T, U extends Record<string, unknown>>(
//     data: U
// ) {
//     return ApiService.fetchData<T>({
//         url: '/Reservation/get-raffle-draw-details',
//         method: 'post',
//         data,
//     })
// }

// export async function apiGetRaffleDrawData<T>(raffleDate: string) {
//     return ApiService.fetchData<T>({
//         url: '/Reservation/get-raffle-draw-details/' + raffleDate,
//         method: 'get',
//     })
// }
