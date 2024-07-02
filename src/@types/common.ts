import { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    sort?: {
        order: 'asc' | 'desc' | ''
        key: string | number
    }
}

export interface SelectOption {
    label: string
    value: number
}

export interface TaxOption {
    label: string
    value: string
}

export interface RoleSelectOption {
    label: string
    value: string
}

export type ResetOptions = {
    companyCode: number
    period: number
    resetData?: boolean
    resetTempData?: boolean
}

export type Token_Data = {
    jwtToken: string
    refreshToken: string
}
