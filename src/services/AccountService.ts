import { AccountData } from '@/@types/Account'
import ApiService from './ApiService'

type Response = {
    data: string
}

export async function apiGetUsers() {
    return ApiService.fetchData<Response>({
        url: '/User/GetUsers',
        method: 'get',
    })
}

export async function apiAddUser(data: AccountData) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/User/CreateUser',
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
