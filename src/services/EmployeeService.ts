import ApiService from './ApiService'


export async function apiGetEmployeeData<T>() {
    return ApiService.fetchData<T>({
        url: '/Employee/get-all-employees',
        method: 'get',
    })
}