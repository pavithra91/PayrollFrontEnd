import ApiService from './ApiService'
import type { ConfirmDataTransfer, PayrollDataSchema } from '@/@types/payroll'

type Response = {
    data: string
}

export async function apiGetDataTransferStatistics(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/DataTransfer/GetDataTransferStatistics?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiConfirmDataTransfer(data: ConfirmDataTransfer) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/DataTransfer/ConfirmDataTransfer',
        method: 'post',
        data,
    })
}

export async function apiRollBackDataTransfer(data: ConfirmDataTransfer) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/DataTransfer/temp-data-rollback',
        method: 'post',
        data,
    })
}
