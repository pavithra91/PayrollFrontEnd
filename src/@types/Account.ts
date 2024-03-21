export type AccountData = {
    id?: number
    companyCode: number
    costCenter: string
    epf: number
    empName: string
    role: string
    userID: string
    password: string
    status: boolean
    isAccountLocked?: boolean
    createdBy: string
    lastUpdateBy?: string
}

export interface AccountSchema {
    id?: number
    companyCode: number
    costCenter: string
    epf: number
    empName: string
    role: string
    userID: string
    password: string
    status: boolean
    createdBy: string
    lastUpdateBy?: string
}
