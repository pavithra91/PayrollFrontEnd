import ApiService from './ApiService'

export async function apiLeaveRequest<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/project/list/add',
        method: 'put',
        data,
    })
}