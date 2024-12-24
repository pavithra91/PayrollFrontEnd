import ApiService from './ApiService'

export async function apiGetVoucherData<T>(data: string) {
    return ApiService.fetchData<T>({
        url: '/Payment/get-voucher/' + data,
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
