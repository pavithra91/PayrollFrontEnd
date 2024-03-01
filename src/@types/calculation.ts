export type CalculationData = {
    companyCode: number
    sequence: number
    payCode: string
    calCode: string
    calFormula: string
    calDescription: string
    payCategory: string
    contributor: string
    status: boolean
    createdBy: string
}

export interface CalculationSchema {
    companyCode: number
    sequence: number
    payCode: string
    calCode: string
    calFormula: string
    calDescription: string
    payCategory: string
    contributor: string
    status: boolean
    createdBy: string
}

export interface CompanyIdSelectOption {
    label: string
    value: number
}

export interface ContributorSelectOption {
    label: string
    value: string
}
