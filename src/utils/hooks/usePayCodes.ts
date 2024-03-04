import {
    apiGetPayCodes,
    apiAddPayCodes,
    apiUpdatePayCodes,
} from '@/services/PayCodeService'

import type { PayCodeData } from '@/@types/paycode'

type Status = 'success' | 'failed'

function usePayCodes() {
    const getPayCodes = async () => {
        try {
            const resp = await apiGetPayCodes()
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

    const addPayCodes = async (values: PayCodeData) => {
        try {
            const resp = await apiAddPayCodes(values)
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

    const updatePayCodes = async (values: PayCodeData) => {
        try {
            const resp = await apiUpdatePayCodes(values)
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
        getPayCodes,
        addPayCodes,
        updatePayCodes,
    }
}

export default usePayCodes
