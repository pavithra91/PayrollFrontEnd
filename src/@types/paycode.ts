export type PayCodeData = {
    id: number
    companyCode: number
    payCode: string
    calCode: string
    description: string
    payCategory: string
    rate: number
    createdBy: string
    taxationType: string
    lastUpdateBy?: string
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
    taxationType: string
    lastUpdateBy?: string
}
