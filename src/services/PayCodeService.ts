import ApiService from './ApiService'
import type { PayCodeData } from '@/@types/payCode'

type Response = {
    data: string
}

export async function apiGetPayCodes() {
    return ApiService.fetchData<Response>({
        url: '/admin/get-paycodes',
        method: 'get',
    })
}

export async function apiAddPayCodes(data: PayCodeData) {
    return ApiService.fetchData<Response>({
        url: '/admin/create-paycode',
        method: 'post',
        data,
    })
}

export async function apiUpdatePayCodes(data: PayCodeData) {
    return ApiService.fetchData<Response>({
        url: '/admin/update-paycode',
        method: 'put',
        data,
    })
}
