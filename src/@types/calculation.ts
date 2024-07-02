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
    companyCode: number
    range: number
    calFormula: string
    description: string
    taxCategory: string
    status: boolean
    createdBy: string
}

export type TaxCalculationData = {
    id?: number
    companyCode: number
    range: number
    calFormula: string
    description: string
    taxCategory: string
    status: boolean
    createdBy: string
    lastUpdateBy?: string
}

export interface ContributorSelectOption {
    label: string
    value: string
}

export type TaxData = {
    id: number
    companyCode: number
    range: number
    calFormula: string
    description: string
    taxCategory: string
    status: boolean
    createdBy: string
    createdDate: string
    lastUpdateBy?: string
}
