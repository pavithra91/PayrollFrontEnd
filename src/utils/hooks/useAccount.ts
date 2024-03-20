import { apiGetUsers } from '@/services/AccountService'

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
    return {
        getUsers,
    }
}

export default useAccount
