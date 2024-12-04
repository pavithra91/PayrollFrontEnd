import { AccountData } from '@/@types/Account'
import {
    apiGetUsers,
    apiAddUser,
    apiUpdateUser,
    apiGetUsersbyEpf,
} from '@/services/AccountService'

type Status = 'success' | 'failed'

function useAccount() {
    const getUsers = async () => {
        try {
            const resp = await apiGetUsers()
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const addUser = async (values: AccountData) => {
        try {
            const resp = await apiAddUser(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const updateUser = async (values: AccountData) => {
        try {
            const resp = await apiUpdateUser(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const getUsersbyEpf = async (values: string) => {
        try {
            const resp = await apiGetUsersbyEpf(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }
    return {
        getUsers,
        addUser,
        updateUser,
        getUsersbyEpf,
    }
}

export default useAccount
