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
