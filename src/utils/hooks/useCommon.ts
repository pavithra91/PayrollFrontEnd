import { ResetOptions } from '@/@types/common'
import { PayrollDataSchema } from '@/@types/payroll'
import {
    apiGetOTHours,
    apiResetData,
    apiGetUnrecoveredList,
    apiGetLumpsumTaxList,
    apiGetPaycodeWiseDataList,
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
            const userID = JSON.parse(user.auth).user.userID
            return userID
        }
    }

    const getUserFromLocalStorage = () => {
        if (localStorage.getItem('admin') == null) {
            return null
        } else {
            const user = JSON.parse(localStorage.getItem('admin') ?? '')
            const userObj = JSON.parse(user.auth).user
            return userObj
        }
    }

    const getPreviousMonthAndYear = () => {
        const now = new Date()

        now.setDate(1)
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

    const formatDate = (dateString: string) => {
        // Validate the input format (optional)
        if (!/^\d{4}\d{2}$/.test(dateString)) {
            console.error('Invalid date format. Expected YYYYMM.')
            return null // Or handle the error gracefully
        }

        const year = parseInt(dateString.substring(0, 4))
        const month = parseInt(dateString.substring(4)) - 1 // Adjust month for zero-based indexing
        const monthNames = [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC',
        ]

        const formattedDate = monthNames[month] + ' ' + year
        return formattedDate
    }

    const formatDateFullMonth = (dateString: string) => {
        // Validate the input format (optional)
        if (!/^\d{4}\d{2}$/.test(dateString)) {
            console.error('Invalid date format. Expected YYYYMM.')
            return null // Or handle the error gracefully
        }

        const year = parseInt(dateString.substring(0, 4))
        const month = parseInt(dateString.substring(4)) - 1 // Adjust month for zero-based indexing
        const monthNames = [
            'January',
            'Febuary',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]

        const formattedDate = monthNames[month] + ' ' + year
        return formattedDate
    }

    const getPaycodeWiseDataList = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiGetPaycodeWiseDataList(values)
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
        getOTHours,
        getUnrecoveredList,
        getLumpsumTaxList,
        deleteData,
        getUserIDFromLocalStorage,
        getUserFromLocalStorage,
        getPreviousMonthAndYear,
        formatDate,
        formatDateFullMonth,
        getPaycodeWiseDataList,
    }
}

export default useCommon
