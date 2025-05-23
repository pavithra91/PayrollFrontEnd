import { AccountData, PasswordReset } from '@/@types/Account'
import ApiService from './ApiService'

type Response = {
    data: string
}

export async function apiGetUsers() {
    return ApiService.fetchData<Response>({
        url: '/User/get-users',
        method: 'get',
    })
}

export async function apiGetUserList<T>() {
    return ApiService.fetchData<T>({
        url: '/User/get-users',
        method: 'get',
    })
}

export async function apiAddUser(data: AccountData) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/User/create-user',
        method: 'post',
        data,
    })
}

export async function apiUpdateUser(data: AccountData) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/User/update-user',
        method: 'put',
        data,
    })
}

export async function apiResetUserPassword(data: PasswordReset) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/User/reset-password',
        method: 'post',
        data,
    })
}

export async function apiGetUsersbyEpf(data: string) {
    return ApiService.fetchData<Response>({
        url: '/Employee/get-employee-grade/' + data,
        method: 'get',
    })
}
