import {
    apiGetDataTransferStatistics,
    apiConfirmDataTransfer,
    apiRollBackDataTransfer,
} from '@/services/PayrunService'
import type { PayrollDataSchema, ConfirmDataTransfer } from '@/@types/payroll'

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

    const confirmDataTransfer = async (values: ConfirmDataTransfer) => {
        try {
            const resp = await apiConfirmDataTransfer(values)
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

    const rollbackDataTransfer = async (values: ConfirmDataTransfer) => {
        try {
            const resp = await apiRollBackDataTransfer(values)
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
        confirmDataTransfer,
        rollbackDataTransfer,
    }
}

export default usePayrun
