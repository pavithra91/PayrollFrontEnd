import ApiService from './ApiService'
import { PayrollDataSchema } from '@/@types/payroll'
import { ResetOptions, Token_Data } from '@/@types/common'

type Response = {
    data: string
}

export async function apiGetOTHours(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/Admin/get-ot-details?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiGetUnrecoveredList(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/Admin/get-unrecovered-details?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiGetLumpsumTaxList(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/Admin/get-lumpsumtax-details?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiResetData(data: ResetOptions) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Admin/reset-data',
        method: 'post',
        data,
    })
}

export async function apiGetRefreshToken(data: Token_Data) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/User/refresh',
        method: 'post',
        data,
    })
}

export async function apiGetPaycodeWiseDataList(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/Admin/get-paycodewise-details?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiGetNotifications<T>(params: number) {
    return ApiService.fetchData<T>({
        url: '/Leave/get-notifications/' + params,
        method: 'get',
    })
}
