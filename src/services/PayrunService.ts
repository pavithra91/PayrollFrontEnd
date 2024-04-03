import ApiService from './ApiService'
import type {
    ConfirmDataTransfer,
    PayrollDataSchema,
    PaysheetDataSchema,
} from '@/@types/payroll'

type Response = {
    data: string
}

export async function apiGetDataTransferStatistics(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/DataTransfer/GetDataTransferStatistics?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiConfirmDataTransfer(data: ConfirmDataTransfer) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/DataTransfer/ConfirmDataTransfer',
        method: 'post',
        data,
    })
}

export async function apiRollBackDataTransfer(data: ConfirmDataTransfer) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/DataTransfer/temp-data-rollback',
        method: 'post',
        data,
    })
}

export async function apiProcessPayroll(data: ConfirmDataTransfer) {
    return ApiService.fetchData<Response>({
        url: '/Payroll/ProcessPayroll',
        method: 'post',
        timeout: 240000,
        data,
    })
}

export async function apiGetPayrunByPeriod(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/Payroll/get-payrun-by-period?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiCreateUnRecovered(data: ConfirmDataTransfer) {
    return ApiService.fetchData<Response>({
        url: '/Payroll/create-unrecovered',
        method: 'post',
        timeout: 240000,
        data,
    })
}

export async function apiGetPayrollSummary(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/Payroll/get-payroll-summary?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiGetPaysheetByEPF(values: PaysheetDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/Payroll/get-paysheet?epf=' +
            values.epf +
            '&period=' +
            values.period,
        method: 'get',
    })
}

export async function apiPrintPaysheets(values: PayrollDataSchema) {
    return ApiService.fetchData<Response>({
        url:
            '/Payroll/print-paysheet?companyCode=' +
            values.companyCode +
            '&period=' +
            values.period,
        method: 'get',
        timeout: 320000,
    })
}
