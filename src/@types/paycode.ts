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
    id: number
    companyCode: number
    payCode: string
    calCode: string
    description: string
    payCategory: string
    rate: number
    createdBy: string
    isTaxableGross: boolean
}

export interface CompanyIdSelectOption {
    label: string
    value: number
}
