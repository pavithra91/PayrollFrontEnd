import ApiService from './ApiService'
import type { CalculationData, TaxCalculationData } from '@/@types/Calculation'

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

export async function apiGetTaxCalculations() {
    return ApiService.fetchData<Response>({
        url: '/admin/get-tax-details',
        method: 'get',
    })
}

export async function apiAddTaxCalculations(data: TaxCalculationData) {
    return ApiService.fetchData<Response>({
        url: '/admin/create-tax',
        method: 'post',
        data,
    })
}
