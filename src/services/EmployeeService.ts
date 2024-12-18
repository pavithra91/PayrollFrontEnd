import { AdvancePayment } from '@/@types/Leave'
import ApiService from './ApiService'

export async function apiGetEmployeeData<T>() {
    return ApiService.fetchData<T>({
        url: '/Employee/get-employees',
        method: 'get',
    })
}

export async function apiAddSupervisor<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Employee/create-supervisor',
        method: 'post',
        data,
    })
}

export async function apiEditSupervisor<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/Employee/update-supervisor/' + data.id,
        method: 'put',
        data,
    })
}

export async function apiAddAdvancePayment(data: AdvancePayment) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Employee/request-advancePayment',
        method: 'post',
        data,
    })
}

export async function apiGetMyAdvancePayments<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/Employee/get-my-advancePayments/' + data,
        method: 'get',
    })
}

export async function apiDeleteAdvancePayments<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/Employee/delete-advancePayment/' + data,
        method: 'put',
    })
}

export async function apiGetAdvancePayments<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/Employee/get-all-advancePayments/' + data,
        method: 'get',
    })
}
