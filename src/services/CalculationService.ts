import ApiService from './ApiService'
import type { CalculationData } from '@/@types/Calculation'

type Response = {
    data: string
}

export async function apiGetCalculations() {
    return ApiService.fetchData<Response>({
        url: '/admin/get-calculations',
        method: 'get',
    })
}

export async function apiAddCalculations(data: CalculationData) {
    return ApiService.fetchData<Response>({
        url: '/admin/create-calculation',
        method: 'post',
        data,
    })
}
