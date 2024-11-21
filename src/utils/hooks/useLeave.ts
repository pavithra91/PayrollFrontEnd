import {
    AdvancePayment,
    ApprovalModel,
    AssignSupervisorDate,
    CancelModel,
    LeaveRequest,
    LeaveTypeDate,
} from '@/@types/Leave'
import {
    apiAddLeaveType,
    apiAssignSupervisor,
    apiGetLeaveTypeList,
    apiRequestLeave,
    apiApproveOrRejectLeave,
    apiCancelLeave,
    apiGetLeaveData,
    apiUpdateLeaveType,
    apiGetLeaveDashboardData,
    apiAddAdvancePayment,
} from '@/services/LeaveService'

function useLeave() {
    const addLeaveType = async (values: LeaveTypeDate) => {
        try {
            const resp = await apiAddLeaveType(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const updateLeaveType = async (values: LeaveTypeDate) => {
        try {
            const resp = await apiUpdateLeaveType(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }
    const getLeaveTypeList = async () => {
        try {
            const resp = await apiGetLeaveTypeList()
            //console.log(resp)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const addassignSupervisor = async (values: AssignSupervisorDate) => {
        try {
            const resp = await apiAssignSupervisor(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const requestLeave = async (values: LeaveRequest) => {
        try {
            const resp = await apiRequestLeave(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const approveOrRejectLeave = async (values: ApprovalModel) => {
        try {
            const resp = await apiApproveOrRejectLeave(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const cancelLeave = async (values: CancelModel) => {
        try {
            const resp = await apiCancelLeave(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const getLeaveData = async (values: number, notification?: number) => {
        try {
            console.log(notification)
            const resp = await apiGetLeaveData(values, notification)
            //console.log(resp)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const getLeaveDashboardData = async (values: number) => {
        try {
            const resp = await apiGetLeaveDashboardData(values)
            //console.log(resp)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const addAdvancePayment = async (values: AdvancePayment) => {
        try {
            const resp = await apiAddAdvancePayment(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    return {
        addLeaveType,
        updateLeaveType,
        getLeaveTypeList,
        addassignSupervisor,
        requestLeave,
        approveOrRejectLeave,
        cancelLeave,
        getLeaveData,
        getLeaveDashboardData,
        addAdvancePayment,
    }
}

export default useLeave
