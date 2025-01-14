import { AxiosHeaders } from 'axios'
import ApiService from './ApiService'
import { SystemVariableData } from '@/@types/System'

type Response = {
    data: string
}

export async function apiGetSystemSettings() {
    return ApiService.fetchData<Response>({
        url: '/Admin/get-system-variables',
        method: 'get',
    })
}

export async function apiAddSystemVariable(data: SystemVariableData) {
    return ApiService.fetchData<Response>({
        url: '/admin/create-system-variable',
        method: 'post',
        data,
    })
}

export async function apiUpdateSystemVariable(data: SystemVariableData) {
    return ApiService.fetchData<Response>({
        url: '/admin/update-system-variable',
        method: 'put',
        data,
    })
}

export async function apiGetScheduleJobsData<T>() {
    return ApiService.fetchData<T>({
        url: '/JobSchedule/get-allScheduledJobs',
        method: 'get',
    })
}

export async function apiPauseScheduleJobData<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/JobSchedule/pause-job',
        method: 'post',
        data,
    })
}

export async function apiRunScheduleJobData<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/JobSchedule/run-job',
        method: 'post',
        data,
    })
}

export async function apiUpdateScheduleJobData(data: SystemVariableData) {
    return ApiService.fetchData<Response>({
        url: '/JobSchedule/update-scheduledJob',
        method: 'put',
        data,
    })
}
