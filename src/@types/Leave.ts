export type LeaveTypeDate = {
    leaveTypeId?: number
    leaveTypeName: string
    description: string
    maxDays: number
    carryForwardAllowed: boolean
    createdBy: string
    lastUpdateBy?: string
}

type approverNames = {}

export type AssignSupervisorDate = {
    id: number
    epf: string
    approvalLevel: number
    approverNames: approverNames[]
    updateBy: string
}

export interface LeaveTypeSchema {
    id?: number
    leaveTypeName: string
    description: string
    maxDays: number
    carryForwardAllowed: boolean
    createdBy: string
    lastUpdateBy?: string
}

export type LeaveRequest = {
    epf: string
    leaveType: string
    reason: string
    startDate: string | Date
    endDate?: string | Date | null
    noOfDays: number | 0
    ishalfDay?: boolean | false
    halfDayType?: string
    manager: string
    actDelegate?: string
    requestBy?: string
}

export type AdvancePayment = {
    epf: string
    isFullAmount: boolean
    amount?: number
    createdBy?: string
}

export type ApprovalModel = {
    requestId: number
    isDelegate: boolean
    status: string
    comment?: string
    approver?: string
}
