import ApiService from './ApiService'

export async function apiGetVoucherData<T>(data: string) {
    const encodedId = encodeURIComponent(data)
    return ApiService.fetchData<T>({
        url: '/Payment/get-voucher/' + encodedId,
        method: 'get',
    })
}

export async function apiProcessVoucherData<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/Payment/process-voucher',
        method: 'post',
        data,
    })
}

export async function apiResetVoucherData<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Payment/reset-voucher',
        method: 'post',
        data,
    })
}
