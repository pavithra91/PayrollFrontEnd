export type PayCodeData = {
    companyCode: number
    payCode: string
    calCode: string
    description: string
    payCategory: string
    rate: number
    createdBy: string
}

export interface PayCodeSchema {
    companyCode: number
    payCode: string
    calCode: string
    description: string
    payCategory: string
    rate: number
    createdBy: string
}

export interface CompanyIdSelectOption {
    label: string
    value: number
}
