import {
    apiGetCalculations,
    apiAddCalculations,
    apiGetTaxCalculations,
} from '@/services/CalculationService'

import type { CalculationData } from '@/@types/calculation'

type Status = 'success' | 'failed'

function useCalculations() {
    const getCalculations = async () => {
        try {
            const resp = await apiGetCalculations()
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

    const addCalculations = async (values: CalculationData) => {
        try {
            const resp = await apiAddCalculations(values)
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

    const getTaxCalculations = async () => {
        try {
            const resp = await apiGetTaxCalculations()
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
        getCalculations,
        addCalculations,
        getTaxCalculations,
    }
}

export default useCalculations
