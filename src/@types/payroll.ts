export interface PayrollDataSchema {
    companyCode: number
    period: number
}

export interface ConfirmDataTransferSchema {
    companyCode: number
    period: number
    approvedBy: string
}

export type ConfirmDataTransfer = {
    companyCode: number
    period: number
    approvedBy: string
}
