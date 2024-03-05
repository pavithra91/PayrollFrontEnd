export type CalculationData = {
    id: number
    companyCode: number
    sequence: number
    payCode: string
    calCode: string
    calFormula: string
    calDescription: string
    payCategory: string
    contributor: string
    status: boolean
    createdBy?: string
    lastUpdateBy?: string
}

export interface CalculationSchema {
    id: number
    companyCode: number
    sequence: number
    payCode: string
    calCode: string
    calFormula: string
    calDescription: string
    payCategory: string
    contributor: string
    status: boolean
    createdBy?: string
    lastUpdateBy?: string
}

export interface TaxCalculationSchema {
    range: number
    calFormula: string
    description: string
    status: boolean
    createdBy: string
}

export type TaxCalculationData = {
    range: number
    calFormula: string
    description: string
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
