import { apiGetDataTransferStatistics } from '@/services/PayrunService'
import type { PayrollDataSchema } from '@/@types/payroll'

import type { CalculationData, TaxCalculationData } from '@/@types/calculation'

type Status = 'success' | 'failed'

function usePayrun() {
    const getDataTransferStatistics = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiGetDataTransferStatistics(values)
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
        getDataTransferStatistics,
    }
}

export default usePayrun
