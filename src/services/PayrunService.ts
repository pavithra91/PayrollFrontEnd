import ApiService from './ApiService'
import type { CalculationData, TaxCalculationData } from '@/@types/Calculation'
import type { PayrollDataSchema } from '@/@types/payroll'

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
