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
    companyCode?:number
    period?:number
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

export const leaveStatusColor: Record<
    string,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    Approved: {
        label: 'Approved',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    Pending: {
        label: 'Pending',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    Rejected: {
        label: 'Rejected',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    Cancelled: {
        label: 'Cancelled',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500',
    },
}
