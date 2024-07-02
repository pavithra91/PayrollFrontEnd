export type SystemVariableData = {
    id: number
    companyCode: number
    category_name: string
    variable_name: string
    variable_value: string
    createdBy?: string
    lastUpdateBy?: string
}

export interface SystemVariableSchema {
    id: number
    companyCode: number
    category_name: string
    variable_name: string
    variable_value: string
    createdBy?: string
    lastUpdateBy?: string
}
