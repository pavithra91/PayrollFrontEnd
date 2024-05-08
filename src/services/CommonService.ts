import { AccountData } from '@/@types/Account'
import ApiService from './ApiService'
import { PayrollDataSchema } from '@/@types/payroll'
import { ResetOptions } from '@/@types/common'

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

export async function apiResetData(data: ResetOptions) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Admin/reset-data',
        method: 'post',
        data,
    })
}
