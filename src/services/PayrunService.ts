import ApiService from './ApiService'
import type { CalculationData, TaxCalculationData } from '@/@types/Calculation'

type Response = {
    data: string
}

export async function apiGetDataTransferStatistics() {
    return ApiService.fetchData<Response>({
        url: '/DataTransfer/GetDataTransferStatistics',
        method: 'get',
    })
}
