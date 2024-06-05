import { ResetOptions } from '@/@types/common'
import { PayrollDataSchema } from '@/@types/payroll'
import { apiGetOTHours, apiResetData } from '@/services/CommonService'

type Status = 'success' | 'failed'

function useCommon() {
    const getOTHours = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiGetOTHours(values)
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

    const deleteData = async (values: ResetOptions) => {
        try {
            const resp = await apiResetData(values)
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

    const getUserIDFromLocalStorage = () => {
        const user = JSON.parse(localStorage.getItem('admin') ?? '')
        const userID = JSON.parse(user.auth).user.userID
        return userID
    }
    return {
        getOTHours,
        deleteData,
        getUserIDFromLocalStorage,
    }
}

export default useCommon
