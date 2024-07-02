import { ResetOptions } from '@/@types/common'
import { PayrollDataSchema } from '@/@types/payroll'
import {
    apiGetOTHours,
    apiResetData,
    apiGetUnrecoveredList,
    apiGetLumpsumTaxList,
} from '@/services/CommonService'

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

    const getUnrecoveredList = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiGetUnrecoveredList(values)
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

    const getLumpsumTaxList = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiGetLumpsumTaxList(values)
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
        if (localStorage.getItem('admin') == null) {
            return null
        } else {
            const user = JSON.parse(localStorage.getItem('admin') ?? '')
            console.log(user)
            const userID = JSON.parse(user.auth).user.userID
            return userID
        }
    }

    const getPreviousMonthAndYear = () => {
        const now = new Date()

        now.setDate(1)
        console.log(now)
        const prevMonth = now.getMonth() - 1

        const prevYear =
            prevMonth < 0 ? now.getFullYear() - 1 : now.getFullYear()

        // Optional: Format the month and year
        const formattedMonth = (prevMonth + 1).toString().padStart(2, '0')
        const formattedYear = prevYear.toString()
        const previousPeriod = formattedYear + formattedMonth

        return {
            previousPeriod,
        }
    }
    return {
        getOTHours,
        getUnrecoveredList,
        getLumpsumTaxList,
        deleteData,
        getUserIDFromLocalStorage,
        getPreviousMonthAndYear,
    }
}

export default useCommon
