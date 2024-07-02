import {
    apiGetDataTransferStatistics,
    apiConfirmDataTransfer,
    apiRollBackDataTransfer,
    apiSimulatePayroll,
    apiProcessPayroll,
    apiGetPayrunByPeriod,
    apiCreateUnRecovered,
    apiGetPayrollSummary,
    apiGetPaysheetByEPF,
    apiPrintPaysheets,
    apiGetPayrunDetails,
    apiPayCodeCheck,
} from '@/services/PayrunService'
import type {
    PayrollDataSchema,
    ConfirmDataTransfer,
    PaysheetDataSchema,
} from '@/@types/payroll'

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

    const simulatePayroll = async (values: ConfirmDataTransfer) => {
        try {
            const resp = await apiSimulatePayroll(values)
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

    const processPayroll = async (values: ConfirmDataTransfer) => {
        try {
            const resp = await apiProcessPayroll(values)
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

    const getPayrunByPeriod = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiGetPayrunByPeriod(values)
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

    const getPayrunDetails = async () => {
        try {
            const resp = await apiGetPayrunDetails()
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

    const createUnRecovered = async (values: ConfirmDataTransfer) => {
        try {
            const resp = await apiCreateUnRecovered(values)
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

    const getPayrollSummary = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiGetPayrollSummary(values)
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

    const getPaysheetByEPF = async (values: PaysheetDataSchema) => {
        try {
            const resp = await apiGetPaysheetByEPF(values)
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

    const printPaysheets = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiPrintPaysheets(values)
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

    const payCodeCheck = async (values: PayrollDataSchema) => {
        try {
            const resp = await apiPayCodeCheck(values)
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
        simulatePayroll,
        processPayroll,
        getPayrunByPeriod,
        createUnRecovered,
        getPayrollSummary,
        getPaysheetByEPF,
        printPaysheets,
        getPayrunDetails,
        payCodeCheck,
    }
}

export default usePayrun
