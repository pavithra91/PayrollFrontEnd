import {
    AdvancePayment,
    ApprovalModel,
    AssignSupervisorDate,
    CancelModel,
    LeaveRequest,
    LeaveTypeDate,
} from '@/@types/Leave'
import ApiService from './ApiService'

export async function apiAddLeaveType(data: LeaveTypeDate) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Leave/create-leaveType',
        method: 'post',
        data,
    })
}

export async function apiUpdateLeaveType(data: LeaveTypeDate) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Leave/update-leaveType/' + data.leaveTypeId,
        method: 'put',
        data,
    })
}

export async function apiGetLeaveTypeList<T>() {
    return ApiService.fetchData<T>({
        url: '/Leave/get-all-leaveTypes',
        method: 'get',
    })
}

export async function apiGetAvailableLeaveTypeList<T>(epf: number) {
    return ApiService.fetchData<T>({
        url: '/Leave/get-available-leaveTypes/' + epf,
        method: 'get',
    })
}

export async function apiGetMySupervisorList<T>(epf: number) {
    return ApiService.fetchData<T>({
        url: '/Leave/get-my-supervisors/' + epf,
        method: 'get',
    })
}

export async function apiLeaveRequest<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/project/list/add',
        method: 'put',
        data,
    })
}

export async function apiGetLeaveData<T>(
    params: number,
    notification?: number
) {
    var url = ''

    if (notification != null) {
        url =
            '/Leave/get-leaveRequest/' +
            params +
            '?notification=' +
            notification
    } else {
        url = '/Leave/get-leaveRequest/' + params
    }

    console.log(url)
    return ApiService.fetchData<T>({
        url: url,
        method: 'get',
    })
}

export async function apiGetLeaveApproveData<T>(data: number) {
    return ApiService.fetchData<T>({
        url: '/Leave/get-leaveapprovals/' + data,
        method: 'get',
    })
}

export async function apiGetEmployeeData<T>() {
    return ApiService.fetchData<T>({
        url: '/Leave/get-all-workflow',
        method: 'get',
    })
}

export async function apiGetSupervisorData<T>() {
    return ApiService.fetchData<T>({
        url: '/Leave/get-all-supervisors',
        method: 'get',
    })
}

export async function apiAssignSupervisor(data: AssignSupervisorDate) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Leave/assign-supervisor',
        method: 'post',
        data,
    })
}

export async function apiRequestLeave(data: LeaveRequest) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Leave/request-leave',
        method: 'post',
        data,
    })
}

export async function apiApproveOrRejectLeave(data: ApprovalModel) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Leave/approve-leave',
        method: 'post',
        data,
    })
}

export async function apiCancelLeave(data: CancelModel) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Leave/cancel-leave',
        method: 'post',
        data,
    })
}

export async function apiGetLeaveDashboardData<T>(params: number) {
    return ApiService.fetchData<T>({
        url: '/Leave/get-dashboard/' + params,
        method: 'get',
    })
}

export async function apiAddAdvancePayment(data: AdvancePayment) {
    console.log(data)
    return ApiService.fetchData<Response>({
        url: '/Employee/request-advancePayment',
        method: 'post',
        data,
    })
}
