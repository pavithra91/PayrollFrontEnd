import {
    apiGetCalculations,
    apiAddCalculations,
    apiUpdateCalculations,
    apiDeleteCalculations,
    apiGetTaxCalculations,
    apiAddTaxCalculations,
    apiUpdateTaxCalculations,
} from '@/services/CalculationService'

import type { CalculationData, TaxCalculationData } from '@/@types/calculation'

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

    const updateCalculations = async (values: CalculationData) => {
        try {
            const resp = await apiUpdateCalculations(values)
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

    const deleteCalculations = async (values: CalculationData) => {
        try {
            const resp = await apiDeleteCalculations(values)
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

    const addTaxCalculations = async (values: TaxCalculationData) => {
        try {
            const resp = await apiAddTaxCalculations(values)
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

    const updateTaxCalculations = async (values: TaxCalculationData) => {
        try {
            const resp = await apiUpdateTaxCalculations(values)
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
        updateCalculations,
        deleteCalculations,
        getTaxCalculations,
        addTaxCalculations,
        updateTaxCalculations,
    }
}

export default useCalculations
