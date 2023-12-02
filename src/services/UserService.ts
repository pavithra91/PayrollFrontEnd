import ApiService from './ApiService'

export type UserCredential = {
    UserId: string
    password: string
}

export type UserResponse = {
    message: StringConstructor
}

export async function apigetToken(data: UserCredential) {
    data.UserId = '3021ITFI'
    data.password = 'pass#word1'
    console.log(data)
    return ApiService.fetchData<UserResponse>({
        url: '/User/Authenticate',
        method: 'post',
        data,
    })
}
