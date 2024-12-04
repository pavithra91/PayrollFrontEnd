import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetLeaveApproveData } from '@/services/LeaveService'

type LeaveRequestData = {
    leaveRequestId: number
    startDate: string
    endDate: string
    isHalfDay: boolean
    halfDayType?: string
    reason: string
    noOfDays: number
    actingDelegate: string
    actingDelegateApprovalStatus: boolean
    actingDelegateApprovedDate: string
}

export type LeaveApproveData = {
    approverStatus: string
    requestStatus: string
    id: number
    epf: number
    data: LeaveRequestData
    status: boolean
    comment?: string
}

type LeaveApproveDataList = LeaveApproveData[]

export type LeaveApproveState = {
    loading: boolean
    dialogOpen: boolean
    leaveApproveDataList: LeaveApproveDataList
}

type GetLeaveApprovalListResponse = LeaveApproveDataList

export const SLICE_NAME = 'leaveApprove'

const initialState: LeaveApproveState = {
    dialogOpen: false,
    loading: false,
    leaveApproveDataList: [],
}

export const getLeaveApproveData = createAsyncThunk(
    SLICE_NAME + '/getLeaveApproveData',
    async (epf: number) => {
        const response =
            await apiGetLeaveApproveData<GetLeaveApprovalListResponse>(epf)
        //console.log(response.data)
        return response.data
    }
)

// export const putLeave = createAsyncThunk(
//     SLICE_NAME + '/putLeave',
//     async (data: PutLeaveTypeRequest) => {
//         const response = await apiLeaveTypeRequest<
//             PutLeaveTypeResponse,
//             PutLeaveTypeRequest
//         >(data)
//         return response.data
//     }
// )

const leaveApproveSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        openDialog: (state) => {
            state.dialogOpen = true
        },
        closeDialog: (state) => {
            state.dialogOpen = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLeaveApproveData.fulfilled, (state, action) => {
                state.leaveApproveDataList = action.payload
                state.loading = false
            })
            .addCase(getLeaveApproveData.pending, (state) => {
                state.loading = true
            })
        // .addCase(putLeave.fulfilled, (state, action) => {
        //     state.leaveTypeList = action.payload
        // })
    },
})

export const { openDialog, closeDialog } = leaveApproveSlice.actions

export default leaveApproveSlice.reducer
